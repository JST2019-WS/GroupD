import Dotenv from 'dotenv-webpack'
import apiMocker from 'connect-api-mocker'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export default (config, env, helpers) => {
    delete config.entry.polyfills;

    let { plugin } = helpers.getPluginsByName(config, "ExtractTextPlugin")[0];
    plugin.options.disable = true;

    if (env.production) {
        config.output.libraryTarget = "umd";
    }

    // Add support for .env files
    config.plugins.push(new Dotenv({
        path: env.production ? './.production.env' : './.development.env',
        defaults: true
    }));

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

    /*
    let { index } = helpers.getPluginsByName(config, 'HtmlWebpackPlugin')[0];
    config.plugins.splice(index, 1);
    config.plugins.splice(helpers.getPluginsByName(config, 'ScriptExtHtmlWebpackPlugin')[0].index, 1);
    config.plugins.splice(helpers.getPluginsByName(config, 'HtmlWebpackExcludeAssetsPlugin')[0].index, 1);

    // Get rid of preact-cli entry
    //config.entry.bundle = config.entry.bundle.filter((elem) => !elem.includes('preact-cli'));
    config.entry = {
        index: './index.js'
    };*/

    if(env.production) {
        config.plugins.push(new BundleAnalyzerPlugin({
            excludeAssets: /^(?!index.js)/,
            analyzerMode: 'static',
            defaultSizes: 'gzip'
        }));
    }

    // Enable performance hints
    config.performance = {
        hints: 'warning',
        maxEntrypointSize: 10 * 1000,
        maxAssetSize: 2 * 1000
    };
};
