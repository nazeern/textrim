'use server'

import { createClient } from "@/utils/supabase/server"
import { User } from "@supabase/auth-js";
import { round } from "./utils";
import { getCurrentPlan, queryCustomerId } from "./profiles";
import { Plan } from "../ui/plan-card";

/* Try to get the existing stripe customer id. Else, create a new Stripe customer.*/
export async function stripeCustomer(stripe: any, user: User): Promise<string | null> {

    // Get saved customer id
    const supabase = await createClient()
    const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('stripe_id, name')
        .eq('id', user.id)
        .single()
    if (fetchError) { return null }

    const { stripe_id: customerId, name } = data
    if (customerId) { return customerId }

    console.log(`Creating new Stripe customer for user ${user.id}`)
    const customer = await stripe.customers.create({ name, email: user.email })

    const { error: saveError } = await supabase
        .from('profiles')
        .update({ stripe_id: customer.id })
        .eq('id', user.id)
    if (saveError) { console.log(`Failed to save customer ${customer.id}`) }

    return customer?.id ?? null
}

type StripeSubscription = {
    id: string,
    type: "payment" | "setup",
    clientSecret: string,
}

/* Subscribe customer id to a given price and return client secret. */
export async function createStripeSubscription(stripe: any, customerId: string, priceId: string): Promise<StripeSubscription | null> {
    console.log(`Creating subscription for customer ${customerId}`)
    try {
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{
                price: priceId,
            }],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent', 'pending_setup_intent'],
        })
        if (subscription.pending_setup_intent !== null) {
            return {
                id: subscription.id,
                type: "setup",
                clientSecret: subscription.pending_setup_intent.client_secret
            }
        } else {
            return {
                id: subscription.id,
                type: "payment",
                clientSecret: subscription.latest_invoice.payment_intent.client_secret
            }
        }
    } catch (error) {
        return null
    }
}


/* Remove old subscriptions. */
export async function removeOtherSubscriptions(stripe: any, keep: string): Promise<boolean> {
    const subscriptions = await stripe.subscriptions.list({
        limit: 3,
    })
    const deleteIds: string[] = subscriptions.data
        .map((obj: any) => obj.id)
        .filter((id: string) => id != keep)
    const promises = deleteIds.map((id) => stripe.subscriptions.cancel(id))
    try { 
        await Promise.all(promises)
        return true
    } catch (error) {
        return false
    }
}


/* Send minutes transcribed to Stripe. Stripe accepts a maximum of 12 decimals. */
export async function stripeMeterEvent(userId: string, value: number): Promise<boolean> {
    if (!process.env.STRIPE_SECRET_KEY) { return false }
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

    const { customerId, plan } = await getCurrentPlan(userId)
    if (!customerId) { 
        console.log(`Failed to meter ${value} for user ${userId}`)
    }
    // Only meter on usage plans
    if (plan == Plan.USAGE) {
        console.log(`Sending meter event of ${value}`)
        const meterEvent = await stripe.v2.billing.meterEvents.create({
        event_name: 'simpleclip_minutes_transcribed',
        payload: {
            stripe_customer_id: customerId,
            value: round(value, 12).toString(),
        },
        });
    }
    return true
  }