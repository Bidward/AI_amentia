<template>
<div class="viewWrapper">
    <Tabs name="0" value="6" class="level-one" @on-click="handleClick" :animated="false">
        <TabPane tab="0" label="产品公司" name="1">
        </TabPane>
        <TabPane tab="0" label="渠道公司" name="2">
        </TabPane>
        <TabPane tab="0" label="合同库" name="3">
        </TabPane>
        <TabPane tab="0" label="产品库" name="4">
        </TabPane>
        <TabPane tab="0" label="产品链接库" name="5">
        </TabPane>
        <TabPane tab="0" label="待审核信息" name="6">
            <Tabs name="1" type="card" value ="1_2"  :animated="false" @on-click="handleInnerClick" class="level-two">
                <TabPane tab="1" label="待审核合同" name="1_1">
                </TabPane>
                <TabPane tab="1" label="待审核上线" name="1_2">
                    <div class="level-three">
                      <div class="searchbar">
                        <Input
                            placeholder="链接名称"
                            search
                            v-model="headerSearch.fuzzyCondition"
                            @on-search="getListData()"
                        />
                        <Button icon="ios-loading" @click="reloadPage"></Button>
                      </div>
                    </div>
                    <div style="clear:both"></div>
                    <Table border :columns="toContractHeader" :data="toContractContent" :loading="loading">
                    <template slot-scope="{ row }" slot="name">
                        <strong>{{ row.name }}</strong>
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <Button
                        type="primary"
                        size="small"
                        class = "marginRight3px"
                        @click="approve(row.id)"
                        v-if="row.isApproval"
                        >审批</Button>
                        <Button
                        type="error"
                        size="small"
                        class = "marginRight3px"
                        @click="remove(row)"
                        v-if="row.isDelete"
                        >删除</Button>
                        <Button
                        size="small"
                        class = "marginRight3px"
                        @click="detail(row.id)"
                        v-if="row.isDetails"
                        >详情</Button>
                        <Button size="small" @click="revocation(row)" v-if="row.isRevoke">撤销</Button>
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
                    <!-- 审批弹框 -->
                    <Modal :mask-closable="false" v-model="approveAlert" title="审批" :onlineId="onlineId">
                      <Form inline :label-width="80" label-position="right" :model="toapprove">
                          <Row>
                          <Col span="12">
                              <FormItem label="链接名称：">
                              <p class="half">{{toapprove.linkDetail.linksName}}</p>
                              </FormItem>
                          </Col>
                          <Col span="12">
                              <FormItem label="渠道名称：">
                              <p class="half">{{toapprove.linkDetail.channelName}}</p>
                              </FormItem>
                          </Col>
                          </Row>
                          <Row>
                          <Col span="12">
                              <FormItem label="进价：">
                              <p class="half">{{toapprove.linkDetail.purchasePrice}}</p>
                              </FormItem>
                          </Col>
                          <Col span="12">
                              <FormItem label="出价：">
                              <p class="half">{{toapprove.linkDetail.sendPrice}}</p>
                              </FormItem>
                          </Col>
                          </Row>
                          <Row>
                          <Col span="24">
                              <FormItem label="申请原因：">
                              <p class="half">{{toapprove.linkDetail.applyReason}}</p>
                              </FormItem>
                          </Col>
                          </Row>
                          <Row>
                          <Col span="24">
                              <FormItem label="附件：">
                              <p class="half" v-for="(item,index) in toapprove.enclosure" :key="index"><a :href="item.enclosureUrl">{{item.enclosureName}}</a></p>
                              </FormItem>
                          </Col>
                          </Row>
                          <Row>
                          <Col span="24">
                              <FormItem label="拒绝原因：">
                              <p class="half">
                                  <Input
                                  type="textarea"
                                  placeholder="请填写拒绝原因"
                                  style="width:375px"
                                  v-model="rejectReason"
                                  />
                              </p>
                              </FormItem>
                          </Col>
                          </Row>
                      </Form>
                      <div slot="footer">
                          <Button type="error" @click="rejectBtn">拒绝</Button>
                          <Button type="primary" @click="agreeBtn">同意</Button>
                      </div>
                    </Modal>
                    <!-- 详情弹框 -->
                    <Modal  :mask-closable="false" v-model="detailAlert" title="详情" :onlineId="onlineId">
                      <Form inline :label-width="80" label-position="right" :model="details">
                          <Row>
                          <Col span="12">
                              <FormItem label="链接名称：">
                              <p class="half">{{details.linkDetail.linksName}}</p>
                              </FormItem>
                          </Col>
                          <Col span="12">
                              <FormItem label="渠道名称：">
                              <p class="half">{{details.linkDetail.channelName}}</p>
                              </FormItem>
                          </Col>
                          </Row>
                          <Row>
                          <Col span="12">
                              <FormItem label="进价：">
                              <p class="half">{{details.linkDetail.purchasePrice}}</p>
                              </FormItem>
                          </Col>
                          <Col span="12">
                              <FormItem label="出价：">
                              <p class="half">{{details.linkDetail.sendPrice}}</p>
                              </FormItem>
                          </Col>
                          </Row>
                          <Row>
                          <Col span="24">
                              <FormItem label="申请原因：">
                              <p class="half">{{details.linkDetail.applyReason}}</p>
                              </FormItem>
                          </Col>
                          </Row>
                          <Row>
                          <Col span="24">
                              <FormItem label="附件：">
                              <p class="half" v-for="(item,index) in details.enclosure" :key="index"><a :href="item.enclosureUrl">{{item.enclosureName}}</a></p>
                              </FormItem>
                          </Col>
                          </Row>
                          <Row>
                          <Col span="24">
                              <FormItem label="拒绝原因：">
                              <p class="half">{{details.linkDetail.rejectReason}}</p>
                              </FormItem>
                          </Col>
                          </Row>
                      </Form>
                      <div slot="footer">
                          <Button type="error" @click="close">关闭</Button>
                      </div>
                    </Modal>
                </TabPane>
            </Tabs>
        </TabPane>
    </Tabs>
