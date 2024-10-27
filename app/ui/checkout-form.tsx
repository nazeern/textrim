"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { StripeError } from "@stripe/stripe-js";
import { useState } from "react";
import { subscribeUser } from "../lib/profiles";
import { User } from "@supabase/auth-js";
import { BASE_URL_DEFAULT } from "../constants";
import { Plan } from "@/app/(main)/pricing/page";

export default function CheckoutForm({
  user,
  plan,
}: {
  user: User;
  plan: Plan;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe || loading}>
        Submit Payment
      </button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );

  function handleError(error: StripeError) {
    setLoading(false);
    setErrorMessage(error.message ?? null);
  }

  async function handleSubmit(event: any) {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    if (!elements) {
      return;
    }

    setLoading(true);

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    // Create the subscription
    const result = await subscribeUser(user, plan);
    if (!result) {
      alert("Error subscribing user.");
      return;
    }
    const { clientSecret, type } = result;
    const confirmIntent =
      type === "setup" ? stripe.confirmSetup : stripe.confirmPayment;

    // Confirm the Intent using the details collected by the Payment Element
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? BASE_URL_DEFAULT;
    const { error } = await confirmIntent({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${baseUrl}/projects`,
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when confirming the Intent.
      // Show the error to your customer (for example, "payment details incomplete").
      handleError(error);
    } else {
      // Your customer is redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer is redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  }
}
