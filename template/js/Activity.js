// https://github.com/chocho-1115/h5-webp by 杨燚平 email：849890769@qq.com

import Utils from './Utils.js';

// $('img').on('click', function (e) {
// 	if (e.target.parentNode.nodeName == 'A') return;
// 	e.preventDefault();
// })

document.body.ondragstart = function (e) {
	e.preventDefault();
}

if(document.querySelector('#fx')){
	document.querySelector('#fx').onclick = function(){
		this.style.display = "none";
	};
}

// $("input,select,textarea").not('.no-blur').blur(function () {
// 	// 延迟0秒 解决在聚焦时 点击页面提交按钮无法触发提交事件的问题
// 	setTimeout(function () {
// 		$(window).scrollTop(0);
// 	}, 0);
// });

+function(){
	var selectAll = document.getElementsByTagName('select');
	function handler(){
		var v = this.value;
		if(v==''){
			this.classList.add('select-placeholder');
		}else{
			this.classList.remove('select-placeholder');
		}
	}
	Array.prototype.forEach.call(selectAll, ele => {
		handler.call(ele);
		ele.addEventListener('change', handler);
	});
}();



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
	data:{
		// content : document.querySelector('#content'),
		page : document.querySelectorAll('.page'),
		pageIndex: -1,
		pageStatus: -1,//页面切换状态
		pageCutover: true,//页面切换开关 可以用来从外部限制页面是否可以滑动翻页
		pageLen: 0,//总共多少页
		pageSwipeB: [],
		pageCallback: {}
	},
	Init(){
		this.data.pageLen = this.data.page.length;
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
		window.jssdk && window.jssdk.init({debug:false}).done(function(){
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
		var info = this.data;
		var content = document.querySelector('#content');
		info.pageSwipeB = opt.pageSwipeB;

		TweenMax.set(info.page, {
			display: 'none',
			opacity: 0
		});

		//设置翻页事件
		if (window.Hammer && info.page.length > 0) {

			var mc = new Hammer(content, { 
				// touchAction: 'pan-x pan-y'  // 谷歌浏览器手机调试模式需要去掉这句 滑动才能有效。奇怪的是changlongWSJ项目中并不是这样的。。。
			});
			mc.get('swipe').set({ velocity: 0, threshold: 30, direction: 30 });//修改滑动的速度与方向

			//下一页
			mc.on("swipeup", () => {
				if (!info.pageStatus) return false;
				if (!info.pageCutover) return false;
				if (info.pageSwipeB[info.pageIndex] === false || info.pageSwipeB[info.pageIndex] < 0) return false;
				var nextPage = info.page[info.pageIndex].getAttribute('next-page')
				if (nextPage) {
					this.GotoPage(Number(nextPage));
				} else {
					this.GotoPage(info.pageIndex + 1);
				}
			});
			//上一页
			mc.on("swipedown", () => {
				if (!info.pageStatus) return false;
				if (!info.pageCutover) return false;
				if (info.pageSwipeB[info.pageIndex] === false || info.pageSwipeB[info.pageIndex] > 0) return false;

				var nextPage = info.page[info.pageIndex].getAttribute('previous-page')
				if (nextPage) {
					this.GotoPage(Number(nextPage));
				} else {
					this.GotoPage(info.pageIndex - 1);
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

			// 解决部分 Android 手机(例如华为) 通过 rem 计算的宽度和手机上实际显示的宽度不一致
			// 方法一
			// var realFs = parseFloat(window.getComputedStyle(docEl)["font-size"]);
			// if (Math.abs(realFs - v) >= 1) {
			// 	docEl.style.fontSize = (v / (realFs / v)) + "px";
			// }

			// 方法二
			// var settedFs = v
			// var settingFs = v;
			// var whileCount = 0;
			// while (true) {
			// 	var realFs = parseInt(window.getComputedStyle(docEl).fontSize);
			// 	var delta = realFs - settedFs;
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
	},
	setUpJt (B) {
		var ele = document.getElementById('upJt');
		if(!ele) return;
		if(B){
			ele.style.display = 'block';
		}else{
			ele.style.display = 'none';
		}
	},
	GotoPage (num, opt) {
		var info = this.data;
		var opt = opt || {},
			direction = 1,
			oldPage = info.page[info.pageIndex],
			newPage = info.page[num],
			self = this,
			time = opt.time === undefined ? 300 : opt.time;

		if (info.pageIndex == num || num >= info.pageLen) {
			if (opt && opt.startCallback) opt.startCallback();
			if (opt && opt.endCallback) opt.endCallback();
			return false;
		}
		info.pageStatus = 0;

		if (info.pageIndex > num) direction = -1;
		self.setUpJt(false);

		//TweenMax.set(opt.newPage,{display:'block'});
		newPage.style.display = 'block';
		if (opt.startCallback) opt.startCallback();
		if (info.pageCallback && info.pageCallback[num]) info.pageCallback[num]();

		if (info.pageIndex >= 0) {
			TweenMax.to(oldPage, time / 1000, {
				opacity: 0, onComplete: function () {
					TweenMax.set(oldPage, { display: 'none' });
					//callBack&&callBack()
				}
			});
		}

		//TweenMax.set(opt.newPage,{display:'block'});
		TweenMax.to(newPage, time / 1000, {
			opacity: 1, onComplete: function () {
				if(oldPage) oldPage.classList.remove('show');
				newPage.classList.add('show');

				info.pageIndex = num;

				if (info.callback && info.callback[num]) info.callback[num]();
				if (opt.endCallback) opt.endCallback();

				var d = info.pageSwipeB[num]
				if (opt.upJtB === undefined && (d === 0 || d === 1)) {
					self.setUpJt(true);
				} else {
					self.setUpJt(opt.upJtB);
				}

				info.pageStatus = 1;
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
	// 设置省市区联动
	InitChinaAreaPicker: function(prov, city, area, district){
        if(!ChinaAreaData){
            return;
        }
        district.onclick = function () {
            weui.picker(ChinaAreaData, {
                container: "body",
                // defaultValue: [prov.value||'湖南省', city.value||'长沙市', area.value||'市辖区'],
                defaultValue: [prov.value||'430000', city.value||'430100', area.value||'430101'],
                onConfirm: function (result) {
                    prov.value = result[0]?result[0].value:'';
                    city.value = result[1]?result[1].value:'';
                    area.value = result[2]?result[2].value:'';
                    district.value = (result[0]?result[0].label:'') + " " + (result[1]?result[1].label:'') + " " + (result[2]?result[2].label:'');
                    district.parentNode.classList.remove("prompt");
                },
                id: "AddressPicker" //缓存id
            });
        };
    },
};

export default activity;