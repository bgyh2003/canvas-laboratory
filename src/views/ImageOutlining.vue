<script setup>
import { ref, reactive, onMounted, useTemplateRef } from 'vue'
import ImageOutlining from '@/lib/ImageOutlining'

// 原图对象
const imageSource = useTemplateRef('imageSource')

// 目标画布对象
const view = useTemplateRef('view')

// 图像描边对象
let imageOutlining

onMounted(async () => {

  // 载入图片
  imageSource.value.src = '/images/img3.png'
  await imageSource.value.decode()

  // 实例化 图片描边对象
  imageOutlining = new ImageOutlining({
    image: imageSource.value,
    padding: 0,
    strokes: [
      {
        color: 'red',
        width: 30,
      },
      {
        color: 'blue',
        width: 30,
      } 
    ]
  })



  // console.time("aaa")
  const canvas = imageOutlining.output()
  // console.timeEnd("aaa")

  view.value.replaceChildren(canvas)

})


</script>

<template>

  <div class="flex flex-1 gap-2">

    <div class="flex max-h-full flex-col flex-none bg-white rounded p-3  overflow-y-auto" style="width: 260px;">

      <a-form layout="vertical" size="mini">

        <a-form-item label="Username">
          <a-input placeholder="please enter your username..." />
        </a-form-item>


        <a-form-item>
          <a-checkbox>
            I have read the manual
          </a-checkbox>
        </a-form-item>

      </a-form>


    </div>

    <div class="flex flex-1 bg-white rounded gap-3 p-3 h-full overflow-auto">

      <div class="flex-1 justify-center rounded items-center bg-zinc-100  overflow-auto ">
        <img ref="imageSource">
      </div>

      <div ref="view" class="flex flex-1 justify-center rounded items-center bg-zinc-100 overflow-auto ">

      </div>

    </div>

  </div>


</template>

<style scoped></style>
