<!-- 定岗定编 -->
<template>
  <div class="viewWrapper">
    <Tabs
      class="level-one"
      :animated="false"
      v-model="currentTab"
      @on-click="clickTab"
      name="out"
    >
      <TabPane tab="out" label="公共事项模板" name="public" v-if="showPublicCategory">
        <template v-if="currentTab === 'public'">
          <add-public></add-public>
        </template>
      </TabPane>
      <TabPane tab="out" label="定岗定编设置" name="depart" v-if="showSetDuty">
        <template v-if="currentTab === 'depart'">
          <add-private></add-private>
        </template>
      </TabPane>
      <TabPane tab="out" label="定岗定编总览" name="general">
        <general-info v-if="currentTab === 'general'"></general-info>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import AddPublic from './public/add-public.vue'
// import AddDept from './jobs/add-depart.vue'
import AddPrivate from './jobs/add-private.vue'
import GeneralInfo from './general/general-info.vue'
export default {
  components: {
    AddPublic,
    AddPrivate,
    GeneralInfo
  },

  methods: {
    clickTab () {
      sessionStorage.setItem('dutyTab', this.currentTab)
    }
  },

  data () {
    return {
      currentTab: ''
    }
  },

  mounted () {
    if (sessionStorage.getItem('dutyTab')) {
      this.currentTab = sessionStorage.getItem('dutyTab')
    } else {
      if (this.showPublicCategory) {
        this.currentTab = 'public'
      } else if (this.showSetDuty) {
        this.currentTab = 'depart'
      } else {
        this.currentTab = 'general'
      }
    }
  },

  computed: {
    showPublicCategory () {
      return this.$store.state.user.userpermission.duty.publicCategory
    },
    showSetDuty () {
      return this.$store.state.user.userpermission.duty.setDuty
    }
  }
}
</script>

<style lang='less' scoped>

</style>
