<template>
<div class="viewWrapper">
    <Tabs class="level-two" type="card" v-model="tabsType" :animated="false">
        <TabPane label="全部" name="all">
            <user-all v-if="tabsType==='all'"></user-all>
        </TabPane>
        <TabPane label="在职" name="on">
            <user-on v-if="tabsType==='on'"></user-on>
        </TabPane>
        <TabPane label="离职" name="out">
            <user-out v-if="tabsType==='out'"></user-out>
        </TabPane>
    </Tabs>
</div>
</template>

<script>
import UserAll from './user-all'
import UserOn from './user-on'
import UserOut from './user-out'
export default {
  name: 'userManagement',
  components: {
    UserAll,
    UserOn,
    UserOut
  },
  data () {
    return {
      tabsType: 'on'
    }
  }
}
</script>

<style lang="less" scoped>
.viewWrapper{
  padding: 20px;
}
</style>
