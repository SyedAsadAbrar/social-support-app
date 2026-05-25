"use client";

import {StepFamilyFinancial} from "../StepFamilyFinancial";
import {StepPersonalInfo} from "../StepPersonalInfo";
import {StepSituationDescriptions} from "../StepSituationDescriptions";

type WizardStepContentProps = {
  currentStep: number;
  errorText: (key: string) => string;
};

export function WizardStepContent({currentStep, errorText}: WizardStepContentProps) {
  if (currentStep === 0) {
    return <StepPersonalInfo errorText={errorText} />;
  }

  if (currentStep === 1) {
    return <StepFamilyFinancial errorText={errorText} />;
  }

  return <StepSituationDescriptions errorText={errorText} />;
}
