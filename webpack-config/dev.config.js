const merge = require('webpack-merge');
const common = require('./common.config.js');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'inline-source-map',   //this defines source code mapping for development
	devServer: {                    //dev-server configuration
		contentBase: './dist',
		host: '0.0.0.0'
	}
});