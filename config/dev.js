import chalk from 'chalk'
import {spawn, execSync} from 'child_process'

//  "dev": "webpack serve --config webpack.dev.config.js --name",
const serveList = process.argv.slice(2)
const color = {
    list: [['#44cc44', '#000000'], ['#cccc44', '#000000'], ['#44cccc', '#000000']],
    error: 'red',
    warning: 'yellow',
    success: 'green'
}

const outputText = (data, i) => {
    i = i % color.list.length
    // console.log(chalk[color.list[i][0]][color.list[i][1]](data))
    console.log(chalk.bgHex(color.list[i][0]).hex(color.list[i][1])(data))
    // console.log(chalk[color.list[i][0]][color.list[i][1]].bold(data))
}

const openAllServe = () => {
    // fork 是衍生当前进程 共享内存,spawn 是执行一个新程序
    for(let i=0;i<serveList.length;i++){

        const cmd = `webpack serve --config webpack.dev.config.js --port 809${i} --env name=${serveList[i]} --color` //
        const spawnArgs = cmd.split(' ')
        let child = spawn(spawnArgs[0], spawnArgs.slice(1), {
            // stdio: 'inherit', // 这将确保子进程的输出被直接传递到父进程的标准输出，包括ANSI颜色代码
        })

        child.stdout.on('data', (data) => {
            // outputText(`===== stdout ${serveList[i]} =====`, i)
            outputText(`${data}`, i)
            // console.log(chalk[color.error](data))

        })

        child.stderr.on('data', (data) => {
            // outputText(`===== stderr ${serveList[i]} =====`, i)
            // console.log(chalk[color.success](data))
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
        execSync(`webpack serve --config webpack.dev.config.js --env name=${serveList[0]}`, {stdio: 'inherit'})
        console.log('启动成功')
    } catch (error) {
        console.error(`执行的错误: ${error}`)
    }
}else {
    openAllServe()
}


