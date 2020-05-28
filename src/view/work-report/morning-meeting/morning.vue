<template>
<div class="viewWrapper level-one">
    <Tabs v-model="tabsType" :animated="false">
      <TabPane border label="我的晨会" name="myMoring">
        <mymorning-m v-if="tabsType==='myMoring'"> </mymorning-m>
      </TabPane>
      <TabPane border label="全部晨会" name="allMoring">
        <allMoring-m v-if="tabsType==='allMoring'"></allMoring-m>
      </TabPane>
      <TabPane border label="与我相关" name="aboutMe">
        <aboutMorning-m v-if="tabsType==='aboutMe'"></aboutMorning-m>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import mymorningM from './mymorning-m'
import allMoringM from './allmorning-m'
import aboutMorningM from './aboutmorning-m'
export default {
  name: 'morningMeeting',
  components: {
    mymorningM,
    allMoringM,
    aboutMorningM
  },

  data () {
    return {
      tabsType: 'myMoring'
    }
  }
}
</script>

<style lang="less" scoped>

</style>
