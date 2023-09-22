// 默认配置
let defaultConfig = {
	root: '',
	async: true,
	method: 'get',
	responseType: 'json',
	headers: {
		"content-type": "application/x-www-form-urlencoded", // 简单请求 application/x-www-form-urlencoded、multipart/form-data 或 text/plain
		// "content-type": "application/json",
		// "If-Modified-Since": "0" //// HTTP的If-Modified-Since头标签与客户端缓存相互配合，可节约网络流量。
	}
}

function Http(config = {}){
	//强制使用new
	if(!(this instanceof Http)){
		return new Http(config);
	}
	// 配置
	this.default = config
	// 拦截器
	this.interceptors = {
		request: new InterceptorManager(),
		response: new InterceptorManager()
	};
}

Http.prototype.request = function(url, data, config = {}){

	// 合并默认配置和传入的配置
	config = mergeConfig(this.default, config);
	const headers = config.headers;

	config.method = config.method ? config.method.toUpperCase() : 'GET';

	const promise = new Promise(function (resolve, reject) {
		const handler = function () {
			if (this.readyState !== 4) return;
			if (this.status >= 200 && this.status < 300) {
				resolve(this.response);
			} else {
				reject(this.response);
			}
		};
		const client = new XMLHttpRequest();
		if (config.method == 'GET') {
			url += (function (obj) {
				let str = "";
				for (let prop in obj) {
					str += prop + "=" + obj[prop] + "&"
				}
				return str.length > 0 ? '?' + str.substring(0, str.length - 1) : '';
			})(data);
		}

		client.addEventListener('readystatechange', handler);
		if (config.loadCallback) client.addEventListener('load', config.loadCallback);
		client.open(config.method, url.substring(0,4) == 'http' ? url : config.root + url, config.async);
		client.responseType = config.responseType;
		
		for (name in headers) {
			client.setRequestHeader(name, headers[name]);
		}
		if (config.method == 'GET') {
			client.send(null);
		} else {
			//if(config.method=='POST'){
			client.send(data ? JSON.stringify(data) : '');
			//}else 
		}
	});
	return promise;
}
// 新增请求方法
Array.prototype.forEach.call([
	'delete', 'get', 'head', 'options', 
	'post', 'put', 'patch'
], ele => {
	Http.prototype[ele] = function(url, data, config = {}) {
		return this.request(url, data, Object.assign(config, {
			method: ele
		}));
	};
});

// 配置合并
function mergeConfig(config1 = {}, config2 = {}){
	const headers = Object.assign({}, config1.headers, config2.headers)
	var config = Object.assign({}, config1, config2)
	config.headers = headers
	return config
}

///////// 核心方法 生成Http对象： 当对象使用，也可以当方法使用
function createInstance(config) {
	//实例化一个对象
	let context = new Http(config);// context.get（） context.post(), 但是不能当作函数使用 context() X
	//创建请求函数
	let instance = Http.prototype.request.bind(context);// 等价 context.request(), 但是不能当作对象使用 属性和方法
	// 把Http.prototype对象的方法添加到instance 函数对象中，但是没有构造函数中的属性 default
	Object.keys(Http.prototype).forEach(key => {
		instance[key] = Http.prototype[key].bind(context);
	})
	//给instance 添加 default
	Object.keys(context).forEach(key => {
		instance[key] = context[key];
	})
	return instance;
}

let http = createInstance(defaultConfig)

// 构建新实例 这里只需要绑定在导出的http上 不需要绑定在用户创建的每个实例上
http.create = function(config = {}){
	return createInstance(mergeConfig(http.defaults, config));
}

export default http