"use client";

import {StepFamilyFinancial} from "../StepFamilyFinancial";
import {StepPersonalInfo} from "../StepPersonalInfo";
import {StepSituationDescriptions} from "../StepSituationDescriptions";
import type {Locale} from "@/i18n/config";
import type {ApplicationSubmissionResult} from "../../types";
import {SubmissionResultStep} from "./SubmissionResultStep";

type WizardStepContentProps = {
  locale: Locale;
  currentStep: number;
  showValidation: boolean;
  errorText: (key: string) => string;
  submissionResult: ApplicationSubmissionResult | null;
  onStartNew: () => void;
};

export function WizardStepContent({
  locale,
  currentStep,
  showValidation,
  errorText,
  submissionResult,
  onStartNew
}: WizardStepContentProps) {
  if (currentStep === 0) {
    return (
      <StepPersonalInfo
        locale={locale}
        showValidation={showValidation}
        errorText={errorText}
      />
    );
  }

  if (currentStep === 1) {
    return (
      <StepFamilyFinancial
        showValidation={showValidation}
        errorText={errorText}
      />
    );
  }

  if (currentStep === 2) {
    return (
      <StepSituationDescriptions
        locale={locale}
        showValidation={showValidation}
        errorText={errorText}
      />
    );
  }

  return (
    <SubmissionResultStep
      locale={locale}
      result={submissionResult}
      onStartNew={onStartNew}
    />
  );
}
