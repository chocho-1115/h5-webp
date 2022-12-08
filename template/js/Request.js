var baseHeader = {};

var RequestPost = async (url, data, options) => {
	options = options || {};
	options.method = 'POST'
	let res = await Request(url, data, options)
	return res
}
var RequestGet = async (url, data, options) => {
	options = options || {};
	options.method = 'GET'
	let res = await Request(url, data, options)
	return res
}
var Request = async (url, data, options) => {
	let res = await baseRequest(url, data, options)
	return res
}
var AddRequestHeader = function (key, value) {
	if (!key) return;
	baseHeader[key] = value ?? '';
}
var RemoveRequestHeader = function (key) {
	if (!key) return;
	if (baseHeader[key] === undefined) return;
	if (Reflect?.deleteProperty) {
		Reflect.deleteProperty(baseHeader, key)
	} else {
		delete baseHeader[key]
	}
}
function baseRequest(url, data, options) {
	data = data || {};
	options = options || {};
	options.header = options.header || {};
	options.root = options.root || '';
	options.async = options.async === undefined ? true : !!options.async;
	options.method = (options.method || 'POST').toUpperCase();

	var promise = new Promise(function (resolve, reject) {
		var handler = function () {
			if (this.readyState !== 4) return;
			if (this.status >= 200 && this.status < 300) {
				resolve(this.response);
			} else {
				reject(this.response);
			}
		};
		var client = new XMLHttpRequest();
		var header = Object.assign({}, baseHeader, options.header);
		if (options.method == 'GET') {
			url += (function (obj) {
				var str = "";
				for (var prop in obj) {
					str += prop + "=" + obj[prop] + "&"
				}
				return str.length > 0 ? '?' + str.substring(0, str.length - 1) : '';
			})(data);
		}

		client.addEventListener('readystatechange', handler);
		if(options.loadCallback) client.addEventListener('load', options.loadCallback);
		client.open(options.method, options.root + url, options.async);
		client.responseType = "json";

		client.setRequestHeader("content-type", "application/json");
		// HTTP的If-Modified-Since头标签与客户端缓存相互配合，可节约网络流量。
		// client.setRequestHeader("If-Modified-Since", "0");
		for (name in header) {
			client.setRequestHeader(name, header[name]);
		}
		if (options.method == 'GET') {
			client.send(null);
		} else {
			//if(options.method=='POST'){
			client.send(data ? JSON.stringify(data) : '');
			//}else 
		}
	});
	return promise;
};

export {
	RequestPost,
	RequestGet,
	Request,
	AddRequestHeader,
	RemoveRequestHeader,
	baseRequest
}