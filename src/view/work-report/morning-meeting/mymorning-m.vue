<template>
<div>
    <div class="level-three">
        <Button class="btns add" v-if="canAdd" type="primary" @click="handleAdd()">新增</Button>
        <div class="searchbar">
            <Input @on-search="getmyMorningTableData()" @on-clear="getmyMorningTableData()" v-model="variableObject.searchContent" placeholder="输入关键字..."  search clearable  />
            <Button icon="ios-loading" @click="refresh()"></Button>
            <TableHeaderSetting
              :totalTableHeader="allTableHeader"
              :tableHeader.sync="tableHeader"
              key="mymorningTabelHeaders"
              localKey="mymorningTabelHeaders"
              :defaultList="defaultList"
            />
        </div>
    </div>
    <Table border :loading="loading" :columns="tableHeader" :data="allTableData">
        <template slot-scope="{ row, index }" slot="option">
            <Button v-if="row.edit" class="btns" type="primary" @click="handleEdit(row)">编辑</Button>
            <Button class="btns" type="error" v-if="row.edit" @click="handleDelete(row)">删除</Button>
            <Button class="btns" @click="handleView(row)">详情</Button>
        </template>
    </Table>
    <div class="tableFooter">
        <Page
        :total="totalCount"
        :page-size="variableObject.pageSize"
        :current="variableObject.currPage" size="small" show-total show-sizer show-elevator
        @on-change="changeCurrentPage"
        @on-page-size-change="changePageSize"
        />
    </div>
</div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
import morningMixins from './morning-mixins'

import TableHeaderSetting from '_c/table-header-setting'
export default {
  name: 'morningMeeting',
  mixins: [morningMixins],
  components: {
    TableHeaderSetting
  },
  data () {
    return {
      canAdd: false,
      allTableData: [],
      timeRange: [null, null],
      totalCount: 0,
      tableHeader: [],
      defaultList: [
        'index',
        'time',
        'subject',
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
                        this.getmyMorningTableData()
                      }}
                      onOn-clear={() => {
                        this.timeRange = [null, null]
                        this.getmyMorningTableData()
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
                      this.getmyMorningTableData()
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
                    this.getmyMorningTableData()
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
                    this.getmyMorningTableData()
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
    this.getmyMorningTableData()
    this.getSubject()
  },
  methods: {
    // 页码改变
    changeCurrentPage (currPage) {
      this.getmyMorningTableData(currPage, sessionStorage.pageSize)
    },
    // 切换每页条数
    changePageSize (pageSize) {
      sessionStorage.pageSize = pageSize
      this.getmyMorningTableData(this.variableObject.currPage, pageSize)
    },
    checkDetail (row) {
      this.$router.push({ name: 'detailMorning', query: { id: row.id } })
    },
    // 编辑
    handleEdit (row) {
      this.$router.push({
        name: 'editMorning',
        query: {
          id: row.id,
          option: 'edit',
          title: '编辑'
        }
      })
    },
    // 详情
    handleView (row) {
      this.$router.push({
        name: 'detailMorning',
        query: {
          id: row.id
        }
      })
    },
    // 删除
    handleDelete (row) {
      this.$Modal.confirm({
        title: '提醒',
        content: '是否确定删除？',
        onOk: () => {
          this.$axios({
            url: baseUrl + '/morning/deleteMorningMeeting',
            method: 'post',
            data: $qs.stringify({ id: row.id })
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.info(res.data.msg)
              this.getmyMorningTableData()
            } else {
              this.$Message.error(res.data.msg)
            }
          }).catch(err => {
            console.log('err', err)
          })
        },
        onCancel: () => {
          this.$Message.info('Clicked cancel')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
