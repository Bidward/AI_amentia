<template>
  <div class="countDown">
    <div v-if="curRoute=='home'">
      <div v-if="timeStamp < 0" class="contentHome">{{this.msg}}</div>
      <div v-else class="contentHome">
        <!-- <span class="iconClock">
          <Icon type="md-time" />
        </span> -->
        <span>{{title}}倒计时:</span>
        <span class="timeHome">
          <span class="timeItem">{{remainTime.day}} 天</span>
          <span class="timeItem">{{remainTime.hour}} 时</span>
          <span class="timeItem">{{remainTime.minute}} 分</span>
          <!-- <span class="timeItem">{{remainTime.second}} 秒</span> -->
        </span>
      </div>
    </div>
    <div v-else>
      <div v-if="timeStamp <= 0" class="content">{{this.msg}}</div>
      <div v-else class="content">
        <!-- <span class="iconClock">
          <Icon type="md-time" />
        </span> -->
        <span class="countTitle">剩余{{title}}时间</span>
        <span class="divider"></span>
        <span class="time">
          <span class="timeItem">{{remainTime.day}} 天</span>
          <span class="timeItem">{{remainTime.hour}} 时</span>
          <span class="timeItem">{{remainTime.minute}} 分</span>
          <span class="timeItem">{{remainTime.second}} 秒</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { formatCountDown } from '@/assets/js/count-down.js'
export default {
  name: 'count-down',
  props: {
    timeStp: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      remainTime: {},
      interval: 1000,
      timeStamp: this.timeStp,
      msg: ''
    }
  },
  created () {
    this.count = 0
    this.startTime = Number(new Date().getTime())
    this.timer = setTimeout(() => {
      this.calcRemainTime()
    }, this.interval)
  },
  methods: {
    calcRemainTime () {
      this.count++
      // 时间差
      let offset = Number(new Date().getTime()) - (this.startTime + this.count * this.interval)
      let nextTime = this.interval - offset
      if (nextTime < 0) {
        nextTime = 0
      }
      this.timeStamp = this.timeStamp - this.interval
      this.remainTime = formatCountDown(this.timeStamp)
      if (!this.remainTime) {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        if (this.title === '确认') {
          this.msg = '方案确认超时！'
        } else {
          this.msg = '任务确认超时！'
        }
        return
      }
      this.timer = setTimeout(() => {
        this.calcRemainTime()
      }, nextTime)
    }
  },
  computed: {
    curRoute () {
      return this.$route.name
    }
  },
  watch: {
    timeStp (newVal) {
      this.timeStamp = newVal
      if (newVal < 0) {
        if (this.title === '确认') {
          this.msg = '方案确认超时！'
        } else {
          this.msg = '任务确认超时！'
        }
      }
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/style/variables.less';
  .contentHome {
    font-weight: 700;
    font-size: 10px;
    height: 30px;
    line-height:30px;
    align-items: center;
    justify-content: space-around;
    border-radius: 15px;
    padding: 0 15px;
    min-width: 90px;
    color: #ed4014;
    .timeHome {
      .timeItem {
        display: inline-block;
        margin: 5px;
      }
    }
  }
  .content {
    font-weight: 700;
    font-size: 16px;
    height: 30px;
    line-height:30px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0 10px;
    min-width: 90px;
    box-shadow: 0px 1px 6px 3px rgba(0, 0, 0, 0.1);
    // &.bgRed {
    //   background: #ed423c;
    // }
    // &.bgGreen {
    //   background: #0f7165;
    // }
    // &.bgYellow {
    //   background: #faad14;
    // }
    .iconClock {
      font-size: 18px;
      margin-bottom: 3px;
    }
    .countTitle {
      font-size: 16px;
      font-weight: 700;
      // margin: 0 5px 0 10px;
    }
    .divider {
      height: 15px;
      width: 1px;
      background: rgba(0, 0, 0, 0.08);
      box-shadow: -1px 0 1px 0px #ccc;
      margin: 0 10px;
      display: inline-block;
    }
    .time {
      color: #fff;
      .timeItem {
        display: inline-block;
        margin: 5px;
        font-weight: normal;
        &:first-child {
          margin-left: 0;
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
</style>
