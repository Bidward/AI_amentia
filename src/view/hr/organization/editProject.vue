<template>
  <div>
    <Modal
      v-model="showModal"
      :title="config.title"
      @on-cancel="closeModal"
      :loading="loading"
      :mask-closable="false"
      @on-ok="ok"
    >
      <Form
        v-if="config.type==='project'"
        ref="projectForm"
        :label-width="100"
        :model="projectData"
        :rules="projectValidate"
      >
        <FormItem label="项目组名称:" prop="deptName">
          <Input v-model="projectData.deptName"></Input>
        </FormItem>
        <Table :columns="tableHeader" :data="projectData.children">
          <!-- 第一列，填职能名称的输入框 -->
          <template slot-scope="{ row, index }" slot="deptName">
            <Input
              @on-blur="changeValue(row,index,'deptName')"
              v-model="row.deptName"
              :disabled="index===0"
            />
          </template>
          <!-- 第二列，选择负责人的下拉框 -->
          <template slot-scope="{ row, index }" slot="headId">
            <!-- 负责人单选逻辑 -->
            <div v-if="index===0">
              <Select
                label-in-value
                filterable
                v-model="boss.headId"
                @on-change="(v)=>{boss.head=v.label}"
              >
                <Option
                  v-for="person in incumbencyUserList"
                  :value="person.id"
                  :key="person.id"
                  :label="person.nickname"
                >{{person.nickname}}</Option>
              </Select>
            </div>
            <!-- 其他的职能 -->
            <div v-else>
              <Select
                label-in-value
                filterable
                v-model="row.headId"
                multiple
                @on-open-change="(v)=>{setSelectValue(v,index,row)}"
                @on-change="(v)=>changeValue(v,index,'headId')"
              >
                <Option
                  v-for="person in incumbencyUserList"
                  :value="person.id"
                  :key="person.id"
                  :label="person.nickname"
                >{{person.nickname}}</Option>
              </Select>
            </div>
          </template>
          <template slot-scope="{ row, index }" slot="edit">
            <Button class="btns" @click="addRow">增加</Button>
            <Button
              class="btns"
              v-if="projectData.children.length>1"
              :disabled="index===0"
              @click="removeRow(row,index)"
            >删除</Button>
            <!-- <Button @click="log(row)">详情</Button> -->
          </template>
        </Table>
      </Form>
      <!-- 单个职能的编辑弹窗 -->
      <Form
        v-if="config.type==='dept'"
        ref="deptForm"
        :label-width="100"
        :model="deptData"
        :rules="projectValidate"
      >
        <FormItem label="名称:" prop="deptName">
          <Input v-model="deptData.deptName" :disabled="propsData.levelOrder===1"></Input>
        </FormItem>
        <FormItem label="相关人员:" prop="headId">
          <Select
            label-in-value
            v-model="deptData.headId"
            @on-change="v=>setLabel(v)"
            v-if="propsData.levelOrder===1"
          >
            <Option
              v-for="person in incumbencyUserList"
              :value="person.id"
              :key="person.id"
              :label="person.nickname"
            >{{person.nickname}}</Option>
          </Select>
          <Select
            v-else
            label-in-value
            filterable
            v-model="deptData.headId"
            @on-change="v=>setLabel(v)"
            multiple
          >
            <Option
              v-for="person in incumbencyUserList"
              :value="person.id"
              :key="person.id"
              :label="person.nickname"
            >{{person.nickname}}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'editProject',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    tbcId: {
      type: Number,
      default: -1
    },
    propsData: Object,
    incumbencyUserList: Array,
    config: Object,
    projectNameList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  mounted () {
    // 项目组新增 ，设置项目组的parentId为伪随机数
    if (this.config.title === '新增' && this.config.type === 'project') {
      this.boss.parentId = this.getRandom()
    }
    // 项目组编辑
    if (this.config.title === '编辑' && this.config.type === 'project') {
      let data = JSON.parse(JSON.stringify(this.propsData))
      // 备份传进来的数据
      this.propsDataBak = JSON.parse(JSON.stringify(this.propsData))
      // 后端传过来的负责人是个列表，只拿第一个
      data.children[0].headId = data.children[0].headId[0]
      // 重新获取负责人的值，逻辑不同
      this.boss.deptName = data.children[0].deptName
      this.boss.headId = data.children[0].headId
      this.boss.head = data.children[0].head
      this.boss.parentId = data.children[0].parentId
      this.projectData = data
    } else if (this.config.type === 'dept') {
      // 职能没有新增
      // 职能编辑
      this.deptData = this.propsData
      this.propsDataBak = JSON.parse(JSON.stringify(this.propsData))
    }
  },
  data () {
    return {
      loading: true,
      showModal: this.show,
      delList: [], // 编辑项目组，可以删除职能，记录id
      nameList: [], // 负责人以外的成员列表
      boss: {
        // 负责人
        deptName: '负责人',
        headId: '',
        head: ''
      },
      // 职能的数据
      deptData: {
        deptName: '',
        headId: [],
        head: ''
      },
      propsDataBak: {}, // 传进来的数据的备份，用于判断是否更改
      projectData: {
        deptName: '',
        children: [{ deptName: '负责人', headId: '' }]
      },
      //
      tableHeader: [
        {
          title: '职能',
          slot: 'deptName'
        },
        {
          title: '成员',
          slot: 'headId'
        },
        {
          title: '操作',
          slot: 'edit'
        }
      ],
      projectValidate: {
        // 项目组的表单验证
        deptName: [
          { required: true, message: '项目组名称必填', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              // 是否和已有的重复，但是改变了
              let hasProject =
                this.projectNameList.includes(value) &&
                value !== this.propsData.deptName
              if (hasProject) {
                callback(new Error('项目组已经存在'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    log (v) {
      console.log(v)
    },
    getRandom () {
      return -Number(
        new Date()
          .getTime()
          .toString()
          .substr(-7, 7)
      )
    },
    // 弹窗点击OK的时候
    ok () {
      // 如果是项目组
      if (this.config.type === 'project') {
        this.$refs.projectForm.validate(v => {
          if (v) {
            // 新增项目组
            if (this.config.title === '新增') {
              let projectTree = {}
              projectTree = this.addProject()
              let hasEmptyDeptName = projectTree.children.some(e => {
                // 负责人名称为空
                return !e.deptName
              })
              if (hasEmptyDeptName) {
                this.$Message.error('职能必填')
                return false
              }
              this.$emit('updataProject', projectTree)
              this.closeModal()
            } else if (this.config.title === '编辑') {
              // 编辑项目组
              let projectTree = {}
              projectTree = this.editProject()
              let hasEmptyDeptName = projectTree.children.some(e => {
                // 负责人名称为空
                return !e.deptName
              })
              if (hasEmptyDeptName) {
                this.$Message.error('职能必填')
                return false
              }
              // 除了项目组的树形结构还要删除的列表
              let data = { projectTree, delList: this.delList }
              this.$emit('updataProject', data)
              this.closeModal()
            }
          } else {
          }
        })
      } else if (this.config.type === 'dept') {
        this.$refs.deptForm.validate(v => {
          if (v) {
            // 如果是职能
            let data = JSON.parse(JSON.stringify(this.deptData))
            // 如果是刚刚新增还未保存的职能
            if (data.projectId < 0 && data.type === 'add') {
              data.type = 'add'
            } else {
              // 如果是负责人
              if (this.propsData.levelOrder === 1) {
                if (data.headId !== this.propsDataBak.headId[0]) {
                  data.type = 'edit'
                }
                // 设置成数组
                data.headId = [data.headId]
              } else {
                // 其他职能
                if (data.deptName !== this.propsDataBak.deptName) {
                  data.type = 'edit'
                }
                if (
                  JSON.stringify(data.headId) !==
                  JSON.stringify(this.propsDataBak.headId)
                ) {
                  data.type = 'edit'
                }
              }
            }
            this.$emit('updataProject', data)
            this.closeModal()
          }
        })
      }
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    // 编辑项目组的时候，新增
    addProject () {
      // 项目组的树
      let parentId = this.boss.parentId
      let projectTree = {
        parentId: 1,
        projectId: parentId,
        deptName: this.projectData.deptName, // 项目组
        type: 'add',
        level: 2,
        children: [] // 项目组下面的职能
      }
      // 职能树
      // 第一层设置为负责人
      projectTree.children.push({
        parentId: parentId,
        projectId: this.getRandom() + 7,
        deptName: '负责人',
        type: 'add',
        level: 3,
        levelOrder: 1,
        headId: this.boss.headId ? [this.boss.headId] : [], // 有则有，没有则空数组
        head: this.boss.head
      })
      // 剩下的设置为其它职能，所以从第二个开始
      for (let i = 1, l = this.projectData.children.length; i < l; i++) {
        let { deptName, headId, projectId } = this.projectData.children[i]
        let head = this.nameList[i] ? this.nameList[i].join(',') : '' // nameList是除负责人外的成员列表，允许不填
        projectTree.children.push({
          parentId,
          projectId,
          deptName,
          type: 'add',
          level: 3,
          headId,
          head
        })
      }
      return projectTree
    },
    // 编辑项目组，编辑
    editProject () {
      // 判断哪些行做了更改
      let newProjectTree = JSON.parse(JSON.stringify(this.projectData))
      let oldDeptName = this.propsDataBak.deptName
      let newDeptName = newProjectTree.deptName
      // 拷贝一份原有的，需要再带回去
      newProjectTree.children[0] = JSON.parse(
        JSON.stringify(this.propsDataBak.children[0])
      )

      // 把负责人单独拉出来，因为单独存的在boss对象里面
      newProjectTree.children[0].head = this.boss.head
      newProjectTree.children[0].headId = this.boss.headId
        ? [this.boss.headId]
        : [] // 有则有，没有则空数组
      newProjectTree.children[0].deptName = this.boss.deptName
      newProjectTree.children[0].level = 3
      // 项目组名称改变,原来的不是add
      if (oldDeptName !== newDeptName && this.propsDataBak.type !== 'add') {
        newProjectTree.type = 'edit'
      }
      // 遍历新的职能树
      for (let i = 0; i < newProjectTree.children.length; i++) {
        let newDept = newProjectTree.children[i]
        newDept.level = 3
        // 如果id是伪id，就是新增的
        if (newDept.projectId < 0) {
          newDept.type = 'add'
        } else {
          // 遍历旧职能列表
          for (let j = 0; j < this.propsDataBak.children.length; j++) {
            let oldDept = this.propsDataBak.children[j]
            // 新老数组里都有的id
            if (oldDept.projectId === newDept.projectId) {
              // 职能名称发送改变
              if (oldDept.deptName !== newDept.deptName) {
                newDept.type = 'edit'
              }
              // 职能成员发送改变
              if (
                JSON.stringify(oldDept.headId) !==
                JSON.stringify(newDept.headId)
              ) {
                newDept.type = 'edit'
              }
            }
          }
        }
      }
      // 设置nameList,负责人之外的姓名列表
      for (let j = 1; j < newProjectTree.children.length; j++) {
        newProjectTree.children[j].head = this.nameList[j]
          ? this.nameList[j].join(',')
          : ''
      }
      return newProjectTree
    },
    // 编辑项目组的时候，新增一行职能
    addRow () {
      // 设置伪id
      let projectId = this.getRandom()
      this.projectData.children.push({
        deptName: '',
        headId: [],
        type: 'add',
        level: 3,
        parentId: this.boss.parentId,
        projectId: projectId
      })
    },
    // 编辑项目组的时候，删除一行职能
    removeRow (row, rowNum) {
      // 只有是已过白的职能删除才会记录id
      if (row.projectId > 0) {
        this.delList.push(row.projectId)
      }
      this.projectData.children.splice(rowNum, 1)
    },
    // 编辑项目组，下拉框收起的时候，设置下拉框的值到原绑定的数组
    setSelectValue (v, index, row) {
      if (!v) {
        this.projectData.children[index].headId = row.headId
      }
    },
    // 编辑项目组的时候,职能发生改变的时候，改变姓名列表
    changeValue (row, index, key) {
      // 输入框失焦的时候设置值到原数组
      if (key === 'deptName') {
        this.projectData.children[index].deptName = row[key]
      } else if (key === 'headId') {
        // 下拉框on-change的时候获取姓名label的列表
        this.nameList[index] = row.map(e => {
          return e.label
        })
      }
    },
    // 编辑职能的时候，获取label
    setLabel (v) {
      let isArr = Array.isArray(v)
      if (isArr) {
        this.deptData.head = v
          .map(e => {
            return e.label
          })
          .join()
      } else {
        this.deptData.head = v.label
      }
    },
    // 关闭编辑弹窗
    closeModal () {
      this.$emit('update:show', false)
    }
  },
  watch: {
    show: {
      handler (newVal) {
        this.showModal = newVal
      },
      immediate: true
    }
  }
}
</script>
