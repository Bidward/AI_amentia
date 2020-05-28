<template>
<!--合同详情 我方拟定-->
<div class="cloudCooper">
    <div class="detailContent">
        <!--合同拟定方 合同类型-->
        <Row class="rowPadding">
            <Col span="3" offset="3" class="title">合同拟定方：</Col>
            <Col span="5">
            <p class="top">{{addIncome.planerName||'暂无'}}</p>
            </Col>
            <Col span="3" class="title">合同类型：</Col>
            <Col span="5">
            <p class="top">{{addIncome.contractTypeName||'暂无'}}</p>
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
            <p class="top">{{addIncome.startTime+'-'+addIncome.endTime||'暂无'}}</p>
            </Col>
        </Row>
        <!--合同金额-->
        <Row class="rowPadding">
            <Col span="3" offset="3" class="title">合同金额：</Col>
            <Col span="5">
            <p class="top">{{addIncome.money||'暂无'}}</p>
            </Col>
        </Row>
        <!-- 开票类型 -->
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
        <div v-if="addIncome.contractPartycompany===1">
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
    <div class="detailContent">
        <Row class="rowPadding">
            <Col span="12" offset="3" class="cardTitle">附件</Col>
        </Row>
        <Row class="rowPadding">
            <Col span="3" offset="2" class="title">
             文件上传：
            </Col>
            <Col span="5">
            <p class="top" v-for="(item,index) in addIncome.enclosure" :key="index">
                <a :href="item.enclosureUrl">{{item.enclosureName||'暂无'}}</a>
            </p>
            </Col>
            <Col span="3" class="title">
            图片：
            </Col>
            <Col span="5">
                <viewer class="top" v-for="(key,index) in addIncome.enclosurePic" :key="index">
                    <img :src="key.enclosureUrl" style=" width: 100px;height: 100px;float: left;margin-right: 10px;">
                </viewer>
            </Col>
        </Row>
    </div>
    <!--抄送人-->
    <!-- <div class="detailContent">
        <Row class="rowPadding">
            <Col span="12" offset="3" class="cardTitle">抄送人</Col>
        </Row>
        <Row class="rowPadding">
            <Col span="5" offset="4">
            <Icon type="ios-contacts" size="50" style="display: block;"></Icon>
            <p class="top person">{{addIncome.copierName}}</p>
            </Col>
        </Row>
    </div> -->
    <!-- 拒绝原因 -->
    <div class="detailContent">
        <Row class="rowPadding">
            <Col span="12" offset="3" class="cardTitle">拒绝原因</Col>
        </Row>
        <!--拒绝原因-->
        <Row class="rowPadding">
            <Col span="5" offset="4">
                <div class="refuse">{{addIncome.rejectReason}}</div>
            </Col>
        </Row>
    </div>
    <!--操作按钮-->
    <div class="detailContent">
        <Row class="rowPadding">
            <Col span="12" offset="10">
            <Button type="warning" @click="goBack">返回</Button>
            </Col>
        </Row>
    </div>
    <!-- 拒绝提示弹框 -->
    <Modal v-model="refuseAlert" title="提醒">
        <p>拒绝原因未填写，请填写拒绝原因</p>
    </Modal>
</div>
</template>

<script>
import {
  phpURL,
  baseUrl
} from '@/api/base.js'
export default {
  name: 'addIncome',
  data () {
    return {
      isPerson: false, // 产品公司类型为个人
      showNotice: false, // 抄送人弹窗
      addIncome: {
        planer: '1', // 合同拟定方
        planerList: [{
          id: '1',
          name: '我方合同'
        },
        {
          id: '2',
          name: '对方合同'
        }
        ],
        contractType: '1', // 合同类型
        contractTypeList: [{
          id: '1',
          name: '收款合同'
        },
        {
          id: '2',
          name: '付款合同'
        }
        ],
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
        ticketType: '', // 开票类型
        ticketTypeList: [], // 开票类型list
        ticketText: '', // 开票内容
        ticketTextList: [], // 开票内容list
        sendAddress: '', // 发票寄送地址
        detailedAddress: '', // 详细地址
        signer: '', // 签订人
        incumbencyTbUser: [], // 签订人列表
        wecompany: '', // 乙方我方公司id
        wecompanyList: [], // 乙方我方公司List
        wecompanybank: '', // 公司账户id
        wecompanybankList: [], // 公司账户list
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
        rejectReason: '', // 拒绝原因
        enclosure: [], // 附件
        enclosurePic: []
      },
      refuseAlert: false // 填写拒绝原因提示
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      let sendData = {
        id: this.$route.query.id
      }
      this.$axios({
        url: baseUrl + '/contract/info',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.addIncome = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
      // 开票类型
      this.$axios({
        url: phpURL + '/cloud/ticketTypeList',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.addIncome.ticketTypeList = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
      // 开票内容
      this.$axios({
        url: phpURL + '/cloud/ticketContentList',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.addIncome.ticketTextList = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
      // 在职人员
      this.$axios({
        url: baseUrl + '/user/getIncumbencyTbUser',
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.addIncome.incumbencyTbUser = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
      // 收款合同里的乙方 公司是我方公司
      this.$axios({
        url: phpURL + '/cloud/getAllOursCompanies',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.addIncome.wecompanyList = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 产品公司选择
    choseCompanyType () {
      if (this.addIncome.companyType === '1') {
        this.isPerson = false
      } else if (this.addIncome.companyType === '2') {
        this.isPerson = true
        // 公司到个人时 清空部分数据
        let _i = this.addIncome
        _i.partyCompany = ''
        _i.contractNum = ''
        _i.openingAddress = ''
        _i.openbank = ''
        _i.tel = ''
      }
    },
    // 获取纳税人识别号
    getContractNum () {
      let sendData = {
        productCompanyId: this.addIncome.partyCompany
      }
      this.$axios({
        url: phpURL + '/cloud/getTicketInfoByProductCompanyId',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
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
              _i.ticketType = '' // 开票类型
              _i.ticketText = '' // 开票内容
              _i.openbankId = ''
              _i.openbank = ''
            }
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 根据我方公司获取公司账号
    getWecompanybank () {
      let sendData = {
        ourCompanyId: this.addIncome.wecompany
      }
      this.$axios({
        url: phpURL + '/cloud/getAccountByOurCompanyId',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            let _i = this.addIncome
            let _r = res.data.content
            _i.wecompanybankList = _r
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 根据通知人id 获得对应的通知人name
    getNoticeName (ids) {
      ids.map(item => {
        this.addIncome.copierName.push(item.label)
        this.addIncome.copierName = Array.from(
          new Set(this.addIncome.copierName)
        )
      })
    },
    // 返回
    goBack () {
      bus.$emit('on-myclose', this.$route)
      this.$router.push({
        name: 'toAuditInform'
      })
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
.person{
    width: auto;
    position: relative;
    left: 11px;
}
</style>
