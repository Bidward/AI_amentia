<template>
<!--合同详情-->
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
                <p class="top">{{addIncome.contacts ||'暂无'}}</p>
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
                开票地址：
                </Col>
                <Col span="5">
                <p class="top">{{addIncome.openingAddress||'暂无'}}</p>
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
                <Col span="3" class="title">联系电话：</Col>
                <Col span="5">
                <p class="top">{{addIncome.tel||'暂无'}}</p>
                </Col>
            </Row>
            <!--个人 发票寄送地址 详细地址-->
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">发票寄送地址：</Col>
                <Col span="5">
                <!-- <p class="top">{{addIncome.busicityList||'暂无'}}</p> -->
                <p v-if="addIncome.busicityList === undefined" style="margin-top: 5px;">暂无</p>
                <Cascader :data="addIncome.busicityListData" v-model="addIncome.busicityList" id="hideAll" v-else></Cascader>
                </Col>
                <Col span="3" class="title">详细地址：</Col>
                <Col span="5">
                <p class="top">{{addIncome.detailedAddress||'暂无'}}</p>
                </Col>
            </Row>
        </div>
    </div>
    <!--开票信息-->
    <div class="detailContent" v-if="addIncome.contractPartycompany===1">
        <Row class="rowPadding">
            <Col span="12" offset="3" class="cardTitle">开票信息</Col>
        </Row>
        <!--纳税人识别号 开票地址-->
        <Row class="rowPadding">
            <Col span="3" offset="3" class="title">
            纳税人识别号：
            </Col>
            <Col span="5">
            <p class="top">{{addIncome.contractNum||'暂无'}}</p>
            </Col>
            <Col span="3" class="title">
            开票地址：
            </Col>
            <Col span="5">
            <p class="top">{{addIncome.openingAddress||'暂无'}}</p>
            </Col>
        </Row>

        <!--对方联系人 联系电话-->
        <Row class="rowPadding">
            <Col span="3" offset="3" class="title">
            对方联系人：
            </Col>
            <Col span="5">
            <p class="top">{{addIncome.contacts||'暂无'}}</p>
            </Col>
            <Col span="3" class="title">
            联系电话：
            </Col>
            <Col span="5">
            <p class="top">{{addIncome.tel||'暂无'}}</p>
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

        <!--发票寄送地址 详细地址-->
        <Row class="rowPadding">
            <Col span="3" offset="3" class="title">发票寄送地址：</Col>
            <Col span="5">
            <p v-if="addIncome.busicityList === undefined" style="margin-top: 5px;">暂无</p>
            <Cascader :data="addIncome.busicityListData" v-model="addIncome.busicityList" id="hideAll" v-else></Cascader>
            </Col>
            <Col span="3" class="title">详细地址：</Col>
            <Col span="5">
            <p class="top">{{addIncome.detailedAddress||'暂无'}}</p>
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
            <Col span="12" offset="3" class="cardTitle">合同附件</Col>
        </Row>
        <Row class="rowPadding">
            <Col span="3" offset="2" class="title">
            附件：
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
            <viewer class="top" :images="addIncome.enclosurePic">
              <div  v-for="(key,index) in addIncome.enclosurePic" :key="index">
                <img :src="key.enclosureUrl" style=" width: 100px;height: 100px;float: left;margin-right: 10px;">
              </div>
            </viewer>
            </Col>
        </Row>
    </div>
    <!--抄送人
    <div class="detailContent">
        <Row class="rowPadding">
            <Col span="12" offset="3" class="cardTitle">抄送人</Col>
        </Row>
        <Row class="rowPadding">
            <Col span="5" offset="4">
            <p class="top">{{addIncome.copier||'暂无'}}</p>
            </Col>
        </Row>
    </div>
    -->
    <!--操作按钮-->
    <div class="detailContent">
        <Row class="rowPadding">
            <Col span="12" offset="10">
            <Button type="warning" @click="goBack" style="margin-right:15px;">返回</Button>
            <Button type="error" v-if="delectButton" @click="deletContract">删除</Button>
            <Button type="error" v-if="stopButton" @click="stopContract">终止</Button>
            <Button type="primary" v-else  @click="preview()" style="margin-left:10px">打印</Button>
            </Col>
        </Row>
    </div>
</div>
</template>

<script>
import {
  baseUrl
} from '@/api/base.js'
export default {
  name: 'addIncome',
  data () {
    return {
      noticeDelete: false,
      delectButton: false,
      stopButton: false,
      twoEntryId: '',
      twoEntryName: '',
      showEntry: false,
      addTwoEntry: true,
      isPerson: false, // 产品公司类型为个人
      showNotice: false, // 抄送人弹窗
      // incumbencyTbUser: [],
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
        busicityList: [], // 发票寄送地址
        busicityListData: [],
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
    this.isDelete()
  },
  methods: {
    isDelete () {
      if (this.$router.currentRoute.query.type === 'delete' || this.$router.currentRoute.query.type === 'deleteTbc') {
        this.delectButton = true
      } else if (this.$router.currentRoute.query.type === 'stop') {
        this.stopButton = true
      }
    },
    // 获取回显接口详情
    getData () {
      let sendData = {
        id: this.$route.query.id
      }
      this.$axios({
        url: baseUrl + '/contract/info',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.addIncome = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 返回
    goBack () {
      bus.$emit('on-myclose', this.$route)
      this.$router.push({
        name: 'contractBank'
      })
    },
    deleAxiox (sendData) {
      this.$axios({
        url: baseUrl + '/contract/delete',
        method: 'post',
        data: $qs.stringify(sendData)
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
    },
    // 删除合同
    deletContract () {
      let sendData = {
        tbcId: this.$route.query.tbcId,
        twoEntryId: this.twoEntryId,
        route: 'contractBank',
        id: this.$route.query.id
      }
      this.deleAxiox(sendData)
    },
    // 终止合同
    stopContract () {
      let sendData = {
        tbcId: this.$route.query.tbcId,
        twoEntryId: this.twoEntryId,
        route: 'contractBank',
        id: this.$route.query.id
      }
      this.$axios({
        url: baseUrl + '/contract/deleteTwo',
        method: 'post',
        data: $qs.stringify(sendData)
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
    },
    // 打印
    preview () {
      this.$router.push({
        name: 'contractView',
        query: {
          id: this.$route.query.id
        }
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

#hideAll input {
    color: #515a6e;
    border: none;
    background: white;
    font-size: 14px;
    margin-top: -2px;
    cursor: auto;
}

#hideAll i {
    display: none
}

#hideAll .ivu-select-dropdown {
    display: none
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

.refuse {
    width: 600px;
    height: auto;
}
</style>
