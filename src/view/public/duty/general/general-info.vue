<template>
  <div class="generalInfo">
    <Tabs type="card" :animated="false" v-model="tabsType" class="level-two" name="general" @on-click="handleTab">
      <div slot="extra" v-if="tabsType==='mine'">
        <Icon type="ios-stats" size="24" color="#19aa8d"/>
        <span class="switch pointer" @click="planDayChange">
          <span class="changeWork" v-if="change">切换成员定岗定编</span>
          <span class="changeWork"  v-else>切换每日工作表</span>
        </span>
      </div>
      <TabPane tab="general" label="每日工作" name="mine">
        <generalPlan v-if="change" :userId="userId" />
        <generalMine v-else />
      </TabPane>
      <TabPane tab="general" label="成员定岗定编" name="member">
        <generalMember v-if="tabsType==='member'"/>
      </TabPane>
      <TabPane tab="general" label="部门定岗定编" name="dept">
        <depart-duty v-if="tabsType==='dept'"></depart-duty>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import GeneralMine from './generalMine/generalMine'
import GeneralMember from './generalMember/generalMember'
import GeneralPlan from './generalPlan/generalPlan'
import DepartDuty from './DepartDuty/depart-duty'
export default {
  name: 'general-info',
  components: {
    GeneralMine,
    GeneralMember,
    GeneralPlan,
    DepartDuty
  },
  data () {
    return {
      userId: this.$store.state.user.userId,
      change: true,
      //   tabsType: 'mine'
      tabsType: sessionStorage.getItem('dutyGeneralTab')
    }
  },
  methods: {
    handleTab (tab) {
      sessionStorage.setItem('dutyGeneralTab', tab)
    },
    planDayChange () {
      this.change = !this.change
      // sessionStorage.setItem('planDayChange', this.change)
    }
  }
}
</script>

<style lang="less" scoped>
.generalInfo{
  position: relative;
  .switch{
    font-size: 14px;
    color: #19aa8d;
    &:hover{
      text-decoration: underline;
    }
    .changeWork{
      position: relative;
      top: 2px;
    }
  }
}
</style>
