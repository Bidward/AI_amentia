<template>
    <div class="permisson">
        <Tabs tab="outTable" value="name1">
            <TabPane label="角色设置" name="name1">
                <Button type="primary" style="margin-bottom: 10px" @click="clickAdd">新增</Button>
                <Table border :columns="header" :data="dataContent">
                     <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" style="margin-right: 5px" @click="editRole(row,index)">编辑</Button>
                        <Button type="primary" style="margin-right: 5px" @click="getPermissionData(row,index)">权限配置</Button>
                        <Button type="error" @click="deletRole(row,index)">删除</Button>
                    </template>
                </Table>
            </TabPane>
        </Tabs>
        <Modal id="addRole" v-model="addRole" :title="modalTile" :loading="modelLoading" @on-ok="saveRole">
            <div v-if="modalTile==='权限配置'" class="permission">
                <Tree ref="tree" :data="permissionData" expand show-checkbox @on-select-change="selectChange" @on-check-change="selectChange"></Tree>
            </div>
            <div v-else>
                <div class="role"><span class="redRequire">*</span>角色：<Input v-model="roleName" placeholder="请输入角色" style="width: 300px" clearable /></div>
                <div>备注：<Input v-model="remarks"  type="textarea" placeholder="请输入备注" style="width: 300px" clearable/></div>
            </div>
        </Modal>
    </div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
