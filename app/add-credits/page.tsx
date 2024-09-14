"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function AddCredits() {
  const [amount, setAmount] = useState(10);
  const router = useRouter();

  const handleAddCredits = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const session = await response.json();
      window.location.href = session.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Add Credits</h1>
      <div className="max-w-md">
        <p className="mb-4">Each credit costs $0.50 and allows you to generate one email. </p>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min={1}
          step={0.5}
          className="mb-4"
        />
        <p className="mb-4">Total cost: ${(amount * 0.5).toFixed(2)}</p>
        <Button onClick={handleAddCredits}>Add Credits</Button>
      </div>
    </div>
  );
}