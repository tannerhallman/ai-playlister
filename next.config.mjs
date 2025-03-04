/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { crypto: false };
    return config;
  },
};

export default nextConfig;
