<template>
<!--新增渠道公司-->
<div class="cloudCooper">
    <Tabs value="1" tab="outTable" :animated="false">
        <TabPane label="渠道公司" name="1">
            <!--渠道信息 厂商为公司-->
            <Form ref="companyInfo" :model="companyInfo" :rules="ruleCompanyInfo">
                <div class="detailContent">
                    <Row class="rowPadding">
                        <Col span="12" offset="3" class="cardTitle">渠道信息</Col>
                    </Row>
                    <!--市场 公司/个人-->
                    <Row class="rowPadding">
                        <Col span="3" offset="3" class="title">
                        <i class="require">*</i>市场：
                        </Col>
                        <Col span="5">
                        <FormItem prop="businessId">
                            <Select v-model="companyInfo.businessId" clearable filterable>
                                <Option v-for="person in incumbencyTbUser" :value="person.id" :key="person.id">{{person.nickname}}</Option>
                            </Select>
                        </FormItem>
                        </Col>

                        <Col span="3" class="title">
                        <i class="require">*</i>公司/个人：
                        </Col>
                        <Col span="5">
                        <FormItem prop="channelType">
                            <Select v-model="companyInfo.channelType" clearable filterable @on-change="choseCompanyType">
                                <Option v-for="item  in companyInfo.channelTypeList" :value="item.id" :key="item.id">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                    </Row>
                    <!--是个人  姓名 身份证号-->
                    <Row class="rowPadding" v-if="person">
                        <Col span="3" offset="3" class="title">
                        <i class="require">*</i>姓名：
                        </Col>
                        <Col span="5">
                        <FormItem prop="channelName" key="name">
                            <Input v-model="companyInfo.channelName" placeholder="请输入姓名" clearable filterable></Input>
                        </FormItem>
                        </Col>

                        <Col span="3" class="title">
                        <i class="require">*</i>身份证号：
                        </Col>
                        <Col span="5">
                        <FormItem prop="channelCard">
                            <Input v-model="companyInfo.channelCard" placeholder="请输入身份证号" clearable filterable></Input>
                        </FormItem>
                        </Col>
                    </Row>
                    <!--是个人  对方联系地址 详细地址-->
                    <Row class="rowPadding" v-if="person">
                        <Col span="3" offset="3" class="title">
                        对方联系地址：
                        </Col>
                        <Col span="5">
                        <FormItem prop="busicityList">
                            <!-- <Input v-model="companyInfo.busicityList" placeholder="请输入对方联系地址" clearable filterable></Input> -->
                            <Cascader :data="companyInfo.busicityListData" change-on-select :load-data="loadData" v-model="companyInfo.busicityList" @on-visible-change="getBusicity"></Cascader>
                        </FormItem>
                        </Col>

                        <Col span="3" class="title">
                        详细地址：
                        </Col>
                        <Col span="5">
                        <FormItem prop="detailedAddress">
                            <Input v-model="companyInfo.detailedAddress" placeholder="请输入详细地址" clearable filterable></Input>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row class="rowPadding" v-if="person">
                      <Col span="3" offset="3" class="title">
                        <i class="require">*</i>量级：
                        </Col>
                        <Col span="5">
                        <FormItem prop="magnitude">
                            <Select v-model="companyInfo.magnitude" clearable filterable style="width:200px">
                                <Option v-for="item in companyInfo.magnitudeList" :value="item.id" :key="item.id">{{item.title}}</Option>
                            </Select>
                            <Button shape="circle" icon="ios-more" @click="setRegion" style="margin-left: 5px;"></Button>
                        </FormItem>
                      </Col>
                    </Row>

                    <!--公司名称 对方联系地址-->
                    <Row class="rowPadding" v-if="!person">
                        <Col span="3" offset="3" class="title">
                        <i class="require">*</i>公司名称：
                        </Col>
                        <Col span="5">
                        <FormItem prop="channelName" key="channelName">
                            <Input v-model="companyInfo.channelName" placeholder="请输入公司名称" clearable filterable></Input>
                        </FormItem>
                        </Col>

                        <Col span="3" class="title">
                        对方联系地址：
                        </Col>
                        <Col span="5">
                        <FormItem prop="busicityList">
                            <!-- <Input v-model="companyInfo.busicityList" placeholder="请输入对方联系地址" clearable filterable></Input> -->
                            <Cascader :data="companyInfo.busicityListData" change-on-select :load-data="loadData" v-model="companyInfo.busicityList" @on-visible-change="getBusicity"></Cascader>
                        </FormItem>
                        </Col>
                    </Row>

                    <!--详细地址 区域类型-->
                    <Row class="rowPadding" v-if="!person">
                      <Col span="3" offset="3" class="title">
                      详细地址：
                      </Col>
                      <Col span="5">
                      <FormItem prop="detailedAddress">
                          <Input v-model="companyInfo.detailedAddress" placeholder="请输入详细地址" clearable filterable></Input>
                      </FormItem>
                      </Col>
                      <Col span="3" class="title">
                      <i class="require">*</i>量级：
                      </Col>
                      <Col span="5">
                      <FormItem prop="magnitude">
                          <Select v-model="companyInfo.magnitude" clearable filterable style="width:200px">
                              <Option v-for="item in companyInfo.magnitudeList" :value="item.id" :key="item.id">{{item.title}}</Option>
                          </Select>
                          <Button shape="circle" icon="ios-more" @click="setRegion" style="margin-left: 5px;"></Button>
                      </FormItem>
                      </Col>
                    </Row>
                </div>
            <!--联系人列表-->
            <div class="detailContent">
                <addContract @getContractMsg="getContractMsg"></addContract>
            </div>
            <!--开票信息-->
            <div class="detailContent">
                <invoiceInfo @getInvoiceMsg="getInvoiceMsg"></invoiceInfo>
            </div>
            <!--标签-->
            <div class="detailContent">
                <Row class="rowPadding">
                    <Col span="12" offset="3" class="cardTitle">标签</Col>
                </Row>
                <Row class="rowPadding" v-for="(addItem,index) in mainBusi.busiTimes" :key="index">
                    <Col span="3" offset="3" class="title">
                    一级标签：
                    </Col>
                    <Col span="5">
                        <Select v-model="mainBusi.busiTimes[index].oneLabel" clearable filterable style="width:200px;margin-right: 5px;" @on-change="getSecondTagFun(index,mainBusi.busiTimes[index])">
                            <Option v-for="item in mainBusi.getFirstTag" :value="item.id" :key="item.id">{{item.label}}</Option>
                        </Select>
                    </Col>
                    <Col span="3" class="title">
                    二级标签：
                    </Col>
                    <Col span="7">
                    <!-- <Select  v-model="mainBusi.busiTimes[index].twoLabel" clearable filterable style="width:200px;margin-right: 5px;">
                        <Option v-for="item in mainBusi.getSecondTag[index]" :value="item.id" :key="item.id">{{item.tagName}}</Option>
                    </Select> -->
                        <treeselect
                          :multiple="true"
                          :options="mainBusi.getSecondTag[index]"
                          placeholder="请选择二级标签"
                          v-model="mainBusi.busiTimes[index].twoLabel"
                          style="width:200px;float:left"
                        />
                        <span style="margin-left:5px;">
                        <Button shape="circle" icon="ios-more" @click="setRegion" style="margin-right: 5px;"></Button>
                        <Button shape="circle" icon="md-add" @click="addBusi" style="margin-right: 5px;"></Button>
                        <Button v-if="mainBusi.busiTimes.length>=2" shape="circle" icon="md-remove" @click="removeBusi(index)"></Button>
                        </span>
                    </Col>
                </Row>
                <Row class="rowPadding">
                    <Col span="3" offset="3" class="title" style="margin-top:25px;">
                    侧重标签：
                    </Col>
                    <Col span="5" style="margin-top:25px;">
                    <Select v-model="mainBusi.typeImps" multiple clearable filterable style="width:200px;margin-right: 5px;">
                        <Option v-for="item in mainBusi.emphasisTagList" :value="item.id" :key="item.id">{{item.title}}</Option>
                    </Select>
                    </Col>
                </Row>
            </div>
             <!-- 反向标签 -->
            <div class="detailContent">
                <Row class="rowPadding">
                    <Col span="12" offset="3" class="cardTitle">反向标签
                      <Tooltip content="设置反向标签后，该渠道将不会匹配反向标签对应的产品" placement="top" max-width='150' >
                        <span class='help'>
                          <Icon type="md-help-circle" style="color: grey;"/>
                        </span>
                      </Tooltip>
                    </Col>
                </Row>
                <div class="detailContent">
                    <Row v-for="(addItem,index) in mainBusi.reverseLabel" :key="index" class="rowPadding">
                    <Col span="3"  offset="3" class="title">
                      一级标签 :
                    </Col>
                    <Col span="5">
                        <Select v-model="mainBusi.reverseLabel[index].oneLabel" clearable filterable style="width:200px" @on-change="getSecondTagReverse(index,mainBusi.reverseLabel[index])" >
                        <Option v-for="item in mainBusi.getFirstTag" :value="item.id" :key="item.id">{{ item.label }}</Option>
                        </Select>
                    </Col>
                    <Col span="3" class="title">
                      二级标签 :
                    </Col>
                    <Col span="7">
                        <Select v-model="mainBusi.reverseLabel[index].twoLabel" clearable filterable style="width:200px">
                        <Option v-for="item in mainBusi.getSecondTagReverse[index]" :value="item.id" :key="item.id">{{ item.tagName }}</Option>
                        </Select>
                        <span style="cursor: pointer;margin-left: 5px;">
                        <Button shape="circle" icon="ios-more-outline" style="margin-right:5px;" @click="setRegion"></Button>
                        <Button shape="circle" icon="md-add" @click="addReverseLabel" style="margin-right:5px;"></Button>
                        <Button v-if="mainBusi.reverseLabel.length>=2" shape="circle" icon="md-remove" @click="removeReverseLabel(index)"></Button>
                        </span>
                    </Col>
                    </Row>
                </div>
            </div>
            </Form>
            <!--备注-->
            <div class="detailContent">
                <Row class="rowPadding">
                    <Col span="12" offset="3" class="cardTitle">备注</Col>
                </Row>
                <!--备注-->
                <Row class="rowPadding">
                    <Col span="5" offset="4">
                    <Input v-model="mainBusi.text" type="textarea" placeholder="请输入备注" clearable style="width:425px"></Input>
                    </Col>
                </Row>
            </div>
            <!--通知人-->
            <div class="detailContent">
                <Row class="rowPadding">
                    <Col span="12" offset="3" class="cardTitle">通知人</Col>
                </Row>
                <!--通知人-->
                <Row class="rowPadding" >
                    <Col span="17" offset="4">
                        <Icon type="ios-add-circle-outline" v-if="addTwoEntry" size="50" @click="showEntry=true" style="margin-top: 22px; color: #CCC;cursor: pointer;"/>
                        <div  v-else style="float: left;margin-right: 15px;">
                            <Icon type="ios-contacts"  @click="showEntry=true" size="50" style="display: block;"></Icon>
                            <p style="">{{this.mainBusi.twoEntryName+'  '||'通知人'}}</p>
                        </div>
                    </Col>
                </Row>
            </div>
            <!--抄送人-->
            <div class="detailContent">
                <Row class="rowPadding">
                    <Col span="12" offset="3" class="cardTitle">抄送人</Col>
                </Row>
                <!--抄送人-->
                <Row class="rowPadding">
                    <Col span="17" offset="4">
                        <Icon type="ios-add-circle-outline" size="50" @click="showNotice=true" style="margin-top: 22px;color: #CCC;"/>
                        <div  v-for="(item,index) in this.mainBusi.copierName" :key="index" style="float: left;margin-right: 15px;">
                            <Icon type="md-close" style="color: red; position: relative;left: 33px;top: 12px;cursor: pointer;" @click="deletCopier(index)"/>
                            <Icon type="ios-contacts" size="50" @click="showNotice=true" style="display: block;"></Icon>
                            <p style="">{{item+'  '||'抄送人'}}</p>
                        </div>
                    </Col>
                </Row>
            </div>
            <!--通知人弹窗-->
            <Modal  :mask-closable="false" id="addNotice" v-model="showEntry" title="通知人" @on-ok="ok">
                <Select :value="mainBusi.twoEntryId" filterable  :label-in-value="true" @on-change="getEntryName">
                    <Option v-for="person in incumbencyTbUser" :key="person.id" :value="person.id" :label="person.nickname">
                        <div>
                            <p>{{person.nickname}}</p>
                            <p>部门：{{person.deptName}}</p>
                            <p>职位：{{person.positionName}}</p>
                        </div>
                    </Option>
                </Select>
            </Modal>
            <!--抄送人弹窗-->
            <Modal  :mask-closable="false" id="addNotice" v-model="showNotice" title="抄送人" @on-ok="addCopier()">
                <Select :value="mainBusi.copier" filterable multiple :label-in-value="true" @on-change="getNoticeName">
                    <Option v-for="person in incumbencyTbUser" :key="person.id" :value="person.id" :label="person.nickname">
                        <div>
                            <p>{{person.nickname}}</p>
                            <p>部门：{{person.deptName}}</p>
                            <p>职位：{{person.positionName}}</p>
                        </div>
                    </Option>
                </Select>
            </Modal>
            <!--操作按钮-->
            <div class="detailContent">
                <Row class="rowPadding">
                    <Col span="12" offset="10">
                    <Button type="warning" @click="goBack" style="margin-right:30px">返回</Button>
                    <Button type="primary" @click="saveNewPro('companyInfo')" >保存</Button>
                    </Col>
                </Row>
            </div>
        </TabPane>
         <Spin size="large" fix v-if="showLoading"></Spin>
    </Tabs>
    <!-- 配置跳转弹框 -->
        <Modal
            v-model="showConfig"
            title="提示"
            @on-ok="goConfig">
            <p>当前信息未保存，是否确认前往到配置页面？</p>
        </Modal>
