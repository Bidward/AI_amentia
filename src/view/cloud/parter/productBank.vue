<template>
<!-- 这是产品库 -->
<div class="viewWrapper">
    <Tabs name="0" value="4" @on-click="handleClick" :animated="false" class="level-one">
        <TabPane tab="0" label="产品公司" name="1">
        </TabPane>
        <TabPane tab="0" label="渠道公司" name="2">
        </TabPane>
        <TabPane tab="0" label="合同库" name="3">
        </TabPane>
        <TabPane tab="0" label="产品库" name="4">
            <mateProduct v-if="isStation"></mateProduct>
            <Tabs name="1" v-else value="1_1"  @on-click="handleInnerClick" type="card" :animated="false" class="level-two">
                <TabPane tab="1" label="产品库" name="1_1">
                    <productBanckCon></productBanckCon>
                </TabPane>
                <TabPane tab="1" label="待确认产品" name="1_2">
                </TabPane>
            </Tabs>
        </TabPane>
        <TabPane tab="0" label="产品链接库" name="5">
        </TabPane>
        <TabPane tab="0" label="待审核信息" name="6">
        </TabPane>
    </Tabs>
</div>
</template>

<script>
import productBanckCon from '../parter/produckBank/productBanckCon'
import mateProduct from './channel/mateProduct'
// import Vue from 'vue'
import tabChangeClickMixins from '../tabChangeClickMixins'
export default {
  components: {
    productBanckCon,
    mateProduct
  },
  mixins: [tabChangeClickMixins],
  name: 'productBank',
  data () {
    return {
      isStation: false
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/detailProduct') {
      console.log(sessionStorage.businessId)
    } else if (to.path === '/editProduckBank') {
      console.log(sessionStorage.businessId)
    } else {
      sessionStorage.clear()
    }
    next()
  },
  mounted () {
    if (this.$route.query.type === 2) {
      this.isStation = true
      this.$route.meta.title = '匹配产品'
    } else if (this.$route.query.type === undefined) {
      this.isStation = false
      this.$route.meta.title = '产品库'
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
            name: 'productBank'
          })
          break
        case '1_2':
          this.$router.push({
            name: 'waitSureProductBanckCon'
          })
          break
      }
    }
  }
}
</script>

<style scoped>
</style>
