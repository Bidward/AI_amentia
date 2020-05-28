<template>
<!--新增收款合同 对方拟定-->
    <div class="cloudCooper">
        <Form ref="addIncome" :model="addIncome" :rules="ruleAddIncome">
        <div class="detailContent">
            <!--合同拟定方 合同类型-->
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">
                合同拟定方：
                </Col>
                <Col span="5">
                    <Select v-model="addIncome.planer" clearable filterable disabled id="colorFont">
                        <Option v-for="planer in addIncome.planerList" :value="planer.id" :key="planer.id">{{planer.name}}</Option>
                    </Select>
                </Col>
                <Col span="3" class="title">
                合同类型：
                </Col>
                <Col span="5">
                    <Select v-model="addIncome.contractType" clearable filterabl disabled>
                        <Option v-for="item  in addIncome.contractTypeList" :value="item.id" :key="item.id">{{item.name}}</Option>
                    </Select>
                </Col>
            </Row>
        </div>
        <!--甲方-->
        <div class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">甲方</Col>
            </Row>
            <!--签订人 我方公司-->
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">
                    <i class="require">*</i>签订人：
                </Col>
                <Col span="5">
                <FormItem prop="signer">
                    <Select v-model="addIncome.signer" clearable :label-in-value="true" filterable @on-change="getSignerName" >
                        <Option v-for="item in incumbencyTbUser" :value="item.id" :key="item.id">{{item.nickname}}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="3"  class="title">
                    <i class="require">*</i>我方公司：
                </Col>
                <Col span="5">
                <FormItem prop="wecompany">
                    <Select v-model="addIncome.wecompany" clearable :label-in-value="true" filterable @on-change="getWecompanybank">
                        <Option v-for="item  in addIncome.wecompanyList" :value="item.id" :key="item.id">{{item.companyName}}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
             <!--公司账号 合同期限-->
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">
                    <i class="require">*</i>公司账号：
                </Col>
                <Col span="5">
                <FormItem prop="wecompanybank">
                    <Select v-model="addIncome.wecompanybank" clearable filterable>
                        <Option v-for="item  in addIncome.wecompanybankList" :value="item.id" :key="item.id">{{item.account}}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="3"  class="title">
                    <i class="require">*</i>合同期限：
                </Col>
                <Col span="5">
                <FormItem prop="timeRage">
                    <DatePicker v-model="addIncome.timeRage" type="daterange" split-panels placeholder="选择期限" style="width: 227px"></DatePicker>
                </FormItem>
                </Col>
            </Row>
            <!--合同金额-->
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">
                合同金额：
                </Col>
                <Col span="5">
                    <Input v-model="addIncome.money" placeholder="合同金额" clearable filterable></Input>
                </Col>
                <Col span="3"  class="title">
                    <i class="require">*</i>是否开票：
                </Col>
                <Col span="5">
                <FormItem prop="Invoice">
                    <Select v-model="addIncome.invoice" clearable filterable @on-change="noTickt">
                        <Option v-for="item  in addIncome.InvoiceList" :value="item.id" :key="item.id">{{item.name}}</Option>
                    </Select>
                </FormItem>
                </Col>

            </Row>

            <!--开票类型 开票内容-->
            <Row class="rowPadding" v-if="showKp">
                <Col span="3" offset="3" class="title">
                    <i class="require">*</i>开票类型：
                </Col>
                <Col span="5">
                <FormItem prop="ticketType">
                    <Select v-model="addIncome.ticketType" clearable filterable :label-in-value="true" @on-change="getTickTypeName">
                        <Option v-for="item  in addIncome.ticketTypeList" :value="item.id" :key="item.id">{{item.title}}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="3"  class="title">
                    <i class="require">*</i>开票内容：
                </Col>
                <Col span="5">
                <FormItem prop="ticketText">
                    <Select v-model="addIncome.ticketText" clearable filterable :label-in-value="true" @on-change="getTickTextName">
                        <Option v-for="item  in addIncome.ticketTextList" :value="item.id" :key="item.id">{{item.title}}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>

        </div>

        <!--乙方-->
        <div class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">乙方</Col>
            </Row>
            <!--公司/个人 公司名称-->
            <Row class="rowPadding" v-if="!isPerson">
                <Col span="3" offset="3" class="title">
                    <i class="require">*</i>公司/个人：
                </Col>
                <Col span="5">
                    <FormItem prop="contractPartycompany">
                    <Select v-model="addIncome.contractPartycompany" clearable filterable @on-change = "choseCompanyType">
                        <Option v-for="item  in addIncome.contractPartycompanyList" :value="item.id" :key="item.id">{{item.name}}</Option>
                    </Select>
                    </FormItem>
                </Col>
                <Col span="3"  class="title">
                    <i class="require">*</i>公司名称：
                </Col>
                <Col span="5">
                    <FormItem prop="partyCompany">
                    <Select v-model="addIncome.partyCompany" clearable filterable  :label-in-value="true" @on-change="getContractNum">
                        <Option v-for="item  in addIncome.partyCompanyList" :value="item.productChannelId" :key="item.productChannelId">{{item.channelName}}</Option>
                    </Select>
                    </FormItem>
                </Col>
            </Row>
            <!--公司选择为个人时 -->
             <Row class="rowPadding" v-if="isPerson">
                <Col span="3" offset="3" class="title">
                    <i class="require">*</i>公司/个人：
                </Col>
                <Col span="5">
                    <FormItem prop="contractPartycompany">
                    <Select v-model="addIncome.contractPartycompany" clearable filterable @on-change = "choseCompanyType">
                        <Option v-for="item  in addIncome.contractPartycompanyList" :value="item.id" :key="item.id">{{item.name}}</Option>
                    </Select>
                    </FormItem>
                </Col>
                <Col span="3"  class="title">
                    <i class="require">*</i>姓名：
                </Col>
                <Col span="5">
                    <FormItem prop="companyName">
                    <Select v-model="addIncome.companyName" clearable filterable  :label-in-value="true" @on-change="getContractNum">
                        <Option v-for="item  in addIncome.companyNameList" :value="item.productChannelId" :key="item.productChannelId">{{item.channelName}}</Option>
                    </Select>
                    </FormItem>
                </Col>
            </Row>

            <!--公司 开户行账号 开户行-->
            <Row class="rowPadding" v-if="!isPerson">
                <Col span="3" offset="3" class="title">
                    <i class="require">*</i>开户行账号：
                </Col>
                <Col span="5">
                <FormItem prop="openbankId">
                    <Input v-model="addIncome.openbankId" placeholder="开户行账号" clearable filterable></Input>
                </FormItem>
                </Col>
                <Col span="3"  class="title">
                    <i class="require">*</i>开户行：
                </Col>
                <Col span="5">
                <FormItem prop="openbank">
                    <Input v-model="addIncome.openbank" placeholder="开户行" clearable filterable></Input>
                </FormItem>
                </Col>
            </Row>
            <!--个人  身份证号码 开票地址-->
             <Row class="rowPadding" v-if="isPerson">
                <Col span="3" offset="3" class="title">
                    <i class="require">*</i>身份证号码：
                </Col>
                <Col span="5">
                <FormItem prop="contractNum">
                    <Input v-model="addIncome.contractNum" placeholder="身份证号码" clearable filterable></Input>
                </FormItem>
                </Col>
                <Col span="3" class="title">
                    <i class="require">*</i>开户行账号：
                </Col>
                <Col span="5">
                <FormItem prop="openbankId">
                    <Input v-model="addIncome.openbankId" placeholder="开户行账号" clearable filterable></Input>
                </FormItem>
                </Col>
            </Row>

            <!--个人  开户行 开票地址-->
             <Row class="rowPadding" v-if="isPerson">
                <Col span="3" offset="3" class="title">
                    <i class="require">*</i>开户行：
                </Col>
                <Col span="5">
                <FormItem prop="openbank">
                    <Input v-model="addIncome.openbank" placeholder="开户行" clearable filterable></Input>
                </FormItem>
                </Col>
                 <Col span="3" class="title">
                    对方联系人：
                </Col>
                <Col span="5">
                <FormItem prop="contacts">
                    <Input v-model="addIncome.contacts" placeholder="对方联系人" clearable filterable></Input>
                </FormItem>
                </Col>
            </Row>
            <!--个人 联系电话-->
            <Row class="rowPadding" v-if="isPerson">
                <Col span="3" offset="3" class="title">
                联系电话：
                </Col>
                <Col span="5">
                <FormItem prop="tel">
                    <Input v-model="addIncome.tel" placeholder="联系电话" clearable filterable></Input>
                </FormItem>
                </Col>
            </Row>

            <!--对方联系人 联系电话-->
            <Row class="rowPadding" v-if="!isPerson">
                <Col span="3" offset="3" class="title">
                    <i class="require">*</i>对方联系人：
                </Col>
                <Col span="5">
                <FormItem prop="contacts">
                    <Input v-model="addIncome.contacts" placeholder="对方联系人" clearable filterable></Input>
                </FormItem>
                </Col>
                <Col span="3"  class="title">
                    <i class="require">*</i>联系电话：
                </Col>
                <Col span="5">
                <FormItem prop="tel">
                    <Input v-model="addIncome.tel" placeholder="联系电话" clearable filterable></Input>
                </FormItem>
                </Col>
            </Row>
        </div>
        <!--备注-->
        <div class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle" placeholder="其他信息以及注意事项">备注</Col>
            </Row>
                <!--备注-->
            <Row class="rowPadding" >
                <Col span="5" offset="4">
                    <Input v-model="addIncome.remark" type="textarea" placeholder="请输入备注" clearable style="width:750px"></Input>
                </Col>
            </Row>
        </div>
        <!--合同条款  这里没有-->

        <!--附件-->
        <div class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">附件</Col>
            </Row>
            <Row class="rowPadding" >
                <Col span="3" offset="2" class="title">
                    <i class="require">*</i>文件上传：
                </Col>
                <Col span="5">
                    <Upload class="bzUpload"
                    multiple
                    name="fileData"
                    :on-success="(value)=> uploadFileSuccess(value)"
                    :action="staticUrl+'/index.php'"
                    :max-size="20480"
                    >
                        <Button icon="ios-cloud-upload-outline">单个文件不能超过20MB</Button>
                    </Upload>
                    <!--<div v-for = "(item,index) in addIncome.enclosure" :key="index">
                        <span><a :href="item.enclosureUrl">{{item.enclosureName}}</a></span>
                    </div>-->

                </Col>
                <Col span="3" offset="2" class="title">
                    <i class="require">*</i>图片上传：
                </Col>
                <Col span="5">
                    <Upload class="bzUpload"
                    multiple
                    :format="['jpg','jpeg','png']"
                    :max-size="20480"
                    :show-upload-list="false"
                    name="fileData"
                    :on-format-error ="(file)=>uploadError(file)"
                    :on-success="(value)=> uploadPhotoSuccess(value)"
                    :action="staticUrl+'/index.php'"
                    >
                        <Button icon="ios-cloud-upload-outline">单张图片不能超过20MB</Button>
                    </Upload>
                    <viewer  :images="addIncome.enclosurePic">
                      <div style="width:360px;display:flex;flex-wrap:wrap;">
                        <div v-for="(item1,index) in addIncome.enclosurePic" :key="index">
                            <Icon v-if="addIncome.enclosurePic.length>=1" type="ios-close-circle-outline" style="position: relative;left: 86px;top: -80px;color: red;" @click="deleteImg(index)" />
                            <img  v-if="addIncome.enclosurePic.length>=1" style="width: 70px;height: 70px;margin: 10px;" :src="item1.enclosureUrl" class="inputbox">
                        </div>
                      </div>
                  </viewer>
                    <!--<div v-for = "(item,index) in addIncome.enclosure" :key="index">
                        <span><a :href="item.enclosureUrl">{{item.enclosureName}}</a></span>
                    </div>-->
                </Col>
            </Row>
        </div>
        <!--审批人-->
        <div class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">审批人</Col>
            </Row>
            <Row class="rowPadding" >
                <Col span="17" offset="4">
                  <div style="float: left;margin-right: 15px;">
                    <Icon type="ios-contacts" size="50" @click="showNoticeApprove=true" style="display: block;"></Icon>
                    <div>
                    <p style="display: inline;" v-for="(item,index) in addIncome.approverName" :key="index">{{item+'  '||'审批人'}}</p>
                    </div>
                  </div>
                </Col>
            </Row>
        </div>
        <!--抄送人-->
        <div class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">抄送人</Col>
            </Row>
            <Row class="rowPadding" >
                 <Col span="17" offset="4">
                    <Icon type="ios-add-circle-outline" size="50" @click="showNotice=true" style="margin-top: 22px;color: #CCC;"/>
                    <div  v-for="(item,index) in this.addIncome.copierName" :key="index" style="float: left;margin-right: 15px;">
                        <Icon type="md-close" style="color: red; position: relative;left: 33px;top: 12px;cursor: pointer;" @click="deletCopier(index)"/>
                        <Icon type="ios-contacts" size="50" @click="showNotice=true" style="display: block;"></Icon>
                        <p style="">{{item+'  '||'抄送人'}}</p>
                    </div>
                </Col>
            </Row>
            <!--审批人通知人弹窗-->
            <Modal :mask-closable="false" id="addNotice" v-model="showNoticeApprove" title="审批人">
                <Select v-model="addIncome.approver" disabled filterable clearable :label-in-value="true" @on-change="getApproveName">
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
            <Modal id="addNotice" :mask-closable="false" v-model="showNotice" title="通知人" @on-ok="addCopier()">
                <Select :value="addIncome.copier" filterable multiple :label-in-value="true" @on-change="getNoticeName">
                    <Option v-for="person in incumbencyTbUser" :key="person.id" :value="person.id" :label="person.nickname">
                        <div>
                            <p>{{person.nickname}}</p>
                            <p>部门：{{person.deptName}}</p>
                            <p>职位：{{person.positionName}}</p>
                        </div>
                    </Option>
                </Select>
            </Modal>
        </div>
        </Form>
        <!--操作按钮-->
        <div class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="10">
                    <Button type="warning" @click="goBack()" style="margin-right:30px">返回</Button>
                    <Button type="primary" @click="saveNewPro()">保存</Button>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
