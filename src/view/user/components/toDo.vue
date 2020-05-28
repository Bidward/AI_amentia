<template>
  <div class="extra">
    <div style="float:right">
      <div class="timeBox">
        <DatePicker
          :value="todoData.starttime"
          v-model="todoData.starttime"
          format="yyyy-MM-dd"
          size="default"
          width="auto"
          type="date"
          placeholder="发起时间"
          @on-change="todoData.starttime = $event"
          style="marginRight: 4px;"
        ></DatePicker
        >至
        <DatePicker
          :value="todoData.endtime"
          v-model="todoData.endtime"
          format="yyyy-MM-dd"
          size="default"
          width="auto"
          type="date"
          placeholder="发起时间"
          @on-change="todoData.endtime = $event"
        ></DatePicker>
      </div>
      <Input
        class="inp"
        id="searchKeyword"
        v-model="searchKeyword"
        placeholder="事项类型或发起人"
        style="width: auto"
        size="default"
      />
      <Button
        type="primary"
        size="default"
        icon="ios-search"
        @click="searchTodo"
        class="search"
        >搜索</Button
      >
    </div>
    <div style="clear:both"></div>
    <div class="noData" v-if="todoList.length == 0">
      <span>暂无事项</span>
    </div>
    <ul class="list" v-else>
      <Card
        v-for="(item, index) in todoList"
        :key="index"
        style="margin:15px 0;"
      >
        <div
          class="content"
          @click="
            toDetail(item.route, item.objectId, item.id, item.businessName)
          "
        >
          <h4>
            <span class="title">{{ item.backlogTitle }}</span>
            <span v-if="item.confirmTimeMillis" class="time">
              <count-down :timeStp="item.confirmTimeMillis"></count-down>
            </span>
            <span class="name">发起人：{{ item.backlogInitiator }}</span>
          </h4>
        </div>
      </Card>
    </ul>
    <div class="tableFooter">
      <Page
        v-if="todoData.total !== 0"
        :total="todoData.total"
        :page-size="todoData.pageSize"
        :current="todoData.currPage"
        size="small"
        show-total
        show-elevator
        show-sizer
        @on-change="
          currPage => {
            todoData.currPage = currPage;
            getTodoData();
          }
        "
        @on-page-size-change="
          pageSize => {
            todoData.pageSize = pageSize;
            getTodoData();
          }
        "
      />
    </div>
  </div>
