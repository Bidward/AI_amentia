<template>
  <div>
    <Tabs type="card" class="level-two" v-model="tabsType" :animated="false">
      <TabPane label="推广软件/换包收益" name="predictRecommend" >
        <PredictRecommendList v-if="tabsType==='predictRecommend'" />
      </TabPane>
      <TabPane label="其他收益" name="predictOtherList" >
        <PredictOtherList v-if="tabsType==='predictOtherList'" />
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import PredictRecommendList from './PredictRecommendList.vue'
import PredictOtherList from './PredictOtherList.vue'
export default {
  name: 'predictList',
  components: {
    PredictRecommendList,
    PredictOtherList
  },
  data () {
    return {
      tabsType: 'predictRecommend'
    }
  }
}
</script>
