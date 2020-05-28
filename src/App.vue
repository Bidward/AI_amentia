<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
import { baseUrl } from '@/api/base'
import { isPhone } from '@/assets/js/tools.js'
import { mapMutations } from 'vuex'

export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload,
      app: this
    }
  },
  data () {
    return {
      isRouterAlive: true,
      taskLevels: [], // 任务等级列表
      taskStatus: [], // 任务状态列表
      taskTypes: [], // 任务类型
      employees: [], // 在职人员列表
      treeoptions: []
    }
  },
  created () {
    this.isPhoneVisiting(isPhone(980))
    // window.addEventListener('beforeunload', this.unloadHandler)
  },
  beforeDestroy () {
    // window.removeEventListener('beforeunload', this.unloadHandler)
  },
  methods: {
    // 同步请求
    // syncRequest () {
    //   let xhr = new XMLHttpRequest()
    //   xhr.withCredentials = true
    //   xhr.open('GET', baseUrl + '/tasks/loginOut', false)
    //   xhr.onreadystatechange = function () {
    //     // todo
    //   }
    //   xhr.send(null)
    // },
    // unloadHandler () {
    //   this.syncRequest()
    // },
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    // 获取taskStatus，taskTypes, taskLevels
    getInitialData () {
      this.$axios({
        url: baseUrl + '/tasks/tasksrender',
        data: $qs.stringify(),
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          let content = res.data.content
          this.taskLevels = content.tasksLevel// 任务等级
          this.taskStatus = content.tasksStatus// 任务状态
          // this.taskTypes = content.tasksType // 任务类型
          let types = content.tasksType
          types.splice(1, 1)
          this.taskTypes = types// 任务类型
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    getEmployeeList () {
      this.$axios({
        url: baseUrl + '/user/getIncumbencyTbUser', // 在职人员列表
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.employees = res.data.content
            this.setEmployees(res.data.content)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    getTreeData () {
      this.$axios({
        url: baseUrl + '/user/getIncumbencyTbUserBySort',
        method: 'get'
      })
        .then(res => {
          this.treeoptions = res.data.content
        })
    },
    ...mapMutations([
      'isPhoneVisiting',
      'setEmployees'
    ])
  },
  computed: {
    isLoggedIn () {
      return this.$store.state.user.userId
    }
  },
  watch: {
    isLoggedIn: {
      handler (newVal) {
        if (newVal) {
          this.getInitialData()
          this.getEmployeeList()
          this.getTreeData()
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="less">
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
