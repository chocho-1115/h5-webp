// 预载器
export function preload(srcArr, params) {
    if (typeof (srcArr) == 'string') {
        srcArr = [{ path: srcArr }]
    };
    if (srcArr.length == 0) { params.complete && params.complete({}); return false };
    let num = 0,
        imgArrObj = {},
        minTime = params.minTime || 0,
        baseURL = params.baseURL || '',
        len = srcArr.length,
        t = minTime / len,
        st = (new Date()).getTime()

    for (let i = 0; i < len; i++) {
        (function (i) {
            if (typeof (srcArr[i]) == 'string') srcArr[i] = { path: srcArr[i], name: i }
            let newImg = new Image()
            if (srcArr[i].crossOrigin) newImg.crossOrigin = srcArr[i].crossOrigin
            newImg.onload = newImg.onerror = function (e) {
                e = e || window.event
                let self = this
                endLoad(self, e.type, i)
            }
            setTimeout(function () {
                newImg.src = baseURL + srcArr[i].path
            }, t * (i + 1) - ((new Date()).getTime() - st))
        }(i))
    }
    function endLoad(this_, eType, i) {
        num++
        let progress = num / len
        srcArr[i]['result'] = this_
        srcArr[i]['progress'] = progress
        srcArr[i]['index'] = i
        srcArr[i]['status'] = eType == 'load' ? 200 : 'Failed to load'
        imgArrObj[srcArr[i].name] = this_
        params.fileload && params.fileload(srcArr[i])
        if (num === len) params.complete && params.complete(imgArrObj)
    }
}
// 
export function lazyload(selector, params) {
    params = params || {}
    let doc = document,
        assets = [],
        ele = doc.querySelectorAll(selector),
        baseURL = params.baseURL || ''

    for (let i = 0, len = ele.length; i < len; i++) {
        let obj = { path: '', type: '', ele: ele[i], name: '_' + i, crossOrigin: null }
        if (ele[i].nodeName === 'IMG') {
            obj.type = 'img'
        } else {
            obj.type = 'bj'
        }
        obj.path = ele[i].getAttribute('data-src')
        obj.crossOrigin = ele[i].getAttribute('crossOrigin')
        // 过滤已转为base64的图片
        let result = /^data:([^;]+);base64,/gmi
        if (result.test(obj.path)) {
            if (obj.type == 'img') {
                obj.ele.setAttribute('src', obj.path)
            } else if (obj.type == 'bj') {
                obj.ele.style.backgroundImage = 'url(' + obj.path + ')'
            }
            continue
        }
        if (obj.path) {
            assets.push(obj)
        }
    };
    preload(assets, {
        fileload: function (item) {
            if (item.status === 200) {
                if (item.type == 'img') {
                    item.ele.setAttribute('src', baseURL + item.path)
                } else if (item.type == 'bj') {
                    item.ele.style.backgroundImage = 'url(' + baseURL + item.path + ')'
                }
            }
            if (params.fileload) params.fileload(item)
        },
        complete: function (result) {
            if (params.complete) params.complete(result)
        },
        minTime: params.minTime,
        baseURL
    })
}