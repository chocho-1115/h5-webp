import './css/main.scss'
import {queryString, browserDetect, isWechat, isAndroid} from './common/utils.js'
import {lazyload} from './common/lazyload.js'
import {remInit} from './common/rem.js'
import http from './common/http.js'
import share from './common/share.js'
import audio from './js/audio.js'

import P from'./js/page.js'
import A, {qs} from './js/activity.js'
// import './js/parallelTask_test.js'

const DEBUG = !!queryString('debug')
const ISLOCAL = window.location.href.indexOf('localhost')>-1 || window.location.href.indexOf('127.0.0.1')>-1 || window.location.href.indexOf('192.168.1.100')>-1
const OSSURL = ISLOCAL ? '' : ''

const config = {
    userInfo: {}, // 登录信息
    // 分享信息
    shareInfo: {
        title: '分享标题',
        desc: '分享副标题',
        imgUrl: 'https://www.seth5.com/2024/**/static/image/share.jpg', // document.location.hostname 不带端口
        link: 'https://www.*.com/*/**/',
    },
    media: {
        'bj': null
    }
}

//  ========= 初始化 http ========= 
const H = http.create({ baseURL: ''})
// 添加响应拦截器
H.interceptors.response.use(function (res) {
    return res.data
}, function (error) {
    console.log('响应拦截器-error')
    return Promise.reject(error)
})

//  ========= 分享 ========= 
share.init(config.shareInfo)
share.set()

//  ========= page ========= 
P.init({
    swipeB: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ],
    // eslint-disable-next-line
    onChangeBefore(oldIndex, newIndex){
        
    },
    // eslint-disable-next-line
    onChangeAfter(oldIndex, newIndex){
        
    }
})

//  ========= rem ========= 
remInit({
    baseWidth: 750,
    maxWidth: browserDetect().isPc ? 750 : null,
    viewportMinHeight: 1334,
    isLandscape: false,
    // zoomOutCriticalValue: !browserDetect().isPc ? 1 / 1 : null,
    // zoomOutCriticalValue: 1334/(750-400),
})

// 组装A对象
Object.assign(A, {
    data: config,
    async addBgMp3(){
        let src = OSSURL + 'static/media/bj.mp3'
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

        this.data.media['bj'] = m
    },
    addListItem() {
        let list = document.getElementById('list')
        const fragment = document.createDocumentFragment()

        let n = 0, m = 0
        const tasks = Array.from({ 
            length: 50000
        }, (_, i) => {
            return () => {
                n++
                let ball = document.createElement('span')
                ball.innerText = i + 1
                fragment.appendChild(ball)
            }
        })

        let len = tasks.length
        while (len > 0) {
            tasks.splice(len, 0, () => {
                m++
                list.appendChild(fragment)
                fragment.innerHTML = ''
            })
            len -= 1000
        }
        
        tasks.push(()=>{
            console.log('完成', n, m)
            console.log('dom添加数量', n)
            console.log('dom操作次数', m)
        })
        
        // for (let i = 0; i < tasks.length; i++) {
        //     tasks[i]()
        // }
        // list.appendChild(fragment)

        function performTasks(tasks) {
            requestIdleCallback((deadline) => {
                // console.log('---0')
                while (deadline.timeRemaining() > 0 && tasks.length > 0) {
                    // console.log('---1')
                    const task = tasks.shift()
                    task()
                }
                if (tasks.length === 0) {
                    // 
                }else{
                    performTasks(tasks)
                }
            })
        }

        // 开始执行任务
        performTasks(tasks)
    },
    event() {
        let shake = qs('.shake')
        gsap.to(shake, 1.5, {rotate: 360, ease: 'none', repeat: -1})
        qs('#btn').onclick = this.addListItem
    },
    // 进入页面
    entry() {
		
        console.log('entry')

        let page = Number(queryString('page'))||1
        P.goto(page)
        this.addBgMp3()  
        this.event()

        // weui.toast('兑换成功', {
        // 	duration: 2000,
        // 	className: 'weui-toast-text', // penetrate nowrap
        // })
        
        //  .replace(/\s/g, "")

        

    },

})

// utils.whenDomReady(function(){
// 在有load页面的时候用
lazyload('.lazy_load',{
    baseURL: OSSURL,
    complete(){
        let $loadNum = qs('#set_load_num')
        P.goto(0, {time: 0, onChangeAfter: function(){
            lazyload('.lazy',{
                baseURL: OSSURL,
                fileload(item){
                    $loadNum.innerHTML = parseInt(item.progress*100)+'%'
                },
                complete(){
                    $loadNum.innerHTML = 100+'%'
                    setTimeout(function(){
                        A.entry()
                    }, DEBUG ? 0 : 800)
                },
                minTime: DEBUG ? 0 : 1000
            })
        }})
    },
    minTime: 0
}) 
 



 
// })
 

/* +function(){
    let end_time = (new Date()).getTime()+10001;//月份是实际月份-1 "10/31/2018 14:51:00"
    countDown(end_time,{
        framerate:100,
        onUpdate:function(res){
            console.log(res.second)
        },
        onComplete:function(res){
            console.log(res.day+'天 '+(res.hour<10?"0"+res.hour:res.hour)+':'+(res.minute<10?"0"+res.minute:res.minute)+':'+(res.second<10?"0"+res.second:res.second)+':'+res.millisecond)
        }
    });
}();
*/	


// 调用手机相册
// let fileEle = bindFileControl(document.documentElement,'image/*',{
// 	successCallback: function(reader){
// 		console.log(reader)
// 		// let exif_orientation = exifOrientation(reader.result)
// 		//.substring(22)
// 		//type为jpeg webp的情况下 encoderOptions才起作用
// 		compressionPic(reader.result, {
// 			maxSize:750,
// 			// exif_orientation:exif_orientation,
// 			type:'image/jpeg',
// 			quality: 0.8,
// 			encode: 'file'//支持 base64、blob、file 默认base64
// 		},function(res){
// 			//$('.page4 .logo').attr('src',res.result)
// 			info.img = res.result.substring(23);
// 			$('.page3 .pic').css({'background-image':'url('+res.result+')','opacity':1});
// 		})
// 	},
// 	errorCallback: function(res){

// 	}
// });