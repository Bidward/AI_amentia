<template>
  <div class="viewWrapper" style="padding:20px">
   <Form :model="contractInfo" :rules="rulescontract">
    <Row class="rowPadding">
      <Col span="2" offset="2" class="title">
        <span>合同拟定方：</span>
      </Col>
      <Col span="5">
        <FormItem  :error="errors('contractParty')" :show-message="false">
          <Select v-model="contractInfo.contractParty"  filterable @on-change="openEasyTask" placeholder="建立联系必填字段"  >
            <Option v-for="item  in contractProtocol" :value="item.name" :key="item.id" class="customSty">
              <span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.name}}<span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span>
            </Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="6" class="title">
        <span>合同类型：</span>
      </Col>
      <Col span="5" >
        <FormItem  :error="errors('contractType')" :show-message="false">
          <Select v-model="contractInfo.contractType"  filterable @on-change="changeContractType" placeholder="建立联系必填字段"  >
            <Option v-for="item  in contractTypeList" :value="item.name" :key="item.id" class="customSty">
              <span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.name}}<span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span>
            </Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
  <Row class="rowPadding">
    <Col span="2" offset="1">
      <span>甲方：</span>
    </Col>
  </Row>
  <!-- 收款合同 甲方 -->
  <div  v-if="contractInfo.contractType === '收款合同'">
    <Row class="rowPadding" v-if="isPersons">
      <Col span="2" offset="2" class="title">
      <span>公司/个人：</span>
      </Col>
      <Col span="5">
        <!-- <FormItem  :error="errors('firstIscompany')" :show-message="false"> -->
          <Select v-model="contractInfo.firstIscompany"  filterable @on-change="choseCompanyType" placeholder="建立联系必填字段"  >
            <Option v-for="item  in companyOrPersonList" :value="item.name" :key="item.id" class="customSty">
              <span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.name}}<span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span>
            </Option>
          </Select>
        <!-- </FormItem> -->
      </Col>
      <Col span="6"  class="title">
      <span>公司名称：</span>
      </Col>
      <Col span="5">
        <!-- <FormItem  :error="errors('firstCompanyName')" :show-message="false"> -->
          <Input
            v-model="contractInfo.firstCompanyName"
            placeholder="建立联系必填字段"
            maxlength="50"
            show-word-limit
            :clearable="closeIcon.firstCompanyName"
            @mouseover.native="showClearable('firstCompanyName')"
            @mouseout.native="hiddenClearable('firstCompanyName')"
          />
        <!-- </FormItem> -->
      </Col>
    </Row>

    <Row class="rowPadding" v-if="!isPersons">
      <Col span="2" offset="2" class="title">
      <span>公司/个人：</span>
      </Col>
      <Col span="5">
      <!-- <FormItem  :error="errors('firstIscompany')" :show-message="false"> -->
        <Select v-model="contractInfo.firstIscompany"  filterable @on-change="choseCompanyType" placeholder="建立联系必填字段"  >
          <Option v-for="item  in companyOrPersonList" :value="item.name" :key="item.id" class="customSty">
            <span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.name}}<span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span>
          </Option>
        </Select>
      <!-- </FormItem> -->
      </Col>
      <Col span="6"  class="title">
      <span>姓名：</span>
      </Col>
      <Col span="5">
      <!-- <FormItem  :error="errors('firstUserName')" :show-message="false"> -->
        <Input
          v-model="contractInfo.firstUserName"
          placeholder="建立联系必填字段"
          maxlength="20"
          show-word-limit
          :clearable="closeIcon.firstUserName"
          @mouseover.native="showClearable('firstUserName')"
          @mouseout.native="hiddenClearable('firstUserName')"
        />
      <!-- </FormItem> -->
      </Col>
    </Row>

    <Row class="rowPadding">
      <Col span="2" offset="2" class="title">
      <span>对方联系人：</span>
      </Col>
      <Col span="5">

          <!-- <Select v-model="contractInfo.firstContactPerson"  filterable allow-create  clearable @on-create="handeloppositeLinkManList">
            <Option v-for="item  in oppositeLinkManList" :value="item.name" :key="item.id">{{item.name}}</Option>
          </Select> -->
          <Input
            v-model="contractInfo.firstContactPerson"
            placeholder="建立联系必填字段"
            maxlength="50"
            show-word-limit
            :clearable="closeIcon.firstContactPerson"
            @mouseover.native="showClearable('firstContactPerson')"
            @mouseout.native="hiddenClearable('firstContactPerson')"
        />

      </Col>
      <Col span="6" class="title"><span>开票地址：</span></Col>
      <Col span="5">
        <Input
          v-model="contractInfo.firstBillingAddress"
          placeholder="建立联系必填字段"
          maxlength="200"
          show-word-limit
          :clearable="closeIcon.firstBillingAddress"
          @mouseover.native="showClearable('firstBillingAddress')"
          @mouseout.native="hiddenClearable('firstBillingAddress')"
        />
      </Col>
    </Row>
    <Row class="rowPadding">
      <Col span="2" offset="2" class="title"><span>开票类型：</span></Col>
      <Col span="5">
        <Select v-model="contractInfo.firstBillingType"  filterable  clearable @on-change="openCustom" placeholder="建立联系必填字段" >
          <Option v-for="item  in openTicketTypeList" :value="item.name" :key="item.name" class="customSty"><span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.name}}<span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span></Option>
        </Select>
      </Col>
      <Col span="6" class="title"><span>联系电话：</span></Col>
      <Col span="5"><Input v-model="contractInfo.firstContactNumber" clearable placeholder="建立联系必填字段"   maxlength="20" show-word-limit/></Col>
    </Row>
    <Row class="rowPadding">
      <Col span="3" offset="1" class="title"><span>发票寄送地址：</span></Col>
      <Col span="5">
      <Input
        v-model="contractInfo.firstMailingAddress"
        placeholder="建立联系必填字段"
        maxlength="200"
        show-word-limit
        :clearable="closeIcon.firstMailingAddress"
        @mouseover.native="showClearable('firstMailingAddress')"
        @mouseout.native="hiddenClearable('firstMailingAddress')"
        />
      </Col>
      <Col span="6" class="title"><span>开票内容：</span> </Col>
      <Col span="5">
        <Select v-model="contractInfo.firstBillingContent"  filterable  clearable placeholder="建立联系必填字段" >
          <Option v-for="item  in openTicketInfoList" :value="item.name" :key="item.id">{{item.name}}</Option>
        </Select>
      </Col>
    </Row>
  </div>
  <!-- 付款合同 甲方 -->
  <div v-else>
    <Row class="rowPadding">
      <Col span="2" offset="2" class="title"><span>签订人：</span></Col>
      <Col span="5">
        <Select v-model="contractInfo.secondSigningPeople"  :label-in-value="true" filterable  placeholder="建立联系必填字段" clearable >
        <Option v-for="item  in incumbencyTbUser" :value="item.nickname" :key="item.id">{{item.nickname}}</Option>
        </Select>
      </Col>
      <Col span="6"  class="title"><span>我方公司：</span></Col>
      <Col span="5">
      <Select v-model="contractInfo.secondCompanyName" clearable filterable  :label-in-value="true"  @on-change="getCompanyCard" placeholder="建立联系必填字段"  >
        <Option v-for="item  in ourCompanyList" :value="item.id" :key="item.id" class="customSty">
          <span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.companyName}}<span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span>
        </Option>
      </Select>
    </Col>
    </Row>
    <Row class="rowPadding">
      <Col span="2" offset="2" class="title"><span>公司账号：</span></Col>
      <Col span="5">
        <Select v-model="contractInfo.secondCompanyAccount" clearable filterable @on-change="openEasyTask" placeholder="建立联系必填字段">
          <Option v-for="item  in companyIdList" :value="item.account" :key="item.id" class="customSty">
            <span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.account}}<span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span>
          </Option>
        </Select>
    </Col>
    <Col span="6" class="title"><span>合同期限：</span></Col>
    <Col span="5">
     <DatePicker v-model="contractInfo.timeRage" type="daterange" clearable split-panels placeholder="建立联系必填字段"  ></DatePicker>
    </Col>
    </Row>
    <Row class="rowPadding">
      <Col span="2" offset="2" class="title"><span>合同金额：</span></Col>
      <Col span="5">
      <FormItem prop="secondCompanyMoney">
        <Input
          v-model="contractInfo.secondCompanyMoney"
          placeholder="建立联系必填字段"
          style="width:100%"
          maxlength="100"
          show-word-limit
          :clearable="closeIcon.secondCompanyMoney"
          @mouseover.native="showClearable('secondCompanyMoney')"
          @mouseout.native="hiddenClearable('secondCompanyMoney')"
        />
      </FormItem>
      </Col>
      <Col span="6" class="title"><span>是否开票：</span></Col>
      <Col span="5">
        <Select v-model="contractInfo.fiestIsbilling"  filterable  clearable  >
          <Option v-for="item  in isOpenTicketList" :value="item.name" :key="item.id">{{item.name}}</Option>
        </Select>
    </Col>
    </Row>
     <Row class="rowPadding">
      <Col span="2" offset="2" class="title"><span>开票类型：</span></Col>
      <Col span="5">
        <Select v-model="contractInfo.firstBillingType"  filterable  clearable >
          <Option v-for="item  in openTicketTypeList" :value="item.name" :key="item.id" class="customSty"><span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.name}}<span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span></Option>
        </Select>
      </Col>
      <Col span="6" class="title"><span>开票内容：</span> </Col>
      <Col span="5">
        <Select v-model="contractInfo.firstBillingContent"  filterable   clearable >
          <Option v-for="item  in openTicketInfoList" :value="item.name" :key="item.id">{{item.name}}</Option>
        </Select>
      </Col>
    </Row>
  </div>
  <!-- 收款合同乙方 -->
  <Row class="rowPadding second" >
    <Col span="2" offset="1">
      <span>乙方：</span>
    </Col>
  </Row>
  <div v-if="contractInfo.contractType === '收款合同'">
    <div class="secondParty" v-if="addIcome">
      <Row class="rowPadding">
        <Col span="2" offset="2" class="title"><span>签订人：</span></Col>
        <Col span="5">
          <Select v-model="contractInfo.secondSigningPeople"  :label-in-value="true" filterable   clearable placeholder="建立联系必填字段">
          <Option v-for="item  in incumbencyTbUser" :value="item.nickname" :key="item.id">{{item.nickname}}</Option>
          </Select>
        </Col>
      <Col span="6" class="title"><span>我方公司：</span></Col>
      <Col span="5">
        <Select v-model="contractInfo.secondCompanyName" clearable filterable  :label-in-value="true"  @on-change="getCompanyCard" placeholder="建立联系必填字段"  >
          <Option v-for="item  in ourCompanyList" :value="item.id" :key="item.id" class="customSty">
            <span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.companyName}}<span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span>
          </Option>
        </Select>
      </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="2" offset="2" class="title"><span>公司账号：</span></Col>
        <Col span="5">
        <Select v-model="contractInfo.secondCompanyAccount" clearable filterable @on-change="openEasyTask" placeholder="建立联系必填字段"  >
          <Option v-for="item  in companyIdList" :value="item.account" :key="item.id" class="customSty">
            <span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.account}}<span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span>
          </Option>
        </Select>
      </Col>
      <Col span="6" class="title"><span>合同期限：</span></Col>
      <Col span="5">
      <DatePicker v-model="contractInfo.timeRage" @on-change='getContractTime'  type="daterange" split-panels placeholder="建立联系必填字段" clearable ></DatePicker>
      </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="2" offset="2" class="title"><span>合同金额：</span></Col>
        <Col span="5">
        <FormItem  prop="secondCompanyMoney">
          <Input
            v-model="contractInfo.secondCompanyMoney"
            placeholder="建立联系必填字段"
            style="width:100%"
            maxlength="100"
            show-word-limit
            :clearable="closeIcon.secondCompanyMoney"
            @mouseover.native="showClearable('secondCompanyMoney')"
            @mouseout.native="hiddenClearable('secondCompanyMoney')"
          />
        </FormItem>
        </Col>
      </Row>
    </div>
  </div>
  <div v-else>
    <Row class="rowPadding" v-if="isPerson">
      <Col span="2" offset="2" class="title">
      <span>公司/个人：</span>
      </Col>
      <Col span="5">
        <Select v-model="contractInfo.firstIscompany"  filterable @on-change="choseCompanyType" placeholder="建立联系必填字段"  >
          <Option v-for="item  in companyOrPersonList" :value="item.name" :key="item.id" class="customSty">
            <span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.name}}<span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span>
          </Option>
        </Select>
      </Col>
      <Col span="6"  class="title">
      <span>公司名称：</span>
      </Col>
      <Col span="5">
        <Input
          v-model="contractInfo.firstCompanyName"
          placeholder="建立联系必填字段"
          maxlength="50"
          show-word-limit
          :clearable="closeIcon.firstCompanyName"
          @mouseover.native="showClearable('firstCompanyName')"
          @mouseout.native="hiddenClearable('firstCompanyName')"
        />
      </Col>
    </Row>
    <Row class="rowPadding" v-if="!isPerson">
      <Col span="2" offset="2" class="title">
      <span>公司/个人：</span>
      </Col>
      <Col span="5">
        <Select v-model="contractInfo.firstIscompany"  filterable @on-change="choseCompanyType" placeholder="建立联系必填字段"  >
          <Option v-for="item  in companyOrPersonList" :value="item.name" :key="item.id" class="customSty">
            <span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.name}}<span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span>
          </Option>
        </Select>
      </Col>
      <Col span="6"  class="title">
      <span>姓名：</span>
      </Col>
      <Col span="5">
        <Input
          v-model="contractInfo.firstUserName"
          placeholder="建立联系必填字段"
          maxlength="20"
          show-word-limit
          :clearable="closeIcon.firstUserName"
          @mouseover.native="showClearable('firstUserName')"
          @mouseout.native="hiddenClearable('firstUserName')"
        />
      </Col>
    </Row>
    <Row class="rowPadding" >
      <Col span="2" offset="2" class="title"><span>开户行账号：</span></Col>
      <Col span="5">
        <Input
          v-model="contractInfo.secondBankAccount"
          placeholder="建立联系必填字段"
          maxlength="100"
          show-word-limit
          :clearable="closeIcon.secondBankAccount"
          @mouseover.native="showClearable('secondBankAccount')"
          @mouseout.native="hiddenClearable('secondBankAccount')"
        />
      </Col>
      <Col span="6"  class="title"><span>开户行：</span></Col>
      <Col span="5">
        <Input
          v-model="contractInfo.secondBank"
          placeholder="建立联系必填字段"
          maxlength="100"
          show-word-limit
          :clearable="closeIcon.secondBank"
          @mouseover.native="showClearable('secondBank')"
          @mouseout.native="hiddenClearable('secondBank')"
        />
      </Col>
    </Row>
    <Row class="rowPadding" >
      <Col span="2" offset="2" class="title"><span>对方联系人：</span></Col>
      <Col span="5">
        <FormItem  :error="errors('firstContactPerson')" :show-message="false">
          <!-- <Select v-model="contractInfo.firstContactPerson"  filterable allow-create  clearable @on-create="handeloppositeLinkManList">
            <Option v-for="item  in oppositeLinkManList" :value="item.name" :key="item.id">{{item.name}}</Option>
          </Select> -->
          <Input
            v-model="contractInfo.firstContactPerson"
            placeholder="建立联系必填字段"
            maxlength="50"
            show-word-limit
            :clearable="closeIcon.firstContactPerson"
            @mouseover.native="showClearable('firstContactPerson')"
            @mouseout.native="hiddenClearable('firstContactPerson')"
          />
        </FormItem>
      </Col>
       <Col span="6" class="title"><span>联系电话：</span></Col>
      <Col span="5">
        <Input v-model="contractInfo.firstContactNumber"
          placeholder="建立联系必填字段" clearable
        />
      </Col>
    </Row>
  </div>
  <Modal v-model="showWarn" title="提醒" @on-ok="ensure">
    <p class="warn">该字段涉及逻辑和页面开发，是否发简易任务告知产品经理您的新需求</p>
  </Modal>
  <div v-if="showLaunch">
    <launch-task :show="showLaunch" @hideTask="hide"></launch-task>
  </div>
  </Form>
  </div>
