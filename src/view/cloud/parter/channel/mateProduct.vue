<template>
<!--匹配成功渠道列表-->
    <div>
    <Tabs value="1_1" tab="innerTable" type="card" :animated="false">
        <TabPane :label="productName +'的匹配产品'" name="1_1">
            <Table border :columns="mateHeader" :data="mateData">
                <template slot-scope="{ row, index }" slot="action">
                    <Button class="simple space" size="small" @click="detailProduct(row)">详情</Button>
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
      storeStationData: this.$store.state.station.stationData,
      productName: '某个渠道',
      mateHeader: [{
        title: '序号',
        type: 'index',
        align: 'center',
        width: 70
      }, {
        title: '产品名称',
        key: 'commodityName',
        align: 'center'
      }, {
        title: '剩余链接',
        key: 'num',
        align: 'center'
      }, {
        title: '商务',
        key: 'businessIdName',
        align: 'center'
      }, {
        title: '预收款项',
        key: 'advanceName',
        align: 'center'
      }, {
        title: '结算周期',
        key: 'cycleName',
        align: 'center'
      }, {
        title: '结算方式',
        key: 'settlementName',
        align: 'center'
      }, {
        title: '进价/比',
        key: 'inBid',
        align: 'center'
      }, {
        title: '建议出价/比',
        key: 'outBid',
        align: 'center'
      }, {
        title: '业务类型',
        key: 'settlementName',
        align: 'center'
      }, {
        title: '区域类型',
        key: 'regionName',
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
    this.productName = this.storeStationData.routeType.name
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
    detailProduct (row) {
      this.$router.push({
        name: 'detailProduct',
        query: {
          productCompanyId: row.productCompanyId
        }
      })
    }
  }
}
</script>

<style lang="" scoped>

</style>
