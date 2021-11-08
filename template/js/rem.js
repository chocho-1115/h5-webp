
(function(){
    function remInit(opt) {
        var docEl = document.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            viewportMinHeight = opt.viewportMinHeight,
            baseWidth = opt.baseWidth,
            maxWidth = opt.maxWidth ? opt.maxWidth : 10000,
            zoomOutByHeight = false,
            recalc = null,
            timer = null;
        
        if(viewportMinHeight && docEl.clientWidth/docEl.clientHeight>baseWidth/viewportMinHeight){
            zoomOutByHeight = true;
        }
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            var clientHeight = docEl.clientHeight;
            if(zoomOutByHeight){
                var v = 100 * (clientHeight / viewportMinHeight);
            }else{
                var v = 100 * (Math.min(clientWidth, maxWidth) / baseWidth);
            }
            docEl.style.fontSize = v + 'px';
            docEl.setAttribute('data', v);

            // 解决部分 Android 手机(例如华为) 通过 rem 计算的宽度和手机上实际显示的宽度不一致
            var realFs = parseFloat(window.getComputedStyle(docEl)["font-size"]);
            if (Math.abs(realFs - v) >= 1) {
                docEl.style.fontSize = (v / (realFs / v)) + "px";
            }
            
        };

        if (!window.addEventListener) return;
        window.addEventListener(resizeEvt, function(){
            if(timer) clearTimeout(timer);
            timer = setTimeout(recalc, 800);
        }, false);
        // doc.addEventListener('DOMContentLoaded', recalc, false);
        recalc();
    }
    function browserDetect() {
        var obj = {
                agent : window.navigator.userAgent
            };
        
        obj.isWindowPhone = (obj.agent.indexOf("IEMobile") > -1) || (obj.agent.indexOf("Windows Phone") > -1);
        obj.isFirefox = (obj.agent.indexOf("Firefox") > -1);
        obj.isOpera = (window.opera != null);
        obj.isChrome = (obj.agent.indexOf("Chrome") > -1);  // NOTE that Chrome on Android returns true but is a completely different browser with different abilities
        obj.isIOS = (obj.agent.indexOf("iPod") > -1 || obj.agent.indexOf("iPhone") > -1 || obj.agent.indexOf("iPad") > -1) && !obj.isWindowPhone;
        obj.isAndroid = (obj.agent.indexOf("Android") > -1) && !obj.isWindowPhone;
        obj.isBlackberry = (obj.agent.indexOf("Blackberry") > -1);
        obj.isPc = /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent) ? false : true;
    
        return obj;
        
        //throw "BrowserDetect cannot be instantiated";
    }

    var browserDetectInfo = browserDetect();
    remInit({
        // 设置后将页面不随窗口大小而缩放
        // viewportMinHeight: 1206,//1334 = 128+1206(?+98)  //640 1138 1236 1250    750 1334 1448 1450  
        viewportMinHeight: browserDetectInfo.isPc ? 1300 : null,
        baseWidth: 750,
        maxWidth: browserDetectInfo.isPc ? 750 : null // 不限制最大宽度 即按浏览器宽度适配
    });
    
})();