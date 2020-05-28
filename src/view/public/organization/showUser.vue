<template>
  <div>
    <Card id="showUser">
      <div class="accountInfo">
        <h3>账户信息</h3>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">姓名：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{accountInfo.nickname||'暂无'}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">工号：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{accountInfo.jobNumber||'暂无'}}</h4>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">登录名：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{accountInfo.username}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">企业邮箱：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{accountInfo.email||'暂无'}}</h4>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">手机号：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{accountInfo.phone||'暂无'}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">职位：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{accountInfo.positionName||'暂无'}}</h4>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">部门：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{accountInfo.deptName||'暂无'}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">角色：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{accountInfo.roleName||'暂无'}}</h4>
          </Col>
        </Row>
      </div>
      <div class="baseInfo">
        <h3>基础信息</h3>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">身份证号码：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{baseInfo.personId||'暂无'}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">性别：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{baseInfo.sex||'暂无'}}</h4>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">生日：</Col>
          <Col span="5" class="inputbox">
          <!-- {{baseInfo.birthdayType||'公历'}} -->
            <h4 class="inputbox"> {{baseInfo.birthday||'暂无'}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">民族：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{baseInfo.race||'暂无'}}</h4>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">户口类型：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{baseInfo.householdType||'暂无'}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">婚育状况：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{baseInfo.maritalStatus||'暂无'}}</h4>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">户籍地址：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{baseInfo.permanentAddress||'暂无'}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">家庭住址：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{baseInfo.homeAddress||'暂无'}}</h4>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">毕业院校：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{baseInfo.graduateSchool||'暂无'}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">毕业时间：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{baseInfo.graduateDate||'暂无'}}</h4>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">学历：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{baseInfo.educateName||'暂无'}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">专业：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{baseInfo.major||'暂无'}}</h4>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">政治面貌：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{baseInfo.politicsFace||'暂无'}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">职称：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{baseInfo.title||'暂无'}}</h4>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">驾照领取时间：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{baseInfo.driveLicenseDate||'暂无'}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">外语语种及水平：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{baseInfo.foreignLevel||'暂无'}}</h4>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">兴趣及特长：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{baseInfo.hobby||'暂无'}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">计算机水平：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{baseInfo.computerLevel||'暂无'}}</h4>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">俱乐部：</Col>
          <Col span="15">
            <span
              style="margin-right:10px;line-height:30px"
              v-for="(item,index) in baseInfo.clubNames"
              :key="index"
              class="inputbox"
            >{{item}}</span>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">工作经历：</Col>
          <Col span="15"></Col>
          <Col span="15">
            <Table
              border
              disabled-hover
              :columns="tableHeader.workExperiences"
              :data="baseInfo.workExperiences"
            ></Table>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">家庭主要成员：</Col>
          <Col span="15"></Col>
          <Col span="15">
            <Table
              :disabled-hover="true"
              border
              :columns="tableHeader.familyMembers"
              :data="baseInfo.familyMembers"
            ></Table>
          </Col>
        </Row>
      </div>
      <div class="inPositionInfo" v-if="!isSelf">
        <h3>在职信息</h3>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">状态：</Col>
          <Col span="5">
            <h4 class="inputbox">{{inPositionInfo.userStatusName}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">入职日期：</Col>
          <Col span="5">
            <h4 class="inputbox">{{inPositionInfo.entryDate}}</h4>
          </Col>
        </Row>
        <Row class="rowMargin" v-if="inPositionInfo.userStatus">
          <Col span="3" offset="1" class="title">离职时间：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{inPositionInfo.leaveDate||'暂无'}}</h4>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">职级：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{inPositionInfo.rankName||'暂无'}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">工龄：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{inPositionInfo.workingYears||'暂无'}}</h4>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">师傅：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{inPositionInfo.masterName||'暂无'}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">工资卡号：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{inPositionInfo.cardNumber||'暂无'}}</h4>
          </Col>
        </Row>

        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">合同起始日期：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{inPositionInfo.contractStartDate||'暂无'}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">合同到期日期：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{inPositionInfo.contractEndDate||'暂无'}}</h4>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">转正日期：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{inPositionInfo.conversionDate||'暂无'}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">社保起始月份：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{inPositionInfo.socialSecurityDate||'暂无'}}</h4>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">公积金起始月份：</Col>
          <Col span="5" class="inputbox">
            <h4 class="inputbox">{{inPositionInfo.fundStartDate||'暂无'}}</h4>
          </Col>
          <Col span="3" offset="2" class="title">未购原因：</Col>
          <Col span="5" class="inputbox">
            <h4
              class="inputbox"
              style="white-space: pre-line;"
            >{{inPositionInfo.notBuyReason||'暂无'}}</h4>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">外出培训记录：</Col>
          <Col
            span="15"
            class="title"
            style="text-align:left"
            v-show="showTrains"
            @click="showTrains=false"
          >
            <span @click="showTrains=false" style="cursor:pointer">
              收起
              <Icon type="md-arrow-dropup" />
            </span>
          </Col>
          <Col
            span="15"
            class="title"
            style="text-align:left"
            v-show="!showTrains"
            @click="showTrains=true"
          >
            <span @click="showTrains=true" style="cursor:pointer">
              展开
              <Icon type="md-arrow-dropdown" />
            </span>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="15" offset="4" v-show="showTrains">
            <Table
              :disabled-hover="true"
              border
              :columns="tableHeader.trains"
              :data="baseInfo.trains"
            ></Table>
          </Col>
        </Row>
      </div>
      <div class="enclosure">
        <h3>附件</h3>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">身份证：</Col>
          <Col span="5">
            <div
              v-for="(img,i) in enclosure.personIdUrl"
              :key="i"
              style="width:50%;float:left;position:relative"
            >
              <viewer>
                <div class="imgbox">
                  <img :src="staticUrl+img.url" class="inputbox" />
                </div>
              </viewer>
            </div>
          </Col>
          <Col span="3" offset="2" class="title">证书：</Col>
          <Col span="5" v-if="enclosure.certificateUrl.length===0" style="line-height:30px;">
            <span>暂无</span>
          </Col>
          <Col span="5" v-if="enclosure.certificateUrl.length!==0">
            <div
              v-for="(img,i) in enclosure.certificateUrl"
              :key="i"
              style="width:50%;float:left;position:relative"
            >
              <viewer>
                <div class="imgbox">
                  <img :src="staticUrl+img.url" class="inputbox" />
                </div>
              </viewer>
            </div>
          </Col>
        </Row>
      </div>
      <div class="actionButton">
        <Row class="rowMargin">
          <Col span="5" offset="8">
            <div style="margin:0 atuo;text-align:center">
              <Button
                class="saveData"
                type="primary"
                v-if="!isSelf && permiss.update"
                @click="edit"
              >编辑</Button>
              <!-- 2019.8.27，高永艳提出不需要删除用户 -->
              <!-- <Button class="deletData" type="primary" v-if="!isSelf && permiss.update" @click="delModal=true">删除</Button> -->
              <Button class="cancelAdd" @click="closeTag">取消</Button>
            </div>
          </Col>
        </Row>
        <Modal v-model="delModal" title="温馨提示" @on-ok="deleteUser">
          <h3 style="text-align:center">是否删除用户{{baseInfo.nickname}}？</h3>
        </Modal>
      </div>
    </Card>
  </div>
