<template>
  <div class="viewWrapper" :class="isFullScreen?'fullScreen':''">
    <Tabs class="level-one" v-model="tabsType" :animated="false">
      <TabPane border label="每日" name="semDayList">
        <SemDayList
          v-if="cacheList.has('semDayList')"
          @on-set-table-height="setTableHeight"
          :tableHeight="tableHeight"
          :isFullScreen.sync="isFullScreen"
        />
      </TabPane>
      <TabPane border label="小时" name="semHourList">
        <SemHourList
          v-if="cacheList.has('semHourList')"
          @on-set-table-height="setTableHeight"
          :tableHeight="tableHeight"
          :isFullScreen.sync="isFullScreen"
        />
      </TabPane>
      <TabPane border label="责任人" name="semPersonList">
        <SemPersonList
          v-if="cacheList.has('semPersonList')"
          @on-set-table-height="setTableHeight"
          :tableHeight="tableHeight"
          :isFullScreen.sync="isFullScreen"
        />
      </TabPane>
      <TabPane border label="账户数据" name="SemAccountList">
        <SemAccountList
          v-if="cacheList.has('SemAccountList')"
          @on-set-table-height="setTableHeight"
          :tableHeight="tableHeight"
          :isFullScreen.sync="isFullScreen"
        />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import SemDayList from './SemDayList.vue'
import SemHourList from './SemHourList.vue'
import SemPersonList from './SemPersonList.vue'
import SemAccountList from './SemAccountList'
import { setFixeTableMixin } from '../tools'
export default {
  name: 'semSheet',
  mixins: [setFixeTableMixin],
  components: {
    SemDayList,
    SemHourList,
    SemPersonList,
    SemAccountList
  },
  data () {
    return {
      tabsType: 'semDayList',
      isFullScreen: false,
      cacheList: new Set()
    }
  },
  watch: {
    isFullScreen () {
      this.setTableHeight()
    },
    tabsType: {
      handler (newVal) {
        this.cacheList.add(newVal)
      },
      immediate: true
    }
  }
}
</script>
