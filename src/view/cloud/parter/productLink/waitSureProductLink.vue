<template>
    <div class="viewWrapper">
        <Tabs name="0" value="5"  @on-click="handleClick" :animated="false" class="level-one">
            <TabPane tab="0" label="产品公司" name="1">
            </TabPane>
            <TabPane tab="0" label="渠道公司" name="2">
            </TabPane>
            <TabPane tab="0" label="合同库" name="3">
            </TabPane>
            <TabPane tab="0" label="产品库" name="4">
            </TabPane>
            <TabPane tab="0" label="产品链接库" name="5">
                <Tabs name="1" value="1_2" class="level-two" type="card" @on-click="handleInnerClick" :animated="false">
                    <TabPane tab="1" label="产品链接库" name="1_1">
                    </TabPane>
                    <TabPane tab="1" label="待确认信息" name="1_2">
                        <div class="level-three">
                            <div class="searchbar">
                                <Input v-model="headerSearch.text"  placeholder="搜索产品名称" search  @on-search="getListData()"></Input>
                                <Button icon="ios-loading" @click="reloadPage"></Button>
                            </div>
                        </div>
                        <Table :loading="loading" :columns="waitCooperHeader" :data="waitCooperContent" border class="cooperTable">
                            <template slot-scope="{ row, index }" slot="action">
                                <Button v-if="row.enable" type="primary" size="small" class="marginRight3px" @click="editProduct(row)">启用</Button>
                                <Button v-if="row.update" type="primary" size="small" class="marginRight3px" @click="editProduct(row)">编辑</Button>
                                <Button v-if="row.revoke" class="simple" size="small" @click="revokeProduct(row)">撤销</Button>
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
                        <!--启用弹出窗-->
                        <Modal id="addNotice" :loading="onLoading" v-model="recommendModel" title="启用" @on-ok="startUseSure">
                            <Row class="rowPadding" style="margin-top:15px;">
                                <Col span="4" class="title">上线产品：</Col>
                                <Col span="5" style="margin-top: -4px;">
                                    <Select size="small" v-model="recommend.onlineProduct" clearable filterable style="margin-top:6px;" @on-change = "getRecommendModelData">
                                        <Option v-for="(item,index) in recommend.onlineProductlList" :value="item.id"  :label="item.commodityName" :key="index">
                                            <div>
                                                <p>{{item.commodityName}}</p>
                                                <p>产品公司：{{item.companyName}}</p>
                                            </div>
                                        </Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Table :row-class-name="rowClassName" size="small" highlight-row  border :columns="recommendModelHeader" :data="recommendModelData" @on-row-click="getChannelData"></Table>
                            <div class="detailRow" v-if="recommend.getDetailData">
                                <Row class="rowPadding" style="margin-top:30px;">
                                    <Col span="4" offset="2" class="title">链接名称：</Col>
                                    <Col span="5">
                                    <p class="top">{{recommend.linksName||'暂无'}}</p>
                                    </Col>
                                    <Col span="4" class="title">产品链接：</Col>
                                    <Col span="5" style="word-wrap: break-word;word-break: break-all;">
                                    <p class="top">{{recommend.productLinks||'暂无'}}</p>
                                    </Col>
                                </Row>
                                <Row class="rowPadding" style="margin-top:15px;">
                                    <Col span="4" offset="2" class="title">结算方式：</Col>
                                    <Col span="5">
                                    <p class="top">{{recommend.settlementName||'暂无'}}</p>
                                    </Col>
                                    <Col span="4" class="title">结算周期：</Col>
                                    <Col span="5">
                                    <p class="top">{{recommend.cycleName||'暂无'}}</p>
                                    </Col>
                                </Row>
                                <Row class="rowPadding" style="margin-top:15px;">
                                    <Col span="4" offset="2" class="title">包体类型：</Col>
                                    <Col span="5">
                                    <p class="top">{{recommend.enclavesName||'暂无'}}</p>
                                    </Col>
                                    <Col span="4" class="title">
                                        <i class="require">*</i>业务类型：</Col>
                                    <Col span="5">
                                        <Select size="small" v-model="recommend.type" clearable style="margin-top:6px;">
                                            <Option v-for="(item,index) in recommend.serviceType" :value="item.id" :key="index">{{item.value}}</Option>
                                        </Select>
                                    </Col>
                                </Row>
                                <!--安装-->
                                <div v-if="recommend.settlementName === '安装'">
                                    <Row class="rowPadding" style="margin-top:15px;">
                                        <Col span="4" offset="2" class="title">进价：</Col>
                                        <Col span="5">
                                        <p class="top">{{recommend.purchasePrice||'暂无'}}</p>
                                        </Col>
                                        <Col span="4" class="title">
                                            <i class="require">*</i>出价：</Col>
                                        <Col span="5">
                                            <Input style="margin-top:6px;" v-model="recommend.purpricetrue" size="small" placeholder="输入出价" clearable></Input>
                                            <p style="color:red" v-if="recommend.notUpto">利润率不达标</p>
                                        </Col>
                                    </Row>
                                </div>
                                <!--充值-->
                                <div v-if="recommend.settlementName === '充值'">
                                    <Row class="rowPadding" style="margin-top:15px;">
                                        <Col span="4" offset="2" class="title">进价：</Col>
                                        <Col span="5">
                                        <p class="top">{{ recommend.purchasePrice||'暂无'}}</p>
                                        </Col>
                                        <Col span="4" class="title">
                                            <i class="require">*</i>出价：</Col>
                                        <Col span="5">
                                            <Input style="margin-top:6px;"  v-model="recommend.purpricetrue" size="small" placeholder="输入出价" clearable></Input>
                                            <p style="color:red" v-if="recommend.notUpto">利润率不达标</p>
                                        </Col>
                                    </Row>
                                    <Row class="rowPadding" style="margin-top:15px;">
                                        <Col span="4" offset="2" class="title">充值(%):</Col>
                                        <Col span="5">
                                        <p class="top">{{recommend.percentage||'暂无'}}</p>
                                        </Col>
                                        <Col span="4" class="title">
                                            <i class="require">*</i>充值出价(%)：</Col>
                                        <Col span="5">
                                            <Input style="margin-top:6px;"  v-model="recommend.sendpricetrue" size="small" placeholder="输入充值出价" clearable></Input>
                                            <p style="color:red" v-if="recommend.notUpto">利润率不达标</p>
                                        </Col>
                                    </Row>
                                </div>
                                <!--留存-->
                                <div v-if="recommend.settlementName === '留存'">
                                <Row style="margin-top:15px;">
                                    <Col span="4" offset="2"  class="title">进价：</Col>
                                    <Col span="5">
                                    <p class="top">{{recommend.purchasePrice||'暂无'}}</p>
                                    </Col>
                                    <Col span="4" class="title">
                                        <i class="require">*</i>出价：</Col>
                                    <Col span="5">
                                        <Input style="margin-top:6px;"   v-model="recommend.purpricetrue" size="small" placeholder="输入出价" clearable></Input>
                                        <p style="color:red" v-if="recommend.notUpto">利润率不达标</p>
                                    </Col>
                                </Row>
                                <Row style="margin-top:15px;">
                                    <Col span="4" offset="2" class="title">留存：</Col>
                                    <Col span="5">
                                    <p class="top">{{recommend.retain||'暂无'}}</p>
                                    </Col>
                                    <Col span="4" class="title">
                                        <i class="require">*</i>留存出价：</Col>
                                    <Col span="5">
                                        <Input style="margin-top:6px;"  v-model="recommend.proposalRetain" size="small" placeholder="输入出价" clearable></Input>
                                        <p style="color:red" v-if="recommend.notUpto">利润率不达标</p>
                                    </Col>
                                </Row>
                                </div>
                                <!--分成-->
                                <div v-if="recommend.settlementName === '分成'">
                                    <Row class="rowPadding" style="margin-top:15px;">
                                        <Col span="4" offset="2" class="title">进价比(%)：</Col>
                                        <Col span="5">
                                        <p class="top">{{recommend.percentage||'暂无'}}</p>
                                        </Col>
                                        <Col span="4" class="title">
                                        <i class="require">*</i>出价比(%)：</Col>
                                        <Col span="5">
                                            <Input style="margin-top:6px;"  v-model="recommend.sendpricetrue" size="small" placeholder="输入出价" clearable></Input>
                                            <p style="color:red" v-if="recommend.notUpto">利润率不达标</p>
                                        </Col>
                                    </Row>
                                </div>
                                <div>
                                  <Row class="rowPadding" style="margin-top:15px;">
                                        <Col span="5" offset="1" class="title">对应财务系统产品编码:</Col>
                                        <Col span="6">
                                            <Input style="margin-top:6px" v-model="recommend.oldCode" size="small" clearable></Input>
                                        </Col>
                                    </Row>
                                </div>
                                <div>
                                    <Row class="rowPadding" style="margin-top:15px;">
                                        <Col span="4" offset="2" class="title">
                                            <i class="require">*</i>上线渠道：</Col>
                                        <Col span="5">
                                            <Select size="small" v-model="recommend.onlineChannel" clearable filterable style="margin-top:6px;">
                                                <Option v-for="(item,index) in recommend.onlineChannelList" :value="item.productChannelId" :label="item.channelName" :key="index">{{item.channelName}}</Option>
                                            </Select>
                                        </Col>
                                    </Row>
                                </div>
                                <!--通知人-->
                                <div v-if="isOnEntry">
                                    <Row class="rowPadding" style="margin-top:15px;">
                                        <Col span="4" offset="2" class="title"><i class="require">*</i>通知人：</Col>
                                        <Col span="5">
                                            <Select style="margin-top:6px" disabled v-model="recommend.twoEntryId" size="small" filterable clearable>
                                                <Option v-for="person in incumbencyTbUser" :key="person.id" :value="person.id" :label="person.nickname">
                                                    <div>
                                                        <p>{{person.nickname}}</p>
                                                        <p>部门：{{person.deptName}}</p>
                                                        <p>职位：{{person.positionName}}</p>
                                                    </div>
                                                </Option>
                                            </Select>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                            <!--信息对比-->
                            <div class="detailContent" v-if="compareContent">
                                <Row class="rowPadding">
                                    <Col span="4" offset="4" class="cardTitle">信息对比</Col>
                                </Row>
                                <Row class="rowPadding" >
                                    <Col span="16" offset="5">
                                        <div class="compareClasee">
                                            <div class="compareHeader">不同项</div>
                                            <div class="compareContentClass" v-for = "(item,index) in compareData" :key="index">
                                                <p>{{item}}</p>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Modal>
                        <Modal v-model="recommend.approveNoticeModal" title="提醒" @on-ok="noticeSure">
                            <p style="float:left">利润率为<p style=" display: contents;">{{recommend.profitPurchase+','+ recommend.profitProportion}}</p>不符合规范，是否提交审批</p>
                        </Modal>
                        <!--未达标 提出申请-->
                        <Modal :loading="loading" id="toApprove" v-model="recommend.approveModal" title="审批申请" @on-ok="toApprove">
                            <div class="approveModalFont">
                                <Row class="rowPadding">
                                    <Col span="5" offset="4" class="title">链接名称:</Col>
                                    <Col span="7">
                                    <p class="top">{{recommend.linkname||'暂无'}}</p>
                                    </Col>
                                </Row>
                                <Row  class="rowPadding">
                                    <Col span="5"  offset="4" class="title">产品链接：</Col>
                                    <Col span="7">
                                        <p class="top">{{recommend.productLinks||'暂无'}}</p>
                                    </Col>
                                </Row>
                                <Row  class="rowPadding">
                                    <Col span="5"  offset="4" class="title">渠道名称：</Col>
                                    <Col span="7">
                                        <p class="top">{{recommend.channename||'暂无'}}</p>
                                    </Col>
                                </Row>
                                <Row  class="rowPadding">
                                    <Col span="5"  offset="4" class="title">
                                    <i class="require">*</i>申请原因：</Col>
                                    <Col span="7">
                                        <Input v-model="recommend.applyReason"  type="textarea" placeholder="输入申请原因"></Input>
                                    </Col>
                                </Row>
                                <Row  class="rowPadding">
                                    <Col span="5"  offset="4" class="title">附件上传：</Col>
                                    <Col span="7">
                                        <Upload class="bzUpload"
                                            multiple
                                            name="fileData"
                                            :on-success="(value)=> uploadFileSuccess(value)"
                                            :action="staticUrl+'/index.php'"
                                        >
                                            <Button icon="ios-cloud-upload-outline">单个文件不能超过20MB</Button>
                                        </Upload>
                                    </Col>
                                </Row>
                                <Row  class="rowPadding">
                                    <Col span="5"  offset="4" class="title">审批人:</Col>
                                    <Col span="7">
                                        <Select id="colorFont" v-model = "recommend.approveId" clearable disabled filterable>
                                            <Option v-for="item in incumbencyTbUser" :value="item.id" :key="item.id">{{item.nickname}}</Option>
                                        </Select>
                                    </Col>
                                </Row>
                            </div>
                        </Modal>
                    </TabPane>
                </Tabs>
            </TabPane>
            <TabPane tab="0" label="待审核信息" name="6">
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
import { staticUrl,
  baseUrl
} from '@/api/base.js'
// import Vue from 'vue'
import tabChangeClickMixins from '../../tabChangeClickMixins'

