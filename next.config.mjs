// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "em-content.zobj.net",
      },
      {
        protocol: "https",
        hostname: "emojipedia.org",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "dl5zpyw5k3jeb.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "ucarecdn.com",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withNextIntl(nextConfig);
