"use client";

import { CheckCircle } from "lucide-react";
import { onBoardingSteps } from "@/lib/data";
import Link from "next/link";
import React from "react";

const OnBoarding = () => {
  return (
    <div className="flex flex-col gap-1 items-start justify-start">
      {onBoardingSteps.map((step, index) => (
        <Link href={step.link} key={index} className="flex items-center gap-2">
          <CheckCircle />
          <p className="text-base text-foreground">{step.title}</p>
        </Link>
      ))}
    </div>
  );
};

export default OnBoarding;
