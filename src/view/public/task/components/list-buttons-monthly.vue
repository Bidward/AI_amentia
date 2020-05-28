<template>
  <div>
    <!-- 月度评审 -->
    <div style="min-width: 280px;">
      <template v-if="row.status == 0 && permission">
        <Button
          :size="size"
          type="primary"
          class="list-btn"
          @click="approve(row)"
        >同意
        </Button>
        <Button
          :size="size"
          type="primary"
          class="list-btn"
          @click="adjustTask(row)"
        >修改任务
        </Button>
        <Button
          :size="size"
          type="error"
          class="list-btn"
          @click="handleReject"
        >拒绝
        </Button>
      </template>
      <Button
        :size="size"
        type="default"
        class="list-btn"
        @click="checkDetail"
      >查看
      </Button>
    </div>
    <!-- 月度评审 -->
    <!-- 通过月度评审 -->
    <Modal
      v-model="showApproveModal"
      scrollable
      width="300px"
      title="提醒"
      >
        <div slot="footer">
          <Button type="default" size="small" @click="handleCancel('approve')">取消</Button>
          <Button type="primary" size="small" @click="confirmApprove">确认</Button>
        </div>
        <div style="display: flex; align-items: center; justify-content: center; ">
          确定<span style="color: #ff9900;">"通过"</span>该任务的月度评审？
        </div>
    </Modal>
    <!-- 修改任务 -->
    <Modal
      class="revise"
      v-model="showAdjustModal"
      scrollable
      width="600px"
      title="提醒"
      >
        <div slot="footer">
          <Button type="default" size="small" @click="handleCancel('revise')">取消</Button>
          <Button type="primary" size="small" @click="confirmAdjustTask">确认</Button>
        </div>
        <div class="modal-content-wrapper">
          <div class="section">
            <div class="title">
              基础信息
            </div>
            <div class="content">
              <Row class="row-content" type="flex" justify="center">
                <Col span="10" offset="2">
                  <Col span="8" class="content-title" style="text-align: right;">任务名称：</Col>
                  <Col span="16" offset="">
                    <p>{{row.name}}</p>
                  </Col>
                </Col>
                <Col span="12">
                  <Col span="8" class="content-title" style="text-align: right;">任务时间：</Col>
                  <Col span="16" offset="">
                    <p>{{row.sendTime}}~{{row.completeTime}}</p>
                  </Col>
                </Col>
              </Row>
              <Row class="row-content" type="flex" justify="center">
                <Col span="10" offset="2">
                  <Col span="8" class="content-title" style="text-align: right;">发起人：</Col>
                  <Col span="16" offset="">
                    <p>{{row.sendName}}</p>
                  </Col>
                </Col>
                <Col span="12">
                  <Col span="8" class="content-title" style="text-align: right;">接收人：</Col>
                  <Col span="16" offset="">
                    <p>{{row.acceptName}}</p>
                  </Col>
                </Col>
              </Row>
              <Row class="row-content" type="flex" justify="center">
                <Col span="10" offset=2>
                  <Col span="8" class="content-title" style="text-align: right;">任务等级：</Col>
                  <Col span="16" offset="">
                    <p>{{row.taskLevel}}</p>
                  </Col>
                </Col>
                <Col span="12">
                </Col>
              </Row>
            </div>
          </div>
          <div class="section">
            <div class="title">
              <span>操作</span>
              <Tooltip :content="content" style="marginLeft: 10px;" max-width="200">
                <Icon type="ios-alert-outline" color="#f90" size="16" style="marginBottom: 2px;"></Icon>
              </Tooltip>
            </div>
            <div class="content">
              <Row class="row-content" type="flex" justify="center">
                <Col span="12" style="text-align: center; line-height: 32px;">
                  <Checkbox v-model="reviseEndDate"></Checkbox>
                  <span>修改截止日期</span>
                </Col>
                <Col span="12">
                  <Form v-if="!disabled" ref="formValidate" :model="formValidate" :rules="ruleValidate">
                    <FormItem prop="endTime">
                      <span style="margin-right: 5px;">截止日期:</span>
                      <DatePicker
                        style="width: 150px;"
                        :options="options"
                        v-model="formValidate.endTime"
                        :editable="false"
                      ></DatePicker>
                    </FormItem>
                  </Form>
                  <template v-else>
                    <span style="margin-right: 5px;">截止日期:</span>
                    <Input style="width: 150px;" disabled />
                  </template>
                </Col>
              </Row>
            </div>
          </div>
        </div>
    </Modal>
    <!-- 拒绝 -->
    <Modal
      v-model="showRejectModal"
      width="300px"
      title="提醒"
    >
      <div style="display: flex; align-items: center; justify-content: center;">
        <span style="margin-right: 10px;">任务等级:</span>
        <Select
          style="width: 150px;"
          v-model="currentTask.taskLevel">
          <Option
            style="text-align: center;"
            v-for="(item, index) in levels"
            :value="item.tasksLevelName"
            :label="item.tasksLevelName"
            :key="index">
          </Option>
        </Select>
      </div>
      <div slot="footer">
        <Button type="default" size="small" @click="handleCancel('reject')">取消</Button>
        <Button type="primary" size="small" @click="confirmRejectLevel">确认</Button>
      </div>
    </Modal>
    <Modal
      v-model="showRejectConfirmModal"
      scrollable
      width="300px"
      title="提醒"
    >
      <div slot="footer">
        <Button type="default" size="small" @click="handleCancel('finalreject')">取消</Button>
        <Button type="primary" size="small" @click="handleCancelFinalConfirm">确认</Button>
      </div>
      <div style="">
        确定将<span style="color: #ff9900;">"拒绝通过"</span>该任务的月度评审，并将该任务改成
        <span>{{currentTask.taskLevel}}</span>级吗？
      </div>
    </Modal>
  </div>
