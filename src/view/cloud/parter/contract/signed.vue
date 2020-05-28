<template>
<div>
  <div>
    <div class="level-three">
      <Poptip id="addContractId" placement="bottom" content="content">
        <Button type="primary">新增</Button>
        <div slot="content" >
          <div class="title">我方拟定：</div>
          <div class="choose" @click="addIncome()">收款合同</div>
          <div class="choose" @click="addPayment()">付款合同</div>
          <div class="title">对方拟定：</div>
          <div class="choose" @click="otherAddIncome()">收款合同</div>
          <div class="choose" @click="otherAddPayment()">付款合同</div>
        </div>
      </Poptip>
      <div class="searchbar">
          <Input
            v-model="detailHeader.text"
            placeholder="搜索公司名称"
            search
            @on-search="getListData()"
          ></Input>
          <Button icon="ios-loading" @click="reloadPage"></Button>
          <TableHeaderSetting
            :totalTableHeader="totalTableHeader"
            :tableHeader.sync="tableHeader"
            key="cloudContractList"
            localKey="cloudContractList"
          ></TableHeaderSetting>
      </div>
    </div>
  </div>
  <div style="clear:both"></div>
  <!-- 表 -->
  <Table
    :row-class-name="rowClassName"
    border
    :columns="tableHeader"
    :data="tableContent"
    :loading="loading"
  >
    <template slot-scope="{ row, index }" slot="action">
      <Button
        v-if="row.contractStatus === '合同期'"
        type="primary"
        size="small"
        @click="supplement(row)"
        style="margin-right: 5px"
      >补充协议</Button>
      <Button
        v-if="row.contractStatus === '合同期'"
        type="primary"
        size="small"
        @click="rebuild(row)"
        style="margin-right: 5px"
      >重新生成</Button>
      <Poptip placement="bottom" content="content" id="moreButtomPop">
          <Button v-if="row.contractStatus !== '到期'"
          class="simple"
          size="small"
          style="margin-right: 5px"
          >更多</Button>
          <div slot="content">
              <div>
                  <p v-if="row.contractStatus === '合同期'"  @click="stopModalOpen(row)" class="choose">终止</p>
              </div>
              <div>
                  <p @click="getDetailContract(row)"  class="choose">详情</p>
              </div>
          </div>
      </Poptip>
      <Button
        v-if="row.contractStatus === '到期'"
        @click="deleteModalOpen(row)"
        type="error"
        size="small"
        style="margin-right: 5px"
      >删除</Button>
      <Button v-if="row.contractStatus === '到期'"
      class="simple"
      size="small"
      style="margin-right: 5px"
      @click="getDetailContract(row)"
      >详情</Button>
    </template>
  </Table>
<!--终止合同 弹出框-->
<Modal class="modalCancel" v-model="stopModal" title="提醒" @on-ok="stopContract()">
    <p style="display: inline;">编码为</p>{{modalCard}}<p style="display: inline;">的合同未到期，是否确认终止合同？</p>
    <div style="margin-top:10px;">
        <div style="float:left;margin-top:4px;">通知人：</div>
        <Select v-model="twoEntryId" filterable  clearable  style="width:250px;" >
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
<!--删除已到期合同 弹出框-->
<Modal class="modalCancel" v-model="deleteModal" title="提醒" @on-ok="deletContract()">
    <p style="display: inline;">编码为</p>{{modalCard}}<p style="display: inline;">的合同已到期，是否确认删除？</p>
    <div style="margin-top:10px;">
        <div style="float:left;margin-top:4px;">通知人：</div>
        <Select v-model="twoEntryId" filterable  clearable  style="width:250px;" >
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
</div>
</template>

