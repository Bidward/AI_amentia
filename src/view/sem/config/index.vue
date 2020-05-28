<template>
  <div class="viewWrapper level-one">
    <Tabs v-model="tabsType" :animated="false">
      <TabPane border label="通用配置" name="common" >
        <CommonConfig v-if="tabsType==='common'" />
      </TabPane>
      <TabPane border label="精确配置" name="exact" >
        <ExactConfig v-if="tabsType==='exact'" />
      </TabPane>
      <TabPane border label="短语配置" name="short" >
          <ShortConfig v-if="tabsType==='short'" />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import CommonConfig from './CommonConfig'
import ExactConfig from './ExactConfig.vue'
import ShortConfig from './ShortConfig.vue'
export default {
  name: 'semExtension',
  components: {
    CommonConfig,
    ExactConfig,
    ShortConfig
  },
  data () {
    return {
      tabsType: 'common'
    }
  }
}
</script>
