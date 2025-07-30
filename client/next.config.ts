

const nextConfig = {
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
    autoPrerender: false,
  },
  images: {
    domains: ['ui-avatars.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
