import { getRequestConfig } from "next-intl/server";
import enMessages from "@/translations/en.json";
import faMessages from "@/translations/fa.json";
import arMessages from "@/translations/ar.json"; // ✅ اضافه کردن ترجمه عربی

export const locales = ["en", "fa", "ar"] as const; // ✅ اضافه کردن ar
export const defaultLocale = "en" as const;

export type Locale = (typeof locales)[number];

type Messages = typeof enMessages;

const messages: Record<Locale, Messages> = {
  en: enMessages,
  fa: faMessages,
  ar: arMessages, // ✅ اضافه کردن ar
};

// ✅ تنظیمات RTL برای زبان‌های عربی و فارسی
const RTL_LOCALES: Locale[] = ["fa", "ar"];

export function isRTL(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: messages[locale as Locale],
    // ✅ تنظیمات بیشتر برای جلوگیری از RTL خودکار
    timeZone: "Asia/Tehran",
    now: new Date(),
    // ✅ این خط مهمه - غیرفعال کردن تطابق خودکار
    onError: (error) => {
      console.error("i18n error:", error);
    },
  };
});
