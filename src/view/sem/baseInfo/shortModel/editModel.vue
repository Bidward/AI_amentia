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
      <Form :label-width="80" ref="editShort" :model="data" id="model" :rules="validate">
        <FormItem label="短语模板" prop="title">
          <h4 v-if="config.title==='查看'">{{data.title}}</h4>
          <Input v-else v-model="data.title" id="title">
            <span class="pointer" slot="append" @click="appendGroupName('title')">{ }</span>
          </Input>
        </FormItem>
        <FormItem label="短语模式" prop="qwStatus">
          <h4 v-if="config.title==='查看'">{{data.qwStatus==='0'?'停用':'启用'}}</h4>
          <Select v-else  v-model="data.qwStatus">
            <Option value="1">启用</Option>
            <Option value="0">停用</Option>
          </Select>
        </FormItem>
        <FormItem label="备注" prop="model">
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
  name: 'editModel',
  props: {
    show: Boolean,
    config: Object,
    propData: Object
  },
  mounted () {
    let title = this.config.title
    if (title === '查看' || title === '编辑') {
      this.data = this.propData
    }
  },
  data () {
    return {
      showModal: this.show,
      loading: true,
      data: {
        title: '',
        qwStatus: this.config.title === '新增' ? '0' : '',
        sum: ''
      },
      validate: {
        title: [
          {
            required: true,
            validator: this.validateLength,
            maxLength: 18,
            trigger: 'change'
          }
        ],
        qwStatus: [
          {
            required: true,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 获取字符的占位大小，中文算两个
    getStringLength (v) {
      // 推广组不算字
      v = v.replace(/\{推广组\}/g, '')
      let l = 0
      for (let i = 0; i < v.length; i++) {
        let a = v.charAt(i)
        // 如果是中文，算两个
        if (a.match(/[^\x00-\xff]/gi) != null) {
          l += 2
        } else {
          l += 1
        }
      }
      return l
    },
    // 验证长度
    validateLength (rule, value, callback) {
      if (rule.required && !value) {
        callback(new Error('必填项'))
      } else if (
        rule.maxLength &&
        this.getStringLength(value) < rule.minLength
      ) {
        callback(new Error('字数小于' + rule.minLength))
      } else if (
        rule.maxLength &&
        this.getStringLength(value) > rule.maxLength
      ) {
        callback(new Error('360限制关键词最大20字符，字符数超过18'))
      } else {
        callback()
      }
    },
    // 提交
    submit () {
      this.$refs.editShort.validate(v => {
        if (v) {
          if (this.config.title === '新增') {
            this.$axios({
              url: semUrl + '/Shortmodel/saveShort',
              method: 'post',
              data: $qs.stringify(this.data)
            })
              .then(res => {
                if (res.data.code === 10000) {
                  this.$Message.success(res.data.msg)
                  this.closeModal()
                  this.updateList()
                } else {
                  this.$Message.error(res.data.msg)
                }
              })
              .catch(err => {
                console.log(err)
              })
          } else if (this.config.title === '编辑') {
            this.$axios({
              url: semUrl + '/Shortmodel/uptShort',
              method: 'post',
              data: $qs.stringify(this.data)
            })
              .then(res => {
                if (res.data.code === 10000) {
                  this.$Message.success(res.data.msg)
                  this.closeModal()
                  this.updateList()
                } else {
                  this.$Message.error(res.data.msg)
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        }
      })
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    closeModal () {
      this.$emit('update:show', false)
    },
    // 通知父组件更新列表
    updateList () {
      this.$emit('on-updateList', true)
    },
    // 增加推广组模板
    appendGroupName (key) {
      let domId = document.querySelectorAll(`#model #${key} input`)[0]
      let inputIndex = domId.selectionStart
      let insertStr = (soure, start, newStr) => {
        return soure.slice(0, start) + newStr + soure.slice(start)
      }
      this.data[key] = insertStr(this.data[key], inputIndex, `{推广组}`)
    }
  },
  watch: {
    show: {
      handler (newVale) {
        this.showModal = this.show
      },
      immediate: true
    }
  }
}
</script>
<style lang="less" scoped>
.pointer {
  cursor: pointer;
}
</style>
