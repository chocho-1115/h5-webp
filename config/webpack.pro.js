import chalk from 'chalk'
import path from 'path'
import readline from 'readline'

import webpack from 'webpack'
import CopyPlugin from 'copy-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin' // weipack5
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'

import projectConfig from './project.js'

let hasErrors = false
const __dirname = path.resolve()

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
            // html
            {
                test: /\.html$/,
                // use loader 都是加载器
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
                                    if (value.indexOf('static/') > -1) {
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
                test: /\.(jpe?g|png|gif|svg)$/i,
                type: 'asset',
                // 解析器
                parser: {
                    dataUrlCondition: {
                        maxSize: 4 * 1024 // 4 * 1024  小于？kb 转 base64
                    }
                },
                // 生成器
                generator: {
                    filename: 'image/[name]-[contenthash:6][ext]', // 输出路径
                },
                            
            }
            // {
            //     test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
            //     type: 'asset',
            //     generator: {
            //         filename: 'static/[name][ext]'
            //     },
            //     parser: {
            //         dataUrlCondition: {
            //             maxSize: 10 * 1024
            //         }
            //     }
            // }
        ]
    },
    // / config.optimization.minimize instead.
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,// 不将注释提取到单独的文件中
            }),
            new CssMinimizerPlugin(),
            new ImageMinimizerPlugin({
                generator: [
                    {
                        preset: 'webp',
                        implementation: ImageMinimizerPlugin.imageminGenerate,
                        options: {
                            plugins: [
                                ['imagemin-webp', { quality: 75 }], // 默认 75
                            ],
                        },
                    },
                ],
                loader: true, // 默认true，自动添加内置loader。 如果设置为false html、css如果同时引入同一张图时，会报错。
                // severityError: 'warning', // Ignore errors on corrupted images
                minimizer: {
                    filename: '[name][ext]', // 这里直接配置[name].webp 只是修改了扩展名 并没有利用webp的压缩方式来处理图片
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    filter: (source, sourcePath) => {
                        if (sourcePath.indexOf('static/') > -1) {
                            return false
                        }
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
        function () {
            this.hooks.done.tap('DonePlugin', (stats) => {
                hasErrors = stats.hasErrors()
            })
        },
        // 打包完成监控
        new webpack.ProgressPlugin({
            // eslint-disable-next-line no-unused-vars
            handler(percentage, message, ...args) {
                readline.clearLine(process.stdout, 0)
                readline.cursorTo(process.stdout, 0) 
                if (percentage == 1) {
                    if (hasErrors) {
                        process.stdout.write(chalk.red.bold(` [${projectConfig.name}] Build error`) + ' \n\n')
                    }else{
                        process.stdout.write(chalk.green.bold(` [${projectConfig.name}] Build completed`) + ' \n\n')
                    }
                }else{
                    let proV = (percentage * 100).toFixed(0) + '% '
                    process.stdout.write(chalk.yellow.bold(` [${projectConfig.name}] Building progress ${proV} | ${message}`))
                }
            },
        }),
			
        new CopyPlugin({
            patterns: [
                { 
                    from: path.join(__dirname, projectConfig.src, '/static'),
                    to: 'static',
                    noErrorOnMissing: true
                }
            ]
        }),
    ]
}