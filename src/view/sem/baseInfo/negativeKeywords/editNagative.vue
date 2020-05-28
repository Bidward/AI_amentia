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
      <Form :label-width="100" ref="nagetive" :model="data" :rules="validate">
        <FormItem label="否定关键词" prop="title">
          <h4 v-if="config.title==='查看'">{{data.title}}</h4>
          <Input v-else v-model="data.title"></Input>
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
  name: 'editNegative',
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
        title: '',
        sum: ''
      },
      validate: {
        title: [{ required: true, message: '必填', trigger: 'change' }]
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
      this.$refs.nagetive.validate(v => {
        if (this.config.title === '新增') {
          this.$axios({
            url: semUrl + '/Blackword/saveBlackword',
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
            url: semUrl + '/Blackword/uptBlackword',
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
