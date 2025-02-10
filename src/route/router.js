import { createWebHistory, createRouter } from "vue-router"

import ImageOutlining from "@/views/ImageOutlining.vue"
import ImageDistortionFilter from "@/views/ImageDistortionFilter.vue"
import ArtText from "@/views/ArtText.vue"
import Potrace from "@/views/Potrace.vue"

const routes = [
    { path: "/", name: "image-outlining", component: ImageOutlining },
    { path: "/potrace", name: "potrace", component: Potrace },
    { path: "/image-distortion-filter", name: "image-distortion-filter", component: ImageDistortionFilter },
    { path: "/art-text", name: "art-text", component: ArtText },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router