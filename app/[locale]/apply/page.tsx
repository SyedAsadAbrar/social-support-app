import Link from "next/link";
import {useTranslations} from "next-intl";
import {setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/config";

type ApplyPageProps = {
  params: {
    locale: Locale;
  };
};

export default function ApplyPage({params}: ApplyPageProps) {
  setRequestLocale(params.locale);

  const t = useTranslations("foundation");
  const otherLocale = params.locale === "en" ? "ar" : "en";

  return (
    <main className="mx-auto grid min-h-screen max-w-5xl content-center gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="border-b border-slate-200 pb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-civic">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold text-ink sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">
          {t("description")}
        </p>
      </header>

      <section
        aria-labelledby="phase-heading"
        className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel sm:p-6"
      >
        <h2 id="phase-heading" className="text-xl font-bold text-ink">
          {t("phaseTitle")}
        </h2>
        <p className="mt-3 text-slate-700">{t("phaseDescription")}</p>
      </section>

      <nav aria-label={t("languageNav")}>
        <Link
          href={`/${otherLocale}/apply`}
          className="inline-flex min-h-11 items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:bg-slate-50"
        >
          {params.locale === "en" ? "العربية" : "English"}
        </Link>
      </nav>
    </main>
  );
}
