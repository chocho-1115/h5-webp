
let utils = {
    // window.onload
    whenWindowLoad(func) {
        let oldonload = window.onload
        if (typeof window.onload != 'function') {
            window.onload = func
        } else {
            window.onload = function () {
                oldonload()
                func()
            }
        }
    },
    // jq的document.ready
    whenDomReady: function () {
        let funcs = []
        let ready = false // 当触发事件处理程序时,切换为true

        // 当文档就绪时,调用事件处理程序
        function handler(e) {
            if (ready) return // 确保事件处理程序只完整运行一次

            // 如果发生onreadystatechange事件，但其状态不是complete的话,那么文档尚未准备好
            if (e.type === 'onreadystatechange' && document.readyState !== 'complete') {
                return
            }

            // 运行所有注册函数
            // 注意每次都要计算funcs.length
            // 以防这些函数的调用可能会导致注册更多的函数
            for (let i = 0; i < funcs.length; i++) {
                funcs[i].call(document)
            }
            // 事件处理函数完整执行,切换ready状态, 并移除所有函数
            ready = true
            funcs = null
        }
        // 为接收到的任何事件注册处理程序
        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', handler, false)
            document.addEventListener('readystatechange', handler, false) // IE9+
            window.addEventListener('load', handler, false)
        } else if (document.attachEvent) {
            document.attachEvent('onreadystatechange', handler)
            window.attachEvent('onload', handler)
        }
        // 返回whenDomReady()函数
        return function (fn) {
            if (ready) { fn.call(document) }
            else { funcs.push(fn) }
        }
    }(),
    // 固定宽度适配时高度不够
    setViewportMinHeight(minH, callback) {
        let metaEle = document.getElementById('viewEle')
        if (!metaEle) return
        let winW = document.documentElement.clientWidth
        let winH = document.documentElement.clientHeight
        if (minH && winH < minH) {
            let w = minH * winW / winH
            document.getElementById('viewEle').setAttribute('content', 'width=' + w + ', user-scalable=no,target-densitydpi = device-dpi')
        }
        callback && callback()
    },
    
    // 获取浏览器前缀
    getBrowserPrefix() {
        /*
		获取浏览器前缀：
			文档模式为 [ie8- 和 [Opera12.16- prefix 将返回null；
			(Opera12.16+ 内核改为谷歌内核 将返回 webkit 前缀；
			不过这些浏览器没有必要获取浏览器前缀了 浏览器前缀主要用于css3 而这些老古董浏览器不支持大部分的css3；
		*/
        if (window.opera || !window.getComputedStyle) return null
        let styles = window.getComputedStyle(document.documentElement, ''),
            pre = (Array.prototype.slice
                .call(styles)
                .join('')
                .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1],
            dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1]
        return {
            dom: dom,
            lowercase: pre,
            css: '-' + pre + '-',
            js: pre[0].toUpperCase() + pre.substring(1)
        }
    },
    

    // 获取农历日期
    getLunarDay(solarYear, solarMonth, solarDay) {
        solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11
        let madd = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
        let tgString = '甲乙丙丁戊己庚辛壬癸'
        let dzString = '子丑寅卯辰巳午未申酉戌亥'
        let numString = '一二三四五六七八九十'
        let monString = '正二三四五六七八九十冬腊'
        // let weekString = "日一二三四五六";
        let sx = '鼠牛虎兔龙蛇马羊猴鸡狗猪'
        let cYear, cMonth, cDay, TheDate
        let CalendarData = new Array(0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95)

        function GetBit(m, n) {
            return (m >> n) & 1
        }
        function e2c() {
            TheDate = (arguments.length != 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2])
            let total, m, n, k
            let isEnd = false
            let tmp = TheDate.getYear()
            if (tmp < 1900) {
                tmp += 1900
            }
            total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38

            if (TheDate.getYear() % 4 == 0 && TheDate.getMonth() > 1) {
                total++
            }
            for (m = 0; ; m++) {
                k = (CalendarData[m] < 0xfff) ? 11 : 12
                for (n = k; n >= 0; n--) {
                    if (total <= 29 + GetBit(CalendarData[m], n)) {
                        isEnd = true; break
                    }
                    total = total - 29 - GetBit(CalendarData[m], n)
                }
                if (isEnd) break
            }
            cYear = 1921 + m
            cMonth = k - n + 1
            cDay = total
            if (k == 12) {
                if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) {
                    cMonth = 1 - cMonth
                }
                if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
                    cMonth--
                }
            }
        }

        e2c(solarYear, solarMonth, solarDay)

        let res = {}
        res.year = tgString.charAt((cYear - 4) % 10) + dzString.charAt((cYear - 4) % 12)
        res.signs = sx.charAt((cYear - 4) % 12)
        res.month = cMonth < 1 ? '(闰)' + monString.charAt(-cMonth - 1) : monString.charAt(cMonth - 1)

        res.day = (cDay < 11) ? '初' : ((cDay < 20) ? '十' : ((cDay < 30) ? '廿' : '三十'))
        if (cDay % 10 != 0 || cDay == 10) {
            res.day += numString.charAt((cDay - 1) % 10)
        }
        return res
    },

    // 这里的获取exif要将图片转ArrayBuffer对象，这里假设获取了图片的baes64
    // 步骤一
    // base64转ArrayBuffer对象

    /*
	orientation值	旋转角度
	1	0°
	3	180°
	6	顺时针90°
	8	逆时针90°

	*/
    exifOrientation(base64) {
        function base64ToArrayBuffer(base64) {
            base64 = base64.replace(/^data:([^;]+);base64,/gmi, '')
            let binary = atob(base64)
            let len = binary.length
            let buffer = new ArrayBuffer(len)
            let view = new Uint8Array(buffer)
            for (let i = 0; i < len; i++) {
                view[i] = binary.charCodeAt(i)
            }
            return buffer
        }
        // 步骤二，Unicode码转字符串
        // ArrayBuffer对象 Unicode码转字符串
        function getStringFromCharCode(dataView, start, length) {
            let str = ''
            let i
            for (i = start, length += start; i < length; i++) {
                str += String.fromCharCode(dataView.getUint8(i))
            }
            return str
        }

        // 步骤三，获取jpg图片的exif的角度（在ios体现最明显）
        function getOrientation(arrayBuffer) {
            let dataView = new DataView(arrayBuffer)
            let length = dataView.byteLength
            let orientation
            let exifIDCode
            let tiffOffset
            let firstIFDOffset
            let littleEndian
            let endianness
            let app1Start
            let ifdStart
            let offset
            let i
            // Only handle JPEG image (start by 0xFFD8)
            if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
                offset = 2
                while (offset < length) {
                    if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
                        app1Start = offset
                        break
                    }
                    offset++
                }
            }
            if (app1Start) {
                exifIDCode = app1Start + 4
                tiffOffset = app1Start + 10
                if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
                    endianness = dataView.getUint16(tiffOffset)
                    littleEndian = endianness === 0x4949

                    if (littleEndian || endianness === 0x4D4D /* bigEndian */) {
                        if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
                            firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian)

                            if (firstIFDOffset >= 0x00000008) {
                                ifdStart = tiffOffset + firstIFDOffset
                            }
                        }
                    }
                }
            }
            if (ifdStart) {
                length = dataView.getUint16(ifdStart, littleEndian)

                for (i = 0; i < length; i++) {
                    offset = ifdStart + i * 12 + 2
                    if (dataView.getUint16(offset, littleEndian) === 0x0112 /* Orientation */) {

                        // 8 is the offset of the current tag's value
                        offset += 8

                        // Get the original orientation value
                        orientation = dataView.getUint16(offset, littleEndian)

                        // Override the orientation with its default value for Safari (#120)
                        // if (IS_SAFARI_OR_UIWEBVIEW) {
                        // dataView.setUint16(offset, 1, littleEndian);
                        // }
                        break
                    }
                }
            }
            return orientation
        }
        let data = base64ToArrayBuffer(base64)
        return getOrientation(data)
    }
}

export default utils