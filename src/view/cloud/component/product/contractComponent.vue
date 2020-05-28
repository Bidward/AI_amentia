<template>
    <div class="contractCompany">
    <div class="header" @click="closeContent()">合同</div>
        <div v-if="openProduct">
            <div v-for="(item,index) in addIncomeList" :key="index" style="border-bottom:3px dashed #ccc;margin-bottom:30px" class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="4" class="cardTitle">合同属性</Col>
            </Row>
            <!--合同拟定方 合同类型-->
            <Row class="rowPadding">
                <Col span="3" offset="4" class="title">合同拟定方：</Col>
                <Col span="5">
                <p class="top">{{item.planerName ||'暂无'}}</p>
                </Col>
                <Col span="3" class="title">合同类型：</Col>
                <Col span="5">
                <p class="top">{{item.contractTypeName ||'暂无'}}</p>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="3" offset="4" class="title">合同编码：</Col>
                <Col span="5">
                <p class="top">{{item.card ||'暂无'}}</p>
                </Col>
            </Row>
            <!--甲方-->
            <div class="detailContent">
                <Row class="rowPadding">
                    <Col span="12" offset="4" class="cardTitle">甲方</Col>
                </Row>
                <div v-if="item.contractPartycompany===1">
                    <!--公司/个人 公司名称-->
                    <Row class="rowPadding">
                        <Col span="3" offset="4" class="title">
                        公司/个人：
                        </Col>
                        <Col span="5">
                        <p class="top">{{item.contractPartycompanyName ||'暂无'}}</p>
                        </Col>
                        <Col span="3" class="title">
                        公司名称：
                        </Col>
                        <Col span="5">
                        <p class="top">{{item.partyCompany ||'暂无'}}</p>
                        </Col>
                    </Row>
                     <!--公司 开户行账号 开户行-->
                    <Row class="rowPadding">
                        <Col span="3" offset="4" class="title">
                        开户行账号：
                        </Col>
                        <Col span="5">
                        <p class="top">{{item.openbankId ||'暂无'}}</p>
                        </Col>
                        <Col span="3" class="title">
                        开户行：
                        </Col>
                        <Col span="5">
                        <p class="top">{{item.openbank ||'暂无'}}</p>
                        </Col>
                    </Row>
                </div>
                <div v-if="item.contractPartycompany===2">
                    <!--公司选择为个人时 -->
                    <Row class="rowPadding">
                        <Col span="3" offset="4" class="title">
                        公司/个人：
                        </Col>
                        <Col span="5">
                        <p class="top">{{item.contractPartycompanyName ||'暂无'}}</p>
                        </Col>
                        <Col span="3" class="title">
                        姓名：
                        </Col>
                        <Col span="5">
                        <p class="top">{{item.partyCompany ||'暂无'}}</p>
                        </Col>
                    </Row>
                    <!--个人  身份证号码 开票地址-->
                    <Row class="rowPadding">
                        <Col span="3" offset="4" class="title">
                        身份证号码：
                        </Col>
                        <Col span="5">
                        <p class="top">{{item.contractNum||'暂无'}}</p>
                        </Col>
                        <Col span="3" class="title">
                        开票地址：
                        </Col>
                        <Col span="5">
                        <p class="top">{{item.openingAddress||'暂无'}}</p>
                        </Col>
                    </Row>

                    <!--个人  开户行 开票地址-->
                    <Row class="rowPadding">
                        <Col span="3" offset="4" class="title">
                        开户行：
                        </Col>
                        <Col span="5">
                        <p class="top">{{item.openbank||'暂无'}}</p>
                        </Col>
                        <Col span="3" class="title">联系电话：</Col>
                        <Col span="5">
                        <p class="top">{{item.tel||'暂无'}}</p>
                        </Col>
                    </Row>
                    <!--个人 发票寄送地址 详细地址-->
                    <Row class="rowPadding">
                        <Col span="3" offset="4" class="title">发票寄送地址：</Col>
                        <Col span="5">
                        <p class="top">{{item.sendAddress||'暂无'}}</p>
                        </Col>
                        <Col span="3" class="title">详细地址：</Col>
                        <Col span="5">
                        <p class="top">{{item.detailedAddress||'暂无'}}</p>
                        </Col>
                    </Row>
                </div>
            </div>
            <!--开票信息-->
            <div class="detailContent" v-if="item.contractPartycompany===1">
                <Row class="rowPadding">
                    <Col span="12" offset="4" class="cardTitle">开票信息</Col>
                </Row>
                <!--纳税人识别号 开票地址-->
                <Row class="rowPadding">
                    <Col span="3" offset="4" class="title">
                    纳税人识别号：
                    </Col>
                    <Col span="5">
                    <p class="top">{{item.contractNum||'暂无'}}</p>
                    </Col>
                    <Col span="3" class="title">
                    开票地址：
                    </Col>
                    <Col span="5">
                    <p class="top">{{item.openingAddress||'暂无'}}</p>
                    </Col>
                </Row>

                <!--对方联系人 联系电话-->
                <Row class="rowPadding">
                    <Col span="3" offset="4" class="title">
                    对方联系人：
                    </Col>
                    <Col span="5">
                    <p class="top">{{item.contacts||'暂无'}}</p>
                    </Col>
                    <Col span="3" class="title">
                    联系电话：
                    </Col>
                    <Col span="5">
                    <p class="top">{{item.tel||'暂无'}}</p>
                    </Col>
                </Row>

                <!--开票类型 开票内容-->
                <Row class="rowPadding">
                    <Col span="3" offset="4" class="title">
                    开票类型：
                    </Col>
                    <Col span="5">
                    <p class="top">{{item.ticketTypeName||'暂无'}}</p>
                    </Col>
                    <Col span="3" class="title">
                    开票内容：
                    </Col>
                    <Col span="5">
                    <p class="top">{{item.ticketTextName||'暂无'}}</p>
                    </Col>
                </Row>

                <!--发票寄送地址 详细地址-->
                <Row class="rowPadding">
                    <Col span="3" offset="4" class="title">发票寄送地址：</Col>
                    <Col span="5">
                    <p class="top">{{item.sendAddress||'暂无'}}</p>
                    </Col>
                    <Col span="3" class="title">详细地址：</Col>
                    <Col span="5">
                    <p class="top">{{item.detailedAddress||'暂无'}}</p>
                    </Col>
                </Row>
            </div>

            <!--乙方-->
            <div class="detailContent">
                <Row class="rowPadding">
                    <Col span="12" offset="4" class="cardTitle">乙方</Col>
                </Row>
                <!--签订人 我方公司-->
                <Row class="rowPadding">
                    <Col span="3" offset="4" class="title">
                    签订人：
                    </Col>
                    <Col span="5">
                    <p class="top">{{item.signerName||'暂无'}}</p>
                    </Col>
                    <Col span="3" class="title">
                    我方公司：
                    </Col>
                    <Col span="5">
                    <p class="top">{{item.wecompanyName||'暂无'}}</p>
                    </Col>
                </Row>

                <!--公司账号 合同期限-->
                <Row class="rowPadding">
                    <Col span="3" offset="4" class="title">
                    公司账号：
                    </Col>
                    <Col span="5">
                    <p class="top">{{item.wecompanybankName||'暂无'}}</p>
                    </Col>
                    <Col span="3" class="title">
                    合同期限：
                    </Col>
                    <Col span="5">
                    <p class="top">{{item.startTime+' ~ '+item.endTime||'暂无'}}</p>
                    </Col>
                </Row>
                <!--合同金额-->
                <Row class="rowPadding">
                    <Col span="3" offset="4" class="title">合同金额：</Col>
                    <Col span="5">
                    <p class="top">{{item.money||'暂无'}}</p>
                    </Col>
                </Row>
            </div>
            <!--备注-->
            <div class="detailContent">
                <Row class="rowPadding">
                    <Col span="12" offset="4" class="cardTitle">备注</Col>
                </Row>
                <!--备注-->
                <Row class="rowPadding">
                    <Col span="5" offset="6">
                    <p class="top">{{item.remark||'暂无'}}</p>
                    </Col>
                </Row>
            </div>
            <!--附件-->
            <div class="detailContent">
                <Row class="rowPadding">
                    <Col span="12" offset="4" class="cardTitle">合同附件</Col>
                </Row>
                <Row class="rowPadding">
                    <Col span="3" offset="2" class="title">
                        附件：
                    </Col>
                    <Col span="5">
                        <p class="top" v-for="(key,index) in item.enclosure" :key="index">
                        <a :href="key.enclosureUrl">{{key.enclosureName||'暂无'}}</a>
                        </p>
                    </Col>
                    <Col span="3" class="title">
                    图片：
                    </Col>
                    <Col span="9">
                        <viewer class="top" v-for="(key,index) in item.enclosurePic" :key="index">
                            <img :src="key.enclosureUrl" style=" width: 100px;height: 100px; float: left;margin-right: 10px;">
                        </viewer>
                    </Col>
                </Row>
            </div>
        </div>
    </div>
    <div v-if="addData" style="text-align: center;height: 40px;background: #FFFBE6;border: 1px solid #FFE58F;line-height: 40px; width: 1000px;margin: 10px auto;margin-top: 10px;">
        <p style="display:inline"><Icon type="md-alert" style="color:rgb(255, 229, 143)"/>无合同信息，请录入合同</p><p style="color:#19a88d;display: initial;cursor: pointer;" @click="toAddNewContract">新增合同</p>
    </div>
    </div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
