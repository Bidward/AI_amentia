<template>
  <div class="logs">
    <Button
      class="log-btn"
      @click="toggle"
    >日志区<Icon type="ios-arrow-down" :class=" fold ? 'rotate180' : 'rotate0' "></Icon>
    </Button>
    <collapse-transition>
      <div class="log-detail" v-show="fold">
        <ul v-show="taskLogs.length" style="list-style: none;">
          <li
            v-for="log in taskLogs"
            :key="log.id"
            style="margin: 10px 0;"
          >
            <span>{{log.operateTime}} </span>
            <span style="display: inline-block; margin: 0 0 0 20px ; min-width: 60px;">{{log.operateName}}</span>
            <span class="logContent">{{log.logContent}}</span>
          </li>
        </ul>
        <ul v-show="!taskLogs.length">
          <li>还没有日志</li>
        </ul>
      </div>
    </collapse-transition>
  </div>
</template>

<script>
import CollapseTransition from '@/assets/js/util'
export default {
  components: {
    CollapseTransition
  },
  props: {
    taskLogs: {
      type: Array,
      default () {
        return []
      }
    },
    getopLog: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      fold: false
    }
  },
  created () {

  },
  methods: {
    toggle () {
      if (this.getopLog && !this.fold) {
        this.getopLog()
      }
      this.fold = !this.fold
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/style/variables.less';
  .logs {
    margin-top: 15px;
    padding-bottom: 20px;
    .rotate180 {
      transform: rotate(180deg);
      transition: all 0.3s;
    }
    .rotate0 {
      transition: all 0.3s;
    }
    .log-detail {
      // box-shadow: 3px 3px 3px #ccc;
      padding: 10px;
      transition: all 0.5s ease;
      overflow: hidden;
      li {
        display: flex;
        flex-wrap: wrap;
        padding-right: 20px;
        .logContent {
          display: flex;
          flex: 1;
          flex-wrap: wrap;
        }
      }
    }
    .log-btn {
      color: @color-theme-green;
      border: 1px solid @color-theme-green;
    }

  }
</style>
