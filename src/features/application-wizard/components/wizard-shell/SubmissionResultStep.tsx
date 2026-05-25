"use client";

import {CheckCircle2, RotateCcw} from "lucide-react";
import {useTranslations} from "next-intl";
import type {Locale} from "@/i18n/config";
import type {ApplicationSubmissionResult} from "../../types";

type SubmissionResultStepProps = {
  locale: Locale;
  result: ApplicationSubmissionResult | null;
  onStartNew: () => void;
};

export function SubmissionResultStep({
  locale,
  result,
  onStartNew
}: SubmissionResultStepProps) {
  const t = useTranslations("form");

  if (!result) {
    return (
      <div
        role="status"
        className="rounded-md border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-ink"
      >
        {t("submit.failure")}
      </div>
    );
  }

  const submittedAt = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(result.submittedAt));

  return (
    <div
      role="status"
      className="grid gap-6 rounded-md border border-civic/30 bg-civicSoft p-5 text-ink sm:p-6"
    >
      <div className="flex items-start gap-4">
        <CheckCircle2
          aria-hidden="true"
          className="mt-1 shrink-0 text-civic"
          size={28}
        />
        <div>
          <h3 className="text-xl font-bold text-ink">{t("submit.successTitle")}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">
            {t("submit.resultDescription")}
          </p>
        </div>
      </div>

      <dl className="grid gap-4 rounded-md border border-civic/20 bg-white p-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-semibold text-slate-600">
            {t("submit.referenceLabel")}
          </dt>
          <dd className="mt-1 font-mono text-lg font-bold text-ink">
            {result.applicationId}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-slate-600">
            {t("submit.submittedAtLabel")}
          </dt>
          <dd className="mt-1 text-lg font-bold text-ink">{submittedAt}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={onStartNew}
        className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-md bg-civic px-5 py-2 text-sm font-semibold text-white hover:bg-civic/90"
      >
        <RotateCcw aria-hidden="true" size={18} />
        {t("submit.startNew")}
      </button>
    </div>
  );
}
