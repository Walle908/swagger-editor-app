import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `
      @use "@/styles/variables" as *;
    `,
  },
  typedRoutes: false,
};

export default nextConfig;
