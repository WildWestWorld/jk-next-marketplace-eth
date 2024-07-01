/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'thrangra.sirv.com',
            },
        ],
    },
};

export default nextConfig;
