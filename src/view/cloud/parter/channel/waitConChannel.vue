<template>
<div class="viewWrapper">
    <Tabs name="0" value="2"  @on-click="handleClick" :animated="false" class="level-one">
        <TabPane tab="0" label="产品公司" name="1"></TabPane>
        <TabPane tab="0" label="渠道公司" name="2" >
            <Tabs name="1" value="1_2" @on-click="handleInnerClick" type="card"  class="level-two" :animated="false">
                <TabPane tab="1" label="渠道公司" name="1_1">
                </TabPane>
                <TabPane tab="1" label="待确认渠道公司" name="1_2">
                    <div class="level-three">
                        <div class="searchbar">
                            <Input v-model="headerSearch.text"  placeholder="搜索公司名" search @on-search="getListData()"></Input>
                            <Button icon="ios-loading" @click="reloadPage"></Button>
                        </div>
                    </div>
                    <Table :loading="loading" :columns="waitCooperHeader" :data="waitCooperContent" border >
                        <template slot-scope="{ row, index }" slot="action">
                            <Button v-if="row.enable" type="primary" size="small"  class="marginRight3px" @click="editChannel(row)">启用</Button>
                            <Button v-if="row.update" type="primary" size="small"  class="marginRight3px" @click="editChannel(row)">编辑</Button>
                            <Button v-if="row.revoke" class="simple marginRight3px" size="small"  @click="revokeChannel(row)">撤销</Button>
                            <Button v-if="row.delete" type="error" @click="deleteChannel(row)"  size="small">删除</Button>
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
                </TabPane>
            </Tabs>
        </TabPane>
        <TabPane tab="0" label="合同库" name="3"></TabPane>
        <TabPane tab="0" label="产品库" name="4"></TabPane>
        <TabPane tab="0" label="产品链接库" name="5"></TabPane>
        <TabPane tab="0" label="待审核信息" name="6"></TabPane>
    </Tabs>
</div>

</template>

