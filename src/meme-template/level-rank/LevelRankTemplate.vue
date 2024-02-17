<template>
    <div class="text-center">
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
      <div class="items">
        <div
          v-for="item in items"
          class="item"
        >
          <div class="title">
            <span contenteditable="true">{{item}}</span>
          </div>
          <draggable
            class="avatars"
            :list="modelValue[item] ?? (modelValue[item] = [])"
            group="member"
            item-key="name"
            @start="dragging = true"
            @end="dragging = false"
            :disabled="!config.app.draggable"
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
          <MemberSelector
            :members="members"
            v-model:show="showSelectorMap[item]"
            v-model:items="modelValue[item]"
          ></MemberSelector>
        </div>
      </div>
      <Watermark></Watermark>
    </div>
  </template>
  
  <script setup lang="ts">
  import draggable from 'vuedraggable'
  import {defineComponent, defineModel, PropType, ref, toRefs, watch} from "vue";
  import { MemberData } from '@/types/member';
  import MemberSelector from '@/components/MemberSelector.vue';
  import { reactive } from 'vue';
  import { config } from '@/utils/reactive-config';
  import contenteditable from 'vue-contenteditable';
  
  defineComponent(draggable)
  
  const props = defineProps({
    title: String,
    members: {
      type: Array as PropType<MemberData[]>,
      default: []
    }
  })
  
  const dragging = ref(false)
  const showSelectorMap = reactive<{
    [key: string]: boolean
  }>({})

  const {title} = toRefs(props)
  const items = ['SSS', 'S', 'A', 'B', 'C', 'D', 'E']
  
  const modelValue = defineModel<{[key: string]: []}>({
    default: {}
  })
  
  const emits = defineEmits<{(e: 'dragging', value: boolean): void}>()
  
  watch(dragging, n => {
    emits('dragging', n)
  })
  </script>
  
  <style lang="scss" scoped>
    .items {
      display: flex;
      flex-direction: column;
    }

    .item:first-child {
      border-top-width: unset;
    }

    $gradientStart: red;
    $gradientMiddle: yellow;
    $gradientEnd: green;
    $steps: 8;

    @for $i from 0 to $steps {
      .item:nth-child(#{$i}) {
        $mixStartColor: mix($gradientStart, $gradientMiddle, percentage(calc($i / ($steps - 1) * 0.7)));
        $mixEndColor: mix($gradientMiddle, $gradientEnd, percentage(calc($i / ($steps - 1))));
        background: mix($mixStartColor, $mixEndColor, percentage(calc($i / ($steps - 1))));
      }
    }
      
    .item {
      border: 3px solid;
      border-top-width: 0;
      height: 6em;
      display: flex;
    }
  
    .item>.title {
      flex: 0 0 max(10%, 3em);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .item>.title>span {
      width: 100%;
      font-size: 2em;
      font-style: italic;
      font-weight: bold;
      font-family: 'Times New Roman', Times, serif;
    }
  
    .item>.avatars {
      flex: 1 1;
      display: flex;
      border-left: 3px solid;
    }
  
    .item>.avatars>.avatar>img {
      height: 100%;
      width: 100%;
      padding: 0.2em;
      object-fit: cover;
    }
  </style>
  