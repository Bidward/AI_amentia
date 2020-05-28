<template>
  <div class="viewWrapper level-one">
    <Tabs v-model="tabsType" :animated="false">
      <TabPane border label="职位管理" name="position">
        <positionList
          v-if="tabsType==='position'"
          :incumbencyTbUser="incumbencyTbUser"
          :deptTreeList="deptTreeList"
          :options="options"
          @on-update-tbc="getTbcList"
          :positionNameList="positionNameList"
        />
      </TabPane>
      <TabPane border :label="tbcTitle" name="positiontbc">
        <tbcPositionList
          v-if="tabsType==='positiontbc'"
          :incumbencyTbUser="incumbencyTbUser"
          :deptTreeList="deptTreeList"
          :options="options"
          @on-update-tbc="getTbcList"
          :positionNameList="positionNameList"
        />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
import positionList from './positionList.vue'
import tbcPositionList from './tbcPositionList.vue'
import editPosition from './editPosition.vue'
export default {
  name: 'position',
  components: {
    positionList,
    tbcPositionList,
    editPosition
  },
  data () {
    return {
      deptTreeList: [],
      options: [],
      positionNameList: [],
      incumbencyTbUser: [], // 在职人员列表
      tabsType: 'position', // tabs页
      tbcNum: 0
    }
  },
  mounted () {
    let routeType = this.$route.query.type
    if (routeType === 'tbc') {
      this.tabsType = 'positiontbc'
    }
    this.getIncumbencyTbUser()
  },
  methods: {
    // 获取一大堆东西
    getPageInit () {
      this.$axios({
        url: baseUrl + '/structure/init',
        method: 'post'
      })
        .then(res => {
          let content = res.data.content
          this.deptTreeList = content.deptTreeList // 部门列表
          this.options = content.options // 职位等级
          this.positionNameList = content.positionNameList // 职位列表
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取在职人员列表
    getIncumbencyTbUser () {
      this.$axios({
        url: baseUrl + '/user/getIncumbencyTbUser',
        method: 'post'
      }).then(res => {
        this.incumbencyTbUser = res.data.content
      })
    },
    // 获取待办事项列表
    getTbcList () {
      this.$axios({
        url: baseUrl + '/structure/pagetbc',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.tbcNum = res.data.content.pageContent.length
        }
      })
    }
  },
  computed: {
    tbcTitle () {
      return this.tbcNum > 0 ? `待处理事项(${this.tbcNum})` : `待处理事项`
    }
  },
  watch: {
    tabsType: {
      handler (newVal) {
        this.getPageInit()
        this.getTbcList()
      },
      immediate: true
    },
    $route: {
      handler: function (val, oldVal) {
        if (val.query.type === 'tbc') {
          this.tabsType = 'positiontbc'
        }
      },
      immediate: true
    }
  }
}
</script>
