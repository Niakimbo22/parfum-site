import type { NextConfig } from "next";

const BUILD_ID = process.env.VERCEL_GIT_COMMIT_SHA || `build-${Date.now()}`;

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  generateBuildId: async () => BUILD_ID,
  env: {
    NEXT_PUBLIC_BUILD_ID: BUILD_ID,
  },
  async headers() {
    return [
      // Default pour TOUTES les routes : HTML doit être revalidé à chaque chargement
      {
        source: "/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
      // Override : assets statiques Next.js (déjà hashés dans le filename) → cache long immutable
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Override : images publiques → cache 1 jour avec revalidation
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
