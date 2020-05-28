<template>
  <div>
    <Modal title="销分详情"
      v-model="showModal"
      @on-cancel="close"
    >
      <Form class="revokeDetail">
        <h3>销分信息</h3>
        <Row>
          <Col span="12">
            <FormItem label="申请日期:">{{propsData.applyTime}}</FormItem>
          </Col>
          <Col span="12">
            <FormItem label="奖惩日期:">{{propsData.rewardTime}}</FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="奖惩类型:">{{propsData.initiationDetailed}}</FormItem>
          </Col>
          <Col span="12">
            <FormItem label="销分分数:">{{propsData.score}}</FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="奖惩事项:">
              <div class="content">{{propsData.reason}}</div>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="奖惩事由:">
              <div class="content">{{propsData.applyReason}}</div>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="截图证明:">
              <div class="content">
                <viewer :images="propsData.enclosureList">
                  <div v-for="(item,index) in propsData.enclosureList" :key="index">
                    <img v-if="propsData.enclosureList.length" :src="item.enclosureUrl" :alt="item.enclosureName">
                    <span v-else>无</span>
                  </div>
                </viewer>
              </div>
            </FormItem>
          </Col>
        </Row>
        <h3>审批进度</h3>
        <Steps direction="vertical" size="small">
          <Step
            v-for="(item,index) in propsData.approvers"
            :value="index"
            :key="`${item.approveId}`"
            :title="`${item.approveName}`"
            :status="getStatus(item.approveStatus)"
            :content="getContent(item)">
          </Step>
        </Steps>
      </Form>
      <div slot="footer">
        <Button v-if="info==='todo'" type="primary" @click="yes(id)">同意</Button>
        <Button v-if="info==='todo'" type="error" @click="no(id)">拒绝</Button>
        <Button type="primary" @click="close">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { baseUrl } from '@/api/base'
export default {
  name: 'revokeDetailModal',
  props: {
    id: Number,
    info: String,
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
    getContent (item) {
      return `${item.deptName}--${item.positionName}--${item.approveStatusName}` + (item.rejectReason ? `理由：${item.rejectReason}` : '')
      // return `${item.deptName}--${item.positionName}--${item.approveStatusName} ${item.rejectReason||''}`
    },
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
    yes (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认同意审批</p>',
        onOk: () => {
          this.$axios({
            url: baseUrl + '/approve/agree',
            method: 'post',
            data: [id]
            // data: $qs.stringify({ids: id})
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.$emit('closeAndRefresh')
            } else {
              this.$Message.error(res.data.msg)
            }
          }).catch(err => {
            console.error(err)
          })
          this.detailModalx = false
        }
      })
    },
    no (id) {
      this.$Modal.confirm({
        title: '拒绝原因',
        render: (h) => {
          return h('Input', {
            props: {
              value: this.rejectReason,
              type: 'textarea',
              height: 300,
              autofocus: true,
              placeholder: '拒绝原因'
            },
            on: {
              input: (val) => {
                this.rejectReason = val
              }
            }
          })
        },
        onOk: () => {
          this.$axios({
            url: baseUrl + '/approve/reject',
            method: 'post',
            data: $qs.stringify({ id: id, rejectReason: this.rejectReason })
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.$emit('closeAndRefresh')
            } else {
              this.$Message.error(res.data.msg)
            }
          }).catch(err => {
            console.error(err)
          })
          this.detailModalx = false
        }
      })
    }
  }
}
</script>
