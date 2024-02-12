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
            <v-img :src="dataUrl"></v-img>
          </v-card-text>
          <v-card-actions>
            <v-btn 
              color="primary" 
              @click="dialog = false"
              class="flex-1-1"
            >算了</v-btn>
            <v-btn 
              color="green"
              :loading="loading"
              @click="dialog = false; save()"
              class="flex-1-1"
            >下载</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-btn>
  </template>
  
  <script setup lang="ts">
  import draggable from "vuedraggable";
  import html2canvas from "@wtto00/html2canvas";
  import {defineComponent, PropType, ref, toRefs, watch} from "vue";
  import { saveAs } from 'file-saver';
  
  defineComponent({draggable})
  
  const dialog = ref(false)
  const loading = ref(false)
  const dataUrl = ref<string>('')
  const canvas = ref<HTMLCanvasElement>()
  
  const props = defineProps({
    element: {
      type: Object as PropType<HTMLElement>,
      required: true,
    },
  })
  const { element } = toRefs(props)
  watch(element, (n) => {
    console.log(n)
  })

  async function buildCanvas() {
    loading.value = true
    canvas.value = await html2canvas(element.value, {
      useCORS: true,
      windowWidth: 1600,
    })
    dataUrl.value = canvas.value.toDataURL("image/png")
    loading.value = false
  }

  async function save() {
    loading.value = true
    const blob: Blob | null = await new Promise(res => canvas.value?.toBlob(res, "image/png"))
    saveAs(blob || dataUrl.value, "image.png")
    loading.value = false
  }
  
  </script>
  
  <style scoped>
  
  </style>
  