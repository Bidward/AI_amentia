<template>
  <div>
    <Modal
      v-model="showModal"
      :mask-closable="false"
      :title="config.title"
      :loading="loading"
      @on-ok="submit"
      @on-cancel="closeModal"
    >
      <Form :label-width="80" ref="template" :model="data" :rules="validate">
        <FormItem label="模板编号" prop="templateId">
          <h4 v-if="config.title==='查看'">{{data.templateId}}</h4>
          <Input v-else :disabled="config.title==='编辑'" v-model="data.templateId"></Input>
        </FormItem>
        <FormItem label="备注" prop="sum">
          <h4 v-if="config.title==='查看'">{{data.sum}}</h4>
          <Input v-else v-model="data.sum"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { semUrl } from '@/api/base.js'

export default {
  name: 'editTemplate',
  props: {
    show: Boolean,
    config: Object,
    propData: Object
  },
  mounted () {
    if (this.config.title === '编辑' || this.config.title === '查看') {
      this.data = this.propData
    }
  },
  data () {
    return {
      loading: true,
      showModal: this.show,
      data: {
        templateId: '',
        sum: ''
      },
      validate: {
        templateId: [{ required: true, message: '必填', trigger: 'change' }]
      }
    }
  },
  methods: {
    closeModal () {
      this.$emit('update:show', false)
    },
    updataList () {
      this.$emit('updataList')
    },
    // 保存
    submit () {
      this.$refs.template.validate(v => {
        if (this.config.title === '新增') {
          this.$axios({
            url: semUrl + '/Templat/saveTemplat',
            method: 'post',
            data: $qs.stringify(this.data)
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.closeModal()
              this.updataList()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        } else if (this.config.title === '编辑') {
          this.$axios({
            url: semUrl + '/Templat/uptTemplat',
            method: 'post',
            data: $qs.stringify(this.data)
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.closeModal()
              this.updataList()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        } else {
          this.closeModal()
        }
      })
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    }
  },
  watch: {
    showModal: {
      handler (newVal) {
        this.showModal = this.show
      },
      immediate: true
    }
  }
}
</script>