export default {
  name: 'contractComponent',
  data () {
    return {
      addData: false,
      openProduct: false, // 合同开关
      isPerson: false, // 产品公司类型为个人
      showNotice: false, // 抄送人弹窗
      addIncomeList: [],
      addIncome: {
        planerName: '', // 合同拟定方
        contractTypeName: '', // 合同类型
        contractPartycompanyName: '', // 公司或个人  1为公司2为个人
        contractPartycompanyNameList: [{
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
        enclosurePic: []
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      let sendData = {}
      if (this.$route.name === 'detailProduct') {
        sendData = {
          pid: this.$route.query.productCompanyId
        }
      } else if (this.$route.name === 'detailChannel') {
        sendData = {
          cid: this.$route.query.productChannelId
        }
      }
      this.$axios({
        url: baseUrl + '/contract/info',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.addIncomeList = res.data.content
        } else if (res.data.code === 10105) {
          this.addData = true
          this.openProduct = false
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 展开关闭合同详情
    closeContent () {
      this.openProduct === true
        ? (this.openProduct = false)
        : (this.openProduct = true)
    },
    toAddNewContract () {
      this.$router.push({
        name: 'contractBank'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.contractCompany {
    font-size: 14px;

    .detailContent {
        margin-top: 30px;

        .content {
            margin-top: 6px;
        }
        .top{
            margin-top: 4px;
        }
    }
}

.header {
    width: 100%;
    height: 70px;
    line-height: 70px;
    background-color: #EAF8F5;
    text-align: center;
    margin: 0 auto;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
}
</style>
