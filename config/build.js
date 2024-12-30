// const {
//     spawn,
//     // execSync, 
//     // exec
// } = require('node:child_process')

import {spawn} from 'child_process'

//  webpack --config webpack.build.config.js --name
const serveList = process.argv.slice(2)

// fork 是衍生当前进程 共享内存,spawn 是执行一个新程序
for(let i=0;i<serveList.length;i++){
    
    const cmd = `webpack --config webpack.build.config.js --env name=${serveList[i]} --color --progress`
    const spawnArgs = cmd.split(' ')
    const child = spawn(spawnArgs[0], spawnArgs.slice(1), {})

    const outputData = []

    child.stdout.on('data', (data) => {
        console.log(`===>stdout: ${data}`)
        outputData.push(data.toString())
    })

    child.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`)
    })

    child.on('error', (error) => {
        console.error(`Error: ${error}`)
    })

    child.on('close', (code) => {
        console.log(`子进程退出码：${code}`)
        console.log(outputData.join(''))
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
