"use client";

import {CheckCircle2} from "lucide-react";
import {useTranslations} from "next-intl";
import type {Locale} from "@/i18n/config";
import type {ApplicationSubmissionResult} from "../../types";

type SubmissionFeedbackProps = {
  locale: Locale;
  result: ApplicationSubmissionResult | null;
  error: string | null;
};

export function SubmissionFeedback({locale, result, error}: SubmissionFeedbackProps) {
  const t = useTranslations("form");

  return (
    <>
      {result ? (
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
                  applicationId: result.applicationId,
                  submittedAt: new Intl.DateTimeFormat(locale, {
                    dateStyle: "medium",
                    timeStyle: "short"
                  }).format(new Date(result.submittedAt))
                })}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="rounded-md border border-alert/30 bg-red-50 p-4 text-sm font-medium text-alert"
        >
          {error}
        </div>
      ) : null}
    </>
  );
}
