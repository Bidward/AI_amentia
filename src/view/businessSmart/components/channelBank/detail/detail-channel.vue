<template>
    <div class="viewWrapper" style="padding:20px">
        <!-- 渠道信息 -->
        <Row>
            <Col span="12" offset="5" class="headerWithGreenbar">渠道信息</Col>
        </Row>
        <Row class="rowPadding">
            <Col span="2" offset="2" class="title">
                <span>渠道名称：</span>
            </Col>
            <Col span="5">
                <span class="top">{{channel.channelName || '暂无'}}</span>
            </Col>
            <Col span="4" offset="2" class="title">
                <span>来源：</span>
            </Col>
            <Col span="5">
                <span class="top">{{channel.channelSource || '暂无'}}</span>
            </Col>
        </Row>
        <Row class="rowPadding">
            <Col span="2" offset="2" class="title">
                <span>网址：</span>
            </Col>
            <Col span="5">
                <span class="top">{{channel.website || '暂无'}}</span>
            </Col>
            <Col span="4" offset="2" class="title">
                <span>公司/个人：</span>
            </Col>
            <Col span="5">
                <span class="top">{{channel.companyType || '暂无'}}</span>
            </Col>
        </Row>
        <!-- 公司 -->
        <Row class="rowPadding" v-if="channel.companyType==='公司'">
            <Col span="2" offset="2" class="title">
                <span>公司名称：</span>
            </Col>
            <Col span="5">
                <span class="top">{{channel.companyName || '暂无'}}</span>
            </Col>
        </Row>
        <!-- 个人 -->
        <Row class="rowPadding" v-if="channel.companyType==='个人'">
            <Col span="2" offset="2" class="title">
                <span>姓名：</span>
            </Col>
            <Col span="5">
                <span class="top">{{channel.personName || '暂无'}}</span>
            </Col>
            <Col span="4" offset="2" class="title">
                <span>身份证：</span>
            </Col>
            <Col span="5">
                <span class="top">{{channel.personCardId || '暂无'}}</span>
            </Col>
        </Row>
        <Row class="rowPadding">
            <Col span="2" offset="2" class="title">
                <span>联系地址：</span>
            </Col>
            <Col span="5">
                <span class="top">{{channel.contactAddress || '暂无'}}</span>
            </Col>
            <Col span="4" offset="2" class="title">
                <span>渠道类型：</span>
            </Col>
            <Col span="5">
                <span class="top">{{channel.channelType || '暂无'}}</span>
            </Col>
        </Row>
        <!-- 站点 -->
        <div v-if="channel.channelType==='站点'">
            <Row class="rowPadding">
                <Col span="2" offset="2" class="title">
                    <span>归属：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{channel.belongTo || '暂无'}}</span>
                </Col>
                <Col span="4" offset="2" class="title">
                    <span>量级：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{channel.numberLevel || '暂无'}}</span>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="2" offset="2" class="title">
                    <span>域名：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{channel.domainName || '暂无'}}</span>
                </Col>
                <Col span="4" offset="2" class="title">
                    <span>云控：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{channel.isCloud || '暂无'}}</span>
                </Col>
            </Row>
        </div>
        <Row class="rowPadding">
            <Col span="2" offset="2" class="title">
                <span>市场：</span>
            </Col>
            <Col span="5">
                <span class="top">{{channel.marketResponsibleName || '暂无'}}</span>
            </Col>
            <Col span="4" offset="2" class="title">
                <span>未合作原因：</span>
            </Col>
            <Col span="5">
                <span class="top">{{channel.failCooperationCause || '暂无'}}</span>
            </Col>
        </Row>
        <Row class="rowPadding">
            <Col span="2" offset="2" class="title">
                <span>流失反馈：</span>
            </Col>
            <Col span="5">
                <span class="top">{{channel.runOffCallback || '暂无'}}</span>
            </Col>
        </Row>
        <!-- 联系人列表 -->
        <Row>
            <Col span="12" offset="5" class="headerWithGreenbar">联系人列表</Col>
        </Row>
        <Row>
            <Col span="16" offset="3">
                <Table border :columns="contractHeader" :data="contractData"></Table>
            </Col>
        </Row>
        <!-- 标签 -->
        <Row>
            <Col span="12" offset="5" class="headerWithGreenbar">标签</Col>
        </Row>
        <Row class="rowPadding">
            <Col span="2" offset="2" class="title">
                <span>端口类型：</span>
            </Col>
            <Col span="5">
                <span class="top">
                    <template v-if="tag.portType && tag.portType.length">
                        <span v-for="(item,index) in tag.portType" :key="index">{{item}},</span>
                    </template>
                    <template v-else>
                        <span>暂无</span>
                    </template>
                </span>
                <!-- <span class="top"><span v-for="(item,index) in tag.portType" :key="index">{{item || '暂无'}},</span></span> -->
            </Col>
            <Col span="2" offset="2" class="title">
                <span>软件功能：</span>
            </Col>
            <Col span="5">
                <span class="top">
                    <template v-if="tag.softwareFunction && tag.softwareFunction.length">
                        <span v-for="(item,index) in tag.softwareFunction" :key="index">{{item}},</span>
                    </template>
                    <template v-else>
                        暂无
                    </template>
                    <!-- <span v-for="(item,index) in tag.softwareFunction" :key="index">{{item || '暂无'}},</span> -->
                </span>
            </Col>
        </Row>
        <Row class="rowPadding">
            <Col span="2" offset="2" class="title">
                <span>业务类型：</span>
            </Col>
            <Col span="5">
                <span class="top">
                    <template v-if="tag.businessType && tag.businessType.length">
                        <span v-for="(item,index) in tag.businessType" :key="index">{{item}},</span>
                    </template>
                    <template v-else>
                        暂无
                    </template>
                </span>
            </Col>
            <Col span="2" offset="2" class="title">
                <span>侧重标签：</span>
            </Col>
            <Col span="5">
                <span class="top">
                    <template v-if="tag.focusTag && tag.focusTag.length">
                        <span v-for="(item,index) in tag.focusTag" :key="index">{{item}},</span>
                    </template>
                    <template v-else>
                        暂无
                    </template>
                </span>
            </Col>
        </Row>
         <Row class="rowPadding">
            <Col span="2" offset="2" class="title">
                <span>反向标签：</span>
            </Col>
            <Col span="5">
                <span class="top">
                    <template v-if="tag.reverseTag && tag.reverseTag.length">

                            <span v-for="(item,index) in tag.reverseTag" :key="index">
                                {{item}},
                            </span>
                    </template>
                    <template v-else>
                        暂无
                    </template>
                </span>
            </Col>
        </Row>
        <!-- 开票信息 -->
        <Row>
            <Col span="12" offset="5" class="headerWithGreenbar">
                <span>开票信息</span>
            </Col>
        </Row>
        <Row>
            <Col span="16" offset="3">
                <Table border :columns="invoicetHeader" :data="invoiceData"></Table>
            </Col>
        </Row>
        <!-- 合同信息 -->
        <Row>
            <Col span="12" offset="5" class="headerWithGreenbar">
                <span>合同信息</span>
            </Col>
        </Row>
        <Row class="rowPadding">
            <Col span="2" offset="2" class="title">
                <span>合同拟定方：</span>
            </Col>
            <Col span="5">
                <span class="top">{{contract.contractFrom || '暂无'}}</span>
            </Col>
            <Col span="4" offset="2" class="title">
                <span>合同类型：</span>
            </Col>
            <Col span="5">
                <span class="top">{{contract.contractType || '暂无'}}</span>
            </Col>
        </Row>
        <!-- 付款合同 -->
        <div v-if="contract.contractType==='付款合同'">
            <Row>
                <Col span="12" offset="1">
                    <span>甲方:</span>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="2" offset="2" class="title">
                    <span>签订人：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.firstSigner || '暂无'}}</span>
                </Col>
                <Col span="4" offset="2" class="title">
                    <span>我方公司：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.firstCompanyName || '暂无'}}</span>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="2" offset="2" class="title">
                    <span>公司账号：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.firstCompanyAccount || '暂无'}}</span>
                </Col>
                <Col span="4" offset="2" class="title">
                    <span>合同期限：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.contractTime && contract.contractTime[0] || '暂无'}}{{contract.contractTime ? '~' : ''}}{{contract.contractTime && contract.contractTime[1]}}</span>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="2" offset="2" class="title">
                    <span>合同金额：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.contractMoney || '暂无'}}</span>
                </Col>
                <Col span="4" offset="2" class="title">
                    <span>是否开票：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.isReceipt || '暂无'}}</span>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="2" offset="2" class="title">
                    <span>开票类型：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.receiptType || '暂无'}}</span>
                </Col>
                <Col span="4" offset="2" class="title">
                    <span>开票内容：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.receiptContent || '暂无'}}</span>
                </Col>
            </Row>
            <Row>
                <Col span="12" offset="1">
                    <span>乙方:</span>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="2" offset="2" class="title">
                    <span>公司/个人：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.secondCompanyType || '暂无'}}</span>
                </Col>
                <span v-if="contract.secondCompanyType==='公司'">
                    <Col span="4" offset="2" class="title">
                        <span>公司名称：</span>
                    </Col>
                    <Col span="5">
                        <span class="top">{{contract.secondCompanyName || '暂无'}}</span>
                    </Col>
                </span>
                <span v-if="contract.secondCompanyType==='个人'">
                    <Col span="4" offset="2" class="title">
                        <span>姓名：</span>
                    </Col>
                    <Col span="5">
                        <span class="top">{{contract.personName || '暂无'}}</span>
                    </Col>
                </span>
            </Row>
            <Row class="rowPadding" v-if="contract.secondCompanyType==='个人'">
                <Col span="2" offset="2" class="title">
                    <span>身份证：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.personCardId || '暂无'}}</span>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="2" offset="2" class="title">
                    <span>开户行账号：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.secondBankAccount || '暂无'}}</span>
                </Col>
                <Col span="4" offset="2" class="title">
                    <span>开户行：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.secondBank || '暂无'}}</span>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="2" offset="2" class="title">
                    <span>对方联系人：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.secondContactPerson || '暂无'}}</span>
                </Col>
                <Col span="4" offset="2" class="title">
                    <span>联系电话：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.secondContactPersonPhone || '暂无'}}</span>
                </Col>
            </Row>
        </div>
        <!-- 收款合同 -->
        <div v-if="contract.contractType==='收款合同'">
            <Row>
                <Col span="12" offset="1">
                    <span>甲方:</span>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="2" offset="2" class="title">
                    <span>公司/个人：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.secondCompanyType || '暂无'}}</span>
                </Col>
                <span v-if="contract.secondCompanyType==='公司'">
                    <Col span="4" offset="2" class="title">
                        <span>公司名称：</span>
                    </Col>
                    <Col span="5">
                        <span class="top">{{contract.secondCompanyName || '暂无'}}</span>
                    </Col>
                </span>
                <span v-if="contract.secondCompanyType==='个人'">
                    <Col span="4" offset="2" class="title">
                        <span>姓名：</span>
                    </Col>
                    <Col span="5">
                        <span class="top">{{contract.personName || '暂无'}}</span>
                    </Col>
                </span>
            </Row>
            <Row class="rowPadding" v-if="contract.secondCompanyType==='个人'">
                <Col span="2" offset="2" class="title">
                    <span>身份证：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.personCardId || '暂无'}}</span>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="2" offset="2" class="title">
                    <span>对方联系人：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.secondContactPerson || '暂无'}}</span>
                </Col>
                <Col span="4" offset="2" class="title">
                    <span>开票地址：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.openTicketAddress || '暂无'}}</span>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="2" offset="2" class="title">
                    <span>开票类型：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.receiptType || '暂无'}}</span>
                </Col>
                <Col span="4" offset="2" class="title">
                    <span>联系电话：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.secondContactPersonPhone || '暂无'}}</span>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="2" offset="2" class="title">
                    <span>发票寄送地址：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.receiptMailAddress || '暂无'}}</span>
                </Col>
                <Col span="6" class="title">
                    <span>开票内容：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.receiptContent || '暂无'}}</span>
                </Col>
            </Row>
            <Row>
                <Col span="12" offset="1">
                    <span>乙方:</span>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="2" offset="2" class="title">
                    <span>签订人：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.firstSigner || '暂无'}}</span>
                </Col>
                <Col span="4" offset="2" class="title">
                    <span>我方公司：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.firstCompanyName || '暂无'}}</span>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="2" offset="2" class="title">
                    <span>公司账号：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.firstCompanyAccount || '暂无'}}</span>
                </Col>
                <Col span="4" offset="2" class="title">
                    <span>合同期限：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.contractTime || '暂无'}}</span>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="2" offset="2" class="title">
                    <span>合同金额：</span>
                </Col>
                <Col span="5">
                    <span class="top">{{contract.contractMoney || '暂无'}}</span>
                </Col>
            </Row>
        </div>
        <!-- 附件上传 -->
        <Row>
            <Col span="12" offset="5" class="headerWithGreenbar">附件上传</Col>
        </Row>
        <Row>
            <Col span="2" offset="2" class="title">
                <span>合同附件：</span>
            </Col>
            <Col span="5">
                <ul class="top">
                    <li class="top" v-for="(item,index) in attachment" :key="index">
                        <a :href="item.attachmentUrl" :download="item.attachmentName">{{item.attachmentName||'暂无'}}</a>
                    </li>
                </ul>
            </Col>
            <Col span="6" class="title">
                <span>质量认证：</span>
            </Col>
            <Col span="5">
                <ul class="top">
                    <li class="top" v-for="(item,index) in quality" :key="index">
                        <a :href="item.attachmentUrl" :download="item.attachmentName">{{item.attachmentName||'暂无'}}</a>
                    </li>
                </ul>
            </Col>
        </Row>
        <!-- 备注  -->
        <Row>
            <Col span="12" offset="5" class="headerWithGreenbar">备注</Col>
        </Row>
        <Row class="rowPadding">
            <Col span="15" offset="4">
                <span class="top">{{channel.channelRemarks || '暂无'}}</span>
            </Col>
        </Row>
        <!-- 日志区 -->
        <!-- <Row>
            <Col span="24">
                <OpLogs :task-logs="channelLog" class="taskLogs" @click.native="getLog" />
            </Col>
        </Row> -->
        <!-- 按钮  -->
        <Row class="position">
            <Col span="2" class="btn">
                <Card>
                    <div style="text-align:center">
                        <Button  @click="goBack">返回</Button>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
