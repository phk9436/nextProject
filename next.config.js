/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  productionBrowserSourceMaps: false,
  // assetPrefix:
  //   process.env.NODE_ENV === 'production'
  //     ? 'https://phk9436.github.io/bilerplate'
  //     : '',
}

module.exports = nextConfig
