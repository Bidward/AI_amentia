<template>
  <div class="viewWrapper">
    <Row  v-if="type === '1'">
      <Col span="2" offset="2" class="title"><span>合同附件：</span></Col>
      <Col span="5">
      <Upload
        class="bzUpload"
        multiple
        :max-size="20480"
        :action="staticUrl+'/index.php'"
        :show-upload-list="false"
        name="fileData"
        :before-upload="handleBeforeUpload"
        :on-success="(value)=> uploadFileSuccess(value)"
        :on-exceeded-size="(error)=>uploadErr(error)">
        <Button icon="ios-cloud-upload-outline">单个文件不能超过20MB</Button>
    </Upload>
    <div v-for="(item,index) in enclosureFile" :key="index" style="font-size:14px;">
      <Icon v-if="enclosureFile.length>=1" type="ios-close-circle-outline" style="position: relative;left: 98%;top: 0px;color: red;" @click="deleteFile(index)" />
      <Tooltip placement="top">
        <a :href="item.attachmentUrl" :download="item.attachmentName" style="text-overflow: ellipsis; display: inline-block; width: 180px; overflow: hidden; white-space: nowrap">{{item.attachmentName}}</a>
        <div slot="content" style="width: 200px; white-space:normal; word-break:break-all; word-wrap: break-word;">
          {{item.attachmentName}}
        </div>
      </Tooltip>
      <!-- <span><a :href="item.attachmentUrl" :download="item.attachmentName">{{item.attachmentName}}</a></span> -->
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
          :before-upload="handleBeforeUpload"
          :on-success="(value)=> uploadPhotoSuccess(value)"
          :on-exceeded-size="(error)=>uploadErr(error)"
          :action="staticUrl+'/index.php'">
          <Button icon="ios-cloud-upload-outline">单个文件不能超过20MB</Button>
        </Upload>
        <div v-for="(item,index) in enclosurePic" :key="index" style="font-size:14px;">
          <Icon v-if="enclosurePic.length>=1" type="ios-close-circle-outline" style="position: relative;left: 98%;top: 0px;color: red;" @click="deleteImg(index)" />
          <Tooltip placement="top">
            <a :href="item.attachmentUrl" :download="item.attachmentName"  style="text-overflow: ellipsis; display: inline-block; width: 180px; overflow: hidden; white-space: nowrap">{{item.attachmentName}}</a>
            <div slot="content" style="width: 200px; white-space:normal; word-break:break-all; word-wrap: break-word;">
                {{item.attachmentName}}
            </div>
          </Tooltip>
          <!-- <span><a :href="item.attachmentUrl" :download="item.attachmentName">{{item.attachmentName}}</a></span> -->
        </div>
        <!-- 图片展示<viewer  :images="picUrl">
          <div style="width:360px;display:flex;flex-wrap:wrap;">
              <div v-for="(item1,index) in picUrl" :key="index">
                <Icon v-if="picUrl.length>=1" type="ios-close-circle-outline" style="position: relative;left: 86px;top: -80px;color: red;" @click="deleteImg(index)" />
                <img  v-if="picUrl.length>=1" style="width: 70px;height: 70px;margin: 10px;" :src="item1.attachmentUrl" class="inputbox">
              </div>
          </div>
      </viewer> -->
    </Col>
    </Row>
    <Row v-if="type === '2'">
      <Row>
      <Col span="2" offset="2" class="title"><span>合同附件：</span></Col>

      <Col span="5">
        <Upload
          class="bzUpload"
          multiple
          :max-size="20480"
          :show-upload-list="false"
          name="fileData"
          :before-upload="handleBeforeUpload"
          :on-success="(value)=> uploadPhotoSuccess(value)"
          :on-exceeded-size="(error)=>uploadErr(error)"
          :action="staticUrl+'/index.php'">
          <Button icon="ios-cloud-upload-outline" :disabled="type==='2'" style="width:100%">单个文件不能超过20MB</Button>
        </Upload>
        <div v-for="(item,index) in fileUrl" :key="index">
          <Tooltip placement="top">
            <a :href="item.attachmentUrl" :download="item.attachmentName"
              style="width: 200px; overflow: hidden;">{{item.attachmentName}}</a>
            <div slot="content" style="width: 200px; white-space:normal; word-break:break-all; word-wrap: break-word;">
                {{item.attachmentName}}
            </div>
          </Tooltip>
          <!-- <span><a :href="item.attachmentUrl" class="file" :download="item.attachmentName">{{item.attachmentName || 'zanuw'}}</a></span> -->
        </div>
      </Col>
      <Col span="6" class="title"><span>质量认证：</span></Col>
      <!-- <viewer  :images="picUrl">
          <div style="width:360px;display:flex;flex-wrap:wrap;">
              <div v-for="(item1,index) in picUrl" :key="index">
                <img  v-if="picUrl.length>=1" style="width: 70px;height: 70px;margin: 10px;" :src="item1.attachmentUrl" class="inputbox">
              </div>
          </div>
      </viewer> -->
      <Col span="5">
        <Upload
          class="bzUpload"
          multiple
          :max-size="20480"
          :show-upload-list="false"
          name="fileData"
          :before-upload="handleBeforeUpload"
          :on-success="(value)=> uploadPhotoSuccess(value)"
          :on-exceeded-size="(error)=>uploadErr(error)"
          :action="staticUrl+'/index.php'">
          <Button icon="ios-cloud-upload-outline" :disabled="type==='2'" style="width:100%">单个文件不能超过20MB</Button>
        </Upload>
        <div v-for="(item,index) in picUrl" :key="index">
          <Tooltip placement="top">
            <a :href="item.attachmentUrl" :download="item.attachmentName"
            style="width: 200px; overflow: hidden;">{{item.attachmentName}}</a>
            <div slot="content" style="width: 200px; white-space:normal; word-break:break-all; word-wrap: break-word;">
                {{item.attachmentName}}
            </div>
          </Tooltip>
          <!-- <span><a :href="item.attachmentUrl" class="file" :download="item.attachmentName">{{item.attachmentName}}</a></span> -->
        </div>
      </Col>
      </Row>
      <br />
      <br />
      <br />
      <Col span="2" offset="2" class="title" v-if="showBtn">
        <span>附件判断：</span>
      </Col>
      <Col v-if="showBtn"><Button :type="successType" @click="changeAttachmentTrue">正确</Button><Button :type="errorType" @click="changeAttachmentFalse">错误</Button></Col>
    </Row>
  </div>
