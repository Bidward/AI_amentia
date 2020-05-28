<template>
<div>
    <div class="section">
        <div class="title">
            <Icon type="md-school" style="color: #19aa8d;margin-right: 10px;" size="20" />
            <span class="title-name">基础信息</span>
            <div class="wrapper">
                <Button v-if="!this.$route.query.type && permiss.update" class="wrapper-btn" type="primary" @click="handleEdit()">编辑</Button>
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
                        <p>{{baseInfo.personId || '/'}}</p>
                    </FormItem>
                    </Col>
                    <Col span="8" offset="2">
                    <FormItem label="性别：" prop="sex">
                        <p>{{baseInfo.sex || '/'}}</p>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="8" offset="3">
                    <FormItem label="生日：" prop="birthday">
                        <p>{{baseInfo.birthday || '/'}}</p>
                    </FormItem>
                    </Col>
                    <Col span="8" offset="2">
                    <FormItem label="民族：" prop="race">
                        <p>{{baseInfo.race || '/'}}</p>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="8" offset="3">
                    <FormItem label="户口类型：" prop="householdType">
                        <p>{{baseInfo.householdType || '/'}}</p>
                    </FormItem>
                    </Col>
                    <Col span="8" offset="2">
                    <FormItem label="婚育情况：" prop="maritalStatus">
                        <p>{{baseInfo.maritalStatus || '/'}}</p>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="8" offset="3">
                    <FormItem label="户籍地址：" prop="permanentAddress">
                        <p>{{baseInfo.permanentAddress || '/'}}</p>
                    </FormItem>
                    </Col>
                    <Col span="8" offset="2">
                    <FormItem label="家庭住址：" prop="homeAddress">
                        <p>{{baseInfo.homeAddress || '/'}}</p>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="8" offset="3">
                    <FormItem label="毕业院校：" prop="graduateSchool">
                        <p>{{baseInfo.graduateSchool || '/'}}</p>
                    </FormItem>
                    </Col>
                    <Col span="8" offset="2">
                    <FormItem label="毕业时间：" prop="graduateDate">
                        <p>{{baseInfo.graduateDate || '/'}}</p>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="8" offset="3">
                    <FormItem label="学历：" prop="educateId">
                        <p>{{baseInfo.educateName || '/'}}</p>
                    </FormItem>
                    </Col>
                    <Col span="8" offset="2">
                    <FormItem label="专业：" prop="major">
                        <p>{{baseInfo.major || '/'}}</p>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="8" offset="3">
                    <FormItem label="政治面貌：" prop="politicsFace">
                        <p>{{baseInfo.politicsFace || '/'}}</p>
                    </FormItem>
                    </Col>
                    <Col span="8" offset="2">
                    <FormItem label="职称：" prop="title">
                        <p>{{baseInfo.title || '/'}}</p>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="8" offset="3">
                    <FormItem label="驾照领取时间：" prop="driveLicenseDate">
                        <p>{{baseInfo.driveLicenseDate || '/'}}</p>
                    </FormItem>
                    </Col>
                    <Col span="8" offset="2">
                    <FormItem label="外语语种及水平：" prop="foreignLevel">
                        <p>{{baseInfo.foreignLevel || '/'}}</p>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="8" offset="3">
                    <FormItem label="兴趣及特长：" prop="hobby">
                        <p>{{baseInfo.hobby || '/'}}</p>
                    </FormItem>
                    </Col>
                    <Col span="8" offset="2">
                    <FormItem label="计算机水平：" prop="computerLevel">
                        <p>{{baseInfo.computerLevel || '/'}}</p>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="18" offset="3">
                    <FormItem label="俱乐部：" prop="clubNames">
                        <p>{{clubNameString || '/'}}</p>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="18" offset="3">
                    <FormItem label="工作经历：">
                        <Table border :columns="tableHeader.workExperiences" :data="baseInfo.workExperiences">
                        </Table>
                    </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span="18" offset="3">
                    <FormItem label="家庭主要成员：">
                        <Table border :columns="tableHeader.familyMembers" :data="baseInfo.familyMembers">
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
                        <p>{{baseInfo.entryDate || '/'}}</p>
                    </FormItem>
                    </Col>
                    <Col span="8" offset="2">
                    <FormItem label="工龄：" prop="workingYears">
                        <p>{{baseInfo.workingYears || '/'}}</p>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="8" offset="3">
                    <FormItem label="职级：" prop="rankName">
                        <p>{{baseInfo.rankName || '/'}}</p>
                    </FormItem>
                    </Col>
                    <Col span="8" offset="2">
                    <FormItem label="工资卡号：" prop="cardNumber">
                        <p>{{baseInfo.cardNumber || '/'}}</p>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="8" offset="3">
                    <FormItem label="师父：" prop="masterName">
                        <p>{{baseInfo.masterName || '/'}}</p>
                    </FormItem>
                    </Col>
                    <Col span="8" offset="2">
                    <FormItem label="合同起始日期：" prop="contractStartDate">
                        <p>{{baseInfo.contractStartDate || '/'}}</p>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="8" offset="3">
                    <FormItem label="社保起始月份：" prop="socialSecurityDate">
                        <p>{{baseInfo.socialSecurityDate || '/'}}</p>
                    </FormItem>
                    </Col>
                    <Col span="8" offset="2">
                    <FormItem label="转正日期：" prop="conversionDate">
                        <p>{{baseInfo.conversionDate || '/'}}</p>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="8" offset="3">
                    <FormItem label="公积金起始月份：" prop="fundStartDate">
                        <p>{{baseInfo.fundStartDate || '/'}}</p>
                    </FormItem>
                    </Col>
                    <Col span="8" offset="2">
                    <FormItem label="未购原因：" prop="notBuyReason">
                        <p>{{baseInfo.notBuyReason || '/'}}</p>
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
                        <div v-for="(img,i) in enclosure.personIdUrl" :key="i" style="width:50%;float:left;position:relative">
                            <viewer>
                                <div class="imgbox">
                                    <img :src="staticUrl+img.url" class="inputbox" />
                                </div>
                            </viewer>
                        </div>
                    </FormItem>
                    </Col>
                    <Col span="8" offset="2" v-if="enclosure.certificateUrl.length===0">
                    <FormItem label="证书：" prop="certificateUrl">
                        <p>/</p>
                    </FormItem>
                    </Col>
                    <Col span="8" offset="2" v-if="enclosure.certificateUrl.length!==0">
                    <FormItem label="证书：" prop="certificateUrl">
                        <div v-for="(img,i) in enclosure.certificateUrl" :key="i" style="width:50%;float:left;position:relative">
                            <viewer>
                                <div class="imgbox">
                                    <img :src="staticUrl+img.url" class="inputbox" />
                                </div>
                            </viewer>
                        </div>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="3" offset="10">
                    <Button v-if="!this.$route.query.type" type="primary" @click="handleEdit()">编辑</Button>
                    </Col>
                </Row>

            </Form>
        </div>
    </div>
