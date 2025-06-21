"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWebinarStore } from "@/store/useWebinarStore";
import { PlusIcon } from "lucide-react";

import React, { useState } from "react";
import MultiStepForm from "./MultiStepForm";
import BasicInfoStep from "./BasicInfoStep";

type Props = {};

const CreateWebinarButton = (props: Props) => {
  const { isModalOpen, setModalOpen, isComplete, setComplete } =
    useWebinarStore();

  const [webinarLink, setWebinarLink] = useState("");

  const steps = [
    {
      id: "basicInfo",
      title: "Basic Information",
      description:
        "Please Fill Out The Basic Information Needed For Your Webinar",
      component: <BasicInfoStep />,
    },
  ];

  const handleComplete = (webinarId: string) => {
    setComplete(true);
    setWebinarLink(
      `${process.env.NEXT_PUBLIC_BASE_URL}/live-webinar/${webinarId}`
    );
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <button
          className="rounded-xl flex gap-2 items-center hover:cursor-pointer px-4 py-2 border border-border bg-primary/10 backdrop-blur-sm font-normal text-primary hover:bg-primary-20"
          onClick={() => setModalOpen(true)}
        >
          <PlusIcon /> Create Webinar
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] p-0 bg-transparent border-none">
        {isComplete ? (
          <div className="bg-muted text-primary rounded-lg overflow-hidden">
            <DialogTitle className="sr-only">Webinar Created</DialogTitle>
            {/* SuccessStep */}
          </div>
        ) : (
          <>
            <DialogTitle className="sr-only">Create Webinar</DialogTitle>
            <MultiStepForm steps={steps} onComplete={handleComplete} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateWebinarButton;
