// https://github.com/chocho-1115/h5-webp

var utils = {
	// window.onload
	whenWindowLoad(func) {
		var oldonload = window.onload;
		if (typeof window.onload != 'function') {
			window.onload = func;
		} else {
			window.onload = function () {
				oldonload();
				func();
			}
		}
	},
	// jq的document.ready
	whenDomReady: function () {
		var funcs = [];
		var ready = false; // 当触发事件处理程序时,切换为true

		// 当文档就绪时,调用事件处理程序
		function handler(e) {
			if (ready) return; // 确保事件处理程序只完整运行一次

			//如果发生onreadystatechange事件，但其状态不是complete的话,那么文档尚未准备好
			if (e.type === 'onreadystatechange' && document.readyState !== 'complete') {
				return;
			}

			//运行所有注册函数
			//注意每次都要计算funcs.length
			//以防这些函数的调用可能会导致注册更多的函数
			for (var i = 0; i < funcs.length; i++) {
				funcs[i].call(document);
			}
			//事件处理函数完整执行,切换ready状态, 并移除所有函数
			ready = true;
			funcs = null;
		}
		// 为接收到的任何事件注册处理程序
		if (document.addEventListener) {
			document.addEventListener('DOMContentLoaded', handler, false);
			document.addEventListener('readystatechange', handler, false); // IE9+
			window.addEventListener('load', handler, false);
		} else if (document.attachEvent) {
			document.attachEvent('onreadystatechange', handler);
			window.attachEvent('onload', handler);
		}
		// 返回whenDomReady()函数
		return function (fn) {
			if (ready) { fn.call(document); }
			else { funcs.push(fn); }
		}
	}(),
	// 固定宽度适配时高度不够
	setViewportMinHeight(minH, callback) {
		var metaEle = document.getElementById('viewEle');
		if (!metaEle) return;
		var winW = document.documentElement.clientWidth;
		var winH = document.documentElement.clientHeight;
		if (minH && winH < minH) {
			var w = minH * winW / winH;
			document.getElementById('viewEle').setAttribute('content', 'width=' + w + ', user-scalable=no,target-densitydpi = device-dpi');
		}
		callback && callback();
	},
	// 倒计时
	countDown(endTime, opt) {
		opt.framerate = opt.framerate || 1;
		opt.nowTime = opt.nowTime || new Date().getTime();
		var res = {
			death: false,
			day: 0,
			hour: 0,
			minute: 0,
			second: 0,
			millisecond: 0
		};
		var sys_millisecond = endTime - opt.nowTime;
		var sys_millisecond_speed = 1000 / opt.framerate;
		function anim() {
			if (sys_millisecond < sys_millisecond_speed) {
				clearInterval(timer);
				res.death = true;//
				res.day = 0;//计算天
				res.hour = 0;//计算小时
				res.minute = 0;//计算分钟
				res.second = 0;//计算秒杀
				res.millisecond = 0;
				if (opt.onUpdate) opt.onUpdate(res);
				if (opt.onComplete) opt.onComplete(res);
			} else {
				res.day = Math.floor((sys_millisecond / 1000 / 3600) / 24);
				res.hour = Math.floor((sys_millisecond / 1000 / 3600) % 24);
				res.minute = Math.floor((sys_millisecond / 1000 / 60) % 60);
				res.second = Math.floor(sys_millisecond / 1000 % 60);
				res.millisecond = Math.floor(sys_millisecond % 1000);
				sys_millisecond -= sys_millisecond_speed;
				if (opt.onUpdate) opt.onUpdate(res);
			}
		}
		var timer = setInterval(anim, sys_millisecond_speed);
		anim();
		return timer;
	},
	clock (opt){
		opt.framerate = opt.framerate||1;
		opt.nowTime = opt.nowTime||new Date().getTime();
		var startTime = new Date().getTime();
		var res = {
			year: 0,
			month: 0,
			date: 0,
			hour: 0,
			minute: 0,
			second: 0,
			millisecond: 0
		};
		function anim(){
			var time = (new Date().getTime() - startTime) + opt.nowTime
			var D = new Date(time);
			res.year = D.getFullYear();
			res.month = D.getMonth()+1;
			res.date = D.getDate();
			res.hour = D.getHours();
			res.minute = D.getMinutes();
			res.second = D.getSeconds();
			res.millisecond = D.getMilliseconds();
			if(opt.onUpdate)opt.onUpdate(res);
		}
		var timer = setInterval(anim, 1000/opt.framerate);
		anim();
		return timer;
	},
	// 复制
	copyText(text, success) {
		// 数字没有 .length 不能执行selectText 需要转化成字符串
		const textString = text.toString();
		let input = document.querySelector('#copy-input');
		if (!input) {
			input = document.createElement('input');
			input.id = "copy-input";
			input.readOnly = "readOnly";        // 防止ios聚焦触发键盘事件
			input.style.position = "fixed";
			input.style.left = "-1000px";
			input.style.zIndex = "-1000";
			document.body.appendChild(input);
		}
		input.value = textString;
		// ios必须先选中文字且不支持 input.select();
		selectText(input, 0, textString.length);
		if (document.execCommand('copy')) {
			document.execCommand('copy');
			if (success) {
				success(textString)
			} else {
				alert('已复制到粘贴板');
			}

		} else {
			console.log('不兼容');
		}
		input.blur();
		// input自带的select()方法在苹果端无法进行选择，所以需要自己去写一个类似的方法
		// 选择文本。createTextRange(setSelectionRange)是input方法
		function selectText(textbox, startIndex, stopIndex) {
			if (textbox.createTextRange) {//ie
				const range = textbox.createTextRange();
				range.collapse(true);
				range.moveStart('character', startIndex);//起始光标
				range.moveEnd('character', stopIndex - startIndex);//结束光标
				range.select();//不兼容苹果
			} else {//firefox/chrome
				textbox.setSelectionRange(startIndex, stopIndex);
				textbox.focus();
			}
		}
	},
	// 函数防抖 多次触发只执行最后一次  此函数不执行第一次触发
	debounce (method, delay){
		let timeout;
        return function () {
            let context = this; // 保存this指向
            let args = arguments; // 拿到event对象
            clearTimeout(timeout)
            timeout = setTimeout(function(){
                method.apply(context, args)
            }, delay);
        }
	},
    // 函数节流 多次触发时减少触发频次 此函数会执行第一次触发
    throttle (method, delay) {
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
                }, remaining);
            }
        }
    },
	browserDetect() {
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
		obj.isPad = obj.agent.toLowerCase().indexOf("pad") > -1;// 安卓pad 和 ios pad
		return obj;
	},
	// 获取浏览器前缀
	getBrowserPrefix() {
		/*
		获取浏览器前缀：
			文档模式为 [ie8- 和 [Opera12.16- prefix 将返回null；
			(Opera12.16+ 内核改为谷歌内核 将返回 webkit 前缀；
			不过这些浏览器没有必要获取浏览器前缀了 浏览器前缀主要用于css3 而这些老古董浏览器不支持大部分的css3；
		*/
		if (window.opera || !window.getComputedStyle) return null;
		var styles = window.getComputedStyle(document.documentElement, ''),
			pre = (Array.prototype.slice
				.call(styles)
				.join('')
				.match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1],
			dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
		return {
			dom: dom,
			lowercase: pre,
			css: '-' + pre + '-',
			js: pre[0].toUpperCase() + pre.substr(1)
		};
	},
	// 预载器
	preload(srcArr, params) {
		if (typeof (srcArr) == 'string') {
			srcArr = [{ path: srcArr }];
		};
		if (srcArr.length == 0) { params.complete && params.complete({}); return false };
		var num = 0,
			imgArrObj = {},
			minTime = params.minTime || 0,
			baseUrl = params.baseUrl || '',
			len = srcArr.length,
			t = minTime / len,
			st = (new Date()).getTime();

		for (var i = 0; i < len; i++) {
			(function (i) {
				if (typeof (srcArr[i]) == 'string') srcArr[i] = { path: srcArr[i], name: i };
				var newImg = new Image();
				if (srcArr[i].crossOrigin) newImg.crossOrigin = srcArr[i].crossOrigin;
				newImg.onload = newImg.onerror = function (e) {
					e = e || window.event;
					var self = this;
					endLoad(self, e.type, i);
				};
				setTimeout(function () {
					newImg.src = baseUrl + srcArr[i].path;
				}, t * (i + 1) - ((new Date()).getTime() - st));
			}(i));
		}
		function endLoad(this_, eType, i) {
			num++;
			var progress = num / len;
			srcArr[i]['result'] = this_;
			srcArr[i]['progress'] = progress;
			srcArr[i]['index'] = i;
			srcArr[i]['status'] = eType == 'load' ? 200 : 'Failed to load';
			imgArrObj[srcArr[i].name] = this_;
			params.fileload && params.fileload(srcArr[i]);
			if (num === len) params.complete && params.complete(imgArrObj);
		}
	},
	// 
	lazyLoad(selector, params) {
		params = params || {};
		var doc = document,
			assets = [],
			ele = doc.querySelectorAll(selector),
			baseUrl = params.baseUrl || '';

		for (var i = 0, len = ele.length; i < len; i++) {
			var id = i;
			var obj = { path: '', type: '', ele: ele[i], name: '_' + i, crossOrigin: null }
			if (ele[i].nodeName === 'IMG') {
				obj.type = 'img';
			} else {
				obj.type = 'bj';
			}
			obj.path = ele[i].getAttribute('data-src');
			obj.crossOrigin = ele[i].getAttribute('crossOrigin');
			// 过滤已转为base64的图片
			var result = /^data\:([^\;]+)\;base64,/gmi;
			if (result.test(obj.path)) {
				if (obj.type == 'img') {
					obj.ele.setAttribute('src', obj.path);
				} else if (obj.type == 'bj') {
					obj.ele.style.backgroundImage = 'url(' + obj.path + ')';
				}
				continue;
			}
			if (obj.path) {
				assets.push(obj)
			}
		};
		this.preload(assets, {
			fileload: function (item) {
				if (item.status === 200) {
					if (item.type == 'img') {
						item.ele.setAttribute('src', baseUrl + item.path);
					} else if (item.type == 'bj') {
						item.ele.style.backgroundImage = 'url(' + baseUrl + item.path + ')';
					}
				}
				if (params.fileload) params.fileload(item);
			},
			complete: function (result) {
				if (params.complete) params.complete(result);
			},
			minTime: params.minTime,
			baseUrl: baseUrl
		})
	},
	// 获取地址参数
	queryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return decodeURIComponent(r[2]);
		return null;
	},
	// 生成随机字符串
	getRandomStr(len) {
		len = len || 32;
		var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';// 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
		var maxPos = $chars.length;
		var sttr = '';
		for (var i = 0; i < len; i++) {
			sttr += $chars.charAt(Math.floor(Math.random() * maxPos));
		}
		return sttr;
	},
	//整数[]  任意数（）
	getRandomNum(Min, Max, integerB) {
		if (integerB) {
			return (Math.floor(Math.random() * (Max - Min + 1) + Min))
		} else {
			return (Min + Math.random() * (Max - Min))
		}
	},
	// 获取农历日期
	getLunarDay(solarYear, solarMonth, solarDay) {
		solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;
		var madd = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
		var tgString = "甲乙丙丁戊己庚辛壬癸";
		var dzString = "子丑寅卯辰巳午未申酉戌亥";
		var numString = "一二三四五六七八九十";
		var monString = "正二三四五六七八九十冬腊";
		var weekString = "日一二三四五六";
		var sx = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
		var cYear, cMonth, cDay, TheDate;
		var CalendarData = new Array(0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95);

		function GetBit(m, n) {
			return (m >> n) & 1;
		}
		function e2c() {
			TheDate = (arguments.length != 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
			var total, m, n, k;
			var isEnd = false;
			var tmp = TheDate.getYear();
			if (tmp < 1900) {
				tmp += 1900;
			}
			total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38;

			if (TheDate.getYear() % 4 == 0 && TheDate.getMonth() > 1) {
				total++;
			}
			for (m = 0; ; m++) {
				k = (CalendarData[m] < 0xfff) ? 11 : 12;
				for (n = k; n >= 0; n--) {
					if (total <= 29 + GetBit(CalendarData[m], n)) {
						isEnd = true; break;
					}
					total = total - 29 - GetBit(CalendarData[m], n);
				}
				if (isEnd) break;
			}
			cYear = 1921 + m;
			cMonth = k - n + 1;
			cDay = total;
			if (k == 12) {
				if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) {
					cMonth = 1 - cMonth;
				}
				if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
					cMonth--;
				}
			}
		}

		e2c(solarYear, solarMonth, solarDay);

		var res = {};
		res.year = tgString.charAt((cYear - 4) % 10) + dzString.charAt((cYear - 4) % 12);
		res.signs = sx.charAt((cYear - 4) % 12);
		res.month = cMonth < 1 ? "(闰)" + monString.charAt(-cMonth - 1) : monString.charAt(cMonth - 1);

		res.day = (cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay < 30) ? "廿" : "三十"));
		if (cDay % 10 != 0 || cDay == 10) {
			res.day += numString.charAt((cDay - 1) % 10);
		}
		return res;
	},
	// 上传组件
	//<input class="abso upimg" id="upimg" accept="image/*" type="file" style='left:100px;top:100px;width:100px;height:100px;opacity:0.5'/>
	bindFileControl(btnEle, accept, opt) {
		var fileEle = document.createElement('input');
		fileEle.setAttribute('type', 'file');
		fileEle.setAttribute('accept', accept);
		fileEle.addEventListener('change', function () {
			var file = this.files[0]; //获取file对象
			//判断file的类型是不是图片类型。
			// if(!file || !/image\/\w+/.test(file.type)){ 
			// 	console.log("文件必须为图片！"); 
			// 	return false; 
			// } 
			if (!file) {
				if (opt.errorCallback) opt.errorCallback({});
				return;
			}
			var reader = new FileReader(); //声明一个FileReader实例
			//最后在onload事件中，获取到成功读取的文件内容，并以插入一个img节点的方式显示选中的图片
			reader.onload = function (e) {
				//alert(reader.readyState)
				if (opt.successCallback) opt.successCallback(this)

			}
			reader.onerror = function (e) {
				if (opt.errorCallback) opt.errorCallback(this)
			}
			reader.readAsDataURL(file); //调用readAsDataURL方法来读取选中的图像文件

		});
		btnEle.onclick = function () {
			fileEle.click();
		}
		return fileEle;
	},
	isIos: function () {
		return navigator.userAgent.match(/(iOS|iPhone|iPad)/i);
	},
	isAndroid: function () {
		return navigator.userAgent.match(/(Android)/i);
	},
	// 是否为手机号码
	isMobile(str) {
		if (str == null || str == "") return false;
		//var result=str.match(/^((\(\d{2,3}\))|(\d{3}\-))?((13\d{9})|(15\d{9})|(18\d{9}))$/);
		var result = str.match(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/);
		if (result == null) return false;
		return true;
	},
	// 是否为邮箱
	isEmail(str) {
		if (str == null || str == "") return false;
		var result = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		if (result.test(str)) {
			return true;
		} else {
			return false;
		}
	},
	// 是否为身份证
	// 函数参数必须是字符串，因为二代身份证号码是十八位，而在javascript中，十八位的数值会超出计算范围，造成不精确的结果，导致最后两位和计算的值不一致，从而该函数出现错误。
	isIDCard(idcode) {
		// 加权因子
		var weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
		// 校验码
		var check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

		var code = idcode + "";
		var last = idcode[17];//最后一位

		var seventeen = code.substring(0, 17);

		// ISO 7064:1983.MOD 11-2
		// 判断最后一位校验码是否正确
		var arr = seventeen.split("");
		var len = arr.length;
		var num = 0;
		for (var i = 0; i < len; i++) {
			num = num + arr[i] * weight_factor[i];
		}

		// 获取余数
		var resisue = num % 11;
		var last_no = check_code[resisue];

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
		var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;

		// 判断格式是否正确
		var format = idcard_patter.test(idcode);

		// 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
		return last === last_no && format ? true : false;
	},
	// 是否为微信环境
	isWechat(includePc) {
		var isWechat = navigator.userAgent.match(/MicroMessenger/i);
		if (!includePc && navigator.userAgent.match(/(WindowsWechat|MacWechat)/i)) isWechat = false;
		return !!isWechat;
	},
	// 压缩图片
	// quality 可选
	// 在指定图片格式为 image/jpeg 或 image/webp的情况下，可以从 0 到 1 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 0.92。其他参数会被忽略。
	compressionPIC(src, opt, callback) {
		var self = this;
		var maxSize = Math.max(opt.maxSize, 0) || 0;
		var exif_orientation = opt.exif_orientation || 0;
		var type = opt.type || 'image/png';
		var quality = opt.quality || 0.92;
		var encode = opt.encode || 'base64';//支持 base64、blob、file 默认base64

		var Img = new Image();
		Img.onload = init;
		Img.onerror = function () {
			var Img = new Image();
			Img.onload = init;
			Img.src = src;
		}

		Img.crossOrigin = 'Anonymous';//解决跨域问题，需在服务器端运行，也可为 anonymous   
		Img.src = src;

		function init(name) {

			var canvas = document.createElement('canvas');

			if (!maxSize) maxSize = Math.max(this.width, this.height);

			//图片原始尺寸
			var sw = this.width;
			var sh = this.height;
			//缩放后的尺寸
			var ew = 0, eh = 0;
			if (sw >= sh) {
				ew = Math.min(maxSize, sw)
				eh = sh * ew / sw;
			} else {
				eh = Math.min(maxSize, sh);
				ew = sw * eh / sh;
			}

			//	Orientation  1	0°  3	180°  6	顺时针90°  8	逆时针90°
			//画布尺寸 输出尺寸
			var canW = ew, canH = eh;
			var rotate = 0;
			if (exif_orientation == 6) {
				canW = eh;
				canH = ew;
				rotate = 90
			} else if (exif_orientation == 8) {
				canW = eh;
				canH = ew;
				rotate = -90
			} else if (exif_orientation == 3) {
				rotate = 180
			}

			canvas.width = canW;
			canvas.height = canH;
			var ctx = canvas.getContext("2d");
			ctx.translate(canW / 2, canH / 2);
			ctx.rotate(Math.PI / 180 * rotate);

			ctx.drawImage(this, -ew / 2, -eh / 2, ew, eh);
			//ctx.drawImage(this, 0, 0, this.width, this.height, -h/2, -w/2, h, w);

			// 导出 base64
			callback && encode === 'base64' && callback({
				width: canW,
				height: canH,
				result: canvas.toDataURL(type, quality)
			});
			// 导出 blob
			callback && encode === 'blob' && canvas.toBlob(function (blob) {
				callback({
					width: canW,
					height: canH,
					result: blob
				});
			}, type);
			// 导出 file
			callback && encode === 'file' && canvas.toBlob(function (blob) {
				var filesName = self.getRandomStr(8);
				var files = new File([blob], filesName, { type: type });
				callback({
					width: canW,
					height: canH,
					result: files
				});
			}, type);
		}
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
			base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
			var binary = atob(base64);
			var len = binary.length;
			var buffer = new ArrayBuffer(len);
			var view = new Uint8Array(buffer);
			for (var i = 0; i < len; i++) {
				view[i] = binary.charCodeAt(i);
			}
			return buffer;
		}
		// 步骤二，Unicode码转字符串
		// ArrayBuffer对象 Unicode码转字符串
		function getStringFromCharCode(dataView, start, length) {
			var str = '';
			var i;
			for (i = start, length += start; i < length; i++) {
				str += String.fromCharCode(dataView.getUint8(i));
			}
			return str;
		}

		// 步骤三，获取jpg图片的exif的角度（在ios体现最明显）
		function getOrientation(arrayBuffer) {
			var dataView = new DataView(arrayBuffer);
			var length = dataView.byteLength;
			var orientation;
			var exifIDCode;
			var tiffOffset;
			var firstIFDOffset;
			var littleEndian;
			var endianness;
			var app1Start;
			var ifdStart;
			var offset;
			var i;
			// Only handle JPEG image (start by 0xFFD8)
			if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
				offset = 2;
				while (offset < length) {
					if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
						app1Start = offset;
						break;
					}
					offset++;
				}
			}
			if (app1Start) {
				exifIDCode = app1Start + 4;
				tiffOffset = app1Start + 10;
				if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
					endianness = dataView.getUint16(tiffOffset);
					littleEndian = endianness === 0x4949;

					if (littleEndian || endianness === 0x4D4D /* bigEndian */) {
						if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
							firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);

							if (firstIFDOffset >= 0x00000008) {
								ifdStart = tiffOffset + firstIFDOffset;
							}
						}
					}
				}
			}
			if (ifdStart) {
				length = dataView.getUint16(ifdStart, littleEndian);

				for (i = 0; i < length; i++) {
					offset = ifdStart + i * 12 + 2;
					if (dataView.getUint16(offset, littleEndian) === 0x0112 /* Orientation */) {

						// 8 is the offset of the current tag's value
						offset += 8;

						// Get the original orientation value
						orientation = dataView.getUint16(offset, littleEndian);

						// Override the orientation with its default value for Safari (#120)
						//if (IS_SAFARI_OR_UIWEBVIEW) {
						//dataView.setUint16(offset, 1, littleEndian);
						//}
						break;
					}
				}
			}
			return orientation;
		}
		var data = base64ToArrayBuffer(base64);
		return getOrientation(data);
	}
};

export default utils;