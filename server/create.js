import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

const __dirname = path.resolve()

let projectName = process.argv[2]
let srcDir = ''
let tarDir = path.join(__dirname, './src/'+projectName)
let isUseReact = !!process.env.npm_config_react

if(!projectName){
    throw '新建项目名称不能为空：npm run create projectName'
}

if(isUseReact){
    srcDir = path.join(__dirname, 'template-react')
}else{
    srcDir = path.join(__dirname, 'template')
}

if(fs.existsSync(tarDir)){
    throw tarDir + ' 目录已存在'
}else{
    fs.mkdir(tarDir, {recursive: true}, function(err) {
        if (err) {
            console.log(err)
            return
        }
        copyFolder(srcDir, tarDir, ()=> {
            console.log(' \n' + chalk.green.bold(` [${projectName}] Create completed`) + ' \n')
            console.log(' Path', tarDir)
            console.log(` Run \`npm run dev ${projectName}\` \n`)
        })
    })
}

// 将源文件拷贝到目标文件
// 将srcPath路径的文件复制到tarPath
const copyFile = function(srcPath, tarPath, cb) {
    let rs = fs.createReadStream(srcPath)
    rs.on('error', function(err) {
        if (err) {
            console.log('read error', srcPath)
        }
        cb && cb(err)
    })
 
    let ws = fs.createWriteStream(tarPath)
    ws.on('error', function(err) {
        if (err) {
            console.log('write error', tarPath)
        }
        cb && cb(err)
    })
    ws.on('close', function(ex) {
        cb && cb(ex)
    })
 
    rs.pipe(ws)
}

// 将srcDir文件下的文件、文件夹递归的复制到tarDir下
const copyFolder = function(srcDir, tarDir, cb) {
    fs.readdir(srcDir, function(err, files) {
        let count = 0
        let checkEnd = function() {
            ++count == files.length && cb && cb()
        }
 
        if (err) {
            checkEnd()
            return
        }
 
        files.forEach(function(file) {
            let srcPath = path.join(srcDir, file)
            let tarPath = path.join(tarDir, file)
 
            fs.stat(srcPath, function(err, stats) {
                if (stats.isDirectory()) {
                    
                    console.log('mkdir', tarPath)

                    fs.mkdir(tarPath, function(err) {
                        if (err) {
                            console.log(err)
                            return
                        }
                        copyFolder(srcPath, tarPath, checkEnd)
                    })
                } else {
                    copyFile(srcPath, tarPath, checkEnd)
                }
            })
        })
 
        // 为空时直接回调
        files.length === 0 && cb && cb()
    })
}





