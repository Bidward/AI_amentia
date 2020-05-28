<template>
<!--新增收款合同 我方拟定-->
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
            <!--公司/个人 公司名称-->
            <Row class="rowPadding" v-if="addIncome.contractPartycompany ===1">
                <Col span="3" offset="3" class="title">
                <i class="require">*</i>公司/个人：
                </Col>
                <Col span="5">
                <FormItem prop="contractPartycompany">
                    <Select v-model="addIncome.contractPartycompany"  filterable @on-change="choseCompanyType">
                        <Option v-for="item  in addIncome.contractPartycompanyList" :value="item.id" :key="item.id">{{item.name}}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="3" class="title">
                <i class="require">*</i>公司名称：
                </Col>
                <Col span="5">
                <FormItem prop="partyCompany">
                    <Select v-model="addIncome.partyCompanyId" clearable :label-in-value="true" filterable @on-change="getContractNum">
                        <Option v-for="item  in addIncome.partyCompanyList" :value="item.productCompanyId" :key="item.productCompanyId">{{item.companyName}}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
            <!--公司选择为个人时 -->
            <Row class="rowPadding" v-if="addIncome.contractPartycompany ===2">
                <Col span="3" offset="3" class="title">
                <i class="require">*</i>公司/个人：
                </Col>
                <Col span="5">
                <FormItem prop="contractPartycompany">
                    <Select v-model="addIncome.contractPartycompany"  filterable @on-change="choseCompanyType">
                        <Option v-for="item  in addIncome.contractPartycompanyList" :value="item.id" :key="item.id">{{item.name}}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="3" class="title">
                <i class="require">*</i>姓名：
                </Col>
                <Col span="5">
                <FormItem prop="partyCompany">
                    <Select v-model="addIncome.partyCompanyId" clearable filterable :label-in-value="true" @on-change="getContractNum">
                        <Option v-for="item  in addIncome.productNameTbUser" :value="item.productCompanyId" :key="item.productCompanyId">{{item.companyName}}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>

            <!--公司 开户行账号 开户行-->
            <Row class="rowPadding" v-if="addIncome.contractPartycompany ===1">
                <Col span="3" offset="3" class="title">
                <i class="require">*</i>开户行账号：
                </Col>
                <Col span="5">
                <FormItem prop="openbankId">
                    <Input v-model="addIncome.openbankId" placeholder="开户行账号" clearable filterable></Input>
                </FormItem>
                </Col>
                <Col span="3" class="title">
                <i class="require">*</i>开户行：
                </Col>
                <Col span="5">
                <FormItem prop="openbank">
                    <Input v-model="addIncome.openbank" placeholder="开户行" clearable filterable></Input>
                </FormItem>
                </Col>
            </Row>
            <!--个人  身份证号码 开票地址-->
            <Row class="rowPadding" v-if="addIncome.contractPartycompany ===2">
                <Col span="3" offset="3" class="title">
                <i class="require">*</i>身份证号码：
                </Col>
                <Col span="5">
                <FormItem prop="contractNum">
                    <Input v-model="addIncome.contractNum" placeholder="身份证号码" clearable filterable></Input>
                </FormItem>
                </Col>
                <Col span="3" class="title">
                <i class="require">*</i>开票地址：
                </Col>
                <Col span="5">
                <FormItem prop="openingAddress">
                    <Input v-model="addIncome.openingAddress" placeholder="开票地址" clearable filterable></Input>
                </FormItem>
                </Col>
            </Row>

            <!--个人  开户行 开票地址-->
            <Row class="rowPadding" v-if="addIncome.contractPartycompany ===2">
                <Col span="3" offset="3" class="title">
                <i class="require">*</i>开户行：
                </Col>
                <Col span="5">
                <FormItem prop="openbank">
                    <Input v-model="addIncome.openbank" placeholder="开户行" clearable filterable></Input>
                </FormItem>
                </Col>
                <Col span="3" class="title">
                <i class="require">*</i>联系电话：
                </Col>
                <Col span="5">
                <FormItem prop="tel">
                    <Input v-model="addIncome.tel" placeholder="联系电话" clearable filterable></Input>
                </FormItem>
                </Col>
            </Row>
            <!--个人 发票寄送地址 详细地址-->
            <Row class="rowPadding" v-if="addIncome.contractPartycompany ===2">
                <Col span="3" offset="3" class="title">
                发票寄送地址：
                </Col>
                <Col span="5">
                <!-- <Input v-model="addIncome.busicityList" placeholder=" 发票寄送地址" clearable filterable></Input> -->
                <Cascader :data="addIncome.busicityListData" v-model="addIncome.busicityList"></Cascader>
                </Col>
                <Col span="3" class="title">
                详细地址：
                </Col>
                <Col span="5">
                <Input v-model="addIncome.detailedAddress" placeholder="详细地址" clearable filterable></Input>
                </Col>
            </Row>
        </div>
        <!--开票信息-->
        <div class="detailContent" v-if="addIncome.contractPartycompany ===1">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">开票信息</Col>
            </Row>
            <!--纳税人识别号 开票地址-->
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">
                <i class="require">*</i>纳税人识别号：
                </Col>
                <Col span="5">
                <FormItem prop="contractNum">
                    <Input v-model="addIncome.contractNum" placeholder="纳税人识别号" clearable filterable></Input>
                </FormItem>
                </Col>
                <Col span="3" class="title">
                <i class="require">*</i>开票地址：
                </Col>
                <Col span="5">
                <FormItem prop="openingAddress">
                    <Input v-model="addIncome.openingAddress" placeholder="开票地址" clearable filterable></Input>
                </FormItem>
                </Col>
            </Row>

            <!--对方联系人 联系电话-->
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">
                <i class="require">*</i>对方联系人：
                </Col>
                <Col span="5">
                <FormItem prop="contacts">
                    <Input v-model="addIncome.contacts" placeholder="对方联系人" clearable filterable></Input>
                </FormItem>
                </Col>
                <Col span="3" class="title">
                <i class="require">*</i>联系电话：
                </Col>
                <Col span="5">
                <FormItem prop="tel">
                    <Input v-model="addIncome.tel" placeholder="联系电话" clearable filterable></Input>
                </FormItem>
                </Col>
            </Row>

            <!--开票类型 开票内容-->
            <Row class="rowPadding">
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
                <Col span="3" class="title">
                <i class="require">*</i>开票内容：
                </Col>
                <Col span="5">
                <FormItem prop="ticketText">
                    <Select v-model="addIncome.ticketText" :label-in-value="true" clearable filterable @on-change="getTickTextName">
                        <Option v-for="item  in addIncome.ticketTextList" :value="item.id" :key="item.id">{{item.title}}</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>

            <!--发票寄送地址 详细地址-->
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">
                发票寄送地址：
                </Col>
                <Col span="5">
                <!-- <Input v-model="addIncome.busicityList" placeholder=" 发票寄送地址" clearable filterable></Input> -->
                <Cascader :data="addIncome.busicityListData" v-model="addIncome.busicityList"></Cascader>
                </Col>
                <Col span="3" class="title">
                详细地址：
                </Col>
                <Col span="5">
                <Input v-model="addIncome.detailedAddress" placeholder="详细地址" clearable filterable></Input>
                </Col>
            </Row>
        </div>

        <!--乙方-->
        <div class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">乙方</Col>
            </Row>
            <!--签订人 我方公司-->
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">
                <i class="require">*</i>签订人：
                </Col>
                <Col span="5">
                <FormItem prop="signer">
                    <Select v-model="addIncome.signer" clearable filterable :label-in-value="true" @on-change="getSignerName">
                        <Option v-for="item in incumbencyTbUser" :value="item.id" :key="item.id">{{item.nickname}}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="3" class="title">
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
                    <Select v-model="addIncome.wecompanybank" clearable filterable :label-in-value="true" @on-change="getCompanyName">
                        <Option v-for="item in addIncome.wecompanybankList" :value="item.id" :key="item.id">{{item.account}}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="3" class="title">
                <i class="require">*</i>合同期限：
                </Col>
                <Col span="5">
                <FormItem prop="startAndEndTime">

                    <DatePicker v-model="addIncome.startAndEndTime" type="daterange" split-panels placeholder="选择期限" style="width: 227px"></DatePicker>
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
            </Row>
        </div>
        <!--备注-->
        <div class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">备注</Col>
            </Row>
            <!--备注-->
            <Row class="rowPadding">
                <Col span="5" offset="4">
                <Input v-model="addIncome.remark" type="textarea" placeholder="请输入备注" clearable style="width:425px"></Input>
                </Col>
            </Row>
        </div>
        <!--附件-->
        <div class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">附件</Col>
            </Row>
            <Row class="rowPadding">
                <Col span="3" offset="2" class="title">
                <i class="require">*</i>文件上传：
                </Col>
                <Col span="5">
                <Upload class="bzUpload" multiple name="fileData" :on-success="(value)=> uploadFileSuccess(value)" :max-size="20480"  :on-exceeded-size="uploadFileError"  :action="staticUrl+'/index.php'">
                    <Button icon="ios-cloud-upload-outline">单个文件不能超过20MB</Button>
                </Upload>
                <div v-for="(item,index) in addIncome.enclosure" :key="index">
                    <span><a :href="item.enclosureUrl">{{item.enclosureName}}</a></span>
                </div>

                </Col>
                <Col span="3" offset="2" class="title">
                <i class="require">*</i>图片上传：
                </Col>
                <Col span="5">
                <Upload class="bzUpload" multiple :show-upload-list="false" :format="['jpg','jpeg','png']" :max-size="20480" name="fileData" :on-format-error="(file)=>uploadError(file)" :on-success="(value)=> uploadPhotoSuccess(value)" :action="staticUrl+'/index.php'">
                    <Button icon="ios-cloud-upload-outline">单张图片不能超过20MB</Button>
                </Upload>
                <viewer  :images='addIncome.enclosurePic'>
                     <div style="width:360px;display:flex;flex-wrap:wrap;">
                        <div   v-for="(item,index) in addIncome.enclosurePic" :key="index">
                          <Icon v-if="addIncome.enclosurePic.length>=1" type="ios-close-circle-outline" style="position: relative;left: 85px;top: -72px;color: red;" @click="deleteImg(index)" />
                          <img v-if="addIncome.enclosurePic.length>=1" style="width: 70px;height: 70px;margin: 10px;" :src="item.enclosureUrl" class="inputbox">
                        </div>
                    </div>
                </viewer>
                </Col>
            </Row>
        </div>
        <!--抄送人-->
        <div class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">抄送人</Col>
            </Row>
            <Row class="rowPadding">
                <Col span="17" offset="4">
                <Icon type="ios-add-circle-outline" size="50" @click="showNotice=true" style="margin-top: 22px;color: #CCC;" />
                <div v-for="(item,index) in this.addIncome.copieruserName" :key="index" style="float: left;margin-right: 15px;">
                    <Icon type="md-close" style="color: red; position: relative;left: 33px;top: 12px;cursor: pointer;" @click="deletCopier(index)" />
                    <Icon type="ios-contacts" size="50" @click="showNotice=true" style="display: block;"></Icon>
                    <p style="">{{item+' '||'抄送人'}}</p>
                </div>
                </Col>
            </Row>
            <!--抄送人弹窗-->
            <Modal :mask-closable="false" id="addNotice" v-model="showNotice" title="抄送人" @on-ok="addCopier()">
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
            <!-- <Button type="primary" @click="preview()" style="margin-right:30px">预览</Button> -->
            <Button type="primary" @click="saveNewPro">保存</Button>
            </Col>
        </Row>
    </div>
