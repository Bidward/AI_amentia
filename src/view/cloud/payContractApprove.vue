<template>
  <!--合同审批-->
  <div class="cloudCooper">
    <div class="detailContent">
      <!--合同拟定方 合同类型-->
      <Row class="rowPadding">
        <Col span="3" offset="3" class="title">合同拟定方：</Col>
        <Col span="5">
          <p class="top">{{addIncome.planerName}}</p>
        </Col>
        <Col span="3" class="title">合同类型：</Col>
        <Col span="5">
          <p class="top">{{addIncome.contractTypeName}}</p>
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
          <p class="top">{{addIncome.remark}}</p>
        </Col>
      </Row>
    </div>
    <!--附件-->
    <div class="detailContent">
      <Row class="rowPadding">
        <Col span="12" offset="3" class="cardTitle">合同附件</Col>
      </Row>
      <Row class="rowPadding">
        <Col span="3" offset="2" class="title">
        <i class="require">*</i>文件上传：
        </Col>
        <Col span="5">
          <p class="top" v-for="(item,index) in addIncome.enclosure" :key="index">
            <a :href="item.enclosureUrl">{{item.enclosureName||'暂无'}}</a>
          </p>
        </Col>
        <Col span="3" class="title">
       <i class="require">*</i> 图片：
        </Col>
        <Col span="5">
            <viewer class="top" v-for="(key,index) in addIncome.enclosurePic" :key="index">
                <img :src="key.enclosureUrl" style=" width: 100px;height: 100px; float: left;margin-right: 10px;">
            </viewer>
        </Col>
      </Row>
    </div>
    <!--抄送人-->
    <div class="detailContent">
      <Row class="rowPadding">
        <Col span="12" offset="3" class="cardTitle">抄送人</Col>
      </Row>
      <!--抄送人-->
      <Row class="rowPadding">
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
            <p style="margin-left:15%">{{item+' '||'抄送人'}}</p>
          </div>
          <Icon
            type="ios-add-circle-outline"
            size="50"
            @click="showNotice=true"
            style="margin-top: 22px; color: #CCC;"
          />
        </Col>
      </Row>
      <!-- <Row class="rowPadding">
        <Col span="5" offset="4">
          <Icon type="ios-contacts" size="50" style="display: block;"></Icon>
          <p class="top person">{{addIncome.copierName}}</p>
        </Col>
      </Row>-->
    </div>
    <!--抄送人弹窗-->
    <Modal id="addNotice" :mask-closable="false" v-model="showNotice" title="抄送人">
      <Select
        v-model="addIncome.copier"
        filterable
        multiple
        :label-in-value="true"
        @on-change="getNoticeName"
      >
        <Option
          v-for="person in incumbencyTbUser"
          :key="person.id"
          :value="person.id"
          :label="person.nickname"
        >
          <div>
            <p>{{person.nickname}}</p>
            <p>部门：{{person.deptName}}</p>
            <p>职位：{{person.positionName}}</p>
          </div>
        </Option>
      </Select>
    </Modal>
    <!-- 拒绝原因 -->
    <div class="detailContent">
      <Row class="rowPadding">
        <Col span="12" offset="3" class="cardTitle">拒绝原因</Col>
      </Row>
      <!--拒绝原因-->
      <Row class="rowPadding">
        <Col span="5" offset="4">
          <Input
            v-model="addIncome.refuseReason"
            type="textarea"
            placeholder="若拒绝请填写拒绝原因"
            style="width:600px"
          />
        </Col>
      </Row>
    </div>
    <!--操作按钮-->
    <div class="detailContent">
      <Row class="rowPadding">
        <Col span="12" offset="10">
          <Button type="warning" @click="refuse" style="margin-right:30px">拒绝</Button>
          <Button type="primary" @click="agree">同意</Button>
        </Col>
      </Row>
    </div>
    <!-- 拒绝提示弹框 -->
    <Modal v-model="refuseAlert" title="提醒" ok-text="关闭" cancel-text=" ">
      <p>拒绝原因未填写，请填写拒绝原因</p>
    </Modal>
  </div>
</template>

