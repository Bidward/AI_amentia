<template>
    <!--联系人列表组件-->
    <div class="detailContent">
        <Row class="rowPadding">
            <Col span="16" offset="4">
                <div class="addContract">
                    <span>+</span>
                    <span class="addContract" @click="openModal">新增联系人</span>
                    <span class="info">建立联系必填项</span>
                </div>
                <Table border id="contractTable" :columns="contractHeader" :data="contractData">
                    <template slot-scope="{ row, index }" slot="action">
                        <Button
                            type="primary"
                            size="small"
                            style="margin-right: 5px"
                            @click="edit(row,index)"
                        >编辑</Button>
                        <!-- <Button type="primary" v-if="$route.name === 'addChannle' || $route.name === 'addProduct'"  size="small" style="margin-right: 5px" @click="geDetail(row,index)">详情</Button> -->
                        <Button type="error" size="small" @click="deleteRow(row,index)">删除</Button>
                    </template>
                </Table>
            </Col>
        </Row>
        <Modal
            :mask-closable="false"
            :loading="loading"
            id="addContract"
            @on-ok="saveToTable('addContract')"
            v-model="addContractModal"
            :title="modalTitle"
            width="800px"
        >
            <!--联系人 联系电话-->
            <Form ref="addContract" :model="addContract" :rules="ruleAddContract">
                <Row class="rowPadding" style="margin-bottom:0px">
                    <Col span="4" offset="1" class="title">
                        <i class="require">*</i>联系人：
                    </Col>
                    <Col span="6">
                        <FormItem prop="contactName">
                            <Input
                                v-model="addContract.contactName"
                                placeholder="请输入联系人"
                                clearable
                                filterable
                                maxlength="20"
                                show-word-limit
                            ></Input>
                        </FormItem>
                    </Col>

                    <Col span="4" class="title">联系电话：</Col>
                    <Col span="6">
                        <FormItem prop="contactPhone">
                            <Input
                                v-model="addContract.contactPhone"
                                placeholder="请输入联系电话"
                                clearable
                                filterable
                                maxlength="20"
                                show-word-limit
                            ></Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>

            <!--QQ 微信-->
            <Row class="rowPadding">
                <Col span="4" offset="1" class="title">QQ：</Col>
                <Col span="6">
                    <Input v-model="addContract.contactQq" placeholder="请输入QQ" clearable filterable maxlength="20" show-word-limit ></Input>
                </Col>

                <Col span="4" class="title">微信：</Col>
                <Col span="6">
                    <Input
                        v-model="addContract.contactWechat"
                        placeholder="请输入微信"
                        clearable
                        filterable
                        maxlength="50"
                        show-word-limit
                    ></Input>
                </Col>
            </Row>

            <!--邮箱 公司职位-->
            <Row class="rowPadding">
                <Col span="4" offset="1" class="title">邮箱：</Col>
                <Col span="6">
                    <Input
                        v-model="addContract.contactEmail"
                        placeholder="请输入邮箱"
                        clearable
                        filterable
                        maxlength="50"
                        show-word-limit
                    ></Input>
                </Col>

                <Col span="4" class="title">公司职位：</Col>
                <Col span="6">
                    <Input
                        v-model="addContract.contactPosition"
                        placeholder="请输入公司职位"
                        clearable
                        filterable
                        maxlength="100"
                        show-word-limit
                    ></Input>
                </Col>
            </Row>
        </Modal>
        <Modal
            :mask-closable="false"
            v-model="detailContractModal"
            title="详情"
            cancel-text=" "
            ok-text="关闭"
            width="800px"
        >
            <!--联系人 联系电话-->
            <Row class="rowPadding">
                <Col span="4" offset="2" class="title">联系人：</Col>
                <Col span="6" style="margin-top:6px">
                    <p>{{addContract.contactName}}</p>
                </Col>

                <Col span="4" class="title">联系电话：</Col>
                <Col span="6" style="margin-top:6px">
                    <p>{{addContract.contactPhone}}</p>
                </Col>
            </Row>

            <!--qq 微信-->
            <Row class="rowPadding">
                <Col span="4" offset="2" class="title">QQ：</Col>
                <Col span="6" style="margin-top:6px">
                    <p>{{addContract.contactQq}}</p>
                </Col>

                <Col span="4" class="title">微信：</Col>
                <Col span="6" style="margin-top:6px">
                    <p>{{addContract.contactWechat}}</p>
                </Col>
            </Row>
            <!--邮箱 公司职位-->
            <Row class="rowPadding">
                <Col span="4" offset="2" class="title">邮箱：</Col>
                <Col span="6" style="margin-top:6px">
                    <p>{{addContract.contactEmail}}</p>
                </Col>

                <Col span="4" class="title">公司职位：</Col>
                <Col span="6" style="margin-top:6px">
                    <p>{{addContract.contactPosition}}</p>
                </Col>
            </Row>
        </Modal>
    </div>
