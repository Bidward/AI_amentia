<template>
  <div class="page-top">
    <span class="back" @click="goBack">
      <Icon type="ios-arrow-back" style="margin: 0 0 0 10px;"/>
      <span style="color: #fff;">返回</span>
    </span>
    <div class="basic-info-content">
      <div class="basic-info">
        <div class="basic-info-box">
          <div class="basic-info-top">
            <span
              class="basic-info-name title-task"
              :title="info.taskName"
            >{{info.taskName}}
            </span>
            <span
              class="basic-info-name"
            >
              任务{{info.taskStatus}}
            </span>
          </div>
          <div class="basic-info-bottom">
            <ul class="content-box">
              <li>
                <span>开始日期：</span>
                <span>{{info.taskStarttime}}</span>
              </li>
              <li>
                <span>截止日期：</span>
                <span>{{info.endTime}}</span>
              </li>
              <li>
                <span>任务类型：</span>
                <span>{{info.taskType}}</span>
                <span>（{{info.taskLevel}}级）</span>
              </li>
              <!-- <li>
                <span>任务状态：</span>
                <span>{{info.taskStatus}}</span>
              </li> -->
            </ul>
            <div
              class="time-count"
              :class="info.taskStatus === '待确认' ? 'bgYellow': 'bgRed'" v-show="show">
              <count-down
                :timeStp="timeStp"
                :title="title"
              ></count-down>
            </div>
            <div
              class="time-count bgGreen"
              v-show="!show && info.completeTime"
            >
              <div style="display: flex;align-items: center; padding: 0 10px;">
                <span>任务完成时间</span>
                <span class="divider"></span>
                <span>{{info.completeTime}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CountDown from './count-down'
export default {
  name: 'info-board',
  components: {
    CountDown
  },
  props: {
    info: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  created () {
    // console.log(this.$route.query, 'query')
  },

  methods: {
    // 返回
    goBack () {
      this.$emit('button-back', true)
      let step = -1
      // 编辑跳转到详情后退2
      if (this.$route.query && this.$route.query.from === 'edit') {
        step = -2
      }
      // console.log('goback')
      this.$router.go(step)
      // 改为在详情/编辑的beforeRouteLeave中关闭
      // bus.$emit('on-myclose', this.route)
    }
  },
  computed: {
    route () {
      return this.$route
    },
    // 倒计时时间戳
    timeStp () {
      return Number(this.info.confirmTimeMillis)
    },
    // 倒计时名称（确认/完成）
    title () {
      let title = ''
      if (this.info.taskStatus === '待确认') {
        title = '确认'
      } else if (this.info.taskStatus === '进行中') {
        title = '完成'
      }
      return title
    },
    show () {
      let show = true
      let status = this.info.taskStatus
      if (status === '完成' || status === '暂缓' || status === '关闭') {
        show = false
      }
      return show
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/style/variables.less';
.page-top {
  width: 100%;
  height: 250px;
  // padding: 11px 10px 0 10px;
  background: @color-theme-green;
  position: relative;
  padding-top: 20px;
  box-sizing: border-box;
}
.page-top .back {
    display: flex;
    align-items: center;
    width: 70px;
    height: 30px;
    border: 1px solid #fff;
    border-radius: 3px;
    font-size: 14px;
    margin: 0px 0 20px 80px;
    cursor: pointer;
    color: #fff;
    position: relative;
}
.page-top .basic-info-content {
  padding: 0 80px;
  width: 100%;
  position: relative;
  z-index: 0;
}
.basic-info-content .basic-info {
  display: flex;
}
.basic-info .basic-info-box {
  width: 100%;
  margin: 0 0 0 0;
  color: #fff;
}
.basic-info .basic-info-top{
  width: 100%;
  border-bottom: 1px solid #fff;
  padding-bottom: 15px;
  display: flex;
  justify-content: space-between;
}
.basic-info-box .basic-info-name{
  display: inline-block;
  font-size: 28px;
  line-height: 28px;
  font-weight: 700;
  color: #efefef;
  max-width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  &.title-task {
    color: #fff;
  }
}
.basic-info-box .basic-info-bottom{
  width: 100%;
  margin: 15px 0 0 0;
}
.basic-info-box .content-box{
  margin: 0;
  padding: 0;
  display: inline-block;
  font-size: 14px;
  color: #efefef;
  font-weight: 700;
}
.basic-info-box .time-count {
  float: right;
  height: 30px;
  line-height: 30px;
  border-radius: 3px;
  text-align: center;
  &.bgRed {
    background: #ed423c;
  }
  &.bgGreen {
    background: #0f7165;
    .divider {
      height: 15px;
      width: 1px;
      background: rgba(0, 0, 0, 0.08);
      box-shadow: -1px 0 1px 0px #ccc;
      margin: 0 10px;
      display: inline-block;
    }
  }
  &.bgYellow {
    background: #faad14;
  }
}
// .detailPage .pageMiddle{
//   /* margin: -60px 70px 100px 70px; */
//   /* position: relative; */
//   background: #fff;
//   padding: 30px 30px;
//   border-radius: 7px;
//   box-shadow: 0 2px 13px 0 rgba(0, 0, 0, 0.12);
//   border: 1px solid
// }
</style>
