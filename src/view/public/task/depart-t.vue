<template>
  <div id="task-depart">
    <Tabs type="card"
      :animated="false"
      v-model="currentTab"
      @on-click="setCurrentPage"
    >
      <TabPane
        v-for="(tab, index) in headerCount"
        :key="index"
        :label="tab.count"
        :name="index + 1 + ''"
        >
        <div v-if="currentTab == index + 1">
          <bz-table-department
            :rowData="listData"
            :spanArr="spanArr"
            :page="page"
            :loading="loading"
            @params="updateFields"
            @current-page="updateCurrentPage"
            @page-size="updatePageSize"
            @focus="handleFocus"
            :taskLevels="taskLevels"
            :employees="employees"
            :taskStatus="taskStatus"
          >
          </bz-table-department>
        </div>
      </TabPane>
      <div slot="extra">
        <search-box
          :searchContent="searchContent"
          :searchType="department"
          @search-content-change="handleSearchContentChange"
          @inaccurate-search="handleInaccurateSearch"
          @refresh="handleRefresh"
        ></search-box>
      </div>
    </Tabs>
  </div>
</template>
<script>

import BzTableDepartment from './components/bz-table-department'
import SearchBox from './components/search-box'
import { tasksMixin } from '@/assets/js/mixins'
import { baseUrl } from '@/api/base.js'
import { Track } from '@/libs/track'
const track = new Track('综合模块/任务系统/部门任务')
export default {
  name: 'taskDepart',
  mixins: [tasksMixin],
  components: {
    BzTableDepartment,
    SearchBox
  },
  created () {
    track.start()
  },
  data () {
    return {
      rowList: [],
      spanArr: [],
      position: 0,
      listData: [],
      // 当前tab的name属性
      currentTab: '1',
      loading: true, // 是否显示表格加载框
      searchContent: '', // 模糊搜素关键字
      searchType: '0', // 默认是 0 代表表头搜索
      // 表头搜索字段
      fields: {
        taskLevel: '', // 任务等级
        taskStatus: '', // 任务状态
        name: '', // 任务名称
        timeRange: [], // 时间范围
        sendUid: '', // 发起人id
        sendName: '', // 发起人姓名
        acceptUid: '', // 接收人id
        acceptName: '', // 接受人姓名
        executeUid: '', // 执行人id
        executeName: '', // 执行人姓名
        startTime: '',
        endTime: '',
        searchType: 0
      },
      department: 'depart',
      page: {
        pageSize: 20,
        totalCount: 100,
        currentPage: 1
      }
    }
  },
  methods: {
    handleFocus (data) {
      // console.log(data, 'data')
      this.$set(this.listData[data.index], 'tasksFocus', data.flag)
    },
    // 获取页面渲染数据
    getTableData (data) {
      this.loading = true
      let params = this.getValidParams(data)
      // num count
      this.$axios({
        url: `${baseUrl}/tasks/deptgroup/0`,
        method: 'post',
        data: $qs.stringify(params)
      }).then(res => {
        if (res.data.code === 10000) {
          let data = res.data.content
          this.headCount.countAll = data.countAll
          this.headCount.countClose = data.countClose
          this.headCount.countDefer = data.countDefer
          this.headCount.countDone = data.countDone
          this.headCount.countOngoing = data.countOngoing
          this.headCount.countTbc = data.countTbc
        }
      }).catch(err => {
        console.log('err', err)
      })

      this.$axios({
        url: `${baseUrl}/tasks/deptgroup/${this.currentTab}`,
        method: 'post',
        data: $qs.stringify(params)
      }).then(res => {
        if (res.data.code === 10000) {
          let data = res.data.content
          this.page.currentPage = data.page.currPage
          this.page.pageSize = data.page.pageSize
          this.page.totalCount = data.page.totalCount

          // 列表数据
          this.listData = data.page.pageContent
          this.loading = false
        } else {
          this.loading = false
          this.$Message.success(res.data.msg)
        }
        this.$nextTick(() => {
          track.end()
        })
      }).catch(err => {
        console.log('err', err)
      })
    },
    updateFields (fields) {
      this.fields = fields
      this.listData = []
      this.getTableData()
    }
  }
  // mounted () {
  // this.getTableData()
  // }
}
</script>
<style lang="less">
  #task-depart {
    box-sizing: border-box;
    // padding: 0 10px;
    .ivu-tabs-bar{
      margin: 0;
    }
    .ivu-tabs-tabpane {
      min-height: 0;
    }
  }
</style>
