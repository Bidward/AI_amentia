<template>
    <div class="viewWrapper">
      <Tabs class="level-two" style="padding-top: 20px" type="card" v-model="tabsType" :animated="false">
        <TabPane label="待审批" name="todo">
          <taskApprovalTodo v-if="tabsType==='todo'"/>
        </TabPane>
        <TabPane label="已审批" name="done">
          <taskApprovalDone v-if="tabsType==='done'"/>
        </TabPane>
        <TabPane label="我的申请" name="apply">
          <taskApprovalMine v-if="tabsType==='apply'"/>
        </TabPane>
      </Tabs>
    </div>
</template>

<script>
import '../approval.less'
import taskApprovalTodo from './taskApprovalTodo'
import taskApprovalDone from './taskApprovalDone'
import taskApprovalMine from './taskApprovalMine'

export default {
  name: 'taskApproval',
  components: { taskApprovalTodo, taskApprovalDone, taskApprovalMine },
  data () {
    return {
      tabsType: 'todo'
    }
  }
}
</script>

<style lang="less" scope>
</style>
