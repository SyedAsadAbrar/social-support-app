import {setRequestLocale} from "next-intl/server";
import {WizardShell} from "@/features/application-wizard/components/wizard-shell/WizardShell";
import type {Locale} from "@/i18n/config";

type ApplyPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function ApplyPage({params}: ApplyPageProps) {
  const {locale} = await params;

  setRequestLocale(locale);

  return <WizardShell locale={locale} />;
}
