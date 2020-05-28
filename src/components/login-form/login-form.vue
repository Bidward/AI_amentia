<template>
<div>
    <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
        <FormItem prop="userName" autocomplete="on" :error="nameErr">
            <Input autocomplete="on" v-model="form.userName" placeholder="请输入用户名" clearable @on-change="changeUser">
            <span slot="prepend">
                <Icon :size="16" type="ios-person"></Icon>
            </span>
            </Input>
        </FormItem>
        <FormItem prop="password" :error="pwdErr">
            <Input type="password" v-model="form.password" placeholder="请输入密码" clearable>
            <span slot="prepend">
                <Icon :size="14" type="md-lock"></Icon>
            </span>
            </Input>
        </FormItem>
        <p v-if="showOften">
            <FormItem>
                <Input v-model="oftenCode" style="width:65%;float:left" placeholder="请输入验证码"></Input>
                <Button style="width:30%;float:right;padding:6px 10px 6px" @click="getDdCode" :disabled="!allowGetDdCode">{{buttonTextDd}}</Button>
            </FormItem>
            <FormItem style="float:left">
                <Checkbox v-model="isOften">设为常用设备</Checkbox>
            </FormItem>
        </p>
        <p class="forget">
            <span style="margin-right: 100px; color: #ed4014" v-show="noName">请先输入用户名</span>
            <span @click="forget">忘记密码</span>
        </p>
        <FormItem>
            <Button @click="handleSubmit" type="primary" class="loginBtn" long>登录</Button>
        </FormItem>
    </Form>
    <!-- pc  -->
    <Modal v-if="!isPhone" v-model="showForget" :loading="loading" title="重置密码" width="400px" @on-ok="resetPassword">
        <Form label-position="left" :label-width="90">
            <FormItem label="新密码：">
                <Input v-model="newPassword" @on-blur="checkPassword" type="password"></Input>
            </FormItem>
            <FormItem label="确认密码：">
                <Input v-model="repNewPassword" @on-blur="checkRepeatPassword" type="password"></Input>
            </FormItem>
            <FormItem label="钉钉验证码：">
                <Input v-model="veriCode" style="width:65%"></Input>
                <Button :disabled="!allowGetCode" @click="getCode" style="margin-left:5%;width:30%">{{buttonText}}</Button>
            </FormItem>
        </Form>
    </Modal>
</div>
</template>

