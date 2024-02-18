<template>
  <v-menu
    v-model="show"
    activator="parent"
    location="center"
    width="max(30%, 400px)"
    scrim
    :close-on-content-click="false"
  >
    <v-card>
      <v-card-text>
        <MemberSelector
          label="选择成员"
          v-model="items"
          :members="members"
          variant="outlined"
        ></MemberSelector>
      </v-card-text>
    </v-card>
  </v-menu>
</template>
<script setup lang="ts">
import {MemberData} from '@/types/member';
import {PropType, toRefs} from 'vue';
import MemberSelector from './MemberSelector.vue';

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
const {members} = toRefs(props)
</script>