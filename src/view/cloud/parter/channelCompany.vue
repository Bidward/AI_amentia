<template>
    <!--渠道公司-->
    <div class="viewWrapper">
        <Tabs name="0" value="2" @on-click="handleClick" :animated="false"  class="level-one">
            <TabPane tab="0" label="产品公司" name="1"></TabPane>
            <TabPane tab="0" label="渠道公司" name="2">
                <mateChannel v-if="isStation"></mateChannel>
                <Tabs name="1" class="level-two" v-else value="1_1" @on-click="handleInnerClick"  type="card" :animated="false">
                    <TabPane tab="1" label="渠道公司" name="1_1">
                        <channelCon></channelCon>
                    </TabPane>
                    <TabPane tab="1" label="待确认渠道公司" name="1_2">
                    </TabPane>
                </Tabs>
            </TabPane>
            <TabPane  tab="0" label="合同库" name="3"></TabPane>
            <TabPane  tab="0" label="产品库" name="4"></TabPane>
            <TabPane  tab="0" label="产品链接库" name="5"></TabPane>
            <TabPane  tab="0" label="待审核信息" name="6"></TabPane>
        </Tabs>
    </div>
</template>

<script>
// import Vue from 'vue'
import channelCon from './channel/channeCon'
import mateChannel from './channel/mateChannel'
import tabChangeClickMixins from '../tabChangeClickMixins'
export default {
  name: 'channelCompany',
  components: {
    channelCon,
    mateChannel
  },
  mixins: [tabChangeClickMixins],
  data () {
    return {
      isStation: false
    }
  },
  mounted () {
    if (this.$route.query.type === 1) {
      this.isStation = true
      this.$route.meta.title = '匹配渠道'
    } else if (this.$route.query.type === undefined) {
      this.isStation = false
      this.$route.meta.title = '渠道公司'
    }
  },
  methods: {

    handleClick (name) {
      // Vue.tabChangeClick(name)
      this.tabChangeClick(name)
    },
    handleInnerClick (name) {
      switch (name) {
        case '1_1':
          this.$router.push({
            name: 'channelCompany'
          })
          break
        case '1_2':
          this.$router.push({
            name: 'waitConChannel'
          })
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
