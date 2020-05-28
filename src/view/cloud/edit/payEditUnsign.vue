<template>
<!--编辑待签订合同-->
<div class="cloudCooper">
    <div class="detailContent">
        <!--合同拟定方 合同类型-->
        <Row class="rowPadding">
            <Col span="3" offset="3" class="title">合同拟定方：</Col>
            <Col span="5">
            <p class="top">{{addIncome.planerName ||'暂无'}}</p>
            </Col>
            <Col span="3" class="title">合同类型：</Col>
            <Col span="5">
            <p class="top">{{addIncome.contractTypeName ||'暂无'}}</p>
            </Col>
        </Row>
        <Row class="rowPadding">
            <Col span="3" offset="3" class="title">合同编码：</Col>
            <Col span="5">
            <p class="top">{{addIncome.card ||'暂无'}}</p>
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
            签订人：
            </Col>
            <Col span="5">
            <p class="top">{{addIncome.signerName||'暂无'}}</p>
            </Col>
            <Col span="3" class="title">
            我方公司：
            </Col>
            <Col span="5">
            <p class="top">{{addIncome.wecompanyName||'暂无'}}</p>
            </Col>
        </Row>

        <!--公司账号 合同期限-->
        <Row class="rowPadding">
            <Col span="3" offset="3" class="title">
            公司账号：
            </Col>
            <Col span="5">
            <p class="top">{{addIncome.wecompanybankName||'暂无'}}</p>
            </Col>
            <Col span="3" class="title">
            合同期限：
            </Col>
            <Col span="5">
            <p class="top">{{addIncome.startTime+' ~ '+addIncome.endTime||'暂无'}}</p>
            </Col>
        </Row>
        <!--合同金额-->
        <Row class="rowPadding">
            <Col span="3" offset="3" class="title">合同金额：</Col>
            <Col span="5">
            <p class="top">{{addIncome.money||'暂无'}}</p>
            </Col>
        </Row>

        <!--开票类型 开票内容-->
        <Row class="rowPadding">
            <Col span="3" offset="3" class="title">
            开票类型：
            </Col>
            <Col span="5">
            <p class="top">{{addIncome.ticketTypeName||'暂无'}}</p>
            </Col>
            <Col span="3" class="title">
            开票内容：
            </Col>
            <Col span="5">
            <p class="top">{{addIncome.ticketTextName||'暂无'}}</p>
            </Col>
        </Row>
    </div>
    <!--乙方-->
    <div class="detailContent">
        <Row class="rowPadding">
            <Col span="12" offset="3" class="cardTitle">乙方</Col>
        </Row>
        <div> <!--  v-if="addIncome.contractPartycompany===1" 去除了这个属性-->
            <!--公司/个人 公司名称-->
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">
                公司/个人：
                </Col>
                <Col span="5">
                <p class="top">{{addIncome.contractPartycompanyName ||'暂无'}}</p>
                </Col>
                <Col span="3" class="title">
                公司名称：
                </Col>
                <Col span="5">
                <p class="top">{{addIncome.partyCompany ||'暂无'}}</p>
                </Col>
            </Row>
                <!--公司 开户行账号 开户行-->
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">
                开户行账号：
                </Col>
                <Col span="5">
                <p class="top">{{addIncome.openbankId ||'暂无'}}</p>
                </Col>
                <Col span="3" class="title">
                开户行：
                </Col>
                <Col span="5">
                <p class="top">{{addIncome.openbank ||'暂无'}}</p>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">
                对方联系人：
                </Col>
                <Col span="5">
                <p class="top">{{addIncome.contacts ||'暂无'}}</p>
                </Col>
                <Col span="3" class="title">
                联系电话：
                </Col>
                <Col span="5">
                <p class="top">{{addIncome.tel ||'暂无'}}</p>
                </Col>
            </Row>
        </div>
        <div v-if="addIncome.contractPartycompany===2">
            <!--公司选择为个人时 -->
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">
                公司/个人：
                </Col>
                <Col span="5">
                <p class="top">{{addIncome.contractPartycompanyName ||'暂无'}}</p>
                </Col>
                <Col span="3" class="title">
                姓名：
                </Col>
                <Col span="5">
                <p class="top">{{addIncome.partyCompany ||'暂无'}}</p>
                </Col>
            </Row>
            <!--个人  身份证号码 开票地址-->
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">
                身份证号码：
                </Col>
                <Col span="5">
                <p class="top">{{addIncome.contractNum||'暂无'}}</p>
                </Col>
                <Col span="3" class="title">
                开户行账号：
                </Col>
                <Col span="5">
                <p class="top">{{addIncome.openbankId||'暂无'}}</p>
                </Col>
            </Row>

            <!--个人  开户行 开票地址-->
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">
                开户行：
                </Col>
                <Col span="5">
                <p class="top">{{addIncome.openbank||'暂无'}}</p>
                </Col>
                <Col span="3" class="title">对方联系人：</Col>
                <Col span="5">
                <p class="top">{{addIncome.contacts||'暂无'}}</p>
                </Col>
            </Row>
            <!--个人  联系电话-->
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">联系电话</Col>
                <Col span="5">
                <p class="top">{{addIncome.tel||'暂无'}}</p>
                </Col>
            </Row>
        </div>
    </div>
    <!--备注-->
    <div class="detailContent">
        <Row class="rowPadding">
            <Col span="12" offset="3" class="cardTitle">备注</Col>
        </Row>
        <!--备注-->
        <Row class="rowPadding">
            <Col span="5" offset="4">
            <p class="top">{{addIncome.remark||'暂无'}}</p>
            </Col>
        </Row>
    </div>
    <!--附件-->
    <div class="detailContent" v-if="isTwo">
      <!--待签订进入 -->
        <div v-if="twoEntry2">
          <Row class="rowPadding">
            <Col span="12" offset="3" class="cardTitle">附件</Col>
        </Row>
        <Row class="rowPadding">
            <Col span="3" offset="2" class="title">
             <i class="require">*</i>文件上传：
            </Col>
             <Col span="5">
                <p class="top" v-for="(item,index) in addIncome.enclosure" :key="index"><a :href="item.enclosureUrl">{{item.enclosureName}}</a></p>
                <Upload class="bzUpload"
                multiple
                name="fileData"
                :on-success="(value)=> uploadFileSuccess(value)"
                :action="staticUrl+'/index.php'"
                >
                    <Button icon="ios-cloud-upload-outline">单个文件不能超过20MB</Button>

                </Upload>
            </Col>
            <Col span="3" offset="2" class="title">
                    <i class="require">*</i> 图片上传：
            </Col>
            <Col span="5">
                <Upload class="bzUpload"
                multiple
                :show-upload-list="false"
                :format="['jpg','jpeg','png']"
                :max-size="20480"
                name="fileData"
                :on-format-error ="(file)=>uploadError(file)"
                :on-success="(value)=> uploadPhotoSuccess(value)"
                :action="staticUrl+'/index.php'"
                >
                    <Button icon="ios-cloud-upload-outline">单张图片不能超过20MB</Button>
                    <p style="color:red">(上传盖章纸质合同)</p>
                </Upload>
              <viewer  :images="addIncome.enclosurePic">
                <div style="width:360px;display:flex;flex-wrap:wrap;">
                  <div v-for="(item1,index) in addIncome.enclosurePic" :key="index">
                      <!-- <Icon v-if="addIncome.enclosurePic.length>=1" type="ios-close-circle-outline" style="position: relative;left: 86px;top: -80px;color: red;" @click="deleteImg(index)" /> -->
                      <img  v-if="addIncome.enclosurePic.length>=1" style="width: 70px;height: 70px;margin: 10px;" :src="item1.enclosureUrl" class="inputbox">
                  </div>
                  <viewer :images="newenclosurePic">
                    <div style="width:360px;display:flex;flex-wrap:wrap;">
                    <div v-for="(item1,index) in newenclosurePic" :key="index+addIncome.enclosurePic.length">
                      <Icon v-if="addIncome.enclosurePic.length>=1" type="ios-close-circle-outline" style="position: relative;left: 86px;top: -80px;color: red;" @click="deleteImg(index)" />
                      <img  v-if="addIncome.enclosurePic.length>=1" style="width: 70px;height: 70px;margin: 10px;" :src="item1.enclosureUrl" class="inputbox">
                  </div>
                  </div>
                  </viewer>
                </div>
              </viewer>
            </Col>
        </Row>
        </div>
        <!--待确认合同编辑进入 -->
        <div v-if="twoEntry">
          <Row class="rowPadding">
            <Col span="12" offset="3" class="cardTitle">附件</Col>
        </Row>
        <Row class="rowPadding">
            <Col span="3" offset="2" class="title">
             <i class="require">*</i>文件上传：
            </Col>
             <Col span="5">
                <p class="top" v-for="(item,index) in addIncome.enclosure" :key="index"><a :href="item.enclosureUrl">{{item.enclosureName}}</a></p>
                <Upload class="bzUpload"
                multiple
                name="fileData"
                :on-success="(value)=> uploadFileSuccess(value)"
                :action="staticUrl+'/index.php'"
                >
                    <Button icon="ios-cloud-upload-outline">单个文件不能超过20MB</Button>

                </Upload>
            </Col>
            <Col span="3" offset="2" class="title">
                    <i class="require">*</i> 图片上传：
            </Col>
            <Col span="5">
                <Upload class="bzUpload"
                multiple
                :show-upload-list="false"
                :format="['jpg','jpeg','png']"
                :max-size="20480"
                name="fileData"
                :on-format-error ="(file)=>uploadError(file)"
                :on-success="(value)=> uploadPhotoSuccess(value)"
                :action="staticUrl+'/index.php'"
                >
                    <Button icon="ios-cloud-upload-outline">单张图片不能超过20MB</Button>
                    <p style="color:red">(上传盖章纸质合同)</p>
                </Upload>
                <viewer  :images="addIncome.enclosurePic">
                  <div style="width:360px;display:flex;flex-wrap:wrap;">
                    <div v-for="(item1,index) in addIncome.enclosurePic" :key="index">
                        <!-- <Icon v-if="addIncome.enclosurePic.length>=1" type="ios-close-circle-outline" style="position: relative;left: 86px;top: -80px;color: red;" @click="deleteImg(index)" /> -->
                        <img  v-if="addIncome.enclosurePic.length>=1" style="width: 70px;height: 70px;margin: 10px;" :src="item1.enclosureUrl" class="inputbox">
                    </div>
                    <div v-for="(item1,index) in newenclosurePic" :key="index+addIncome.enclosurePic.length">
                      <Icon v-if="addIncome.enclosurePic.length>=1" type="ios-close-circle-outline" style="position: relative;left: 86px;top: -80px;color: red;" @click="deleteImg(index)" />
                      <img  v-if="addIncome.enclosurePic.length>=1" style="width: 70px;height: 70px;margin: 10px;" :src="item1.enclosureUrl" class="inputbox">
                    </div>
                  </div>
                </viewer>
            </Col>
        </Row>
        </div>
    </div>
    <!--附件 第二人录入 附件不用上传  只用判断是否是正确的-->
    <div class="detailContent" v-if="!isTwo">
        <Row class="rowPadding">
            <Col span="12" offset="3" class="cardTitle">附件</Col>
        </Row>
        <Row class="rowPadding" >

            <Col span="3" offset="2" class="title">
                <i class="require">*</i> 文件上传：
            </Col>
            <Col span="5">
                <div v-for = "(item,index) in addIncome.enclosure" :key="index">
                    <span><a :href="item.enclosureUrl">{{item.enclosureName}}</a></span>
                </div>
            </Col>
            <Col span="3" offset="2" class="title">
                 <i class="require">*</i>图片上传：
            </Col>
            <Col span="5">
                <viewer  :images="addIncome.enclosurePic">
                    <div style="width:360px;display:flex;flex-wrap:wrap;">
                       <div v-for="(item1,index) in addIncome.enclosurePic" :key="index">
                          <!-- <Icon v-if="addIncome.enclosurePic.length>=1" type="ios-close-circle-outline" style="position: relative;left: 86px;top: -80px;color: red;" @click="deleteImg(index)" /> -->
                          <img  v-if="addIncome.enclosurePic.length>=1" style="width: 70px;height: 70px;margin: 10px;" :src="item1.enclosureUrl" class="inputbox">
                       </div>
                    </div>
                </viewer>
            </Col>
        </Row>
        <Row class="rowPadding" >
            <Col span="3" offset="2" class="title">
                <i class="require">*</i>附件判断：
            </Col>
                <Col span="5">
                <Button type="default" v-if="isCorrect" @click="enclosureSure" style="margin-right:10px;">正确</Button>
                <Button type="primary" v-else @click="enclosureSure" style="margin-right:10px;">正确</Button>
                <Button type="default" v-if="isError" @click="enclosureError">错误</Button>
                <Button type="error" v-else @click="enclosureError">错误</Button>
            </Col>
        </Row>
    </div>
    <!--通知人-->
    <div class="detailContent" v-if="isTwo">
        <Row class="rowPadding">
            <Col span="12" offset="3" class="cardTitle">通知人</Col>
        </Row>
        <!--通知人-->
        <Row class="rowPadding" v-if="twoEntry2" >
            <Col span="17" offset="4">
                <Icon type="ios-add-circle-outline" v-if="addTwoEntry" size="50" @click="showEntry=true" style="margin-top: 22px; color: #CCC;"/>
                <div  v-else style="float: left;margin-right: 15px;">
                    <Icon type="ios-contacts" size="50" @click="showEntry=true" style="display: block;"></Icon>
                    <p style="">{{this.addIncome.twoEntryName+'  '||'通知人'}}</p>
                </div>
            </Col>
        </Row>
        <Row class="rowPadding" v-if="twoEntry" >
            <Col span="17" offset="4">
                <Icon type="ios-add-circle-outline" v-if="addTwoEntry" size="50" @click="showEntry=true" style="margin-top: 22px; color: #CCC;"/>
                <div  v-else style="float: left;margin-right: 15px;">
                    <Icon type="ios-contacts" size="50"  style="display: block;"></Icon>
                    <p style="">{{this.addIncome.twoEntryName+'  '||'通知人'}}</p>
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
            <Col span="5" offset="4">
                <div
                    v-for="(item,index) in this.addIncome.copieruserName"
                    :key="index"
                    style="float: left;margin-right: 15px;"
                >
                    <Icon
                    type="md-close"
                    style="color: red; position: relative;left: 33px;top: 12px;cursor: pointer;"
                    @click="deletCopier(index)"
                    />
                    <Icon type="ios-contacts" size="50" @click="showNotice=true" style="display: block;"></Icon>
                    <p style="display: inline;">{{item+' '||'抄送人'}}</p>
                </div>
                <Icon
                    type="ios-add-circle-outline"
                    size="50"
                    @click="showNotice=true"
                    style="margin-top: 22px;color: #CCC;"
                />
            </Col>
        </Row>
         <!--通知人弹窗-->
        <Modal  :mask-closable="false" id="addNotice" v-model="showEntry" title="通知人" @on-ok="ok">
            <Select :value="addIncome.twoEntryId" filterable  :label-in-value="true" @on-change="getEntryName">
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
    <!--信息对比-->
    <div class="detailContent" v-if="compareContent">
        <Row class="rowPadding">
            <Col span="12" offset="3" class="cardTitle">信息对比</Col>
        </Row>
        <Row class="rowPadding" >
            <Col span="7" offset="4">
                <div class="compareClasee">
                    <div class="compareHeader">不同项</div>
                    <div class="compareContentClass" v-for = "(item,index) in compareData" :key="index">
                        <p>{{item}}</p>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
    <!--操作按钮-->
    <div class="detailContent">
        <Row class="rowPadding">
            <Col span="12" offset="10">
            <Button type="warning" style="margin-right:30px" @click="goBack()">返回</Button>
            <Button type="primary" @click="saveSupplement()">保存</Button>
            </Col>
        </Row>
    </div>
