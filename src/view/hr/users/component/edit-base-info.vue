<template>
<div class="section">
    <!--baseinfo s-->
    <div class="title">
        <Icon type="md-school" style="color: #19aa8d;margin-right: 10px;" size="20" />
        <span class="title-name">基础信息</span>
        <div class="wrapper">
            <Button class="btn" @click="handleCancle">取消</Button>
            <Button type="primary" @click="handleSaveUserInfo">保存</Button>
        </div>
    </div>
    <div class="content">
        <!--
        <Row>
            <Col span="3" offset="2">
            <div class="main-title">个人信息</div>
            </Col>
        </Row>
        -->
        <Form ref="formValidate" :model="baseInfo" :rules="ruleValidate" :label-width="132">
            <Row>
                <Col span="8" offset="3">
                <FormItem label="身份证号码：" prop="personId">
                    <Input v-model="baseInfo.personId" placeholder="请输入身份证号码"></Input>
                </FormItem>
                </Col>
                <Col span="8" offset="2">
                <FormItem label="性别：" prop="sex">
                    <Select v-model="baseInfo.sex">
                        <Option value="男">男</Option>
                        <Option value="女">女</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8" offset="3">
                <FormItem label="生日：" prop="birthday">
                    <DatePicker style="width:100%" v-model="baseInfo.birthday" format="yyyy-MM-dd"></DatePicker>
                </FormItem>
                </Col>
                <Col span="8" offset="2">
                <FormItem label="民族：" prop="race">
                    <Input v-model="baseInfo.race"></Input>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8" offset="3">
                <FormItem label="户口类型：" prop="householdType">
                    <Select v-model="baseInfo.householdType">
                        <Option value="农村户口">农村户口</Option>
                        <Option value="城镇户口">城镇户口</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="8" offset="2">
                <FormItem label="婚育情况：" prop="maritalStatus">
                    <Select v-model="baseInfo.maritalStatus">
                        <Option value="未婚未育">未婚未育</Option>
                        <Option value="未婚已育">未婚已育</Option>
                        <Option value="已婚未育">已婚未育</Option>
                        <Option value="已婚已育">已婚已育</Option>
                    </Select>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8" offset="3">
                <FormItem label="户籍地址：" prop="permanentAddress">
                    <Input v-model="baseInfo.permanentAddress"></Input>
                </FormItem>
                </Col>
                <Col span="8" offset="2">
                <FormItem label="家庭住址：" prop="homeAddress">
                    <Input v-model="baseInfo.homeAddress"></Input>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8" offset="3">
                <FormItem label="毕业院校：" prop="graduateSchool">
                    <Input v-model="baseInfo.graduateSchool"></Input>
                </FormItem>
                </Col>
                <Col span="8" offset="2">
                <FormItem label="毕业时间：" prop="graduateDate">
                    <DatePicker style="width:100%" type="month" v-model="baseInfo.graduateDate" format="yyyy-MM"></DatePicker>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8" offset="3">
                <FormItem label="学历：" prop="educateId">
                    <Select v-model="baseInfo.educateId">
                        <Option v-for="item in headerSelection.educate" :key="item.rankId" :value="item.rankId" :label="item.rankName">{{item.rankName}}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="8" offset="2">
                <FormItem label="专业：" prop="major">
                    <Input v-model="baseInfo.major"></Input>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8" offset="3">
                <FormItem label="政治面貌：" prop="politicsFace">
                    <Select v-model="baseInfo.politicsFace">
                        <Option value="党员" key="党员">党员</Option>
                        <Option value="预备党员" key="预备党员">预备党员</Option>
                        <Option value="民主党派" key="民主党派">民主党派</Option>
                        <Option value="团员" key="团员">团员</Option>
                        <Option value="群众" key="群众">群众</Option>
                        <Option value="其他" key="其他">其他</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="8" offset="2">
                <FormItem label="职称：" prop="title">
                    <Input v-model="baseInfo.title"></Input>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8" offset="3">
                <FormItem label="驾照领取时间：" prop="driveLicenseDate">
                    <DatePicker style="width:100%" v-model="baseInfo.driveLicenseDate" format="yyyy-MM-dd" @on-change="baseInfo.driveLicenseDate=$event"></DatePicker>
                </FormItem>
                </Col>
                <Col span="8" offset="2">
                <FormItem label="外语语种及水平：" prop="foreignLevel">
                    <Input v-model="baseInfo.foreignLevel"></Input>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8" offset="3">
                <FormItem label="兴趣及特长：" prop="hobby">
                    <Input v-model="baseInfo.hobby"></Input>
                </FormItem>
                </Col>
                <Col span="8" offset="2">
                <FormItem label="计算机水平：" prop="computerLevel">
                    <Input v-model="baseInfo.computerLevel"></Input>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="18" offset="3">
                <FormItem label="俱乐部：" prop="clubNames">
                    <CheckboxGroup size="large" v-model="baseInfo.clubNames">
                        <Checkbox v-for="(item,index) in headerSelection.clubs" :label="item.optionName" :key="index">
                            <span>{{item.optionName}}</span>
                        </Checkbox>
                    </CheckboxGroup>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="18" offset="3">
                <FormItem label="工作经历：">
                    <Table disabled-hover border :columns="tableHeader.workExperiences" :data="baseInfo.workExperiences">
                        <template slot-scope="{ row,index }" slot="timeFromTo">
                            <Input v-model="row.timeFromTo" placeholder="例:2018.02-2019.03" @on-blur="editTable('baseInfo','workExperiences',index,'timeFromTo',row.timeFromTo)"></Input>
                        </template>
                        <template slot-scope="{ row,index }" slot="companyName">
                            <Input v-model="row.companyName" @on-blur="editTable('baseInfo','workExperiences',index,'companyName',row.companyName)"></Input>
                        </template>
                        <template slot-scope="{ row,index }" slot="workContent">
                            <Input v-model="row.workContent" @on-blur="editTable('baseInfo','workExperiences',index,'workContent',row.workContent)"></Input>
                        </template>
                        <template slot-scope="{ row,index }" slot="certifier">
                            <Input v-model="row.certifier" @on-blur="editTable('baseInfo','workExperiences',index,'certifier',row.certifier)"></Input>
                        </template>
                        <template slot-scope="{ row,index }" slot="telephoneNumber">
                            <Input v-model="row.telephoneNumber" @on-blur="editTable('baseInfo','workExperiences',index,'telephoneNumber',row.telephoneNumber)"></Input>
                        </template>
                    </Table>
                </FormItem>
                </Col>
            </Row>

            <Row>
                <Col span="18" offset="3">
                <FormItem label="家庭主要成员：">
                    <Table disabled-hover border :columns="tableHeader.familyMembers" :data="baseInfo.familyMembers">
                        <template slot-scope="{ row,index }" slot="appellation">
                            <Input v-model="row.appellation" @on-blur="editTable('baseInfo','familyMembers',index,'appellation',row.appellation)"></Input>
                        </template>
                        <template slot-scope="{ row,index }" slot="name">
                            <Input v-model="row.name" @on-blur="editTable('baseInfo','familyMembers',index,'name',row.name)"></Input>
                        </template>
                        <template slot-scope="{ row,index }" slot="workUnit">
                            <Input v-model="row.workUnit" @on-blur="editTable('baseInfo','familyMembers',index,'workUnit',row.workUnit)"></Input>
                        </template>
                        <template slot-scope="{ row,index }" slot="duty">
                            <Input v-model="row.duty" @on-blur="editTable('baseInfo','familyMembers',index,'duty',row.duty)"></Input>
                        </template>
                        <template slot-scope="{ row,index }" slot="telephoneNumber">
                            <Input v-model="row.telephoneNumber" @on-blur="editTable('baseInfo','familyMembers',index,'telephoneNumber',row.telephoneNumber)"></Input>
                        </template>
                    </Table>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="3" offset="2">
                <div class="main-title">在职信息</div>
                </Col>
            </Row>
            <Row>
                <Col span="8" offset="3">
                <FormItem label="入职日期：" prop="entryDate">
                    <DatePicker v-model="baseInfo.entryDate" style="width:100%" format="yyyy-MM-dd" size="default" type="date"></DatePicker>
                </FormItem>
                </Col>
                <Col span="8" offset="2">
                <FormItem label="工龄：" prop="workingYears">
                    <Input disabled v-model="baseInfo.workingYears"></Input>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8" offset="3">
                <FormItem label="职级：" prop="rankId">
                    <Select v-model="baseInfo.rankId" clearable filterable>
                        <Option v-for="item in headerSelection.rank" :value="item.rankId" :label="item.rankName" :key="item.rankId">{{item.rankName}}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="8" offset="2">
                <FormItem label="工资卡号：" prop="cardNumber">
                    <Input v-model="baseInfo.cardNumber" clearable></Input>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8" offset="3">
                <FormItem label="师父：" prop="masterId">
                    <Select v-model="baseInfo.masterId" clearable filterable>
                        <Option v-for="item in employees" :value="item.id" :key="item.id" :label="item.nickname">{{item.nickname}}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="8" offset="2">
                <FormItem label="合同起始日期：" prop="contractStartDate">
                    <DatePicker :value="baseInfo.contractStartDate" v-model="baseInfo.contractStartDate" style="width:100%" @on-change="baseInfo.contractStartDate=$event" format="yyyy-MM-dd" size="default" type="date" placeholder="合同起始时间"></DatePicker>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8" offset="3">
                <FormItem label="社保起始月份：" prop="socialSecurityDate">
                    <DatePicker type="month" :value="baseInfo.socialSecurityDate" v-model="baseInfo.socialSecurityDate" style="width:100%" @on-change="baseInfo.socialSecurityDate=$event" format="yyyy-MM" size="default" placeholder="社保起始月份"></DatePicker>
                </FormItem>
                </Col>
                <Col span="8" offset="2">
                <FormItem label="转正日期：" prop="conversionDate">
                    <DatePicker :value="baseInfo.conversionDate" v-model="baseInfo.conversionDate" style="width:100%" @on-change="baseInfo.conversionDate=$event" format="yyyy-MM-dd" size="default" type="date" placeholder="转正时间"></DatePicker>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8" offset="3">
                <FormItem label="公积金起始月份：" prop="fundStartDate">
                    <DatePicker type="month" :value="baseInfo.fundStartDate" v-model="baseInfo.fundStartDate" style="width:100%" @on-change="baseInfo.fundStartDate=$event" format="yyyy-MM" size="default" placeholder="公积金起始月份"></DatePicker>
                </FormItem>
                </Col>
                <Col span="8" offset="2">
                <FormItem label="未购原因：" prop="notBuyReason">
                    <Input v-model="baseInfo.notBuyReason" type="textarea" clearable></Input>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="3" offset="2">
                <div class="main-title">附件</div>
                </Col>
            </Row>
            <Row>
                <Col span="8" offset="3">
                <FormItem label="身份证：" prop="personIdUrl">
                    <div slot="label">
                        <p style="position: relative;left: 57px;float: left;display: inline-block;margin-right: 4px;line-height: 1; font-family: SimSun; font-size: 12px;color: #ed4014;">*</p>身份证：
                    </div>
                    <div v-for="(img,i) in enclosure.personIdUrl" :key="i" style="width:50%;float:left;position:relative">
                        <img :src="imgs.delImg" class="close" @click="deleteImg('personIdUrl',i)">
                        <viewer>
                            <div class="imgbox">
                                <img :src="staticUrl+img.url" class="inputbox">
                            </div>
                        </viewer>
                    </div>
                    <Upload :format="['jpg','jpeg','png']" :max-size="20480" multiple :show-upload-list="false" name="fileData" :on-success="(value)=> uploadSuccess('personIdUrl', value)" type="drag" :action="staticUrl+'/index.php'" style="width:50%;padding-left: 10px;display:inline-block">
                        <div style="50%;line-height: 100px;padding-left:10px;">
                            <Icon type="ios-camera" size="40"></Icon>
                        </div>
                    </Upload>
                </FormItem>
                </Col>
                <Col span="8" offset="2">
                <FormItem label="证书：" prop="certificateUrl">
                    <div v-for="(img,i) in enclosure.certificateUrl" :key="i" style="width:50%;float:left;position:relative">
                        <img :src="imgs.delImg" class="close" @click="deleteImg('certificateUrl',i)">
                        <viewer>
                            <div class="imgbox">
                                <img :src="staticUrl+img.url" class="inputbox">
                            </div>
                        </viewer>
                    </div>
                    <Upload :format="['jpg','jpeg','png']" :max-size="20480" :show-upload-list="false" multiple name="fileData" :on-success="(value)=> uploadSuccess('certificateUrl', value)" type="drag" :action="staticUrl+'/index.php'" style="width:50%;padding-left: 10px;display:inline-block">
                        <div style="50%;line-height: 100px;padding-left:10px;">
                            <Icon type="ios-camera" size="40"></Icon>
                        </div>
                    </Upload>
                </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="6" offset="10">
                <Button class="btn" @click="handleCancle">取消</Button>
                <Button type="primary" @click="handleSaveUserInfo">保存</Button>
                </Col>
            </Row>

        </Form>
    </div>
