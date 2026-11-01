const path = require("path")

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  async redirects() {
    return [
      { source: "/sydney", destination: "/neurips", permanent: false },
      { source: "/cv", destination: "/sebastian_boehler_cv.pdf", permanent: false },
    ]
  },
}

module.exports = nextConfig
