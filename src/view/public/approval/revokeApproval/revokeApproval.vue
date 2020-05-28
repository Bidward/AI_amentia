<template>
    <div class="viewWrapper">
      <Tabs class="level-two" style="padding-top: 20px" type="card" v-model="tabsType" :animated="false">
        <TabPane label="待审批" name="todo">
          <RevokeApprovalTodo v-if="tabsType==='todo'"/>
        </TabPane>
        <TabPane label="已审批" name="done">
          <RevokeApprovalDone v-if="tabsType==='done'"/>
        </TabPane>
        <TabPane label="我的申请" name="apply">
          <RevokeApprovalMine v-if="tabsType==='apply'"/>
        </TabPane>
      </Tabs>
    </div>
</template>

<script>
import '../approval.less'
import RevokeApprovalTodo from './revokeApprovalTodo'
import RevokeApprovalDone from './revokeApprovalDone'
import RevokeApprovalMine from './revokeApprovalMine'
export default {
  name: 'revokeApproval',
  components: { RevokeApprovalTodo, RevokeApprovalDone, RevokeApprovalMine },
  data () {
    return {
      tabsType: 'todo'
    }
  }
}
</script>

<style lang="less" scope>
</style>