<script>
import {
  baseUrl
} from '@/api/base'
import Cookies from 'js-cookie'
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [{
          required: true,
          message: '账号不能为空',
          trigger: 'blur'
        }]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [{
          required: true,
          message: '密码不能为空',
          trigger: 'blur'
        }]
      }
    },
    errCode: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      form: {
        userName: '',
        password: ''
      },
      showOften: false,
      isOften: false, // 设置常用设备
      // cookeiOften: "", // 1 已经设置可直接登录，0 未设置,从cookie中获取
      oftenCode: '', // 登录验证码
      newPassword: '',
      repNewPassword: '',
      showForget: false, // 是否展示重置密码的框
      veriCode: '',
      allowGetCode: true, // 允许获取验证码
      allowGetDdCode: true, // 允许获取验证码(记住设备)
      buttonText: '获取验证码',
      buttonTextDd: '获取验证码',
      loading: true,
      passValidate: {
        newPassword: '',
        checkPassword: '',
        ddCode: ''
      },
      passRules: {
        newPassword: [{
          required: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('请填写新密码'))
              return
            }
            let rules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/
            let r = rules.test(value)
            if (!r) {
              callback(
                new Error(
                  '请输入8-16位密码,含数字和大小写字母'
                )
              )
            } else {
              callback()
            }
          }
        }],
        checkPassword: [{
          required: true,
          validator: (rule, value, callback) => {
            console.log(value, 'value')
            if (!value) {
              callback(new Error('请填确认新密码'))
              return
            }
            if (value !== this.passValidate.newPassword) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          }
        }],
        ddCode: [{
          required: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('请输入验证码'))
              return
            }
            callback()
          },
          trigger: 'blur'
        }]
      },
      noName: false,
      ddError: ''
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules
      }
    },
    isPhone () {
      return this.$store.state.app.isPhone
    },
    nameErr: {
      get () {
        let msg = ''
        if (this.errCode === 10011) {
          msg = '账号不存在'
        }
        return msg
      },
      set (newVal) {}
    },
    pwdErr () {
      let msg = ''
      if (this.errCode === 10012) {
        msg = '密码错误'
      }
      return msg
    }
  },
  methods: {
    handleSubmit () {
      // 如果设置过，直接登录
      let cookeiOften = Cookies.get('isOften')
      if (cookeiOften === this.form.userName) {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.$emit('on-success-valid', {
              userName: this.form.userName,
              password: this.form.password
            })
          }
        })
        // 如果没cookie或者 用户名和cookie存的不相等
      } else if (cookeiOften !== this.form.userName) {
        // this.showOften = true
        if (!this.showOften) {
          this.showOften = true
        } else {
          // 没输入验证码
          if (this.oftenCode.length === 0) {
            this.$Message.warning('请输入验证码') // 如果没输验证码，提示
          } else {
            // 输入了验证码
            this.$refs.loginForm.validate(valid => {
              if (valid) {
                this.$emit('on-success-valid', {
                  userName: this.form.userName,
                  password: this.form.password,
                  isOften: this.isOften, // 是否设置常用设备
                  oftenCode: this.oftenCode // 验证码
                })
              }
            })
          }
        }
      }
    },
    getDdCode () {
      // 获取钉钉验证码
      let me = this
      this.$axios({
        url: baseUrl + '/login/getvericode',
        data: $qs.stringify({
          username: me.form.userName
        }),
        method: 'post'
      })
        .then(res => {
          if (res.status === 200) {
            me.getDdCodeSuccess()
          }
        })
        .catch(err => {
          console.log(err)
          this.$Message.warning('发送失败')
        })
    },
    getDdCodeSuccess () {
      let waitTime = 60 // 验证码等待时间
      if (!this.isPhone) {
        this.$Message.success('验证码发送成功，请查看钉钉')
      } else {
        this.passValidate.ddCode = '验证码发送成功，请查看钉钉'
      }
      this.allowGetDdCode = false
      let timer = setInterval(() => {
        this.buttonTextDd = `重新获取${waitTime--}`
      }, 1000)
      setTimeout(() => {
        this.allowGetDdCode = true
        clearInterval(timer)
        this.buttonTextDd = `获取验证码`
      }, waitTime * 1000)
    },
    // 用户名
    changeUser () {
      let cookeiOften = Cookies.get('isOften')
      if (this.form.userName === cookeiOften) {
        this.showOften = false
      }
    },
    forget () {
      if (!this.form.userName) {
        // 如果没有填用户名，弹窗提示
        if (!this.isPhone) {
          this.$Message.warning('请输入用户名')
        } else {
          this.noName = true
        }
      } else {
        this.showForget = true
      }
    },
    getCode () {
      // 获取钉钉验证码
      if (
        (this.newPassword && this.repNewPassword) ||
                (this.passValidate.newPassword &&
                    this.passValidate.checkPassword)
      ) {
        let me = this
        this.$axios({
          url: baseUrl + '/login/getvericode',
          data: $qs.stringify({
            username: me.form.userName
          }),
          method: 'post'
        })
          .then(res => {
            if (res.status === 200) {
              me.getCodeSuccess()
            }
          })
          .catch(err => {
            console.log(err)
            this.$Message.warning('发送失败')
          })
      } else {
        this.ddError = '请先输入新密码'
      }
    },
    getCodeSuccess () {
      let waitTime = 60 // 验证码等待时间
      if (!this.isPhone) {
        this.$Message.success('验证码发送成功，请查看钉钉')
      } else {
        this.passValidate.ddCode = '请查看钉钉验证码'
      }
      this.allowGetCode = false
      let timer = setInterval(() => {
        this.buttonText = `重新获取${waitTime--}`
      }, 1000)
      setTimeout(() => {
        this.allowGetCode = true
        clearInterval(timer)
        this.buttonText = `获取验证码`
      }, waitTime * 1000)
    },
    checkPassword () {
      // 验证密码的复杂度
      // 大小写数字
      let rules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/
      let r = rules.test(this.newPassword)
      if (!r) {
        this.$Message.error('请输入8-16位密码，包含数字和大小写字母')
        return false
      } else {
        return true
      }
    },
    checkRepeatPassword () {
      // 验证两次密码是否一致
      if (this.newPassword !== this.repNewPassword) {
        this.$Message.error('两次密码不一致，请重新输入')
        return false
      } else {
        return true
      }
    },
    resetPassword () {
      if (!this.isPhone) {
        let me = this
        if (this.checkPassword() && this.checkRepeatPassword()) {
          let data = {
            username: me.form.userName,
            newPassword: me.newPassword,
            repNewPassword: me.repNewPassword,
            veriCode: me.veriCode
          }
          this.$axios({
            url: baseUrl + '/login/resetpassword',
            data: $qs.stringify(data),
            method: 'post'
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.$Message.info(res.data.message)
                this.showForget = false // 关闭对话框
              } else {
                this.$Message.warning(res.data.message)
                this.loading = false // 确认框先取消loading
                this.$nextTick(() => {
                  this.loading = true
                }) // 再允许loading，
              }
            })
            .catch(err => {
              console.log(err)
              this.$Message.warning('重置失败')
            })
        }
      } else {
        let form = this.$refs.passValidate
        form.validate(valid => {
          if (valid) {
            console.log(valid, 'valid')
            let data = {
              username: this.form.userName,
              newPassword: this.passValidate.newPassword,
              repNewPassword: this.passValidate.checkPassword,
              veriCode: this.passValidate.ddCode
            }
            this.$axios({
              url: baseUrl + '/login/resetpassword',
              data: $qs.stringify(data),
              method: 'post'
            }).then(res => {
              if (res.data.code === 10000) {
                this.showForget = false
              } else {
                this.loading = false
                this.$nextTick(() => {
                  this.loading = true
                  this.ddError = res.data.message
                })
                this.ddError = null
              }
            })
          } else {
            this.loading = false
            this.$nextTick(() => {
              this.loading = true
            })
          }
        })
      }
    }
  },
  watch: {
    form: {
      handler (newVal) {
        if (newVal) {
          this.$emit('clear')
        }
      },
      deep: true
    },
    'form.userName' (newVal) {
      if (newVal) {
        this.noName = false
      }
    }
  }
}
</script>

<style lang="less">
.vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal {
        top: 0;
    }
}

.loginPhone {
    .ivu-form .ivu-form-item-label {
        padding: 10px 0px 10px 0;
    }
}
</style><style lang="less" scoped>
.forget {
    text-align: right;
}

.forget span {
    display: inline-block;
    cursor: pointer;
    margin-top: -20px;
    margin-bottom: 20px;
}

.loginBtn {
    background-color: #19aa8d;
    border-color: #19aa8d;
    color: #fff;
}

.loginBtn:hover {
    background-color: #088f74;
    border-color: #088f74;
    color: #fff;
}

.errHint {
    position: absolute;
    // line-height: 60px;
    /* border: 1px solid green;  */
    // top: 100%;
    // font-size: 36px;
    // color: red;
}
</style>
