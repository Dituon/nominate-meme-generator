<template>
  <div class="text-center">
    <h1>{{ title }}</h1>
    <h3 class="text-right">
      <span class="pr-4">填表人:</span>
      <span
        style="min-width: 2em"
        class="d-inline-block text-decoration-underline text-center"
        contenteditable="true"
      >我</span>
    </h3>
    <div class="d-flex flex-wrap justify-lg-space-evenly">
      <div
        v-for="item in items"
        class="item"
      >
        <draggable
          class="avatars d-flex"
          :list="modelValue[item]"
          group="member"
          item-key="name"
          @start="dragging = true"
          @end="dragging = false"
        >
          <template #item="{ element }">
            <div class="avatar">
              <img
                :src="parseUrl?.(element)"
               :alt="element"
              >
            </div>
          </template>
        </draggable>
        <span
          class="title"
          contenteditable="true"
        >{{item}}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import {defineComponent, defineModel, PropType, reactive, ref, toRefs, watch} from "vue";

defineComponent(draggable)

const props = defineProps({
  title: String,
  items: {
    type: Array as PropType<string[]>,
    required: true,
  },
  parseUrl: {
    type: Function as PropType<(string) => string>,
    default: s => s,
  },
})

const dragging = ref(false)
const {title, items} = toRefs(props)

const modelValue = defineModel<{}>()

const emits = defineEmits<{(e: 'dragging', value?: boolean): void}>()

watch(dragging, n => {
  console.log(n)
  emits('dragging', n)
})

modelValue.value = (items?.value ?? []).reduce((obj, v) => {
  obj[v] = []
  return obj
}, modelValue.value)

</script>

<style scoped>
  .item {
    border: 3px solid;
    flex: 1 1 15%;
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
  }

  .item>.avatars>.avatar>img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
