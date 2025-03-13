// https://github.com/chocho-1115/h5-webp by 杨燚平 email：849890769@qq.com
import http from '../common/http.js'
import {isWechat, isAndroid} from '../common/utils.js'

document.body.ondragstart = function (e) {
    e.preventDefault()
}

if(document.querySelector('#fx')){
    document.querySelector('#fx').onclick = function(){
        this.style.display = 'none'
    }
}

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

export function qsa(selector, parentNode) {
    return parentNode ? parentNode.querySelectorAll(selector) : document.querySelectorAll(selector)
}

export function qs(selector, parentNode) {
    return parentNode ? parentNode.querySelector(selector) : document.querySelector(selector)
} 

// ////////////////////////////////////////////
export default {
    render(options){
        if(!options.data){
            if(options.blockDom) options.blockDom.style.display = 'none'
            return
        }
        const fragment = document.createDocumentFragment()
        let len = options.data.length
        for(let i=0;i<len;i++){
            let item = options.factory(options.data[i], i)
            if(!item) continue
            if(Object.prototype.toString.call(item) === '[object Array]'){
                for(let k=0; k<item.length; k++ ){
                    fragment.appendChild(item[k])
                }
            }else{
                fragment.appendChild(item)
            }
        }
        if(options.clean) options.renderDom.innerHTML = ''
        options.renderDom && options.renderDom.appendChild(fragment)
        options.renderCallback && options.renderCallback()
    },
    async addBgMp3(src){
        const audioConfig = {
            src,
            audioContext: null,
            asPossibleAutoplay: true,
            autoplay: true,// 音乐是否自动播放
            loop: true,// 是否循环播放
        }
    
        if(isAndroid()){ // 安卓谷歌浏览器也无法自动播放 只能解决安卓微信 和默认浏览器的自动播放
            const res = await http.get(src, { responseType: 'arraybuffer' }).catch((e) => { console.log(e) })
            audioConfig.audioContext = await this.createAudioContext(res.data)
        }
    
        const audio = this.createAudio(audioConfig)
    
        this.setAudioButton({
            button: document.getElementById('micBtn'),
            audio,
        })
    
        // 以下方式都能解决ios微信下音频自动播放的问题
        if(isWechat()) {
            if(typeof window.WeixinJSBridge == 'object' && typeof window.WeixinJSBridge.invoke == 'function') {  
                window.WeixinJSBridge.invoke('getNetworkType', {}, () => {
                    console.log('getNetworkType')
                    audio.play() 
                })
            } else {
                document.addEventListener('WeixinJSBridgeReady', function() {  
                    console.log('WeixinJSBridgeReady')
                    audio.play()
                }, false)  
            }  
        }
    },
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

