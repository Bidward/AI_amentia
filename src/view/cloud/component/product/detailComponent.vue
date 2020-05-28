<template>
<!--产品公司详情-->
<div class="productCompany">
    <div class="header" @click="closeContent()">产品公司</div>
    <div class="detailContent" v-if="openProduct">
        <Row class="rowPadding">
            <Col span="12" offset="4" class="cardTitle">公司信息</Col>
        </Row>
        <div v-if="companyInfo.companyType===1">
            <!--商务 公司/个人-->
            <Row class="rowPadding">
                <Col span="3" offset="4" class="title">商务：
                </Col>
                <Col span="3">
                <p class="content">{{companyInfo.businessIdName||'暂无'}}</p>
                </Col>

                <Col span="3" class="title">公司/个人：
                </Col>
                <Col span="3">
                <p class="content">{{companyInfo.companyTypeName||'暂无'}}</p>
                </Col>
            </Row>
            <!--公司名称 对方联系地址-->
            <Row class="rowPadding">
                <Col span="3" offset="4" class="title">公司名称：
                </Col>
                <Col span="3">
                <p class="content">{{companyInfo.companyName||'暂无'}}</p>
                </Col>

                <Col span="3" class="title">对方联系地址：
                </Col>
                <Col span="5">
                <p class="content" style="margin-top: 5px;">{{companyInfo.contactAddr||'暂无'}}</p>
                </Col>
            </Row>
            <!--详细地址 区域-->
            <Row class="rowPadding">
                <Col span="3" offset="4" class="title">详细地址：
                </Col>
                <Col span="3">
                <p class="content">{{companyInfo.detailedAddress||'暂无'}}</p>
                </Col>

                <Col span="3" class="title">区域：
                </Col>
                <Col span="3">
                <p class="content">{{companyInfo.regionName||'暂无'}}</p>
                </Col>
            </Row>
            <!--公司性质 区域-->
            <Row class="rowPadding">
                <Col span="3" offset="4" class="title">公司性质：
                </Col>
                <Col span="3">
                <p class="content">{{companyInfo.corporateNatureName||'暂无'}}</p>
                </Col>
                <Col span="3"  class="title">客户等级：
                </Col>
                <Col span="3">
                <p class="content">{{companyInfo.customTypeName||'暂无'}}</p>
                </Col>
            </Row>
        </div>
        <div v-if="companyInfo.companyType ===2">
            <Row class="rowPadding">
                <Col span="3" offset="4" class="title">商务：
                </Col>
                <Col span="3">
                <p class="content">{{companyInfo.businessIdName||'暂无'}}</p>
                </Col>

                <Col span="3" class="title">公司/个人：
                </Col>
                <Col span="3">
                <p class="content">{{companyInfo.companyTypeName||'暂无'}}</p>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="3" offset="4" class="title">姓名：
                </Col>
                <Col span="3">
                <p class="content">{{companyInfo.companyName||'暂无'}}</p>
                </Col>

                <Col span="3" class="title">身份证号：
                </Col>
                <Col span="3">
                <p class="content">{{companyInfo.companyCard||'暂无'}}</p>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="3" offset="4" class="title">对方联系地址：
                </Col>
                <Col span="3">
                <p class="content" style="margin-top: 5px;">{{companyInfo.contactAddr||'暂无'}}</p>
                </Col>
                <Col span="3" class="title">详细地址：
                </Col>
                <Col span="3">
                <p class="content">{{companyInfo.detailedAddress||'暂无'}}</p>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="3" offset="4" class="title">区域类型：
                </Col>
                <Col span="3">
                <p class="content">{{companyInfo.regionName||'暂无'}}</p>
                </Col>
                 <Col span="3"  class="title">客户等级：
                </Col>
                <Col span="3">
                <p class="content">{{companyInfo.customTypeName||'暂无'}}</p>
                </Col>
            </Row>
        </div>
        <!--联系人列表-->
        <Row class="rowPadding">
            <Col span="12" offset="4" class="cardTitle">联系人列表</Col>
        </Row>
        <Row class="rowPadding">
            <Col span="16" offset="6">
            <Table class="content" border id="contractTable" :columns="contractList.contractHeader" :data="contractList.contractData">
                <template slot-scope="{ row, index }" slot="action">
                    <Button class="simple" v-if="row.istop !== 1" @click="setTop(row)">置顶</Button>
                </template>
            </Table>
            </Col>
        </Row>

        <!--开票信息-->
        <Row class="rowPadding">
            <Col span="12" offset="4" class="cardTitle">开票信息</Col>
        </Row>
        <Row class="rowPadding">
            <Col span="16" offset="6">
            <Table id="invoiceTable" border :columns="invoice.invoicetHeader" :data="invoice.invoiceData">
                <template slot-scope="{ row, index }" slot="action">
                    <Button class="simple" @click="getInvoiceDetail(row)">详情</Button>
                </template>
            </Table>
            </Col>
        </Row>
        <!--开票信息详情-->
        <Modal id="invoiceMoal" v-model="invoice.modal" title="开票信息" ok-text="关闭" cancel-text=" ">
            <Row class="rowPadding">
                <Col span="4" class="title">开户名：
                </Col>
                <Col span="6">
                <p class="content">{{invoiceModal.accountName||'暂无'}}</p>
                </Col>

                <Col span="6" class="title">纳税人识别号：
                </Col>
                <Col span="5">
                <p class="content">{{invoiceModal.taxpayerCard||'暂无'}}</p>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="4" class="title">开户行：
                </Col>
                <Col span="6">
                <p class="content">{{invoiceModal.openingBank||'暂无'}}</p>
                </Col>

                <Col span="6" class="title">开户行账号：
                </Col>
                <Col span="5">
                <p class="content">{{invoiceModal.openingBankCard||'暂无'}}</p>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="4" class="title">开票地址：
                </Col>
                <Col span="6">
                <p class="content">{{invoiceModal.billingAddress||'暂无'}}</p>
                </Col>

                <Col span="6" class="title">开票电话：
                </Col>
                <Col span="5">
                <p class="content">{{invoiceModal.telephone||'暂无'}}</p>
                </Col>
            </Row>
        </Modal>

        <!--主要业务-->
        <Row class="rowPadding">
            <Col span="12" offset="4" class="cardTitle">主要业务</Col>
        </Row>
        <Row class="rowPadding" v-for="(item,index) in companyInfo.busiTimes" :key="index">
            <Col span="3" offset="4" class="title">业务名称：
            </Col>
            <Col span="3">
            <p class="content">{{item.businessName}}</p>
            </Col>
            <Col span="3" class="title">业务类型：
            </Col>
            <Col span="3">
            <p class="content">{{item.businessTypeName}}</p>
            </Col>
        </Row>

        <!--备注-->
        <Row class="rowPadding">
            <Col span="12" offset="4" class="cardTitle">备注</Col>
        </Row>
        <Row class="rowPadding">
            <Col span="3" offset="6">
            <p>{{companyInfo.text||'暂无'}}</p>
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
  name: 'detailComponent',
  data () {
    return {
      openProduct: false, // 展开产品公司详情
      companyInfo: {
        busiTimes: [{
          businessName: '', // 业务名称
          businessType: '', // 业务类型
          businessTypeName: '' // 业务类型name
        }], // 主要业务
        businessIdName: '', // 商务名称
        businessId: '', // 商务id
        // incumbencyTbUser: [], // 商务列表
        companyTypeName: '', // 公司/个人名称
        companyType: '', // 公司或个人  1为公司2为个人
        companyTypeList: [{
          id: '1',
          name: '公司'
        }, {
          id: '2',
          name: '个人'
        }],
        companyName: '', // 公司名称
        contactAddr: '',
        busicityList: [], // 对方联系地址
        busicityListData: [],
        detailedAddress: '', // 详细地址
        regionName: '', // 区域name
        customTypeName: '',
        regionId: '', // 区域类型id
        regionList: [], // 区域类型list
        corporateNatureName: '', // 公司性质name
        corporateNature: '', // 公司性质 1为官方2为代理
        corporateNatureList: [{
          id: '1',
          name: '官方'
        }, {
          id: '2',
          name: '代理'
        }], // 公司性质列表
        companyCard: '', // 身份证号
        text: '' // 备注
      },
      // 联系人列表
      contractList: {
        // 联系人表头
        contractHeader: [{
          title: '联系人',
          key: 'contactsName',
          align: 'center'
        }, {
          title: '联系电话',
          key: 'telephone',
          align: 'center'
        }, {
          title: 'QQ',
          key: 'qq',
          align: 'center'
        }, {
          title: '微信',
          key: 'wechat',
          align: 'center'
        }, {
          title: '邮箱',
          key: 'email',
          align: 'center'
        }, {
          title: '公司职位',
          key: 'contactsPosition',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
        ],
        contractData: [] // 联系人数据
      },
      invoice: {
        modal: false, // 开票信息详情弹窗开关
        // 表头
        invoicetHeader: [{
          title: '开户名',
          key: 'accountName',
          align: 'center'
        },
        {
          title: '开户行',
          key: 'openingBank',
          align: 'center'
        },
        {
          title: '开户行账号',
          key: 'openingBankCard',
          align: 'center'
        },
        {
          title: '纳税人识别号',
          key: 'taxpayerCard',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
        ],
        // 新增发票人数据
        invoiceData: []
      },
      invoiceModal: {
        accountName: '', // 开户名
        taxpayerCard: '', // 纳税人识别号
        openingBankCard: '', // 开户行账号
        openingBank: '', // 开户行
        billingAddress: '', // 开票地址
        telephone: '' // 开票电话
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 获取数据
    getData () {
      let sendData = {
        productCompanyId: this.$route.query.productCompanyId
      }
      this.$axios({
        url: baseUrl + '/productCompany/info',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          // 公司信息和主要业务
          this.companyInfo = res.data.content.productCompany
          // 编辑时若没有数据则手动添加一行
          if (this.companyInfo.busiTimes.length === 0) {
            this.companyInfo.busiTimes.push({
              businessName: '暂无', // 业务名称
              businessTypeName: '暂无' // 业务类型name
            })
          }
          // 联系人列表
          this.contractList.contractData = res.data.content.contacts
          // 开票信息
          this.invoice.invoiceData = res.data.content.invoices
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 展开关闭产品公司详情
    closeContent () {
      this.openProduct === true
        ? (this.openProduct = false)
        : (this.openProduct = true)
    },
    // 设置置顶
    setTop (row) {
      let sendData = {
        id: row.id
      }
      this.$axios({
        url: baseUrl + '/productCompany/Top',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.contractList.contractData = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },

    // 查看发票详情
    getInvoiceDetail (row) {
      this.invoice.modal = true
      this.invoiceModal.accountName = row.accountName
      this.invoiceModal.taxpayerCard = row.taxpayerCard
      this.invoiceModal.openingBankCard = row.openingBankCard
      this.invoiceModal.openingBank = row.openingBank
      this.invoiceModal.billingAddress = row.billingAddress
      this.invoiceModal.telephone = row.telephone
    }
  }
}
</script>

<style lang="less">
#invoiceMoal {
    .rowPadding {
        padding: 20px;
    }

    .title {
        text-align: right;
    }
}
#hideAll input{
    color:#515a6e;
    border: none;
    background: white;
    font-size: 14px;
    margin-top: -2px;
    cursor: auto;
}
#hideAll i{
    display: none
}
#hideAll .ivu-select-dropdown{
    display: none
}
</style>
<style lang="less" scoped>
.productCompany {
    font-size: 14px;

    .detailContent {
        margin-top: 30px;

        .content {
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
