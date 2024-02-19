<template>
  <v-app>
    <v-layout>
      <v-app-bar
        color="primary"
        density="compact"
        class="position-fixed"
      >
        <v-app-bar-nav-icon
          variant="text"
          @click="showDrawer = !showDrawer"
        ></v-app-bar-nav-icon>

        <v-toolbar-title>Editor</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon="mdi-brightness-4" @click="themeName = themeName === 'light' ? 'dark' : 'light'"></v-btn>
        <v-btn icon="mdi-cog" @click="settingDialog = true"></v-btn>
        <v-btn icon="mdi-github" href="https://github.com/Dituon/nominate-meme-generator"></v-btn>

        <Setting v-model="settingDialog"></Setting>
      </v-app-bar>
      <v-navigation-drawer
        floating
        v-model="showDrawer"
        mobile-breakpoint="md"
      >
        <v-sheet class="position-sticky" style="top: 0; z-index: 1;">
          <v-autocomplete
            label="Template"
            :items="templates"
            :hide-details="true"
            v-model="(config.user.template as any)"
          >
          </v-autocomplete>
          <GroupSelector
            v-model="config.user.group"
            :groups="groups"
            :loading="groupLoading"
          ></GroupSelector>
        </v-sheet>
        <p
          v-if="dataLoader.desc"
          style="opacity: 0.5; font-size: 0.8em"
          class="text-pre-line text-center my-2"
        >{{ memberLoading ? '少女加载中...' : dataLoader.desc }}</p>

        <v-divider></v-divider>
        <MemberList
          :items="members"
          :loading="memberLoading"
        ></MemberList>
      </v-navigation-drawer>

      <v-main>
        <v-container>
          <NominateTemplate
            v-if="config.user.template === 'Nominate'"
            :title="dataLoader.title"
            :members="members"
            :items="dataLoader.items"
            @dragging="n => dragging = n"
            v-model="dataMap"
            ref="templateRef"
            :loading="memberLoading"
          ></NominateTemplate>
          <LevelRankTemplate
            v-if="config.user.template === 'LevelRank'"
            :title="dataLoader.title"
            :members="members"
            :items="dataLoader.items"
            @dragging="n => dragging = n"
            v-model="dataMap"
            ref="templateRef"
            :loading="memberLoading"
          ></LevelRankTemplate>
          <CampGridTemplate
            v-if="config.user.template === 'CampGrid'"
            :title="dataLoader.title"
            :members="members"
            :items="dataLoader.items"
            @dragging="n => dragging = n"
            v-model="dataMap"
            ref="templateRef"
            :loading="memberLoading"
          ></CampGridTemplate>
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
import {MemberDataItem} from './types/member';
import {GroupData} from './types/group';
import {BaseDataLoader} from './loader/base-data-loader';
import NominateTemplate from "@/meme-template/nominate/NominateTemplate.vue";
import LevelRankTemplate from './meme-template/level-rank/LevelRankTemplate.vue';
import SaveImageBtn from './components/SaveImageBtn.vue';
import Setting from './components/Setting.vue';
import {config, groupDataMap} from './utils/reactive-config';
import {useTheme} from "vuetify";
import {bindHash} from "@/utils/url-hash";
import ScoreTemplate from "@/meme-template/score/ScoreTemplate.vue";
import CampGridTemplate from "@/meme-template/camp-grid/CampGridTemplate.vue";

const themeName = useTheme().global.name
themeName.value = config.user.theme
watch(themeName, n => config.user.theme = n)

const templates = [
  'Nominate', 'LevelRank', 'CampGrid'
] as const

config.user.template = bindHash('template', () => config.user.template)
config.user.group = bindHash('group', () => config.user.group)

const templateRef = ref<InstanceType<
  typeof NominateTemplate | typeof LevelRankTemplate | typeof CampGridTemplate
>>()

const props = defineProps<{
  dataLoader: BaseDataLoader
}>()

const dataLoader = reactive(props.dataLoader)

const groups = ref<GroupData[]>([])
const members = ref<MemberDataItem[]>([])
const dataMap = ref(reactive({}))
const dragging = ref(false)
const showDrawer = ref(true)
const settingDialog = ref(false)

const groupLoading = ref(true)
const memberLoading = ref(false)

async function initGroup(groupId: string) {
  memberLoading.value = true
  members.value = await dataLoader.getMemberData(groupId)
  dataMap.value = groupDataMap.value[groupId] ??= {}
  memberLoading.value = false
}

watch(() => config.user.group, initGroup)

onMounted(async () => {
  groups.value = await dataLoader.getGroupData()
  config.user.group ||= groups.value[0].id
  config.user.template ||= templates[0]
  groupLoading.value = false
  await initGroup(config.user.group)
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

