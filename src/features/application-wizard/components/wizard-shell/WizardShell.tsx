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
  const [validatedSteps, setValidatedSteps] = useState<ReadonlySet<number>>(
    () => new Set()
  );
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
    clearErrors,
    getValues,
    handleSubmit,
    reset,
    setError,
    setFocus
  } = methods;
  const watchedValues = useWatch({control});

  const stepLabels = useMemo(
    () => stepTranslationKeys.map((key) => t(`steps.${key}`)),
    [t]
  );
  const submitStep = stepFields.length - 1;
  const resultStep = stepFields.length;
  const isResultStep = currentStep === resultStep;
  const stepHeading = isResultStep ? t("result.title") : stepLabels[currentStep];
  const stepCountLabel = isResultStep
    ? t("result.stepLabel")
    : t("common.stepCount", {
        current: currentStep + 1,
        total: stepLabels.length
      });

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
  const showValidation = validatedSteps.has(currentStep);
  const activeErrors = activeFieldNames
    .map((field) => ({
      field,
      message: errors[field]?.message
    }))
    .filter(
      (item): item is {field: keyof ApplicationForm; message: string} =>
        showValidation && Boolean(item.message)
    );

  function markStepValidated(step: number) {
    setValidatedSteps((steps) => new Set(steps).add(step));
  }

  function clearStepValidation(step: number) {
    setValidatedSteps((steps) => {
      const nextSteps = new Set(steps);
      nextSteps.delete(step);
      return nextSteps;
    });

    if (step < stepFields.length) {
      clearErrors(stepFields[step]);
    }
  }

  function validateCurrentStep() {
    clearErrors(activeFieldNames);

    const validation = applicationSchema.safeParse(getValues());
    if (validation.success) {
      return true;
    }

    const activeFieldSet = new Set<keyof ApplicationForm>(activeFieldNames);
    const fieldErrors = new Map<keyof ApplicationForm, string>();

    validation.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof ApplicationForm | undefined;

      if (field && activeFieldSet.has(field) && !fieldErrors.has(field)) {
        fieldErrors.set(field, issue.message);
      }
    });

    fieldErrors.forEach((message, field) => {
      setError(field, {
        type: "manual",
        message
      });
    });

    const [firstInvalidField] = fieldErrors.keys();
    if (firstInvalidField) {
      setFocus(firstInvalidField);
    }

    return fieldErrors.size === 0;
  }

  function goNext() {
    markStepValidated(currentStep);
    const valid = validateCurrentStep();
    if (valid) {
      const nextStep = Math.min(currentStep + 1, stepLabels.length - 1);
      setSubmitError(null);
      hasNavigatedSteps.current = true;
      clearStepValidation(nextStep);
      setCurrentStep(nextStep);
    }
  }

  function goBack() {
    const previousStep = Math.max(currentStep - 1, 0);
    setSubmitError(null);
    hasNavigatedSteps.current = true;
    clearStepValidation(previousStep);
    setCurrentStep(previousStep);
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
      markStepValidated(firstInvalidStep);
      setCurrentStep(firstInvalidStep);
    }

    setSubmissionResult(null);
    setSubmitError(t("submit.invalid"));
  }

  const errorText = (key: string) => t(`errors.${key}`);

  function startNewApplication() {
    clearDraft();
    reset(defaultApplicationValues);
    setValidatedSteps(new Set());
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
          currentStep={isResultStep ? stepLabels.length : currentStep}
          labels={stepLabels}
          progressLabel={t("common.progress")}
          dir={locale === "ar" ? "rtl" : "ltr"}
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
              heading={stepHeading}
              stepCountLabel={stepCountLabel}
              activeErrors={activeErrors}
            >
              <WizardStepContent
                locale={locale}
                currentStep={currentStep}
                showValidation={showValidation}
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
