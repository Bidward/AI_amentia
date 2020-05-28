<template>
  <div class="viewWrapper" style="padding:20px">
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">产品信息</Col>
    </Row>
    <div>
      <Row class="rowPadding">
        <Col span="2" offset="2" class="title">
          <span>产品名称：</span>
        </Col>
        <Col span="5" ><span class="title">{{productInfo.productName ||'暂无'}}</span></Col>
        <Col span="2" offset="2" class="title">
          <span>来源：</span>
        </Col>
        <Col span="5" ><span class="title">{{productInfo.productSource ||'暂无'}}</span></Col>
      </Row>
      <!-- 公司/个人为公司时 -->
      <Row class="rowPadding" v-if="isCompany">
        <Col span="2" offset="2" class="title">
          <span>公司/个人：</span>
        </Col>
        <Col span="5" ><span class="title">{{productInfo.productIscompany ||'暂无'}}</span></Col>
        <Col span="2" offset="2" class="title">
          <span>公司名称：</span>
        </Col>
        <Col span="5" ><span class="title">{{productInfo.companyName ||'暂无'}}</span></Col>
      </Row>
      <Row class="rowPadding" v-if="isCompany">
        <Col span="2" offset="2" class="title">
          <span>公司性质：</span>
        </Col>
        <Col span="5" ><span class="title">{{productInfo.companyNature ||'暂无'}}</span></Col>
        <Col span="2" offset="2" class="title">
          <span>联系地址：</span>
        </Col>
        <Col span="5" ><span class="title">{{productInfo.contactAddress ||'暂无'}}</span></Col>
      </Row>
      <!-- 公司/个人 为个人时 -->
      <Row class="rowPadding" v-if="isPerson">
        <Col span="2" offset="2" class="title">
          <span>公司/个人：</span>
        </Col>
        <Col span="5" ><span class="title">{{productInfo.productIscompany ||'暂无'}}</span></Col>
        <Col span="2" offset="2" class="title">
          <span>姓名：</span>
        </Col>
        <Col span="5" ><span class="title">{{productInfo.userName ||'暂无'}}</span></Col>
      </Row>
      <Row class="rowPadding" v-if="isPerson">
        <Col span="2" offset="2" class="title">
          <span>身份证：</span>
        </Col>
        <Col span="5" ><span class="title">{{productInfo.idCard ||'暂无'}}</span></Col>
        <Col span="2" offset="2" class="title">
          <span>联系地址：</span>
        </Col>
        <Col span="5" ><span class="title">{{productInfo.contactAddress ||'暂无'}}</span></Col>
      </Row>
      <Row class="rowPadding">
        <Col span="2" offset="2" class="title">
          <span>客户等级：</span>
        </Col>
        <Col span="5" ><span class="title">{{productInfo.customerLevel ||'暂无'}}</span></Col>
        <Col span="2" offset="2" class="title">
          <span>控量：</span>
        </Col>
        <Col span="5" ><span class="title">{{productInfo.controlVolume ||'暂无'}}</span></Col>
      </Row>
      <Row class="rowPadding">
        <Col span="2" offset="2" class="title">
          <span>数量：</span>
        </Col>
        <Col span="5" ><span class="title">{{productInfo.number ||'暂无'}}</span></Col>
        <Col span="2" offset="2" class="title">
          <span>预算：</span>
        </Col>
        <Col span="5" ><span class="title">{{productInfo.budget ||'暂无'}}</span></Col>
      </Row>
      <Row class="rowPadding">
        <Col span="2" offset="2" class="title">
          <span>结算周期：</span>
        </Col>
        <Col span="5" ><span class="title">{{productInfo.settlementCycles ||'暂无'}}</span></Col>
        <Col span="2" offset="2" class="title">
          <span>结算方式：</span>
        </Col>
        <Col span="5" ><span class="title">{{productInfo.settlementMethod ||'暂无'}}</span></Col>
      </Row>
      <Row class="rowPadding">
        <Col span="2" offset="2" class="title">
          <span>充值款项：</span>
        </Col>
        <Col span="5" ><span class="title">{{productInfo.advancePayment ||'暂无'}}</span></Col>
        <Col span="2" offset="2" class="title">
          <span>付款方式：</span>
        </Col>
        <Col span="5" ><span class="title">{{productInfo.paymentMethod ||'暂无'}}</span></Col>
      </Row>
      <Row class="rowPadding">
        <Col span="2" offset="2" class="title">
          <span>商务：</span>
        </Col>
        <Col span="5" ><span class="title">{{productInfo.businessAffairs ||'暂无'}}</span></Col>
      </Row>
    </div>
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">联系人列表</Col>
    </Row>
    <Row>
      <LinkManTab :contractData="productMessage.contacts"/>
    </Row>
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">标签</Col>
    </Row>
    <Row class="rowPadding">
      <Col span="2" offset="2" class="title">
          <span>端口类型：</span>
        </Col>
        <Col span="5" ><span class="title">{{label.portType ||'暂无'}}</span></Col>
        <Col span="2" offset="2" class="title">
          <span>软件功能：</span>
        </Col>
        <Col span="5" ><span class="title">{{label.softwareFunction ||'暂无'}}</span></Col>
    </Row>
    <Row class="rowPadding">
      <Col span="2" offset="2" class="title">
        <span>业务类型：</span>
      </Col>
      <Col span="5" ><span class="title">{{label.businessType ||'暂无'}}</span></Col>
    </Row>
    <Row class="rowPadding">
      <Col span="2" offset="2" class="title">
        <span>侧重标签：</span>
      </Col>
      <Col span="5" ><span class="title">{{label.focusLabels ||'暂无'}}</span></Col>
    </Row>
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">开票信息：</Col>
    </Row>
    <Row>
      <Col span="16" offset="3" >
        <Table :columns="invoiceInfoHeader" :data="invoiceInfoData" border></Table>
      </Col>
    </Row>
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">阶梯价：</Col>
    </Row>
    <Row class="rowPPading" v-for="(item,index) in ladderPrice" :key="index">
      <Col span="2" offset="2" class="title" ><span>量级：</span></Col>
      <Col span="3"><span class="title">{{item.numberLevel ||'暂无'}}</span>（万）</Col>
      <Col span="2" offset="2" class="title" ><span>单价：</span></Col>
      <Col span="3"><span class="title">{{item.unitPrice ||'暂无'}}</span>（元）</Col>
      <Col span="2" offset="2" class="title" ><span>建议出价：</span></Col>
      <Col span="3"><span class="title">{{item.suggestedPrice ||'暂无'}}</span>（万）</Col>
    </Row>
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">链接信息：</Col>
    </Row>
    <Row>
      <Link-info :linkInfos="productMessage.linkInfos"/>
    </Row>
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">匹配信息</Col>
    </Row>
    <Row>
      <match-info :productId="productId"/>
    </Row>
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">合同信息</Col>
    </Row>
    <Row >
      <ContractInfo :contractInfoToSon="productMessage.contractInfo"/>
    </Row>
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">附件上传</Col>
    </Row>
    <Row class="">
      <Col span="2" offset="2" class="title">
        <span>合同附件：</span>
      </Col>
      <Col span="2" offset="7" class="title">
        <span>质量认证：</span>
      </Col>
    </Row>
    <Row  >
      <Col span="8" offset="4">
       <Col v-for="item in enclosureFile" :key="item.id" class="attr" >
         <span ><a :href="item.attachmentUrl" :download="item.attachmentName" >{{item.attachmentName}}</a></span>
       </Col>
      </Col>
      <Col span="8" offset="1">
       <Col v-for="item in enclosurePic" :key="item.id" class="attr" >
         <span><a :href="item.attachmentUrl" :download="item.attachmentName" >{{item.attachmentName}}</a></span>
       </Col>
      </Col>
     </Row>

    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">备注</Col>
    </Row>
    <Row class="rowPadding">
      <Col span="16" offset="3" style="font-size:14px;line-height:30px;"><span>{{remark ||'暂无'}}</span></Col>
    </Row>
    <Row>
      <!-- 日志区 -->
    <!-- <Col span="24">
        <OpLogs :task-logs="taskLog" class="taskLogs"/>
      </Col> -->
    </Row>
    <!-- 按钮 -->
    <Row class="position" >
      <Col span="2" class="btn">
        <!-- <Button @click="goBack">返回</Button> -->
         <Card>
          <div style="text-align:center">
            <Button @click="goBack" >返回</Button>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
