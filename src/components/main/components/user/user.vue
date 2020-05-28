<template>
  <div class="user-avator-dropdown">
    <span class="user-avator-dropdown-item">
      <QrCode />
    </span>
    <span @click="showDrawerByBadge" class="user-avator-dropdown-item">
      <Badge :count="unread" :offset="[20,5]">
        <Icon type="ios-notifications" size="24"/>
      </Badge>
    </span>
    <Dropdown @on-click="handleClick" class="dropdown user-avator-dropdown-item">
      <Icon type="md-person" size="20"/>
      <span class="userName">{{nickname}}</span>
      <DropdownMenu slot="list">
        <DropdownItem @click="handleClick('userInfo')" name="userInfo">个人信息</DropdownItem>
        <DropdownItem @click="handleClick('changePassword')" name="changePassword">修改密码</DropdownItem>
        <DropdownItem @click="handleClick('logout')" name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <bzDrawer />
    <change-password  v-if="showForget" :show.sync="showForget"></change-password>
  </div>
</template>

<script>
import './user.less'
import { mapActions, mapMutations } from 'vuex'
import { baseUrl } from '@/api/base.js'
import ChangePassword from '_c/change-password'
import bzDrawer from '_v/public/station/bzDrawer.vue'
import QrCode from '../qr-code/qrcode'
export default {
  name: 'User',
  components: {
    bzDrawer,
    QrCode,
    ChangePassword
  },
  data () {
    return {
      showDrawer: false,
      username: this.nickname,
      showForget: false
    }
  },
  props: {
    userAvator: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions(['handleLogOut']),
    ...mapMutations(['handleShowDrawer', 'setShowType', 'setTagNavList']),
    showDrawerByBadge () {
      this.handleShowDrawer()
      this.setShowType({ type: '消息', isList: true })
    },
    handleClick (name) {
      switch (name) {
        case 'logout':
          // 退出登录解锁
          // removeuser之前解锁就没有问题
          this.$axios({
            url: baseUrl + '/tasks/loginOut',
            method: 'get'
          })
            .then(res => {
            // pass
            })
            .catch(err => {
              console.log(err)
            })
          // 退出登录
          this.handleLogOut().then(() => {
            this.$router.push({
              name: 'login'
            })
          })
          localStorage.tagNaveList = ''
          // 退出后清空nag-tags
          break
        case 'changePassword':
          this.showForget = true
          this.oldPassword = ''
          this.newPassword = ''
          this.repNewPassword = ''
          break
        case 'userInfo':
          this.$router.push({
            name: 'lookUserinfo',
            query: {
              id: this.userId,
              type: 'onlyShow'
            }
          })
          break
      }
    }
  },
  computed: {
    userId () {
      return this.$store.state.user.userId
    },
    nickname () {
      return this.$store.state.user.nickname
    },
    unread () {
      return this.$store.state.station.unread
    }
  }
}
</script>
<style lang="less">
.dropdown {
  line-height: 1;
}
.userName {
  line-height: 1;
  font-size: 15px;
  vertical-align: middle;
}
.user-avator-dropdown{
  &-item{
    vertical-align: middle;
    display: inline-block;
    margin-right: 20px;
  }
}
</style>
