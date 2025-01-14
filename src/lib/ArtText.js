import FilterBump from "./FilterBump"
import { Group, Text, Canvas } from "leafer-ui"

export default class ArtText {

    // 渐变色配置
    static fillMap = {
        black: {
            type: 'linear',
            from: { type: 'percent', x: 0.36, y: 0, },
            to: { type: 'percent', x: 0.51, y: 1, },
            stops: [
                { offset: 0.15, color: '#000' },
                { offset: 0.23, color: '#eee' },
                { offset: 0.24, color: '#efefef' },
                { offset: 0.26, color: '#eee' },
                { offset: 0.35, color: '#000' },
                { offset: 0.45, color: '#eee' },
                { offset: 0.46, color: '#efefef' },
                { offset: 0.47, color: '#eee' },
                { offset: 0.6, color: '#000' },
                { offset: 1, color: '#fff' },
            ]
        },

        blue: {
            type: 'linear',
            from: { type: 'percent', x: 0.36, y: 0, },
            to: { type: 'percent', x: 0.51, y: 1, },
            stops: [

                { offset: 0.1, color: '#fff' },
                { offset: 0.25, color: '#2BCCFE' },
                { offset: 0.3, color: '#fff' },
                { offset: 0.31, color: '#fff' },
                { offset: 0.37, color: '#5ECCF7' },
                { offset: 0.44, color: '#D7F7FF' },
                { offset: 0.45, color: '#D7F7FF' },
                { offset: 0.47, color: '#3EC7FA' },
                { offset: 0.5, color: '#4CEDFA' },
                { offset: 0.55, color: '#4CEDFA' },
                { offset: 0.65, color: '#144061' },
                { offset: 0.75, color: '#002230' },


                { offset: 0.9, color: '#93E7FF' },
            ]
        },

        gold: {
            type: 'linear',
            from: { type: 'percent', x: 0.36, y: 0, },
            to: { type: 'percent', x: 0.51, y: 1, },
            stops: [
                { offset: 0, color: '#fff' },
                { offset: 0.2, color: '#E9AD64' },
                { offset: 0.26, color: '#BF6351' },
                { offset: 0.32, color: '#fff' },
                { offset: 0.35, color: '#fff' },
                { offset: 0.37, color: '#EBC482' },
                { offset: 0.5, color: '#F1F2E1' },
                { offset: 0.52, color: '#E9AF66' },
                { offset: 0.55, color: '#EDE2BC' },
                { offset: 0.6, color: '#D99B65' },
                { offset: 0.7, color: '#3B2107' },
                { offset: 0.8, color: '#EEC38D' },
            ]
        },

        green: {
            type: 'linear',
            from: { type: 'percent', x: 0.36, y: 0, },
            to: { type: 'percent', x: 0.51, y: 1, },
            stops: [
                { offset: 0.28, color: '#4CE380' },
                { offset: 0.30, color: '#E4E4E7' },
                { offset: 0.34, color: '#70EBB7' },
                { offset: 0.4, color: '#CAFFE7' },
                { offset: 0.45, color: '#5CE690' },
                { offset: 0.5, color: '#4FE698' },
                { offset: 0.65, color: '#1B5846' },
                { offset: 0.7, color: '#052B1C' },
                { offset: 0.9, color: '#8CFFC3' },
            ]
        },

        red: {
            type: 'linear',
            from: { type: 'percent', x: 0.36, y: 0, },
            to: { type: 'percent', x: 0.51, y: 1, },
            stops: [
                { offset: 0.2, color: '#FA3B59' },
                { offset: 0.28, color: '#FC2E33' },
                { offset: 0.31, color: '#fff' },
                { offset: 0.32, color: '#fff' },
                { offset: 0.38, color: '#F95D5A' },
                { offset: 0.4, color: '#F95D5A' },
                { offset: 0.45, color: '#FFC9CC' },
                { offset: 0.47, color: '#FFC9CC' },
                { offset: 0.5, color: '#FA3E3F' },
                { offset: 0.55, color: '#EC485D' },
                { offset: 0.65, color: '#300300' },
                { offset: 0.8, color: '#EB6164' },
            ]
        },

        sliver: {
            type: 'linear',
            from: { type: 'percent', x: 0.36, y: 0, },
            to: { type: 'percent', x: 0.51, y: 1, },
            stops: [
                { offset: 0.21, color: '#A9A9A9' },
                { offset: 0.27, color: '#9D9D9D' },

                { offset: 0.32, color: '#fff' },
                { offset: 0.33, color: '#fff' },
                { offset: 0.4, color: '#BCBCBC' },
                { offset: 0.47, color: '#EDEDED' },
                { offset: 0.53, color: '#AAAAAA' },
                { offset: 0.56, color: '#C2C2C2' },
                { offset: 0.67, color: '#181818' },
                { offset: 0.7, color: '#181818' },
                { offset: 0.85, color: '#C7C7C7' },


            ]
        },

        pink: {
            type: 'linear',
            from: { type: 'percent', x: 0.36, y: 0, },
            to: { type: 'percent', x: 0.51, y: 1, },
            stops: [

                { offset: 0.23, color: '#E95190' },
                { offset: 0.3, color: '#fff' },
                { offset: 0.32, color: '#fff' },
                { offset: 0.37, color: '#EB82BD' },
                { offset: 0.5, color: '#FDC7E6' },
                { offset: 0.52, color: '#E96698' },
                { offset: 0.57, color: '#FFFCFF' },
                { offset: 0.59, color: '#FFFCFF' },
                { offset: 0.65, color: '#D45E98' },
                { offset: 0.8, color: '#3B0718' },
                { offset: 0.9, color: '#FF99C4' }
            ]
        },

        "light pink": "#e65d85"
    }

