//https://github.com/chocho-1115/H5-template by 华扬长沙 杨燚平 email：849890769@qq.com
let TweenMax = require('../libs/TweenMax.min.js');

/*function getElementByAttr(tag,attr,value)
{
    var aElements=document.getElementsByTagName(tag);
    var aEle=[];
    for(var i=0;i<aElements.length;i++)
    {
        if(aElements[i].getAttribute(attr)==value)
            aEle.push( aElements[i] );
    }
    return aEle;
}*/

$('img').on('click',function(e){
	if(e.target.parentNode.nodeName=='A')return;
	e.preventDefault();
	//e.stopPropagation();
	//return false;
})
document.body.ondragstart=function(e){
	e.preventDefault();
	//e.stopPropagation();
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


var publicInfo = {
	content : $('#content'),
	page : $('.page'),
	indexPage : -1,
	pageStatus : -1,//页面切换状态
	pageCutover : true,//页面切换开关 可以用来从外部限制页面是否可以滑动翻页
	pageLen : 0,//总共多少页
	
	scale : 1,
	prefix : null,
	htmlFontSize : -1,
	
	pageSwipeB :[],
	
	pageAnimateType: 'fade',//fade translate threeD
	setPrefix : false, //
	isRem : false, //是否为rem适配
	
	pageCallback: {}
};

publicInfo.pageLen = publicInfo.page.length;


var JSeasy = {};
var J = JSeasy;

JSeasy.publicInfo = publicInfo;


JSeasy.H5Init = function (opt){
	
	publicInfo.pageSwipeB = opt.pageSwipeB;
	
	publicInfo.scale = opt.scale||1;
	publicInfo.pageAnimateType = opt.pageAnimateType||'fade';
	publicInfo.isRem = opt.isRem||false;
	publicInfo.setPrefix = opt.setPrefix||false;
	
	JSeasy.pageAnimate[publicInfo.pageAnimateType+'Init']();
	
	//设置翻页事件
	if(publicInfo.page.length>0){
		
		var mc = new Hammer(publicInfo.content[0]);
		mc.get('swipe').set({velocity:0,threshold:30,direction:30});//修改滑动的速度与方向
		
		//下一页
		mc.on("swipeup",function(){
			if(!publicInfo.pageStatus)return false;
			if(!publicInfo.pageCutover)return false;
			if(publicInfo.pageSwipeB[publicInfo.indexPage]===false||publicInfo.pageSwipeB[publicInfo.indexPage]<0)return false;
			var nextPage = publicInfo.page.eq(publicInfo.indexPage).attr('next-page')
			if(nextPage){
				J.gotoPage(Number(nextPage));
			}else{
				J.gotoPage(publicInfo.indexPage+1);
			}
		});
		//上一页
		mc.on("swipedown",function(){
			if(!publicInfo.pageStatus)return false;
			if(!publicInfo.pageCutover)return false;
			if(publicInfo.pageSwipeB[publicInfo.indexPage]===false||publicInfo.pageSwipeB[publicInfo.indexPage]>0)return false;
			
			var nextPage = publicInfo.page.eq(publicInfo.indexPage).attr('previous-page')
			if(nextPage){
				J.gotoPage(Number(nextPage));
			}else{
				J.gotoPage(publicInfo.indexPage-1);
			}
		});
	}

	
	if(publicInfo.setPrefix){
		
		publicInfo.prefix = (function(){
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
		}())
		
	}
	
	//rem适配   DOMContentLoaded
	if(publicInfo.isRem){
		(function(){
			var doc = document,
				win = window,
				docEl = doc.documentElement,
				resizeEvt = 'onorientationchange' in window ? 'orientationchange' : 'resize',
				bodyEle = document.getElementsByTagName('body')[0],
				recalc = function () {
					var winH = window.innerHeight,
						winW = window.innerWidth;
					if(640/1136<winW/winH){
						var sizeV = 100 * (winH / 1136);
					}else{
						var sizeV = 100 * (winW / 640);
					}
					sizeV = sizeV>100?100:sizeV;
					sizeV = Math.round(sizeV*10000)/10000;
					
					docEl.style.fontSize = sizeV + 'px';
					bodyEle.style.fontSize = '24px';
					window.publicInfo.htmlFontSize = sizeV;
				};
			recalc();
			
			//点击页面输入框 输入内容后 页面无法复位 上移了
			/*document.addEventListener('DOMContentLoaded', function(){
				$("body").height($(window).height());
			});*/
			
			if (!doc.addEventListener) return;
			win.addEventListener(resizeEvt, function(){
				if(resizeEvt==='orientationchange'){
					setTimeout(recalc,300);//orientationchange事件发生时 立马获取的window的宽高不正确 要延时获取才行
				}else{
					recalc();
				}
			}, false);
			
			/*window.addEventListener('orientationchange', function(event){
				setTimeout(recalc,300);
				if ( window.orientation == 180 || window.orientation==0 ) {
					//alert("竖屏");
				}
				if( window.orientation == 90 || window.orientation == -90 ) {
					//alert("横屏");
				}
			});*/

		}());
	};

	
};



	
	
JSeasy.setViewportMinHeight = function(minH){
	
	var winW = document.documentElement.clientWidth;
	var winH = document.documentElement.clientHeight;
	if(minH&&winH<minH){
		var w = minH*winW/winH;
		document.getElementById('viewEle').setAttribute('content','width='+w+', user-scalable=no,target-densitydpi = device-dpi');
	}
	
};
JSeasy.EventUtil = {
	
	//事件处理程序
	addHandler:function(element,type,handler){
		if(element.addEventListener){element.addEventListener(type,handler,false)}//DOM2
		else if(element.attachEvent){element.attachEvent('on'+type,handler);}//ie
		else{element['on'+type]=handler;}//DOM0
	},
	//滚轮事件对象的 wheelDelta/FF DOMMouseScroll
	getWheelDelta:function(event){
		if(event.wheelDelta){//ff以外的浏览器
			//在最新版的opera中window返回undefined ， 在opera9.5中返回对象 在9.5版本之前的版本中wheelDelta的正负号颠倒的
			return (window.opera&&window.opera.version()<9.5?-event.wheelDelta:event.wheelDelta);
		}else{return -event.detail*40;}//ff
	},
	//返回事件对象的引用
	getEvent:function(event){return event?event:window.event;},
	//返回鼠标相对于事件对象的 X 坐标
	getX:function(event){return event.offsetX?event.offsetX:event.layerX;},//火狐中的layerX  要保证元素用了position相对/绝对
	//返回鼠标相对于事件对象的 Y 坐标
	getY:function(event){return event.offsetY?event.offsetY:event.layerY;},
	//返回事件目标元素
	getTarget:function(event){return event.target||event.srcElement;},
	//取消事件默认行为
	preventDefaclt:function(event){
		if(event.preventDefault){event.preventDefault();}
		else {event.returnValue=false;}
	},
	//取消事件进一步捕获或冒泡
	stopPropagation:function(event){
		if(event.stopPropagation){event.stopPropagation();}
		else{event.cancelBubble=true;}//ie
	},
	//移除事件处理程序
	removeHandler:function(element,type,handler){
		if(element.removeEventListener){element.removeEventListener(type,handler,false);}
		else if(element.detachEvent){element.detachEvent('on'+type,handler)}
		else{element['on'+type]=null;}
	}
};

JSeasy.countDown = function (time,opt){
	
	opt.framerate = opt.framerate||1;
	
	var res = {
		death: false,
		day: 0,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0
	};
	
	var sys_second = (time-new Date().getTime())/1000;
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
	anim();
	var timer = setInterval(anim, 1000/opt.framerate);
	return timer;
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



//publicInfo.pageSwipeB[publicInfo.indexPage]!=-1&&publicInfo.pageSwipeB[publicInfo.indexPage]!==false
JSeasy.gotoPage = function(num,opt){
	
	var opt = opt || {},
		direction = 1,
		oldPage = publicInfo.page.eq(publicInfo.indexPage),
		newPage = publicInfo.page.eq(num),
		self = this,
		time = opt.time===undefined?800:opt.time;
	
	if(publicInfo.indexPage==num || num>=publicInfo.pageLen){
		if(opt&&opt.startCallback)opt.startCallback();
		if(opt&&opt.endCallback)opt.endCallback();
		return false;
	}
	publicInfo.pageStatus = 0;
		
	if(publicInfo.indexPage>num)direction = -1;
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
	publicInfo.indexPage = num;
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
				setTimeout(function(){
					endLoad(self,e.type,i);
				},t*(i+1)-( (new Date()).getTime() -st));
			};
			
			if(typeof(srcArr[i]) == 'string') srcArr[i] = {path:srcArr[i],name:i};
			
			newImg.src = baseUrl + srcArr[i].path;
			
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
	var doc = document,
		assets = [],
		ele = doc.querySelectorAll(selector);
	
	for(var i=0,len=ele.length;i<len;i++){
		var id = i;
		var obj = {path:'',type:'',ele:ele[i],name:'_'+i}
		if(ele[i].nodeName === 'IMG'){
			obj.type = 'img';
		}else{
			obj.type = 'bj';
		}
		obj.path = ele[i].getAttribute('data-pic');
		if(obj.path){
			assets.push(obj)
		}
	};
	//console.log(assets)
	window.J.preload(assets,{
		fileload:function(item){
			if(item.status===200){
				if(item.type=='img'){
					item.ele.setAttribute('src',item.path);
				}else if(item.type=='bj'){
					item.ele.style.backgroundImage = 'url('+item.path+')';
				}
			}
			if(params.fileload)params.fileload(item);
		},
		complete:function(result){
			if(params.complete)params.complete(result);
		},
		minTime:params.minTime,
		baseUrl:params.baseUrl || ''
	})
	
};

//获取地址参数
JSeasy.getQueryString = function(name){
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
	
JSeasy.initUpImg = function(btnEle, accept, endCallback){
	
	var fileEle = document.createElement('input');
	fileEle.setAttribute('type','file');
	fileEle.setAttribute('accept',accept);
	
	fileEle.addEventListener('change', function () {
	
		var file = this.files[0]; //获取file对象
		//判断file的类型是不是图片类型。
		if(!/image\/\w+/.test(file.type)){ 
			alert("文件必须为图片！"); 
			return false; 
		} 
		
		var reader = new FileReader(); //声明一个FileReader实例
		
		//最后在onload事件中，获取到成功读取的文件内容，并以插入一个img节点的方式显示选中的图片
		reader.onload = function(e){ 
			//alert(reader.readyState)
			if(endCallback)endCallback(this)
			
		} 
		reader.readAsDataURL(file); //调用readAsDataURL方法来读取选中的图像文件
		
	});
	
	btnEle.onclick = function(){
		fileEle.click();
	}
	
	return fileEle;
	
};



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
		
		var pw = Number(this.width);
		var ph = Number(this.height);
		var w = 0, h = 0;
		if(pw>=ph){
			w = Math.min(maxSize, pw)
			h = ph*w/pw;
		}else{
			h = Math.min(maxSize, ph);
			w = pw*h/ph;
		}
		
//	Orientation  1	0°  3	180°  6	顺时针90°  8	逆时针90°

		var rotate = 0;
		if(exif_orientation==6){
			var w_ = w;
			var h_ = h;
			w = h_;
			h = w_;
			rotate = 90
		}else if(exif_orientation==8){
			var w_ = w;
			var h_ = h;
			w = h_;
			h = W_;
			rotate = -90
		}else if(exif_orientation==3){
			rotate = 180
		}
		
		canvas.width = w;
		canvas.height = h;
		var ctx = canvas.getContext("2d");
		ctx.translate(w/2, h/2)
		ctx.rotate(Math.PI/180*rotate);
		
		ctx.drawImage(this, -w/2, -h/2, w, h);

		if(callback)callback(canvas.toDataURL(type,encoderOptions));

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

//整数[]  任意数（）
JSeasy.getRandomNum = function (Min,Max,integerB){ 
	if(integerB){
		return ( Math.floor(Math.random()*(Max-Min+1)+Min) )
	}else{
		return ( Min + Math.random()*(Max-Min) )
	}
};
 
JSeasy.rotateWindows = function(opt){

	opt = opt||{};
	var isSet = false;
	
	$('body').addClass('horizontalWindows');//水平窗口
	
	changeFunc();
	//window.addEventListener('orientationchange', changeFunc);
	window.addEventListener('resize', changeFunc);
	function changeFunc(event){
		//pc端
		if(window.orientation===undefined){
			var winW = window.innerWidth, winH = window.innerHeight;
			$('.content').css({width:winW,height:winH});
			opt.callback&&opt.callback({winW:winW,winH:winH});
			return false
		}
		
		//alert(window.orientation)
		if ( window.orientation === 180 || window.orientation === 0 ) {//竖着的
			if(!isSet){
				opt.callback&&opt.callback();
				
				J.setViewportMinHeight(opt.viewportMinHeight||1008);
				
				isSet = true;
				// var winW = window.innerHeight, winH = window.innerWidth;
				var winW = document.documentElement.clientHeight, winH = document.documentElement.clientWidth;
				//winW = $('body').height();//window.innerHeight;
				$('.content').css({
					//position:'absolute',
					//left:'50%',
					//top:'50%',
					transform:'rotate(90deg)',
					width:winW,
					height:winH,
					marginLeft:winW/-2,
					marginTop:winH/-2
				})
				
			}
			$('.rotateWindows_tips').css('display','none');
			opt.onRotate&&opt.onRotate(0);
		}else if( window.orientation == 90 || window.orientation == -90 ) {
			$('.rotateWindows_tips').css('display','block');
			opt.onRotate&&opt.onRotate(90);
		}
	}
}

JSeasy.pageAnimate = {
	
	inAnimate:'fade',
	
	'fadeInit':function(){
		TweenMax.set(publicInfo.page,{
			display:'none',
			opacity:0
		});
	},
	'fade':function(opt){
		
		if(publicInfo.indexPage>=0){
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
			//if(publicInfo.indexPage==window.publicInfo.page.index(newPage)){
				TweenMax.set(opt.oldPage,{display: 'none','z-index':1});
			//}
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
				//if(publicInfo.indexPage==window.publicInfo.page.index(newPage)){
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


module.exports = JSeasy;