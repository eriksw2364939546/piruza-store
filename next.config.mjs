import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '7000',
        pathname: '/uploads/**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },

  experimental: {
    scrollRestoration: true,
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },

  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
};

export default withNextIntl(nextConfig);