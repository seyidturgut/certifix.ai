import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '160.153.246.164',
        port: '5001',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
