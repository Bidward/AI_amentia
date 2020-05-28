<template>
  <div class="viewWrapper semConfig">
    <Form
      :disabled="!isEdit"
      :label-width="380"
      :model="data"
      :rules="commonValidate"
      id="semCommonConfig"
      ref="semCommonConfig"
    >
      <div class="selection">
        <h3>精确/短语切换开关</h3>
        <Row>
          <Col span="12">
            <FormItem label="开关:" prop="phraseExactSwitch">
              <i-switch
                v-model="data.phraseExactSwitch"
                size="large"
                :true-value="1"
                :false-value="0"
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="排名判断:" prop="phraseExactCheckPosition">
              <InputNumber size="small" v-model="data.phraseExactCheckPosition" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="查询点击量排名前几的关键词是否存在竞品:" prop="phraseExactCheckTop">
              <InputNumber size="small" v-model="data.phraseExactCheckTop" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="竞品查询排除域名(多域名用;分隔):" prop="phraseExactExcludeCompetitors">
              <Input size="small" v-model="data.phraseExactExcludeCompetitors" />
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection">
        <h3>渠道号配置</h3>
        <Row>
          <Col span="12">
            <FormItem label="渠道号剩余数量预警:" prop="appidsSurplusNum">
              <InputNumber size="small" :disabled="!isEdit" v-model="data.appidsSurplusNum" :precision="0"/>
            </FormItem>
          </Col>
        </Row>
      </div>
    </Form>
    <div class="selection" style="text-align:center;">
      <Button class="btns" v-if="isEdit" @click="cancel">取消</Button>
      <Button class="btns" @click="closePage">关闭</Button>
      <Button class="btns" type="primary" v-if="isEdit" @click="submit">保存</Button>
      <Button class="btns" type="primary" v-else @click="isEdit=!isEdit">编辑</Button>
    </div>
  </div>
</template>

<script>
import { semUrl } from '@/api/base.js'
import { Track } from '@/libs/track.js'
const track = new Track('营销/配置/通用配置')

export default {
  name: 'semCommonConfig',
  data () {
    return {
      isEdit: false,
      data: {
        phraseExactSwitch: 1, // 开关
        phraseExactCheckPosition: 1.2, // 排名判断
        phraseExactCheckTop: 0, // 查询点击量排名前几的关键词是否存在竞品
        phraseExactExcludeCompetitors: '', // 竞品域名
        appidsSurplusNum: 0// 渠道号剩余数量预警
      },
      dataBak: {},
      commonValidate: {
        phraseExactSwitch: [
          { required: true, trigger: 'blur', message: '必填', type: 'number' }
        ],
        phraseExactCheckPosition: [
          { required: true, trigger: 'blur', message: '必填', type: 'number' }
        ],
        phraseExactCheckTop: [
          { required: true, trigger: 'blur', message: '必填', type: 'number' }
        ],
        phraseExactExcludeCompetitors: [
          { required: true, trigger: 'blur', message: '必填' }
        ]
      }
    }
  },
  mounted () {
    this.getMarketConfig()
    track.start()
  },
  methods: {
    //   获取配置
    getMarketConfig () {
      this.$axios({
        url: semUrl + '/Market/getMarketConfig',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            let content = res.data.data
            for (let key in content) {
              let isString = typeof content[key] === 'string'
              let isNumber = !isNaN(Number(content[key]))
              if (isString && isNumber) {
                content[key] = Number(content[key])
              }
            }
            this.data = content
            this.data.keywordTag = content.keywordTag || []
            this.dataBak = JSON.parse(JSON.stringify(this.data))
            this.$nextTick(() => {
              track.end()
            })
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 取消
    cancel () {
      if (JSON.stringify(this.data) !== JSON.stringify(this.dataBak)) {
        this.$Modal.confirm({
          title: '提示',
          content: '未保存，是否取消编辑？',
          onOk: () => {
            this.data = JSON.parse(JSON.stringify(this.dataBak))
            this.isEdit = false
          }
        })
      } else {
        this.data = this.dataBak
        this.isEdit = false
      }
    },
    // 关闭
    closePage () {
      bus.$emit('on-myclose', this.$route)
    },
    // 保存
    submit () {
      if (JSON.stringify(this.data) !== JSON.stringify(this.dataBak)) {
        let sendData = Object.assign(this.data, { nickname: this.nickname })
        this.$refs.semCommonConfig.validate(v => {
          if (v) {
            delete sendData.domain
            this.$axios({
              url: semUrl + '/Market/saveMarketConfig',
              method: 'post',
              data: $qs.stringify(sendData)
            })
              .then(res => {
                if (res.data.code === 10000) {
                  this.$Message.success(res.data.msg)
                  this.isEdit = false
                  this.getMarketConfig()
                } else {
                  this.$Message.error(res.data.msg)
                }
              })
              .catch(err => {
                console.warn(err)
              })
          } else {
            this.$Message.error('格式错误')
          }
        })
      } else {
        this.$Message.error('没有任何改动')
        this.isEdit = false
      }
    }
  }
}
</script>

<style>
</style>
