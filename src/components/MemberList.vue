<template>
  <v-list v-if="loading">
    <v-skeleton-loader
      v-for="_ in 16"
      type="list-item-avatar"
    ></v-skeleton-loader>
  </v-list>
  <v-list v-else>
    <draggable
      :list="items"
      :group="{ name: 'member', pull: 'clone', put: false }"
      item-key="name"
      :disabled="!config.app.draggable"
    >
      <template #item="{ element }: { element: MemberDataItem }">
        <v-list-item
          :title="element.name"
          lines="two"
        >
          <template v-slot:prepend>
            <v-avatar>
              <v-img
                referrerpolicy="no-referrer"
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

import { MemberDataItem } from "@/types/member";
import { config } from "@/utils/reactive-config";
import {defineComponent, PropType, toRefs} from "vue";
import draggable from "vuedraggable";
defineComponent(draggable)

const props = defineProps({
  items: {
    type: Array as PropType<MemberDataItem[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  }
})
const { items } = toRefs(props)

</script>

<style scoped>

</style>
