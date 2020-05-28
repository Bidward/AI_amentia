<template>
<div class="viewWrapper">
    <Tabs name="0" value="3" @on-click="handleClick" :animated="false" class="level-one">
        <TabPane tab="0" label="产品公司" name="1">
        </TabPane>
        <TabPane  tab="0" label="渠道公司" name="2">
        </TabPane>
        <TabPane  tab="0" label="合同库" name="3">
            <Tabs name="1" type="card" value="1_2" @on-click = "handleInnerClick" :animated="false" class="level-two">
                <TabPane tab="1" label="已签订" name="1_1">
                </TabPane>
                <TabPane tab="1" label="待确认合同" name="1_2">
                    <div class="level-three">
                    <div class="searchbar">
                      <Input
                          v-model="detailHeader.text"
                          placeholder="搜索公司名称"
                          search
                          class="searInput"
                          @on-search="getListData()"
                      ></Input>
                      <Button icon="ios-loading" @click="reloadPage"></Button>
                    </div>
                    </div>
                    <div style="clear:both"></div>
                    <!-- 表 -->
                    <Table border :columns="tableHeader" :data="tableContent" :loading="loading">
                    <template slot-scope="{ row, index }" slot="action">
                        <Button v-if="row.update" type="primary" size="small" class="marginRight3px" @click="editContract(row)">编辑</Button>
                        <Button v-if="row.revoke" class="simple marginRight3px" size="small" @click="revokeContract(row)">撤销</Button>
                        <Button v-if="row.delete" type="error" class="marginRight3px" @click="deletaContract(row)"  size="small">删除</Button>
                        <Button v-if="row.termination" type="error" class="marginRight3px" @click="stopContract(row)"  size="small">终止</Button>
                        <Button v-if="row.sign" type="primary" class="marginRight3px" @click="editUnsign(row)"  size="small">编辑</Button> <!--第二人待二次签订的编辑按钮 -->
                    </template>
                    </Table>
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
                </TabPane>
                <TabPane tab="1" label="待签订" name="1_3">
                </TabPane>
            </Tabs>
        </TabPane>
        <TabPane tab="0" label="产品库" name="4">
        </TabPane>
        <TabPane tab="0" label="产品链接库" name="5">
        </TabPane>
        <TabPane tab="0" label="待审核信息" name="6">
        </TabPane>
    </Tabs>
</div>
</template>