<script>
import { phpURL, baseUrl, staticUrl } from '@/api/base.js'
export default {
  name: 'addIncome',
  data () {
    return {
      showWord: [], // 上传的补充协议
      isPerson: false, // 产品公司类型为个人
      showNotice: false, // 抄送人弹窗
      addIncome: {
        planer: '1', // 合同拟定方
        planerList: [
          {
            id: '1',
            name: '我方合同'
          },
          {
            id: '2',
            name: '对方合同'
          }
        ],
        contractType: '1', // 合同类型
        contractTypeList: [
          {
            id: '1',
            name: '收款合同'
          },
          {
            id: '2',
            name: '付款合同'
          }
        ],
        companyType: '', // 公司或个人  1为公司2为个人
        companyTypeList: [
          {
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
        contractName: '', // 合同名称
        service: '', // 甲方对乙方服务
        serviceTwo: '', // 乙方对甲方服务
        court: '', // 法院地址
        copier: [], // 抄送人id
        copierName: '', // 抄送人名称
        copieruserName: [],
        refuseReason: '', // 拒绝原因
        enclosure: [], // 附件
        enclosurePic: []
      },
      refuseAlert: false // 填写拒绝原因提示
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
    // 获取数据
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
            // 公司信息和主要业务
            this.addIncome = res.data.content
            // console.log(this.addIncome)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
      // 在职人员
      // this.$axios({
      //   url: baseUrl + '/user/getIncumbencyTbUser',
      //   method: 'post'
      // })
      //   .then(res => {
      //     if (res.data.code === 10000) {
      //       this.addIncome.incumbencyTbUser = res.data.content
      //     } else {
      //       this.$Message.error(res.data.msg)
      //     }
      //   })
      //   .catch(err => {
      //     console.error(err)
      //   })
      // 公司/个人
      this.$axios({
        url: phpURL + '/cloud/companyTypeList',
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.addIncome.channelTypeList = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 附件上传
    // 图片上传成功回调函数
    uploadSuccess (type, response, file, fileList) {
      // response是图片上传接口返回的消息,rel===true时，msg为图片相对路径
      if (response.rel === true) {
        // type可能有personIdUrl、certificateUrl
        this.enclosure[type].push({
          name: type,
          status: 0,
          url: response.msg
        })
        this.addIncome.enclosure = response.msg
        console.log(this.addIncome.enclosure)
        console.log(staticUrl + '' + this.addIncome.enclosure)
      } else {
        console.error(response.msg)
      }
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
        id: this.addIncome.id
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
      this.addIncome.copieruserName = []
      ids.map(item => {
        this.addIncome.copieruserName.push(item.label)
      })
      this.addIncome.copieruserName = Array.from(
        new Set(this.addIncome.copieruserName)
      )
    },
    // 按钮操作返回
    goBack () {
      bus.$emit('on-myclose', this.$route)
    },
    // 预览
    preview () {
      this.$router.push({
        name: 'contractView',
        query: {
          // productCompanyId: row.productCompanyId
        }
      })
    },
    // 附件上传成功
    uploadFileSuccess (response, file, fileList) {
      if (response.rel === true) {
        // 文件上传展示
        this.showWord.push(staticUrl + '' + response.msg)
        this.addIncome.enclosure = this.showWord.join(',')
      } else {
        console.error(response.msg)
      }
    },
    // 拒绝按钮
    refuse () {
      if (this.addIncome.refuseReason === undefined) {
        this.refuseAlert = true
      } else {
        let sendData = {
          rejectReason: this.addIncome.refuseReason,
          id: this.$route.query.id,
          copier: this.addIncome.copier
        }
        this.$axios({
          url: baseUrl + '/Auditing/reject',
          data: $qs.stringify(sendData, {
            indices: false
          }),
          method: 'post'
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.$router.push({
                name: 'toAuditInform'
              })
            }
          })
          .catch(err => {
            console.log(err.data)
          })
      }
    },
    // 同意
    agree () {
      let sendData = {
        id: this.$route.query.id,
        router: 'contractBank',
        copier: this.addIncome.copier
      }
      this.$axios({
        url: baseUrl + '/Auditing/agree ',
        data: $qs.stringify(sendData, {
          indices: false
        }),
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$router.push({
              name: 'toAuditInform'
            })
          }
        })
        .catch(err => {
          console.log(err.data)
        })
      this.$Message.info('审核成功')
    },
    // // 根据通知人id 获得对应的通知人name
    // getNoticeName(ids) {
    //   ids.map(item => {
    //     this.addIncome.copieruserName.push(item.label);
    //     this.addIncome.copieruserName = Array.from(
    //       new Set(this.addIncome.copieruserName)
    //     );
    //   });
    // },
    // 删除抄送人
    deletCopier (index) {
      this.addIncome.copier.splice(index, 1)
      this.addIncome.copieruserName.splice(index, 1)
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

.person {
  width: auto;
  position: relative;
  left: 11px;
}
</style>
