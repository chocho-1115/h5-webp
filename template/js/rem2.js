
(function () {
    function remInit(config) {
        var docEl = document.documentElement,
			resizeEvt = 'onorientationchange' in window ? 'orientationchange' : 'resize',
			timer = null;

		// 可配置参数
		var isLandscape = config.isLandscape ? true : false; // 是否横屏 这里是只页面是否要横屏展示 并不代表当前的设备状态
		var zoomOutCriticalValue = config.zoomOutCriticalValue;
		// 添加横屏标识
		if (isLandscape) docEl.classList.add('landscape');

		window.addEventListener(resizeEvt, function () {
			if (timer) clearTimeout(timer);
			// 下面的延迟是必要的
			// ios 下 resize|orientationchange 事件 需要延迟1秒 不然rem适配时获取的屏幕宽高值不对 比如在ios的safari下 pc手机调试模式下 或者部分安卓机下
			timer = setTimeout(changeFunc, 1000);
		}, false);
		// doc.addEventListener('DOMContentLoaded', recalc, false);
		changeFunc();

		function changeFunc() {
			if (
				!isLandscape // 非横屏展示
				||
				window.orientation === undefined // pc端 不考虑横屏问题
			) {
				recalc({
					viewportMinHeight: config.viewportMinHeight,
					baseWidth: config.baseWidth,
					maxWidth: config.maxWidth
				});
				return;
			};

			if (window.orientation === 180 || window.orientation === 0) {//竖着的
				// console.log('===竖着的==='+window.orientation)
				docEl.classList.add('rotateWin');
				recalc({
					viewportMinHeight: config.baseWidth,
					baseWidth: config.viewportMinHeight,
					maxWidth: config.viewportMinHeight
				});
			} else if (window.orientation == 90 || window.orientation == -90) {
				// console.log('===横着的==='+window.orientation)
				docEl.classList.remove('rotateWin');
				recalc({
					viewportMinHeight: config.viewportMinHeight,
					baseWidth: config.baseWidth,
					maxWidth: config.maxWidth
				});
			}
		}

		function recalc(opt) {
			// 可配置参数
			var viewportMinHeight = opt.viewportMinHeight,
				baseWidth = opt.baseWidth,
				maxWidth = opt.maxWidth ? opt.maxWidth : 10000;

			var zoomOutByHeight = false;

			if (viewportMinHeight && docEl.clientWidth / docEl.clientHeight > (zoomOutCriticalValue || baseWidth / viewportMinHeight)) {
				zoomOutByHeight = true;
			}
			var clientWidth = docEl.clientWidth;
			var clientHeight = docEl.clientHeight;
			if (zoomOutByHeight) {
				var v = 100 * (clientHeight / viewportMinHeight);
			} else {
				var v = 100 * (Math.min(clientWidth, maxWidth) / baseWidth);
			}
			docEl.style.fontSize = v + 'px';
			docEl.setAttribute('data', v);
		};
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
        // 是否横屏 默认false
	    isLandscape: false,
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