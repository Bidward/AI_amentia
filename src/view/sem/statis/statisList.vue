<template>
  <div class="viewWrapper" :class="isFullScreen?'fullScreen':''">
    <Tabs class="level-one" v-model="tabsType" :animated="false">
      <TabPane border label="每日" name="semStatisDayList">
        <SemStatisDayList
          v-if="tabsType==='semStatisDayList'"
          @on-set-table-height="setTableHeight"
          :tableHeight="tableHeight"
          :isFullScreen.sync="isFullScreen"
        />
      </TabPane>
      <TabPane border label="小时" name="semStatisHourList">
        <SemStatisHourList
          v-if="tabsType==='semStatisHourList'"
          @on-set-table-height="setTableHeight"
          :tableHeight="tableHeight"
          :isFullScreen.sync="isFullScreen"
        />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import SemStatisDayList from './statisDayList.vue'
import SemStatisHourList from './statisHourList.vue'
import { setFixeTableMixin } from '../tools'
export default {
  name: 'semStatisList',
  mixins: [setFixeTableMixin],
  components: {
    SemStatisDayList,
    SemStatisHourList
  },
  data () {
    return {
      tabsType: 'semStatisDayList',
      isFullScreen: false
    }
  },
  watch: {
    isFullScreen () {
      this.setTableHeight()
    }
  }
}
</script>
