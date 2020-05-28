<!-- 等级调整 -->
<template>
  <div>
    <Modal
      v-model="show"
      width="300px"
      title="等级调整"
      >
      <div style="display: flex; align-items: center; justify-content: center;">
        <span style="margin-right: 10px;">任务等级:</span>
        <Select
          style="width: 150px;"
          v-model="taskLevel"
          >
          <Option
            style="text-align: center;"
            v-for="(item, index) in levels"
            :value="item.tasksLevelName"
            :label="item.tasksLevelName"
            :disabled="item.tasksLevelName === originLevel"
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
        确定将<span style="color: #ff9900;">"{{name}}"</span>变更为{{taskLevel}}级别
      </div>
    </Modal>
  </div>
</template>

<script>
import { baseUrl } from '@/api/base'
export default {
  inject: ['app'],

  components: {},

  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    level: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    id: {
      type: [String, Number]
    }
  },

  data () {
    return {
      showFinalModal: false,
      taskLevel: this.level,
      show: this.showModal
      // originLevel: ''
    }
  },

  methods: {
    handleCancel (flag) {
      if (flag === 'final') {
        this.showFinalModal = false
      } else {
        this.show = false
        this.$emit('hide-level-change')
      }
    },
    // 显示确认等级调整弹窗
    handleLevelChangeConfirm () {
      if (this.taskLevel === this.originLevel) {
        this.$Message.error('请选择目标等级')
        return
      }
      this.showFinalModal = true
    },
    // 等级调整最终确认
    handleFinalConfirm () {
      // let { id } = this.taskData.id
      this.$axios({
        url: baseUrl + '/tasks/opertate/levelChange',
        params: { id: this.id, targetLevel: this.taskLevel },
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
    }
  },

  computed: {
    levels () {
      return this.app.taskLevels
    },
    originLevel () {
      return this.level
    }
  },

  watch: {
    level (newVal) {
      this.taskLevel = newVal
    },
    showModal (newVal) {
      this.show = newVal
    },
    show (newVal) {
      if (!newVal) {
        this.$emit('hide-level-change')
      }
    }
  }
}
</script>

<style lang='less' scoped>
</style>
