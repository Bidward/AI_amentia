<template>
<div>
    <div class="level-three">
        <div class="searchbar">
            <Input  @on-clear="getTableData()" @on-search="getTableData()" v-model="variableObject.searchContent" placeholder="输入关键字..." search clearable />
            <Button icon="ios-loading" @click="refresh()"></Button>
            <TableHeaderSetting
              :totalTableHeader="allTableHeader"
              :tableHeader.sync="tableHeader"
              key="aboutmorningTabelHeaders"
              localKey="aboutmorningTabelHeaders"
              :defaultList="defaultList"
            />
        </div>
    </div>
    <Table border :loading="loading" :columns="tableHeader" :data="allTableData">
        <template slot-scope="{ row, index }" slot="option">
            <Button class="btns" v-if="permiss.retrie" @click="handleView(row)">详情</Button>
        </template>
    </Table>
    <div class="tableFooter">
        <Page :total="totalCount" :page-size="variableObject.pageSize" :current="variableObject.currPage" size="small" show-total show-sizer show-elevator
        @on-change="changeCurrentPage"
        @on-page-size-change="changePageSize" />
    </div>
</div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
import morningMixins from './morning-mixins'
import moment from 'moment'
import TableHeaderSetting from '_c/table-header-setting'

export default {
  name: 'aboutMorning',
  mixins: [morningMixins],
  components: {
    TableHeaderSetting
  },
  data () {
    return {
      variableObject: {
        currPage: 1,
        pageSize: 20,
        subject: '',
        recorderId: '',
        startTime: '',
        endTime: '',
        searchContent: '',
        isRead: ''
      },
      allTableData: [],
      timeRange: [null, null],
      totalCount: 0,
      tableHeader: [],
      defaultList: [
        'index',
        'time',
        'subject',
        'comment',
        'read',
        'recorder',
        'option'
      ],
      allTableHeader: [
        {
          title: '序号',
          type: 'index',
          key: 'index',
          align: 'center',
          alwaysShow: true
        },
        {
          title: '时间',
          key: 'time',
          minWidth: 80,
          align: 'center',
          sortable: true,
          renderHeader: (h, params) => {
            return (<span>
              <Poptip transfer={true} placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <Icon type="md-search" size="14"/>
                </span>
                <div slot="content">
                  <div>
                    <DatePicker
                      onOn-ok={() => {
                        this.getTableData()
                      }}
                      onOn-clear={() => {
                        this.timeRange = [null, null]
                        this.getTableData()
                      }}
                      type="daterange"
                      v-model={this.timeRange}
                      confirm
                      clearable
                      placement="bottom-start"
                      placeholder="输入时间"
                    />
                  </div>
                </div>
              </Poptip>
            </span>)
          }
        },
        {
          title: '主题',
          key: 'subject',
          minWidth: 80,
          align: 'center',
          sortable: true,
          renderHeader: (h, params) => {
            return (<span>
              <Poptip transfer={true} placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <Icon type="md-search" size="14"/>
                </span>
                <div slot="content">
                  <Select
                    slot="content"
                    filterable
                    clearable
                    onOn-change={() => {
                      this.getTableData()
                    }}
                    v-model={this.variableObject.subject}
                  >
                    {this.subjectList.map(person => {
                      return <Option value={person} label={person}/>
                    })}
                  </Select>
                </div>
              </Poptip>
            </span>)
          },
          render: (h, params) => {
            return (
              <span class="taskTitle" style="cursor: pointer">
                <a onClick={() => this.checkDetail(params.row)}>{params.row.subject}</a>
              </span>
            )
          }
        },
        {
          title: '评论',
          key: 'comment',
          minWidth: 80,
          align: 'center',
          sortable: true
        },
        {
          title: '状态',
          key: 'read',
          minWidth: 80,
          align: 'center',
          sortable: true,
          renderHeader: (h, params) => {
            return (<span>
              <Poptip transfer={true} placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <Icon type="md-search" size="14"/>
                </span>
                <Select
                  slot="content"
                  filterable
                  clearable
                  onOn-change={() => {
                    this.getTableData()
                  }}
                  onOn-clear={() => {
                    this.getTableData()
                  }}
                  v-model={this.variableObject.isRead}
                >
                  <Option value='0' label='未读'/>
                  <Option value='1' label='已读'/>
                </Select>
              </Poptip>
            </span>)
          }
        },
        {
          title: '记录员',
          key: 'recorder',
          minWidth: 80,
          align: 'center',
          sortable: true,
          renderHeader: (h, params) => {
            return (<span>
              <Poptip transfer={true} placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <Icon type="md-search" size="14"/>
                </span>
                <Select
                  slot="content"
                  filterable
                  clearable
                  onOn-change={() => {
                    this.getTableData()
                  }}
                  v-model={this.variableObject.recorderId}
                >
                  {this.employees.map(person => {
                    return <Option value={person.id} label={person.nickname}/>
                  })}
                </Select>
              </Poptip>
            </span>)
          }
        },
        {
          title: '操作',
          slot: 'option',
          key: 'option',
          width: 230,
          align: 'center',
          alwaysShow: true
        }]
    }
  },
  mounted () {
    this.getTableData()
    this.getSubject()
  },
  methods: {
    getTableData (currPage, pageSize) {
      let _v = this.variableObject
      let sendData = {
        subject: _v.subject,
        recorderId: _v.recorderId,
        currPage: currPage,
        pageSize: pageSize || this.variableObject.pageSize,
        isRead: _v.isRead
      }
      if (this.timeRange[0]) {
        sendData.startTime = moment(this.timeRange[0]).format('YYYY-MM-DD')
        sendData.endTime = moment(this.timeRange[1]).format('YYYY-MM-DD')
      }
      if (_v.searchContent) {
        sendData.searchContent = _v.searchContent.trim()
      }
      this.$axios({
        url: baseUrl + '/morning/getMyRelateList',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.allTableData = res.data.content.pageContent
          this.totalCount = res.data.content.totalCount
          this.variableObject.currPage = res.data.content.currPage
          this.variableObject.pageSize = res.data.content.pageSize
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 页码改变
    changeCurrentPage (currPage) {
      this.getTableData(currPage, sessionStorage.pageSize)
    },
    // 切换每页条数
    changePageSize (pageSize) {
      sessionStorage.pageSize = pageSize
      this.getTableData(this.variableObject.currPage, pageSize)
    },
    checkDetail (row) {
      this.$router.push({ name: 'detailMorning', query: { id: row.id } })
    },
    refresh (searchContent) {
      let { pageSize, currentPage } = this.variableObject
      this.variableObject = {
        subject: '',
        recorderId: '',
        startTime: '',
        endTime: '',
        isRead: '',
        searchContent: searchContent,
        pageSize,
        currentPage
      }
      this.timeRange = [null, null]
      this.getTableData()
    },
    // 详情
    handleView (row) {
      this.$router.push({
        name: 'detailMorning',
        query: {
          id: row.id
        }
      })
    }

  }
}
</script>

<style lang="less" scoped>
.morningSetting {
    color: orange;
    float: left;
    margin: 5px 10px 0px 0px;
    cursor: pointer;
}
</style>
