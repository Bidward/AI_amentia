<template>
  <div id="semStaticHourList">
    <div class="level-three clearfix">
      <Button @click="exportExcel">导出</Button>
      <div class="searchbar">
        <Input
          @on-search="()=>{detailHeader.currPage=1;detailSearch()}"
          placeholder="搜索关键词"
          search
          clearable
          v-model="detailHeader.text"
          style="width:200px;margin-right:5px;"
        />
        <Button :icon="isFullScreen?'md-contract':'md-expand'" @click="handleFullScreen" />
        <Button icon="ios-loading" @click="()=>{reload();detailSearch()}" />
        <TableHeaderSetting
          :totalTableHeader="totalTableHeader"
          :tableHeader.sync="tableHeader"
          key="semStaticHourList"
          localKey="semStaticHourList"
          :width="600"
        />
      </div>
    </div>
    <Table
      :columns="tableHeader"
      :data="tableContent"
      @on-sort-change="sortChange"
      :height="tableHeight"
      border
      key="semStaticHourList"
    />
    <div class="clearfix tableFooter">
      <Page
        size="small"
        :total="detailHeader.totalCount"
        :page-size="detailHeader.pageSize"
        :current="detailHeader.currPage"
        :page-size-opts="[20,50,100]"
        show-total
        show-sizer
        show-elevator
        @on-change="(currPage)=>{detailHeader.currPage=currPage;detailSearch()}"
        @on-page-size-change="(pageSize)=>{detailHeader.pageSize=pageSize;detailSearch()}"
      />
    </div>
  </div>
</template>
<script>
import { semUrl } from '@/api/base.js'
import TableHeaderSetting from '_c/table-header-setting'
import { mixins } from '../tools.js'
import { dayTotalTableHeader } from './tableHeader'
import moment from 'moment'
import { Track } from '@/libs/track.js'
const track = new Track('营销/360数据统计/小时')
export default {
  name: 'semStaticHourList',
  components: {
    TableHeaderSetting
  },
  mixins: [mixins, dayTotalTableHeader],
  props: {
    isFullScreen: {
      type: Boolean,
      default: false
    },
    tableHeight: {
      type: Number,
      default: 600
    }
  },
  data () {
    return {
      loading: true,
      tableHeader: [],
      tableContent: [],
      detailHeader: {
        currPage: 1,
        pageSize: 20,
        totalCount: 0,
        hour: '', // 小时
        hourMergin: '1', // 是否区间合并，1不合2合
        keyword: '', // 关键词
        xzAppid: '', // 渠道号
        accountName: '', // 账户名称
        softName: '', // 软件名
        xzSoftid: '', // 软件id
        timeRange: [],
        orderby: '', // 根据什么字段排序
        desc: 'normal', // 排序的方式
        text: '' // 模糊搜索
      }
    }
  },
  beforeCreate () {
    track.start()
  },
  mounted () {
    this.setTimeRange()
    this.detailSearch()
  },
  methods: {
    // 导出excel
    exportExcel () {
      let sendData = this.getSendData()
      sendData.type = 'expt'
      delete sendData.pageSize
      delete sendData.currPage
      delete sendData.text
      let data = $qs.stringify(sendData)
      window.open(semUrl + '/Statis/hour?' + data)
    },
    setTimeRange () {
      this.detailHeader.date = moment().format('YYYY-MM-DD')
      // 整点的15分钟以后，当前前一小时和当前小时，如8:16,获取7点和8点的
      // 整点的15分钟之前，当前前两个小时和前一小时，如8:14，获取6点到7点
      if (new Date().getMinutes() > 15) {
        this.detailHeader.timeRange = [
          moment()
            .subtract(1, 'hours')
            .format('HH:00:00'),
          moment().format('HH:00:00')
        ]
      } else {
        this.detailHeader.timeRange = [
          moment()
            .subtract(2, 'hours')
            .format('HH:00:00'),
          moment()
            .subtract(1, 'hours')
            .format('HH:00:00')
        ]
      }
    },
    // 搜索
    detailSearch (getData = {}) {
      let sendData = this.getSendData(getData)
      this.loading = true
      this.$axios({
        url: semUrl + '/Statis/hour',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          let list = res.data.list
          let sum = res.data.sum
          if (list.length !== 0) {
            // 合计放到最后一行
            list.push(sum)
            list.unshift(sum)
          }
          this.tableContent = Object.freeze(list)
          this.detailHeader.totalCount = Number(res.data.totalCount)
          this.setTableHeight()
          this.loading = false
          this.$nextTick(() => {
            track.end()
          })
        })
        .catch(err => {
          console.error(err)
          this.$Notice.warning({
            title: '数据异常，请联系技术人员'
          })
          this.loading = false
        })
    },
    // 排序
    sortChange (column) {
      // 降序  "desc"
      let orderby = column.key
      let desc = column.order
      this.detailSearch({ orderby, desc })
      this.detailHeader.orderby = column.key
      this.detailHeader.desc = column.order
    },
    // 设置Table的高度
    setTableHeight () {
      this.$emit('on-set-table-height')
    },
    // 设置全屏
    handleFullScreen () {
      this.$emit('update:isFullScreen', !this.isFullScreen)
    },
    // 获取需要发送的数据的数值
    getSendData (data = {}) {
      let assignData = { ...this.detailHeader, ...data }
      let sendData = {}

      for (let key in assignData) {
        let value = assignData[key]
        value = typeof value === 'string' ? value.trim() : value
        if (value) {
          sendData[key] = value
        }
      }
      // 如果是模糊搜索
      if (sendData.text) {
        // 清空搜索
        this.reload({ text: sendData.text })
      }
      sendData.date = moment(sendData.date).format('YYYY-MM-DD')
      sendData.startHour = sendData.timeRange[0]
      sendData.endHour = sendData.timeRange[1]
      // 渠道号多搜
      delete sendData.timeRange
      delete sendData.totalCount
      // 如果排序清空，不需要带排序条件
      if (sendData.desc === 'normal') {
        delete sendData.orderby
        delete sendData.desc
      }
      return sendData
    },
    // 重新加载
    reload (data = {}) {
      // 页面初始化的时候的数据
      let initData = {
        currPage: 1,
        pageSize: 20,
        totalCount: 0,
        hour: '', // 小时
        hourMergin: '1', // 是否区间合并
        keyword: '', // 关键词
        xzAppid: '', // 渠道号
        accountName: '', // 账户名称
        softName: '', // 软件名
        xzSoftid: '', // 软件id
        timeRange: [],
        orderby: '', // 根据什么字段排序
        desc: 'normal', // 排序的方式
        text: '' // 模糊搜索
      }
      this.detailHeader = Object.assign(initData, data)
      this.setTimeRange()
      return this.detailHeader
    }
  },
  watch: {
    isFullScreen (newVal) {
      this.setTableHeight()
    }
  },
  computed: {
    tableContentLength () {
      return this.tableContent.length
    },
    totalTableHeader () {
      return this.totalTableHeaders
    }
  }
}
</script>
