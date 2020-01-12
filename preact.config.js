import Dotenv from 'dotenv-webpack'
import apiMocker from 'connect-api-mocker'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { readFileSync } from 'fs';
import webpack from 'webpack';

export default (config, env, helpers) => {
    delete config.entry.polyfills;

    if (env.production) {
        config.output.libraryTarget = "umd";
    }

    // Add support for .env files
    config.plugins.push(new Dotenv({
        path: env.production ? './.production.env' : './.development.env',
        defaults: true
    }));

    // Read security key
    try {
        const securityKey = readFileSync('securityKey.txt', 'UTF8');
        config.plugins.push(new webpack.DefinePlugin({
            'SECURITY_KEY': JSON.stringify(securityKey)
        }));
    } catch (err) {
        throw Error(`Could not load security key from securityKey.txt! Make sure this file exists and is readable.`);
    }

    // Mock API
    if(!env.production) {
        config.devServer.before = function (app) {
            app.use(apiMocker('/api', 'api-mocks/'))
        }
    }

    config.output.filename = 'index.js';

    // Get rid of favicon etc
    const htmlWebpackPluginConfig = helpers.getPluginsByName(config, 'HtmlWebpackPlugin')[0].plugin.options;
    // No favicon please
    delete htmlWebpackPluginConfig.favicon;

    if(env.production) {
        config.plugins.push(new BundleAnalyzerPlugin({
            excludeAssets: /^(?!index.js)/,
            analyzerMode: 'static',
            defaultSizes: 'gzip'
        }));
    }
};
