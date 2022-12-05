
(function () {
    function remInit(opt) {
        var docEl = document.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            viewportMinHeight = opt.viewportMinHeight,
            zoomOutCriticalValue = opt.zoomOutCriticalValue,
            baseWidth = opt.baseWidth,
            maxWidth = opt.maxWidth ? opt.maxWidth : 10000,
            recalc = null,
            timer = null;

        recalc = function () {
            var clientWidth = docEl.clientWidth;
            var clientHeight = docEl.clientHeight;
            var zoomOutByHeight = false;
            if (viewportMinHeight && docEl.clientWidth / docEl.clientHeight > (zoomOutCriticalValue || baseWidth / viewportMinHeight)) {
                zoomOutByHeight = true;
            }
            if (zoomOutByHeight) {
                console.log(1)
                var v = 100 * (clientHeight / viewportMinHeight);
            } else {
                console.log(2)
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
        window.addEventListener(resizeEvt, function () {
            if (timer) clearTimeout(timer);
            timer = setTimeout(recalc, 800);
        }, false);
        // doc.addEventListener('DOMContentLoaded', recalc, false);
        recalc();
    }
    function browserDetect() {
        var obj = {
            agent: window.navigator.userAgent
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
        // 基础宽度 通常和设计稿宽度一致
        baseWidth: 750,
        // 在使用宽度适配时的 页面的最大宽度，此值只在按宽度适配时，才有效
        maxWidth: browserDetectInfo.isPc ? 750 : null, // 不限制最大宽度 即按浏览器宽度适配
        // 视窗显示的最小高度范围 当按宽度适配会裁切掉viewportMinHeight所指定的高度范围内的内容时 此时将按高度来适配
        // 所以按高度适配的临界值为 baseWidth / viewportMinHeight, 界面宽高比大于此值时 按高度适配
        // 此值可以为空
        viewportMinHeight: 1334,
        // 按高度适配时的临界值，会覆盖设置viewportMinHeight后默认的临界值（baseWidth / viewportMinHeight）
        // viewportMinHeight未设置时 此值无效
        // 使用场景：在横屏下才使用高度适配 就可以把zoomOutCriticalValue设置为 1/1
        zoomOutCriticalValue: !browserDetectInfo.isPc ? 1 / 1 : null,
    });

})();