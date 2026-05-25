"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useTranslations} from "next-intl";
import {useEffect, useMemo, useRef, useState} from "react";
import {
  FormProvider,
  type FieldErrors,
  type Resolver,
  type UseFormReturn,
  useForm,
  useWatch
} from "react-hook-form";
import type {Locale} from "@/i18n/config";
import {clearDraft, loadDraft, saveDraft} from "@/lib/storage";
import {defaultApplicationValues} from "../../defaults";
import {
  familyFinancialFields,
  personalFields,
  situationFields,
  stepFields,
  stepTranslationKeys
} from "../../field-config";
import {
  applicationSchema,
  familyFinancialSchema,
  personalInfoSchema,
  situationDescriptionsSchema
} from "../../schema";
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

type ApplicationField = keyof ApplicationForm;
type WizardForm = UseFormReturn<ApplicationForm>;

function isSubmissionResult(value: unknown): value is ApplicationSubmissionResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  const result = value as Partial<ApplicationSubmissionResult>;
  return Boolean(result.applicationId && result.submittedAt);
}

function resolverFor(schema: Parameters<typeof zodResolver>[0]) {
  return zodResolver(schema) as Resolver<ApplicationForm>;
}

function valuesFromFields(
  fields: readonly ApplicationField[],
  values: readonly unknown[]
) {
  return fields.reduce<Partial<ApplicationForm>>((selectedValues, field, index) => {
    selectedValues[field] = values[index] as never;
    return selectedValues;
  }, {});
}

function mergeFields(
  currentValues: ApplicationForm,
  submittedValues: ApplicationForm,
  fields: readonly ApplicationField[]
) {
  const nextValues = {...currentValues};

  fields.forEach((field) => {
    nextValues[field] = submittedValues[field] as never;
  });

  return nextValues;
}

function visibleStepErrors(
  fields: readonly ApplicationField[],
  errors: FieldErrors<ApplicationForm>
) {
  return fields
    .map((field) => ({
      field,
      message: errors[field]?.message
    }))
    .filter(
      (item): item is {field: ApplicationField; message: string} =>
        typeof item.message === "string"
    );
}

