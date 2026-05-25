"use client";

import {Languages} from "lucide-react";
import Link from "next/link";
import {useTranslations} from "next-intl";
import type {Locale} from "@/i18n/config";

type WizardHeaderProps = {
  locale: Locale;
};

export function WizardHeader({locale}: WizardHeaderProps) {
  const t = useTranslations("form");

  return (
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
  );
}
