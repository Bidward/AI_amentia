<template>
  <div>
    <Card id="showCompany" v-if="isPerson">
      <div class="baseInfo">
        <h3>基本信息</h3>
        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>类型：
          </Col>
          <Col span="5">
            <h4 class="inputbox">{{company.companyTypeName}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>状态：
          </Col>
          <Col span="5">
            <h4 class="inputbox">{{company.companyStatusName}}</h4>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>姓名：
          </Col>
          <Col span="5">
            <h4 class="inputbox">{{company.companyName}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>身份证号码：
          </Col>
          <Col span="5">
            <h4 class="inputbox">{{company.companyLegalPersonid}}</h4>
          </Col>
        </Row>
      </div>
      <div class="accountInfo">
        <h3>账户信息</h3>

        <Row class="rowMargin" v-for="(row,index) in company.accounts" :key="index">
          <Col class="title" span="3">
            <i class="require">*</i>开户行：
          </Col>
          <Col span="5">
            <h4 class="inputbox">{{row.accountBankName}}</h4>
          </Col>
          <Col class="title" span="3" offset="2">
            <i class="require">*</i>账号：
          </Col>
          <Col span="5">
            <h4 class="inputbox">{{row.account}}</h4>
          </Col>
        </Row>
      </div>
      <div class="supply" v-if="company.companyEnclosure.length>0">
        <h3>补充资料</h3>
        <Row class="rowMargin" v-for="(rows,index) in company.companyEnclosure" :key="index">
          <Col span="3" class="title">补充资料：</Col>
          <Col span="5">
            <h4 class="inputbox">{{rows.typeName}}</h4>
          </Col>
          <Col class="title" span="3" offset="2">文件：</Col>
          <Col span="5">
            <ul>
              <li class="supplyList" v-for="(file,findex) in  rows.enclosure" :key="findex">
                <h4 class="inputbox">
                  <a :href="staticUrl+file.enclosureUrl" target="_blank">{{file.enclosureName}}</a>
                </h4>
              </li>
            </ul>
          </Col>
        </Row>
      </div>
      <div class="enclosure">
        <h3>附件</h3>
        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>身份证：
          </Col>
          <Col span="17">
            <viewer v-for="(img,i) in company.personIdUrl" :key="i">
              <img :src="staticUrl+img.url" style="width:153px;height:100px;margin:10px;float:left" />
            </viewer>
          </Col>
        </Row>
      </div>
      <div class="save">
        <Row type="flex" justify="center" class="code-row-bg">
          <Col span="2">
            <Button size="large" v-if="canRevoke" @click="revoke">撤销</Button>
          </Col>
          <Col span="2">
            <Button size="large" v-if="canEdit && permissionUpdate" @click="edit">编辑</Button>
          </Col>
          <Col span="2" v-if="!canRevoke && permissionDelet">
            <Button size="large" v-if="noticeDel" @click="showNotic=true">删除</Button>
            <Button size="large" v-else @click="del">删除</Button>
          </Col>
          <Col span="2">
            <Button size="large" @click="closeTag">关闭</Button>
          </Col>
        </Row>
        <Modal
          :mask-closable="false"
          v-model="showNotic"
          @on-ok="del"
          @on-cancel="ownerName=''"
          title="选择通知人"
        >
          <Select
            filterable
            v-model="ownerId"
            style="width:100%"
            @on-change="obj=>ownerName=obj?obj.label:''"
            label-in-value
          >
            <Option
              v-for="person in personList"
              :value="person.id"
              :key="person.id"
              :label="person.nickname"
            >
              <h3 class="demo-auto-complete-title">{{ person.nickname }}</h3>
              <span style="width:50%;display:inline-block">部门：{{person.deptName}}</span>
              <span style="width:50%;display:inline-block">职位：{{person.positionName}}</span>
            </Option>
          </Select>
        </Modal>
      </div>
    </Card>
    <Card id="showCompany" v-else>
      <div class="baseInfo">
        <h3>基本信息</h3>
        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>公司类型：
          </Col>
          <Col span="5">
            <h4 class="inputbox">{{company.companyTypeName}}</h4>
          </Col>
          <Col span="3" offset="2" class="title" v-if="hasShareholder">
            <i class="require">*</i>股东：
          </Col>
          <Col span="5" v-if="hasShareholder">
            <h4 v-if="hasShareholder" class="inputbox">{{company.companyShareholder}}</h4>
          </Col>
        </Row>

        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>公司名称：
          </Col>
          <Col span="5">
            <h4 class="inputbox">{{company.companyName}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>统一社会信用代码：
          </Col>
          <Col span="5">
            <h4 class="inputbox">{{company.companyCode}}</h4>
          </Col>
        </Row>

        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>法定代表人：
          </Col>
          <Col span="5">
            <h4 class="inputbox">{{company.companyLegal}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>实缴资本：
          </Col>
          <Col span="5">
            <h4 class="inputbox">{{company.companyActualCapital}}</h4>
          </Col>
        </Row>

        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>法人身份证号：
          </Col>
          <Col span="5">
            <h4 class="inputbox">{{company.companyLegalPersonid}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>成立日期：
          </Col>
          <Col span="5">
            <h4 class="inputbox">{{company.companyStarttime}}</h4>
          </Col>
        </Row>

        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>注册资本：
          </Col>
          <Col span="5">
            <h4 class="inputbox">{{company.companyRegisterCapital}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>经营期限自：
          </Col>
          <Col span="5">
            <h4 class="inputbox">{{company.companyStarttimeFrom}}</h4>
          </Col>
        </Row>

        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>登记机关：
          </Col>
          <Col span="5">
            <h4 class="inputbox">{{company.companyRegisterOffice}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">经营期限至：</Col>
          <Col span="5">
            <h4 class="inputbox">{{company.companyStarttimeEnd||'/'}}</h4>
          </Col>
        </Row>

        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>住所：
          </Col>
          <Col span="5">
            <h4 class="inputbox">{{company.companyAddress}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>状态：
          </Col>
          <Col span="5">
            <h4 class="inputbox">{{company.companyStatus===0?'启用':'禁用'}}</h4>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>电话：
          </Col>
          <Col span="5">
            <h4 class="inputbox">{{company.companyTel}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>经营范围：
          </Col>
          <Col span="5">
            <h4 class="inputbox">{{company.companyScope}}</h4>
          </Col>
        </Row>
      </div>
      <div class="accountInfo">
        <h3>账户信息</h3>

        <Row class="rowMargin" v-for="(row,index) in company.accounts" :key="index">
          <Col class="title" span="3">
            <i class="require">*</i>账户类型：
          </Col>
          <Col span="2">
            <h4 class="inputbox">{{row.accountTypeName}}</h4>
          </Col>
          <Col class="title" span="3">
            <i class="require">*</i>开户行：
          </Col>
          <Col span="3">
            <h4 class="inputbox">{{row.accountBankName}}</h4>
          </Col>
          <Col class="title" span="2">
            <i class="require">*</i>账号：
          </Col>
          <Col span="5">
            <h4 class="inputbox">{{row.account}}</h4>
          </Col>
        </Row>
      </div>
      <div class="taxrebate">
        <h3>返税信息</h3>
        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>返税比例：
          </Col>
          <Col span="5">
            <h4 class="inputbox">{{company.taxrebateRate}}%</h4>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>返税类型：
          </Col>
          <Col span="5">
            <h4 class="inputbox">{{company.taxrebateTypeName}}</h4>
          </Col>
        </Row>
      </div>
      <div class="enclosure">
        <h3>附件</h3>
        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>营业执照：
          </Col>
          <Col span="5">
            <viewer class="inputbox" v-for="(img,i) in company.licenseUrls" :key="i">
              <img :src="staticUrl+img.url" class="inputbox" />
            </viewer>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>银行开户许可证：
          </Col>
          <Col span="5">
            <viewer class="inputbox" v-for="(img,i) in company.bankLicenseUrls" :key="i">
              <img :src="staticUrl+img.url" class="inputbox" />
            </viewer>
          </Col>
        </Row>
      </div>
      <div class="save">
        <Row type="flex" justify="center" class="code-row-bg">
          <Col v-if="canRevoke" span="2">
            <Button size="large" @click="revoke">撤销</Button>
          </Col>
          <Col v-if="canEdit && permissionUpdate" span="2">
            <Button size="large" @click="edit">编辑</Button>
          </Col>
          <Col span="2" v-if="!canRevoke && permissionDelet">
            <Button size="large" v-if="noticeDel" @click="showNotic=true">删除</Button>
            <Button size="large" v-else @click="del">删除</Button>
          </Col>
          <Col span="2">
            <Button size="large" @click="closeTag">关闭</Button>
          </Col>
        </Row>
        <Modal
          v-model="showNotic"
          :mask-closable="false"
          @on-ok="del"
          @on-cancel="ownerName=''"
          title="选择通知人"
        >
          <Select
            filterable
            v-model="ownerId"
            style="width:100%"
            @on-change="obj=>ownerName=obj?obj.label:''"
            label-in-value
          >
            <!-- <Option v-for="item in personList" :value="item.id" :key="item.id">{{ item.nickname }}</Option> -->
            <Option
              v-for="person in personList"
              :value="person.id"
              :key="person.id"
              :label="person.nickname"
            >
              <h3 class="demo-auto-complete-title">{{ person.nickname }}</h3>
              <span style="width:50%;display:inline-block">部门：{{person.deptName}}</span>
              <span style="width:50%;display:inline-block">职位：{{person.positionName}}</span>
            </Option>
          </Select>
        </Modal>
      </div>
    </Card>
  </div>
</template>

<script>
import { baseUrl, staticUrl } from '@/api/base.js'
export default {
  name: 'showCompany',
  mounted () {
    this.init()
  },
  data () {
    return {
      permissionUpdate: false, // 编辑
      permissionDelet: false, // 删除
      staticUrl: staticUrl,
      selectList: {
        companyTypeList: [
          '个人独资企业',
          '股份有限公司',
          '有限责任公司',
          '个人'
        ],
        accountTypeList: ['基本户', '一般户', '支付宝'],
        taxrebateTypeList: ['年返', '月返', '季返']
      },
      company: {
        companyTypeName: '', // 公司类型
        companyName: '', // 公司名称
        companyCode: '', // 统一社会信用代码
        companyLegal: '', // 法定代表人
        companyShareholder: '', // 股东
        companyActualCapital: '', // 实缴资本
        companyLegalPersonid: '', // 法人身份证号
        companyStarttime: '', // 成立日期
        companyRegisterCapital: '', // 注册资本
        companyStarttimeFrom: '', // 经营期限自
        companyStarttimeEnd: '', // 经营期限至
        companyRegisterOffice: '', // 登记机关
        companyAddress: '', // 住所
        companyStatus: 0, // 状态0启用1禁用
        companyTel: '', // 电话号码
        companyScope: '', // 经营范围
        accounts: [
          // 账户类型
          {
            accountTypeName: '', // 账户类型名
            accountBankName: '', // 开户行
            account: '' // 账号
          }
        ],
        taxrebateRate: '', // 返税比例
        taxrebateTypeName: '', // 返税类型
        // 图片地址相对路径！
        // 营业执照
        licenseUrls: [],
        // 银行开户许可
        bankLicenseUrls: [],
        // 账户类型为个人时，身份证图片
        personIdUrl: []
      },
      ownerName: '', // 通知人的名字
      ownerId: '', // 通知人id
      personNameList: [], // 通知人姓名列表
      personList: [], // 通知人列表
      showNotic: false, // 通知人弹窗
      isInitiator: '1' // 是否为发起人,0是1不是
    }
  },
  computed: {
    isPerson () {
      return this.company.companyTypeName === '个人'
    },
    hasShareholder () {
      let hasShareholderCompany = ['股份有限公司', '有限责任公司'] // 有股东的公司名
      return hasShareholderCompany.includes(this.company.companyTypeName)
    },
    type () {
      // tbc为待确认，其他的都是第一次展示
      return this.$route.query.type || 'show'
    },
    companyId () {
      return this.$route.query.id
    },
    canRevoke () {
      // 可以撤销
      // 是发起人，且是tbc状态
      return this.isInitiator === '0' && this.type === 'tbc'
    },
    canEdit () {
      // 可以编辑
      return this.type !== 'tbc'
    },
    noticeDel () {
      // 需要选择通知人的删除
      // 是发起人或者是查看页面
      return this.isInitiator === '0' || this.type === 'show'
    }
  },
  methods: {
    init () {
      this.getData()
      this.getPermission()
      this.searchPerson() // 获取通知人列表
    },
    // 获取当前页面权限
    getPermission () {
      this.permissionUpdate = this.$store.state.user.userpermission.company.update
      this.permissionDelet = this.$store.state.user.userpermission.company.delete
    },
    edit () {
      // 点编辑关闭查看页
      let newRouter = this.$route
      // 存储当前的路由，0.2s后关闭路由，关闭的是跳转之前的标签页
      setTimeout(() => {
        this.closeTag(newRouter)
      }, 100)
      this.$router.push({
        name: 'editCompany',
        query: {
          id: this.$route.query.id
        }
      })
    },
    revoke () {
      let me = this
      this.$Modal.confirm({
        title: '确认撤销？',
        onCancel () {
          this.$Message.success('取消撤销')
          return false
        },
        onOk () {
          me.$axios({
            url: baseUrl + '/company/resetdeletetbc',
            method: 'post',
            data: {
              id: parseInt(me.$route.query.id)
            }
          })
            .then(res => {
              if (res.data.code === 10054) {
                me.$Message.success(res.data.msg)
                me.closeTag()
              } else {
                me.$Message.error(res.data.msg)
              }
            })
            .catch(err => {
              me.$Message.error(err)
            })
        }
      })
    },
    del () {
      let me = this
      let type = this.$route.query.type
      let id = parseInt(this.$route.query.id)
      this.$Modal.confirm({
        title: '确定删除',
        onCancel () {
          this.$Message.error('取消删除')
          return false
        },
        onOk () {
          switch (type) {
            case 'tbc': {
              // 二次删除
              this.$axios({
                url: baseUrl + '/company/deletetbc',
                method: 'post',
                data: {
                  id: id,
                  ownerId: me.ownerId,
                  companyName: me.company.companyName,
                  route: 'showCompany'
                }
              })
                .then(res => {
                  if (res.data.code === 10052) {
                    this.$Message.success(res.data.msg)
                    me.closeTag()
                  } else {
                    this.$Message.error(res.data.msg)
                  }
                })
                .catch(err => {
                  this.$Message.error(err)
                })
              break
            }
            default: {
              // 第一次删除
              this.$axios({
                url: baseUrl + '/company/delete',
                method: 'post',
                data: {
                  id: id,
                  ownerId: me.ownerId,
                  companyName: me.company.companyName,
                  route: 'showCompany'
                }
              })
                .then(res => {
                  if (res.data.code === 10050) {
                    this.$Message.success(res.data.msg)
                    me.closeTag()
                  } else {
                    this.$Message.error(res.data.msg)
                  }
                })
                .catch(err => {
                  this.$Message.error(err)
                })
            }
          }
        }
      })
    },
    closeTag (router) {
      // 手动关闭标签页，不指定route就是当前标签页
      // route可能传入mouseEvent,如果是路由就有route.name
      let r = this.$route
      if (router && router.name) {
        r = router
        // console.log(router.name)
      }
      bus.$emit('on-myclose', r)
    },
    // 获取有两人两遍全写的通知人列表
    searchPerson () {
      let me = this
      this.$axios({
        // url: baseUrl + '/user/getadviceuser',
        url: baseUrl + '/user/getIncumbencyTbUser',
        method: 'post',
        data: $qs.stringify({ menuName: '公司信息' })
      })
        .then(res => {
          let userList = res.data.content
          // [{id: 2, nickname: "高汉", password: "12345", username: "gaohan"}]
          me.personList = userList
          // me.personNameList = userList.map(e => e.nickname)
        })
        .catch(err => {
          console.error(err)
        })
    },
    getData () {
      if (this.type === 'tbc') {
        this.$axios({
          url: baseUrl + '/company/looktbc',
          method: 'post',
          data: $qs.stringify({
            companyId: this.$route.query.id
          })
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.company = res.data.content.editCompany
              this.isInitiator = res.data.content.isInitiator
            }
          })
          .catch(err => {
            console.error(err)
          })
      } else {
        this.$axios({
          url: baseUrl + '/company/look',
          method: 'get',
          params: {
            companyId: this.$route.query.id
          }
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.company = res.data.content
            }
          })
          .catch(err => {
            console.error(err)
          })
      }
    }
  },
  watch: {
    $route (to, from) {
      // 对路由变化作出响应...
      this.init()
    },
    ownerName (newVal) {
      // 通知人姓名
      this.personList.forEach(e => {
        if (e.nickname === newVal) {
          this.ownerId = e.id
        }
      })
    }
  }
}
</script>

<style lang="less">
.fl {
  float: left;
}

.fr {
  float: left;
}

#showCompany {
  overflow-x: hidden;
  margin: 20px;
  padding: 20px;
  .rowMargin {
    margin: 10px;
  }
  .title {
    text-align: right;
    line-height: 30px;
    color: #000;
    font-weight: 600;
  }
  .inputbox {
    text-align: left;
    width: 1;
  }
  img.inputbox {
    height: 200px;
  }
  h4.inputbox {
    line-height: 30px;
    font-weight: 545;
    max-width: 100%;
  }
  .ivu-col p.tips {
    text-align: right;
    height: 1em;
    color: red;
  }
  .accountInfo .fl,
  .taxrebate .fl {
    margin: 10px 0;
  }
  i.require {
    color: red;
  }
  h3 {
    text-indent: 2em;
    color: #3db79f;
    // background-color: #f2f2f2;
  }
  h3::before {
    content: '';
    display: inline-block;
    // background-color: #34b49a;
    width: 3px;
    height: 1em;
    position: relative;
    top: 2px;
    left: -32px;
  }
  .save {
    margin-top: 30px;
  }
  .supplyList a {
    color: #000;
  }
}
</style>
