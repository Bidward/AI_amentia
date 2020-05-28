<template>
  <Row  class="rowPadding">
    <Col span="16" offset="4">
      <Table :columns="matchInfoColumn" :data="matchInfo.matchData" border></Table>
      <Page
      :total="matchInfo.matchTotalCount"
      :page-size="matchInfo.matchPageSize"
      :current="matchInfo.matchCurrPage" size="small" show-total show-sizer show-elevator
      @on-change="(currPage)=>{matchInfo.matchCurrPage=currPage;getMatchInfoData(matchInfo)}"
      @on-page-size-change="(pageSize)=>{matchInfo.matchPageSize=pageSize;getMatchInfoData(matchInfo)}"
      style="float:right;color: #19aa8d;" />
    </Col>
  </Row>
</template>
<script>
import { proBaseUrl } from '@/api/base.js'
export default {
  props: {
    matchInfoData: {
      type: Object,
      default: () => []
    }
  },
  data () {
    return {
      matchInfo: {
        productId: 0,
        matchData: [], // 匹配信息表格数据
        matchTotalCount: 30, // 页码总数
        matchPageSize: 20, // 每页条数
        matchCurrPage: 1// 当前页数
      },
      matchInfoColumn: [{
        title: '序号',
        type: 'index',
        width: 60,
        align: 'center'
      }, {
        title: '产品编码',
        key: 'productCode',
        align: 'center'
      }, {
        title: '产品链接',
        key: 'productLink',
        align: 'center'
      }, {
        title: '标签',
        key: 'label',
        align: 'center'
      }, {
        title: '上线渠道',
        key: 'channel',
        align: 'center'
      }, {
        title: '合作状态',
        key: 'cooperationState',
        align: 'center'
      }]
    }
  },
  watch: {
    // 深度监听父组件传过来的ID，否则异步，导致先执行getData，但是拿不到ID
    matchInfoData: {
      handler (newV) {
        if (newV.productInformation) {
          this.productId = newV.productInformation.id
          this.getMatchInfoData()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 请求后端接口获取匹配信息
    getMatchInfoData () {
      let sendData = {
        productId: this.productId,
        pageSize: this.matchInfo.matchPageSize,
        currentPage: this.matchInfo.matchCurrPage,
        canPass: this.$route.query.canPass === '未过白' || 0 ? '0' : '1'
      }
      this.$axios({
        url: proBaseUrl + '/product/getMatchingInfo',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.matchInfo.matchData = res.data.data.result
          this.matchInfo.matchTotalCount = res.data.data.count
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
