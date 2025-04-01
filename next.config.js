/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    domains: ['qr.sepay.vn'],
  },
  // Add swcMinify option to potentially fix build issues
  swcMinify: false,
};

module.exports = nextConfig;
