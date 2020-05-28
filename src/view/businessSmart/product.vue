<template>
    <!-- 产品库 -->
    <div class="viewWrapper" style="padding:20px;overflow:auto;" :class="isFullScreen ? 'fullScreen':''">
        <Tabs type="card" :animated="false" class="level-two" v-model="currentTab" @on-click="handleTab">
          <TabPane
            v-for="(item, index) in tabs"
            :label="headerCount[index].count"
            :key="index"
            :name="item.name"
          >
          <Button type="primary" class="btns" style="margin-top:10px" @click="addProduct"  :disabled="!params">新增</Button>
            <component
              v-if="currentTab===item.name"
              @on-set-table-height="setTableHeight"
              @update-count-info="(info) => headCount = info"
              ref="tableHeight"
              :is="item.name"
              :isFullScreen.sync="isFullScreen"
              :tableHeight="tableHeight"
            ></component>
          </TabPane>
        </Tabs>
    </div>
</template>
<script>
import all from './components/productBank/list/product-all'
import hide from './components/productBank/list/product-hide'
import toContact from './components/productBank/list/product-toContact'
import setContact from './components/productBank/list/product-setContact'
import cooperationed from './components/productBank/list/product-cooperationed'
import lose from './components/productBank/list/product-lose'
import { getFixedTableHeight } from './components/tool'
// import { debounce } from '@/libs/tools'
// import moment from 'moment'
import { baseUrl } from '@/api/base.js'
export default {
  name: 'product',
  components: {
    all,
    hide,
    toContact,
    setContact,
    cooperationed,
    lose
  },
  data () {
    return {
      loading: false,
      incumbencyTbUser: [], // 在职人员列表
      currentTab: this.$route.query.stage || sessionStorage.productTabs || 'all',
      isFullScreen: JSON.parse(sessionStorage.getItem('product-fullscreen')),
      tableHeight: 0,
      tabs: [
        {
          lable: '全部',
          name: 'all'
        },
        {
          lable: '潜在客户',
          name: 'hide'
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
      params: true,
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
                  'active-badge': this.currentTab === 'hide'
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
  created () { sessionStorage.setItem('productTabs', this.currentTab) },
  mounted () {
    // window.addEventListener('resize', debounce(this.setTableHeight))
    this.getUser()
  },
  watch: {
    isFullScreen () {
      this.setTableHeight()
    }
  },
  beforeDestroy () {
    // window.removeEventListener('resize', debounce(this.setTableHeight))
  },
  methods: {
    setTableHeight () {
      if (this.$route.name !== 'product') return
      // let tableHeight = this.$refs.tableHeight[0].$children[4].$children[1].$el.clientHeight
      // let fixedHeight = getFixedTableHeight(this.isFullScreen)
      // if (tableHeight > fixedHeight) {
      //   this.tableHeight = fixedHeight
      // } else {
      //   if (tableHeight < 40) {
      //     this.tableHeight = tableHeight + 80
      //   } else {
      //     this.tableHeight = tableHeight + 36 + 17
      //   }
      // }
      this.tableHeight = getFixedTableHeight(this.isFullScreen)
    },
    getUser () {
      this.$axios({
        url: baseUrl + '/login/getuser',
        method: 'get'
      }).then(res => {
        if (res.data.code === 200) {
          localStorage.setItem('userId', res.data.id)
          localStorage.setItem('username', res.data.nickname)
          this.params = res.data.permission.product.create
        }
      })
    },
    addProduct (row) {
      this.$router.push({
        name: 'businessAddProduct',
        query: {
          type: '1'
        }
      })
    },
    handleTab () {
      // 如果query有值，把tagName清除
      if (this.$route.query) {
        this.$route.query.stage = ''
        sessionStorage.setItem('productTabs', this.currentTab)
      }
    }
  }
}
</script>
