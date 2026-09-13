import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The backend lockfile one level up would otherwise be inferred as the workspace root.
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;
