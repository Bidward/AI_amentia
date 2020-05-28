<template>
<div>
    <div class="section">
        <div class="title">
            <Icon type="md-school" style="color: #19aa8d;margin-right: 10px;" size="20" />
            <span class="title-name">离职信息</span>
            <div class="wrapper" v-if="isEdit">
                <Button class="btn" @click="handleCancle()">取消</Button>
                <Button type="primary" @click="saveUserInfo()">保存</Button>
            </div>
            <div class="wrapper" v-else>
                <Button v-if="!this.$route.query.type && permiss.update" class="wrapper-btn" type="primary" @click="handleEdit()">编辑</Button>
            </div>
        </div>
        <div class="content" v-if="isEdit">
            <Form ref="formValidate" :model="accountInfo" :rules="ruleValidate" :label-width="110">
                <!--
                <Row>
                    <Col span="3" offset="2">
                    <div class="main-title">离职信息</div>
                    </Col>
                </Row>
                -->
                <Row>
                    <Col span="6" offset="5">
                    <FormItem label="姓名：" prop="nickname">
                        <Input disabled v-model="accountInfo.nickname"></Input>
                    </FormItem>
                    </Col>
                    <Col span="6" offset="1">
                    <FormItem label="申请日期：" prop="applyDate">
                        <DatePicker v-model="accountInfo.applyDate" format="yyyy-MM-dd" style="width:100%"></DatePicker>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="6" offset="5">
                    <FormItem label="离职类型：" prop="leaveType">
                        <Select v-model="accountInfo.leaveType" placeholder="请选择">
                            <Option v-for="(item,index) in leaveTypeList" :key="index" :value='item.id'>{{item.title}}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="6" offset="1">
                    <FormItem label="离职原因：" prop="leaveReason">
                        <Input v-model="accountInfo.leaveReason" @on-focus="chooseLeaveReasons()" clearable></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="6" offset="5">
                    <FormItem label="离职日期：" prop="leaveDate">
                        <!--
                          <Tooltip content="将在离职日期的次日进入离职列表" slot="label">
                              离职日期
                              <Icon type="md-help-circle" />:
                          </Tooltip>
                        -->
                        <DatePicker v-model="accountInfo.leaveDate" format="yyyy-MM-dd" style="width:100%"></DatePicker>
                    </FormItem>
                    </Col>
                    <Col span="6" offset="1">
                    <FormItem label="薪资结算日期：" prop="salaryDate">
                        <DatePicker v-model="accountInfo.salaryDate" format="yyyy-MM-dd" style="width:100%"></DatePicker>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="6" offset="5">
                    <FormItem label="备注：" prop="note">
                        <Input v-model="accountInfo.note" type="textarea" clearable></Input>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <Row>
                <Col span="1" offset="10">
                <Button @click="handleCancle()">取消</Button>
                </Col>
                <Col span="6" offset="1">
                <Button type="primary" @click="saveUserInfo()">保存</Button>
                </Col>
            </Row>
        </div>
        <div class="content" v-else>
            <Row class="rowPadding">
                <Col span="3" offset="6" class="textAligh">姓名：</Col>
                <Col span="4">
                <p>{{accountInfo.nickname || '/'}}</p>
                </Col>
                <Col span="3" class="textAligh">申请日期：</Col>
                <Col span="4">
                <p>{{accountInfo.applyDate || '/'}}</p>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="3" offset="6" class="textAligh">离职类型：</Col>
                <Col span="4">
                <p>{{accountInfo.leaveTypeName || '/'}}</p>
                </Col>
                <Col span="3" class="textAligh">离职原因：</Col>
                <Col span="4">
                <p>{{accountInfo.leaveReason || '/'}}</p>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="3" offset="6" class="textAligh">离职日期：</Col>
                <Col span="4">
                <p>{{accountInfo.leaveDate || '/'}}</p>
                </Col>
                <Col span="3" class="textAligh">薪资结算日期：</Col>
                <Col span="4">
                <p>{{accountInfo.salaryDate || '/'}}</p>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="3" offset="6" class="textAligh">备注：</Col>
                <Col span="4">
                <p>{{accountInfo.note || '/'}}</p>
                </Col>
            </Row>
        </div>
    </div>
    <Modal v-model="leaveReasonsModal" title="选择离职原因" @on-ok="getReason()">
        <CheckboxGroup v-model="resonGroup">
            <Checkbox label="薪资福利"></Checkbox>
            <Checkbox label="工作时间"></Checkbox>
            <Checkbox label="工作量"></Checkbox>
            <Checkbox label="工作环境"></Checkbox>
            <Checkbox label="培训"></Checkbox>
            <Checkbox label="晋升"></Checkbox>
            <Checkbox label="健康因素"></Checkbox>
            <Checkbox label="家庭因素"></Checkbox>
            <Checkbox label="与领导的关系"></Checkbox>
            <Checkbox label="与其他人的人际关系"></Checkbox>
            <Input v-model="otherReason" type="textarea" placeholder="请输入其他原因"></Input>
        </CheckboxGroup>
    </Modal>
