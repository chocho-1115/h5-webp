import {spawn, execSync} from 'child_process'

const serveList = process.argv.slice(2) //  "dev": "webpack serve --config webpack.dev.config.js --name",

const clearLines = (count) => {
    for (let i = 0; i < count; i++) {
        process.stdout.write('\u001b[1A\u001b[2K') // 向上移动一行并清除内容
    }
}

const countStrLines = (str) => {
    // 正则表达式匹配所有类型的换行符
    const newLinesRegex = /\r\n|\n|\r/g
    // 使用match方法计算匹配到的换行符数量
    return (str.match(newLinesRegex) || []).length
}

const outputList = []
let outputLines = 0
const outputText = (data, i) => {
    outputList[i] = /\n$/.test(data) ? data : `${data}\n\n`

    let str = outputList.join('')
    let lines = countStrLines(str)

    clearLines(outputLines + 1) // 清除5行
    outputLines = lines
    console.log(str)
}

const openAllServe = () => {
    console.log('tips: 打包多个项目时 如果打包报错 countStrLines函数计算行数会出现错误 \n \n')// 空出一行
    // fork 是衍生当前进程 共享内存,spawn 是执行一个新程序
    for(let i=0;i<serveList.length;i++){

        const cmd = `cross-env MODE=production PROJECTNAME=${serveList[i]} webpack --config webpack.config.js --color`
        const spawnArgs = cmd.split(' ')
        
        let child = spawn(spawnArgs[0], spawnArgs.slice(1), {
            // stdio: 'inherit', // 这将确保子进程的输出被直接传递到父进程的标准输出，包括ANSI颜色代码
        })

        child.stdout.on('data', (data) => {
            outputText(`${data}`, i)
        })

        child.stderr.on('data', (data) => {
            outputText(`${data}`, i)
        })

        child.on('error', (error) => {
            console.error(`子进程错误：${error}`)
        })

        child.on('close', (code) => {
            console.log(`子进程退出码：${code}`)
        })

        child.on('exit', (code, signal) => {
            if (signal === 'SIGINT') {
                console.log('Child process received SIGINT signal')
                // 处理信号，如果需要的话
            }
        })
    }
}

if (serveList.length == 0) serveList.push('template')

if (serveList.length == 1){
    try {
        execSync(`cross-env MODE=production PROJECTNAME=${serveList[0]} webpack --config webpack.config.js`, {stdio: 'inherit'})
    } catch (error) {
        console.error(`执行的错误: ${error}`)
    }
}else {
    openAllServe()
}
