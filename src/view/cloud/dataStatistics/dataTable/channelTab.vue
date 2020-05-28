<template>
<div>
  <div class="echart">
    <chart ref="chart1" :options="option" :auto-resize="true" class="chart1"></chart>
  </div>
  <div class="table">
    <Table border :columns="tabHeader" :data="newData" ></Table>
  </div>
  <div>
    <Page
    :total="totalCount"
    size="small"
    :page-size="pagesize"
    show-elevator
    show-sizer
    show-total
    @on-change="changePage"
    @on-page-size-change="newPages"
    style="float:right;color: #19aa8d;height:26px;margin-top:2px;"
    />
    <div style="clear:botn"></div>
  </div>
</div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
export default {
  props: ['toDate', 'toChannelId'],
  name: 'channelTab',
  data () {
    return {
      newData: [], // 渲染在表格的数据
      parentsTime: [], // 接收父组件传来的时间段
      tabHeader: [ // 表头
        {
          title: '时间',
          key: 'day',
          align: 'center'
        },
        {
          title: '已合作产品数量',
          key: 'cooperationNum',
          align: 'center'
        },
        {
          title: '匹配的产品数量',
          key: 'matchNum',
          align: 'center'
        },
        {
          title: '产品匹配合作率',
          key: 'cooperationRate',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <Tooltip content="产品匹配合作率=已合作产品数量/匹配的产品数量*100%" placement="top" transfer={true} max-width='150'>
                <span class='help'>
                  {params.column.title} &nbsp;
                  <Icon type="md-help-circle" />
                </span>
              </Tooltip>
            )
          }
        }, {
          title: '渠道在线链接数量',
          key: 'linkNum',
          align: 'center'
        }
      ],
      pagesize: 20, // 页码展示多少条
      pageCurrent: 1, // 当前页码
      totalCount: 10, // 数据总数
      option: {}, // echarts表格数据
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      dataTab: { // 表格数据
        date: [], // 时间
        matchProductNum: [], // 匹配的产品数量
        cooperationProductNum: [], // 已合作产品数量
        onlineChannelNum: [], // 渠道在线链接数量
        matchProduct: []// 产品匹配合作率
      },
      data1: {} // 未处理的表格数据
    }
  },
  methods: {
    getData (sendData) {
      this.$axios({ // 调用渠道公司数据接口,获取数据
        url: baseUrl + '/bzCloudData/ChannelData',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          let _p = res.data.content.pageContent.reverse()
          if (_p.length === 0) {
            this.$Message.info('暂无数据')
          } else {
            let _this = this
            _this.dataTab = {
              date: [],
              matchProductNum: [],
              cooperationProductNum: [],
              onlineChannelNum: [],
              matchProduct: []
            }
            this.newData.splice(0, this.newData.length)
            this.echartOption()
            _p.map((item) => {
              _this.dataTab.date.push(item.day)
              _this.dataTab.matchProductNum.push(item.matchNum)
              _this.dataTab.cooperationProductNum.push(item.cooperationNum)
              _this.dataTab.onlineChannelNum.push(item.linkNum)
              _this.dataTab.matchProduct.push(item.cooperationRate.replace('%', ''))
            })
            this.totalCount = res.data.content.totalCount
            this.newData = res.data.content.pageContent.reverse()
          }
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getTabDate () { // 获取表格数据方法
      this.parentsTime = this.toDate
      this.startTime = this.parentsTime[0].toLocaleDateString()// 开始时间
      this.endTime = this.parentsTime[1].toLocaleDateString()// 结束时间
      let sendData = {
        startTime: this.startTime,
        endTime: this.endTime,
        chinnelId: this.toChannelId,
        pageSize: this.pagesize,
        currPage: this.pageCurrent

      }
      this.getData(sendData)
    },
    changePage (index) {
      this.pageCurrent = index
      let sendData = {
        startTime: this.startTime,
        endTime: this.endTime,
        chinnelId: this.toChannelId,
        pageSize: this.pagesize,
        currPage: this.pageCurrent
      }
      this.getData(sendData)
    },
    newPages (index) {
      this.pagesize = index
      let sendData = {
        startTime: this.startTime,
        endTime: this.endTime,
        chinnelId: this.toChannelId,
        pageSize: this.pagesize,
        currPage: this.pageCurrent
      }
      this.getData(sendData)
    },
    echartOption () {
      let _this = this
      let colors = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#058DC7', '#05BDC7']
      _this.option = { // echarts功能
        color: colors,
        tooltip: {
          trigger: 'axis'
        },
        legend: {// 图标上方的标题展示
          data: ['已合作产品数量', '匹配的产品数量', '渠道在线链接数量', '产品匹配合作率']
        },
        grid: {
          containLabel: false,
          height: 'auto'
        },
        calculable: true,
        dataZoom: [{ // 图标下方滚动条
          type: 'slider',
          filterMode: 'weakFilter',
          showDataShadow: false,
          bottom: 20,
          height: 10,
          start: 20,
          end: 100,
          borderColor: 'transparent',
          backgroundColor: '#e2e2e2',
          handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
          handleSize: 20,
          handleStyle: {
            shadowBlur: 6,
            shadowOffsetX: 1,
            shadowOffsetY: 2,
            shadowColor: '#aaa'
          },
          labelFormatter: ''
        }, {
          type: 'inside',
          filterMode: 'weakFilter'
        }],
        xAxis: [ // X轴上
          {
            splitNumber: 5,
            type: 'category',
            boundaryGap: true,
            axisTick: {
              alignWithLabel: true
            },
            data: _this.dataTab.date
          }
        ],
        yAxis: [ // Y轴
          {// 百分比,右边y轴
            type: 'value',
            name: '',
            position: 'right',
            splitNumber: 5,
            axisLabel: {
              formatter: '{value} %'
            }
          },
          {// 左边的y轴
            type: 'value',
            name: '',
            position: 'left',
            axisLabel: {
              formatter: '{value} '
            }
          }
        ],
        series: [ // 每一个柱形
          {
            name: '已合作产品数量',
            type: 'bar',
            barGap: 0,
            yAxisIndex: 1,
            data: _this.dataTab.cooperationProductNum
          },
          {
            name: '匹配的产品数量',
            type: 'bar',
            yAxisIndex: 1,
            barGap: 0,
            data: _this.dataTab.matchProductNum
          },
          {
            name: '渠道在线链接数量',
            type: 'bar',
            yAxisIndex: 1,
            data: _this.dataTab.onlineChannelNum
          },
          {
            name: '产品匹配合作率',
            type: 'line',
            yAxisIndex: 0,
            data: _this.dataTab.matchProduct
          }
        ]
      }
    }
  },
  mounted () {
    this.getTabDate()
  }
}
</script>
<style lang="less" scoped>
.echart{
    width :90%;
    height: 550px;
    overflow: hidden;
    margin-left: 10%;
    margin-top: 3%;
}
  .echarts{
    width: 88%;
    height: 500px;
    margin-bottom: 30px;
  }

.table{
  margin-top: 0%;
}

</style>
