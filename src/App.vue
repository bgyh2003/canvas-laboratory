<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 路由对象
const router = useRouter(), route = useRoute()

// 默认选中的菜单
const defaultSelectedKeys = ref(['image-outlining'])
watch(() => route.name, (to) => defaultSelectedKeys.value.splice(0, 1, to))

// 点击菜单
const menuClick = (key) => router.push({ name: key })

</script>

<template>


  <div class=" bg-white rounded">

    <a-menu class="rounded" mode="horizontal" :default-selected-keys="defaultSelectedKeys" @menu-item-click="menuClick">
      <a-menu-item key="image-outlining">图像描边(阴影法)</a-menu-item>
      <a-menu-item key="potrace">图像描边(potrace)</a-menu-item>
      <a-menu-item key="image-distortion-filter">图像变形</a-menu-item>
      <a-menu-item key="art-text">变形文字</a-menu-item>
    </a-menu>

  </div>


  <div class="flex flex-1 overflow-hidden">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>



</template>

<style scoped></style>
