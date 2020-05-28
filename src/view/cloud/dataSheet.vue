<template>
  <!-- 这是数据表 -->
  <div class="cloudCooper">
    <Tabs value="name1" :animated="false" tab="outTable">
      <TabPane label="数据表" name="name1">
        <!-- 表头 -->
        <div class="tableHeader" style="float:right;margin-bottom:10px">
          <Input
            placeholder="产品编码"
            search
            style="width:200px;margin-right:5px;"
            v-model="headerSearch.text"
            @on-search="getListData()"
          />
          <Button icon="ios-loading" style="margin-right:5px;" @click="reloadPage"></Button>
          <TableHeaderSetting
            :totalTableHeader="totalTableHeader"
            :tableHeader.sync="tableHeader"
            key="cloudDayList"
            :defaultList="defaultList"
            localKey="cloudDayList"
            style="float: right;"
          ></TableHeaderSetting>
        </div>
        <div style="clear:both"></div>
        <!-- 表 -->
        <Table
          border
          :columns="tableHeader"
          :data="tableContent"
          :loading="loading"
          id="productLinkId"
        >
          <template slot-scope="{ row, index }" slot="action">
            <Button style="margin-right: 5px" @click="detail(row)">详情</Button>
          </template>
        </Table>
        <!-- 分页 -->
        <Page
          :total="headerSearch.totalCount"
          :page-size="headerSearch.pageSize"
          :current="headerSearch.currPage"
          size="small"
          show-total
          show-sizer
          show-elevator
          @on-change="(currPage)=>{headerSearch.currPage=currPage;getListData()}"
          @on-page-size-change="(pageSize)=>{headerSearch.pageSize=pageSize;getListData()}"
          style="float:right;color: #19aa8d;"
        />
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import { baseUrl, phpURL } from '@/api/base.js'
import moment from 'moment'
import TableHeaderSetting from '_c/table-header-setting'
export default {
  components: {
    TableHeaderSetting
  },
  data () {
    return {
      loading: true,
      incumbencyTbUser: [], // 在职人员
      tableHeader: [],
      defaultList: [
        'index',
        'productCod',
        'date',
        'enterPrice',
        'outerPrice',
        'shouldPay',
        'shouldGet',
        'profit',
        'business',
        'market',
        'areaType',
        'state',
        'action'
      ],
      // 表头搜索
      headerSearch: {
        text: '', // 全局搜索公司
        productCod: '', // 产品编码
        date: '', // 添加时间
        businessName: '', // 销售
        marketName: '', // 市场
        areaType: '', // 区域类型
        state: '', // 状态
        areaList: [], // 区域
        regionId: '', // 区域
        totalCount: 0,
        pageSize: 20,
        currPage: 1,
        status: '' // 状态
      },
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
          title: '产品编码',
          key: 'productCod',
          width: 110,
          alwaysShow: true,
          align: 'center',
          renderHeader: (h, params) => {
            return (
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
                  placeholder="输入产品编码"
                  v-model={this.headerSearch.productCod}
                  v-on:on-search={() => { this.getListData() }}
                />
                <Button
                  type="primary"
                  icon="md-search"
                  slot="content"
                  v-on:click={() => {
                    this.getListData()
                  }}
                ></Button>
                <Button
                  icon="md-close"
                  slot="content"
                  v-on:click={() => {
                    this.headerSearch.productCod = ''
                  }}
                ></Button>
              </Poptip>
            )
          }
        },
        {
          title: '添加时间',
          key: 'date',
          align: 'center',
          width: 110,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <i class="ivu-icon ivu-icon-ios-search" />
                  </span>
                  <div slot="content">
                    <div>
                      <DatePicker
                        v-on:on-ok={() => {
                          this.getListData()
                        }}
                        type="daterange"
                        v-model={this.headerSearch.date}
                        confirm
                        placement="bottom-start"
                        placeholder="输入时间"
                      />
                    </div>
                  </div>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '进价/比',
          key: 'enterPrice',
          align: 'center'
        },
        {
          title: '出价/比',
          key: 'outerPrice',
          align: 'center'
        },
        {
          title: '应付',
          key: 'shouldPay',
          align: 'center'
        },
        {
          title: '应收',
          key: 'shouldGet',
          align: 'center'
        },
        {
          title: '利润',
          key: 'profit',
          align: 'center'
        },
        {
          title: '商务',
          key: 'businessName',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <Poptip placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <i class="ivu-icon ivu-icon-ios-search" />
                </span>
                <Select
                  slot="content"
                  clearable
                  placeholder="请选择商务"
                  filterable
                  style="width:130px;height:33px"
                  v-on:on-change={() => {}}
                  v-model={this.headerSearch.businessName}
                >
                  {(this.incumbencyTbUser || []).map(person => {
                    return (
                      <Option value={person.nickname}>{person.nickname}</Option>
                    )
                  })}
                </Select>
                <Button
                  type="primary"
                  icon="md-search"
                  slot="content"
                  v-on:click={() => {
                    this.getListData()
                  }}
                ></Button>
                <Button
                  icon="md-close"
                  slot="content"
                  v-on:click={() => {
                    this.headerSearch.businessName = ''
                  }}
                ></Button>
              </Poptip>
            )
          }
        },
        {
          title: '市场',
          key: 'marketName',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <Poptip placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <i class="ivu-icon ivu-icon-ios-search" />
                </span>
                <Select
                  slot="content"
                  clearable
                  placeholder="请选择商务"
                  filterable
                  style="width:130px;height:33px"
                  v-on:on-change={() => {}}
                  v-model={this.headerSearch.marketName}
                >
                  {(this.incumbencyTbUser || []).map(person => {
                    return (
                      <Option value={person.nickname}>{person.nickname}</Option>
                    )
                  })}
                </Select>
                <Button
                  type="primary"
                  icon="md-search"
                  slot="content"
                  v-on:click={() => {
                    this.getListData()
                  }}
                ></Button>
                <Button
                  icon="md-close"
                  slot="content"
                  v-on:click={() => {
                    this.headerSearch.marketName = ''
                  }}
                ></Button>
              </Poptip>
            )
          }
        },
        {
          title: '区域类型',
          key: 'areaTypeName',
          align: 'center',
          width: 110,
          renderHeader: (h, params) => {
            return (
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
                  v-model={this.headerSearch.areaType}
                >
                  {(this.headerSearch.areaList || []).map(item => {
                    return <Option value={item.id}>{item.areaName}</Option>
                  })}
                </Select>
                <Button
                  type="primary"
                  icon="md-search"
                  slot="content"
                  v-on:click={() => {
                    this.getListData()
                  }}
                ></Button>
                <Button
                  icon="md-close"
                  slot="content"
                  v-on:click={() => {
                    this.headerSearch.regionId = ''
                  }}
                ></Button>
              </Poptip>
            )
          }
        },
        {
          title: '状态',
          key: 'stateName',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <Poptip placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <i class="ivu-icon ivu-icon-ios-search" />
                </span>
                <Select
                  slot="content"
                  clearable
                  placeholder="请选择状态"
                  style="width:130px"
                  v-on:on-change={() => {}}
                  v-model={this.headerSearch.state}
                >
                  {(this.statu || []).map(item => {
                    return <Option value={item.value}>{item.label}</Option>
                  })}
                </Select>
                <Button
                  type="primary"
                  icon="md-search"
                  slot="content"
                  v-on:click={() => {
                    this.getListData()
                  }}
                ></Button>
                <Button
                  icon="md-close"
                  slot="content"
                  v-on:click={() => {
                    this.headerSearch.state = ''
                  }}
                ></Button>
              </Poptip>
            )
          }
        },
        {
          title: '操作',
          slot: 'action',
          key: 'action',
          width: 100,
          align: 'center',
          alwaysShow: true
        }
      ],
      tableContent: [],
      // 获取状态
      statu: [
        {
          value: '1',
          label: '未启用'
        },
        {
          value: '2',
          label: '启用'
        },
        {
          value: '3',
          label: '暂停'
        },
        {
          value: '4',
          label: '停跑'
        }
      ]
    }
  },
  mounted () {
    this.getListData()
  },
  methods: {
    // 新增产品链接库
    addProcuctLink () {
      this.$router.push({
        name: 'addProduct'
      })
    },
    // 列表数据 搜索 分页

    getListData () {
      this.getData()
      // 列表数据
      let {
        productCod, // 产品编码
        date, // 日期
        profit, // 利润
        businessName, // 销售
        marketName, // 市场
        areaType, // 区域类型
        state, // 状态
        regionId,
        text,
        pageSize,
        currPage
      } = this.headerSearch
      let sendData = {}
      // 如果有模糊搜索，清空表头内容
      if (text) {
        sendData.text = text
        this.clearSearchHeader(text)
      } else {
        // 发送表头搜索内容
        sendData = {
          productCod, // 产品编码
          date, // 添加事件
          profit, // 利润
          businessName, // 销售
          marketName, // 市场
          areaType, // 区域类型
          state, // 状态
          regionId // 区域id
        }
      }
      if (date[0]) {
        sendData.startTime = moment(date[0]).format('YYYY-MM-DD')
        sendData.endTime = moment(date[1]).format('YYYY-MM-DD')
      }
      sendData.pageSize = pageSize
      sendData.currPage = currPage
      this.$axios({
        url: baseUrl + '/recommend/getInfoTabel',
        method: 'post',
        data: $qs.stringify(sendData, {
          indices: false
        })
      })
        .then(res => {
          // 查无数据
          if (res.data.code === 10001) {
            this.loading = false
            let _self = this.headerSearch
            this.tableContent = []
            _self.totalCount = 0
            _self.pageSize = 20
            _self.currPage = 1
          } else if (res.data.code === 10000) {
            let _self = this.headerSearch
            this.tableContent = res.data.content.pageContent
            _self.totalCount = res.data.content.totalCount
            _self.pageSize = res.data.content.pageSize
            _self.currPage = res.data.content.currPage
            this.loading = false
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 获取初始数据
    getData () {
      // 区域类型
      this.$axios({
        url: phpURL + '/cloud/areaList',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.headerSearch.areaList = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
      // 在职人员
      this.$axios({
        url: baseUrl + '/user/getIncumbencyTbUser',
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.incumbencyTbUser = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    clearSearchHeader (text) {
      this.headerSearch = {
        productCod: '', // 产品编码
        date: '', // 日期
        profit: '', // 利润
        businessName: '', // 销售
        marketName: '', // 市场
        areaType: '', // 区域类型
        stateName: '', // 状态
        text: text
      }
    },
    // 详情
    detail (row) {
      console.log(row.settlement)
      if (row.settlement === 1) {
        this.$router.push({
          name: 'detailSet',
          query: {
            id: row.id
          }
        })
      } else if (row.settlement === 2) {
        this.$router.push({
          name: 'detailPay',
          query: {
            id: row.id
          }
        })
      } else if (row.settlement === 3) {
        this.$router.push({
          name: 'detailKeep',
          query: {
            id: row.id
          }
        })
      } else if (row.settlement === 4) {
        this.$router.push({
          name: 'detailDevide',
          query: {
            id: row.id
          }
        })
      }
    },
    // 刷新
    reloadPage () {
      this.clearSearchHeader()
      this.getListData()
    }
  }
}
</script>
<style lang="less" scoped>
#productLinkId {
  .ivu-btn.ivu-btn-primary.ivu-btn-small {
    background-color: #fff;
  }
  .ivu-btn.ivu-btn-default.ivu-btn-small:hover {
    color: #19aa8d;
    background-color: #fff;
    border-color: #19aa8d;
  }
  .ivu-date-picker-cells-cell-selected em,
  .ivu-date-picker-cells-cell-selected:hover em {
    background: #19aa8d;
    color: #fff;
  }
  .ivu-date-picker-cells-focused em {
    box-shadow: 0 0 0 1px #19aa8d inset;
  }
  .ivu-date-picker-focused input {
    border-color: #19aa8d;
    outline: 0;
    box-shadow: none;
  }
}
</style>
