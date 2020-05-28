<template>
  <div class="viewWrapper" style="padding:20px">
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">产品信息</Col>
    </Row>
    <Row>
      <ProductInfo ref="productInfo" @on-productInfo="productChange" :errorInfo="errorInfo"/>
    </Row>
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">联系人列表</Col>
    </Row>
    <Row>
       <addContract @getContractMsg="getContractMsg" :errorInfo="errorInfo"></addContract>
    </Row>
    <!-- 标签 -->
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">标签</Col>
    </Row>
    <Row>
       <labelManage ref="labelManage"></labelManage>
    </Row>
    <!-- 开票信息 -->
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">
       <span>开票信息</span>
      </Col>
    </Row>
    <Row>
      <invoiceInfo @getInvoiceMsg="getInvoiceMsg" ref="invoiceInfo"/>
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
              :rules="{pattern: /^[1-9]\d*$/, message: '只能输入数字', trigger: 'change'}">
              <Input
                v-model="item.numberLevel"
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
          <Col span="3">
            <FormItem
              :prop="'ladderPrice.' + index + '.suggestedPrice'"
              :rules="{pattern: /^\d+(\.\d{0,3})?$/, message: '只能输入数字且最多三位小数', trigger: 'change'}"
            >
              <Input
                v-model="item.suggestedPrice"
                style="width: 150px"
                filterable
                maxlength="10"
                show-word-limit
                :clearable="closeIcon.suggestedPrice"
                @mouseover.native="showClearable('suggestedPrice')"
                @mouseout.native="hiddenClearable('suggestedPrice')"
              />
            </FormItem>
          </Col>
            <Button shape="circle" icon="md-add" @click="addLadder" style="margin:0px 5px 0px 5px"></Button>
            <Button v-if="ladderPriceForm.ladderPrice.length>=2" shape="circle" icon="md-remove" @click="removeLadder(index)"></Button>
          </Row>
        </div>
      </Form>
    </Row>
    <!-- 链接信息 -->
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">链接信息</Col>
    </Row>
    <Row>
      <Links @on-links="linkContent" ref="links"/>
    </Row>
    <!-- 匹配信息 -->
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">匹配信息</Col>
    </Row>
    <Row>
      <MatchInfo />
    </Row>
    <!-- 合同信息 -->
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">合同信息</Col>
    </Row>
    <Row>
      <ContractInfo ref="contractInfo" />
    </Row>
    <!-- 附件上传 -->
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">附件上传<span class="info">已合作必填项</span></Col>
    </Row>
    <Row>
      <AttachmentUploading  ref="attachments"/>
    </Row>
    <!-- 备注  -->
    <Row>
      <Col span="12" offset="5" class="headerWithGreenbar">备注</Col>
    </Row>
    <Row class="rowPadding remark">
      <Col span="15" offset="4">
      <Input v-model="remark" type="textarea"  clearable maxlength="500" show-word-limit ></Input>
      </Col>
    </Row>
    <!-- 按钮  -->
    <Row class="position" >
      <!-- <Col span="4">
        <OpLogs :task-logs="taskLog" class="taskLogs"/>
      </Col> -->
      <Col span="5" offset="10" class="btn">
        <Button  @click="goBack" style="margin-right:60px;">返回</Button>
        <Button type="primary" @click="save" :loading="loading">保存</Button>
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
  name: 'businessAddProduct',
  mixins: [showIconMixin],
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
      value1: '',
      sourceItem: '', // 自定义中输入的元素
      invoiceTabaleData: '', // 开票信息表格中内容
      ladderPrice: [], // 阶梯价
      remark: '', // 备注
      taskLog: [], // 日志
      productInformation: {}, // 产品信息
      contacts: [], // 联系人信息
      contractInfo: {}, // 合同信息
      nickName: '', // 用户名
      personId: '', // 用户ID
      errorInfo: [1], // 错误数据用来标红
      loading: false,
      ladderPriceForm: {
        ladderPrice: []
      }
    }
  },
  mounted () {
    this.addLadder()
    this.getData()
    this.checkBackLog()
  },
  // 如果路由中有待办id，则是从待办进来的，解锁并清除sessionStorage
  destroyed () {
    let id = sessionStorage.getItem('addBacklogId') || ''
    if (id.length > 0) {
      console.log('解锁')
      this.clearLock()
      sessionStorage.removeItem('addBacklogId')
    }
  },
  methods: {
    // 解锁页面
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
          console.log(res)
        } else {
          this.$Message.error(resp.data.msg)
        }
      })
    },
    // 判断页面是否从待办进来
    checkBackLog () {
      if (this.$route.query.type === '2') {
        this.checkBackLogStatus()
        sessionStorage.setItem('addBacklogId', this.$route.query.id) // 在session存待办id，解锁时用
      }
    },
    // 检查待办
    checkBackLogStatus () {
      let sendData = {
        canPass: this.$route.query.canPass || 0,
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
            this.$Message.error(resp.data.msg)
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取数据
    getData () {
      this.$axios({
        url: baseUrl + '/login/getuser',
        method: 'get'
      }).then(res => {
        this.nickName = res.data.nickname
        this.personId = res.data.id
      }).catch(err => {
        console.log(err)
      })
    },
    // 产品信息代入到合同的值
    productChange (data) {
      // console.log(data)
      // this.productInformation = data
    },
    linkContent (data) {
      // console.log(data)
    },

    // 获取联系人表格内容
    getContractMsg (data) {
      // console.log(data)
      this.contacts = data
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
    // 保存
    async save () {
      // this.loading = true

      let productInfoForm = this.$refs.productInfo.$children[0]
      let ladderPriceForm = this.$refs.ladderPriceForm

      let v1 = await productInfoForm.validate()
      let v2 = await ladderPriceForm.validate()

      if (!v1 || !v2) return

      this.contractInfo = this.$refs.contractInfo.contractInfo
      this.productInformation = this.$refs.productInfo.productInfo
      this.productInformation.remarks = this.remark
      this.invoiceInfos = this.$refs.invoiceInfo.invoiceData
      this.linkInfos = this.$refs.links.linkContent
      // this.attachments = [...this.$refs.attachments.enclosurePic, ...this.$refs.attachments.enclosureFile]
      // this.attachments = this.$refs.attachments.attachments
      let sendData = {}
      sendData.nickName = this.nickName // 当前用户名
      sendData.personId = this.personId // 当前用户ID
      sendData.productInformation = this.productInformation // 产品信息
      sendData.contacts = this.contacts // 联系人
      sendData.productTags = this.$refs.labelManage.productTags// 标签
      sendData.invoiceInfos = this.invoiceInfos// 开票信息
      sendData.ladderPrice = this.ladderPriceForm.ladderPrice // 阶梯价
      sendData.linkInfos = this.linkInfos// 链接信息
      sendData.contractInfo = this.contractInfo // 合同信息
      // sendData.attachments = this.attachments// 附件

      if (sendData.productInformation.productName === '') {
        this.$Message.error('请输入产品名称')
        // this.loading = false
        return
      }
      if (this.$route.query.type === '1') {
        sendData.messageId = -1
        sendData.route = 'business/businessAddProduct'
        sendData.attachments = this.$refs.attachments.enclosureFile.concat(this.$refs.attachments.enclosurePic)
        // sendData.attachments = this.attachments// 附件
      } else if (this.$route.query.type === '2') {
        sendData.attachmentApproved = this.$refs.attachments.attachmentApproved// 判断附件是否正确状态
        sendData.messageId = Number(this.$route.query.messageId)
        sendData.backLogId = Number(this.$route.query.id)
        sendData.attachments = this.$refs.attachments.attachments
        // sendData.attachments = []// 附件
      }
      if (sendData.attachmentApproved === '') {
        this.$Message.error('请判断附件')
      } else {
        this.$axios({
          url: proBaseUrl + '/product/insertAll',
          method: 'post',
          data: sendData
        }).then(res => {
          // 后端有点坏，每个状态每种保存结果
          if (res.data.code === 10000) {
            this.loading = false
            this.$Message.info('保存成功')
            bus.$emit('on-myclose', this.$route)
            this.$router.push({ path: 'product' })
          } else if (res.data.code === 10002) { // 数据过白
            this.loading = false
            this.errorInfo = [1]
            this.$Message.info(res.data.msg)
            bus.$emit('on-myclose', this.$route)
            this.$router.push({ name: 'product' })
          } else if (res.data.code === 10001) { // 信息不一致数据不过白
            this.loading = false
            this.errorInfo = res.data.data
            this.$Message.error(res.data.msg)
            bus.$emit('on-myclose', this.$route)
            this.$router.push({ name: 'product' })
          } else if (res.data.code === 10003) { // 存未过白
            this.loading = false
            this.$Message.error(res.data.msg)
            bus.$emit('on-myclose', this.$route)
            this.$router.push({ name: 'product' })
          } else {
            this.loading = false
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
          this.loading = false
        })
      }
    },
    // 返回按钮
    goBack () {
      this.$router.go(-1)
      bus.$emit('on-myclose', this.$route)
    }
  }
}
</script>
<style lang="less" scoped>
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
    margin-top: 15px;
    padding-bottom: 20px;

}
.viewWrapper{
  position: relative;
}

.taskLogs{
  margin-bottom: 5%;
  z-index: 5;
}
</style>
