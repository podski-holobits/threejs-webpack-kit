const { merge } = require('webpack-merge');
const common = require('./common.config.js');
const commonConfig = common.config;
const distPath = common.distPath;
const __rootPath = common.__rootPath;

module.exports = merge( commonConfig, {
	mode: 'production'
});