</template>
<script>
import { staticUrl, proBaseUrl } from '@/api/base.js'
export default {
  data () {
    return {
      staticUrl,
      successType: 'default',
      errorType: 'default',
      showBtn: true,
      enclosurePic: [], // 质量认证
      enclosureFile: [], // 附件上传
      attachments: [],
      picUrl: [], // 展示图片
      fileUrl: [], // 展示文件
      type: '1', // 第一人或第二人
      attachmentApproved: ''
    }
  },
  mounted () {
    this.getAttachment()
    // this.isOneortwo()
  },
  methods: {
    // 质量认证上传成功
    uploadPhotoSuccess (response, file, fileList) {
      if (response.rel === true) {
        this.enclosurePic.push({
          attachmentUrl: staticUrl + '' + response.url,
          attachmentName: response.filename,
          attachmentType: '2'
        })
        this.attachments.push({
          attachmentUrl: staticUrl + '' + response.url,
          attachmentName: response.filename,
          attachmentType: '2'
        })
        // this.picUrl = []
        // for (let i in this.attachments) {
        //   if (this.attachments[i].attachmentType === '2') {
        //     this.picUrl.push(this.attachments[i])
        //   }
        // }
      } else {
        this.$Message.error('上传失败')
      }
      // console.log(this.attachments)
    },
    // 附件上传成功
    uploadFileSuccess (response, file, fileList) {
      if (response.rel === true) {
        // 文件上传展示
        let index = this.enclosureFile.findIndex(f => f.attachmentName === response.filename)
        if (index < 0) {
          this.enclosureFile.push({
            attachmentUrl: staticUrl + '' + response.url,
            attachmentName: response.filename,
            attachmentType: '1'
          })
        }
        this.attachments.push({
          attachmentUrl: staticUrl + '' + response.url,
          attachmentName: response.filename,
          attachmentType: '1'
        })
        // this.fileUrl = []
        // for (let i in this.attachments) {
        //   if (this.attachments[i].attachmentType === '1') {
        //     this.fileUrl.push(this.attachments[i])
        //   }
        // }
      } else {
        this.$Message.error('上传失败')
      }
    },

    // 获取附件
    getAttachment () {
      this.type = this.$route.query.type
      let sendData = {
        id: this.$route.query.messageId
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
                this.fileUrl.push({ attachmentName: this.attachments[i].attachmentName, attachmentUrl: this.attachments[i].attachmentUrl })
              } else {
                this.picUrl.push({ attachmentName: this.attachments[i].attachmentName, attachmentUrl: this.attachments[i].attachmentUrl })
              }
            }
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    deleteImg (index) {
      this.enclosurePic.splice(index, 1)
      // this.picUrl.splice(index,1)
    },
    deleteFile (index) { // 删除合同附件
      this.enclosureFile.splice(index, 1)
    },
    uploadErr (error) {
      if (error.size > 20480) {
        this.$Message.error('文件超过20M')
      }
    },
    // 判断为第一人还是第二人
    // isOneortwo(){
    //   console.log(this.$route.query.secondId)
    //   console.log(this.$route.query.showId)
    // },
    // 判断附件状态正确
    changeAttachmentTrue () {
      this.attachmentApproved = true
      this.successType = 'success'
      this.errorType = 'default'
    },
    changeAttachmentFalse () {
      this.attachmentApproved = false
      this.errorType = 'error'
      this.successType = 'default'
    },

    handleBeforeUpload (file) {
      // this.enclosureFile.findIndex(f => f.attachmentName === file.)
    }
  }
}
</script>
<style lang="less" scoped>
  .rowPadding{
    margin-bottom:20px;
  }
  .title{
    text-align: right;
    line-height: 30px;
    margin-right: 10px;
    font-size: 14px;
  }
  // .bzUpload{
  //   margin-top: 40px;
  // }
  .file{
    display: block;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }

</style>
