const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const readline = require('readline');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//css提取
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');// weipack4
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');// weipack5

const TerserPlugin = require('terser-webpack-plugin');

// const webpack = require("webpack");
let projectName = JSON.parse(process.env.npm_config_argv).remain[0] || 'template';
let projectConfig = {};

if (projectName && projectName === 'template') {
	projectConfig.name = 'template';
	projectConfig.srcPath = './template/';
	projectConfig.distPath = './dist/template/';
} else {
	projectConfig.name = projectName;
	projectConfig.srcPath = './src/' + projectName + '/';
	projectConfig.distPath = './dist/' + projectName + '/';
}

console.log('========= 老版开始帮你打包：' + projectConfig.name + ' =========');

module.exports = function(env){

	// const isDevMode = env.mode=='development' ? true : false;
	return {
		mode: 'production',
		performance: false,// 不显示大文件警告
		stats: 'errors-only',// 只输出错误信息

		// webpack-dev-server 和 webpack-dev-middleware 里 Watch 模式默认开启。
		watch: true,
		// watchOptions: {
		// 	aggregateTimeout: 300,
		// 	poll: 1000
		// },

		entry: {
			main: projectConfig.srcPath + 'js/main.js',
			// maiji: projectConfig.srcPath + 'js/maiji.js',
		},
		output: {
			filename: 'js/[name]-[chunkhash].js',
			path: path.resolve(projectConfig.distPath),
			clean: true, // 每次构建清除dist包
		},

	    module: {
		    rules: [
				{
                    test: /\.(s[ac]|c)ss$/i, //匹配所有的 sass/scss/css 文件, // 匹配所有的 css 文件
					
                    use: [
                        MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
							options: {
								modules: false,
							},
						},
                    ]
                },
		        {
		            test: /\.js$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								[
									'@babel/preset-env',
									{
										"corejs": "3",
										"useBuiltIns": "usage",// usage 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加
										"debug": false,
										// "targets": {
										// 	"chrome": "58",
										// 	"ie": "14"
										// }
									}
								]
							],
							// modules: 'commonjs',
							plugins: [
								["@babel/plugin-transform-runtime", {
									"corejs": 3,
									"helpers": true,
									"regenerator": true,
									"useESModules": false
								}]
							]
						}
					}
		        },
				{
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    type: 'asset',
                    parser: {
                        dataUrlCondition: {
                            maxSize: 0, //2 * 1024 // 小于 ？kb 转 base64
                        }
                    },
                    generator: {
                        filename: 'image/[name][ext]'
                    },
                    use: [
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                //bypassOnDebug : true, // webpack@1.x 
                                disable: false, // webpack@2.x and newer 
                                // jpeg / jpg
                                mozjpeg: {
                                    progressive: true,
                                    quality: 85
                                },
                                // png
                                pngquant: {
                                    quality: [0.8, 0.90],
                                    speed: 4
                                },
                                // webp
                                // webp: { quality: 85 }
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
								minimize: true,
								esModule: false,
								sources: {
									list: [
										// 原生
										{ tag: 'img', attribute: 'src', type: 'src' },
										{ tag: 'video', attribute: 'poster', type: 'src' },
										// 自定义
										{ tag: 'a', attribute: 'data-src', type: 'src' },
										{ tag: 'body', attribute: 'data-src', type: 'src' },
										{ tag: 'div', attribute: 'data-src', type: 'src' },
										{ tag: 'span', attribute: 'data-src', type: 'src' },
										{ tag: 'img', attribute: 'data-src', type: 'src' },
										{ tag: 'ul', attribute: 'data-src', type: 'src' },
										{ tag: 'ol', attribute: 'data-src', type: 'src' },
										{ tag: 'li', attribute: 'data-src', type: 'src' },
										{ tag: 'dl', attribute: 'data-src', type: 'src' },
										{ tag: 'dt', attribute: 'data-src', type: 'src' },
										{ tag: 'dd', attribute: 'data-src', type: 'src' },
										{ tag: 'p', attribute: 'data-src', type: 'src' },
										{ tag: 'input', attribute: 'data-src', type: 'src' },
										{ tag: 'textarea', attribute: 'data-src', type: 'src' },
										{ tag: 'form', attribute: 'data-src', type: 'src' },
										{ tag: 'canvas', attribute: 'data-src', type: 'src' },
										// html5
										{ tag: 'header', attribute: 'data-src', type: 'src' },
										{ tag: 'footer', attribute: 'data-src', type: 'src' },
										{ tag: 'article', attribute: 'data-src', type: 'src' },
										{ tag: 'section', attribute: 'data-src', type: 'src' }
									],
									urlFilter: (attribute, value, resourcePath) => {
										if (/example\.pdf$/.test(value)) {
											return false;
										}
										//console.log(attribute,value, resourcePath)
										return true;
									},
								}
		                    }
		                }
		            ]
		        },
				
				{
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                    type: 'asset',
                    generator: {
                        filename: 'font/[name][ext]'
                    },
                    parser: {
                        dataUrlCondition: {
                            maxSize: 10 * 1024
                        }
                    }
                }
		    ]
		},
		/// config.optimization.minimize instead.
		optimization: {
			minimize: true,
			minimizer: [
				// ...
				new TerserPlugin({
					extractComments: false,//不将注释提取到单独的文件中
				}),
				new CssMinimizerPlugin()
			],
		},
		plugins: [
			// 打包完成监控
			new webpack.ProgressPlugin({
				handler(percentage, message, ...args) {
					readline.clearLine(process.stdout, 0);
					readline.cursorTo(process.stdout, 0);
					var str = (percentage * 100).toFixed(0) + '% '
					process.stdout.write(str);
					if (percentage == 1) {
						console.log('\r\r========= 完成打包：' + projectConfig.name + ' =========');
					}
				},
			}),
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
			// new OptimizeCssAssetsPlugin(),
			new CopyPlugin({
				patterns: [
					{ 
						from: path.join(projectConfig.srcPath, 'media'),
						to: 'media',
						noErrorOnMissing: true
					},
					{ 
						from: path.resolve(projectConfig.srcPath, 'static'),
						to: 'static',
						noErrorOnMissing: true
					},
					{ 
						from: path.resolve(projectConfig.srcPath, 'libs'),
						to: 'libs',
						noErrorOnMissing: true
					}
				],
            })
		],
		externals: {
			// jquery: 'jQuery'
		}
	};
}



// 文档定义loader为在模块加载时的预处理文件，故loader运行在打包文件之前。
// plugins的定义为处理loader无法处理的事物，例如loader只能在打包之前运行，但是plugins在整个编译周期都起作用。

// plugin顺序没有限制，因为每个plugin内部实现都是用钩子处理，即回调函数。
// loader是有顺序的，webpack肯定是先将所有css模块依赖解析完得到计算结果再创建style标签。因此应该把style-loader放在css-loader的前面（webpack loader的执行顺序是从右到左）