    constructor(options) {

        // 属性
        this.attrs = {

            // 基础文字参数
            padding: options.padding ?? null,
            x: options.x ?? 0,
            y: options.y ?? 0,
            scaleX: 1,
            scaleY: 1,
            rotation: options.rotation ?? 0,
            fontFamily: options.fontFamily ?? "Calibri",
            text: options.text ?? "Hello World",
            fontSize: options.fontSize ?? 20,
            fontWeight: options.fontWeight ?? "normal",
            stroke: options.stroke ?? null,
            strokeJoin: options.strokeJoin ?? "round",
            fill: options.fill ?? "black",

            // 特殊属性
            fillMapName: options.fillMapName ?? null,

            // 3D效果属性
            "3D": {
                enable: options["3D"]?.enable ?? false,
                offsetX: options["3D"]?.offsetX ?? 0,
                offsetY: options["3D"]?.offsetY ?? 0,
                fill: options["3D"]?.fill ?? "black",
            },

            // 滤镜
            filter: {
                enable: options.filter?.enable ?? false,
                k: options.filter?.k ?? 0,
            },

            ...options
        }

        // 临时画布
        this.tempCanvas = new Canvas()

        // leafer画布
        this.leaferCanvas = new Canvas({ pixelRatio: 2 })

        // 结果画布
        this.resCanvas = document.createElement("canvas")

        // 组
        this.leaferGroup = new Group()

        // 基础文字对象
        this.leaferText = new Text()

        // 添加到组
        this.leaferGroup.add(this.leaferText)

        // 3D文字对象数据
        this.leaferTextExtends = []

        // 元素包围盒
        this.width = 0
        this.width = 0

        // 创建滤镜对象
        this.filter = null

        // 渲染
        this.renderText()
        this.render3d()
        this.drawGroup()
        this.renderFilter()
    }

    setText(options = {}) {
        this.attrs = { ...this.attrs, ...options }
        this.renderText()
        this.render3d()
        this.drawGroup()
        this.renderFilter()
    }

    set3d(options = {}) {
        this.attrs["3D"] = { ...this.attrs["3D"], ...options }
        this.render3d()
        this.drawGroup()
        this.renderFilter()
    }

