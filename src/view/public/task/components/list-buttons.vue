<template>
  <div v-if="row.button" style="text-align: center; min-width: 220px;" class="buttons">
    <!-- 发起人 -->
    <!-- 发起人编写方案 -->
    <Button
      v-if="row.button.editTasks && row.type!='简易任务' && row.taskStatus !== '进行中'"
      :size="size"
      type="primary"
      class="list-btn"
      @click="editTasks(row)"
    >编写方案
    </Button>
    <!-- 发起人确认方案 -->
    <Button
      v-if="row.button.confirmTasks"
      :size="size"
      type="primary"
      class="list-btn"
      :loading="loadingStatus"
      @click="senderConfirmTaskPlans(row)"
    >确认方案
    </Button>
    <!-- 发起人确认任务完成 -->
    <Button
      v-if="row.button.finishTasks"
      type="primary"
      :size="size"
      class="list-btn"
      :loading="loadingStatus"
      @click="senderConfirmTaskFinish(row)"
    >任务完成
    </Button>
    <!-- 发起人阶段性确认 -->
    <Button
      v-if="row.button.stageConfirm"
      type="primary"
      :size="size"
      :loading="loadingStatus"
      class="list-btn"
      @click="stageConfirm(row)"
    >阶段性确认
    </Button>
    <!-- 发起人延长 -->
    <Button
      class="btn"
      type="primary"
      v-if="row.button && row.button.extendTasks"
      @click="extendTask(row)"
    >延长任务</Button>

    <!-- 发起人任务完成等级调整 -->
    <Button
      v-if="row.button.levelChange"
      type="primary"
      :size="size"
      class="list-btn"
      @click="adjustTaskLevel(row)"
    >等级调整
    </Button>
    <!-- 接收人 -->
    <!-- 接收人编写方案 -->
    <Button
      v-if="row.button.editTasksPlan && row.type!='简易任务' && row.taskStatus !== '进行中'"
      type="primary"
      :size="size"
      class="list-btn"
      @click="receiverEditPlan(row)"
    >编写方案
    </Button>

    <!-- 执行人 -->
    <!-- 执行人确认方案 -->
    <Button
      v-if="row.button.confirmButtonEmerge"
      type="primary"
      :size="size"
      class="list-btn"
      :loading="loadingStatus"
      @click="confirmTaskPlan(row)"
    >确认
    </Button>
    <!-- 执行人完成方案 -->
    <Button
      v-if="row.button.completeButtonEmerge"
      type="primary"
      :size="size"
      :loading="loadingStatus"
      class="list-btn"
      @click="executorFinishTaskPlan(row)"
    >完成
    </Button>

    <!-- 查看详情 -->
    <Button
      @click="checkDetail(row)"
      v-if="row.button.view"
      :size="size"
      type="default"
      class="list-btn"
      style="margin-right: 5px;"
    >查看
    </Button>
    <Modal
      v-model="showModal"
      width="300px"
      title="等级调整"
      >
        <div style="display: flex; align-items: center; justify-content: center;">
          <span style="margin-right: 10px;">任务等级:</span>
          <Select
            style="width: 150px;"
            v-model="task.taskLevel">
            <Option
              style="text-align: center;"
              v-for="(item, index) in levels"
              :value="item.tasksLevelName"
              :label="item.tasksLevelName"
              :disabled="item.tasksLevelName === initTaskLevel"
              :key="index">
            </Option>
          </Select>
        </div>
        <div slot="footer">
          <Button type="default" size="small" @click="handleCancel">取消</Button>
          <Button type="primary" size="small" @click="handleLevelChangeConfirm">确认</Button>
        </div>
    </Modal>
    <Modal
      v-model="showFinalModal"
      scrollable
      width="300px"
      title="提醒"
      >
      <div slot="footer">
        <Button type="default" size="small" @click="handleCancel('final')">取消</Button>
        <Button type="primary" size="small" @click="handleFinalConfirm">确认</Button>
      </div>
      <div>
        确定将<span style="color: #ff9900;">"{{task.name}}"</span>变更为{{task.taskLevel}}级别
      </div>
    </Modal>
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
  </div>
</template>

<script>
import { baseUrl } from '@/api/base'
import { buttonMixin } from '@/assets/js/mixins.js'
import moment from 'moment'

