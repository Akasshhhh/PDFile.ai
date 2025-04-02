"use client";
import React from "react";
import { Button } from "./ui/button";
import axios from "axios";

type Props = { 
  isPro: boolean;
  className?: string;
};

const SubscriptionButton = ({ isPro, className }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const handleSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button 
      disabled={loading} 
      onClick={handleSubscription}
      className={className}
    >
      {isPro ? "Manage Subscriptions" : "Get Pro"}
    </Button>
  );
};

export default SubscriptionButton;