import {setRequestLocale} from "next-intl/server";
import {WizardShell} from "@/features/application-wizard/components/WizardShell";
import type {Locale} from "@/i18n/config";

type ApplyPageProps = {
  params: {
    locale: Locale;
  };
};

export default function ApplyPage({params}: ApplyPageProps) {
  setRequestLocale(params.locale);

  return <WizardShell locale={params.locale} />;
}
