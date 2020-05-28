<template>
  <div>
    <Modal
      v-model="showModal"
      :title="title"
      @on-cancel="closeModal"
      @on-ok="sumbit"
      :loading="loading"
    >
      <Form
        ref="originzationFromData"
        :label-width="80"
        :model="formData"
        :rules="originzationValidate"
      >
        <FormItem label="部门名称" prop="deptName">
          <Input v-model="formData.deptName"></Input>
        </FormItem>
        <FormItem label="部门负责人" prop="headId">
          <Select v-model="formData.headId" filterable clearable :label-in-value="true" @on-change="selectChange">
            <Option
              v-for="person in incumbencyUserList"
              :value="person.id"
              :key="person.id"
              :label="person.nickname"
            >{{ person.nickname }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'editDept',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '新增'
    },
    incumbencyUserList: {
      type: Array
    },
    deptInfo: {
      type: Object
    },
    deptList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      loading: true,
      showModal: this.show,
      formData: {
        deptName: '', // 公司名称
        head: '', // 部门负责人
        headId: '' //
      },
      originzationValidate: {
        deptName: [
          { required: true, message: '部门名称必填', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              // 是否和已有的重复，但是改变了
              let hasDept = this.deptList.includes(value) && value !== this.deptInfo.deptName
              if (hasDept) {
                callback(new Error('部门名称已经存在'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    closeModal () {
      this.$emit('update:show', false)
    },
    sumbit () {
      this.$refs.originzationFromData.validate(v => {
        if (v) {
          let data = this.formData
          data.type = this.title
          if (data.headId === 0) data.headId = undefined
          this.$emit('getDeptFrom', data)
          this.closeModal()
        } else {
          this.$Message.error('有必填项未填')
        }
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      })
    },
    // 获取下拉框的value和label
    selectChange (data) {
      if (data) {
        this.formData.head = data.label
        // this.formData.id = id
        // let id = data.value
      } else {
        this.formData.head = null
        this.formData.id = null
      }
    }
  },
  watch: {
    show: {
      handler (newVal) {
        // 如果是编辑类型，回显
        if (this.title === '编辑') {
          this.formData.deptName = this.deptInfo.deptName
          this.formData.headId = this.deptInfo.headId
        }
        this.showModal = newVal
      },
      immediate: true
    }
  }
}
</script>
