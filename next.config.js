/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MYSQL_HOST: '139.59.156.50',
    MYSQL_PASSWORD: '@qJZuP^C3s1%',
    MYSQL_USER: 'extern',
    PORT: 3000
  },
  api: {
    responseLimit: false,
  }
}

module.exports = nextConfig
