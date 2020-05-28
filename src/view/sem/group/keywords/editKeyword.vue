<template>
  <div>
    <Modal
      v-model="showModal"
      :mask-closable="false"
      title="编辑"
      :loading="loading"
      @on-ok="submit"
      @on-cancel="closeModal"
      id="editKeywordForm"
    >
      <Form :label-width="80" ref="editKeyword" :model="data" :rules="validate">
        <FormItem label="产品名" prop="softName">
          <Input :disabled="true" v-model="data.softName" />
        </FormItem>
        <FormItem label="推广组" prop="groupName">
          <Input :disabled="true" v-model="data.groupName" />
        </FormItem>
        <FormItem label="关键词">
          <Input :disabled="true" v-model="data.keyword" />
        </FormItem>
        <FormItem label="链接网址" prop="destinationUrl">
          <Input v-model="data.destinationUrl" @on-search="cratePage" :search="data.canNewPage" enter-button="生成新页面" />
        </FormItem>
        <FormItem label="模板配置" prop="showId">
          <Select v-model="data.showId">
            <Option
              :value="item.templateId"
              v-for="(item,index) in templates"
              :key="index"
            >模板{{item.templateId}}--昨日安装量{{item.setups}}</Option>
          </Select>
        </FormItem>
        <FormItem label="状态" prop="optStatus">
          <Select v-model="data.optStatus">
            <Option value="启用">启用</Option>
            <Option value="暂停">暂停</Option>
            <!-- <Option disabled value="待编辑">待编辑</Option> -->
            <Option value="停用">停用</Option>
          </Select>
        </FormItem>
        <FormItem label="下发时段" prop="publishTime" v-if="false">
          <CheckboxGroup v-model="data.publishTime" @on-change="changeGroup">
            <Checkbox v-for="item in 24" :label="`${item-1}`" :key="`${item-1}`" />
          </CheckboxGroup>
        </FormItem>
        <FormItem v-if="false">
          <Checkbox v-model="data.publishTimeStatus" true-value="2" false-value="1">
            <span>此下发时间段对应该产品所有关键词适用</span>
          </Checkbox>
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
  name: 'editKeyword',
  props: {
    show: Boolean,
    propData: Object
  },
  mounted () {
    this.data = JSON.parse(JSON.stringify(this.propData))
    this.getTemplates()
  },
  data () {
    return {
      loading: true,
      showModal: this.show,
      selection: [],
      data: {
        softName: '', // 产品名
        groupName: '', // 推广组
        destinationUrl: '', // 链接网址
        showId: '', // 模板配置
        optStatus: '', // 状态
        sum: '', // 备注
        publishTime: [], // 下发时间段
        canNewPage: false// 是否可以生成新页面
      },
      optStatus: '',
      templates: [],
      validate: {
        softName: [{ required: true, message: '必填', trigger: 'change' }],
        groupName: [{ required: true, message: '必填', trigger: 'change' }],
        destinationUrl: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        optStatus: [{ required: true, message: '必填', trigger: 'change' }],
        publishTime: [
          {
            required: true,
            type: 'array',
            message: '下发时间段必填',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    changeGroup (v) {
      console.log(v)
    },
    closeModal () {
      this.$emit('update:show', false)
    },
    updateList () {
      this.$emit('updateList')
    },
    getTemplates () {
      this.$axios({
        url: semUrl + '/Templat/index',
        data: $qs.stringify({ pageSize: '100', currPage: '1' }),
        method: 'post'
      }).then(res => {
        this.templates = res.data.content.pageContent
      })
    },
    // 生成新页面
    cratePage () {
      this.$axios({
        url: semUrl + '/keyword/createOtherPage',
        method: 'post',
        data: $qs.stringify({
          keywordId: this.data.keywordId
        })
      }).then(res => {
        if (res.data.code === 10000) {
          this.data.destinationUrl = res.data.url
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 保存
    submit () {
      this.$refs.editKeyword.validate(v => {
        let {
          groupName,
          destinationUrl,
          sum,
          keywordId,
          showId,
          optStatus,
          publishTime,
          publishTimeStatus
        } = this.data
        this.$axios({
          url: semUrl + '/Keyword/updateKeyword',
          method: 'post',
          data: $qs.stringify({
            groupName,
            destinationUrl,
            sum,
            keywordId,
            showId,
            optStatus,
            publishTime,
            publishTimeStatus
          })
        }).then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            this.closeModal()
            this.updateList()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
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
