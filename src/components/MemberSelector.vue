<template>
  <v-menu
    v-model="show"
    activator="parent"
    location="center"
    min-width="200"
    width="30%"
    scrim
    :close-on-content-click="false"
  >
    <v-autocomplete
      :items="members"
      v-model="items"
      item-title="name"
      hide-details
      clearable
      chips
      multiple
      return-object
      variant="solo-filled"
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
          <v-avatar
            :image="item.raw.avatar"
            start
          >
          </v-avatar>
        </template>
      </v-list-item>
    </template>
    </v-autocomplete>
  </v-menu>
</template>
<script setup lang="ts">
import { MemberData } from '@/types/member';
import { PropType } from 'vue';
import { toRefs } from 'vue';

const show = defineModel<boolean>('show', {
  default: false
})
const items = defineModel<MemberData[]>('items', {
  default: []
})

const props = defineProps({
  members: {
    type: Array as PropType<MemberData[]>,
    reqired: true
  }
})
const { members } = toRefs(props)
</script>