import { Track } from '@/libs/track'
const track = new Track('系统设置/权限设置/权限设置')
export default {
  name: 'permissonSetting',
  inject: ['reload'],
  beforeCreate () {
    track.start()
  },
  data () {
    return {
      permissionData: [], // 角色权限数据
      roleIds: [], // 角色权限配置传回的用户ID数组对象 json形式
      modelLoading: true,
      modalTile: '新增角色',
      addRole: false, // 新增角色弹出框
      roleId: '', // 新增角色id
      roleName: '', // 新增角色
      remarks: '', // 新增角色备注
      header: [
        {
          title: 'id',
          key: 'roleId',
          align: 'center',
          width: 170
        }, {
          title: '角色',
          align: 'center',
          key: 'roleName'
        }, {
          title: '备注',
          align: 'center',
          key: 'remarks'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      dataContent: []
    }
  },
  mounted () {
    this.initialize()
  },
  methods: {
    initialize () {
      this.getData()
    },
    // 获取初始列表数据
    getData () {
      this.$axios({
        url: baseUrl + '/permission/lookRole',
        data: $qs.stringify(),
        method: 'post'
      }).then(resp => {
        if (resp.data.code === 10000) {
          this.dataContent = resp.data.content
        } else {
          this.$Message.error(resp.data.msg)
        }
        this.$nextTick(() => {
          track.end()
        })
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 新增弹框
    clickAdd () {
      this.modalTile = '新增角色'
      this.addRole = true
      this.roleName = ''
      this.remarks = ''
    },
    // 编辑角色弹框
    editRole (row, index) {
      this.modalTile = '编辑角色'
      this.addRole = true
      this.roleId = row.roleId
      this.roleName = row.roleName
      this.remarks = row.remarks
    },
    // 权限配置推荐框
    getPermissionData (row, index) {
      this.modalTile = '权限配置'
      this.roleId = row.roleId
      let sendData = {
        id: row.roleId
      }
      this.$axios({
        url: baseUrl + '/permission/getPermissionList',
        data: $qs.stringify(sendData),
        method: 'post'
      }).then(resp => {
        if (resp.data.code === 10000) {
          // 页面渲染完
          this.permissionData = resp.data.content
          this.addRole = true
          this.$nextTick(() => {
            this.getSelectedNode()
          })
        } else {
          this.$Message.error(resp.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 获取勾选中的节点
    getSelectedNode () {
      const nodes = this.$refs.tree.getCheckedNodes()
      let ids = nodes.map(e => {
        return {
          permissionId: e.id,
          type: e.type,
          positionPermission: e.disabled// 职位权限与用户权限的区分
        }
      })
      this.roleIds = ids
    },
    // 新增角色
    saveRole () {
      if (this.modalTile === '新增角色') {
        this.saveAddNewRole()
      } else if (this.modalTile === '编辑角色') {
        this.saveEditRole()
      } else if (this.modalTile === '权限配置') {
        this.savePermission()
        // this.reload()
      }
    },
    // 选择权限
    selectChange (index) {
      this.roleIds = index.map(e => {
        return {
          permissionId: e.id,
          type: e.type,
          positionPermission: e.disabled// 职位权限与用户权限的区分
        }
      })
    },
    // 保存权限配置
    savePermission () {
      let sendData = {
        id: this.roleId,
        permissionIds: this.roleIds
      }
      this.$axios({
        url: baseUrl + '/permission/updatePositionRole',
        data: sendData,
        method: 'post'
      }).then(resp => {
        if (resp.data.code === 10000) {
          this.addRole = false
          this.permissionData = resp.data.content
          this.$Message.success({
            content: resp.data.msg,
            duration: 3
          })
        } else {
          this.modelLoading = false
          this.$Message.error(resp.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 保存新增角色
    saveAddNewRole () {
      let sendData = {
        roleName: this.roleName,
        remarks: this.remarks
      }
      this.$axios({
        url: baseUrl + '/permission/insertRole',
        data: $qs.stringify(sendData),
        method: 'post'
      }).then(resp => {
        if (resp.data.code === 10000) {
          this.addRole = false
          this.getData()
          this.$Message.success(resp.data.msg)
        } else if (resp.data.code === 10101) {
          // 有未填必填项，提示
          this.modelLoading = false
          this.$nextTick(() => {
            this.modelLoading = true
          })
          this.$Message.error(resp.data.msg)
        } else if (resp.data.code === 10102) {
          // 角色名已存在，先清空输入的角色名
          this.roleName = ''
          this.modelLoading = false
          this.$nextTick(() => {
            this.modelLoading = true
          })
          this.$Message.error(resp.data.msg)
        } else {
          this.$Message.error(resp.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 保存编辑角色
    saveEditRole () {
      let sendData = {
        roleId: this.roleId,
        roleName: this.roleName,
        remarks: this.remarks
      }
      this.$axios({
        url: baseUrl + '/permission/editRole',
        data: $qs.stringify(sendData),
        method: 'post'
      }).then(resp => {
        if (resp.data.code === 10000) {
          this.addRole = false
          this.dataContent = resp.data.content
          this.$Message.success(resp.data.msg)
        } else {
          this.$Message.error(resp.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 删除角色
    deletRole (row, index) {
      this.$Modal.confirm({
        title: '提示',
        content: `是否删除角色${row.roleName}`,
        onOk: () => {
          let sendData = {
            roleId: row.roleId
          }
          this.$axios({
            url: baseUrl + '/permission/deleteRoleById',
            data: $qs.stringify(sendData),
            method: 'post'
          }).then(resp => {
            if (resp.data.code === 10000) {
              this.getData()
              this.$Message.success(resp.data.msg)
            } else {
              this.$Message.error(resp.data.msg)
            }
          }).catch(err => {
            console.log('err', err)
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
#addRole{
    .redRequire{
        font-size: 16px;
        position: relative;
        top: 4px;
        right: 3px;
        color: red;
    }
    .permission{
        position: relative;
        left: -38%;
    }
    .ivu-modal-body{
        text-align: center;
    }
    .role{
        margin-bottom: 23px;
    }
    .ivu-input:hover {
        border-color: #19aa8d;
    }
    .ivu-input:focus {
        border-color: #19aa8d;
        outline: 0;
        box-shadow: none;
    }
    .ivu-select-selection-focused,
    .ivu-select-selection:hover
    {
        border-color: #19aa8d;
    }
    .ivu-select-visible .ivu-select-selection {
        border-color: #19aa8d;
        outline: 0;
        box-shadow:none;
    }
    .ivu-select-item-selected,
    .ivu-select-item-selected:hover{
        color: #19AA8D !important;
    }
    .ivu-modal-footer Button:first-child{
        color: #19aa8d;
        background-color: #fff;
        border-color: #19aa8d;
    }
}
</style>
