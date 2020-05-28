<template>
  <div class="viewWrapper" style="overflow: visible;">
  <Form :model="productInfo" :rules="rulesProduct"  >
    <Row class="rowPadding">
      <Col span="2" offset="2" class="title">
        <i class="require">*</i><span>产品名称：</span>
      </Col>
      <Col span="5">
        <FormItem  prop="productName">
          <Input
            :class="errorClass('productName')"
            v-model="productInfo.productName"
            placeholder="潜在客户必填字段"
            maxlength="100"
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
        <FormItem  :error="errors('productSource')" :show-message="false">
          <Select v-model="productInfo.productSource"  filterable  placeholder="潜在客户必填字段"  clearable @on-change="openCustom">
            <Option v-for="item  in sourceList" :value="item.tagName" :key="item.id" class="customSty"> <span style="height: 1px;  width:41%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.tagName}}<span style="height: 1px;  width:41%; background: #ccc;margin-top:8px;float:left;" v-if="item.id === -2"></span></Option>
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
        <FormItem  :error="errors('productIscompany')" :show-message="false">
          <Select v-model="productInfo.productIscompany"  filterable @on-change="choseCompanyType" placeholder="待联系必填字段"  >
            <Option v-for="item  in companyOrPersonList" :value="item.name" :key="item.id" class="customSty"><span style="height: 1px;  width:41%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.name}}<span style="height: 1px;  width:41%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span></Option>
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
            @on-change='changeCompany'
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
          <Select v-model="productInfo.companyNature"  filterable @on-change="openCustom" placeholder="待联系必填字段" clearable >
            <Option v-for="item  in companynature" :value="item.name" :key="item.id" class="customSty"><span style="height: 1px;  width:41%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.name}}<span style="height: 1px;  width:41%; background: #ccc;margin-top:8px;float:rigth;" v-if="item.id === -2"></span></Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="4" offset="2" class="title">
        <span>联系地址：</span>
      </Col>
      <Col span="5">
        <FormItem  :error="errors('contactAddress')" :show-message="false">
          <Input
            v-model="productInfo.contactAddress"
            placeholder="建立联系必填项"
            @on-change='toBrother'
            maxlength="200"
            show-word-limit
            :clearable="closeIcon.contactAddress"
            @mouseover.native="showClearable('contactAddress')"
            @mouseout.native="hiddenClearable('contactAddress')"
          />
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
          <Select v-model="productInfo.productIscompany"  filterable @on-change="choseCompanyType" placeholder="待联系必填字段"  >
            <Option v-for="item  in companyOrPersonList" :value="item.name" :key="item.id" class="customSty"><span style="height: 1px;  width:41%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.name}}<span style="height: 1px;  width:41%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span></Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="4" offset="2" class="title">
        <span>姓名：</span>
      </Col>
      <Col span="5">
        <FormItem  :error="errors('userName')" :show-message="false">
          <Input
            v-model="productInfo.userName"
            placeholder="潜在客户必填项"
            maxlength="20"
            show-word-limit
            :clearable="closeIcon.userName"
            @mouseover.native="showClearable('userName')"
            @mouseout.native="hiddenClearable('userName')"
          />
        </FormItem>
      </Col>
    </Row>
    <Row class="rowPadding" v-if="!isPerson">
      <Col span="2" offset="2" class="title">
        <span>身份证：</span>
      </Col>
      <Col span="5">
        <FormItem  :error="errors('idCard')" :show-message="false">
          <Input
            v-model="productInfo.idCard"
            placeholder="建立联系必填项"
            maxlength="20"
            show-word-limit
            :clearable="closeIcon.idCard"
            @mouseover.native="showClearable('idCard')"
            @mouseout.native="hiddenClearable('idCard')"
          />
        </FormItem>
      </Col>
      <Col span="4" offset="2" class="title">
        <span>联系地址：</span>
      </Col>
      <Col span="5">
        <FormItem  :error="errors('contactAddress')" :show-message="false">
          <Input
            v-model="productInfo.contactAddress"
            placeholder="建立联系必填项"
            @on-change='toBrother'
            maxlength="200"
            show-word-limit
            :clearable="closeIcon.contactAddress"
            @mouseover.native="showClearable('contactAddress')"
            @mouseout.native="hiddenClearable('contactAddress')"
          />
        </FormItem>
      </Col>
    </Row>
    <Row class="rowPadding">
      <Col span="2" offset="2" class="title">
        <span>客户等级：</span>
      </Col>
      <Col span="5">
      <FormItem  :error="errors('customerLevel')" :show-message="false">
         <Select v-model="productInfo.customerLevel"  filterable @on-change="openCustom" placeholder="建立联系必填项"  clearable>
          <Option v-for="item  in clientLevelList" :value="item.tagName" :key="item.id" class="customSty"><span style="height: 1px;  width:41%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.tagName}}<span style="height: 1px;  width:41%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span></Option>
        </Select>
      </FormItem>
      </Col>
      <Col span="4" offset="2" class="title">
        <span>控量：</span>
      </Col>
      <Col span="5">
        <FormItem  :error="errors('controlVolume')" :show-message="false">
          <Select v-model="productInfo.controlVolume"  filterable @on-change="control" placeholder="建立联系必填项"  >
            <Option v-for="item  in controlQuantityList" :value="item.name" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
     <Row class="rowPadding" v-if="isNum">
      <Col span="2" offset="2" class="title">
        <span>数量：</span>
      </Col>
      <Col span="5">
        <FormItem  prop="number">
          <Input
            :class="errorClass('number')"
            v-model="productInfo.number"
            placeholder="建立联系必填项"
            maxlength="11"
            show-word-limit
            :clearable="closeIcon.number"
            @mouseover.native="showClearable('number')"
            @mouseout.native="hiddenClearable('number')"
          />
        </FormItem>
      </Col>
      <Col span="4" offset="2" class="title">
        <span>预算(元)：</span>
      </Col>
      <Col span="5">
        <FormItem prop="budget">
          <Input
          :class="errorClass('budget')"
          v-model="productInfo.budget"
          placeholder="建立联系必填项"
          maxlength="100"
          show-word-limit
          :clearable="closeIcon.budget"
          @mouseover.native="showClearable('budget')"
          @mouseout.native="hiddenClearable('budget')"
          />
        </FormItem>
      </Col>
    </Row>
    <Row class="rowPadding">
      <Col span="2" offset="2" class="title">
        <span>结算周期：</span>
      </Col>
      <Col span="5">
        <FormItem  :error="errors('settlementCycles')" :show-message="false">
          <Select v-model="productInfo.settlementCycles"  filterable  placeholder="建立联系必填项" clearable >
            <Option v-for="item  in settlementCyclesList" :value="item.name" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="4" offset="2" class="title">
        <span>结算方式：</span>
      </Col>
      <Col span="5">
        <FormItem  :error="errors('settlementMethod')" :show-message="false">
         <Select v-model="productInfo.settlementMethod "  filterable @on-change="openEasyTask" placeholder="建立联系必填项" clearable >
          <Option v-for="item  in settlementList" :value="item.name" :key="item.id" class="customSty"><span style="height: 1px;  width:41%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.name}}<span style="height: 1px;width: 40%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span></Option>
        </Select>
        </FormItem>
      </Col>
    </Row>
    <Row class="rowPadding">
      <Col span="2" offset="2" class="title">
        <span>充值款项(元)：</span>
      </Col>
      <Col span="5">
        <FormItem prop="advancePayment">
          <Input
            :class="errorClass('advancePayment')"
            v-model="productInfo.advancePayment"
            placeholder="建立联系必填项"
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
          <Select v-model="productInfo.paymentMethod "  filterable @on-change="openEasyTask" placeholder="建立联系必填项" clearable >
            <Option v-for="item  in payMethodList" :value="item.name" :key="item.id" class="customSty"><span style="height: 1px;  width:41%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.name}}<span style="height: 1px;  width:41%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span></Option>
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
          <!-- <Select v-model="productInfo.businessAffairs"  filterable clearable :label-in-value="true" placeholder="已合作必填项" @on-change="changeBusinessAffairs" >
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
        </FormItem>
      </Col>
      <Col span="4" offset="2" class="title" v-if="!productInfo.businessAffairs">
        <span>未合作原因：</span>
      </Col>
      <Col span="5" v-if="!productInfo.businessAffairs">
        <FormItem  :error="errors('notCooperationReasons')" :show-message="false">
          <Select v-model="productInfo.notCooperationReasons"  filterable  placeholder="建立联系必填项" clearable @on-change="openCustom">
            <Option v-for="item in notCooperationReasonsList" :value="item.tagName" :key="item.id" class="customSty"><span style="height: 1px;  width:41%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.tagName}}<span style="height: 1px;  width:41%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span></Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="4" offset="2" class="title" v-if="productInfo.businessAffairs">
        <span>流失反馈：</span>
      </Col>
      <Col span="5" v-if="productInfo.businessAffairs">
        <FormItem  :error="errors('lossFeedback')" :show-message="false">
          <Select v-model="productInfo.lossFeedback"  filterable  placeholder="流失客户必填部分" clearable @on-change="openCustom">
            <Option v-for="item in lossFeedbackList" :value="item.tagName" :key="item.id" class="customSty"><span style="height: 1px;  width:41%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.tagName}}<span style="height: 1px;  width:41%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span></Option>
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
      </Form>
      <Modal v-model="showToConfig" width="360" @on-ok="toConfig">
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
import LaunchTask from '../../../launch-task'
import CustomModal from '../../../custom-modal'
import eventBus from './eventBus'
import { proBaseUrl, baseUrl } from '@/api/base.js'
import showIconMixin from '@/view/businessSmart/components/showCloseIconMixin'
import TreeSelectVue from '@/components/tree-select-vue/tree-select-vue'

