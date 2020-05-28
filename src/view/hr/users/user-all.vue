<template>
<div>
    <div class="level-three">
        <Button v-if="permiss.create" type="primary" @click="handleAddUser()">新增</Button>
        <Button v-if="permiss.export" @click="exportExcel()">导出</Button>
        <div class="searchbar">
            <Input @on-search="getTableData()" v-model="variableObject.fuzzyCondition" placeholder="搜索姓名、部门、职位名称"  search clearable  />
            <Button icon="ios-loading" @click="refresh()"></Button>
        </div>
    </div>
    <Table border :loading="loading" :columns="allTableHeader" :data="allTableData">
        <template slot-scope="{ row, index }" slot="option">
            <Button v-if="permiss.permission" type="primary"  @click="handleRoleSet(row)">角色设置</Button>
            <Button v-if="row.userStatusName === '在职'&& permiss.departure"  type="error"  @click="handleDimission(row)">离职</Button>
            <Button v-if="row.userStatusName === '离职'&& permiss.restore"  type="primary"  @click="handleRecover(row)">复职</Button>
            <Button v-if="permiss.retrie" @click="handleView(row)">查看</Button>
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
    <recover-modal :recoverRowData='recoverRowData' v-if="showRecoverModal" :show.sync="showRecoverModal" @updata-list="getTableData"></recover-modal>
    <role-permission :rowData='rowData' v-if="showPermission" :show.sync="showPermission" @updata-list="getTableData"></role-permission>
</div>
</template>

<script>
import mixins from './mixins'
import rolePermission from './component/role-permission'
import recoverModal from './component/recover-modal'
export default {
  name: 'userAll',
  mixins: [ mixins ],
  components: {
    rolePermission,
    recoverModal
  },
  data () {
    return {
      showRecoverModal: false,
      recoverRowData: {},
      rowData: {},
      showPermission: false,
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
          title: '角色',
          key: 'roleName',
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
                  v-model={this.variableObject.roleId}
                >
                  {this.headerSelection.role.map(item => {
                    return <Option value={item.roleId} label={item.roleName}/>
                  })}
                </Select>
              </Poptip>
            </span>)
          }
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
          title: '状态',
          key: 'userStatusName',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'option',
          width: 230,
          align: 'center'
        }]
    }
  },
  mounted () {
    this.getTableData()
    this.getHeaderListData()
  },
  methods: {
    handleRoleSet (row) {
      this.rowData = row
      this.showPermission = true
    },
    handleRecover (row) {
      this.recoverRowData = row
      this.showRecoverModal = true
    }

  }
}
</script>

<style lang="" scoped>

</style>
