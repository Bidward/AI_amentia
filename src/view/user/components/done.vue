<template>
    <div class="extra">
        <div style="float:right">
        <div class="timeBox">
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
        <Button type="primary" size="default" icon="ios-search" @click="searchDone" class="search">搜索</Button>
        </div>
        <div style="clear:both"></div>
        <div class="noData" v-if="doneList.length==0">
            <span>暂无事项</span>
        </div>
        <ul class="list" v-else>
            <Card v-for="(item,index) in doneList" :key="index" style="margin:15px 0;">
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
                show-elevator
                show-sizer
                @on-change="(currPage)=>{doneData.currPage=currPage;getDoneData()}"
                @on-page-size-change="(pageSize)=>{doneData.pageSize=pageSize;getDoneData()}"
            />
        </div>
    </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
export default {
  name: 'done',
  props: {
    sonTabName: {
      type: String
    }
  },
  data () {
    return {
      things: '0',
      waitHandel: '0',
      doneData: {
        starttime: '',
        endtime: '',
        total: 0,
        pageSize: 20,
        currPage: 1
      },
      route: '',
      currentTab: '0',
      searchKeyword: '',
      doneList: []
    }
  },
  watch: {
    sonTabName: {
      handler () {
        this.getDoneData()
      },
      immediate: true
    }
  },
  methods: {
    getDoneData () {
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
        type: this.sonTabName,
        status: 1,
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
    // 搜索按钮
    searchDone () {
      this.doneList = []
      this.getDoneData()
      this.searchKeyword = ''
      this.doneData.starttime = ''
      this.doneData.endtime = ''
    }
  }
}
</script>
<style  scoped>
.extra {
    padding: 15px 0 0 0;
}
.search{
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
