<template>
  <v-app>
    <v-layout>
      <v-navigation-drawer
        permanent
      >
        <GroupSelector
          v-model="group"
          :groups="groups"
          :parse-url="parseGroupAvatar"
        ></GroupSelector>

        <v-divider></v-divider>

        <MemberAvatarList
          :items="members"
          :parse-url="parseMemberAvatar"
        ></MemberAvatarList>
      </v-navigation-drawer>

      <v-main>
        <v-container>
          <NominateTemplate
            title="2023 年度最佳群友提名"
            :items="items"
            :parse-url="parseMemberAvatar"
            @dragging="n => dragging = n"
            v-model="dataMap"
          ></NominateTemplate>
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
import NominateTemplate from "@/components/NominateTemplate.vue";
import MemberAvatarList from "@/components/MemberAvatarList.vue";
import DeleteBtn from "@/components/DeleteBtn.vue";
import { QQGroupDataLoader } from './loader/qq-group-data-loader';
import { MemberData } from './types/member';
import { GroupData } from './types/group';

const items = reactive([
  "最富裕的群友",
  "最二次元的群友",
  "最可(香)爱(草)的群友",
  "发涩图最多的群友",
  "最活跃的群友",
  "最银乱的群友",
  "游戏领域大神群友",
  "傻到可爱的群友",
  "最佳姐姐/哥哥系",
  "最佳妹妹/弟弟系",
])

function parseMemberAvatar(id: string) {
  return `http://q1.qlogo.cn/g?b=qq&nk=${id}&s=640`
}

function parseGroupAvatar(id: string) {
  return `http://p.qlogo.cn/gh/${id}/${id}/640/`
}

const qqGroupDataLoader = new QQGroupDataLoader()

const groups = ref<GroupData[]>([])
const group = ref<string>('')
const members = ref<MemberData[]>([])
const dataMap = reactive({})
const dragging = ref(false)

watch(group, async n => {
  members.value = await qqGroupDataLoader.getMemberData(n)
})
onMounted(async () => {
  groups.value = await qqGroupDataLoader.getGroupData()
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

