const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const projectConfig = require('./config/projectConfig.json');


module.exports = function(env){

	// const isDevMode = env.mode=='development' ? true : false;


	let config = {
		mode: 'development',

		// webpack-dev-server 和 webpack-dev-middleware 里 Watch 模式默认开启。
		watch: true,
		watchOptions: {
			aggregateTimeout: 300,
			poll: 1000
		},
		devServer:{
	        contentBase: projectConfig.srcPath
	    },
		devtool: 'cheap-module-eval-source-map', 

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
								disable: true, // webpack@2.x and newer 
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
					// style-loader能够在需要载入的html中创建一个<style></style>标签，标签里的内容就是CSS内容。
					// css-loader是允许在js中import一个css文件，会将css文件当成一个模块引入到js文件中
					use:['style-loader','css-loader']
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

			
		],
		externals: {
			// jquery: 'jQuery'
		}
	};


	return config;

}