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
      <Form :label-width="80" ref="illegal" :model="data" :rules="validate">
        <FormItem label="黑名单词" prop="title">
          <h4 v-if="config.title==='查看'">{{data.title}}</h4>
          <Input v-else v-model="data.title" />
        </FormItem>
        <FormItem label="类别" prop="type">
          <h4 v-if="config.title==='查看'">{{data.type}}</h4>
          <Select v-else v-model="data.type">
            <Option value="违规">违规</Option>
            <Option value="违法">违法</Option>
          </Select>
        </FormItem>
        <FormItem label="原因" prop="keywordReason">
          <h4 v-if="config.title==='查看'">{{data.keywordReason}}</h4>
          <template v-else>
            <Select v-if="data.type==='违规'" v-model="data.keywordReason">
              <Option v-for="(item,index) in selection.tag" :value="item" :key="index">{{ item }}</Option>
            </Select>
            <Select v-else v-model="data.keywordReason">
              <Option
                v-for="(item,index) in selection.keywordReason"
                :value="item"
                :key="index"
              >{{ item }}</Option>
            </Select>
          </template>
        </FormItem>
        <FormItem label="备注" prop="sum">
          <h4 v-if="config.title==='查看'">{{data.sum}}</h4>
          <Input v-else v-model="data.sum" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { semUrl } from '@/api/base.js'
export default {
  name: 'editIllegal',
  props: {
    show: Boolean,
    config: Object,
    propData: Object
  },
  mounted () {
    if (this.config.title === '编辑' || this.config.title === '查看') {
      this.data = this.propData
    }
    this.getIllegalTypeList()
  },
  data () {
    return {
      loading: true,
      showModal: this.show,
      data: {
        title: '',
        type: '',
        keywordReason: '',
        sum: ''
      },
      selection: {
        keywordReason: [],
        tag: []
      },
      validate: {
        title: [{ required: true, message: '必填', trigger: 'change' }],
        type: [{ required: true, message: '必填', trigger: 'change' }],
        keywordReason: [{ required: true, message: '必填', trigger: 'change' }]
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
    // 获取违禁词库列表下拉列表
    getIllegalTypeList () {
      this.$axios({
        url: semUrl + '/Market/getIllegalWordTag'
      }).then(res => {
        if (res.data.code === 10000) {
          this.selection.keywordReason = res.data.keywordReason
          this.selection.tag = res.data.tag
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 保存
    submit () {
      this.$refs.illegal.validate(v => {
        if (!v) {
          this.$Message.error('必填项未填')
          return
        }
        if (this.config.title === '新增') {
          this.$axios({
            url: semUrl + '/Banword/saveBanword',
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
            url: semUrl + '/Banword/uptBanword',
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