import { proBaseUrl, baseUrl } from '@/api/base.js'
import LinkManTab from './components/link-man' // 联系人列表
import ContractInfo from './components/contract-info'// 合同信息
import LinkInfo from './components/link-info'// 链接信息
import MatchInfo from './components/match-info'// 匹配信息
import OpLogs from '../../op-log'
export default {
  name: 'detailProducts',
  components: {
    LinkManTab,
    ContractInfo,
    LinkInfo,
    MatchInfo,
    OpLogs
  },
  data () {
    return {
      productId: 0,
      productMessage: [], // 产品数据
      productInfo: {
        productName: '', // 产品名称
        productSource: '', // 来源
        productIscompany: '', // 公司或者个人
        companyName: '', // 公司名称
        companyNature: '', // 公司性质
        contactAddress: '', //
        userName: '', // 个人姓名
        idCard: '', // 身份证号码
        customerLevel: ' ', // 客户等级
        controlVolume: '', // 控量
        budget: '', // 预算
        settlementCycles: '', // 结算周期
        settlementMethod: '', // 结算方式
        advancePayment: '', // 预收款项
        paymentMethod: '', // 付款方式
        businessAffairs: '', // 商务
        relatedProduct: '', // 关联产品
        CustomPackage: '', // 定制包
        notCooperationReasons: ''// 未合作原因
      }, // 产品信息
      enclosureFile: [], // 附件文件
      enclosurePic: [], // 附件图片
      isCompany: true, // 展示公司
      isPerson: false, // 展示个人
      label: {
        portType: '', // 端口类型
        softwareFunction: '', // 软件功能
        businessType: '', // 业务类型
        focusLabels: ''// 侧重标签
      },
      invoiceInfoHeader: [
        {
          title: '开户名',
          key: 'accountName',
          align: 'center'
        }, {
          title: '开户行',
          key: 'openingBank',
          align: 'center'
        },
        {
          title: '开户行账号',
          key: 'bankAccount',
          align: 'center'
        },
        {
          title: '纳税人识别号',
          key: 'identificationNumber',
          align: 'center'
        }
      ],
      invoiceInfoData: [],
      // 阶梯价
      ladderPrice: [{
        numberLevel: '', // 量级
        unitPrice: '', // 单价
        suggestedPrice: ''// 建议出价
      }],
      // 合同信息
      // contractInfo:{},
      remark: '', // 备注
      taskLog: [],
      nickName: '', // 当前用户名
      personId: '', // 当前用户ID
      attachments: []
    }
  },
  mounted () {
    this.showPerson()
    this.getData()
  },
  methods: {
    // 展示公司或者个人
    showPerson () {
      if (this.productInfo.productIscompany === '公司') {
        this.isCompany = true
        this.isPerson = false
      } else if (this.productInfo.productIscompany === '个人') {
        this.isPerson = true
        this.isCompany = false
      }
    },
    // 获取数据
    getData () {
      this.$axios({
        url: baseUrl + '/login/getuser',
        method: 'get'
      }).then(res => {
        this.nickName = res.data.nickname
        this.personId = res.data.id
      }).catch(err => {
        console.log(err)
      })
      let sendDate = {
        canPass: Number(this.$route.query.canPass),
        id: Number(this.$route.query.id)
      }
      this.$axios({
        url: proBaseUrl + '/product/selectProductDetile',
        method: 'post',
        data: $qs.stringify(sendDate)
      }).then(res => {
        if (res.data.code === 10000) {
          this.productMessage = res.data.data.productMessage
          this.productInfo = res.data.data.productMessage.productInformation
          this.remark = this.productMessage.productInformation.remarks
          this.ladderPrice = this.productMessage.ladderPrice
          this.invoiceInfoData = res.data.data.productMessage.invoiceInfos
          this.attachments = res.data.data.productMessage.attachments
          for (let i in this.attachments) {
            // console.log(this.productInfo.enclosurePic)
            if (this.attachments[i].attachmentType === 1) {
              this.enclosureFile.push({ attachmentName: this.attachments[i].attachmentName, attachmentUrl: this.attachments[i].attachmentUrl, id: i + 10 })
            } else {
              this.enclosurePic.push({ attachmentName: this.attachments[i].attachmentName, attachmentUrl: this.attachments[i].attachmentUrl, id: i + 10 })
            }
          }
          console.log(this.enclosurePic)
          console.log(this.enclosureFile)
          // this.contractInfo = this.productMessage.contractInfo
          this.showPerson()
          if (this.productMessage.productTags) {
            this.label = this.productMessage.productTags
          }
          this.productId = this.productMessage.productInformation.id
          this.$Message.info(`产品${this.productInfo.productName}信息获取成功`)
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    goBack () {
      this.$router.go(-1)
      bus.$emit('on-myclose', this.$route)
    }
  }
}
</script>
<style lang="less" scoped>
  .headerWithGreenbar{
    font-size: 14px;
    margin-left: 4%;
  }
  .rowPadding{
    margin-bottom:20px;
  }
  .title{
    text-align: right;
    line-height: 30px;
    margin-right: 10px;
    font-size: 14px;
  }
  .btn{
  position: fixed;
  bottom: 2%;
  left:48%;
  background:white;
  z-index: 10;
}
.attr{
  font-size: 14px;
  line-height: 28px;
  display: block;
}
</style>
