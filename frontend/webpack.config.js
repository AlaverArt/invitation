const path = require('path');
const miniCss = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const isDevMode = mode === 'development';
const target = isDevMode ? 'web' : 'browserslist';
const devtool = isDevMode ? 'source-map' : undefined;

module.exports = {
    mode,
    target,
    devtool,
    entry: './src/index.js',
    output: {
        filename: isDevMode ? 'bundle.js' : '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test:/\.(s*)css$/,
                use: [
                    miniCss.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [require('postcss-preset-env')],
                            },
                        },
                    },
                    'sass-loader',
                ]
            },
            {
                test: /\.html$/,
                use: 'html-loader',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]',
                },
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]',
                },
            },
        ]
    },
    plugins: [
        new miniCss({
            filename: isDevMode ? '[name].css' : '[name].[contenthash].css',
        }),
        new HtmlWebpackPlugin({
            favicon: path.resolve(__dirname, 'favicon.png'),
            template: path.resolve(__dirname, 'index.html'),
        })
    ],
    optimization: {
        minimizer: [
            `...`,
            new CssMinimizerPlugin(),
        ],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/')
        },
    },
    devServer: {  // configuration for webpack-dev-server
        port: 8080, // port to run dev-server
        host: '0.0.0.0'
    }
};