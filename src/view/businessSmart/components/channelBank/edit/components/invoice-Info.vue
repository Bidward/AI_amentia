<template>
    <!--开票信息组件-->
    <div class="detailContent">
        <Row class="rowPadding">
            <Col span="16" offset="4">
                <span class="addContractIcon">+</span>
                <span class="addContract" @click="openModal()">新增开票信息</span>
                <span class="info">建立联系必填阶段</span>
                <Table
                    id="invoiceTable"
                    border
                    :columns="invoicetHeader"
                    :data="invoiceData"
                    :class="[!red?'red':'']"
                >
                    <template slot-scope="{ row, index }" slot="action">
                        <Button
                            type="primary"
                            size="small"
                            style="margin-right: 5px"
                            @click="edit(row,index)"
                        >编辑</Button>
                        <!-- <Button type="primary" v-if="$route.name === 'addChannle' || $route.name === 'addProduct'"  size="small" style="margin-right: 5px" @click="geDetail(row,index)">详情</Button> -->
                        <Button
                            type="error"
                            size="small"
                            style="margin-right: 5px"
                            @click="deleteRow(row,index)"
                        >删除</Button>
                    </template>
                </Table>
            </Col>
        </Row>
        <Modal
            :mask-closable="false"
            id="addContract"
            :loading="loading"
            v-model="addInvoiceDataModal"
            @on-ok="saveToTable('invoiceModal')"
            :title="modalTitle"
            width="800px"
        >
            <!--开户名 纳税人识别号-->
            <Form ref="invoiceModal" :model="invoiceModal" :rules="ruleInvoiceModal">
                <Row class="rowPadding">
                    <Col span="4" class="title">
                        <i class="require">*</i>开户名：
                    </Col>
                    <Col span="6">
                        <FormItem prop="receiptName">
                            <Input
                                v-model="invoiceModal.receiptName"
                                placeholder="请输入开户名"
                                clearable
                                filterable
                                maxlength="50"
                                show-word-limit
                            ></Input>
                        </FormItem>
                    </Col>

                    <Col span="4" class="title">
                        <i class="require">*</i>纳税人识别号：
                    </Col>
                    <Col span="7">
                        <FormItem prop="taxNumber">
                            <Input
                                v-model="invoiceModal.taxNumber"
                                placeholder="请输入纳税人识别号"
                                clearable
                                filterable
                                maxlength="50"
                                show-word-limit
                            ></Input>
                        </FormItem>
                    </Col>
                </Row>
                <!--开户行账号 开户行-->
                <Row class="rowPadding">
                    <Col span="4" class="title">
                        <i class="require">*</i>开户行账号：
                    </Col>
                    <Col span="6">
                        <FormItem prop="bankAccount">
                            <Input
                                v-model="invoiceModal.bankAccount"
                                placeholder="请输入开户行账号"
                                clearable
                                filterable
                                maxlength="50"
                                show-word-limit
                            ></Input>
                        </FormItem>
                    </Col>

                    <Col span="4" class="title">
                        <i class="require">*</i>开户行：
                    </Col>
                    <Col span="7">
                        <FormItem prop="receiptBank">
                            <Input
                                style="width:220px"
                                v-model="invoiceModal.receiptBank"
                                placeholder="请输入银行名称"
                                clearable
                                filterable
                                maxlength="50"
                                show-word-limit
                            ></Input>
                        </FormItem>
                    </Col>
                </Row>
                <!--开票地址 开票电话-->
                <!-- <Row class="rowPadding">
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
                </Row>-->
            </Form>
        </Modal>
        <Modal
            :mask-closable="false"
            v-model="detailInvoiceDataModal"
            cancel-text=" "
            ok-text="关闭"
            title="详情"
            width="800px"
        >
            <!--开户名 纳税人识别号-->
            <Row class="rowPadding" style="margin-bottom: 20px;">
                <Col span="4" offset="1" class="title">开户名：</Col>
                <Col span="6" style="margin-top:6px">
                    <p>{{invoiceModal.receiptName}}</p>
                </Col>

                <Col span="5" class="title">纳税人识别号：</Col>
                <Col span="7" style="margin-top:6px">
                    <p>{{invoiceModal.taxNumber}}</p>
                </Col>
            </Row>
            <!--开户行账号 开户行-->
            <Row class="rowPadding" style="margin-bottom: 20px;">
                <Col span="4" offset="1" class="title">开户行账号：</Col>
                <Col span="6" style="margin-top:6px">
                    <p>{{invoiceModal.bankAccount}}</p>
                </Col>

                <Col span="5" class="title">开户行：</Col>
                <Col span="7" style="margin-top:6px">
                    <p>{{invoiceModal.receiptBank}}</p>
                </Col>
            </Row>
            <!--开票地址 开票电话-->
            <Row class="rowPadding" style="margin-bottom: 20px;">
                <Col span="4" offset="1" class="title">开票地址：</Col>
                <Col span="6">
                    <p>{{invoiceModal.billingAddress}}</p>
                </Col>

                <Col span="5" class="title">开票电话：</Col>
                <Col span="7" style="margin-top:6px">
                    <p>{{invoiceModal.telephone}}</p>
                </Col>
            </Row>
        </Modal>
        <!--确定删除对话框-->
        <Modal v-model="deletModal" title="删除" ok-text="确定" cancel-text=" " @on-ok="deleteData()">
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
    },
    errorInfo: {
      type: Object,
      default () {
        return {}
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
        receiptName: '', // 开户名
        taxNumber: '', // 纳税人识别号
        bankAccount: '', // 开户行账号
        receiptBank: '', // 开户行支行
        billingAddress: '', // 开票地址
        telephone: '', // 开票电话
        invoiceId: '' // 增加的发票id
      },
      ruleInvoiceModal: {
        receiptName: [{ required: true, message: '开户名是必填项哦' }],
        taxNumber: [{ required: true, message: '纳税人识别号是必填项哦' }],
        bankAccount: [{ required: true, message: '开户行账号是必填项哦' }],
        receiptBank: [{ required: true, message: '开户行是必填项哦' }]
        // billingAddress: [{ required: true, message: '开票地址是必填项哦' }],
        // telephone: [{ required: true, message: '开票电话是必填项哦' }]
      },
      selected: '',
      red: true
    }
  },
  watch: {
    invoiceData (data) {
      this.myInvoiceData = data // 监听外部对props属性invoiceData的变更 ，同步到组件内部的data属性myInvoiceData中
    },
    myInvoiceData (data) {
      this.$emit('getInvoiceMsg', data) // 组件内对myInvoiceData变更后向外部发送事件通知
    },
    errorInfo: {
      handler (newVal) {
        this.red = newVal.receiptInfo || true
      },
      deep: true
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
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.invoiceModal.allBankNameList = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 打开弹窗 同时清空
    openModal () {
      this.modalTitle = '新增开票信息'
      this.addInvoiceDataModal = true
      let _self = this.invoiceModal
      _self.receiptName = ''
      _self.taxNumber = ''
      _self.bankAccount = ''
      _self.receiptBank = ''
      _self.billingAddress = ''
      _self.telephone = ''
      _self.allBankName = ''
    },
    // 保存数据到表格
    saveToTable (invoiceModal) {
      if (this.modalTitle === '新增开票信息') {
        this.$refs.invoiceModal.validate(valid => {
          if (valid) {
            this.addInvoiceDataModal = false
            let _self = this.invoiceModal
            if (this.$route.query.productCompanyId === undefined) {
              this.myInvoiceData.push({
                receiptName: _self.receiptName,
                taxNumber: _self.taxNumber,
                receiptBank: _self.receiptBank,
                bankAccount: _self.bankAccount,
                telephone: _self.telephone,
                billingAddress: _self.billingAddress
              })
            } else {
              this.myInvoiceData.push({
                receiptName: _self.receiptName,
                taxNumber: _self.taxNumber,
                receiptBank: _self.receiptBank,
                bankAccount: _self.bankAccount,
                telephone: _self.telephone,
                billingAddress: _self.billingAddress
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
        this.$refs.invoiceModal.validate(valid => {
          if (valid) {
            this.addInvoiceDataModal = false
            let _self = this.invoiceModal
            this.$set(this.myInvoiceData, this.selected, _self)
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
      this.selected = index
      this.invoiceModal = JSON.parse(
        JSON.stringify(this.myInvoiceData[index])
      ) // 深拷贝，防止同步更新
    },
    // 详情
    geDetail (row, index) {
      this.detailInvoiceDataModal = true
      let _self = this.invoiceModal
      _self.receiptName = row.receiptName
      _self.receiptBank = row.receiptBank
      _self.bankAccount = row.bankAccount
      _self.taxNumber = row.taxNumber
      _self.billingAddress = row.billingAddress
      _self.telephone = row.telephone
      _self.invoiceId = row.invoiceId
    },
    // 删除开票信息
    deleteRow (row, index) {
      // 新增的删除开票信息 前端自己删
      if (
        this.$route.query.productCompanyId === undefined ||
                this.$route.query.productChannelId === undefined
      ) {
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
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.myInvoiceData = res.data.content
            this.$Message.info('删除成功')
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.title {
    text-align: right;
    line-height: 30px;
    margin-right: 10px;
}
.addContractIcon,
.addContract {
    cursor: pointer;
    color: #19aa8a;
}
.info {
    color: #ccc;
    margin-left: 20px;
}
#invoiceTable {
    .ivu-table-header .ivu-table-cell span {
        color: #515a6e !important;
    }
}
#addContract {
    .ivu-select-selection-focused,
    .ivu-select-selection:hover {
        border-color: #19aa8a;
    }
    .ivu-select-item-selected,
    .ivu-select-item-selected:hover {
        color: #19aa8a;
    }
}
#addContract {
    .ivu-modal {
        width: 800px !important;
    }
    .title {
        text-align: right;
        line-height: 30px;
        margin-right: 10px;
    }
    .require {
        font-size: 17px;
        color: red;
        position: relative;
        top: 5px;
        right: 3px;
    }
    .rowPadding {
        margin-bottom: 20px;
    }
}
.red {
    border: 1px solid red;
}
</style>
