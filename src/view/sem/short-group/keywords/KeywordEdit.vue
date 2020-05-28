<template>
  <div>
    <Modal
      v-model="showModal"
      :mask-closable="false"
      :title="title"
      :loading="loading"
      @on-ok="submit"
      @on-cancel="closeModal"
      id="editKeywordForm"
    >
      <Form :label-width="80" ref="editKeyword" :model="data" :rules="validate">
        <FormItem label="产品名" prop="softName">
          <Input v-if="isEdit" v-model="data.softName" disabled />
          <Select v-else v-model="data.softName" @ @on-change="getUrlBySoftName" filterable>
            <Option v-for="soft in softnameList" :value="soft" :label="soft" :key="soft">{{soft}}</Option>
          </Select>
        </FormItem>
        <FormItem label="关键词" prop="keyword">
          <Input v-model="data.keyword" :disabled="isEdit" />
        </FormItem>
        <!-- <FormItem label="软件ID" prop="softId" v-if="isEdit">
          <Input v-model="data.softId" />
        </FormItem>-->
        <FormItem label="链接网址" prop="destinationUrl">
          <!-- <a v-if="isEdit" :href="data.destinationUrl" target="_blank">{{data.destinationUrl}}</a> -->
          <Input
            v-model="data.destinationUrl"
            @on-search="cratePage"
            :search="data.canNewPage"
            enter-button="生成新链接"
          />
        </FormItem>
        <FormItem label="状态" prop="status">
          <Select v-model="data.status">
            <Option value="启用" label="启用">启用</Option>
            <Option value="停用" label="停用">停用</Option>
            <Option value="暂停" label="暂停">暂停</Option>
          </Select>
        </FormItem>
        <FormItem label="备注" prop="sum">
          <Input v-model="data.sum" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { semUrl } from '@/api/base.js'
export default {
  name: 'KeywordEdit',
  props: {
    show: Boolean,
    propData: Object
  },
  mounted () {
    this.title = this.propData.title
    if (this.title === '编辑') {
      this.data = JSON.parse(JSON.stringify(this.propData))
    } else {
      this.data.status = '暂停'
      this.getSoftnameList()
    }
  },
  data () {
    return {
      loading: true,
      showModal: this.show,
      title: '编辑',
      focusSelect: false,
      softnameList: [], // 软件名下拉
      data: {
        softName: '', // 产品名
        keyword: '', // 关键词
        destinationUrl: '', // 链接网址
        status: '', // 状态
        sum: '', // 备注
        canNewPage: false // 是否可以生成新页面
      },
      validate: {
        softName: [{ required: true, message: '必填', trigger: 'change' }],
        keyword: [
          {
            required: true,
            trigger: 'change',
            maxLength: 32,
            validator: this.validateLength
          }
        ],
        softId: [{ required: true, message: '必填', trigger: 'change' }],
        destinationUrl: [
          { required: true, type: 'url', message: '必填', trigger: 'change' },
          {
            trigger: 'change',
            validator: (rule, value, callback) => {
              let query = this.getQueryString(value)
              if (!query.softid) {
                callback(new Error('softid格式出错'))
              } else {
                callback()
              }
            }
          }
        ],
        status: [{ required: true, message: '必填', trigger: 'change' }]
      }
    }
  },
  methods: {
    // 获取字符的占位大小，中文算两个
    getStringLength (v) {
      if (!v) v = ''
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
      // 必填且未填
      if (rule.required && !value) {
        callback(new Error('必填项'))
      } else if (
        // 非必填，没有值，过白
        !rule.required &&
        !value
      ) {
        callback()
      } else if (
        rule.minLength &&
        this.getStringLength(value) < rule.minLength
      ) {
        callback(new Error('字数小于' + rule.minLength))
      } else if (
        rule.maxLength &&
        this.getStringLength(value) > rule.maxLength
      ) {
        callback(new Error('字数超过' + rule.maxLength))
      } else {
        callback()
      }
    },
    closeModal () {
      this.$emit('update:show', false)
    },
    updateList () {
      this.$emit('updateList')
    },
    getUrlBySoftName (softName) {
      this.$axios({
        url: semUrl + '/PhraseKeyword/getUrlBySoftname',
        method: 'post',
        data: $qs.stringify({ softName })
      }).then(res => {
        if (res.data.code === 10000) {
          const { url } = res.data.data
          this.data.destinationUrl = url
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    getSoftnameList () {
      this.$axios({
        url: semUrl + '/PhraseGroup/getSoftnameV2',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          let list = res.data.data.list
          this.softnameList = Object.freeze(list)
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 生成新页面
    cratePage () {
      this.$axios({
        url: semUrl + '/PhraseKeyword/createOtherPage',
        method: 'post',
        data: $qs.stringify({
          keywordId: this.data.keywordId
        })
      }).then(res => {
        if (res.data.code === 10000) {
          this.data.destinationUrl = res.data.url
          this.data.softId = res.data.softId
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 保存
    submit () {
      this.$refs.editKeyword.validate(v => {
        let { softName, keyword, destinationUrl, status, sum } = this.data
        let sendData = { softName, keyword, destinationUrl, status, sum }
        sendData.softId = this.softId
        if (this.title === '新增') {
          this.$axios({
            url: semUrl + '/PhraseKeyword/saveKeyword',
            method: 'post',
            data: $qs.stringify(sendData)
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.closeModal()
              this.updateList()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        } else {
          sendData.keywordId = this.data.keywordId
          this.$axios({
            url: semUrl + '/PhraseKeyword/updateKeyword',
            method: 'post',
            data: $qs.stringify(sendData)
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.closeModal()
              this.updateList()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    getQueryString (url) {
      var theRequest = {}
      if (url.indexOf('?') !== -1) {
        var str = url.split('?')[1]
        let strs = str.split('&')
        for (let i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
        }
      }
      return theRequest
    }
  },
  computed: {
    softId () {
      return this.getQueryString(this.data.destinationUrl).softid
    },
    isEdit () {
      return this.title === '编辑'
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