</template>
<script>
import CountDown from '@/view/public/task/components/count-down'
import { baseUrl } from '@/api/base.js'
export default {
  name: 'toDo',
  components: {
    CountDown
  },
  props: {
    sonTabName: {
      type: String
    }
  },
  data () {
    return {
      things: '0',
      waitHandel: '0',
      todoData: {
        starttime: '',
        endtime: '',
        total: 0,
        pageSize: 20,
        currPage: 1
      },
      route: '',
      currentTab: '0',
      searchKeyword: '',
      todoList: []
    }
  },
  watch: {
    sonTabName: {
      handler () {
        this.getTodoData()
      },
      immediate: true
    }
  },
  methods: {
    getTodoData () {
      /**
       * 获取待办事项数据
       * code 10000为正常
       * 传参{
       *  status 当前tab 0为待办事项 1为已完成事项
       *  starttime 发起时间开始时间
       *  endtime 发起时间结束时间
       *  fuzzyCondition 搜索关键词事件类型或发起人
       *  currPage 当前页数
       *  pageSize 每页展现数据条数 默认20条
       * }
       * 回参{
       *   todoData.total 待办事项数据总数
       *   todoList 待办事项数据列表
       *   backlogTitle 事项名称
       *   backlogCreateTime 发起时间
       *   backlogInitiator 发起人
       * }
       **/
      let sendTodoData = {
        type: this.sonTabName,
        status: 0,
        starttime: this.todoData.starttime,
        endtime: this.todoData.endtime,
        fuzzyCondition: this.searchKeyword,
        currPage: this.todoData.currPage,
        pageSize: this.todoData.pageSize
      }
      this.$axios({
        url: baseUrl + '/backlog/query',
        data: $qs.stringify(sendTodoData),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.todoData.total = resp.data.content.totalCount
            this.todoList = resp.data.content.pageContent
            this.waitHandel = this.todoData.total
            this.$emit('numData', this.waitHandel)
            // bus.$emit('waitHandel', this.waitHandel)
            // sessionStorage.setItem('waitHandel', this.waitHandel)
          } else {
            this.todoData.total = 0
            this.todoList = []
            // 屏蔽查无数据
            // this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    searchTodo () {
      this.todoList = []
      this.getTodoData()
      this.searchKeyword = ''
      this.todoData.starttime = ''
      this.todoData.endtime = ''
    },
    /**
     * 跳转到对应详情页
     * route 跳转到的路由
     * backlogId 待办事项或已完成事项的ID
     **/
    toDetail (route, objectId, id, businessName) {
      if (route === 'addUser') {
        this.$router.push({
          name: route,
          query: {
            type: 'tbc',
            id: objectId,
            backlogId: id
          }
        })
      } else if (route.startsWith('duty')) {
        // this.$router.push(route)
        this.$router.push({
          path: route,
          query: {
            id: id,
            userIdProps: this.$store.state.user.userId
          }
        })
      } else if (route.startsWith('task')) {
        this.$router.push(route)
      } else if (route.startsWith('approval')) {
        this.$router.push(route)
      } else if (route.startsWith('projectDeclaration')) {
        this.$router.push(route)
      } else if (route.startsWith('business/businessSet')) {
        route = route + '?id=' + id
        this.$router.push(route)
      } else if (route.startsWith('business')) {
        route = route + '&id=' + id
        this.$router.push(route)
      } else if (route.startsWith('detailChannel')) {
        // 渠道匹配产品
        this.$router.push({
          name: route,
          query: {
            productChannelId: objectId
          }
        })
      } else if (route.startsWith('detailProduct')) {
        // 产品匹配渠道
        this.$router.push({
          name: route,
          query: {
            productCompanyId: objectId
          }
        })
      } else if (route.startsWith('finance')) {
        // 业务数据
        sessionStorage.setItem('sitDateTab', 'topUpWarning')
        this.$router.push(route)
      } else {
        this.$router.push({
          name: route,
          query: {
            type: 'tbc',
            id: objectId,
            backlogId: id
          }
        })
      }
      // let sendData = {
      //   backlogId: backlogId
      // }
      // this.$axios({
      //   url: baseUrl + '/company/load',
      //   data: $qs.stringify(sendData),
      //   method: 'post'
      // })
      //   .then(resp => {
      //     console.log(resp)
      //     if (resp.data.code === 10000) {

      //     } else {
      //       this.$Message.error(resp.data.msg)
      //     }
      //   })
      //   .catch(err => {
      //     console.log('err', err)
      //   })
      // to do 路由跳转前将backlogId发给后端取判断给什么数据
    }
  }
}
</script>
<style scoped>
.extra {
  padding: 15px 0 0 0;
}
.search {
  margin-right: 10px;
}
.ivu-btn > :not(:last-child) {
  margin-right: 0px;
}
#searchKeyword {
  margin: 0 10px 0 10px;
}
.timeBox {
  display: inline;
}
.noData {
  text-align: center;
  font-size: 14px;
  margin-top: 30px;
  color: #707070;
}
#user .ivu-btn-primary {
  background-color: #19aa8d;
  border-color: #19aa8d;
  color: #fff;
}

#user .ivu-btn-primary:hover {
  background-color: #088f74;
  color: #fff;
}

#user .ivu-tabs-bar {
  /* border-bottom: 2px solid #088f74; */
  /* padding: 3px; */
}

#user .ivu-tabs-tabpane {
  margin-top: 20px;
}

#user .ivu-page {
  float: right;
}

#searchKeyword {
  margin: 0 10px 0px 10px;
}

.main .tags li {
  float: left;
  list-style: none;
  margin-right: 5px;
  width: 100px;
  height: 20px;
  text-align: center;
}

.main .tags li.active {
  background-color: green;
  color: #fff;
}

.content {
  cursor: pointer;
}
.content > h4 {
  display: flex;
  align-items: center;
}
.content .title {
  margin-right: 20px;
  display: inline-block;
  max-width: 70%;
  max-height: 27px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 18px;
  color: #34bc96;
  flex: 6;
}
.content .time {
  color: #c2c2c2;
  flex: 2;
  font-size: 16px;
  text-align: end;
}
.content .name {
  align-self: flex-end;
  flex: 1;
  text-align: end;
}
@media screen and (max-width: 980px) {
  #user .ivu-tabs-nav-container {
    width: 100%;
    margin-top: 55px;
  }
  .extra {
    /* float: right;
        display: flex;
        height: 32px;
        position: relative;
        top: 53px;
        padding: 20px 0; */
  }
  .extra .timeBox {
    flex: 10;
  }
  .extra .inp {
    flex: 3;
  }
  .extra button {
    flex: 1;
  }
  .content .title {
    max-width: 40%;
    font-size: 16px;
    flex: 4;
  }
  .content .time {
    color: #c2c2c2;
    flex: 4;
  }
  .content .name {
    flex: 2;
  }
}
</style>
