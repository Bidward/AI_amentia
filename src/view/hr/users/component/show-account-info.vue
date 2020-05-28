<template>
<div>
    <div class="section">
        <div class="title">
            <Icon type="md-school" style="color: #19aa8d;margin-right: 10px;" size="20" />
            <span class="title-name">账号信息</span>
            <div class="wrapper" v-if="isEdit">
                <Button class="btn" @click="handleCancle()">取消</Button>
                <Button type="primary" @click="handleSaveUserInfo()">保存</Button>
            </div>
            <div class="wrapper" v-else>
                <Button v-if="!this.$route.query.type && permiss.update" class="wrapper-btn" type="primary" @click="handleEdit()">编辑</Button>
            </div>
        </div>
        <div class="content" v-if="isEdit">
            <Form ref="formValidate" :model="accountInfo" :rules="ruleValidate" :label-width="120">
                <!--
                <Row>
                    <Col span="3" offset="2">
                    <div class="main-title">账号信息</div>
                    </Col>
                </Row>
                -->
                <Row>
                    <Col span="6" offset="5">
                    <FormItem label="姓名：" prop="nickname">
                        <Input v-model="accountInfo.nickname" placeholder="请输入中文名称" @on-blur="getBasic"></Input>
                    </FormItem>
                    </Col>
                    <Col span="6" offset="1">
                    <FormItem label="工号：" prop="jobNumber">
                        <Input disabled v-model="accountInfo.jobNumber" placeholder="系统自动生成"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="6" offset="5">
                    <FormItem label="登录名：" prop="username">
                        <Input v-model="accountInfo.username" placeholder="系统自动生成"></Input>
                    </FormItem>
                    </Col>
                    <Col span="6" offset="1">
                    <FormItem label="密码：" prop="password">
                        <Input v-model="accountInfo.password" placeholder="系统自动生成"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="6" offset="5">
                    <FormItem label="手机号：" prop="phone">
                        <Input v-model="accountInfo.phone" placeholder="请输入手机号"></Input>
                    </FormItem>
                    </Col>
                    <Col span="6" offset="1">
                    <FormItem label="企业邮箱：" prop="email">
                        <Input v-model="accountInfo.email" placeholder="系统自动生成"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="6" offset="5">
                    <FormItem label="部门：" prop="deptId">
                        <treeselect @input="clearPosition()" @select="(node) => getPositionByDeptId(node)" :default-expand-level="1" v-model="accountInfo.deptId" :value="accountInfo.deptId" :options="deptList" />
                    </FormItem>
                    </Col>
                    <Col span="6" offset="1">
                    <FormItem label="职位：" prop="positionId">
                        <Select filterable clearable v-model="accountInfo.positionId" placeholder="请选择职位" @on-open-change="getPositionByDeptId2()">
                            <Option v-for="item in headerSelection.position" :value="item.positionId" :key="item.positionId">{{ item.positionName }}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="1" offset="10">
                    <Button @click="handleCancle()">取消</Button>
                    </Col>
                    <Col span="6" offset="1">
                    <Button type="primary" @click="handleSaveUserInfo('formValidate')">保存</Button>
                    </Col>
                </Row>
            </Form>
        </div>
        <div class="content" v-else>
            <!--
            <Row>
                <Col span="3" offset="2">
                <div class="main-title">账号信息</div>
                </Col>
            </Row>
            -->
            <Row class="rowPadding">
                <Col span="2" offset="6" class="textAligh">姓名：</Col>
                <Col span="4">
                <p>{{accountInfo.nickname||'/'}}</p>
                </Col>
                <Col span="2" class="textAligh">工号：</Col>
                <Col span="4">
                <p>{{accountInfo.jobNumber||'/'}}</p>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="2" offset="6" class="textAligh">登录名：</Col>
                <Col span="4">
                <p>{{accountInfo.username||'/'}}</p>
                </Col>
                <Col span="2" class="textAligh">密码：</Col>

                <Col span="4">
                <p>{{accountInfo.password||'/'}}</p>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="2" offset="6" class="textAligh">手机号：</Col>
                <Col span="4">
                <p>{{accountInfo.phone||'/'}}</p>
                </Col>
                <Col span="2" class="textAligh">企业邮箱：</Col>
                <Col span="4">
                <p>{{accountInfo.email||'/'}}</p>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="2" offset="6" class="textAligh">部门：</Col>
                <Col span="4">
                <p>{{accountInfo.deptName||'/'}}</p>
                </Col>
                <Col span="2" class="textAligh">职位：</Col>
                <Col span="4">
                <p>{{accountInfo.positionName||'/'}}</p>
                </Col>
            </Row>
        </div>
    </div>
</div>
</template>

