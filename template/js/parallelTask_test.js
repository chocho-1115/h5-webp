
import parallelTask from '../common/parallelTask'
import {getRandomNum} from '../common/utils.js'

function mockTasks(num) {
    // 模拟请求多个异步任务（可替换成请求api）
    let asyncTasks = []
    for (let i = 0; i < num; i++) {
        ((i)=>{
            let task = async () => {
                console.log('\x1b[36m%s\x1b[0m', '开始:'+i)
                // 在这里编写异步任务的逻辑
                return new Promise((resolve)=>{
                    setTimeout(function(){
                        console.log('\x1b[32m%s\x1b[0m', '结束:'+i)
                        resolve()
                    }, getRandomNum(2000, 5000, true))
                })
            }
            asyncTasks.push(task)
        })(i)
    }
    return asyncTasks
}

const tasks = mockTasks(13)

parallelTask(tasks, 10).then(() => { // tasks异步请求队列    4：表示并发请求数量
    console.log('完成全部的并发异步请求')
})

