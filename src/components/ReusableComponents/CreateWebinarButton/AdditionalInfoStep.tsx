"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useWebinarStore } from "@/store/useWebinarStore";
import { get } from "http";
import { Info } from "lucide-react";
import React from "react";

type Props = {};

const AdditionalInfoStep = (props: Props) => {
  const { formData, updateAdditionalInfoField, getStepValidationErrors } =
    useWebinarStore();
  const { lockChat, couponCode, couponEnabled } = formData.additionalInfo;
  const errors = getStepValidationErrors("additionalInfo");

  const handleToggleLockChat = (checked: boolean) => {
    updateAdditionalInfoField("lockChat", checked);
  };

  const handleToggleCoupon = (checked: boolean) => {
    updateAdditionalInfoField("couponEnabled", checked);
  };

  const handleCouponCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    updateAdditionalInfoField("couponCode", value);
  };

  return (
    <div className="space-y-8">
      {/* Lock Chat Section */}
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="lock-chat" className="text-sm font-medium">
            Lock Chat
          </Label>
          <p className="text-sm text-gray-400">
            Turn It On To Make Chat Visible To Everyone
          </p>
        </div>
        <Switch
          id="lock-chat"
          checked={lockChat || false}
          onCheckedChange={handleToggleLockChat}
        />
      </div>

      {/* Coupon Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="coupon-enabled" className="text-sm font-medium">
              Coupon Code
            </Label>
            <p className="text-sm text-gray-400">
              Enter a coupon code to apply discounts
            </p>
          </div>
          <Switch
            id="coupon-enabled"
            checked={couponEnabled || false}
            onCheckedChange={handleToggleCoupon}
          />
        </div>

        {couponEnabled && (
          <div className="space-y-2">
            <Input
              id="coupon-code"
              value={couponCode || ""}
              onChange={handleCouponCodeChange}
              placeholder="Enter coupon code"
              className={cn(
                "!bg-background/50 border border-input",
                errors.couponCode && "border-red-400 focus-visible:ring-red-400"
              )}
            />
            {errors.couponCode && (
              <p className="text-sm text-red-400">{errors.couponCode}</p>
            )}
            <div className="flex items-start gap-2 text-sm text-gray-400 mt-2">
              <Info className="h-4 w-4 mt-0.5" />
              <p>
                This Coupon Code Can Be Used To Promote Sales. Users Can Use It
                For Buy Now CTA
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdditionalInfoStep;
