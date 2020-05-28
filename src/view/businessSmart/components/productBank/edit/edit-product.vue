<template>
  <div class="viewWrapper" style="padding:20px">
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar" >产品信息</Col>
    </Row>
    <Row>
      <ProductInfo ref="productInfo" :productMessage="productMessage" :errorInfo="errorInfo"/>
    </Row>
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">联系人列表</Col>
    </Row>
    <Row>
       <addContract @getContractMsg="getContractMsg"  :contractData="productMessage.contacts" :errorInfo="errorInfo" ref="contacts"></addContract>
    </Row>
    <!-- 标签 -->
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar" >标签</Col>
    </Row>
    <Row>
       <labelManage :labelInfo="productMessage.productTags" :errorInfo="errorInfo" ref="labelManage"></labelManage>
    </Row>
    <!-- 开票信息 -->
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar" >
       <span>开票信息</span>
      </Col>
    </Row>
    <Row>
      <invoiceInfo @getInvoiceMsg="getInvoiceMsg"  :invoiceData="productMessage.invoiceInfos" :errorInfo="errorInfo" ref="invoiceInfo"/>
    </Row>
    <!-- 阶梯价 -->
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">阶梯价<span class="info">已合作必填项</span></Col>
    </Row>
    <Row>
      <Form :model="ladderPriceForm" ref="ladderPriceForm">
        <div class="detailContent">
          <Row v-for="(item,index) in ladderPriceForm.ladderPrice" :key="index" class="rowPadding">
          <Col span="3" offset="2" class="title">量级(万):</Col>
          <Col span="3">
          <FormItem
            :prop="'ladderPrice.' + index + '.numberLevel'"
            :rules="{pattern: /^[1-9]\d*$/, message: '只能输入数字', trigger: 'change'}"
          >
            <Input
              :class="errorClass('ladderPrice')"
              v-model="item.numberLevel "
              style="width: 150px"
              filterable
              maxlength="100"
              show-word-limit
              :clearable="closeIcon.numberLevel"
              @mouseover.native="showClearable('numberLevel')"
              @mouseout.native="hiddenClearable('numberLevel')"
              />
          </FormItem>
          </Col>
          <Col span="2" class="title">单价(元):</Col>
          <Col span="3">
          <FormItem
            :prop="'ladderPrice.' + index + '.unitPrice'"
            :rules="{ pattern: /^\d+(\.\d{0,3})?$/, message: '只能输入数字且最多三位小数', trigger: 'change'}"
          >
            <Input
              :class="errorClass('ladderPrice')"
              v-model="item.unitPrice"
              style="width: 150px"
              filterable
              maxlength="10"
              show-word-limit
              :clearable="closeIcon.unitPrice"
              @mouseover.native="showClearable('unitPrice')"
              @mouseout.native="hiddenClearable('unitPrice')"
              />
          </FormItem>
          </Col>
          <Col span="2" class="title">建议出价(万):</Col>
          <Col span="6">
          <FormItem
            :prop="'ladderPrice.' + index + '.suggestedPrice'"
            :rules="{pattern: /^\d+(\.\d{0,3})?$/, message: '只能输入数字且最多三位小数', trigger: 'change'}"
          >
            <Input
              :class="errorClass('ladderPrice')"
              v-model="item.suggestedPrice"
              style="width: 150px"
              filterable
              maxlength="10"
              show-word-limit
              :clearable="closeIcon.suggestedPrice"
              @mouseover.native="showClearable('suggestedPrice')"
              @mouseout.native="hiddenClearable('suggestedPrice')"
            />
            <Button shape="circle" icon="md-add" @click="addLadder" style="margin:0px 5px 0px 5px"></Button>
            <Button v-if="ladderPriceForm.ladderPrice.length>=2" shape="circle" icon="md-remove" @click="removeLadder(index)"></Button>
            </FormItem>
          </Col>
          </Row>
        </div>
      </Form>
    </Row>
    <!-- 链接信息 -->
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">链接信息</Col>
    </Row>
    <Row>
      <Links @on-links="linkContent" :linkData="productMessage.linkInfos" :errorInfo="errorInfo" ref="links"/>
    </Row>
    <!-- 匹配信息 -->
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">匹配信息</Col>
    </Row>
    <Row>
      <MatchInfo :matchInfoData="productMessage"/>
    </Row>
    <!-- 合同信息 -->
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar"  >合同信息</Col>
    </Row>
    <Row>
      <ContractInfo ref="contractInfo" :productMessage="productMessage.contractInfo" :errorInfo="errorInfo"/>
    </Row>
    <!-- 附件上传 -->
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">附件上传<span class="info">已合作必填项</span></Col>
    </Row>
    <Row>
      <AttachmentUploading :productMessage="productMessage.attachments" ref="attachments"/>
    </Row>
    <!-- 备注  -->
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">备注</Col>
    </Row>
    <Form>
    <Row class="rowPadding remark">
      <Col span="15" offset="4">
      <FormItem :error="errors('remarks')" :show-message="false">
        <Input v-model="remark" type="textarea"  clearable maxlength="500" show-word-limit></Input>
      </FormItem>
      </Col>
    </Row>
    </Form>
    <Row>
      <!-- 日志区 -->

    </Row>
    <!-- 按钮  -->
    <Row class="position" >
      <Col span="7">
        <OpLogs :task-logs="productLog" @click.native="getLog" class="taskLogs"/>
      </Col>
    </Row>
    <Row class="position">
      <Col span="4" class="btn">
        <Card style="width: 240px">
          <div style="text-align:center">
            <Button @click="goBack" style="margin-right:25%;">返回</Button>
            <Button type="primary" @click="saveProduct" :loading="loading" >保存</Button>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
