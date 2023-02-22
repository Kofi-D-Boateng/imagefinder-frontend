/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  publicRuntimeConfig: {
    apiVersion: process.env.API_VERSION || "api/v1",
  },
};

export default nextConfig;
