# h5-webp
h5-webpack

### 更新记录

[CHANGELOG.md](https://github.com/chocho-1115/h5-webp/blob/main/CHANGELOG.md)

### 业务场景

很多时候我们都有活动营销类H5的开发，他们通常有以下特点：

* 开发周期短、上线时间短
* 项目数量多
* 项目体量小

总结起来就有“短频快”的特点。基于这些特点，体现在对开发的要求上就是要快速响应并产出，于是就有了这个项目。它主要解决了以下问题：

支持一套构建工程管理多个项目，避免多个项目管理多套构建工程的麻烦；
支持一键生成基础模板项目，提供原生与react两种模板类型满足不同项目需求，模板封装了一些常用基础功能，在模板下进行二次开发，提升开发效率；

### 基本使用

##### 新建项目
`
npm run create projectName/
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
`npm run dev template/template-react`

`npm run build template/template-react`

template下的模板是需要不断更新迭代的，所以我们需要让template也能跑起来。

# template

模板目录存放的是一套通用的h5开发模板，下面是模板里的一些功能介绍：

### 页面基本结构
~~~ html
<div class="content" id="content">
    <div class="page page0">
        <div class="nr">
        	<!--loading-->
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

### 页面初始化
~~~ js
import P from'./js/page.js'

P.init({
	// 需要支持滑动翻页时配置
    swipeB: [
        false, // 第0页 不能滑动
        1,     // 第1页 支持上划翻页
        0,     // 第2页 支持上划与下划翻页
        -1,    // 第3页 支持下划翻页
    ],
	// 翻页开始回调
    onChangeBefore(oldIndex, newIndex){
        
    },
	// 翻页结束回调
    onChangeAfter(oldIndex, newIndex){
        
    }
});

// 页面跳转
P.goto(2, {
	time: 300, // 动画时间，渐隐渐显动画 默认为300毫秒
	onChangeBefore: null, // 翻页开始回调 不会覆盖init函数里的回调 两者都会执行
	onChangeAfter: null, // 翻页结束回调
})

// 获取当前第几页
P.getIndex()

// 关掉滑动翻页 如果init配置了swipeB
P.setCutover(false)
~~~

### rem适配，支持横屏适配


~~~ js
import {remInit} from './common/rem.js'

// 竖屏适配
remInit({
	// 基础宽度 通常和设计稿宽度一致
	baseWidth: 750,
	// 在使用宽度适配时的 页面的最大宽度，此值只在按宽度适配时，才有效
	maxWidth: browserDetectInfo.isPc ? 750 : null, // 不限制最大宽度 即按浏览器宽度适配
	// 视窗显示的最小高度范围 当按宽度适配会裁切掉viewportMinHeight所指定的高度范围内的内容时 此时将按高度来适配
	// 所以按高度适配的临界值为 baseWidth / viewportMinHeight, 界面宽高比大于此值时 按高度适配
	// 此值可以为空
	viewportMinHeight: 1334,
});

// 横屏适配
remInit({
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

### 添加音乐
~~~ js
import {audio} from './common/audio.js'

//添加音乐
var audioEle = audio.create({
	src:'media/bj.mp3',
	autoplay:true, // 音乐是否自动播放
	loop:true // 是否循环播放
});
//给背景音乐添加一个按钮
audio.setButton({
	button:document.getElementById('micBtn'),
	audio:audioEle,
});

// 添加背景音乐
// activity.js
// 也是使用了audio.js，解决了安卓微信无法自动播放背景音乐的问题
audio.addBgMp3('static/media/bj.mp3') 
~~~

### 图片资源懒加载（并列加载方式）
~~~ html
<div class='lazy' data-src='image/bj.jpg'></div>
<img class='lazy' data-src='image/logo.png' />
~~~
加载所有 .lazy 元素的data-src属性指向的图片资源：
~~~ js
import {lazyload} from './common/lazyload.js'
lazyload('.lazy',{
	fileload:function(item){
		console.log(item.progress);
	},
	complete:function(assets){
		console.log(assets)
	},
	minTime: 6000,
	baseURL:''
});
~~~
如果元素为img，加载后的资源会赋值到src属性上。如果为非img元素，加载的资源会写到行内样式 background-image 中；

上面示例中的fileload方法，是单个资源加载后的回调函数。其中item.progress可以获取到加载进度，是一个0-1的数字；

上面示例中的complete方法中的assets，是所有的资源数组；

minTime：如果你有一个漂亮的loading动画，想要每个用户都有足够的时间来欣赏它，你可以设置最小加载时间。设置这个参数，在你测试loading页面的时候也非常有用。

### 调用相册图片
~~~ js
import {bindFileControl} from './common/utils.js'

let fileEle = bindFileControl(document.documentElement,'image/*',{
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
// compressionPic.js
compressionPIC(url, {maxSize:100,type:'image/png',encoderOptions:0.92},function(picdata){
	
})
~~~
maxSize 限制图片的最大尺寸；如果图片尺寸小于maxSize，返回的图片保持原始尺寸；
type为jpeg或webp的情况下，encoderOptions才起作用；









