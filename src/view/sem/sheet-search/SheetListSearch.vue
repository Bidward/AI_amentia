<template>
  <!-- 360搜索词成本表 -->
  <div class="viewWrapper" :class="isFullScreen?'fullScreen':''">
    <Tabs class="level-one" v-model="tabsType" :animated="false">
      <TabPane border label="每日" name="SemDayListSearch">
        <SemDayListSearch
          v-if="tabsType==='SemDayListSearch'"
          @on-set-table-height="setTableHeight"
          :tableHeight="tableHeight"
          :isFullScreen.sync="isFullScreen"
        />
      </TabPane>
      <TabPane border label="小时" name="SemHourListSearch">
        <SemHourListSearch
          v-if="tabsType==='SemHourListSearch'"
          @on-set-table-height="setTableHeight"
          :tableHeight="tableHeight"
          :isFullScreen.sync="isFullScreen"
        />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import SemDayListSearch from './SemDayListSearch.vue'
import SemHourListSearch from './SemHourListSearch.vue'
import { getFixedTableHeight } from '../tools'
import { debounce } from '@/libs/tools'
export default {
  name: 'semSheet',
  components: {
    SemDayListSearch,
    SemHourListSearch
  },
  data () {
    return {
      tableHeight: 600,
      tabsType: 'SemDayListSearch',
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
