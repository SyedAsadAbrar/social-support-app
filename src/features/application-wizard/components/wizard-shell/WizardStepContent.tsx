"use client";

import {StepFamilyFinancial} from "../StepFamilyFinancial";
import {StepPersonalInfo} from "../StepPersonalInfo";
import {StepSituationDescriptions} from "../StepSituationDescriptions";
import type {Locale} from "@/i18n/config";

type WizardStepContentProps = {
  locale: Locale;
  currentStep: number;
  errorText: (key: string) => string;
};

export function WizardStepContent({locale, currentStep, errorText}: WizardStepContentProps) {
  if (currentStep === 0) {
    return <StepPersonalInfo errorText={errorText} />;
  }

  if (currentStep === 1) {
    return <StepFamilyFinancial errorText={errorText} />;
  }

  return <StepSituationDescriptions locale={locale} errorText={errorText} />;
}
