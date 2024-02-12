<template>
  <v-app>
    <v-layout>
      <v-navigation-drawer
        permanent
      >
        <v-autocomplete
          label="Template"
          :items="templates"
          :hide-details="true"
          v-model="template"
        >
        </v-autocomplete>
        <GroupSelector
          v-model="group"
          :groups="groups"
        ></GroupSelector>

        <v-divider></v-divider>

        <MemberList
          :items="members"
        ></MemberList>
      </v-navigation-drawer>

      <v-main>
        <v-container>
          <NominateTemplate
            v-if="template === 'Nominate'"
            :title="dataLoader.title"
            :items="dataLoader.items"
            @dragging="n => dragging = n"
            v-model="dataMap"
          ></NominateTemplate>
          <LevelRankTemplate
            v-if="template === 'LevelRank'"
            :title="dataLoader.title"
            :items="dataLoader.items"
            @dragging="n => dragging = n"
            v-model="dataMap"
          ></LevelRankTemplate>
        </v-container>
      </v-main>
      <div class="nav-btns">
        <DeleteBtn
          :data-map="dataMap"
          :dragging="dragging"
        ></DeleteBtn>
      </div>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, watch} from 'vue';
import GroupSelector from './components/GroupSelector.vue';
import MemberList from "@/components/MemberList.vue";
import DeleteBtn from "@/components/DeleteBtn.vue";
import { MemberData } from './types/member';
import { GroupData } from './types/group';
import { BaseDataLoader } from './loader/base-data-loader';
import { PropType } from 'vue';
import NominateTemplate from "@/meme-template/nominate/NominateTemplate.vue";
import LevelRankTemplate from './meme-template/level-rank/LevelRankTemplate.vue';

const templates = [
  'Nominate', 'LevelRank'
] as const

const template = ref<typeof templates[number]>(templates[0])

const props = defineProps({
  dataLoader: {
    required: true,
    type: Object as PropType<BaseDataLoader>,
  }
})

const dataLoader = reactive(props.dataLoader)

const groups = ref<GroupData[]>([])
const group = ref<string>('')
const members = ref<MemberData[]>([])
const dataMap = reactive({})
const dragging = ref(false)

watch(group, async n => {
  members.value = await dataLoader.getMemberData(n)
})
onMounted(async () => {
  groups.value = await dataLoader.getGroupData()
  group.value = groups.value[0].id
})
</script>

<style scoped>
.nav-btns {
  position: fixed;
  margin: 0.6em 1.6em;
  right: 0;
  bottom: 0;
}

.nav-btns .v-btn {
  margin: 1em 0;
}
</style>

