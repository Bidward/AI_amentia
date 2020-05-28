<template>
<div class="viewWrapper">
    <div class="content">
        <div class="header">
            <Button  @click="handleCloseTag()" size="small" style="width: 33px;height: 30px;">
              <Icon type="md-return-left" size="18"></Icon>
            </Button>
            <span style="margin:0 0 10px 10px">人员离职信息</span>
        </div>
        <div>
            <Form ref="formValidate" :model="accountInfo" :rules="ruleValidate" :label-width="110">
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
                            <Option value="1">主动</Option>
                            <Option value="2">被动</Option>
                            <Option value="3">其他</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="6" offset="1">
                    <FormItem label="离职原因：" prop="leaveReason">
                        <Input  v-model="accountInfo.leaveReason" @on-focus="chooseLeaveReasons()" clearable></Input>
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
                <Button @click="handleCloseTag()">取消</Button>
                </Col>
                <Col span="6" offset="1">
                <Button type="primary" @click="handleSaveUserInfo('formValidate')">保存</Button>
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
import moment from 'moment'
import mixins from '../mixins'
export default {
  name: 'leaveOffice',
  mixins: [mixins],
  data () {
    return {
      resonGroup: [],
      otherReason: '',
      leaveReasonsModal: false,
      accountInfo: {
        nickname: '', // 姓名
        applyDate: '', // 申请日期
        leaveType: '', // 离职类型
        leaveReason: '', // 离职原因
        leaveDate: '', // 离职日期
        salaryDate: '', // 薪资结算日期
        note: '' // 备注
      },
      ruleValidate: {
        // nickname: [{
        //     required: true,
        //     message: '必填项',
        //     trigger: 'blur'
        // }],
        applyDate: [{
          required: true,
          message: '必填项',
          type: 'date',
          trigger: 'blur'
        }],
        leaveType: [{
          required: true,
          message: '必填项',
          trigger: 'blur'
        }],
        leaveReason: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }],
        leaveDate: [{
          required: true,
          message: '必填项',
          type: 'date',
          trigger: 'blur'
        }]
      }
    }
  },
  mounted () {
    this.getDissmissionInfo()
  },
  methods: {
    // 获取离职人员用户信息
    getDissmissionInfo () {
      this.$axios({
        url: baseUrl + '/user/leaveDetail',
        data: $qs.stringify({
          id: this.$route.query.id
        }),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            let _a = this.accountInfo
            let _d = resp.data.content
            _a.nickname = _d.nickname
            _a.leaveDate = _d.leaveDate
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    chooseLeaveReasons () {
      if (this.accountInfo.leaveReason === '') {
        this.resonGroup = []
        this.otherReason = ''
      }
      this.leaveReasonsModal = true
    },
    getReason () {
      this.accountInfo.leaveReason = this.resonGroup.concat(this.otherReason).join(',')
    },
    // 保存
    handleSaveUserInfo () {
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
                // this.getTableData()
                // this.getHeaderListData()
                this.handleCloseTag()
              } else {
                this.$Message.error(resp.data.msg)
              }
            })
            .catch(err => {
              console.log('err', err)
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.content {
    padding: 15px;

    .header {
        width: 800px;
        margin: 0 auto;
        border-bottom: 1px solid #e8eaec;
        margin-bottom: 30px;
        span {
            color: #19aa8d;
            font-size: 13px;
            font-weight: bold;
        }

    }

}
</style>
