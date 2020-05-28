<template>
  <div class="viewWrapper" :class="isFullScreen?'fullScreen':''">
    <Tabs class="level-one" v-model="tabsType" :animated="false">
      <TabPane border label="每日" name="semDayListSogou">
        <SemDayListSogou
          @on-set-table-height="setTableHeight"
          :tableHeight="tableHeight"
          :isFullScreen.sync="isFullScreen"
        />
      </TabPane>
      <!-- <TabPane border label="小时" name="SemHourListSogou">
        <SemHourListSogou
          @on-set-table-height="setTableHeight"
          :tableHeight="tableHeight-fixTableHeight"
          :isFullScreen.sync="isFullScreen"
        />
      </TabPane> -->
      <TabPane border label="账户管理" name="SemAccountListSogou">
        <SemAccountListSogou
          @on-set-table-height="setTableHeight"
          :tableHeight="tableHeight"
          :isFullScreen.sync="isFullScreen"
        />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import SemDayListSogou from './SemDayListSogou.vue'
// import SemHourListSogou from './SemHourListSogou.vue'
import SemAccountListSogou from './SemAccountListSogou'
import { getFixedTableHeight } from '../tools'
import { debounce } from '@/libs/tools'
export default {
  name: 'semSheet',
  components: {
    SemDayListSogou,
    // SemHourListSogou,
    SemAccountListSogou
  },
  data () {
    return {
      tableHeight: 600,
      tabsType: 'semDayListSogou',
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
