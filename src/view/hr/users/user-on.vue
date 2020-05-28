<template>
<div>
    <div class="level-three">
        <Button class="btns add" v-if="permiss.create" type="primary" @click="handleAddUser()">新增</Button>
        <Button @click="exportExcel()"  v-if="permiss.export">导出</Button>
        <div class="searchbar">
            <Input @on-search="getTableData()" v-model="variableObject.fuzzyCondition" placeholder="搜索姓名、部门、职位名称"  search clearable  />
            <Button icon="ios-loading" @click="refresh()"></Button>
        </div>
    </div>
    <Table border ref="selection" @on-selection-change="selectChange" :loading="loading" :columns="allTableHeader" :data="allTableData">
        <template slot-scope="{ row, index }" slot="option">
            <Button v-if="permiss.permission" class="btns" type="primary" @click="handleRoleSet(row)">角色设置</Button>
            <Button class="btns" type="error" v-if="permiss.departure" @click="handleDimission(row)">离职</Button>
            <Button class="btns" v-if="permiss.retrie" @click="handleView(row)">查看</Button>
        </template>
    </Table>
    <div class="tableFooter">
        <Button @click="handleTransferPosition()" v-if="permiss.transfer">职位调动</Button>
        <Page
        :total="totalCount"
        :page-size="variableObject.pageSize"
        :current="variableObject.currPage" size="small" show-total show-sizer show-elevator
        @on-change="(currPage)=>{variableObject.currPage=currPage;getTableData()}"
        @on-page-size-change="(pageSize)=>{variableObject.pageSize=pageSize;getTableData()}" />
    </div>
    <Modal v-model="transferPositionModal" title="职位调动" @on-ok="saveTransferPosition">
        <span class="title-name">调动项</span>
        <div v-for="(item,index) in user.transferPositions" :key="index" style="padding:20px">
            <span style="position: relative; bottom: 10px;">{{item.nickname}}</span>
            <Row>
                <Col span="8">原部门：{{item.deptName}}</Col>
                <Col span="4" offset="2">调动后部门：</Col>
                <Col span="10" style="margin-bottom: 19px;margin-top: -6px;">
                    <Select filterable clearable v-model="user.transferPositions[index].deptId" placeholder="请选择部门" @on-change="getPositionByDeptId(index,user.transferPositions[index])">
                        <Option v-for="(item,index) in headerSelection.deptTree" :value="item.id" :id="item.id" :key="index">{{item.title}}</Option>
                    </Select>
                </Col>
            </Row>
            <Row>
                <Col span="8">原职位：{{item.positionName}}</Col>
                <Col span="4" offset="2">调动后职位：</Col>
                <Col span="10" style="margin-bottom: 19px;margin-top: -6px;">
                    <Select filterable clearable v-model="user.transferPositions[index].positionId" placeholder="请选择职位">
                        <Option v-for="(item,index) in positionList[index]" :value="item.positionId" :key="index">{{ item.positionName }}</Option>
                    </Select>
                </Col>
            </Row>
        </div>
    </Modal>
    <role-permission :rowData='rowData' v-if="showPermission" :show.sync="showPermission"  @updata-list="getTableData"></role-permission>

</div>
</template>

<script>
import mixins from './mixins'
import { baseUrl } from '@/api/base.js'
import rolePermission from './component/role-permission'
export default {
  name: 'userOn',
  mixins: [ mixins ],
  components: {
    rolePermission
  },
  data () {
    return {
      transferPositionsList: [],
      positionList: [],
      user: {
        transferPositions: [
          {
            id: '',
            deptId: '',
            positionId: ''
          }]
      },
      transferPositionModal: false, // 职位调动弹出框
      checked: [],
      rowData: {},
      showPermission: false,
      variableObject: {
        userStatus: '0'
      },
      allTableHeader: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
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
    // 角色设置
    handleRoleSet (row) {
      this.rowData = row
      this.showPermission = true
    },
    selectChange (rows) {
      this.checked = rows.map(e => {
        return e.id
      })
    },
    handleTransferPosition () {
      let ids = this.checked
      if (ids.length === 0) {
        this.$Message.error('未选择')
        return
      }
      this.$axios({
        url: baseUrl + '/user/getTransferPositionList',
        method: 'post',
        data: ids
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.user.transferPositions = res.data.content
            this.user.transferPositions.map((e, index) => {
              e.id = ids[index]
            })
            this.transferPositionModal = true
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 根据部门获取职位
    getPositionByDeptId (index, key) {
      this.$axios({
        url: baseUrl + '/structure/findByPosition',
        data: $qs.stringify({
          deptId: key.deptId
        }),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.$set(this.positionList, index, resp.data.content)
            this.positionList[index] = resp.data.content
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('getPositionByDeptId', err)
        })
    },
    // 保存职位变动
    saveTransferPosition () {
      let sendData = {
        user: this.user
      }
      this.$axios({
        url: baseUrl + '/user/transferPosition',
        data: sendData,
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.$Message.info(resp.data.msg)
            this.getTableData()
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('getPositionByDeptId', err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.title-name{
    border-left: 2px solid #19aa8d;
    padding-left: 10px;
    font-size: 13px;
    margin: 10px 0px 30px 0px;
}
</style>
