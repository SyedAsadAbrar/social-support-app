import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import {setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {locales, type Locale} from "@/i18n/config";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  if (!locales.includes(params.locale)) {
    notFound();
  }

  setRequestLocale(params.locale);

  const messages = await getMessages();
  const dir = params.locale === "ar" ? "rtl" : "ltr";

  return (
    <NextIntlClientProvider messages={messages}>
      <div lang={params.locale} dir={dir} className="min-h-screen">
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
