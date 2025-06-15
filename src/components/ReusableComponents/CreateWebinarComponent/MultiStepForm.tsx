import React from "react";

type Step = {
  id: string;
  title: string;
  description: string;
  compoent: React.ReactNode;
};

type Props = {
  steps: Step[];
  onComplete: (id: string) => void;
};

const MultiStepForm = (props: Props) => {
  return <div>MultiStepForm</div>;
};

export default MultiStepForm;
