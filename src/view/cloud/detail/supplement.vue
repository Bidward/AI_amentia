<template>
  <!--补充协议 收款合同-->
  <div class="cloudCooper">
    <div class="detailContent">
      <!--合同拟定方 合同类型-->
      <Row class="rowPadding">
        <Col span="3" offset="3" class="title">合同拟定方：</Col>
        <Col span="5">
          <p class="top">{{addIncome.planerName ||'暂无'}}</p>
        </Col>
        <Col span="3" class="title">合同类型：</Col>
        <Col span="5">
          <p class="top">{{addIncome.contractTypeName ||'暂无'}}</p>
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="3" offset="3" class="title">合同编码：</Col>
        <Col span="5">
          <p class="top">{{addIncome.card ||'暂无'}}</p>
        </Col>
      </Row>
    </div>
    <!--甲方-->
    <div class="detailContent">
        <Row class="rowPadding">
            <Col span="12" offset="3" class="cardTitle">甲方</Col>
        </Row>
        <div v-if="addIncome.contractPartycompany===1">
            <!--公司/个人 公司名称-->
            <Row class="rowPadding" >
                <Col span="3" offset="3" class="title">
                公司/个人：
                </Col>
                <Col span="5">
                <p class="top">{{addIncome.contractPartycompanyName ||'暂无'}}</p>
                </Col>
                <Col span="3" class="title">
                公司名称：
                </Col>
                <Col span="5">
                <p class="top">{{addIncome.partyCompany ||'暂无'}}</p>
                </Col>
            </Row>
            <!--公司 开户行账号 开户行-->
            <Row class="rowPadding" >
                <Col span="3" offset="3" class="title">
                开户行账号：
                </Col>
                <Col span="5">
                <p class="top">{{addIncome.openbankId ||'暂无'}}</p>
                </Col>
                <Col span="3" class="title">
                开户行：
                </Col>
                <Col span="5">
                <p class="top">{{addIncome.openbank ||'暂无'}}</p>
                </Col>
            </Row>
        </div>
        <div v-if="addIncome.contractPartycompany===2">
             <!--公司选择为个人时 -->
            <Row class="rowPadding" >
                <Col span="3" offset="3" class="title">
                公司/个人：
                </Col>
                <Col span="5">
                <p class="top">{{addIncome.contractPartycompanyName ||'暂无'}}</p>
                </Col>
                <Col span="3" class="title">
                姓名：
                </Col>
                <Col span="5">
                <p class="top">{{addIncome.contacts ||'暂无'}}</p>
                </Col>
            </Row>

            <!--个人  身份证号码 开票地址-->
            <Row class="rowPadding" >
                <Col span="3" offset="3" class="title">
                身份证号码：
                </Col>
                <Col span="5">
                <p class="top">{{addIncome.contractNum||'暂无'}}</p>
                </Col>
                <Col span="3" class="title">
                开票地址：
                </Col>
                <Col span="5">
                <p class="top">{{addIncome.openingAddress||'暂无'}}</p>
                </Col>
            </Row>

            <!--个人  开户行 开票地址-->
            <Row class="rowPadding" >
                <Col span="3" offset="3" class="title">
                开户行：
                </Col>
                <Col span="5">
                <p class="top">{{addIncome.openbank||'暂无'}}</p>
                </Col>
                <Col span="3" class="title">联系电话：</Col>
                <Col span="5">
                <p class="top">{{addIncome.tel||'暂无'}}</p>
                </Col>
            </Row>
            <!--个人 发票寄送地址 详细地址-->
            <Row class="rowPadding" >
                <Col span="3" offset="3" class="title">发票寄送地址：</Col>
                <Col span="5">
                <p class="top">{{addIncome.sendAddress||'暂无'}}</p>
                </Col>
                <Col span="3" class="title">详细地址：</Col>
                <Col span="5">
                <p class="top">{{addIncome.detailedAddress||'暂无'}}</p>
                </Col>
            </Row>
        </div>
    </div>
    <!--开票信息-->
    <div class="detailContent"  v-if="addIncome.contractPartycompany===1">
      <Row class="rowPadding">
        <Col span="12" offset="3" class="cardTitle">开票信息</Col>
      </Row>
      <!--纳税人识别号 开票地址-->
      <Row class="rowPadding">
        <Col span="3" offset="3" class="title">
            纳税人识别号：
        </Col>
        <Col span="5">
          <p class="top">{{addIncome.contractNum||'暂无'}}</p>
        </Col>
        <Col span="3" class="title">
            开票地址：
        </Col>
        <Col span="5">
          <p class="top">{{addIncome.openingAddress||'暂无'}}</p>
        </Col>
      </Row>

      <!--对方联系人 联系电话-->
      <Row class="rowPadding">
        <Col span="3" offset="3" class="title">
            对方联系人：
        </Col>
        <Col span="5">
          <p class="top">{{addIncome.contacts||'暂无'}}</p>
        </Col>
        <Col span="3" class="title">
            联系电话：
        </Col>
        <Col span="5">
          <p class="top">{{addIncome.tel||'暂无'}}</p>
        </Col>
      </Row>

      <!--开票类型 开票内容-->
      <Row class="rowPadding">
        <Col span="3" offset="3" class="title">
            开票类型：
        </Col>
        <Col span="5">
          <p class="top">{{addIncome.ticketTypeName||'暂无'}}</p>
        </Col>
        <Col span="3" class="title">
            开票内容：
        </Col>
        <Col span="5">
          <p class="top">{{addIncome.ticketTextName||'暂无'}}</p>
        </Col>
      </Row>

      <!--发票寄送地址 详细地址-->
      <Row class="rowPadding">
        <Col span="3" offset="3" class="title">发票寄送地址：</Col>
        <Col span="5">
          <p class="top">{{addIncome.sendAddress||'暂无'}}</p>
        </Col>
        <Col span="3" class="title">详细地址：</Col>
        <Col span="5">
          <p class="top">{{addIncome.detailedAddress||'暂无'}}</p>
        </Col>
      </Row>
    </div>

    <!--乙方-->
    <div class="detailContent">
      <Row class="rowPadding">
        <Col span="12" offset="3" class="cardTitle">乙方</Col>
      </Row>
      <!--签订人 我方公司-->
      <Row class="rowPadding">
        <Col span="3" offset="3" class="title">
            签订人：
        </Col>
        <Col span="5">
          <p class="top">{{addIncome.signerName||'暂无'}}</p>
        </Col>
        <Col span="3" class="title">
            我方公司：
        </Col>
        <Col span="5">
          <p class="top">{{addIncome.wecompanyName||'暂无'}}</p>
        </Col>
      </Row>

      <!--公司账号 合同期限-->
      <Row class="rowPadding">
        <Col span="3" offset="3" class="title">
            公司账号：
        </Col>
        <Col span="5">
          <p class="top">{{addIncome.wecompanybankName||'暂无'}}</p>
        </Col>
        <Col span="3" class="title">
            合同期限：
        </Col>
        <Col span="5">
          <p class="top">{{addIncome.startTime+' ~ '+addIncome.endTime||'暂无'}}</p>
        </Col>
      </Row>
      <!--合同金额-->
      <Row class="rowPadding">
        <Col span="3" offset="3" class="title">合同金额：</Col>
        <Col span="5">
          <p class="top">{{addIncome.money||'暂无'}}</p>
        </Col>
      </Row>
    </div>
    <!--备注-->
    <div class="detailContent">
      <Row class="rowPadding">
        <Col span="12" offset="3" class="cardTitle">备注</Col>
      </Row>
      <!--备注-->
      <Row class="rowPadding">
        <Col span="5" offset="4">
          <p class="top">{{addIncome.remark||'暂无'}}</p>
        </Col>
      </Row>
    </div>
    <!--附件-->
    <div class="detailContent">
        <Row class="rowPadding">
            <Col span="12" offset="3" class="cardTitle">附件</Col>
        </Row>
        <Row class="rowPadding">
            <Col span="3" offset="2" class="title">
            <i class="require">*</i>文件上传：
            </Col>
              <Col span="5">
                <p  v-for="(item,index)  in  enclosureWord" :key="index"><a :href="item.enclosureUrl">{{item.enclosureName}}</a></p>
                <Upload class="bzUpload"
                    multiple
                    name="fileData"
                    :max-size="20480"
                    :on-success="(value)=> uploadFileSuccess(value)"
                    :on-exceeded-size="uploadFileError"
                    :action="staticUrl+'/index.php'"
                >
                    <Button icon="ios-cloud-upload-outline">单个文件不能超过20MB</Button>
                    <p style="color:red;cursor:pointer;">(上传盖章纸质合同)</p>
                </Upload>
            </Col>
            <Col span="3" offset="2" class="title">
                <i class="require">*</i>图片上传：
            </Col>
            <Col span="5">
                <Upload class="bzUpload"
                multiple
                :show-upload-list="false"
                :format="['jpg','jpeg','png']"
                :max-size="20480"
                name="fileData"
                :on-format-error ="(file)=>uploadError(file)"
                :on-success="(value)=> uploadPhotoSuccess(value)"
                :action="staticUrl+'/index.php'"
                >
                    <Button icon="ios-cloud-upload-outline">单张图片不能超过20MB</Button>
                </Upload>
                <viewer :images='addIncome.enclosurePic'>
                <div style="width:360px;display:flex;flex-wrap:wrap;">
                   <div v-for = "(item,index) in addIncome.enclosurePic" :key="index">
                      <Icon v-if="addIncome.enclosurePic[index].tag==='new'" type="ios-close-circle-outline" style="position: relative;left: 68px;top: 17px;color: red;cursor: pointer;" @click="deleteImg(index)"/>
                      <img v-if="addIncome.enclosurePic.length>=1" style="width: 70px;height: 70px;margin: 10px;" :src="item.enclosureUrl" class="inputbox">
                   </div>
                </div>
                </viewer>
            </Col>
        </Row>
    </div>
    <!--抄送人-->
    <div class="detailContent">
      <Row class="rowPadding">
        <Col span="12" offset="3" class="cardTitle">抄送人</Col>
      </Row>
      <Row class="rowPadding">
        <Col span="5" offset="4">
          <div
            v-for="(item,index) in this.addIncome.copieruserName"
            :key="index"
            style="float: left;margin-right: 15px;"
          >
            <Icon
              type="md-close"
              style="color: red; position: relative;left: 33px;top: 12px;cursor: pointer;"
              @click="deletCopier(index)"
            />
            <Icon type="ios-contacts" size="50" @click="showNotice=true" style="display: block;"></Icon>
            <p style="display: inline;">{{item+' '||'抄送人'}}</p>
          </div>
          <Icon
            type="ios-add-circle-outline"
            size="50"
            @click="showNotice=true"
            style="margin-top: 22px;color: #CCC;"
          />
        </Col>
      </Row>
      <!--抄送人弹窗-->
      <Modal id="addNotice" :mask-closable="false" v-model="showNotice" title="抄送人" @on-ok="addCopier()">
        <Select
          :value="addIncome.copier"
          filterable
          multiple
          :label-in-value="true"
          @on-change="getNoticeName"
        >
          <Option
            v-for="person in incumbencyTbUser"
            :key="person.id"
            :value="person.id"
            :label="person.nickname"
          >
            <div>
              <p>{{person.nickname}}</p>
              <p>部门：{{person.deptName}}</p>
              <p>职位：{{person.positionName}}</p>
            </div>
          </Option>
        </Select>
      </Modal>
    </div>
    <!--操作按钮-->
    <div class="detailContent">
      <Row class="rowPadding">
        <Col span="12" offset="10">
          <Button type="warning" style="margin-right:30px" @click="goBack()">返回</Button>
          <Button type="primary" @click="saveSupplement()">保存</Button>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import { baseUrl, staticUrl } from '@/api/base.js'
