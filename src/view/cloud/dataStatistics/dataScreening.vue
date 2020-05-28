<template>
  <!-- 这是数据表 -->
  <div class="cloudCooper">
    <Tabs value="name1" :animated="false" tab="outTable">
      <TabPane label="数据总览" name="name1">
        <!-- select选择 -->
        <div class="list">
            <DatePicker @on-change="dataChange" v-model="date" separator="至" :value="date" format="yyyy-MM-dd" type="daterange" placement="bottom" placeholder="Select date" style="width:20%"></DatePicker>
            <Select v-model="productCompany" style="width:16%" placeholder="请选择产品公司" @on-change="getProduct">
                <Option v-for="item in ProductCompanyList" :value="item.productCompanyId" :key="item.productCompanyId" >{{ item.companyName}}</Option>
            </Select>
            <Select v-model="product" style="width:16%" placeholder="请选择产品" @on-change="productChange">
                <Option v-for="item in productList" :value="item.id" :key="item.id" >{{ item.companyName  }}</Option>
            </Select>
            <Select v-model="channel" style="width:18%" placeholder="请选择渠道公司" @on-change="channelChange">
                <Option v-for="item in channelList" :value="item.productChannelId" :key="item.productChannelId" >{{ item.channelName }}</Option>
            </Select>
            <Select v-model="businessMarketing" style="width:16%" placeholder="请选择商务或市场" @on-change="businessChange">
                <Option v-for="item in businessMarketingList" :value="item.id" :key="item.id" >{{ item.nickname }}</Option>
            </Select>
            <Button @click="reselt">重置</Button>
        </div>
        <!-- 图形表 -->
        <div class="productData" v-if="proChannelBtn">
          <Col span="8">
            <Button type="default" v-if="productData" @click="productDataBtn" >产品数据</Button>
            <Button type="primary" v-else  @click="productDataBtn" >产品数据</Button>
            <Button type="default" v-if="channelData" @click="channelDataBtn">渠道数据</Button>
            <Button type="primary" v-else @click="channelDataBtn">渠道数据</Button>
          </Col>
        </div>
        <DefaultTab v-if="DefaultTab"  :toChild="date"></DefaultTab>
        <ProductTab v-if="ProductTab"  :toDate="date" :toProducntId="producntId"></ProductTab>
        <ProductCompanyTab v-if="ProductCompanyTab" :toCompanyId="companyId"  :toDate="date"></ProductCompanyTab>
        <ChannelTab v-if="ChannelTab"  :toDate="date" :toChannelId="channelId"></ChannelTab>
        <BusinessProductTab v-if="BusinessProductTab" :toDate="date" :toBusinessUserId="businessUserId"></BusinessProductTab>
        <BusinessChannelTab v-if="BusinessChannelTab" :toDate="date" :toBusinessUserId="businessUserId"></BusinessChannelTab>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import Vue from 'vue'
