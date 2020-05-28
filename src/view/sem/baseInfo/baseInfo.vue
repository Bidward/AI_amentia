<template>
  <div class="viewWrapper">
    <Tabs class="level-one" v-model="tabsType" :animated="false">
      <TabPane border label="黑名单词库" name="illegal">
        <illegal v-if="tabsType==='illegal'" />
      </TabPane>
      <TabPane border label="短语模板" name="shortModel">
        <showModel v-if="tabsType==='shortModel'" />
      </TabPane>
      <TabPane border label="模板配置" name="myTemplate">
        <myTemplate v-if="tabsType==='myTemplate'" />
      </TabPane>
      <TabPane border label="否定关键词" name="negative">
        <negativeKeywords v-if="tabsType==='negative'" />
      </TabPane>
      <TabPane border label="账户管理" name="account">
        <accountList v-if="tabsType==='account'" />
      </TabPane>
      <TabPane border label="预估收益配置" name="predictList" >
        <predictList v-if="tabsType==='predictList'" />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import illegal from './illegal/illegal'
import showModel from './shortModel/shortModel'
import myTemplate from './template/myTemplate'
import negativeKeywords from './negativeKeywords/negative'
import accountList from './account/account-list'
import predictList from './predict'
import { semPermissionMixin } from '../tools.js'
export default {
  name: 'baseInfo',
  mixins: [semPermissionMixin],
  components: {
    showModel,
    illegal,
    myTemplate,
    negativeKeywords,
    accountList,
    predictList
  },
  data () {
    return {
      tabsType: 'illegal'
    }
  }
}
</script>
