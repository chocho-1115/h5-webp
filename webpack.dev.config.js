
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const projectConfig = require('./config/projectConfig.json');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const getFreePort = require('./config/getFreePort')

let projectName = JSON.parse(process.env.npm_config_argv).remain[0];
let projectConfig = {};

if (projectName && projectName != 'template') {
	projectConfig.name = projectName;
	projectConfig.srcPath = './src/' + projectName + '/';
	projectConfig.distPath = './dist/' + projectName + '/';
} else {
	projectConfig.name = 'template';
	projectConfig.srcPath = './template/';
	projectConfig.distPath = './dist/template/';
}

module.exports = function (env) {

	let config = {
		mode: 'development',
		performance: false, // 不显示大文件警告
		stats: 'errors-only', // 只输出错误信息
		watch: false, // webpack-dev-server 和 webpack-dev-middleware 里 Watch 模式默认开启。
		watchOptions: {
			aggregateTimeout: 300,
			poll: 1000
		},
		devServer: {
			static: projectConfig.srcPath,
			port: getFreePort(),
			client: {
                logging: 'error',
            },
		},
		// devtool: 'inline-source-map',
        devtool: 'eval-cheap-module-source-map', // 定位到错误所在行信息，不需要定位列信息，速度较快
		entry: projectConfig.srcPath + 'js/main.js',
		output: {
			filename: 'js/[name]-[chunkhash].js',
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
				// {
				// 	test: /\.(png|jpe?g|gif|svg)$/,
				// 	use: [
				// 		{
				// 			loader: 'url-loader', // url-loader是file-loader的加强版
				// 			options: {
				// 				limit: 1000,//小于1000字节就转base64
				// 				name: 'image/[name].[ext]'
				// 			}
				// 		}
				// 	]
				// },
				{
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    type: 'asset',
                    parser: {
                        dataUrlCondition: {
                            maxSize: 39 * 1024 // 小于 ？kb 转 base64
                        }
                    },
                    generator: {
                        filename: '[name].[contenthash:8].[ext]'
                    },
                },
				{
                    test: /\.(s[ac]|c)ss$/i, //匹配所有的 sass/scss/css 文件, // 匹配所有的 css 文件
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        // 'sass-loader'
                    ]
                },
			]
		},
		plugins: [
			// https://webpack.js.org/plugins/html-webpack-plugin/
			new HtmlWebpackPlugin({
				template: projectConfig.srcPath + 'index.html',
				filename: 'index.html',
				inject: 'body'
			}),

			new MiniCssExtractPlugin({
				// Options similar to the same options in webpackOptions.output
				// both options are optional
				//filename: '[name].css',
				filename: 'css/[name]-[contenthash].css', //'css/main.css',
				//chunkFilename: 'css/main.css',
			}),
		],
		externals: {
			// jquery: 'jQuery'
		}
	};


	return config;

}