</template>

<script>
import { baseUrl, staticUrl } from '@/api/base.js'
import addImg from '@/assets/images/add.png'
import reduceImg from '@/assets/images/reduce.png'
import delImg from '@/assets/images/close.png'
import TreeSelect from '_c/tree-select'
export default {
  name: 'showUser',
  components: {
    TreeSelect
  },
  data () {
    return {
      imgs: {
        addImg,
        reduceImg,
        delImg
      },
      showTrains: false,
      delModal: false,
      staticUrl,
      baseUrl,
      // 账户信息
      accountInfo: {
        nickname: '', // 姓名
        jobNumber: '', // 工号
        username: '', // 登录名
        password: '', // 密码
        phone: '', // 手机号
        email: '', // 邮箱
        apartList: [], // 部门list
        apart: [], // 部门
        positionList: [], // 职位列表
        position: '', // 职位
        visible: true // 是否展示明文 true:暗文显示，false:明文显示
      },
      // 基础信息
      baseInfo: {
        personId: '', // 身份证号码
        sex: '', // 性别
        birthdayType: '阳历', // 生日类型
        birthday: '', // 生日
        race: '', // 民族
        householdType: '', // 户口类型
        maritalStatus: '', // 婚育状况
        permanentAddress: '', // 户籍地址
        homeAddress: '', // 家庭住址
        graduateSchool: '', // 毕业院校
        graduateDate: '', // 毕业时间
        educateId: '', // 学历
        major: '', // 专业
        politicsFace: '', // 政治面貌
        title: '', // 职称
        driveLicenseDate: '', // 驾照领取时间
        foreignLevel: '', // 外语水平
        hobby: '', // 兴趣特长
        computerLevel: '' // 计算机水平
      },
      // 在职信息
      inPositionInfo: {
        userStatus: '1', // 是否显示离职 false为在职
        statu: '', // 在职离职状态
        entryDate: '', // 入职日期
        leaveDate: '', // 离职时间
        positionRank: '', // 职级
        positionRankList: [], // 职级列表
        serverLength: '', // 工龄
        master: '', // 师傅
        masterList: [], // 师傅列表
        cardNumber: '', // 银行卡号
        contractStartDate: '', // 合同起始日期
        contractEndDate: '', // 合同到期日期
        conversionDate: '', // 转正日期
        socialSecurityDate: '', // 社保起始月份
        fundStartDate: '', // 公积金起始月份
        notBuyReason: '' // 公积金未购原因
      },
      tableHeader: {
        workExperiences: [
          {
            title: '起止时间',
            key: 'timeFromTo'
          },
          {
            title: '公司名称',
            key: 'companyName'
          },
          {
            title: '工作内容',
            key: 'workContent'
          },
          {
            title: '证明人',
            key: 'certifier'
          },
          {
            title: '联系电话',
            key: 'telephoneNumber'
          }
          // {title: '操作',key: 'action'}
        ],
        familyMembers: [
          {
            title: '称谓',
            key: 'appellation'
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '工作单位',
            key: 'workUnit'
          },
          {
            title: '职务',
            key: 'duty'
          },
          {
            title: '联系电话',
            key: 'telephoneNumber'
          }
        ],
        trains: [
          {
            title: '外出培训时间',
            key: 'trainDate'
          },
          {
            title: '外出培训地点',
            key: 'trainPlace'
          },
          {
            title: '培训内容',
            key: 'trainContent'
          }
        ]
      },
      // 附件
      enclosure: {
        personIdUrl: [
          // 身份证图片
          // {name: '银行开户许可',status: 0,url: 'Uploads/20190226/443e084efeba3a9e28f02b482870967b.jpg'}
        ],
        certificateUrl: [
          // 证书图片
          // {name: '银行开户许可',status: 0,url: 'Uploads/20190226/443e084efeba3a9e28f02b482870967b.jpg'}
        ]
      },
      selection: {
        educate: [] // 学历
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getData()
    },
    getData () {
      this.$axios({
        url: baseUrl + '/user/detail',
        method: 'post',
        data: $qs.stringify({
          id: this.$route.query.id
        })
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.accountInfo = resp.data.content
            this.baseInfo = resp.data.content
            this.inPositionInfo = resp.data.content
            this.enclosure.personIdUrl = resp.data.content.personIdUrl
            this.enclosure.certificateUrl = resp.data.content.certificateUrl
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 手动关闭标签页
    closeTag () {
      bus.$emit('on-myclose', this.$route)
    },
    // 图片上传成功回调函数
    uploadSuccess (type, response, file, fileList) {
      // response是图片上传接口返回的消息,rel===true时，msg为图片相对路径
      if (response.rel === true) {
        // type可能有personIdUrl、certificateUrl
        this.enclosure[type].push({
          name: type,
          status: 0,
          url: response.msg
        })
      } else {
        console.error(response.msg)
      }
    },
    deleteImg (type, index) {
      this.enclosure[type].splice(index, 1)
    },
    deleteUser () {
      this.$axios({
        url: baseUrl + '/user/delete',
        method: 'post',
        data: $qs.stringify({
          id: this.$route.query.id
        })
      })
        .then(res => {
          if (res.data.code === 10000) {
            console.log('删除成功')
          } else {
            console.log(res.data.msg)
          }
        })
        .catch(err => {
          console.log('deleteUser' + err)
        })
    },
    edit () {
      let id = this.$route.query.id
      this.closeTag()
      this.$nextTick(() => {
        this.$router.push({
          name: 'addUser',
          params: {
            title: '编辑'
          },
          query: {
            id,
            type: 'edit'
          }
        })
      })
    }
  },
  computed: {
    type () {
      // add代表人资开户,edit代表人资编辑,self是从个人头像点进来的
      return this.$route.query.type || 'self'
    },
    isAdd () {
      // 开户
      return this.type === 'add'
    },
    isSelf () {
      return this.type === 'self'
    },
    permiss () {
      /**
       *
        create: false, // 新增
        export: false, // 导出
        retrie: false, // 查看
        update: false, // 编辑
        permission: false, // 权限设置
      */
      return this.$store.state.user.userpermission.userManage
    }
  },
  watch: {
    $route (to, from) {
      this.init()
    }
  }
}
</script>

<style>
#showUser {
  padding: 20px;
}

#showUser .rowMargin {
  margin: 10px;
}

#showUser .title {
  text-align: right;
  line-height: 30px;
  color: #000;
  font-weight: 600;
}

#showUser h3 {
  text-indent: 5em;
  color: #3db79f;
  background-color: #f2f2f2;
}

