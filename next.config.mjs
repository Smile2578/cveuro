/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./app/i18n.ts');

const config = {
  // Réduire les logs en production
  webpack: (config, { dev, isServer }) => {
    // Désactiver les logs excessifs en production
    if (!dev) {
      config.infrastructureLogging = {
        level: 'error',
      };
      
      // Réduire les logs webpack
      config.stats = {
        all: false,
        errors: true,
        warnings: true,
      };
    }
    
    return config;
  },
  // Éviter les logs de React DevTools en production
  productionBrowserSourceMaps: false,
};

export default withNextIntl(config);
