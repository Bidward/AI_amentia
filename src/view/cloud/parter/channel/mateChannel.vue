<template>
<!--匹配成功渠道列表-->
    <div>
    <Tabs value="1_1" tab="innerTable" type="card" :animated="false">
        <TabPane :label="productName +'的匹配渠道'" name="1_1">
            <Table border :columns="mateHeader" :data="mateData">
                <template slot-scope="{ row, index }" slot="action">
                    <Button class="simple space" size="small" @click="detailChannel(row)">详情</Button>
                </template>
            </Table>
            <Page
                :total="totalCount"
                :page-size="searchData.pageSize"
                :current="searchData.currPage"
                size="small"
                show-total
                show-sizer
                show-elevator
                @on-change="(currPage)=>{searchData.currPage=currPage;getStationData()}"
                @on-page-size-change="(pageSize)=>{searchData.pageSize=pageSize;getStationData()}"
                style="float:right;color: #19aa8d;"
            />
        </TabPane>
    </Tabs>
    </div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
export default {
  name: 'mateChannel',
  data () {
    return {
      searchData: {
        pageSize: 20,
        currPage: 1
      },
      totalCount: 0,
      productName: '',
      storeStationData: this.$store.state.station.stationData,
      mateHeader: [{
        title: '序号',
        type: 'index',
        align: 'center',
        width: 70
      }, {
        title: '公司名称/姓名',
        key: 'channelName',
        align: 'center'
      }, {
        title: '市场',
        key: 'businessUName',
        align: 'center'
      }, {
        title: '类别',
        key: 'businessName',
        align: 'center'
      }, {
        title: '联系电话',
        key: 'tle',
        align: 'center'
      }, {
        title: '合同状态',
        key: 'contractStatusName',
        align: 'center'
      }, {
        title: '操作',
        slot: 'action',
        align: 'center'
      }],
      mateData: []
    }
  },
  mounted () {
    // console.log(this.$route.query.type)
    // this.productName = this.storeStationData.routeType.name
    this.getStationData()
  },
  methods: {
    getStationData () {
      let {
        currPage,
        pageSize
      } = this.searchData
      let sendData = {
        detailsRelationId: this.storeStationData.detailsRelationId,
        type: this.storeStationData.routeType.type
      }
      sendData.currPage = currPage
      sendData.pageSize = pageSize
      this.$axios({
        url: baseUrl + '/Commodity/getCommodityListTwo',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.mateData = res.data.content.pageContent
            this.pageSize = res.data.content.pageSize
            this.currPage = res.data.content.currPage
            this.totalCount = res.data.content.totalCount
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    detailChannel (row) {
      if (row.contractType === 1) {
        // 如果是收款
        this.$router.push({
          name: 'detailChannel',
          query: {
            productChannelId: row.productChannelId
          }
        })
      } else if (row.contractType === 2) {
        // 如果是付款
        this.$router.push({
          name: 'payDetailChannel',
          query: {
            productChannelId: row.productChannelId
          }
        })
      } else {
        this.$router.push({
          name: 'detailChannel',
          query: {
            productChannelId: row.productChannelId
          }
        })
      }
    }
  }
}
</script>

<style lang="" scoped>

</style>
