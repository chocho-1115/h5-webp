// 压缩图片
// quality 可选
// 在指定图片格式为 image/jpeg 或 image/webp的情况下，可以从 0 到 1 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 0.92。其他参数会被忽略。

import {getRandomStr} from '../common/utils.js'

export function compressionPIC(src, opt, callback) {
    
    let maxSize = Math.max(opt.maxSize, 0) || 0
    let exif_orientation = opt.exif_orientation || 0
    let type = opt.type || 'image/png'
    let quality = opt.quality || 0.92
    let encode = opt.encode || 'base64'// 支持 base64、blob、file 默认base64

    let Img = new Image()
    Img.onload = init
    Img.onerror = function () {
        let Img = new Image()
        Img.onload = init
        Img.src = src
    }

    Img.crossOrigin = 'Anonymous'// 解决跨域问题，需在服务器端运行，也可为 anonymous   
    Img.src = src

    function init() {

        let canvas = document.createElement('canvas')

        if (!maxSize) maxSize = Math.max(this.width, this.height)

        // 图片原始尺寸
        let sw = this.width
        let sh = this.height
        // 缩放后的尺寸
        let ew = 0, eh = 0
        if (sw >= sh) {
            ew = Math.min(maxSize, sw)
            eh = sh * ew / sw
        } else {
            eh = Math.min(maxSize, sh)
            ew = sw * eh / sh
        }

        //	Orientation  1	0°  3	180°  6	顺时针90°  8	逆时针90°
        // 画布尺寸 输出尺寸
        let canW = ew, canH = eh
        let rotate = 0
        if (exif_orientation == 6) {
            canW = eh
            canH = ew
            rotate = 90
        } else if (exif_orientation == 8) {
            canW = eh
            canH = ew
            rotate = -90
        } else if (exif_orientation == 3) {
            rotate = 180
        }

        canvas.width = canW
        canvas.height = canH
        let ctx = canvas.getContext('2d')
        ctx.translate(canW / 2, canH / 2)
        ctx.rotate(Math.PI / 180 * rotate)

        ctx.drawImage(this, -ew / 2, -eh / 2, ew, eh)
        // ctx.drawImage(this, 0, 0, this.width, this.height, -h/2, -w/2, h, w);

        // 导出 base64
        callback && encode === 'base64' && callback({
            width: canW,
            height: canH,
            result: canvas.toDataURL(type, quality)
        })
        // 导出 blob
        callback && encode === 'blob' && canvas.toBlob(function (blob) {
            callback({
                width: canW,
                height: canH,
                result: blob
            })
        }, type)
        // 导出 file
        callback && encode === 'file' && canvas.toBlob(function (blob) {
            let filesName = getRandomStr(8)
            let files = new File([blob], filesName, { type: type })
            callback({
                width: canW,
                height: canH,
                result: files
            })
        }, type)
    }
}