import { phpURL, baseUrl, staticUrl } from '@/api/base.js'
import delImg from '@/assets/images/close.png'
import moment from 'moment'
export default {
  name: 'otherAddPayment',
  data () {
    // 合同期限验证非空
    const validateAbnormalTime = (rule, value, callback) => {
      if (!value[0] || !value[1]) {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    }
    return {
      staticUrl,
      imgs: {
        delImg
      },
      showKp: true,
      isPerson: false, // 产品公司类型为个人
      showNotice: false, // 抄送人弹窗
      showNoticeApprove: false,
      addIncome: {
        tbcId: -1,
        tickTypeName: '',
        tickTextName: '',
        contractPartycompanyName: '',
        router: '',
        licenseUrls: [],
        planer: '2', // 合同拟定方
        planerList: [
          {
            id: '1',
            name: '我方合同'
          }, {
            id: '2',
            name: '对方合同'
          }],
        contractType: '2', // 合同类型
        contractTypeList: [
          {
            id: '1',
            name: '收款合同'
          }, {
            id: '2',
            name: '付款合同'
          }],
        invoice: '', // 是否开票
        InvoiceList: [
          {
            id: '1',
            name: '是'
          },
          {
            id: '2',
            name: '否'
          }
        ], // 是否开票list
        contractPartycompany: '', // 公司或个人  1为公司2为个人
        contractPartycompanyList: [{ id: '1', name: '公司' }, { id: '2', name: '个人' }],
        partyCompany: '', // 公司名称
        partyCompanyList: [], // 公司名称列表 别人公司
        openbankId: '', // 开户行账号
        openbank: '', // 开户行
        contractNum: '', // 纳税人识别号
        openingAddress: '', // 开票地址
        tel: '', // 联系电话
        contacts: '', // 对方联系人
        ticketType: '', // 开票类型
        ticketTypeList: [], // 开票类型list
        ticketText: '', // 开票内容
        ticketTextList: [], // 开票内容list
        sendAddress: '', // 发票寄送地址
        detailedAddress: '', // 详细地址
        signer: '', // 签订人
        signerName: '', // 签订人name
        // incumbencyTbUser: [], // 签订人列表
        wecompany: '', // 乙方我方公司id
        wecompanyList: [], // 乙方我方公司List
        wecompanybank: '', // 公司账户id
        wecompanybankList: [], // 公司账户list
        timeRage: [], // 合同期限
        startTime: '', // 合同开始时间
        endTime: '', // 合同结束时间
        money: '', // 合同金额
        remark: '', // 备注
        contractName: '马鞍山百助网络科技信息服务框架合同', // 合同名称
        service: '无限增值/PC', // 甲方对乙方服务
        serviceTwo: '无限增值业务/PC端业务', // 乙方对甲方服务
        court: '马鞍山市', // 法院地址
        copier: [], // 抄送人id
        copierName: [], // 抄送人名称
        approver: [],
        approverName: [], // 审批人名称
        enclosure: [],
        enclosurePic: [], // 附件
        companyName: '',
        companyNameList: [],
        twoEntryId: '0'
      },
      ruleAddIncome: {
        contractPartycompany: [{ required: true, message: '公司/个人是必填项哦' }],
        partyCompany: [{ required: true, message: '公司名称/姓名是必填项哦' }],
        openbankId: [{ required: true, message: '开户行账号是必填项哦' }],
        openbank: [{ required: true, message: '开户行是必填项哦' }],
        contractNum: [{ required: true, message: '纳税人识别号/身份证是必填项哦' }],
        openingAddress: [{ required: true, message: '开票地址是必填项哦' }],
        tel: [{ required: true, message: '联系电话是必填项哦' }],
        contacts: [{ required: true, message: '对方联系人是必填项哦' }],
        ticketType: [{ required: true, message: '开票类型是必填项哦' }],
        ticketText: [{ required: true, message: '开票内容是必填项哦' }],
        signer: [{ required: true, message: '签订人是必填项哦' }],
        wecompany: [{ required: true, message: '我方公司是必填项哦' }],
        wecompanybank: [{ required: true, message: '公式账号是必填项哦', trigger: 'blur' }],
        timeRage: [ {
          required: true,
          message: '合同期限是必填项哦',
          pattern: /.+/
        },
        {
          message: '合同期限是必填项哦',
          validator: validateAbnormalTime,
          trigger: 'change'
        }],
        contractName: [{ required: true, message: '合同名称是必填项哦' }],
        serviceTwo: [{ required: true, message: '必填项哦' }],
        service: [{ required: true, message: '必填项哦' }],
        court: [{ required: true, message: '法院必填项哦' }],
        invoice: [{ required: true, message: '是否开票是必填项哦' }]
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
    // this.addIncome = this.$store.state.user.vuexContractData
  },
  methods: {
    getData () {
      // 乙方姓名 即时渠道
      this.$axios({
        url: phpURL + '/cloud/getAllChannelCompanies',
        method: 'post',
        data: $qs.stringify({ channelType: 2 })
      }).then(res => {
        if (res.data.code === 10000) {
          this.addIncome.companyNameList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
      // 获取抄送人，通知人默认带的经理名称
      this.$axios({
        url: baseUrl + '/contract/getSausage',
        method: 'post',
        data: $qs.stringify({ Type: 2 })
      }).then(res => {
        if (res.data.code === 10000) {
          this.addIncome.copier.push(res.data.content.id)
          this.addIncome.copierName.push(res.data.content.nickname)
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
      // 获取审核人，通知人默认带的主管名称
      this.$axios({
        url: baseUrl + '/contract/getSausage',
        method: 'post',
        data: $qs.stringify({ Type: 1 })
      }).then(res => {
        if (res.data.code === 10000) {
          this.addIncome.approver.push(res.data.content.id)
          this.addIncome.approverName.push(res.data.content.nickname)
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
      // 收款合同里的公司是产品公司
      this.$axios({
        url: phpURL + '/cloud/getAllChannelCompanies',
        method: 'post',
        data: $qs.stringify({ channelType: 1 })
      }).then(res => {
        if (res.data.code === 10000) {
          this.addIncome.partyCompanyList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
      // 开票类型
      this.$axios({
        url: phpURL + '/cloud/ticketTypeList',
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          this.addIncome.ticketTypeList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
      // 开票内容
      this.$axios({
        url: phpURL + '/cloud/ticketContentList',
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          this.addIncome.ticketTextList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
      // 在职人员
      // this.$axios({
      //   url: baseUrl + '/user/getIncumbencyTbUser',
      //   method: 'post'
      // }).then(res => {
      //   if (res.data.code === 10000) {
      //     this.addIncome.incumbencyTbUser = res.data.content
      //   } else {
      //     this.$Message.error(res.data.msg)
      //   }
      // }).catch(err => {
      //   console.error(err)
      // })
      // 收款合同里的乙方 公司是我方公司
      this.$axios({
        url: phpURL + '/cloud/getAllOursCompanies',
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          this.addIncome.wecompanyList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 是否开票 不开票隐藏开票类型和开票内容
    noTickt () {
      if (this.addIncome.invoice === '1') {
        this.showKp = true
      } else {
        this.showKp = false
      }
    },
    // 附件上传成功
    uploadFileSuccess (response, file, fileList) {
      if (response.rel === true) {
        // 文件上传展示
        this.addIncome.enclosure.push({
          enclosureUrl: staticUrl + '' + response.url,
          enclosureName: response.filename
        })
      } else {
        console.error(response.msg)
      }
    },
    // 图片上传
    uploadPhotoSuccess (response, file, fileList) {
      if (response.rel === true) {
        // 图片上传展示
        this.addIncome.enclosurePic.push({
          enclosureUrl: staticUrl + '' + response.url,
          enclosureName: response.filename
        })
      }
    },
    // 附件上传失败
    uploadError (file) {
      this.$Message.error('上传格式错误,请上传jpg,jpeg,png后缀的图片')
    },
    /** 传入类别和要删除的类型和在数组中的位置 */
    deleteImg (type, index) {
      this.addIncome.enclosurePic.splice(index, 1)
    },
    // 删除抄送人
    deletCopier (index) {
      this.addIncome.copier.splice(index, 1)
      this.addIncome.copierName.splice(index, 1)
    },
    // 产品公司选择
    choseCompanyType () {
      if (this.addIncome.contractPartycompany === '1') {
        this.isPerson = false
      } else if (this.addIncome.contractPartycompany === '2') {
        this.isPerson = true
        // 公司到个人时 清空部分数据
        let _i = this.addIncome
        _i.partyCompany = ''
        _i.contractNum = ''
        _i.openingAddress = ''
        _i.openbank = ''
        _i.tel = ''
        _i.openbankId = ''
        _i.contacts = ''
      }
    },
    // 获取开票类型name
    getTickTypeName (ids) {
      this.addIncome.tickTypeName = ids.label
    },
    // 获取开票内容name
    getTickTextName (ids) {
      this.addIncome.tickTextName = ids.label
    },
    // 获取纳税人识别号
    getContractNum (ids) {
      // 将公司名称的id转为name 给预览使用
      if (this.addIncome.contractPartycompany === '1') {
        this.addIncome.contractPartycompanyName = ids.label
        console.log('公司')
        let sendData = {
          productChannelId: this.addIncome.partyCompany
        }
        this.$axios({
          url: phpURL + '/cloud/getTicketInfoByProductChannelId',
          method: 'post',
          data: $qs.stringify(sendData)
        }).then(res => {
          if (res.data.code === 10000) {
            let _i = this.addIncome
            let _r = res.data.content
            if (res.data.content !== null) {
              _i.contractNum = _r.taxpayerCard
              _i.openingAddress = _r.billingAddress
              _i.contacts = _r.contactsName
              _i.tel = _r.telephone
              _i.openbankId = _r.openingBankCard
              _i.openbank = _r.openingBank
            } else {
              _i.contractNum = ''
              _i.openingAddress = ''
              _i.contacts = ''
              _i.tel = ''
              //   _i.ticketType = ''// 开票类型
              //   _i.ticketText = ''// 开票内容
              _i.openbankId = ''
              _i.openbank = ''
            }
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.error(err)
        })
      } else if (this.addIncome.contractPartycompany === '2') {
        console.log('个人')
        let sendData = {
          productChannelId: this.addIncome.companyName,
          type: '2'
        }
        this.$axios({
          url: phpURL + '/cloud/getTicketInfoByProductChannelId',
          method: 'post',
          data: $qs.stringify(sendData)
        }).then(res => {
          if (res.data.code === 10000) {
            let _i = this.addIncome
            let _r = res.data.content
            if (res.data.content !== null) {
              _i.contractNum = _r.taxpayerCard
              _i.openingAddress = _r.billingAddress
              _i.contacts = _r.contactsName
              _i.tel = _r.telephone
              _i.openbankId = _r.openingBankCard
              _i.openbank = _r.openingBank
            } else {
              _i.contractNum = ''
              _i.openingAddress = ''
              _i.contacts = ''
              _i.tel = ''
              //   _i.ticketType = ''// 开票类型
              //   _i.ticketText = ''// 开票内容
              _i.openbankId = ''
              _i.openbank = ''
            }
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.error(err)
        })
      }
    },
    getSignerName (ids) {
      this.addIncome.signerName = ids.label
    },
    // 根据我方公司获取公司账号
    getWecompanybank (ids) {
      this.addIncome.wecompanybank = ''
      this.addIncome.wecompanyName = ids.label
      let sendData = {
        ourCompanyId: this.addIncome.wecompany
      }
      this.$axios({
        url: phpURL + '/cloud/getAccountByOurCompanyId',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          let _i = this.addIncome
          let _r = res.data.content
          _i.wecompanybankList = _r
          _i.wecompanybank = _i.wecompanybankList[0].id
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 根据通知人id 获得对应的通知人name  审批人
    getApproveName (ids) {
      this.addIncome.approverName = ids.label
    },
    // 根据通知人id 获得对应的通知人name
    getNoticeName (ids) {
      this.addIncome.showCopierName = []
      this.addIncome.showCopierId = []
      ids.map(item => {
        this.addIncome.showCopierName.push(item.label)
        this.addIncome.showCopierId.push(item.value)
      })
      this.addIncome.showCopierName = Array.from(new Set(this.addIncome.showCopierName))
      this.addIncome.showCopierId = Array.from(new Set(this.addIncome.showCopierId))
    },
    addCopier () {
      this.addIncome.copierName = this.addIncome.showCopierName
      this.addIncome.copier = this.addIncome.showCopierId
    },
    // 按钮操作返回
    goBack () {
      bus.$emit('on-myclose', this.$route)
      this.$router.push({
        name: 'contractBank'
      })
    },

    // 保存
    saveNewPro () {
      this.$refs.addIncome.validate((valid) => {
        if (valid) {
          if (this.addIncome.enclosure.length >= 1 || this.addIncome.enclosurePic.length >= 1) {
            let {
              router,
              planer, // 合同拟定方
              contractType, // 合同类型
              contractPartycompany, // 公司或个人  1为公司2为个人
              partyCompany, // 公司名称
              openbankId, // 开户行账号
              openbank, // 开户行
              contractNum, // 纳税人识别号
              openingAddress, // 开票地址
              tel, // 联系电话
              contacts, // 对方联系人
              ticketType, // 开票类型
              ticketText, // 开票内容
              sendAddress, // 发票寄送地址
              detailedAddress, // 详细地址
              signer, // 签订人
              wecompany, // 乙方我方公司id
              wecompanybank, // 公司账户id
              timeRage, // 合同期限
              startTime, // 合同开始时间
              endTime, // 合同结束时间
              money, // 合同金额
              remark, // 备注
              contractName, // 合同名称
              service, // 甲方对乙方服务
              serviceTwo, // 乙方对甲方服务
              court, // 法院地址
              approver,
              copier, // 抄送人id
              enclosure, // 附件上传
              invoice,
              enclosurePic,
              companyName,
              tbcId,
              twoEntryId
            } = this.addIncome
            let sendData = {
              router,
              planer, // 合同拟定方
              contractType, // 合同类型
              contractPartycompany, // 公司或个人  1为公司2为个人
              partyCompany, // 公司名称
              openbankId, // 开户行账号
              openbank, // 开户行
              contractNum, // 纳税人识别号
              openingAddress, // 开票地址
              tel, // 联系电话
              contacts, // 对方联系人
              ticketType, // 开票类型
              ticketText, // 开票内容
              sendAddress, // 发票寄送地址
              detailedAddress, // 详细地址
              signer, // 签订人
              wecompany, // 乙方我方公司id
              wecompanybank, // 公司账户id
              startTime, // 合同开始时间
              endTime, // 合同结束时间
              money, // 合同金额
              remark, // 备注
              contractName, // 合同名称
              service, // 甲方对乙方服务
              serviceTwo, // 乙方对甲方服务
              court, // 法院地址
              approver,
              copier, // 抄送人id
              enclosure, // 附件上传
              invoice,
              enclosurePic,
              companyName,
              tbcId,
              twoEntryId
            }
            sendData.router = 'toAuditInform'
            if (timeRage[0]) {
              sendData.startTime = moment(timeRage[0]).format('YYYY-MM-DD')
              sendData.endTime = moment(timeRage[1]).format('YYYY-MM-DD')
            }
            this.$axios({
              url: baseUrl + '/contract/insert',
              method: 'post',
              data: sendData
            }).then(res => {
              if (res.data.code === 10000) {
                this.$Message.info(res.data.msg)
                bus.$emit('on-myclose', this.$route)
                this.$router.push({
                  name: 'toAuditInform'
                })
              } else {
                this.$Message.error(res.data.msg)
              }
            }).catch(err => {
              console.error(err)
            })
          } else {
            this.$Message.error('附件必须上传哦')
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
@import '../public.less';
</style>
