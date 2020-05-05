const webpack = require('webpack');
const path = require('path');

//Requiring development packages
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// Paths - entry paths and names
const entryPath = './src/init.js';  //path to starting javascriptfile
const distPath = 'dist';  //path to dist folder
const __rootPath = path.resolve(__dirname, '../');   // We are in config folder, so we need to know the root folder path

// moudle.exports configuration by structure
const config = {
    entry: entryPath,
    output: {
        path: path.resolve(__rootPath, distPath),
        filename: 'bundle.js'   //TODO split into chunks etc
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        //options: {minimize: true } // More options here: https://github.com/webpack-contrib/html-loader
                    }
                ]
            },
        /*  {
            test: /\.js$/,
            use: 'babel-loader',
            exclude: /node_modules/
        }*/
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './index.html'
        }),
        new CleanWebpackPlugin([distPath]),
    ]
};

module.exports = config;