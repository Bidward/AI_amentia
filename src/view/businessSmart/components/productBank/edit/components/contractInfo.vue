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
        <FormItem  :error="errors('firstIscompany')" :show-message="false">
          <Select v-model="contractInfo.firstIscompany"  filterable @on-change="choseCompanyType" placeholder="建立联系必填字段"  >
            <Option v-for="item  in companyOrPersonList" :value="item.name" :key="item.id" class="customSty">
              <span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.name}}<span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span>
            </Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="6"  class="title">
      <span>公司名称：</span>
      </Col>
      <Col span="5">
      <FormItem  :error="errors('firstCompanyName')" :show-message="false">
        <Input
        v-model="contractInfo.firstCompanyName"
        placeholder="建立联系必填字段"
        maxlength="50"
        show-word-limit
        :clearable="closeIcon.firstCompanyName"
        @mouseover.native="showClearable('firstCompanyName')"
        @mouseout.native="hiddenClearable('firstCompanyName')"
      />
      </FormItem>
      </Col>
    </Row>

    <Row class="rowPadding" v-if="!isPersons">
      <Col span="2" offset="2" class="title">
      <span>公司/个人：</span>
      </Col>
      <Col span="5">
      <FormItem  :error="errors('firstIscompany')" :show-message="false">
        <Select v-model="contractInfo.firstIscompany"  filterable @on-change="choseCompanyType" placeholder="建立联系必填字段"  >
          <Option v-for="item  in companyOrPersonList" :value="item.name" :key="item.id" class="customSty">
            <span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.name}}<span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span>
          </Option>
        </Select>
      </FormItem>
      </Col>
      <Col span="6"  class="title">
      <span>姓名：</span>
      </Col>
      <Col span="5">
      <FormItem  :error="errors('firstUserName')" :show-message="false">
        <Input
        v-model="contractInfo.firstUserName"
        placeholder="建立联系必填字段"
        maxlength="20"
        show-word-limit
        :clearable="closeIcon.firstUserName"
        @mouseover.native="showClearable('firstUserName')"
        @mouseout.native="hiddenClearable('firstUserName')"
        />
      </FormItem>
      </Col>
    </Row>

    <Row class="rowPadding">
      <Col span="2" offset="2" class="title">
      <span>对方联系人：</span>
      </Col>
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
      <Col span="6" class="title"><span>开票地址：</span></Col>
      <Col span="5">
      <FormItem  :error="errors('firstBillingAddress')" :show-message="false">
        <Input
          v-model="contractInfo.firstBillingAddress"
          placeholder="建立联系必填字段"
          maxlength="200"
          show-word-limit
          :clearable="closeIcon.firstBillingAddress"
          @mouseover.native="showClearable('firstBillingAddress')"
          @mouseout.native="hiddenClearable('firstBillingAddress')"
        />
      </FormItem>
      </Col>
    </Row>
    <Row class="rowPadding">
      <Col span="2" offset="2" class="title"><span>开票类型：</span></Col>
      <Col span="5">
      <FormItem  :error="errors('firstBillingType')" :show-message="false">
        <Select v-model="contractInfo.firstBillingType"  filterable  clearable  >
        <Option v-for="item  in openTicketTypeList" :value="item.name" :key="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>
      </Col>
      <Col span="6" class="title"><span>联系电话：</span></Col>
      <Col span="5">
      <FormItem  :error="errors('firstContactNumber')" :show-message="false">
        <Input
          v-model="contractInfo.firstContactNumber"
          placeholder="建立联系必填字段"
          maxlength="20"
          show-word-limit
          :clearable="closeIcon.firstContactNumber"
          @mouseover.native="showClearable('firstContactNumber')"
          @mouseout.native="hiddenClearable('firstContactNumber')"
          />
      </FormItem>
      </Col>
    </Row>
    <Row class="rowPadding">
      <Col span="3" offset="1" class="title"><span>发票寄送地址：</span></Col>
      <Col span="5">
      <FormItem  :error="errors('firstMailingAddress')" :show-message="false">
        <Input
          v-model="contractInfo.firstMailingAddress"
          placeholder="建立联系必填字段"
          maxlength="200"
          show-word-limit
          :clearable="closeIcon.firstMailingAddress"
          @mouseover.native="showClearable('firstMailingAddress')"
          @mouseout.native="hiddenClearable('firstMailingAddress')"
        />
      </FormItem>
      </Col>
      <Col span="6" class="title"><span>开票内容：</span> </Col>
      <Col span="5">
      <FormItem  :error="errors('firstBillingContent')" :show-message="false">
        <Select v-model="contractInfo.firstBillingContent"  filterable    >
        <Option v-for="item  in openTicketInfoList" :value="item.name" :key="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>
      </Col>
    </Row>
  </div>
  <!-- 付款合同 甲方 -->
  <div v-else>
    <Row class="rowPadding">
      <Col span="2" offset="2" class="title"><span>签订人：</span></Col>
      <Col span="5">
      <FormItem  :error="errors('secondSigningPeople')" :show-message="false">
        <Select v-model="contractInfo.secondSigningPeople" @on-change="getSignerName" :label-in-value="true" filterable  clearable  >
        <Option v-for="item  in incumbencyTbUser" :value="item.nickname" :key="item.id">{{item.nickname}}</Option>
        </Select>
      </FormItem>
      </Col>
      <Col span="6"  class="title"><span>我方公司：</span></Col>
      <Col span="5">
      <FormItem  :error="errors('secondCompanyName')" :show-message="false">
      <Select v-model="contractInfo.secondCompanyName" clearable filterable  :label-in-value="true"  @on-change="getCompanyCard" placeholder="建立联系必填字段"  >
        <Option v-for="item  in ourCompanyList" :value="item.id" :key="item.id" class="customSty">
          <span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.companyName}}<span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span>
        </Option>
      </Select>
      </FormItem>
    </Col>
    </Row>
    <Row class="rowPadding">
      <Col span="2" offset="2" class="title"><span>公司账号：</span></Col>
      <Col span="5">
      <FormItem  :error="errors('secondCompanyAccount')" :show-message="false">
        <Select v-model="contractInfo.secondCompanyAccount" clearable filterable @on-change="openEasyTask" placeholder="建立联系必填字段"  >
          <Option v-for="item  in companyIdList" :value="item.account" :key="item.id" class="customSty">
            <span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.account}}<span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span>
          </Option>
        </Select>
      </FormItem>
    </Col>
    <Col span="6" class="title"><span>合同期限：</span></Col>
    <Col span="5">
    <FormItem  :error="errors('secondCompanyTerm')" :show-message="false">
      <DatePicker v-model="contractInfo.timeRage" type="daterange" split-panels placeholder="建立联系必填字段"  ></DatePicker>
    </FormItem>
    </Col>
    </Row>
    <Row class="rowPadding">
      <Col span="2" offset="2" class="title"><span>合同金额：</span></Col>
      <Col span="5">
      <FormItem :error="errors('secondCompanyMoney')" :show-message="true" >
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
        <FormItem  :error="errors('fiestIsbilling')" :show-message="false">
          <Select v-model="contractInfo.fiestIsbilling"  filterable  clearable  >
          <Option v-for="item  in isOpenTicketList" :value="item.id" :key="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>
    </Col>
    </Row>
     <Row class="rowPadding">
      <Col span="2" offset="2" class="title"><span>开票类型：</span></Col>
      <Col span="5">
        <FormItem  :error="errors('firstBillingType')" :show-message="false">
          <Select v-model="contractInfo.firstBillingType"  filterable  clearable >
            <Option v-for="item  in openTicketTypeList" :value="item.name" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="6" class="title"><span>开票内容：</span> </Col>
      <Col span="5">
      <FormItem  :error="errors('firstBillingContent')" :show-message="false">
        <Select v-model="contractInfo.firstBillingContent"  filterable   clearable >
          <Option v-for="item  in openTicketInfoList" :value="item.name" :key="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>
      </Col>
    </Row>
  </div>
  <Row class="rowPadding second">
    <Col span="2" offset="1">
      <span>乙方：</span>
    </Col>
  </Row>
  <div v-if="contractInfo.contractType === '收款合同'">
    <div class="secondParty" v-if="addIcome">
      <Row class="rowPadding">
        <Col span="2" offset="2" class="title"><span>签订人：</span></Col>
        <Col span="5">
        <FormItem  :error="errors('secondSigningPeople')" :show-message="false">
          <Select v-model="contractInfo.secondSigningPeople"  :label-in-value="true" filterable  clearable  >
            <Option v-for="item  in incumbencyTbUser" :value="item.nickname" :key="item.id">{{item.nickname}}</Option>
          </Select>
        </FormItem>
        </Col>
      <Col span="6" class="title"><span>我方公司：</span></Col>
      <Col span="5">
      <FormItem  :error="errors('secondCompanyName')" :show-message="false">
        <Select v-model="contractInfo.secondCompanyName" clearable filterable  :label-in-value="true"  @on-change="getCompanyCard" placeholder="建立联系必填字段"  >
          <Option v-for="item  in ourCompanyList" :value="item.id" :key="item.id" class="customSty">
            <span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.companyName}}<span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span>
          </Option>
        </Select>
      </FormItem>
      </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="2" offset="2" class="title"><span>公司账号：</span></Col>
        <Col span="5">
        <FormItem  :error="errors('secondCompanyAccount')" :show-message="false">
          <Select v-model="contractInfo.secondCompanyAccount" clearable filterable @on-change="openEasyTask" placeholder="建立联系必填字段"  >
            <Option v-for="item  in companyIdList" :value="item.account" :key="item.id" class="customSty">
              <span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.account}}<span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span>
            </Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="6" class="title"><span>合同期限：</span></Col>
      <Col span="5">
      <FormItem  :error="errors('secondCompanyTerm')" :show-message="false">
        <DatePicker v-model="contractInfo.timeRage" @on-change='getContractTime'  type="daterange" split-panels placeholder="建立联系必填字段"  ></DatePicker>
      </FormItem>
      </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="2" offset="2" class="title"><span>合同金额：</span></Col>
        <Col span="5">
        <FormItem prop="secondCompanyMoney">
          <Input
          :class="errorClass('secondCompanyMoney')"
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
      <FormItem  :error="errors('firstIscompany')" :show-message="false">
        <Select v-model="contractInfo.firstIscompany"  filterable @on-change="choseCompanyType" placeholder="建立联系必填字段"  >
          <Option v-for="item  in companyOrPersonList" :value="item.name" :key="item.id" class="customSty">
            <span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.name}}<span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span>
          </Option>
        </Select>
      </FormItem>
      </Col>
      <Col span="6"  class="title">
      <span>公司名称：</span>
      </Col>
      <Col span="5">
      <FormItem  :error="errors('firstCompanyName')" :show-message="false">
        <Input
          v-model="contractInfo.firstCompanyName"
          placeholder="建立联系必填字段"
          maxlength="50"
          show-word-limit
          :clearable="closeIcon.firstCompanyName"
          @mouseover.native="showClearable('firstCompanyName')"
          @mouseout.native="hiddenClearable('firstCompanyName')"
        />
      </FormItem>
      </Col>
    </Row>
    <Row class="rowPadding" v-if="!isPerson">
      <Col span="2" offset="2" class="title">
      <span>公司/个人：</span>
      </Col>
      <Col span="5">
      <FormItem  :error="errors('firstIscompany')" :show-message="false">
        <Select v-model="contractInfo.firstIscompany"  filterable @on-change="choseCompanyType" placeholder="建立联系必填字段"  >
          <Option v-for="item  in companyOrPersonList" :value="item.name" :key="item.id" class="customSty">
            <span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:left; " v-if="item.id === -2"></span>{{item.name}}<span style="height: 1px;width:40%; background: #ccc;margin-top:8px;float:right;" v-if="item.id === -2"></span>
          </Option>
        </Select>
      </FormItem>
      </Col>
      <Col span="6"  class="title">
      <span>姓名：</span>
      </Col>
      <Col span="5">
      <FormItem  :error="errors('firstUserName')" :show-message="false">
        <Input
        v-model="contractInfo.firstUserName"
        placeholder="建立联系必填字段"
        maxlength="20"
        show-word-limit
        :clearable="closeIcon.firstUserName"
        @mouseover.native="showClearable('firstUserName')"
        @mouseout.native="hiddenClearable('firstUserName')"
        />
      </FormItem>
      </Col>
    </Row>
    <Row class="rowPadding" >
      <Col span="2" offset="2" class="title"><span>开户行账号：</span></Col>
      <Col span="5">
      <FormItem  :error="errors('secondBankAccount')" :show-message="false">
        <Input
          v-model="contractInfo.secondBankAccount"
          placeholder="建立联系必填字段"
          maxlength="100"
          show-word-limit
          :clearable="closeIcon.secondBankAccount"
          @mouseover.native="showClearable('secondBankAccount')"
          @mouseout.native="hiddenClearable('secondBankAccount')"
        />
      </FormItem>
      </Col>
      <Col span="6"  class="title"><span>开户行：</span></Col>
      <Col span="5">
      <FormItem  :error="errors('secondBank')" :show-message="false">
        <Input
        v-model="contractInfo.secondBank"
        placeholder="建立联系必填字段"
        maxlength="50"
        show-word-limit
        :clearable="closeIcon.secondBank"
        @mouseover.native="showClearable('secondBank')"
        @mouseout.native="hiddenClearable('secondBank')"
      />
      </FormItem>
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
      <FormItem  :error="errors('firstContactNumber')" :show-message="false">
        <Input
        v-model="contractInfo.firstContactNumber"
        placeholder="建立联系必填字段"
        maxlength="20"
        show-word-limit
        :clearable="closeIcon.firstContactNumber"
        @mouseover.native="showClearable('firstContactNumber')"
        @mouseout.native="hiddenClearable('firstContactNumber')"
        />
      </FormItem>
      </Col>
    </Row>
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
    productMessage: {
      type: Object,
      default () {
        return {}
      }
    },
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
      errorInfo1: [], // 错误对比信息
      secondCompanyName: '', // 我方公司，用以展示
      isPerson: true,
      isPersons: true,
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
      showWarn: false, // 提醒发简易任务
      showLaunch: false, // 显示简易任务
      rulescontract: {
        secondCompanyMoney: [
          {
            pattern: /^\d+(\.\d{0,2})?$/,
            message: '只能输入数字且最多两位小数'
          }
        ]
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
    productMessage (newV) {
      if (newV) {
        this.contractInfo = newV
        if (newV.secondCompanyName === '') {
          this.contractInfo.secondCompanyName = ''
        } else {
          this.contractInfo.secondCompanyName = Number(this.contractInfo.secondCompanyName)
        }
        this.choseCompanyType()
        this.contractInfo.timeRage = newV.secondCompanyTerm.split('~')
        this.getCompanyCard(this.contractInfo.secondCompanyName)
      }
    },
    errorInfo (newV) {
      if (newV) {
        this.errorInfo1 = newV
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
          if (this.companyIdList.length > 0) {
            this.contractInfo.secondCompanyAccount = this.companyIdList[0].account || ''
          }
        }
      })
      if (ids) {
        this.openEasyTask(ids.label)
      }
    },
    // 获取合同开始时间和结束时间
    getContractTime () {
      this.contractInfo.startTime = moment(this.contractInfo.timeRage[0]).format('YYYY-MM-DD')
      this.contractInfo.endTime = moment(this.contractInfo.timeRage[1]).format('YYYY-MM-DD')
      this.contractInfo.secondCompanyTerm = this.contractInfo.startTime + '~' + this.contractInfo.endTime
    },
    // 获取产品信息传过来的数据
    getBrother () {
      eventBus.$on('on-productInfo', (data) => {
        // 王诗鑫要求停止从产品信息中带入数据
        // this.contractInfo.firstIscompany = data.productIscompany
        // this.contractInfo.firstCompanyName = data.companyName
        // this.contractInfo.firstUserName = data.userName
        this.contractInfo.firstMailingAddress = data.contactAddress
        if (data.productIscompany === '1' || data.productIscompany === '2') {
          this.choseCompanyType()
        }
      })
      // eventBus.$on('on-tel', (data) => {
      //   if (data[0]) {
      // 联系人列表填写了联系电话自动带入第一个联系电话
      // this.contractInfo.firstContactNumber = data[0].contactNumber
      // 将联系人列表中的联系人填充到合同库的联系人下拉
      //     this.oppositeLinkManList = []
      //     data.map(item => {
      //       this.oppositeLinkManList.push({ name: item.contactName, id: item.contactName })
      //     })
      //   } else {
      //     this.contractInfo.firstContactPerson = ''
      //   }
      // })
    },
    // 获取商务名称
    getSignerName (ids) {
      if (ids) {
        this.contractInfo.signerName = ids.label
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
    // 公司选个人/公司
    choseCompanyType () {
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
    // 不同项目标红
    errors (key) {
      if (this.errorInfo1.some(e => e === key) ? '不一致' : false) {
        return '不一致'
      }
    },

    errorClass (key) {
      let cls = this.errorInfo1.some(e => e === key) ? 'isDifferent' : ''
      return cls
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
    // 显示简易任务
    ensure () {
      this.showLaunch = true
    },
    // 关闭简易任务
    hide (v) {
      this.showLaunch = v
    }
  }
}
</script>
<style lang="less" scoped>
  .isDifferent /deep/ input {
    border-color: red !important;
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
  .rowPadding{
    margin-bottom:20px;
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
