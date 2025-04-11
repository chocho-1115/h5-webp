import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import projectConfig from './project.js'

const __dirname = path.resolve()

export default {
    mode: process.env.MODE,
    performance: false, // 不显示大文件警告
    stats: 'errors-only', // 只输出错误信息
    entry: {
        main: projectConfig.src + '/main.js',
    },
    output: {
        filename: 'js/[name]-[chunkhash].js',
        path: path.join(__dirname, projectConfig.dist)
    },
    cache: false,
    // {
    //     type: 'filesystem', // 使用文件缓存。通过 cache: filesystem 可以将构建过程的 webpack 模板进行缓存，大幅提升二次构建速度、打包速度，当构建突然中断，二次进行构建时，可以直接从缓存中拉取，可提速 80% 左右。
    //     maxAge: 4 * 60 * 60 * 1000 // 允许未使用的缓存留在文件系统缓存中，保留4小时
    // },
    resolve: {
        // extensions: ['js', '.css', '...'], // 注意：1.高频文件后缀名放前面 2.手动配置后，默认配置会被覆盖，如果想保留默认配置，可以用 ... 扩展运算符代表默认配置
        alias: {
            '~': path.join(__dirname, '/public'),
            '@': path.join(__dirname, projectConfig.src),
        },
        symlinks: false // 减少解析工作量
    },
    module: {
        // parser: {
        //     javascript: {
        //         importMetaContext: true,
        //     },
        // },
        rules: [
            {
                test: /.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                resolve: {
                    fullySpecified: false
                },
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.(s[ac]|c)ss$/i, // 匹配所有的 sass/scss/css 文件, // 匹配所有的 css 文件
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: {
                                filter(url) {
                                    if(process.env.MODE == 'development') return false // 开发环境css内的图片不打包
                                    if(url.indexOf('static/') > -1) return false // static下的图片不打包
                                    return true
                                }
                            },
                            // css modules 配置
                            // importLoaders: 1, // css-loader 之前应用的加载器数量
                            // https://www.npmjs.com/package/css-loader#modules
                            modules: {
                                auto: /\.m\.\w+$/i,  // 以m.scss结尾的用css modules // 如果需要设置为true 这里设置为true无效 只能直接 modules: true
                                localIdentName: '[local]-[hash:base64]',
                            }, 
                        },
                    },
                    'sass-loader'
                ] // Loader 的执行顺序是固定从后往前
            },
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    // test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    test: /[\\/]node_modules[\\/]/, // 匹配node_modules中的模块
                    name: 'vendor',
                    chunks: 'all',
                },
            }
        },
        // runtimeChunk: true,

    },
    plugins: [
        // https://webpack.js.org/plugins/html-webpack-plugin/
        new HtmlWebpackPlugin({
            template: projectConfig.src + '/index.html',
            filename: 'index.html',
            inject: 'body'
        }),
        // 提取js中的css 生成独立的css文件
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            // filename: '[name].css',
            filename: 'css/[name]-[contenthash].css', // 'css/main.css',
            // chunkFilename: 'css/main.css',
        })
    ],
    externals: {
        // jquery: 'jQuery'
    }
}