</div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
import moment from 'moment'
// import Vue from 'vue'
import tabChangeClickMixins from '../../tabChangeClickMixins'
export default {
  mixins: [tabChangeClickMixins],
  data () {
    return {
      onlineId: '', // 审批、详情id
      approveAlert: false, // 审批弹框
      detailAlert: false, // 详情弹框
      loading: true,
      rejectReason: '', // 拒绝原因
      headerSearch: {
        fuzzyCondition: '',
        linksName: '', // 链接名称
        channelName: '', // 渠道名称
        applyTime: '' // 申请时间
      },
      // 审批
      toapprove: {
        linkDetail: {
          linksName: '',
          applyReason: '',
          channelName: '',
          purchasePrice: '',
          sendPrice: ''
        },
        enclosure: [
          {
            enclosureName: '',
            enclosureUrl: ''
          }
        ]
      },
      // 详情
      details: {
        linkDetail: {
          linksName: '',
          applyReason: '',
          channelName: '',
          purchasePrice: '',
          rejectReason: '',
          sendPrice: ''
        },
        enclosure: [{
          enclosureName: '',
          enclosureUrl: ''

        }]
      },
      toContractHeader: [
        {
          title: '序号',
          type: 'index',
          width: 70,
          align: 'center'
        },
        {
          title: '链接名称',
          key: 'linksName',
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
                    placeholder="输入链接名称"
                    v-model={this.headerSearch.linksName}
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
                      this.headerSearch.linksName = ''
                    }}
                  ></Button>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '申请时间',
          key: 'applyTime',
          align: 'center',
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
                        v-model={this.headerSearch.applyTime}
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
          title: '渠道名称',
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
                    placeholder="输入渠道名称"
                    v-model={this.headerSearch.channelName}
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
                      this.headerSearch.channelName = ''
                    }}
                  ></Button>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '申请人',
          key: 'applyName',
          align: 'center'
        },
        {
          title: '审批状态',
          key: 'statusName',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      toContractContent: []
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
            name: 'toAuditInform'
          })
          break
        case '1_2':
          this.$router.push({
            name: 'toAuditOnline'
          })
          break
      }
    },
    // 列表数据 搜索 分页
    getListData () {
      // 列表数据
      let {
        fuzzyCondition,
        pageSize,
        currPage,
        linksName,
        channelName,
        applyTime
      } = this.headerSearch
      let sendData = {}
      // 如果有模糊搜索，清空表头内容
      if (fuzzyCondition) {
        sendData.fuzzyCondition = fuzzyCondition
        this.clearSearchHeader(fuzzyCondition)
      } else {
        // 发送表头搜索内容
        sendData = {
          channelName, // 渠道名称
          linksName // 链接名称
        }
      }
      if (applyTime[0]) {
        sendData.startTime = moment(applyTime[0]).format('YYYY-MM-DD')
        sendData.endTime = moment(applyTime[1]).format('YYYY-MM-DD')
      }
      sendData.pageSize = pageSize
      sendData.currPage = currPage
      sendData.id = this.$route.query.backlogId
      this.$axios({
        url: baseUrl + '/Commodity/tab',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.toContractContent = res.data.content.pageContent
          }
          // 查无数据
          if (res.data.code === 10001) {
            this.loading = false
            let _self = this.headerSearch
            this.toContractContent = []
            _self.totalCount = 0
            _self.pageSize = 20
            _self.currPage = 1
          } else if (res.data.code === 10000) {
            let _self = this.headerSearch
            this.toContractContent = res.data.content.pageContent
            _self.totalCount = res.data.content.totalCount
            _self.pageSize = res.data.content.pageSize
            _self.currPage = res.data.content.currPage
            this.loading = false
          } else {
            this.$Message.error(res.data.msg)
            this.loading = false
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    clearSearchHeader (fuzzyCondition) {
      this.headerSearch = {
        linksName: '', // 链接名称
        channelName: '', // 渠道名称
        applyTime: '', // 申请时间
        fuzzyCondition: fuzzyCondition
      }
    },
    reloadPage () {
      this.clearSearchHeader()
      this.getListData()
    },
    // 删除
    remove (row) {
      this.$Modal.confirm({
        title: '提示',
        content: `是否确认删除该信息？`,
        onOk: () => {
          this.$axios({
            url: baseUrl + '/Commodity/delete',
            data: $qs.stringify({ id: row.id }),
            method: 'post'
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.getListData()
                this.$Message.success(res.data.msg)
              }
            })
            .catch(err => {
              console.log(err.data)
            })
        }
      })
    },
    // 撤销
    revocation (row) {
      this.$Modal.confirm({
        title: '提示',
        content: `是否确认撤销申请?`,
        onOk: () => {
          this.$axios({
            url: baseUrl + '/Commodity/undo',
            data: $qs.stringify({ id: row.id }),
            method: 'post'
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.getListData()
                this.$Message.success(res.data.msg)
              }
            })
            .catch(err => {
              console.log(err.data)
            })
        }
      })
    },
    // 审批
    approve (id) {
      this.approveAlert = true
      this.rejectReason = ''
      this.onlineId = id
      let sendData = {
        id: this.onlineId
      }
      this.$axios({
        url: baseUrl + '/Commodity/detail',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.toapprove = res.data.content
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 详情
    detail (id) {
      this.detailAlert = true
      this.onlineId = id
      let sendData = {
        id: this.onlineId
      }
      this.$axios({
        url: baseUrl + '/Commodity/detail',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.details = res.data.content
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 拒绝
    rejectBtn () {
      if (this.rejectReason !== '') {
        let sendData = {
          rejectReason: this.rejectReason,
          id: this.onlineId
        }
        this.$axios({
          url: baseUrl + '/Commodity/reject',
          data: $qs.stringify(sendData),
          method: 'post'
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.getListData()
            }
          })
          .catch(err => {
            console.log(err.data)
          })
        this.approveAlert = false
      } else {
        this.$Message.warning('请填写拒绝原因')
      }
    },
    // 同意
    agreeBtn () {
      let sendData = {
        id: this.onlineId
      }
      this.$axios({
        url: baseUrl + '/Commodity/agree',
        data: $qs.stringify(sendData),
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.getListData()
          }
        })
        .catch(err => {
          console.log(err.data)
        })
      this.approveAlert = false
    },
    // 关闭
    close () {
      this.detailAlert = false
    }
  }
}
</script>
<style scoped>

</style>
