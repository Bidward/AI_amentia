<template>
  <div class="viewWrapper">
    <div class="tableHeader-only">
      <Button class="btns add" type="primary" @click="addMsg" v-if="permissionCreate">新增消息</Button>
      <div class="searchbar">
        <Input
          placeholder="搜索类型"
          @on-search="detailSearch()"
          search
          clearable
          v-model="searchHeader.text"
          style="width:200px;margin-right:5px;"
        ></Input>
        <Button icon="ios-loading" @click="reload()"></Button>
      </div>
    </div>
    <Table
        border :columns="tableHeader"
        :data="tableContent"
        @on-sort-change="sortChange"
        @on-selection-change="selectChange">
      <template slot-scope="{ row, index }" slot="detailsContent">
        <p
          :title="row.detailsContent"
          @click="showDetail(row)"
          class="reason"
        >{{row.detailsContent}}</p>
      </template>
      <template slot-scope="{ row, index }" slot="unreadnumber">
        <p v-if="row.unreadnumber===0">{{row.unreadnumber}}</p>
        <p v-else style="color:red" class="pointer" @click="toUnRead(row)">{{row.unreadnumber}}</p>
      </template>
      <template slot-scope="{ row, index }" slot="edit">
        <Button
          class="btns"
          :disabled="row.detailsReadStatus==='未读'"
          type="error"
          @click="del(row)"
          v-if="permissionDelete"
        >删除</Button>
        <Button class="btns" @click="showDetail(row)">详情</Button>
      </template>
    </Table>
    <Modal
      @on-ok="addStation()"
      v-model="showAdd"
      :mask-closable="false"
      title="新增"
      :loading="loading"
    >
      <addStation v-if="showAdd" :incumbencyTbUser="employees" ref="addStation"></addStation>
    </Modal>
    <div class="clearfix tableFooter">
      <Button type="error" class="btns" @click="delMore" v-if="permissionDelete">批量删除</Button>
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
import { mapMutations } from 'vuex'
import addStation from './addStation'
import moment from 'moment'
import { baseUrl } from '@/api/base.js'
import { Track } from '@/libs/track'
const track = new Track('综合模块/站内信/站内信')

