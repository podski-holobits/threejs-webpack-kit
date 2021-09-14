const webpack = require('webpack');
const path = require('path');

// [1] Requiring development packages
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// [2] Paths - entry paths and names
const __rootPath = path.resolve(__dirname, '../');           // We are in config folder, so we need to know the root folder path
const includePath = path.join(__rootPath, 'src');
const nodeModulesPath = path.join(__rootPath, 'node_modules');
const entryPath = './src/init.js';                          //path to starting javascriptfile
const distPath = 'dist';                                   //path to dist folder

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
                test: /\.js$/,
                include: includePath,
                exclude: nodeModulesPath,
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
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    // Puts css into a separate css file  is invoked 3rd
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: 'css/',
                        },
                    },
                    // Translates CSS into CommonJS - is invoked 2nd
                    'css-loader',
                    // Compiles Sass to CSS - is invoked 1st
                    'sass-loader',
                ],
            },
            {   //Image loader
                test: /\.(png|svg|jpe?g|gif)$/,
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
            {
                test: /\.(gltf|glb|mp3)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        //keep original image filename
                        name: '[name].[ext]',
                        //define output path for img files
                        outputPath: 'assets/',
                        //put the outputPath into injected path into html file
                        publicPath: 'assets/'
                    }
                }
            },
            {   //fonts loader
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        //keep original image filename
                        name: '[name].[ext]',
                        //define output path for img files
                        outputPath: 'fonts/',
                        //put the outputPath into injected path into html file
                        publicPath: 'fonts/'
                    }
                }
            },
            {   //shader loader
                test: /\.(glsl|frag|vert)$/,
                use: [
                    'glslify-import-loader',
                    'raw-loader',
                    'glslify-loader']
            },
            {   //loader for example modules for three.js
                test: /three\/examples\/jsm/,
                use: 'imports-loader?THREE=three'
            }
        ]
    },
    resolve: {
        alias: {
            //alias wykorzystujący ten efekt https://threejs.org/docs/#manual/en/introduction/Import-via-modules
            'three-examples': path.join(__rootPath, './node_modules/three/examples/jsm')
        }
    },
    externals: {
        'three': 'THREE'
        // (more)
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        new CleanWebpackPlugin(),
        //Provide three without need to import in a file
        new webpack.ProvidePlugin({
            'THREE': 'three'
        })
    ]
};

module.exports = { config, entryPath, distPath, __rootPath };