export default class FilterBump {

    static bilinearInterpolate(imgData, x, y, width, height) {

        // 获取四个邻近的像素点 (坐标为 (x0, y0), (x1, y0), (x0, y1), (x1, y1))
        const x0 = Math.floor(x);
        const x1 = Math.min(x0 + 1, width - 1);
        const y0 = Math.floor(y);
        const y1 = Math.min(y0 + 1, height - 1);

        const y0Width = y0 * width
        const y1Width = y1 * width

        // 获取四个像素的颜色值
        const i0 = (y0Width + x0) * 4;
        const i1 = (y0Width + x1) * 4;
        const i2 = (y1Width + x0) * 4;
        const i3 = (y1Width + x1) * 4;

        // 计算相对位置
        const dx = x - x0;
        const dy = y - y0;

        const cc = dx * (1 - dy)
        const dd = (1 - dx) * dy
        const ee = dx * dy
        const ff = (1 - dx) * (1 - dy)

        // 对红、绿、蓝三个通道分别进行插值
        const r = ff * imgData[i0] + cc * imgData[i1] + dd * imgData[i2] + ee * imgData[i3];
        const g = ff * imgData[i0 + 1] + cc * imgData[i1 + 1] + dd * imgData[i2 + 1] + ee * imgData[i3 + 1];
        const b = ff * imgData[i0 + 2] + cc * imgData[i1 + 2] + dd * imgData[i2 + 2] + ee * imgData[i3 + 2];
        const a = ff * imgData[i0 + 3] + cc * imgData[i1 + 3] + dd * imgData[i2 + 3] + ee * imgData[i3 + 3];

        // 返回插值后的颜色值
        return { r, g, b, a };
    }

    static getPoint(point, distance, half, k) {
        const epsilon = 0.0001; // 一个非常小的常量
        const denominator = 1 - k + (distance * k / half) + epsilon;
        return (point - (half - distance) * k) / denominator;
    }

    constructor(options = {}) {

        // 源画布
        this.sourceCanvas = options.sourceCanvas
        this.width = this.sourceCanvas.width // 宽
        this.height = this.sourceCanvas.height // 高
        this.sourceContext = this.sourceCanvas.getContext('2d') // 源画布上下文
        this.sourceImageData = this.sourceContext.getImageData(0, 0, this.width, this.height) // 源画布数据
        this.sourceData = this.sourceImageData.data

        // 目标画布
        this.targetCanvas = options.targetCanvas
        this.targetCanvas.width = this.width
        this.targetCanvas.height = this.height
        this.targetContext = this.targetCanvas.getContext('2d')// 目标画布上下文
        this.targetImageData = this.targetContext.createImageData(this.targetCanvas.width, this.targetCanvas.height) // 目标画布数据
        this.targetData = this.targetImageData.data

        // 参数
        this.rw = this.width * 4
        this.tw = this.targetCanvas.width * 4

        //凸起类型  0:上下凸起  1:左右凸起
        this.type = options.type ?? 0

        // 凸起深度
        this.k = "k" in options ? +options.k : 0

        // 圆中心点
        this.centerX = this.width / 2
        this.centerY = this.height / 2

        // 长边长度
        this.longSide = Math.max(this.width, this.height)

        // 短边长度
        this.shortSide = Math.min(this.width, this.height)

        // 圆半径
        this.radius = Math.sqrt(Math.pow(this.longSide / 2, 2) + Math.pow(this.shortSide / 2, 2))

        // 半径平方
        this.radiusSquare = Math.pow(this.radius, 2)

        // 矩形半区长度
        this.half = (this.type === 0 ? this.height : this.width) / 2

        // 直角点
        this.baseCenter = this.type === 0 ? this.centerX : this.centerY

        this.render()

    }

    render() {

        // 清空画布
        this.targetData.fill(0)

        // 遍历源画布像素
        for (let y = 0; y < this.height; y++) {
            const sw = y * this.tw
            for (let x = 0; x < this.width; x++) {

                // 主点
                const currentPoint = this.type === 0 ? y : x

                // 底点
                const basePoint = this.type === 0 ? x : y

                // 底点到圆边界总长
                const distance = Math.sqrt(this.radiusSquare - Math.pow(Math.abs(basePoint - this.baseCenter), 2))

                // 计算新点
                let newPoint = FilterBump.getPoint(currentPoint, distance, this.half, this.k)
                if (newPoint < 0) continue

                // 双线性插值
                if (this.type === 0 && (newPoint > this.height)) continue
                if (this.type === 1 && (newPoint > this.width)) continue
                const { r, g, b, a } = this.type === 0 ?
                    FilterBump.bilinearInterpolate(this.sourceData, x, newPoint, this.width, this.height) :
                    FilterBump.bilinearInterpolate(this.sourceData, newPoint, y, this.width, this.height)

                // 目标画布赋值
                const newStartNum = sw + (x * 4)
                this.targetData[newStartNum] = r
                this.targetData[newStartNum + 1] = g
                this.targetData[newStartNum + 2] = b
                this.targetData[newStartNum + 3] = a


            }
        }

        this.targetContext.putImageData(this.targetImageData, 0, 0)

    }

    setK(v) {
        this.k = +v
        this.render()
    }

    setType(v) {
        this.type = +v

        this.half = (this.type === 0 ? this.height : this.width) / 2
        this.baseCenter = this.type === 0 ? this.centerX : this.centerY


        this.render()
    }
}