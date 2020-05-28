<template>
  <div class="pagePadding">
    <Card>
      <h1>两人两遍权限设置</h1>
      <Table border :columns="tables.header" :data="tables.data">
        <template slot-scope="{ row, index }" slot="parent">
          <span>{{row.parent}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="sub">
          <a style="cursor:pointer" @click="showTwoTimesPermission(row.menuId)">
            <span>{{row.sub}}</span>
          </a>
        </template>
      </Table>
      <Modal v-model="showModal" title="两人两遍权限设置" @on-ok="save" :loading="loading">
        <Form :label-width="80">
          <FormItem label="*录入人部门">
            <Select
              v-model="originatorDeptId"
              @on-change="value=>checkDeptPermission(menuId,value,'originatorDept')"
            >
              <Option
                v-for="dept in deptList"
                :value="dept.id"
                :key="dept.id"
                :label="dept.deptName"
              ></Option>
            </Select>
          </FormItem>
          <FormItem label="*通知人部门">
            <Select
              v-model="receiverDeptId"
              @on-change="value=>checkDeptPermission(menuId,value,'receiverDept')"
            >
              <Option
                v-for="dept in deptList"
                :value="dept.id"
                :key="dept.id"
                :label="dept.deptName"
              ></Option>
            </Select>
          </FormItem>
        </Form>
      </Modal>
    </Card>
  </div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
export default {
  name: 'doublepermissionSet', // 权限设置
  mounted () {
    this.loadData()
  },
  data () {
    return {
      treeSelected: [],
      showModal: false,
      originatorDeptId: '', // 录入人部门
      receiverDeptId: '', // 通知人部门
      loading: true, // 对话框loading
      deptList: [],
      allowSave: {
        originatorDept: true,
        receiverDept: true
      },
      menuId: '',
      twoTimesPermissionId: '-1', // 用于区分是新增的还是更新
      tables: {
        header: [
          { title: '一级菜单', slot: 'parent' },
          { title: '二级菜单', slot: 'sub' }
        ],
        data: [
          // {parent: '11',sub: '11'}
        ]
      }
    }
  },
  methods: {
    loadData () {
      // 加载表格数据
      this.$axios({
        url: baseUrl + '/menu/twotimesmenus',
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            let content = res.data.content
            this.dataFormat(content)
          }
        })
        .catch(err => {
          console.log('loadData', err)
        })
    },
    dataFormat (content) {
      // 格式化数据
      // "content":[{"children":[{"id":5,"menuName":"组织架构"},{"id":4,"menuName":"公司信息"}],"id":2,"menuName":"综合管理"}]
      let data = []
      for (let i = 0; i < content.length; i++) {
        let rows = content[i].children.length
        let parentName = content[i].menuName
        for (let j = 0; j < rows; j++) {
          let subName = content[i].children[j].menuName
          let menuId = content[i].children[j].id
          data.push({ parent: parentName, sub: subName, menuId: menuId })
        }
      }
      // [{menuId,parent,sub},{menuId,parent,sub}]
      this.tables.data = data
    },
    showTwoTimesPermission (menuId) {
      this.menuId = menuId
      this.originatorDeptId = ''
      this.receiverDeptId = ''
      this.$axios({
        url: baseUrl + '/permission/loadTwoTimesPermission',
        method: 'post',
        data: $qs.stringify({ menuId: menuId })
      })
        .then(res => {
          let content = res.data.content
          this.deptList = content.deptList
          // 如果已经有配置项
          if (content.twoTimesPermission) {
            this.originatorDeptId = content.twoTimesPermission.originatorDeptId
            this.receiverDeptId = content.twoTimesPermission.receiverDeptId
            this.twoTimesPermissionId = content.twoTimesPermission.id
          } else {
            this.twoTimesPermissionId = -1 // 当前两人两遍配置的id，-1代表当前没有配置，
          }
          this.showModal = true
        })
        .catch(err => {
          console.log('showTwoTimesPermission', err)
        })
    },
    save () {
      if (!this.menuId || !this.originatorDeptId || !this.receiverDeptId) {
        this.$Message.error('有必填项未填')
        this.loading = false // 确认框先取消loading
        this.$nextTick(() => {
          this.loading = true
        }) // 再允许loading，
      } else if (this.originatorDeptId === this.receiverDeptId) {
        this.$Message.error('部门不能相同')
        this.loading = false // 确认框先取消loading
        this.$nextTick(() => {
          this.loading = true
        })
      } else if (
        !this.allowSave.originatorDept ||
        !this.allowSave.receiverDept
      ) {
        this.$Message.error('选择了没有权限的部门')
        this.loading = false // 确认框先取消loading
        this.$nextTick(() => {
          this.loading = true
        })
      } else {
        let data = {
          id: this.twoTimesPermissionId, // 当前两人两遍配置的id
          menuId: this.menuId, // 菜单编号
          originatorDeptId: this.originatorDeptId, // 录入 部门编号
          receiverDeptId: this.receiverDeptId // 通知 部门编号
        }
        this.saveTwoTimesPermission(data)
      }
    },
    saveTwoTimesPermission (data) {
      this.$axios({
        url: baseUrl + '/permission/saveTwoTimesPermission',
        method: 'post',
        data: { twoTimesPermission: data }
      }).then(res => {
        if (res.data.code === 10010) {
          this.showModal = false
          this.$Message.success(res.data.msg)
        } else {
          this.$Message.error(res.data.msg)
        }
        this.loading = false // 确认框先取消loading
        this.$nextTick(() => {
          this.loading = true
        })
      })
    },
    checkDeptPermission (menuId, deptId, type) {
      // 根据选择的菜单和选择的部门，校验这个部门是否有人有两人两遍权限
      if (!deptId) return
      this.$axios({
        url: baseUrl + '/permission/checkDeptPermission',
        method: 'post',
        data: $qs.stringify({ menuId: menuId, deptId: deptId })
      })
        .then(res => {
          if (res.data.code !== 10000) {
            // 不通过
            this.allowSave[type] = false
            this.$Message.error(res.data.msg)
          } else {
            // 通过
            this.allowSave[type] = true
          }
        })
        .catch(err => {
          console.log('checkDeptPermission', err)
        })
    }
  },

  watch: {}
}
</script>
