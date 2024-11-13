'use server'

import { User } from "@supabase/auth-js";
import { stripeCustomer, createStripeSubscription, removeOtherSubscriptions } from "./stripe";
import { createClient } from "@/utils/supabase/server";
import { calculateCost, round, timestampString } from "./utils";
import { Duration } from "./classes";
import { encodeBase64UUID } from "./string";
import { Project } from "./projects";

enum Plan {
    FREE,
    USAGE,
    MONTHLY,
    YEARLY
}

namespace Plan {
    export function toPriceId(plan: Plan): string | null {
        switch (plan) {
            case Plan.USAGE:
                return process.env.STRIPE_USAGE_PLAN_PRICE_ID ?? null
            case Plan.MONTHLY:
                return process.env.STRIPE_MONTHLY_PLAN_PRICE_ID ?? null
            case Plan.YEARLY:
                return process.env.STRIPE_YEARLY_PLAN_PRICE_ID ?? null
            case Plan.FREE:
                return null
        }
    }
    export function fromPriceId(priceId: string): Plan {
        switch (priceId) {
            case process.env.STRIPE_USAGE_PLAN_PRICE_ID:
                return Plan.USAGE
            case process.env.STRIPE_MONTHLY_PLAN_PRICE_ID:
                return Plan.MONTHLY
            case process.env.STRIPE_YEARLY_PLAN_PRICE_ID:
                return Plan.YEARLY
            default:
                return Plan.FREE
        }
    }
}

type SubscribeUserResponse = {
    clientSecret: string,
    type: "payment" | "setup",
}

/* Subscribe a user onto SimpleClip! */
export async function subscribeUser(user: User, plan: Plan): Promise<SubscribeUserResponse | null> {
    if (!process.env.STRIPE_SECRET_KEY) { return null }
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

    const customerId = await stripeCustomer(stripe, user)
    if (!customerId) { return null }

    const priceId = Plan.toPriceId(plan)
    if (!priceId) { return null }

    const subscription = await createStripeSubscription(stripe, customerId, priceId)
    if (!subscription) { return null }

    const cleanedUp = await removeOtherSubscriptions(stripe, customerId, subscription.id)
    if (!cleanedUp) { console.log(`Failed to remove old subscriptions for customer ${customerId}`) }

    return {
        clientSecret: subscription.clientSecret,
        type: subscription.type,
    }
}


/* Query the customer id for a user. */
export async function queryCustomerId(userId: string): Promise<string | null> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
        .from('profiles')
        .select('stripe_id')
        .eq('id', userId)
        .single()
    if (error) { return null }

    return data.stripe_id
}

type CurrentPlanResponse = {
    customerId?: string,
    plan: Plan,
}

/* Get userId's current plan from Stripe. */
export async function getCurrentPlan(userId?: string): Promise<CurrentPlanResponse> {
    if (!userId) { return { plan: Plan.FREE } }
    const customerId = await queryCustomerId(userId)
    if (!customerId) { return { plan: Plan.FREE } }

    if (!process.env.STRIPE_SECRET_KEY) { return { plan: Plan.FREE } }
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

    let subscriptions;
    try {
        subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'active',
            limit: 1,
        })
    } catch (error) {
        return {
            plan: Plan.FREE
        }
    }
    const priceId = subscriptions.data?.[0]?.items?.data?.[0]?.price?.id
    return { 
        customerId: customerId,
        plan: Plan.fromPriceId(priceId),
    }
}

type UsageData = {
    totalMinutesTranscribed: number,
    totalCost: number | null,
    topProjects: Project[],
    plan: Plan,
}

export async function queryUsage(userId: string): Promise<UsageData | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('projects')
        .select(`
            id,
            name,
            created_at,
            videos (duration)
        `)
        .eq('user_id', userId)
    if (!data) { return null }

    const { cost, plan } = await upcomingCost(userId)

    const topProjects = data.map((proj) => ({
        encodedId: encodeBase64UUID(proj.id),
        name: proj.name,
        createdAt: timestampString(proj.created_at),
        totalMinutesTranscribed: round(
            Duration.fromDB(
                proj.videos.reduce((acc, video) => {
                    return acc + video.duration
                }, 0)
            ) / 60,
        ),
    }))
    const totalMinutesTranscribed = topProjects?.reduce((acc, proj) => {
        return acc + proj.totalMinutesTranscribed
    }, 0)

    return {
        totalMinutesTranscribed: round(totalMinutesTranscribed),
        totalCost: (plan == Plan.USAGE) ? cost : null,
        topProjects: topProjects,
        plan: plan,
    }
}

type UpcomingCostResponse = {
    cost: number | null,
    plan: Plan,
}

export async function upcomingCost(userId: string): Promise<UpcomingCostResponse> {
    if (!process.env.STRIPE_SECRET_KEY) { 
        return {
            cost: null,
            plan: Plan.FREE
        }
    }
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

    const { customerId, plan } = await getCurrentPlan(userId)
    if (!customerId) { 
        return {
            cost: null,
            plan: Plan.FREE
        }
     }

    let invoice;
    try {
        invoice = await stripe.invoices.retrieveUpcoming({
            customer: customerId
        })
    } catch (error) {
        return {
            cost: null,
            plan: Plan.FREE,
        }
    }
    return {
        cost: invoice.total,
        plan: plan
    }

}