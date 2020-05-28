<template>
<div>
    <div class="level-three">
        <Button class="btns" @click="exportExcel()"  v-if="permiss.export">导出</Button>
        <div class="searchbar">
            <Input @on-search="getTableData()" v-model="variableObject.fuzzyCondition" placeholder="搜索姓名、部门、职位名称"  search clearable  />
            <Button icon="ios-loading" @click="refresh()"></Button>
        </div>
    </div>
    <Table border :loading="loading" :columns="allTableHeader" :data="allTableData">
        <template slot-scope="{ row, index }" slot="option">
            <Button class="btns" type="primary" v-if="permiss.restore" @click="handleRecover(row)">复职</Button>
            <Button class="btns" v-if="permiss.retrie" @click="handleView(row)">查看</Button>
        </template>
    </Table>
    <div class="tableFooter">
        <Page
        :total="totalCount"
        :page-size="variableObject.pageSize"
        :current="variableObject.currPage" size="small" show-total show-sizer show-elevator
        @on-change="(currPage)=>{variableObject.currPage=currPage;getTableData()}"
        @on-page-size-change="(pageSize)=>{variableObject.pageSize=pageSize;getTableData()}" />
    </div>
    <recoverModal :recoverRowData='recoverRowData' v-if="showRecoverModal" :show.sync="showRecoverModal" @updataList="getTableData"></recoverModal>
</div>
</template>

<script>
import recoverModal from './component/recover-modal'
import mixins from './mixins'
export default {
  name: 'userOut',
  mixins: [ mixins ],
  components: {
    recoverModal
  },
  data () {
    return {
      userID: '',
      showRecoverModal: false,
      recoverRowData: {},
      variableObject: {
        userStatus: '1'
      },
      leaveTimeRange: [],
      allTableHeader: [
        {
          title: '序号',
          type: 'index',
          align: 'center'
        },
        {
          title: '姓名',
          key: 'nickname',
          minWidth: 80,
          align: 'center',
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
                  v-on:on-change={() => {
                    this.getTableData()
                  }}
                  v-model={this.variableObject.uid}
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
          title: '所属部门',
          key: 'deptFullName',
          minWidth: 80,
          align: 'center',
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
                  style="margin-top: 1px;"
                  v-on:on-change={() => {
                    this.getTableData()
                  }}
                  v-model={this.variableObject.deptId}
                >
                  {this.headerSelection.deptTree.map(item => {
                    return <Option value={item.id} label={item.title}/>
                  })}
                </Select>
              </Poptip>
            </span>)
          }
        },
        {
          title: '职位名称',
          key: 'positionName',
          minWidth: 80,
          align: 'center',
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
                  v-on:on-change={() => {
                    this.getTableData()
                  }}
                  v-model={this.variableObject.positionId}
                >
                  {this.headerSelection.position.map(item => {
                    return <Option value={item.positionId} label={item.positionName}/>
                  })}
                </Select>
              </Poptip>
            </span>)
          }
        },
        {
          title: '职级',
          key: 'rankName',
          minWidth: 80,
          align: 'center',
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
                  v-on:on-change={() => {
                    this.getTableData()
                  }}
                  v-model={this.variableObject.rankId}
                >
                  {this.headerSelection.rank.map(item => {
                    return <Option value={item.rankId} label={item.rankName}/>
                  })}
                </Select>
              </Poptip>
            </span>)
          }
        },
        {
          title: '性别',
          key: 'sex',
          align: 'center',
          minWidth: 30,
          sortable: true
        },
        {
          title: '入职时间',
          key: 'entryDate',
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
                      v-on:on-ok={() => {
                        this.getTableData()
                      }}
                      type="daterange"
                      v-model={this.timeRange}
                      confirm
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
          title: '离职时间',
          key: 'leaveDate',
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
                      v-on:on-ok={() => {
                        this.getTableData()
                      }}
                      type="daterange"
                      v-model={this.leaveTimeRange}
                      confirm
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
          title: '离职原因',
          key: 'leaveReason',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'option',
          width: 230,
          align: 'center'
        }],
      headerSelection: {
        deptTree: [], // 部门的树
        position: [], // 职位
        rank: [], // 职级
        role: []// 角色
      }
    }
  },
  mounted () {
    this.getTableData()
    this.getHeaderListData()
  },
  methods: {
    handleRecover (row) {
      this.recoverRowData = row
      this.showRecoverModal = true
    }

  }
}
</script>

<style lang="" scoped>

</style>
