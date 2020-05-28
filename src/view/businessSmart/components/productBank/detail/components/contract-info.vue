<template>
  <div class="viewWrapper" style="padding:20px">
    <!-- 收款合同 -->
    <div class="receipt">
      <Row class="rowPadding">
        <Col span="2" offset="2" class="title">
          <span>合同拟定方：</span>
        </Col>
        <Col span="5" ><span class="title">{{contractInfo.contractParty || '暂无'}}</span></Col>
        <Col span="2" offset="2" class="title">
          <span>合同类型：</span>
        </Col>
        <Col span="5" ><span class="title">{{contractInfo.contractType || '暂无'}}</span></Col>
      </Row>
      <Row class="rowPadding">
        <Col span="2" offset="1">
          <span>甲方：</span>
        </Col>
      </Row>
      <div v-if="addIcome">
        <Row class="rowPadding" v-if="isPersonC">
          <Col span="2" offset="2" class="title">
            <span>公司/个人：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.firstIscompany || '暂无'}}</span></Col>
          <Col span="2" offset="2" class="title">
            <span>公司名称：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.firstCompanyName || '暂无'}}</span></Col>
        </Row>
        <Row class="rowPadding" v-else>
          <Col span="2" offset="2" class="title">
            <span>公司/个人：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.firstIscompany || '暂无'}}</span></Col>
          <Col span="2" offset="2" class="title">
            <span>姓名：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.firstUserName || '暂无'}}</span></Col>
        </Row>
        <Row class="rowPadding" >
          <Col span="2" offset="2" class="title">
            <span>对方联系人：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.firstContactPerson || '暂无'}}</span></Col>
          <Col span="2" offset="2" class="title">
            <span>开票地址：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.firstBillingAddress || '暂无'}}</span></Col>
        </Row>
        <Row class="rowPadding" >
          <Col span="2" offset="2" class="title">
            <span>开票类型：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.firstBillingType || '暂无'}}</span></Col>
          <Col span="2" offset="2" class="title">
            <span>联系电话：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.firstContactNumber || '暂无'}}</span></Col>
        </Row>
        <Row class="rowPadding" >
          <Col span="2" offset="2" class="title">
            <span>发票寄送地址：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.firstMailingAddress || '暂无'}}</span></Col>
          <Col span="2" offset="2" class="title">
            <span>开票内容：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.firstBillingContent || '暂无'}}</span></Col>
        </Row>
      </div>
      <div v-else>
        <Row class="rowPadding" >
          <Col span="2" offset="2" class="title">
            <span>签订人：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.secondSigningPeople || '暂无'}}</span></Col>
          <Col span="2" offset="2" class="title">
            <span>我方公司：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.secondCompanyName || '暂无'}}</span></Col>
        </Row>
        <Row class="rowPadding" >
          <Col span="2" offset="2" class="title">
            <span>公司账号：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.secondCompanyAccount || '暂无'}}</span></Col>
          <Col span="2" offset="2" class="title">
            <span>合同期限：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.secondCompanyTerm || '暂无'}}</span></Col>
        </Row>
         <Row class="rowPadding" >
          <Col span="2" offset="2" class="title">
            <span>合同金额：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.secondCompanyMoney || '暂无'}}</span></Col>
          <Col span="2" offset="2" class="title">
            <span>是否开票：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.fiestIsbilling || '暂无'}}</span></Col>
        </Row>
         <Row class="rowPadding" >
          <Col span="2" offset="2" class="title">
            <span>开票类型：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.firstBillingType || '暂无'}}</span></Col>
          <Col span="2" offset="2" class="title">
            <span>开票内容：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.firstBillingContent || '暂无'}}</span></Col>
        </Row>
      </div>
      <Row class="rowPadding">
        <Col span="2" offset="1">
          <span>乙方：</span>
        </Col>
      </Row>
      <div v-if="addIcome">
        <Row class="rowPadding" >
          <Col span="2" offset="2" class="title">
            <span>签订人：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.secondSigningPeople || '暂无'}}</span></Col>
          <Col span="2" offset="2" class="title">
            <span>我方公司：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.secondCompanyName || '暂无'}}</span></Col>
        </Row>
        <Row class="rowPadding" >
          <Col span="2" offset="2" class="title">
            <span>公司账号：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.secondCompanyAccount || '暂无'}}</span></Col>
          <Col span="2" offset="2" class="title">
            <span>合同期限：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.secondCompanyTerm || '暂无'}}</span></Col>
        </Row>
        <Row class="rowPadding" >
          <Col span="2" offset="2" class="title">
            <span>合同金额：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.secondCompanyMoney || '暂无'}}</span></Col>
        </Row>
      </div>
      <div v-else>
        <Row class="rowPadding" v-if="isPersonC">
          <Col span="2" offset="2" class="title">
            <span>公司/个人：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.firstIscompany || '暂无'}}</span></Col>
          <Col span="2" offset="2" class="title">
            <span>公司名称：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.firstCompanyName || '暂无'}}</span></Col>
        </Row>
        <Row class="rowPadding" v-else>
          <Col span="2" offset="2" class="title">
            <span>公司/个人：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.firstIscompany || '暂无'}}</span></Col>
          <Col span="2" offset="2" class="title">
            <span>姓名：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.firstUserName || '暂无'}}</span></Col>
        </Row>
        <Row class="rowPadding">
          <Col span="2" offset="2" class="title">
            <span>开户行账号：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.secondBankAccount || '暂无'}}</span></Col>
           <Col span="2" offset="2" class="title">
            <span>开户行：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.secondBank || '暂无'}}</span></Col>
        </Row>
         <Row class="rowPadding" >
          <Col span="2" offset="2" class="title">
            <span>对方联系人：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.firstContactPerson || '暂无'}}</span></Col>
           <Col span="2" offset="2" class="title">
            <span>联系电话：</span>
          </Col>
          <Col span="5" ><span class="title">{{contractInfo.firstContactNumber || '暂无'}}</span></Col>
        </Row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    contractInfoToSon: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      addIcome: true, // 展示收款还是付款合同
      isPersonC: true, // 展示合同信息公司还是个人
      // 合同信息
      contractInfo: {
        contractParty: '我方合同', // 合同拟定方
        contractType: '付款合同', // 合同类型
        firstIscompany: '', // 公司或者个人
        firstCompanyName: '', // 公司名称
        firstUserName: '', // 个人姓名
        firstContactPerson: '', // 对方联系人
        firstBillingAddress: '', // 开票地址
        firstBillingType: '', // 开票类型
        firstContactNumber: '', // 联系电话
        firstMailingAddress: '', // 发票寄送地址
        firstBillingContent: '', // 开票内容
        fiestIsbilling: '', // 是否开票
        secondSigningPeople: '', // 签订人
        secondCompanyName: '', // 我方公司
        secondCompanyAccount: '', // 公司账号
        secondCompanyTerm: '', // 合同期限
        secondCompanyMoney: '', // 合同金额
        secondBankAccount: '', // 开户行账户
        secondBank: ''// 开户行

      }
    }
  },
  watch: {
    contractInfoToSon (newData) {
      if (newData) {
        this.contractInfo = newData
        // this.contractInfo.firstIscompany = '个人'
        // this.contractInfo.contractType = '付款合同'
        this.changeC()
        this.showPerson()
      }
    }
  },
  mounted () {
    this.showPerson()
  },
  // computed:{
  //   isPersonC(){
  //     return this.contractInfo.firstIscompany === '公司'
  //   }
  // },
  methods: {
    showPerson () {
      if (this.contractInfo.firstIscompany === '公司') {
        this.isPersonC = true
      } else if (this.contractInfo.firstIscompany === '个人') {
        this.isPersonC = false
      }
    },
    changeC () {
      if (this.contractInfo.contractType === '收款合同') {
        this.addIcome = true
      } else {
        // console.log(123)
        this.addIcome = false
      }
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
</style>
