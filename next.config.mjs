/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configure for static exports (for GitHub Pages)
  output: 'export',
  // Disable server features that aren't supported in static exports
  trailingSlash: true,
  // Set the base path if you're deploying to a subdirectory
  // basePath: '/repo-name', // Uncomment and replace with your repository name if needed
}

export default nextConfig