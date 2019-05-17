# h5-webp
h5-webpack

### 业务场景

经常会有一些相互独立的活动类H5开发，当量多的时候，我们就需要一套工程化管理模式来解放我们的双手。

因为每一个独立的活动H5体量都不大，所以不太可能一个项目对应一套工程。所以我们需要的是一套能管理多个类似项目的模式，实现了一个工程管理多个项目。

### 基本使用

##### 新建项目
`
npm run create projectName
`

运行以上命令后会复制模板目录./template到src下，并重命名为projectName。


##### 开发环境
`
npm run dev demo
`

##### 生产环境 打包demo项目
`
npm run build demo
`

##### 开发环境运行template
`
npm run dev template
npm run dev
npm run template
`

以上三种方式都可。

template下的模版是需要不断更新迭代的，所以我们需要让template也能跑起来。




# h5-template

模板目录存放的是一套通用的h5开发模版，下面是模版里的一些功能介绍：

### 页面基本结构
~~~ html
<div class="content" id="content">
    <div class="page page0">
        <div class="nr">
        	<!--loading-->
            <p class="abso load_num">LOADING<span id="set_load_num" >0</span></p>
        </div>
    </div>
    <div class="page page1">
    	<div class="nr">
        	<!--第一页-->
        </div>
    </div>
    <div class="page page2" next-page='3' previous-page='1'>
    	<div class="nr">
        	<!--第二页-->
        </div>
    </div>
    <div class="page page3">
    	<div class="nr">
        	<!--第三页-->
        </div>
    </div>
</div>

如果页面开启了滑动翻页，可以设置 div.page 元素的next-page和previous-page元素属性来控制当前页面上翻和下翻的目标页面。

~~~

### 翻页动画  和是否滑动翻页
~~~ js
H5Init({
	pageAnimateType: 'fade',//fade 渐隐渐现翻页   translate 位移翻页 threeD  三d翻页
	//scale : window.innerHeight<1008?window.innerHeight/1008:1,  //此参数 作废

	//滑动翻页控制
	// 0 代表可上翻  也可以下翻   1 代表只可下翻    -1代表只可以上翻   false 代表不可以滑动翻页
	pageSwipeB : {
		'0':false,//
		'1':false,
		'2':false,
		'3':false
	},
});
~~~
### 设置最小适配高度
~~~ js
J.setViewportMinHeight(1008);//1008为 页面内容最小高度；默认按640的宽度适配  但是在如ip4屏幕按相对较短的手机下  底部内容显示不全  需要根据页面内容的高度 来调整适配宽度
~~~
### 手动页面跳转
~~~ js
J.gotoPage(1,{
	time:300,//翻页动画的运行时间
	endCallback:function(){},//翻页后的回调函数
	startCallback:function(){}//翻页前调用的函数
});
~~~

### 添加背景音乐
~~~ js
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
~~~

### 关闭微信页面下拉露出网页来源
~~~ js
J.setScroll(false)
~~~
setScroll 是通过取消document的touchmove默认行为来实现的，如果页面有滚动条会使滚动条失效，需要根据项目实际情况来适时开启或关闭。

### 弹出提示文案
~~~ js
J.tipsText('请输入您的昵称')
~~~
提示文案默认会在一段时间后自动关闭，如果您不希望自动关闭，可以:
~~~ js
J.tipsText('请输入您的昵称',false);
~~~

### 图片资源懒加载（并列加载方式）
~~~ html
<div class='lazy' data-pic='image/bj.jpg'></div>
<img class='lazy' data-pic='image/logo.png' />
~~~
加载所有 .lazy 元素的data-pic属性指向的图片资源：
~~~ js
window.J.lazyLoad('.lazy',{
	fileload:function(item){
		console.log(item.progress);
	},
	complete:function(assets){
		console.log(assets)
	},
	minTime:6000,
	baseUrl:''
});
~~~
如果元素为img，加载后的资源会赋值到src属性上。如果为非img元素，加载的资源会写到行内样式 background-image 中；

在h5有loading页面的时候，可以通过lazyLoad函数中的item.progress来获取加载进度;

上面示例中的fileload方法，是单个资源加载后的回调函数。其中item.progress可以获取到加载进度，是一个0-1的数字；

上面示例中的complete方法中的assets，是所有的资源数组；

minTime：如果你有一个漂亮的loading动画，想要每个用户都有足够的时间来欣赏它，你可以设置最小加载时间。设置这个参数，在你测试loading页面的时候也非常有用。


### 获取地址参数getQueryString
~~~ js
var page = Number(J.getQueryString('page'))||3//
J.gotoPage(page,{
	time:300,//翻页动画的运行时间
	endCallback:function(){},//翻页后的回调函数
	startCallback:function(){}//翻页前调用的函数
});
~~~
上面通过参数page来跳转到相应的页面，可方便本地调试。

### 设置横屏
~~~ html
<div class="rotateWindows_tips"></div>
~~~
横屏模式下，不要手动调用J.setViewportMinHeight();

横屏模式下不支持threeD翻页动画
~~~ js
J.rotateWindows({
	viewportMinHeight: 1008,
	callback: function(opt){



	},
	onRotate: function(opt){

	}
});
~~~
原理是在关闭系统横屏功能的同时，用css3旋转 div#content 元素；

这里要注意，如果旋转了canvas，canvas的坐标获取并没有因此发生旋转，另外在ios有滚动条的情况下，也有些不可描述的地方，不过都可以找到解决办法，这里就不详细说明了。

### 调用相册图片
~~~ js
var fileEle = J.initUpImg(element,'image/*',function(reader){
	console.log(reader.result)
});
~~~
initUpImg函数返回一个file类型的input；
参数element可以指向任何类型的元素，不一定非得file类型的input；
reader.result 是选择图片后 图片的base64字符串

### 图片压缩
~~~ js
J.compressionPIC(url,{maxSize:100,type:'image/png',encoderOptions:0.92},function(picdata){
	
})
~~~
maxSize 限制图片的最大尺寸；如果图片尺寸小于maxSize，返回的图片保持原始尺寸；
type为jpeg或webp的情况下，encoderOptions才起作用；

### 是否为微信环境
~~~ js
J.isWeixin()
~~~

### 判断是否为手机号码
~~~ js
J.isMobile(srt)
~~~

### 判断是否为邮箱地址
~~~ js
J.isEmail(srt)
~~~

### 生成随机数
~~~ js
J.getRandomNum(Min,Max,integerB){ 
~~~
整数[]  任意数（）

### 设备判断
~~~ js
var obj = J.browserDetect();
obj.isWindowPhone
obj.isFirefox
obj.isOpera
obj.isChrome
obj.isIOS
obj.isAndroid
obj.isBlackberry
~~~
根据设备的 window.navigator.userAgent 字符串返回设备信息;


### 函数节流
~~~ js
J.throttle(method,context);
~~~










