import { useWebinarStore } from "@/store/useWebinarStore";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, ChevronRight, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createWebinar } from "@/actions/webinar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Step = {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
};

type Props = {
  steps: Step[];
  onComplete: (id: string) => void;
};

const MultiStepForm = ({ steps, onComplete }: Props) => {
  const { formData, validateStep, isSubmitting, setSubmitting, setModalOpen } =
    useWebinarStore();

  const router = useRouter();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleBack = () => {
    if (isFirstStep) {
      setModalOpen(false);
    } else {
      setCurrentStepIndex(currentStepIndex - 1);
      setValidationError(null);
    }
  };

  const handleNext = async () => {
    setValidationError(null);
    const isValid = validateStep(currentStep.id as keyof typeof formData);
    if (!isValid) {
      setValidationError("Please Fill All Required Fields");
      return;
    }
    if (!completedSteps.includes(currentStep.id)) {
      setCompletedSteps([...completedSteps, currentStep.id]);
    }
    if (isLastStep) {
      try {
        setSubmitting(true);
        const result = await createWebinar(formData);
        if (result.status === 200 && result.webinarId) {
          toast.success("Your Webinar Has Been Created Successfully");
          onComplete(result.webinarId);
        } else {
          toast.error(
            result.message || "Your Webinar has not been Created Successfully"
          );
          setValidationError(result.message);
        }
        router.refresh();
      } catch (error) {
        console.error("Error Creating Webinar: ", error);
        toast.error("Failed To Create Webinar. Please Try Again.");
        setValidationError("Failed to Create Webinar. Please try again");
      } finally {
        setSubmitting(false);
      }
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-[#27272A]/20 border border-border rounded-3xl overflow-hidden max-w-6xl mx-auto backdrop-blur-[106px]">
      <div className="flex items-center justify-start w-full">
        <div className="w-full md:w-1/3 p-6">
          <div className="space-y-8">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = index === currentStepIndex;
              const isPast = index < currentStepIndex;
              return (
                <div className="relative" key={index}>
                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-4 top-8 w-0.5 h-24 bg-gray-700 overflow-hidden">
                      <motion.div
                        initial={{
                          height: isPast || isCompleted ? "100%" : "0%",
                        }}
                        animate={{
                          height: isPast || isCompleted ? "100%" : "0%",
                          backgroundColor: "rgb(147,51,234)",
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="w-full h-full"
                      />
                    </div>
                  )}

                  {/* Step Content */}
                  <div className="flex items-start gap-4">
                    {/* Step Circle */}
                    <div className="relative flex-shrink-0">
                      <motion.div
                        className="flex items-center justify-center w-8 h-8 rounded-full z-10"
                        initial={false}
                        animate={{
                          backgroundColor:
                            isCurrent || isCompleted
                              ? "rgb(147,51,234)"
                              : "rgb(31,41,55)",
                          scale: [isCurrent && !isCompleted ? 0.8 : 1, 1],
                          transition: { duration: 0.3 },
                        }}
                      >
                        <AnimatePresence mode="wait">
                          {isCompleted ? (
                            <motion.div
                              key="check"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Check className="w-5 h-5 text-white" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="number"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={{ duration: 0.2 }}
                              className="text-white"
                            >
                              <Check className="w-5 h-5 text-white/50" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>

                    {/* Step Info */}
                    <div className="flex-1 min-w-0">
                      <motion.h3
                        animate={{
                          color:
                            isCurrent || isCompleted
                              ? "rgb(255,255,255)"
                              : "rgb(156,163,175)",
                        }}
                        transition={{ duration: 0.3 }}
                        className="font-medium text-base"
                      >
                        {step.title}
                      </motion.h3>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-[500px]"
        />

        <div className="w-full md:w-2/3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold">{currentStep.title}</h2>
                <p className="text-gray-400">{currentStep.description}</p>
              </div>
              {currentStep.component}

              {validationError && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-md flex items-start gap-2 text-red-300">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p>{validationError}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full p-6 flex justify-between">
        <Button
          variant={"outline"}
          onClick={handleBack}
          disabled={isSubmitting}
          className={cn(
            "border-gray-700 text-white hover:bg-gray-800",
            isFirstStep && "opacity-50 cursor-not-allowed"
          )}
        >
          {isFirstStep ? "Cancel" : "Back"}
        </Button>
        <Button onClick={handleNext} disabled={isSubmitting}>
          {isLastStep ? (
            isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Creating...
              </>
            ) : (
              "Complete"
            )
          ) : (
            "Next"
          )}
          {!isLastStep && <ChevronRight className="ml-1 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default MultiStepForm;
