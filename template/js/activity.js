// https://github.com/chocho-1115/h5-webp by 杨燚平 email：849890769@qq.com
import http from '../common/http.js'
import {isWechat, isAndroid} from '../common/utils.js'

import audio from './audio.js'

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
            audioConfig.audioContext = await audio.createContext(res.data)
        }
    
        const m = audio.create(audioConfig)
    
        audio.setButton({
            button: document.getElementById('micBtn'),
            audio: m,
        })
    
        // 以下方式都能解决ios微信下音频自动播放的问题
        if(isWechat()) {
            if(typeof window.WeixinJSBridge == 'object' && typeof window.WeixinJSBridge.invoke == 'function') {  
                window.WeixinJSBridge.invoke('getNetworkType', {}, () => {
                    console.log('getNetworkType')
                    m.play() 
                })
            } else {
                document.addEventListener('WeixinJSBridgeReady', function() {  
                    console.log('WeixinJSBridgeReady')
                    m.play()
                }, false)  
            }  
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

