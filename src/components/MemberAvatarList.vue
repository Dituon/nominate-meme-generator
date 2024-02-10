<template>
  <v-list>
    <draggable
      :list="items"
      :group="{ name: 'member', pull: 'clone', put: false }"
      item-key="name"
    >
      <template #item="{ element }">
        <v-list-item
          :title="element"
        >
          <template v-slot:prepend>
            <v-avatar
              :image="parseUrl(element)"
            ></v-avatar>
          </template>
        </v-list-item>
      </template>
    </draggable>
  </v-list>

</template>

<script setup lang="ts">

import {defineComponent, PropType, toRefs} from "vue";
import draggable from "vuedraggable";
defineComponent(draggable)

const props = defineProps({
  items: {
    type: Array as PropType<string[]>,
    required: true,
  },
  parseUrl: {
    type: Function as PropType<(string) => string>,
    default: s => s,
  },
})
const { items } = toRefs(props)

</script>

<style scoped>

</style>