</div>
</template>

<script>
import mixins from '../mixins'
import headeInfo from './heade-info'
import moment from 'moment'
import {
  baseUrl,
  staticUrl
} from '@/api/base.js'
import addImg from '@/assets/images/add.png'
import reduceImg from '@/assets/images/reduce.png'
import delImg from '@/assets/images/close.png'
export default {
  name: 'completeInfo',
  components: {
    headeInfo
  },
  mixins: [mixins],
  data () {
    return {
      isEdit: true,
      info: {},
      imgs: {
        addImg,
        reduceImg,
        delImg
      },
      // 是否保存成功
      isSaved: false,
      staticUrl,
      baseUrl,
      // 基础信息
      baseInfo: {
        id: this.$route.query.id,
        personId: '', // 身份证号码
        sex: '', // 性别
        birthdayType: '公历', // 生日类型
        birthday: '', // 生日
        race: '汉族', // 民族
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
        computerLevel: '', // 计算机水平
        clubNames: [], // 俱乐部名
        workExperiences: [ // 工作经历
          {
            timeFromTo: '',
            companyName: '',
            workContent: '',
            certifier: '',
            telephoneNumber: ''
          }
        ],
        familyMembers: [ // 家庭成员
          {
            appellation: '',
            name: '',
            workUnit: '',
            duty: '',
            telephoneNumber: ''
          }
        ],
        // 在职信息
        userStatus: 0, // 在职离职状态
        entryDate: '', // 入职日期
        leaveDate: '', // 离职时间
        rankId: null, // 职级
        workingYears: '', // 工龄
        masterId: null, // 师傅
        cardNumber: '', // 银行卡号
        contractStartDate: '', // 合同起始日期
        contractEndDate: '', // 合同到期日期
        conversionDate: '', // 转正日期
        socialSecurityDate: '', // 社保起始月份
        fundStartDate: '', // 公积金起始月份
        notBuyReason: '', // 公积金未购原因
        trains: [] // 外出培训记录
      },
      initBaseInfo: {},
      ruleValidate: {
        personId: [{
          required: true,
          message: '必填项',
          trigger: 'blur'
        }],
        sex: [{
          required: true,
          message: '必填项',
          trigger: 'blur'
        }],
        birthday: [{
          required: true,
          type: 'date',
          message: '必填项',
          trigger: 'blur'
        }],
        race: [{
          required: true,
          message: '必填项',
          trigger: 'blur'
        }],
        householdType: [{
          required: true,
          message: '必填项',
          trigger: 'blur'
        }],
        homeAddress: [{
          required: true,
          message: '必填项',
          trigger: 'blur'
        }],
        graduateSchool: [{
          required: true,
          message: '必填项',
          trigger: 'blur'
        }],
        graduateDate: [{
          required: true,
          message: '必填项',
          type: 'date',
          trigger: 'blur'

        }],
        educateId: [{
          required: true,
          message: '必填项',
          type: 'number',
          trigger: 'blur'
        }],
        politicsFace: [{
          required: true,
          message: '必填项',
          trigger: 'blur'
        }],
        entryDate: [{
          required: true,
          message: '必填项',
          type: 'date',
          trigger: 'blur'
        }],
        cardNumber: [{
          required: true,
          message: '必填项',
          trigger: 'blur'
        }],
        masterId: [{
          required: true,
          message: '必填项',
          type: 'number',
          trigger: 'blur'
        }],
        rankId: [{
          required: true,
          message: '必填项',
          type: 'number',
          trigger: 'blur'
        }]

      },
      // 附件
      enclosure: {
        personIdUrl: [
          // 身份证图片
          // {name: "银行开户许可",status: 0,url: "Uploads/20190226/443e084efeba3a9e28f02b482870967b.jpg"}
        ],
        certificateUrl: [
          // 证书图片
          // {name: "银行开户许可",status: 0,url: "Uploads/20190226/443e084efeba3a9e28f02b482870967b.jpg"}
        ]
      },
      // 工经经历 家庭主要成员表头数据
      tableHeader: {
        workExperiences: [{
          title: '起止时间',
          slot: 'timeFromTo',
          key: 'timeFromTo'
        },
        {
          title: '公司名称',
          slot: 'companyName'
        },
        {
          title: '工作内容',
          slot: 'workContent'
        },
        {
          title: '证明人',
          slot: 'certifier'
        },
        {
          title: '联系电话',
          slot: 'telephoneNumber'
        }
          // {title: '操作',slot: 'action'}
        ],
        familyMembers: [{
          title: '称谓',
          slot: 'appellation'
        },
        {
          title: '姓名',
          slot: 'name'
        },
        {
          title: '工作单位',
          slot: 'workUnit'
        },
        {
          title: '职务',
          slot: 'duty'
        },
        {
          title: '联系电话',
          slot: 'telephoneNumber'
        }
        ]
      },

      editTableContent: ''

    }
  },
  mounted () {
    this.getHeaderListData()
    this.getWorkTableData()
    if (this.$route.name === 'lookUserinfo') {
      this.getBaseInfo()
    }
    if (this.$route.query.type === 'recoverUser') {
      this.getRecoverData()
    }
  },
  methods: {
    getBaseInfo () {
      this.$axios({
        url: baseUrl + '/user/detail',
        method: 'post',
        data: $qs.stringify({
          id: this.$route.query.id
        })
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.baseInfo = res.data.content
            this.enclosure.personIdUrl = res.data.content.personIdUrl
            this.enclosure.certificateUrl = res.data.content.certificateUrl
            this.initBaseInfo = JSON.stringify(this.baseInfo)
            this.getWorkTableData()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log('tbcSave' + err)
        })
    },
    getWorkTableData () {
      for (let i = this.baseInfo.workExperiences.length; i < 5; i++) {
        this.baseInfo.workExperiences.push({
          timeFromTo: '',
          companyName: '',
          workContent: '',
          certifier: '',
          telephoneNumber: ''
        })
      }
      for (let i = this.baseInfo.familyMembers.length; i < 5; i++) {
        this.baseInfo.familyMembers.push({
          appellation: '',
          name: '',
          workUnit: '',
          duty: '',
          telephoneNumber: ''
        })
      }
    },
    // date格式转换
    dateToYYMM () {
      if (this.baseInfo.birthday) {
        this.baseInfo.birthday = moment(this.baseInfo.birthday).format(
          'YYYY-MM-DD'
        )
      }
      if (this.baseInfo.driveLicenseDate) {
        this.baseInfo.driveLicenseDate = moment(this.baseInfo.driveLicenseDate).format(
          'YYYY-MM-DD'
        )
      }
      if (this.baseInfo.graduateDate) {
        this.baseInfo.graduateDate = moment(this.baseInfo.graduateDate).format(
          'YYYY-MM-DD'
        )
      }
      if (this.baseInfo.entryDate) {
        this.baseInfo.entryDate = moment(this.baseInfo.entryDate).format(
          'YYYY-MM-DD'
        )
      }
      if (this.baseInfo.contractStartDate) {
        this.baseInfo.contractStartDate = moment(this.baseInfo.contractStartDate).format(
          'YYYY-MM-DD'
        )
      }
      if (this.baseInfo.conversionDate) {
        this.baseInfo.conversionDate = moment(this.baseInfo.conversionDate).format(
          'YYYY-MM-DD'
        )
      }
      if (this.baseInfo.socialSecurityDate) {
        this.baseInfo.socialSecurityDate = moment(this.baseInfo.socialSecurityDate).format(
          'YYYY-MM'
        )
      }
      if (this.baseInfo.fundStartDate) {
        this.baseInfo.fundStartDate = moment(this.baseInfo.fundStartDate).format(
          'YYYY-MM'
        )
      }
    },
    // 去除工作经历和家庭成员中没有填的空项
    trimVoidRow () {
      this.baseInfo.workExperiences = this.baseInfo.workExperiences.filter(e => Object.values(e).some(e => e))
      this.baseInfo.familyMembers = this.baseInfo.familyMembers.filter(e => Object.values(e).some(e => e))
    },
    // 保存
    handleSaveUserInfo () {
      this.trimVoidRow()
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          if (this.enclosure.personIdUrl.length > 0) {
            let tbuser = {}
            this.dateToYYMM()
            if (this.$route.query.type === 'recoverUser') { // 是复职 传userStatus
              tbuser = Object.assign(
                this.baseInfo, {
                  personIdUrl: this.enclosure.personIdUrl
                }, {
                  certificateUrl: this.enclosure.certificateUrl
                }, {
                  userStatus: '0'
                }
              )
            } else {
              tbuser = Object.assign(
                this.baseInfo, {
                  personIdUrl: this.enclosure.personIdUrl
                }, {
                  certificateUrl: this.enclosure.certificateUrl
                }
              )
            }
            this.$axios({
              url: baseUrl + '/user/edituserinfo',
              method: 'post',
              data: {
                backlogId: this.$route.query.backlogId,
                tbuser: tbuser
              }
            })
              .then(res => {
                if (res.data.code === 10040) {
                  this.isSaved = true
                  // 第一遍录入
                  if (this.$route.query.type === 'tbc') {
                    this.$Message.success(res.data.msg)
                    this.closeCurrentTag()
                  } else {
                    this.$Message.success(res.data.msg)
                    this.handleCloseTag()
                  }
                } else {
                  this.$Message.error(res.data.msg)
                }
              })
              .catch(err => {
                console.log('edit-base-info' + err)
              })
          } else {
            this.$Message.error('身份证必须上传')
          }
        } else {
          this.$Message.error('有必填项未填写')
        }
      })
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
    // 编辑工作经历和家庭主要成员
    editTable (obj, type, index, key, value) {
      let newValue = value
      this[obj][type][index][key] = newValue
    },
    // 复职信息获取
    getRecoverData () {
      this.$axios({
        url: baseUrl + '/user/detail',
        method: 'post',
        data: $qs.stringify({
          id: this.$route.query.id
        })
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.baseInfo = res.data.content
            this.enclosure.personIdUrl = res.data.content.personIdUrl
            this.enclosure.certificateUrl = res.data.content.certificateUrl
            this.$emit('getBaseInfo', {
              value: this.baseInfo
            })
            this.getWorkTableData()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log('tbcSave' + err)
        })
    },
    // 判断页面数据是否有改动
    hasContentChanged () {
      this.dateToYYMM()
      this.trimVoidRow()
      if (this.isSaved) return false
      return this.initBaseInfo !== JSON.stringify(this.baseInfo)
    },
    handleCancle () {
      let hasChange
      // 如果未保存，判断内容是否有变
      if (!this.isSaved) {
        hasChange = this.hasContentChanged()
      } else {
        hasChange = false
      }
      // 如果有变化，此时点击离开页面提醒保存
      console.log('haschange', hasChange)
      if (hasChange) {
        this.$Modal.confirm({
          title: '取消编辑',
          content: '<p>还有未保存的内容，确认取消吗</p>',
          onOk: () => {
            this.isEdit = false
            this.$emit('showEdit', this.isEdit)
          }
        })
      } else {
        this.isEdit = false
        this.baseInfo = JSON.parse(JSON.stringify(this.initBaseInfo))
        this.$emit('showEdit', this.isEdit)
      }
    }

  },
  computed: {
    employees () {
      return this.app.employees
    },
    rankId () {
      return this.headerSelection.rankId
    }
  }
}
</script>

<style>
.detail-page-wrapper table input {
    border-radius: unset;
    border: none;
    border-bottom: 1px solid #dcdee2;
    outline: none;
}
</style><style lang="less" scoped>
@import '~@/assets/style/variables.less';

.section {
    .title {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;

        .title-name {
            font-size: 18px;
        }

        .wrapper {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            margin-bottom: 3px;

            .edit-button {
                color: @color-theme-green;
                border: 1px solid @color-theme-green;
            }
        }
    }

    .content {
        padding: 63px;

        .main-title {
            border-left: 2px solid #19aa8d;
            padding-left: 10px;
            font-size: 13px;
            margin: 10px 0px 30px 0px;
        }

        .imgbox {
            width: 100%;
            display: inline-block;
            position: relative;
        }

        img.inputbox {
            height: 100px;
            width: 100%;
            padding-left: 10px;
        }

        .close {
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

        table {
            input {
                border-radius: unset;
                border: none;
                border-bottom: 1px solid #dcdee2;
                outline: none;
            }
        }
    }

    .btn {
        margin: 0 15px;
    }
}
</style>
