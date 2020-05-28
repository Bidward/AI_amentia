<template>
  <Drawer class="bzDrawer" v-model="showDrawer" :width="300" :closable="false">
    <div slot="header" style="height:100%;">
      <div class="header">
        <div
          class="type"
          :class="type==='消息'?'active':''"
          @click="type='消息';isList=true;getUnread()"
        >消息</div>
        <div
          class="type"
          :class="type==='通知'?'active':''"
          @click="type='通知';isList=true;getUnread()"
        >通知</div>
      </div>
    </div>
    <div class="content">
      <div v-if="msgList.length===0">没有更多{{type}}</div>
      <bzCard  @updateList="updateList()" v-for="item in msgList" :msg="item" :key="item.stationId"></bzCard>
      <div class="more clearfix" v-if="msgList.length!==0&&isList">
        <div class="seeMore" @click="toStation">查看更多</div>
        <div class="allRead" @click="readAll">全部已读</div>
      </div>
      <div class="page" v-if="msgList.length!==0&&isList">
        <Page
          @on-change="(currPage)=>{searchHeader.currPage=currPage;getUnread()}"
          :current="searchHeader.currPage"
          :total="totalCount"
          :pageSize="5"
          simple
        />
      </div>
    </div>
  </Drawer>
</template>
<script>
import { mapMutations } from 'vuex'
import bzCard from './bzCard.vue'
import { baseUrl } from '@/api/base.js'
// import { clearInterval } from 'timers'
let timer = null
export default {
  name: 'bzDrawer',
  components: {
    bzCard
  },
  data () {
    return {
      totalCount: 0,
      type: '消息', // 消息或者通知
      isList: true, // 显示五条还是显示单条
      searchHeader: {
        detailsType: this.type === '消息' ? 2 : 1, // 1通知2消息
        pageSize: 5,
        currPage: 1
      },
      msgList: [],
      oneList: [] // 用来存储单条消息
    }
  },
  mounted () {
    let me = this
    if (!localStorage.getItem('stopStation')) {
      this.getUnreadinterval()
    }
    bus.$on('stationDetail', e => {
      me.oneList = [e]
    })
  },
  methods: {
    ...mapMutations([
      'handleCloseDrawer',
      'handleShowDrawer',
      'setUnreadNum',
      'setShowType'
    ]),
    // 当站内信卡片有操作的时候
    updateList () {
      // 变成列表页
      this.isList = true
      // 更新抽屉列表
      this.getUnread()
      // 更新站内信的铃铛
      this.getUnreadinterval()
    },
    // 定时获取通知铃铛
    getUnreadinterval () {
      let me = this
      clearInterval(timer)
      this.countUnread()
      timer = setInterval(() => {
        me.countUnread()
      }, 120000)
    },
    // 获取当前的列表
    getUnread () {
      let sendData = this.searchHeader
      sendData.detailsType = this.type === '消息' ? 2 : 1
      this.$axios({
        url: baseUrl + '/station/findUnread',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          let content = res.data.content
          this.msgList = content.pageContent
          this.totalCount = content.totalCount
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取通知铃铛的未读消息数,和需要通知提醒的内容
    countUnread () {
      this.$axios({
        url: baseUrl + '/station/findUnreadStationEmail',
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            let me = this
            let num = res.data.countUnread // 所有未读消息
            let content = res.data.content // 需要发notice的消息
            this.setUnreadNum(num)
            // 当不等于0的时候，每一条消息都去发通知
            if (content.length !== 0) {
              // 2019年8月28日高永艳提出，一条发通知三秒关闭，多条只提示有几条未读
              if (content.length === 1) {
                let e = content[0]
                me.$Notice.info({
                  title: e.detailsReadType,
                  desc: e.detailsContent,
                  duration: 3
                })
              } else {
                let l = content.length
                let e = content[0]
                me.$Notice.info({
                  title: e.detailsReadType,
                  desc: `您有${l}条消息，请注意查收`,
                  duration: 0,
                  onClose () {
                    me.setShowType({ type: e.detailsReadType, isList: true })
                    me.handleShowDrawer()
                  }
                })
              }
              // content.forEach(e => {
              //   me.$Notice.info({
              //     title: e.detailsReadType,
              //     desc: e.detailsContent,
              //     duration: 0,
              //     onClose () {
              //       me.setShowType({ type: e.detailsReadType, isList: true })
              //       me.handleShowDrawer()
              //     }
              //   })
              // })
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 查看更多，跳转到站内信页面
    toStation () {
      // 关闭抽屉
      this.handleCloseDrawer()
      // 跳转到站内信页面
      this.$router.push({ name: 'station' })
    },
    // 全部已读
    readAll () {
      let ids = this.msgList.map(e => {
        return e.stationId
      })
      this.$axios({
        url: baseUrl + '/station/updateIsStatus',
        method: 'post',
        data: ids
      })
        .then(res => {
          if (res.data.code === 10000) {
            // 跳回第一页
            this.searchHeader.currPage = 1
            this.updateList()
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  computed: {
    showDrawer: {
      get () {
        return this.$store.state.station.showDrawer
      },
      set () {
        this.handleCloseDrawer()
      }
    },
    userId () {
      return this.$store.state.user.userId
    },
    showType () {
      return this.$store.state.station.showType
    }
  },
  watch: {
    showDrawer (newV) {
      if (newV) {
        let type = this.showType.type
        let isList = this.showType.isList
        this.type = type
        this.isList = isList
        if (isList) {
          this.getUnread()
        } else {
          this.msgList = this.oneList
        }
      }
    }
  },
  beforeDestroy () {
    // 退出登录的时候清除定时器
    clearInterval(timer)
  }
}
</script>
<style lang="less" scoped>
@green: rgba(49, 179, 153, 1);
@white: #fff;
.bzDrawer {
  overflow-x: hidden;
  width: 300px;
  .more {
    cursor: default;
    .seeMore {
      float: left;
      cursor: pointer;
    }
    .allRead {
      float: right;
      cursor: pointer;
    }
  }
  .page {
    margin: 0 auto;
    text-align: center;
  }
}
.header {
  .type {
    @line-height: 50px;
    display: inline-block;
    width: 50%;
    height: @line-height;
    line-height: @line-height;
    font-size: 18px;
    text-align: center;
    cursor: pointer;
    background-color: @white;
    color: @green;
    &.active {
      background-color: @green;
      color: @white;
    }
  }
}
</style>
<style>
.bzDrawer .ivu-drawer-header {
  padding: 0;
}
</style>
