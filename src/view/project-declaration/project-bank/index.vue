<template>
    <!-- 项目库 -->
    <div class="viewWrapper" style="overflow: auto; padding: 20px" :class="isFullScreen ? 'fullScreen' : ''">
        <Tabs
            type="card"
            :animated="false"
            class="level-two"
            v-model="currentTab"
            @on-click="handleTab"
        >
            <TabPane
                v-for="(item, index) in tabs"
                :label="item.lable"
                :key="index"
                :name="item.name"
            >
            <component :is="item.name" v-if="currentTab===item.name"></component>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
import allProject from './component/projectBankList/all-project'
import uncompleteProject from './component/projectBankList/uncomplete-project'
import undeclareProject from './component/projectBankList/undeclare-project'
import declareProject from './component/projectBankList/declare-project'
import uncashProject from './component/projectBankList/uncash-project'
import unawardProject from './component/projectBankList/unaward-project'
import awardProject from './component/projectBankList/award-project'
import unauditProject from './component/projectBankList/unaudit-project'
import uncashAuditProject from './component/projectBankList/uncash-audit-project'
export default {
  name: 'projectBank',
  components: {
    allProject, // 全部
    uncompleteProject, // 待完善
    undeclareProject, // 待申报
    declareProject, // 申报成功
    uncashProject, // 待兑现
    unawardProject, // 待奖补
    awardProject, // 奖补完成
    unauditProject, // 待审核
    uncashAuditProject// 待兑现审核
  },
  data () {
    return {
      loading: false,
      incumbencyTbUser: [], // 在职人员列表
      currentTab:
                this.$route.query.tagName ||
                sessionStorage.projectTabs ||
                'allProject',
      tabs: [
        {
          lable: '全部',
          name: 'allProject'
        },
        {
          lable: '待完善',
          name: 'uncompleteProject'
        },
        {
          lable: '待申报',
          name: 'undeclareProject'
        },
        {
          lable: '待审核',
          name: 'unauditProject'
        },
        {
          lable: '申报成功',
          name: 'declareProject'
        },
        {
          lable: '待兑现',
          name: 'uncashProject'
        },
        {
          lable: '待兑现审核',
          name: 'uncashAuditProject'
        },
        {
          lable: '待奖补',
          name: 'unawardProject'
        },
        {
          lable: '奖补完成',
          name: 'awardProject'
        }
      ]
    }
  },
  mounted () {
    this.getUser()
  },
  methods: {
    // 获取当前用户
    getUser () {
      this.$axios({
        url: baseUrl + '/login/getuser',
        method: 'get'
      }).then(res => {
        if (res.data.code === 200) {
          localStorage.setItem('userId', res.data.id)
          localStorage.setItem('username', res.data.nickname)
          // this.userInfoDTO.personId = res.data.id
          // this.userInfoDTO.nickname = res.data.nickname
        }
      })
    },
    // 切换标签
    handleTab (v) {
      // 如果query有值，把tagName清除
      if (this.$route.query) {
        this.$route.query.tagName = ''
        sessionStorage.setItem('projectTabs', this.currentTab)
      }
    }
  },
  computed: {
    isFullScreen () {
      return this.$store.state.app.isTaskListFullScreen
    }
  }
}
</script>

<style lang="less" scoped>

</style>