import Echarts from 'vue-echarts'
import echarts from 'echarts'
import { baseUrl, phpURL } from '@/api/base.js'
import TableHeaderSetting from '_c/table-header-setting'
import DefaultTab from './dataTable/defaultTab'
import ProductTab from './dataTable/productTab'
import ProductCompanyTab from './dataTable/productCompanyTab'
import ChannelTab from './dataTable/channelTab'
import BusinessProductTab from './dataTable/businessProductTab'
import BusinessChannelTab from './dataTable/businessChannelTab'
Vue.component('chart', Echarts)
Vue.prototype.$echarts = echarts
export default {
  components: {
    TableHeaderSetting,
    DefaultTab,
    ProductTab,
    ProductCompanyTab,
    ChannelTab,
    BusinessProductTab,
    BusinessChannelTab
  },
  data () {
    return {
      proChannelBtn: false, // 产品和渠道的按钮
      companyId: '', // 产品公司ID
      producntId: '', // 产品ID
      channelId: '', // 渠道公司ID
      businessUserId: '', // 市场人员ID
      // times:'',//定时器
      // loading: true,
      incumbencyTbUser: [], // 在职人员
      // tableContent: [],
      productData: false, // 产品数据按钮
      channelData: true, // 渠道数据按钮
      DefaultTab: true, // 数据总览组件
      ProductTab: false, // 产品组件
      ProductCompanyTab: false, // 产品公司组件
      ChannelTab: false, // 渠道公司组件
      BusinessProductTab: false, // 商务筛选-产品数据组件
      BusinessChannelTab: false, // 商务筛选-渠道数据组件
      endTime: '', // 结束时间
      startTime: '', // 开始时间
      date: [], // 日期
      productCompany: '', // 产品公司
      product: '', // 产品
      channel: '', // 渠道
      businessMarketing: '', // 市场/个人
      ProductCompanyList: [], // 产品公司列表
      productList: [], // 产品列表
      channelList: [], // 渠道公司列表
      businessMarketingList: [] // 商务或市场列表
    }
  },
  beforeMount () {
    this.getData() // 获取时间方法
    this.getProductCompanyName() // 获取产品公司名称方法
    this.getchannel() // 获取渠道公司方法
    this.getBusiness()// 获取商务市场列表方法
  },
  methods: {
    getData () { // 获取当前一个月的时间段
      this.endTime = new Date()
      this.startTime = new Date(this.endTime.getTime() - 31 * 24 * 3600 * 1000)
      this.date = [this.startTime, this.endTime]
    },
    // 获取产品公司列表
    getProductCompanyName () {
      this.$axios({
        url: phpURL + '/cloud/getAllProductCompanies',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.ProductCompanyList = res.data.content
        }
      })
    },
    // 根据产品公司名称获取对应的产品
    getProduct (ids) {
      if (this.productCompany !== undefined) {
        this.ProductCompanyTab = true
        this.companyId = ids
        if (this.ProductCompanyTab === true) { // 当产品公司进行切换时,重新加载组件获取数据
          this.product = ''
          this.businessMarketing = ''
          this.channel = ''
          this.proChannelBtn = false
          this.shutdownTab()
          this.$nextTick(function () {
            this.ProductCompanyTab = true
          })
        }
        let sendData = {
          companyId: this.companyId // 真是ID
          // companyId:'1' //测试Id
        }
        // 产品列表
        this.$axios({
          url: baseUrl + '/Commodity/getCommodityByCompany',
          method: 'post',
          data: $qs.stringify(sendData)
        }).then(res => {
          console.log(res)
          if (res.data.code === 10000) {
            this.productList = res.data.content
          }
        })
      }
    },
    // 获取渠道公司列表
    getchannel () {
      this.$axios({
        url: phpURL + '/cloud/getAllChannelCompanies',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.channelList = res.data.content
        }
      })
    },
    // 获取商务列表
    getBusiness () {
      this.$axios({
        url: baseUrl + '/bzCloudData/getBusinessNameAndId',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.businessMarketingList = res.data.content
        }
      })
    },
    dataChange () { // 当日期发生变化
      // 如果是在默认页面,则重新加载请求接口获取最新日期数据
      if (this.DefaultTab === true) {
        this.shutdownTab()
        this.$nextTick(function () {
          this.DefaultTab = true
        })
        // 如果是在产品公司页面,则重新加载请求接口获取最新日期数据
      } else if (this.ProductCompanyTab === true) {
        this.shutdownTab()
        this.$nextTick(function () {
          this.ProductCompanyTab = true
        })
        // 如果是在产品页面,则重新加载请求接口获取最新日期数据
      } else if (this.ProductTab === true) {
        this.shutdownTab()
        this.$nextTick(function () {
          this.ProductTab = true
        })
      // 如果是在渠道公司页面,则重新加载请求接口获取最新日期数据
      } else if (this.ChannelTab === true) {
        this.shutdownTab()
        this.$nextTick(function () {
          this.ChannelTab = true
        })
      // 如果是在市场-产品数据页面,则重新加载请求接口获取最新日期数据
      } else if (this.BusinessProductTab === true) {
        this.shutdownTab()
        this.$nextTick(function () {
          this.BusinessProductTab = true
        })
      // 如果是在市场-渠道数据页面,则重新加载请求接口获取最新日期数据
      } else {
        this.shutdownTab()
        this.$nextTick(function () {
          this.BusinessChannelTab = true
        })
      }
    },
    // 关闭所有图表组件
    shutdownTab () {
      this.DefaultTab = false
      this.ProductCompanyTab = false
      this.ProductTab = false
      this.ChannelTab = false
      this.BusinessProductTab = false
      this.BusinessChannelTab = false
    },
    // 选中产品,产品图表展示
    productChange (ids) {
      if (this.product !== undefined) {
        this.producntId = ids
        this.shutdownTab()
        this.$nextTick(function () {
          this.ProductTab = true
        })
      } else {
        this.productList = []
      }
    },
    channelChange (ids) { // 渠道公司选中后,展示渠道公司数据
      if (this.channel !== undefined) {
        this.channelId = ids
        this.proChannelBtn = false
        this.shutdownTab()
        this.productCompany = ''
        this.product = ''
        this.businessMarketing = ''
        this.$nextTick(function () {
          this.ChannelTab = true
        })
      }
    },
    businessChange (ids) { // 市场或销售选择后,展示产品数据
      if (this.businessMarketing !== undefined) {
        this.businessUserId = ids
        this.productCompany = ''
        this.product = ''
        this.channel = ''
        this.productData = false
        this.channelData = true
        this.shutdownTab()
        this.$nextTick(function () {
          this.proChannelBtn = true
          this.BusinessProductTab = true
        })
      }
    },
    reselt () { // 重置按钮事件,清除select框内容,关闭之前组件,打开默认展示数据总览组件
      this.productCompany = ''
      this.product = ''
      this.channel = ''
      this.businessMarketing = ''
      this.proChannelBtn = false
      this.shutdownTab()
      this.$nextTick(function () {
        this.DefaultTab = true
      })
      this.getData()
    },
    productDataBtn () { // 产品数据按钮事件
      this.channelData = true // 渠道数据按钮变成默认
      this.productData = false // 产品数据按钮变成绿色
      this.BusinessProductTab = true // 开启产品数据组件
      this.BusinessChannelTab = false // 关闭渠道数据组件
    },
    channelDataBtn () { // 渠道数据按钮事件
      this.channelData = false // 渠道数据按钮变成绿色
      this.productData = true // 产品数据按钮变成默认
      this.BusinessProductTab = false // 关闭产品数据组件
      this.BusinessChannelTab = true // 开启渠道数据组件
    }
  }
}
</script>
<style lang="less" scoped>
.list{
    width: 80%;
    margin-left: 10%;
    display: flex;
    justify-content: space-between;
}
.productData{
  margin: 3% 0 0 10%;
  padding-bottom:3%;
}
</style>