</div>
</template>

<script>
import {
  baseUrl
} from '@/api/base.js'
import mixins from '../mixins'
import moment from 'moment'
export default {
  name: 'showLeaveInfo',
  mixins: [mixins],
  data () {
    return {
      isEdit: false,
      isSaved: false,
      initBaseInfo: {},
      resonGroup: [],
      otherReason: '',
      leaveReasonsModal: false,
      accountInfo: {
        nickname: '', // 姓名
        applyDate: '', // 申请日期
        leaveTypeName: '', // 离职类型
        leaveReason: '', // 离职原因
        leaveDate: '', // 离职日期
        leaveType: null,
        salaryDate: '', // 薪资结算日期
        note: '' // 备注
      },
      leaveTypeList: [{
        id: 1,
        title: '主动'
      }, {
        id: 2,
        title: '被动'
      }, {
        id: 3,
        title: '其他'
      }],
      ruleValidate: {
        nickname: [{
          required: true,
          message: '必填项',
          trigger: 'blur'
        }],
        applyDate: [{
          required: true
        }],
        leaveTypeName: [{
          required: true
        }],
        leaveType: [{
          required: true,
          message: '必填项',
          type: 'number',
          trigger: 'blur'
        }],
        leaveReason: [{
          required: true,
          message: '必填项',
          trigger: 'blur'
        }],
        leaveDate: [{
          required: true
        }]
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.$axios({
        url: baseUrl + '/user/leaveDetail ',
        data: $qs.stringify({
          id: this.$route.query.id
        }),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.accountInfo = resp.data.content
            this.initBaseInfo = JSON.stringify(this.accountInfo)
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    getReason () {
      this.accountInfo.leaveReason = this.resonGroup.concat(this.otherReason).join(',')
    },
    chooseLeaveReasons () {
      if (this.accountInfo.leaveReason === '') {
        this.resonGroup = []
        this.otherReason = ''
      }
      this.leaveReasonsModal = true
    },

    // 保存
    saveUserInfo () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          let _self = this.accountInfo
          let sendData = {
            user: {
              id: this.$route.query.id,
              nickname: _self.nickname,
              applyDate: moment(_self.applyDate).format('YYYY-MM-DD'),
              leaveType: _self.leaveType,
              leaveReason: _self.leaveReason,
              leaveDate: moment(_self.leaveDate).format('YYYY-MM-DD'),
              positionId: _self.positionId,
              note: _self.note
            }
          }
          if (_self.salaryDate) {
            sendData.user.salaryDate = moment(_self.salaryDate).format('YYYY-MM-DD')
          }
          this.$axios({
            url: baseUrl + '/user/editLeavePerson',
            data: sendData,
            method: 'post'
          })
            .then(resp => {
              if (resp.data.code === 10000) {
                this.$Message.info(resp.data.msg)
                this.isSaved = true
                this.isEdit = false
                this.getData()
              } else {
                this.$Message.error(resp.data.msg)
              }
            })
            .catch(err => {
              console.log('err', err)
            })
        }
      })
    },
    // 判断页面数据是否有改动
    hasContentChanged () {
      return this.initBaseInfo !== JSON.stringify(this.accountInfo)
    },
    handleCancle () {
      let hasChange
      // 如果未保存，判断内容是否有变
      if (!this.isSaved) {
        hasChange = this.hasContentChanged()
      } else {
        hasChange = false
      }
      // 如果有变化，此时点击离开页面提醒保存
      if (hasChange) {
        this.$Modal.confirm({
          title: '取消编辑',
          content: '<p>还有未保存的内容，确认取消吗</p>',
          onOk: () => {
            this.isEdit = false
            this.getData()
          }
        })
      } else {
        this.isEdit = false
        this.accountInfo = JSON.parse(this.initBaseInfo)
      }
    },
    handleEdit () {
      this.isEdit = true
      this.getData()
    }
  }
}
</script>
<style>
  .section .ivu-col.ivu-col-span-4{
    font-size:14px;
  }
</style>
<style lang="less" scoped>
@import '~@/assets/style/variables.less';

.section {
    .title {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;

        .title-name {
            font-size: 18px;
        }

        .wrapper {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            margin-bottom: 3px;

            .btn {
                margin-right: 10px
            }
        }
    }

    .content {
         padding:63px;
        .main-title {
            border-left: 2px solid #19aa8d;
            padding-left: 10px;
            font-size: 13px;
            margin: 10px 0px 30px 0px;
        }

        .rowPadding {
            padding: 15px;
            font-size: 12px;
            color: #515a6e;
        }

        .textAligh {
            font-size:14px;
            text-align: right;
        }
    }
}
</style>
