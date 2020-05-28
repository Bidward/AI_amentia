<template>
    <div class="viewWrapper" style="padding:20px">
        <!-- 渠道信息 -->
        <Row>
            <Col span="12" offset="5" class="headerWithGreenbar">渠道信息</Col>
        </Row>
        <channelInfo ref="channelInfo" :errorInfo="errorInfo"></channelInfo>
        <!-- 联系人列表 -->
        <Row>
            <Col span="12" offset="5" class="headerWithGreenbar">联系人列表</Col>
        </Row>
        <Row>
            <addContract ref="getContractMsg" :errorInfo="errorInfo"></addContract>
        </Row>
        <!-- 标签 -->
        <Row>
            <Col span="12" offset="5" class="headerWithGreenbar">标签</Col>
        </Row>
        <Row>
            <labelManage ref="lableInfo" :errorInfo="errorInfo"></labelManage>
        </Row>
        <!-- 开票信息 -->
        <Row>
            <Col span="12" offset="5" class="headerWithGreenbar">
                <span>开票信息</span>
            </Col>
        </Row>
        <Row>
            <invoiceInfo ref="getInvoiceMsg" :errorInfo="errorInfo" />
        </Row>
        <!-- 合同信息 -->
        <Row>
            <Col span="12" offset="5" class="headerWithGreenbar">
                <span>合同信息</span>
            </Col>
        </Row>
        <contractInfo ref="contractInfo" :errorInfo="errorInfo"></contractInfo>
        <!-- 附件上传 -->
        <Row>
            <Col span="12" offset="5" class="headerWithGreenbar">
                附件上传
                <span class="info">已合作必填项</span>
            </Col>
        </Row>
        <Row>
            <AttachmentUploading ref="uploading" />
        </Row>
        <!-- 备注  -->
        <Row>
            <Col span="12" offset="5" class="headerWithGreenbar" :errorInfo="errorInfo">备注</Col>
        </Row>
        <Row class="rowPadding">
            <Col span="15" offset="4">
                <Input
                v-model="remark"
                type="textarea"
                clearable
                maxlength="500"
                show-word-limit>
                </Input>
            </Col>
        </Row>
        <!-- 日志区 -->
        <!-- <Row>
            <Col span="24">
                <OpLogs :task-logs="channelLog" class="taskLogs" />
            </Col>
        </Row>-->
        <!-- 按钮  -->
        <Row class="position">
            <Col span="5" class="btn" offset="10">
                <!-- <div style="text-align: center"> -->
                <Button @click="goBack" style="margin-right:60px">返回</Button>
                <Button type="primary" @click="saveData">保存</Button>
                <!-- </div> -->
            </Col>
        </Row>
        <Row>
            <!-- <Col span="24">
                <OpLogs :task-logs="channelLog" class="taskLogs" />
            </Col>-->
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
      remark: '', // 备注
      channelLog: [], // 日志
      errorInfo: {} // 错误数据用来标红
    }
  },
  // 如果路由中有待办id，则是从待办进来的，解锁并清除sessionStorage
  destroyed () {
    let id = sessionStorage.getItem('addBacklogId') || ''
    if (id.length > 0) {
      this.clearLock()
      sessionStorage.removeItem('addBacklogId')
    }
  },
  mounted () {
    this.checkBackLog()
  },
  methods: {
    // 解锁页面
    clearLock () {
      let sendData = {
        backLogId: sessionStorage.addBacklogId
      }
      this.$axios({
        url: biUrl + '/backlog/relaseBackLog',
        data: $qs.stringify(sendData),
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          console.log(res)
        } else {
          this.$Message.error(resp.data.msg)
        }
      })
    },
    // 判断是否从待办跳来的
    checkBackLog () {
      let query = this.$route.query.id || ''
      // 如果路由参数不为空，不是待办来的，正常请求数据接口
      if (query.length !== 0) {
        this.checkBackLogStatus() // 检查代办状态
        sessionStorage.setItem('addBacklogId', this.$route.query.id) // 在session存待办id，解锁时用
      }
    },
    // 检查代办状态
    checkBackLogStatus () {
      let sendData = {
        type: this.$route.query.type,
        channelId: this.$route.query.relatedId,
        backLogId: this.$route.query.id
      }
      this.$axios({
        url: biUrl + '/backlog/checkBackLogStatus',
        data: $qs.stringify(sendData),
        method: 'post'
      }).then(resp => {
        if (resp.data.code === 10000) {
          let status = resp.data.data
          if (status === true) {
            console.log(1)
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
    // 保存
    saveData () {
      let sendData = {}
      sendData.operatorId = this.$store.state.user.userId // 操作人id
      sendData.channelId = this.$route.query.channelId || -1 // 渠道数据
      sendData.backLogId = this.$route.query.id || -1 // 代办id r
      sendData.relatedId = this.$route.query.relatedId || -1 // 关联的另一条数据的id
      sendData.router = 'business/addChannel' // 路由
      sendData.contractFlag = true // 合同是否允许编辑,默认传true允许编辑
      sendData.channel = this.$refs.channelInfo.channel // 渠道信息
      sendData.channel.channelRemarks = this.remark
      sendData.channelContactList = this.$refs.getContractMsg.contractData // 联系人
      sendData.tag = this.$refs.lableInfo.tag // 标签
      sendData.channelReceiptInfoList = this.$refs.getInvoiceMsg.invoiceData // 开票信息
      sendData.channelContract = this.$refs.contractInfo.contract // 合同信息
      sendData.attachment = this.$refs.uploading.attachment // 合同
      sendData.quality = this.$refs.uploading.quality // 质量认证
      sendData.attachmentRight = this.$refs.uploading.attachmentRight // 附件正确错误
      // console.log(this.$refs.uploading.quality)
      let channelName = sendData.channel.channelName
      if (channelName.length === 0) {
        this.$Message.warning('请输入渠道名称')
        return
      }
      // 如果是第二人 如果是count=0，没有点击正确错误
      if (this.$route.query.id && this.$refs.uploading.count === 0) {
        let attachment = sendData.attachment || ''
        let quality = sendData.quality || ''
        if (
          attachment.length !== 0 ||
                    quality.length !== 0
        ) {
          // sendData.attachmentRight = null;
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
    // 返回
    goBack () {
      this.$router.go(-1)
      bus.$emit('on-myclose', this.$route)
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
/*.btn {
     position: fixed;
    bottom: 5%;
    left: 48%;
    background: white;
    z-index: 10;
}*/
</style>
