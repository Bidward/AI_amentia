<template>
<div id="mainWrap">
    <!-- <Button type="primary" class="buttonStyle" size="default" style="margin-bottom:10px;">职位配置</Button> -->
    <zk-table ref="table" sum-text="sum" index-text="#" :data="table_data" :columns="columns" :stripe="props.stripe" :border="props.border" :show-header="props.showHeader" :show-row-hover="props.showRowHover" :tree-type="props.treeType" :expand-type="props.expandType" :selection-type="props.selectionType" :is-fold="false">
        <template slot-scope="{ row, index }" slot="action">

            <Button v-if="permissionCreate"
          type="primary"
          class="buttonStyle"
          id="addOne"
          size="default"
          @click="add(row)"
        >新增子部门</Button>

            <Button
          v-if="row.lever!==1 && permissionUpdate"
          type="primary"
          id="edit"
          size="default"
          style="margin-right: 5px"
          @click="edit(row)"
        >编辑</Button>
            <Button v-if="row.lever!==1 && permissionDelet" type="error" id="delet" size="default" @click="remove(row)">删除</Button>
            <div v-if="row.lever!==1 && permissionMove" style="display: inline-block;margin-right:5px;">
                <Button v-if="row.moveUpward===0" class="btn btn-default"  @click="updateOrder(row,index,1)">
            <Icon type="md-arrow-round-up"/>
          </Button>
                <Button v-if="row.moveDown===0" class="btn btn-default"  @click="updateOrder(row,index,2)">
            <Icon type="md-arrow-round-down"/>
          </Button>
            </div>
        </template>
    </zk-table>
    <Modal :mask-closable="false" class="modal" v-model="showAddModal" @on-ok="insertChildDept" :title="modalTitle">
        <Form :label-width="130">
            <FormItem>
                <p slot="label">
                    <span style="color:red">*</span>名称：
                </p>
                <Input v-model="deptName" placeholder="名称"></Input>
            </FormItem>
            <FormItem label="经理/主管：">
                <Input v-if="!isAdd" v-model="managerName" disabled></Input>
                <AutoComplete v-else v-model="managerName" @on-change="searchPerson" placeholder="经理/主管：">
                    <div v-for="person in personList" :key="person.id">
                        <Option :value="person.nickname" :key="person.id">
                            <h3>{{ person.nickname }}</h3>
                            <span style="width:50%;display:inline-block">部门：{{person.deptName}}</span>
                            <span style="width:50%;display:inline-block">职位：{{person.positionName}}</span>
                        </Option>
                    </div>
                </AutoComplete>
            </FormItem>
            <FormItem label="经理政委/主管政委：">
                <Input v-if="!isAdd" v-model="commissarName" disabled></Input>
                <AutoComplete v-else v-model="commissarName" @on-change="searchPerson" placeholder="经理政委/主管政委：">
                    <div v-for="person in personList" :key="person.id">
                        <Option :value="person.nickname" :key="person.id">
                            <h3>{{ person.nickname }}</h3>
                            <span style="width:50%;display:inline-block">部门：{{person.deptName}}</span>
                            <span style="width:50%;display:inline-block">职位：{{person.positionName}}</span>
                        </Option>
                    </div>
                </AutoComplete>
            </FormItem>
        </Form>
    </Modal>
</div>
</template>

