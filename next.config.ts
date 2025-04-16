import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL('https://mosaic.scdn.co/**'),
      new URL('https://i.scdn.co/image/**'),
    ]
  }
};

export default nextConfig;
