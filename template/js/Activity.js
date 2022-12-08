// https://github.com/chocho-1115/h5-webp by 杨燚平 email：849890769@qq.com

import Utils from './Utils.js';

$('img').on('click', function (e) {
	if (e.target.parentNode.nodeName == 'A') return;
	e.preventDefault();
})

document.body.ondragstart = function (e) {
	e.preventDefault();
}

if (document.querySelector('#fx')) {
	$('.fxBtn').on('click', function () { $('#fx').fadeIn(500); });
	$('#fx').on('click', function () { $(this).fadeOut(500); });
}

$('.close').on('click', function (e) {
	$(this.parentNode).css('display', 'none');
});

$("input,select,textarea").not('.no-blur').blur(function () {
	// 延迟0秒 解决在聚焦时 点击页面提交按钮无法触发提交事件的问题
	setTimeout(function () {
		$(window).scrollTop(0);
	}, 0);
});

$("select").change(function () {
	var v = $(this).val();
	if (v == '') {
		$(this).addClass('select-placeholder');
	} else {
		$(this).removeClass('select-placeholder');
	}
});



//var thisData = new Date();
//thisData.format("yyyy/MM/dd")
Date.prototype.format = function (format) {
	var o = {
		"M+": this.getMonth() + 1, //month   
		"d+": this.getDate(),    //day   
		"h+": this.getHours(),   //hour   
		"m+": this.getMinutes(), //minute   
		"s+": this.getSeconds(), //second   
		"q+": Math.floor((this.getMonth() + 3) / 3), //quarter   
		"S": this.getMilliseconds() //millisecond   
	}
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
		(this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o) if (new RegExp("(" + k + ")").test(format))
		format = format.replace(RegExp.$1,
			RegExp.$1.length == 1 ? o[k] :
				("00" + o[k]).substr(("" + o[k]).length));
	return format;
};


function stopDefaultScroll (e) {
	e.preventDefault();
	e.stopPropagation();
}

