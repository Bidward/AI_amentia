<template>
<div>
  <!-- 这是产品库 -->
  <div class="level-three">
      <Button type="primary" @click="addProductBank">新增</Button>
      <div class="searchbar">
        <Input
            v-model="detailHeader.text"
            placeholder="输入销售、产品名称"
            search
            @on-search="getListData()"
        />
        <Button icon="ios-loading" @click="reload()"></Button>
        <TableHeaderSetting
            :totalTableHeader="totalTableHeader"
            :tableHeader.sync="tableHeader"
            key="productBankList"
            :defaultList="defaultList"
            localKey="productBankList"
        ></TableHeaderSetting>
      </div>
    </div>
    <div style="clear:both"></div>
    <!-- 表 -->
    <Table border :columns="tableHeader" :data="tableContent" :loading="loading">
    <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" class="marginRight3px" @click="editProduct(row)">编辑</Button>
        <Button size="small" class="marginRight3px" @click="showProduct(row)">详情</Button>
        <Button  type="error" size="small" @click="deleteProduct(row)">删除</Button>
    </template>
    </Table>
    <!-- 分页 -->
    <div class="tableFooter">
      <Page
          :total="detailHeader.totalCount"
          :page-size="detailHeader.pageSize"
          :current="detailHeader.currPage"
          size="small"
          show-total
          show-sizer
          show-elevator
          @on-change="(currPage)=>{detailHeader.currPage=currPage;getListData()}"
          @on-page-size-change="(pageSize)=>{detailHeader.pageSize=pageSize;getListData()}"
      />
    </div>
    <Modal :loading="deletLoading" v-model="deleteModal" title="提醒" @on-ok="deleteProductBank">
        <p>是否确认删除？请选择通知人</p>
        <div style="margin-top:10px;">
            <div style="float:left;margin-top:10px;">通知人：</div>
            <Select v-model="twoEntryId" filterable clearable  :label-in-value="true" style="width:200px;">
                <Option v-for="person in incumbencyTbUser" :key="person.id" :value="person.id" :label="person.nickname">
                    <div>
                        <p>{{person.nickname}}</p>
                        <p>部门：{{person.deptName}}</p>
                        <p>职位：{{person.positionName}}</p>
                    </div>
                </Option>
            </Select>
        </div>
    </Modal>
</div>
</div>
</template>

<script>
import { phpURL, baseUrl } from '@/api/base.js'
import TableHeaderSetting from '_c/table-header-setting'
// import Vue from 'vue'
import tabChangeClickMixins from '../../tabChangeClickMixins'

