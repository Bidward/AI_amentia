<template>
    <div class="viewWrapper" style="position: relative">
        <Spin size="large" fix v-if="spinShow"></Spin>
        <div class="content">
            <Row style="margin: 30px 0">
                <Col span="1">
                    <Icon style="color: #19aa8d" type="md-school" size="26" />
                </Col>
                <Col span="14">
                    <span class="backTitle">工作计划详情</span>
                </Col>
            </Row>
            <div class="main" v-if="feedback.length!==0">
                <Row>
                    <Col span="3" class="titles">分类：</Col>
                    <Col span="6">
                        <span v-if="feedback.type===1">重点工作</span>
                        <span v-if="feedback.type===2">专项工作</span>
                    </Col>
                    <Col span="3" class="titles">专项工作：</Col>
                    <Col span="9">{{feedback.workMatter}}</Col>
                </Row>
                <Row>
                    <Col span="3" class="titles">开始时间：</Col>
                    <Col span="6">{{feedback.workTime}}</Col>
                    <Col span="3" class="titles">工作要求：</Col>
                    <Col span="6">{{feedback.workRequirement}}</Col>
                </Row>
                <Row>
                    <Col span="3" class="titles">频率：</Col>
                    <Col span="6">
                        {{feedback.rateContent}}
                    </Col>
                    <Col span="3" class="titles">事项进度：</Col>
                    <Col span="4">
                        <InputNumber
                          v-if="isEdit"
                          :max="100"
                          :precision="0"
                          :min="0"
                          :step="10"
                          v-model="feedback.itemSchedule"
                          :formatter="value => `${value}%`"
                          :parser="value => value.replace('%', '')"></InputNumber>
                        <div v-else>{{feedback.itemSchedule}}%</div>
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="titles">工作结果：</Col>
                    <Col span="11">
                        <Input
                          v-if="isEdit"
                          v-model="feedback.resultContent"
                          type="textarea"
                          :autosize="{minRows: 3}"
                        />
                        <div v-else style="word-wrap: break-word;">
                          {{feedback.resultContent}}
                          <!-- <pre style="text-align: left; white-space: pre-wrap; word-wrap: break-word;">{{feedback.resultContent}}</pre> -->
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span="3" class="titles">上传附件：</Col>
                    <Col span="7">
                        <Upload
                            name="fileData"
                            :show-upload-list="true"
                            :max-size="20480"
                            :on-success="(response, file, fileList)=> uploadSuccess(response, file, fileList)"
                            :on-exceeded-size="uploadFileError"
                            :action="staticUrl+'/index.php'">
                            <Button v-if="myself===userIdProps" icon="ios-cloud-upload-outline">单个文件不能超过20M</Button>
                        </Upload>
                    </Col>
                    <Col span="6" offset="2">
                        <ul v-if="feedback.stationEnclosuresList && feedback.stationEnclosuresList.length">
                            <li
                                v-for="(item, index) in feedback.stationEnclosuresList"
                                :key="item.id"
                                @mouseenter="showCancel(index)"
                                @mouseleave="activeAttachmentIndex = -1"
                                class="enclosuresList"
                                >
                                <Icon
                                    type="ios-close"
                                    class="close-icon"
                                    v-if="activeAttachmentIndex == index && myself===userIdProps"
                                    @click="deleteAttachment(index)"/>
                                <Tooltip placement="top">
                                    <a :href="staticUrl + item.enclosureUrl" :download="item.enclosureName" style="width: 220px">{{item.enclosureName}}</a>
                                    <div slot="content" style="width: 220px; white-space:normal; word-break:break-all; word-wrap: break-word;">
                                        {{item.enclosureName}}
                                    </div>
                                </Tooltip>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </div>
            <Row>
                <Col span="16" class="goBack">
                    <Button v-if="myself===userIdProps" type="primary" @click="notTrigger">未触发</Button>
                    <Button v-if="isEdit" type="primary" @click="saveFeedback" :loading="loading">保存</Button>
                    <Button type="primary" size="default" v-if="!isEdit && myself===userIdProps" @click="clickEdit">编辑</Button>
                    <Button size="default" v-else-if="isEdit && myself===userIdProps" @click="cancelEdit">取消编辑</Button>
                    <Button @click="goBack">返回</Button>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
