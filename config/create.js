// 获取命令行参数
let projectName = process.argv[2]
console.log(`exports.name = '${projectName}'`);
// 下面两行代码 获取projectName后把保存起来，写入到project.js里，方便其它js文件里引入使用
let fs = require('fs')
fs.writeFileSync('./config/project.js', `exports.name = '${projectName}'`);

// 继续执行命令（npm run build），执行默认命令开始进行打包
let exec = require('child_process').execSync;
exec('webpack --config webpack.config.js', {stdio: 'inherit'});