    setFilter(options = {}) {
        this.attrs.filter = { ...this.attrs.filter, ...options }
        this.renderFilter()
    }

    renderText() {
        this.leaferText.padding = this.attrs.padding
        this.leaferText.x = this.attrs.x
        this.leaferText.y = this.attrs.y
        this.leaferText.scaleX = this.attrs.scaleX
        this.leaferText.scaleY = this.attrs.scaleY
        this.leaferText.lineHeight = this.attrs.fontSize
        this.leaferText.rotation = this.attrs.rotation
        this.leaferText.fontFamily = this.attrs.fontFamily
        this.leaferText.text = this.attrs.text
        this.leaferText.fontSize = this.attrs.fontSize
        this.leaferText.fontWeight = this.attrs.fontWeight
        this.leaferText.stroke = this.attrs.stroke
        this.leaferText.fill = this.attrs.fillMapName === null ? this.attrs.fill : ArtText.fillMap[this.attrs.fillMapName]
    }

    render3d() {

        // 销毁所有文字扩展
        for (const textExtend of this.leaferTextExtends) textExtend.destroy()
        this.leaferTextExtends = []

        // 提取3D效果参数
        const { enable, offsetX, offsetY, fill } = this.attrs["3D"]

        // 移除3D效果
        if (!enable) return

        //  找出最大值
        const max = Math.max(Math.abs(offsetX), Math.abs(offsetY)) * 10

        // 偏移系数(控制单层偏移量)
        const px = (Math.abs(offsetX) * 10) / max
        const py = (Math.abs(offsetY) * 10) / max

        // 坐标系数(控制正负)
        const fx = offsetX > 0 ? 1 : -1
        const fy = offsetY > 0 ? 1 : -1

        // 循环创建底层文字对象 
        for (let i = 1; i <= max; i++) {

            // 创建偏移量
            const ox = fx * i * 0.1 * px
            const oy = fy * i * 0.1 * py

            // 创建文字对象
            const textExtend = new Text({
                padding: this.attrs.padding,
                x: this.attrs.x + ox,
                y: this.attrs.y + oy,
                scaleX: this.attrs.scaleX,
                scaleY: this.attrs.scaleY,
                rotation: this.attrs.rotation,
                lineHeight: this.attrs.fontSize,
                fontFamily: this.attrs.fontFamily,
                text: this.attrs.text,
                fontSize: this.attrs.fontSize,
                fontWeight: this.attrs.fontWeight,
                strokeJoin: this.attrs.strokeJoin,
                fill: fill,
                zIndex: -i
            })
            this.leaferTextExtends.push(textExtend)
            this.leaferGroup.add(textExtend)
        }



    }

    drawGroup() {

        // 清空画布
        this.leaferCanvas.context.clearRect(0, 0, this.width, this.height)

        // 临时画布渲染
        this.tempCanvas.draw(this.leaferGroup)

        // 取出文字宽高
        const { width, height } = this.leaferGroup.boxBounds

        // 文字包围盒大小
        this.width = width * 2
        this.height = height * 2

        // 重置画布尺寸
        this.leaferCanvas.width = width
        this.leaferCanvas.height = height

        // 渲染到画布
        this.leaferCanvas.draw(this.leaferGroup)

        // 结果画布
        this.resCanvas.width = this.width
        this.resCanvas.height = this.height
        const resContext = this.resCanvas.getContext("2d")
        resContext.clearRect(0, 0, this.width, this.height)
        resContext.drawImage(this.leaferCanvas.canvas.view, 0, 0)

    }

    renderFilter() {

        // 提取滤镜参数
        const { enable, k } = this.attrs.filter

        // 像素处理
        this.filter = new FilterBump({
            sourceCanvas: this.leaferCanvas.canvas.view,
            targetCanvas: this.resCanvas,
            type: 0,
            k: enable ? k : 0
        })


    }

    destorySelf() {
        this.leaferGroup.destroy()
        this.leaferCanvas.destroy()
    }

}