</template>
<script>
import LaunchTask from '../../../launch-task'
import moment from 'moment'
import eventBus from './eventBus'
import { proBaseUrl, phpURL } from '@/api/base.js'

import showIconMixin from '@/view/businessSmart/components/showCloseIconMixin'

export default {
  mixins: [showIconMixin],
  components: {
    LaunchTask
  },
  props: {
    errorInfo: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      contractInfo: {
        contractParty: '我方合同', // 合同拟定方
        contractType: '收款合同', // 合同类型
        firstIscompany: '', // 公司个人
        firstCompanyName: '', // 公司名称
        firstContactPerson: '', // 对方联系人
        firstBillingAddress: '', // 开票地址
        firstBillingType: '', // 开票类型
        firstContactNumber: '', // 联系电话
        firstMailingAddress: '', // 发票寄送地址
        firstBillingContent: '', // 开票内容
        secondSigningPeople: '', // 签订人ID
        signerName: '', // 签订人姓名
        secondCompanyName: '', // 我方公司
        secondCompanyAccount: '', // 公司账号
        timeRage: [], // 合作期限
        startTime: '', // 合同开始时间
        endTime: '', // 合同结束时间
        secondCompanyMoney: '', // 合同金额
        fiestIsbilling: '', // 是否开票
        firstUserName: '', // 个人姓名
        secondBankAccount: '', // 开户行账号
        secondBank: '', // 开户行
        secondCompanyTerm: ''// 合作期限拼接
      },
      secondCompanyName: '', // 公司账号用作展示
      isPerson: true,
      isPersons: true,
      showWarn: false, // 提醒发简易任务
      showLaunch: false, // 显示简易任务
      contractProtocol: [{ id: '1', name: '我方合同' }, { id: '2', name: '对方合同' }, { id: -2, name: '自定义' }],
      contractTypeList: [{ id: '1', name: '收款合同' }, { id: '2', name: '付款合同' }, { id: -2, name: '自定义' }],
      companyOrPersonList: [{ id: '1', name: '公司' }, { id: '2', name: '个人' }, { id: -2, name: '自定义' }], // 公司/个人下拉
      openTicketTypeList: [], // 开票类型列表
      openTicketInfoList: [], // 开票内容
      ourCompanyList: [], // 我方公司列表
      companyIdList: [], // 公司账号列表
      isOpenTicketList: [{ id: '1', name: '是' }, { id: '2', name: '否' }], // 是否开票列表
      oppositeLinkManList: [], // 对方联系人列表
      addIcome: true,
      errorInfo1: [], // 对比错误信息
      rulescontract: {
        secondCompanyMoney: [{
          pattern: /^\d+(\.\d{0,2})?$/,
          message: '只能输入数字且最多两位小数'
        }]
      }
    }
  },
  inject: ['app'],
  computed: { // 在职人员
    incumbencyTbUser () {
      return this.app.employees
    }
  },
  watch: {
    errorInfo (newV) {
      if (newV) {
        this.errorInfo1 = newVconsole.log(thsi.contractInfo.firstIscompany)
        this.choseCompanyType()
      }
    }
  },
  mounted () {
    this.$emit('on-contractInfo', this.contractInfo)
    // this.getBrother()
    this.getSelect()
  },
  methods: {
    // 获取下拉
    getSelect () {
      let _this = this
      // 开票类型
      this.$axios({
        url: proBaseUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({ tagId: '007001' })
      }).then(res => {
        if (res.data.code === 10000) {
          let data = res.data.data
          data.map(item => {
            _this.openTicketTypeList.push({ id: item.tagId, name: item.tagName })
          })
        }
      }).catch(err => {
        console.log(err)
      })
      // 开票内容
      this.$axios({
        url: proBaseUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({ tagId: '007002' })
      }).then(res => {
        if (res.data.code === 10000) {
          let data = res.data.data
          data.map(item => {
            _this.openTicketInfoList.push({ id: item.tagId, name: item.tagName })
          })
        }
      }).catch(err => {
        console.log(err)
      })
      // 我方公司
      this.$axios({
        url: proBaseUrl + '/channel/listCompany',
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          this.ourCompanyList = res.data.data
          this.ourCompanyList.push({ id: -2, companyName: '自定义' })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取公司账号
    getCompanyCard (ids) {
      if (ids) {
        let sendData = {
          ourCompanyId: this.contractInfo.secondCompanyName
        }
        this.$axios({
          url: phpURL + '/cloud/getAccountByOurCompanyId',
          method: 'post',
          data: $qs.stringify(sendData)
        }).then(res => {
          if (res.data.code === 10000) {
            this.companyIdList = res.data.content
            this.companyIdList.push({ id: -2, account: '自定义' })
            this.contractInfo.secondCompanyAccount = this.companyIdList[0].account || ''
          }
        })
        this.openEasyTask(ids.label)
      }
    },
    // 获取合同开始时间和结束时间
    getContractTime () {
      this.contractInfo.startTime = moment(this.contractInfo.timeRage[0]).format('YYYY-MM-DD')
      this.contractInfo.endTime = moment(this.contractInfo.timeRage[1]).format('YYYY-MM-DD')
      this.contractInfo.secondCompanyTerm = this.contractInfo.startTime + '~' + this.contractInfo.endTime
    },
    // 获取产品信息数据赋值
    getBrother () {
      eventBus.$on('on-productInfo', (data) => {
        // this.contractInfo.firstIscompany = data.productIscompany
        // this.contractInfo.firstCompanyName = data.companyName
        // this.contractInfo.firstUserName = data.userName
        this.contractInfo.firstMailingAddress = data.contactAddress
        if (data.productIscompany === '公司' || data.productIscompany === '个人') {
          this.choseCompanyType()
        }
      })
      // eventBus.$on('on-tel', (data) => {
      // 添加联系人后自动带入联系人第一个的联系电话
      // this.contractInfo.firstContactNumber = data[0].contactNumber
      // this.oppositeLinkManList = []
      // data.map(item => {
      //   this.oppositeLinkManList.push({ name: item.contactName, id: item.contactName })
      // })
      // })
    },

    choseCompanyType () { // 公司选个人/公司
      if (this.contractInfo.firstIscompany === '公司') {
        this.contractInfo.firstUserName = ''
        this.isPerson = true
        this.isPersons = true
      } else if (this.contractInfo.firstIscompany === '个人') {
        this.contractInfo.firstCompanyName = ''
        this.isPerson = false
        this.isPersons = false
      } else if (this.contractInfo.firstIscompany === '自定义') {
        this.openEasyTask(this.contractInfo.firstIscompany)
        this.contractInfo.firstIscompany = '公司'
      }
    },
    // 改变合同类型清空之前数据
    changeContractType (a) {
      if (a === '自定义') {
        this.openEasyTask(a)
      } else {
        // 清空对象中每一个key的值
        Object.keys(this.contractInfo).map((key) => { this.contractInfo[key] = '' })
        this.contractInfo.contractType = a
        this.contractInfo.contractParty = '我方合同'
      }
    },
    // 不同项目标红
    errors (key) {
      // if(this.errorInfo1.length>1){
      //   if (this.errorInfo1.some(e => e === key) ? '不一致' : false) {
      //     return '不一致'
      //   }
      // }
    },
    // 对方联系人输入添加
    // handeloppositeLinkManList (Val) {
    //   this.oppositeLinkManList.push({
    //     name: Val,
    //     id: Val
    //   })
    // },
    // 打开自定义
    openCustom (a) {
      if (a === '自定义') {
        this.showSource = true
      }
    },
    // 打开简易任务
    openEasyTask (a) {
      if (a === '自定义') {
        this.showWarn = true
      }
    },
    ensure () {
      this.showLaunch = true
    },
    hide (v) {
      this.showLaunch = v
    }
  }
}
</script>
<style lang="less" scoped>
  .title{
    text-align: right;
    line-height: 30px;
    margin-right: 10px;
    font-size: 14px;
  }
  .ivu-select{
    margin: 0;
  }
  .rowPadding{
    margin-bottom:2%;
    font-size: 14px;
  }
  .second{
    margin-top: 5%;

  }
  .ivu-date-picker{
    width: 100%;
  }
</style>
<style lang="less" scoped>
  @import '../../../public.less';
</style>
