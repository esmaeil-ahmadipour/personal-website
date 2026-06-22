// مسیر: next.config.ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n.ts");

const nextConfig: NextConfig = {
  // ✅ غیرفعال کردن RTL خودکار
  experimental: {
    // ...
  },
};

export default withNextIntl(nextConfig);
