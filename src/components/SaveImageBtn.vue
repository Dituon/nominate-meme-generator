<template>
  <v-btn
    variant="elevated"
    size="large"
    :block="true"
    :elevation="2"
    color="green"
    :loading="loading"
    @click="buildCanvas"
    icon
  >
    <v-icon
      icon="mdi-download"
    ></v-icon>
    <v-dialog
      activator="parent"
      width="auto"
      v-model="dialog"
    >
      <v-card style="width: min(80vw, 36em);">
        <v-card-title>下载图片</v-card-title>
        <v-card-text>
          <v-skeleton-loader
            :loading="loading"
            type="image"
          >
            <v-img :src="dataUrl"></v-img>
          </v-skeleton-loader>
          <p
            @click="fullscreenDialog = true"
            class="text-center text-subtitle-2 cursor-pointer text-grey"
          >图片没有正常显示? 点击手动截图</p>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            @click="dialog = false"
            class="flex-1-1"
          >算了
          </v-btn>
          <v-btn
            color="green"
            :loading="loading"
            @click="dialog = false; save()"
            class="flex-1-1"
          >下载
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="fullscreenDialog"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary" density="compact">
          <v-btn icon dark @click="fullscreenDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>手动截图</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="w-100 h-100">
          <div ref="screenShotArea" class="screenshotArea"></div>
        </div>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";
import html2canvas from "@wtto00/html2canvas";
import {defineComponent, PropType, ref, toRefs, watch} from "vue";
import {saveAs} from 'file-saver';
import { Ref } from "vue";

defineComponent({draggable})

const dialog = ref(false)
const fullscreenDialog = ref(false)
const loading = ref(false)
const dataUrl = ref<string>('')
const canvas = ref<HTMLCanvasElement>()
const screenShotArea = ref<HTMLDivElement>()

const props = defineProps<{
  element: HTMLElement
}>()
const {element} = toRefs(props)

async function buildCanvas() {
  loading.value = true
  canvas.value = await html2canvas(element.value, {
    useCORS: true,
    windowWidth: 1600,
    logging: false,
    onclone(_, e){
      e.style.color = '#000'
    }
  })
  dataUrl.value = canvas.value!.toDataURL("image/png")
  loading.value = false
}

async function save() {
  loading.value = true
  const blob: Blob | null = await new Promise(res => canvas.value?.toBlob(res, "image/png"))
  saveAs(blob || dataUrl.value, "image.png")
  loading.value = false
}

function buildIframe(ele: HTMLDivElement) {
  if (!ele) return window.removeEventListener('resize', setScreenShotStyle)
  if (!element?.value) return;
  ele.innerHTML = ''
  ele.appendChild(element?.value?.cloneNode(true))
  setScreenShotStyle()
  window.addEventListener('resize', setScreenShotStyle)
}

function setScreenShotStyle() {
  const ele = screenShotArea?.value!
  const eleParent = ele.parentElement!
  let width = eleParent.clientWidth
  let height = eleParent.clientHeight
  let scale = 1 / 1200 * width

  const rotateFlag = width * 1.2 < height
  if (rotateFlag) {
    const scaleByHeight = (1 / 1200 * height)
    const originHeight = ele.clientHeight!
    const selfWidth = originHeight * scale
    const selfFullWidth = originHeight * scaleByHeight
    scale = width < selfFullWidth ? width / selfWidth * scale : scaleByHeight
    ele.classList.add('rotate')
  } else {
    ele.classList.remove('rotate')
  }
  ele.style.setProperty(
    '--vw-scale', '' + scale
  )
}

watch(screenShotArea as Ref<HTMLDivElement>, buildIframe)
</script>

<style>
.v-skeleton-loader__image {
  width: min(80vw, 36em);
  height: min(30vw, 12em);
}
</style>

<style scoped>
.screenshotArea {
  --vw-scale: 1;
  position: absolute;
  width: 1200px;
  transform-origin: 0 0;
  transform: scale(var(--vw-scale));
}

.screenshotArea.rotate {
  left: 100%;
  top: 48px;
  transform: rotate(90deg) scale(var(--vw-scale));
}
</style>

<style>
.screenshotArea *[data-html2canvas-ignore] {
  display: none !important;
}
</style>
