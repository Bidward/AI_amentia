<template>
<div>
    <Modal v-model="changePasswordModal" :loading="loading" title="修改密码" width="400px" @on-ok="changePassword">
        <Form label-position="left" :label-width="90" @on-ok="changePassword">
            <FormItem label="原密码">
                <Input v-model="oldPassword" type="password"></Input>
            </FormItem>
            <FormItem label="新密码">
                <Input v-model="newPassword" @on-blur="checkPassword" type="password"></Input>
            </FormItem>
            <FormItem label="确认新密码">
                <Input v-model="repNewPassword" @on-blur="checkRepeatPassword" type="password"></Input>
            </FormItem>
        </Form>
    </Modal>
</div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
export default {
  name: 'changePassword',
  props: {
    'show': Boolean
  },
  data () {
    return {
      loading: true,
      changePasswordModal: this.show,
      oldPassword: '',
      newPassword: '',
      repNewPassword: ''
    }
  },
  watch: {
    changePasswordModal: {
      handler (newVal) {
        this.changePasswordModal = this.show
      },
      immediate: true
    }
  },
  methods: {
    changePassword () {
      let {
        oldPassword,
        newPassword,
        repNewPassword
      } = this
      let data = {
        oldPassword,
        newPassword,
        repNewPassword
      }
      if (this.checkPassword() && this.checkRepeatPassword()) {
        this.$axios({
          url: baseUrl + '/changepassword',
          method: 'post',
          data: $qs.stringify(data)
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.$Message.info(res.data.message)
              this.$emit('update:show', false) // 关闭对话框
            } else {
              this.$Message.warning(res.data.message)
              this.loading = false // 确认框先取消loading
              this.$nextTick(() => {
                this.loading = true
              }) // 再允许loading，
            }
          })
          .catch(err => {
            this.$Message.warning(err)
          })
      }
    },
    checkPassword () {
      // 验证密码的复杂度
      // 大小写数字
      let rules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/
      let r = rules.test(this.newPassword)
      if (!r) {
        this.$Message.error('请输入8-16位密码,含数字和大小写字母')
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
    }
  }
}
</script>

<style lang="" scoped>

</style>