<script>
import {
  baseUrl
} from '@/api/base.js'
import mixins from '../mixins'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'showAccountInfo',
  mixins: [mixins],
  components: {
    Treeselect
  },
  data () {
    return {
      isEdit: false,
      isSaved: false,
      initBaseInfo: {},
      accountInfo: {
        nickname: '', // 姓名
        jobNumber: '', // 工号
        username: '', // 登录名
        password: '', // 密码
        phone: '', // 手机号
        email: '', // 邮箱
        deptName: '', // 部门id
        positionName: '' // 职位id
      },
      ruleValidate: {
        nickname: [{
          required: true,
          message: '必填项',
          trigger: 'blur'
        }],
        username: [{
          required: true,
          message: '必填项',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '必填项',
          trigger: 'blur'
        }],
        phone: [{
          required: true,
          message: '必填项',
          trigger: 'blur'
        }],
        email: [{
          required: true,
          message: '必填项',
          trigger: 'blur'
        }],
        deptId: [{
          required: true,
          message: '必填项',
          type: 'number',
          trigger: 'change'
        }],
        positionId: [{
          required: true,
          message: '必填项',
          type: 'number',
          trigger: 'change'
        }]
      }
    }
  },
  mounted () {
    this.getData()
    this.getDeptList()
  },
  methods: {
    getData () {
      this.$axios({
        url: baseUrl + '/user/accountDetail',
        data: $qs.stringify({
          id: this.$route.query.id
        }),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.accountInfo = resp.data.content
            this.initBaseInfo = JSON.stringify(this.accountInfo)
            this.getPositionByDeptId2()
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    // 判断页面数据是否有改动
    hasContentChanged () {
      return this.initBaseInfo !== JSON.stringify(this.accountInfo)
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
      if (hasChange) {
        this.$Modal.confirm({
          title: '取消编辑',
          content: '<p>还有未保存的内容，确认取消吗</p>',
          onOk: () => {
            this.isEdit = false
            this.getData()
          }
        })
      } else {
        this.isEdit = false
        this.accountInfo = JSON.parse(this.initBaseInfo)
      }
    },
    handleEdit () {
      this.isEdit = true
      this.getData()
      this.getHeaderListData()
    },
    // 获取登录名、企业邮箱和密码
    getBasic () {
      let _self = this.accountInfo
      _self.nickname = _self.nickname.trim()
      if (!_self.nickname) return false
      this.$axios({
        url: baseUrl + '/user/getusername',
        data: $qs.stringify({
          nickname: _self.nickname
        }),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            _self.username = resp.data.content.username
            _self.email = resp.data.content.email
            _self.password = resp.data.content.password
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    // 清空部门时清空职位
    clearPosition () {
      this.accountInfo.positionId = ''
    },
    // 根据部门获取职位
    getPositionByDeptId (node) {
      this.$axios({
        url: baseUrl + '/structure/findByPosition',
        data: $qs.stringify({
          deptId: node.id
        }),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.headerSelection.position = []
            this.headerSelection.position = resp.data.content
          } else {
            // this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('getPositionByDeptId', err)
        })
    },
    getPositionByDeptId2 (node) {
      this.$axios({
        url: baseUrl + '/structure/findByPosition',
        data: $qs.stringify({
          deptId: this.accountInfo.deptId
        }),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.headerSelection.position = []
            this.headerSelection.position = resp.data.content
          } else {
            // this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('getPositionByDeptId2', err)
        })
    },
    // 保存
    handleSaveUserInfo () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          let _self = this.accountInfo
          let sendData = {
            user: {
              // 用户对象
              id: this.$route.query.id,
              nickname: _self.nickname, // 用户姓名
              username: _self.username, // 用户登录名
              password: _self.password, // 密码
              phone: _self.phone, // 联系方式
              email: _self.email, // 邮箱
              deptId: _self.deptId, // 部门编号
              positionId: _self.positionId, // 职位编号
              roleId: _self.roleId // 角色id
            }
          }
          this.$axios({
            url: baseUrl + '/user/editAccountInfo',
            data: sendData,
            method: 'post'
          })
            .then(resp => {
              if (resp.data.code === 10000) {
                this.isSaved = true
                this.isEdit = false
                this.getData()
                this.$Message.info(resp.data.msg)
              } else {
                this.$Message.error(resp.data.msg)
              }
            })
            .catch(err => {
              console.log('err', err)
            })
        }
      })
    }
  },
  computed: {
    deptTree () {
      return this.headerSelection.deptTree
    },
    position () {
      return this.headerSelection.position
    }
  }
}
</script>

<style lang="less">
.section {
    .ivu-col.ivu-col-span-4 {
        font-size: 14px;
    }

    .textAligh  {
        color: #666666;
        font-size: 14px;
    }

    .ivu-col.ivu-col-span-4 p {
        color: #999999;
        font-size: 14px;
    }

}
</style>
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

            .btn {
                margin-right: 10px;
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

        .rowPadding {
            padding: 15px;
            font-size: 12px;
            color: #515a6e;

            .textAligh {
                text-align: right;
                font-size: 14px;
            }
        }
    }
}
</style>
