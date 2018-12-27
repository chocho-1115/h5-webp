const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	devServer:{
        contentBase: './template/'
    },
	devtool: 'cheap-module-eval-source-map', 

	entry: './template/js/main.js',
	output: {
		filename: 'js/[name]-[chunkhash].bundle.js',
		// path: path.resolve(__dirname, projectConfig.distPath)
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
		// https://webpack.js.org/plugins/html-webpack-plugin/
		new HtmlWebpackPlugin({
			template: './template/index.html',
			filename: 'index.html',
			inject: 'body'
		})
	]
};


	