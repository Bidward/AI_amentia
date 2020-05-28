<template>
<div class="viewWrapper">
    <Tabs name="0" value="3"  @on-click="handleClick" :animated="false"  class="level-one">
        <TabPane tab="0" label="产品公司" name="1">
        </TabPane>
        <TabPane  tab="0" label="渠道公司" name="2">
        </TabPane>
        <TabPane  tab="0" label="合同库" name="3">
            <Tabs name="1" type="card" value="1_3" @on-click = "handleInnerClick" :animated="false"  class="level-two">
                <TabPane tab="1" label="已签订" name="1_1">
                </TabPane>
                <TabPane tab="1" label="待确认合同" name="1_2">
                </TabPane>
                <TabPane tab="1" label="待签订" name="1_3">
                    <!--表头搜搜-->
                    <div class="level-three">
                        <div class="searchbar">
                            <Input v-model="waitSignDetailHeader.text" placeholder="搜索公司名称" search   @on-search="getWaitSignListData()" ></Input>
                            <Button icon="ios-loading" @click="reloadPage"></Button>
                        </div>
                    </div>
                    <div style="clear:both"></div>
                    <Table border :columns="waitSignTableHeader" :data="waitSignTableContent" :loading="loading">
                        <template slot-scope="{ row, index }" slot="action">
                            <Button type="primary" class="marginRight3px" @click="editUnsign(row)">编辑</Button>
                            <Button type="error"  class="marginRight3px"  @click="deleteModalOpen(row)">删除</Button>
                        </template>
                    </Table>
                    <!--删除已到期合同 弹出框-->
                    <Modal class="modalCancel" v-model="deleteModal" title="提醒" @on-ok="deletContract()">
                      <p>是否确认删除？</p>
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
                          :total="waitSignDetailHeader.totalCount"
                          :page-size="waitSignDetailHeader.pageSize"
                          :current="waitSignDetailHeader.currPage"
                          size="small"
                          show-total
                          show-sizer
                          show-elevator
                          @on-change="(currPage)=>{waitSignDetailHeader.currPage=currPage;getWaitSignListData()}"
                          @on-page-size-change="(pageSize)=>{waitSignDetailHeader.pageSize=pageSize;getWaitSignListData()}"
                      />
                    </div>
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
import { baseUrl } from '@/api/base.js'
// import Vue from 'vue'
import tabChangeClickMixins from '../../tabChangeClickMixins'

export default {
  name: 'waitSign',
  mixins: [tabChangeClickMixins],
  data () {
    return {
      twoEntryId: '', // 通知人ID
      loading: false,
      deleteModal: false,
      modalCard: '',
      waitSignDetailHeader: {
        text: '', // 公司名称
        contractType: '', // 合同类型id
        contractTypeName: '', // 合同类型
        contractTypeNameList: [{
          id: '1',
          name: '付款合同'
        }, {
          id: '2',
          name: '收款合同'
        }, {
          id: '3',
          name: '全部'
        }], // 合同类型列表
        myCompanyName: '', // 我方公司
        otherCompanyName: '', // 对方公司
        signerName: '', // 签订人
        totalCount: 0,
        pageSize: 20,
        currPage: 1

      },
      waitSignTableHeader: [
        {
          title: '序号',
          key: 'index',
          width: 70,
          type: 'index',
          align: 'center'
        }, {
          title: '合同类型',
          //   width: 110,
          key: 'contractTypeName',
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
                  placeholder="选择合同类型"
                  style="width:130px"
                  v-on:on-change={() => {}}
                  v-model={this.waitSignDetailHeader.contractType}
                >
                  {(this.waitSignDetailHeader.contractTypeNameList || []).map(item => {
                    return <Option value={item.id}>{item.name}</Option>
                  })}
                </Select>
                <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getWaitSignListData() }}></Button>
                <Button icon="md-close" slot="content" v-on:click={() => { this.waitSignDetailHeader.contractType = '' }}></Button>
              </Poptip>
            )
          }
        }, {
          title: '我方公司',
          key: 'myCompanyName',
          align: 'center'
        }, {
          title: '对方公司/姓名',
          key: 'otherCompanyName',
          align: 'center'
        },
        {
          title: '签订人',
          key: 'signerName',
          align: 'center'
        }, {
          title: '操作',
          slot: 'action',
          key: 'action',
          align: 'center'
        }
      ],
      waitSignTableContent: []
    }
  },
  inject: ['app'],
  computed: {
    incumbencyTbUser () { // 在职人员
      return this.app.employees
    }
  },
  mounted () {
    this.getWaitSignListData()
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
    getWaitSignListData () {
      let _w = this.waitSignDetailHeader
      let sendData = {
        text: _w.text,
        contractType: _w.contractType,
        pageSize: _w.pageSize,
        currPage: _w.currPage,
        id: this.$route.query.backlogId
      }

      this.$axios({
        url: baseUrl + '/contract/labTwo',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        // 查无数据
        if (res.data.code === 10001) {
          let _self = this.waitSignDetailHeader
          this.waitSignTableContent = []
          _self.totalCount = 0
          _self.pageSize = 20
          _self.currPage = 1
        } else if (res.data.code === 10000) {
          let _self = this.waitSignDetailHeader
          this.waitSignTableContent = res.data.content.pageContent
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
    // 编辑待签订合同
    editUnsign (row) {
      if (row.contractType === 1) {
        // 如果是收款
        this.$router.push({
          name: 'editUnsign',
          query: {
            id: row.id
          }
        })
      } else if (row.contractType === 2) {
        // 如果是付款
        this.$router.push({
          name: 'payEditUnsign',
          query: {
            id: row.id
          }
        })
      }
    },
    // 打开删除合同弹窗
    deleteModalOpen (row) {
      this.modalCard = row.card
      this.cardId = row.id
      this.deleteModal = true
    },
    // 删除到期合同
    deletContract () {
      let sendData = {
        cardId: this.cardId,
        twoEntryId: this.twoEntryId
      }
      this.$axios({
        url: baseUrl + '/contract/delete',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.getWaitSignListData()
          this.$Message.info(res.data.msg)
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 清除搜索条件
    clearSearchHeader (text) {
      this.waitSignDetailHeader = {
        myCompanyName: '', // 我方公司
        otherCompanyName: '', // 对方公司
        signerName: '', // 签订人name
        contractType: '', // 合同类型id
        text: text
      }
    },
    reloadPage () {
      this.clearSearchHeader()
      this.getWaitSignListData()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
