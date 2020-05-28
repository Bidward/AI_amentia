<template>
  <div class="viewWrapper" :class="isFullScreen?'fullScreen':''">
    <Tabs class="level-one" v-model="tabsType" :animated="false">
      <TabPane border label="每日" name="semDayListBaidu">
        <SemDayListBaidu
          @on-set-table-height="setTableHeight"
          :tableHeight="tableHeight"
          :isFullScreen.sync="isFullScreen"
        />
      </TabPane>
      <TabPane border label="小时" name="semHourListBaidu">
        <SemHourListBaidu
          @on-set-table-height="setTableHeight"
          :tableHeight="tableHeight"
          :isFullScreen.sync="isFullScreen"
        />
      </TabPane>
      <TabPane border label="阿拉丁" name="SemAladingBaidu">
        <SemAladingBaidu
          @on-set-table-height="setTableHeight"
          :tableHeight="tableHeight"
          :isFullScreen.sync="isFullScreen"
        />
      </TabPane>
      <TabPane border label="账户管理" name="semAccountListBaidu">
        <SemAccountListBaidu
          @on-set-table-height="setTableHeight"
          :tableHeight="tableHeight"
          :isFullScreen.sync="isFullScreen"
        />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import SemDayListBaidu from './SemDayListBaidu.vue'
import SemHourListBaidu from './SemHourListBaidu.vue'
import SemAccountListBaidu from './SemAccountListBaidu'
import SemAladingBaidu from './SemAladingBaidu'
import { getFixedTableHeight } from '../tools'
import { debounce } from '@/libs/tools'
export default {
  name: 'semSheet',
  components: {
    SemDayListBaidu,
    SemHourListBaidu,
    SemAccountListBaidu,
    SemAladingBaidu
  },
  data () {
    return {
      tableHeight: 600,
      tabsType: 'semDayListBaidu',
      isFullScreen: false
    }
  },
  mounted () {
    window.addEventListener('resize', debounce(this.setTableHeight))
  },
  methods: {
    setTableHeight () {
      this.tableHeight = getFixedTableHeight(this.isFullScreen)
    }
  },
  watch: {
    isFullScreen () {
      this.setTableHeight()
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', debounce(this.setTableHeight))
  }
}
</script>
