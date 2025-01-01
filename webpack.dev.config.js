
// const path = require('path')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const ESLintPlugin = require('eslint-webpack-plugin')

import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'

import {getProjectConfig} from './config/project.js'

const __dirname = path.resolve()
// eslint-disable-next-line no-unused-vars
export default function (env,argv) {
    const projectConfig = getProjectConfig(env.name)
    return {
        mode: 'development',
        performance: false, // 不显示大文件警告
        stats: 'errors-only', // 只输出错误信息
        // watch: false, // webpack-dev-server 和 webpack-dev-middleware 里 Watch 模式默认开启。
        watchOptions: {
            aggregateTimeout: 300,
            // less文件在编辑器下自动转为了css，这里不监听less的变化，不然less变化导致提前触发编译，页面样式没更新
            ignored: ['**/*.less', '**/node_modules'] // 排除文件夹
        },
        devServer: {
            headers: {},
            static: projectConfig.src,
            client: {
                logging: 'error',
                overlay: false // 关闭vue错误提示层
            },
            compress: true, // 是否启动压缩 gzip
            open: false, // 是否自动打开浏览器
            hot: true // 热更新
        },
        // devtool: 'inline-source-map',
        devtool: 'eval-cheap-module-source-map', // 定位到错误所在行信息，不需要定位列信息，速度较快
        entry: projectConfig.src + 'js/main.js',
        output: {
            filename: 'js/[name]-[chunkhash].js',
            path: path.resolve(__dirname, projectConfig.dist)
        },
        cache: true,
        resolve: {
            // extensions: ['js', '.css', '...'], // 注意：1.高频文件后缀名放前面 2.手动配置后，默认配置会被覆盖，如果想保留默认配置，可以用 ... 扩展运算符代表默认配置
            alias: {
                '@': path.resolve(projectConfig.src)
            },
            symlinks: false // 减少解析工作量
        },
        module: {
            rules: [
                /* {
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
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    type: 'asset',
                    parser: {
                        dataUrlCondition: {
                            maxSize: 39 * 1024 // 小于 ？kb 转 base64
                        }
                    },
                },
                {
                    test: /\.(s[ac]|c)ss$/i, // 匹配所有的 sass/scss/css 文件, // 匹配所有的 css 文件
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
                template: projectConfig.src + 'index.html',
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
            new ESLintPlugin({
                fix: true, // 自动修复
                // context: projectConfig.src, // 上下文目录 默认为编译器目录  compiler.context
                // overrideConfigFile: './eslint.config.mjs', // 配置文件 不配置此项 ESLintPlugin也会自动找到配置文件； 这里必须使用mjs，因为webpack默认commonjs模块系统
                configType: 'flat', // 使用最新的flat config方式 默认为eslintrc；flat使用esmodule模块系统  eslintrc使用commonjs模块系统
            })
        ],
        externals: {
            // jquery: 'jQuery'
        }
    }
}