<script>
import TableHeaderSetting from '_c/table-header-setting'
import { baseUrl } from '@/api/base.js'
import moment from 'moment'
export default {
  name: 'signed',
  components: {
    TableHeaderSetting
  },
  data () {
    return {
      twoEntryId: '', // 通知人id
      tbcId: '-1',
      // incumbencyTbUser: [], // 通知人列表
      cardId: '', // 删除的当前合同id
      modalCard: '', // 删除弹窗里的显示当前删除的编码
      contractTypeId: '', // 合同类型id
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
        contractStatusList: [
          {
            id: '1',
            name: '合同期'
          },
          {
            id: '2',
            name: '到期'
          },
          {
            id: '3',
            name: '全部'
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
        signerId: '',
        myCompanyName: '', // 我方公司
        otherCompanyName: '', // 对方公司
        card: '', // 合同编码
        totalCount: 0,
        pageSize: 20,
        currPage: 1
      },
      tableHeader: [],
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
          title: '录入时间',
          key: 'contractData',
          sortable: true,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <i class="ivu-icon ivu-icon-ios-search" />
                  </span>
                  <DatePicker
                    format="yyyy-MM-dd"
                    slot="content"
                    transfer={false}
                    v-model={this.detailHeader.contractData}
                    type="date"
                    placeholder="选择期限"
                    style="width: 130px"
                  ></DatePicker>
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
                      this.detailHeader.contractData = ''
                    }}
                  ></Button>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '签订日期',
          key: 'startTime',
          sortable: true,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <i class="ivu-icon ivu-icon-ios-search" />
                  </span>
                  <DatePicker
                    transfer={false}
                    format="yyyy-MM-dd"
                    slot="content"
                    v-model={this.detailHeader.signTime}
                    type="date"
                    placeholder="选择日期"
                    style="width: 130px"
                  ></DatePicker>
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
                      this.detailHeader.signTime = ''
                    }}
                  ></Button>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '到期时间',
          key: 'endTime',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <i class="ivu-icon ivu-icon-ios-search" />
                  </span>
                  <DatePicker
                    transfer={false}
                    format="yyyy-MM-dd"
                    slot="content"
                    v-model={this.detailHeader.endTimes}
                    type="daterange" split-panels
                    placeholder="选择期限"
                    style="width: 130px"
                  ></DatePicker>
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
                      this.detailHeader.endTimes = ''
                    }}
                  ></Button>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '合同状态',
          key: 'contractStatus',
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
          title: '合同类型',
          key: 'contractTypeName',
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
                    v-model={this.detailHeader.signerId}
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
                      this.detailHeader.signerId = ''
                    }}
                  ></Button>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '我方公司',
          key: 'myCompanyName',
          align: 'center'
        },
        {
          title: '对方公司/姓名',
          key: 'otherCompanyName',
          align: 'center'
        },
        {
          title: '合同编码',
          key: 'card',
          align: 'center',
          alwaysShow: true,
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
                    placeholder="输入合同编码"
                    v-model={this.detailHeader.card}
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
                      this.detailHeader.card = ''
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
        signerId, // 签订人id
        contractTypeName, // 合同类型name
        contractStatus, // 合同状态id
        contractStatusName, // 合同状态name
        contractType, // 合同类型id
        signTime, // 签订日期
        contractData, // 录入日期
        endTimes, // 到期时间
        pageSize,
        currPage
      } = this.detailHeader
      let sendData = {}
      let startTime = ''
      let endTime = ''
      console.log(endTimes)
      signTime = signTime ? moment(signTime).format('YYYY-MM-DD') : ''
      if (endTimes) {
        endTimes[0] = endTimes[0] ? moment(endTimes[0]).format('YYYY-MM-DD') : ''
        endTimes[1] = endTimes[1] ? moment(endTimes[1]).format('YYYY-MM-DD') : ''
        startTime = endTimes[0]
        endTime = endTimes[1]
      }
      // endTime = endTime ? moment(endTime).format('YYYY-MM-DD') : ''
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
          signerId, // 签订人ID
          contractTypeName, // 合同类型name
          contractStatus, // 合同状态id
          contractStatusName, // 合同状态name
          contractType, // 合同类型id
          signTime, // 签订日期
          contractData, // 录入日期
          startTime, // 到期时间开始时间
          endTime // 到期时间结束时间
        }
      }
      sendData.pageSize = pageSize
      sendData.currPage = currPage
      this.$axios({
        url: baseUrl + '/contract/lab',
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
    // 到期的合同行样式置灰
    rowClassName (row, index) {
      if (row.contractStatus === '到期') {
        return 'demoTableInfo'
      }
      return ''
    },

    // 我方拟定新增收款合同
    addIncome () {
      this.$router.push({
        name: 'addIncome'
      })
    },
    // 我方拟定新增付款合同
    addPayment () {
      this.$router.push({
        name: 'addPayment'
      })
    },
    // 对方拟定 新增收款合同
    otherAddIncome () {
      this.$router.push({
        name: 'otherAddIncome'
      })
    },
    // 对方拟定 新增付款合同
    otherAddPayment () {
      this.$router.push({
        name: 'otherAddPayment'
      })
    },
    // 补充协议
    supplement (row) {
      if (row.contractType === 1) {
        // 如果是收款
        this.$router.push({
          name: 'supplement',
          query: {
            id: row.id
          }
        })
      } else if (row.contractType === 2) {
        // 如果是付款
        this.$router.push({
          name: 'paySupplement',
          query: {
            id: row.id
          }
        })
      }
    },
    // 重新生成
    rebuild (row) {
      if (row.contractType === 1) {
        // 如果是收款
        this.$router.push({
          name: 'rebuild',
          query: {
            id: row.id
          }
        })
      } else if (row.contractType === 2) {
        // 如果是付款
        this.$router.push({
          name: 'payRebuild',
          query: {
            id: row.id
          }
        })
      }
    },
    // 详情
    getDetailContract (row) {
      if (row.contractType === 1) {
        // 如果是收款
        this.$router.push({
          name: 'detailContract',
          query: {
            id: row.id
          }
        })
      } else if (row.contractType === 2) {
        // 如果是付款
        this.$router.push({
          name: 'payDetailContract',
          query: {
            id: row.id
          }
        })
      }
    },
    // 打开终止合同弹窗
    stopModalOpen (row) {
      this.modalCard = row.card
      this.cardId = row.id
      this.stopModal = true
    },
    // 终止合同
    stopContract () {
      let sendData = {
        cardId: this.cardId,
        twoEntryId: this.twoEntryId,
        router: 'waitSureContract'
      }
      this.$axios({
        url: baseUrl + '/contract/deleteTwo',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.getListData()
            this.$Message.info(res.data.msg)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 打开删除合同弹窗
    deleteModalOpen (row) {
      this.modalCard = row.card
      this.cardId = row.id
      this.deleteModal = true
      this.contractTypeId = row.contractType
    },
    // 删除到期合同
    deletContract () {
      let sendData = {
        cardId: this.cardId,
        twoEntryId: this.twoEntryId,
        // tbcId: this.tbcId,
        router: 'waitSureContract'
      }
      this.$axios({
        url: baseUrl + '/contract/delete',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.getListData()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 清除搜索条件
    clearSearchHeader (text) {
      this.detailHeader = {
        myCompanyName: '', // 我方公司
        otherCompanyName: '', // 对方公司
        card: '', // 合同编码
        signerName: '', // 签订人name
        signerIdL: '', // 签订人id
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
@base-color:#19AA8D;
.ivu-poptip-content{
  width: 109px;
  .choose{
    margin-left: 13px;
    cursor:pointer;
    &:hover{
      color:@base-color
    }
  }
}

</style>
