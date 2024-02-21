<template>
  <v-autocomplete
    label="Group"
    :items="groups as GroupData[]"
    v-model="modelValue"
    item-value="id"
    item-title="name"
    hide-details
  >
    <template v-slot:item="{ props, item }">
      <v-list-item
        v-bind="props"
        :title="item.raw.name"
        :subtitle="item.raw.id"
      >
        <template v-slot:prepend>
          <v-avatar>
            <v-img
              referrerpolicy="no-referrer"
              :src="item.raw.avatar"
            >
            </v-img>
          </v-avatar>
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
import {GroupData} from '@/types/group';
import {defineModel, PropType, toRefs} from 'vue';

const props = defineProps({
  groups: {
    type: Array as PropType<GroupData[]>,
    required: true
  },
})
const {groups} = toRefs(props)

const modelValue = defineModel<string>()
</script>
