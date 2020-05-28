<template>
    <div>
        <div class="level-three">
            <Button type="primary" @click="addChannel()">新增</Button>
            <div class="searchbar">
                <Input
                    v-model="headerSearch.text"
                    placeholder="搜索公司名"
                    search
                    @on-search="getListData()"
                    style="margin-right:5px"
                ></Input>
                <Button  icon="ios-loading" @click="reloadPage"></Button>
            </div>
        </div>
        <Table
            :loading="loading"
            :columns="channelHeader"
            :data="channelContent"
            border
        >
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" class="marginRight3px" @click="editChannel(row)">编辑</Button>
                <Button class="simple marginRight3px" size="small" @click="detailChannel(row)">详情</Button>
                <Button type="error" size="small" @click="deleteChannel(row)">删除</Button>
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
import { baseUrl } from '@/api/base.js'
export default {
  name: 'channelCompany',
  data () {
    return {
      statu: [
        {
          value: '3',
          label: '全部'
        },
        {
          value: '0',
          label: '合同期'
        },
        {
          value: '1',
          label: '已到期'
        },
        {
          value: '2',
          label: '无合同'
        }
      ],
      loading: true, // 表格数据加载
      // 在职人员
      // incumbencyTbUser: [],
      // 表头搜索
      headerSearch: {
        text: '', // 全局搜索公司
        channelName: '', // 公司名称姓名
        businessUName: '', // 市场名称
        businessName: '', // 标签
        tle: '', // 联系电话
        contractStatusName: '', // 合同状态
        contractStatus: '',
        totalCount: 0,
        pageSize: 20,
        currPage: 1
      },
      // 渠道公司表头
      channelHeader: [
        {
          title: '序号',
          type: 'index',
          align: 'center',
          width: 70
        },
        {
          title: '公司名称/姓名',
          key: 'channelName',
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
                    v-model={this.headerSearch.channelName}
                    v-on:on-search={() => {
                      this.getListData()
                    }}
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
                      this.headerSearch.channelName = ''
                    }}
                  ></Button>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '市场',
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
                    placeholder="请选择市场"
                    style="width:130px;height:33px"
                    v-on:on-change={() => {}}
                    v-model={this.headerSearch.businessUID}
                  >
                    {(this.incumbencyTbUser || []).map(
                      person => {
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
                      }
                    )}
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
                      this.headerSearch.businessUID = ''
                    }}
                  ></Button>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '标签',
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
                    placeholder="输入标签"
                    v-model={this.headerSearch.businessName}
                    v-on:on-search={() => {
                      this.getListData()
                    }}
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
                      this.headerSearch.businessName = ''
                    }}
                  ></Button>
                </Poptip>
              </span>
            )
          }
        },
        {
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
                    placeholder="输入联系电话"
                    v-model={this.headerSearch.tle}
                    v-on:on-search={() => {
                      this.getListData()
                    }}
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
                      this.headerSearch.tle = ''
                    }}
                  ></Button>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '合同状态',
          key: 'contractStatusName',
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
                    placeholder="请选择合同状态"
                    style="width:130px"
                    v-on:on-change={() => {}}
                    v-model={this.headerSearch.contractStatus}
                  >
                    {(this.statu || []).map(item => {
                      return (
                        <Option value={item.value}>
                          {item.label}
                        </Option>
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
                      this.headerSearch.contractStatus = ''
                    }}
                  ></Button>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      // 产品公司表格数据
      channelContent: []
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
    getData () {
      // 在职人员
      // this.$axios({
      //   url: baseUrl + '/user/getIncumbencyTbUser',
      //   method: 'post'
      // })
      //   .then(res => {
      //     if (res.data.code === 10000) {
      //       this.incumbencyTbUser = res.data.content
      //     } else {
      //       this.$Message.error(res.data.msg)
      //     }
      //   })
      //   .catch(err => {
      //     console.error(err)
      //   })
    },
    // 列表数据 搜索 分页
    getListData () {
      this.getData()
      // 列表数据
      let {
        channelName,
        businessUName,
        businessUID,
        businessName,
        contractStatusName,
        contractStatus,
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
          channelName,
          businessUName,
          businessUID,
          businessName,
          contractStatusName,
          contractStatus,
          tle
        }
      }
      sendData.pageSize = pageSize
      sendData.currPage = currPage
      this.$axios({
        url: baseUrl + '/productChannel/find',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          // 查无数据
          if (res.data.code === 10001) {
            let _self = this.headerSearch
            this.channelContent = []
            _self.totalCount = 0
            _self.pageSize = 20
            _self.currPage = 1
          } else if (res.data.code === 10000) {
            let _self = this.headerSearch
            this.channelContent = res.data.content.pageContent
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
    clearSearchHeader (text) {
      this.headerSearch = {
        channelName: '', // 公司名称姓名
        businessUName: '', // 市场名称
        businessName: '', // 标签
        tle: '', // 联系电话
        contractStatusName: '', // 合同状态
        contractStatus: '',
        text: text
      }
    },
    // 重载页面 清空所有所有条件 获取最新数据
    reloadPage () {
      this.clearSearchHeader()
      this.getListData()
    },
    // 新增渠道公司
    addChannel () {
      this.$router.push({
        name: 'addChannle'
      })
    },
    // 编辑渠道公司
    editChannel (row) {
      this.$router.push({
        name: 'editChannel',
        query: {
          productChannelId: row.productChannelId
        }
      })
    },
    // 渠道公司详情
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
    },
    deleteChannel (row) {
      if (row.contractType === 1) {
        // 如果是收款
        this.$router.push({
          name: 'detailChannel',
          query: {
            productChannelId: row.productChannelId,
            type: 'delete'
          }
        })
      } else if (row.contractType === 2) {
        // 如果是付款
        this.$router.push({
          name: 'payDetailChannel',
          query: {
            productChannelId: row.productChannelId,
            type: 'delete'
          }
        })
      } else {
        this.$router.push({
          name: 'detailChannel',
          query: {
            productChannelId: row.productChannelId,
            type: 'delete'
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
