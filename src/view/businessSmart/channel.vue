<template>
    <!-- 渠道库 -->
    <div class="viewWrapper" style="padding:20px;overflow:auto;" :class="isFullScreen ? 'fullScreen':''">
        <Tabs
            type="card"
            :animated="false"
            class="level-two"
            v-model="currentTab"
            @on-click="handleTab"
        >
            <TabPane
                v-for="(item, index) in tabs"
                :label="headerCount[index].count"
                :key="index"
                :name="item.name"
            >
                <Button
                    type="primary"
                    class="btns"
                    style="margin-top:10px"
                    @click="addChannel"
                    :disabled="!addPermission"
                >新增</Button>
                <component
                  ref="tableHeight"
                  :is="item.name"
                  v-if="currentTab===item.name"
                  @update-count-info="value => headCount = value"
                  :isFullScreen.sync="isFullScreen"
                  @on-set-table-height="setTableHeight"
                  :tableHeight="tableHeight"></component>
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
import all from './components/channelBank/list/channel-all'
import hideClient from './components/channelBank/list/channel-hide'
import toContact from './components/channelBank/list/channel-toContact'
import setContact from './components/channelBank/list/channel-setContact'
import cooperationed from './components/channelBank/list/channel-cooperationed'
import lose from './components/channelBank/list/channel-lose'
// import moment from 'moment'
import { getFixedTableHeight } from './components/tool'
import { debounce } from '@/libs/tools'
import { baseUrl } from '@/api/base.js'
export default {
  name: 'channel',
  components: {
    all,
    hideClient,
    toContact,
    setContact,
    cooperationed,
    lose
  },
  data () {
    return {
      loading: false,
      incumbencyTbUser: [], // 在职人员列表
      isFullScreen: JSON.parse(sessionStorage.getItem('bussiness-smart')),
      tableHeight: 0,
      // currentTab: sessionStorage.channelTabs || 'all',
      currentTab:
                this.$route.query.tagName ||
                sessionStorage.channelTabs ||
                'all',
      tabs: [
        {
          lable: '全部',
          name: 'all'
        },
        {
          lable: '潜在客户',
          name: 'hideClient'
        },
        {
          lable: '待联系',
          name: 'toContact'
        },
        {
          lable: '建立联系',
          name: 'setContact'
        },
        {
          lable: '已合作',
          name: 'cooperationed'
        },
        {
          lable: '流失',
          name: 'lose'
        }
      ],
      addPermission: true,
      headerCount: [
        {
          count: (h) => {
            return h('div', [
              h('span', '全部'),
              h('Badge', {
                props: {
                  count: this.headCount.all
                },
                class: {
                  'task-badge': true,
                  'active-badge': this.currentTab === 'all'
                },
                style: {
                  marginLeft: '5px'
                }
              })
            ])
          }
        },
        {
          count: (h) => {
            return h('div', [
              h('span', '潜在客户'),
              h('Badge', {
                props: {
                  count: this.headCount.hide
                  // count: 10
                },
                class: {
                  'task-badge': true,
                  'active-badge': this.currentTab === 'hideClient'
                },
                style: {
                  marginLeft: '5px'
                }
              })
            ])
          }
        },
        {
          count: (h) => {
            return h('div', [
              h('span', '待联系'),
              h('Badge', {
                props: {
                  count: this.headCount.toContact
                },
                class: {
                  'task-badge': true,
                  'active-badge': this.currentTab === 'toContact'
                },
                style: {
                  marginLeft: '5px'
                }
              })
            ])
          }
        },
        {
          count: (h) => {
            return h('div', [
              h('span', '建立联系'),
              h('Badge', {
                props: {
                  count: this.headCount.setContact
                },
                class: {
                  'task-badge': true,
                  'active-badge': this.currentTab === 'setContact'
                },
                style: {
                  marginLeft: '5px'
                }
              })
            ])
          }
        },
        {
          count: (h) => {
            return h('div', [
              h('span', '已合作'),
              h('Badge', {
                props: {
                  count: this.headCount.cooperationed
                },
                class: {
                  'task-badge': true,
                  'active-badge': this.currentTab === 'cooperationed'
                },
                style: {
                  marginLeft: '5px'
                }
              })
            ])
          }
        },
        {
          count: (h) => {
            return h('div', [
              h('span', '流失'),
              h('Badge', {
                props: {
                  count: this.headCount.lose
                },
                class: {
                  'task-badge': true,
                  'active-badge': this.currentTab === 'lose'
                },
                style: {
                  marginLeft: '5px'
                }
              })
            ])
          }
        }
      ],
      headCount: {
        all: 0,
        cooperationed: 0,
        hide: 0,
        lose: 0,
        setContact: 0,
        toContact: 0
      }
    }
  },
  watch: {
    isFullScreen () {
      this.setTableHeight()
    }
  },
  mounted () {
    window.addEventListener('resize', debounce(this.setTableHeight))
    this.getUser()
  },
  beforeDestroy () {
    window.removeEventListener('resize', debounce(this.setTableHeight))
  },
  methods: {
    setTableHeight () {
      // this.tableHeight = getFixedTableHeight(this.isFullScreen) //表格高度固定，没有数据会展示空白
      // this.$nextTick(() => {
      //   let tableHeight = this.$refs.tableHeight[0].$children[4].$children[1].$el.clientHeight
      //   let fixedHeight = getFixedTableHeight(this.isFullScreen)
      //   if (tableHeight > fixedHeight) {
      //     this.tableHeight = fixedHeight
      //   } else {
      //     this.tableHeight = 0
      //     // if(tableHeight < 40){
      //     //   this.tableHeight =tableHeight + 80
      //     // }else{
      //     //   this.tableHeight = tableHeight + 36
      //     // }
      //   }
      // })
      this.tableHeight = getFixedTableHeight(this.isFullScreen)
    },
    // 获取用户
    getUser () {
      this.$axios({
        url: baseUrl + '/login/getuser',
        method: 'get'
      }).then(res => {
        if (res.data.code === 200) {
          this.addPermission = res.data.permission.channel.create
        }
      })
    },
    // 新增
    addChannel () {
      this.$router.push({
        name: 'addChannel'
      })
    },
    // 切换标签
    handleTab (v) {
      // 如果query有值，把tagName清除
      if (this.$route.query) {
        this.$route.query.tagName = ''
        sessionStorage.setItem('channelTabs', this.currentTab)
      }
    }
  }
}
</script>
