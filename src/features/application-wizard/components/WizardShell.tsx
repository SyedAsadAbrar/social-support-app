"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {ArrowLeft, ArrowRight, Languages} from "lucide-react";
import Link from "next/link";
import {useTranslations} from "next-intl";
import {useEffect, useMemo, useRef, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import type {Locale} from "@/i18n/config";
import {defaultApplicationValues} from "../defaults";
import {stepFields, stepTranslationKeys} from "../field-config";
import {applicationSchema} from "../schema";
import type {ApplicationForm} from "../types";
import {ProgressStepper} from "./ProgressStepper";

type WizardShellProps = {
  locale: Locale;
};

export function WizardShell({locale}: WizardShellProps) {
  const t = useTranslations("form");
  const [currentStep, setCurrentStep] = useState(0);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  const methods = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: defaultApplicationValues,
    mode: "onTouched"
  });

  const {
    formState: {errors},
    trigger
  } = methods;

  const stepLabels = useMemo(
    () => stepTranslationKeys.map((key) => t(`steps.${key}`)),
    [t]
  );

  useEffect(() => {
    stepHeadingRef.current?.focus();
  }, [currentStep]);

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
      setCurrentStep((step) => Math.min(step + 1, stepLabels.length - 1));
    }
  }

  function goBack() {
    setCurrentStep((step) => Math.max(step - 1, 0));
  }

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

        <ProgressStepper currentStep={currentStep} labels={stepLabels} />

        <FormProvider {...methods}>
          <form
            noValidate
            className="grid gap-6 rounded-lg border border-slate-200 bg-white p-4 shadow-panel sm:p-6 lg:p-8"
          >
            <section aria-labelledby="step-heading" className="grid gap-5">
              <div>
                <p className="text-sm font-semibold text-action">
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

              <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-700">
                  {t("phase2.placeholderTitle")}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {t("phase2.placeholderDescription")}
                </p>
              </div>
            </section>

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

              <button
                type="button"
                onClick={goNext}
                disabled={currentStep === stepLabels.length - 1}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-action px-5 py-2 text-sm font-semibold text-white hover:bg-action/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("common.next")}
                <ArrowRight aria-hidden="true" size={18} />
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </main>
  );
}
