<template>
  <div class="viewWrapper viewWrapperNoTabs" id="editSimple">
    <Form ref="editSimpleExtension" :label-width="110" :model="extensionData" :rules="validate">
      <div class="selection">
        <h3>基础信息</h3>
        <Row>
          <Col span="12">
            <FormItem label="产品名" prop="softname">
              <Input :disabled="true" v-model="extensionData.softname" class="wd80" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="责任人" prop="owner">
              <Input :disabled="true" v-model="extensionData.owner" class="wd80"/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="否定关键词" prop="negative_words">
              <Input
                type="textarea"
                :rows="10"
                v-model="extensionData.negative_words"
                class="wd80"
              />
              <span class="tip">
                <span :class="{red:phraseRowLength>200}">{{phraseRowLength}}</span>/200
              </span>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="精确否定关键词" prop="exactnegative_words">
              <Input
                type="textarea"
                :rows="10"
                v-model="extensionData.exactnegative_words"
                class="wd80"
              />
              <span class="tip">
                <span :class="{red:exactRowLength>400}">{{exactRowLength}}</span>/400
              </span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22">
            <FormItem label="备注" prop="sum">
              <Input type="textarea" :rows="10" v-model="extensionData.sum" />
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection saveBox">
        <div class="save">
          <Button class="btns" @click="closeRouter">取消</Button>
          <Button class="btns" type="primary" @click="submit()">保存</Button>
        </div>
      </div>
    </Form>
  </div>
</template>
<script>
import { semUrl } from '@/api/base.js'
import { getCharLength } from '../../tools'
export default {
  name: 'softwareDatail',
  data () {
    return {
      isEdit: true,
      getCharLength: getCharLength,
      extensionData: {
        softname: '', // 软件名
        owner: '', // 责任人
        negative_words: '', // 否定关键词
        exactnegative_words: '', // 精确否定关键词
        sum: ''
      },
      validate: {
        groupName: [{ required: true, message: '必填', trigger: 'blur' }],
        owner: [{ required: true, message: '必填', trigger: 'change' }],
        negative_words: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let arr = value.split('\n')
              arr.some((e, index) => {
                if (getCharLength(e) > 40) {
                  callback(new Error(`第${index + 1}行超过40个字`))
                  return true
                }
              })
              if (this.phraseRowLength > 200) {
                callback(new Error('最多200行'))
              } else {
                callback()
              }
            }
          }
        ],
        exactnegative_words: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let arr = value.split('\n')
              arr.some((e, index) => {
                if (getCharLength(e) > 40) {
                  callback(new Error(`第${index + 1}行超过40个字`))
                  return true
                }
              })
              if (this.exactRowLength > 200) {
                callback(new Error('最多400行'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  mounted () {
    this.isEdit = true
    let id = this.$route.query.id
    this.getData(id)
  },
  methods: {
    // 回显数据
    getData (id) {
      this.$axios({
        url: semUrl + '/group/getSoftName',
        method: 'get',
        params: { id }
      }).then(res => {
        let content = res.data.content
        content.negative_words = arrToRow(content.negative_words)// 否定关键词
        content.exactnegative_words = arrToRow(content.exactnegative_words)// 精确否定关键词
        this.extensionData = content
        // 先转换成换行的形式
        this.extensionDataBak = JSON.parse(JSON.stringify(this.extensionData))
        function arrToRow (v) {
          return v.join('\n')
        }
      })
    },
    // 保存
    submit () {
      let sendData = JSON.parse(JSON.stringify(this.extensionData))
      sendData.negative_words = sendData.negative_words.split('\n')
      sendData.exactnegative_words = sendData.exactnegative_words.split('\n')
      this.$axios({
        url: semUrl + '/group/setSoftName',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.$Message.success('保存成功')
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
        this.$Notice.warning({
          title: '数据异常，请联系技术人员'
        })
      })
    },
    // 关闭当前页面
    closeRouter () {
      bus.$emit('on-myclose', this.$route)
    }
  },
  computed: {
    // 否定关键词的的行数
    phraseRowLength () {
      let s = this.extensionData.negative_words || ''
      return s.split('\n').length
    },
    // 精准否定关键词的长度
    exactRowLength () {
      let s = this.extensionData.exactnegative_words || ''
      return s.split('\n').length
    }
  }
}
</script>
<style lang="less" scoped>
@import '../extension/extension.less';
</style>
