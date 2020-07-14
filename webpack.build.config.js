const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const projectConfig = require('./config/projectConfig.json');
const CopyPlugin = require('copy-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');//css提取
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// const webpack = require("webpack");

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

		entry: projectConfig.srcPath + 'js/main.js',
		output: {
			filename: 'js/[name]-[chunkhash].js',
			path: path.resolve(__dirname, projectConfig.distPath)
		},

	    module: {
		    rules: [
		        {
		            test: /\.js$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: {
						presets: ['@babel/preset-env']
						}
					}
		        },
		        // 图片
		        {
		            test: /\.(png|jpe?g|gif|svg)$/,
		            use: [
		                {
		                    loader: 'url-loader', // url-loader是file-loader的加强版
		                    options: {
		                        limit: -1, //小于1000字节就转base64
		                        name: 'image/[name].[ext]'
		                    }
		                },
		                {
							loader: 'image-webpack-loader',
							options: {
								//bypassOnDebug : true, // webpack@1.x 
								disable: false, // webpack@2.x and newer 
								mozjpeg: {
									progressive: true,
									quality: 80
								},
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
								minimize: false,
								attributes: {
									list: [
										// 原生
										{tag: 'img', attribute: 'src', type: 'src'},
										{tag: 'video', attribute: 'poster', type: 'src'},
										// 自定义
										{tag: 'div', attribute: 'data-src', type: 'src'},
										{tag: 'span', attribute: 'data-src', type: 'src'},
										{tag: 'img', attribute: 'data-src', type: 'src'},
										{tag: 'ul', attribute: 'data-src', type: 'src'},
										{tag: 'ol', attribute: 'data-src', type: 'src'},
										{tag: 'li', attribute: 'data-src', type: 'src'},
										{tag: 'dl', attribute: 'data-src', type: 'src'},
										{tag: 'dt', attribute: 'data-src', type: 'src'},
										{tag: 'dd', attribute: 'data-src', type: 'src'},
										{tag: 'input', attribute: 'data-src', type: 'src'},
										{tag: 'textarea', attribute: 'data-src', type: 'src'},
										{tag: 'form', attribute: 'data-src', type: 'src'},
										// html5
										{tag: 'header', attribute: 'data-src', type: 'src'},
										{tag: 'footer', attribute: 'data-src', type: 'src'},
										{tag: 'article', attribute: 'data-src', type: 'src'},
										{tag: 'section', attribute: 'data-src', type: 'src'}
									],
									urlFilter: (attribute, value, resourcePath) => {
										if(attribute=='data-src'){
											
										}
										if (/example\.pdf$/.test(value)) {
											return false;
										}
										return true;
									},
								},
								
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
								publicPath: '../'
								// hmr: process.env.NODE_ENV === 'development',
							},
						},
						'css-loader',
					]
				}
		    ]
		},
		/// config.optimization.minimize instead.
		optimization: {
			minimize: true
		},

		plugins: [

			/**
			 * All files inside webpack's output.path directory will be removed once, but the
			 * directory itself will not be. If using webpack 4+'s default configuration,
			 * everything under <PROJECT_DIR>/dist/ will be removed.
			 * Use cleanOnceBeforeBuildPatterns to override this behavior.
			 *
			 * During rebuilds, all webpack assets that are not used anymore
			 * will be removed automatically.
			 *
			 * See `Options and Defaults` for information
			 */
			new CleanWebpackPlugin(),
			// new CleanWebpackPlugin({
			// 	// cleanAfterEveryBuildPatterns:
			// }),

			// https://webpack.js.org/plugins/html-webpack-plugin/
			new HtmlWebpackPlugin({
				template: projectConfig.srcPath + 'index.html',
				filename: 'index.html',
				inject: 'body'
			}),

			// new webpack.optimize.UglifyJsPlugin(),

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
			new OptimizeCssAssetsPlugin(),
			new CopyPlugin({
				patterns: [
					{ from: projectConfig.srcPath+'media', to: 'media' },
					{ from: projectConfig.srcPath+'libs', to: 'libs' }
				]
			})

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