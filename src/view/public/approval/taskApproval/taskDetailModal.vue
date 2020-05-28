<template>
  <div>
    <Modal title="审批详情"
      v-model="showModal"
      @on-cancel="close"
    >
      <Form v-if="propsData.task" class="revokeDetail">
        <h3>任务信息</h3>
        <Row>
          <Col span="12">
            <FormItem label="任务名称:">{{propsData.task.name}}</FormItem>
          </Col>
          <Col span="12">
            <FormItem label="时间:">{{propsData.task.tasksTimeStartToEnd}}</FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="发起人:">{{propsData.task.sendName}}</FormItem>
          </Col>
          <Col span="12">
            <FormItem label="接收人:">{{propsData.task.acceptName}}</FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="更改状态:">
              <div class="content">{{propsData.task.tasksApprove.targetTaskStatus}}</div>
            </FormItem>
          </Col>
        </Row>
        <h3>审批进度</h3>
        <Steps direction="vertical" size="small">
          <Step
            :title="`${propsData.approveUser.approveName}`"
            :status="getStatus(propsData.approveUser.approveStatus)"
            :content="`${propsData.approveUser.deptName}--${propsData.approveUser.positionName}--${propsData.approveUser.approveStatusName}`">
          </Step>
        </Steps>
      </Form>
      <div slot="footer">
        <Button v-if="info==='todo'" type="primary" @click="approve(row)">同意</Button>
        <Button v-if="info==='todo'" type="error" @click="reject(row)">拒绝</Button>
        <Button type="primary" @click="close">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { baseUrl } from '@/api/base'
export default {
  name: 'taskDetailModal',
  props: {
    info: String,
    row: {
      type: Object,
      default () {
        return {}
      }
    },
    propsData: {
      type: Object,
      default () {
        return {}
      }
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showModal: this.show
    }
  },
  watch: {
    show (newVal) {
      this.showModal = newVal
    }
  },
  methods: {
    getStatus (status) {
      if (status === 2) {
        return 'error'
      } else if (status === 1) {
        return 'finish'
      } else if (status === 0) {
        return 'wait'
      }
    },
    close () {
      this.$emit('close')
    },
    // 同意/拒绝
    approve (row) {
      this.$Modal.confirm({
        title: '提醒',
        content: `确定将<span style="color: #ff9900;">"${row.name}"</span>任务状态变更为${row.tasksApprove.targetTaskStatus}？`,
        onOk: () => {
          this.checkApprove(row.id, 1)
        }
      })
    },
    reject (row) {
      this.$Modal.confirm({
        title: '提醒',
        content: `确定拒绝<span style="color: #ff9900;">"${row.name}"</span>任务状态变更申请？`,
        onOk: () => {
          this.checkApprove(row.id, 2)
        }
      })
    },
    checkApprove (id, approveStatus) {
      this.$axios({
        url: baseUrl + `/tasks/checkApprove`,
        data: { id: id, approveStatus: approveStatus },
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            this.$emit('closeAndRefresh')
          } else {
            this.$Message.success(res.data.msg)
            this.$emit('closeAndRefresh')
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
