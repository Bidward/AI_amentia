<template>
<div id="mainWrap" class="viewWrapper">
    <div class="header">
        <DatePicker class="formDistance" :value="starttime" v-model="starttime" format="yyyy-MM-dd" size="default" width="auto" type="date" placeholder="开始时间" @on-change="starttime=$event"></DatePicker> 至：
        <DatePicker class="formDistance" :value="endtime" v-model="endtime" format="yyyy-MM-dd" size="default" width="auto" type="date" placeholder="结束时间" @on-change="endtime=$event"></DatePicker>
        <Select class="formDistance"  v-model="nickname" style="width:200px" filterable clearable placeholder="请选择用户名">
          <Option v-for="item in userList" :value="item" :key="item">{{ item }}</Option>
        </Select>
        <!--
        <tree-select v-if="isShow" class="formDistance" :data="treeData" check-strictly v-model="treeSelected" style="width: 300px;" :expand-all="true" placeholder="请选择菜单" @on-change="handleTreeSelectChange" @on-toggle-expand="handleTreeSelectExpand" @on-check-change="handleTreeSelectCheckChange" @on-select-change="handleTreeSelectClick"></tree-select>
        -->
        <AutoComplete
          v-model="treeSelectedname"
          placeholder="请选择菜单"
          style="width:300px;margin-right:10px;" clearable>
          <div class="demo-auto-complete-item">
              <Tree :data="treeData" @on-select-change="getSelectNode"></Tree>
          </div>
        </AutoComplete>
        <Button type="primary" id="search"  @click="searchLog">搜索</Button>
    </div>
    <div class="mainBody">
        <div class="mainContent">
            <ul class="timeline">
                <li class="active" v-for="item in detailData" :key="item.index">
                    <div>
                        <span class="timelineTag" @click='getDetaillog(item)'>{{item.logtime}}</span>
                        <span class="timelineText" @click='getDetaillog(item)'> {{item.jointString}}</span>
                    </div>
                </li>
            </ul>
            <Modal id="detailmodal" v-model="detailmodal" title="操作详情" @on-ok="ok" okText="关闭" cancelText="" style="width:">
                <ul class="detailtimeline">
                    <li class="active" v-for="item in detaillogData" :key="item.index">
                        <div>
                            <span class="timelineText"> {{item}}</span>
                        </div>
                    </li>
                </ul>
            </Modal>
        </div>
        <div class="tableFooter">
          <Page :total="total" :page-size="pageSize" :current="currPage" size="small" show-total show-sizer show-elevator @on-page-size-change="(pageSize)=>changecurrPage(currPage,pageSize)" @on-change="(current)=>changecurrPage(current,pageSize)" style="float:right;" />
        </div>
    </div>
</div>
</template>

