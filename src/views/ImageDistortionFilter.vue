<script setup>
import { ref, reactive, onMounted, useTemplateRef } from 'vue'
import FilterBump from '@/lib/FilterBump'

// 表单数据
const form = reactive({
  type: "0",
  k: 0,
})

// 原图对象
const imageSource = useTemplateRef('imageSource')

// canvas节点对象
const view = useTemplateRef('view')

// 图像变形对象
let filter


onMounted(async () => {

  // 载入图片
  imageSource.value.src = '/images/img2.png'
  await imageSource.value.decode()
  console.log(imageSource.value.width)

  // 源画布
  const sourceCanvas = document.createElement("canvas")
  sourceCanvas.width = imageSource.value.width
  sourceCanvas.height = imageSource.value.height
  const context = sourceCanvas.getContext("2d")
  context.drawImage(imageSource.value, 0, 0)

  // 目标画布
  const targetCanvas = view.value

  // 创建滤镜对象
  filter = new FilterBump({
    sourceCanvas,
    targetCanvas,
    type: 0,
    k: 0
  })



})


</script>

<template>

  <div class="flex flex-1 gap-2">

    <div class="flex max-h-full flex-col flex-none bg-white rounded p-3  overflow-y-auto" style="width: 260px;">

      <a-form size="mini" auto-label-width>

        <a-form-item label="畸变程度">
          <a-slider v-model="form.k" placeholder="畸变程度" :min="-1" :max="1" step="0.1" :default-value="0"
            @change="filter.setK(form.k)" />
        </a-form-item>

        <a-form-item label="变形方向">
          <a-select v-model="form.type" placeholder="选择变形方向" @change="filter.setType(parseInt(form.type))">
            <a-option value="0">纵向</a-option>
            <a-option value="1">横向</a-option>
          </a-select>
        </a-form-item>

      </a-form>


    </div>

    <div class="flex flex-1 bg-white rounded gap-3 p-3 h-full overflow-auto">

      <div class="w-2/4 flex justify-center rounded items-center bg-zinc-100 ">
        <img ref="imageSource">
      </div>

      <div class="w-2/4 flex justify-center rounded items-center bg-zinc-100 ">
        <canvas ref="view" style="width: 600px; height: 300px;"></canvas>
      </div>

    </div>

  </div>


</template>

<style scoped></style>
