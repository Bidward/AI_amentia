<template>
    <div class="viewWrapper" style="overflow: auto; padding: 20px" :class="isFullScreen ? 'fullScreen' : ''">
        <Tabs
            type="card"
            :animated="false"
            class="level-two"
            v-model="currentTab"
            @on-click="handleTab"
        >
            <TabPane
                v-for="(item, index) in tabs"
                :label="item.lable"
                :key="index"
                :name="item.name"
            >
                <component :is="item.name" v-if="currentTab===item.name"></component>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
import pending from './list/pending'
import processed from './list/processed'
export default {
  name: 'informationPending',
  components: {
    pending,
    processed
  },
  data () {
    return {
      loading: false,
      currentTab: sessionStorage.messageTabs || 'pending',
      tabs: [
        {
          lable: '待处理',
          name: 'pending'
        },
        {
          lable: '已处理',
          name: 'processed'
        }
      ]
    }
  },
  methods: {
    // 切换标签
    handleTab (v) {
      // 如果query有值，把tagName清除
      if (this.$route.query) {
        this.$route.query.tagName = ''
        sessionStorage.setItem('messageTabs', this.currentTab)
      }
    },
    addChannel () {}
  },
  computed: {
    isFullScreen () {
      return this.$store.state.app.isTaskListFullScreen
    }
  }
}
</script>

<style lang="less" scoped>
</style>
