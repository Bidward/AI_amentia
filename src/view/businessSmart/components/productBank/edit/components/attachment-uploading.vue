<template>
  <div class="viewWrapper">
    <Row>
      <Col span="2" offset="2" class="title"><span>合同附件：</span></Col>
      <Col span="5">
      <Upload

        class="bzUpload"
        multiple
        :max-size="20480"
        :action="staticUrl+'/index.php'"
        name="fileData"
        style="width:100%"
        :show-upload-list="false"
        :on-success="(value)=> uploadFileSuccess(value)"
        :on-exceeded-size="(error)=>uploadErr(error)">
        <Button icon="ios-cloud-upload-outline" :disabled="type==='2'">单个文件不能超过20MB</Button>
    </Upload>
    <div v-for="(item,index) in enclosureFile" :key="index" style="font-size:14px;">
      <Icon v-show="type==='1'" v-if="enclosureFile.length>=1" type="ios-close-circle-outline" style="position: relative;left: 100%;top: 0px;color: red;" @click="deleteFile(index)" />
      <Tooltip placement="top">
        <a :href="item.attachmentUrl" :download="item.attachmentName"  style="text-overflow: ellipsis; display: inline-block; width: 180px; overflow: hidden; white-space: nowrap">{{item.attachmentName}}</a>
        <div slot="content" style="width: 200px; white-space:normal; word-break:break-all; word-wrap: break-word;">
            {{item.attachmentName}}
        </div>
      </Tooltip>
      <!-- <span><a :href="item.attachmentUrl">{{item.attachmentName}}</a></span> -->
    </div>
    </Col>
    <Col span="6" class="title"><span>质量认证：</span></Col>
      <Col span="5">
        <Upload

          class="bzUpload"
          multiple
          :max-size="20480"
          :show-upload-list="false"
          name="fileData"
          :on-success="(value)=> uploadPhotoSuccess(value)"
          :on-exceeded-size="(error)=>uploadErr(error)"
          :action="staticUrl+'/index.php'">
          <Button icon="ios-cloud-upload-outline" :disabled="type==='2'" style="width:100%">单个文件不能超过20MB</Button>
        </Upload>
        <div v-for="(item,index) in enclosurePic" :key="index" style="font-size:14px;">
          <Icon v-show="type==='1'" v-if="enclosurePic.length>=1" type="ios-close-circle-outline" style="position: relative;left: 98%;top: 0px;color: red;" @click="deleteImg(index)" />
          <Tooltip placement="top">
            <a :href="item.attachmentUrl" :download="item.attachmentName"  style="text-overflow: ellipsis; display: inline-block; width: 180px; overflow: hidden; white-space: nowrap">{{item.attachmentName}}</a>
            <div slot="content" style="width: 200px; white-space:normal; word-break:break-all; word-wrap: break-word;">
                {{item.attachmentName}}
            </div>
          </Tooltip>
          <!-- <span><a :href="item.attachmentUrl" download="">{{item.attachmentName}}</a></span> -->
        </div>
      </Col>
    </Row>
    <Row style="padding-top:3%;" v-if="type==='2'">
      <Col span="2" offset="2" class="title" v-if="showBtn">
        <span>附件判断：</span>
        </Col>
      <Col span="3" v-if="showBtn"><Button :type="successType" @click="changeAttachmentTrue">正确</Button><Button :type="errorType" @click="changeAttachmentFalse">错误</Button></Col>
      </Row>
  </div>
</template>
<script>
import { staticUrl, proBaseUrl } from '@/api/base.js'
export default {
  props: {
    productMessage: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      showBtn: true,
      staticUrl,
      successType: 'default',
      errorType: 'default',
      enclosurePic: [], // 上传的图片
      enclosureFile: [], // 上传的文件
      attachments: [],
      attachmentApproved: '', // 判断附件状态正确错误
      type: this.$route.query.type
    }
  },
  watch: {
    productMessage (newV) { // 回显附件赋值
      if (newV) {
        this.isOneortwo()
        if (this.type === '1') {
          for (let i in newV) {
            if (newV[i].attachmentType === 1) { // 类型为1是合同附件
              this.enclosureFile.push(newV[i])
            } else { // 否则为2就是质量认真
              this.enclosurePic.push(newV[i])
            }
          }
        }
      }
    }
  },
  mounted () {
    this.getAttachment()
  },
  methods: {
    // 获取附件 待办进入
    getAttachment () {
      this.isOneortwo()
      // this.type = this.$route.query.type
      let sendData = {
        id: this.$route.query.messageId || this.$route.query.showId
      }
      if (this.type === '2') {
        this.$axios({
          url: proBaseUrl + '/product/getAttachment',
          method: 'post',
          data: $qs.stringify(sendData)
        }).then(res => {
          if (res.data.code === 10000) {
            this.attachments = res.data.data
            if (this.attachments.length === 0) {
              this.showBtn = false
              this.attachmentApproved = true
            }
            for (let i in this.attachments) {
              if (this.attachments[i].attachmentType === 1) {
                this.enclosureFile.push({ attachmentName: this.attachments[i].attachmentName, attachmentUrl: this.attachments[i].attachmentUrl, attachmentType: '1' })
              } else {
                this.enclosurePic.push({ attachmentName: this.attachments[i].attachmentName, attachmentUrl: this.attachments[i].attachmentUrl, attachmentType: '2' })
              }
            }
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    // 图片上传成功
    uploadPhotoSuccess (response, file, fileList) {
      if (response.rel === true) {
        // 图片上传展示
        this.enclosurePic.push({
          attachmentUrl: staticUrl + '' + response.url,
          attachmentName: response.filename,
          attachmentType: '2'
        })
      } else {
        this.$Message.error('上传失败')
      }
    },
    // 附件上传成功
    uploadFileSuccess (response, file, fileList) {
      if (response.rel === true) {
        // 文件上传展示
        this.enclosureFile.push({
          attachmentUrl: staticUrl + '' + response.url,
          attachmentName: response.filename,
          attachmentType: '1'
        })
        // 传给后端
        // this.attachments.push({
        //   attachmentUrl: staticUrl + '' + response.url,
        //   attachmentName: response.filename,
        //   attachmentType: '1'
        // })
      } else {
        this.$Message.error('上传失败')
      }
    },
    // 附件超过20M
    uploadErr (error) {
      if (error.size > 20480) {
        this.$Message.error('文件超过20M')
      }
    },
    // 判断为第一人还是第二人
    isOneortwo () {
      let id = ''
      let showId = ''
      if (this.$route.query.type === '1' && this.$route.query.canPass === '未过白') {
        id = this.$route.query.id
        showId = Number(this.$route.query.showId)
        if (showId === -1) {
          console.log('暂无')
        } else {
          if (id > showId) {
            this.type = '2'
          }
        }
      } else {
        this.type = this.$route.query.type
      }
    },
    deleteImg (index) { // 删除质量认证
      this.enclosurePic.splice(index, 1)
    },
    deleteFile (index) { // 删除合同附件
      this.enclosureFile.splice(index, 1)
    },
    // 判断附件状态正确/错误
    changeAttachmentTrue () {
      this.attachmentApproved = true
      this.successType = 'success'
      this.errorType = 'default'
    },
    changeAttachmentFalse () {
      this.attachmentApproved = false
      this.errorType = 'error'
      this.successType = 'default'
    }
  }
}
</script>
<style lang="css" scoped>
  .rowPadding{
    margin-bottom:20px;
  }
  .title{
    text-align: right;
    line-height: 30px;
    margin-right: 10px;
    font-size: 14px;
  }
  .bzUpload{
    margin-top: 40px;

  }

</style>
