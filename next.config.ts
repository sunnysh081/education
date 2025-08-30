const withPWA = require('next-pwa')({
  dest: 'public', // Directory for PWA assets
  register: true, // Register the service worker
  skipWaiting: true, // Activate the new service worker immediately
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your other Next.js configurations
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);