import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: clientSecret } = await axios.post("http://localhost:5001/api/payment/create-payment-intent", {
      amount: 1000, // məsələn: 10 AZN = 1000 qəpik
    });

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      alert("Ödəniş xətası: " + result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        alert("Ödəniş uğurla tamamlandı!");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>Ödə</button>
    </form>
  );
};

export default CheckoutForm;
