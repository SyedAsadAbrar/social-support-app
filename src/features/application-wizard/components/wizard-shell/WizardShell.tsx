"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useTranslations} from "next-intl";
import {useEffect, useMemo, useRef, useState} from "react";
import {FormProvider, type FieldErrors, useForm, useWatch} from "react-hook-form";
import type {Locale} from "@/i18n/config";
import {clearDraft, loadDraft, saveDraft} from "@/lib/storage";
import {defaultApplicationValues} from "../../defaults";
import {stepFields, stepTranslationKeys} from "../../field-config";
import {applicationSchema} from "../../schema";
import type {ApplicationForm, ApplicationSubmissionResult} from "../../types";
import {ProgressStepper} from "../ProgressStepper";
import {SubmissionFeedback} from "./SubmissionFeedback";
import {WizardHeader} from "./WizardHeader";
import {WizardNavigation} from "./WizardNavigation";
import {WizardStepContent} from "./WizardStepContent";
import {WizardStepSection} from "./WizardStepSection";

type WizardShellProps = {
  locale: Locale;
};

function isSubmissionResult(value: unknown): value is ApplicationSubmissionResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  const result = value as Partial<ApplicationSubmissionResult>;
  return Boolean(result.applicationId && result.submittedAt);
}

export function WizardShell({locale}: WizardShellProps) {
  const t = useTranslations("form");
  const [currentStep, setCurrentStep] = useState(0);
  const [submissionResult, setSubmissionResult] =
    useState<ApplicationSubmissionResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [draftReady, setDraftReady] = useState(false);
  const hasNavigatedSteps = useRef(false);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  const methods = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: defaultApplicationValues,
    mode: "onTouched"
  });

  const {
    control,
    formState: {errors, isSubmitting},
    handleSubmit,
    reset,
    trigger
  } = methods;
  const watchedValues = useWatch({control});

  const stepLabels = useMemo(
    () => stepTranslationKeys.map((key) => t(`steps.${key}`)),
    [t]
  );
  const submitStep = stepFields.length - 1;
  const resultStep = stepLabels.length - 1;

  useEffect(() => {
    if (hasNavigatedSteps.current) {
      stepHeadingRef.current?.focus();
    }
  }, [currentStep]);

  useEffect(() => {
    const draft = loadDraft();
    let restoredStep = 0;

    if (draft) {
      reset({...defaultApplicationValues, ...draft.values});

      if (draft.currentStep !== null) {
        restoredStep = Math.max(0, Math.min(draft.currentStep, submitStep));
      }
    }

    queueMicrotask(() => {
      setCurrentStep(restoredStep);
      setDraftReady(true);
    });
  }, [reset, submitStep]);

  useEffect(() => {
    if (draftReady && !submissionResult && currentStep <= submitStep) {
      saveDraft(watchedValues, currentStep);
    }
  }, [currentStep, draftReady, submissionResult, submitStep, watchedValues]);

  const activeFieldNames = currentStep < stepFields.length ? stepFields[currentStep] : [];
  const activeErrors = activeFieldNames
    .map((field) => ({
      field,
      message: errors[field]?.message
    }))
    .filter((item): item is {field: keyof ApplicationForm; message: string} =>
      Boolean(item.message)
    );

  async function goNext() {
    const valid = await trigger(activeFieldNames, {shouldFocus: true});
    if (valid) {
      setSubmitError(null);
      hasNavigatedSteps.current = true;
      setCurrentStep((step) => Math.min(step + 1, stepLabels.length - 1));
    }
  }

  function goBack() {
    setSubmitError(null);
    hasNavigatedSteps.current = true;
    setCurrentStep((step) => Math.max(step - 1, 0));
  }

  async function submitApplication(values: ApplicationForm) {
    setSubmitError(null);
    setSubmissionResult(null);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });
      const payload = (await response.json()) as unknown;

      if (!response.ok || !isSubmissionResult(payload)) {
        throw new Error("Submission failed");
      }

      clearDraft();
      setSubmissionResult(payload);
      hasNavigatedSteps.current = true;
      setCurrentStep(resultStep);
    } catch {
      setSubmitError(t("submit.failure"));
    }
  }

  function handleInvalidSubmit(submitErrors: FieldErrors<ApplicationForm>) {
    const firstInvalidStep = stepFields.findIndex((fields) =>
      fields.some((field) => Boolean(submitErrors[field]))
    );

    if (firstInvalidStep >= 0) {
      setCurrentStep(firstInvalidStep);
    }

    setSubmissionResult(null);
    setSubmitError(t("submit.invalid"));
  }

  const errorText = (key: string) => t(`errors.${key}`);

  function startNewApplication() {
    clearDraft();
    reset(defaultApplicationValues);
    setSubmissionResult(null);
    setSubmitError(null);
    hasNavigatedSteps.current = true;
    setCurrentStep(0);
  }

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6">
        <WizardHeader locale={locale} />

        <ProgressStepper
          currentStep={currentStep}
          labels={stepLabels}
          progressLabel={t("common.progress")}
        />

        <FormProvider {...methods}>
          <form
            noValidate
            onSubmit={(event) => {
              hasNavigatedSteps.current = true;
              void handleSubmit(submitApplication, handleInvalidSubmit)(event);
            }}
            className="grid gap-6 rounded-lg border border-slate-200 bg-white p-4 shadow-panel sm:p-6 lg:p-8"
          >
            <WizardStepSection
              ref={stepHeadingRef}
              currentStep={currentStep}
              stepLabels={stepLabels}
              activeErrors={activeErrors}
            >
              <WizardStepContent
                locale={locale}
                currentStep={currentStep}
                errorText={errorText}
                submissionResult={submissionResult}
                onStartNew={startNewApplication}
              />
            </WizardStepSection>

            <SubmissionFeedback
              error={submitError}
            />

            <WizardNavigation
              locale={locale}
              currentStep={currentStep}
              submitStep={submitStep}
              resultStep={resultStep}
              isSubmitting={isSubmitting}
              onBack={goBack}
              onNext={goNext}
            />
          </form>
        </FormProvider>
      </div>
    </main>
  );
}
