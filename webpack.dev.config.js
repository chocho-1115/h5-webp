const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const projectConfig = require('./config/projectConfig.json');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function(env){

	// const isDevMode = env.mode=='development' ? true : false;

	let config = {
		mode: 'development',

		// webpack-dev-server 和 webpack-dev-middleware 里 Watch 模式默认开启。
		watch: false,
		watchOptions: {
			aggregateTimeout: 300,
			poll: 1000
		},
		devServer:{
	        contentBase: projectConfig.srcPath
	    },
		devtool: 'cheap-module-eval-source-map', 
		//devtool: 'inline-source-map',

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
		        {
		            test: /\.(png|jpe?g|gif|svg)$/,
		            use: [
		                {
		                    loader: 'url-loader', // url-loader是file-loader的加强版
		                    options: {
		                        limit: 1000,//小于1000字节就转base64
		                        name: 'image/[name].[ext]'
		                    }
		                }
		            ]
		        },
				// css 
				{
					// test 表示测试什么文件类型
					test:/\.css$/,
					// 使用 'style-loader','css-loader'
					// style-loader能够在需要载入的html中创建一个<style></style>标签，标签里的内容就是CSS内容。
					// css-loader是允许在js中import一个css文件，会将css文件当成一个模块引入到js文件中
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
							options: {
								// you can specify a publicPath here
								// by default it uses publicPath in webpackOptions.output
								publicPath: '../'
								// hmr: process.env.NODE_ENV === 'development',
							},
						},
						'css-loader',
					]
				}
		    ]
		},
		plugins: [
			// https://webpack.js.org/plugins/html-webpack-plugin/
			new HtmlWebpackPlugin({
				template: projectConfig.srcPath + 'index.html',
				filename: 'index.html',
				inject: 'body'
			}),


			// 用于对 <script> 标签添加 async，defer,module 属性，或者内联这些属性
			new ScriptExtHtmlWebpackPlugin({
				// defer: 'js/[name]-[chunkhash].js'
				defaultAttribute: 'defer'
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