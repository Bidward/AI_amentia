<template>
  <div class="viewWrapper level-one" :tab="tabsType">
    <Tabs v-model="tabsType" :animated="false">
      <TabPane border label="推广组" name="groupList">
        <GroupList ref="groupList" v-if="cacheList.has('groupList')" @on-set-table-height="setTableHeight" :tableHeight="tableHeight" />
      </TabPane>
      <TabPane border label="关键词" name="keywordsList">
        <keywordsList ref="keywordsList" v-if="cacheList.has('keywordsList')" @on-set-table-height="setTableHeight" :tableHeight="tableHeight" />
      </TabPane>
      <TabPane border label="产品否定词" name="NegativeWords">
        <NegativeWords ref="NegativeWords" v-if="cacheList.has('NegativeWords')" @on-set-table-height="setTableHeight" :tableHeight="tableHeight" />
      </TabPane>
      <TabPane border label="待优化关键词" name="shortToEdit">
        <ToEdit ref="shortToEdit" v-if="cacheList.has('shortToEdit')" @on-set-table-height="setTableHeight" :tableHeight="tableHeight" />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import GroupList from './group/'
import keywordsList from './keywords/'
import NegativeWords from './negativeWords'
import ToEdit from './ToEdit'
import { setFixeTableMixin } from '../tools'
export default {
  name: 'semShortGroup',
  mixins: [setFixeTableMixin],
  components: {
    GroupList,
    keywordsList,
    NegativeWords,
    ToEdit
  },
  data () {
    return {
      tabsType: 'groupList',
      scrollTableHeight: 0,
      cacheList: new Set()
    }
  },
  beforeRouteLeave (from, to, next) {
    // 离开时记录高度
    const tbody = this.$refs[this.tabsType].$el.querySelector('.ivu-table-body').scrollTop
    this.scrollTableHeight = tbody
    next()
  },
  beforeRouteEnter (from, to, next) {
    // 进入时设置高度
    next(vm => {
      vm.$refs[vm.tabsType].$el.querySelector('.ivu-table-body').scrollTop = vm.scrollTableHeight
    })
  },
  watch: {
    tabsType: {
      handler (newVal) {
        this.cacheList.add(newVal)
      },
      immediate: true
    }
  }
}
</script>
