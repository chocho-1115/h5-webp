const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const projectConfig = require('./config/projectConfig.js');


console.log('========= 老版开始帮你打包：' + projectConfig.name + ' =========');

module.exports = {
	// devtool: projectConfig.devtool, //'cheap-module-eval-source-map',
	entry: projectConfig.srcPath + 'js/main.js',
	output: {
		filename: 'js/[name]-[chunkhash].bundle.js',
		path: path.resolve(__dirname, projectConfig.distPath)
	},
    module: {
	    rules: [
	        /*{
	            test: /\.(js|jsx)$/,
	            exclude:path.resolve(__dirname, 'node_modules'),
	            use:[
	                {
	                    loader: 'babel-loader',
	                    options: {
	                        presets: ['env'],
	                        plugins: ['transform-runtime']
	                    }
	                }
	            ]
	        },*/
	        // 图片
	        {
	            test: /\.(png|jpe?g|gif|svg)$/,
	            use: [
	                {
	                    loader: 'url-loader',
	                    options: {
	                        limit: '1000',//小于1000字节就转base64
	                        name: 'image/[name].[ext]'
	                    }
	                }
	            ]
	        },
	        // html
	        {
	            test: /\.html$/,
	            use: [
	                {
	                    loader: 'html-loader',
	                    options: {
	                        minimize: true
	                    }
	                }
	            ]
	        },
			// css 
			{
				// test 表示测试什么文件类型
				test:/\.css$/,
				// 使用 'style-loader','css-loader'
				use:['style-loader','css-loader']
			}
	    ]
	},

	plugins: [
		// 清除打包目录
		new CleanWebpackPlugin(projectConfig.distPath),
		// https://webpack.js.org/plugins/html-webpack-plugin/
		new HtmlWebpackPlugin({
			template: projectConfig.srcPath + 'index.html',
			filename: 'index.html',
			inject: 'body'
		})
	]
};