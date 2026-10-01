import type { NextConfig } from "next";

// Frontend-only static site: every route is prerendered to HTML in `out/`.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // The default image optimizer needs a server; images are pre-sized by scripts/fetch-assets.mjs instead.
  images: { unoptimized: true },
};

export default nextConfig;
