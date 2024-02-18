<template>
    <v-autocomplete
      :items="members!"
      v-model="items"
      item-title="name"
      hide-details
      clearable
      chips
      multiple
      return-object
    >
      <template v-slot:chip="{ props, item }">
        <v-chip
          v-bind="props"
          :prepend-avatar="item.raw.avatar"
          :text="item.raw.name"
        ></v-chip>
      </template>
      <template v-slot:item="{ props, item }">
        <v-list-item
          v-bind="props"
          :title="item.raw.name"
        >
          <template v-slot:prepend>
            <v-avatar>
              <v-img :src="item.raw.avatar">
              </v-img>
            </v-avatar>
          </template>
        </v-list-item>
      </template>
    </v-autocomplete>
</template>
<script setup lang="ts">
import {MemberDataItem} from '@/types/member';
import {PropType, toRefs} from 'vue';

const items = defineModel<MemberDataItem[]>('items', {
  default: []
})

const props = defineProps({
  members: {
    type: Array as PropType<MemberDataItem[]>,
    required: true
  }
})
const {members} = toRefs(props)
</script>
