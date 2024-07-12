/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com', 'img.freepik.com'],
    },
    webpack: (config, { isServer }) => {
        // Add handlebars-loader for .hbs files
        config.module.rules.push({
            test: /\.hbs$/,
            loader: 'handlebars-loader',
        });
        
        // Important: Return the modified config
        return config;
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
        ];
    },
    experimental: {
        serverActions: {
            allowedOrigins: ['mercury-t2.phonepe.com'],
            allowedForwardedHost: ['mercury-t2.phonepe.com']
        },
    },
};

export default nextConfig;
