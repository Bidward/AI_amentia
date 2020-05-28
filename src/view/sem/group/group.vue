<template>
  <div class="viewWrapper level-one">
    <Tabs v-model="tabsType" :animated="false">
      <TabPane border label="推广组" name="extension" v-if="!isTest">
        <extension @on-set-table-height="setTableHeight" :tableHeight="tableHeight" />
      </TabPane>
      <TabPane border label="关键词" name="keywords" v-if="!isTest">
        <keywords @on-set-table-height="setTableHeight" :tableHeight="tableHeight" />
      </TabPane>
      <TabPane border label="产品否定词" name="product">
        <software @on-set-table-height="setTableHeight" :tableHeight="tableHeight" />
      </TabPane>
      <TabPane border label="优化关键词" name="toEditKeywords" v-if="!isTest">
        <KeywordsToEdit @on-set-table-height="setTableHeight" :tableHeight="tableHeight" />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import extension from './extension/extension'
import keywords from './keywords/keywords'
import software from './software/softwareList'
import KeywordsToEdit from './keywordsToEdit/keywordsToEdit'
import { setFixeTableMixin } from '../tools'
import config from '@/config'
const { isTest } = config
export default {
  name: 'semExtension',
  mixins: [setFixeTableMixin],
  components: {
    extension,
    keywords,
    software,
    KeywordsToEdit
  },
  data () {
    return {
      isTest,
      tabsType: isTest ? 'product' : 'extension'// 测试服隐藏推广组
    }
  }
}
</script>
