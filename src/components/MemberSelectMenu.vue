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
          :members="members!"
          variant="outlined"
          :loading="loading"
          :readonly="loading"
        ></MemberSelector>
      </v-card-text>
    </v-card>
  </v-menu>
</template>
<script setup lang="ts">
import {MemberDataItem} from '@/types/member';
import {PropType, toRefs} from 'vue';
import MemberSelector from './MemberSelector.vue';

const show = defineModel<boolean>('show', {
  default: false
})
const items = defineModel<MemberDataItem[]>('items', {
  default: []
})

const props = defineProps({
  members: {
    type: Array as PropType<MemberDataItem[]>,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})
const {members} = toRefs(props)
</script>
