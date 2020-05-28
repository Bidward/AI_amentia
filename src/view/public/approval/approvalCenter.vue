<template>
  <div class="viewWrapper approvel">
      <div class="tableHeader-only">
        <router-link v-if="this.permission" :to="{name: 'settingApproval'}">
          <Button type="primary">审批流程设置</Button>
        </router-link>
      </div>
      <section class="level-three">
        <Icon type="md-school" size="30" color="#19aa8d"/>
        审批分类
      </section>
      <router-link :to="{name: 'taskApproval'}">
        <Card class="catalogs pointer">
          <div class="cardContent">
            <Icon type="ios-list-box" size="80" color="rgb(243, 193, 105)"/>
            <span class="title">任务审批</span>
            <div v-show="taskNum!==0" class="tips">{{taskNum}}</div>
          </div>
        </Card>
      </router-link>
      <router-link :to="{name: 'revokeApproval'}">
        <Card class="catalogs pointer">
          <div class="cardContent">
            <Icon type="ios-list-box" size="80" color="rgb(254, 86, 92)"/>
            <span class="title">销分审批</span>
            <div v-show="revokeNum!==0" class="tips">{{revokeNum}}</div>
          </div>
        </Card>
      </router-link>
  </div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
export default {
  name: 'approvalCenter',
  data () {
    return {
      taskNum: 0,
      revokeNum: 0
    }
  },
  created () {
    this.getTableData()
  },
  computed: {
    permission () {
      return this.$store.state.user.userpermission.approval.update
    }
  },
  methods: {
    // 获取待审批数
    getTableData () {
      this.$axios({
        url: `${baseUrl}/tasks/getTaskApproval/0`,
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.taskNum = res.data.content.toApprove
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })

      this.$axios({
        url: `${baseUrl}/approve/getRewardApproval/0`,
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.revokeNum = res.data.content.toApprove
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.approvel{
  height: 80vh;
}
.level-three{
  font-size: 18px;
}
.catalogs {
  width: 300px;
  color: #515a6e;
  display: inline-block;
  cursor: pointer;
  margin: 10px 20px;
  .cardContent {
    display: flex;
    align-items: center;
    position: relative;
    .title{
      font-size: 22px;
      font-weight: normal;
      display: inline-block;
    }
    .tips {
      position: absolute;
      top: 0;
      right: 0;
      background-color: red;
      border-radius: 4px;
      padding: 2px 14px;
      color: #fff;
      font-size: 16px;
    }
  }
}
</style>
