<style lang="less">
@import "./login.less";
</style>
<template>
<div class="login" v-if="!isPhone">
    <div class="login-con">
        <Card icon="log-in" title="欢迎登录" :bordered="false">
            <div class="form-con">
                <login-form @on-success-valid="handleSubmit"></login-form>
                <!-- <p class="login-tip">输入任意用户名和密码即可</p> -->
            </div>
        </Card>
    </div>
    <change-password v-if="showChangerModal" :show.sync="showChangerModal"></change-password>
</div>
<div v-else class="login" id="mobileBg">
    <!--
    <div class="loginTitle"></div>
    -->
    <div class="login-con">
        <login-mobform @on-success-valid="handleSubmit" @clear="clearErrCode" :err-code="errCode"></login-mobform>
        <!--
        <Card icon="log-in" title="欢迎登录" :bordered="false">
            <div class="form-con" >

                <login-form @on-success-valid="handleSubmit" @clear="clearErrCode" :err-code="errCode"></login-form>

                <p class="login-tip">输入任意用户名和密码即可</p>
            </div>
        </Card>
        -->
    </div>
    <change-password v-if="showChangerModal" :show.sync="showChangerModal"></change-password>
</div>
</template>

<script>
import ChangePassword from '_c/change-password'
import LoginForm from '_c/login-form'
import loginMobform from '_c/login-mobform'
import {
  mapActions
} from 'vuex'
import {
  baseUrl
} from '@/api/base.js'
import {
  setToken
} from '@/libs/util'
import Cookies from 'js-cookie'
// import { login } from '@/api/user.js'
export default {
  components: {
    LoginForm,
    loginMobform,
    ChangePassword
  },
  data () {
    return {
      errCode: null,
      showChangerModal: false
    }
  },
  methods: {
    ...mapActions(['handleLogin', 'getUserInfo']),
    handleSubmit ({
      userName,
      password,
      isOften,
      oftenCode
    }) {
      // let me = this;
      this.$axios({
        url: baseUrl + '/login',
        data: $qs.stringify({
          username: userName,
          password: password,
          oftenCode: oftenCode
        }),
        method: 'post'
      }).then(res => {
        let data = res.data
        let me = this
        if (data.code === 200) {
          localStorage.username = data.nickname
          setToken(data.nickname)
          // 选择设为常用设备，存cookei
          if (isOften) {
            Cookies.set('isOften', userName, {
              expires: 365,
              path: ''
            })
          }
          // 存到Vuex的登录里
          this.handleLogin({
            userName: data.username,
            password: data.password
          }).then(data => {
            // 只要登录就重新获取信息存到Vuex里面
            this.getUserInfo()
          })
          if (!this.isPhone) {
            me.$Notice.success({
              title: data.message,
              duration: 1
            })
          }
          me.$router.push({
            // name: this.$config.homeName
            name: 'home'
          })
        } else if (data.code === 20000) {
          this.showChangerModal = true
        } else if (data.code === 10011) {
          me.$Message.error(data.message)
        } else {
          if (!this.isPhone) {
            me.$Notice.warning({
              title: data.message,
              duration: 1
            })
          }
          this.errCode = data.code
        }
      })
    },
    clearErrCode () {
      this.errCode = null
    }
  },
  // 路由进入login页面不可缩放
  beforeRouteEnter (to, from, next) {
    let meta = document.getElementsByTagName('meta')['viewport']
    meta.content = to.meta.content
    next()
  },
  // 路由离开login页面可缩放
  beforeRouteLeave (to, from, next) {
    let meta = document.getElementsByTagName('meta')['viewport']
    meta.content = ''
    next()
  },
  computed: {
    isPhone () {
      return this.$store.state.app.isPhone
    }
  },
  watch: {
    $route: {
      handler (newVal) {
        const query = newVal.query
        if (query.username && query.password) {
          const {
            username,
            password
          } = query
          this.handleSubmit({
            userName: username,
            password
          })
        }
      },
      immediate: true
    }
  }
}
</script>

<style>
#mobileBg{
  background-image: url(../../assets/images/mobilebg.jpg);
  background-size: cover;
  background-position: 50%;
  position: relative;
  overflow: scroll;
}
</style>
