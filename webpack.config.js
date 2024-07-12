// next.config.js

const path = require('path');

module.exports = {
    webpack: (config, { isServer }) => {
        // Add handlebars loader for .hbs files
        config.module.rules.push({
            test: /\.hbs$/,
            loader: 'handlebars-loader',
        });

        // Resolve aliases if needed
        config.resolve.alias['@'] = path.resolve(__dirname);

        // Important: Return the modified config
        return config;
    },
};
