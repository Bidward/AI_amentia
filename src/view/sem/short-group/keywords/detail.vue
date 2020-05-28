<template>
  <div class="viewWrapper viewWrapperNoTabs public">
    <Form>
      <div class="section">
        <h3>基础信息</h3>
        <Row>
          <Col span="12">
            <FormItem label="添加日期">
              <h4>{{baseInfo.addTime}}</h4>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="账户名称">
              <h4>{{baseInfo.accountName}}</h4>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="推广计划">
              <h4>{{baseInfo.campaignName}}</h4>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="责任人">
              <h4>{{baseInfo.owner}}</h4>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="推广组">
              <h4>{{baseInfo.groupName}}</h4>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="关键词">
              <h4>{{baseInfo.keyword}}</h4>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="匹配方式">
              <h4>{{baseInfo.matchType}}</h4>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="创意">
              <h4>{{baseInfo.creative}}</h4>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="模板">
              <h4>{{baseInfo.showId}}</h4>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="状态">
              <h4>{{baseInfo.optStatus}}</h4>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="链接">
              <h4>{{baseInfo.destinationUrl}}</h4>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="渠道号">
              <h4>{{baseInfo.appid}}</h4>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="备注">
              <h4>{{baseInfo.sum}}</h4>
            </FormItem>
          </Col>
        </Row>
        <!-- <Button @click="drawLine">绘制</Button> -->
      </div>
      <div class="section" v-show="showCharts">
        <h3>数据趋势</h3>
        <div id="keywordCharts" :style="{width: pagePaddingWidth, height: '500px'}"></div>
      </div>
    </Form>
  </div>
</template>
<script>
import echarts from 'echarts'
import { semUrl } from '@/api/base.js'
import moment from 'moment'
export default {
  name: 'semKeywordDetail',
  data () {
    return {
      showCharts: false,
      baseInfo: {
        addTime: '', // 添加日期
        accountName: '', // 账户名称
        campaignName: '', // 推广计划
        owner: '', // 责任人
        groupName: '', // 推广组
        keyword: '', // 关键词
        matchType: '', // 匹配方式
        creative: '', // 创意
        showId: '', // 模板
        optStatus: '', // 状态
        destinationUrl: '', // 链接地址
        appid: '', // 渠道号
        sum: '' // 备注
      },
      option: {
        title: {
          text: '关键词走势图'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: []
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        dataZoom: [
          {
            startValue: moment().format('MM-01')
          },
          {
            type: 'inside'
          }
        ],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: [
          {
            name: '次数',
            type: 'value'
          },
          {
            name: '点击率',
            type: 'value',
            min: 0,
            max: 100,
            interval: 10,
            // max:100,
            axisLabel: {
              show: true,
              interval: 'auto', // 居中显示
              formatter: '{value} %' // 以百分比显示
            }
          }
        ],
        series: []
      }
    }
  },
  mounted () {
    this.setData()
  },
  methods: {
    drawLine () {
      let myChart = echarts.init(document.getElementById('keywordCharts'))
      myChart.setOption(this.option)
    },
    setData (routeChange = false) {
      let keywordId = this.$route.params.id
      this.$axios({
        url: semUrl + '/Keyword/detail',
        method: 'post',
        data: $qs.stringify({ keywordId })
      }).then(res => {
        this.baseInfo = res.data.data.keyword
        let list = res.data.data.list
        if (list.length < 1) {
          return false
        }
        // 标题
        let title = this.baseInfo.startHour

        let series = [
          {
            name: '展示量',
            type: 'line',
            smooth: true,
            data: []
          },
          { name: '点击', type: 'line', smooth: true, data: [] },
          { name: '安装', type: 'line', smooth: true, data: [] },
          {
            name: '点击率',
            type: 'line',
            smooth: true,
            data: []
          }
        ]
        // 纵坐标
        let legend = series.map(e => e.name)
        for (let i = 0; i < list.length; i++) {
          let views = list[i].views // 展现数
          let clicks = list[i].clicks // 点击数
          let setups = list[i].setups // 安装数
          let clickSetup = list[i].clickSetup // 点击率
          series[0].data.push(views)
          series[1].data.push(clicks)
          series[2].data.push(setups)
          series[3].data.push(clickSetup.replace('%', ''))
        }

        this.option.title.text = title
        this.option.xAxis.data = list.map(e => {
          return e.date + ' ' + e.hour + ':00'
        })
        this.option.legend.data = legend
        this.option.series = series
        this.drawLine()
        this.showCharts = true
      })
    }
  },
  computed: {
    pagePaddingWidth () {
      return document.documentElement.clientWidth - 600 + 'px'
    }
  }
  // watch: {
  //   $route (newV) {
  //     this.setData(true)
  //   }
  // }
}
</script>
<style lang="less" scoped>
@import './public.less';
</style>
