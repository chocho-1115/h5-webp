function parallelTask(tasks, parallelCount = 2) {
    // tasks：异步请求函数队列；parallelCount：最多同时运行几个任务
    return new Promise((resolve) => {
    // 表示没有任务情况
        if (tasks.length === 0) {
            resolve()
            return
        }

        let nextIndex = 0
        let finishCount = 0

        function _run() {
            // 运行下一次任务
            const task = tasks[nextIndex] // 获取当前异步函数
            nextIndex++
            task().then(() => {
                finishCount++
                // 运行下一个
                if (nextIndex < tasks.length) {
                    _run()
                } else if (finishCount === tasks.length) {
                    // 如果当前请求完成数量和异步请求队列数量一致，则表示所有请求完毕
                    // 任务完成
                    resolve()
                }
            })
        }

        for (let i = 0; i < parallelCount && i < tasks.length; i++) {
            // 执行几次任务
            _run()
        }
    })
}
export default parallelTask