</div>
</template>

<script>
import {
  phpURL,
  baseUrl
} from '@/api/base.js'
import addContract from '../component/addContract'
import invoiceInfo from '../component/invoiceInfo'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'addchannel',
  components: {
    addContract,
    invoiceInfo,
    Treeselect
  },
  data () {
    return {
      showLoading: false, // 展示点击登录后保存按钮呈loading状态
      showConfig: false,
      person: false, // 产品公司类型为个人
      showNotice: false, // 通知人弹窗
      showEntry: false,
      addTwoEntry: true,
      // 公司信息
      companyInfo: {
        magnitude: '',
        magnitudeList: [], // 量级列表
        businessId: '', // 市场id
        incumbencyTbUser: [], // 市场列表
        channelType: '', // 公司或个人  1为公司2为个人
        channelTypeList: [{
          id: '1',
          name: '公司'
        }, {
          id: '2',
          name: '个人'
        }],
        channelName: '', // 公司名称
        busicityList: [], // 对方联系地址
        detailedAddress: '', // 详细地址
        channelCard: '', // 身份证号
        busicityListData: []
      },
      // 公司信息表单验证规则
      ruleCompanyInfo: {
        businessId: [{
          required: true,
          message: '市场是必填项哦'
        }],
        channelType: [{
          required: true,
          message: '公司/个人是必填项哦'
        }],
        channelName: [{
          required: true,
          message: '必填项哦'
        }],
        channelCard: [{
          required: true,
          message: '身份证是必填项哦'
        }],
        magnitude: [{
          required: true,
          message: '量级必填'
        }]
      },
      // 联系人列表
      contacts: {
        tabaleData: []
      },
      // 开票信息
      invoice: {
        tabaleData: []
      },
      // 主要业务
      mainBusi: {
        busiTimes: [{
          oneLabel: '', // 一级标签
          twoLabel: [] // 二级标签
        }],
        reverseLabel: [{
          oneLabel: '', // 一级标签
          twoLabel: '' // 二级标签
        }],
        // 标签
        getFirstTag: [], // 一级标签数组 他的modal值是 oneLabel
        getSecondTag: [], // 二级标签数组 他的modal值是 twoLabel
        getSecondTagReverse: [],
        typeImps: [], // 选中的侧重标签
        emphasisTagList: [], // 侧重标签列表数据
        oneLabel: '',
        twoLabel: '',
        text: '', // 备注
        copier: [], // 抄送人id
        copierName: [], // 抄送人姓名 用于显示
        twoEntryId: [], // 通知人id
        twoEntryName: [], // 通知人姓名用于显示
        showTwoEntryName: []
      }
    }
  },
  inject: ['app'],
  computed: {
    incumbencyTbUser () { //
      return this.app.employees
    }
  },
  mounted () {
    this.getData()
    this.getFirstTag()
  },
  methods: {
    getFirstTag () {
      this.$axios({
        url: baseUrl + '/tagConf/getOneLabel',
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          this.mainBusi.getFirstTag = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err.data)
      })
    },
    getBusicity () {
      // 获取省市区
      this.$axios({
        url: baseUrl + '/Auditing/province',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.companyInfo.busicityListData = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    loadData (item, callback) {
      item.loading = true
      setTimeout(() => {
        if (item.fcode === 0) {
          let sendData = {
            code: item.code,
            type: 1
          }
          this.$axios({
            url: baseUrl + '/Auditing/Busicity',
            method: 'post',
            data: $qs.stringify(sendData)
          }).then(res => {
            if (res.data.code === 10000) {
              item.children = res.data.content
            } else {
              this.$Message.error(res.data.msg)
            }
          }).catch(err => {
            console.error(err)
          })
        } else {
          let sendData = {
            code: item.code,
            type: 2
          }
          this.$axios({
            url: baseUrl + '/Auditing/BusicityTwo',
            method: 'post',
            data: $qs.stringify(sendData)
          }).then(res => {
            if (res.data.code === 10000) {
              item.children = res.data.content
            } else {
              this.$Message.error(res.data.msg)
            }
          }).catch(err => {
            console.error(err)
          })
        }

        item.loading = false
        callback()
      }, 10)
    },
    // 获取初始数据
    getData () {
      this.$axios({
        url: phpURL + '/cloud/magnitudeList',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.companyInfo.magnitudeList = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
      // 侧重标签
      this.$axios({
        url: phpURL + '/cloud/emphasisTagList',
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          this.mainBusi.emphasisTagList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err.data)
      })
    },
    // 根据一级标签获取二级标签
    getSecondTagFun (index, key) {
      let sendData = {
        id: key.oneLabel
      }
      this.$axios({
        url: baseUrl + '/tagConf/getTwoLabel',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.mainBusi.busiTimes[index].twoLabel = [res.data.content[0].id]
          this.$set(this.mainBusi.getSecondTag, index, res.data.content)
          this.mainBusi.getSecondTag[index] = res.data.content
        }
      }).catch(err => {
        console.log(err.data)
      })
    },
    getSecondTagReverse (index, key) {
      let sendData = {
        fid: key.oneLabel
      }
      this.$axios({
        url: phpURL + '/cloud/getSecondTag',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.$set(this.mainBusi.getSecondTagReverse, index, res.data.content)
          this.mainBusi.getSecondTagReverse[index] = res.data.content
        }
      }).catch(err => {
        console.log(err.data)
      })
    },
    // 产品公司选择
    choseCompanyType () {
      if (this.companyInfo.channelType === '1') {
        this.person = false
      } else if (this.companyInfo.channelType === '2') {
        this.person = true
      }
      this.companyInfo.channelCard = ''
    },
    // 跳转配置弹框
    setRegion () {
      this.showConfig = true
    },
    // 跳转到设置区域类型页面
    goConfig () {
      this.$router.push({
        name: 'cloudConfig'
      })
    },
    // 增加一列主要业务
    addBusi () {
      this.getFirstTag()
      this.mainBusi.busiTimes.push({
        oneLabel: '', // 业务名称
        twoLabel: [] // 业务类型id
      })
    },
    addReverseLabel () {
      // this.getFirstTag()
      this.mainBusi.reverseLabel.push({
        oneLabel: '',
        twoLabel: ''
      })
    },
    // 删除一列主要业务
    removeBusi (index) {
      this.mainBusi.busiTimes.splice(index, 1)
      this.mainBusi.getSecondTag.splice(index, 1)
    },
    // 删除一列反向标签
    removeReverseLabel (index) {
      this.mainBusi.reverseLabel.splice(index, 1)
    },
    // 按钮操作返回
    goBack () {
      bus.$emit('on-myclose', this.$route)
    },
    // 获取新增联系人组件中新增的数据
    getContractMsg (data) {
      this.contacts.tabaleData = data
    },
    // 获取新增开票信息组件中新增的数据
    getInvoiceMsg (data) {
      this.invoice.tabaleData = data
    },
    // 根据抄送人id 获得对应的抄送人name
    getNoticeName (ids) {
      let arrName = []
      let arrId = []
      ids.map(item => {
        arrName.push(item.label)
        arrId.push(item.value)
      })
      this.mainBusi.showCopierName = arrName
      this.mainBusi.showCopierId = arrId
      this.mainBusi.showCopierName = Array.from(new Set(this.mainBusi.showCopierName))
      this.mainBusi.showCopierId = Array.from(new Set(this.mainBusi.showCopierId))
    },
    addCopier () {
      this.mainBusi.copierName = this.mainBusi.showCopierName
      this.mainBusi.copier = this.mainBusi.showCopierId
    },
    // 根据通知人id 获得对应的通知人name
    getEntryName (ids) {
      this.mainBusi.showTwoEntryName = ids.label
      this.mainBusi.showTwoEntryId = ids.value
      // this.mainBusi.twoEntryName = ids.label
    },
    ok () {
      if (this.mainBusi.showTwoEntryName.length === 0) {
        this.mainBusi.twoEntryName = ''
      } else {
        this.addTwoEntry = false
        this.mainBusi.twoEntryName = this.mainBusi.showTwoEntryName
        this.mainBusi.twoEntryId = this.mainBusi.showTwoEntryId
      }
    },
    // 删除抄送人
    deletCopier (index) {
      this.mainBusi.copier.splice(index, 1)
      this.mainBusi.copierName.splice(index, 1)
    },
    // 保存所有信息
    saveNewPro (companyInfo) {
      this.showLoading = true
      this.$refs.companyInfo.validate((valid) => {
        if (valid) {
          // 判断标签必填 想偷个懒没有写form表单验证 嘻嘻嘻嘻
          if (this.contacts.tabaleData.length >= 1) {
            // 19.11.5 暂时隐藏二级标签
            // if (this.mainBusi.busiTimes[0].oneLabel !== '' && this.mainBusi.busiTimes[0].twoLabel !== '') {
            // if (this.mainBusi.busiTimes[0].oneLabel !== '') {
            let _c = this.companyInfo
            let sendData = {
              // 渠道信息
              tbcId: -1,
              productChannel: {
                businessId: _c.businessId,
                channelType: _c.channelType,
                channelName: _c.channelName,
                channelCard: _c.channelCard,
                busicityList: _c.busicityList,
                magnitude: _c.magnitude,
                detailedAddress: _c.detailedAddress,
                transfer: this.mainBusi.busiTimes, // 一级标签和二级标签 用的是产品公司的主要业务字段 注意
                reverseLabel: this.mainBusi.reverseLabel,
                typeImp: this.mainBusi.typeImps, // 侧重标签
                text: this.mainBusi.text // 备注
              },
              copier: this.mainBusi.copier, // 抄送人
              twoEntryId: this.mainBusi.twoEntryId,
              Route: 'waitConChannel',
              // 联系人
              contacts: this.contacts.tabaleData,
              // 发票
              invoice: this.invoice.tabaleData
            }
            this.$axios({
              url: baseUrl + '/productChannel/insert',
              method: 'post',
              data: sendData
            }).then(res => {
              if (res.data.code === 10000) {
                this.showLoading = false
                this.$Message.info(res.data.msg)
                bus.$emit('on-myclose', this.$route)
                this.$router.push({
                  name: 'channelCompany'
                })
              } else {
                this.$Message.error(res.data.msg)
                this.showLoading = false
              }
            }).catch(err => {
              console.error(err)
            })
            // } else {
            //   this.$Message.error('标签是必填的哦')
            // }
          } else {
            this.$Message.error('联系人列表必填')
          }
        } else {
          this.showLoading = false
          this.$Message.error('有必填项未填写哦')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
 .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
<style lang="less">
//增加通知人弹窗
#addNotice {
    .ivu-select-item-selected, .ivu-select-item-selected:hover{
        color:#19aa8d;
    }
    .ivu-modal-footer Button:first-child {
        color: #19aa8d;
        background-color: #fff;
        border-color: #19aa8d;
    }

    //选择框
    .ivu-select-selection:hover {
        border-color: #19AA8D;
        outline: none;
    }

    .ivu-select-selection:focus {
        border-color: #19AA8D;
        outline: none;
        box-shadow: none;
    }

    .ivu-select-visible .ivu-select-selection {
        border-color: #19AA8D;
        outline: none;
        box-shadow: none;
    }

    .ivu-select-multiple .ivu-select-item-selected {
        color: #19aa8d;
        background: #fff;
    }

    .ivu-select-multiple .ivu-select-item-selected:after {
        color: #19aa8d;
    }

}

//增加联系人弹窗
#addContract {
    .ivu-modal {
        width: 800px !important;
    }

    .ivu-modal-footer Button:first-child {
        color: #19aa8d;
        background-color: #fff;
        border-color: #19aa8d;
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

    .rowPadding {
        margin-bottom: 20px;
    }

    //输入框
    .ivu-input:hover {
        border-color: #19AA8D;
    }

    .ivu-input:focus {
        border-color: #19AA8D;
        outline: 0;
        box-shadow: none;
    }
}
</style>
<style lang="less">
  .vue-treeselect__multi-value-item{
    display: inline-table;
    font-size: 12px;
    vertical-align: top;
    color: #515a6e;
    padding: 0 8px;
    border: 1px solid #e8eaec;
    border-radius: 3px;
    background: #f7f7f7;
    font-size: 12px;
    vertical-align: middle;
    opacity: 1;
    overflow: hidden;
    cursor: pointer;
    height: 24px;
  }
.vue-treeselect__value-remove{
    color: #515a6e;
    padding-left: 5px;
    border-left:none;
    line-height: 0;
}
</style>
