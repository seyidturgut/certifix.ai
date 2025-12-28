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
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://160.153.246.164:5001/api/:path*',
      },
    ];
  },
};

export default nextConfig;