export default {
  components: {
    TableHeaderSetting
  },
  name: 'productBankCon',
  mixins: [tabChangeClickMixins],
  data () {
    return {
      deleteModal: false,
      deletLoading: false,
      twoEntryId: '',
      deletId: '',
      // incumbencyTbUser: [],
      loading: false,
      tableHeader: [],
      defaultList: [
        'index',
        'commodityName',
        'num',
        'businessIdName',
        'advance',
        'cycleName',
        'settlementName',
        'inBid',
        'outBid',
        'regionName',
        'advanceName'
      ],
      totalTableHeader: [
        {
          title: '序号',
          key: 'index',
          width: 70,
          type: 'index',
          align: 'center',
          alwaysShow: true
        },
        {
          title: '产品名称',
          key: 'commodityName',
          alwaysShow: true,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <i class="ivu-icon ivu-icon-ios-search" />
                  </span>
                  <Input
                    clearable
                    search
                    slot="content"
                    style="width:130px"
                    placeholder="输入产品名称"
                    v-model={this.detailHeader.commodityName}
                    v-on:on-search={() => { this.getListData() }}
                  />
                  <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
                  <Button icon="md-close" slot="content" v-on:click={() => { this.detailHeader.commodityName = '' }}></Button>
                </Poptip>
              </span>
            )
          }
        }, {
          title: '剩余链接',
          key: 'num',
          align: 'center'
        }, {
          title: '商务',
          key: 'businessIdName',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <i class="ivu-icon ivu-icon-ios-search" />
                  </span>
                  <Select
                    slot="content"
                    clearable
                    filterable
                    placeholder="请选择商务"
                    style="width:130px"
                    v-on: on-change={() => {}}
                    v-model={this.detailHeader.businessId}
                  >
                    {(this.incumbencyTbUser || []).map(person => {
                      return <Option value={person.id}>{person.nickname}</Option>
                    })}
                  </Select>
                  <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
                  <Button icon="md-close" slot="content" v-on:click={() => { this.detailHeader.businessId = '' }}></Button>
                </Poptip>
              </span>
            )
          }
        }, {
          title: '预收款项',
          key: 'advanceName',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <i class="ivu-icon ivu-icon-ios-search" />
                  </span>
                  <Select
                    slot="content"
                    clearable
                    placeholder="请选择预收款项"
                    style="width:130px"
                    v-on: on-change={() => {}}
                    v-model={this.detailHeader.advance}
                  >
                    {(this.detailHeader.advancePayList || []).map(person => {
                      return <Option value={person.id}>{person.name}</Option>
                    })}
                  </Select>
                  <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
                  <Button icon="md-close" slot="content" v-on:click={() => { this.detailHeader.advance = '' }}></Button>
                </Poptip>
              </span>
            )
          }
        }, {
          title: '结算周期',
          key: 'cycleName',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <i class="ivu-icon ivu-icon-ios-search" />
                  </span>
                  <Select
                    slot="content"
                    clearable
                    placeholder="请选择结算周期"
                    style="width:130px"
                    v-on: on-change={() => {}}
                    v-model={this.detailHeader.cycle}
                  >
                    {(this.detailHeader.cycleList || []).map(person => {
                      return <Option value={person.id}>{person.name}</Option>
                    })}
                  </Select>
                  <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
                  <Button icon="md-close" slot="content" v-on:click={() => { this.detailHeader.cycle = '' }}></Button>
                </Poptip>
              </span>
            )
          }
        }, {
          title: '结算方式',
          key: 'settlementName',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <i class="ivu-icon ivu-icon-ios-search" />
                  </span>
                  <Select
                    slot="content"
                    clearable
                    placeholder="请选择结算方式"
                    style="width:130px"
                    v-on: on-change={() => {}}
                    v-model={this.detailHeader.settlement}
                  >
                    {(this.detailHeader.settlementList || []).map(person => {
                      return <Option value={person.id}>{person.name}</Option>
                    })}
                  </Select>
                  <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
                  <Button icon="md-close" slot="content" v-on:click={() => { this.detailHeader.settlement = '' }}></Button>
                </Poptip>
              </span>
            )
          }
        }, {
          title: '进价/比',
          key: 'inBid',
          align: 'center'
        }, {
          title: '建议出价/比',
          key: 'outBid',
          align: 'center'
        }, {
          title: '区域类型',
          key: 'regionName',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <i class="ivu-icon ivu-icon-ios-search" />
                  </span>
                  <Select
                    slot="content"
                    clearable
                    placeholder="请选择区域类型"
                    style="width:130px"
                    v-on:on-change={() => {}}
                    v-model={this.detailHeader.regionId}
                  >
                    {(this.detailHeader.areaList || []).map(item => {
                      return <Option value={item.id}>{item.areaName}</Option>
                    })}
                  </Select>
                  <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
                  <Button icon="md-close" slot="content" v-on:click={() => { this.detailHeader.regionId = '' }}></Button>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '操作',
          slot: 'action',
          key: 'action',
          width: 170,
          align: 'center',
          alwaysShow: true
        }
      ],
      // 列表数据
      tableContent: [],
      detailHeader: {
        text: '',
        totalCount: 0,
        pageSize: 20,
        currPage: 1,
        commodityName: '', // 产品名称
        num: '', // 剩余链接
        businessId: '', // 商务
        businessIdName: '', // 商务名称
        advance: '', // 预收款项
        advancePayList: [{// 预收款项list
          id: '1',
          name: '有'
        }, {
          id: '2',
          name: '无'
        }],
        cycle: '', // 结算周期
        cycleList: [
          {
            id: '1',
            name: '单周'
          }, {
            id: '2',
            name: '双周'
          }, {
            id: '3',
            name: '月'
          }
        ], // 结算周期list
        settlement: '', // 结算方式
        settlementList: [
          {
            id: '1',
            name: '安装(CPA)'
          }, {
            id: '2',
            name: '充值(CPA+CPS)'
          }, {
            id: '3',
            name: '留存(CPL)'
          }, {
            id: '4',
            name: '分成(CPS)'
          }, {
            id: '5',
            name: '点击(CPC)'
          }, {
            id: '6',
            name: '包月(CPT)'
          }
        ], // 结算方式list
        regionId: '', // 区域类型
        areaList: []// 区域类型list
      }
    }
  },
  inject: ['app'],
  computed: {
    incumbencyTbUser () { // 在职人员
      return this.app.employees
    }
  },
  mounted () {
    // 如果从产品详情页面回到产品库，则保留上次商务筛选条件
    if (sessionStorage.businessId) {
      this.detailHeader.businessId = sessionStorage.businessID
    }
    this.getData()
    this.getListData()
  },
  methods: {
    handleClick (name) {
      // Vue.tabChangeClick(name)
      this.tabChangeClick(name)
    },
    getData () {
      // 在职人员
      // this.$axios({
      //   url: baseUrl + '/user/getIncumbencyTbUser',
      //   method: 'post'
      // }).then(res => {
      //   if (res.data.code === 10000) {
      //     this.incumbencyTbUser = res.data.content
      //   } else {
      //     this.$Message.error(res.data.msg)
      //   }
      // }).catch(err => {
      //   console.error(err)
      // })
      // 区域类型
      this.$axios({
        url: phpURL + '/cloud/areaList',
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          this.detailHeader.areaList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err.data)
      })
    },
    // 获取列表数据
    getListData () {
      let {
        commodityName, // 产品名称
        businessId, // 商务
        businessIdName, // 商务名称
        advance, // 预收款项
        cycle, // 结算周期
        settlement, // 结算方式
        regionId, // 区域类型
        text,
        pageSize,
        currPage
      } = this.detailHeader
      let sendData = {}
      // 如果有模糊搜索，清空表头内容
      if (text) {
        sendData.text = text
        this.clearSearchHeader(text)
      } else {
        // 发送表头搜索内容
        sendData = {
          commodityName, // 产品名称
          businessId, // 商务
          businessIdName, // 商务名称
          advance, // 预收款项
          cycle, // 结算周期
          settlement, // 结算方式
          regionId // 区域类型
        }
      }
      sessionStorage.setItem('businessId', sendData.businessId)
      sendData.pageSize = pageSize
      sendData.currPage = currPage
      this.$axios({
        url: baseUrl + '/Commodity/getCommodityList',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        // 查无数据
        if (res.data.code === 10001) {
          let _self = this.detailHeader
          this.tableContent = []
          _self.totalCount = 0
          _self.pageSize = 20
          _self.currPage = 1
        } else if (res.data.code === 10000) {
          let _self = this.detailHeader
          this.tableContent = res.data.content.pageContent
          _self.totalCount = res.data.content.totalCount
          _self.pageSize = res.data.content.pageSize
          _self.currPage = res.data.content.currPage
          this.loading = false
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    clearSearchHeader (text) {
      this.detailHeader = {
        commodityName: '', // 产品名称
        businessId: '', // 商务
        businessIdName: '', // 商务名称
        advance: '', // 预收款项
        cycle: '', // 结算周期
        settlement: '', // 结算方式
        regionId: '', // 区域类型
        text: text
      }
    },
    reload () {
      this.detailHeader.cycleList = [{
        id: '1',
        name: '单周'
      }, {
        id: '2',
        name: '双周'
      }, {
        id: '3',
        name: '月'
      }]
      this.detailHeader.advancePayList = [{// 预收款项list
        id: '1',
        name: '有'
      }, {
        id: '2',
        name: '无'
      }]
      this.detailHeader.cycleList = [
        {
          id: '1',
          name: '单周'
        }, {
          id: '2',
          name: '双周'
        }, {
          id: '3',
          name: '月'
        }
      ] // 结算周期list

      this.detailHeader.settlementList = [
        {
          id: '1',
          name: '安装'
        }, {
          id: '2',
          name: '充值'
        }, {
          id: '3',
          name: '留存'
        }, {
          id: '4',
          name: '分成'
        }
      ]// 结算方式list
      this.clearSearchHeader()
      this.getData()
      this.getListData()
    },
    // 新增
    addProductBank (row) {
      this.$router.push({
        name: 'addProductBank'
      })
    },
    // 编辑
    editProduct (row) {
      this.$axios({
        url: baseUrl + '/Commodity/getCountCommodity',
        method: 'post',
        data: $qs.stringify({ commodityId: row.id })
      }).then(res => {
        if (res.data.code === 10000) {
          this.$router.push({
            name: 'editProduckBank',
            query: {
              commodityId: row.id
            }
          })
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 详情
    showProduct (row) {
      this.$router.push({
        name: 'detailProduct',
        query: {
          productCompanyId: row.productCompanyId
        }
      })
    },
    // 删除
    deleteProduct (row) {
      this.deletId = row.id
      this.deleteModal = true
    },
    deleteProductBank () {
      let sendData = {
        commodityId: this.deletId,
        twoEntryId: this.twoEntryId,
        route: 'waitSureProductBanckCon'
      }
      if (this.twoEntryId !== '') {
        this.$axios({
          url: baseUrl + '/Commodity/deleteCommodity',
          method: 'post',
          data: $qs.stringify(sendData)
        }).then(res => {
          if (res.data.code === 10000) {
            this.$Message.info(res.data.msg)
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.error(err)
        })
      } else {
        this.$Message.error('通知人必选，请选择通知人后删除')
        this.deletLoading = false
        this.$nextTick(() => {
          this.deletLoading = true
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