</template>

<script>
import { baseUrl } from '@/api/base'
import moment from 'moment'
export default {
  props: {
    row: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  inject: ['tasks', 'app'],
  data () {
    return {
      // 按钮大小
      size: 'default',
      // 调整等级弹窗
      showModal: false,
      // 确认调整等级弹窗
      showFinalModal: false,
      modalloading: false,
      // 同意月度评审弹窗
      showApproveModal: false,
      // 修改任务弹窗
      showAdjustModal: false,
      // 月度评审拒绝弹窗
      showRejectModal: false,
      showRejectConfirmModal: false,
      // 是否可以修改截至日期
      reviseEndDate: false,
      // 日期控件可选状态
      disabled: true,
      // 截至日期
      formValidate: {
        endTime: ''
      },
      ruleValidate: { endTime: [{ required: true, message: '日期为必填' }] },
      // Tooltip content
      content: '该任务有截至日期时，不进行修改会导致接收人"超过截止日期后"每日上午9点后扣1分，节假日除外',
      options: {
        disabledDate: date => {
          let deadline = moment().valueOf() > moment(this.row.completeTime).valueOf()
            ? moment().valueOf()
            : moment(this.row.completeTime)
          return date && date.valueOf() < deadline - 86400000
        }
      }
    }
  },
  methods: {
    checkDetail () {
      this.$router.push({ name: 'taskDetail', params: { id: this.row.id, from: 'monthly' } })
    },
    handleLevelChangeConfirm () {
      this.showFinalModal = true
    },
    // 取消弹窗
    handleCancel (flag) {
      if (flag === 'final') {
        this.showFinalModal = false
      } else if (flag === 'approve') {
        this.showApproveModal = false
      } else if (flag === 'revise') {
        this.showAdjustModal = false
      } else if (flag === 'reject') {
        this.showRejectModal = false
      } else if (flag === 'finalreject') {
        this.showRejectConfirmModal = false
      } else {
        this.showModal = false
      }
    },
    // 同意
    approve (row) {
      this.showApproveModal = true
    },
    // 同意月度评审
    confirmApprove () {
      // console.log(this.row)
      this.$axios({
        url: baseUrl + '/tasks/judge/operate/1',
        params: { id: this.row.id },
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.showApproveModal = false
            this.$Message.success(res.data.msg)
            this.app.reload()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 月度评审修改任务
    adjustTask (row) {
      this.showAdjustModal = true
    },
    // 确定月度评审任务修改
    confirmAdjustTask () {
      if (this.reviseEndDate) {
        this.$refs.formValidate.validate(v => {
          if (v) {
            this.$axios({
              url: baseUrl + '/tasks/judge/operate/3',
              params: { id: this.row.id, updateTaskEndDate: moment(this.formValidate.endTime).format('YYYY-MM-DD') },
              method: 'get'
            }).then(res => {
              if (res.data.code === 10002) {
                this.showAdjustModal = false
                this.$Message.success(res.data.msg)
                this.app.reload()
              } else {
                this.$Message.error(res.data.msg)
              }
            })
              .catch(err => {
                console.log(err)
              })
          }
        })
      } else {
        this.$axios({
          url: baseUrl + '/tasks/judge/operate/3',
          params: { id: this.row.id, updateTaskEndDate: '' },
          method: 'get'
        }).then(res => {
          if (res.data.code === 10002) {
            this.showAdjustModal = false
            this.app.reload()
            this.$Message.success(res.data.msg)
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    // 拒绝月度评审
    handleReject () {
      this.showRejectModal = true
    },
    //
    confirmRejectLevel () {
      this.showRejectConfirmModal = true
    },
    // 拒绝提级最终确认
    handleCancelFinalConfirm () {
      let { id } = this.currentTask
      let levelMap = { 'A': 1, 'B': 2, 'C': 3 }
      this.$axios({
        // url: baseUrl + '/tasks/opertate/levelChange',
        url: baseUrl + '/tasks/judge/operate/2',
        params: { id, rejectAfterTaskLevel: levelMap[this.currentTask.taskLevel] },
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            this.showRejectModal = false
            this.showRejectConfirmModal = false
            this.app.reload()
          } else {
            this.$Message.error(res.data.msg)
            this.showRejectModal = false
            this.showRejectConfirmModal = false
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  computed: {
    currentTask () {
      return JSON.parse(JSON.stringify(this.row))
    },
    levels () {
      return this.app.taskLevels
    },
    name () {
      return this.$route.name
    },
    permission () {
      return this.$store.state.user.userpermission.task &&
             this.$store.state.user.userpermission.task.month
    }
  },
  watch: {
    reviseEndDate (newVal) {
      this.disabled = !newVal
      if (this.disabled) {
        this.$set(this.formValidate, 'endTime', '')
      }
    }
  }
}
</script>

<style lang="less">
  @import '~@/assets/style/variables.less';
  .ivu-table-cell {
    padding: 0;
  }
  .list-btn {
    margin-right: 5px;
  }
  .revise {
    .modal-content-wrapper {
      .section {
        &:last-child {
          margin-top: 30px;
        }
        .title {
          height: 20px;
          line-height: 20px;
          box-sizing: border-box;
          margin-left: 30px;
          padding-left: 10px;
          font-size: 12px;
          font-weight: 500;
          color: #000;
          border-left: 3px solid @color-theme-green;
        }
        .content {
          .row-content {
            margin: 10px 0;
            .content-title {
              text-align: right;
            }
          }
        }
      }
    }
  }
</style>
