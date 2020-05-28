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
                    <Button icon="ios-cloud-upload-outline" :disabled="isBacklog">单个文件不能超过20MB</Button>
                </Upload>
                <!-- <p v-if="isBacklog"> -->
                <div v-for="(item,index) in attachment" :key="index">
                    <Icon
                        v-if="attachment.length>=1 && !isBacklog"
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
                    <!-- <a class="top" :href="item.attachmentUrl" :download="item.attachmentName">{{item.attachmentName}}</a> -->
                </div>
                <!-- </p> -->
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
                    <Button icon="ios-cloud-upload-outline" :disabled="isBacklog">单个文件不能超过20MB</Button>
                </Upload>
                <!-- <p v-if="isBacklog"> -->
                <div v-for="(item,index) in quality" :key="index">
                    <Icon
                        v-if="quality.length>=1 && !isBacklog"
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
                    <!-- <a class="top" :href="item.attachmentUrl" :download="item.attachmentName">{{item.attachmentName}}</a> -->
                </div>
                <!-- </p> -->
            </Col>
        </Row>
        <Row style="margin-top:2%" v-if="isBacklog">
            <div v-if="attachment.length !== 0 || quality.length!== 0">
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
import { biUrl, staticUrl } from '@/api/base.js'
export default {
  name: 'uploading',
  data () {
    return {
      staticUrl,
      attachment: [], // 附件
      quality: [], // 质量认证
      isBacklog: false,
      attachmentRight: true,
      successType: 'default',
      erroType: 'default',
      count: 0
    }
  },
  mounted () {
    this.getAttachment() // 获取附件
  },
  methods: {
    // 判断是正确还是错误
    getAttachment () {
      let isTwo = this.$route.query.id
      if (isTwo) {
        this.isBacklog = true
        let sendData = {
          type: 0, // type
          relatedId: this.$route.query.relatedId
        }
        this.$axios({
          url: biUrl + '/channel/showAttachment',
          method: 'post',
          data: $qs.stringify(sendData)
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.attachment = res.data.data.attachment || []
              this.quality = res.data.data.quality || []
            } else {
              this.$Message.error(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    // 附件上传成功
    uploadFileSuccess (response, file, fileList) {
      if (response.rel === true) {
        // 文件上传展示
        this.attachment.push({
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
        this.quality.push({
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
      this.attachment.splice(index, 1)
    },
    // 删除质量
    deleteImg (index) {
      this.quality.splice(index, 1)
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
.bzUpload {
    // margin-top: 40px;
}
.top {
    display: block;
}
</style>
