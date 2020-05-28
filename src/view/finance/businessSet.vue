<template>
    <!-- 业务配置 -->
    <div class="viewWrapper" style="width:max-content;min-width: 98%">
        <Tabs v-model="currentTab" class="level-one" :animated="false" @on-click="handleTab">
            <TabPane label="站点配置" name="website">
                <webSite v-if="currentTab === 'website'"></webSite>
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
import webSite from './components/config/web-site'
export default {
  name: 'businessSet',
  components: {
    webSite
  },
  data () {
    return {
      currentTab: 'website'
    }
  },
  methods: {
    handleTab () {
      sessionStorage.setItem('configTab', this.currentTab)
    }
  }
}
</script>
<style scoped>
.main {
    float: left;
    padding: 0 20px;
    border-right: 1px solid #dcdee2;
    margin-right: 20px;
}
.active {
    background: #19aa8d;
    color: white;
    border-color: #19aa8d;
}
</style>