</template>

<script>
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
      detailContractModal: false, // 详情联系人
      // 联系人表头
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
        contactName: '', // 联系人
        contactPhone: '', // 联系电话
        contactQq: '', // contactQq
        contactWechat: '', // 微信
        contactEmail: '', // 邮箱
        contactPosition: '', // 职位
        contractId: ''
      },
      ruleAddContract: {
        contactName: [{ required: true, message: '联系人是必填项哦' }]
        // contactPhone: [{required: true, message: '联系电话是必填项哦'}]
      },
      selected: ''
    }
  },
  watch: {
    contractData (data) {
      this.myContractData = data // 监听外部对props属性contractData的变更 ，同步到组件内部的data属性myContractData中
    },
    myContractData (data) {
      this.$emit('getContractMsg', data) // 组件内对myContractData变更后向外部发送事件通知
      // eventBus.$emit('on-tel', data)
      bus.$emit('on-tel', data)
    }
  },
  methods: {
    // 打开弹窗 同时清空
    openModal () {
      this.modalTitle = '新增联系人'
      this.addContractModal = true
      let _self = this.addContract
      _self.contactName = ''
      _self.contactPhone = ''
      _self.contactQq = ''
      _self.contactWechat = ''
      _self.contactEmail = ''
      _self.contactPosition = ''
    },
    // 数据保存到表格里
    saveToTable (addContract) {
      if (this.modalTitle === '新增联系人') {
        if (
          this.addContract.contactEmail === '' &&
                    this.addContract.contactQq === '' &&
                    this.addContract.contactWechat === '' &&
                    this.addContract.contactPhone === ''
        ) {
          this.addContractModal = false
          this.$Message.error('联系方式必填一项')
          return
        }
        this.$refs.addContract.validate(valid => {
          if (valid) {
            this.addContractModal = false
            let _self = this.addContract
            // 没有productCompanyId说明是新增产品的新增联系人 前端自己保存数据到表格中
            if (this.$route.query.productCompanyId === undefined) {
              this.myContractData.push({
                contactName: _self.contactName,
                contactPhone: _self.contactPhone,
                contactQq: _self.contactQq,
                contactWechat: _self.contactWechat,
                contactEmail: _self.contactEmail,
                contactPosition: _self.contactPosition
              })
              //   console.log(this.myContractData)
            } else {
              // 有productCompanyId 说明是编辑产品的新增联系人 后端保存数据
              this.myContractData.push({
                contactName: _self.contactName,
                contactPhone: _self.contactPhone,
                contactQq: _self.contactQq,
                contactWechat: _self.contactWechat,
                contactEmail: _self.contactEmail,
                contactPosition: _self.contactPosition
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
        this.$refs.addContract.validate(valid => {
          if (valid) {
            // 更新表格数据
            this.addContractModal = false
            let _self = this.addContract
            this.$set(this.myContractData, this.selected, _self)
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
      this.selected = index
      this.addContract = JSON.parse(JSON.stringify(this.myContractData[index]))// 深拷贝，防止同步更新
    },
    deleteRow (row, index) {
      // 新增的删除联系人信息 前端自己删
      if (
        this.$route.query.productCompanyId === undefined ||
                this.$route.query.productChannelId === undefined
      ) {
        this.myContractData.splice(index, 1)
        this.$Message.info('删除成功')
      }
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
.addContract {
    color: #19aa8d;
    cursor: pointer;
    margin-bottom: 5px;
}
.info {
    color: #ccc;
    margin-left: 20px;
}
#contractTable {
    .ivu-table-header .ivu-table-cell span {
        color: #515a6e !important;
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
</style>
