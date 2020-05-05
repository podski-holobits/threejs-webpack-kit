const webpack = require('webpack');
const path = require('path');

// [1] Requiring development packages
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); 

// [2] Paths - entry paths and names
const entryPath = './src/init.js';  //path to starting javascriptfile
const distPath = 'dist';  //path to dist folder
const __rootPath = path.resolve(__dirname, '../');   // We are in config folder, so we need to know the root folder path

// [3] moudle.exports configuration
const config = {
    entry: entryPath,
    output: {
        path: path.resolve(__rootPath, distPath),
        filename: 'bundle.js'   //TODO split into chunks etc
    },
    module: {
        rules: [
            {   //Babel transpiling configuration
                test:  /\.js$/,
                exclude:  /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }, 
            {   //Html loader
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        //options: {minimize: true } // More options here: https://github.com/webpack-contrib/html-loader
                    }
                ]
            },
            {   //Image loader
                test:  /\.(png|svg|jpe?g|gif)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        //keep original image filename
                        name: '[name].[ext]',
                        //define output path for img files
                        outputPath: 'img/',
                        //put the outputPath into injected path into html file
                        publicPath: 'img/'
                    }
                }
            },
        
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './index.html'
        }),
        new CleanWebpackPlugin()
    ]
};

module.exports = {config, entryPath, distPath, __rootPath};