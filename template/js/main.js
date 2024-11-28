import '../css/reset.css'
import '../css/main.css'
import '../image/160.jpg'
import A from '../common/activity.js'
import utils, {isWechat, isAndroid, queryString, lazyLoad, browserDetect} from '../common/utils.js'
import http from '../common/http.js'

let doc = document
function qs(selector, parentNode){
    return parentNode ? parentNode.querySelector(selector) : doc.querySelector(selector)
}

// function qsa(selector, parentNode){
//     return parentNode ? parentNode.querySelectorAll(selector) : doc.querySelectorAll(selector)
// }

let config = {
    debug: !!queryString('debug'),
    userInfo: {}, // 登录信息
    // 分享信息
    shareInfo: {
        title: '分享标题',
        desc: '分享副标题',
        imgUrl: 'https://www.seth5.com/2022/ltYearEndReview/image/160.jpg', // document.location.hostname 不带端口
        link: 'https://www.seth5.com/2022/ltYearEndReview/' // http://uat.h5.maijimeng.com/activity/2022/
    }
}
Object.assign(A.data, config)

if(isWechat()) A.initWxFX()
A.setFX()

// 跳到第二页  
A.h5Init({
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
    }
})

A.remInit({
    // 基础宽度 通常和设计稿宽度一致
    baseWidth: 750,
    // 在使用宽度适配时的 页面的最大宽度，此值只在按宽度适配时，才有效
    maxWidth: browserDetect().isPc ? 750 : null, // 不限制最大宽度 即按浏览器宽度适配
    // 视窗显示的最小高度范围 当按宽度适配会裁切掉viewportMinHeight所指定的高度范围内的内容时 此时将按高度来适配
    // 所以按高度适配的临界值为 baseWidth / viewportMinHeight, 界面宽高比大于此值时 按高度适配
    // 此值可以为空
    viewportMinHeight: 1334,
    // 是否横屏 默认false
    isLandscape: false,
    // 默认true 自动旋转屏幕 当设置为false时 如果用户开启了自动旋转屏幕 将会在横屏时显示提示层 只有在isLandscape为true时才有效
    // autoRotatingScreen: true, // 已废弃 rotateWindows_tips的显示与隐藏 不应该写在适配方法内
	
    // 按高度适配时的临界值，会覆盖设置viewportMinHeight后默认的临界值（baseWidth / viewportMinHeight）
    // viewportMinHeight未设置时 此值无效
    // 使用场景：在横屏下才使用高度适配 就可以把zoomOutCriticalValue设置为 1/1
    // zoomOutCriticalValue: !browserDetect().isPc ? 1 / 1 : null,
    // zoomOutCriticalValue: 1334/(750-400),
})

A.data.pageCallback = {
    '2': function(){
		
    }
}

// 组装A对象
Object.assign(A, {

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

    async addBgMp3(){
        let src = 'media/bj.mp3'
        const audioConfig = {
            src,
            audioContext: null,
            asPossibleAutoplay: true,
            autoplay: true,// 音乐是否自动播放
            loop: true,// 是否循环播放
        }

        if(isAndroid()){ // 安卓谷歌浏览器也无法自动播放 只能解决安卓微信 和默认浏览器的自动播放
            const res = await http.get(src, { responseType: 'arraybuffer' }).catch((e) => { console.log(e) })
            audioConfig.audioContext = await A.createAudioContext(res.data)
        }

        const audio = A.createAudio(audioConfig)

        A.setAudioButton({
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
    event() {
		
    },
    // 进入页面
    entry() {
		
        console.log('entry')

        let page = Number(queryString('page'))||1
        this.gotoPage(page)

        this.event()

        // weui.toast('兑换成功', {
        // 	duration: 2000,
        // 	className: 'weui-toast-text penetrate',
        // });
        // 关闭页面下拉露出网页来源
        // this.SetScroll(false)//

        

    },

})

utils.whenDomReady(function(){
	
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

    // 在有load页面的时候用
    lazyLoad('.lazy_load',{
        complete(){
            let $loadNum = qs('#set_load_num')
            A.gotoPage(0, {time: 0, endCallback: function(){
                lazyLoad('.lazy',{
                    fileload(item){
                        $loadNum.innerHTML = parseInt(item.progress*100)+'%'
                    },
                    complete(){
                        $loadNum.innerHTML = 100+'%'
                        setTimeout(function(){
                            A.entry()
                        },800)
                    },
                    minTime: 0
                })
            }})
        },
        minTime: 0
    })

    A.addBgMp3()



    
	
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

    // post 请求数据
    /* $.post("http://www.cui2.com/h5/tongCheng20151210/index.php?act=chaxun", {openid:openid}, function(data){
			let data=JSON.parse(data);
			let text1 = $('.text1').val().replace(/\s/g, ""),
				text2 = $('.text2').val().replace(/\s/g, "");
			JSON.stringify(result)
	});*/
	
    /*
	$('.sub').on("click",function(e){
		let text1 = $('.info .text1').val().replace(/\s/g, ""),//获取input数据  并且去掉数据中的空格
			text3 = $('.info .text3').val().replace(/\s/g, ""),
			text2 = $('.info .text2').val().replace(/\s/g, "");
		if(text1.length==0||text2.length==0||text3.length==0){
			weui.toast('请完善好信息！', {
				duration: 2000,
				className: 'weui-toast-text penetrate',
			});
			return false
		}	
		if(!isMobile(text2)){
			weui.toast('电话号码错误！', {
				duration: 2000,
				className: 'weui-toast-text penetrate',
			});
			return false
		}
	
		$.post("", {openid:openid,name:text1,tele:text2,address:text3}, function(data){
				let data=JSON.parse(data);
				console.log(data);
				if (data.code == 1) {
					weui.toast('提交成功！', {
						duration: 2000,
						className: 'penetrate',
					});
					$('.info .text1').val('')
					$('.info .text2').val('')
					$('.info .text3').val('')
					
					$('.info').fadeOut(300);
				}else{
					weui.toast('您提交收获地址无需重复提交！', {
						duration: 2000,
						className: 'weui-toast-text penetrate',
					});
				}
		});
	});
	*/
})

