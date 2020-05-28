<template>
<!--新增产品公司-->
<div class="cloudCooper">
    <Tabs value="1" tab="outTable" :animated="false">
        <TabPane label="产品公司" name="1">
            <!--公司信息 厂商为公司-->
            <Form ref="companyInfo" :model="companyInfo" :rules="ruleCompanyInfo">
                <div class="detailContent">
                    <Row class="rowPadding">
                        <Col span="12" offset="3" class="cardTitle">公司信息</Col>
                    </Row>
                    <!--商务 公司/个人-->
                    <Row class="rowPadding">
                        <Col span="3" offset="3" class="title">
                            <i class="require">*</i>商务：
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
                            <FormItem prop="companyType">
                                <Select v-model="companyInfo.companyType" clearable filterable @on-change = "choseCompanyType">
                                    <Option v-for="item  in companyInfo.companyTypeList" :value="item.id" :key="item.id">{{item.name}}</Option>
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
                            <FormItem prop="companyName">
                                <Input v-model="companyInfo.companyName" placeholder="请输入姓名" clearable filterable></Input>
                            </FormItem>
                        </Col>

                        <Col span="3" class="title">
                            <i class="require">*</i>身份证号：
                        </Col>
                        <Col span="5">
                            <FormItem prop="companyCard">
                                <Input v-model="companyInfo.companyCard" placeholder="请输入身份证号" clearable filterable></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <!--是个人  对方联系地址 详细地址-->
                    <Row class="rowPadding" v-if="person">
                        <Col span="3" offset="3" class="title">
                            <i class="require">*</i>对方联系地址：
                        </Col>
                        <Col span="5">
                            <FormItem prop="busicityList">
                            <div @click="getBusicity">
                                <Cascader :data="companyInfo.busicityListData"   change-on-select :load-data="loadData"  v-model="companyInfo.busicityList"></Cascader>
                            </div>
                            </FormItem>
                        </Col>

                        <Col span="3" class="title">
                            <i class="require">*</i>详细地址：
                        </Col>
                        <Col span="5">
                            <FormItem prop="detailedAddress">
                                <Input v-model="companyInfo.detailedAddress" placeholder="请输入详细地址" clearable filterable></Input>
                            </FormItem>
                        </Col>
                    </Row>
                        <!--是个人 区域类型-->
                    <Row class="rowPadding" v-if="person">
                        <Col span="3" offset="3" class="title">
                            <i class="require">*</i>区域类型：
                        </Col>
                        <Col span="5">
                            <FormItem prop="regionId">
                                <Select v-model="companyInfo.regionId" clearable filterable style="width:200px;margin-right: 5px;">
                                    <Option v-for="item in companyInfo.regionList" :value="item.id" :key="item.id">{{item.areaName}}</Option>
                                </Select>
                                <Button shape="circle" icon="ios-more" @click="setRegion"></Button>
                            </FormItem>
                        </Col>
                        <Col span="3" class="title">
                            <i class="require">*</i>客户等级：
                        </Col>
                        <Col span="5">
                            <FormItem prop="customType">
                                <Select v-model="companyInfo.customType" clearable filterable>
                                    <Option v-for="item in companyInfo.customTypeList" :value="item.id" :key="item.id">{{item.title}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <!--公司名称 对方联系地址-->
                    <Row class="rowPadding" v-if="!person">
                        <Col span="3" offset="3" class="title">
                            <i class="require">*</i>公司名称：
                        </Col>
                        <Col span="5">
                            <FormItem prop="companyName">
                                <Input v-model="companyInfo.companyName" placeholder="请输入公司名称" clearable filterable></Input>
                            </FormItem>
                        </Col>

                        <Col span="3" class="title">
                            <i class="require">*</i>对方联系地址：
                        </Col>
                        <Col span="5">
                            <FormItem prop="busicityList">
                                <div @click="getBusicity">
                                    <Cascader :data="companyInfo.busicityListData" change-on-select :load-data="loadData"  v-model="companyInfo.busicityList"></Cascader>
                                </div>
                            <!--

                                <div>
                                    <Select  @click="getAllProvinces" v-model="companyInfo.provinceId" clearable filterable style="width:100px;float:left;">
                                        <Option v-for="item in companyInfo.provinceList" :value="item.id" :key="item.id">{{item.name}}</Option>
                                    </Select>
                                    <Select v-model="companyInfo.cityId" clearable filterable style="width:100px;">
                                        <Option v-for="item in companyInfo.cityList" :value="item.id" :key="item.id">{{item.name}}</Option>
                                    </Select>
                                    <Select v-model="companyInfo.areaId" clearable filterable style="width:100px;">
                                        <Option v-for="item in companyInfo.areaList" :value="item.id" :key="item.id">{{item.name}}</Option>
                                    </Select>

                                </div>

                            -->
                            </FormItem>
                        </Col>
                    </Row>

                    <!--详细地址 区域类型-->
                    <Row class="rowPadding" v-if="!person">
                        <Col span="3" offset="3" class="title">
                            <i class="require">*</i>详细地址：
                        </Col>
                        <Col span="5">
                            <FormItem prop="detailedAddress">
                                <Input v-model="companyInfo.detailedAddress" placeholder="请输入详细地址" clearable filterable></Input>
                            </FormItem>
                        </Col>

                        <Col span="3" class="title">
                            <i class="require">*</i>区域类型：
                        </Col>
                        <Col span="6">
                            <FormItem prop="regionId">
                                <Select v-model="companyInfo.regionId" clearable filterable style="width:200px;margin-right: 5px;">
                                    <Option v-for="item in companyInfo.regionList" :value="item.id" :key="item.id">{{item.areaName}}</Option>
                                </Select>
                                <Button shape="circle" icon="ios-more" @click="setRegion"></Button>
                            </FormItem>
                        </Col>
                    </Row>

                    <!--公司性质-->
                    <Row class="rowPadding" v-if="!person">
                        <Col span="3" offset="3" class="title">
                            <i class="require">*</i>公司性质：
                        </Col>
                        <Col span="5">
                            <FormItem prop="corporateNature">
                                <Select v-model="companyInfo.corporateNature" clearable filterable>
                                    <Option v-for="item in companyInfo.corporateNatureList" :value="item.id" :key="item.id">{{item.name}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="3" class="title">
                            <i class="require">*</i>客户等级：
                        </Col>
                        <Col span="5">
                            <FormItem prop="customType">
                                <Select v-model="companyInfo.customType" clearable filterable>
                                    <Option v-for="item in companyInfo.customTypeList" :value="item.id" :key="item.id">{{item.title}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </Form>
            <!--联系人列表-->
            <div class="detailContent">
                <addContract @getContractMsg="getContractMsg" ></addContract>
            </div>
            <!--开票信息-->
            <div class="detailContent">
                <invoiceInfo @getInvoiceMsg="getInvoiceMsg"></invoiceInfo>
            </div>
            <!--主要业务-->
            <div class="detailContent">
                <Row class="rowPadding">
                    <Col span="12" offset="3" class="cardTitle">主要业务</Col>
                </Row>
                <!--业务名称 业务类型-->
                <Row class="rowPadding" v-for="(addItem,key) in mainBusi.busiTimes" :key="key">
                    <Col span="3" offset="3" class="title">
                        <i class="require">*</i>业务名称：
                    </Col>
                    <Col span="5">
                        <Input v-model="mainBusi.busiTimes[key].businessName" placeholder="请输入业务名称" clearable filterable></Input>
                    </Col>

                    <Col span="3" class="title">
                        <i class="require">*</i>业务类型：
                    </Col>
                    <Col span="7">
                        <Select v-model="mainBusi.busiTimes[key].businessType" clearable filterable style="width:200px;margin-right: 5px;">
                            <Option v-for="item in mainBusi.busTypeList" :value="item.id" :key="item.id">{{item.title}}</Option>
                        </Select>
                        <Button shape="circle" icon="ios-more" @click="setRegion" style="margin-right: 5px;"></Button>
                        <Button shape="circle" icon="md-add" @click="addBusi" style="margin-right: 5px;"></Button>
                        <Button v-if="mainBusi.busiTimes.length>=2" shape="circle" icon="md-remove" @click="removeBusi(key)"></Button>
                    </Col>
                </Row>
            </div>
            <!--备注-->
            <div class="detailContent">
                <Row class="rowPadding">
                    <Col span="12" offset="3" class="cardTitle">备注</Col>
                </Row>
                    <!--备注-->
                <Row class="rowPadding" >
                    <Col span="5" offset="4">
                        <Input v-model="mainBusi.text" type="textarea" placeholder="请输入备注" clearable style="width:750px"></Input>
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
                        <Icon type="ios-add-circle-outline" v-if="addTwoEntry" size="50" @click="showEntry=true" style="margin-top: 22px; color: #CCC; cursor: pointer;"/>
                        <div  v-else style="float: left;margin-right: 15px;">
                            <Icon type="ios-contacts" size="50" @click="showEntry=true" style="display: block;"></Icon>
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
                <Row class="rowPadding" >
                    <Col span="17" offset="4">
                        <Icon type="ios-add-circle-outline" size="50" @click="showNotice=true" style="margin-top: 22px; color: #CCC;"/>
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
                        <Button type="primary" @click="saveNewPro('companyInfo')">保存</Button>
                    </Col>
                </Row>
            </div>
        </TabPane>
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
import { phpURL, baseUrl } from '@/api/base.js'
import addContract from '../component/addContract'
import invoiceInfo from '../component/invoiceInfo'

export default {
  name: 'addProduct',
  components: {
    addContract,
    invoiceInfo
  },
  data () {
    return {
      showConfig: false, // 配置跳转弹框
      person: false, // 产品公司类型为个人
      showNotice: false, // 通知人弹窗
      showEntry: false,
      addTwoEntry: true,
      // 公司信息
      companyInfo: {
        businessId: '', // 商务id
        // incumbencyTbUser: [], // 商务列表
        companyType: '', // 公司或个人  1为公司2为个人
        companyTypeList: [{ id: '1', name: '公司' }, { id: '2', name: '个人' }],
        companyName: '', // 公司名称
        busicityList: [], // 对方联系地址
        busicityListData: [], // 对方联系地址地区联动数据
        provinceId: '',
        provinceList: [],
        cityId: '',
        cityList: [],
        areaId: '',
        areaList: [],
        detailedAddress: '', // 详细地址
        regionId: '', // 区域类型id
        regionList: [], // 区域类型list
        customType: '', // 公司等级
        customTypeList: [],
        corporateNature: '', // 公司性质 1为官方2为代理
        // corporateNatureList: [{id: '1', name: '官方'}, {id: '2', name: '代理'},{id:'3',name:'未知'}], // 公司性质列表
        companyCard: ''// 身份证号
      },
      // 公司信息表单验证规则
      ruleCompanyInfo: {
        businessId: [{ required: true, message: '必填项且搜索后选择哦' }],
        companyType: [{ required: true, message: '必填项哦' }],
        companyName: [{ required: true, message: '必填项哦' }],
        companyCard: [{ required: true, message: '必填项哦' }],
        busicityList: [{ required: true, message: '必填项哦' }],
        detailedAddress: [{ required: true, message: '必填项哦' }],
        regionId: [{ required: true, message: '必填项哦' }],
        customType: [{ required: true, message: '必填项哦' }],
        corporateNature: [{ required: true, message: '必填项哦' }]
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
          businessName: '', // 业务名称
          businessType: ' ' // 业务类型id
        }],
        businessName: '',
        businessType: ' ',
        busTypeList: [], // 业务类型list
        text: '', // 备注
        copier: [], // 抄送人id
        copierName: [], // 抄送人姓名 用于显示
        twoEntryId: [], // 通知人id
        twoEntryName: [], // 通知人姓名用于显示
        showTwoEntryName: [],
        showTwoEntryId: []
      }
    }
  },
  inject: ['app'],
  computed: {
    incumbencyTbUser () { // 在职人员
      return this.app.employees
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 获取初始数据
    getData () {
      // 公司性质
      this.$axios({
        url: phpURL + '/cloud/corporateNatureList',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.companyInfo.corporateNatureList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
      // 客户等级
      this.$axios({
        url: phpURL + '/cloud/customerLevelList',
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          this.companyInfo.customTypeList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err.data)
      })
      // 获取区域类型
      this.$axios({
        url: phpURL + '/cloud/areaList',
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          this.companyInfo.regionList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err.data)
      })

      // 业务类型
      this.$axios({
        url: phpURL + '/cloud/busTypeList',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.mainBusi.busTypeList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    getAllProvinces () {
      this.$axios({
        url: phpURL + '/cloud/getAllProvinces',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.companyInfo.provinceList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 获取对方联系地址
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
    // 产品公司选择 1为公司 2为个人
    choseCompanyType () {
      if (this.companyInfo.companyType === '1') {
        this.person = false
      } else if (this.companyInfo.companyType === '2') {
        this.person = true
      }
      this.companyInfo.companyCard = ''
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
      this.mainBusi.busiTimes.push({
        businessName: '', // 业务名称
        businessType: '' // 业务类型id
      })
    },
    // 删除一列主要业务
    removeBusi (key) {
      this.mainBusi.busiTimes.splice(key, 1)
    },
    // 按钮操作返回
    goBack () {
    //   bus.$emit('on-myclose', this.$route)
      this.$router.push({
        name: 'productCompany'
      })
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
      this.mainBusi.showCopierName = []
      this.mainBusi.showCopierId = []
      ids.map(item => {
        this.mainBusi.showCopierName.push(item.label)
        this.mainBusi.showCopierId.push(item.value)
      })
      this.mainBusi.showCopierName = Array.from(new Set(this.mainBusi.showCopierName))
      this.mainBusi.showCopierId = Array.from(new Set(this.mainBusi.showCopierId))
    },
    addCopier () {
      this.mainBusi.copier = this.mainBusi.showCopierId
      this.mainBusi.copierName = this.mainBusi.showCopierName
    },
    // 根据通知人id
    getEntryName (ids) {
      this.mainBusi.showTwoEntryName = ids.label
      this.mainBusi.showTwoEntryId = ids.value
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
      this.$refs.companyInfo.validate((valid) => {
        if (valid) {
        // 联系人都必填
          if (this.contacts.tabaleData.length >= 1) {
            if (this.companyInfo.companyType === '1') { // 是公司 开票信息必填
              if (this.invoice.tabaleData.length >= 1) {
                if (this.mainBusi.busiTimes[0].businessName !== '') {
                  let _c = this.companyInfo
                  let sendData = {
                  // 公司信息
                    tbcId: -1,
                    productCompany: {
                      businessId: _c.businessId,
                      companyType: _c.companyType,
                      companyName: _c.companyName,
                      companyCard: _c.companyCard,
                      busicityList: _c.busicityList,
                      detailedAddress: _c.detailedAddress,
                      regionId: _c.regionId,
                      customType: _c.customType,
                      corporateNature: _c.corporateNature,
                      busiTimes: this.mainBusi.busiTimes, // 业务名称
                      text: this.mainBusi.text // 备注
                    },
                    copier: this.mainBusi.copier, // 抄送人
                    twoEntryId: this.mainBusi.twoEntryId,
                    Route: 'waitConProduct',
                    // 联系人
                    contacts: this.contacts.tabaleData,
                    // 发票
                    invoice: this.invoice.tabaleData
                  }
                  this.$axios({
                    url: baseUrl + '/productCompany/insert',
                    method: 'post',
                    data: sendData
                  }).then(res => {
                    if (res.data.code === 10000) {
                      bus.$emit('on-myclose', this.$route)
                      this.$router.push({
                        name: 'productCompany'
                      })
                      this.$Message.info(res.data.msg)
                    } else if (res.data.code === 10105) {
                      this.$Message.error(res.data.msg)
                    } else {
                      this.$Message.error(res.data.msg)
                    }
                  }).catch(err => {
                    console.error(err)
                  })
                } else {
                  this.$Message.error('主要业务必填哦')
                }
              } else { // 是个人开票信息不是必填
                this.$Message.error('发票信息必填哦')
              }
            } else {
              if (this.mainBusi.busiTimes[0].businessName !== '') {
                let _c = this.companyInfo
                let sendData = {
                // 公司信息
                  tbcId: -1,
                  productCompany: {
                    businessId: _c.businessId,
                    companyType: _c.companyType,
                    companyName: _c.companyName,
                    companyCard: _c.companyCard,
                    busicityList: _c.busicityList,
                    detailedAddress: _c.detailedAddress,
                    regionId: _c.regionId,
                    customType: _c.customType,
                    corporateNature: _c.corporateNature,
                    busiTimes: this.mainBusi.busiTimes, // 业务名称
                    text: this.mainBusi.text // 备注
                  },
                  copier: this.mainBusi.copier, // 抄送人
                  twoEntryId: this.mainBusi.twoEntryId,
                  Route: 'waitConProduct',
                  // 联系人
                  contacts: this.contacts.tabaleData,
                  // 发票
                  invoice: this.invoice.tabaleData
                }
                this.$axios({
                  url: baseUrl + '/productCompany/insert',
                  method: 'post',
                  data: sendData
                }).then(res => {
                  if (res.data.code === 10000) {
                    this.$Message.info(res.data.msg)
                    bus.$emit('on-myclose', this.$route)
                    this.$router.push({
                      name: 'productCompany'
                    })
                  } else if (res.data.code === 10105) {
                    this.$Message.error(res.data.msg)
                  } else {
                    this.$Message.error(res.data.msg)
                  }
                }).catch(err => {
                  console.error(err)
                })
              } else {
                this.$Message.error('主要业务必填哦')
              }
            }
          } else {
            this.$Message.error('联系人必填哦')
          }
        } else {
          this.$Message.error('有必填项未填写哦')
        }
      })
    }
  }
}
</script>
<style lang="less">
#addContract{
    .ivu-modal{
        width: 800px !important;
    }
    .title{
        text-align: right;
        line-height: 30px;
        margin-right: 10px;
    }
    .require{
        font-size: 17px;
        color: red;
        position: relative;
        top: 5px;
        right: 3px;
    }
    .rowPadding{
        margin-bottom:20px;
    }
}
</style>
