<template>
<!-- 这是合同库 -->
<div class="viewWrapper">
    <Tabs name="0" value="3"  @on-click="handleClick" :animated="false" class="level-one">
        <TabPane tab="0" label="产品公司" name="1">
        </TabPane>
        <TabPane tab="0" label="渠道公司" name="2">
        </TabPane>
        <TabPane tab="0"  label="合同库" name="3">
            <Tabs name="1" type="card" value = "1_1" @on-click = "handleInnerClick" :animated="false" class="level-two">
                <TabPane tab="1" label="已签订" name="1_1">
                    <signed></signed>
                </TabPane>
                <TabPane tab="1" label="待确认合同" name="1_2">
                </TabPane>
                <TabPane  tab="1" label="待签订" name="1_3">
                </TabPane>
            </Tabs>
        </TabPane>
        <TabPane  tab="0" label="产品库" name="4">
        </TabPane>
        <TabPane  tab="0" label="产品链接库" name="5">
        </TabPane>
        <TabPane  tab="0" label="待审核信息" name="6">
        </TabPane>
    </Tabs>
</div>

</template>

<script>
import signed from './contract/signed'
// import Vue from 'vue'
import tabChangeClickMixins from '../tabChangeClickMixins'

export default {
  name: 'contractBank',
  components: {
    signed
  },
  mixins: [tabChangeClickMixins],
  data () {
    return {
      toSigns: 0
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
            name: 'contractBank'
          })
          break
        case '1_2':
          this.$router.push({
            name: 'waitSureContract'
          })
          break
        case '1_3':
          this.$router.push({
            name: 'waitSign'
          })
          break
      }
    }
  }

}
</script>
<style lang="less">
</style>
