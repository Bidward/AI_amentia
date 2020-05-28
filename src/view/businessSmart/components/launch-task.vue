<template>
  <!-- 发起任务 -->
  <div class="launch-task">
    <!-- <Button class="btn-launch" type="primary" @click="showTaskForm">新增</Button> -->
    <Modal
      title="发起任务"
      id="taskModal"
      :mask-closable="false"
      :loading="loading"
      @on-ok="launchTask"
      @on-cancel="cancelLaunch"
      v-model="showModal"
      width="920"
    >
      <Form
        ref="formValidate"
        :model="formValidate"
        :rules="modelRuleValidate"
        :label-width="90">
        <Row
          class="bottomDistance"
          style="margin-left: 30px; margin-top: 20px"
        >
          <Col span="11" offset="1">
            <Col span="20">
              <FormItem prop="name" label="任务名称">
                <Input
                  placeholder="请输入任务名称"
                  clearable
                  filterable
                  v-model="formValidate.name"
                />
              </FormItem>
            </Col>
          </Col>
          <Col span="11">
            <Col span="20">
              <FormItem prop="type" label="任务类型">
                <Tooltip placement="top" max-width="450" slot="label">
                  任务类型
                  <Icon type="md-help-circle" size="16" style="margin-bottom: 2px" />
                  <div slot="content">
                      <p>简易任务说明：</p>
                      <p>1、简易任务时间不得超过两天，发布后的任务不需要进行方案确认，会直接进入到“进行中”的状态。</p>
                      <p>2、无需另外填写任务方案，所填写的任务名称即为任务方案的唯一内容。</p>
                      <p>3、若截止时间选择了两天的任务，只会生成一条跨度为两天的任务方案，接收人需每天进行完成确认。</p>
                      <p>4、接收人整个任务完成后，发起人也需进行完成确认，确认后该任务结束。</p>
                  </div>
                </Tooltip>
                <Select
                  v-model="formValidate.type"
                  clearable
                  filterable
                  disabled
                >
                  <Option
                    placeholder="请选择任务类型"
                    v-for="item in taskTypes"
                    :value="item.tasksTypeId"
                    :key="item.tasksTypeId"
                  >{{item.tasksTypeName}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Col>
        </Row>
        <Row
          class="bottomDistance"
          style="margin-left: 30px; margin-top: 10px">
          <Col span="11" offset="1">
            <Col span="20">
              <FormItem prop="acceptUid" label="接收人">
                <Select
                  v-model="formValidate.acceptUid"
                  clearable
                  filterable
                  disabled
                >
                  <Option
                    placeholder="请输入接收人"
                    v-for="item in employees"
                    :value="item.id"
                    :key="item.id"
                  >{{item.nickname}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Col>
          <Col span="11">
            <Col span="20">
              <FormItem prop="sendUid" label="发起人">
                <Input
                  disabled
                  v-show="!hasRight"
                  :value="currentUser && currentUser.nickname"
                />
                <Select
                  v-model="formValidate.sendUid"
                  style="textAlign: left;"
                  clearable
                  filterable
                  v-show="hasRight"
                >
                <Option
                    placeholder="请输入发起人"
                    v-for="item in employees"
                    :value="item.id"
                    :key="item.id"
                  >{{item.nickname}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Col>
        </Row>
        <Row class="bottomDistance" style="margin-left: 30px; margin-top: 10px">
          <Col span="11" offset="1">
            <Col span="20">
              <FormItem prop="sendTime" label="发起时间">
                <DatePicker
                  placeholder="请选择任务的发起时间"
                  type="datetime"
                  v-model="formValidate.sendTime"
                  style="width: 100%"
                  :editable="false"
                  :options="options"
                  :time-picker-options="timePickerOptions"
                  :value="formValidate.sendTime"
                  @on-change="handleSendTimeChange"
                ></DatePicker>
              </FormItem>
            </Col>
          </Col>
          <Col span="11">
            <Col span="20">
              <FormItem prop="endTime" label="截止时间">
                <DatePicker
                  placeholder="请选择任务的截止时间"
                  type="date"
                  v-model="formValidate.endTime"
                  :options="options"
                  style="width: 100%">
                </DatePicker>
              </FormItem>
            </Col>
          </Col>
        </Row>
        <Row class="bottomDistance" style="margin-left: 30px; ">
          <Col span="11" offset="1">
            <Col span="20">
              <FormItem label="任务描述">
                <Input
                  placeholder="请输入任务描述"
                  v-model="formValidate.description"
                  clearable
                  :autosize="{ minRows: 1}"
                  type="textarea"
                  class="textarea"
                />
              </FormItem>
            </Col>
          </Col>
          <Col span="11">
            <Col span="20">
              <FormItem label="附件">
                <Upload
                  id="taskUpload"
                  ref="upload"
                  multiple
                  name="fileData"
                  :max-size="20480"
                  :action="staticUrl+'/index.php'"
                  :on-success="handleSuccess"
                  :on-error="handleError"
                  :on-exceeded-size="handleExceeded"
                  :on-remove="handleRemove"
                >
                  <Button
                    style="width: 240px"
                    class="uploadButton"
                    id="uploadButton"
                    icon="ios-cloud-upload-outline">
                    单个文件不能超过20M
                  </Button>
                </Upload>
              </FormItem>
            </Col>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { baseUrl, staticUrl } from '@/api/base.js'
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  name: 'launchTask',
  inject: ['app'],
  props: {
    show: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      disabled: true,
      staticUrl,
      time: 9,
      showModal: this.show,
      loading: true,
      hasRight: false,
      options: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 1000 * 3600 * 24
        }
      },
      timePickerOptions: {
        disabledHours: [],
        disabledMinutes: []
      },
      // 当前登录用户
      // userId: this.$store.state.user.userId,
      currentUser: {},
      senderList: [],
      // 任务字段
      formValidate: {
        name: '', // 任务名称
        acceptUid: 311, // 接受人
        sendUid: null, // 发起人
        taskLevel: '', // 任务等级
        type: '3', // 任务类型
        endTime: '', // 截止时间
        sendTime: '',
        counselorUid: '', // 顾问
        introducerUid: '', // 提出人
        description: '', // 任务描述
        enclosureUrlList: []
      },
      // 发起任务表单验证规则
      modelRuleValidate: {
        name: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value.trim()) {
                callback(new Error('请填写任务名称'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }],
        taskLevel: [{ required: true, message: '请填写任务等级', trigger: 'change' }],
        acceptUid: [{ required: true, type: 'number', message: '请填写任务接收人', trigger: 'change' }],
        sendUid: [{ required: true, type: 'number', message: '请填写任务发起人', trigger: 'change' }],
        type: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
        sendTime: [{
          required: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('请选择任务发起时间'))
            } else {
              callback()
            }
          }
        }],
        endTime: [{ required: false,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            let type = this.formValidate.type
            let sendTime = this.formValidate.sendTime
            let endTime = this.formValidate.endTime
            let temp = moment(new Date(sendTime)).add(2, 'days').format('YYYY-MM-DD')
            let temp2 = moment(endTime).isBefore(temp)
            if (parseInt(type) === 3 && !temp2) {
              callback(new Error(`简易任务必须在两天内完成`))
            } else {
              callback()
            }
          }
        }]
      }
    }
  },
  // computed: {
  //   showModal(){
  //     console.log(this.show)
  //     return this.show
  //   }
  // },
  mounted () {
    this.formValidate.sendUid = this.$store.state.user.userId
    this.currentUser = {
      userId: this.$store.state.user.userId,
      nickname: this.$store.state.user.nickname
    }
  },
  methods: {
    // 显示弹框
    showTaskForm () {
      this.showModal = true
      this.getSenderList()
      this.formValidate.sendUid = this.$store.state.user.userId
    },
    getSenderList () {
      this.$axios({
        url: baseUrl + '/tasks/getInitiator',
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            if (res.data.content && res.data.content.length) {
              this.senderList = res.data.content
              this.hasRight = true
            } else {
              this.formValidate.sendUid = this.currentUser.userId
            }
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    // 发起任务
    launchTask () {
      let form = this.$refs.formValidate
      let params = form.model
      // 消除方案名称首尾空格
      params.name = params.name.trim()
      if (params.endTime) {
        params.endTime = moment(params.endTime).format('YYYY-MM-DD')
      } else {
        params.endTime = ''
      }
      if (params.sendTime) {
        params.sendTime = moment(new Date(params.sendTime)).format('YYYY-MM-DD HH:mm:ss')
      } else {
        params.sendTime = ''
      }
      // 验证表单字段
      form.validate(v => {
        if (v) {
          // console.log('通过验证')
          let temp = moment(new Date(params.sendTime)).add(2, 'days').format('YYYY-MM-DD')
          let temp2 = moment(params.endTime).isBefore(temp)
          if (parseInt(params.type) === 3) {
            if (params.endTime && !temp2) {
              this.loading = false
              return
            }
          }
          this.$axios({
            url: baseUrl + '/tasks/inserttasks',
            data: params,
            method: 'post'
          })
            .then(res => {
              console.log(res)
              if (res.data.code === 10000) {
                this.loading = false
                this.$Message.success(res.data.msg)
                this.app.reload()
              } else {
                this.$Message.error(res.data.msg)
                this.loading = false
                this.$nextTick(() => {
                  this.loading = true
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
        }
      })
    },
    // 取消发起任务
    cancelLaunch () {
      this.$emit('hideTask', false)
      let form = this.$refs.formValidate
      form.resetFields()
    },
    // 修改发起人
    handleSenderChange (v) {
      this.formValidate.sendUid = v
    },
    handleSuccess (response, file, fileList) {
      let list = []
      fileList.forEach(file => {
        if (file.response) {
          list.push({
            enclosureUrl: file.response.url,
            enclosureName: file.response.filename
          })
        }
      })
      this.formValidate.enclosureUrlList = list
    },
    handleError (error) {
      console.log(error)
    },
    handleExceeded () {
      this.$Message.error('上传失败，文件超过20M')
    },
    handleRemove (file, fileList) {
      // console.log(file)
      // console.log(fileList)
      if (!fileList.length) {
        this.formValidate.enclosureUrlList = []
      } else {
        let list = []
        fileList.forEach(file => {
          if (file.response) {
            list.push({
              enclosureUrl: file.response.url,
              enclosureName: file.response.filename
            })
          }
        })
        this.formValidate.enclosureUrlList = list
      }
    },
    // 修改默认起始时间为当前时间
    handleSendTimeChange (date) {
      if (date) {
        // 时间改变时先将限制条件清空
        this.timePickerOptions.disabledHours = []
        this.timePickerOptions.disabledMinutes = []

        // 选择的时间字符串拆为日期和时间
        let timeArr = date.split(' ')
        let day = timeArr[0]

        // 当前小时/分钟
        let hours = moment().get('hours')
        let minutes = moment().get('minutes')
        // 选择的小时数
        let selectHours = moment(date).get('hours')

        // 日期是否是今天
        let isToday = null
        if (moment().get('date') === moment(date).get('date')) {
          isToday = true
        }
        // 如果不是今天
        if (!isToday) {
          // 时间限制为9点前不能选
          this.limitHMS('disabledHours', this.time)
          // 如果没有选择时分秒
          if (timeArr[1] === '00:00:00') {
            // 默认9点
            this.formValidate.sendTime = day + ' ' + '09:00:00'
          } else {
            // 否则以选择的时间为准
            this.formValidate.sendTime = date
          }
        } else { // 是今天
          // 如过当前小时数小于9
          if (hours < this.time) {
            this.limitHMS('disabledHours', this.time)
            // this.formValidate.sendTime = moment().format('YYYY-MM-DD') + ' ' + '09:00:00'
          } else {
            // 否则限制小时数和分钟数为当前时/分前不可选
            this.limitHMS('disabledHours', hours)
            this.limitHMS('disabledMinutes', minutes)
          }
          // 没有选择时/分
          if (timeArr[1] === '00:00:00') {
            // 当前时间作为发起时间
            this.formValidate.sendTime = moment().format('YYYY-MM-DD HH:mm:ss')
          } else {
            // 选择的小时数大于当前小时数
            if (selectHours > hours) {
              // 分钟数不做限制
              this.timePickerOptions.disabledMinutes = []
            }
            this.formValidate.sendTime = date
          }
        }
        console.log(this.formValidate.sendTime, 'last')
      } else {
        this.formValidate.sendTime = ''
      }
    },
    // 限制时分秒
    limitHMS (key, time) {
      for (let i = 0; i < time; i++) {
        this.timePickerOptions[key].push(i)
      }
    }
  },
  watch: {
    // show(newVal){
    //   this.showModal = newVal
    //   console.log(this.showModal)
    // },
    // 点击新增的时间设为默认任务起始时间
    showModal (newVal) {
      if (newVal) {
        let hours = moment().get('hours')
        let minutes = moment().get('minutes')
        // let seconds = moment().get('seconds')
        if (hours < this.time) {
          this.limitHMS('disabledHours', this.time)
          this.formValidate.sendTime = moment().format('YYYY-MM-DD') + ' ' + '09:00:00'
        } else {
          this.limitHMS('disabledHours', hours)
          this.limitHMS('disabledMinutes', minutes)
          this.formValidate.sendTime = moment().format('YYYY-MM-DD HH:mm:ss')
        }
      } else {
        // 关闭弹窗清空文件列表
        this.$refs.upload.clearFiles()
      }
    }
  },
  computed: {
    ...mapState({
      login: 'loginStat'
    }),
    taskLevels () {
      return this.app.taskLevels
    },
    taskStatus () {
      return this.app.taskStatus
    },
    taskTypes () {
      return this.app.taskTypes
    },
    employees () {
      return this.app.employees
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/style/variables.less';
.textarea /deep/ textarea.ivu-input {
  font-size: 12px;
}
.my-input .ivu-input {
  &:hover {
    border-color: @color-theme-green;
  }
}
.my-input .ivu-select-selection-focused,
.my-input .ivu-select-selection:hover {
  border-color: @color-theme-green;
}
.my-input .uploadButton:hover,
.my-input  .uploadButton:active{
  color:@color-theme-green !important;
  background-color: #fff;
  border-color: @color-theme-green !important;
  box-shadow:none;
}
.launch-task {
  text-align: left;
}

</style>
<style lang="less">
  #taskUpload {
  .ivu-upload-list-file-finish {
    span {
      word-break:break-all !important;
    }
  }

}
</style>
