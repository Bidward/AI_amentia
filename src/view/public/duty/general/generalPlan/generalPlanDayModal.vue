<template>
  <div>
    <Form v-if="feedback.length!==0" :label-width="80">
          <Row>
                <Col span="12">
                      <FormItem label="分类：">
                            <span v-if="feedback.type===1">重点工作</span>
                            <span v-if="feedback.type===2">专项工作</span>
                      </FormItem>
                </Col>
                <Col span="12">
                      <FormItem label="专项工作：">
                            <span v-if="feedback.type===1">重点工作</span>
                            <span v-if="feedback.type===2">专项工作</span>
                      </FormItem>
                </Col>
          </Row>
          <Row>
                <Col span="12">
                      <FormItem label="开始时间：">{{feedback.workTime}}</FormItem>
                </Col>
                <Col span="12">
                      <FormItem label="工作要求：">{{feedback.workRequirement}}</FormItem>
                </Col>
          </Row>
          <Row>
                <Col span="12">
                      <FormItem label="频率：">{{feedback.rateContent}}</FormItem>
                </Col>
                <Col span="12">
                      <FormItem label="事项进度：">
                            <InputNumber
                                  :max="100"
                                  v-model="feedback.itemSchedule"
                                  :formatter="value => `${value}%`"
                                  :parser="value => value.replace('%', '')">
                            </InputNumber>
                      </FormItem>
                </Col>
          </Row>
          <Row>
                <Col span="22">
                        <FormItem label="*工作结果">
                            <span slot="label"><i style="color: red">*</i>工作结果</span>
                            <Input v-model="feedback.resultContent" type="textarea"/>
                        </FormItem>
                </Col>
          </Row>
          <Row>
                <Col span="22">
                      <FormItem label="附件：">
                            <Upload
                                  multiple
                                  name="fileData"
                                  :max-size="20480"
                                  :show-upload-list="false"
                                  :on-success="(response, file, fileList)=> uploadSuccess(response, file, fileList)"
                                  :action="staticUrl+'/index.php'">
                                  <Button icon="ios-cloud-upload-outline">单个文件不能超过20M</Button>
                            </Upload>
                            <ul v-if="feedback.stationEnclosuresList && feedback.stationEnclosuresList.length">
                                  <li
                                        v-for="(item, index) in feedback.stationEnclosuresList"
                                        :key="item.id"
                                        @mouseenter="showCancel(index)"
                                        @mouseleave="activeAttachmentIndex = -1"
                                        >
                                        <a :href="staticUrl + item.enclosureUrl" :download="item.enclosureName">{{item.enclosureName}}</a>
                                        <Icon
                                        type="md-close-circle"
                                        class="pointer"
                                        v-if="activeAttachmentIndex == index"
                                        @click="deleteAttachment(index)"/>
                                  </li>
                            </ul>
                      </FormItem>
                </Col>
          </Row>
    </Form>
    <Row>
          <Col span="22" style="text-align: center">
                <Button type="primary" @click="saveFeedback">保存</Button>
          </Col>
    </Row>
  </div>
</template>

<script>
import { baseUrl, staticUrl } from '@/api/base.js'
export default {
  name: 'generalPlanDayModal',
  props: {
    feedBackId: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      feedback: [],
      staticUrl,
      activeAttachmentIndex: -1,
      stationEnclosuresList: []
    }
  },
  mounted () {
    this.getFeedback()
  },
  methods: {
    getFeedback () {
      this.$axios({
        url: baseUrl + '/station/getSingleDayStationSearch',
        method: 'post',
        data: $qs.stringify({ objectId: this.feedBackId })
      })
        .then(res => {
          if (res.data.code === 10000) {
            // this.$Message.success(res.data.msg)
            this.feedback = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
    },
    // 显示附件删除按钮
    showCancel (index) {
      this.activeAttachmentIndex = index
    },
    // 删除附件
    deleteAttachment (index) {
      this.feedback.stationEnclosuresList.splice(index, 1)
      this.uploadAttachment()
    },
    // 添加附件
    uploadSuccess (response, file, fileList) {
      let imgs = {
        enclosureName: file.name,
        enclosureUrl: response.url
      }
      this.feedback.stationEnclosuresList.push(imgs)
      this.uploadAttachment()
    },
    uploadAttachment () {
      let sendData = {
        resultId: Number(this.feedBackId),
        enclosure: this.feedback.stationEnclosuresList
      }
      console.log(sendData)
      this.$axios({
        url: baseUrl + '/stationSceen/uploadAttachment',
        method: 'post',
        data: sendData
      })
        .then(res => {
          if (res.data.code === 10000) {
            // this.$Message.success(res.data.msg)
            this.getFeedback()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
    },
    // 保存反馈
    saveFeedback () {
      if (this.feedback.resultContent !== '') {
        let sendData = {
          objectId: this.feedBackId,
          itemSchedule: this.feedback.itemSchedule,
          content: this.feedback.resultContent
        }
        this.$axios({
          url: baseUrl + '/station/updateStationResultDetail',
          method: 'post',
          data: $qs.stringify(sendData)
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.$emit('refresh')
            } else {
              this.$Message.error(res.data.msg)
            }
          })
      } else {
        this.$Message.error('工作结果不能为空')
      }
    }
  }
}
</script>
