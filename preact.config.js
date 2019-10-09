import Dotenv from 'dotenv-webpack'
import apiMocker from 'connect-api-mocker'

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
};
