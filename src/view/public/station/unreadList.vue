<template>
  <div class="pagePadding clearfix">
    <div class="tableHeader clearfix">
      <Button class="searchbar" icon="ios-loading" @click="reload()"></Button>
      <Input
        placeholder="搜索部门人员"
        @on-search="detailSearch()"
        search
        clearable
        v-model="searchHeader.text"
        class="searchbar"
        style="width:200px;margin-right:5px;"
      ></Input>
    </div>
    <Table :columns="tableHeader" :data="tableContent"></Table>
    <div>
      <span>总计:{{totalScore}}人</span>
      <Page
        :total="totalCount"
        :page-size="searchHeader.pageSize"
        :current="searchHeader.currPage"
        size="small"
        show-total
        show-sizer
        show-elevator
        @on-change="(currPage)=>{searchHeader.currPage=currPage;detailSearch()}"
        @on-page-size-change="(pageSize)=>{searchHeader.pageSize=pageSize;detailSearch()}"
        style="float:right;"
      />
    </div>
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
export default {
  name: 'unreadList',
  data () {
    return {
      totalCount: 0,
      totalScore: 0,
      incumbencyTbUser: [],
      deptList: [],
      searchHeader: {
        detailsId: this.$route.query.id,
        pageSize: 20,
        currPage: 1,
        deptId: '', // 部门ID
        uid: '', // 用户id
        text: '' // 模糊搜索
      },
      tableContent: [],
      tableHeader: [
        { title: '序号', type: 'index', width: 60, align: 'center' },
        {
          title: '部门',
          key: 'DeptName',
          renderHeader: (h, params) => {
            return (
              <Poptip placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <i class="ivu-icon ivu-icon-ios-search" />
                </span>
                <Select
                  slot="content"
                  filterable
                  clearable
                  v-on:on-change={() => {
                    this.detailSearch()
                  }}
                  v-model={this.searchHeader.deptId}
                >
                  {this.deptList.map(dept => {
                    return <Option v-model={dept.id}>{dept.title}</Option>
                  })}
                </Select>
              </Poptip>
            )
          }
        },
        {
          title: '人员',
          key: 'nickName',
          renderHeader: (h, params) => {
            return (
              <Poptip placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <i class="ivu-icon ivu-icon-ios-search" />
                </span>
                <Select
                  slot="content"
                  filterable
                  clearable
                  v-on:on-change={() => {
                    this.detailSearch()
                  }}
                  v-model={this.searchHeader.uid}
                >
                  {this.incumbencyTbUser.map(person => {
                    return (
                      <Option v-model={person.id}>{person.nickname}</Option>
                    )
                  })}
                </Select>
              </Poptip>
            )
          }
        }
      ]
    }
  },
  mounted () {
    this.detailSearch()
    this.getDeptList()
    this.getIncumbencyTbUser()
  },
  methods: {
    // 根据id获取以部门分类的未读人数
    detailSearch () {
      let sendData = {}
      let text = this.searchHeader.text
      if (text) {
        sendData.text = text
      } else {
        let { deptId, uid } = this.searchHeader
        sendData = { deptId, uid }
      }
      sendData.detailsId = this.searchHeader.detailsId
      sendData.pageSize = this.searchHeader.pageSize
      sendData.currPage = this.searchHeader.currPage
      this.$axios({
        url: baseUrl + '/station/findUnreadDept',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.tableContent = res.data.content.pageContent
            this.totalCount = res.data.content.totalCount
            this.totalScore = res.data.content.totalScore
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    reload (text) {
      this.searchHeader = {
        detailsId: this.$route.query.id,
        pageSize: 20,
        currPage: 1,
        deptId: '', // 部门ID
        uid: '', // 用户id
        text: text
      }
      this.detailSearch()
    },
    getDeptList () {
      this.$axios({
        url: baseUrl + '/structure/findDeptList',
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.deptList = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    getIncumbencyTbUser () {
      this.$axios({
        url: baseUrl + '/user/getIncumbencyTbUser',
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.incumbencyTbUser = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>
<style lang="less" scoped>
.pagePadding .searchbar {
  float: right;
  margin-bottom: 8px;
}
</style>
