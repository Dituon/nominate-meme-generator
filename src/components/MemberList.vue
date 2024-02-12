<template>
  <v-list>
    <draggable
      :list="items"
      :group="{ name: 'member', pull: 'clone', put: false }"
      item-key="name"
    >
      <template #item="{ element }: { element: MemberData }">
        <v-list-item
          :title="element.name"
        >
          <template v-slot:prepend>
            <v-avatar>
              <v-img
                :src="element.avatar"
              >
              </v-img>
            </v-avatar>
          </template>
        </v-list-item>
      </template>
    </draggable>
  </v-list>

</template>

<script setup lang="ts">

import { MemberData } from "@/types/member";
import {defineComponent, PropType, toRefs} from "vue";
import draggable from "vuedraggable";
defineComponent(draggable)

const props = defineProps({
  items: {
    type: Array as PropType<MemberData[]>,
    required: true,
  },
})
const { items } = toRefs(props)

</script>

<style scoped>

</style>
