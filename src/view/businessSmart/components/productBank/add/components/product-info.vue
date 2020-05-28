<template>
  <div class="viewWrapper" style="overflow: visible;">
    <Form :model="productInfo" :rules="rulesProduct" ref="productInfoForm">
      <Row class="rowPadding">
        <Col span="2" offset="2" class="title">
          <i class="require">*</i><span>产品名称：</span>
        </Col>
        <Col span="5">
        <FormItem prop="productName">
          <Input
            v-model="productInfo.productName"
            placeholder="潜在客户必填字段"
            maxlength="50"
            show-word-limit
            :clearable="closeIcon.productName"
            @mouseover.native="showClearable('productName')"
            @mouseout.native="hiddenClearable('productName')"
          />
        </FormItem>
        </Col>
        <Col span="4" offset="2" class="title">
          <span>来源：</span>
        </Col>
        <Col span="5">
          <!-- <Custom :customSettingList="customSettingList" @on-show-dropdownmenu="showList"  type="002001" placeholder="潜在客户必填字段"/> -->
          <FormItem  :error="errors('productSource')" :show-message="false">
            <Select v-model="productInfo.productSource"  filterable  placeholder="潜在客户必填字段" clearable @on-change="(value) => openCustom(value, 'productSource')">
            <Option v-for="item  in sourceList" :value="item.tagName" :key="item.id" class="customSty"><span style="height: 1px; width:41%; background: #ccc;margin-top:8px;float:left ;" v-if="item.id === -2"></span> {{item.tagName}}<span style="height: 1px; width:41%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span></Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row class="rowPadding" v-if="isPerson">
        <!-- 公司选公司 -->
        <Col span="2" offset="2" class="title">
          <span>公司/个人：</span>
        </Col>
        <Col span="5">
        <FormItem :error="errors('productIscompany')" :show-message="false">
          <Select v-model="productInfo.productIscompany"  filterable @on-change="choseCompanyType" placeholder="待联系必填字段"  >
            <Option v-for="item  in companyOrPersonList" :value="item.name" :key="item.id" class="customSty"><span style="height: 1px;width: 40%; background: #ccc;margin-top:8px;float:left ;" v-if="item.id === -2"></span> {{item.name}}<span style="height: 1px;width:41%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span></Option>
          </Select>
        </FormItem>
        </Col>
        <Col span="4" offset="2" class="title">
          <span>公司名称：</span>
        </Col>
        <Col span="5">
        <FormItem  :error="errors('companyName')" :show-message="false">
          <Input
            v-model="productInfo.companyName"
            placeholder="待联系必填字段"
            @on-change='changeCompany()'
            maxlength="50"
            show-word-limit
            :clearable="closeIcon.companyName"
            @mouseover.native="showClearable('companyName')"
            @mouseout.native="hiddenClearable('companyName')"
          />
        </FormItem>
        </Col>
      </Row>
      <Row class="rowPadding" v-if="isPerson">
        <Col span="2" offset="2" class="title">
          <span>公司性质：</span>
        </Col>
        <Col span="5">
          <FormItem  :error="errors('companyNature')" :show-message="false">
          <Select v-model="productInfo.companyNature"  filterable @on-change="(value) => openEasyTask(value, 'companyNature')" placeholder="待联系必填字段" clearable >
            <Option v-for="item  in companynature" :value="item.name" :key="item.id" class="customSty">
              <span style="height: 1px; width:41%; background: #ccc;margin-top:8px;float:left ;" v-if="item.id === -2"></span> {{item.name}}<span style="height: 1px; width:41%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span>
            </Option>
          </Select>
          </FormItem>
        </Col>
        <Col span="4" offset="2" class="title">
          <span>联系地址：</span>
        </Col>
        <Col span="5">
          <FormItem  :error="errors('contactAddress')" :show-message="false">
            <Input v-model="productInfo.contactAddress" placeholder="建立联系必填字段"  @on-change='toBrother' maxlength="200" show-word-limit />
          </FormItem>
        </Col>
      </Row>
      <!-- 公司选个人 -->
      <Row class="rowPadding" v-if="!isPerson">
        <Col span="2" offset="2" class="title">
          <span>公司/个人：</span>
        </Col>
        <Col span="5">
        <FormItem  :error="errors('productIscompany')" :show-message="false">
          <Select v-model="productInfo.productIscompany"  filterable @on-change="(value) => choseCompanyType(value, 'productIscompany')" placeholder="待联系必填字段"  >
            <Option v-for="item  in companyOrPersonList" :value="item.name" :key="item.id" class="customSty"><span style="height: 1px; width:41%; background: #ccc;margin-top:8px;float:left ;" v-if="item.id === -2"></span> {{item.name}}<span style="height: 1px; width:41%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span></Option>
          </Select>
        </FormItem>
        </Col>
        <Col span="4" offset="2" class="title">
          <span>姓名：</span>
        </Col>
        <Col span="5">
        <FormItem  :error="errors('userName')" :show-message="false">
          <Input v-model="productInfo.userName" placeholder="潜在客户必填字段"  maxlength="20" show-word-limit />
        </FormItem>
        </Col>
      </Row>
      <Row class="rowPadding" v-if="!isPerson">
        <Col span="2" offset="2" class="title">
          <span>身份证：</span>
        </Col>
        <Col span="5">
          <FormItem  :error="errors('idCard')" :show-message="false">
            <Input v-model="productInfo.idCard" placeholder="建立联系必填字段"   clearable maxlength="20" show-word-limit />
          </FormItem>
        </Col>
        <Col span="4" offset="2" class="title">
          <span>联系地址：</span>
        </Col>
        <Col span="5">
          <FormItem  :error="errors('contactAddress')" :show-message="false">
            <Input v-model="productInfo.contactAddress" placeholder="建立联系必填字段"  @on-change='toBrother' clearable maxlength="200" show-word-limit />
          </FormItem>
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="2" offset="2" class="title">
          <span>客户等级：</span>
        </Col>
        <Col span="5">
          <FormItem  :error="errors('customerLevel')" :show-message="false">
            <Select v-model="productInfo.customerLevel"  filterable @on-change="(value) => openCustom(value, 'customerLevel')" placeholder="建立联系必填字段" clearable >
              <Option v-for="item  in clientLevelList" :value="item.tagName" :key="item.id" class="customSty">
                <span style="height: 1px; width:41%; background: #ccc;margin-top:8px;float:left ;" v-if="item.id === -2"></span> {{item.tagName}}<span style="height: 1px; width:41%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span>
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="4" offset="2" class="title">
          <span>控量：</span>
        </Col>
        <Col span="5">
          <FormItem prop="controlVolume">
            <Select v-model="productInfo.controlVolume"  filterable @on-change="control" placeholder="建立联系必填字段"  >
              <Option v-for="item  in controlQuantityList" :value="item.name" :key="item.id"> {{item.name}}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row class="rowPadding" v-if="isNum">
        <Col span="2" offset="2" class="title">
          <span>数量：</span>
        </Col>
        <Col span="5">
          <FormItem  prop="number" :error="errors('number')" :show-message="true">
            <Input v-model="productInfo.number"  clearable  placeholder="建立联系必填字段" maxlength="11" show-word-limit />
          </FormItem>
        </Col>
        <Col span="4" offset="2" class="title">
          <span>预算(元)：</span>
        </Col>
        <Col span="5">
          <FormItem  prop="budget" :error="errors('budget')" :show-message="true">
            <Input v-model="productInfo.budget" placeholder="建立联系必填字段" clearable  maxlength="100" show-word-limit />
          </FormItem>
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="2" offset="2" class="title">
          <span>结算周期：</span>
        </Col>
        <Col span="5">
          <FormItem  :error="errors('settlementCycles')" :show-message="false">
            <Select v-model="productInfo.settlementCycles"  filterable @on-change="control" placeholder="建立联系必填字段" clearable >
              <Option v-for="item  in settlementCyclesList" :value="item.name" :key="item.id"> {{item.name}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="4" offset="2" class="title">
          <span>结算方式：</span>
        </Col>
        <Col span="5">
          <FormItem  :error="errors('settlementMethod')" :show-message="false">
            <Select v-model="productInfo.settlementMethod"  filterable @on-change="(value) => openEasyTask(value, 'settlementMethod')" placeholder="建立联系必填字段" clearable >
              <Option v-for="item  in settlementList" :value="item.name" :key="item.id" class="customSty">
                <span style="height: 1px; width:41%; background: #ccc;margin-top:8px;float:left;" v-if="item.id === -2"></span> {{item.name}}<span style="height: 1px; width:40%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span>
              </Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="2" offset="2" class="title">
          <span>充值款项(元)：</span>
        </Col>
        <Col span="5">
          <FormItem  prop="advancePayment"  class="errors('advancePayment')">
            <Input
              v-model="productInfo.advancePayment"
              placeholder="建立联系必填字段"
              maxlength="100"
              show-word-limit
              :clearable="closeIcon.advancePayment"
              @mouseover.native="showClearable('advancePayment')"
              @mouseout.native="hiddenClearable('advancePayment')"
            />
          </FormItem>
        </Col>
        <Col span="4" offset="2" class="title">
          <span>付款方式：</span>
        </Col>
        <Col span="5">
          <FormItem  :error="errors('paymentMethod')" :show-message="false">
            <Select v-model="productInfo.paymentMethod"  filterable @on-change="(value) => openEasyTask(value, 'paymentMethod')" placeholder="建立联系必填字段"  clearable>
              <Option v-for="item  in payMethodList" :value="item.name" :key="item.id" class="customSty"><span style="height: 1px;width: 41%; background: #ccc;margin-top:8px;float:left;" v-if="item.id === -2"></span> {{item.name}}<span style="height: 1px;width: 40%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span></Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="2" offset="2" class="title">
          <span>商务：</span>
        </Col>
        <Col span="5">
          <FormItem  :error="errors('businessAffairs')" :show-message="false">

            <!-- <Select v-model="productInfo.businessAffairs" clearable filterable  :label-in-value="true" placeholder="已合作必填字段" @on-change="changeBusinessAffairs" >
              <Option v-for="item in incumbencyTbUser" :value="item.nickname" :key="item.id">{{item.nickname}}</Option>
            </Select> -->

            <TreeSelectVue
              :options="treeoptions"
              :multiple="false"
              :disableBranchNodes="true"
              :value="businessPeople"
              value-format="object"
              @input="handleInputChange"
            >
            </TreeSelectVue>
            <!-- onInput={(value) => {
                if (!value) {
                  value = {}
                } else {
                  this.detailHeader.businessAffairs = value
                }
                this.getData({ businessAffairs: value.label, currPage: 1 })
              }} -->

          </FormItem>
        </Col>
        <Col span="4" offset="2" class="title" v-if="!productInfo.businessAffairs">
          <span>未合作原因：</span>
        </Col>
        <Col span="5" v-if="!productInfo.businessAffairs">
          <!-- <Custom :customSettingList="customSettingList" @on-show-dropdownmenu="showList"  type="008" placeholder="建立联系必填字段"/> -->
          <FormItem  :error="errors('notCooperationReasons')" :show-message="false">
            <Select v-model="productInfo.notCooperationReasons"  filterable   placeholder="建立联系必填字段" clearable @on-change="(value) => openCustom(value, 'notCooperationReasons')">
              <Option v-for="item in notCooperationReasonsList" :value="item.tagName" :key="item.id" class="customSty"><span style="height: 1px; width:41%; background: #ccc;margin-top:8px;float:left ;" v-if="item.id === -2"></span> {{item.tagName}}<span style="height: 1px; width:41%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span></Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="4" offset="2" class="title" v-if="productInfo.businessAffairs">
          <span>流失反馈：</span>
        </Col>
        <Col span="5" v-if="productInfo.businessAffairs">
        <!-- <Custom :customSettingList="customSettingList" @on-show-dropdownmenu="showList"  type="009" placeholder="流失客户必填部分"/> -->
          <FormItem  :error="errors('lossFeedback')" :show-message="false">
            <Select v-model="productInfo.lossFeedback"  filterable   placeholder="流失客户必填部分" clearable @on-change="(value) => openCustom(value, 'lossFeedback')">
              <Option v-for="item in lossFeedbackList" :value="item.tagName" :key="item.id" class="customSty"><span style="height: 1px; width:41%; background: #ccc;margin-top:8px;float:left ;" v-if="item.id === -2"></span> {{item.tagName}}<span style="height: 1px; width:41%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span></Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Modal v-model="showWarn" title="提醒" @on-ok="ensure">
        <p class="warn">该字段涉及逻辑和页面开发，是否发简易任务告知产品经理您的新需求</p>
      </Modal>
      <div v-if="showLaunch">
        <launch-task :show="showLaunch" @hideTask="hide"></launch-task>
      </div>
      <!-- <Custom-modal
        @on-custom-cancel="cancel"
        @on-modal-data="modalData"
        :show="showSource"
        :keys="customType"
        :customList="customList"></Custom-modal> -->
        <!-- <Modal  -->
    </Form>
    <Modal v-model="showToConfig" width="360" @on-ok="toConfig" @on-cancel="notToConfig">
      <p slot="header" style="color:#FF9900;margin-left:3%;font-size:16px;font-weight:900;">
        <Icon type="ios-information-circle"></Icon>
        <span>提醒</span>
      </p>
      <div style="margin-left:5%;font-size:14px;">
        <p>即将跳转到业务配置自定义您的需求。</p>
        <p>是否跳转？</p>
      </div>
    </Modal>
  </div>
</template>
<script>

// import Custom from '../../../test-custom'
import LaunchTask from '../../../launch-task'
// import CustomModal from '../../../custom-modal'
import eventBus from './eventBus'
import { proBaseUrl, baseUrl } from '@/api/base.js'
import showIconMixin from '@/view/businessSmart/components/showCloseIconMixin'
import TreeSelectVue from '@/components/tree-select-vue/tree-select-vue'

export default {
  mixins: [showIconMixin],
  components: {
    // Custom,
    // CustomModal, // 自定义
    LaunchTask, // 简易任务
    TreeSelectVue
  },
  props: {
    errorInfo: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      customSettingList: [], // 自定义框的数据
      productInfo: {
        productName: '', // 产品名称
        productSource: '', // 来源
        productIscompany: '', // 公司/个人
        companyName: '', // 公司名称
        userName: '', // 个人姓名
        idCard: '', // 身份证号码
        companyNature: '', // 公司性质
        contactAddress: '', // 联系地址
        customerLevel: '', // 客户等级
        controlVolume: '', // 控量
        number: '', // 数量
        budget: '', // 预算
        settlementCycles: '', // 结算周期
        settlementMethod: '', // 结算方式
        advancePayment: '', // 预收款项
        paymentMethod: '', // 付款方式
        signer: '', // 商务ID
        businessAffairs: null, // 商务名称
        notCooperationReasons: '', // 未合作原因
        lossFeedback: '' // 流失反馈
      },
      isNum: false, // 控量的数量展示
      isPerson: true, // 选公司展示
      showDrainCauses: false, // 流失反馈是否展示
      showSource: false, // 是否显示来源的自定义框
      showWarn: false, // 提醒发简易任务
      showLaunch: false, // 显示简易任务
      showConfig: false, // 显示自定义权限
      showToConfig: false, // 展示跳往业务配置的弹窗
      sourceList: [],
      companyOrPersonList: [{ id: '1', name: '公司' }, { id: '2', name: '个人' }, { id: -2, name: '自定义' }], // 公司/个人下拉
      companynature: [{ id: 1, name: '官方' }, { id: 2, name: '代理' }, { id: -2, name: '自定义' }], // 公司性质下拉
      clientLevelList: [], // 客户等级下拉
      controlQuantityList: [{ id: 1, name: '有' }, { id: 2, name: '无' }], // 控量下拉
      settlementList: [{ id: '1', name: '安装(CPA)' }, { id: '2', name: '充值(CPA+CPS)' }, { id: '3', name: '留存(CPL)' }, { id: '4', name: '分成(CPS)' }, { id: '5', name: '点击(CPC)' }, { id: '6', name: '包月(CPT)' }, { id: -2, name: '自定义' }],
      payMethodList: [{ id: '1', name: '充值' }, { id: '2', name: '后付' }, { id: -2, name: '自定义' }],
      settlementCyclesList: [{ id: '1', name: '单周' }, { id: '2', name: '双周' }, { id: '3', name: '月' }],
      notCooperationReasonsList: [], // 未合作原因下拉
      lossFeedbackList: [], // 流失反馈下拉
      customList: [
        { cateId: 1, delStatus: 1, id: 9, name: '996ICU', selectStatus: 1 },
        { cateId: 2, delStatus: 1, id: 8, name: '996', selectStatus: 1 }
      ], // 自定义列表

      customType: '', // 自定义类型
      rulesProduct: {
        advancePayment: [{
          pattern: /^\d+(\.\d{0,2})?$/,
          message: '只能输入数字且最多两位小数'
        }],
        budget: [{
          pattern: /^\d+(\.\d{0,2})?$/,
          message: '只能输入数字且最多两位小数'
        }],
        number: [{
          pattern: /^[1-9]\d*$/,
          message: '只能输入正整数'
        }],
        productName: [
          {
            required: true,
            message: '产品名称必填',
            trigger: 'blur'
          }
        ]
      },

      // 商务
      businessPeople: null
    }
  },
  inject: ['app'],
  watch: {
    errorInfo (newV) {
      if (newV) {
        this.errorInfo = newV
      }
    },
    showWarn (newVal) {
      if (this.customizeField) {
        if (!newVal) {
          this.productInfo[this.customizeField] = ''
          console.log(this.productInfo[this.customizeField], 'xxxx')
          this.customizeField = ''
        }
      }
    }
  },
  computed: { // 在职人员
    incumbencyTbUser () {
      return this.app.employees
    },
    treeoptions () {
      return this.app.treeoptions
    }
  },
  mounted () {
    this.getSelectData()
  },
  methods: {
    // 获取下拉框的值
    getSelectData () {
      // 来源
      this.$axios({
        url: proBaseUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({ tagId: '002001' })
      }).then(res => {
        if (res.data.code === 10000) {
          let data = res.data.data
          this.sourceList = data
          this.sourceList.push({ id: -2, tagName: '自定义' })
        }
      }).catch(err => {
        console.log(err)
      })
      // 客户等级
      this.$axios({
        url: proBaseUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({ tagId: '003' })
      }).then(res => {
        if (res.data.code === 10000) {
          this.clientLevelList = res.data.data
          this.clientLevelList.push({ id: -2, tagName: '自定义' })
        }
      }).catch(err => {
        console.log(err)
      })
      // 未合作原因
      this.$axios({
        url: proBaseUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({ tagId: '008' })
      }).then(res => {
        if (res.data.code === 10000) {
          this.notCooperationReasonsList = res.data.data
          this.notCooperationReasonsList.push({ id: -2, tagName: '自定义' })
        }
      }).catch(err => {
        console.log(err)
      })
      // 流失反馈
      this.$axios({
        url: proBaseUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({ tagId: '009' })
      }).then(res => {
        if (res.data.code === 10000) {
          this.lossFeedbackList = res.data.data
          this.lossFeedbackList.push({ id: -2, tagName: '自定义' })
        }
      }).catch(err => {
        console.log(err)
      })
      this.$axios({
        url: baseUrl + '/login/getuser',
        method: 'get'
      }).then(res => {
        if (res.data.code === 200) {
          this.showConfig = res.data.permission.busiConfig.update
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 未选公司直接填写公司名称自动选择公司
    changeCompany () {
      if (this.productInfo.companyName) {
        this.productInfo.productIscompany = '公司'
        // this.toBrother()
      }
    },
    modalData (data, keys) {
      // console.log(data,keys)
      // this[keys].push(data)
    },
    // 不同项目标红
    errors (key) {

    //   console.log(key)
    //   console.log(this.errorInfo)
    //   if (this.errorInfo.some(e => e === key) ? '不一致' : false) {
    //     return '不一致'
    //   }
    // }
    },
    // 展示流失反馈
    showloss () {
      if (this.productInfo.notCooperationReasons) {
        this.showDrainCauses = true
      } else {
        this.showDrainCauses = false
      }
    },
    // 传递方法
    toBrother () {
      eventBus.$emit('on-productInfo', this.productInfo)
    },
    // 公司选个人
    choseCompanyType (value, key) {
      if (this.productInfo.productIscompany === '公司') {
        this.productInfo.userName = ''
        this.productInfo.idCard = ''
        // this.toBrother()
        this.isPerson = true
      } else if (this.productInfo.productIscompany === '个人') {
        this.productInfo.companyName = ''
        this.productInfo.companyNature = ''
        // this.toBrother()
        this.isPerson = false
      } else { // 显示发送待办弹窗
        this.openEasyTask(this.productInfo.productIscompany, 'productIscompany')
      }
    },
    // 选中商务清空未合作原因
    changeBusinessAffairs () {
      if (this.productInfo.businessAffairs) {
        this.productInfo.notCooperationReasons = ''
      } else {
        this.productInfo.lossFeedback = ''
      }
    },
    // 打开自定义
    openCustom (a, key) {
      if (a === '自定义') {
        this.customizeField = key

        if (!this.showConfig) {
          this.$Modal.warning({
            title: '提醒',
            content: '您暂无业务配置的权限，请向有权限的人申请反馈你的需求',
            onOk: () => {
              // this.productInfo[key] = ''
            }
          })
        } else {
          this.showToConfig = true
        }
      }
    },
    // 跳转到业务配置
    toConfig () {
      if (this.customizeField) {
        this.productInfo[this.customizeField] = ''
      }

      this.$router.push({
        path: '/business/businessSet'
      })
    },
    notToConfig () {
      console.log('not totttt')
      if (this.customizeField) {
        this.productInfo[this.customizeField] = ''
      }
    },

    // 打开简易任务
    openEasyTask (a, key) {
      if (a === '自定义') {
        this.showWarn = true
        console.log(key)
        this.customizeField = key
        // console.log(this[a])
      }
    },
    // 控量选择有无
    control (a) {
      if (a === '有') {
        this.isNum = true
      } else if (a === -1) {
        this.showSource = true
      } else if (a === '无') {
        this.isNum = false
      }
    },
    ensure () {
      this.showLaunch = true
    },
    hide (v) {
      this.showLaunch = v
    },
    handleInputChange (value) {
      if (!value) {
        this.productInfo.businessAffairs = ''
      } else {
        this.productInfo.businessAffairs = value.label
      }
    }
    // 获取市场人名称
    // getSignerName (ids) {
    //   if (ids) {
    //     this.productInfo.businessAffairs = ids.label
    //   }
    // }
  }
}
</script>
<style lang="less" scoped>
  @import '../../../public.less';
</style>
<style lang="less" scoped>
 .rowPadding{
    margin-bottom:2%;
  }
  .title{
    text-align: right;
    line-height: 30px;
    margin-right: 10px;
    font-size: 14px;
  }
  .ivu-select{
    margin: 0;
  }
  .ivu-dropdown{
  width: 100%;
}
.ivu-form-item{
  margin: 0;
}
.require{
  font-size: 17px;
  color: red;
  position: relative;
  top: 5px;
  right: 3px;
}
.customSty{
  display: flex;
  justify-content: space-between;
}
</style>
