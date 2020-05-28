<template>
<!--开票信息组件-->
<div class="detailContent">
    <Row class="rowPadding">
        <Col span="12" offset="3" class="cardTitle">开票信息</Col>
    </Row>
    <Row class="rowPadding">
        <Col span="16" offset="4">
            <span class="addContractIcon" > +</span><span class="addContract" @click="openModal()">新增开票信息</span>
            <Table id="invoiceTable" border :columns="invoicetHeader" :data="invoiceData">
                 <template slot-scope="{ row, index }" slot="action">
                    <Button type="primary" v-if="$route.name === 'editProduct' || $route.name === 'editChannel' || $route.name === 'twoEditProduct'"  size="small" style="margin-right: 5px" @click="edit(row,index)">编辑</Button>
                    <Button type="primary" v-if="$route.name === 'addChannle' || $route.name === 'addProduct'"  size="small" style="margin-right: 5px" @click="geDetail(row,index)">详情</Button>
                    <Button type="error"  size="small" style="margin-right: 5px" @click="deleteRow(row,index)">删除</Button>
                </template>
            </Table>
        </Col>
    </Row>
    <Modal :mask-closable="false" id="addContract" :loading="loading" v-model="addInvoiceDataModal" @on-ok="saveToTable('invoiceModal')" :title="modalTitle">
        <!--开户名 纳税人识别号-->
        <Form ref="invoiceModal" :model="invoiceModal" :rules="ruleInvoiceModal">
        <Row class="rowPadding">
            <Col span="4" class="title">
                <i class="require">*</i>开户名：
            </Col>
            <Col span="6">
                <FormItem prop="accountName">
                    <Input v-model="invoiceModal.accountName" placeholder="请输入开户名" clearable filterable></Input>
                </FormItem>
            </Col>

            <Col span="4" class="title">
                <i class="require">*</i>纳税人识别号：
            </Col>
            <Col span="7">
                <FormItem prop="taxpayerCard">
                    <Input v-model="invoiceModal.taxpayerCard" placeholder="请输入纳税人识别号" clearable filterable></Input>
                </FormItem>
            </Col>
        </Row>
        <!--开户行账号 开户行-->
        <Row class="rowPadding">
            <Col span="4"  class="title">
                <i class="require">*</i>开户行账号：
            </Col>
            <Col span="6">
                <FormItem prop="openingBankCard">
                    <Input v-model="invoiceModal.openingBankCard" placeholder="请输入开户行账号" clearable filterable ></Input>
                </FormItem>
            </Col>

            <Col span="4" class="title">
                <i class="require">*</i>开户行：
            </Col>
            <Col span="7">
                <FormItem prop="openingBank">
                    <!-- <Select v-model="invoiceModal.firstOpeningBank" clearable filterable style="width:100px">
                        <Option v-for="(item,index) in invoiceModal.allBankNameList" :value="item" :key="index">{{item}}</Option>
                    </Select> -->
                    <Input  style="width:220px" v-model="invoiceModal.openingBank" placeholder="请输入银行名称" clearable filterable></Input>
                </FormItem>
            </Col>
        </Row>
        <!--开票地址 开票电话-->
        <Row class="rowPadding">
            <Col span="4" class="title">
                <i class="require">*</i>开票地址：
            </Col>
            <Col span="6">
                <FormItem prop="billingAddress">
                    <Input v-model="invoiceModal.billingAddress" placeholder="请输入开票地址" clearable filterable></Input>
                </FormItem>
            </Col>

            <Col span="4" class="title">
                <i class="require">*</i>开票电话：
            </Col>
            <Col span="7">
                <FormItem prop="telephone">
                    <Input v-model="invoiceModal.telephone" placeholder="请输入开票电话" clearable filterable></Input>
                </FormItem>
            </Col>
        </Row>
        </Form>
    </Modal>
    <Modal :mask-closable="false"  v-model="detailInvoiceDataModal" cancel-text=" "  ok-text="关闭" title="详情">
        <!--开户名 纳税人识别号-->
        <Row class="rowPadding" style="margin-bottom: 20px;">
            <Col span="4" offset="1" class="title">
               开户名：
            </Col>
            <Col span="6" style="margin-top:6px">
                <p>{{invoiceModal.accountName}}</p>
            </Col>

            <Col span="5" class="title">
               纳税人识别号：
            </Col>
            <Col span="7" style="margin-top:6px">
                <p>{{invoiceModal.taxpayerCard}}</p>
            </Col>
        </Row>
        <!--开户行账号 开户行-->
        <Row class="rowPadding"  style="margin-bottom: 20px;">
            <Col span="4" offset="1" class="title">
               开户行账号：
            </Col>
            <Col span="6" style="margin-top:6px">
                <p>{{invoiceModal.openingBankCard}}</p>
            </Col>

            <Col span="5" class="title">
               开户行：
            </Col>
            <Col span="7" style="margin-top:6px">
                <p>{{invoiceModal.openingBank}}</p>
            </Col>
        </Row>
        <!--开票地址 开票电话-->
        <Row class="rowPadding"  style="margin-bottom: 20px;">
            <Col span="4" offset="1" class="title">
               开票地址：
            </Col>
            <Col span="6">
                <p>{{invoiceModal.billingAddress}}</p>
            </Col>

            <Col span="5" class="title">
               开票电话：
            </Col>
            <Col span="7" style="margin-top:6px">
                <p>{{invoiceModal.telephone}}</p>
            </Col>
        </Row>
    </Modal>
    <!--确定删除对话框-->
    <Modal v-model="deletModal" title="删除"  ok-text="确定" cancel-text=" " @on-ok="deleteData()">
        <p>确定删除吗？</p>
    </Modal>
