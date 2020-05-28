<template>
  <div class="viewWrapper viewWrapperNoTabs" id="editSimple">
    <Form ref="editSimpleExtension" :label-width="110" :model="extensionData" :rules="validate">
      <div class="selection" v-if="error.length>0">
        <h3>错误信息</h3>
        <Row>
          <Col span="12">
            <FormItem v-for="(err,index) in error" :key="index" class="low">
              <h4 class="red">{{err}}</h4>
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection">
        <h3>基础信息</h3>
        <Row>
          <Col span="12">
            <FormItem label="推广组" prop="groupName">
              <Input :disabled="true" v-model="extensionData.groupName" class="wd80" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="责任人" prop="owner">
              <Select filterable v-model="extensionData.owner" class="wd80">
                <Option
                  v-for="person in incumbencyUserList"
                  :value="person.nickname"
                  :key="person.id"
                >{{person.nickname}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="false">
          <Col span="12">
            <FormItem label="否定关键词" prop="phraseKeywords">
              <Input
                type="textarea"
                :rows="10"
                v-model="extensionData.phraseKeywords"
                class="wd80"
              />
              <span class="tip">
                <span :class="{red:phraseRowLength>200}">{{phraseRowLength}}</span>/200
              </span>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="精确否定关键词" prop="exactKeywords">
              <Input type="textarea" :rows="10" v-model="extensionData.exactKeywords" class="wd80" />
              <span class="tip">
                <span :class="{red:exactRowLength>400}">{{exactRowLength}}</span>/400
              </span>
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection">
        <h3>一般创意</h3>
        <Row>
          <Col span="12">
            <FormItem label="创意标题" prop="title">
              <Input v-model="extensionData.title" class="wd80" id="title">
                <span class="pointer" slot="append" @click="appendGroupName('title')">{ }</span>
              </Input>
              <span class="tip">
                <span
                  :class="{red:getStringLength(extensionData.title)>50}"
                >{{ getStringLength(extensionData.title)}}</span>/50
              </span>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="创意描述1" prop="description1">
              <Input v-model="extensionData.description1" id="description1" class="wd80">
                <span class="pointer" slot="append" @click="appendGroupName('description1')">{ }</span>
              </Input>
              <span class="tip">
                <span
                  :class="{red:getStringLength(extensionData.description1)>80}"
                >{{getStringLength(extensionData.description1)}}</span>/80
              </span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="创意描述2" prop="description2">
              <Input v-model="extensionData.description2" id="description2" class="wd80">
                <span class="pointer" slot="append" @click="appendGroupName('description2')">{ }</span>
              </Input>
              <span class="tip">
                <span
                  :class="{red:getStringLength(extensionData.description2)>80}"
                >{{getStringLength(extensionData.description2)}}</span>/80
              </span>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="链接网址" prop="destinationUrl">
              <Input :disabled="isEdit" v-model="extensionData.destinationUrl" class="wd80" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="显示网址" prop="displayUrl" v-show="false">
              <Input :disabled="isEdit" v-model="extensionData.displayUrl" class="wd80" />
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
import { baseUrl, semUrl } from '@/api/base.js'
import { getCharLength } from '../../tools'
export default {
  name: 'editSimple',
  data () {
    return {
      isEdit: true,
      groupId: -1, // 推广组id
      getCharLength: getCharLength,
      incumbencyUserList: [], // 在职人员名单
      error: [], // 错误信息提示
      extensionData: {
        groupName: '', // 推广组名称
        owner: '', // 责任人
        phraseKeywords: '', // 否定关键词
        exactKeywords: '', // 精确否定关键词
        title: '', // 创意标题
        description1: '', // 创意描述1
        description2: '', // 创意描述2
        destinationUrl: '', // 链接网址
        displayUrl: '' // 显示网址
      },
      validate: {
        groupName: [{ required: true, message: '必填', trigger: 'blur' }],
        owner: [{ required: true, message: '必填', trigger: 'change' }],
        phraseKeywords: [
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
        exactKeywords: [
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
        ],
        title: [
          {
            required: true,
            maxLength: 50,
            validator: this.validateLength,
            trigger: 'blur'
          }
        ],
        description1: [
          {
            required: true,
            trigger: 'blur',
            validator: this.validateLength,
            maxLength: 80
          }
        ],
        description2: [
          {
            required: true,
            validator: this.validateLength,
            maxLength: 80,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    this.getIncumbency()
    this.isEdit = true
    let groupId = this.$route.query.groupId
    this.groupId = groupId
    this.getData(groupId)
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
        } else if (a === '{' || a === '}') {
          // 左右大括号不算
          continue
        } else {
          l += 1
        }
      }
      return l
    },
    // 获取在职人员列表
    getIncumbency () {
      this.$axios({
        url: baseUrl + '/user/getIncumbencyTbUser',
        method: 'post'
      }).then(res => {
        this.incumbencyUserList = res.data.content
      })
    },
    // 回显数据
    getData (id) {
      this.$axios({
        url: semUrl + '/group/showGroup',
        method: 'get',
        params: { groupid: id }
      }).then(res => {
        let content = res.data.content
        let error =
          res.data.error && res.data.error.length > 0 ? res.data.error : []
        this.error = error
        content.phraseKeywords = arrToRow(content.phraseKeywords)
        content.exactKeywords = arrToRow(content.exactKeywords)
        this.extensionData = content
        // 先转换成换行的形式
        this.extensionDataBak = JSON.parse(JSON.stringify(this.extensionData))
        function arrToRow (v) {
          return v.replace(/,/g, '\n')
        }
      })
    },
    // 保存
    submit () {
      this.$refs.editSimpleExtension.validate(v => {
        // 深拷贝一份页面保存时候的数据
        let bakDataString = JSON.stringify(this.extensionDataBak)
        let oldDataString = JSON.stringify(this.extensionData)
        if (bakDataString === oldDataString) {
          this.$Message.error('没有任何改动')
          return
        }

        let oldData = JSON.parse(JSON.stringify(this.extensionData))
        oldData.phraseKeywords = oldData.phraseKeywords.split('\n')
        oldData.exactKeywords = oldData.exactKeywords.split('\n')
        // 一般创意和基础信息列表
        let sendData = {
          groupId: this.groupId,
          data: oldData
        }
        this.$axios({
          url: semUrl + '/group/uptSimpleGroup',
          method: 'post',
          data: $qs.stringify(sendData)
        }).then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            this.extensionDataBak = JSON.parse(
              JSON.stringify(this.extensionData)
            )
            this.closeRouter()
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.error(err)
          this.$Notice.warning({
            title: '数据异常，请联系技术人员'
          })
        })
      })
    },
    // 关闭当前页面
    closeRouter () {
      bus.$emit('on-myclose', this.$route)
    },
    // 增加推广组模板
    appendGroupName (key) {
      let domId = document.querySelectorAll(`#editSimple #${key} input`)[0]
      let inputIndex = domId.selectionStart
      let insertStr = (soure, start, newStr) => {
        return soure.slice(0, start) + newStr + soure.slice(start)
      }
      this.extensionData[key] = insertStr(
        this.extensionData[key],
        inputIndex,
        `{${this.extensionData.groupName}}`
      )
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
    }
  },
  computed: {
    // 否定关键词的的行数
    phraseRowLength () {
      let s = this.extensionData.phraseKeywords || ''
      return s.split('\n').length
    },
    // 精准否定关键词的长度
    exactRowLength () {
      let s = this.extensionData.exactKeywords || ''
      return s.split('\n').length
    }
  }
}
</script>
<style lang="less" scoped>
@import './extension.less';
</style>
