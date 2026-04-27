import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
      config.resolve.alias = {
        ...config.resolve.alias,
        "bn.js": require.resolve("bn.js"),
      };
    }
    return config;
  },
};

export default nextConfig;