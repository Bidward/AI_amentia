<template>
  <div>
    <!-- :class="['tab-button', { active: currentTab === tab }]" -->
    <div class="tableHeader-only">
      <div class="searchbar">
        <Button
          v-for="tab in tabs"
          :key="tab.id"
          :class="currentTab === tab.name ? 'active':''"
          @click="currentTab = tab.name"
        >{{ tab.title }}</Button>
      </div>
    </div>
    <component :is="currentTab" @on-to-day="jumpToDay" :userIdProps="userId" :myDateProps="myDate" ></component>
  </div>
</template>

<script>
import generalPlanDay from './generalPlanDay'
import generalPlanWeek from './generalPlanWeek'
import generalPlanMonth from './generalPlanMonth'
import moment from 'moment'
export default {
  name: 'generalPlan',
  components: {
    generalPlanDay,
    generalPlanWeek,
    generalPlanMonth
  },
  props: {
    userId: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      myDate: moment().format('YYYY-MM-DD'),
      incumbencyTbUser: [],
      currentTab: 'generalPlanDay',
      tabs: [
        {
          id: 1,
          title: '月',
          name: 'generalPlanMonth'
        },
        {
          id: 2,
          title: '周',
          name: 'generalPlanWeek'
        },
        {
          id: 3,
          title: '日',
          name: 'generalPlanDay'
        }
      ]
    }
  },
  methods: {
    jumpToDay (dayTime) {
      this.currentTab = 'generalPlanDay'
      this.myDate = dayTime
    }
  }
}
</script>

<style lang="less" scoped>
.active {
    color: #19aa8d;
}
</style>
