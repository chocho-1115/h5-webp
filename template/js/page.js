let page = document.querySelectorAll('.page')
let pageIndex = -1 
let pageStatus = -1 // 页面切换状态
let pageCutover = true // 页面切换开关 可以用来从外部限制页面是否可以滑动翻页
let pageSwipeB = []
let startCallback
let endCallback

export default {
    h5Init(opt) {
        let content = document.querySelector('#content')
        pageSwipeB = opt.pageSwipeB

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
                if (!pageStatus) return false
                if (!pageCutover) return false
                if ( pageSwipeB[ pageIndex] === false ||  pageSwipeB[ pageIndex] < 0) return false
                let nextPage =  page[ pageIndex].getAttribute('next-page')
                if (nextPage) {
                    this. goto(Number(nextPage))
                } else {
                    this. goto( pageIndex + 1)
                }
            })
            // 上一页
            mc.on('swipedown', () => {
                if (! pageStatus) return false
                if (! pageCutover) return false
                if ( pageSwipeB[ pageIndex] === false ||  pageSwipeB[ pageIndex] > 0) return false

                let nextPage =  page[ pageIndex].getAttribute('previous-page')
                if (nextPage) {
                    this. goto(Number(nextPage))
                } else {
                    this. goto( pageIndex - 1)
                }
            })
        }
    },    
    setUpJt(B) {
        let ele = document.getElementById('upJt')
        if(!ele) return
        if(B){
            ele.style.display = 'block'
        }else{
            ele.style.display = 'none'
        }
    },
    goto(num, opt) {
        opt = opt || {}
        let oldPage =  page[ pageIndex],
            newPage =  page[num],
            time = opt.time === undefined ? 300 : opt.time
        
        if ( pageIndex == num || num >=  page.length) {
            // if (opt && opt.startCallback) opt.startCallback()
            // if (opt && opt.endCallback) opt.endCallback()
            return false
        }
        pageStatus = 0

        this.setUpJt(false)

        newPage.style.display = 'block'
        if (opt.startCallback) opt.startCallback( pageIndex, num)
        if ( startCallback)  startCallback( pageIndex, num)

        if (oldPage) {
            TweenMax.to(oldPage, time / 1000, { opacity: 0 })
        }

        TweenMax.to(newPage, time / 1000, {
            opacity: 1, onComplete: () => {
                newPage.classList.add('show')
                if(oldPage) oldPage.classList.remove('show')

                let oldIndex =  pageIndex
                pageIndex = num

                if (opt.endCallback) opt.endCallback(oldIndex, num)
                if ( endCallback)  endCallback(oldIndex, num)
                
                // display的设置放在endCallback后面是为了防止类似scrollTop的设置失效问题
                if(oldPage) oldPage.style.display = 'none'
                let d =  pageSwipeB[num]
                if (opt.upJtB === undefined && (d === 0 || d === 1)) {
                    this.setUpJt(true)
                } else {
                    this.setUpJt(opt.upJtB)
                }

                pageStatus = 1
            }
        })
		
    },
}