"use client";
import React, { useState } from "react";
import { api } from "@/trpc/react";
import { InfoIcon, CreditCard, Coins } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { createCheckoutSession } from "@/lib/stripe";

const BillingPage = () => {
  const { data: user } = api.project.getMyCredits.useQuery();
  const [creditsToBuy, setCreditsToBuy] = useState<number[]>([100]);
  const creditsToBuyAmount = creditsToBuy[0]!;
  const price = (creditsToBuyAmount / 50).toFixed(2);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Billing & Credits</h1>
        <p className="mt-2 text-gray-500">
          Manage your credits and billing information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Credits Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="size-5 text-blue-500" />
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{user?.credits}</span>
              <span className="text-gray-500">credits</span>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <InfoIcon className="size-5" />
              How Credits Work
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-700">
            <p className="mb-2">
              Each credit allows you to index 1 file in a repository.
            </p>
            <p>
              For example, a project with 100 files needs 100 credits for
              complete indexing. You can index all files at once or split the
              process as needed.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Purchase Credits</CardTitle>
          <CardDescription>
            Select the amount of credits you&apos;d like to buy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm font-medium">
                Selected Amount:{" "}
                <span className="text-lg font-bold text-blue-600">
                  {creditsToBuyAmount} credits
                </span>
              </div>
              <div className="text-sm font-medium">
                Price:{" "}
                <span className="text-lg font-bold text-blue-600">
                  ${price}
                </span>
              </div>
            </div>
            <Slider
              defaultValue={[100]}
              max={1000}
              min={10}
              step={10}
              onValueChange={(value) => setCreditsToBuy(value)}
              value={creditsToBuy}
              className="mb-6"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>10 credits</span>
              <span>1000 credits</span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 md:w-auto"
            onClick={async () => {
              await createCheckoutSession(creditsToBuyAmount);
            }}
          >
            <CreditCard className="mr-2 size-4" />
            Purchase {creditsToBuyAmount} Credits
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingPage;