<script>
import ZkSwitch from '_c/switch/switch'
import zkTable from 'vue-table-with-tree-grid'
import {
  baseUrl
} from '@/api/base.js'
export default {
  name: 'organization',
  components: {
    ZkSwitch,
    zkTable
  },
  data () {
    return {
      permissionUpdate: false, // 编辑
      permissionCreate: false, // 新增
      permissionDelet: false, // 删除
      permissionMove: false, // 移动
      id: '', // 部门层级id，唯一操作，多次使用
      lever: '', // 当前操作的层级
      modalTitle: '',
      isAdd: true,
      isMove: 1, // 是否可移动， 1为可移动 0为不可移动
      personList: [],
      personNameList: [],
      deptName: '', // 部门名称
      managerId: '', // 经理id
      managerName: '', // 经理名
      commissarId: '', // 主管id
      commissarName: '', // 主管名称
      showAddModal: false,
      showEditModa: false,
      props: {
        // props 树形表格样式配置项
        stripe: true, // stripe 隔行样式
        border: true, // border 外部框
        showHeader: true, // showHeader 展现表格头部
        showRowHover: true, // showRowHover 鼠标悬浮行样式
        treeType: true, // treeType 树形结构
        expandType: false, // expandType 可展开详细信息 默认为true 设为false
        selectionType: false // selectionType 表边显示选择框 默认为true 设为false
      },
      table_data: [], // table_data  树形结构
      columns: [
        // columns 表头数据
        {
          label: '部门层级',
          prop: 'deptName',
          width: '250px',
          align: 'left'
        },
        {
          label: '在职/编制',
          prop: 'incumbency2Total',
          width: '90px',
          align: 'center'
        },
        {
          label: '经理/主管',
          prop: 'managerName',
          width: '150px',
          align: 'center'
        },
        {
          label: '经理政委/主管政委',
          prop: 'commissarName',
          width: '150px',
          align: 'center'
        },
        {
          label: '操作',
          prop: 'action',
          width: '250px',
          type: 'template',
          template: 'action',
          align: 'left'
        }
      ]
    }
  },
  mounted () {
    this.getData()
    this.getPermission()
  },
  watch: {
    managerName (newVal) {
      let name = newVal.trim()
      // 清空通知人后，置空通知人id
      if (!name) {
        this.managerId = ''
      }
      this.personList.some(e => {
        if (e.nickname === name) {
          this.managerId = e.id
          this.checkManage(e.id)
          return true
        } else {
          this.managerId = ''
          return false
        }
      })
    },
    commissarName (newVal) {
      let name = newVal.trim()
      // 清空通知人后，置空通知人id
      if (!name) {
        this.commissarId = ''
      }
      this.personList.some(e => {
        if (e.nickname === name) {
          this.commissarId = e.id
          this.checkManage(e.id)
          return true
        } else {
          this.commissarId = ''
          return false
        }
      })
    }
  },
  methods: {
    // 获取当前页面权限
    getPermission () {
      this.permissionCreate = this.$store.state.user.userpermission.organization.create
      this.permissionUpdate = this.$store.state.user.userpermission.organization.update
      this.permissionDelet = this.$store.state.user.userpermission.organization.delete
      this.permissionMove = this.$store.state.user.userpermission.organization.move
    },
    getData () {
      this.$axios({
        url: baseUrl + '/Structure/findStructureByCondition',
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.table_data = res.data.content
            for (let i = 0; i < res.data.content.length; i++) {
              if (this.table_data[0].leverorder === 1) {
                this.isMove = 0
              }
            }
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    updateOrder (row, index, operation) {
      // operation 1表示上移，2表示下移
      this.$axios({
        url: baseUrl + '/Structure/updateStructureOrder',
        data: $qs.stringify({
          id: row.id,
          moveid: operation
        }),
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.getData()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    add (row) {
      // 新增一级子部门
      this.id = row.id
      this.lever = row.lever
      this.modalTitle = '新增子部门'
      this.isAdd = true
      // 清空内容
      this.managerName = ''
      this.deptName = ''
      this.commissarName = ''
      this.showAddModal = true
    },
    insertChildDept () {
      if (this.isAdd) {
        this.$axios({
          url: baseUrl + '/Structure/insertChildDept',
          method: 'post',
          data: $qs.stringify({
            managerId: this.managerId,
            commissarId: this.commissarId,
            id: this.id,
            deptName: this.deptName,
            lever: this.lever
          })
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.$Message.info(res.data.msg)
              this.getData()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.$axios({
          url: baseUrl + '/Structure/updateStructuredept',
          method: 'post',
          data: $qs.stringify({
            id: this.id,
            deptName: this.deptName
          })
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.$Message.info(res.data.msg)
              this.getData()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    searchPerson (value) {
      if (!value.trim()) return false
      // 传入模糊搜索的词
      let me = this
      this.$axios({
        url: baseUrl + '/user/getalladviceuser',
        method: 'post',
        data: $qs.stringify({
          partUserName: value
        })
      })
        .then(res => {
          // [{id: 2, nickname: "高汉", password: "12345", username: "gaohan"}]
          let userList = res.data
          me.personList = userList
          me.personNameList = userList.map(e => e.nickname)
        })
        .catch(err => {
          console.error(err)
        })
    },
    edit (row) {
      this.isAdd = false
      this.showAddModal = true
      // 把当前行的赋给变量
      this.id = row.id
      this.modalTitle = '编辑部门'
      this.managerName = row.managerName
      this.commissarName = row.commissarName
      this.deptName = row.deptName
    },
    remove (row) {
      // 在职人数>0
      let me = this
      if (row.totalNum !== 0) {
        this.$Modal.warning({
          title: '通知',
          content: '删除失败，当前部门下还有成员！'
        })
      } else {
        this.$Modal.confirm({
          title: '通知',
          content: '删除' + row.deptName + '?',
          onOk () {
            me.$axios({
              url: baseUrl + '/Structure/updateStructureStatus',
              method: 'post',
              data: $qs.stringify({
                id: row.id
              })
            })
              .then(res => {
                if (res.data.code === 10000) {
                  me.$Message.success({
                    title: '通知',
                    content: res.data.msg
                  })
                  me.getData()
                } else {
                  me.$Message.error({
                    title: '通知',
                    content: res.data.msg
                  })
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        })
      }
    },
    checkManage (id) {
      this.$axios({
        url: baseUrl + '/Structure/changemanageById',
        method: 'post',
        data: $qs.stringify({
          id: id
        })
      })
        .then(res => {
          // 人员不可选
          if (res.data.code !== 10000) {} else {
            // 人员已经有职位
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    }
  }
}
</script>

<style scoped>
#mainWrap {
    /* top: 100px; */
    /* padding: 20px; */
    /* background-color: #f3f3f3; */
}

.ivu-btn-primary {
    background-color: #19aa8d;
    border-color: #19aa8d;
    color: #fff;
}

.ivu-btn-primary:hover {
    background-color: #088f74;
    border-color: #088f74;
    color: #fff;
}

/* * {
  margin: 0;
  padding: 0;
} */

.switch-list {
    margin: 20px 0;
    list-style: none;
    overflow: hidden;
}

.switch-item {
    margin: 20px;
    float: left;
}

.buttonStyle,
#edit,
#delet {
    display: inline-block;
    margin-bottom: 0;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    white-space: nowrap;
    line-height: 1.5;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    padding: 5px 15px 6px;
    font-size: 12px;
    border-radius: 4px;
    background-color: #19aa8d;
    border-color: #19aa8d;
    color: #fff;
    margin-right: 5px;
}

.buttonStyle:hover,
#edit:hover {
    background-color: #088f74;
    border-color: #088f74;
    color: #fff;
}

#delet {
    color: #fff;
    background-color: #ed4014;
    border-color: #ed4014;
}
</style>
<style>
.zk-table__header-cell.zk-table--border-cell {
    text-align: center !important;
    color: #088f74;
}

.modal .ivu-btn-primary {
    background-color: #19aa8d;
    border-color: #19aa8d;
    color: #fff;
}

.modal .ivu-btn-primary:hover {
    background-color: #088f74;
    border-color: #088f74;
    color: #fff;
}
</style>

<style>
.ivu-btn-primary {
    background-color: #19aa8d;
    border-color: #19aa8d;
    color: #fff;
}

.ivu-btn-primary:hover {
    background-color: #088f74;
    border-color: #088f74;
    color: #fff;
}
</style>
