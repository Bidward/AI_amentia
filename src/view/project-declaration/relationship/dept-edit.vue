<template>
  <div>
    <!-- 新增主部门，编辑主部门的弹窗 -->
    <Modal
      :title="editType"
      v-model="showModal"
      :loading="loading"
      :mask-closable="false"
      @on-ok="submit"
    >
      <Form :label-width="80" ref="detpEditForm" :model="data" :rules="rules">
        <FormItem label="部门名称:" prop="unitName">
          <Input v-model.trim="data.unitName" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { phpURL } from '@/api/base.js'
export default {
  name: 'deptEdit',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    editType: {
      type: String,
      default: '新增'
    },
    propsData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  mounted () {
    this.data = Object.assign(this.data, this.propsData)
  },
  data () {
    return {
      loading: true,
      data: {
        parentId: '', // 父id
        type: 'dept',
        unitName: '' // 部门名称
      },
      rules: {
        unitName: [
          { required: true, message: '必填', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 提交按钮
    submit () {
      this.$refs.detpEditForm.validate(v => {
        if (v) {
          this.addDept()
        }
      })
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    // 新增部门
    addDept () {
      let data = this.data
      this.$axios({
        url: phpURL + '/declareProject/ContactUnit/saveUnit',
        method: 'post',
        data: $qs.stringify(data)
      }).then(res => {
        const { code, msg } = res.data
        if (code === 10000) {
          this.submitOk()
        } else {
          this.$Message.error(msg)
        }
      })
    },
    // 编辑部门
    editDept () {
      // updateDept
      let data = this.data
      this.$axios({
        url: phpURL + '/Outreach/updateDept',
        method: 'post',
        data: $qs.stringify(data)
      }).then(res => {
        const { code, msg } = res.data
        if (code === 10000) {
          this.submitOk()
        } else {
          this.$Message.error(msg)
        }
      })
    },
    submitOk () {
      this.showModal = false
      this.$emit('on-success', true)
      this.$emit('input', false)
    }
  },
  computed: {
    showModal: {
      get () {
        return this.value
      },
      set () {
        this.$emit('input', false)
      }
    }
  }
}
</script>

<style>
</style>
