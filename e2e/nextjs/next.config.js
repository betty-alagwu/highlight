// next.config.js
const nextBuildId = require('next-build-id')

/** @type {import('next').NextConfig} */
const nextConfig = {
	generateBuildId: () => nextBuildId({ dir: __dirname }),
	experimental: {
		appDir: true,
		instrumentationHook: true,
	},
	productionBrowserSourceMaps: true,
	transpilePackages: ['@highlight-run/next/HighlightInit'],
}

module.exports = nextConfig
