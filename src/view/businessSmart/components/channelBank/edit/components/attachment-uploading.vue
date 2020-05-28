<template>
    <div class="viewWrapper">
        <Row>
            <Col span="2" offset="2" class="title">
                <span>合同附件：</span>
            </Col>
            <Col span="5">
                <Upload
                    class="bzUpload"
                    multiple
                    :max-size="20480"
                    name="fileData"
                    :on-success="(value)=> uploadFileSuccess(value)"
                    :on-exceeded-size="uploadFileError"
                    :action="staticUrl+'/index.php'"
                    :show-upload-list="false"
                >
                    <Button icon="ios-cloud-upload-outline" :disabled="!isBacklog">单个文件不能超过20MB</Button>
                </Upload>
                <!-- 回显的附件 -->
                <div v-for="(item,index) in attachmentBack" :key="index">
                    <Icon
                        v-if="attachmentBack.length>=1 && isBacklog"
                        type="ios-close-circle-outline"
                        style="position: relative;left: 98%;top: 18px;color: red;"
                        @click="deleteFile(index)"
                    />
                    <Tooltip placement="top">
                      <a :href="item.attachmentUrl" :download="item.attachmentName"  style="text-overflow: ellipsis; display: inline-block; width: 180px; overflow: hidden; white-space: nowrap">{{item.attachmentName}}</a>
                      <div slot="content" style="width: 200px; white-space:normal; word-break:break-all; word-wrap: break-word;">
                          {{item.attachmentName}}
                      </div>
                    </Tooltip>
                    <!-- <a class="top" :href="item.attachmentUrl" download>{{item.attachmentName}}</a> -->
                </div>
            </Col>
            <Col span="6" class="title">
                <span>质量认证：</span>
            </Col>
            <Col span="5">
                <Upload
                    class="bzUpload"
                    multiple
                    :max-size="20480"
                    name="fileData"
                    :on-success="(value)=> uploadQualitySuccess(value)"
                    :on-exceeded-size="uploadQualityError"
                    :action="staticUrl+'/index.php'"
                    :show-upload-list="false"
                >
                    <Button icon="ios-cloud-upload-outline" :disabled="!isBacklog">单个文件不能超过20MB</Button>
                </Upload>
                <div v-for="(item,index) in qualityBack" :key="index">
                   <Icon
                        v-if="qualityBack.length>=1 && isBacklog"
                        type="ios-close-circle-outline"
                        style="position: relative;left: 98%;top: 18px;color: red;"
                        @click="deleteImg(index)"
                    />
                    <Tooltip placement="top">
                      <a :href="item.attachmentUrl" :download="item.attachmentName"  style="text-overflow: ellipsis; display: inline-block; width: 180px; overflow: hidden; white-space: nowrap">{{item.attachmentName}}</a>
                      <div slot="content" style="width: 200px; white-space:normal; word-break:break-all; word-wrap: break-word;">
                          {{item.attachmentName}}
                      </div>
                    </Tooltip>
                    <!-- <a class="top" :href="item.attachmentUrl" download>{{item.attachmentName}}</a> -->
                </div>
            </Col>
        </Row>
        <Row style="margin-top:2%" v-if="!isBacklog">
            <div v-if="attachmentBack.length !== 0 || qualityBack.length!== 0">
                <Col span="2" offset="2" class="title">
                    <span>附件判断：</span>
                </Col>
                <Col>
                    <Button :type="successType" @click="success">正确</Button>
                    <Button :type="erroType" @click="erro">错误</Button>
                </Col>
            </div>
        </Row>
    </div>
</template>
<script>
import { staticUrl } from '@/api/base.js'
export default {
  name: 'uploading',
  props: {
    attachments: {
      type: Array,
      default () {
        return []
      }
    },
    qualitys: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      staticUrl,
      attachment: [], // 附件
      quality: [], // 质量认证
      attachmentBack: [],
      qualityBack: [],
      attachmentRight: true,
      isBacklog: true, // 第一人第二人
      successType: 'default',
      erroType: 'default',
      count: 0
    }
  },
  watch: {
    attachments (newVal) {
      this.attachmentBack = newVal
    },
    qualitys (newVal) {
      this.qualityBack = newVal
    }
  },
  computed: {
    sendAttachment () {
      return this.attachment.concat(this.attachmentBack)
    },
    sendQuality () {
      return this.quality.concat(this.qualityBack)
    }
  },
  mounted () {
    this.isTwos()
  },
  methods: {
    // 判断是第一人还是第二人
    isTwos () {
      let isTwo = this.$route.query.id
      if (isTwo) {
        this.isBacklog = false
      } else {
        this.isBacklog = true
      }
    },
    // 附件上传成功
    uploadFileSuccess (response, file, fileList) {
      if (response.rel === true) {
        // 文件上传展示
        this.attachmentBack.push({
          attachmentUrl: staticUrl + '' + response.url,
          attachmentName: response.filename
        })
      } else {
        console.error(response.msg)
      }
    },
    // 上传文件超过20M
    uploadFileError (response, file, fileList) {
      if (response.size > 20480) {
        this.$Message.warning('文件上传失败 大小超过20M')
      }
    },
    // 质量认证附件上传成功
    uploadQualitySuccess (response, file, fileList) {
      if (response.rel === true) {
        // 文件上传展示
        this.qualityBack.push({
          attachmentUrl: staticUrl + '' + response.url,
          attachmentName: response.filename
        })
      } else {
        console.error(response.msg)
      }
    },
    // 质量认证上传文件超过20M
    uploadQualityError (response, file, fileList) {
      if (response.size > 20480) {
        this.$Message.error('文件上传失败 大小超过20M')
      }
    },
    // 附件确定
    success () {
      this.attachmentRight = true
      this.successType = 'success'
      this.erroType = 'default'
      this.count++
    },
    // 附件错误
    erro () {
      this.attachmentRight = false
      this.erroType = 'error'
      this.successType = 'default'
      this.count++
    },
    // 删除附件
    deleteFile (index) {
      this.attachmentBack.splice(index, 1)
    },
    deleteImg (index) {
      this.qualityBack.splice(index, 1)
    }
  }
}
</script>
<style lang="less" scoped>
.rowPadding {
    margin-bottom: 20px;
}
.title {
    text-align: right;
    line-height: 30px;
    margin-right: 10px;
    font-size: 14px;
}
.top {
    display: block;
}
</style>
