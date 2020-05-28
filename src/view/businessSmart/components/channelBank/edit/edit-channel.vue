<template>
    <div class="viewWrapper" style="padding:20px">
        <!-- 渠道信息 -->
        <Row>
            <Col span="12" offset="5" class="headerWithGreenbar">渠道信息</Col>
        </Row>
        <channelInfo ref="channelInfo" :channelInfo="channelInfo" :errorInfo="errorInfo"></channelInfo>
        <!-- 联系人列表 -->
        <Row>
            <Col span="12" offset="5" class="headerWithGreenbar">联系人列表</Col>
        </Row>
        <Row>
            <addContract ref="getContractMsg" :contractData="contractMsg" :errorInfo="errorInfo"></addContract>
        </Row>
        <!-- 标签 -->
        <Row>
            <Col span="12" offset="5" class="headerWithGreenbar" :errorInfo="errorInfo">标签</Col>
        </Row>
        <Row>
            <labelManage ref="lableInfo" :lableInfo="lableInfo" :errorInfo="errorInfo"></labelManage>
        </Row>
        <!-- 开票信息 -->
        <Row>
            <Col span="12" offset="5" class="headerWithGreenbar">
                <span>开票信息</span>
            </Col>
        </Row>
        <Row>
            <invoiceInfo ref="getInvoiceMsg" :invoiceData="invoiceMsg" :errorInfo="errorInfo" />
        </Row>
        <!-- 合同信息 -->
        <Row>
            <Col span="12" offset="5" class="headerWithGreenbar">
                <span>合同信息</span>
            </Col>
        </Row>
        <contractInfo ref="contractInfo" :contractInfo="contractInfo" :errorInfo="errorInfo"></contractInfo>
        <!-- 附件上传 -->
        <Row>
            <Col span="12" offset="5" class="headerWithGreenbar">
                附件上传
                <span class="info">已合作必填项</span>
            </Col>
        </Row>
        <Row>
            <AttachmentUploading
                ref="uploading"
                :attachments="attachment"
                :qualitys="quality"
                :errorInfo="errorInfo"
            />
        </Row>
        <!-- 备注  -->
        <Row>
            <Col span="12" offset="5" class="headerWithGreenbar">备注</Col>
        </Row>
        <Row class="rowPadding">
            <Col span="15" offset="4">
                <Input v-model="remark" type="textarea" clearable :class="{isRed:remarkRed}" maxlength="500" show-word-limit></Input>
            </Col>
        </Row>
        <!-- 日志区 -->
        <Row>
            <Col span="24">
                <OpLogs :task-logs="channelLog" class="taskLogs" @click.native="getLog" />
            </Col>
        </Row>
        <!-- 按钮  -->
        <Row class="position">
            <Col span="5" class="btn">
                <Card style="width: 240px">
                    <div style="text-align:center">
                        <Button @click="goBack"  style="margin-right:60px">返回</Button>
                        <Button type="primary" @click="saveData">保存</Button>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
