<template>
  <!-- 奖惩细则 -->
  <div class="reward-detail">
    <div class="title" @click="showRewardDetail">奖惩细则</div>
    <Modal
      :mask-closable="false"
      :loading="loading"
      id="taskModal"
      v-model="showModal"
      width="920"
      class-name="detail-modal"
      :footer-hide="true"
      >
      <div slot="header">
        <Icon type="md-school" style="color: #19aa8d;margin-right: 10px; marginBottom: 3px;" size="20"/>
        <span class="title-name" style="fontSize: 16px;">奖惩细则</span>
      </div>
      <div class="content-wrapper">
        <div class="content">
          <ul class="tabs">
            <li
              class="tab"
              :class="activeIndex == index ? 'active' : ''"
              v-for="(tab, index) in tabs"
              :key="tab.id"
              @click="changeTab(tab, index)"
            >
              <span>
                {{tab.name}}
              </span>
            </li>
          </ul>
          <div class="details">
            <div class="list">
              <div class="list-item" v-for="item in currentContent" :key="item.id">
                <div class="title">
                 <span class="icon"></span>
                 <span>{{item.name}}</span>
                </div>
                <ul>
                  <li v-for="(text, index) in item.content" :key="index">
                    <span>{{index + 1}}、</span><span>{{text}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { staticUrl } from '@/api/base.js'
export default {
  name: 'rewardDetail',
  data () {
    return {
      currentTab: 'all',
      activeIndex: 0,
      staticUrl,
      showModal: false,
      loading: true,
      hasRight: false,
      tabs: [
        {
          id: 'all',
          name: '全部',
          content: [
            {
              id: 'send',
              name: '日报发送',
              content: ['xxxx', 'xxxx']
            },
            {
              id: 'reply',
              name: '日报回复',
              content: ['123', '234123']
            },
            {
              id: 'meeting',
              name: '晨会纪要',
              content: ['123123', '234']
            },
            {
              id: 'talking',
              name: '成员面谈',
              content: ['123', '234']
            },
            {
              id: 'task',
              name: '任务系统',
              content: ['123', '234']
            },
            {
              id: 'daily',
              name: '日常奖惩',
              content: ['123123', '234']
            }
          ]
        },
        {
          id: 'send',
          name: '日报发送',
          content: [
            {
              id: 'send',
              name: '日报发送',
              content: ['123', '234']
            }
          ]
        },
        {
          id: 'reply',
          name: '日报回复',
          content: [
            {
              id: 'reply',
              name: '日报回复',
              content: ['123', '234123']
            }
          ]
        },
        {
          id: 'meeting',
          name: '晨会纪要',
          content: [
            {
              id: 'meeting',
              name: '晨会纪要',
              content: ['123123', '234']
            }
          ]
        },
        {
          id: 'talking',
          name: '成员面谈',
          content: [
            {
              id: 'talking',
              name: '成员面谈',
              content: ['123', '234']
            }
          ]
        },
        {
          id: 'task',
          name: '任务系统',
          content: [
            {
              id: 'task',
              name: '任务系统',
              content: ['123', '234']
            }
          ]
        },
        {
          id: 'daily',
          name: '日常奖惩',
          content: [
            {
              id: 'daily',
              name: '日常奖惩',
              content: ['123123', '234']
            }
          ]
        }
      ],
      options: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      }
    }
  },
  methods: {
    changeTab (tab, index) {
      this.currentTab = tab.id
      this.activeIndex = index
    },
    // 显示弹框
    showRewardDetail () {
      this.showModal = true
    }
  },
  computed: {
    currentContent () {
      let content = []
      this.tabs.some(tab => {
        if (tab.id === this.currentTab) {
          content = tab.content
        }
      })
      return content
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/style/variables.less';
.content-wrapper {
  height: 400px;
  .content {
    height: 100%;
    display: flex;
    align-items: center;
    .tabs {
      list-style: none;
      position: relative;
      min-width: 80px;
      &:before {
        display: block;
        content: '';
        position: absolute;
        right:0px;
        top: 0px;
        height: 300px;
        width: 1px;
        background:#ddd;
      }
      .tab {
        display: flex;
        height: 40px;
        align-items: flex-end;
        border-bottom: 1px dashed #ccc;
        margin-right: 5px;
        justify-content: center;
        &:first-child {
          height: 35px;
        }
        &.active {
          color: @color-theme-green;
        }
      }
    }
    .details {
      height: 100%;
      // border: 1px solid green;
      width: 100%;
      margin-left: 50px;
      overflow-y: scroll;
      .list {
        box-sizing: border-box;
        padding: 40px;
        .list-item {
          .title {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            .icon {
              display: inline-block;
              width: 4px;
              height: 16px;
              margin-right: 10px;
              background: @color-theme-green;
            }
          }
          ul {
            list-style: none;
            margin-bottom: 20px;
            li {
              text-indent: 14px;
            }
          }
        }
      }
    }
  }
}
.reward-detail {
  .title {
    width: 80px;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    color: #ff9900;
  }

  #taskModal .ivu-modal-body {

      height: 400px;
      width: 200px;

  }
  #taskModal .ivu-input:hover {
    border-color: #19aa8d;
  }
  #taskModal .ivu-input:focus {
    border-color: #19aa8d;
    outline: 0;
    box-shadow: none;
  }
  #taskModal .ivu-select-selection-focused,
  #taskModal .ivu-select-selection:hover
  {
    border-color: #19aa8d;
  }
  #taskModal .ivu-select-visible .ivu-select-selection {
    border-color: #19aa8d;
    outline: 0;
    box-shadow:none;
  }
  // #taskModal .ivu-modal-footer Button:first-child{
  //   color: #19aa8d;
  //   background-color: #fff;
  //   border-color: #19aa8d;
  // }
  // #taskModal .uploadButton:hover,
  // #taskModal .uploadButton:active{
  //     color: #19aa8d !important;
  //     background-color: #fff;
  //     border-color: #19aa8d  !important;
  //     box-shadow:none;
  // }
}

</style>
