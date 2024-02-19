<template>
  <div class="text-center">
    <div class="d-flex justify-space-evenly" data-html2canvas-ignore>
      <v-checkbox
        hide-details
        label="表头描述"
        v-model="showHeadExtraDesc"
        class="d-inline-block"
      ></v-checkbox>
      <v-slider
        class="slider"
        v-model="itemLength"
        :min="1"
        :max="items.length"
        :step="1"
        label="长度"
        thumb-label
        hide-details
      ></v-slider>
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
    <div class="items">
      <div
        v-for="(_, i) in itemLength"
        class="item"
        :style="{ background: itemColors[i] }"
      >
        <div class="head">
          <contenteditable
            tag="p"
            class="title"
            v-model="items[i]"
          >
          </contenteditable>
          <contenteditable
            v-if="showHeadExtraDesc"
            tag="p"
            class="desc"
            v-model="headExtraDesc[i]"
          >
          </contenteditable>
        </div>
        <div class="avatars">
          <draggable
            :list="modelValue[items[i]] ??= []"
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
            :loading="loading"
            v-model:show="showSelectorMap[items[i]]"
            v-model:items="modelValue[items[i]]"
          ></MemberSelectMenu>
        </div>
      </div>
    </div>
    <Watermark></Watermark>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import {defineComponent, defineModel, onMounted, PropType, reactive, ref, toRefs, watch} from "vue";
import {MemberDataItem} from '@/types/member';
import {config} from '@/utils/reactive-config';
import MemberSelectMenu from '@/components/MemberSelectMenu.vue';
import {mixRgb, Red, Yellow, Green} from "@/utils/color-mix";

defineComponent(draggable)

const props = defineProps({
  title: String,
  members: {
    type: Array as PropType<MemberDataItem[]>,
    default: []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const dragging = ref(false)
const showSelectorMap = reactive<{
  [key: string]: boolean
}>({})

function repeatAlpha(num: number) {
  return new Array(num)
    .fill(0)
    .map((_, i) => (i + 10).toString(36).toUpperCase())
}

const {title} = toRefs(props)
const itemLength = ref(7)
const items = reactive(['SSS', 'S', ...repeatAlpha(10)])
const itemColors = reactive([])
const showHeadExtraDesc = ref(false)
const headExtraDesc = Array(items.length).fill('描述')

const modelValue = defineModel<{ [key: string]: [] }>({
  default: {}
})

const emits = defineEmits<{ (e: 'dragging', value: boolean): void }>()

watch(dragging, n => {
  emits('dragging', n)
})

function initItemColor() {
  const steps = itemLength.value
  for (let i = 0; i < steps; i++) {
    const mixStartColor = mixRgb(Red, Yellow, i / (steps - 1) * 0.7)
    const mixEndColor = mixRgb(Yellow, Green, i / (steps - 1))
    const bg = mixRgb(mixStartColor, mixEndColor, i / (steps - 1))
    itemColors[i] = `rgb(${bg.join(',')})`

    /*
    // HTML2Canvas not support color-mix function
    const mixStartColor = `color-mix(in srgb, ${gradientStart}, ${gradientMiddle} ${i / (steps - 1) * 0.7 * 100}%)`;
    const mixEndColor = `color-mix(in srgb, ${gradientMiddle}, ${gradientEnd} ${i / (steps - 1) * 100}%)`;
    itemColors[steps - i - 1] = `color-mix(in srgb, ${mixStartColor}, ${mixEndColor} ${i / (steps - 1) * 100}%)`
    */
  }
}

watch(itemLength, initItemColor)

onMounted(()=>{
  initItemColor()
})

</script>

<style lang="css" scoped>
.slider {
  grid-template-areas: "prepend control append";
  grid-template-rows: auto;
  width: max(25%, 12em);
  flex: unset;
}

.items {
  display: flex;
  flex-direction: column;
}

.item:first-child {
  border-top-width: unset;
}

/*
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
*/

.item {
  border: 3px solid;
  border-top-width: 0;
  height: 6em;
  display: flex;
}

.item .head {
  flex: 0 0 max(10%, 3em);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.item .head > .title {
  width: 100%;
  font-size: 2em;
  font-style: italic;
  font-weight: bold;
  font-family: 'Times New Roman', Times, serif;
}

.item .head > .desc {
  width: 100%;
}

.item .avatars {
  border-left: 3px solid;
  flex: 1 1;
  display: flex;
}

.item .avatars>div {
  flex: 1 1;
  display: flex;
}

.item .avatars .avatar > img {
  height: 100%;
  width: 100%;
  padding: 0.2em;
  object-fit: cover;
}
</style>