export default {
  name: 'waitConProduct',
  mixins: [tabChangeClickMixins],
  data () {
    return {
      staticUrl,
      isOnEntry: false,
      isCheckedRow: false,
      loading: true,
      isEditBtn: false,
      isDifference: '',
      approveNoticeModal: false, // 利润率未达标提醒弹窗
      approveModal: false, // 提出审批弹窗
      notUpto: false, // 未达标显示红字
      onLoading: true,
      recommendModel: false,
      compareContent: false,
      detaileChannleID: '',
      compareData: [],
      recommendModelHeader: [{
        title: '序号',
        type: 'index',
        width: 60,
        align: 'center'
      }, {
        title: '链接名称',
        key: 'linksName',
        align: 'center'
      }, {
        title: '产品链接',
        key: 'productLinks',
        align: 'center'
      }, {
        title: '进价',
        key: 'purchasePrice',
        align: 'center'
      }],
      recommendModelData: [],
      recommend: {
        profitProportion: '',
        profitPurchase: '',
        channename: '',
        applyReason: '',
        approveId: '',
        twoEntryId: '',
        onlineProduct: '',
        onlineProductlList: [],
        oldCode: '',
        onlineChannel: '',
        onlineChannelList: [],
        getDetailData: false,
        linksName: '',
        productLinks: '',
        settlementName: '',
        cycleName: '',
        enclavesName: '',
        type: 2,
        serviceType: [{
          id: 1,
          value: '移动'
        }, {
          id: 2,
          value: 'pc'
        }],
        purchasePrice: '0', // 进阶
        purpricetrue: '0', // 出价
        notUpto: false,
        percentage: '0', // 充值（%） 留存  进阶比
        sendpricetrue: '0', // 充值出价（%） 留存出价 出价比（%）
        retain: '0',
        proposalRetain: '0'
      },
      // 在职人员
      // incumbencyTbUser: [],
      // 表头搜索
      headerSearch: {
        text: '', // 全局搜索公司
        commodityName: '', // 产品名称
        productCompanyName: '', // 产品公司
        oneEntryId: '', // 发起人id
        twoEntryId: '', // 通知人id
        status: '',
        totalCount: 0,
        pageSize: 20,
        currPage: 1
      },
      statusList: [{
        value: 1,
        label: '待二次启用'
      }, {
        value: 2,
        label: '两次信息不一致'
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
          title: '产品名称',
          key: 'commodityName',
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
                    v-model={this.headerSearch.commodityName}
                    v-on:on-search={() => { this.getListData() }}
                  />
                  <Button type="primary" icon="md-search" slot="content" v-on:click={() => { this.getListData() }}></Button>
                  <Button icon="md-close" slot="content" v-on:click={() => { this.headerSearch.commodityName = '' }}></Button>
                </Poptip>
              </span>
            )
          }
        }, {
          title: '产品公司',
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
                    placeholder="请输入产品公司"
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
    handleClick (name) {
      // Vue.tabChangeClick(name)
      this.tabChangeClick(name)
    },
    handleInnerClick (name) {
      switch (name) {
        case '1_1':
          this.$router.push({
            name: 'productLink'
          })
          break
        case '1_2':
          this.$router.push({
            name: 'waitSureProductLink'
          })
          break
      }
    },
    rowClassName (row, index) {
      if (row.linksName === this.recommend.linksName) {
        return 'checkedTableInfo'
      }
      return ''
    },
    // 列表数据 搜索 分页
    getListData () {
      this.getData()
      let {
        commodityName,
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
          commodityName,
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
        url: baseUrl + '/recommend/getOpenTbc',
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
      // 默认审批人是主管
      this.$axios({
        url: baseUrl + '/contract/getSausage',
        method: 'post',
        data: $qs.stringify({ Type: 1 })
      }).then(res => {
        if (res.data.code === 10000) {
          this.recommend.approveId = res.data.content.id
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 编辑产品公司
    editProduct (row) {
      this.recommend.onlineProduct = row.commodityId
      this.detaileChannleID = row.id // 当前链接id
      this.isEditBtn = row.update
      this.isDifference = row.statusName
      this.recommendModel = true
      this.recommend.getDetailData = false
      // 获取上线产品列表
      this.$axios({
        url: baseUrl + '/Commodity/getCommodityListThree',
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          this.recommend.onlineProductlList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
      // 判断是启用还是编辑
      if (row.enable) { // 是启用
        if (row.statusName === '两次信息不一致') {
          this.compareContent = true
          this.getRecommendModelData()
          this.$axios({
            url: baseUrl + '/recommend/updataInfo',
            method: 'post',
            data: $qs.stringify({ tbcId: this.detaileChannleID })
          }).then(res => {
            if (res.data.code === 10000) {
              let _c = res.data.content
              this.recommend.currLinkId = _c.id
              this.getLinkById(this.recommend.currLinkId)
              // 对比信息
              if (_c.differenceJson === undefined) {
                this.compareContent = false
              } else {
                this.compareContent = true
                this.compareData = _c.differenceJson
              }
              this.recommend.type = _c.type
              this.recommend.purpricetrue = _c.purpricetrue
              this.recommend.sendpricetrue = _c.sendpricetrue
              this.getChannelListData()
              this.recommend.onlineChannel = _c.channelId
              this.recommend.oldCode = _c.oldCode
              console.log(this.recommend.oldCode)
              this.recommend.twoEntryId = _c.twoEntryId
            } else {
              this.$Message.error(res.data.msg)
            }
          }).catch(err => {
            console.error(err)
          })
        } else {
          this.compareContent = false
          this.recommend.onlineProduct = ''
          this.recommend.type = 2
          this.recommend.purpricetrue = '0'
          this.recommend.onlineChannel = ''
          this.recommendModelData = []
          this.isOnEntry = false
          this.getChannelListData()
        }
      } else if (row.update) { // 是编辑
        if (row.statusName === '两次信息不一致') {
          this.compareContent = true
          if (row.twoEntryId === this.$store.state.user.userId) {
            this.isOnEntry = false
          } else {
            this.isOnEntry = true
          }
          this.getRecommendModelData()
          this.$axios({
            url: baseUrl + '/recommend/updataInfo',
            method: 'post',
            data: $qs.stringify({ tbcId: this.detaileChannleID })
          }).then(res => {
            if (res.data.code === 10000) {
              let _c = res.data.content
              this.recommend.currLinkId = _c.id
              this.getLinkById(this.recommend.currLinkId)
              // 对比信息
              if (_c.differenceJson === undefined) {
                this.compareContent = false
              } else {
                this.compareContent = true
                this.compareData = _c.differenceJson
              }
              this.recommend.type = _c.type
              this.recommend.oldCode = _c.oldCode
              this.recommend.purpricetrue = _c.purpricetrue
              this.recommend.sendpricetrue = _c.sendpricetrue
              this.getChannelListData()
              this.recommend.onlineChannel = _c.channelId
              this.recommend.twoEntryId = _c.twoEntryId
            } else {
              this.$Message.error(res.data.msg)
            }
          }).catch(err => {
            console.error(err)
          })
        } else {
          this.compareContent = false
          if (row.twoEntryId === this.$store.state.user.userId) {
            this.isOnEntry = false
          } else {
            this.isOnEntry = true
          }
          this.getRecommendModelData()
          this.$axios({
            url: baseUrl + '/recommend/updataInfo',
            method: 'post',
            data: $qs.stringify({ tbcId: this.detaileChannleID })
          }).then(res => {
            if (res.data.code === 10000) {
              let _c = res.data.content
              this.recommend.currLinkId = _c.id
              this.getLinkById(this.recommend.currLinkId)
              this.recommend.type = _c.type
              this.recommend.purpricetrue = _c.purpricetrue
              this.recommend.sendpricetrue = _c.sendpricetrue
              this.getChannelListData()
              this.recommend.onlineChannel = _c.channelId
              this.recommend.twoEntryId = _c.twoEntryId
              this.recommend.oldCode = _c.oldCode
            } else {
              this.$Message.error(res.data.msg)
            }
          }).catch(err => {
            console.error(err)
          })
        }
      }
    },
    getLinkById (id) {
      this.$axios({
        url: baseUrl + '/Commodity/getLinkById',
        method: 'post',
        data: $qs.stringify({ id: id })
      }).then(res => {
        if (res.data.code === 10000) {
          this.recommend.getDetailData = true
          this.recommend.linksName = res.data.content.linksName
          this.recommend.productLinks = res.data.content.productLinks
          this.recommend.card = res.data.content.card
          this.recommend.cycleName = res.data.content.cycleName
          this.recommend.enclavesName = res.data.content.enclavesName
          this.recommend.linksName = res.data.content.linksName
          this.recommend.percentage = res.data.content.percentage
          this.recommend.purchasePrice = res.data.content.purchasePrice
          this.recommend.settlementName = res.data.content.settlementName
          this.recommend.retain = res.data.content.retain
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    getChannelListData () {
      // 获取上线渠道
      this.$axios({
        url: baseUrl + '/productChannel/getChanel',
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          this.recommend.onlineChannelList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    getRecommendModelData () {
      this.$axios({
        url: baseUrl + '/Commodity/getLinkbyCC',
        method: 'post',
        data: $qs.stringify({ id: this.recommend.onlineProduct })
      }).then(res => {
        if (res.data.code === 10000) {
          this.recommendModelData = res.data.content.pageContent
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 获取详细数据
    getChannelData (data) {
      this.recommend.getDetailData = true
      this.compareContent = false
      this.recommend.currLinkId = data.id
      this.$axios({
        url: baseUrl + '/Commodity/getLinkById',
        method: 'post',
        data: $qs.stringify({ id: data.id })
      }).then(res => {
        if (res.data.code === 10000) {
          this.recommend.linksName = res.data.content.linksName
          this.recommend.productLinks = res.data.content.productLinks
          this.recommend.card = res.data.content.card
          this.recommend.cycleName = res.data.content.cycleName
          this.recommend.enclavesName = res.data.content.enclavesName
          this.recommend.linksName = res.data.content.linksName
          this.recommend.percentage = res.data.content.percentage
          this.recommend.purchasePrice = res.data.content.purchasePrice
          this.recommend.sendpricetrue = res.data.content.sendpricetrue
          this.recommend.settlementName = res.data.content.settlementName
          this.recommend.purpricetrue = '0'
          this.recommend.type = 2
          this.recommend.onlineChannel = ''
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 启用弹窗确定按钮
    startUseSure () {
      let flag = this.recommend.purpricetrue !== '' || this.recommend.sendpricetrue !== '' || this.recommend.proposalRetain !== ''
      if (this.recommend.type !== '' && flag && this.recommend.onlineChannel !== '') {
        let sendData = {
          route: 'productLink',
          twoEntryId: this.recommend.twoEntryId,
          channelName: this.recommend.channename,
          oldCode: this.recommend.oldCode,
          purpricetrue: this.recommend.purpricetrue,
          sendpricetrue: this.recommend.sendpricetrue,
          retain: this.recommend.retain,
          proposalRetain: this.recommend.proposalRetain,
          type: this.recommend.type,
          purchasePrice: this.recommend.purchasePrice,
          percentage: this.recommend.percentage,
          channelId: this.recommend.onlineChannel,
          settlementName: this.recommend.settlementName,
          tbcId: this.detaileChannleID,
          id: this.recommend.currLinkId
        }
        this.$axios({
          url: baseUrl + '/recommend/twoInsert',
          method: 'post',
          data: $qs.stringify(sendData)
        }).then(res => {
          if (res.data.code === 10000) {
            this.recommendModel = false
            this.$Message.info(res.data.msg)
            this.getListData()
          } else if (res.data.code === 10102) {
            this.recommendModel = false
            this.recommend.notUpto = true// 显示未达标的字
            this.recommend.approveNoticeModal = true
            this.recommend.channename = res.data.content.channename
            this.recommend.linkname = res.data.content.linkname
            this.recommend.productLinks = res.data.content.productLinks
            this.recommend.profitPurchase = res.data.content.profitPurchase
            this.recommend.profitProportion = res.data.content.profitProportion
          } else if (res.data.code === 10103) { // 信息不一致
            this.$Message.info(res.data.msg)
            this.compareContent = true
            this.compareData = res.data.content
            this.onLoading = false
            this.$nextTick(() => {
              this.onLoading = true
            })
          } else if (res.data.code === 10104) { // 当前产品进价已被修改，请让发起人重新发起
            this.recommendModel = false
            this.$Modal.confirm({
              title: '提醒',
              content: '<p>当前产品最新进价价格被改动，请发起人撤销后重新操作？</p>',
              okText: '确定',
              cancelText: '取消'
            })
          } else {
            this.recommendModel = false
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.error(err)
        })
      } else {
        this.$Message.info('有必填项未填')
        this.onLoading = false
        this.$nextTick(() => {
          this.onLoading = true
        })
      }
    },
    noticeSure () {
      this.recommend.approveModal = true
    },
    // 附件上传成功
    uploadFileSuccess (response, file, fileList) {
      if (response.rel === true) {
        // 文件上传展示
        this.recommend.enclosure.push({
          enclosureUrl: staticUrl + '' + response.url,
          enclosureName: response.filename
        })
      } else {
        console.error(response.msg)
      }
    },
    // 审批
    toApprove () {
      if (this.recommend.applyReason !== '') {
        let sendData = {
          purpricetrue: this.recommend.purpricetrue,
          sendpricetrue: this.recommend.sendpricetrue,
          type: this.recommend.type,
          proposalRetain: this.recommend.proposalRetain,
          retain: this.recommend.retain,
          purchasePrice: this.recommend.purchasePrice,
          percentage: this.recommend.percentage,
          channelId: this.recommend.onlineChannel,
          settlementName: this.recommend.settlementName,
          id: this.recommend.currLinkId,
          Route: 'toAuditInform',
          approveId: this.recommend.approveId,
          applyReason: this.recommend.applyReason,
          enclosure: this.recommend.enclosure
        }
        this.$axios({
          url: baseUrl + '/recommend/determineApproval',
          method: 'post',
          data: sendData
        }).then(res => {
          if (res.data.code === 10000) {
            this.recommend.approveModal = false
            this.$Message.info(res.data.msg)
            this.getData()
          } else {
            this.recommend.approveModal = false
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.error(err)
        })
      } else {
        this.$Message.error('申请原因必填')
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      }
    },
    // 撤销
    revokeProduct (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>是否确认撤销申请？</p>',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.$axios({
            url: baseUrl + '/reward/undo',
            method: 'post',
            data: $qs.stringify({ tbcId: row.id })
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
    clearSearchHeader (text) {
      this.headerSearch = {
        commodityName: '',
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
.compareClasee{
    .compareHeader{
        border:1px solid #e8eaec;
        background-color: #f8f8f9;
        color: #515a6e;
        text-align: center;
    }
    .compareContentClass{
        border:1px solid #e8eaec;
        border-top:none;
        text-align: center;
        p{
            padding:3px;
            font-size: 12px;
        }
    }
}
.title {
    text-align: right;
    line-height: 30px;
    margin-right: 10px;
}

.require {
    font-size: 17px;
    color: red;
    position: relative;
    top: 5px;
    right: 3px;
}
.top{
    margin-top:5px;
}

.rowPadding {
    margin-bottom: 20px;
}

</style>