</div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
export default {
  name: 'invoiceInfo',
  props: {
    invoiceData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      myInvoiceData: this.invoiceData, // 创建props属性invoiceData的副本
      modalTitle: '', // 新增 编辑的弹框title
      deletModal: false, // 删除弹窗
      loading: true, // 有必填项未填写时不关闭弹窗
      // 开票信息
      addInvoiceDataModal: false, // 添加开票信息弹窗
      detailInvoiceDataModal: false, // 详细信息弹窗
      // 表头
      invoicetHeader: [
        {
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
          width: 140,
          align: 'center'
        }
      ],
      // 新增发票人数据
      // invoiceData: []
      // 新增开票信息弹窗
      invoiceModal: {
        allBankName: '', // 银行名
        allBankNameList: [], // 银行名列表
        accountName: '', // 开户名
        taxpayerCard: '', // 纳税人识别号
        openingBankCard: '', // 开户行账号
        openingBank: '', // 开户行支行
        billingAddress: '', // 开票地址
        telephone: '', // 开票电话
        invoiceId: ''// 增加的发票id
      },
      ruleInvoiceModal: {
        accountName: [{ required: true, message: '开户名是必填项哦' }],
        taxpayerCard: [{ required: true, message: '纳税人识别号是必填项哦' }],
        openingBankCard: [{ required: true, message: '开户行账号是必填项哦' }],
        openingBank: [{ required: true, message: '开户行是必填项哦' }],
        billingAddress: [{ required: true, message: '开票地址是必填项哦' }],
        telephone: [{ required: true, message: '开票电话是必填项哦' }]
      }
    }
  },
  watch: {
    invoiceData (data) {
      this.myInvoiceData = data// 监听外部对props属性invoiceData的变更 ，同步到组件内部的data属性myInvoiceData中
    },
    myInvoiceData (data) {
      this.$emit('getInvoiceMsg', data)// 组件内对myInvoiceData变更后向外部发送事件通知
    }
  },
  mounted () {
    this.getAllBankName()
  },
  methods: {
    // 获取所有银行名称
    getAllBankName () {
      this.$axios({
        url: baseUrl + '/productChannel/getAllBankName',
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          this.invoiceModal.allBankNameList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 打开弹窗 同时清空
    openModal () {
      this.modalTitle = '新增开票信息'
      this.addInvoiceDataModal = true
      let _self = this.invoiceModal
      _self.accountName = ''
      _self.taxpayerCard = ''
      _self.openingBankCard = ''
      _self.openingBank = ''
      _self.billingAddress = ''
      _self.telephone = ''
      _self.allBankName = ''
    },
    // 保存数据到表格
    saveToTable (invoiceModal) {
      if (this.modalTitle === '新增开票信息') {
        this.$refs.invoiceModal.validate((valid) => {
          if (valid) {
            this.addInvoiceDataModal = false
            let _self = this.invoiceModal
            if (this.$route.query.productCompanyId === undefined) {
              this.myInvoiceData.push({
                accountName: _self.accountName,
                taxpayerCard: _self.taxpayerCard,
                openingBank: _self.openingBank,
                openingBankCard: _self.openingBankCard,
                telephone: _self.telephone,
                billingAddress: _self.billingAddress
              })
            } else {
              this.myInvoiceData.push({
                accountName: _self.accountName,
                taxpayerCard: _self.taxpayerCard,
                openingBank: _self.openingBank,
                openingBankCard: _self.openingBankCard,
                telephone: _self.telephone,
                billingAddress: _self.billingAddress
              })
              let sendData = {
                type: '1',
                productCompanyId: this.$route.query.productCompanyId,
                invoice: this.myInvoiceData
              }
              this.$axios({
                url: baseUrl + '/productCompany/insertInvoice',
                method: 'post',
                data: sendData
              }).then(res => {
                if (res.data.code === 10000) {
                  this.myInvoiceData = res.data.content
                } else {
                  this.$Message.error(res.data.msg)
                }
              }).catch(err => {
                console.error(err)
              })
            }
          } else {
            this.loading = false
            this.$nextTick(() => {
              this.loading = true
            })
          }
        })
      } else if (this.modalTitle === '编辑开票信息') {
        this.$refs.invoiceModal.validate((valid) => {
          if (valid) {
            this.addInvoiceDataModal = false
            let _self = this.invoiceModal
            let sendData = {
              type: '1',
              productCompanyId: this.$route.query.productCompanyId,
              accountName: _self.accountName,
              taxpayerCard: _self.taxpayerCard,
              openingBank: _self.openingBank,
              openingBankCard: _self.openingBankCard,
              telephone: _self.telephone,
              billingAddress: _self.billingAddress,
              invoiceId: _self.invoiceId
            }
            this.$axios({
              url: baseUrl + '/productCompany/updateInvoice',
              method: 'post',
              data: $qs.stringify(sendData)
            }).then(res => {
              if (res.data.code === 10000) {
                this.myInvoiceData = res.data.content
              } else {
                this.$Message.error(res.data.msg)
              }
            }).catch(err => {
              console.error(err)
            })
          } else {
            this.loading = false
            this.$nextTick(() => {
              this.loading = true
            })
          }
        })
      }
    },
    // 编辑
    edit (row, index) {
      this.modalTitle = '编辑开票信息'
      this.addInvoiceDataModal = true
      let _self = this.invoiceModal
      _self.accountName = row.accountName
      _self.openingBank = row.openingBank
      _self.openingBankCard = row.openingBankCard
      _self.taxpayerCard = row.taxpayerCard
      _self.billingAddress = row.billingAddress
      _self.telephone = row.telephone
      _self.invoiceId = row.invoiceId
    },
    // 详情
    geDetail (row, index) {
      this.detailInvoiceDataModal = true
      let _self = this.invoiceModal
      _self.accountName = row.accountName
      _self.openingBank = row.openingBank
      _self.openingBankCard = row.openingBankCard
      _self.taxpayerCard = row.taxpayerCard
      _self.billingAddress = row.billingAddress
      _self.telephone = row.telephone
      _self.invoiceId = row.invoiceId
    },
    // 删除开票信息
    deleteRow (row, index) {
      // 新增的删除开票信息 前端自己删
      if (this.$route.query.productCompanyId === undefined || this.$route.query.productChannelId === undefined) {
        this.myInvoiceData.splice(index, 1)
        this.$Message.info('删除成功')
      } else {
        // 编辑的删除开票信息  发送给后端来删
        this.deletModal = true
        this.invoiceModal.invoiceId = row.invoiceId
      }
    },
    // 删除数据
    deleteData () {
      let _self = this.invoiceModal
      let sendData = {
        type: '1',
        productCompanyId: this.$route.query.productCompanyId,
        invoiceId: _self.invoiceId
      }
      this.$axios({
        url: baseUrl + '/productCompany/deleteInvoice',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.myInvoiceData = res.data.content
          this.$Message.info('删除成功')
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    }
  }
}
</script>

<style lang="less">
.title{
    text-align: right;
    line-height: 30px;
    margin-right: 10px;
}
#invoiceTable {
    .ivu-table-header .ivu-table-cell span{
        color: #515a6e !important;
    }
}
#addContract{
    .ivu-select-selection-focused,
    .ivu-select-selection:hover {
        border-color: #19aa8a;
    }
    .ivu-select-item-selected, .ivu-select-item-selected:hover {
        color: #19aa8a;
    }
}
</style>
