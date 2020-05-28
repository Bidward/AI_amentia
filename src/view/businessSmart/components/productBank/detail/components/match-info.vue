<template>
  <!-- 匹配信息 -->
  <div class="detailContent">
    <Row  class="rowPadding">
      <Col span="16" offset="3">
        <Table border :columns="matchInfoHeader" :data="matchData">
        </Table>
          <Page
          :total="matchInfo.matchTotalCount"
          :page-size="matchInfo.matchPageSize"
          :current="matchInfo.matchCurrPage" size="small" show-total show-sizer show-elevator
          @on-change="(currPage)=>{matchInfo.matchCurrPage=currPage;getMatchInfoData(matchInfo)}"
          @on-page-size-change="(pageSize)=>{matchInfo.matchPageSize=pageSize;getMatchInfoData(matchInfo)}"
          style="float:right;color: #19aa8d;" />

      </Col>
    </Row>
  </div>
</template>
<script>
import { proBaseUrl } from '@/api/base.js'
export default {
  props: {
    productId: {
      type: Number,
      default: () => 0
    }
  },
  data () {
    return {
      matchInfoHeader: [
        {
          title: '序号',
          key: 'Num',
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
        }
        //  {
        //   title: '操作',
        //   slot: 'action',
        //   width: 160,
        //   align: 'center'
        // }
      ],
      matchData: [],
      matchInfo: {
        // 匹配信息表格数据
        productId: 0,
        matchTotalCount: 100, // 页码总数
        matchPageSize: 10, // 每页条数
        matchCurrPage: 1// 当前页数
      }
    }
  },
  watch: {
    productId (newV) {
      if (newV) {
        this.productId = newV
        this.getMatchInfoData()
      }
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
          this.matchData = res.data.data.result
          this.matchInfo.matchTotalCount = res.data.data.count
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.info{
  color: #ccc;
  margin-left: 20px;
}
.addContract{
  color:#19aa8d;
  cursor: pointer;
  margin-bottom: 5px;
}
</style>
