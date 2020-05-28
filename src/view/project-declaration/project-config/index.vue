<template>
    <!-- 业务配置 -->
    <div class="viewWrapper" style="width:max-content;min-width: 98%">
        <Tabs v-model="currentTab" class="level-one" :animated="false">
            <TabPane label="项目配置" name="projectConfig">
                <projectConfig></projectConfig>
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
import projectConfig from './components/config'
export default {
  name: 'peojectSet',
  components: {
    projectConfig
  },
  data () {
    return {
      currentTab: 'projectConfig'
    }
  },
  methods: {}
}
</script>
