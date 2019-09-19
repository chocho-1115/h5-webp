// JavaScript Document
//escape   unescape

import resetCss from '../css/reset.css';
import mainCss from '../css/main.css';
import fxpic from '../image/160.jpg';

let J = require('./jsEasy.js');

function setFX(opt){
	var wx={
		title:opt.title,
		desc:opt.desc, 
		imgUrl:opt.imgUrl,
		link:opt.link,
		success:opt.success||null
	}
	jssdk.init({debug:false}).done(function(){
		jssdk.share(wx);
	})
}

$(window).load(function(e) {

	/* setFX({
		title:'',
		desc:'',
		imgUrl:''+fxpic,
		link:'', 
		success:null
	}); */


	//关闭页面下拉露出网页来源
	J.setScroll(false)//

	//跳到第二页  
	J.H5Init({
		pageAnimateType: 'fade',//fade 渐隐渐现翻页   translate 位移翻页 threeD  三d翻页
		pageSwipeB : {
			'0':false,//
			'1':false,
			'2':false,
			'3':false,
			'4':false,
			'5':false, 
			'6':false,
		}
	});
	//1334 = 128+1206(?+98)
	//640 1138 1236 1250    750 1334 1448 1450    
	if(window.history.length==1){//没白条
		J.setViewportMinHeight(1206); 
	}else{//有白条
		J.setViewportMinHeight(1206+98);
	}


 
	//横屏 的时候调用
	//window.orientation = 180
	/*J.rotateWindows({
		viewportMinHeight: 1008,
		callback: function(){},
		onRotate: function(opt){
			
		}
	});*/
	
	J.publicInfo.pageCallback = {
		'2':function(){
			
		}
	};
	
	/*+function(){
		
		var end_time = (new Date()).getTime()+10001;//月份是实际月份-1 "10/31/2018 14:51:00"
		
		J.countDown(end_time,{
			framerate:100,
			onUpdate:function(res){
				console.log(res.second)
			},
			onComplete:function(res){
				console.log(res.day+'天 '+(res.hour<10?"0"+res.hour:res.hour)+':'+(res.minute<10?"0"+res.minute:res.minute)+':'+(res.second<10?"0"+res.second:res.second)+':'+res.millisecond)
			}
		});
	}();
	*/
	/*JSeasy.isTime("Dec 08, 2017 11:54:00",'活动将于12点开始',function(){
		J.gotoPage(1,{time:0,endCallback:function(){console.log('翻页成功后的回调')}})//显示第indexPage页
	});*/
	


















	/////////////////////////////////////////////////////////

	var page = Number(J.getQueryString('page'))||1;
	//J.gotoPage(page,{time:0});
	//懒加载   在有load页面的时候用
	J.lazyLoad('.lazy_load',{
		fileload:function(item){},
		complete:function(assets){
			var $loadNum = $('#set_load_num');
			J.gotoPage(0, {time: 0, endCallback: function(){
				J.lazyLoad('.lazy',{
					fileload:function(item){
						$loadNum.html(parseInt(item.progress*100)+'%');
					},
					complete:function(assets){
						$loadNum.html(100+'%');
						setTimeout(function(){
							J.gotoPage(page);
						},800);
					},
					minTime:0
				});
			}})
		},
		minTime:0
	});

	
	
	
	//添加背景音乐
	var audioEle = J.addMp4({
		src:'media/bj.mp3',
		autoplay:true,//音乐是否自动播放
		loop:true//是否循环播放
	});
	//给背景音乐添加一个按钮
	J.setMp4Btn({
		audioBtn:document.getElementById('micBtn'),
		audioEle:audioEle,
		autoplay:true
	});
	//以下是为了兼容ios自动播放音乐
	document.addEventListener("WeixinJSBridgeReady", function () {  
		audioEle.play();
		$('#micBtn').addClass('show');
	}, false);  
	document.addEventListener('YixinJSBridgeReady', function() {  
		audioEle.play(); 
		$('#micBtn').addClass('show');
	}, false);
	
	 
	
	
	
	
	//调用手机相册
	/*var fileEle = J.initUpImg(document.documentElement,'image/*',function(reader){
		console.log(reader)
		var exif_orientation = J.exifOrientation(reader.result)
		//.substring(22)
		//type为jpeg webp的情况下 encoderOptions才起作用
		J.compressionPIC(reader.result,{maxSize:750,exif_orientation:exif_orientation,type:'image/jpeg',encoderOptions:0.8},function(res){
			//$('.page4 .logo').attr('src',res.result)
			info.img = res.result.substring(23);
			$('.page3 .pic').css({'background-image':'url('+res.result+')','opacity':1});
		})
	});
	*/
	
	
	
	
	

	//post 请求数据
	/*$.post("http://www.cui2.com/h5/tongCheng20151210/index.php?act=chaxun", {openid:openid}, function(data){
			var data=JSON.parse(data);
			var text1 = $('.text1').val().replace(/\s/g, ""),
				text2 = $('.text2').val().replace(/\s/g, "");
			JSON.stringify(result)
	});*/
	
	
	
	
	/*
	$('.sub').on("click",function(e){
		var text1 = $('.info .text1').val().replace(/\s/g, ""),//获取input数据  并且去掉数据中的空格
			text3 = $('.info .text3').val().replace(/\s/g, ""),
			text2 = $('.info .text2').val().replace(/\s/g, "");
		if(text1.length==0||text2.length==0||text3.length==0){J.tipsText('请完善好信息！');return false}	
		if(!J.isMobile(text2)){J.tipsText('电话号码错误！');return false}
	
		$.post("", {openid:openid,name:text1,tele:text2,address:text3}, function(data){
				var data=JSON.parse(data);
				console.log(data);
				if (data.code == 1) {
					J.tipsText("提交成功！");
					
					$('.info .text1').val('')
					$('.info .text2').val('')
					$('.info .text3').val('')
					
					$('.info').fadeOut(300);
				}else{
					J.tipsText("您提交收获地址无需重复提交！");
				}
		});
				
	});
	*/
	

});