export default {
  name: 'supplement',
  data () {
    return {
      staticUrl,
      tag: '',
      showWord: [], // 上传的补充协议
      isPerson: false, // 产品公司类型为个人
      showNotice: false, // 抄送人弹窗
      enclosureWord: [],
      addIncome: {
        contractPartycompanyName: '',
        contractPartycompany: '',
        // incumbencyTbUser: [],
        planerName: '', // 合同拟定方
        contractTypeName: '', // 合同类型
        companyType: '', // 公司或个人  1为公司2为个人
        companyTypeList: [
          {
            id: '1',
            name: '公司'
          },
          {
            id: '2',
            name: '个人'
          }
        ],
        partyCompany: '', // 公司名称
        partyCompanyList: [], // 公司名称列表 别人公司
        openbankId: '', // 开户行账号
        openbank: '', // 开户行
        contractNum: '', // 纳税人识别号
        openingAddress: '', // 开票地址
        tel: '', // 联系电话
        contacts: '', // 对方联系人
        ticketTypeName: '', // 开票类型
        ticketTextName: '', // 开票内容
        sendAddress: '', // 发票寄送地址
        detailedAddress: '', // 详细地址
        signerName: '', // 签订人
        wecompanyName: '', // 乙方我方公司id
        wecompanybankName: '', // 公司账户id
        timeRage: [], // 合同期限
        startTime: '', // 合同开始时间
        endTime: '', // 合同结束时间
        money: '', // 合同金额
        remark: '', // 备注
        contractName: '', // 合同名称
        service: '', // 甲方对乙方服务
        serviceTwo: '', // 乙方对甲方服务
        court: '', // 法院地址
        copier: [], // 抄送人id
        copieruserName: [], // 抄送人名称
        enclosurePic: []

      }

    }
  },
  inject: ['app'],
  computed: {
    incumbencyTbUser () { // 在职人员
      return this.app.employees
    }
  },
  mounted () {
    this.getData()
    this.getPerson()
  },
  methods: {
    getPerson () {
      // 在职人员
      // this.$axios({
      //   url: baseUrl + '/user/getIncumbencyTbUser',
      //   method: 'post'
      // })
      //   .then(res => {
      //     if (res.data.code === 10000) {
      //       this.addIncome.incumbencyTbUser = res.data.content
      //     } else {
      //       this.$Message.error(res.data.msg)
      //     }
      //   })
      //   .catch(err => {
      //     console.error(err)
      //   })
    },
    // 附件上传成功
    uploadFileSuccess (response, file, fileList) {
      if (response.rel === true) {
        // console.log(this.enclosureWord)
        // 文件上传展示
        this.enclosureWord.push({
          enclosureUrl: staticUrl + '' + response.url,
          enclosureName: response.filename
        })
        // console.log(this.enclosureWord)
      } else {
        console.error(response.msg)
      }
    },
    // 附件上传失败
    uploadFileError (response, file, fileList) {
      if (response.size > 20480) {
        this.$message.error('文件上传失败 大小超过20M')
      }
    },
    // 图片上传
    uploadPhotoSuccess (response, file, fileList) {
      if (response.rel === true) {
        // 图片上传展示
        this.addIncome.enclosurePic.push({
          enclosureUrl: staticUrl + '' + response.url,
          enclosureName: response.filename,
          tag: 'new'
        })
        // console.log(this.addIncome.enclosurePic)
      }
    },
    // 附件上传失败
    uploadError (file) {
      this.$Message.error('上传格式错误,请上传jpg,jpeg,png后缀的图片')
    },

    /** 传入类别和要删除的类型和在数组中的位置 */
    deleteImg (index) {
      // console.log(this.enclosurePic)
      this.addIncome.enclosurePic.splice(index, 1)
    },
    // 获取回显接口详情
    getData () {
      let sendData = {
        id: this.$route.query.id
      }
      this.$axios({
        url: baseUrl + '/contract/info',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.addIncome = res.data.content
          this.enclosurePic = res.data.content.enclosurePic
          this.enclosureWord = res.data.content.enclosure
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 删除抄送人
    deletCopier (index) {
      this.addIncome.copier.splice(index, 1)
      this.addIncome.copieruserName.splice(index, 1)
    },
    // 根据通知人id 获得对应的通知人name
    getNoticeName (ids) {
      this.addIncome.showCopierName = []
      this.addIncome.showCopierId = []
      ids.map(item => {
        this.addIncome.showCopierName.push(item.label)
        this.addIncome.showCopierId.push(item.value)
      })
      this.addIncome.showCopierName = Array.from(new Set(this.addIncome.showCopierName))
      this.addIncome.showCopierId = Array.from(new Set(this.addIncome.showCopierId))
    },
    addCopier () {
      this.addIncome.copieruserName = this.addIncome.showCopierName
      this.addIncome.copier = this.addIncome.showCopierId
    },
    // 返回
    goBack () {
      bus.$emit('on-myclose', this.$route)
      this.$router.push({
        name: 'contractBank'
      })
    },
    // 保存补充协议
    saveSupplement () {
      let sendData = {
        id: this.$route.query.id,
        enclosure: this.enclosureWord,
        enclosurePic: this.addIncome.enclosurePic,
        copier: this.addIncome.copier
      }
      this.$axios({
        url: baseUrl + '/Auditing/insertNewUrl',
        method: 'post',
        data: sendData
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.info(res.data.msg)
            bus.$emit('on-myclose', this.$route)
            this.$router.push({
              name: 'contractBank'
            })
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>

<style lang="less">
.bzUpload {
  .ivu-btn:hover {
    color: #19aa8d;
    background-color: #fff;
    border-color: #19aa8d;
  }

  .ivu-btn.active,
  .ivu-btn:active {
    color: #19aa8d;
    background-color: #fff;
    border-color: #19aa8d;
  }

  .ivu-btn:focus {
    box-shadow: none;
  }
}
</style><style lang="less" scoped>
.title {
  text-align: right;
  line-height: 30px;
  margin-right: 10px;
}

.top {
  margin-top: 4px;
}

.require {
  font-size: 17px;
  color: red;
  position: relative;
  top: 5px;
  right: 3px;
}
.refuse {
  width: 600px;
  height: auto;
}
</style>
