import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';
const deps = require('./package.json').dependencies;

const ModuleFederationPlugin = webpack.container.ModuleFederationPlugin;
const CompressionPlugin = require('compression-webpack-plugin');

import 'webpack-dev-server';

const config: webpack.Configuration = {
    experiments: {
        topLevelAwait: true,
    },
    mode: 'development',
    target: 'web',
    devServer: {
        historyApiFallback: {
            disableDotRule: true,
            verbose: true,
        },
        port: 3000,
        static: path.join(__dirname, 'dist'),
    },
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.bundle.js',
        publicPath: '/',
    },
    resolve: {
        extensions: ['.jsx', '.js', '.tsx', '.ts'],
    },
    module: {
        rules: [
            {
                test: /.(js|ts)x?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CompressionPlugin(),
        new CleanWebpackPlugin(),
        new ModuleFederationPlugin({
            name: 'host',
            shared: {
                ...deps,
                react: {
                    requiredVersion: deps['react'],
                    import: 'react',
                    shareKey: 'react',
                    shareScope: 'default',
                    singleton: true,
                },
                'react-dom': {
                    requiredVersion: deps['react-dom'],
                    singleton: true,
                },
            },
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ],
};

export default config;
