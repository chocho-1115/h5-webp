const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const {ProgressPlugin} = require('webpack')
const readline = require('readline')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')// css提取
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')// weipack5
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

// const webpack = require("webpack");
let projectName = process.argv[5]

let projectConfig = {}

if (projectName && projectName === 'template') {
    projectConfig.name = 'template'
    projectConfig.srcPath = './template/'
    projectConfig.distPath = './dist/template/'
} else {
    projectConfig.name = projectName
    projectConfig.srcPath = './src/' + projectName + '/'
    projectConfig.distPath = './dist/' + projectName + '/'
}

process.stdout.write(chalk.blue.bold(`\n [ ${projectConfig.name} ] \n\n`))

module.exports = function(env, argv){
    // const isDevMode = env.mode=='development' ? true : false;
    return {
        mode: 'production',
        performance: false,// 不显示大文件警告
        stats: 'errors-only',// 只输出错误信息

        // webpack-dev-server 和 webpack-dev-middleware 里 Watch 模式默认开启。
        watch: true,
        watchOptions: {
            aggregateTimeout: 300, // 防止短时间内多次触发打包
            // less文件在编辑器下自动转为了css，这里不监听less的变化，不然less变化导致提前触发编译，页面样式没更新
            ignored: ['**/*.less', '**/node_modules'] // 排除文件夹
        },

        entry: {
            main: projectConfig.srcPath + 'js/main.js',
            // maiji: projectConfig.srcPath + 'js/maiji.js',
        },
        output: {
            filename: 'js/[name]-[chunkhash].js',
            path: path.resolve(projectConfig.distPath),
            clean: true, // 每次构建清除dist包
        },
        cache: {
            type: 'filesystem', // 使用文件缓存。通过 cache: filesystem 可以将构建过程的 webpack 模板进行缓存，大幅提升二次构建速度、打包速度，当构建突然中断，二次进行构建时，可以直接从缓存中拉取，可提速 80% 左右。
            maxAge: 4 * 60 * 60 * 1000 // 允许未使用的缓存留在文件系统缓存中，保留4小时
        },
	    module: {
		    rules: [
                {
                    test: /\.(s[ac]|c)ss$/i, // 匹配所有的 sass/scss/css 文件, // 匹配所有的 css 文件
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                esModule: true
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
                                        'corejs': '3',
                                        'useBuiltIns': 'usage',// usage 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加
                                        'debug': false,
                                        // "targets": {
                                        // 	"chrome": "58",
                                        // 	"ie": "14"
                                        // }
                                    }
                                ]
                            ],
                            // modules: 'commonjs',
                            plugins: [
                                ['@babel/plugin-transform-runtime', {
                                    'corejs': 3,
                                    'helpers': true,
                                    'regenerator': true,
                                    'useESModules': true
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
                            maxSize: 0 // 4 * 1024 // 小于 ？kb 转 base64 默认值为 4 * 1024
                        }
                    },
                    generator: {
                        filename: 'image/[name][ext]' // 导出图片路径 在打包时才需配置
                    },
                    
                },
		        // html
		        {
		            test: /\.html$/,
		            use: [
		                {
		                    loader: 'html-loader',
		                    options: {
                                minimize: true,
                                esModule: true,
                                sources: {
                                    list: [
                                        { attribute: 'src', type: 'src' },
                                        { attribute: 'poster', type: 'src' },
                                        { attribute: 'data-src', type: 'src' }
                                    ],
                                    urlFilter: (attribute, value, resourcePath) => {
                                        if (value.indexOf('image') == -1) {
                                            return false
                                        }
                                        if (/example\.pdf$/.test(value)) {
                                            return false
                                        }
                                        return true
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
                        filename: 'static/[name][ext]'
                    },
                    parser: {
                        dataUrlCondition: {
                            maxSize: 10 * 1024
                        }
                    }
                }
		    ]
        },
        // / config.optimization.minimize instead.
        optimization: {
            minimize: true,
            minimizer: [
                // ...
                new TerserPlugin({
                    extractComments: false,// 不将注释提取到单独的文件中
                }),
                new CssMinimizerPlugin(),
                new ImageMinimizerPlugin({
                    // Disable `loader`
                    loader: true, // 默认true，自动添加内置loader。 如果设置为false html、css如果同时引入同一张图时，会报错。
                    // severityError: 'warning', // Ignore errors on corrupted images
                    minimizer: {
                        implementation: ImageMinimizerPlugin.imageminMinify,
                        filter: (source, sourcePath) => {
							
                            if (sourcePath.indexOf('static') > -1) {
                                return false
                            }

                            // if (source.byteLength < 8192) {
                            //   return false;
                            // }
			  
                            return true
                        },
                        options: {
                            plugins: [
                                ['gifsicle', { interlaced: true }],
                                ['pngquant', { quality: [0.6, 0.8] } ],
                                ['mozjpeg', { quality: 80 }],
                                ['svgo', {
                                    name: 'addAttributesToSVGElement',
                                    params: {
                                        attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
                                    }
                                }],
                            ],
                        },
                    },
                }),
            ],
        },
        plugins: [
            // 打包完成监控
            new ProgressPlugin({
                handler(percentage, message, ...args) {
                    readline.clearLine(process.stdout, 0)
                    readline.cursorTo(process.stdout, 0) 
                    if (percentage == 1) {
                        process.stdout.write(chalk.green.bold(` ${message} Build completed \n\n`))
                    }else{
                        let proV = (percentage * 100).toFixed(0) + '% '
                        process.stdout.write(chalk.yellow.bold(` Build progress ${proV}`))
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
                // filename: '[name].css',
                filename: 'css/[name]-[contenthash].css', // 'css/main.css',
                // chunkFilename: 'css/main.css',
            }),
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
    }
}



// 文档定义loader为在模块加载时的预处理文件，故loader运行在打包文件之前。
// plugins的定义为处理loader无法处理的事物，例如loader只能在打包之前运行，但是plugins在整个编译周期都起作用。

// plugin顺序没有限制，因为每个plugin内部实现都是用钩子处理，即回调函数。
// loader是有顺序的，webpack肯定是先将所有css模块依赖解析完得到计算结果再创建style标签。因此应该把style-loader放在css-loader的前面（webpack loader的执行顺序是从右到左）