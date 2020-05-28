<template>
  <div>
    <div class="tableHeader">
      <div class="searchBar clearfix">
        <Button style="float:left" @click="exportStructure">导出</Button>
        <div style="float:right" v-if="canEdit">
          <Button @click="getCanEdit" v-if="permision.update">编辑</Button>
        </div>
        <div style="float:right" v-else>
          <Button class="btns" @click="cancelEdit">取消</Button>
          <Button class="btns" type="primary" @click="save">保存</Button>
        </div>
      </div>
    </div>

    <zk-table
      :data="originzationData"
      :columns="columns"
      :stripe="zkProps.stripe"
      :border="zkProps.border"
      :show-header="zkProps.showHeader"
      :show-row-hover="zkProps.showRowHover"
      :tree-type="zkProps.treeType"
      :expand-type="zkProps.expandType"
      :selection-type="zkProps.selectionType"
      :is-fold="false"
    >
      <template slot-scope="{ row, rowIndex }" slot="action">
        <Button class="btns" type="primary" :disabled="canEdit" @click="add(row)">新增子部门</Button>
        <Button
          class="btns"
          v-if="row.parentId!==0"
          type="primary"
          :disabled="canEdit"
          @click="edit(row,rowIndex)"
        >编辑</Button>
        <Button
          class="btns"
          v-if="row.parentId!==0"
          type="error"
          :disabled="canEdit"
          @click="handleDel(row,rowIndex)"
        >删除</Button>
        <!-- <Button
          class="btns"
          v-if="row.parentId!==0"
          type="primary"
          @click="handleShowDetial(row)"
        >详情</Button>-->
        <Button
          class="btns square"
          v-if="permision.move && row.moveUpward===0&&row.parentId!==0"
          :disabled="!canEdit"
          @click="updateOrder(row.id,1)"
        >
          <Icon type="md-arrow-round-up" />
        </Button>
        <Button
          class="btns square"
          v-if="permision.move && row.moveDown===0&&row.parentId!==0"
          :disabled="!canEdit"
          @click="updateOrder(row.id,2)"
        >
          <Icon type="md-arrow-round-down" />
        </Button>
      </template>
    </zk-table>
    <!-- 一次编辑状态 -->
    <!-- 二次编辑当前用户不是通知人 -->
    <div v-if="(!canEdit&&tbcId===-1)||(!canEdit&&twoEntryName!==nickname)">
      <div class="selection">
        <h3 class="pd10">通知人</h3>
        <Row>
          <Col span="23" offset="1">
            <div>
              <Icon type="ios-contacts" v-if="tbcId===-1" size="50" @click="showNotice=true"></Icon>
              <Icon type="ios-contacts" v-else size="50"></Icon>
              <p style="width:50px;text-align:center">{{twoEntryName}}</p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
    <div class="selection" v-if="showDiff">
      <h3 class="pd10">信息对比</h3>
      <!-- <Row> -->
      <!-- <Col span="23" offset="1"> -->
      <Table :columns="diffTableHeader" :data="diffTableContent"></Table>
      <!-- </Col> -->
      <!-- </Row> -->
    </div>
    <editDept
      v-if="showEditModal"
      :show.sync="showEditModal"
      :title="modalTitle"
      :incumbencyUserList="incumbencyUserList"
      :deptInfo="deptInfo"
      :deptList="deptList"
      @getDeptFrom="getDeptFrom"
    />

    <Modal
      v-model="showNotice"
      @on-ok="validateNotice('ok')"
      @on-cancel="showNotice=false"
      :loading="loading"
      :mask-closable="false"
      title="通知人"
    >
      <Form ref="notice" :model="notice" :label-width="80">
        <FormItem label="通知人" prop="twoEntryId" :rulse="{require:true,message:'通知人必填'}">
          <Select
            v-model="notice.twoEntryId"
            filterable
            :label-in-value="true"
            @on-change="v=>{twoEntryName = v.label}"
          >
            <Option
              v-for="person in incumbencyUserList"
              :key="person.id"
              :value="person.id"
              :label="person.nickname"
            >{{ person.nickname }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      title="详情"
      :mask-closable="false"
      @on-ok="showDetail=false"
      @on-cancel="showDetail=false"
      v-model="showDetail"
    >
      <showDept v-if="showDetail" :data="detailData"></showDept>
    </Modal>
  </div>
</template>
<script>
import zkTable from 'vue-table-with-tree-grid'
import { baseUrl } from '@/api/base.js'
import editDept from './editDept'
import showDept from './showDept'
import { Track } from '@/libs/track.js'
const track = new Track('人力运营中心/组织规划/组织架构')
export default {
  name: 'deptList',
  components: {
    editDept,
    showDept,
    zkTable
  },
  beforeCreate () {
    track.start()
  },
  props: {
    // 在职人员列表
    incumbencyUserList: {
      type: Array
    },
    tbcId: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      canEdit: true, // 可以点编辑按钮
      showEditModal: false,
      showDetail: false,
      showNotice: false,
      modalTitle: '编辑',
      detailData: {}, // 详情的内容
      loading: false,
      editId: '',
      notice: {
        twoEntryId: '' // 两人两遍编辑人id
      },
      twoEntryName: '', // 两人两遍编辑人名称
      showDiff: false, // 是否展示对比信息
      diffTableHeader: [], // 对比信息表头
      diffTableContent: [], // 对比信息内容
      delDeptIds: [], // 需要删除的部门数组
      originzationData: [], // 组织架构数据
      originzationBak: [], // 组织架构数据备份
      deptInfo: {
        deptName: '',
        headId: ''
      },
      // 头部
      columns: [
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
          align: 'center',
          headerAlign: 'center'
        },
        {
          label: '部门负责人',
          prop: 'head',
          width: '90px',
          align: 'center',
          headerAlign: 'center'
        },
        {
          label: '操作',
          prop: 'action',
          width: '150px',
          type: 'template',
          template: 'action',
          align: 'left'
        }
      ],
      tbcStatus: 0,
      // 页面配置项
      zkProps: {
        // props 树形表格样式配置项
        stripe: false, // stripe 隔行样式
        border: true, // border 外部框
        showHeader: true, // showHeader 展现表格头部
        showRowHover: true, // showRowHover 鼠标悬浮行样式
        treeType: true, // treeType 树形结构
        expandType: false, // expandType 可展开详细信息 默认为true 设为false
        selectionType: false // selectionType 表边显示选择框 默认为true 设为false
      }
      // deptList: []
    }
  },
  mounted () {
    this.getOriginzation()
  },
  methods: {
    // 查看详情
    handleShowDetial (row) {
      let deptId = row.id
      this.$axios({
        url: baseUrl + '/Structure/findDeptUesrByDeptId',
        method: 'post',
        data: $qs.stringify({ deptId })
      }).then(res => {
        if (res.data.code === 10003) {
          this.detailData = res.data.content
          this.showDetail = true
        }
      })
    },
    // 判断是否有人正在两人两遍，
    getCanEdit () {
      this.$axios({
        url: baseUrl + '/Structure/getEditing',
        method: 'post',
        data: $qs.stringify({ entryMean: 1 })
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.canEdit = false
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.data.content
            })
            console.warn(res.data.content)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取组织架构
    getOriginzation () {
      if (this.tbcId === -1) {
        this.$axios({
          url: baseUrl + '/Structure/findStructureByCondition',
          method: 'post'
        })
          .then(res => {
            let data = res.data
            this.originzationData = data.content
            this.originzationBak = JSON.parse(JSON.stringify(data.content))
            this.$nextTick(() => {
              track.end()
            })
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        // 二次编辑数据回显
        this.$axios({
          url: baseUrl + '/Structure/lookTodo',
          method: 'post',
          data: $qs.stringify({ tbcId: this.tbcId })
        }).then(res => {
          if (res.data.code === 10000) {
            let data = res.data
            let { tree, tbcStatus, twoEntryName, twoEntryId } = data.content
            this.tbcStatus = tbcStatus
            this.twoEntryName = twoEntryName
            this.notice.twoEntryId = twoEntryId
            this.originzationData = tree
            this.originzationBak = JSON.parse(JSON.stringify(tree))
            // 两次信息不一致
            if (tbcStatus === 2) {
              // 获取对比信息
              this.getDiff()
            }
          }
        })
      }
    },
    // 新增子部门
    add (row) {
      this.modalTitle = '新增'
      this.editId = row.id
      this.showEditModal = true
    },
    // 编辑某一个部门
    edit (row) {
      this.modalTitle = '编辑'
      this.editId = row.id
      this.deptInfo.deptName = row.deptName
      this.deptInfo.headId = row.headId || 0
      this.showEditModal = true
    },
    // 删除某个部门
    handleDel (row, rowIndex) {
      if (row.totalNum > 0) {
        this.$Modal.error({
          title: '删除失败',
          content: `${row.deptName}下还有成员`
        })
        return
      }
      this.$Modal.confirm({
        title: '删除提示',
        content: `确定删除${row.deptName}`,
        onOk: () => {
          this.delNodebyId(row.id)
        }
      })
    },
    // 二次编辑保存接口，也能获取不一致信息
    getDiff () {
      let sendData = {
        tree: this.originzationData[0],
        delete: this.delDeptIds,
        entryMean: 1, // 组织架构
        tbcId: this.tbcId
      }
      this.$axios({
        url: baseUrl + '/Structure/twoEntry',
        method: 'post',
        data: sendData
      })
        .then(res => {
          if (res.data.code === 10000) {
            // this.$Message.success(res.data.msg)
            this.showDiff = false
            this.$Message.success('两人两遍过白成功')
            this.canEdit = true
          } else if (res.data.code === 10021) {
            // 信息不一致展示對比信息
            this.$Message.error(res.data.msg)
            this.showDiff = true
            this.diffTableHeader = res.data.header
            this.diffTableContent = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 取消编辑
    cancelEdit () {
      this.originzationData = JSON.parse(JSON.stringify(this.originzationBak))
      this.canEdit = true
      this.delDeptIds = []
    },
    // 保存
    save () {
      let oldData = JSON.stringify(this.originzationBak)
      let newData = JSON.stringify(this.originzationData)
      let firstManSecondSubmit =
        this.tbcStatus === 1 && this.notice.twoEntryId !== this.userId
      console.log('firstManSecondSubmit' + firstManSecondSubmit)
      if (oldData === newData) {
        this.$Modal.error({
          title: '错误',
          content: '没有任何修改',
          onOk: () => {
            this.canEdit = false
          }
        })
        return
      }

      // 发起人一次录入，或者发起人在待二次录入下又编辑了
      if (this.tbcId === -1 || firstManSecondSubmit) {
        // 判断通知人有没有填
        if (!this.validateNotice()) {
          return false
        }
        let sendData = {
          tree: this.originzationData[0],
          twoEntryId: this.notice.twoEntryId,
          delete: this.delDeptIds,
          entryMean: 1, // 组织架构
          tbcId: this.tbcId,
          router: 'organization'
        }
        this.$axios({
          url: baseUrl + '/Structure/oneEntry',
          method: 'post',
          data: sendData
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.$Message.success('提交成功')
              this.canEdit = true
              this.getOriginzation()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
          .catch(err => {
            console.error(err)
          })
      } else {
        // 第二次编辑修改
        this.getDiff()
      }
    },
    // 导出组织架构
    exportStructure () {
      window.open(baseUrl + '/Structure/ExportStructure')
    },
    // 组织架构上下移
    updateOrder (id, type) {
      // console.log(id)
      this.$axios({
        url: baseUrl + '/Structure/updateStructureOrder',
        method: 'post',
        data: $qs.stringify({ id, moveId: type })
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.getOriginzation()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 递归获取增删改内容
    getEdited (parent) {
      let add = []
      let edit = []
      function recursion (parent) {
        for (let i = 0; i < parent.length; i++) {
          let child = parent[i]
          if (child.children.length > 0) {
            recursion(child.children)
          }
          if (child.type === 'add') {
            add.push(child)
          }
          if (child.type === 'edit') {
            edit.push(child)
          }
        }
      }
      recursion(parent)
      return { add, edit }
    },
    // 根据父级id增加部门
    appendChild (parentId, data) {
      let tree = this.originzationData
      data.type = 'add'
      data.children = []
      data.id = -Number(
        new Date()
          .getTime()
          .toString()
          .substr(-7, 7)
      ) // 增加伪id，用于增删改查
      recursionEdit(tree)
      // 递归树
      function recursionEdit (parent) {
        for (let i = 0; i < parent.length; i++) {
          let child = parent[i]
          if (child.id === parentId) {
            data.lever = child.lever + 1
            data.parentId = child.id // 设置子节点的父节点id
            child.children.push(data)
            return true
          } else if (child.children.length > 0) {
            recursionEdit(child.children)
          }
        }
      }
    },
    // 根据id修改节点内容
    setNodebyId (id, data) {
      let tree = this.originzationData
      recursionEdit(tree)
      function recursionEdit (parent) {
        for (let i = 0; i < parent.length; i++) {
          let child = parent[i]
          if (child.id === id) {
            child.deptName = data.deptName
            // 如果已是新增类型，type依旧是新增，否则type设为edit
            child.type = child.type === 'add' ? 'add' : 'edit'
            // 复写原有熟悉
            child = Object.assign(child, data)
            return
          } else if (child.children.length > 0) {
            recursionEdit(child.children)
          }
        }
      }
    },
    // 根据id删除节点，
    delNodebyId (id) {
      let me = this
      let tree = this.originzationData
      recursionDel(tree)
      function recursionDel (parent) {
        for (let i = 0; i < parent.length; i++) {
          let child = parent[i]
          if (child.id === id) {
            // 如果是已有的id，放到需要删除的数组里
            if (child.id >= 0) {
              me.delDeptIds.push(id)
            }
            parent.splice(i, 1)
          } else if (child.children.length > 0) {
            recursionDel(child.children)
          }
        }
      }
    },
    // 获取组织架构弹出框的内容
    getDeptFrom (formData) {
      let { type, deptName, head, headId } = formData
      if (type === '编辑') {
        this.setNodebyId(this.editId, { deptName, head, headId })
      } else if (type === '新增') {
        this.appendChild(this.editId, { deptName, head, headId })
      }
    },
    // 验证通知人是否填写了
    validateNotice (ok) {
      if (this.notice.twoEntryId) {
        if (ok) {
          // this.
        }
        return true
      } else {
        this.$Message.error('通知人未填')
        return false
      }
    },
    // 通知人发生改变的时候
    selectNotice () {
      this.$refs.notice.validate(v => {
        if (v) {
          console.log('通过')
          this.showNotice = false
        } else {
          console.log('不通过')
          this.$Message.error('有必填项未填')
        }
      })
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    }
  },
  watch: {
    tbcId: {
      handler (newVal) {
        // 从待办事项过来的
        if (newVal !== -1) {
          this.canEdit = false
        }
      },
      immediate: true
    },
    originzationData () {}
  },
  computed: {
    nickname () {
      return this.$store.state.user.nickname
    },
    userId () {
      return this.$store.state.user.userId
    },
    // 所有部门的名称列表
    deptList () {
      let arr = this.originzationData
      let deptList = []
      getDeptName(arr)
      function getDeptName (tree) {
        for (let i = 0; i < tree.length; i++) {
          let node = tree[i]
          deptList.push(node.deptName)
          if (node.children && node.children.length > 0) {
            getDeptName(node.children)
          }
        }
      }
      // this.deptList = deptList;
      return deptList
    },
    // 权限
    permision () {
      // 编辑 update
      // 移动 move
      return this.$store.state.user.userpermission.organization
    }
  }
}
</script>
<style lang="less" scoped>
.selection {
  margin-top: 10px;
  h3 {
    display: block;
    border-left: 3px #19aa8d solid;
    margin-bottom: 15px;
  }
  .pd10 {
    padding-left: 10px;
  }
  .pd30 {
    padding-left: 30px;
  }
}
</style>
