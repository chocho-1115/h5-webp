const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const projectConfig = require('./config/projectConfig.json');
const CopyPlugin = require('copy-webpack-plugin');

console.log('========= 老版开始帮你打包：' + projectConfig.name + ' =========');


module.exports = function(env){

	// const isDevMode = env.mode=='development' ? true : false;


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
					use:['style-loader','css-loader']
				}
		    ]
		},
		plugins: [

			new CleanWebpackPlugin(projectConfig.distPath, {
				watch: false
			}),

			// https://webpack.js.org/plugins/html-webpack-plugin/
			new HtmlWebpackPlugin({
				template: projectConfig.srcPath + 'index.html',
				filename: 'index.html',
				inject: 'body'
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