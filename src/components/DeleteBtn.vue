<template>
  <v-btn
    variant="elevated"
    size="large"
    :block="true"
    :elevation="dragging ? 16 : 2"
    :color="dragging ? 'orange-darken-4' : ''"
    :disabled="disabled"
    icon
  >
    <v-icon
      :icon="'mdi-' + (disabled ? 'delete-off' : (dragging ? 'delete-empty' : 'delete'))"
    ></v-icon>
    <v-dialog
      activator="parent"
      width="auto"
      v-model="dialog"
    >
      <v-card>
        <v-card-text>
          清除全部?
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="dialog = false">算了</v-btn>
          <v-btn color="red" @click="clearData(); dialog = false;">清除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <draggable
      :list="removedList"
      item-key="name"
      ghost-class="d-none"
      group="member"
      style="width: 100%; height: 100%; position: absolute;"
    >
      <template #item="{ element, index }">
        <div class="d-none">{{index}}</div>
      </template>
    </draggable>
  </v-btn>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";
import {defineComponent, PropType, ref, toRefs, watch} from "vue";

defineComponent({draggable})

const dialog = ref(false)
const disabled = ref(false)
const removedList = ref([])

const props = defineProps({
  dragging: Boolean,
  dataMap: {
    type: Object as PropType<{[key: string]: []}>,
    required: true,
  },
})

const { dragging, dataMap } = toRefs(props)

function clearData() {
  (Object.values(dataMap?.value) as [][]).forEach(arr => arr.length = 0)
}

watch(dataMap, () => {
  disabled.value = (Object.values(dataMap?.value) as [][]).flat(1).length === 0
}, {deep: true})

</script>

<style scoped>

</style>
