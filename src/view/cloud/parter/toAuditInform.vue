<template>
  <!-- 这是待审核信息 -->
<div class="viewWrapper">
    <Tabs name="0" value="6" class="level-one" @on-click="handleClick" :animated="false">
        <TabPane tab="0" label="产品公司" name="1">
        </TabPane>
        <TabPane tab="0" label="渠道公司" name="2">
        </TabPane>
        <TabPane tab="0" label="合同库" name="3">
        </TabPane>
        <TabPane tab="0" label="产品库" name="4">
        </TabPane>
        <TabPane tab="0" label="产品链接库" name="5">
        </TabPane>
        <TabPane tab="0" label="待审核信息" name="6">
            <Tabs  type="card" name="1_1"  :animated="false" @on-click="handleInnerClick" class="level-two">
                <TabPane tab="1_1" label="待审核合同" name="1_1">
                    <toAudContract></toAudContract>
                </TabPane>
                <TabPane tab="1_1" label="待审核上线" name="1_2">
                </TabPane>
            </Tabs>
        </TabPane>
    </Tabs>
</div>

</template>

<script>
// import Vue from 'vue'
import toAudContract from '../parter/toAudit/toAuditContract' // 待审核合同
import tabChangeClickMixins from '../tabChangeClickMixins'

export default {
  name: 'toAuditInform',
  components: {
    toAudContract
  },
  data () {
    return {}
  },
  mixins: [tabChangeClickMixins],
  methods: {
    handleClick (name) {
      // Vue.tabChangeClick(name)
      this.tabChangeClick(name)
    },
    handleInnerClick (name) {
      switch (name) {
        case '1_1':
          this.$router.push({
            name: 'toAuditInform'
          })
          break
        case '1_2':
          this.$router.push({
            name: 'toAuditOnline'
          })
          break
      }
    }
  }
}
</script>
