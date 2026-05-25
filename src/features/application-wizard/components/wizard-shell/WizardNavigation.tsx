"use client";

import {ArrowLeft, ArrowRight, LoaderCircle, Send} from "lucide-react";
import {useTranslations} from "next-intl";
import type {Locale} from "@/i18n/config";

type WizardNavigationProps = {
  locale: Locale;
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
};

export function WizardNavigation({
  locale,
  currentStep,
  totalSteps,
  isSubmitting,
  onBack,
  onNext
}: WizardNavigationProps) {
  const t = useTranslations("form");
  const isLastStep = currentStep === totalSteps - 1;
  const BackIcon = locale === "ar" ? ArrowRight : ArrowLeft;
  const NextIcon = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onBack}
        disabled={currentStep === 0}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-ink hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <BackIcon aria-hidden="true" size={18} />
        {t("common.back")}
      </button>

      {isLastStep ? (
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
          onClick={onNext}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-civic px-5 py-2 text-sm font-semibold text-white hover:bg-civic/90"
        >
          {t("common.next")}
          <NextIcon aria-hidden="true" size={18} />
        </button>
      )}
    </div>
  );
}
