import './css/main.scss'
import {queryString, browserDetect} from './common/utils.js'
import {lazyload} from './common/lazyload.js'
import {remInit} from './common/rem.js'
import http from './common/http.js'
import share from './common/share.js'

import P from'./js/page.js'
import A, {qs} from './js/activity.js'
// 并发队列任务
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
    // pageAnimateTime: 600,
    pageAnimateType: 'fade',// fade 渐隐渐现翻页 translate 位移翻页 threeD  三d翻页
    pageSwipeB: {
        '0': false,
        '1': false,
        '2': false,
        '3': false,
        '4': false,
        '5': false,
        '6': false,
    },
    // eslint-disable-next-line
    startCallback(oldIndex, newIndex){
        
    },
    // eslint-disable-next-line
    endCallback(oldIndex, newIndex){
        
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
    event() {
		
    },
    // 进入页面
    entry() {
		
        console.log('entry')

        let page = Number(queryString('page'))||1
        P.goto(page)
        this.addBgMp3(OSSURL + 'static/media/bj.mp3')  
        this.event()

        // weui.toast('兑换成功', {
        // 	duration: 2000,
        // 	className: 'weui-toast-text penetrate',
        // });
        
        //  .replace(/\s/g, "")

        

    },

})

// utils.whenDomReady(function(){
// 在有load页面的时候用
lazyload('.lazy_load',{
    baseURL: OSSURL,
    complete(){
        let $loadNum = qs('#set_load_num')
        P.goto(0, {time: 0, endCallback: function(){
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