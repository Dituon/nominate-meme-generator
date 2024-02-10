<template>
  <v-app>
    <v-layout>
      <v-navigation-drawer
        permanent
      >
        <GroupSelector v-model="group" :groups="groups"></GroupSelector>

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
        <DeleteBtn :data-map="dataMap" :dragging="dragging"></DeleteBtn>
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
  "最佳妹妹/弟弟系"
])

function parseMemberAvatar(id) {
  return `http://q1.qlogo.cn/g?b=qq&nk=${id}&s=640`
}

const groups = ref<{ name: string, id: string }[]>([])
const group = ref<string>('')
const members = ref<string[]>([])
const dataMap = reactive({})
const dragging = ref(false)

watch(group, n => {
  console.log(n)
  window.parent.postMessage({
    type: 'members',
    id: n,
  }, '*')
})

onMounted(() => {
  if (window.parent !== window) { // inject mode
    window.parent.postMessage({
      type: 'groups'
    }, '*')
    window.addEventListener('message', e => {
      const {type, data} = e.data
      switch (type) {
        case 'groups':
          groups.value = data
          console.log(data)
          break
        case 'members':
          members.value = data
          console.log(members.value)
          break
      }
    })
  }
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

