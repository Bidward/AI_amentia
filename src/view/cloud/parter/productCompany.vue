<template>
<!--产品公司-->
<div class="viewWrapper">
    <Tabs name="0" value="1" @on-click="handleClick" :animated="false" class="level-one">
        <TabPane tab="0" label="产品公司" name="1">
            <Tabs name="1" value="1_1"  type="card" @on-click="handleInnerClick" :animated="false" class="level-two">
                <TabPane tab="1" label="产品公司" name="1_1">
                    <productCon></productCon>
                </TabPane>
                <TabPane tab="1" label="待确认产品公司" name="1_2">
                </TabPane>
            </Tabs>
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
        </TabPane>
    </Tabs>
</div>
</template>

<script>
import productCon from './product/productCon.vue'
// import Vue from 'vue'
import tabChangeClickMixins from '../tabChangeClickMixins'

export default {
  name: 'productCompany',
  components: {
    productCon
  },
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
            name: 'productCompany'
          })
          break
        case '1_2':
          this.$router.push({
            name: 'waitConProduct'
          })
          break
      }
    }
  }

}
</script>

<style lang="less" scoped>

</style>
