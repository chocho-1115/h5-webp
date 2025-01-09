# h5-webp
h5-webpack

### 业务场景

活动类H5开发，当量多的时候，我们就需要一套工程化管理模式来统一管理多个项目。

因为每一个独立的活动H5体量都不大，所以不太可能一个项目对应一套构建工程。所以我们需要的是一套能管理多个类似项目的模式，实现了一个工程管理多个项目。

### 基本使用

##### 新建项目
`
npm run create projectName
`

运行以上命令后会复制模板目录./template到src下，并重命名为projectName。

如果想用react来开发项目，可运行
`
npm run create projectName -react
`

运行以上命令后会复制模板目录./template-react到src下，并重命名为projectName。

##### 开发环境
`
npm run dev demo
`

##### 生产环境 打包demo项目
`
npm run build demo
`

##### 开发环境运行template
`npm run dev template`

`npm run build template`

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
A.H5Init({
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

### rem适配，支持横屏适配

竖屏适配
~~~ js
A.RemInit({
	// 基础宽度 通常和设计稿宽度一致
	baseWidth: 750,
	// 在使用宽度适配时的 页面的最大宽度，此值只在按宽度适配时，才有效
	maxWidth: browserDetectInfo.isPc ? 750 : null, // 不限制最大宽度 即按浏览器宽度适配
	// 视窗显示的最小高度范围 当按宽度适配会裁切掉viewportMinHeight所指定的高度范围内的内容时 此时将按高度来适配
	// 所以按高度适配的临界值为 baseWidth / viewportMinHeight, 界面宽高比大于此值时 按高度适配
	// 此值可以为空
	viewportMinHeight: 1334,
});
~~~

横屏适配
~~~ js
A.RemInit({
	// 基础宽度 通常和设计稿宽度一致
	baseWidth: 1334,
	// 在使用宽度适配时的 页面的最大宽度，此值只在按宽度适配时，才有效
	maxWidth: browserDetectInfo.isPc ? 750 : null, // 不限制最大宽度 即按浏览器宽度适配
	// 视窗显示的最小高度范围 当按宽度适配会裁切掉viewportMinHeight所指定的高度范围内的内容时 此时将按高度来适配
	// 所以按高度适配的临界值为 baseWidth / viewportMinHeight, 界面宽高比大于此值时 按高度适配
	// 此值可以为空
	viewportMinHeight: 750,
	// 是否横屏 默认false
	isLandscape: true,
	// 默认true 自动旋转屏幕 当设置为false时 如果用户开启了自动旋转屏幕 将会在横屏时显示提示层 只有在isLandscape为true时才有效
	autoRotatingScreen: true, 
});
~~~

### http.js
一个前端异步请求库，api参考axios，支持全局配置，实例化，请求拦截，响应拦截。

### 手动页面跳转
~~~ js
A.gotoPage(1, {
	time: 300,//翻页动画的运行时间
	endCallback: function(){},//翻页后的回调函数
	startCallback: function(){}//翻页前调用的函数
});
~~~

### 添加背景音乐
~~~ js
//添加背景音乐
var audioEle = A.addMp3({
	src:'media/bj.mp3',
	autoplay:true, // 音乐是否自动播放
	loop:true // 是否循环播放
});
//给背景音乐添加一个按钮
A.setMp3Btn({
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
A.setScroll(false)
~~~
setScroll 是通过取消document的touchmove默认行为来实现的，如果页面有滚动条会使滚动条失效，需要根据项目实际情况来适时开启或关闭。

### 图片资源懒加载（并列加载方式）
~~~ html
<div class='lazy' data-pic='image/bj.jpg'></div>
<img class='lazy' data-pic='image/logo.png' />
~~~
加载所有 .lazy 元素的data-pic属性指向的图片资源：
~~~ js
utils.lazyLoad('.lazy',{
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
var page = Number(utils.queryString('page'))||3//
A.gotoPage(page,{
	time:300,//翻页动画的运行时间
	endCallback:function(){},//翻页后的回调函数
	startCallback:function(){}//翻页前调用的函数
});
~~~
上面通过参数page来跳转到相应的页面，可方便本地调试。

### 调用相册图片
~~~ js
let fileEle = utils.bindFileControl(document.documentElement,'image/*',{
	successCallback: function(reader){
		console.log(reader)
	},
	errorCallback: function(res){}
});
~~~
bindFileControl函数返回一个file类型的input；
参数element可以指向任何类型的元素，不一定非得file类型的input；
reader.result 是选择图片后 图片的base64字符串

### 图片压缩
~~~ js
utils.compressionPIC(url,{maxSize:100,type:'image/png',encoderOptions:0.92},function(picdata){
	
})
~~~
maxSize 限制图片的最大尺寸；如果图片尺寸小于maxSize，返回的图片保持原始尺寸；
type为jpeg或webp的情况下，encoderOptions才起作用；

### 是否为微信环境
~~~ js
utils.isWechat()
~~~

### 判断是否为手机号码
~~~ js
utils.isMobile(srt)
~~~

### 判断是否为邮箱地址
~~~ js
utils.isEmail(srt)
~~~

### 生成随机数
~~~ js
utils.getRandomNum(Min,Max,integerB)
~~~
整数[]  任意数（）

### 设备判断
~~~ js
var obj = utils.browserDetect()
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
utils.throttle (method, delay)
~~~

### 函数防抖
~~~ js
utils.debounce (method, delay)
~~~










