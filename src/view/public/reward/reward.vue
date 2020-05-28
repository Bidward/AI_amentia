<template>
  <div class="viewWrapper">
    <Tabs class="level-one" v-model="tabsType" :animated="false">
      <TabPane border label="奖惩详情" name="detail">
          <rewardDetail v-if="tabsType==='detail'"/>
      </TabPane>
      <TabPane label="奖惩公示" name="show">
        <rewardShow v-if="tabsType==='show'" />
      </TabPane>
      <TabPane label="奖惩统计" name="total">
        <rewardRank v-if="tabsType==='total'" />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import rewardDetail from './rewardDetail'
import rewardShow from './rewardShow'
import rewardRank from './rewardRank'
export default {
  name: 'reward',
  components: {
    rewardDetail,
    rewardShow,
    rewardRank
  },
  data () {
    return {
      tabsType: 'detail'
    }
  }
}
</script>
