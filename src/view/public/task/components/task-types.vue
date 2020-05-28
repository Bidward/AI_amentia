<template>
  <div class="wrapper">
    <router-view name="detail" />
    <div class="task-types viewWrapper">
      <div class="tabs">
        <router-link
          class="tab"
          v-for="tab in tabTypes"
          @click.native="handleTabChange(tab)"
          :key="tab.id"
          :to="tab.path"
          >
          {{tab.name}}
        </router-link>
      </div>
      <div class="action">
        <div class="inner">
          <launch-task :show="showLaunch" @click="showModal"></launch-task>
        </div>
      </div>
      <router-view class="info"
        :key="$route.fullPath"
      ></router-view>
    </div>
  </div>
</template>

<script>
import LaunchTask from './launch-task'
import Detail from '../detail'
import Edit from '../edit'
export default {
  name: 'types',
  components: {
    LaunchTask,
    Detail,
    Edit
  },
  data () {
    return {
      employeeList: [],
      tabTypes: [
        {
          id: 2,
          name: '我发起的任务',
          path: '/task/propose'
        },
        {
          id: 3,
          name: '我接收的任务',
          path: '/task/accept'
        },
        {
          id: 4,
          name: '我执行的任务',
          path: '/task/excute'
        },
        {
          id: 5,
          name: '我关注的任务',
          path: '/task/focus'
        },
        {
          id: 6,
          name: '全部任务',
          path: '/task/all'
        },
        {
          id: 7,
          name: '待审任务',
          path: '/task/pending'
        },
        // {
        //   id: 8,
        //   name: '悬赏任务',
        //   path: '/task/reward'
        // },
        {
          id: 9,
          name: '部门任务',
          path: '/task/department'
        },
        {
          id: 10,
          name: '月度评审',
          path: '/task/monthly'
        }
      ],
      taskLevels: [],
      taskStatus: [],
      showLaunch: false,
      from: '',
      routeName: ''
    }
  },
  provide () {
    return {
      tasks: this
    }
  },
  methods: {
    showModal (flag) {
      this.showLaunch = flag
    },
    // 切换任务标签页时将currentTab和currentPage都设为初始值
    handleTabChange (tab) {
      sessionStorage.setItem('listeTabTypes', tab.id)
    }
  },
  watch: {
    '$route' (newVal, val) {
      if (val.name === 'taskDetail') {
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/style/variables.less';
  .wrapper {
    height: 100%;
    box-sizing: border-box;
    &.hidden {
      overflow: hidden;
    }
  }
  .task-types {
    // width: 100%;
    // height: 100%;
    position: relative;
    // margin: 20px;
    // border: 1px solid #dcdee2;
    background: #fff;
    text-align: center;
    .tabs {
      width: 100%;
      box-sizing: border-box;
      border-bottom: 1px solid #dcdee2;
      font-size: 0;
      // margin-bottom: 9px;
      // padding: 19px 0 0;
      line-height: 39px;
      .tab {
        font-size: 14px;
        color: #515a61;
        padding: 5px 16px;
        margin-right: 16px;
        display: inline-block;
        box-sizing: border-box;
        position: relative;
        &.router-link-active {
          color: @color-theme-green;
          font-weight: 600;
          &:after {
            content: '';
            display: block;
            position: absolute;
            left: 50%;
            bottom: -1px;
            transform: translateX(-50%);
            width: 100%;
            height: 2px;
            background: @color-theme-green;
          }
        }
      }
    }
    @media screen and (max-width: 980px) {
      .tabs {
        display: flex;
        // flex-wrap: wrap;
      }
    }
    .action {
      width: 100%;
      .inner {
        margin: 9px 0;
      }
    }
    .info{
      padding:0;
    }
  }
</style>