import { baseUrl, staticUrl } from '@/api/base.js'
export default {
  name: 'planDayDetail',
  data () {
    return {
      myself: this.$store.state.user.userId,
      userIdProps: Number(this.$route.query.userIdProps),
      isEdit: false,
      activeAttachmentIndex: -1,
      feedback: [],
      initData: [],
      staticUrl,
      stationEnclosuresList: [],
      spinShow: false,
      loading: false
    }
  },
  mounted () {
    this.getFeedback()
  },
  methods: {
    clickEdit () {
      this.isEdit = true
      this.feedback.itemSchedule = 100
    },
    cancelEdit () {
      this.spinShow = true
      this.isEdit = false
      this.feedback = JSON.parse(JSON.stringify(this.initData))
      this.getdAttachment(this.$route.query.id)
    },
    getFeedback () {
      this.spinShow = true
      this.$axios({
        url: baseUrl + '/station/getSingleDayStationSearch',
        method: 'post',
        data: $qs.stringify({ objectId: this.$route.query.id })
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.initData = res.data.content
            this.feedback = JSON.parse(JSON.stringify(this.initData))
            this.spinShow = false
          } else {
            this.$Message.error(res.data.msg)
          }
        })
    },
    // 显示附件删除按钮
    showCancel (index) {
      this.activeAttachmentIndex = index
    },
    // 上传文件超过20M
    uploadFileError () {
      this.$Message.error('上传失败，文件超过20M')
    },
    // 删除附件
    deleteAttachment (index) {
      this.$Modal.confirm({
        title: '提醒',
        content: '确定删除该附件吗？',
        width: '340px',
        onOk: () => {
          this.spinShow = true
          let data = JSON.parse(JSON.stringify(this.feedback.stationEnclosuresList))
          data.splice(index, 1)
          this.uploadAttachment(0, data)
        }
      })
    },
    // 添加附件
    uploadSuccess (response, file, fileList) {
      let data = JSON.parse(JSON.stringify(this.feedback.stationEnclosuresList))
      data.push({
        enclosureName: file.name,
        enclosureUrl: response.url
      })
      this.uploadAttachment(1, data)
    },
    // 1添加，0删除
    uploadAttachment (status, data) {
      let sendData = {
        resultId: Number(this.$route.query.id),
        enclosure: data
      }
      let msg = status ? '添加附件成功' : '删除附件成功'
      this.$axios({
        url: baseUrl + '/stationSceen/uploadAttachmentNew',
        method: 'post',
        data: sendData
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(msg)
            this.getdAttachment(this.$route.query.id)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
    },
    getdAttachment (id) {
      this.$axios({
        url: baseUrl + `/stationSceen/getUploadAttachment?resultId=${id}`,
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.feedback.stationEnclosuresList = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
          this.spinShow = false
        })
    },
    // 保存反馈
    saveFeedback () {
      this.loading = true
      let sendData = {
        objectId: this.$route.query.id,
        itemSchedule: this.feedback.itemSchedule,
        content: this.feedback.resultContent
      }

      if (sendData) {
        this.$axios({
          url: baseUrl + '/station/updateStationResultDetail',
          method: 'post',
          data: $qs.stringify(sendData)
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.loading = false
              this.isEdit = false
              this.getFeedback()
            } else {
              this.loading = false
              this.$Message.error(res.data.msg)
            }
          })
      }
    },
    notTrigger () {
      this.$Modal.confirm({
        title: '提醒',
        content: '是否确认该事项未触发',
        onOk: () => {
          this.$axios({
            url: baseUrl + `/station/updateSingleDayStationEditStatus?id=${this.feedback.objectId}`,
            method: 'get'
          })
            .then(res => {
              if (res.data.code === 10000) {
                // console.log(res)
              } else {
                this.$Message.error(res.data.msg)
              }
            })
          this.$router.go(-1)
          bus.$emit('on-myclose', this.$route)
        }
      })
    },
    goBack () {
      if (this.isEdit) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>正处于编辑状态，确定要返回吗？</p>',
          onOk: () => {
            // this.$router.push({ name: 'duty' })
            this.$router.go(-1)
            bus.$emit('on-myclose', this.$route)
          }
        })
      } else {
        this.$router.go(-1)
        bus.$emit('on-myclose', this.$route)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content {
    width: 80%;
    margin: auto;
    padding: 20px 0;
    .backTitle {
        display: block;
        line-height: 28px;
        font-size: 17px;
    }
    .main>div{
        margin-bottom: 30px;
        .titles {
            text-align: right;
        }
    }
    .enclosuresList {
        position: relative;
        display: block;
        padding: 4px 0;
        border-radius: 3px;
        &:hover {
            background: #f3f3f3;
        }
        a {
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 90%;
        }
        .close-icon {
            position: absolute;
            right: 0;
            margin-right: 2px;
            font-size: 18px;
            cursor: pointer;
            z-index: 1;
        }
    }
    .goBack{
        text-align: center
    }
}
</style>
