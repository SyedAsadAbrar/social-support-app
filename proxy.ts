import createMiddleware from "next-intl/middleware";

export const proxy = createMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "en"
});

export const config = {
  matcher: ["/", "/(en|ar)/:path*"]
};
