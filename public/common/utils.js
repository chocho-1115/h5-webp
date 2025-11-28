// https://github.com/chocho-1115/h5-webp

/*
 * @desc 时间格式化
 * @param {string} format 例如："yyyy/MM/dd"
 * @param {number} [timestamp] 时间戳，精确到毫秒
 * @returns {string}
 */
export function formatTime(format, timestamp) {
    let d = timestamp ? new Date(timestamp) : new Date()
    let o = {
        'M+': d.getMonth() + 1, // month   
        'd+': d.getDate(),    // day   
        'h+': d.getHours(),   // hour   
        'm+': d.getMinutes(), // minute   
        's+': d.getSeconds(), // second   
        'q+': Math.floor((d.getMonth() + 3) / 3), // quarter   
        'S': d.getMilliseconds() // millisecond   
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (d.getFullYear() + '').substring(4 - RegExp.$1.length))
    for (let k in o) if (new RegExp('(' + k + ')').test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ('00' + o[k]).substring(('' + o[k]).length))
    return format
}

/*
 * @desc 复制文本
 * @param {string} text 复制内容
 * @param {function} success 成功回调
 */
export function copyText(text, success) {
    // 数字没有 .length 不能执行selectText 需要转化成字符串
    const textString = text.toString()
    let input = document.querySelector('#copy-input')
    if (!input) {
        input = document.createElement('input')
        input.id = 'copy-input'
        input.readOnly = 'readOnly'        // 防止ios聚焦触发键盘事件
        input.style.position = 'fixed'
        input.style.left = '-1000px'
        input.style.zIndex = '-1000'
        document.body.appendChild(input)
    }
    input.value = textString
    // ios必须先选中文字且不支持 input.select();
    selectText(input, 0, textString.length)
    if (document.execCommand('copy')) {
        document.execCommand('copy')
        if (success) {
            success(textString)
        } else {
            alert('已复制到粘贴板')
        }

    } else {
        console.log('不兼容')
    }
    input.blur()
    // input自带的select()方法在苹果端无法进行选择，所以需要自己去写一个类似的方法
    // 选择文本。createTextRange(setSelectionRange)是input方法
    function selectText(textbox, startIndex, stopIndex) {
        if (textbox.createTextRange) {// ie
            const range = textbox.createTextRange()
            range.collapse(true)
            range.moveStart('character', startIndex)// 起始光标
            range.moveEnd('character', stopIndex - startIndex)// 结束光标
            range.select()// 不兼容苹果
        } else {// firefox/chrome
            textbox.setSelectionRange(startIndex, stopIndex)
            textbox.focus()
        }
    }
}

/*
 * @desc 倒计时
 * @param {number} endTime 结束时的时间戳
 * @param {object} opt 
 */
export function countDown(endTime, opt) {
    opt.framerate = opt.framerate || 1
    opt.nowTime = opt.nowTime || new Date().getTime()
    let res = {
        death: false,
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
    }
    let sys_millisecond = endTime - opt.nowTime
    let sys_millisecond_speed = 1000 / opt.framerate
    function anim() {
        if (sys_millisecond < sys_millisecond_speed) {
            clearInterval(timer)
            res.death = true//
            res.day = 0// 计算天
            res.hour = 0// 计算小时
            res.minute = 0// 计算分钟
            res.second = 0// 计算秒杀
            res.millisecond = 0
            if (opt.onUpdate) opt.onUpdate(res)
            if (opt.onComplete) opt.onComplete(res)
        } else {
            res.day = Math.floor((sys_millisecond / 1000 / 3600) / 24)
            res.hour = Math.floor((sys_millisecond / 1000 / 3600) % 24)
            res.minute = Math.floor((sys_millisecond / 1000 / 60) % 60)
            res.second = Math.floor(sys_millisecond / 1000 % 60)
            res.millisecond = Math.floor(sys_millisecond % 1000)
            sys_millisecond -= sys_millisecond_speed
            if (opt.onUpdate) opt.onUpdate(res)
        }
    }
    let timer = setInterval(anim, sys_millisecond_speed)
    anim()
    return timer
}

