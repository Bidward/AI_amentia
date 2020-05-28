<template>
  <div class="viewWrapper level-one" :class="isFullScreen?'fullScreen':''">
    <Tabs v-model="tabsType" :animated="false">
      <TabPane border label="每日" name="semDayList">
        <SemDayList @on-set-table-height="setTableHeight" :tableHeight="tableHeight" :isFullScreen.sync="isFullScreen" />
      </TabPane>
      <TabPane border label="小时" name="semHourList">
        <SemHourList @on-set-table-height="setTableHeight" :tableHeight="tableHeight" :isFullScreen.sync="isFullScreen" />
      </TabPane>
      <TabPane border label="责任人" name="semPersonList">
        <SemPersonList @on-set-table-height="setTableHeight" :tableHeight="tableHeight" :isFullScreen.sync="isFullScreen" />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import SemDayList from './SemDayList.vue'
import SemHourList from './SemHourList.vue'
import SemPersonList from './SemPersonList.vue'
export default {
  name: 'semSheet',
  components: {
    SemDayList,
    SemHourList,
    SemPersonList
  },
  data () {
    return {
      tableHeight: 600,
      tabsType: 'semDayList',
      isFullScreen: false
    }
  },
  mounted () {
    window.addEventListener('resize', () => {
      this.setTableHeight()
    })
  },
  methods: {
    setTableHeight () {
      let pagePaddingHeight = document
        .querySelectorAll('body')[0]
        .getClientRects()[0].height
      if (this.isFullScreen) {
        this.tableHeight = pagePaddingHeight - 150
      } else {
        this.tableHeight = pagePaddingHeight - 280
      }
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', () => {
      this.setTableHeight()
    })
  }
}
</script>
<style>
/* .pagePadding.fullScreen {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 901;
  left: 0;
  top: 0;
  margin: 0;
  padding: 10px;
} */
</style>
