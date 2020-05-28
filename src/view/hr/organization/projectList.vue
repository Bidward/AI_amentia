<template>
  <div>
    <div class="tableHeader">
      <div class="searchBar clearfix">
        <Button style="float:left" @click="exportProject">导出</Button>
        <div style="float:right" v-if="canEdit">
          <Button @click="getCanEdit" v-if="permision.update">编辑</Button>
        </div>
        <div style="float:right" v-else>
          <Button class="btns" @click="cancel">取消</Button>
          <Button class="btns" type="primary" @click="save">保存</Button>
        </div>
      </div>
    </div>
    <zk-table
      :data="projectData"
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
        <Button
          class="btns"
          v-if="row.projectId===1"
          type="primary"
          :disabled="canEdit"
          @click="addProject"
        >新增项目组</Button>
        <Button
          class="btns"
          v-if="row.projectId!==1"
          type="primary"
          @click="editProject(row)"
          :disabled="canEdit"
        >编辑</Button>
        <Button
          class="btns"
          v-if="row.projectId!==1"
          type="error"
          :disabled="canEdit||(row.levelOrder===1&&row.level===3)"
          @click="handleDel(row)"
        >删除</Button>
        <!-- <Button class="btns" @click="()=>{handleShowDetail(row,rowIndex)}">详情</Button> -->
        <Button
          class="btns square"
          v-if="permision.move && row.projectId!==1&&row.moveUpward===0"
          :disabled="!canEdit"
          @click="updateOrder(row.projectId,1)"
        >
          <Icon type="md-arrow-round-up" />
        </Button>
        <Button
          class="btns square"
          v-if="permision.move && row.projectId!==1&&row.moveDown===0"
          :disabled="!canEdit"
          @click="updateOrder(row.projectId,2)"
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
    <editProject
      v-if="showEdit"
      :show.sync="showEdit"
      @updataProject="updataProject"
      :incumbencyUserList="incumbencyUserList"
      :propsData="propsData"
      :config="config"
      :projectNameList="projectNameList"
    />
    <Modal
      v-model="showNotice"
      @on-ok="selectNotice"
      @on-cancel="showNotice=false"
      :loading="loading"
      :mask-closable="false"
      title="通知人"
    >
      <Form ref="notice" :model="notice" :label-width="80">
        <FormItem label="通知人" prop="twoEntryId">
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

    <showProject v-if="showDetail" :show.sync="showDetail" :data="propsData"></showProject>
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
import editProject from './editProject'
import showProject from './showProject'
import zkTable from 'vue-table-with-tree-grid'
import { Track } from '@/libs/track.js'
const track = new Track('人力运营中心/组织规划/项目架构')

