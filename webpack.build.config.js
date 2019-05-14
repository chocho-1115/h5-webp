const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const projectConfig = require('./config/projectConfig.json');
const CopyPlugin = require('copy-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const webpack = require("webpack");

console.log('========= 老版开始帮你打包：' + projectConfig.name + ' =========');


module.exports = function(env){

	// const isDevMode = env.mode=='development' ? true : false;

	console.log(111111)
	console.log(env.mode)

	let config = {
		mode: 'production',

		// webpack-dev-server 和 webpack-dev-middleware 里 Watch 模式默认开启。
		watch: true,
		watchOptions: {
			aggregateTimeout: 300,
			poll: 1000
		},
		devServer:{
	        contentBase: projectConfig.srcPath
	    },
		devtool: '', 

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
		                    loader: 'url-loader', // url-loader是file-loader的加强版
		                    options: {
		                        limit: '1000',//小于1000字节就转base64
		                        name: 'image/[name].[ext]'
		                    }
		                },
		                {
							loader: 'image-webpack-loader',
							options: {
								//bypassOnDebug : true, // webpack@1.x 
								disable: false, // webpack@2.x and newer 
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
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
							options: {
								// you can specify a publicPath here
								// by default it uses publicPath in webpackOptions.output
								// publicPath: '../',
								// hmr: process.env.NODE_ENV === 'development',
							},
						},
						'css-loader',
					],
				}
		    ]
		},
		plugins: [

			new CleanWebpackPlugin(),

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
				//chunkFilename: '[id].css',
			}),

			new CopyPlugin([
				{ from: projectConfig.srcPath+'media', to: 'media' }
			])

		],
		externals: {
			// jquery: 'jQuery'
		}
	};


	return config;

}



// 文档定义loader为在模块加载时的预处理文件，故loader运行在打包文件之前。
// plugins的定义为处理loader无法处理的事物，例如loader只能在打包之前运行，但是plugins在整个编译周期都起作用。

// plugin顺序没有限制，因为每个plugin内部实现都是用钩子处理，即回调函数。
// loader是有顺序的，webpack肯定是先将所有css模块依赖解析完得到计算结果再创建style标签。因此应该把style-loader放在css-loader的前面（webpack loader的执行顺序是从右到左）