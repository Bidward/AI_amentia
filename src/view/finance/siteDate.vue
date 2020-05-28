<template>
  <div class="viewWrapper" :class="isFullScreen ? 'fullScreen' : ''">
    <Tabs
      name="0"
      v-model="tabsType"
      class="level-one"
      :animated="false"
      @on-click="clickTab"
    >
      <TabPane border tab="0" label="日成本跟踪表" name="dayCostSheet">
        <Tabs
          name="1"
          type="card"
          class="level-two"
          :animated="false"
          size="small"
          v-if="tabsType == 'dayCostSheet'"
        >
          <TabPane tab="1" label="按日查看">
            <dailyCostTracking />
          </TabPane>
          <TabPane tab="1" label="按月查看">
            <monthCostTracking />
          </TabPane>
        </Tabs>
      </TabPane>
      <TabPane border tab="0" label="站点成本表" name="siteCostSheet">
        <Tabs
          name="2"
          type="card"
          class="level-two"
          :animated="false"
          size="small"
          v-if="tabsType == 'siteCostSheet'"
        >
          <TabPane tab="2" label="包月付款">
            <monthlyPayment />
          </TabPane>
          <!-- <TabPane tab="2" label="单价计费">
            <priceBilling />
          </TabPane> -->
        </Tabs>
      </TabPane>
      <TabPane border tab="0" label="应收账单" name="receivableBills">
        <Tabs
          name="3"
          type="card"
          class="level-two"
          :animated="false"
          size="small"
          v-if="tabsType == 'receivableBills'"
        >
          <TabPane tab="3" label="应收汇总">
            <accountsCollect />
          </TabPane>
          <TabPane tab="3" label="期初金额">
            <initialAmount />
          </TabPane>
          <TabPane tab="3" label="收款单">
            <receiptBills />
          </TabPane>
        </Tabs>
      </TabPane>
      <TabPane border tab="0" label="充值预警表" name="topUpWarning">
        <Tabs
          name="4"
          type="card"
          class="level-two"
          :animated="false"
          size="small"
          v-if="tabsType == 'topUpWarning'"
          @on-click="clickTab2"
          v-model="tabsTypeTwo"
        >
          <TabPane tab="4" label="充值预警" name="warining">
            <sheetWarining v-if="tabsTypeTwo == 'warining'"/>
          </TabPane>
          <TabPane tab="4" label="期初金额">
            <beginningWarining />
          </TabPane>
        </Tabs>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import dailyCostTracking from './components/dailyCostTrackingSheet/dailyCostTracking'
import monthCostTracking from './components/dailyCostTrackingSheet/monthCostTracking'
import monthlyPayment from './components/siteCostSheet/monthlyPayment'
import priceBilling from './components/siteCostSheet/priceBilling'
import accountsCollect from './components/accountsBills/accountsCollect'
import initialAmount from './components/accountsBills/initialAmount'
import receiptBills from './components/accountsBills/receiptBills'
import sheetWarining from './components/topUpWarning/sheetWarining'
import beginningWarining from './components/topUpWarning/beginningWarining'
export default {
  name: 'siteDate',
  components: {
    monthlyPayment,
    priceBilling,
    dailyCostTracking,
    monthCostTracking,
    accountsCollect,
    initialAmount,
    receiptBills,
    sheetWarining,
    beginningWarining
  },
  data () {
    return {
      tabsType: sessionStorage.getItem('sitDateTab') || 'dayCostSheet',
      tabsTypeTwo: 'warining'
    }
  },
  methods: {
    clickTab (name) {
      sessionStorage.setItem('sitDateTab', name)
      this.$route.query.businessName = ''
    },
    clickTab2 () {
      this.$route.query.businessName = ''
    }
  },
  computed: {
    isFullScreen () {
      return this.$store.state.app.isTaskListFullScreen
    }
  }
}
</script>
