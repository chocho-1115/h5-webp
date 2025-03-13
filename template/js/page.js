let page = document.querySelectorAll('.page')
let index = -1 
let status = -1 // 页面切换状态
let cutover = true // 页面切换开关 可以用来从外部限制页面是否可以滑动翻页
let swipeB
let startCallback
let endCallback

const setTips = (B) => {
    let ele = document.getElementById('upJt')
    if(!ele) return
    if(B){
        ele.style.display = 'block'
    }else{
        ele.style.display = 'none'
    }
}

export default {
    init(opt) {
        let content = document.querySelector('#content')
        swipeB = opt.swipeB || []

        startCallback = opt.startCallback || null
        endCallback = opt.endCallback || null

        TweenMax.set(page, {
            display: 'none',
            opacity: 0
        })

        // 设置翻页事件
        if (window.Hammer && page.length > 0) {

            let mc = new Hammer(content, { 
                // touchAction: 'pan-x pan-y'
            })
            mc.get('swipe').set({ velocity: 0, threshold: 30, direction: 30 })// 修改滑动的速度与方向

            // 下一页
            mc.on('swipeup', () => {
                if (!status) return false
                if (!cutover) return false
                if ( swipeB[ index] === false ||  swipeB[ index] < 0) return false
                let nextPage =  page[ index].getAttribute('next-page')
                if (nextPage) {
                    this. goto(Number(nextPage))
                } else {
                    this. goto( index + 1)
                }
            })
            // 上一页
            mc.on('swipedown', () => {
                if (!status) return false
                if (!cutover) return false
                if ( swipeB[ index] === false ||  swipeB[ index] > 0) return false

                let nextPage =  page[ index].getAttribute('previous-page')
                if (nextPage) {
                    this. goto(Number(nextPage))
                } else {
                    this. goto( index - 1)
                }
            })
        }
    },    
    
    goto(num, opt) {
        opt = opt || {}
        let oldPage =  page[ index],
            newPage =  page[num],
            time = opt.time === undefined ? 300 : opt.time
        
        if ( index == num || num >=  page.length) {
            // if (opt && opt.startCallback) opt.startCallback()
            // if (opt && opt.endCallback) opt.endCallback()
            return false
        }
        status = 0

        setTips(false)

        newPage.style.display = 'block'
        if (opt.startCallback) opt.startCallback( index, num)
        if ( startCallback)  startCallback( index, num)

        if (oldPage) {
            TweenMax.to(oldPage, time / 1000, { opacity: 0 })
        }

        TweenMax.to(newPage, time / 1000, {
            opacity: 1, onComplete: () => {
                newPage.classList.add('show')
                if(oldPage) oldPage.classList.remove('show')

                let oldIndex =  index
                index = num

                if (opt.endCallback) opt.endCallback(oldIndex, num)
                if ( endCallback)  endCallback(oldIndex, num)
                
                // display的设置放在endCallback后面是为了防止类似scrollTop的设置失效问题
                if(oldPage) oldPage.style.display = 'none'
                let d =  swipeB[num]
                if (opt.upJtB === undefined && (d === 0 || d === 1)) {
                    setTips(true)
                } else {
                    setTips(opt.upJtB)
                }

                status = 1
            }
        })
		
    },
}