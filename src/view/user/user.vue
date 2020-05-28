<template>
  <Layout>
    <Content>
      <div class="viewWrapper" id="user">
        <Tabs value="0" class="level-one" :animated="false"  v-model="currentTab" @on-click="changeTab" >
          <TabPane :label="'待办事项('+waitHandel+')'" name="0">
            <Select v-model="things" @on-change="TodoCatalogs" style="width:200px">
              <Option v-for="item in thingList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <div class="extra" style="float: right">
                <div class="timeBox" v-if="dateFlag == true">
                <DatePicker
                    :value="todoData.starttime"
                    v-model="todoData.starttime"
                    format="yyyy-MM-dd"
                    size="default"
                    width="auto"
                    type="date"
                    placeholder="发起时间"
                    @on-change="todoData.starttime=$event"
                    style="marginRight: 4px;"
                ></DatePicker>至
                <DatePicker
                    :value="todoData.endtime"
                    v-model="todoData.endtime"
                    format="yyyy-MM-dd"
                    size="default"
                    width="auto"
                    type="date"
                    placeholder="发起时间"
                    @on-change="todoData.endtime=$event"
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
                v-if="dateFlag == true"
                type="primary"
                size="default"
                icon="ios-search"
                @click="searchTodo"
                >搜索</Button>
                <Button
                v-if="dateFlag == false"
                type="primary"
                size="default"
                icon="ios-search"
                @click="searchDone"
                >搜索</Button>
            </div>
            <div class="noData" v-if="todoList.length==0">
              <!-- <img src="./no-data.png"> -->
              <span>暂无事项</span>
            </div>
            <ul class="list" v-else>
              <Card v-for="(item,index) in todoList" :key="index" style="margin:20px 0;">
                <div class="content" @click="toDetail(item.route,item.objectId,item.id)">
                  <h4>
                    <!-- <Tooltip class="todo" :content=item.backlogTitle max-width="200px" placement="top">
                        <span class="title">{{item.backlogTitle}}</span>
                    </Tooltip>
                    <span class="time">{{item.backlogCreateTime}}</span> -->
                    <span class="title">{{item.backlogTitle}}</span>
                    <span v-if="item.confirmTimeMillis" class="time">
                      <count-down :timeStp="item.confirmTimeMillis"></count-down>
                    </span>
                    <span class="name">发起人：{{item.backlogInitiator}}</span>
                  </h4>
                </div>
              </Card>
            </ul>
            <div class="tableFooter">
              <Page
                v-if="todoData.total!==0"
                :total="todoData.total"
                :page-size="todoData.pageSize"
                :current="todoData.currPage"
                size="small"
                show-total
                show-elevator
                show-sizer
                @on-change="(currPage)=>{todoData.currPage=currPage;getTodoData()}"
                @on-page-size-change="(pageSize)=>{todoData.pageSize=pageSize;getTodoData()}"
              />
            </div>
          </TabPane>
          <TabPane label="已完成事项" name="1" >
            <Select v-model="things" @on-change="downCatalogs" style="width:200px">
              <Option v-for="item in thingList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
             <div class="extra" style="float: right">
                 <div class="timeBox" v-if="dateFlag == false">
              <DatePicker
                :value="doneData.starttime"
                v-model="doneData.starttime"
                format="yyyy-MM-dd"
                size="default"
                width="auto"
                type="date"
                placeholder="完成时间"
                @on-change="doneData.starttime=$event"
                style="marginRight: 4px;"
              ></DatePicker>至
              <DatePicker
                :value="doneData.endtime"
                v-model="doneData.endtime"
                format="yyyy-MM-dd"
                size="default"
                width="auto"
                type="date"
                placeholder="完成时间"
                @on-change="doneData.endtime=$event"
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
              v-if="dateFlag == true"
              type="primary"
              size="default"
              icon="ios-search"
              @click="searchTodo"
            >搜索</Button>
            <Button
              v-if="dateFlag == false"
              type="primary"
              size="default"
              icon="ios-search"
              @click="searchDone"
            >搜索</Button>
             </div>
            <div class="noData" v-if="doneList.length==0">
              <!-- <img src="./no-data.png"> -->
               <span>暂无事项</span>
            </div>
            <ul class="list" v-else>
              <Card v-for="(item,index) in doneList" :key="index" style="margin:20px 0;">
                <div class="content">
                  <h4>
                    <span class="title">{{item.backlogTitle}}</span>
                    <span class="name">发起人：{{item.backlogInitiator}}</span>
                  </h4>
                </div>
              </Card>
            </ul>
            <div class="tableFooter">
              <Page
                v-if="doneData.total!==0"
                :total="doneData.total"
                :page-size="doneData.pageSize"
                :current="doneData.currPage"
                size="small"
                show-total
                show-sizer
                show-elevator
                @on-change="(currPage)=>{doneData.currPage=currPage;getDoneData()}"
                @on-page-size-change="(pageSize)=>{doneData.pageSize=pageSize;getDoneData()}"
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Content>
  </Layout>
