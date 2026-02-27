/** @type {import('next').NextConfig} */
const nextConfig = {
    // Reduce unnecessary recompilations
    reactStrictMode: false,

    // Faster image loading
    images: {
        minimumCacheTTL: 86400,
        formats: ['image/webp'],
    },

    // Compiler optimizations
    compiler: {
        removeConsole: false,
    },

    // Turbopack is already on via next dev --turbo, this just ensures stable defaults
    experimental: {
        optimizePackageImports: ['lucide-react', 'framer-motion'],
    },
};

module.exports = nextConfig;