export function WizardShell({locale}: WizardShellProps) {
  const t = useTranslations("form");
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState<ApplicationForm>(
    defaultApplicationValues
  );
  const [submissionResult, setSubmissionResult] =
    useState<ApplicationSubmissionResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [draftReady, setDraftReady] = useState(false);
  const hasNavigatedSteps = useRef(false);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  const personalForm = useForm<ApplicationForm>({
    resolver: resolverFor(personalInfoSchema),
    defaultValues: formValues,
    mode: "onSubmit",
    reValidateMode: "onSubmit"
  });

  const familyFinancialForm = useForm<ApplicationForm>({
    resolver: resolverFor(familyFinancialSchema),
    defaultValues: formValues,
    mode: "onSubmit",
    reValidateMode: "onSubmit"
  });

  const situationForm = useForm<ApplicationForm>({
    resolver: resolverFor(situationDescriptionsSchema),
    defaultValues: formValues,
    mode: "onSubmit",
    reValidateMode: "onSubmit"
  });

  const personalWatchedValues = useWatch({
    control: personalForm.control,
    name: personalFields
  });
  const familyFinancialWatchedValues = useWatch({
    control: familyFinancialForm.control,
    name: familyFinancialFields
  });
  const situationWatchedValues = useWatch({
    control: situationForm.control,
    name: situationFields
  });

  const stepForms = useMemo(
    () => [personalForm, familyFinancialForm, situationForm] as const,
    [familyFinancialForm, personalForm, situationForm]
  );
  const activeFormIndex = Math.min(currentStep, stepForms.length - 1);
  const activeForm: WizardForm = stepForms[activeFormIndex];
  const activeFieldNames =
    currentStep < stepFields.length ? stepFields[currentStep] : [];

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

  const watchedDraftValues = useMemo(
    () => ({
      ...formValues,
      ...valuesFromFields(personalFields, personalWatchedValues),
      ...valuesFromFields(familyFinancialFields, familyFinancialWatchedValues),
      ...valuesFromFields(situationFields, situationWatchedValues)
    }),
    [
      familyFinancialWatchedValues,
      formValues,
      personalWatchedValues,
      situationWatchedValues
    ]
  );
  const activeErrors = visibleStepErrors(activeFieldNames, activeForm.formState.errors);
  const aiDraftContext = {
    maritalStatus: formValues.maritalStatus,
    dependents: formValues.dependents,
    employmentStatus: formValues.employmentStatus,
    monthlyIncome: formValues.monthlyIncome,
    housingStatus: formValues.housingStatus
  };

  useEffect(() => {
    if (hasNavigatedSteps.current) {
      stepHeadingRef.current?.focus();
    }
  }, [currentStep]);

  useEffect(() => {
    const draft = loadDraft();
    const restoredValues = {
      ...defaultApplicationValues,
      ...draft?.values
    };
    const restoredStep =
      draft?.currentStep === null || draft?.currentStep === undefined
        ? 0
        : Math.max(0, Math.min(draft.currentStep, submitStep));

    personalForm.reset(restoredValues);
    familyFinancialForm.reset(restoredValues);
    situationForm.reset(restoredValues);

    queueMicrotask(() => {
      setFormValues(restoredValues);
      setCurrentStep(restoredStep);
      setDraftReady(true);
    });
  }, [familyFinancialForm, personalForm, situationForm, submitStep]);

  useEffect(() => {
    if (draftReady && !submissionResult && currentStep <= submitStep) {
      saveDraft(watchedDraftValues, currentStep);
    }
  }, [currentStep, draftReady, submissionResult, submitStep, watchedDraftValues]);

  function moveToStep(nextStep: number) {
    setSubmitError(null);
    hasNavigatedSteps.current = true;
    setCurrentStep(nextStep);
  }

  function saveStepValues(stepValues: ApplicationForm) {
    const nextValues = mergeFields(formValues, stepValues, activeFieldNames);
    setFormValues(nextValues);
    return nextValues;
  }

  function goNext() {
    void activeForm.handleSubmit((stepValues) => {
      saveStepValues(stepValues);
      moveToStep(Math.min(currentStep + 1, submitStep));
    })();
  }

  function goBack() {
    moveToStep(Math.max(currentStep - 1, 0));
  }

  function applyFullValidationErrors(issues: {path: (string | number)[]; message: string}[]) {
    const firstInvalidStep = stepFields.findIndex((fields) =>
      fields.some((field) => issues.some((issue) => issue.path[0] === field))
    );

    if (firstInvalidStep < 0) {
      return;
    }

    const targetForm = stepForms[firstInvalidStep];
    const targetFields = new Set<ApplicationField>(stepFields[firstInvalidStep]);

    issues.forEach((issue) => {
      const field = issue.path[0] as ApplicationField | undefined;

      if (field && targetFields.has(field)) {
        targetForm.setError(field, {
          type: "manual",
          message: issue.message
        });
      }
    });

    moveToStep(firstInvalidStep);
  }

  async function submitApplication(values: ApplicationForm) {
    setSubmitError(null);
    setSubmissionResult(null);

    const validation = applicationSchema.safeParse(values);
    if (!validation.success) {
      applyFullValidationErrors(validation.error.issues);
      setSubmitError(t("submit.invalid"));
      return;
    }

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(validation.data)
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

  function submitSituationStep(stepValues: ApplicationForm) {
    const nextValues = saveStepValues(stepValues);
    void submitApplication(nextValues);
  }

  const errorText = (key: string) => t(`errors.${key}`);

  function startNewApplication() {
    clearDraft();
    setFormValues(defaultApplicationValues);
    personalForm.reset(defaultApplicationValues);
    familyFinancialForm.reset(defaultApplicationValues);
    situationForm.reset(defaultApplicationValues);
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

        <FormProvider {...activeForm}>
          <form
            noValidate
            onSubmit={(event) => {
              if (currentStep === submitStep) {
                hasNavigatedSteps.current = true;
                void situationForm.handleSubmit(submitSituationStep)(event);
                return;
              }

              event.preventDefault();
              goNext();
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
                draftContext={aiDraftContext}
                errorText={errorText}
                submissionResult={submissionResult}
                onStartNew={startNewApplication}
              />
            </WizardStepSection>

            <SubmissionFeedback error={submitError} />

            <WizardNavigation
              locale={locale}
              currentStep={currentStep}
              submitStep={submitStep}
              resultStep={resultStep}
              isSubmitting={activeForm.formState.isSubmitting}
              onBack={goBack}
              onNext={goNext}
            />
          </form>
        </FormProvider>
      </div>
    </main>
  );
}