</template>

<script>
import { baseUrl } from '@/api/base.js'
import CountDown from '@/view/public/task/components/count-down'
export default {
  name: 'user',
  components: {
    CountDown
  },
  data () {
    return {
      /**
       * todoData 待办事项参数
       * doneData 已完成事项参数
       * currentTab 当前tab 0为待办事项 1为已完成事项
       * dateFlag 显示时间选择框和搜索按钮开关 true 为发起时间 false 为完成时间
       * searchKeyword 搜索事件类型或发起人
       * todoList 待办事项数据
       * doneList 已完成事项数据
       * route 详情页路由
       * waitHandel 待办事项条数
       **/
      things: '0',
      thingList: [
        {
          value: '0',
          label: '全部'
        },
        {
          value: '1',
          label: '定岗定编'
        },
        {
          value: '2',
          label: '任务系统'
        }
      ],
      waitHandel: '0',
      todoData: {
        starttime: '',
        endtime: '',
        total: 0,
        pageSize: 20,
        currPage: 1
      },
      doneData: {
        starttime: '',
        endtime: '',
        total: 0,
        pageSize: 20,
        currPage: 1
      },
      route: '',
      currentTab: '0',
      dateFlag: true,
      searchKeyword: '',
      todoList: [],
      doneList: []
    }
  },
  mounted () {
    this.getTodoData()
  },
  // watch: {
  //   waitHandel (newV) {
  //     sessionStorage.setItem('waitHandel', newV)
  //   }
  // },
  methods: {
    TodoCatalogs (id) {
      let sendTodoData = {
        status: this.currentTab,
        starttime: this.todoData.starttime,
        endtime: this.todoData.endtime,
        fuzzyCondition: this.searchKeyword,
        currPage: this.todoData.currPage || 1,
        pageSize: this.todoData.pageSize,
        type: id
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
    downCatalogs (id) {
      let sendDoneData = {
        status: this.currentTab,
        starttime: this.doneData.starttime,
        endtime: this.doneData.endtime,
        fuzzyCondition: this.searchKeyword,
        currPage: this.doneData.currPage,
        pageSize: this.doneData.pageSize,
        type: id
      }
      this.$axios({
        url: baseUrl + '/backlog/query',
        data: $qs.stringify(sendDoneData),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.doneData.total = resp.data.content.totalCount
            this.doneList = resp.data.content.pageContent
          } else if (resp.data.code === 10001) {
            this.doneData.total = 0

            this.doneList = []
          // 屏蔽查无数据
          // this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    getTodoData (currPage, pageSize) {
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
        status: this.currentTab,
        starttime: this.todoData.starttime,
        endtime: this.todoData.endtime,
        fuzzyCondition: this.searchKeyword,
        // currPage: this.todoData.currPage,
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
            // bus.$emit('waitHandel', this.waitHandel)
            // sessionStorage.setItem('waitHandel', this.waitHandel)
          } else {
            this.todoData.total = 0
            // 屏蔽查无数据
            // this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    getDoneData (currPage) {
      /**
       * 获取已完成事项数据
       * code 10000为正常
       * 传参{
       *  同待办事项
       * }
       * 回参{
       *   doneData.total 待办事项数据总数
       *   doneList 待办事项数据列表
       *   backlogTitle 事项名称
       *   backlogCreateTime 完成时间
       *   backlogInitiator 发起人
       *   objectId 当前数据的ID
       * }
       **/
      let sendDoneData = {
        status: this.currentTab,
        starttime: this.doneData.starttime,
        endtime: this.doneData.endtime,
        fuzzyCondition: this.searchKeyword,
        currPage: this.doneData.currPage,
        pageSize: this.doneData.pageSize
      }
      this.$axios({
        url: baseUrl + '/backlog/query',
        data: $qs.stringify(sendDoneData),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.doneData.total = resp.data.content.totalCount
            this.doneList = resp.data.content.pageContent
          } else {
            this.doneData.total = 0
            // 屏蔽查无数据
            // this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    searchTodo () {
      this.getTodoData()
    },
    searchDone () {
      this.getDoneData()
    },
    /**
     * 切换待办事项与已完成事项
     * 获取当前tab 0为待办事项 1为已完成事项
     * dateFlag 发起时间与完成时间开关 true 为发起时间
     **/
    changeTab (name) {
      this.things = '0'
      this.handleClear()
      if (name === '0') {
        this.dateFlag = true
        this.getTodoData()
      } else {
        this.dateFlag = false
        this.getDoneData()
      }
    },
    /**
     * 跳转到对应详情页
     * route 跳转到的路由
     * backlogId 待办事项或已完成事项的ID
     **/
    toDetail (route, objectId, id) {
      console.log(route)
      if (route === 'addUser') {
        this.$router.push({
          name: route,
          query: {
            type: 'tbc',
            id: objectId,
            backlogId: id
          }
        })
      } else if (route.startsWith('task')) { // 任务审批
        this.$router.push(route)
      } else if (route.startsWith('approval')) { // 销分审批
        this.$router.push(route)
      } else if (route.startsWith('detailChannel')) { // 渠道匹配产品
        this.$router.push({
          name: route,
          query: {
            productChannelId: objectId
          }
        })
      } else if (route.startsWith('detailProduct')) { // 产品匹配渠道
        this.$router.push({
          name: route,
          query: {
            productCompanyId: objectId
          }
        })
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
    },
    handleClear () {
      this.searchKeyword = ''
    },
    // 待办事项切换当前页
    changeTodoCurrentPage (currPage) {
      this.getTodoData(currPage, sessionStorage.pageSize)
    },
    // 待办事项切换当前展示条数
    changeTodoPageSize (pageSize) {
      sessionStorage.pageSize = pageSize
      this.getTodoData(this.todoData.currPage, pageSize)
    },
    changeDoneCurrentPage (currPage) {
      this.getDoneData(currPage)
    }
  }
  // beforeRouteLeave: function (to, from, next) {
  //   this.toDetail();
  //   console.log('路由即将跳转')
  // }
}
</script>

<style>
ul,
li,
ol {
  list-style: none;
}

.timeBox {
  display: inline;
}

#user {
  /* padding: 10px 50px; */
}

/* 个人主页待办事项不够多的时候，日期选择框会被overflow-hidden，原因在于在于ivu-tabs需要被撑开 */
#user .ivu-tabs {
  /* min-height: 300px; */
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
.content>h4{
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
.content .name{
  align-self: flex-end;
  flex: 1;
  text-align: end;
}
@media screen and (max-width: 980px) {
  #user .ivu-tabs-nav-container{
    width: 100%;
    margin-top: 55px;
  }
  .extra{
    float: right;
    display: flex;
    height: 32px;
    position: relative;
    top: 53px;
  }
  .extra .timeBox{
    flex: 10;
  }
  .extra .inp{
    flex: 3;
  }
  .extra button{
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
.noData {
  /* position: relative;
  top: 5%;
  left: 29%; */
    text-align: center;
    font-size: 14px;
    margin-top: 30px;
    color: #707070;
}

</style>
