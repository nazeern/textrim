'use server'

import { User } from "@supabase/auth-js";
import { stripeCustomer, createStripeSubscription, removeOtherSubscriptions } from "./stripe";
import { createClient } from "@/utils/supabase/server";

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

    const cleanedUp = await removeOtherSubscriptions(stripe, subscription.id)
    if (!cleanedUp) { console.log(`Failed to remove old subscriptions for customer ${customerId}`) }

    return {
        clientSecret: subscription.clientSecret,
        type: subscription.type,
    }
}


/* Query the customer id for a user. */
export async function queryCustomerId(userId: string): Promise<string | null> {
    const supabase = createClient()
    
    const { data, error } = await supabase
        .from('profiles')
        .select('stripe_id')
        .eq('id', userId)
        .single()
    if (error) { return null }

    return data.stripe_id
}


/* Get userId's current plan from Stripe. */
export async function getCurrentPlan(userId: string): Promise<Plan> {
    const customerId = await queryCustomerId(userId)
    if (!customerId) { return Plan.FREE }

    if (!process.env.STRIPE_SECRET_KEY) { return Plan.FREE }
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

    const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 1,
    })
    const priceId = subscriptions.data?.[0]?.items?.data?.[0]?.price?.id
    return Plan.fromPriceId(priceId)
}