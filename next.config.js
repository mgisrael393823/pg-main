/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Suppress critical dependency warning from @supabase/realtime-js
    config.module.exprContextCritical = false;
    return config;
  }
}

module.exports = nextConfig