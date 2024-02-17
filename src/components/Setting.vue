<template>
  <v-dialog
      v-model="dialog"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
          density="compact"
        >
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>设置</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              variant="text"
              @click="dialog = false"
            >
              保存
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list
          lines="two"
          subheader
        >
          <v-list-subheader>数据</v-list-subheader>
          <v-list-item title="模板仓库地址" :subtitle="config.repoLoader.baseUrl"></v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list
          lines="two"
          subheader
        >
          <v-list-subheader>应用</v-list-subheader>
          <v-list-item title="拖拽编辑" subtitle="允许在不同的元素中拖拽编辑, 禁用此项可避免移动端滑动误触。">
            <template v-slot:prepend>
              <v-checkbox v-model="config.app.draggable"></v-checkbox>
            </template>
          </v-list-item>
          <v-list-item title="保存数据" subtitle="将编辑后的数据保存到本地, 刷新网页后可继续编辑。">
            <template v-slot:prepend>
              <v-checkbox v-model="config.app.saveData"></v-checkbox>
            </template>
          </v-list-item>
          <v-list-item title="用户水印" subtitle="在生成的图像中添加用户名水印。">
            <template v-slot:prepend>
              <v-checkbox v-model="config.app.userWatermark"></v-checkbox>
            </template>
          </v-list-item>
          <v-list-item title="网页水印" subtitle="在生成的图像中添加指向本网页的水印。">
            <template v-slot:prepend>
              <v-checkbox v-model="config.app.siteWatermark"></v-checkbox>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import { config } from '@/utils/reactive-config';

const dialog = defineModel<boolean>({
  default: false
})
</script>