export function clock (opt){
    opt.framerate = opt.framerate||1
    opt.nowTime = opt.nowTime||new Date().getTime()
    let startTime = new Date().getTime()
    let res = {
        year: 0,
        month: 0,
        date: 0,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
    }
    function anim(){
        let time = (new Date().getTime() - startTime) + opt.nowTime
        let D = new Date(time)
        res.year = D.getFullYear()
        res.month = D.getMonth()+1
        res.date = D.getDate()
        res.hour = D.getHours()
        res.minute = D.getMinutes()
        res.second = D.getSeconds()
        res.millisecond = D.getMilliseconds()
        if(opt.onUpdate)opt.onUpdate(res)
    }
    let timer = setInterval(anim, 1000/opt.framerate)
    anim()
    return timer
}

/*
 * @desc 生成随机字符串
 * @param {number} 字符串长度
 */
export function getRandomStr(len) {
    len = len || 32
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'// 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
    let maxPos = $chars.length
    let sttr = ''
    for (let i = 0; i < len; i++) {
        sttr += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return sttr
}
/*
 * @desc 在Min至Max区间内获取随机数字
 * @param {number} Min 最小值 integerB如果为true 将包含Min本身，否则不包含Min
 * @param {number} Max 最大值 integerB如果为true 将包含Max本身，否则不包含Max
 * @param {boolean} integerB 是否为整数
 */
export function getRandomNum(Min, Max, integerB) {
    if (integerB) {
        return (Math.floor(Math.random() * (Max - Min + 1) + Min))
    } else {
        return (Min + Math.random() * (Max - Min))
    }
}

export function isIos () {
    return navigator.userAgent.match(/(iOS|iPhone|iPad)/i)
}

export function isAndroid () {
    return navigator.userAgent.match(/(Android)/i)
}

// 是否为微信环境
export function isWechat(includePc) {
    let isWechat = navigator.userAgent.match(/MicroMessenger/i)
    if (!includePc && navigator.userAgent.match(/(WindowsWechat|MacWechat)/i)) isWechat = false
    return !!isWechat
}

export function isMiniProgram() {
    let userAgent = navigator.userAgent
    return (
        (/miniProgram/i.test(userAgent) && /micromessenger/i.test(userAgent)) ||
        /toutiaomicroapp/i.test(userAgent)
    )
}

// 且 `(?=.*CPU)(?=.*iPad)`
export function matchUserAgent(str) {
    const reg = new RegExp(str)
    return reg.test(navigator.userAgent)
}

// 是否为手机号码
export function isMobile(str) {
    if (str == null || str == '') return false
    // let result=str.match(/^((\(\d{2,3}\))|(\d{3}\-))?((13\d{9})|(15\d{9})|(18\d{9}))$/);
    let result = str.match(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/)
    if (result == null) return false
    return true
}

// 是否为邮箱
export function isEmail(str) {
    if (str == null || str == '') return false
    let result = /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
    if (result.test(str)) {
        return true
    } else {
        return false
    }
}

// 是否为身份证
// 函数参数必须是字符串，因为二代身份证号码是十八位，而在javascript中，十八位的数值会超出计算范围，造成不精确的结果，导致最后两位和计算的值不一致，从而该函数出现错误。
export function isIDCard(idcode) {
    // 加权因子
    let weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    // 校验码
    let check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

    let code = idcode + ''
    let last = idcode[17]// 最后一位

    let seventeen = code.substring(0, 17)

    // ISO 7064:1983.MOD 11-2
    // 判断最后一位校验码是否正确
    let arr = seventeen.split('')
    let len = arr.length
    let num = 0
    for (let i = 0; i < len; i++) {
        num = num + arr[i] * weight_factor[i]
    }

    // 获取余数
    let resisue = num % 11
    let last_no = check_code[resisue]

    // 格式的正则
    // 正则思路
    /*
    第一位不可能是0
    第二位到第六位可以是0-9
    第七位到第十位是年份，所以七八位为19或者20
    十一位和十二位是月份，这两位是01-12之间的数值
    十三位和十四位是日期，是从01-31之间的数值
    十五，十六，十七都是数字0-9
    十八位可能是数字0-9，也可能是X
    */
    let idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/

    // 判断格式是否正确
    let format = idcard_patter.test(idcode)

    // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
    return last === last_no && format ? true : false
}

// 获取地址参数
export function queryString(name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let r = window.location.search.substring(1).match(reg)
    if (r != null) return decodeURIComponent(r[2])
    return null
}

// 函数防抖 多次触发只执行最后一次  此函数不执行第一次触发
export function debounce (method, delay){
    let timeout
    return function () {
        let context = this // 保存this指向
        let args = arguments // 拿到event对象
        clearTimeout(timeout)
        timeout = setTimeout(function(){
            method.apply(context, args)
        }, delay)
    }
}

// 函数节流 多次触发时减少触发频次 此函数会执行第一次触发
export function throttle (method, delay) {
    let timer = null
    let starttime = Date.now()
    return function () {
        let curTime = Date.now() // 当前时间
        let remaining = delay - (curTime - starttime)  // 从上一次到现在，还剩下多少多余时间
        let context = this
        let args = arguments
        clearTimeout(timer)
        if (remaining <= 0) {
            method.apply(context, args)
            starttime = Date.now()
        } else {
            timer = setTimeout(function(){
                method.apply(context, args)
            }, remaining)
        }
    }
}

export function browserDetect() {
    let obj = {
        agent: window.navigator.userAgent
    }
    obj.isWindowPhone = (obj.agent.indexOf('IEMobile') > -1) || (obj.agent.indexOf('Windows Phone') > -1)
    obj.isFirefox = (obj.agent.indexOf('Firefox') > -1)
    obj.isOpera = (window.opera != null)
    obj.isChrome = (obj.agent.indexOf('Chrome') > -1)  // NOTE that Chrome on Android returns true but is a completely different browser with different abilities
    obj.isIOS = (obj.agent.indexOf('iPod') > -1 || obj.agent.indexOf('iPhone') > -1 || obj.agent.indexOf('iPad') > -1) && !obj.isWindowPhone
    obj.isAndroid = (obj.agent.indexOf('Android') > -1) && !obj.isWindowPhone
    obj.isBlackberry = (obj.agent.indexOf('Blackberry') > -1)
    obj.isPc = /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent) ? false : true
    obj.isPad = obj.agent.toLowerCase().indexOf('pad') > -1// 安卓pad 和 ios pad
    return obj
}

