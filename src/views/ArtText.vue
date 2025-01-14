<script setup>
import { ref, reactive, onMounted, useTemplateRef } from 'vue'
import ArtText from '@/lib/ArtText'

const loadFont = async () => {
  {
    const font = new FontFace("LTCarpet", `url(/font/LTCarpet.ttf)`)
    await font.load()
    document.fonts.add(font)
  }
  {
    const font = new FontFace("Academic M54", `url(/font/Academic%20M54.ttf)`)
    await font.load()
    document.fonts.add(font)
  }
}
loadFont()

// 表单数据
const form = reactive({
  padding: '0,10',
  fontFamily: "Calibri",
  text: "OLIVIA",
  scaleX: 1,
  scaleY: 1.15,
  fontSize: 100,
  fontWeight: 900,
  stroke: "#9A455A",
  fillMapName: "pink",
  "3D": {
    enable: true,
    offsetX: 3,
    offsetY: 3,
    fill: "#333",
  },
  filter: {
    enable: false,
    k: 0
  },
})

// canvas节点对象
const view = useTemplateRef('view')

// 文字对象
const artText = new ArtText({
  padding: form.padding.split(",").map((item) => Number(item)),
  fontFamily: form.fontFamily,
  text: form.text,
  scaleX: form.scaleX,
  scaleY: form.scaleY,
  fontSize: form.fontSize,
  fontWeight: form.fontWeight,
  stroke: form.stroke,
  fillMapName: form.fillMapName,

  "3D": {
    enable: form["3D"].enable,
    offsetX: form["3D"].offsetX,
    offsetY: form["3D"].offsetY,
    fill: form["3D"].fill,
  },

  filter: {
    enable: form.filter.enable,
    k: form.filter.k,
  },

})

// 设置文字
const setText = () => {
  artText.setText({
    padding: form.padding.split(",").map((item) => Number(item)),
    fontFamily: form.fontFamily,
    text: form.text,
    scaleX: form.scaleX,
    scaleY: form.scaleY,
    fontSize: form.fontSize,
    fontWeight: form.fontWeight,
    stroke: form.stroke,
    fillMapName: form.fillMapName,
  })
}

// 设置立体效果
const set3d = () => {
  artText.set3d({
    enable: form["3D"].enable,
    offsetX: form["3D"].offsetX,
    offsetY: form["3D"].offsetY,
    fill: form["3D"].fill,
  })
}

// 设置变形效果
const setFilter = () => {
  artText.setFilter({
    enable: form.filter.enable,
    k: form.filter.k,
  })
}


onMounted(async () => {

  // 添加到dom
  view.value.appendChild(artText.resCanvas)

})


</script>

<template>

  <div class="flex flex-1 gap-2">

    <div class="flex max-h-full flex-col flex-none bg-white rounded p-3  overflow-y-auto" style="width: 260px;">

      <a-form size="mini" auto-label-width>

        <a-form-item label="文字">
          <a-input v-model="form.text" placeholder="输入文字" @change="setText" />
        </a-form-item>

        <a-form-item label="字体">
          <a-select v-model="form.fontFamily" placeholder="请选择字体" @change="setText">
            <a-option value="Calibri">Calibri</a-option>
            <a-option value="Academic M54">Academic M54</a-option>
            <a-option value="LTCarpet">LTCarpet</a-option>
          </a-select>
        </a-form-item>

        <a-form-item label="字号">
          <a-input-number v-model="form.fontSize" placeholder="字号" @change="setText" />
        </a-form-item>

        <a-form-item label="缩放X">
          <a-input-number v-model="form.scaleX" step="0.01" placeholder="缩放X" @change="setText" />
        </a-form-item>

        <a-form-item label="缩放Y">
          <a-input-number v-model="form.scaleY" step="0.01" placeholder="缩放Y" @change="setText" />
        </a-form-item>

        <a-form-item label="字重">
          <a-input-number v-model="form.fontWeight" placeholder="字重" @change="setText" />
        </a-form-item>

        <a-form-item label="描边颜色">
          <a-input v-model="form.stroke" placeholder="描边颜色" @change="setText" />
        </a-form-item>

        <a-form-item label="填充颜色">
          <a-select v-model="form.fillMapName" placeholder="填充颜色" @change="setText">
            <a-option value="">无</a-option>
            <a-option value="black">black</a-option>
            <a-option value="blue">blue</a-option>
            <a-option value="pink">pink</a-option>
            <a-option value="gold">gold</a-option>
            <a-option value="green">green</a-option>
            <a-option value="red">red</a-option>
            <a-option value="sliver">sliver</a-option>
            <a-option value="pink">pink</a-option>
            <a-option value="light pink">light pink</a-option>
          </a-select>
        </a-form-item>

        <a-form-item label="立体效果">
          <a-switch v-model="form['3D'].enable" placeholder="立体效果" @change="set3d" />
        </a-form-item>

        <a-form-item label="立体偏移X">
          <a-input-number :disabled="!form['3D'].enable" v-model="form['3D'].offsetX" placeholder="立体偏移X"
            @change="set3d" />
        </a-form-item>

        <a-form-item label="立体偏移Y">
          <a-input-number :disabled="!form['3D'].enable" v-model="form['3D'].offsetY" placeholder="立体偏移Y"
            @change="set3d" />
        </a-form-item>

        <a-form-item label="立体填充颜色">
          <a-input :disabled="!form['3D'].enable" v-model="form['3D'].fill" placeholder="立体填充颜色" @change="set3d" />
        </a-form-item>

        <a-form-item label="变形效果">
          <a-switch v-model="form.filter.enable" placeholder="变形效果" @change="setFilter" />
        </a-form-item>

        <a-form-item label="变形程度">
          <a-slider :disabled="!form.filter.enable" v-model="form.filter.k" placeholder="变形程度" :min="-1" :max="1"
            step="0.05" :default-value="0" @change="setFilter" />
        </a-form-item>


      </a-form>


    </div>

    <div ref="view" class="flex-1 bg-white rounded gap-3 p-3 h-full overflow-auto">

    </div>

  </div>


</template>

<style scoped></style>
