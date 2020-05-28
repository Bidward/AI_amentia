<template>
    <div class="viewWrapper" style="overflow: auto; padding: 20px;" :class="isFullScreen ? 'fullScreen' : ''">
        <policy class="top" :describe="describe" :attachmentList="attachmentList" />
        <inputInfo class="bottom" :infoType="infoType" :projectName="projectName" />
    </div>
</template>
<script>
import policy from './components/policy'
import inputInfo from './components/input-info'
import { prUrl } from '@/api/base.js'
export default {
  name: 'detailInfo',
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
    this.getData()
  },
  computed: {
    isFullScreen () {
      return this.$store.state.app.isTaskListFullScreen
    }
  },
  methods: {
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