export default {
  name: 'station',
  inject: ['app'],
  components: {
    addStation
  },
  data () {
    return {
      permissionCreate: false, // 新增按钮权限
      permissionDelete: false, // 删除按钮权限
      showAdd: false,
      totalCount: 80,
      loading: true,
      checked: [],
      searchHeader: {
        sendingTime: '', // 发送时间
        timeSort: '', // 时间排序1。正常 2.倒叙
        detailsType: '', // 消息类型1.通知 2.消息
        detailsContent: '', // 内容
        detailsStatus: '', // 1.已读2.未读
        statusSort: '', // 状态排序 1正常2倒叙
        unreadnumber: '', // 未读人数
        pageSize: 20, // 页面大小
        currPage: 1, // 当前页
        text: '' // 模糊搜索框
      },
      tableHeader: [
        { type: 'selection', width: 60, align: 'center' },
        { title: '序号', type: 'index', width: 60, align: 'center' },
        {
          title: '日期',
          key: 'detailsSendingTime',
          width: 100,
          sortable: 'custom',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" class={this.searchHeader.sendingTime ? 'on' : ''} />
                  </span>
                  <div slot="content">
                    <div>
                      <DatePicker
                        v-on:on-ok={() => {
                          this.detailSearch()
                        }}
                        v-on:on-clear={() => {
                          this.detailSearch()
                        }}
                        type="date"
                        v-model={this.searchHeader.sendingTime}
                        confirm
                        placement="bottom-start"
                        placeholder="输入时间"
                      />
                    </div>
                  </div>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: ' 类型',
          key: 'detailsReadType',
          align: 'center',
          minWidth: 100,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" class={this.searchHeader.detailsType ? 'on' : ''} />
                  </span>
                  <Select
                    slot="content"
                    clearable
                    v-on:on-change={() => {
                      this.detailSearch()
                    }}
                    v-model={this.searchHeader.detailsType}
                  >
                    <Option value={1}>通知</Option>
                    <Option value={2}>消息</Option>
                  </Select>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '内容',
          minWidth: 368,
          // slot: 'detailsContent',
          key: 'detailsContent',
          align: 'center',
          tooltip: true,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" class={this.searchHeader.detailsContent ? 'on' : ''} />
                  </span>
                  <Input
                    clearable
                    slot="content"
                    search
                    v-on:on-search={() => {
                      this.detailSearch()
                    }}
                    v-on:on-clear={() => {
                      this.detailSearch()
                    }}
                    v-model={this.searchHeader.detailsContent}
                  />
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '状态',
          key: 'detailsReadStatus',
          align: 'center',
          sortable: 'custom',
          minWidth: 120,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" class={this.searchHeader.detailsStatus ? 'on' : ''} />
                  </span>
                  <div slot="content">
                    <div>
                      <Select
                        slot="content"
                        clearable
                        v-on:on-change={() => {
                          this.detailSearch()
                        }}
                        v-model={this.searchHeader.detailsStatus}
                      >
                        <Option value={1}>已读</Option>
                        <Option value={2}>未读</Option>
                      </Select>
                    </div>
                  </div>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '未读人数',
          width: 100,
          slot: 'unreadnumber',
          align: 'center'
        },
        { title: '操作', minWidth: 180, slot: 'edit', align: 'center' }
      ],
      tableContent: []
    //   incumbencyTbUser: []
    }
  },
  beforeCreate () {
    track.start()
  },
  mounted () {
    // this.getIncumbencyTbUser()
    this.detailSearch()
    this.getPermission()
  },
  computed: {
    employees () { // 在职人员
      return this.app.employees
    }
  },
  methods: {
    getPermission () {
      this.permissionCreate = this.$store.state.user.userpermission.reward.create
      this.permissionDelete = this.$store.state.user.userpermission.reward.delete
    },
    ...mapMutations(['handleShowDrawer', 'setShowType']),
    selectChange (rows) {
      this.checked = rows.map(e => {
        return e.stationId
      })
    },
    // 查看更多
    showDetail (row) {
      this.handleShowDrawer()
      bus.$emit('stationDetail', row)
      this.setShowType({ type: row.detailsReadType, isList: false })
    },
    // 排序
    sortChange (column) {
      // 降序  "desc"
      let key = column.key
      let desc = column.order
      if (key === 'detailsSendingTime') {
        // 时间排序
        if (desc === 'desc') {
          this.searchHeader.timeSort = '2'
        } else if (desc === 'asc') {
          this.searchHeader.timeSort = '1'
        } else {
          this.searchHeader.timeSort = ''
        }
      } else if (key === 'detailsReadStatus') {
        // 状态排序
        console.log('状态排序')
        if (desc === 'desc') {
          this.searchHeader.statusSort = '1'
        } else if (desc === 'asc') {
          this.searchHeader.statusSort = '2'
        } else {
          this.searchHeader.statusSort = ''
        }
      }
      // if (desc === 'desc') {
      //     this.searchHeader.timeSort = '1'
      // } else if (desc === 'asc') {
      //     this.searchHeader.timeSort = '2'
      // } else {
      //     this.searchHeader.timeSort = ''
      // }
      this.detailSearch()
    },
    // 搜索分页
    detailSearch () {
      let {
        sendingTime,
        timeSort,
        detailsType,
        detailsContent,
        detailsStatus,
        pageSize,
        currPage,
        statusSort,
        text
      } = this.searchHeader
      let sendData = {}
      sendingTime = sendingTime ? moment(sendingTime).format('YYYY-MM-DD') : ''
      if (text) {
        sendData.text = text
        this.clearSearchHeader(text)
      } else {
        sendData = {
          sendingTime,
          timeSort,
          detailsType,
          detailsContent,
          detailsStatus,
          statusSort,
          pageSize,
          currPage
        }
      }
      sendData.pageSize = pageSize
      sendData.currPage = currPage
      this.$axios({
        url: baseUrl + '/station/findStationEmailByDTO',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            let content = res.data.content
            this.totalCount = content.totalCount
            this.searchHeader.pageSize = content.pageSize
            this.currPage = content.currPage
            // 如果未读，添加单选框禁止选中的属性
            let tableContent = content.pageContent.map(e => {
              if (e.detailsReadStatus === '未读') {
                e._disabled = true
              }
              return e
            })
            this.tableContent = tableContent
            this.$nextTick(() => {
              track.end()
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 新增站内信
    addStation () {
      let form = this.$refs.addStation.$refs.addStation
      form.validate(valid => {
        // 表单验证不通过
        if (!valid) {
          this.$Message.error('有必填项未填')
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
          // 表单验证通过
        } else {
          let sendData = this.$refs.addStation.addStation
          sendData.reminderTimeList = sendData.reminderTimeList.map(e => {
            if (e) {
              return moment(e).format('YYYY-MM-DD HH:mm:ss')
            } else {
              return undefined
            }
          })
          this.$axios({
            url: baseUrl + '/station/addStationEmail',
            method: 'post',
            data: sendData
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.showAdd = false
                this.$Message.success(res.data.msg)
              } else {
                this.$Message.error(res.data.msg)
              }
              this.loading = false
              this.$nextTick(() => {
                this.loading = true
              })
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    // 跳转到未读人员列表的
    toUnRead (row) {
      this.$router.push({ name: 'unreadList', query: { id: row.detailsId } })
    },
    // 新增站内信
    addMsg () {
      this.showAdd = true
    },
    // 删除某一条消息
    del (row) {
      let stationId = row.stationId
      let data = [stationId]
      this.$Modal.confirm({
        title: '删除吗?',
        onOk: () => {
          this.$axios({
            url: baseUrl + '/station/updateIsDeleted',
            method: 'post',
            data: data
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.$Message.success(res.data.msg)
                this.detailSearch()
              } else {
                this.$Message.error(res.data.msg)
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    // 批量删除
    delMore () {
      let ids = this.checked
      if (ids.length === 0) {
        this.$Message.error('请选择要删除的项目')
        return false
      }
      this.$Modal.confirm({
        title: '删除吗?',
        onOk: () => {
          this.$axios({
            url: baseUrl + '/station/updateIsDeleted',
            method: 'post',
            data: ids
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.$Message.success(res.data.msg)
                this.detailSearch()
              } else {
                this.$Message.error(res.data.msg)
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    // 清空表头搜索
    clearSearchHeader (text) {
      let { pageSize, currPage } = this.searchHeader
      this.searchHeader = {
        sendingTime: '',
        timeSort: '',
        content: '',
        detailsStatus: '',
        pageSize: pageSize,
        currPage: currPage,
        text: text
      }
    },
    // 重置
    reload () {
      this.clearSearchHeader()
      this.detailSearch()
    }
    // 获取在职转正人员
    // getIncumbencyTbUser () {
    //   this.$axios({
    //     url: baseUrl + '/user/getIncumbencyTbUser',
    //     method: 'post'
    //   })
    //     .then(res => {
    //       if (res.data.code === 10000) {
    //         this.incumbencyTbUser = res.data.content
    //       } else {
    //         this.$Message.error(res.data.msg)
    //       }
    //     })
    //     .catch(err => {
    //       console.error(err)
    //     })
    // }
  }
}
</script>
