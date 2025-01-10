export default class ImageOutlining {

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

        // 基础canvas
        this.baseCanvas = document.createElement('canvas')
        this.baseCtx = this.baseCanvas.getContext('2d')
        this.baseCtx.imageSmoothingEnabled = true

        // 临时canvas
        this.tempCanvas = document.createElement('canvas')
        this.tempCtx = this.tempCanvas.getContext('2d')
        this.tempCtx.imageSmoothingEnabled = true

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
        this.baseCanvas.width = this.scaleWidth
        this.baseCanvas.height = this.scaleHeight

        // 设置  临时画布 尺寸
        this.tempCanvas.width = this.scaleWidth
        this.tempCanvas.height = this.scaleHeight

        // 设置  结果画布 尺寸
        this.resultCanvas.width = this.width
        this.resultCanvas.height = this.height

    }

    // 像素边缘实体化
    toEdge(canvas) {
        const ctx = canvas.getContext('2d')
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        for (let i = 3; i < imageData.data.length; i += 4) {
            if (imageData.data[i] > this.k) imageData.data[i] = 255
            else imageData.data[i] = 0
        }
        ctx.putImageData(imageData, 0, 0)
    }

    // 绘制基础画布
    drawBaseCanvas() {

        // 重置画笔
        this.baseCtx.reset()

        // 绘制带阴影基础图像
        this.baseCtx.shadowColor = "white"
        this.baseCtx.shadowBlur = (this.#padding + this.#padding * 0.5) * this.scale
        this.baseCtx.drawImage(
            this.image,
            this.offsetSize * this.scale,
            this.offsetSize * this.scale,
            this.image.width * this.scale,
            this.image.height * this.scale
        )

        // 边缘实体化
        this.toEdge(this.baseCanvas)
    }

    // 绘制描边
    drawStrokes() {

        // 重置画笔
        this.tempCtx.reset()

        // 保存画笔状态
        this.tempCtx.save()

        // 绘制基础图像
        this.tempCtx.drawImage(this.baseCanvas, 0, 0, this.baseCanvas.width, this.baseCanvas.height)

        // 循环绘制描边
        for (const item of this.strokes) {

            // 获取描边颜色和宽度
            const { color, width } = item

            // 描边
            this.tempCtx.shadowColor = color
            this.tempCtx.shadowBlur = (width + width * 0.5) * this.scale
            this.tempCtx.drawImage(this.tempCanvas, 0, 0, this.baseCanvas.width, this.baseCanvas.height)

            // 恢复画笔状态
            this.tempCtx.restore()
            this.tempCtx.save()

            // 镂空
            this.tempCtx.globalCompositeOperation = "destination-out"
            this.tempCtx.drawImage(this.baseCanvas, 0, 0, this.baseCanvas.width, this.baseCanvas.height)

            // 边缘实体化
            this.toEdge(this.tempCanvas)

            // 恢复画笔状态
            this.tempCtx.restore()
            this.tempCtx.save()

        }

       

        // 恢复画笔状态
        this.tempCtx.restore()
        this.tempCtx.save()
        this.tempCtx.drawImage(this.baseCanvas, 0, 0, this.baseCanvas.width, this.baseCanvas.height)


    }

    output() {

        // 绘制基础画布
        this.drawBaseCanvas()

        // 绘制描边
        this.drawStrokes()

        this.resultCtx.drawImage(this.tempCanvas, 0, 0, this.width, this.height)

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