<script>
import { phpURL, baseUrl } from '@/api/base.js'
import moment from 'moment'
import Vue from 'vue'
export default {
  name: 'waitSureContract',
  data () {
    return {
      twoEntryId: '', // 通知人id
      // incumbencyTbUser: [], // 通知人列表
      cardId: '', // 删除的当前合同id
      modalCard: '', // 删除弹窗里的显示当前删除的编码
      loading: false, // 表格加载
      stopModal: false, // 终止合同
      deleteModal: false, // 删除到期合同弹出框
      detailHeader: {
        text: '', // 表格外模糊搜索
        contractData: '', // 录入日期
        signTime: '', // 签订日期
        endTime: '', // 到期时间
        contractStatus: '', // 合同状态id
        contractStatusName: '', // 合同状态name
        contractStatusList: [{
          id: 1,
          name: '待二次录入'
        }, {
          id: 2,
          name: '待二次编辑'
        }, {
          id: 3,
          name: '两次信息不一致'
        }, {
          id: 4,
          name: '待二次删除'
        }, {
          id: 5,
          name: '待二次启用'
        }, {
          id: 6,
          name: '完成'
        }, {
          id: 7,
          name: '撤回'
        }
        ],
        contractType: '', // 合同类型id
        contractTypeName: '', // 合同类型name
        contractTypeNameList: [
          {
            id: '1',
            name: '付款合同'
          },
          {
            id: '2',
            name: '收款合同'
          },
          {
            id: '3',
            name: '全部'
          }
        ], // 合同类型列表
        signerName: '', // 签订人name
        signer: '', // 签订人NameId
        oneEntryName: '', // 发起人名称
        oneEntryId: '', // 发起人id
        twoEntryId: '', // 通知人id
        twoEntryName: '', // 通知人名称
        myCompanyName: '', // 我方公司
        otherCompanyName: '', // 对方公司
        card: '', // 合同编码
        totalCount: 0,
        pageSize: 20,
        currPage: 1
      },
      otherCompanyList: [],
      tableHeader: [
        {
          title: '序号',
          key: 'index',
          width: 70,
          type: 'index',
          align: 'center',
          alwaysShow: true
        },
        {
          title: '合同类型',
          key: 'contractType',
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
                    placeholder="选择合同类型"
                    style="width:130px"
                    v-on:on-change={() => {}}
                    v-model={this.detailHeader.contractTypeName}
                  >
                    {(this.detailHeader.contractTypeNameList || []).map(item => {
                      return <Option value={item.name}>{item.name}</Option>
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
                      this.detailHeader.contractType = ''
                    }}
                  ></Button>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '我方公司',
          key: 'partycompany',
          align: 'center'
        },
        {
          title: '对方公司/姓名',
          key: 'partycompanytwo',
          align: 'center'
        //   renderHeader: (h, params) => {
        //     return (
        //       <span>
        //         <Poptip placement="bottom">
        //           <span class="pointer">
        //             {params.column.title}
        //             <i class="ivu-icon ivu-icon-ios-search" />
        //           </span>
        //           <Select
        //             slot="content"
        //             clearable
        //             filterable
        //             placeholder="请输入对方公司/姓名"
        //             style="width:130px;height: 33px;"
        //             v-on:click = {() => {
        //               this.getAllProductCompanies()
        //             }}
        //             v-on: on-change={() => { this.getListData() }}
        //             v-model={this.detailHeader.otherCompanyId}
        //           >
        //             {(this.otherCompanyList || []).map(person => {
        //               return <Option value={person.productCompanyId}>{person.companyName}</Option>
        //             })}
        //           </Select>
        //           <Button
        //             type="primary"
        //             icon="md-search"
        //             slot="content"
        //             v-on:click={() => {
        //               this.getListData()
        //             }}
        //           ></Button>
        //           <Button
        //             icon="md-close"
        //             slot="content"
        //             v-on:click={() => {
        //               this.detailHeader.otherCompanyId = ''
        //             }}
        //           ></Button>
        //         </Poptip>
        //       </span>
        //     )
        //   }
        },
        {
          title: '签订人',
          key: 'signerName',
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
                    placeholder="输入签订人"
                    style="width:130px;height:33px"
                    v-on:on-search={() => { this.getListData() }}
                    v-model={this.detailHeader.signer}
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
                      this.detailHeader.signerName = ''
                    }}
                  ></Button>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '发起人',
          key: 'oneEntry',
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
                    v-model={this.detailHeader.oneEntryId}
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
                      this.detailHeader.oneEntryId = ''
                    }}
                  ></Button>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '通知人',
          key: 'twoEntry',
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
                    v-model={this.detailHeader.twoEntryId}
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
                      this.detailHeader.twoEntryId = ''
                    }}
                  ></Button>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '合同状态',
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
                    placeholder="选择合同状态"
                    style="width:130px"
                    v-on:on-change={() => {}}
                    v-model={this.detailHeader.contractStatus}
                  >
                    {(this.detailHeader.contractStatusList || []).map(item => {
                      return <Option value={item.name}>{item.name}</Option>
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
                      this.detailHeader.contractStatus = ''
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
          key: 'action',
          width: 210,
          align: 'center',
          alwaysShow: true
        }
      ],
      tableContent: []
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
    this.getData()
  },
  methods: {
    handleClick (name) {
      Vue.tabChangeClick(name)
    },
    handleInnerClick (name) {
      switch (name) {
        case '1_1':
          this.$router.push({
            name: 'contractBank'
          })
          break
        case '1_2':
          this.$router.push({
            name: 'waitSureContract'
          })
          break
        case '1_3':
          this.$router.push({
            name: 'waitSign'
          })
          break
      }
    },
    getAllProductCompanies () {
      // 对方公司/姓名
      this.$axios({
        url: phpURL + '/cloud/getAllProductCompanies',
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          this.otherCompanyList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
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
    },
    // 列表数据 搜索 分页
    getListData () {
      // 列表数据
      let {
        text, // 表格外模糊搜索
        myCompanyName, // 我方公司
        otherCompanyName, // 对方公司
        card, // 合同编码
        signerName, // 签订人name
        oneEntryName, // 发起人名称
        twoEntryName, // 通知人名称
        contractTypeName, // 合同类型name
        contractStatus, // 合同状态id
        contractStatusName, // 合同状态name
        contractType, // 合同类型id
        signTime, // 签订日期
        contractData, // 录入日期
        endTime, // 到期时间
        pageSize,
        signer,
        oneEntryId,
        twoEntryId,
        currPage
      } = this.detailHeader
      console.log(this.detailHeader)
      let sendData = {}
      signTime = signTime ? moment(signTime).format('YYYY-MM-DD') : ''
      endTime = endTime ? moment(endTime).format('YYYY-MM-DD') : ''
      contractData = contractData
        ? moment(contractData).format('YYYY-MM-DD')
        : ''
      // 如果有模糊搜索，清空表头内容
      if (text) {
        sendData.text = text
        this.clearSearchHeader(text)
      } else {
        // 发送表头搜索内容
        sendData = {
          myCompanyName, // 我方公司
          otherCompanyName, // 对方公司
          card, // 合同编码
          signerName, // 签订人name
          signer,
          oneEntryId,
          twoEntryId,
          oneEntryName, // 发起人名称
          twoEntryName, // 通知人名称
          contractTypeName, // 合同类型name
          contractStatus, // 合同状态id
          contractStatusName, // 合同状态name
          contractType, // 合同类型id
          signTime, // 签订日期
          contractData, // 录入日期
          endTime // 到期时间
        }
      }
      sendData.pageSize = pageSize
      sendData.currPage = currPage
      sendData.id = this.$route.query.backlogId
      this.$axios({
        url: baseUrl + '/contract/findContractTbc',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
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
        })
        .catch(err => {
          console.error(err)
        })
    },
    editContract (row) {
      if (row.contractType === '收款') {
        // 如果是收款
        // 发起人和登录人是同一个人
        if (row.oneEntryId === this.$store.state.user.userId) {
          // 是第一人编辑
          if (row.statusName === '两次信息不一致') {
            this.$router.push({
              name: 'addIncome',
              query: {
                type: 'isOneEntry',
                id: row.id,
                isCom: 'noCom'
              }
            })
          } else {
            this.$router.push({
              name: 'addIncome',
              query: {
                type: 'isOneEntry',
                id: row.id
              }
            })
          }
          if (row.statusName === '待二次签订') {
            this.$router.push({
              name: 'editUnsign',
              query: {
                type: 'isOneEntry',
                id: row.id
              }
            })
          }
        } else { // 第二人编辑
          this.$router.push({
            name: 'addIncome',
            query: {
              type: 'isTwoEntry',
              id: row.id
            }
          })
        }
      } else if (row.contractType === '付款') {
        // 如果是付款
        if (row.oneEntryId === this.$store.state.user.userId) {
          if (row.statusName === '两次信息不一致') {
            this.$router.push({
              name: 'addPayment',
              query: {
                type: 'isOneEntry',
                id: row.id,
                isCom: 'noCom'
              }
            })
          } else {
            this.$router.push({
              name: 'addPayment',
              query: {
                type: 'isOneEntry',
                id: row.id
              }
            })
          }
          if (row.statusName === '待二次签订') {
            this.$router.push({
              name: 'payEditUnsign',
              query: {
                type: 'isOneEntry1',
                id: row.id
              }
            })
          }
        } else { // 第二人编辑
          this.$router.push({
            name: 'addPayment',
            query: {
              type: 'isTwoEntry',
              id: row.id
            }
          })
        }
      }
    },
    editUnsign (row) {
      if (row.contractType === '收款') {
        // 如果是收款
        // 发起人和登录人是同一个人
        if (row.oneEntryId === this.$store.state.user.userId) {
          // 是第一人编辑
          if (row.statusName === '两次信息不一致') {
            this.$router.push({
              name: 'editUnsign',
              query: {
                type: 'isOneEntry',
                id: row.id,
                isCom: 'noCom'
              }
            })
          } else {
            this.$router.push({
              name: 'editUnsign',
              query: {
                type: 'isOneEntry',
                id: row.id
              }
            })
          }
        } else { // 第二人编辑
          this.$router.push({
            name: 'editUnsign',
            query: {
              type: 'isTwoEntry',
              id: row.id
            }
          })
        }
      } else if (row.contractType === '付款') {
        // 如果是付款
        if (row.oneEntryId === this.$store.state.user.userId) {
          if (row.statusName === '两次信息不一致') {
            this.$router.push({
              name: 'payEditUnsign',
              query: {
                type: 'isOneEntry',
                id: row.id,
                isCom: 'noCom'
              }
            })
          } else {
            this.$router.push({
              name: 'payEditUnsign',
              query: {
                type: 'isOneEntry',
                id: row.id
              }
            })
          }
        } else {
          this.$router.push({
            name: 'payEditUnsign',
            query: {
              type: 'isTwoEntry',
              id: row.id
            }
          })
        }
      }
    },
    // 撤销
    revokeContract (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>是否确认撤销申请？</p>',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.$axios({
            url: baseUrl + '/contract/revoke',
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
    // 详情
    // getDetailContract (row) {
    //   if (row.contractType === 1) {
    //     // 如果是收款
    //     this.$router.push({
    //       name: 'detailContract',
    //       query: {
    //         id: row.id
    //       }
    //     })
    //   } else if (row.contractType === 2) {
    //     // 如果是付款
    //     this.$router.push({
    //       name: 'payDetailContract',
    //       query: {
    //         id: row.id
    //       }
    //     })
    //   }
    // },
    // 终止合同
    stopContract (row) {
      if (row.contractType === '收款') {
        // 如果是收款
        this.$router.push({
          name: 'detailContract',
          query: {
            id: row.contractId,
            type: 'stop',
            tbcId: row.id
          }
        })
      } else if (row.contractType === '付款') {
        // 如果是付款
        this.$router.push({
          name: 'payDetailContract',
          query: {
            id: row.contractId,
            type: 'stop',
            tbcId: row.id
          }
        })
      }
    },

    // 删除到期合同
    deletaContract (row) {
      if (row.contractType === '收款') {
        // 如果是收款
        this.$router.push({
          name: 'detailContract',
          query: {
            id: row.contractId,
            type: 'deleteTbc',
            tbcId: row.id
          }
        })
      } else if (row.contractType === '付款') {
        // 如果是付款
        this.$router.push({
          name: 'payDetailContract',
          query: {
            id: row.contractId,
            type: 'deleteTbc',
            tbcId: row.id
          }
        })
      }
    },
    // 清除搜索条件
    clearSearchHeader (text) {
      this.detailHeader = {
        myCompanyName: '', // 我方公司
        otherCompanyName: '', // 对方公司
        card: '', // 合同编码
        signerName: '',
        oneEntryName: '', // 发起人名称
        twoEntryName: '', // 通知人名称 // 签订人name
        contractTypeName: '', // 合同类型name
        contractStatus: '', // 合同状态id
        contractStatusName: '', // 合同状态name
        contractType: '', // 合同类型id
        signTime: '', // 签订日期
        contractData: '', // 录入日期
        endTime: '', // 到期时间
        text: text
      }
    },
    // 清空所有搜索条件 重载页面
    reloadPage () {
      this.clearSearchHeader()
      this.getListData()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
