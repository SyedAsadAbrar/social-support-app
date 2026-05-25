"use client";

import {forwardRef, type ReactNode} from "react";
import {useTranslations} from "next-intl";
import type {ApplicationForm} from "../../types";

type StepError = {
  field: keyof ApplicationForm;
  message: string;
};

type WizardStepSectionProps = {
  heading: string;
  stepCountLabel?: string;
  activeErrors: StepError[];
  children: ReactNode;
};

export const WizardStepSection = forwardRef<HTMLHeadingElement, WizardStepSectionProps>(
  function WizardStepSection(
    {heading, stepCountLabel, activeErrors, children},
    ref
  ) {
    const t = useTranslations("form");

    return (
      <section aria-labelledby="step-heading" className="grid gap-5">
        <div>
          {stepCountLabel ? (
            <p className="text-sm font-semibold text-civic">{stepCountLabel}</p>
          ) : null}
          <h2
            id="step-heading"
            ref={ref}
            tabIndex={-1}
            className="mt-1 text-2xl font-bold text-ink"
          >
            {heading}
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

        {children}
      </section>
    );
  }
);
