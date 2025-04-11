export function remInit ({
    // 基础宽度 通常和设计稿宽度一致
    baseWidth,

    // 在使用宽度适配时的 页面的最大宽度，此值只在按宽度适配时，才有效; 不限制最大宽度 即按浏览器宽度适配
    maxWidth,

    // 视窗显示的最小高度范围 当按宽度适配会裁切掉viewportMinHeight所指定的高度范围内的内容时 此时将按高度来适配
    // 所以按高度适配的临界值为 baseWidth / viewportMinHeight, 界面宽高比大于此值时 按高度适配
    // 此值可以为空
    viewportMinHeight,

    // 是否横屏 默认false
    isLandscape = false, 
    
    // 按高度适配时的临界值，会覆盖设置viewportMinHeight后默认的临界值（baseWidth / viewportMinHeight）
    // viewportMinHeight未设置时 此值无效
    // 使用场景：在横屏下才使用高度适配 就可以把zoomOutCriticalValue设置为 1/1
    zoomOutCriticalValue
}) {
    let docEl = document.documentElement,
        resizeEvt = 'onorientationchange' in window ? 'orientationchange' : 'resize',
        timer = null

    // 添加横屏标识
    if (isLandscape) docEl.classList.add('landscape')

    window.addEventListener(resizeEvt, function () {
        if (timer) clearTimeout(timer)
        // 下面的延迟是必要的
        // ios 下 resize|orientationchange 事件 需要延迟1秒 不然rem适配时获取的屏幕宽高值不对 比如在ios的safari下 pc手机调试模式下 或者部分安卓机下
        timer = setTimeout(changeFunc, 1000)
    }, false)
    // doc.addEventListener('DOMContentLoaded', recalc, false);
    changeFunc()

    function changeFunc() {
        if (
            !isLandscape // 非横屏展示
            ||
            window.orientation === undefined // pc端 不考虑横屏问题
        ) {
            recalc({
                viewportMinHeight: viewportMinHeight,
                baseWidth: baseWidth,
                maxWidth: maxWidth
            })
            return
        };

        if (window.orientation === 180 || window.orientation === 0) {// 竖着的
            // console.log('===竖着的==='+window.orientation)
            docEl.classList.add('rotateWin')
            recalc({
                viewportMinHeight: baseWidth,
                baseWidth: viewportMinHeight,
                maxWidth: viewportMinHeight
            })
        } else if (window.orientation == 90 || window.orientation == -90) {
            // console.log('===横着的==='+window.orientation)
            docEl.classList.remove('rotateWin')
            recalc({
                viewportMinHeight: viewportMinHeight,
                baseWidth: baseWidth,
                maxWidth: maxWidth
            })
        }
    }

    function recalc(opt) {
        // 可配置参数
        let viewportMinHeight = opt.viewportMinHeight,
            baseWidth = opt.baseWidth,
            maxWidth = opt.maxWidth ? opt.maxWidth : 10000

        let zoomOutByHeight = false

        if (viewportMinHeight && docEl.clientWidth / docEl.clientHeight > (zoomOutCriticalValue || baseWidth / viewportMinHeight)) {
            zoomOutByHeight = true
        }
        let clientWidth = docEl.clientWidth
        let clientHeight = docEl.clientHeight
        let v
        if (zoomOutByHeight) {
            v = 100 * (clientHeight / viewportMinHeight)
        } else {
            v = 100 * (Math.min(clientWidth, maxWidth) / baseWidth)
        }
        docEl.style.fontSize = v + 'px'
        docEl.setAttribute('data', v)

        // 解决部分 Android 手机(例如华为) 通过 rem 计算的宽度和手机上实际显示的宽度不一致
        // 方法一
        // let realFs = parseFloat(window.getComputedStyle(docEl)["font-size"]);
        // if (Math.abs(realFs - v) >= 1) {
        // 	docEl.style.fontSize = (v / (realFs / v)) + "px";
        // }

        // 方法二
        // let settedFs = v
        // let settingFs = v;
        // let whileCount = 0;
        // while (true) {
        // 	let realFs = parseInt(window.getComputedStyle(docEl).fontSize);
        // 	let delta = realFs - settedFs;
        // 	//不相等
        // 	if (Math.abs(delta) >= 1) {
        // 		if (delta > 0)
        // 			settingFs--;
        // 		else
        // 			settingFs++;
        // 		// html.setAttribute('style', 'font-size:' + settingFs + 'px!important');
        // 		docEl.style.fontSize = settingFs + 'px';
        // 		docEl.setAttribute('data', settingFs);
        // 	} else
        // 		break;
        // 	if (whileCount++ > 100)
        // 		break
        // }
        
    };
}