//////////////////////////////////////////////
var activity = {
	data:{},
	Init(){
		Utils.isWechat() ? this.InitWxFX() : this.SetFX();
	},
    // 微信初始化分享
    InitWxFX: function(){
        var self = this;
        // jssdk.init({debug:false}).then(function(res) {
        //     wx.hideMenuItems({
        //         menuList: [
        //             'menuItem:copyUrl', 
        //             //'menuItem:readMode' 
        //         ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        //     });
        //     self.SetFX();
        //     console.log('jssdk签名成功');
        // }).catch((res)=>{ 
        //     console.log('jssdk出错了', res);
        // });
		jssdk.init({debug:false}).done(function(){
			self.SetFX();
		})
    },
	SetFX(options, callback){
        options = options || {};
        var self = this;
        var fxData = {
            title: this.data.shareInfo.title, 
            desc: this.data.shareInfo.desc,
            imgUrl: this.data.shareInfo.imgUrl,
            link: this.data.shareInfo.link,
            success: function () {
                console.log("未设置的分享成功回调");
                options.success && options.success();
                self.data.shareInfo.success && self.data.shareInfo.success();
            },
            cancel: function () {
                console.log("未设置的分享取消回调");
            }
        };
        
        if(options.title) {
            fxData.title = options.title;
        }
        if(options.desc) {
            fxData.desc = options.desc;
        }
        if(options.imgUrl) {
            fxData.imgUrl = options.imgUrl;
        }
        if(options.link) {
            fxData.link = options.link;
        }
        // 设置默认分享文案
		if(Utils.isWechat()){
			jssdk.share(fxData);
		}
		
	},
	H5Init (opt) {

		publicInfo.pageSwipeB = opt.pageSwipeB;
		publicInfo.scale = opt.scale || 1;
		publicInfo.pageAnimateType = opt.pageAnimateType || 'fade';
		publicInfo.pageAnimateTime = opt.pageAnimateTime === undefined ? 600 : opt.pageAnimateTime;
		publicInfo.isRem = opt.isRem || false;


		activity.pageAnimate[publicInfo.pageAnimateType + 'Init']();

		//设置翻页事件
		if (window.Hammer && publicInfo.page.length > 0) {

			var mc = new Hammer(publicInfo.content[0], { touchAction: 'pan-x pan-y' });
			mc.get('swipe').set({ velocity: 0, threshold: 30, direction: 30 });//修改滑动的速度与方向

			//下一页
			mc.on("swipeup", function () {
				if (!publicInfo.pageStatus) return false;
				if (!publicInfo.pageCutover) return false;
				if (publicInfo.pageSwipeB[publicInfo.pageIndex] === false || publicInfo.pageSwipeB[publicInfo.pageIndex] < 0) return false;
				var nextPage = publicInfo.page.eq(publicInfo.pageIndex).attr('next-page')
				if (nextPage) {
					J.GotoPage(Number(nextPage));
				} else {
					J.GotoPage(publicInfo.pageIndex + 1);
				}
			});
			//上一页
			mc.on("swipedown", function () {
				if (!publicInfo.pageStatus) return false;
				if (!publicInfo.pageCutover) return false;
				if (publicInfo.pageSwipeB[publicInfo.pageIndex] === false || publicInfo.pageSwipeB[publicInfo.pageIndex] > 0) return false;

				var nextPage = publicInfo.page.eq(publicInfo.pageIndex).attr('previous-page')
				if (nextPage) {
					J.GotoPage(Number(nextPage));
				} else {
					J.GotoPage(publicInfo.pageIndex - 1);
				}
			});
		}
	},

	//rem适配   DOMContentLoaded
	RemInit (config) {
		var docEl = document.documentElement,
			resizeEvt = 'onorientationchange' in window ? 'orientationchange' : 'resize',
			timer = null;

		// 可配置参数
		var isLandscape = config.isLandscape ? true : false; // 是否横屏 这里是只页面是否要横屏展示 并不代表当前的设备状态
		var autoRotatingScreen = config.autoRotatingScreen === false ? false : true; // 自动旋转屏幕 当设置为false时 如果用户开启了自动旋转屏幕 将会在横屏时显示提示层

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
				if (!autoRotatingScreen) $('.rotateWindows_tips').css('display', 'none');
				recalc({
					viewportMinHeight: config.baseWidth,
					baseWidth: config.viewportMinHeight,
					maxWidth: config.viewportMinHeight
				});
			} else if (window.orientation == 90 || window.orientation == -90) {
				// console.log('===横着的==='+window.orientation)
				docEl.classList.remove('rotateWin');
				if (!autoRotatingScreen) $('.rotateWindows_tips').css('display', 'block');
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

			if (viewportMinHeight && docEl.clientWidth / docEl.clientHeight > baseWidth / viewportMinHeight) {
				zoomOutByHeight = true;
			}
			console.log('zoomOutByHeight:' + zoomOutByHeight)
			//
			var clientWidth = docEl.clientWidth;
			var clientHeight = docEl.clientHeight;
			if (zoomOutByHeight) {
				var v = 100 * (clientHeight / viewportMinHeight);
			} else {
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
	},

	setUpJt (B) {
		if (B) {
			$('#upJt').show();
		} else {
			$('#upJt').hide();
		}
	},

	GotoPage (num, opt) {

		var opt = opt || {},
			direction = 1,
			oldPage = publicInfo.page.eq(publicInfo.pageIndex),
			newPage = publicInfo.page.eq(num),
			self = this,
			time = opt.time === undefined ? publicInfo.pageAnimateTime : opt.time;

		if (publicInfo.pageIndex == num || num >= publicInfo.pageLen) {
			if (opt && opt.startCallback) opt.startCallback();
			if (opt && opt.endCallback) opt.endCallback();
			return false;
		}
		publicInfo.pageStatus = 0;

		if (publicInfo.pageIndex > num) direction = -1;
		self.setUpJt(false);


		//TweenMax.set(opt.newPage,{display:'block'});
		newPage.css({ display: 'block' })
		if (opt.startCallback) opt.startCallback();
		if (publicInfo.pageCallback && publicInfo.pageCallback[num]) publicInfo.pageCallback[num]();

		activity.pageAnimate[publicInfo.pageAnimateType]({
			newPage: newPage,
			oldPage: oldPage,
			direction: direction,
			time: time,
			endCallback: function () {
				oldPage.removeClass('show');
				newPage.addClass('show');

				publicInfo.pageIndex = num;

				if (publicInfo.callback && publicInfo.callback[num]) publicInfo.callback[num]();
				if (opt.endCallback) opt.endCallback();

				var d = publicInfo.pageSwipeB[num]
				if (opt.upJtB === undefined && (d === 0 || d === 1)) {
					self.setUpJt(true);
				} else {
					self.setUpJt(opt.upJtB);
				}

				publicInfo.pageStatus = 1;
			}
		});
	},

	AddMp3 (opt) {
		var audioEle = document.createElement('audio');
		var eventName = 'ontouchstart' in window ? 'touchstart' : 'mousedown';
		audioEle.setAttribute('src', opt.src);
		audioEle.loop = opt.loop;
		if (opt.autoplay) {
			audioEle.autoplay = true;
			audioEle.play();
			if (audioEle.paused == true) {
				window.addEventListener(eventName, clickF, false)
			}
		} else {
			audioEle.autoplay = false;
		}
		function clickF() {
			audioEle.play();
			if (audioEle.btn && !audioEle.paused) {
				audioEle.btn.classList.remove('hide'); // audioEle.btn.className += ' show';
				window.removeEventListener(eventName, clickF)
			}
		}
		return audioEle;
	},

	//设置mp4 背景音乐按钮	
	SetMp3Btn (opt) {
		var audioBtn = opt.audioBtn,
			audioEle = opt.audioEle,
			autoplay = opt.autoplay;

		audioBtn.style.display = 'block';
		audioEle.btn = audioBtn;

		if (autoplay) {
			audioBtn.classList.remove('hide');
			audioEle.play();
		} else {
			audioBtn.classList.add('hide');
			audioEle.pause();
		}
		if (autoplay && audioEle.paused) {
			audioBtn.classList.add('hide');
		}
		audioBtn.addEventListener('click', function (e) {
			if (audioEle.paused) {
				audioBtn.classList.remove('hide');
				audioEle.play();
			} else {
				audioBtn.classList.add('hide');
				audioEle.pause();
			}
		});
	},
	//是否开启 触摸滚动页面
	SetScroll (isScroll) {
		if (isScroll) {
			document.removeEventListener('touchmove', stopDefaultScroll, false);
		} else {
			document.addEventListener('touchmove', stopDefaultScroll, { passive: false });
		}
	},
};

var J = activity;

var publicInfo = {
	content: $('#content'),
	page: $('.page'),
	pageIndex: -1,
	pageStatus: -1,//页面切换状态
	pageCutover: true,//页面切换开关 可以用来从外部限制页面是否可以滑动翻页
	pageLen: 0,//总共多少页

	scale: 1,
	htmlFontSize: -1,

	pageSwipeB: [],

	pageAnimateTime: 0,
	pageAnimateType: 'fade',//fade translate threeD
	isRem: false, //是否为rem适配

	pageCallback: {}
};

publicInfo.pageLen = publicInfo.page.length;
activity.publicInfo = publicInfo;

activity.pageAnimate = {

	inAnimate: 'fade',

	'fadeInit': function () {
		TweenMax.set(publicInfo.page, {
			display: 'none',
			opacity: 0
		});
	},
	'fade': function (opt) {

		if (publicInfo.pageIndex >= 0) {
			TweenMax.to(opt.oldPage, opt.time / 1000, {
				opacity: 0, onComplete: function () {
					TweenMax.set(opt.oldPage, { display: 'none' });
					//callBack&&callBack()
				}
			});
		}

		//TweenMax.set(opt.newPage,{display:'block'});
		TweenMax.to(opt.newPage, opt.time / 1000, {
			opacity: 1, onComplete: function () {
				opt.endCallback()
			}
		});
	},
	'translateInit': function () {
		TweenMax.set(publicInfo.page, {
			display: 'none',
			y: publicInfo.page.height(),
			opacity: 1,
			'z-index': 1
		});
	},
	'translate': function (opt) {
		TweenMax.set(opt.oldPage, { 'z-index': 2 });
		TweenMax.set(opt.newPage, {//display: 'block',
			y: opt.oldPage.height() * opt.direction, 'z-index': 3
		});
		TweenMax.to(opt.newPage, opt.time / 1000, {
			y: 0, opacity: 1, onComplete: function () {
				if (opt.oldPage >= 0) TweenMax.set(opt.oldPage, { display: 'none', 'z-index': 1 });
				opt.endCallback()
			}
		});
	},
	'threeDInit': function () {

		publicInfo.browserDetect = Utils.browserDetect();
		var z = publicInfo.browserDetect.isIOS ? -window.innerHeight / 2 : 0;

		$('#content').css({
			overflow: 'visible',

			'-webkit-transform-origin': 'center center -' + $('#content').height() / 2 + 'px',
			transformOrigin: 'center center -' + $('#content').height() / 2 + 'px',

			'-weikit-transform': 'translate3d(0px, 0px, ' + z + 'px) rotateX(0deg) rotateY(0deg)',
			transform: 'translate3d(0px, 0px, ' + z + 'px) rotateX(0deg) rotateY(0deg)',

			'-webkit-transform-style': 'preserve-3d',
			'transform-style': 'preserve-3d',

		});
		$('.page').css({
			display: 'none',
			'z-index': 1,
		});

	},
	'threeD': function (opt) {

		$('body').css({
			'-webkit-perspective': '1200px',
			'perspective': '1200px'
		});

		var z = publicInfo.browserDetect.isIOS ? -window.innerHeight / 2 : 0;

		publicInfo.content.css({
			transform: 'translate3d(0px, 0px, ' + z + 'px) rotateX(' + (-90 * opt.direction) + 'deg) rotateY(0deg)',
			'-weikit-transform': 'translate3d(0px, 0px, ' + z + 'px) rotateX(' + (-90 * opt.direction) + 'deg) rotateY(0deg)',
		});

		opt.oldPage.css({
			'z-index': 2,
			transform: 'translate3d(0px, ' + (-window.innerHeight * opt.direction) + 'px, 0px) rotateX(' + (90 * opt.direction) + 'deg) rotateY(0deg)',
			'-weikit-transform': 'translate3d(0px, ' + (-window.innerHeight * opt.direction) + 'px, 0px) rotateX(' + (90 * opt.direction) + 'deg) rotateY(0deg)',

			'-webkit-transform-origin': 'center ' + (opt.direction == 1 ? 'bottom' : 'top'),
			transformOrigin: 'center ' + (opt.direction == 1 ? 'bottom' : 'top'),
		});

		opt.newPage.css({
			//display: 'block',
			'z-index': 3,
			transform: 'translate3d(0px, 0px, 0px) rotateX(' + (0) + 'deg) rotateY(0deg)',
			'-weikit-transform': 'translate3d(0px, 0px, 0px) rotateX(' + (0) + 'deg) rotateY(0deg)'
		});
		var obj = { curImg: -90 * opt.direction };
		TweenMax.to(obj, opt.time / 1000, {
			curImg: 0,
			//roundProps: "curImg",  // 仅产生整数
			ease: Power1.easeInOut,
			ease: Power2.easeIn,
			onUpdate: function () {
				publicInfo.content.css({
					transform: 'translate3d(0px, 0px, ' + z + 'px) rotateX(' + obj.curImg + 'deg) rotateY(0deg)',
					'-weikit-transform': 'translate3d(0px, 0px, ' + z + 'px) rotateX(' + obj.curImg + 'deg) rotateY(0deg)'
				});
			},
			onComplete: function () {
				TweenMax.set(opt.oldPage, { 'z-index': 1 });
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

export default activity;