import { proBaseUrl, baseUrl } from '@/api/base.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
// import CustomModal from '../../custom-modal'
import AddContract from './components/addContract'
import LabelManage from './components/label'
import InvoiceInfo from './components/invoiceInfo'
import Links from './components/links'
import MatchInfo from './components/matchInfo'
import ContractInfo from './components/contractInfo'
import AttachmentUploading from './components/attachment-uploading'
import OpLogs from '../../op-log'
import ProductInfo from './components/product-info'

import showIconMixin from '@/view/businessSmart/components/showCloseIconMixin'

export default {
  mixins: [showIconMixin],
  name: 'businessEditProduct',
  components: {
    // CustomModal, // 自定义
    AddContract, // 新增联系人
    LabelManage, // 标签
    Treeselect, // 下拉树
    InvoiceInfo, // 开票信息
    Links, // 链接信息
    MatchInfo, // 匹配信息
    ContractInfo, // 合作信息
    AttachmentUploading, // 附件上传
    OpLogs, // 日志区
    ProductInfo// 产品信息
  },
  data () {
    return {
      type: '', // 标识第几人
      sourceItem: '', // 自定义中输入的元素
      invoiceTabaleData: '', // 开票信息表格中内容
      ladderPrice: [], // 阶梯价
      remark: '', // 备注
      taskLog: [], // 日志
      contractInfo: '', // 合同信息
      canPass: '', // 表示过不过白
      id: '', // 数据ID
      messageId: '', // 列表ID
      nickName: '', // 当前操作人
      personId: '', // 用户ID
      attachments: [], // 附件
      // contacts:[],//联系人
      // contractInfo:[],//合同信息
      // invoiceInfos:[],//开票信息
      // ladderPrice:[],//阶梯价
      // linkInfos:[],//链接信息
      // productInformation:[],//产品信息
      // productTags:{},//标签
      productMessage: {}, // 产品信息
      productLog: [], // 日志信息
      errorInfo: [1], // 错误数据用来标红
      loading: false,
      showId: '',
      ladderPriceForm: {
        ladderPrice: []
      }
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
  created () {
    this.getData()
  },
  mounted () {
    this.addLadder()
    this.checkBackLog()
  },
  methods: {
    // 信息不一致class
    errorClass (key) {
      let cls = this.errorInfo.some(e => e === key) ? 'isDifferent' : ''
      return cls
    },

    // 待办解锁
    clearLock () {
      let sendData = {
        backLogId: sessionStorage.addBacklogId
      }
      this.$axios({
        url: proBaseUrl + '/product/relaseBackLog',
        data: $qs.stringify(sendData),
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 判断页面是否从待办进来
    checkBackLog () {
      if (this.$route.query.type === '2') {
        this.checkBackLogStatus()
        sessionStorage.setItem('addBacklogId', this.$route.query.id) // 在session存待办id，解锁时用
        this.showId = Number(this.$route.query.showId)
      } else {
        this.showId = Number(this.$route.query.id)
      }
    },
    // 检查待办
    checkBackLogStatus () {
      let sendData = {
        canPass: this.$route.query.canPass,
        productId: this.$route.query.messageId,
        backLogId: this.$route.query.id,
        operate: this.$route.query.operate
      }
      this.$axios({
        url: proBaseUrl + '/product/checkBackLogStatus',
        data: $qs.stringify(sendData),
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          if (!res.data.data) {
            this.$router.go(-1)
            bus.$emit('on-myclose', this.$route)
            this.$Message.error(res.data.msg)
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取数据,回显用作展示
    getData () {
      if (this.$route.query.canPass === '未过白') {
        this.canPass = 0
      } else {
        this.canPass = 1
      }
      if (this.$route.query.type === '1') {
        this.id = this.$route.query.id
      } else if (this.$route.query.type === '2') {
        this.id = this.$route.query.showId
      }
      let sendData = {
        canPass: this.canPass,
        id: this.id
      }
      this.$axios({ // 获取回显数据
        url: proBaseUrl + '/product/selectProduct',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.productMessage = res.data.data.productMessage
          this.remark = this.productMessage.productInformation.remarks
          this.ladderPriceForm.ladderPrice = this.productMessage.ladderPrice
          this.contractInfoId = this.productMessage.contractInfoId
          if (this.productMessage.differentFiles) {
            this.errorInfo = this.productMessage.differentFiles
          }
          if (this.productMessage.productInformation.secondId) {
            this.messageId = this.productMessage.productInformation.secondId
          } else {
            this.messageId = -1
          }
        }
      }).catch(err => {
        console.log(err)
      })
      this.$axios({ // 获取当前用户名
        url: baseUrl + '/login/getuser',
        method: 'get'
      }).then(res => {
        this.nickName = res.data.nickname
        this.personId = res.data.id
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取日志
    getLog () {
      let sendData = {
        canPass: this.canPass,
        id: this.$route.query.id
      }
      this.$axios({
        url: proBaseUrl + '/product/getSyslog',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        this.productLog = res.data.data
      }).catch(err => {
        console.log(err)
      })
    },
    save () {
      this.contractInfo = this.$refs.contractInfo
      console.log(this.contractInfo)
    },

    linkContent (data) {
      console.log(data)
    },
    // 获取联系人表格内容
    getContractMsg (data) {
    },
    // 获取新增开票信息组件中新增的数据
    getInvoiceMsg (data) {
      this.invoiceTabaleData = data
    },
    // 新增阶梯价
    addLadder () {
      this.ladderPriceForm.ladderPrice.push({
        numberLevel: '', // 量级
        unitPrice: '', // 单价
        suggestedPrice: ''// 建议出价
      })
    },
    // 删除一行阶梯价
    removeLadder (index) {
      this.ladderPriceForm.ladderPrice.splice(index, 1)
    },
    // 返回按钮
    goBack () {
      this.$router.go(-1)
      bus.$emit('on-myclose', this.$route)
    },
    // 不同项目标红
    errors (key) {
      if (this.errorInfo.some(e => e === key) ? '不一致' : false) {
        return '不一致'
      }
    },
    isOneortwo () {
      let id = ''
      let showId = ''
      // 如果角色为第一人并且数据为未过白的情况下
      if (this.$route.query.type === '1' && this.$route.query.canPass === '未过白') {
        id = this.$route.query.id
        showId = Number(this.$route.query.showId)
        // 当前showId为-1则为第一人
        if (showId === -1) {
          // console.log('暂无')
          this.type = '1'
        } else {
          // 如果当前id大于关联数据id则为第二人，反之为第一人
          if (id > showId) {
            this.type = '2'
          } else {
            this.type = '1'
          }
        }
      } else {
        this.type = this.$route.query.type
      }
    },
    // 保存按钮
    async saveProduct () {
      let productInfoForm = this.$refs.productInfo.$children[0]
      let ladderPriceForm = this.$refs.ladderPriceForm

      let v1 = await productInfoForm.validate()
      let v2 = await ladderPriceForm.validate()

      console.log(v1, v2)

      // return

      this.isOneortwo()
      console.log(this.type)
      this.loading = true
      this.productInformation = this.$refs.productInfo.productInfo
      this.productInformation.remarks = this.remark
      let sendData = {}
      sendData.nickName = this.nickName // 当前用户名
      sendData.personId = this.personId // 当前用户ID
      sendData.productInformation = this.$refs.productInfo.productInfo // 产品信息
      sendData.contacts = this.$refs.contacts.contractData // 联系人
      sendData.productTags = this.$refs.labelManage.productTags// 标签
      sendData.invoiceInfos = this.$refs.invoiceInfo.invoiceData// 开票信息
      sendData.ladderPrice = this.ladderPriceForm.ladderPrice // 阶梯价
      sendData.linkInfos = this.$refs.links.linkContent// 链接信息
      sendData.contractInfo = this.$refs.contractInfo.contractInfo // 合同信息
      sendData.attachments = this.$refs.attachments.enclosureFile.concat(this.$refs.attachments.enclosurePic)// 附件
      sendData.showId = this.showId
      sendData.contractInfoId = this.contractInfoId
      if (sendData.productInformation.productName === '') {
        this.$Message.error('请输入产品名称')
        this.loading = false
      }
      if (this.$route.query.messageId) {
        sendData.messageId = Number(this.$route.query.messageId)
      } else {
        sendData.messageId = this.messageId
      }
      if (this.type === '1') {
        // let id = ''
        // let showId = ''
        // id = this.$route.query.id
        // showId = this.$route.query.showId
        //  if(id > showId){
        //   sendData.attachments = []// 附件
        // }else{
        //   sendData.attachments = this.$refs.attachments.enclosureFile.concat(this.$refs.attachments.enclosurePic)// 附件
        // }

        // if (this.$route.query.showId) {
        //   sendData.messageId = this.$route.query.showId
        // } else {
        //   sendData.messageId = -1
        // }
        // sendData.messageId = this.messageId
        // sendData.showId = Number(this.$route.query.id)
        sendData.route = 'business/editProducts'
      } else if (this.type === '2') {
        // sendData.attachments = []// 附件
        sendData.attachmentApproved = this.$refs.attachments.attachmentApproved// 判断附件是否正确状态
        // sendData.messageId = Number(this.$route.query.messageId)
        sendData.backLogId = Number(this.$route.query.id)
        // sendData.showId = Number(this.$route.query.id)
      }
      if (sendData.attachmentApproved === '') {
        this.$Message.error('请判断附件')
        this.loading = false
      } else {
        this.$axios({
          url: proBaseUrl + '/product/updateAll',
          method: 'post',
          data: sendData
        }).then(res => {
          if (res.data.code === 10000) {
            this.loading = false
            this.$Message.info('保存成功')
            bus.$emit('on-myclose', this.$route)
            this.$router.push({ name: 'product' })
          } else if (res.data.code === 10004) {
            this.loading = false // 数据过白
            this.errorInfo = [1]
            this.$Message.info(res.data.msg)
            bus.$emit('on-myclose', this.$route)
            this.$router.push({ name: 'product' })
          } else if (res.data.code === 10001) {
            this.loading = false // 信息不一致数据不过白
            this.$Message.info(res.data.msg)
            bus.$emit('on-myclose', this.$route)
            this.$router.push({ name: 'product' })
          } else if (res.data.code === 10003) {
            this.loading = false // 存未过白
            this.errorInfo = res.data.data
            this.$Message.error(res.data.msg)
            bus.$emit('on-myclose', this.$route)
            this.$router.push({ name: 'product' })
          } else {
            this.loading = false
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .isDifferent /deep/ input {
    border-color: red !important;
  }
  .headerWithGreenbar{
    font-size: 14px;
    margin-left: 4%;
  }
  .rowPadding{
    margin-bottom:20px;
  }
  .title{
    text-align: right;
    line-height: 30px;
    margin-right: 10px;
    font-size: 14px;
  }
  .ivu-select{
    margin: 0;
  }
  .info{
  color: #ccc;
  margin-left: 20px;
}
.detailContent{
  margin-bottom: 20px;
}
.ivu-dropdown{
  width: 100%;
}
.btn{
  position: fixed;
  bottom: 2%;
  left:48%;
  background:white;
  z-index: 10;
}
.viewWrapper{
  position: relative;
}

.taskLogs{
  margin-bottom: 5%;
  z-index: 5;
}
</style>
