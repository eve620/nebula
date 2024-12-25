import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'g7avx6xmiaeyvlxs.public.blob.vercel-storage.com',
            },
        ],
    },
};

export default nextConfig;
