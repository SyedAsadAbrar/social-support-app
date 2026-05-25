import {ArrowLeft, ArrowRight, CheckCircle2, Clock3, Languages, ShieldCheck} from "lucide-react";
import Link from "next/link";
import {getTranslations, setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/config";

type LandingPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function LandingPage({params}: LandingPageProps) {
  const {locale} = await params;

  setRequestLocale(locale);

  const t = await getTranslations("landing");
  const otherLocale = locale === "en" ? "ar" : "en";
  const StartArrow = locale === "ar" ? ArrowLeft : ArrowRight;

  const highlights = [
    {
      icon: Clock3,
      title: t("highlights.fast.title"),
      description: t("highlights.fast.description")
    },
    {
      icon: ShieldCheck,
      title: t("highlights.secure.title"),
      description: t("highlights.secure.description")
    },
    {
      icon: CheckCircle2,
      title: t("highlights.guided.title"),
      description: t("highlights.guided.description")
    }
  ];

  return (
    <main className="min-h-screen bg-mist text-ink">
      <section className="relative isolate min-h-[92vh] overflow-hidden bg-civicDark text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=2200&q=85')] bg-cover bg-center opacity-40"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-civicDark/70" />

        <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href={`/${locale}`} className="text-sm font-bold uppercase tracking-wide">
            {t("brand")}
          </Link>
          <Link
            href={`/${otherLocale}`}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/35 bg-white/10 px-3 py-2 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20"
          >
            <Languages aria-hidden="true" size={17} />
            {locale === "en" ? "العربية" : "English"}
          </Link>
        </nav>

        <div className="relative z-10 mx-auto grid min-h-[calc(92vh-5rem)] max-w-6xl content-center gap-8 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
              {t("eyebrow")}
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/86">
              {t("description")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/${locale}/apply`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-base font-bold text-civicDark shadow-lg transition hover:bg-mist"
              >
                {t("start")}
                <StartArrow aria-hidden="true" size={19} />
              </Link>
              <a
                href="#overview"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/35 px-5 py-3 text-base font-semibold text-white transition hover:bg-white/12"
              >
                {t("learnMore")}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="overview" className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-civicSoft text-civic">
                  <Icon aria-hidden="true" size={22} />
                </div>
                <h2 className="mt-4 text-xl font-bold text-ink">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
