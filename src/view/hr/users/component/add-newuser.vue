<template>
<div class="viewWrapper">
    <div class="content">
        <div class="header">
            <Button @click="handleCloseTag()" size="small" style="width: 33px;height: 30px;">
                <Icon type="md-return-left" size="18"></Icon>
            </Button>
            <span style="margin:0 0 10px 10px">新增账号信息</span>
        </div>
        <div>
            <Form ref="formValidate" :model="accountInfo" :rules="ruleValidate" :label-width="90">
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
                        <Input disabled v-model="accountInfo.username" placeholder="系统自动生成"></Input>
                    </FormItem>
                    </Col>
                    <Col span="6" offset="1">
                    <FormItem label="密码：" prop="password">
                        <Input disabled v-model="accountInfo.password" placeholder="系统自动生成"></Input>
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
                        <!--
                        <Select filterable clearable v-model="accountInfo.deptId" placeholder="请选择部门" @on-change="getPositionByDeptId()">
                            <Option v-for="(item,index) in headerSelection.deptTree" :value="item.id" :id="item.id" :key="index">{{item.title}}</Option>
                        </Select>
                        -->
                        <treeselect @select="(node) => getPositionByDeptId(node)" :default-expand-level="1" v-model="accountInfo.deptId" :options="deptList" />
                    </FormItem>
                    </Col>
                    <Col span="6" offset="1">
                    <FormItem label="职位：" prop="positionId">
                        <Select filterable clearable v-model="accountInfo.positionId" placeholder="请选择职位">
                            <Option v-for="item in headerSelection.position" :value="item.positionId" :key="item.positionId">{{ item.positionName }}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="6" offset="5">
                    <FormItem label="角色：" prop="roleId">
                        <Select filterable clearable v-model="accountInfo.roleId" placeholder="请选择角色">
                            <Option v-for="(item,index) in headerSelection.role" :value="item.roleId" :id="item.roleId" :key="index">{{item.roleName}}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <Row>
                <Col span="1" offset="10">
                <Button @click="handleCloseTag()">取消</Button>
                </Col>
                <Col span="6" offset="1">
                <Button type="primary" @click="handleSaveUserInfo('formValidate')">保存</Button>
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
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import mixins from '../mixins'
export default {
  name: 'addNewUser',
  mixins: [mixins],
  components: {
    Treeselect
  },
  data () {
    return {
      accountInfo: {
        nickname: '', // 姓名
        jobNumber: '', // 工号
        username: '', // 登录名
        password: '', // 密码
        phone: '', // 手机号
        email: '', // 邮箱
        deptId: null, // 部门id
        positionId: null, // 职位id
        roleId: null
      },

      valueConsistsOf: 'LEAF_PRIORITY',
      hasChange: false,
      saved: false,
      ruleValidate: {
        nickname: [{
          required: true,
          message: '必填项',
          trigger: 'blur'
        }],
        phone: [{
          required: true,
          message: '手机号格式不对',
          validator: (rule, value, callback) => {
            if (value.length !== 11) {
              callback(new Error('手机号格式不对'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        deptId: [{
          required: true,
          message: '必填项',
          type: 'number',
          trigger: 'change'
        }],
        email: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }],
        positionId: [{
          required: true,
          message: '必填项',
          type: 'number',
          trigger: 'change'
        }],
        roleId: [{
          required: true,
          message: '必填项',
          type: 'number',
          trigger: 'change'
        }]
      }
    }
  },
  mounted () {
    this.getHeaderListData()
    this.getDeptList()
  },
  methods: {
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
    getDeptList () {
      this.$axios({
        url: baseUrl + '/structure/getDeptList',
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.deptList = resp.data.content
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('getDeptList', err)
        })
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
            this.headerSelection.position = resp.data.content
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('getPositionByDeptId', err)
        })
    },
    // 保存
    handleSaveUserInfo () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          let _self = this.accountInfo
          let sendData = {
            route: 'completeInfo',
            tbuser: {
              // 用户对象
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
            url: baseUrl + '/user/saveuser',
            data: sendData,
            method: 'post'
          })
            .then(resp => {
              if (resp.data.code === 10000) {
                this.$Message.info(resp.data.msg)
                this.saved = true
                this.hasChange = false
                this.handleCloseTag()
              } else {
                this.$Message.error(resp.data.msg)
              }
            })
            .catch(err => {
              console.log('err', err)
            })
        }
      })
    },
    // 复职获取回显数据
    getRecoverData () {
      this.$axios({
        url: baseUrl + '/user/getusername',
        data: $qs.stringify({
          id: this.$route.query.id
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
    }
  },
  computed: {
    deptTree () {
      return this.headerSelection.deptTree
    },
    position () {
      return this.headerSelection.position
    },
    role () {
      return this.headerSelection.role
    }
  },
  // beforeRouteLeave (to, from, next) {

  // },
  watch: {
    accountInfo: {
      handler (newVal) {
        if (this.saved) return
        let keys = ['nickname', 'phone', 'deptId', 'positionId', 'roleId']
        keys.some(key => {
          if (newVal[key]) {
            this.hasChange = true
            return true
          } else {
            this.hasChange = false
          }
        })
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.content {
    padding: 15px;

    .header {
        width: 800px;
        margin: 0 auto;
        border-bottom: 1px solid #e8eaec;
        margin-bottom: 30px;

        span {
            color: #19aa8d;
            font-size: 13px;
            font-weight: bold;
        }

    }

}
</style>
