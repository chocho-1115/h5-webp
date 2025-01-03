import chalk from 'chalk'
import path from 'path'
import readline from 'readline'

import pkg from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin' // weipack5
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'

import projectConfig from './project.js'

const { ProgressPlugin } = pkg

export default {
    
    // webpack-dev-server 和 webpack-dev-middleware 里 Watch 模式默认开启。
    watch: true,
    watchOptions: {
        aggregateTimeout: 300, // 防止短时间内多次触发打包
        // less文件在编辑器下自动转为了css，这里不监听less的变化，不然less变化导致提前触发编译，页面样式没更新
        ignored: ['**/*.less', '**/node_modules'] // 排除文件夹
    },
    output: {
        clean: true, // 每次构建清除dist包
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
                                // eslint-disable-next-line no-unused-vars
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
            // eslint-disable-next-line no-unused-vars
            handler(percentage, message, ...args) {
                readline.clearLine(process.stdout, 0)
                readline.cursorTo(process.stdout, 0) 
                if (percentage == 1) {
                    process.stdout.write(chalk.green.bold(` [${projectConfig.name}] Build completed \n\n`))
                }else{
                    let proV = (percentage * 100).toFixed(0) + '% '
                    process.stdout.write(chalk.yellow.bold(` [${projectConfig.name}] Build progress ${proV} | ${message}`))
                }
            },
        }),
			
        new CopyPlugin({
            patterns: [
                { 
                    from: path.join(projectConfig.src, 'media'),
                    to: 'media',
                    noErrorOnMissing: true
                },
                { 
                    from: path.resolve(projectConfig.src, 'static'),
                    to: 'static',
                    noErrorOnMissing: true
                },
                { 
                    from: path.resolve(projectConfig.src, 'libs'),
                    to: 'libs',
                    noErrorOnMissing: true
                }
            ],
        })
    ]
}
