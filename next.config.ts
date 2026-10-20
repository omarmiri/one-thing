import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components is off: shop pages read live data (stock, orders) on every request.
  serverExternalPackages: ["@electric-sql/pglite", "pg"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
