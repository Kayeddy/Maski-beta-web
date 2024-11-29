import { authMiddleware } from "@clerk/nextjs/server";

import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en", "es", "pt"],

  defaultLocale: "en",
});

export default authMiddleware({
  beforeAuth: (req) => {
    // Execute next-intl middleware before Clerk's auth middleware
    return intlMiddleware(req);
  },

  // Ensure that locale specific sign-in pages are public
  publicRoutes: [
    "/",
    "/en",
    "/es",
    "/pt",
    "/:locale/sign-in",
    // "/en/onboarding",
    "/:locale/sign-up",
    "/api/webhooks/clerk",
    // "/:locale/hub/adopt",
    // "/:locale/hub/chat",
    "/:locale/",
  ],
  ignoredRoutes: ["/api/webhooks/clerk", "/context/socketContext"],
});

export const config = {
  matcher: ["/", "/(pt|es|en)/:path*"],
};
