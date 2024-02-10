<template>
  <div>
    <v-autocomplete
      label="Group"
      :items="groups as any"
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
            <v-avatar
              :image="`https://p.qlogo.cn/gh/${item.raw.id}/${item.raw.id}/640/`"
            ></v-avatar>
          </template>
        </v-list-item>
      </template>
    </v-autocomplete>
  </div>
</template>

<script setup lang="ts">
import {defineModel, onMounted, PropType, toRefs, watch} from 'vue';

const props = defineProps({
  groups: {
    type: Array as PropType<{ id: string, name: string }[]>,
    required: true
  }
})
const {groups} = toRefs(props)

const modelValue = defineModel<string>()

onMounted(() => {
  if (!modelValue.value) {
    modelValue.value = groups?.value?.[0]?.id
    console.log(groups?.value, modelValue.value)
  }
})
</script>
