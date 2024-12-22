/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./app/i18n.js');

const config = {
    headers: async () => [
        {
            source: '/:path*',
            headers: [
                {
                    key: 'X-Content-Type-Options',
                    value: 'nosniff',
                },
                {
                    key: 'X-Frame-Options',
                    value: 'DENY',
                },
                {
                    key: 'X-XSS-Protection',
                    value: '1; mode=block',
                },
            ],
        },
    ],
};

export default withNextIntl(config);