</div>
</template>

<script>
import {
  phpURL,
  baseUrl,
  staticUrl
} from '@/api/base.js'
import delImg from '@/assets/images/close.png'
import moment from 'moment'
export default {
  name: 'rebuild',
  data () {
    return {
      staticUrl,
      imgs: {
        delImg
      },
      showImage: [], // 展示上传后的图片
      // isPerson: false, // 产品公司类型为个人
      showNotice: false, // 抄送人弹窗
      addIncome: {
        partyCompanyId: '',
        productNameTbUser: [],
        tickTypeName: '',
        tickTextName: '',
        contractPartycompanyName: '', // 根据甲方公司名称id获取name
        router: '', // 当前路由名称
        licenseUrls: [],
        planer: '1', // 合同拟定方
        planerList: [{
          id: '1',
          name: '我方合同'
        }, {
          id: '2',
          name: '对方合同'
        }],
        contractType: '1', // 合同类型
        contractTypeList: [{
          id: '1',
          name: '收款合同'
        }, {
          id: '2',
          name: '付款合同'
        }],
        contractPartycompany: '', // 公司或个人  1为公司2为个人
        contractPartycompanyList: [{
          id: 1,
          name: '公司'
        }, {
          id: 2,
          name: '个人'
        }],
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
        busicityList: [], // 发票寄送地址
        detailedAddress: '', // 详细地址
        signer: '', // 签订人
        signerName: '', // 签订人name
        // incumbencyTbUser: [], // 签订人列表
        wecompany: '', // 乙方我方公司id
        wecompanyList: [], // 乙方我方公司List
        wecompanybank: '', // 公司账户id
        wecompanybankList: [], // 公司账户list
        wecompanybankName: '',
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
        enclosure: [], // 附件
        enclosurePic: [], // 图片
        busicityListData: [],
        copieruserName: [], // 抄送人名称
        startAndEndTime: ''
      },
      ruleAddIncome: {
        contractPartycompany: [{
          required: true,
          message: '公司/个人是必填项哦'
        }],
        partyCompanyId: [{
          required: true,
          message: '公司名称/姓名是必填项哦'
        }],
        openbankId: [{
          required: true,
          message: '开户行账号是必填项哦'
        }],
        openbank: [{
          required: true,
          message: '开户行是必填项哦'
        }],
        contractNum: [{
          required: true,
          message: '纳税人识别号/身份证是必填项哦'
        }],
        openingAddress: [{
          required: true,
          message: '开票地址是必填项哦'
        }],
        tel: [{
          required: true,
          message: '联系电话是必填项哦'
        }],
        contacts: [{
          required: true,
          message: '对方联系人是必填项哦'
        }],
        ticketType: [{
          required: true,
          message: '开票类型是必填项哦'
        }],
        ticketText: [{
          required: true,
          message: '开票内容是必填项哦'
        }],
        signer: [{
          required: true,
          message: '签订人是必填项哦'
        }],
        wecompany: [{
          required: true,
          message: '我方公司是必填项哦'
        }],
        wecompanybank: [{
          required: true,
          message: '公司账号是必填项哦',
          trigger: 'blur'
        }],
        startAndEndTime: [{
          required: true,
          message: '合同期限是必填项哦'
        }],
        contractName: [{
          required: true,
          message: '合同名称是必填项哦'
        }],
        serviceTwo: [{
          required: true,
          message: '必填项哦'
        }],
        service: [{
          required: true,
          message: '必填项哦'
        }],
        court: [{
          required: true,
          message: '法院必填项哦'
        }]
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
    // this.addIncome = this.$store.state.user.vuexContractData
  },
  methods: {
    getData () {
      // 获取省市区
      this.$axios({
        url: baseUrl + '/Auditing/Busicity',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.addIncome.busicityListData = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
      // 获取抄送人，通知人默认带的主管名称
      this.$axios({
        url: baseUrl + '/contract/getSausage',
        method: 'post',
        data: $qs.stringify({
          Type: 1
        })
      }).then(res => {
        if (res.data.code === 10000) {
          this.addIncome.copier.push(res.data.content.id)
          this.addIncome.copieruserName.push(res.data.content.nickname)
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
      // 收款合同里的公司是产品公司
      this.$axios({
        url: phpURL + '/cloud/getAllProductCompanies',
        method: 'get'
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
      //   公司类型为个人时的姓名 productNameTbUser
      this.$axios({
        url: phpURL + '/cloud/getAllProductCompanies',
        method: 'post',
        data: $qs.stringify({
          companyType: 2
        })

      }).then(res => {
        if (res.data.code === 10000) {
          this.addIncome.productNameTbUser = res.data.content
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
    // 获取回显数据
    getEchoData () {
      let sendData = {
        id: this.$route.query.id
      }
      this.$axios({
        url: baseUrl + '/contract/info',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          let _c = this.addIncome
          let _p = res.data.content
          _c.contractPartycompany = _p.contractPartycompany // 公司/个人
          _c.openbank = _p.openbank // 开户行
          _c.openbankId = _p.openbankId // 开户行账号
          _c.contractNum = _p.contractNum // 纳税人识别号
          _c.openingAddress = _p.openingAddress // 开票地址
          _c.contacts = _p.contacts // 对方联系人
          _c.tel = _p.tel // 联系电话
          _c.detailedAddress = _p.detailedAddress // 对方联系人
          _c.ticketType = _p.ticketType // 开票类型
          _c.ticketText = _p.ticketText // 开票内容
          _c.busicityList = _p.busicityList // 发票寄送地址
          _c.signer = _p.signer // 签订人
          // _c.signer = _p.signer //签订人
          _c.wecompany = _p.wecompany // 我放公司
          _c.partyCompanyId = _p.partyCompanyId // 公司名称/姓名
          _c.wecompanybank = _p.wecompanybank
          // console.log(_c.wecompanybank)
          _c.money = _p.money
          _c.remark = _p.remark
          _c.copierName = _p.copierName
          _c.enclosure = _p.enclosure
          _c.startTime = _p.startTime
          _c.endTime = _p.endTime
          _c.startAndEndTime = _p.startAndEndTime
          _c.wecompanybankName = _p.wecompanybankName
          _c.enclosurePic = _p.enclosurePic
          // 根据公司名称id获取公司账号
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
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 附件上传成功
    uploadFileSuccess (response, file, fileList) {
      if (response.rel === true) {
        // 文件上传展示
        this.addIncome.enclosure.push({
          enclosureUrl: staticUrl + '' + response.url,
          enclosureName: response.filename
        })
        // console.log(this.addIncome.enclosure)
      } else {
        console.error(response.msg)
      }
    },
    // 上传文件超过20M
    uploadFileError (response, file, fileList) {
      if (response.size > 20480) {
        this.$message.error('文件上传失败 大小超过20M')
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
    deleteImg (index) {
      this.addIncome.enclosurePic.splice(index, 1)
    },
    // 删除抄送人
    deletCopier (index) {
      this.addIncome.copier.splice(index, 1)
      this.addIncome.copieruserName.splice(index, 1)
    },
    // 产品公司选择
    choseCompanyType () {
      //   if (this.addIncome.contractPartycompany === 1) {
      //     this.isPerson = false
      //   } else if (this.addIncome.contractPartycompany === 2) {
      //     this.isPerson = true
      //     // 公司到个人时 清空部分数据
      //     let _i = this.addIncome
      //     _i.partyCompany = ''
      //     _i.contractNum = ''
      //     _i.openingAddress = ''
      //     _i.openbank = ''
      //     _i.tel = ''
      //   }
    },
    // 获取开票类型name
    getTickTypeName (ids) {
      this.addIncome.tickTypeName = ids.label
    },
    // 获取开票内容name
    getTickTextName (ids) {
      this.addIncome.tickTextName = ids.label
    },
    // 获取公司名称name
    getCompanyName (ids) {
      console.log(ids)
      this.addIncome.wecompanybankName = ids.label
    },
    // 获取纳税人识别号
    getContractNum (ids) {
      // 将公司名称的id转为name 给预览使用
      if (this.addIncome.contractPartycompany === 1) {
        //   console.log('公司')
        this.addIncome.contractPartycompanyName = ids.label
        let sendData = {
          productCompanyId: this.addIncome.partyCompanyId
        }
        this.$axios({
          url: phpURL + '/cloud/getTicketInfoByProductCompanyId',
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
              _i.ticketType = _r.ticketType // 开票类型
              _i.ticketText = _r.ticketText // 开票内容
              _i.openbankId = _r.openingBankCard
              _i.openbank = _r.openingBank
            } else {
              _i.contractNum = ''
              _i.openingAddress = ''
              _i.contacts = ''
              _i.tel = ''
              // _i.ticketType = ''// 开票类型
              // _i.ticketText = ''// 开票内容
              _i.openbankId = ''
              _i.openbank = ''
            }
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.error(err)
        })
      } else if (this.addIncome.contractPartycompany === 2) {
        let sendData = {
          productCompanyId: this.addIncome.partyCompanyId,
          type: 2
        }
        this.$axios({
          url: phpURL + '/cloud/getTicketInfoByProductCompanyId',
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
              _i.ticketType = _r.ticketType // 开票类型
              _i.ticketText = _r.ticketText // 开票内容
              _i.openbankId = _r.openingBankCard
              _i.openbank = _r.openingBank
            } else {
              _i.contractNum = ''
              _i.openingAddress = ''
              _i.contacts = ''
              _i.tel = ''
              // _i.ticketType = ''// 开票类型
              // _i.ticketText = ''// 开票内容
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
      //   if (this.addIncome.contractPartycompany === 1) {
      this.addIncome.wecompanyName = ids.label
      //   }
      this.addIncome.wecompanybank = ''
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
      this.addIncome.copieruserName = this.addIncome.showCopierName
      this.addIncome.copier = this.addIncome.showCopierId
    },
    // 按钮操作返回
    goBack () {
      bus.$emit('on-myclose', this.$route)
      this.$router.push({
        name: 'contractBank'
      })
    },
    // 预览
    // preview() {
    //     this.$store.commit('vuexContractData', this.addIncome)
    //     this.$router.push({
    //         name: 'contractView'
    //     })
    //     // this.addIncome = this.$store.state.user.vuexContractData
    // },
    // 保存
    saveNewPro () {
      this.$refs.addIncome.validate((valid) => {
        if (valid) {
          if (this.addIncome.enclosure.length >= 1 || this.addIncome.enclosurePic.length >= 1) {
            let {
              router, // 当前路由名称
              planer, // 合同拟定方
              contractType, // 合同类型
              contractPartycompany, // 公司或个人  1为公司2为个人
              // partyCompany, // 公司名称
              partyCompanyId,
              openbankId, // 开户行账号
              openbank, // 开户行
              contractNum, // 纳税人识别号
              openingAddress, // 开票地址
              tel, // 联系电话
              contacts, // 对方联系人
              ticketType, // 开票类型
              ticketText, // 开票内容
              busicityList, // 发票寄送地址
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
              copier, // 抄送人id
              enclosure,
              enclosurePic, // 附件上传
              startAndEndTime
            } = this.addIncome
            let sendData = {
              router, // 当前路由名称
              planer, // 合同拟定方
              contractType, // 合同类型
              contractPartycompany, // 公司或个人  1为公司2为个人
              // partyCompany, // 公司名称
              partyCompanyId,
              openbankId, // 开户行账号
              openbank, // 开户行
              contractNum, // 纳税人识别号
              openingAddress, // 开票地址
              tel, // 联系电话
              contacts, // 对方联系人
              ticketType, // 开票类型
              ticketText, // 开票内容
              busicityList, // 发票寄送地址
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
              copier, // 抄送人id
              enclosure,
              enclosurePic, // 附件上传
              startAndEndTime
            }
            sendData.router = this.$route.name
            if (startAndEndTime[0]) {
              sendData.startTime = moment(startAndEndTime[0]).format('YYYY-MM-DD')
              sendData.endTime = moment(startAndEndTime[1]).format('YYYY-MM-DD')
            }
            this.$axios({
              url: baseUrl + '/contract/redraw',
              method: 'post',
              data: sendData
            }).then(res => {
              if (res.data.code === 10000) {
                this.$Message.info(res.data.msg)
                bus.$emit('on-myclose', this.$route)
                this.$router.push({
                  name: 'contractBank'
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
#colorFont {
    .ivu-select {
        display: inline-block;
        width: 100%;
        box-sizing: border-box;
        vertical-align: middle;
        color: #515a6e;
        font-size: 14px;
        line-height: normal;
    }

    .ivu-select-single .ivu-select-selection {
        height: 32px;
        position: relative;
    }

    .ivu-select-input {
        display: inline-block;
        height: 32px;
        line-height: 32px;
        padding: 0 24px 0 8px;
        font-size: 12px;
        outline: 0;
        border: none;
        box-sizing: border-box;
        color: #515a6e !important;
        background-color: transparent;
        position: relative;
        cursor: pointer;
    }
}

.bzUpload {
    .ivu-btn:hover {
        color: #19aa8d;
        background-color: #fff;
        border-color: #19aa8d;
    }

    .ivu-btn.active,
    .ivu-btn:active {
        color: #19aa8d;
        background-color: #fff;
        border-color: #19aa8d;
    }

    .ivu-btn:focus {
        box-shadow: none;
    }
}
</style><style lang="less" scoped>
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
</style>