export default {
  mixins: [showIconMixin],
  components: {
    CustomModal, // 自定义
    LaunchTask, // 简易任务弹窗
    TreeSelectVue
  },
  props: {
    productMessage: {
      type: Object,
      default () {
        return {
          productName: ''
        }
      }
    },
    errorInfo: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      productInfo: {
        productName: '', // 产品名称
        productSource: '', // 来源
        productIscompany: '', // 公司/个人
        companyName: '', // 公司名称
        userName: '', // 个人姓名
        idCard: '', // 身份证号码
        companyNature: '11', // 公司性质
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
        businessAffairs: '', // 商务名称
        notCooperationReasons: '', // 未合作原因
        lossFeedback: '' // 流失反馈
      },
      errorInfo1: [], // 对比错误的值
      isNum: false, // 控量的数量展示
      isPerson: true, // 选公司展示
      showDrainCauses: false, // 流失反馈是否展示
      showSource: false, // 是否显示来源的自定义框
      showWarn: false, // 提醒发简易任务
      showLaunch: false, // 显示简易任务
      showToConfig: false, // 展示跳转到业务配置的弹窗
      showConfig: false, // 显示自定义权限
      sourceList: [],
      companyOrPersonList: [{ id: '1', name: '公司' }, { id: '2', name: '个人' }, { id: -2, name: '自定义' }], // 公司/个人下拉
      companynature: [{ id: '1', name: '官方' }, { id: 2, name: '代理' }, { id: -2, name: '自定义' }], // 公司性质下拉
      clientLevelList: [], // 客户等级下拉
      controlQuantityList: [{ id: '1', name: '有' }, { id: 2, name: '无' }], // 控量下拉
      settlementList: [{ id: '1', name: '安装(CPA)' }, { id: '2', name: '充值(CPA+CPS)' }, { id: '3', name: '留存(CPL)' }, { id: '4', name: '分成(CPS)' }, { id: '5', name: '点击(CPC)' }, { id: '6', name: '包月(CPT)' }, { id: -2, name: '自定义' }],
      payMethodList: [{ id: '1', name: '充值' }, { id: '2', name: '后付' }, { id: -2, name: '自定义' }], // 付款方式
      settlementCyclesList: [{ id: '1', name: '单周' }, { id: '2', name: '双周' }, { id: '3', name: '月' }], // 结算周期
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
      businessPeople: null
    }
  },
  inject: ['app'],
  computed: { // 在职人员
    incumbencyTbUser () {
      return this.app.employees
    },
    treeoptions () {
      return this.app.treeoptions
    }
  },
  watch: {
    productMessage (newV) {
      if (newV.productInformation) {
        this.productInfo = newV.productInformation
        this.businessPeople = this.productInfo.businessAffairs ? { label: this.productInfo.businessAffairs, id: this.findIdByName(this.treeoptions, this.productInfo.businessAffairs) } : null
        this.choseCompanyType()
      }
    },
    errorInfo (newV) {
      if (newV) {
        this.errorInfo1 = newV
      }
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
    cancel () {
      this.showSource = false
    },
    // 传递方法
    toBrother () {
      eventBus.$emit('on-productInfo', this.productInfo)
      // console.log(this.productInfo)
    },
    // 未选公司直接填写公司名称自动选择公司
    changeCompany () {
      if (this.productInfo.companyName) {
        this.productInfo.productIscompany = '公司'
        // this.toBrother()
      }
    },
    // 不同项目标红
    errors (key) {
      if (this.errorInfo1.some(e => e === key) ? '不一致' : false) {
        return '不一致'
      }
    },

    // 信息不一致class
    errorClass (key) {
      let cls = this.errorInfo1.some(e => e === key) ? 'isDifferent' : ''
      return cls
    },

    // 公司选个人
    choseCompanyType () {
      // this.toBrother()
      if (this.productInfo.productIscompany === '公司') {
        this.productInfo.userName = ''
        this.productInfo.idCard = ''
        this.isPerson = true
      } else if (this.productInfo.productIscompany === '个人') {
        this.productInfo.companyName = ''
        this.productInfo.companyNature = ''
        this.isPerson = false
      } else if (this.productInfo.productIscompany === -1) {
        this.showSource = true
        this.productInfo.customType = 'companyOrPersonList'
        this.customList = this.productInfo.companyOrPersonList
        this.productInfo.productIscompany = ''
      } else { // 显示发送待办弹窗
        this.openEasyTask(this.productInfo.productIscompany)
        this.productInfo.userName = ''
        this.productInfo.idCard = ''
        this.productInfo.companyName = ''
        this.productInfo.companyNature = ''
        // this.productInfo.productIscompany = '公司'
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
    openCustom (a) {
      if (a === '自定义') {
        if (!this.showConfig) {
          this.$Modal.warning({
            title: '提醒',
            content: '您暂无业务配置的权限，请向有权限的人申请反馈你的需求'
          })
        } else {
          this.showToConfig = true
        }
      }
    },
    // 跳转到业务配置
    toConfig () {
      this.$router.push({
        path: '/business/businessSet'
      })
    },
    // 打开简易任务
    openEasyTask (a) {
      if (a === '自定义') {
        this.showWarn = true
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
    findIdByName (list, name) {
      let id
      list.forEach(item => {
        if (item.label === name) {
          id = item.id
        } else {
          if (item.children && item.children.length) {
            id = this.findIdByName(item.children, name)
          }
        }
      })
      return id
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
    //   this.productInfo.businessAffairs = ids.label
    // }
  }
}
</script>
<style lang="less" scoped>
  .isDifferent /deep/ input {
    border-color: red !important;
  }
 .rowPadding{
    margin-bottom:20px;
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
// .ivu-form-item{
//   margin: 0;
// }
.require{
  font-size: 17px;
  color: red;
  position: relative;
  top: 5px;
  right: 3px;
}
</style>
<style lang="less" scoped>
  @import '../../../public.less';

</style>