export default {
  name: 'projectList',
  components: {
    editProject,
    showProject,
    zkTable
  },
  beforeCreate () {
    track.start()
  },
  props: {
    incumbencyUserList: Array,
    tbcId: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      showEdit: false, // 展示编辑
      showDetail: false, // 展示详情
      showNotice: false, // 显示通知人弹窗
      propsData: {}, // 需要传到子组件的详细信息
      canEdit: true, // 是否可以点击编辑按钮，默认是可以点编辑的
      loading: false,
      projectData: [],
      projectDataBak: [],
      editPrpjectId: 0,
      notice: { twoEntryId: '' },
      config: {},
      twoEntryName: '',
      tbcStatus: 0,
      delList: [], // 被删除部门的id
      // 头部
      columns: [
        {
          label: '项目层级',
          prop: 'deptName',
          width: '250px',
          align: 'left',
          headerAlign: 'left'
        },
        {
          label: '在职',
          prop: 'approval',
          width: '90px',
          align: 'center',
          headerAlign: 'center'
        },
        {
          label: '成员',
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
      zkProps: {
        // props 树形表格样式配置项
        stripe: false, // stripe 隔行样式
        border: true, // border 外部框
        showHeader: true, // showHeader 展现表格头部
        showRowHover: true, // showRowHover 鼠标悬浮行样式
        treeType: true, // treeType 树形结构
        expandType: false, // expandType 可展开详细信息 默认为true 设为false
        selectionType: false // selectionType 表边显示选择框 默认为true 设为false
      },
      showDiff: false,
      diffTableHeader: [],
      diffTableContent: []
    }
  },
  mounted () {
    this.getProject()
  },
  methods: {
    log (v) {
      console.log(arguments)
    },
    // 判断是否正在两人两遍
    getCanEdit () {
      this.$axios({
        url: baseUrl + '/Structure/getEditing',
        method: 'post',
        data: $qs.stringify({ entryMean: 2 })
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
    getProject () {
      // 一次编辑
      if (this.tbcId === -1) {
        this.$axios({
          url: baseUrl + '/project/getAllProject',
          method: 'post'
        })
          .then(res => {
            let data = res.data
            this.projectData = data.content
            this.$nextTick(() => {
              track.end()
            })
            this.projectDataBak = JSON.parse(JSON.stringify(data.content))
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
            this.projectData = tree
            this.projectDataBak = JSON.parse(JSON.stringify(tree))
            this.canEdit = false
            // 两次信息不一致
            if (tbcStatus === 2) {
              this.getDiff()
            }
          }
        })
      }
    },
    // 验证通知人是否填写了
    validateNotice (ok) {
      if (this.notice.twoEntryId) {
        if (ok) {
        }
        return true
      } else {
        this.$Message.error('通知人未填')
        return false
      }
    },
    selectNotice () {
      this.$refs.notice.validate(v => {
        if (v) {
          this.showNotice = false
        } else {
          this.$Message.error('有必填项未填')
        }
      })
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    // 新增项目组
    addProject () {
      this.showEdit = true
      this.config = {
        type: 'project',
        title: '新增'
      }
    },
    // 编辑项目组
    editProject (row) {
      this.propsData = JSON.parse(JSON.stringify(row))
      // console.log(row)
      this.showEdit = true
      this.editPrpjectId = row.projectId
      this.config = {
        type: row.level === 2 ? 'project' : 'dept',
        title: '编辑'
      }
    },
    // 删除项目组或者职能
    handleDel (row) {
      let me = this
      this.$Modal.confirm({
        title: '提示',
        content: `是否删除${row.deptName}`,
        onOk: () => {
          delNodeById(this.projectData, row.projectId)
        }
      })
      function delNodeById (tree, id) {
        for (let i = 0; i < tree.length; i++) {
          let node = tree[i]
          if (node.projectId === id) {
            if (id > 0) {
              me.delList.push(id)
            }
            tree.splice(i, 1)
          } else if (node.children && node.children.length > 0) {
            delNodeById(node.children, id)
          }
        }
      }
    },
    // 查看详情
    handleShowDetail (row) {
      this.propsData = row
      this.showDetail = true
    },
    // 更新项目架构
    updataProject (data) {
      if (this.config.title === '编辑') {
        // 如果操作的是项目组整体
        if (this.config.type === 'project') {
          let delList = data.delList
          let projectTree = data.projectTree
          // 把在弹窗里传来的删除列表放到当前组件
          this.delList = this.delList.concat(delList)
          for (let i = 0; i < this.projectData[0].children.length; i++) {
            let node = this.projectData[0].children[i]
            // 点编辑记录操作的id
            if (node.projectId === this.editPrpjectId) {
              this.$set(this.projectData[0].children, i, projectTree)
              break
            }
          }
          // 如果操作的是职能
        } else if (this.config.type === 'dept') {
          for (let i = 0; i < this.projectData[0].children.length; i++) {
            let project = this.projectData[0].children[i]
            // 职能的id肯定在树形结构第二层，不用递归
            for (let j = 0; j < project.children.length; j++) {
              // 职能的Node
              let node = project.children[j]
              if (node.projectId === this.editPrpjectId) {
                this.$set(this.projectData[0].children[i].children, j, data)
              }
            }
          }
        }
        // 新增项目组
      } else if (this.config.title === '新增') {
        // this.projectData[0].children.push(pushDate)
        this.projectData[0].children.push(data)
      }
    },
    // 根据id找到树节点
    getNodeById (id) {
      let projectTree = this.projectData[0]
      return getNodeById(id, projectTree)
      function getNodeById (id, tree) {
        let dept = {}
        for (let i = 0; i < projectTree.length; i++) {
          let node = projectTree[i]
          if (node.projectId === id) {
            dept = node
            return
          } else if (node.children && node.children.length > 0) {
            getNodeById(node.projectId, node.children)
          }
        }
        return dept
      }
    },
    // 保存逻辑
    save () {
      let newData = JSON.stringify(this.projectTree)
      let oldData = JSON.stringify(this.projectDataBak)
      let firstManSecondSubmit =
        this.tbcStatus === 1 && this.notice.twoEntryId !== this.userId
      console.log('firstManSecondSubmit' + firstManSecondSubmit)
      if (newData === oldData) {
        this.$Modal.error({
          title: '错误',
          content: '没有任何修改',
          onOk: () => {
            this.canEdit = false
          }
        })
        return false
      }

      // //发起人一次录入，或者发起人在待二次录入下又编辑了
      if (this.tbcId === -1 || firstManSecondSubmit) {
        // 判断通知人有没有填
        if (!this.validateNotice()) {
          return false
        }
        let sendData = {
          tree: this.projectData[0],
          twoEntryId: this.notice.twoEntryId,
          delete: this.delList,
          entryMean: 2, // 项目组
          tbcId: this.tbcId,
          router: 'organization'
        }
        this.$axios({
          url: baseUrl + '/Structure/oneEntry',
          method: 'post',
          data: sendData
        }).then(res => {
          if (res.data.code === 10000) {
            this.$Message.success('提交成功')
            this.getProject()
            this.canEdit = true
          }
        })
      } else {
        // 二次编辑
        this.getDiff()
      }
    },
    // 获取不一致信息
    getDiff () {
      let sendData = {
        tree: this.projectData[0],
        delete: this.delList,
        entryMean: 2, // 项目组
        tbcId: this.tbcId
      }
      this.$axios({
        url: baseUrl + '/Structure/twoEntry',
        method: 'post',
        data: sendData
      }).then(res => {
        if (res.data.code === 10000) {
          this.$Message.success('两人两遍过白成功')
          this.showDiff = false
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
    },
    // 取消
    cancel () {
      this.projectData = this.projectDataBak
      this.canEdit = true
    },
    // 项目组排序
    updateOrder (id, moveId) {
      this.$axios({
        url: baseUrl + '/project/updateProjectOrder',
        method: 'post',
        data: $qs.stringify({ id, moveId })
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.getProject()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取
    getEditNode (tree) {
      let list = []
      a(tree)
      // 递归获取节点
      function a (tree) {
        for (let i = 0; i < tree.length; i++) {
          if (tree[i].type) {
            list.push(tree[i])
          }
          if (tree[i].children && tree[i].children.length > 0) {
            a(tree[i].children)
          }
        }
      }
      return list
    },
    // 导出
    exportProject () {
      window.open(baseUrl + '/project/ExportProject')
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
    }
  },
  computed: {
    nickname () {
      return this.$store.state.user.nickname
    },
    userId () {
      return this.$store.state.user.userId
    },
    // 项目组列表，不含职能
    projectNameList () {
      // 项目组的名字
      return this.projectData[0].children.map(e => e.deptName)
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