#showUser .tips {
  line-height: 32px;
  float: left;
  position: absolute;
  color: red;
}

#showUser i.require {
  color: red;
}

#showUser .imgbox {
  width: 100%;
  display: inline-block;
  position: relative;
}

#showUser table input {
  border-radius: unset;
  border: none;
  border-bottom: 1px solid #dcdee2;
  outline: none;
}

#showUser .close {
  display: inline-block;
  cursor: pointer;
  color: red;
  position: absolute;
  right: -5px;
  top: -5px;
  width: 20px;
  height: 20px;
  z-index: 2;
}

#showUser h4.inputbox {
  line-height: 30px;
  font-weight: 545;
  width: 100%;
}

#showUser img.inputbox {
  line-height: 30px;
  font-weight: 545;
  width: 100%;
}

#showUser h3::before {
  content: '';
  display: inline-block;
  background-color: #34b49a;
  width: 3px;
  height: 1em;
  position: relative;
  top: 2px;
  left: -32px;
}

#showUser table input {
  border-radius: unset;
  border: none;
  border-bottom: 1px solid #dcdee2;
}

.actionButton {
  margin-top: 30px;
}

#showUser .actionButton .saveData.ivu-btn-primary {
  background-color: #19aa8d;
  border-color: #19aa8d;
  color: #fff;
  margin-right: 20px;
}

#showUser .actionButton .deletData.ivu-btn-primary {
  color: #fff;
  background-color: #ed4014;
  border-color: #ed4014;
  margin-right: 20px;
}
</style>
