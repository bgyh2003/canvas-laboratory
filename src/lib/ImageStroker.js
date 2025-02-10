export default class ImageStroker {

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

        // 图片canvas
        this.imageCanvas = document.createElement('canvas')
        this.imageCtx = this.imageCanvas.getContext('2d')
        this.imageCtx.imageSmoothingEnabled = true


        // 结果canvas
        this.resultCanvas = document.createElement('canvas')
        this.resultCtx = this.resultCanvas.getContext('2d')
        this.resultCtx.imageSmoothingEnabled = true

        // 初始化
        this.setSize()

    }


    setSize() {

        // 增加的宽度
        this.offsetSize = this.#padding + this.#strokes.reduce((v, o) => v + o.width, 0)

        // 输出尺寸
        this.width = this.image.width + this.offsetSize * 2
        this.height = this.image.height + this.offsetSize * 2

        // 设置  图片画布 尺寸
        this.imageCtx.clearRect(0, 0, this.width, this.height)
        this.imageCanvas.width = this.width
        this.imageCanvas.height = this.height
        this.imageCtx.clearRect(0, 0, this.width, this.height)
        this.imageCtx.drawImage(this.image, this.offsetSize, this.offsetSize)

        // 设置  结果画布 尺寸
        this.resultCtx.clearRect(0, 0, this.width, this.height)
        this.resultCanvas.width = this.width
        this.resultCanvas.height = this.height

    }

    // 输出
    async output() {

        // 基础画布（带padding）
        let baseCanvas

        // 描边画布
        let strokeCanvas

        if (this.#padding) baseCanvas = await this.createStroke(this.imageCanvas, "white", this.#padding)
        else baseCanvas = this.imageCanvas


        // 创建描边画布
        strokeCanvas = baseCanvas
        for (const item of this.#strokes) {
            const { color, width } = item
            strokeCanvas = await this.createStroke(strokeCanvas, color, width)
        }


        // 边距
        if (this.#padding) {
            const ctx = strokeCanvas.getContext('2d')
            ctx.save()
            ctx.globalCompositeOperation = 'destination-out'
            ctx.drawImage(baseCanvas, 0, 0)
            ctx.restore()

        }

        const ctx = strokeCanvas.getContext('2d')
        ctx.drawImage(this.imageCanvas, 0, 0)



        return strokeCanvas

    }


    // 创建描边
    async createStroke(canvas, color, width) {

        // 黑白图画布
        const [blackCanvas, blackCtx] = this.createCanvas(canvas.width, canvas.height)

        // 黑白图画布 绘制原图
        blackCtx.drawImage(canvas, 0, 0)

        // 黑白图画布 全部像素变城黑色
        blackCtx.globalCompositeOperation = 'source-in'
        blackCtx.fillStyle = 'black'
        blackCtx.fillRect(0, 0, canvas.width, canvas.height)

        // 黑白图画布 添加白色背景
        blackCtx.globalCompositeOperation = 'destination-over'
        blackCtx.fillStyle = 'white'
        blackCtx.fillRect(0, 0, canvas.width, canvas.height)

        // 描边画布
        const [svgCanvas, svgCtx] = this.createCanvas(canvas.width, canvas.height)
        svgCtx.save()

        // 获svg取路径
        const pathStr = await this.getSvgPath(blackCanvas)

        // 创建路径对象
        let p = new Path2D(pathStr)

        // 渲染路径
        svgCtx.translate(0, canvas.height)
        svgCtx.scale(0.1, -0.1)
        svgCtx.strokeStyle = color
        svgCtx.lineJoin = "round"
        svgCtx.lineCap = "round"
        svgCtx.lineWidth = 10 * width * 2
        svgCtx.stroke(p)

        // 镂空
        svgCtx.globalCompositeOperation = 'destination-out'
        svgCtx.fillStyle = 'black'
        svgCtx.fill(p)

        // 修补镂空瑕疵
        svgCtx.globalCompositeOperation = 'source-over'
        svgCtx.lineWidth = 20
        svgCtx.stroke(p)


        // 绘制原图
        svgCtx.restore()
        svgCtx.drawImage(canvas, 0, 0, this.width, this.height)

        return svgCanvas

    }


    // 获取svg路径
    async getSvgPath(canvas) {

        // 提取svg
        const svg = await loadFromCanvas(canvas)

        // 解析svg
        const parser = new DOMParser()
        const doc = parser.parseFromString(svg, 'image/svg+xml')

        // 获取path
        const svgPath = doc.querySelector('svg g path')

        // 获取路径
        const pathStr = svgPath.getAttribute('d')

        return pathStr.split("m")[0]

    }


    createCanvas(width, height) {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.imageSmoothingEnabled = true
        return [canvas, ctx]
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