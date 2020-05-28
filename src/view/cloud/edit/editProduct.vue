<template>
<!--编辑产品公司-->
    <div class="cloudCooper">
        <Tabs value="1" tab="outTable" :animated="false">
            <TabPane label="产品公司" name="1">
                <!--公司信息 厂商为公司-->
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
                            <Select v-model="companyInfo.businessId" clearable filterable>
                                <Option v-for="person in incumbencyTbUser" :value="person.id" :key="person.id">{{person.nickname}}</Option>
                            </Select>
                        </Col>

                        <Col span="3" class="title">
                            <i class="require">*</i>公司/个人：
                        </Col>
                        <Col span="5">
                            <Select v-model="companyInfo.companyType" clearable filterable @on-change = "choseCompanyType">
                                <Option v-for="item  in companyInfo.companyTypeList" :value="item.id" :key="item.id">{{item.name}}</Option>
                            </Select>
                        </Col>
                    </Row>
                    <!--是个人  姓名 身份证号-->
                    <Row class="rowPadding" v-if="person">
                        <Col span="3" offset="3" class="title">
                            <i class="require">*</i>姓名：
                        </Col>
                        <Col span="5">
                            <Input v-model="companyInfo.companyName" placeholder="请输入姓名" clearable filterable></Input>
                        </Col>

                        <Col span="3" class="title">
                            <i class="require">*</i>身份证号：
                        </Col>
                        <Col span="5">
                            <Input v-model="companyInfo.companyCard" placeholder="请输入身份证号" clearable filterable></Input>
                        </Col>
                    </Row>
                     <!--是个人  对方联系地址 详细地址-->
                    <Row class="rowPadding" v-if="person">
                        <Col span="3" offset="3" class="title">
                            <i class="require">*</i>对方联系地址：
                        </Col>
                        <Col span="5">
                            <div>
                                <Cascader :data="companyInfo.busicityListData" change-on-select :load-data="loadData" v-model="companyInfo.busicityList"></Cascader>
                            </div>
                        </Col>

                        <Col span="3" class="title">
                            <i class="require">*</i>详细地址：
                        </Col>
                        <Col span="5">
                            <Input v-model="companyInfo.detailedAddress" placeholder="请输入详细地址" clearable filterable></Input>
                        </Col>
                    </Row>
                    <Row class="rowPadding" v-if="person">
                        <Col span="3" offset="3" class="title">
                            <i class="require">*</i>客户等级：
                        </Col>
                        <Col span="5">
                            <Select v-model="companyInfo.customType" clearable filterable>
                                <Option v-for="item in companyInfo.customTypeList" :value="item.id" :key="item.id">{{item.title}}</Option>
                            </Select>
                        </Col>
                    </Row>

                    <!--公司名称 对方联系地址-->
                    <Row class="rowPadding" v-if="!person">
                        <Col span="3" offset="3" class="title">
                            <i class="require">*</i>公司名称：
                        </Col>
                        <Col span="5">
                            <Input v-model="companyInfo.companyName" placeholder="请输入公司名称" clearable filterable></Input>
                        </Col>

                        <Col span="3" class="title">
                            <i class="require">*</i>对方联系地址：
                        </Col>
                        <Col span="5">
                            <div>
                                <Cascader :data="companyInfo.busicityListData" change-on-select :load-data="loadData" v-model="companyInfo.busicityList"></Cascader>
                            </div>
                        </Col>
                    </Row>

                    <!--详细地址 区域类型-->
                    <Row class="rowPadding" v-if="!person">
                        <Col span="3" offset="3" class="title">
                            <i class="require">*</i>详细地址：
                        </Col>
                        <Col span="5">
                            <Input v-model="companyInfo.detailedAddress" placeholder="请输入详细地址" clearable filterable></Input>
                        </Col>

                        <Col span="3" class="title">
                            <i class="require">*</i>区域类型：
                        </Col>
                        <Col span="6">
                            <Select v-model="companyInfo.regionId" clearable filterable style="width:200px;margin-right: 5px;">
                                <Option v-for="item in companyInfo.regionList" :value="item.id" :key="item.id">{{item.areaName}}</Option>
                            </Select>
                            <Button shape="circle" icon="ios-more" @click="setRegion"></Button>
                        </Col>
                    </Row>

                    <!--公司性质-->
                    <Row class="rowPadding" v-if="!person">
                        <Col span="3" offset="3" class="title">
                            <i class="require">*</i>公司性质：
                        </Col>
                        <Col span="5">
                            <Select v-model="companyInfo.corporateNature" clearable filterable>
                                <Option v-for="item in companyInfo.corporateNatureList" :value="item.id" :key="item.id">{{item.name}}</Option>
                            </Select>
                        </Col>
                        <Col span="3" class="title">
                            <i class="require">*</i>客户等级：
                        </Col>
                        <Col span="5">
                            <Select v-model="companyInfo.customType" clearable filterable>
                                <Option v-for="item in companyInfo.customTypeList" :value="item.id" :key="item.id">{{item.title}}</Option>
                            </Select>
                        </Col>
                    </Row>
                </div>

                <!--联系人列表-->
                <div class="detailContent">
                    <addContract @getContractMsg="getContractMsg" :contractData="contractData"></addContract>
                </div>
                <!--开票信息-->
                <div class="detailContent">
                    <invoiceInfo @getInvoiceMsg="getInvoiceMsg" :invoiceData = "invoiceData"></invoiceInfo>
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
                            <Icon type="ios-add-circle-outline" v-if="addTwoEntry" size="50" @click="showEntry=true" style="margin-top: 22px; color: #CCC;cursor: pointer;"/>
                            <div  v-else style="float: left;margin-right: 15px;">
                                <Icon type="ios-contacts" size="50" style="display: block;" @click="showEntry=true"></Icon>
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
                        <Col span="5" offset="4">
                            <div  v-for="(item,index) in this.mainBusi.copierName" :key="index" style="float: left;margin-right: 15px;">
                                <Icon type="md-close" style="color: red; position: relative;left: 33px;top: 12px;cursor: pointer;" @click="deletCopier(index)"/>
                                <Icon type="ios-contacts" size="50" @click="showNotice=true" style="display: block;"></Icon>
                                <p style="">{{item+'  '||'抄送人'}}</p>
                            </div>
                            <Icon type="ios-add-circle-outline" size="50" @click="showNotice=true" style="margin-top: 22px; color: #CCC;"/>
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
                <Modal id="addNotice" :mask-closable="false" v-model="showNotice" title="抄送人" @on-ok="addCopier()">
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
                            <Button type="primary" @click="saveNewPro">保存</Button>
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
      showNotice: false, // 通知人弹窗
      showEntry: false,
      addTwoEntry: true,
      contractData: [], // 接受联系人子组件来的表格数据
      invoiceData: [], // 接受开票信息子组件来的表格数据
      companyInfoBack: {}, // 公司信息备份
      contactsBack: {}, // 联系人列表备份
      invoiceBack: {}, // 开票信息备份
      mainBusiBack: {}, // 主要业务备份
      person: false, // 产品公司类型为个人
      // 公司信息
      companyInfo: {
        businessId: '', // 商务id
        // incumbencyTbUser: [], // 商务列表
        companyType: '', // 公司或个人  1为公司2为个人
        companyTypeList: [],
        companyName: '', // 公司名称
        busicityList: [], // 对方联系地址
        busicityListData: [],
        detailedAddress: '', // 详细地址
        regionId: '', // 区域类型id
        regionList: [], // 区域类型list
        customType: '',
        customTypeList: [],
        corporateNature: '', // 公司性质 1为官方2为代理
        corporateNatureList: [], // 公司性质列表
        companyCard: ''// 身份证号
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
          businessType: '' // 业务类型id
        //   businessTypeName: ''// 业务类型名称
        }],
        businessName: '',
        businessType: '',
        // businessTypeName: '',// 业务类型名称
        busTypeList: [], // 业务类型list
        text: '', // 备注
        copier: [], // 抄送人id
        copierName: [], // 抄送人姓名 用于显示
        twoEntryId: [], // 通知人id
        twoEntryName: []// 通知人姓名用于显示
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
    this.getEchoData()
  },
  watch: {
    $route (to, from) {
      this.init()
    }
  },
  methods: {
    init () {
      this.getData()
      this.getEchoData()
    },
    // 获取初始数据
    getData () {
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
      // 公司/个人
      this.$axios({
        url: phpURL + '/cloud/companyTypeList',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.companyInfo.companyTypeList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
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
    // 回显数据
    getEchoData () {
      let sendData = {
        productCompanyId: this.$route.query.productCompanyId
      }
      this.$axios({
        url: baseUrl + '/productCompany/info',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          // 公司信息
          let _c = this.companyInfo
          let _p = res.data.content.productCompany
          let _con = res.data.content
          _c.businessId = _p.businessId
          _c.companyType = _p.companyType
          this.choseCompanyType()
          _c.companyName = _p.companyName
          _c.busicityList = _p.busicityList
          _c.detailedAddress = _p.detailedAddress
          _c.regionId = _p.regionId
          _c.customType = _p.customType
          _c.corporateNature = _p.corporateNature
          _c.companyCard = _p.companyCard
          //   if (_c.businessId === 1) {
          //     this.person = false
          //   } else {
          //     this.person = true
          //   }
          // 联系人列表
          this.contractData = _con.contacts
          let sendContractData = {
            type: '1',
            productCompanyId: this.$route.query.productCompanyId,
            contacts: this.contractData
          }
          this.$axios({
            url: baseUrl + '/productCompany/insertContacts',
            method: 'post',
            data: sendContractData
          }).then(res => {
            if (res.data.code === 10000) {
              this.contractData = res.data.content
            } else {
              this.$Message.error(res.data.msg)
            }
          }).catch(err => {
            console.error(err)
          })
          // 开票信息
          this.invoiceData = _con.invoices
          let sendData = {
            type: '1',
            productCompanyId: this.$route.query.productCompanyId,
            invoice: this.invoiceData
          }
          this.$axios({
            url: baseUrl + '/productCompany/insertInvoice',
            method: 'post',
            data: sendData
          }).then(res => {
            if (res.data.code === 10000) {
              this.invoiceData = res.data.content
            } else {
              this.$Message.error(res.data.msg)
            }
          }).catch(err => {
            console.error(err)
          })
          // 主要业务
          this.mainBusi.busiTimes = _p.busiTimes
          // 编辑时若没有数据则手动添加一行
          if (this.mainBusi.busiTimes.length === 0) {
            this.addBusi()
          }
          // 备注
          this.mainBusi.text = _p.text
          // 抄送人
          // this.mainBusi.copier = _p.copier
          // this.mainBusi.copierName = _p.copierName
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 产品公司选择
    choseCompanyType () {
      (this.companyInfo.companyType === 2) ? this.person = true : this.person = false
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
        businessType: ''
        // businessTypeName:''
      })
    },
    // 删除一列主要业务
    removeBusi (key) {
      this.mainBusi.busiTimes.splice(key, 1)
    },
    // 按钮操作返回
    goBack () {
      bus.$emit('on-myclose', this.$route)
      this.$router.push({
        name: 'productCompany'
      })
    },
    // 获取新增联系人组件中新增的数据   那最开始带的数据要怎么处理呢
    getContractMsg (data) {
      this.contractData = data
    },
    // 获取新增开票信息组件中新增的数据
    getInvoiceMsg (data) {
      this.invoiceData = data// 外层调用组件方法注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
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
      this.mainBusi.copierName = this.mainBusi.showCopierName
      this.mainBusi.copier = this.mainBusi.showCopierId
    },
    // 根据通知人id
    getEntryName (ids) {
      this.mainBusi.showTwoEntryName = ids.label
      this.mainBusi.showTwoEntryId = ids.value
      // this.mainBusi.twoEntryName = ids.label
    },
    ok () {
      if (this.mainBusi.showTwoEntryName === undefined) {
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
    saveNewPro () {
      let _c = this.companyInfo
      let sendData = {
        // 公司信息
        tbcId: -1,
        productCompany: {
          productCompanyId: this.$route.query.productCompanyId,
          // tbcId: -1,
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
        copier: this.mainBusi.copier, //
        twoEntryId: this.mainBusi.twoEntryId,
        Route: 'waitConProduct',
        // 联系人
        contacts: this.contractData,
        // 发票
        invoice: this.invoiceData
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
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    }
  }
}
</script>
<style lang="less">
//增加通知人弹窗
#addNotice{
    .ivu-modal-footer Button:first-child{
        color: #19aa8d;
        background-color: #fff;
        border-color: #19aa8d;
    }
    //选择框
    .ivu-select-selection:hover {
        border-color: #19AA8D;
        outline:none;
    }
    .ivu-select-selection:focus {
        border-color: #19AA8D;
        outline: none;
        box-shadow:none;
    }
    .ivu-select-visible .ivu-select-selection{
        border-color: #19AA8D;
        outline: none;
        box-shadow:none;
    }
    .ivu-select-multiple .ivu-select-item-selected {
        color: #19aa8d;
        background: #fff;
    }
    .ivu-select-multiple .ivu-select-item-selected:after{
        color: #19aa8d;
    }

}
//增加联系人弹窗
#addContract{
    .ivu-modal{
        width: 800px !important;
    }
    .ivu-modal-footer Button:first-child{
        color: #19aa8d;
        background-color: #fff;
        border-color: #19aa8d;
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
    //输入框
    .ivu-input:hover {
        border-color: #19AA8D;
    }
    .ivu-input:focus {
        border-color: #19AA8D;
        outline: 0;
        box-shadow:none;
    }
}
</style>
<style lang="less" scoped>

</style>