<script>
import {
  phpURL,
  baseUrl
} from '@/api/base.js'
// import Vue from 'vue'
import tabChangeClickMixins from '../../tabChangeClickMixins'
export default {
  name: 'waitConProduct',
  mixins: [tabChangeClickMixins],
  data () {
    return {
      loading: true,
      // 在职人员
      incumbencyTbUser: [],
      // 表头搜索
      headerSearch: {
        meanId: 2, // 菜单id 2表示渠道公司
        text: '', // 全局搜索公司
        productCompanyName: '', // 公司名称姓名
        oneEntryId: '', // 发起人id
        twoEntryId: '', // 通知人id
        status: '',
        totalCount: 0,
        pageSize: 20,
        currPage: 1
      },
      statusList: [{
        value: 1,
        label: '待二次录入'
      }, {
        value: 2,
        label: '待二次编辑'
      }, {
        value: 3,
        label: '两次信息不一致'
      }, {
        value: 4,
        label: '待二次删除'
      }, {
        value: 5,
        label: '待二次启用'
      }, {
        value: 6,
        label: '完成'
      }, {
        value: 7,
        label: '撤回'
      }
      ],
      // 产品公司表头
      waitCooperHeader: [
        {
          title: '序号',
          type: 'index',
          align: 'center',
          width: 70
        }, {
          title: '公司名称/姓名',
          key: 'productCompanyName',
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
                    v-model={this.headerSearch.productCompanyName}
                    v-on:on-search={() => { this.getListData() }}
                  />
                  <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
                  <Button icon="md-close" slot="content" v-on:click={() => { this.headerSearch.productCompanyName = '' }}></Button>
                </Poptip>
              </span>
            )
          }
        }, {
          title: '发起人',
          key: 'oneEntryName',
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
                    placeholder="请选择发起人"
                    style="width:130px;height: 33px;"
                    v-on: on-change={() => {}}
                    v-model={this.headerSearch.oneEntryId}
                  >
                    {(this.incumbencyTbUser || []).map(person => {
                      return (
                        <Option
                          value={person.id}
                          label={person.nickname}
                          key={person.id}
                        >
                          <div>
                            <div>{person.nickname}</div>
                            <div style="font-weight: normal;">
                              <span>部门:</span>
                              <span>{person.deptName}</span>
                            </div>
                            <div style="font-weight: normal;">
                              <span>职位:</span>
                              <span>
                                {person.positionName && person.positionName}
                              </span>
                            </div>
                          </div>
                        </Option>
                      )
                    })}
                  </Select>
                  <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
                  <Button icon="md-close" slot="content" v-on:click={() => { this.headerSearch.oneEntryId = '' }}></Button>
                </Poptip>
              </span>
            )
          }
        }, {
          title: '通知人',
          key: 'twoEntryName',
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
                    placeholder="请选择通知人"
                    style="width:130px;height: 33px;"
                    v-on: on-change={() => {}}
                    v-model={this.headerSearch.twoEntryId}
                  >
                    {(this.incumbencyTbUser || []).map(person => {
                      return (
                        <Option
                          value={person.id}
                          label={person.nickname}
                          key={person.id}
                        >
                          <div>
                            <div>{person.nickname}</div>
                            <div style="font-weight: normal;">
                              <span>部门:</span>
                              <span>{person.deptName}</span>
                            </div>
                            <div style="font-weight: normal;">
                              <span>职位:</span>
                              <span>
                                {person.positionName && person.positionName}
                              </span>
                            </div>
                          </div>
                        </Option>
                      )
                    })}
                  </Select>
                  <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
                  <Button icon="md-close" slot="content" v-on:click={() => { this.headerSearch.twoEntryId = '' }}></Button>
                </Poptip>
              </span>
            )
          }
        }, {
          title: '状态',
          key: 'statusName',
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
                    placeholder="请选择状态"
                    style="width:130px;height: 33px;"
                    v-on: on-change={() => {}}
                    v-model={this.headerSearch.status}
                  >
                    {(this.statusList || []).map(item => {
                      return <Option value={item.value}>{item.label}</Option>
                    })}
                  </Select>
                  <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
                  <Button icon="md-close" slot="content" v-on:click={() => { this.headerSearch.status = '' }}></Button>
                </Poptip>
              </span>
            )
          }
        }, {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      // 产品公司表格数据
      waitCooperContent: []
    }
  },
  mounted () {
    this.getListData()
  },
  methods: {
    handleClick (name) {
      // Vue.tabChangeClick(name)
      this.tabChangeClick(name)
    },
    handleInnerClick (name) {
      switch (name) {
        case '1_1':
          this.$router.push({
            name: 'channelCompany'
          })
          break
        case '1_2':
          this.$router.push({
            name: 'waitConChannel'
          })
          break
      }
    },
    // 列表数据 搜索 分页
    getListData () {
      this.getData()
      // 列表数据
      let {
        meanId,
        productCompanyName,
        oneEntryId,
        twoEntryId,
        status,
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
          meanId,
          productCompanyName,
          oneEntryId,
          twoEntryId,
          status,
          text
        }
      }
      sendData.pageSize = pageSize
      sendData.currPage = currPage
      sendData.id = this.$route.query.backlogId
      this.$axios({
        url: baseUrl + '/productCompany/getConfirm',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        // 查无数据
        if (res.data.code === 10001) {
          let _self = this.headerSearch
          this.waitCooperContent = []
          _self.totalCount = 0
          _self.pageSize = 20
          _self.currPage = 1
        } else if (res.data.code === 10000) {
          let _self = this.headerSearch
          this.waitCooperContent = res.data.content.pageContent
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
      this.$axios({
        url: baseUrl + '/user/getIncumbencyTbUser',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.incumbencyTbUser = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 撤销
    revokeChannel (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>是否确认撤销申请？</p>',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.$axios({
            url: baseUrl + '/productChannel/revoke',
            method: 'post',
            data: $qs.stringify({ id: row.id })
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.info(res.data.msg)
              this.getListData()
            } else {
              this.$Message.error(res.data.msg)
            }
          }).catch(err => {
            console.error(err)
          })
        }
      })
    },
    // 删除产品公司
    deleteChannel (row) {
      if (row.contractType === 1) {
        // 如果是收款
        this.$router.push({
          name: 'detailChannel',
          query: {
            productChannelId: row.deleteId,
            type: 'deleteTbc',
            tbcId: row.id
          }
        })
      } else if (row.contractType === 2) {
        // 如果是付款
        this.$router.push({
          name: 'payDetailChannel',
          query: {
            productChannelId: row.deleteId,
            type: 'deleteTbc',
            tbcId: row.id
          }
        })
      } else {
        this.$router.push({
          name: 'detailChannel',
          query: {
            productChannelId: row.deleteId,
            type: 'deleteTbc',
            tbcId: row.id
          }
        })
      }
    },
    // 编辑产品公司
    editChannel (row) {
      this.$router.push({
        name: 'twoEditChannel',
        query: {
          productChannelId: row.id
        }
      })
    },
    // 产品公司详情页面
    detailProduct (row) {
      console.log(row)
      this.$router.push({
        name: 'detailProduct',
        query: {
          productChannelId: row.id
        }
      })
    },
    clearSearchHeader (text) {
      this.headerSearch = {
        meanId: 1,
        productCompanyName: '',
        oneEntryId: '',
        twoEntryId: '',
        status: '',
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
