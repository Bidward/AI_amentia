<template>
  <Row  class="rowPadding">
    <Col span="16" offset="4">
      <Table :columns="matchInfoColumn" :data="matchInfo.matchData" border></Table>
      <Page
      :total="matchInfo.matchTotalCount"
      :page-size="matchInfo.matchPageSize"
      :current="matchInfo.matchCurrPage" size="small" show-total show-sizer show-elevator
      @on-change="(currPage)=>{matchInfo.matchCurrPage=currPage;getData(matchInfo)}"
      @on-page-size-change="(pageSize)=>{matchInfo.matchPageSize=pageSize;getData(matchInfo)}"
      style="float:right;color: #19aa8d;" />
    </Col>
  </Row>
</template>
<script>
export default {
  data () {
    return {
      matchInfo: [{
        matchData: [], // 匹配信息表格数据
        matchTotalCount: 100, // 页码总数
        matchPageSize: 10, // 每页条数
        matchCurrPage: 1// 当前页数
      }],
      matchInfoColumn: [{
        title: '序号',
        type: 'index',
        width: 60,
        align: 'center'
      }, {
        title: '产品编码',
        key: 'softcode',
        align: 'center'
      }, {
        title: '产品链接',
        key: 'productLinks',
        align: 'center'
      }, {
        title: '标签',
        key: 'channelLabel',
        align: 'center'
      }, {
        title: '上线渠道',
        key: 'channelName',
        align: 'center'
      }, {
        title: '合作状态',
        key: 'cooperationstate',
        align: 'center'
      }]
    }
  },
  methods: {
    // 请求后端接口获取匹配信息
    getData (item = {}) {

    }
  }
}
</script>
