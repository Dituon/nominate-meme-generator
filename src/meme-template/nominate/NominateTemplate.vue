<template>
  <div class="text-center">
    <h1 contenteditable="true">{{ title }}</h1>
    <h3 class="text-right">
      <span class="pr-4">填表人:</span>
      <span
        style="min-width: 2em"
        class="d-inline-block text-decoration-underline text-center"
        contenteditable="true"
      >
      我
      </span>
    </h3>
    <div class="items">
      <div
        v-for="item in items"
        class="item"
      >
        <draggable
          class="avatars"
          :list="modelValue[item] ?? (modelValue[item] = [])"
          group="member"
          item-key="name"
          @start="dragging = true"
          @end="dragging = false"
        >
          <template #item="{ element }: { element: MemberData }">
            <div class="avatar">
              <img
                :src="element.avatar"
                :alt="element.name"
              >
            </div>
          </template>
        </draggable>
        <span
          class="title"
          contenteditable="true"
        >{{item}}</span>
        <MemberSelector
            :members="members"
            v-model:show="showSelectorMap[item]"
            v-model:items="modelValue[item]"
          ></MemberSelector>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import {defineComponent, defineModel, PropType, reactive, ref, toRefs, watch} from "vue";
import { MemberData } from '@/types/member';

defineComponent(draggable)

const props = defineProps({
  title: String,
  items: {
    type: Array as PropType<string[]>,
    required: true,
  },
  members: {
      type: Array as PropType<MemberData[]>,
      default: []
  }
})

const dragging = ref(false)
const {title, items} = toRefs(props)

const modelValue = defineModel<{[key: string]: []}>({
  default: {}
})
const showSelectorMap = reactive<{
    [key: string]: boolean
  }>({})

const emits = defineEmits<{(e: 'dragging', value: boolean): void}>()

watch(dragging, n => {
  emits('dragging', n)
})
</script>

<style scoped>
  .items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(12em, 1fr));
    gap: 10px;
    grid-auto-rows: minmax(100px, auto);
  }

  .item {
    border: 3px solid;
    flex: 1 1 max(15%, 8em);
    margin: 1em;
  }

  .item>.title {
    display: inline-block;
    width: 100%;
    border-top: 3px solid;
  }

  .item>.avatars {
    aspect-ratio : 1 / 1;
    width: 100%;
    display: flex;
  }

  .item>.avatars>.avatar>img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