export default {
  mixins: [buttonMixin],
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
      loadingStatus: false,
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
      // 当前任务信息
      currentTask: {},
      // 月度评审拒绝弹窗
      showRejectModal: false,
      showRejectConfirmModal: false,
      tabTypes: ''
    }
  },
  beforeMount () {
    // 获取页面id
    this.tabTypes = sessionStorage.getItem('listeTabTypes')
    this.initTaskLevel = this.task.taskLevel
  },
  methods: {
    // 公共的请求方法
    request (url, id) {
      this.$axios({
        url: baseUrl + url + id,
        method: 'get'
      })
        .then(res => {
          let msg = res.data.msg
          if (res.data.code === 10000) {
            this.$Message.success(msg)
            this.app.reload()
          // item.button.confirmButtonEmerge = false
          } else {
            this.$Message.success(msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 查看详情
    checkDetail (row) {
      // this.$router.push('/task/detail/' + row.id)
      this.$router.push({ name: 'taskDetail', params: { id: row.id } })
    },
    // 发起人点击编写方案
    editTasks (row) {
      // 处于评审状态不可编辑
      if (this.isApproving(row)) return
      let taskStatus = this.row.taskStatus
      if (taskStatus === '进行中') {
        this.$Modal.confirm({
          title: '提示',
          content: '任务状态为进行中，此时编辑任务接收人将会被扣1分',
          onOk: () => {
            // this.isSomeoneEditing(row.id, this.push)
            this.push(row.id)
          }
        })
      } else {
        this.push(row.id)
        // this.isSomeoneEditing(row.id, this.push)
      }
    },
    // 没人编辑进入编辑页面
    push (id) {
      this.$router.push({ name: 'taskEdit', params: { id }, query: { editing: 1 } })
    },
    // 执行人确认方案
    confirmTaskPlan (row) {
      if (this.isApproving(row)) return
      this.loadingStatus = true
      this.$axios({
        url: baseUrl + '/taskplan/operate/confirm?taskPlanId=' + row.taskPlanId,
        method: 'get'
      })
        .then(res => {
          let msg = res.data.msg
          if (res.data.code === 10000) {
            this.$Message.success(msg)
            this.$emit('click')
            // this.app.reload()
          } else {
            this.$Message.error(msg)
          }
          this.loadingStatus = false
        })
        .catch(err => {
          console.log(err)
          this.loadingStatus = false
        })
    },
    // 执行人完成方案
    executorFinishTaskPlan (row) {
      if (this.isApproving(row)) return
      this.loadingStatus = true
      let temp = moment().isBefore(row.planStarttime)
      if (temp) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>是否提前完成该任务方案？</p>',
          onOk: () => {
            this.$axios({
              url: baseUrl + '/taskplan/operate/finish?taskPlanId=' + row.taskPlanId,
              method: 'get'
            })
              .then(res => {
                if (res.data.code === 10000) {
                  this.$Message.success(res.data.msg)
                  this.$emit('click')
                } else {
                  this.$Message.error(res.data.msg)
                }
                this.loadingStatus = false
              })
              .catch(err => {
                console.log(err)
                this.loadingStatus = false
              })
          }
        })
      } else {
        this.$axios({
          url: baseUrl + '/taskplan/operate/finish?taskPlanId=' + row.taskPlanId,
          method: 'get'
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.$emit('click')
            } else {
              this.$Message.error(res.data.msg)
            }
            this.loadingStatus = false
          })
          .catch(err => {
            console.log(err)
            this.loadingStatus = false
          })
      }
    },
    // 确认任务完成
    // confirmTaskComplete (row) {

    // },
    // 接收人编写方案
    receiverEditPlan (row) {
      // 处于评审状态不可编辑
      if (this.isApproving(row)) return
      let taskStatus = this.row.taskStatus
      if (taskStatus === '进行中') {
        this.$Modal.confirm({
          title: '提示',
          content: '任务状态为进行中，此时编辑任务方案接收人将会被扣1分',
          onOk: () => {
            this.push(row.id)
          }
        })
      } else {
        this.push(row.id)
      }
    },
    // 任务是否处于待审状态
    isApproving (row) {
      if (row.approveStatus) {
        this.$Message.error('该任务处于待审状态，不可编辑！')
        return true
      }
    },
    // 发起人确认全部任务方案
    senderConfirmTaskPlans (row) {
      if (this.isApproving(row)) return
      this.loadingStatus = true
      this.$axios({
        url: baseUrl + '/tasks/opertate/confirmTasks?id=' + row.id,
        method: 'get'
      })
        .then(res => {
          let msg = res.data.msg
          if (res.data.code === 10000) {
            this.$Message.success(msg)
            this.app.reload()
          } else {
            this.$Message.error(msg)
          }
          this.loadingStatus = false
        })
        .catch(err => {
          console.log(err)
          this.loadingStatus = false
        })
    },
    // 发起人确认任务完成
    senderConfirmTaskFinish (row) {
      if (this.isApproving(row)) return
      this.loadingStatus = true
      this.$axios({
        url: baseUrl + '/tasks/opertate/finishTasks?id=' + row.id,
        method: 'get'
      })
        .then(res => {
          let msg = res.data.msg
          if (res.data.code === 10000) {
            this.$Message.success(msg)
            this.app.reload()
          } else {
            this.$Message.error(msg)
          }
          this.loadingStatus = false
        })
        .catch(err => {
          console.log(err)
          this.loadingStatus = false
        })
    },
    // 发起人阶段性确认
    stageConfirm (row) {
      if (this.isApproving(row)) return
      this.loadingStatus = true
      this.$axios({
        url: baseUrl + '/tasks/opertate/stageConfirmTasks?id=' + row.id,
        method: 'get'
      })
        .then(res => {
          let msg = res.data.msg
          if (res.data.code === 10000) {
            this.$Message.success(msg)
            this.app.reload()
          } else {
            this.$Message.error(msg)
          }
          this.loadingStatus = false
        })
        .catch(err => {
          console.log(err)
          this.loadingStatus = false
        })
    },
    // 发起人调整任务等级
    adjustTaskLevel (row) {
      this.showModal = true
      this.currentTask = row
    },
    // 显示确认等级调整弹窗
    handleLevelChangeConfirm () {
      if (this.initTaskLevel === this.task.taskLevel) {
        this.$Message.error('请先选择等级')
        return
      }
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
      } else {
        this.showModal = false
      }
    },
    // 等级调整最终确认
    handleFinalConfirm () {
      let { id } = this.task
      this.$axios({
        url: baseUrl + '/tasks/opertate/levelChange',
        params: { id, targetLevel: this.task.taskLevel },
        method: 'get'
      })
        .then(res => {
          let msg = res.data.msg
          if (res.data.code === 10000) {
            this.$Message.success(msg)
            // this.showModal = false
            // this.showFinalModal = false
            this.app.reload()
          } else {
            this.$Message.error(msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    approve (row) {
      this.showApproveModal = true
    },
    // 同意月度评审
    confirmApprove () {
      this.$axios({
        url: baseUrl + '',
        params: {},
        method: 'get'
      })
        .then(res => {
          let msg = res.data.msg
          if (res.data.code === 10000) {
            this.$Message.success(msg)
            this.app.reload()
          } else {
            this.$Message.error(msg)
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
    // 拒绝月度评审
    handleReject () {
      this.showRejectModal = true
    },
    //
    confirmRejectLevel () {
      this.showRejectConfirmModal = true
    },
    // 判断是否有人在编辑
    isSomeoneEditing (id, callback) {
      this.$axios({
        url: baseUrl + '/tasks/lockEditPlan',
        params: { taskId: id },
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            callback(id)
          } else if (res.data.code === 10056) {
            this.$Message.error(res.data.msg + '正在编辑')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    extendTask (row) {
      if (this.isApproving(row)) return
      this.$axios({
        url: baseUrl + '/tasks/opertate/extendTasks?id=' + row.id,
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            // this.app.reload()
            this.$emit('click')
          }
        })
    }
  },
  computed: {
    task () {
      return JSON.parse(JSON.stringify(this.row))
    },
    levels () {
      return this.app.taskLevels
    },
    name () {
      return this.$route.name
    }
  },
  watch: {
    showModal (newVal) {
      if (!newVal) {
        this.task.taskLevel = this.initTaskLevel
      }
    }
  }
}
</script>

<style lang="less">
  @import '~@/assets/style/variables.less';
  .list-btn {
    margin-right: 10px !important;
    &:last-child {
      margin-right: 0 !important;
    }
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