import addContract from './components/add-contact' // 新建联系人
import labelManage from './components/label' // 标签
import invoiceInfo from './components/invoice-Info' // 开票信息
import channelInfo from './components/channel-lnfo' // 渠道信息
import contractInfo from './components/contract-info' // 合同信息
import AttachmentUploading from './components/attachment-uploading' // 上传附件
import OpLogs from '../../op-log' // 日志
import { biUrl } from '@/api/base.js'
export default {
  name: 'addChannel',
  inject: ['app'],
  components: {
    addContract,
    labelManage,
    invoiceInfo,
    channelInfo,
    contractInfo,
    AttachmentUploading,
    OpLogs
  },
  data () {
    return {
      channelInfo: {}, // 渠道信息
      contractMsg: [], // 联系人
      lableInfo: {}, // 标签
      invoiceMsg: [], // 开票信息
      contractInfo: {}, // 合同信息
      attachment: [], // 附件
      quality: [], // 质量认证
      remark: '', // 备注
      channelLog: [], // 日志
      errorInfo: {}, // 错误数据用来标红
      relatedIds: '',
      remarkRed: false
    }
  },
  // 如果路由中有待办id，则是从待办进来的，解锁并清除sessionStorage
  destroyed () {
    let id = sessionStorage.getItem('editBacklogId') || ''
    if (id.length > 0) {
      this.clearLock()
      sessionStorage.removeItem('editBacklogId')
    }
  },
  mounted () {
    this.checkBackLog()
  },
  methods: {
    // 解锁页面
    clearLock () {
      let sendData = {
        backLogId: sessionStorage.editBacklogId
      }
      this.$axios({
        url: biUrl + '/backlog/relaseBackLog',
        data: $qs.stringify(sendData),
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          // console.log(res)
        } else {
          this.$Message.error(resp.data.msg)
        }
      })
    },
    // 判断是否从待办跳来的
    checkBackLog () {
      let query = this.$route.query.id || ''
      // 如果路由id为空，不是待办来的，正常请求数据接口
      if (query.length === 0) {
        this.getData()
      } else {
        this.checkBackLogStatus() // 检查代办状态
        sessionStorage.setItem('editBacklogId', this.$route.query.id) // 在session存待办id，解锁时用
      }
    },
    // 检查代办状态
    checkBackLogStatus () {
      let sendData = {
        type: this.$route.query.type,
        channelId: this.$route.query.channelId,
        backLogId: this.$route.query.id
      }
      this.$axios({
        url: biUrl + '/backlog/checkBackLogStatus',
        data: $qs.stringify(sendData),
        method: 'post'
      }).then(resp => {
        if (resp.data.code === 10000) {
          let status = resp.data.data
          if (status) {
            this.getData()
          } else {
            this.$router.go(-1)
            bus.$emit('on-myclose', this.$route)
            this.$Message.error(resp.data.msg)
          }
        } else {
          this.$Message.error(resp.data.msg)
        }
      })
    },
    // 获取数据
    getData () {
      let sendData = {
        channelId: this.$route.query.channelId,
        type: this.$route.query.type,
        relatedId: this.$route.query.relatedId
      }
      this.$axios({
        url: biUrl + '/channel/showDetail',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            let data = res.data.data
            this.channelInfo = data.channel // 渠道信息
            this.remark = data.channel.channelRemarks // 备注
            this.contractMsg = data.channelContactList // 联系人
            this.invoiceMsg = data.channelReceiptInfoList // 开票信息
            this.contractInfo = data.channelContract // 合同信息
            this.attachment = data.attachment // 附件
            this.quality = data.quality // 质量认证
            this.lableInfo = data.tagIds // 标签
            this.errorInfo = data.comparedResultDTO || {} // 不同项目标红
            this.relatedIds = data.relatedId
            let haveChannel = this.errorInfo.channel || []
            if (haveChannel.includes('channelRemarks')) {
              this.remarkRed = true
            }
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 返回
    goBack () {
      this.$router.go(-1)
      bus.$emit('on-myclose', this.$route)
    },
    // 保存
    saveData () {
      let sendData = {}
      sendData.type = this.$route.query.type
      sendData.operatorId = this.$store.state.user.userId // 操作人id
      sendData.channelId = this.$route.query.channelId || -1 // 渠道数据
      sendData.backLogId = this.$route.query.id || -1 // 代办id r
      // sendData.relatedId = this.$route.query.relatedId || -1 // 关联的另一条数据的id
      sendData.relatedId = this.relatedIds || -1
      sendData.router = 'business/channelEdit' // 路由
      sendData.contractFlag = true // 合同是否允许编辑,默认传true允许编辑
      sendData.channel = this.$refs.channelInfo.channel // 渠道信息
      sendData.channel.channelRemarks = this.remark
      sendData.channelContactList = this.$refs.getContractMsg.contractData // 联系人
      sendData.tag = this.$refs.lableInfo.tag // 标签
      sendData.channelReceiptInfoList = this.$refs.getInvoiceMsg.invoiceData // 开票信息
      sendData.channelContract = this.$refs.contractInfo.contract // 合同信息
      sendData.attachment = this.$refs.uploading.attachmentBack // 合同
      sendData.quality = this.$refs.uploading.qualityBack // 质量认证
      sendData.attachmentRight = this.$refs.uploading.attachmentRight // 附件正确错误
      let channelName = sendData.channel.channelName
      if (channelName.length === 0) {
        this.$Message.warning('请输入渠道名称')
        return
      }
      // 如果是第二人 如果是0，没有点击正确错误
      if (this.$route.query.id && this.$refs.uploading.count === 0) {
        let attachment = sendData.attachment || ''
        let quality = sendData.quality || ''
        if (
          attachment.length !== 0 ||
                    quality.length !== 0
        ) {
          this.$Message.warning('请判断附件正确错误')
          return
        }
      }
      this.$axios({
        url: biUrl + '/channel/save',
        method: 'post',
        data: sendData
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            bus.$emit('on-myclose', this.$route)
            this.$router.push({ name: 'channel' })
          }
          if (res.data.code === 20001) {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
          this.$Notice.warning({
            title: '数据异常，请联系技术人员'
          })
        })
    },
    // 日志
    getLog () {
      let sendData = {
        channelId: 1,
        type: 0,
        operate: 1
      }
      this.$axios({
        url: biUrl + '/channel/showLog',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        this.channelLog = res.data.data
      })
    }
  }
}
</script>
<style scoped>
.headerWithGreenbar {
    font-size: 14px;
    margin-left: 4%;
}
.rowPadding {
    margin-bottom: 20px;
}
.title {
    text-align: right;
    line-height: 30px;
    margin-right: 10px;
    font-size: 14px;
}
.ivu-select {
    margin-top: 0px;
}
.line {
    width: 40%;
    display: inline-block;
}
.lineCenter {
    width: 20%;
    display: inline-block;
    text-align: center;
}
.info {
    color: #ccc;
    margin-left: 20px;
}
.btn {
    position: fixed;
    bottom: 5%;
    left: 43%;
    background: white;
    z-index: 10;
}
.isRed {
    border: 1px solid red;
    border-radius: 5px;
}
.isRed:focus {
    border: 1px solid red;
    border-radius: 5px;
}
</style>
