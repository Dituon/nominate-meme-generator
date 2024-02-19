<template>
  <div class="text-center">
    <div class="d-flex justify-space-evenly" data-html2canvas-ignore>
      <v-checkbox
        hide-details
        label="显示表头"
        v-model="showHeader"
        class="d-inline-block"
      ></v-checkbox>
      <v-checkbox
        hide-details
        label="表头描述"
        v-model="showHeadExtraDesc"
        :disabled="!showHeader"
        class="d-inline-block"
      ></v-checkbox>
      <v-checkbox
        hide-details
        label="内容描述"
        v-model="showDataExtraDesc"
        class="d-inline-block"
      ></v-checkbox>
    </div>
    <h1 contenteditable="true">{{ title }}</h1>
    <h3 class="text-right">
      <span class="pr-4">填表人:</span>
      <contenteditable
        tag="span"
        style="min-width: 2em"
        class="d-inline-block text-decoration-underline text-center"
        :contenteditable="true"
        v-model="config.user.name"
      >
      </contenteditable>
    </h3>
    <div class="parent">
      <table ref="table">
        <thead>
        <tr>
          <th>/</th>
          <th scope="col" v-for="(c, i) in col">
            <contenteditable
              tag="p"
              class="title"
              v-model="col[i]"
            >
            </contenteditable>
            <contenteditable
              v-if="showHeadExtraDesc"
              tag="p"
              class="desc"
              v-model="headExtraDesc[i]"
            >
            </contenteditable>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(r, i) in row">
          <th scope="row">
            <contenteditable
              tag="p"
              class="title"
              v-model="row[i]"
            >
            </contenteditable>
            <contenteditable
              v-if="showHeadExtraDesc"
              tag="p"
              class="desc"
              v-model="headExtraDesc[i + 3]"
            >
            </contenteditable>
          </th>
          <td v-for="(d, di) in data.slice(i * 3, i * 3 + 3)">
            <div class="item">
              <div>
                <draggable
                  tag="div"
                  class="avatars"
                  :list="modelValue[d] ??= []"
                  group="member"
                  item-key="name"
                  @start="dragging = true"
                  @end="dragging = false"
                  :disabled="!config.app.draggable"
                >
                  <template #item="{ element }: { element: MemberDataItem }">
                    <div class="avatar">
                      <img
                        :src="element.avatar"
                        :alt="element.name"
                      >
                    </div>
                  </template>
                </draggable>
                <MemberSelectMenu
                  :members="members!"
                  v-model:show="showSelectorMap[d]"
                  v-model:items="modelValue[d]"
                  :loading="loading"
                ></MemberSelectMenu>
              </div>
              <div>
                <contenteditable
                  class="title"
                  tag="p"
                  v-model="data[i * 3 + di]"
                ></contenteditable>
                <contenteditable
                  v-if="showDataExtraDesc"
                  tag="p"
                  class="desc"
                  v-model="dataExtraDesc[i * 3 + di]"
                >
                </contenteditable>
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <Watermark></Watermark>
  </div>
</template>

<script setup lang="ts">
import {defineModel, PropType, reactive, ref, watch} from "vue";
import {config} from "@/utils/reactive-config";
import {MemberDataItem} from "@/types/member";
import Watermark from "@/components/Watermark.vue";
import MemberSelectMenu from "@/components/MemberSelectMenu.vue";

const col = ['守序', '中立', '混乱']
const row = ['善良', '中立', '邪恶']
const data = [
  '守序善良', '中立善良', '混乱善良',
  '守序中立', '绝对中立', '混乱中立',
  '守序邪恶', '中立邪恶', '混乱邪恶',
]

const showSelectorMap = reactive<{
  [key: string]: boolean
}>({})

const showHeader = ref(false)
const table = ref<HTMLTableElement>()
const dragging = ref(false)
const showHeadExtraDesc = ref(false)
const showDataExtraDesc = ref(false)
const headExtraDesc = new Array(col.length + row.length).fill('默认表头描述')
const dataExtraDesc = new Array(data.length).fill('默认项目描述')

const emits = defineEmits<{ (e: 'dragging', value: boolean): void }>()
watch(dragging, n => {
  emits('dragging', n)
})

const props = defineProps({
  title: String,
  items: {
    type: Array as PropType<string[]>,
    required: true,
  },
  members: {
    type: Array as PropType<MemberDataItem[]>,
    default: []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

watch(showHeader, n => {
  table.value!.classList.toggle('show-header', n)
})

const modelValue = defineModel<{ [key: string]: [] }>({
  default: {}
})
</script>

<style scoped>
.parent {
  width: 100%;
  display: flex;
  justify-content: center;
}

table {
  border-collapse: collapse;
  width: max(80%, 32em);
}

th, tr, td {
  border: black 1px solid;
  text-align: center;
}

td {
  width: 30%;
}

.title {
  font-size: 1.4em;
  font-weight: bolder;
}

.item .avatars {
  aspect-ratio: 1 / 1;
  display: flex;
  border-bottom: 1px solid black;
}

.item .avatars > .avatar {
  flex: 1;
}

.item .avatars > .avatar > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.desc {
  font-weight: lighter;
}

table:not(.show-header) th[scope="row"],
table:not(.show-header) thead {
  display: none;
}

table:not(.show-header) tr,
table:not(.show-header) td {
  border: none;
}

table:not(.show-header) td > .item {
  margin: 0.6em;
}

table:not(.show-header) .avatars {
  border: 3px solid black;
}
</style>
