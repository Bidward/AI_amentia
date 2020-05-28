<template>
<!--新增渠道公司 联系人列表组件-->
<div class="detailContent">
    <Row class="rowPadding">
        <Col span="12" offset="3" class="cardTitle">联系人列表</Col>
    </Row>
    <Row class="rowPadding">
        <Col span="16" offset="4">
        <span class="addContractIcon"> +</span><span class="addContract" @click="openModal">新增联系人</span>
        <Table border id="contractTable" :columns="contractHeader" :data="contractData">
            <template slot-scope="{ row, index }" slot="action">
                <Button v-if="$route.name !== 'addProduct'" type="primary" size="small" style="margin-right: 5px" @click="edit(row,index)">编辑</Button>
                <Button type="error" v-if="contractData.length>1" size="small" @click="deleteRow(row,index)">删除</Button>
            </template>
        </Table>
        </Col>
    </Row>
    <Modal :loading="loading" :mask-closable="false" id="addContract" @on-ok="saveToTable('addContract')" v-model="addContractModal" :title="modalTitle">
        <!--联系人 联系电话-->
        <Form ref="addContract" :model="addContract" :rules="ruleAddContract">
            <Row class="rowPadding" style="margin-bottom:0px">
                <Col span="4" offset="1" class="title">
                    <i class="require">*</i>联系人：
                </Col>
                <Col span="6">
                <FormItem prop="contactsName">
                    <Input v-model="addContract.contactsName" placeholder="请输入联系人" clearable filterable></Input>
                </FormItem>
                </Col>

                <Col span="4" class="title">
                <i class="require">*</i>联系电话：
                </Col>
                <Col span="6">
                    <FormItem prop="telephone">
                        <Input v-model="addContract.telephone" placeholder="请输入联系电话" clearable filterable></Input>
                    </FormItem>
                </Col>
            </Row>
        </Form>

        <!--QQ 微信-->
        <Row class="rowPadding">
            <Col span="4" offset="1" class="title">
            QQ：
            </Col>
            <Col span="6">
            <Input v-model="addContract.qq" placeholder="请输入QQ" clearable filterable></Input>
            </Col>

            <Col span="4" class="title">
            微信：
            </Col>
            <Col span="6">
            <Input v-model="addContract.wechat" placeholder="请输入微信" clearable filterable></Input>
            </Col>
        </Row>

        <!--邮箱 公司职位-->
        <Row class="rowPadding">
            <Col span="4" offset="1" class="title">
            邮箱：
            </Col>
            <Col span="6">
            <Input v-model="addContract.email" placeholder="请输入邮箱" clearable filterable></Input>
            </Col>

            <Col span="4" class="title">
            公司职位：
            </Col>
            <Col span="6">
            <Input v-model="addContract.contactsPosition" placeholder="请输入公司职位" clearable filterable></Input>
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
  name: 'addContract',
  props: {
    contractData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      myContractData: this.contractData, // 创建props属性contractData的副本
      deletModal: false,
      modalTitle: '',
      loading: true, // 有必填项未填写时不关闭弹窗
      // 联系人列表
      addContractModal: false, // 新增联系人
      // 联系人表头
      contractHeader: [{
        title: '渠道联系人',
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
        width: 140,
        align: 'center'
      }
      ],
      // contractData: [], // 联系人数据
      // 新增联系人弹窗
      addContract: {
        contactsName: '', // 联系人
        telephone: '', // 联系电话
        qq: '', // qq
        wechat: '', // 微信
        email: '', // 邮箱
        contactsPosition: '', // 职位
        contractId: ''
      },
      ruleAddContract: {
        contactsName: [{ required: true, message: '联系人是必填项哦' }],
        telephone: [{ required: true, message: '联系电话是必填项哦' }]
      }
    }
  },
  watch: {
    contractData (data) {
      this.myContractData = data// 监听外部对props属性contractData的变更 ，同步到组件内部的data属性myContractData中
    },
    myContractData (data) {
      this.$emit('getContractMsg', data)// 组件内对myContractData变更后向外部发送事件通知
    }
  },
  methods: {
    // 打开弹窗 同时清空
    openModal () {
      this.modalTitle = '新增联系人'
      this.addContractModal = true
      let _self = this.addContract
      _self.contactsName = ''
      _self.telephone = ''
      _self.qq = ''
      _self.wechat = ''
      _self.email = ''
      _self.contactsPosition = ''
    },
    // 数据保存到表格里
    saveToTable (addContract) {
      if (this.modalTitle === '新增联系人') {
        this.$refs.addContract.validate((valid) => {
          if (valid) {
            this.addContractModal = false
            let _self = this.addContract
            // 没有productChannelId说明是新增产品的新增联系人 前端自己保存数据到表格中
            if (this.$route.query.productChannelId === undefined) {
              this.myContractData.push({
                contactsName: _self.contactsName,
                telephone: _self.telephone,
                qq: _self.qq,
                wechat: _self.wechat,
                email: _self.email,
                contactsPosition: _self.contactsPosition
              })
            } else { // 有productChannelId 说明是编辑产品的新增联系人 后端保存数据
              this.myContractData.push({
                contactsName: _self.contactsName,
                telephone: _self.telephone,
                qq: _self.qq,
                wechat: _self.wechat,
                email: _self.email,
                contactsPosition: _self.contactsPosition
              })
              let sendData = {
                type: '2',
                productChannelId: this.$route.query.productChannelId,
                contacts: this.myContractData
              }
              this.$axios({
                url: baseUrl + '/productCompany/insertContacts',
                method: 'post',
                data: sendData
              }).then(res => {
                if (res.data.code === 10000) {
                  this.myContractData = res.data.content
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
      } else if (this.modalTitle === '编辑联系人') {
        this.$refs.addContract.validate((valid) => {
          if (valid) {
            // 更新表格数据
            this.addContractModal = false
            let _self = this.addContract
            let sendData = {
              type: '2',
              productChannelId: this.$route.query.productChannelId,
              contactsName: _self.contactsName,
              telephone: _self.telephone,
              qq: _self.qq,
              wechat: _self.wechat,
              email: _self.email,
              contactsPosition: _self.contactsPosition,
              id: _self.contractId
            }
            this.$axios({
              url: baseUrl + '/productCompany/updateContacts',
              method: 'post',
              data: $qs.stringify(sendData)
            }).then(res => {
              if (res.data.code === 10000) {
                this.myContractData = res.data.content
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
    edit (row, index) {
      this.modalTitle = '编辑联系人'
      this.addContractModal = true
      let _self = this.addContract
      _self.contactsName = row.contactsName
      _self.telephone = row.telephone
      _self.qq = row.qq
      _self.wechat = row.wechat
      _self.email = row.email
      _self.contactsPosition = row.contactsPosition
      _self.contractId = row.id
    },
    deleteRow (row, index) {
      // 新增的删除联系人信息 前端自己删
      if (this.$route.query.productChannelId === undefined || this.$route.query.productChannelId === undefined) {
        this.myContractData.splice(index, 1)
        this.$Message.info('删除成功')
      } else {
        // 编辑的删除联系人信息 后端来删
        this.deletModal = true
        this.addContract.contractId = row.id
      }
    },
    deleteData () {
      let _self = this.addContract
      let sendData = {
        type: '2',
        productChannelId: this.$route.query.productChannelId,
        id: _self.contractId
      }
      this.$axios({
        url: baseUrl + '/productCompany/deleteContacts',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.myContractData = res.data.content
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
#contractTable {
    .ivu-table-header .ivu-table-cell span {
        color: #515a6e !important;
    }

}
</style>