<script>
import TreeSelect from '_c/tree-select'
import { Track } from '@/libs/track'
import {
  baseUrl
} from '@/api/base.js'
const track = new Track('系统设置/操作日志/操作日志')
export default {
  name: 'oplog',
  components: {
    TreeSelect
  },
  data () {
    return {
      isShow: true,
      detaillogData: [],
      detailmodal: false,
      treeSelectedname: '',
      treeSelected: '',
      starttime: '',
      endtime: '',
      nickname: '',
      total: 0,
      pageSize: 40,
      currPage: 1,
      detailData: [],
      userList: [],
      treeData: []
    }
  },
  beforeCreate () {
    track.start()
  },
  mounted () {
    this.getData()
    this.getHeaderData()
  },
  methods: {
    getData () {
      this.$axios({
        url: baseUrl + '/systemlog/listlogs',
        data: $qs.stringify(),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.detailData = resp.data.content.pageContent
            this.total = resp.data.content.totalCount
          } else {
            this.$Message.error(resp.data.msg)
          }
          this.$nextTick(() => {
            track.end()
          })
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    getHeaderData () {
      this.$axios({
        url: baseUrl + '/systemlog/logrender',
        data: $qs.stringify(),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.userList = resp.data.content.nicknames
            this.treeData = resp.data.content.treeData
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    getDetaillog (item) {
      this.detailmodal = true
      let sendData = {
        id: item.id
      }
      this.$axios({
        url: baseUrl + '/systemlog/getcontent',
        data: $qs.stringify(sendData),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.detaillogData = resp.data.content
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    ok () {
      // this.$Message.info('Clicked ok');
    },
    getSelectNode (checkName) {
      this.treeSelectedname = checkName[0].title
      console.log(this.treeSelectedname)
    },
    searchLog () {
      console.log(this.currPage)
      let sendData = {
        starttime: this.starttime,
        endtime: this.endtime,
        nickname: this.nickname,
        menuName: this.treeSelectedname,
        currPage: this.currPage,
        pageSize: this.pageSize
      }
      this.$axios({
        url: baseUrl + '/systemlog/listlogs',
        data: $qs.stringify(sendData, {
          indices: false
        }),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.detailData = resp.data.content.pageContent
            this.total = resp.data.content.totalCount
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    changecurrPage (currPage, pageSize) {
      this.pageSize = pageSize
      let sendData = {
        starttime: this.starttime,
        endtime: this.endtime,
        nickname: this.nickname,
        menuName: this.treeSelectedname,
        currPage: currPage,
        pageSize: this.pageSize
      }
      this.$axios({
        url: baseUrl + '/systemlog/listlogs',
        data: $qs.stringify(sendData),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.detailData = resp.data.content.pageContent
            this.total = resp.data.content.totalCount
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    handleTreeSelectChange (list) {
      // console.log('=-========', list);
    },
    handleTreeSelectExpand (item) {
      // console.log('toggle expand', item);
    }

  }
}
</script>

<style>
*,
:after,
:before {
    webkit-box-sizing: border-box;
    box-sizing: border-box;
}

#mainWrap {
    /* padding: 10px 50px; */
    /* margin: 20px; */
    /* background-color: #fff; */
}

#detailmodal .ivu-btn-primary {
    background-color: #19AA8D !important;
    border-color: #19AA8D !important;
    color: #fff;
}

#detailmodal .ivu-btn-primary:hover {
    background-color: #088f74 !important;
    border-color: #088f74 !important;
    color: #fff;
}

#mainWrap .formDistance {
    margin-right: 10px;
}

#mainWrap .mainBody {
    margin-top: 10px;
}

#mainWrap .mainContent {
    border: 2px solid #19AA8D;
    border-radius: 4px;
    padding: 10px 20px 10px 100px;
    transition: max-height .2s;
    overflow: hidden;
}

#mainWrap .mainContent .timelineTag {
    position: absolute;
    top: 5px;
    left: -75px;
    font-size: 14px;
}

#mainWrap .mainContent .timelineText {
    color: #3C4353;
    margin-left: 87px;
}

.timeline>li {
    position: relative;
    list-style: none;
    cursor: pointer
}

.timeline li {
    cursor: pointer
}

.timeline>li:before,
.timeline>li>div:after {
    position: absolute;
    left: -20px;
    display: block;
    width: 15px;
    height: 15px;
    content: ' ';
    border-radius: 50%
}

.timeline>li:before {
    top: 12px;
    left: -16px;
    z-index: 3;
    width: 7px;
    height: 7px;
    background-color: #cbd0db;
    border: 0;
    border: 1px solid #cbd0db
}

.timeline>li>div:after {
    top: 11px;
    left: 70px;
    z-index: 3;
    width: 9px;
    height: 9px;
    background-color: #19AA8D;
    border-radius: 50%;
    opacity: 0
}

.timeline>li+li:after {
    position: absolute;
    top: -12px;
    bottom: 20px;
    left: 74px;
    z-index: 1;
    display: block;
    content: ' ';
    border-left: 1px solid #8d96adee
}

.timeline>li.active>div:after {
    opacity: 1
}

.timeline>li.active:before {
    top: 8px;
    left: 67px;
    width: 15px;
    height: 15px;
    background-color: rgba(12, 100, 235, .2);
    border: 0
}

.timeline>li>div {
    display: block;
    padding: 5px;
    line-height: 20px
}

#search {
    background-color: #19AA8D;
    border-color: #19AA8D;
    color: #fff;
}

#search:hover {
    background-color: #088f74;
    border-color: #088f74;
    color: #fff;
}

.detailtimeline>li {
    position: relative;
    list-style: none;
    cursor: pointer
}

.detailtimeline li {
    cursor: pointer
}

.detailtimeline>li:before,
.detailtimeline>li>div:after {
    position: absolute;
    left: -20px;
    display: block;
    width: 15px;
    height: 15px;
    content: ' ';
    border-radius: 50%
}

.detailtimeline>li:before {
    top: 12px;
    left: -16px;
    z-index: 3;
    width: 7px;
    height: 7px;
    background-color: #cbd0db;
    border: 0;
    border: 1px solid #cbd0db
}

.detailtimeline>li>div:after {
    top: 11px;
    left: -13px;
    z-index: 3;
    width: 9px;
    height: 9px;
    background-color: #19AA8D;
    border-radius: 50%;
    opacity: 0
}

.detailtimeline>li+li:after {
    position: absolute;
    top: -12px;
    bottom: 20px;
    left: -9px;
    z-index: 1;
    display: block;
    content: ' ';
    border-left: 1px solid #8d96adee
}

.detailtimeline>li.active>div:after {
    opacity: 1
}

.detailtimeline>li.active:before {
    top: 8px;
    width: 15px;
    height: 15px;
    background-color: rgba(12, 100, 235, .2);
    border: 0
}

.detailtimeline>li>div {
    display: block;
    padding: 5px;
    line-height: 20px
}
</style>

<style scoped>
#mainWrap {
    padding: 25px 20px 0;
}
</style>
