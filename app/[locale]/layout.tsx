import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import {setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import type {ReactNode} from "react";
import {locales, type Locale} from "@/i18n/config";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const {locale} = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const validLocale = locale as Locale;

  setRequestLocale(validLocale);

  const messages = await getMessages();
  const dir = validLocale === "ar" ? "rtl" : "ltr";

  return (
    <NextIntlClientProvider messages={messages}>
      <div lang={validLocale} dir={dir} className="min-h-screen">
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
