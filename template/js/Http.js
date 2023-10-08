// 默认配置
let defaultsConfig = {
	data: null,
	params: null,
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

// 配置合并
function mergeConfig(config1, config2){
	config1 = config1 || {}
	config2 = config2 || {}
	const headers = Object.assign({}, config1.headers, config2.headers)
	var config = Object.assign({}, config1, config2)
	config.headers = headers
	return config
}

function dispatchRequest(config){
	// 合并默认配置和传入的配置
	config = mergeConfig(this.defaults, config);
	const headers = config.headers;
	let params = config.params;
	let url = config.url;

	config.method = config.method ? config.method.toUpperCase() : 'GET';

	const promise = new Promise(function (resolve, reject) {
		const handler = function () {
			if (this.readyState !== 4) return;
			if (this.status >= 200 && this.status < 300) {
				resolve({
					data: this.response, // this.responseText
					status: this.status,
					statusText: this.statusText,
					// headers: ,
					config: config,
					request: this
				});
			} else {
				reject(this.response);
			}
		};
		
		const client = new XMLHttpRequest();
		// 所有请求都可以通过url传递数据；只有post、put和patch请求可以发送body
		if (params) {
			let info = url.split('?');
			url = info[0];

			let urlParams = {};
			info[1] && info[1].replace(/([^=]+)=(\w+)/g, function(_, key, value) {
				urlParams[key] = value;
			});

			params = Object.assign(urlParams, params)

			let str = "";
			for (let name in params) {
				str += name + "=" + params[name] + "&"
			}
			if(str.length > 0) str = str.substring(0, str.length - 1);
			url += url.indexOf('?')>-1 ? str : '?' + str
		}
		// readystatechange会触发多次，优先使用loadend
		if ('onloadend' in client) {
			client.addEventListener('loadend', handler);
		} else {
			client.addEventListener('readystatechange', handler);
		};
		
		client.open(config.method, url.substring(0,4) == 'http' ? url : config.root + url, config.async);
		client.responseType = config.responseType;
		
		for (name in headers) {
			client.setRequestHeader(name, headers[name]);
		}

		client.send(config.data ? JSON.stringify(config.data) : null);

	});
	return promise;
}

// 拦截器构造函数
function InterceptorManager() {
	this.handlers = [];
}
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
	this.handlers.push({
		fulfilled: fulfilled,
		rejected: rejected,
		synchronous: options ? options.synchronous : false,
		runWhen: options ? options.runWhen : null
	});
	return this.handlers.length - 1;
};

// 直接设置为null即可 无需剪切数组 这样每一项ID保持为项的数组索引不变，也避免了重新剪切拼接数组的性能损失。
InterceptorManager.prototype.eject = function eject(id) {
	if (this.handlers[id]) {
		this.handlers[id] = null;
	}
};

function Http(config = {}){
	//强制使用new
	if(!(this instanceof Http)){
		return new Http(config);
	}
	// 配置
	this.defaults = config
	// 拦截器
	this.interceptors = {
		request: new InterceptorManager(),
		response: new InterceptorManager()
	};
}
Http.prototype.request = function(config = {}){
	// 拦截器和请求组装队列
	let chain = [dispatchRequest.bind(this), undefined] // 必须成对出现的

	// 请求拦截
	this.interceptors.request.handlers.forEach(interceptor => {
		chain.unshift(interceptor.fulfilled, interceptor.rejected)
	})

	// 响应拦截
	this.interceptors.response.handlers.forEach(interceptor => {
		chain.push(interceptor.fulfilled, interceptor.rejected)
	})

	let promise = Promise.resolve(config);
	while(chain.length > 0) {
		promise = promise.then(chain.shift(), chain.shift())
	}
	return promise;
}
// 添加请求方法
Array.prototype.forEach.call([
	'delete', 'get', 'head', 'options'
], ele => {
	Http.prototype[ele] = function(url, config) {
		return this.request(Object.assign(config || {}, {
			method: ele,
			url,
		}));
	};
});
// 添加请求方法
Array.prototype.forEach.call([
	'post', 'put', 'patch'
], ele => {
	Http.prototype[ele] = function(url, data, config) {
		return this.request(Object.assign(config || {}, {
			method: ele,
			url,
			data
		}));
	};
});

///////// 生成导出对象
function createInstance(config) {
	// 实例化一个对象
	let context = new Http(config); // context.get（） context.post(), 但是不能当作函数使用 context() X
	// 创建请求函数
	let instance = Http.prototype.request.bind(context);// 等价 context.request(), 但是不能当作对象使用 属性和方法
	// 把Http.prototype对象的方法添加到instance函数对象上
	Object.keys(Http.prototype).forEach(key => {
		instance[key] = Http.prototype[key].bind(context);
	})
	// 把Http实例属性添加到instance函数对象上
	Object.keys(context).forEach(key => {
		instance[key] = context[key];
	})
	return instance;
}

let http = createInstance(defaultsConfig)

// 构建新实例 这里只需要绑定在导出的http上 不需要绑定在用户创建的每个实例上
http.create = function(config = {}){
	return createInstance(mergeConfig(http.defaults, config)); // http.defaults 是全局的默认配置
}

export default http