import OpLogs from '../../op-log' // 日志
import { biUrl } from '@/api/base.js'
export default {
  name: 'addChannel',
  inject: ['app'],
  components: {
    OpLogs // 日志
  },
  data () {
    return {
      // 联系人列表
      contractHeader: [
        {
          title: '联系人',
          key: 'contactName',
          align: 'center'
        },
        {
          title: '联系电话',
          key: 'contactPhone',
          align: 'center'
        },
        {
          title: 'QQ',
          key: 'contactQq',
          align: 'center'
        },
        {
          title: '微信',
          key: 'contactWechat',
          align: 'center'
        },
        {
          title: '邮箱',
          key: 'contactEmail',
          align: 'center'
        },
        {
          title: '公司职位',
          key: 'contactPosition',
          align: 'center'
        }
      ],
      contractData: [], // 联系人
      // 开票信息表头
      invoicetHeader: [
        {
          title: '开户名',
          key: 'receiptName',
          align: 'center'
        },
        {
          title: '开户行',
          key: 'receiptBank',
          align: 'center'
        },
        {
          title: '开户行账号',
          key: 'bankAccount',
          align: 'center'
        },
        {
          title: '纳税人识别号',
          key: 'taxNumber',
          align: 'center'
        }
      ],
      invoiceData: [], // 开票信息
      // 渠道信息
      channel: {
        channelName: '', // 渠道名称
        channelSource: '', // 来源
        website: '', // 网址
        companyType: '', // 公司/个人
        companyName: '', // 公司名称
        companyNature: '', // 公司性质
        personName: '', // 姓名
        personCardId: '', // 身份证
        contactAddress: '', // 联系地址
        channelType: '', // 渠道类型
        belongTo: '', // 归属
        numberLevel: '', // 量级
        domainName: '', // 域名
        isCloud: '', // 云控
        failCooperationCause: '', // 为合作原因
        marketResponsibleName: '', // 市场
        runOffCallback: '', // 流失反馈
        channelRemarks: '' // 备注
      },
      // 标签
      tag: {},
      // 合同信息
      contract: {
        contractFrom: '', // 合同拟定方
        contractType: '', // 合同类型
        firstSigner: '', // 签订人
        firstCompanyName: '', // 我方公司
        firstCompanyAccount: '', // 公司账号
        contractTime: '', // 合同期限
        contractMoney: '', // 合同金额
        isReceipt: '', // 是否开票
        receiptType: '', // 开票类型
        receiptContent: '', // 开票内容
        secondCompanyType: '', // 公司/个人
        secondCompanyName: '', // 公司名称
        personName: '', // 姓名
        personCardId: '', // 身份证
        secondBank: '', // 开户行
        secondBankAccount: '', // 开户行账号
        secondContactPerson: '', // 联系人
        secondContactPersonPhone: '', // 联系电话
        // oppositeLinkMan: "", // 对方联系人
        openTicketAddress: '', // 开票地址
        receiptMailAddress: '' // 发票寄送地址
        // receiptContent: '' // 开票内容
      },
      channelLog: [], // 日志
      attachment: [], // 合同
      quality: []// 质量认证
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 获取数据
    getData () {
      let sendData = {
        channelId: this.$route.query.channelId,
        type: this.$route.query.type,
        relatedId: this.$route.query.relatedId
      }
      this.$axios({
        url: biUrl + '/channel/showDetail',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            let data = res.data.data
            this.channel = data.channel // 渠道信息
            if (data.channel.isCloud === 0) {
              this.channel.isCloud = '否'
            } else {
              this.channel.isCloud = '是'
            }
            this.contractData = data.channelContactList // 联系人
            this.contract = data.channelContract // 合同信息
            if (data.channelContract.isReceipt === 1) {
              this.contract.isReceipt = '是'
            } else {
              this.contract.isReceipt = '否'
            }
            this.invoiceData = data.channelReceiptInfoList // 开票信息
            this.attachment = data.attachment// 合同附件
            this.quality = data.quality// 质量认证
            this.tag = data.tagNames
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // getNoticeName (ids) {
    //   this.addIncome.copieruserName = []
    //   ids.map(item => {
    //     this.addIncome.copieruserName.push(item.label)
    //   })
    //   this.addIncome.copieruserName = Array.from(
    //     new Set(this.addIncome.copieruserName)
    //   )
    // },
    // // 日志
    // getLog () {
    //   let sendData = {
    //     channelId: this.$route.query.channelId,
    //     type: this.$route.query.type
    //   }
    //   this.$axios({
    //     url: biUrl + '/channel/showLog',
    //     method: 'post',
    //     data: $qs.stringify(sendData)
    //   }).then(res => {
    //     this.channelLog = res.data.data
    //   })
    // },
    // 返回
    goBack () {
      this.$router.push({
        name: 'channel'
      })
      // this.$router.go(-1);
      // bus.$emit("on-myclose", this.$route);
    }
  }
}
</script>
<style scoped>
.headerWithGreenbar {
    font-size: 14px;
    margin-left: 4%;
}
.rowPadding {
    margin-bottom: 20px;
}
.title {
    text-align: right;
    line-height: 30px;
    margin-right: 10px;
    font-size: 14px;
}
.ivu-select {
    margin-top: 0px;
}
.line {
    width: 40%;
    display: inline-block;
}
.lineCenter {
    width: 20%;
    display: inline-block;
    text-align: center;
}
.info {
    color: #ccc;
    margin-left: 20px;
}
.btn {
    position: fixed;
    bottom: 5%;
    left: 48%;
    background: white;
    z-index: 10;
}
.top {
    line-height: 30px;
}
</style>