// 上传组件
// <input class="abso upimg" id="upimg" accept="image/*" type="file" style='left:100px;top:100px;width:100px;height:100px;opacity:0.5'/>
export function bindFileControl(btnEle, accept, opt) {
    let fileEle = document.createElement('input')
    fileEle.setAttribute('type', 'file')
    fileEle.setAttribute('accept', accept)
    fileEle.addEventListener('change', function () {
        let file = this.files[0] // 获取file对象
        // 判断file的类型是不是图片类型。
        // if(!file || !/image\/\w+/.test(file.type)){ 
        // 	console.log("文件必须为图片！"); 
        // 	return false; 
        // } 
        if (!file) {
            if (opt.errorCallback) opt.errorCallback({})
            return
        }
        let reader = new FileReader() // 声明一个FileReader实例
        // 最后在onload事件中，获取到成功读取的文件内容，并以插入一个img节点的方式显示选中的图片
        reader.onload = function () {
            // alert(reader.readyState)
            if (opt.successCallback) opt.successCallback(this)

        }
        reader.onerror = function () {
            if (opt.errorCallback) opt.errorCallback(this)
        }
        reader.readAsDataURL(file) // 调用readAsDataURL方法来读取选中的图像文件

    })
    btnEle.onclick = function () {
        fileEle.click()
    }
    return fileEle
}

// 延迟
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// 是否有上一页
export function isPreviousPage() {
    if (window.history.length == 1) return false
    const state = window.history.state
    if (state && state.back === null && state.position === 0) {
        return false
    }
    return true
}

