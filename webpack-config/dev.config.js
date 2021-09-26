const { merge } = require('webpack-merge');
const common = require('./common.config.js');
const path = require('path');

const commonConfig = common.config;
const distPath = common.distPath;
const __rootPath = common.__rootPath;

module.exports = merge(commonConfig, {
	mode: 'development',
	devtool: 'inline-source-map',   //this defines source code mapping for development
	devServer: {                    //dev-server configuration
		static: path.resolve(__rootPath, distPath),
        hot: true,                  //enable Hot Module Replacement https://webpack.js.org/concepts/hot-module-replacement/
        open: true,                 //open in browser after running server
	}
});