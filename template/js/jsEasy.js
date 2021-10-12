// https://github.com/chocho-1115/h5-webp by 杨燚平 email：849890769@qq.com

$('img').on('click',function(e){
	if(e.target.parentNode.nodeName=='A')return;
	e.preventDefault();
})

document.body.ondragstart=function(e){
	e.preventDefault();
}

if(document.querySelector('#fx')){
	$('.fxBtn').on('click',function(){$('#fx').fadeIn(500);});
	$('#fx').on('click',function(){$(this).fadeOut(500);});
}

if(document.querySelector('#tipsBox')){
	$('#tipsBox').on('click',function(){
		if($('#tipsBox').attr('close')=='true')$(this).fadeOut(500);
	});
}

$('.close').on('click',function(e){
	$(this.parentNode).css('display','none');
});

$("input,select,textarea").not('.no-blur').blur(function(){
	// 延迟0秒 解决在聚焦时 点击页面提交按钮无法触发提交事件的问题
	setTimeout(function(){
		$(window).scrollTop(0);
	},0);
});

$("select").change(function(){
	var v = $(this).val();
	if(v==''){
		$(this).addClass('select-placeholder');
	}else{
		$(this).removeClass('select-placeholder');
	}
});



//var thisData = new Date();
//thisData.format("yyyy/MM/dd")
Date.prototype.format = function(format)   
{   
   var o = {   
     "M+" : this.getMonth()+1, //month   
     "d+" : this.getDate(),    //day   
     "h+" : this.getHours(),   //hour   
     "m+" : this.getMinutes(), //minute   
     "s+" : this.getSeconds(), //second   
     "q+" : Math.floor((this.getMonth()+3)/3), //quarter   
     "S" : this.getMilliseconds() //millisecond   
   }   
   if(/(y+)/.test(format)) format=format.replace(RegExp.$1,   
     (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
   for(var k in o)if(new RegExp("("+ k +")").test(format))   
     format = format.replace(RegExp.$1,   
       RegExp.$1.length==1 ? o[k] :    
         ("00"+ o[k]).substr((""+ o[k]).length));   
   return format;   
};
 



//////////////////////////////////////////////

var JSeasy = {};
var J = JSeasy;

var publicInfo = {
	content : $('#content'),
	page : $('.page'),
	pageIndex : -1,
	pageStatus : -1,//页面切换状态
	pageCutover : true,//页面切换开关 可以用来从外部限制页面是否可以滑动翻页
	pageLen : 0,//总共多少页
	
	scale : 1,
	prefix : null,
	htmlFontSize : -1,
	
	pageSwipeB :[],
	
	pageAnimateTime: 0,
	pageAnimateType: 'fade',//fade translate threeD
	isRem : false, //是否为rem适配
	
	pageCallback: {}
};

publicInfo.pageLen = publicInfo.page.length;
JSeasy.publicInfo = publicInfo;


JSeasy.H5Init = function (opt){
	
	publicInfo.pageSwipeB = opt.pageSwipeB;
	publicInfo.scale = opt.scale||1;
	publicInfo.pageAnimateType = opt.pageAnimateType||'fade';
	publicInfo.pageAnimateTime = opt.pageAnimateTime===undefined?600:opt.pageAnimateTime;
	publicInfo.isRem = opt.isRem||false;
	
	
	JSeasy.pageAnimate[publicInfo.pageAnimateType+'Init']();
	
	//设置翻页事件
	if(publicInfo.page.length>0){
		
		var mc = new Hammer(publicInfo.content[0], {touchAction:'pan-x pan-y'});
		mc.get('swipe').set({velocity:0,threshold:30,direction:30});//修改滑动的速度与方向
		
		//下一页
		mc.on("swipeup",function(){
			if(!publicInfo.pageStatus)return false;
			if(!publicInfo.pageCutover)return false;
			if(publicInfo.pageSwipeB[publicInfo.pageIndex]===false||publicInfo.pageSwipeB[publicInfo.pageIndex]<0)return false;
			var nextPage = publicInfo.page.eq(publicInfo.pageIndex).attr('next-page')
			if(nextPage){
				J.gotoPage(Number(nextPage));
			}else{
				J.gotoPage(publicInfo.pageIndex+1);
			}
		});
		//上一页
		mc.on("swipedown",function(){
			if(!publicInfo.pageStatus)return false;
			if(!publicInfo.pageCutover)return false;
			if(publicInfo.pageSwipeB[publicInfo.pageIndex]===false||publicInfo.pageSwipeB[publicInfo.pageIndex]>0)return false;
			
			var nextPage = publicInfo.page.eq(publicInfo.pageIndex).attr('previous-page')
			if(nextPage){
				J.gotoPage(Number(nextPage));
			}else{
				J.gotoPage(publicInfo.pageIndex-1);
			}
		});
	}
};


//rem适配   DOMContentLoaded
// JSeasy.remInit = function(opt){
// 	var docEl = document.documentElement,
// 		resizeEvt = 'onorientationchange' in window ? 'orientationchange' : 'resize',
// 		viewportMinHeight = opt.viewportMinHeight,
// 		baseWidth = opt.baseWidth,
// 		maxWidth = opt.maxWidth ? opt.maxWidth : 10000,
// 		zoomOutByHeight = false,
// 		recalc = null,
// 		timer = null;

// 	if(viewportMinHeight && docEl.clientWidth/docEl.clientHeight>baseWidth/viewportMinHeight){
// 		zoomOutByHeight = true;
// 	}
// 	recalc = function () {
// 		var clientWidth = docEl.clientWidth;
// 		var clientHeight = docEl.clientHeight;
// 		if(zoomOutByHeight){
// 			var v = 100 * (clientHeight / viewportMinHeight);
// 		}else{
// 			var v = 100 * (Math.min(clientWidth, maxWidth) / baseWidth);
// 		}
// 		docEl.style.fontSize = v + 'px';
// 		docEl.setAttribute('data', v);
// 	};

// 	if (!window.addEventListener) return;
// 	window.addEventListener(resizeEvt, function(){
// 		if(timer) clearTimeout(timer);
// 		timer = setTimeout(recalc, 800);
// 	}, false);
// 	// doc.addEventListener('DOMContentLoaded', recalc, false);
// 	recalc();
// };

//rem适配   DOMContentLoaded
JSeasy.remInit = function(config){
	
	var docEl = document.documentElement,
		resizeEvt = 'onorientationchange' in window ? 'orientationchange' : 'resize',
		timer = null;

	// 可配置参数
	var isLandscape = config.isLandscape ? true : false; // 是否横屏 这里是只页面是否要横屏展示 并不代表当前的设备状态
	var autoRotatingScreen = config.autoRotatingScreen===false ? false : true; // 自动旋转屏幕 当设置为false时 如果用户开启了自动旋转屏幕 讲会在横屏时显示提示层

	// 添加横屏标识
	if(isLandscape) docEl.classList.add('landscape');

	window.addEventListener(resizeEvt, function(){
		if(timer) clearTimeout(timer);
		// 下面的延迟是必要的
		// ios 下 resize|orientationchange 事件 需要延迟1秒 不然rem适配时获取的屏幕宽高值不对 比如在ios的safari下 pc手机调试模式下 或者部分安卓机下
		timer = setTimeout(changeFunc, 1000);
	}, false);
	// doc.addEventListener('DOMContentLoaded', recalc, false);
	changeFunc();

	function changeFunc(){
		if(
			!isLandscape // 非横屏展示
			||
			window.orientation === undefined // pc端 不考虑横屏问题
		){
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
			if(!autoRotatingScreen) $('.rotateWindows_tips').css('display','none');
			recalc({
				viewportMinHeight: config.baseWidth,
				baseWidth: config.viewportMinHeight,
				maxWidth: config.viewportMinHeight
			});
		} else if (window.orientation == 90 || window.orientation == -90) {
			// console.log('===横着的==='+window.orientation)
			docEl.classList.remove('rotateWin');
			if(!autoRotatingScreen) $('.rotateWindows_tips').css('display','block');
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

		if(viewportMinHeight && docEl.clientWidth/docEl.clientHeight>baseWidth/viewportMinHeight){
			zoomOutByHeight = true;
		}
		console.log('zoomOutByHeight:'+zoomOutByHeight)
		//
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

};




// JSeasy.rotateWindows = function(opt){

// 	opt = opt||{};
// 	var isSet = false;
	
// 	$('body').addClass('horizontalWindows');//水平窗口
	
// 	changeFunc();
// 	//window.addEventListener('orientationchange', changeFunc);
// 	window.addEventListener('resize', changeFunc);
// 	function changeFunc(event){
// 		//pc端
// 		if(window.orientation===undefined){
// 			var winW = window.innerWidth, winH = window.innerHeight;
// 			$('.content').css({width:winW,height:winH});
// 			opt.callback&&opt.callback({winW:winW,winH:winH});
// 			return false
// 		}
		
// 		//alert(window.orientation)
// 		if ( window.orientation === 180 || window.orientation === 0 ) {//竖着的
// 			if(!isSet){

// 				//opt.callback&&opt.callback();
// 				//J.setViewportMinHeight(opt.viewportMinHeight||1008);
// 				J.setViewportMinHeight(opt.viewportMinHeight||1008, function(){
// 					opt.callback&&opt.callback();
// 				});

// 				isSet = true;
// 				// var winW = window.innerHeight, winH = window.innerWidth;
// 				var winW = document.documentElement.clientHeight, winH = document.documentElement.clientWidth;
// 				//winW = $('body').height();//window.innerHeight;
// 				$('.content').css({
// 					//position:'absolute',
// 					//left:'50%',
// 					//top:'50%',
// 					transform:'rotate(90deg)',
// 					width:winW,
// 					height:winH,
// 					marginLeft:winW/-2,
// 					marginTop:winH/-2
// 				})
				
// 			}
// 			$('.rotateWindows_tips').css('display','none');
// 			opt.onRotate&&opt.onRotate(0);
// 		}else if( window.orientation == 90 || window.orientation == -90 ) {
// 			$('.rotateWindows_tips').css('display','block');
// 			opt.onRotate&&opt.onRotate(90);
// 		}
// 	}
// }

JSeasy.getPrefix = function(){
	/*
	获取浏览器前缀：
		文档模式为 [ie8- 和 [Opera12.16- prefix 将返回null；
		(Opera12.16+ 内核改为谷歌内核 将返回 webkit 前缀；
		不过这些浏览器没有必要获取浏览器前缀了 浏览器前缀主要用于css3 而这些老古董浏览器不支持大部分的css3；
	*/
	if(window.opera||!window.getComputedStyle)return null;
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
};

JSeasy.setViewportMinHeight = function(minH, callback){
	var metaEle = document.getElementById('viewEle');
	if(!metaEle)return;
	var winW = document.documentElement.clientWidth;
	var winH = document.documentElement.clientHeight;
	if(minH&&winH<minH){
		var w = minH*winW/winH;
		document.getElementById('viewEle').setAttribute('content','width='+w+', user-scalable=no,target-densitydpi = device-dpi');
	}
	callback&&callback();
};

JSeasy.countDown = function (endTime,opt){
		
	opt.framerate = opt.framerate||1;
	opt.nowTime = opt.nowTime||new Date().getTime();
	
	var res = {
		death: false,
		day: 0,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0
	};
	
	var sys_second = (endTime-opt.nowTime)/1000;
	var sys_second_speed = 1/opt.framerate;
	
	function anim(){
		if (sys_second < 1) {
			clearInterval(timer);
			res.death = true;//
			res.day = 0;//计算天
			res.hour = 0;//计算小时
			res.minute = 0;//计算分钟
			res.second = 0;//计算秒杀
			if(opt.onComplete)opt.onComplete(res);
		} else {
			res.day = Math.floor((sys_second / 3600) / 24);
			res.hour = Math.floor((sys_second / 3600) % 24);
			res.minute = Math.floor((sys_second / 60) % 60);
			res.second = Math.floor(sys_second % 60);
			res.millisecond = Math.floor(sys_second % 1 * 1000);
			sys_second -= sys_second_speed;
			if(opt.onUpdate)opt.onUpdate(res);
		}
		
	}
	// 
	var timer = setInterval(anim, 1000/opt.framerate);
	anim();
	return timer;
};

JSeasy.copyText = function (text, success){
	// 数字没有 .length 不能执行selectText 需要转化成字符串
	const textString = text.toString();
	let input = document.querySelector('#copy-input');
	if (!input) {
		input = document.createElement('input');
		input.id = "copy-input";
		input.readOnly = "readOnly";        // 防止ios聚焦触发键盘事件
		input.style.position = "absolute";
		input.style.left = "-1000px";
		input.style.zIndex = "-1000";
		document.body.appendChild(input);
	}
	input.value = textString;
	// ios必须先选中文字且不支持 input.select();
	selectText(input, 0, textString.length);
	if (document.execCommand('copy')) {
		document.execCommand('copy');
		if(success){
			success(textString)
		}else{
			alert('已复制到粘贴板');
		}
		
	}else {
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
};

JSeasy.throttle = function (method,context){
		//console.log(method.tId)
		if(method.tId)clearTimeout(method.tId);
		//console.log(method.tId)
		method.tId = setTimeout(function(){
			method.call(context);
		},100);
};

JSeasy.isTime = function (time,tips,callback){
	var t = (new Date(time)).getTime();
	var nowT = new Date().getTime();
	if(nowT<t){
		JSeasy.tipsText(tips,false)
		//$('#tipsBox').css('display','block');
		var anim = window.setInterval(function(){
			var nowT = new Date().getTime();
			//console.log(t-nowT)
			if(nowT>=t){
				$('#tipsBox').css('display','none');
				if(callback)callback()
				clearInterval(anim);
			}
		}, 1000); 
	}else{
		if(callback)callback()
		
	}
};

JSeasy.isWeixin = function (){
	var ua = window.navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) == 'micromessenger'){
		return true;
	}else{
		return false;
	}
}

JSeasy.browserDetect = function() {
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
},

JSeasy.setUpJt = function (B){
	if(B){
		$('#upJt').show();
	}else{
		$('#upJt').hide();
	}
};

JSeasy.tipsText = function (text,closeB){
	closeB = closeB===undefined?true:closeB;
	$('#tipsBox span').html(text)
	$('#tipsBox').attr('close',closeB).fadeIn(300)
	
	
	setTimeout(function(){
		if($('#tipsBox').attr('close')=='true'){
			$('#tipsBox').fadeOut(500);
		}
	},3000);
	
	
};

JSeasy.gotoPage = function(num,opt){
	
	var opt = opt || {},
		direction = 1,
		oldPage = publicInfo.page.eq(publicInfo.pageIndex),
		newPage = publicInfo.page.eq(num),
		self = this,
		time = opt.time===undefined?publicInfo.pageAnimateTime:opt.time;
	
	if(publicInfo.pageIndex==num || num>=publicInfo.pageLen){
		if(opt&&opt.startCallback)opt.startCallback();
		if(opt&&opt.endCallback)opt.endCallback();
		return false;
	}
	publicInfo.pageStatus = 0;
		
	if(publicInfo.pageIndex>num)direction = -1;
	self.setUpJt(false);
	
	
	//TweenMax.set(opt.newPage,{display:'block'});
	newPage.css({display:'block'})
	if(opt.startCallback)opt.startCallback();
	if(publicInfo.pageCallback&&publicInfo.pageCallback[num])publicInfo.pageCallback[num]();
		
	JSeasy.pageAnimate[publicInfo.pageAnimateType]({
		newPage:newPage,
		oldPage:oldPage,
		direction:direction,
		time:time,
		endCallback:function(){
			oldPage.removeClass('show');
			newPage.addClass('show');
			
			if(publicInfo.callback&&publicInfo.callback[num])publicInfo.callback[num]();
			
			if(opt.endCallback)opt.endCallback();
			
			var d = publicInfo.pageSwipeB[num]

			if(opt.upJtB===undefined&&(d===0||d===1)){
				self.setUpJt(true);
			}else{
				self.setUpJt(opt.upJtB);
			}
			
			publicInfo.pageStatus = 1;
		}
	});
	publicInfo.pageIndex = num;
	
	
};
//预载器
JSeasy.preload = function(srcArr, params){
	
	if(typeof(srcArr) == 'string'){
		srcArr = [{path:srcArr}];
	};
	
	if(srcArr.length==0){params.complete&&params.complete({});return false};
	//console.log(srcArr)
	
	var num = 0,
		imgArrObj = {},
		minTime = params.minTime || 0,
		baseUrl =  params.baseUrl || '',
		len = srcArr.length,
		t = minTime/len,
		st = (new Date()).getTime();
		
	for(var i = 0; i < len; i++){
		
		(function(i){
			
			var newImg = new Image();
			
			newImg.onload = newImg.onerror = function(e) {
				e = e || window.event;
				var self = this;
				// setTimeout(function(){
					endLoad(self,e.type,i);
				// },t*(i+1)-( (new Date()).getTime() -st));
			};
			
			if(typeof(srcArr[i]) == 'string') srcArr[i] = {path:srcArr[i],name:i};
			setTimeout(function(){
				newImg.src = baseUrl + srcArr[i].path;
			},t*(i+1)-( (new Date()).getTime() -st));
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
		
		params.fileload&&params.fileload(srcArr[i]);
		
		if(num === len) params.complete&&params.complete(imgArrObj);
	}
	
	
	
	
};

JSeasy.lazyLoad = function(selector,params){
	params = params || {};
	var doc = document,
		assets = [],
		ele = doc.querySelectorAll(selector),
		baseUrl = params.baseUrl || '';
	
	for(var i=0,len=ele.length;i<len;i++){
		var id = i;
		var obj = {path:'',type:'',ele:ele[i],name:'_'+i}
		if(ele[i].nodeName === 'IMG'){
			obj.type = 'img';
		}else{
			obj.type = 'bj';
		}
		obj.path = ele[i].getAttribute('data-src');
		if(obj.path){
			assets.push(obj)
		}
	};
	//console.log(assets)
	J.preload(assets,{
		fileload:function(item){
			if(item.status===200){
				if(item.type=='img'){
					item.ele.setAttribute('src',baseUrl+item.path);
				}else if(item.type=='bj'){
					item.ele.style.backgroundImage = 'url('+baseUrl+item.path+')';
				}
			}
			if(params.fileload)params.fileload(item);
		},
		complete:function(result){
			if(params.complete)params.complete(result);
		},
		minTime:params.minTime,
		baseUrl:baseUrl
	})
	
};

//获取地址参数
JSeasy.queryString = function(name){
	 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	 var r = window.location.search.substr(1).match(reg);
	 if(r!=null)return unescape(r[2]);
	 return null;
};

JSeasy.scrollBox_M = function(boxEle,nrEle){
	if(!boxEle||!nrEle)return false;
	var mc = new Hammer(boxEle),
		startRegY = 0,
		startTop = 0,
		minTop = boxEle.offsetHeight-nrEle.offsetHeight,
		B = true;
	mc.get('pan').set({direction:30});
	mc.on("panmove",function(e){
		if(!B)return false;
		var V = startTop+(e.center.y-startRegY);
		if(V>0){V=0}else if(V<minTop){V = minTop};
		//window.J.css(nrEle,'top',V+'px');
		$(nrEle).css('top',V)
	});
	mc.on("panstart",function(e){
		minTop = boxEle.offsetHeight-nrEle.offsetHeight;
		if(minTop>=0){B = false;}else{B = true}
		startRegY = e.center.y;
		startTop = parseInt($(nrEle).css('top'));
		
	});
	mc.on("panend",function(e){
		if(!B)return false;
		startRegY = 0;
		startTop = 0;
	});
};

JSeasy.getLunarDay = function(solarYear, solarMonth, solarDay) {
	
	solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;

	var madd = [0,31,59,90,120,151,181,212,243,273,304,334];
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
	res.month = cMonth < 1 ? "(闰)"+monString.charAt(-cMonth - 1) : monString.charAt(cMonth - 1);

	res.day = (cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay < 30) ? "廿" : "三十"));
	if (cDay % 10 != 0 || cDay == 10) {
		res.day += numString.charAt((cDay - 1) % 10);
	}

	return res;
	
};

JSeasy.isMobile = function (str){
	if(str==null||str=="") return false;
	//var result=str.match(/^((\(\d{2,3}\))|(\d{3}\-))?((13\d{9})|(15\d{9})|(18\d{9}))$/);
	var result=str.match(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/);
	if(result==null)return false;
	return true;
};


JSeasy.isEmail = function (str){
	if(str==null||str=="") return false;

	var result = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	if(result.test(str)){
		return true;
	}else{
		return false;
	}

};


//<input class="abso upimg" id="upimg" accept="image/*" type="file" style='left:100px;top:100px;width:100px;height:100px;opacity:0.5'/>
JSeasy.bindFileControl = function(btnEle, accept, opt){
	var fileEle = document.createElement('input');
	fileEle.setAttribute('type','file');
	fileEle.setAttribute('accept',accept);
	fileEle.addEventListener('change', function () {
		var file = this.files[0]; //获取file对象
		//判断file的类型是不是图片类型。
		// if(!file || !/image\/\w+/.test(file.type)){ 
		// 	console.log("文件必须为图片！"); 
		// 	return false; 
		// } 
		if(!file){
			if(opt.errorCallback)opt.errorCallback({});
			return;
		}
		var reader = new FileReader(); //声明一个FileReader实例
		//最后在onload事件中，获取到成功读取的文件内容，并以插入一个img节点的方式显示选中的图片
		reader.onload = function(e){ 
			//alert(reader.readyState)
			if(opt.successCallback)opt.successCallback(this)
			
		} 
		reader.onerror = function(e){
			if(opt.errorCallback)opt.errorCallback(this)
		}
		reader.readAsDataURL(file); //调用readAsDataURL方法来读取选中的图像文件
		
	});
	btnEle.onclick = function(){
		fileEle.click();
	}
	return fileEle;
};

// 函数参数必须是字符串，因为二代身份证号码是十八位，而在javascript中，十八位的数值会超出计算范围，造成不精确的结果，导致最后两位和计算的值不一致，从而该函数出现错误。
// 详情查看javascript的数值范围
JSeasy.checkIDCard = function(idcode){
	// 加权因子
	var weight_factor = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
	// 校验码
	var check_code = ['1', '0', 'X' , '9', '8', '7', '6', '5', '4', '3', '2'];

	var code = idcode + "";
	var last = idcode[17];//最后一位

	var seventeen = code.substring(0,17);

	// ISO 7064:1983.MOD 11-2
	// 判断最后一位校验码是否正确
	var arr = seventeen.split("");
	var len = arr.length;
	var num = 0;
	for(var i = 0; i < len; i++){
		num = num + arr[i] * weight_factor[i];
	}
	
	// 获取余数
	var resisue = num%11;
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
}

// encoderOptions 可选
// 在指定图片格式为 image/jpeg 或 image/webp的情况下，可以从 0 到 1 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 0.92。其他参数会被忽略。
// encoderOptions 可选
// 在指定图片格式为 image/jpeg 或 image/webp的情况下，可以从 0 到 1 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 0.92。其他参数会被忽略。
JSeasy.compressionPIC = function(src, opt, callback){
	
	var maxSize = Math.max(opt.maxSize, 0) || 0;
	var exif_orientation = opt.exif_orientation || 0;
	var type = opt.type || 'image/png';
	var encoderOptions = opt.encoderOptions || 0.92;
	
	var Img = new Image(); 
	Img.onload = init;  
	Img.onerror = function() {  
		var Img = new Image();
		Img.onload = init;
		Img.src = src;
	}  

	Img.crossOrigin = 'Anonymous';//解决跨域问题，需在服务器端运行，也可为 anonymous   
	Img.src = src;

	function init(name){

		var canvas = document.createElement('canvas');
		
		if(!maxSize)maxSize = Math.max(this.width, this.height);
		
		//图片原始尺寸
		var sw = this.width;
		var sh = this.height;
		//缩放后的尺寸
		var ew = 0, eh = 0;
		if(sw>=sh){
			ew = Math.min(maxSize, sw)
			eh = sh*ew/sw;
		}else{
			eh = Math.min(maxSize, sh);
			ew = sw*eh/sh;
		}
		
		//	Orientation  1	0°  3	180°  6	顺时针90°  8	逆时针90°
		//画布尺寸 输出尺寸
		var canW = ew, canH = eh;
		var rotate = 0;
		if(exif_orientation==6){
			canW = eh;
			canH = ew;
			rotate = 90
		}else if(exif_orientation==8){
			canW= eh;
			canH = ew;
			rotate = -90
		}else if(exif_orientation==3){
			rotate = 180
		}
		
		canvas.width = canW;
		canvas.height = canH;
		var ctx = canvas.getContext("2d");
		ctx.translate(canW/2, canH/2)
		ctx.rotate(Math.PI/180*rotate);
		
		ctx.drawImage(this, -ew/2, -eh/2, ew, eh);
		//ctx.drawImage(this, 0, 0, this.width, this.height, -h/2, -w/2, h, w);


		if(callback)callback({
			width: canW,
			height: canH,
			result: canvas.toDataURL(type,encoderOptions)
		});

	}

}



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

JSeasy.exifOrientation = function (base64){
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

};






JSeasy.addMp4 = function(opt){
	var audioEle = document.createElement('audio');
	audioEle.setAttribute('src',opt.src);
	audioEle.loop = opt.loop;
	
	if(opt.autoplay){
		audioEle.autoplay = true;
		//audioEle.setAttribute('autoplay',true);
		audioEle.play();
		
		if(audioEle.paused==true){
			window.addEventListener('touchstart',clickF,false)
		}
		
	}else{audioEle.autoplay = false;}
	
	function clickF(){
		audioEle.play();
		if(audioEle.btn)audioEle.btn.className += ' show';
		window.removeEventListener('touchstart',clickF,false)
	}
	
	return audioEle;
};
//设置mp4 背景音乐按钮	
JSeasy.setMp4Btn = function(opt){
	
	var audioBtn = opt.audioBtn,
		audioEle = opt.audioEle,
		autoplay = opt.autoplay;
	
	audioBtn.style.display = 'block';
	audioEle.btn = audioBtn;
	var oldClass = audioBtn.className;
	
	if(autoplay){
		audioBtn.className = oldClass+' show';
		audioEle.play();
	}else{
		audioBtn.className = oldClass+' hide';
		audioEle.pause();
	}
	$(audioBtn).on('click',function(e){
		if(audioBtn.className==oldClass+' hide'){
			audioBtn.className = oldClass+' show';
			audioEle.play();
		}else{
			audioBtn.className = oldClass+' hide';
			audioEle.pause();
		}
	});
};


JSeasy.stopDefaultScroll = function(e){
	e.preventDefault();
	e.stopPropagation();
	//return false;
}
//是否开启 触摸滚动页面
JSeasy.setScroll = function(isScroll){
	if(isScroll){
		document.removeEventListener('touchmove',JSeasy.stopDefaultScroll,false);
	}else{
		document.addEventListener('touchmove',JSeasy.stopDefaultScroll,{passive: false});
	}
};
//生成随机字符串
JSeasy.getRandomStr = function(len) {
	len = len || 32;
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';// 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
	var maxPos = $chars.length;
	var sttr = '';
	for (var i = 0; i < len; i++) {
		sttr += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return 'JSeasy_' + sttr + '_' + new Date().getTime();
};
//整数[]  任意数（）
JSeasy.getRandomNum = function (Min,Max,integerB){ 
	if(integerB){
		return ( Math.floor(Math.random()*(Max-Min+1)+Min) )
	}else{
		return ( Min + Math.random()*(Max-Min) )
	}
};
 


JSeasy.pageAnimate = {
	
	inAnimate:'fade',
	
	'fadeInit':function(){
		TweenMax.set(publicInfo.page,{
			display:'none',
			opacity:0
		});
	},
	'fade':function(opt){
		
		if(publicInfo.pageIndex>=0){
			TweenMax.to(opt.oldPage,opt.time/1000,{opacity:0,onComplete:function(){
				TweenMax.set(opt.oldPage,{display:'none'});
				//callBack&&callBack()
			}});
		}
		
		//TweenMax.set(opt.newPage,{display:'block'});
		TweenMax.to(opt.newPage,opt.time/1000,{opacity:1,onComplete:function(){
			opt.endCallback()
		}});
	},
	'translateInit':function(){
		TweenMax.set(publicInfo.page,{
			display:'none',
			y:publicInfo.page.height(),
			opacity:1,
			'z-index':1
		});
	},
	'translate':function(opt){
		TweenMax.set(opt.oldPage,{'z-index':2});
		TweenMax.set(opt.newPage,{//display: 'block',
			y:opt.oldPage.height()*opt.direction,'z-index':3});
		TweenMax.to(opt.newPage,opt.time/1000,{y:0,opacity:1,onComplete:function(){
				if(opt.oldPage>=0)TweenMax.set(opt.oldPage,{display: 'none','z-index':1});
			opt.endCallback()
		}});
	},
	'threeDInit':function(){
		
		publicInfo.browserDetect = J.browserDetect();
		var z = publicInfo.browserDetect.isIOS? -window.innerHeight/2:0;
		
		$('#content').css({
			overflow:'visible',
			
			'-webkit-transform-origin': 'center center -'+$('#content').height()/2+'px',
			transformOrigin: 'center center -'+$('#content').height()/2+'px',
			
			'-weikit-transform': 'translate3d(0px, 0px, '+ z +'px) rotateX(0deg) rotateY(0deg)',
			transform: 'translate3d(0px, 0px, '+ z +'px) rotateX(0deg) rotateY(0deg)',
			
			'-webkit-transform-style': 'preserve-3d',
			'transform-style': 'preserve-3d',
			
		});
		$('.page').css({
			display: 'none',
			'z-index':1,
		});
		
	},
	'threeD':function(opt){ 
		
		$('body').css({
			'-webkit-perspective': '1200px',
			'perspective': '1200px'
		});
		
		
		var z = publicInfo.browserDetect.isIOS? -window.innerHeight/2:0;
		
		publicInfo.content.css({
			transform: 'translate3d(0px, 0px, '+ z +'px) rotateX('+(-90*opt.direction)+'deg) rotateY(0deg)',
			'-weikit-transform': 'translate3d(0px, 0px, '+ z +'px) rotateX('+(-90*opt.direction)+'deg) rotateY(0deg)',
		});
		
		opt.oldPage.css({
			'z-index':2,
			transform: 'translate3d(0px, '+ (-window.innerHeight*opt.direction) +'px, 0px) rotateX('+(90*opt.direction)+'deg) rotateY(0deg)',
			'-weikit-transform': 'translate3d(0px, '+ (-window.innerHeight*opt.direction) +'px, 0px) rotateX('+(90*opt.direction)+'deg) rotateY(0deg)',
			
			'-webkit-transform-origin': 'center '+(opt.direction==1?'bottom':'top'),
			transformOrigin: 'center '+(opt.direction==1?'bottom':'top'),
		});
		
		opt.newPage.css({
			//display: 'block',
			'z-index':3,
			transform: 'translate3d(0px, 0px, 0px) rotateX('+(0)+'deg) rotateY(0deg)',
			'-weikit-transform': 'translate3d(0px, 0px, 0px) rotateX('+(0)+'deg) rotateY(0deg)'
		});
		var obj = {curImg: -90*opt.direction};
		TweenMax.to(obj,opt.time/1000,{
			curImg:0,
			//roundProps: "curImg",  // 仅产生整数
			ease: Power1.easeInOut,
			ease: Power2.easeIn,
			onUpdate: function () {
				publicInfo.content.css({
					transform: 'translate3d(0px, 0px, '+ z +'px) rotateX('+ obj.curImg +'deg) rotateY(0deg)',
					'-weikit-transform': 'translate3d(0px, 0px, '+ z +'px) rotateX('+ obj.curImg +'deg) rotateY(0deg)'
				});
			},
			onComplete:function(){
				TweenMax.set(opt.oldPage,{'z-index':1});
				//if(publicInfo.pageIndex==window.publicInfo.page.index(newPage)){
					//opt.oldPage.css({display: 'none'})
				//}
				opt.endCallback()
				$('body').css({
					'-webkit-perspective': 'none',
					'perspective': 'none'
				});
				
			}
		});
	}
};


export default JSeasy;