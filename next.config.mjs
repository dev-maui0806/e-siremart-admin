/** @type {import('next').NextConfig} */
const config = {
  distDir: 'build', // This will change the output directory to 'build'
  output: 'export',
  images: {
    unoptimized: true, // Disable image optimization for static export
  },
};

export default config;