</div>
</template>

<script>
import mixins from '../mixins'
import {
  baseUrl,
  staticUrl
} from '@/api/base.js'
import addImg from '@/assets/images/add.png'
import reduceImg from '@/assets/images/reduce.png'
import delImg from '@/assets/images/close.png'
export default {
  name: 'showBaseInfo',
  mixins: [mixins],
  data () {
    return {
      isEidt: false,
      info: {
        // userStatusName:'',
      },
      imgs: {
        addImg,
        reduceImg,
        delImg
      },
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
        educateName: '',
        major: '', // 专业
        politicsFace: '', // 政治面貌
        title: '', // 职称
        driveLicenseDate: '', // 驾照领取时间
        foreignLevel: '', // 外语水平
        hobby: '', // 兴趣特长
        computerLevel: '', // 计算机水平
        clubNames: [], // 俱乐部名
        workExperiences: [],
        familyMembers: [],
        // 在职信息
        userStatus: 0, // 在职离职状态
        entryDate: '', // 入职日期
        leaveDate: '', // 离职时间
        rankId: null, // 职级
        rankName: '',
        workingYears: '', // 工龄
        masterId: null, // 师傅
        masterName: '',
        cardNumber: '', // 银行卡号
        contractStartDate: '', // 合同起始日期
        contractEndDate: '', // 合同到期日期
        conversionDate: '', // 转正日期
        socialSecurityDate: '', // 社保起始月份
        fundStartDate: '', // 公积金起始月份
        notBuyReason: '', // 公积金未购原因
        trains: [] // 外出培训记录
      },
      clubNameString: '',
      ruleValidate: {},
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
        ],
        familyMembers: [{
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
        ]
      },

      editTableContent: ''

    }
  },
  mounted () {
    this.getBaseInfo()
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
            this.clubNameString = res.data.content.clubNames.join(',')
            this.enclosure.personIdUrl = res.data.content.personIdUrl
            this.enclosure.certificateUrl = res.data.content.certificateUrl
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log('tbcSave' + err)
        })
    },
    handleEdit () {
      this.getBaseInfo()
      this.isEidt = true
      this.$emit('showEdit', this.isEidt)
    }

  }
}
</script>

<style lang="less" scoped>
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
        }
    }

    .content {
        padding:63px;
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

        table {
            input {
                border-radius: unset;
                border: none;
                border-bottom: 1px solid #dcdee2;
                outline: none;
            }
        }
    }
}
</style>
