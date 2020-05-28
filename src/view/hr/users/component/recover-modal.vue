<template>
<div>
    <Modal v-model="recoverUser" title="确认复职">
        <h4 style="text-align: center;color: #19aa8d;">您确定要将成员复职么？</h4>
        <h4>(1) 直接恢复：适用于HR误操作后的恢复;</h4>
        <h4>(2) 重新录用：适用于成员离职后的重新录用;</h4>
        <h4 style="color: red">请注意：该成员当月排班任然需要手动恢复!</h4>
        <div slot="footer">
            <Button type="primary" @click="closeModal()">取消</Button>
            <Button type="primary" @click="afreshRecove()">重新录用</Button>
            <Button type="primary" @click="directRecove()">直接恢复</Button>
        </div>
    </Modal>
</div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
import mixins from '../mixins'
export default {
  name: 'recoverModal',
  mixins: [mixins],
  props: {
    'show': Boolean,
    'recoverRowData': Object
  },
  data () {
    return {
      recoverUser: this.show,
      userID: this.recoverRowData.id
    }
  },
  methods: {
    closeModal () {
      this.$emit('update:show', false)
    },
    updataList () {
      this.$emit('updataList')
    },
    // 重新录用
    afreshRecove () {
      this.$router.push({
        name: 'completeInfo',
        params: {
          title: '复职'
        },
        query: {
          id: this.userID,
          type: 'recoverUser'
        }
      })
      this.closeModal()
      this.updataList()
    },
    // 直接恢复
    directRecove () {
      this.$axios({
        url: baseUrl + '/user/reset',
        data: $qs.stringify({
          id: this.userID
        }),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.$Message.info(resp.data.msg)
            this.closeModal()
            this.updataList()
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    }
  },
  watch: {
    recoverUser: {
      handler (newVal) {
        this.recoverUser = this.show
      },
      immediate: true
    }
  }
}
</script>

<style lang="" scoped>

</style>
