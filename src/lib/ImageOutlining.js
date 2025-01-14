export default class ImageOutlining {

    // 颜色表
    static colorMap = {
        'red': "#f00",
        'green': "#0f0",
        'blue': "#00f",
        'yellow': "#ff0",
        'cyan': "#0ff",
        'magenta': "#f0f",
        'white': "#fff",
        'black': "#000",
        'gray': "#888",
        'grey': "#888",
        'reddish': "#f00",
        'greenish': "#0f0",
        'blueish': "#00f",
    }

    // 颜色转换（16进制转 rgb ）
    static hexToRgb(hex) {
        if (this.colorMap[hex]) hex = this.colorMap[hex]
        if (hex.length === 4) {
            hex = hex.replace(/[^0-9a-f]/gi, '')
            hex = hex.replace(/[0-9a-f]/gi, function (c) {
                return c + c
            })
        } else if (hex.length === 3) {
            hex = hex.replace(/[^0-9a-f]/gi, '')
        }
        return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16)
        }
    }

    #padding
    #strokes

    constructor(options) {

        // 原图
        this.image = options.image

        // 间距
        this.#padding = options.padding || 0

        // 描边列表
        this.#strokes = options.strokes || []

        // 输出尺寸
        this.width = 0
        this.height = 0

        // 增加的宽度
        this.offsetSize = 0

        // 放大比例
        this.scale = 2

        // 像素清晰化程度
        this.k = 25

        // 放大绘制尺寸
        this.scaleWidth = 0
        this.scaleHeight = 0

        // 图片canvas
        this.imageCanvas = document.createElement('canvas')
        this.imageCtx = this.imageCanvas.getContext('2d')
        this.imageCtx.imageSmoothingEnabled = true


        // 结果canvas
        this.resultCanvas = document.createElement('canvas')
        this.resultCtx = this.resultCanvas.getContext('2d')
        this.resultCtx.imageSmoothingEnabled = true

        // 设置尺寸
        this.setSize()

    }

    // 设置尺寸
    setSize() {

        // 增加的宽度
        this.offsetSize = this.#padding + this.#strokes.reduce((v, o) => v + o.width, 0)

        // 输出尺寸
        this.width = this.image.width + this.offsetSize * 2
        this.height = this.image.height + this.offsetSize * 2

        // 放大绘制尺寸
        this.scaleWidth = this.width * this.scale
        this.scaleHeight = this.height * this.scale

        // 设置  基础画布 尺寸
        this.imageCanvas.width = this.scaleWidth
        this.imageCanvas.height = this.scaleHeight
        this.imageCtx.clearRect(0, 0, this.scaleWidth, this.scaleHeight)
        this.imageCtx.drawImage(
            this.image,
            this.offsetSize * this.scale,
            this.offsetSize * this.scale,
            this.image.width * this.scale,
            this.image.height * this.scale
        )

        // 设置  结果画布 尺寸
        this.resultCtx.clearRect(0, 0, this.width, this.height)
        this.resultCanvas.width = this.width
        this.resultCanvas.height = this.height

    }

    // 边缘实体化
    toEdge(canvas, color) {
        const { r, g, b } = ImageOutlining.hexToRgb(color)
        const ctx = canvas.getContext('2d')
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        for (let i = 0; i < imageData.data.length; i += 4) {

            imageData.data[i + 0] = r
            imageData.data[i + 1] = g
            imageData.data[i + 2] = b

            let aIndex = i + 3

            if (imageData.data[aIndex] > this.k) imageData.data[aIndex] = 255
            else imageData.data[aIndex] = 0
        }
        ctx.putImageData(imageData, 0, 0)
    }

    // 创建描边图像
    createStrokeCanvas(image, strokeColor, strokeWidth, strokeScale) {

        // 创建canvas
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const ctx = canvas.getContext('2d')
        ctx.imageSmoothingEnabled = true

        // 保存画笔状态
        ctx.save()

        // 绘制带阴影基础图像
        ctx.shadowColor = strokeColor
        ctx.shadowBlur = (strokeWidth + strokeWidth * 0.5) * strokeScale
        ctx.drawImage(image, 0, 0, image.width, image.height)

        // 边缘实体化
        this.toEdge(canvas, strokeColor)

        // 恢复画笔状态
        ctx.restore()
        ctx.save()

        // 绘制模糊描边
        ctx.filter = "blur(0.8px)"
        for (let i = 0; i < 10; i++) ctx.drawImage(canvas, 0, 0)

        // 恢复画笔状态
        ctx.restore()
        ctx.save()

        // 重新绘制基础图像
        ctx.drawImage(image, 0, 0, image.width, image.height)

        return canvas

    }

    // 输出图片
    output() {

        console.time("createStrokeCanvas")

        // 基础画布（带padding）
        let baseCanvas

        // 描边画布
        let strokeCanvas

        // 创建基础画布
        if (this.#padding) baseCanvas = this.createStrokeCanvas(this.imageCanvas, "white", this.#padding, this.scale)
        else baseCanvas = this.imageCanvas

        // 创建描边画布
        strokeCanvas = baseCanvas
        for (const item of this.#strokes) {
            const { color, width } = item
            const tempCanvas = this.createStrokeCanvas(strokeCanvas, color, width, this.scale)
            strokeCanvas = tempCanvas
        }

        // 边距
        if (this.#padding) {
            const ctx = strokeCanvas.getContext('2d')
            ctx.save()
            ctx.globalCompositeOperation = 'destination-out'
            ctx.drawImage(baseCanvas, 0, 0)
            ctx.restore()
            ctx.drawImage(this.imageCanvas, 0, 0, this.imageCanvas.width, this.imageCanvas.height)
        }


        // 恢复尺寸
        this.resultCtx.drawImage(strokeCanvas, 0, 0, this.width, this.height)

        console.timeEnd("createStrokeCanvas")
        return this.resultCanvas

    }


    get padding() {
        return this.#padding
    }
    set padding(value) {
        this.#padding = value
        this.setSize()
    }
    get strokes() {
        return this.#strokes
    }
    set strokes(value) {
        this.#strokes = value
        this.setSize()
    }

}

