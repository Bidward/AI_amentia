<template>
    <div>
        <div class="level-three">
            <Button type="primary" @click="addProduct">新增</Button>
            <div class="searchbar">
                <Input v-model="headerSearch.text"  placeholder="搜索公司名" search  @on-search="getListData()" ></Input>
                <Button icon="ios-loading" @click="reloadPage"></Button>
            </div>
        </div>
        <Table :loading="loading" :columns="cooperHeader" :data="cooperContent" border>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" class="marginRight3px" @click="editProduct(row)">编辑</Button>
                <Button class="simple marginRight3px" size="small"  @click="detailProduct(row)">详情</Button>
                <Button type="error" size="small" @click="deleteProduct(row)">删除</Button>
            </template>
        </Table>
        <div class="tableFooter">
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
          />
        </div>
    </div>
</template>

<script>
import {
  phpURL,
  baseUrl
} from '@/api/base.js'
export default {
  name: 'productCon',
  data () {
    return {
      loading: true,
      // 在职人员
      // incumbencyTbUser: [],
      // 表头搜索
      headerSearch: {
        text: '', // 全局搜索公司
        companyName: '', // 公司名称姓名
        regionId: '', // 区域类型
        customType: '',
        customTypeList: [],
        areaList: [], // 区域列表数据
        businessUID: '', // 商务
        businessName: '', // 业务名称
        tle: '', // 联系电话
        totalCount: 0,
        pageSize: 20,
        currPage: 1
      },
      // 产品公司表头
      cooperHeader: [
        {
          title: '序号',
          type: 'index',
          align: 'center',
          width: 70
        }, {
          title: '公司名称/姓名',
          key: 'companyName',
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
                    placeholder="输入公司名称/姓名"
                    v-model={this.headerSearch.companyName}
                    v-on:on-search={() => { this.getListData() }}
                  />
                  <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
                  <Button icon="md-close" slot="content" v-on:click={() => { this.headerSearch.companyName = '' }}></Button>
                </Poptip>
              </span>
            )
          }
        }, {
          title: '客户等级',
          key: 'customeTypeName',
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
                    placeholder="请选择客户等级"
                    style="width:130px"
                    v-on:on-change={() => {}}
                    v-model={this.headerSearch.customType}
                  >
                    {(this.headerSearch.customTypeList || []).map(item => {
                      return <Option value={item.id}>{item.title}</Option>
                    })}
                  </Select>
                  <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
                  <Button icon="md-close" slot="content" v-on:click={() => { this.headerSearch.customType = '' }}></Button>
                </Poptip>
              </span>
            )
          }
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
                    v-model={this.headerSearch.regionId}
                  >
                    {(this.headerSearch.areaList || []).map(item => {
                      return <Option value={item.id}>{item.areaName}</Option>
                    })}
                  </Select>
                  <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
                  <Button icon="md-close" slot="content" v-on:click={() => { this.headerSearch.regionId = '' }}></Button>
                </Poptip>
              </span>
            )
          }
        }, {
          title: '商务',
          key: 'businessUName',
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
                    style="width:130px;height: 33px;"
                    v-on: on-change={() => {}}
                    v-model={this.headerSearch.businessUID}
                  >
                    {(this.incumbencyTbUser || []).map(person => {
                      return <Option value={person.id}>{person.nickname}</Option>
                    })}
                  </Select>
                  <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
                  <Button icon="md-close" slot="content" v-on:click={() => { this.headerSearch.businessUID = '' }}></Button>
                </Poptip>
              </span>
            )
          }
        }, {
          title: '业务名称',
          key: 'businessName',
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
                    placeholder="输入业务名称"
                    v-model={this.headerSearch.businessName}
                    v-on:on-search={() => { this.getListData() }}
                  />
                  <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
                  <Button icon="md-close" slot="content" v-on:click={() => { this.headerSearch.businessName = '' }}></Button>
                </Poptip>
              </span>
            )
          }
        }, {
          title: '联系电话',
          key: 'tle',
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
                    placeholder="请输入联系电话"
                    v-model={this.headerSearch.tle}
                    v-on:on-search={() => { this.getListData() }}
                  />
                  <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
                  <Button icon="md-close" slot="content" v-on:click={() => { this.headerSearch.tle = '' }}></Button>
                </Poptip>
              </span>
            )
          }
        }, {
          title: '操作',
          slot: 'action',
          width: 170,
          align: 'center'
        }
      ],
      // 产品公司表格数据
      cooperContent: []
    }
  },
  inject: ['app'],
  computed: {
    incumbencyTbUser () { // 在职人员
      return this.app.employees
    }
  },
  mounted () {
    this.getListData()
  },
  methods: {
    // 列表数据 搜索 分页
    getListData () {
      this.getData()
      // 列表数据
      let {
        companyName,
        regionId,
        customType,
        businessUID,
        businessName,
        tle,
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
          companyName,
          regionId,
          customType,
          businessUID,
          businessName,
          tle
        }
      }
      sendData.pageSize = pageSize
      sendData.currPage = currPage
      this.$axios({
        url: baseUrl + '/productCompany/find',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        // 查无数据
        if (res.data.code === 10001) {
          let _self = this.headerSearch
          this.cooperContent = []
          _self.totalCount = 0
          _self.pageSize = 20
          _self.currPage = 1
        } else if (res.data.code === 10000) {
          let _self = this.headerSearch
          this.cooperContent = res.data.content.pageContent
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
    // 获取初始数据
    getData () {
      // 客户等级
      this.$axios({
        url: phpURL + '/cloud/customerLevelList',
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          this.headerSearch.customTypeList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err.data)
      })

      // 区域类型
      this.$axios({
        url: phpURL + '/cloud/areaList',
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          this.headerSearch.areaList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err.data)
      })
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
    },
    // 新增产品公司
    addProduct () {
      this.$router.push({
        name: 'addProduct'
      })
    },
    // 编辑产品公司
    editProduct (row) {
      this.$router.push({
        name: 'editProduct',
        query: {
          productCompanyId: row.productCompanyId
        }
      })
    },
    // 产品公司详情页面
    detailProduct (row) {
      this.$router.push({
        name: 'detailProduct',
        query: {
          productCompanyId: row.productCompanyId
        }
      })
    },
    // 删除产品公司
    deleteProduct (row) {
      this.$router.push({
        name: 'detailProduct',
        query: {
          productCompanyId: row.productCompanyId,
          type: 'delete'
        }
      })
    },
    clearSearchHeader (text) {
      this.headerSearch = {
        companyName: '', // 公司名称姓名
        regionId: '', // 区域类型
        customType: '',
        businessUID: '', // 商务
        businessName: '', // 业务名称
        tle: '', // 联系电话
        text: text
      }
    },
    // 重载页面 清空所有所有条件 获取最新数据
    reloadPage () {
      this.clearSearchHeader()
      this.getListData()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
