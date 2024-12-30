// const {
//     spawn,
//     // execSync, 
//     // exec
// } = require('node:child_process')
import chalk from 'chalk'
import {spawn} from 'child_process'

//  "dev": "webpack serve --config webpack.dev.config.js --name",
const serveList = process.argv.slice(2)
const color = {
    list: [['green', 'yellow'], ['yellow', 'green']],
    error: 'red',
    warning: 'yellow',
    success: 'green'
}

const outputText = (data, i) => {
    i = i % color.list.length
    console.log(chalk[color.list[i][0]][color.list[i][1]].bold(data))
}
// fork 是衍生当前进程 共享内存,spawn 是执行一个新程序
for(let i=0;i<serveList.length;i++){

    const cmd = `webpack serve --config webpack.dev.config.js --port 809${i} --env name=${serveList[i]} --color` //
    const spawnArgs = cmd.split(' ')
    const child = spawn(spawnArgs[0], spawnArgs.slice(1), {
        // stdio: 'inherit', // 这将确保子进程的输出被直接传递到父进程的标准输出，包括ANSI颜色代码
        // shell: true // 使用shell来运行命令，这样ls命令的颜色输出会被保留
    })


    child.stdout.on('data', (data) => {
        outputText(`===== stdout ${serveList[i]} =====`, i)
        console.log(`${data}`)
        // console.log(chalk[color.error](data))

    })

    child.stderr.on('data', (data) => {
        outputText(`===== stderr ${serveList[i]} =====`, i)
        // console.log(chalk[color.success](data))
        console.log(`${data}`)
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

    // try {
    //     exec(`webpack serve --config webpack.dev.config.js --env name=${serveList[i]}`, {stdio: 'inherit'})
    //     console.log(`${serveList[i]} 启动成功`)
    // } catch (error) {
    //     console.error(`执行的错误: ${error}`)
    // }

}
