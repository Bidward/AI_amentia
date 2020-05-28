<template>
<div>
  <div class="echart">
    <chart ref="chart1" :options="option" :auto-resize="true" id="chart1"></chart>
  </div>
  <div class="table">
    <Table border :columns="tabHeader" :data="newData"  class="table1"></Table>
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
  props: ['toChild'],
  name: 'DataTable',
  data () {
    return {
      newData: [], // 渲染在表格的数据
      parentsTime: [],
      tabHeader: [ // 表头
        {
          title: '时间',
          key: 'date',
          align: 'center'
        },
        {
          title: '新增产品数量',
          key: 'addCompanyNum',
          align: 'center'
        },
        {
          title: '新增渠道数量',
          key: 'addChannelNum',
          align: 'center'
        },
        {
          title: '产品总量',
          key: 'companyNum',
          align: 'center'
        },
        {
          title: '渠道总量',
          key: 'channelNum',
          align: 'center'
        },
        {
          title: '产品与渠道的合作数量',
          key: 'onlineCompanyNum',
          align: 'center'
        },
        {
          title: '匹配数量合计',
          key: 'cooperationNum',
          align: 'center'
        },
        {
          title: '匹配转化率',
          key: 'conversions',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <Tooltip content="匹配转化率=产品与渠道的合作数量/匹配数量合计*100%" placement="top" max-width='150' transfer={true}>
                <span class='help'>
                  {params.column.title} &nbsp;
                  <Icon type="md-help-circle" />
                </span>
              </Tooltip>
            )
          }
        }
      ],
      pagesize: 20, // 每页展示数据
      pageCurrent: 1, // 当前页
      totalCount: 7, // 数据总数
      option: {}, // echarts功能
      startTime: '', // 开始时间
      endTime: '', // 结束时间

      dataTab: { // echarts表格数据
        date: [],
        xx: '-1',
        addCompanyNum: [], // 产品数量
        addChannelNum: [], // 渠道数量
        companyNum: [], // 产品总量
        // linkNum: [], // 产品链接总量
        channelNum: [], // 渠道总量
        proChannelCooperationNum: [10, 20], // 产品与渠道合作数量
        matchNumTotal: [], // 匹配数量合计
        matchConversion: []// 匹配转化率
      },
      data1: {} // 未处理的表格数据
    }
  },
  mounted () {
    this.getTabDate()
    this.echartOption()
  },
  methods: {
    getTabDate () {
      this.parentsTime = this.toChild
      this.startTime = this.parentsTime[0].toLocaleDateString()// 开始时间
      this.endTime = this.parentsTime[1].toLocaleDateString()// 结束时间
      let sendData = {
        startTime: this.startTime,
        endTime: this.endTime,
        pageSize: this.pagesize,
        currPage: this.pageCurrent
      }
      this.getDateTab(sendData)
    },
    echartOption () {
      let _this = this
      let color = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#058DC7', '#05BDC7']
      this.option = { // echarts功能
        color: color,
        tooltip: {
          trigger: 'axis'
        },
        legend: {// 图标上方的标题展示
          data: ['新增产品数量', '新增渠道数量', '产品总量', '渠道总量', '产品与渠道合作数量', '匹配数量合计', '匹配转化率']
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
            min: '0',
            // max: '100',
            position: 'right',
            splitNumber: 5,
            axisLine: {
              lineStyle: {
              // color: colors[0]
              }
            },
            axisLabel: {
              formatter: '{value} %'
            }
          },
          {// 左边的y轴
            type: 'value',
            name: '',
            min: this.leftmin,
            // max:_this.dataTab.leftMax,
            position: 'left',
            axisLine: {
              lineStyle: {
              // color: colors[0]
              }
            },
            axisLabel: {
              formatter: '{value} '
            }
          }
        ],
        series: [ // 每一个柱形
          {
            name: '新增产品数量',
            type: 'bar',
            yAxisIndex: 1,
            barGap: 0,
            data: _this.dataTab.addCompanyNum
          },
          {
            name: '新增渠道数量',
            type: 'bar',
            barGap: 0,
            yAxisIndex: 1,
            data: _this.dataTab.addChannelNum
          },
          {
            name: '产品总量',
            type: 'bar',
            barGap: 0,
            yAxisIndex: 1,
            data: _this.dataTab.companyNum
          },
          {
            name: '渠道总量',
            type: 'bar',
            barGap: 0,
            yAxisIndex: 1,
            data: _this.dataTab.channelNum
          },
          {
            name: '产品与渠道合作数量',
            type: 'bar',
            barGap: 0,
            yAxisIndex: 1,
            data: _this.dataTab.proChannelCooperationNum
          },
          {
            name: '匹配数量合计',
            type: 'bar',
            barGap: 0,
            yAxisIndex: 1,
            data: _this.dataTab.matchNumTotal
          },
          {
            name: '匹配转化率',
            type: 'line',
            yAxisIndex: 0,
            data: _this.dataTab.matchConversion
          }
        ]
      }
    },
    getDateTab (sendData) {
      this.$axios({ // 调用获取所有数据的接口
        url: baseUrl + '/bzCloudData/allData',
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
              channelNum: [],
              companyNum: [],
              addCompanyNum: [],
              addChannelNum: [],
              companyConversions: [],
              channelConversions: [],
              linkNum: [],
              proChannelCooperationNum: [],
              matchNumTotal: [],
              matchConversion: []
            }
            this.newData.splice(0, this.newData.length)
            this.echartOption()
            _p.map(item => {
              _this.dataTab.date.push(item.date) // 时间
              _this.dataTab.channelNum.push(item.channelNum) // 渠道总量
              _this.dataTab.companyNum.push(item.companyNum) // 产品总量
              _this.dataTab.addCompanyNum.push(item.addCompanyNum) // 新增产品数量
              _this.dataTab.addChannelNum.push(item.addChannelNum) // 新增渠道数量
              _this.dataTab.companyConversions.push(item.companyConversions.replace('%', ''))
              _this.dataTab.channelConversions.push(item.channelConversions.replace('%', ''))
              _this.dataTab.linkNum.push(item.linkNum)
              _this.dataTab.proChannelCooperationNum.push(item.onlineCompanyNum)
              _this.dataTab.matchNumTotal.push(item.cooperationNum)
              _this.dataTab.matchConversion.push(item.conversions)
            })
            for (let i in this.dataTab.matchConversion) {
              if (this.dataTab.matchConversion[i] === undefined) {
                this.dataTab.matchConversion[i] = 0
              } else {
                this.dataTab.matchConversion[i] = this.dataTab.matchConversion[i].replace('%', '')
              }
            }
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
    changePage (index) {
      this.pageCurrent = index
      let sendData = {
        startTime: this.startTime,
        endTime: this.endTime,
        pageSize: this.pagesize,
        currPage: this.pageCurrent
      }
      this.getDateTab(sendData)
    },
    newPages (index) {
      this.pagesize = index
      let sendData = {
        startTime: this.startTime,
        endTime: this.endTime,
        pageSize: this.pagesize,
        currPage: this.pageCurrent
      }
      this.getDateTab(sendData)
    }
  }
}
</script>
<style lang="less" scoped>
.echart{
    width :90%;
    height: 550px;
    overflow: hidden;
    margin-left: 5%;
    margin-top: 3%;
}
  .echarts{
    width: 88%;
    height: 500px;
    margin-bottom: 30px;
  }

.table{
  z-index:0;
  padding-top: 3%;
}
</style>
