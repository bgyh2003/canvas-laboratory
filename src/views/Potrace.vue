<script setup>
import { ref, reactive, onMounted, useTemplateRef } from 'vue'
import ImageStroker from '@/lib/ImageStroker'

// 表单数据
const form = reactive({
  padding: 10,
  stroes: [
    {
      color: 'red',
      width: 20,
    },
    {
      color: 'blue',
      width: 20,
    }
  ]
})


// 目标画布对象
const view = useTemplateRef('view')

// 图像描边对象
let imageStroker

// 渲染
const render = async () => {

  imageStroker.padding = form.padding
  imageStroker.strokes = form.stroes

  console.time("output")
  const canvas = await imageStroker.output()
  console.timeEnd("output")


  // canvas转图片
  const image = await new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      const image = new Image()
      image.src = URL.createObjectURL(blob)
      image.onload = () => resolve(image)
    })
  })


  view.value.replaceChildren(image)
}

// 添加描边
const addStroe = () => {
  form.stroes.push({ color: 'red', width: 30, })
  render()
}

// 删除描边
const deleteStroke = (item) => {
  form.stroes.splice(form.stroes.indexOf(item), 1)
  render()
}


onMounted(async () => {

  // 载入图片
  const imageSource = document.createElement('img')
  imageSource.src = '/images/img1.png'
  await imageSource.decode()

  // 实例化 图片描边对象
  imageStroker = new ImageStroker({
    image: imageSource
  })


  render()

})


</script>

<template>

  <div class="flex flex-1 gap-2">

    <div class="flex max-h-full flex-col flex-none bg-white rounded p-3  overflow-y-auto" style="width: 260px;">

      <a-form size="mini">

        <a-form-item label="间距">
          <a-input-number v-model="form.padding" placeholder="输入间距" :min="0" :max="100" @change="render" />
        </a-form-item>

        <div class="bg-slate-50 rounded p-3 mb-2" v-for="item in form.stroes">
          <a-form-item label="颜色">
            <a-input v-model="item.color" placeholder="输入颜色" @change="render" />
          </a-form-item>
          <a-form-item label="宽度">
            <a-input-number v-model="item.width" placeholder="输入宽度" :min="0" :max="100" @change="render" />
          </a-form-item>

          <a-button size="mini" status="warning" @click="deleteStroke(item)">
            删除
          </a-button>
        </div>

        <a-button size="mini" type="primary" @click="addStroe">
          添加描边
        </a-button>


      </a-form>

    </div>

    <div class="flex flex-1 bg-white rounded gap-3 p-3 h-full overflow-auto">

      <div class="w-2/4 h-full flex justify-center rounded items-center bg-zinc-100  overflow-auto ">
        <img src="/images/img1.png">
      </div>

      <div ref="view" class="w-2/4 h-full flex justify-center rounded items-center bg-zinc-100 ">
      </div>

    </div>

  </div>



</template>

<style scoped></style>
