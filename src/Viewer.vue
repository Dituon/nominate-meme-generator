<template>
  <v-app>
    <v-layout>
      <v-app-bar 
        color="primary"
        density="compact"
        style="position: fixed;"
      >
        <v-app-bar-nav-icon
          variant="text"
          @click="showDrawer = !showDrawer"
        ></v-app-bar-nav-icon>

        <v-toolbar-title>Editor</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon="mdi-github" href="https://github.com/Dituon/nominate-meme-generator">
        </v-btn>
      </v-app-bar>
      <v-navigation-drawer
        floating
        v-model="showDrawer"
        mobile-breakpoint="md"
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
            :members="members"
            :items="dataLoader.items"
            @dragging="n => dragging = n"
            v-model="dataMap"
            ref="nominateTemplate"
          ></NominateTemplate>
          <LevelRankTemplate
            v-if="template === 'LevelRank'"
            :title="dataLoader.title"
            :members="members"
            :items="dataLoader.items"
            @dragging="n => dragging = n"
            v-model="dataMap"
            ref="levelRankTemplate"
          ></LevelRankTemplate>
        </v-container>
      </v-main>
      <div class="nav-btns">
        <SaveImageBtn
          :element="templateRef?.$el"
        ></SaveImageBtn>
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
import SaveImageBtn from './components/SaveImageBtn.vue';

const templates = [
  'Nominate', 'LevelRank'
] as const

const template = ref<typeof templates[number]>(templates[0])

const nominateTemplate = ref<InstanceType<typeof NominateTemplate>>()
const levelRankTemplate = ref<InstanceType<typeof LevelRankTemplate>>()

const templateRef = ref<InstanceType<typeof NominateTemplate | typeof LevelRankTemplate>>()

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
const showDrawer = ref(true)

watch(nominateTemplate, n => templateRef.value = n)
watch(levelRankTemplate, n => templateRef.value = n)

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

