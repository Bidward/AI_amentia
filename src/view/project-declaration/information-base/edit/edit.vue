<template>
    <div class="viewWrapper" style="overflow: auto; padding: 20px;" :class="isFullScreen ? 'fullScreen' : ''">
        <policy class="top" :describe="describe" :attachmentList="attachmentList" />
        <inputInfo
            class="bottom"
            :infoType="infoType"
            :projectName="projectName"
            :attachmentList="attachmentList"
        />
    </div>
</template>
<script>
import policy from './components/policy'
import inputInfo from './components/input-info'
import { prUrl } from '@/api/base.js'
export default {
  name: 'editInfo',
  components: {
    policy,
    inputInfo
  },
  data () {
    return {
      describe: '', // 描述
      attachmentList: [], // 附件
      infoType: '', // 信息类型
      projectName: {} // 项目名称
    }
  },
  mounted () {
    this.checkBackLog()
  },
  computed: {
    isFullScreen () {
      return this.$store.state.app.isTaskListFullScreen
    }
  },
  // 如果路由中有待办id，则是从待办进来的，解锁并清除sessionStorage
  destroyed () {
    let id = sessionStorage.getItem('infoBacklogId') || ''
    if (id.length > 0) {
      this.clearLock()
      sessionStorage.removeItem('infoBacklogId')
    }
  },
  methods: {
    // 解锁页面
    clearLock () {
      let sendData = {
        backLogId: sessionStorage.infoBacklogId
      }
      this.$axios({
        url: prUrl + '/backlog/releaseBackLog',
        data: $qs.stringify(sendData),
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          // console.log(res)
        } else {
          this.$Message.error(resp.data.msg)
        }
      })
    },
    // 判断是否从待办跳来的
    checkBackLog () {
      let query = this.$route.query.backLogId || ''
      // 如果路由id为空，不是待办来的，正常请求数据接口
      if (query.length === 0) {
        this.getData()
      } else {
        this.checkBackLogStatus() // 检查代办状态
        sessionStorage.setItem(
          'infoBacklogId',
          this.$route.query.backLogId
        ) // 在session存待办id，解锁时用
      }
    },
    // 检查代办状态
    checkBackLogStatus () {
      let sendData = {
        infoId: this.$route.query.infoId,
        backLogId: this.$route.query.backLogId
      }
      this.$axios({
        url: prUrl + '/backlog/checkBackLogStatus',
        data: $qs.stringify(sendData),
        method: 'post'
      }).then(resp => {
        if (resp.data.code === 10000) {
          let status = resp.data.data
          if (status === true) {
            this.getData()
          } else {
            this.$router.go(-1)
            bus.$emit('on-myclose', this.$route)
            this.$Message.error(resp.data.msg)
          }
        } else {
          this.$Message.error(resp.data.msg)
        }
      })
    },
    // 获取数据
    getData () {
      let sendData = {
        infoId: this.$route.query.infoId,
        userId: this.$store.state.user.userId,
        status: this.$route.query.status,
        infoStatus: this.$route.query.infoStatus
      }
      this.$axios({
        url: prUrl + '/info/showDetail',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          let data = res.data.data
          this.describe = data.content
          this.attachmentList = data.attachmentList
          this.infoType = data.infoType
          this.projectName = data.comparedResultDTO
        }
        if (res.data.code === 60001) {
          this.$Message.error(res.data.msg)
          this.$router.go(-1)
          bus.$emit('on-myclose', this.$route)
        }
        // this.$Message.success(res.data.msg)
      })
      // .catch(err => {
      //   this.$Notice.warning({
      //     title: '数据异常，请联系技术人员'
      //   })
      // })
    }
  }
}
</script>
