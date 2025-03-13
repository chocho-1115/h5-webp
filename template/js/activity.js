// https://github.com/chocho-1115/h5-webp by 杨燚平 email：849890769@qq.com

document.body.ondragstart = function (e) {
    e.preventDefault()
}

if(document.querySelector('#fx')){
    document.querySelector('#fx').onclick = function(){
        this.style.display = 'none'
    }
}

// $("input,select,textarea").not('.no-blur').blur(function () {
// 	// 延迟0秒 解决在聚焦时 点击页面提交按钮无法触发提交事件的问题
// 	setTimeout(function () {
// 		$(window).scrollTop(0);
// 	}, 0);
// });

+function(){
    let selectAll = document.getElementsByTagName('select')
    function handler(){
        let v = this.value
        if(v==''){
            this.classList.add('select-placeholder')
        }else{
            this.classList.remove('select-placeholder')
        }
    }
    Array.prototype.forEach.call(selectAll, ele => {
        handler.call(ele)
        ele.addEventListener('change', handler)
    })
}()

function stopDefaultScroll (e) {
    e.preventDefault()
    e.stopPropagation()
}

// ////////////////////////////////////////////
let activity = {
    /**
     * @desc 利用AudioContext api来播放音频
     * @param {arraybuffer} arraybuffer 通过接口请求的音频文件数据
     */
    async createAudioContext (arraybuffer) {
        const mgr = new Proxy({
            context: new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)(),
            autoplay: false,
            paused: true,
            loop: false,
            pause () { mgr.context.suspend() },
            play () { mgr.context.resume() },
            _events: {},
            trigger: function(eventName, ...args) {
                if (!this._events[eventName]) return
                this._events[eventName].forEach(handler => {
                    handler.apply(this, args)
                })
            },
            addEventListener(eventName, handler) {
                if (!this._events[eventName]) {
                    this._events[eventName] = []
                }
                this._events[eventName].push(handler)
            },
            removeEventListener: function(eventName, handler) {
                if (!this._events[eventName]) return
                this._events[eventName] = this._events[eventName].filter(h => h !== handler)
            }
        }, {
            // get: function (target, propKey, receiver) {
            //   console.log(`getting ${propKey}!`);
            //   return Reflect.get(target, propKey, receiver);
            // },
            set: function (target, propKey, value, receiver) {
                switch(propKey) {
                case 'loop': source.loop = value; break
                case 'autoplay': if(value===true) mgr.play(); break
                }
                return Reflect.set(target, propKey, value, receiver) // 同步修改 mgr[propKey]
            }
        })

        mgr.context.addEventListener('statechange', function(e){
            if(e.currentTarget.state == 'running'){
                mgr.paused = false
                mgr.trigger('play', {target: mgr, type: 'play'})
            }else{
                mgr.paused = true
                mgr.trigger('pause', {target: mgr, type: 'pause'})
            }
        }, false)
        
        const buffer = await mgr.context.decodeAudioData(arraybuffer)
        let source = mgr.context.createBufferSource()
        source.buffer = buffer
        source.loop = false
        source.start(0)
        source.connect(mgr.context.destination)
        mgr.pause()
        
        return mgr
    },
    createAudio ({src = '', audioContext = null, autoplay = true, loop = true, asPossibleAutoplay = false}) {
        if(!src && !audioContext) return
        const audio = audioContext ? audioContext : new Audio(src)
        audio.loop = !!loop
        audio.autoplay = !!autoplay
        
        const firstTouch = (e) => {
            document.removeEventListener(e.type, firstTouch)
            if(audio.button && audio.button.contains(e.target)) return
            audio.play()
        }
        if (autoplay && asPossibleAutoplay) {
            audio.play()
            if(audio.paused) {
                // ios下 audioContext api时 touchstart事件会触发 但是play播放不成功，所以要加click来触发播放
                // ios微信下 audioContext api时 空白处点击 无法触发window的click事件，所以这里的事件需绑定在document上，如果点击了注册事件的按钮上时 还是会冒泡触发window的click事件的
                // 这里的事件如果有调整 需要综合考虑播放按钮的点击事件 考虑多事件注册后 在不同场景下的触发顺序
                document.addEventListener('touchstart', firstTouch, false) 
                document.addEventListener('click', firstTouch, false)
            }
        }
        return audio
    },
    // 设置mp3 背景音乐按钮	
    setAudioButton ({button = null, audio = null}) {
        if(!audio || !button) return

        audio.button = button

        // 播放完毕
        // audio.addEventListener('ended',function(){
        //     button.classList.add('hide')
        // },false)
        // 暂停
        audio.addEventListener('pause',function(){
            button.classList.add('hide')
        }, false)
        // 播放
        audio.addEventListener('play',function(){
            button.classList.remove('hide')
        }, false) 
        
        button.style.display = 'block'
        button.addEventListener('click', () => {
            audio.paused ? audio.play() : audio.pause()
        })

        if(audio.paused) button.classList.add('hide')
        
    },
    // 是否开启 触摸滚动页面
    setScroll (isScroll) {
        if (isScroll) {
            document.removeEventListener('touchmove', stopDefaultScroll, false)
        } else {
            document.addEventListener('touchmove', stopDefaultScroll, { passive: false })
        }
    },
    // 设置省市区联动
    initHunanAreaPicker: function({city, area, district, depth, defaultValue = []} = {}, callback){
        if(!window.HunanAreaData){
            return
        }
        district.onclick = function () {
            weui.picker(window.HunanAreaData, {
                depth: depth,
                container: 'body',
                // defaultValue: ['430000', '430100', '430101'],
                defaultValue: defaultValue,
                onConfirm: function (result) {
                    let str = ''
                    if(city) {
                        city.value = result[0]?result[0].value:''
                        str += result[0] ? result[0].label + ' ' : ''
                    }
                    if(area) {
                        area.value = result[1]?result[1].value:''
                        str += result[1] ? result[1].label : ''
                    }
                    district.value = str.trim()
                    callback && callback(result)
                },
                id: 'AddressPicker' // 缓存id
            })
        }
    },
    // 设置省市区联动
    initChinaAreaPicker: function({province, city, area, district, depth, defaultValue = []} = {}, callback){
        if(!window.ChinaAreaData){
            return
        }
        district.onclick = function () {
            weui.picker(window.ChinaAreaData, {
                depth: depth,
                container: 'body',
                // defaultValue: ['430000', '430100', '430101'],
                defaultValue: defaultValue,
                onConfirm: function (result) {
                    let str = ''
                    if(province) {
                        province.value = result[0]?result[0].value:''
                        str += result[0] ? result[0].label + ' ' : ''
                    }
                    if(city) {
                        city.value = result[1]?result[1].value:''
                        str += result[1] ? result[1].label + ' ' : ''
                    }
                    if(area) {
                        area.value = result[2]?result[2].value:''
                        str += result[2] ? result[2].label : ''
                    }
                    district.value = str.trim()
                    callback && callback(result)
                },
                id: 'AddressPicker' // 缓存id
            })
        }
    },
}

export default activity