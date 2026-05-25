"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {ArrowLeft, ArrowRight, CheckCircle2, Languages, LoaderCircle, Send} from "lucide-react";
import Link from "next/link";
import {useTranslations} from "next-intl";
import {useEffect, useMemo, useRef, useState} from "react";
import {FormProvider, type FieldErrors, useForm, useWatch} from "react-hook-form";
import type {Locale} from "@/i18n/config";
import {clearDraft, loadDraft, saveDraft} from "@/lib/storage";
import {defaultApplicationValues} from "../defaults";
import {stepFields, stepTranslationKeys} from "../field-config";
import {applicationSchema} from "../schema";
import type {ApplicationForm} from "../types";
import {ProgressStepper} from "./ProgressStepper";
import {StepFamilyFinancial} from "./StepFamilyFinancial";
import {StepPersonalInfo} from "./StepPersonalInfo";
import {StepSituationDescriptions} from "./StepSituationDescriptions";

type WizardShellProps = {
  locale: Locale;
};

type SubmissionResult = {
  applicationId: string;
  submittedAt: string;
};

function isSubmissionResult(value: unknown): value is SubmissionResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  const result = value as Partial<SubmissionResult>;
  return Boolean(result.applicationId && result.submittedAt);
}

export function WizardShell({locale}: WizardShellProps) {
  const t = useTranslations("form");
  const [currentStep, setCurrentStep] = useState(0);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const hasLoadedDraft = useRef(false);
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

  useEffect(() => {
    if (hasNavigatedSteps.current) {
      stepHeadingRef.current?.focus();
    }
  }, [currentStep]);

  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      reset({...defaultApplicationValues, ...draft});
    }

    hasLoadedDraft.current = true;
  }, [reset]);

  useEffect(() => {
    if (hasLoadedDraft.current) {
      saveDraft(watchedValues);
    }
  }, [watchedValues]);

  const activeFieldNames = stepFields[currentStep];
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

  const currentStepContent =
    currentStep === 0 ? (
      <StepPersonalInfo errorText={errorText} />
    ) : currentStep === 1 ? (
      <StepFamilyFinancial errorText={errorText} />
    ) : (
      <StepSituationDescriptions errorText={errorText} />
    );

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-civic">
              {t("eyebrow")}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
              {t("description")}
            </p>
          </div>
          <Link
            href={`/${locale === "en" ? "ar" : "en"}/apply`}
            className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:bg-slate-50"
          >
            <Languages aria-hidden="true" size={18} />
            {locale === "en" ? "العربية" : "English"}
          </Link>
        </header>

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
            <section aria-labelledby="step-heading" className="grid gap-5">
              <div>
                <p className="text-sm font-semibold text-civic">
                  {t("common.stepCount", {
                    current: currentStep + 1,
                    total: stepLabels.length
                  })}
                </p>
                <h2
                  id="step-heading"
                  ref={stepHeadingRef}
                  tabIndex={-1}
                  className="mt-1 text-2xl font-bold text-ink"
                >
                  {stepLabels[currentStep]}
                </h2>
              </div>

              {activeErrors.length ? (
                <div
                  role="alert"
                  aria-labelledby="error-summary-title"
                  className="rounded-md border border-alert/30 bg-red-50 p-4"
                >
                  <h3 id="error-summary-title" className="font-semibold text-alert">
                    {t("errors.summaryTitle")}
                  </h3>
                  <ul className="mt-2 list-inside list-disc text-sm text-alert">
                    {activeErrors.map((error) => (
                      <li key={error.field}>
                        {t(`fields.${error.field}`)}: {t(`errors.${error.message}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {currentStepContent}
            </section>

            {submissionResult ? (
              <div
                role="status"
                className="rounded-md border border-civic/30 bg-civicSoft p-4 text-sm leading-6 text-ink"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-civic"
                    size={20}
                  />
                  <div>
                    <p className="font-semibold">{t("submit.successTitle")}</p>
                    <p>
                      {t("submit.successDescription", {
                        applicationId: submissionResult.applicationId,
                        submittedAt: new Intl.DateTimeFormat(locale, {
                          dateStyle: "medium",
                          timeStyle: "short"
                        }).format(new Date(submissionResult.submittedAt))
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {submitError ? (
              <div
                role="alert"
                className="rounded-md border border-alert/30 bg-red-50 p-4 text-sm font-medium text-alert"
              >
                {submitError}
              </div>
            ) : null}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={goBack}
                disabled={currentStep === 0}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-ink hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowLeft aria-hidden="true" size={18} />
                {t("common.back")}
              </button>

              {currentStep === stepLabels.length - 1 ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-civic px-5 py-2 text-sm font-semibold text-white hover:bg-civic/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <LoaderCircle aria-hidden="true" className="animate-spin" size={18} />
                  ) : (
                    <Send aria-hidden="true" size={18} />
                  )}
                  {isSubmitting ? t("submit.submitting") : t("common.submit")}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-civic px-5 py-2 text-sm font-semibold text-white hover:bg-civic/90"
                >
                  {t("common.next")}
                  <ArrowRight aria-hidden="true" size={18} />
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </main>
  );
}
