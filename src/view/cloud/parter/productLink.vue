<template>
<!-- 这是产品链接库 -->
<div class="viewWrapper">
    <Tabs name="0" value="5" @on-click="handleClick" :animated="false"  class="level-one">
        <TabPane tab="0" label="产品公司" name="1">
        </TabPane>
        <TabPane tab="0" label="渠道公司" name="2">
        </TabPane>
        <TabPane tab="0" label="合同库" name="3">
        </TabPane>
        <TabPane tab="0" label="产品库" name="4">
        </TabPane>
        <TabPane tab="0" label="产品链接库" name="5">
            <Tabs name="1" value="1_1" class="level-two" type="card" @on-click="handleInnerClick" :animated="false">
                <TabPane tab="1" label="产品链接库" name="1_1">
                    <producLinkCon></producLinkCon>
                </TabPane>
                <TabPane tab="1" label="待确认信息" name="1_2">
                </TabPane>
            </Tabs>
        </TabPane>
        <TabPane tab="0" label="待审核信息" name="6">
        </TabPane>
    </Tabs>
</div>
</template>

<script>
import producLinkCon from '../parter/productLink/producLinkCon'

// import Vue from 'vue'
import tabChangeClickMixins from '../tabChangeClickMixins'

export default {
  components: {
    producLinkCon
  },
  name: 'productLink',
  mixins: [tabChangeClickMixins],
  data () {
    return {

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
            name: 'productLink'
          })
          break
        case '1_2':
          this.$router.push({
            name: 'waitSureProductLink'
          })
          break
      }
    }
  }
}
</script>
<style scoped>

</style>