</div>
</template>

<script>
import {
  baseUrl,
  staticUrl
} from '@/api/base.js'
export default {
  name: 'editUnsign',
  data () {
    return {
      staticUrl,
      compareContent: false,
      compareData: [], // 信息对比数据
      tbcId: this.$route.query.id,
      isCorrect: true,
      isError: true,
      isTwo: true,
      agree: '',
      showEntry: false,
      addTwoEntry: true,
      showWord: [], // 上传的补充协议
      isPerson: false, // 产品公司类型为个人
      showNotice: false, // 抄送人弹窗
      enclosureWord: [],
      // incumbencyTbUser: [], // 成员列表
      flag: false,
      newenclosure: [],
      newenclosurePic: [],
      twoEntry: false,
      twoEntry2: true,
      addIncome: {
        agreeStatus: 0,
        twoEntryId: '',
        twoEntryName: '', // 通知人姓名用于显示
        planerName: '', // 合同拟定方
        contractTypeName: '', // 合同类型
        copieruserName: [],
        companyType: '', // 公司或个人  1为公司2为个人
        companyTypeList: [{
          id: '1',
          name: '公司'
        },
        {
          id: '2',
          name: '个人'
        }
        ],
        partyCompany: '', // 公司名称
        partyCompanyList: [], // 公司名称列表 别人公司
        openbankId: '', // 开户行账号
        openbank: '', // 开户行
        contractNum: '', // 纳税人识别号
        openingAddress: '', // 开票地址
        tel: '', // 联系电话
        contacts: '', // 对方联系人
        ticketTypeName: '', // 开票类型
        ticketTextName: '', // 开票内容
        sendAddress: '', // 发票寄送地址
        detailedAddress: '', // 详细地址
        signerName: '', // 签订人
        wecompanyName: '', // 乙方我方公司id
        wecompanybankName: '', // 公司账户id
        timeRage: [], // 合同期限
        startTime: '', // 合同开始时间
        endTime: '', // 合同结束时间
        money: '', // 合同金额
        remark: '', // 备注
        contractName: '', // 合同名称
        service: '', // 甲方对乙方服务
        serviceTwo: '', // 乙方对甲方服务
        court: '', // 法院地址
        copier: [], // 抄送人id
        copierName: [], // 抄送人名称
        enclosure: [], // 附件上传
        enclosurePic: [],
        contractPartycompanyName: '',
        tbcId: '',
        card: '',
        username: ''
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
    // this.init()
  },
  watch: {
    $route (to, from) {
      this.init()
    }
  },
  methods: {
    init () {
      this.getData()
      // this.getEchoData()
    },
    // 附件判断正确
    enclosureSure () {
      (this.isCorrect) ? this.isCorrect = false : this.isCorrect = true
      this.isError = true
      this.addIncome.agreeStatus = 0
      this.agree = true
    },
    // 附件判断错误
    enclosureError () {
      (this.isError) ? this.isError = false : this.isError = true
      this.isCorrect = true
      this.addIncome.agreeStatus = 1
      this.agree = false
    },
    // 获取回显接口详情
    getData () {
      // 获取当前用户,使用户名不能等于通知人,判断写在通知人方法内
      this.$axios({
        url: baseUrl + '/login/getuser',
        method: 'get'
      }).then(res => {
        if (res.data.code === 200) {
          this.addIncome.username = res.data.nickname
        }
      })
      // 如果是第二人录入 isTwo 为false
      if (this.$route.query.type === 'isTwoEntry') {
        this.isTwo = false
        this.$axios({
          url: baseUrl + '/contract/updateinfo',
          method: 'post',
          data: $qs.stringify({ id: this.$route.query.id })
        }).then(res => {
          if (res.data.code === 10000) {
            let _c = this.addIncome
            let _p = res.data.content
            _p.copier.map((item) => {
              _c.copier = item
            })
            _c.twoEntryId = _p.twoEntryId
            _c.planerName = _p.planerName// 合同拟定方
            _c.money = _p.money // 合同金额
            _c.ticketTypeName = _p.ticketTypeName // 开票类型
            _c.signerName = _p.signerName // 签订人
            _c.card = _p.card
            _c.wecompanyName = _p.wecompanyName
            _c.wecompanybankName = _p.wecompanybankName
            _c.startTime = _p.startTime
            _c.endTime = _p.endTime
            _c.ticketTextName = _p.ticketTextName
            _c.contractTypeName = _p.contractTypeName
            _c.contractPartycompanyName = _p.contractPartycompanyName
            _c.tbcId = _p.id
            _c.signer = _p.signer
            _c.detailedAddress = _p.detailedAddress
            _c.openbank = _p.openbank
            _c.openbankId = _p.openbankId
            _c.contacts = _p.contacts
            _c.tel = _p.tel
            _c.partyCompany = _p.partyCompany
            _c.remark = _p.remark
            this.addIncome.enclosure = res.data.content.enclosure
            this.addIncome.enclosurePic = res.data.content.enclosurePic
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.error(err)
        })
      } else {
        if (this.$route.query.type === undefined) {
          this.isTwo = true
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
              _p.copier.map((item) => {
                _c.copier = item
              })
              _c.remark = _p.remark
              _c.planerName = _p.planerName// 合同拟定方
              _c.money = _p.money // 合同金额
              _c.ticketTypeName = _p.ticketTypeName // 开票类型
              _c.signerName = _p.signerName // 签订人
              _c.card = _p.card
              _c.wecompanyName = _p.wecompanyName
              _c.wecompanybankName = _p.wecompanybankName
              _c.startTime = _p.startTime
              _c.endTime = _p.endTime
              _c.ticketTextName = _p.ticketTextName
              _c.contractTypeName = _p.contractTypeName
              _c.contractPartycompanyName = _p.contractPartycompanyName
              _c.partyCompany = _p.partyCompany
              _c.tbcId = _p.id
              _c.signer = _p.signer
              _c.detailedAddress = _p.detailedAddress
              _c.openbank = _p.openbank
              _c.twoEntryId = _p.twoEntryId
              _c.openbankId = _p.openbankId
              _c.enclosure = _p.enclosure
              _c.enclosurePic = _p.enclosurePic
              this.addIncome.enclosure1 = res.data.content.enclosure
              this.addIncome.enclosurePic1 = res.data.content.enclosurePic
              this.twoEntry = false
              this.twoEntry2 = true
              _c.tel = _p.tel // 联系电话
              _c.contacts = _p.contacts // 对方联系人
            } else {
              this.$Message.error(res.data.msg)
            }
          }).catch(err => {
            console.error(err)
          })
        }
        if (this.$route.query.type === 'isOneEntry1') {
          this.$axios({
            url: baseUrl + '/contract/updateinfo',
            method: 'post',
            data: $qs.stringify({ id: this.$route.query.id })
          }).then(res => {
            if (res.data.code === 10000) {
              let _c = this.addIncome
              let _p = res.data.content
              _p.copier.map((item) => {
                _c.copier = item
              })
              _c.remark = _p.remark
              _c.planerName = _p.planerName// 合同拟定方
              _c.money = _p.money // 合同金额
              _c.ticketTypeName = _p.ticketTypeName // 开票类型
              _c.signerName = _p.signerName // 签订人
              _c.card = _p.card
              _c.wecompanyName = _p.wecompanyName
              _c.wecompanybankName = _p.wecompanybankName
              _c.startTime = _p.startTime
              _c.endTime = _p.endTime
              _c.ticketTextName = _p.ticketTextName
              _c.contractTypeName = _p.contractTypeName
              _c.contractPartycompanyName = _p.contractPartycompanyName
              _c.partyCompany = _p.partyCompany
              _c.tbcId = _p.id
              _c.signer = _p.signer
              _c.detailedAddress = _p.detailedAddress
              _c.openbank = _p.openbank
              _c.twoEntryId = _p.twoEntryId
              _c.openbankId = _p.openbankId
              _c.twoEntryName = _p.twoEntryName
              _p.enclosurePic.map(item => {
                // if (item.isAdd == 0) {
                //   this.newenclosurePic.push(item)
                // } else {
                _c.enclosurePic.push(item)
                // }
              })
              console.log(this.newenclosurePic)
              // _p.enclosure.map(item=>{
              //   if(item.isAdd ==0){
              //     this.newenclosure.push(item)
              //   }else{
              //     _c.enclosure.push(item)
              //   }
              // })
              _c.enclosure = _p.enclosure
              this.addIncome.enclosure1 = res.data.content.enclosure
              this.addIncome.enclosurePic1 = res.data.content.enclosurePic
              this.twoEntry = true
              this.twoEntry2 = false
              _c.tel = _p.tel // 联系电话
              _c.contacts = _p.contacts // 对方联系人
              this.addTwoEntry = false
            } else {
              this.$Message.error(res.data.msg)
            }
          }).catch(err => {
            console.error(err)
          })
        }
      }
    },
    // 附件上传成功
    uploadFileSuccess (response, file, fileList) {
      if (response.rel === true) {
        // 文件上传展示
        this.newenclosure.push({
          enclosureName: response.filename,
          enclosureUrl: staticUrl + '' + response.url,
          isAdd: 0 // 是否为新增文件
        })
      } else {
        console.error(response.msg)
      }
    },
    // 图片上传
    uploadPhotoSuccess (response, file, fileList) {
      if (response.rel === true) {
        // 图片上传展示
        this.newenclosurePic.push({
          enclosureUrl: staticUrl + '' + response.url,
          enclosureName: response.filename,
          isAdd: 0 // 是否为新增图片
        })
      }
    },
    // 附件上传失败
    uploadError (file) {
      this.$Message.error('上传格式错误,请上传jpg,jpeg,png后缀的图片')
    },

    /** 传入类别和要删除的类型和在数组中的位置 */
    deleteImg (index) {
      this.newenclosurePic.splice(index, 1)
    },
    // 删除抄送人
    deletCopier (index) {
      this.addIncome.copier.splice(index, 1)
      this.addIncome.copieruserName.splice(index, 1)
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
      // ids.map(item => {
      //   this.addIncome.copieruserName.push(item.label)
      //   this.addIncome.copieruserName = Array.from(new Set(this.addIncome.copieruserName))
      // })
    },
    addCpoier () {
      this.addIncome.copieruserName = this.addIncome.showCopierName
      this.addIncome.copier = this.addIncome.showCopierId
    },
    // 根据通知人id 获得对应的通知人name
    getEntryName (ids) {
      this.addIncome.showTwoEntryName = ids.label
      this.addIncome.showTwoEntryId = ids.value
    },
    ok () {
      if (this.addIncome.showTwoEntryName === undefined) {
        this.addIncome.twoEntryName = ''
      } else {
        this.addTwoEntry = false
        this.addIncome.twoEntryName = this.addIncome.showTwoEntryName
        this.addIncome.twoEntryId = this.addIncome.showTwoEntryId
      }
    },
    // 返回
    goBack () {
      bus.$emit('on-myclose', this.$route)
    },
    // 保存补充协议
    saveSupplement () {
      if (this.$route.query.type === 'isOneEntry1') {
        let _c = this.addIncome
        let sendData = {
          id: _c.tbcId,
          contractTypeName: _c.contractTypeName, // 收付款
          wecompanyName: _c.wecompanyName, // 我方公司名称
          contractPartycompanyName: _c.contractPartycompanyName, // 公司/个人
          signer: _c.signer,
          signerName: _c.signerName, // 签订人
          enclosure: _c.enclosure, // 附件
          enclosurePic: _c.enclosurePic, // 附件图片
          copier: _c.copier, // 抄送人
          twoEntryId: _c.twoEntryId, // 通知人
          twoEntryName: _c.twoEntryName,
          tel: _c.tel,
          contacts: _c.contacts,
          ticketTypeName: _c.ticketTypeName,
          ticketTextName: _c.ticketTextName,
          detailedAddress: _c.detailedAddress,
          wecompanybankName: _c.wecompanybankName,
          startTime: _c.startTime,
          endTime: _c.endTime,
          money: _c.money,
          remark: _c.remark,
          contractName: _c.contractName,
          planerName: _c.planerName,
          timeRage: _c.timeRage,
          card: _c.card,
          openbank: _c.openbank,
          openbankId: _c.openbankId,
          partyCompany: _c.partyCompany,
          router: 'contractBank',
          tbcId: this.$route.query.id
        }
        for (let i in this.newenclosure) {
          sendData.enclosure.push(this.newenclosure[i])
        }
        for (let i in this.newenclosurePic) {
          sendData.enclosurePic.push(this.newenclosurePic[i])
        }
        this.$axios({
          url: baseUrl + '/Auditing/insertUrl',
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
      }
      // 第二人编辑
      if (this.$route.query.type === 'isTwoEntry') {
        if (this.agree !== '') {
          let _c = this.addIncome
          let sendData = {
            id: _c.tbcId,
            contractTypeName: this.addIncome.contractTypeName, // 收付款
            wecompanyName: this.addIncome.wecompanyName, // 我方公司名称
            contractPartycompanyName: this.addIncome.contractPartycompanyName, // 公司/个人
            signer: this.addIncome.signer,
            signerName: this.addIncome.signerName, // 签订人
            enclosure: _c.enclosure, // 附件
            enclosurePic: _c.enclosurePic, // 附件图片
            copier: this.addIncome.copier, // 抄送人
            twoEntryId: this.addIncome.twoEntryId, // 通知人
            tel: this.addIncome.tel,
            contacts: _c.contacts,
            ticketTypeName: _c.ticketTypeName,
            ticketTextName: _c.ticketTextName,
            detailedAddress: _c.detailedAddress,
            wecompanybankName: _c.wecompanybankName,
            startTime: _c.startTime,
            endTime: _c.endTime,
            money: _c.money,
            remark: _c.remark,
            contractName: _c.contractName,
            planerName: _c.planerName,
            timeRage: _c.timeRage,
            card: _c.card,
            openbank: _c.openbank,
            openbankId: _c.openbankId,
            partyCompany: _c.partyCompany,
            router: 'contractBank',
            tbcId: this.$route.query.id,
            agree: this.agree
          }
          this.$axios({
            url: baseUrl + '/Auditing/insertUrl',
            method: 'post',
            data: sendData
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.info(res.data.msg)
              bus.$emit('on-myclose', this.$route)
              this.$router.push({
                name: 'contractBank'
              })
            } else if (res.data.code === 10021) {
              this.compareContent = true
              this.compareData = res.data.content
            } else {
              this.$Message.error(res.data.msg)
            }
          }).catch(err => {
            console.error(err)
          })
        } else {
          this.$Message.error('请判断附件')
        }
      } else if (this.$route.query.type === undefined) { // 第一人编辑
        if (this.addIncome.twoEntryName !== '') {
          let _c = this.addIncome
          let sendData = {
            id: this.$route.query.id,
            contractTypeName: this.addIncome.contractTypeName, // 收付款
            wecompanyName: this.addIncome.wecompanyName, // 我方公司名称
            contractPartycompanyName: this.addIncome.contractPartycompanyName, // 公司/个人
            signer: this.addIncome.signer,
            signerName: this.addIncome.signerName, // 签订人
            enclosure: _c.enclosure1, // 附件
            enclosurePic: _c.enclosurePic1, // 附件图片
            copier: this.addIncome.copier, // 抄送人
            twoEntryId: this.addIncome.twoEntryId, // 通知人
            tel: this.addIncome.tel,
            contacts: _c.contacts,
            twoEntryName: _c.twoEntryName,
            ticketTypeName: _c.ticketTypeName,
            ticketTextName: _c.ticketTextName,
            detailedAddress: _c.detailedAddress,
            wecompanybankName: _c.wecompanybankName,
            startTime: _c.startTime,
            endTime: _c.endTime,
            money: _c.money,
            remark: _c.remark,
            contractName: _c.contractName,
            planerName: _c.planerName,
            timeRage: _c.timeRage,
            card: _c.card,
            openbank: _c.openbank,
            openbankId: _c.openbankId,
            partyCompany: _c.partyCompany,
            router: 'contractBank',
            tbcId: -1
          }
          for (let i in this.newenclosure) {
            sendData.enclosure.push(this.newenclosure[i])
          }
          for (let i in this.newenclosurePic) {
            sendData.enclosurePic.push(this.newenclosurePic[i])
          }
          if (this.newenclosure.length > 0 || this.newenclosurePic.length > 0) {
            this.$axios({
              url: baseUrl + '/Auditing/insertUrl',
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
          this.$Message.error('请选择通知人')
        }
      }
    }

  }
}
</script>

<style lang="less">
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

.top {
    margin-top: 4px;
}

.require {
    font-size: 17px;
    color: red;
    position: relative;
    top: 5px;
    right: 3px;
}
.refuse{
    width: 600px;
    height: auto;
}
</style>
