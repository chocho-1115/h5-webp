import {isWechat} from './utils.js'

const config = {
    title: '',
    desc: '',
    imgUrl: '', // document.location.hostname 不带端口
    link: '',
    success: null, // 分享成功回调 init里面注入的回调任何一次分享都会执行
    cancel: null, // 分享取消回调
}

export default {
    // 微信初始化分享
    init: function(options){

        Object.assign(config, options)

        if(!isWechat(true)) return
        window.jssdk && window.jssdk.init({debug: false}).then(function(){
           
        }).catch(()=>{ 
            
        })
    },
    set(options = {}){
        let fxData = {
            title: options.title || config.title, 
            desc: options.desc || config.desc,
            imgUrl: options.imgUrl || config.imgUrl,
            link: options.link || config.link,
            success: function () {
                console.log('分享成功回调')
                options.success && options.success()
                config.success && config.success()
            },
            cancel: function () {
                console.log('分享取消回调')
                options.cancel && options.cancel()
                config.cancel && config.cancel()
            }
        }
        // 设置默认分享文案
        if(isWechat()){
            wx.ready(function () {
                window.jssdk && window.jssdk.share(fxData)
            })
        }
        
    },
}