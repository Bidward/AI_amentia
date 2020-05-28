<template>
  <div>
    <!-- 待评审 -->
    <div>
      <template v-if="row.tasksApprove.approveStatus == 0">
        <Button
          :size="size"
          type="primary"
          class="list-btn"
          @click="showApproveModal"
        >同意
        </Button>
        <Button
          :size="size"
          type="error"
          class="list-btn"
          @click="showRejectModal"
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
    <!-- 待审任务 -->
    <!-- 同意 -->
    <Modal
      v-model="approveModal"
      scrollable
      width="300px"
      title="提醒"
      >
        <div slot="footer">
          <Button type="default" size="small" @click="handleCancel('approve')">取消</Button>
          <Button type="primary" size="small" @click="approve">确认</Button>
        </div>
        <div style="textAlign: center">
          确定将<span style="color: #ff9900;">"{{row.name}}"</span>任务状态变更为{{row.tasksApprove.targetTaskStatus}}？
        </div>
    </Modal>
    <Modal
      v-model="rejectModal"
      scrollable
      width="300px"
      title="提醒"
      >
        <div slot="footer">
          <Button type="default" size="small" @click="handleCancel('reject')">取消</Button>
          <Button type="primary" size="small" @click="reject">确认</Button>
        </div>
        <div style="textAlign:center">
          确定拒绝<span style="color: #ff9900;">"{{row.name}}"</span>任务状态变更申请？
        </div>
    </Modal>
  </div>
</template>

<script>
import { baseUrl } from '@/api/base'

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
      approveModal: false,
      rejectModal: false,
      // 按钮大小
      size: 'default'
    }
  },
  methods: {
    // 同意
    approve () {
      this.checkApprove(1)
    },
    // 拒绝
    reject () {
      this.checkApprove(2)
    },
    // 待评审拒绝/同意接口
    checkApprove (approveStatus) {
      this.$axios({
        url: baseUrl + '/tasks/checkApprove',
        data: { id: this.row.tasksApprove.id, approveStatus: approveStatus },
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            this.app.reload()
          } else {
            this.$Message.success(res.data.msg)
            this.app.reload()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 显示同意弹窗
    showApproveModal () {
      this.approveModal = true
    },
    // 显示拒绝弹窗
    showRejectModal () {
      this.rejectModal = true
    },
    // 查看详情
    checkDetail () {
      this.$router.push({ name: 'taskDetail', params: { id: this.row.id } })
    },
    // 取消按钮
    handleCancel (key) {
      if (key === 'approve') {
        this.approveModal = false
      } else {
        this.rejectModal = false
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
