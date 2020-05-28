<template>
    <treeselect
        clearAllText="清空"
        noResultsText="暂无数据"
        placeholder="请选择"
        :maxHeight="200"
        :multiple="true"
        :options="options"
        :default-expand-level="defaultExpandLevel"
        v-model="people"
        :load-options="loadOptions"
        :value-consists-of="valueConsistsOf"
        :value="getIds(optionsProps)"
        :flattenSearchResults="flattenSearchResults"
        :backspaceRemoves="false"
        @select="(node, nodeId) => handleSelect(node)"
        @deselect="(node, nodeId) => handleDeselect(node)"
        :beforeClearAll="() => handleClearAll()"
        ref="treeSelect"
        />
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { baseUrl } from '@/api/base.js'
export default {
  name: 'TreeSelectT',
  components: { Treeselect },
  data () {
    return {
      deptNames: [],
      people: []
    }
  },
  props: {
    flattenSearchResults: {
      type: Boolean,
      default () {
        return true
      }
    },
    defaultExpandLevel: {
      type: Number,
      default () {
        return 1
      }
    },
    valueConsistsOf: {
      type: String,
      default () {
        return 'BRANCH_PRIORITY' // 默认是父级优先
      }
    },
    modalData: {
      type: Array,
      default () {
        return []
      }
    },
    // 选框的初始数据
    optionsProps: {
      type: Array,
      default () {
        return []
      }
    },
    // 要添加的选项
    addLabel: {
      type: Array,
      default () {
        return []
      }
    }
  },
  watch: {
    modalData (newV) {
      this.people = JSON.parse(JSON.stringify(this.modalData))
    }
  },
  created () {
    this.getDeptInfo()
  },
  computed: {
    // 将部门数据结构改为同一层级
    flatDeptNames () {
      let flat = []
      if (this.deptNames.length > 0) {
        flat = this.flatTree(this.deptNames, flat)
      }
      flat.some(item => {
        if (item.id === 'dpt1') {
          item.pid = null
        }
      })
      return flat
    },
    // 合并部门和人员信息
    employeesAndDept () {
      let labelEmployee = this.optionsProps.map(employee => {
        return { ...employee, label: employee.nickname, pid: 'dpt' + employee.pid }
      })
      this.addLabel.map(item => {
        labelEmployee.push(item)
      })
      return [ ...this.flatDeptNames, ...labelEmployee ]
    },
    options () {
      return this.getTree(this.employeesAndDept)
    }
  },
  methods: {
    // 获取纯子节点
    getLeaf (nodes, arr) {
      nodes.children.forEach(node => {
        if (node.children) {
          this.getLeaf(node, arr)
        } else {
        //   arr.push({ id: node.id, name: node.label })
          arr.push(node.id)
        }
      })
    },
    findId (arr) {
      let newArr = []
      arr.map(item => {
        newArr.push(item.id)
        console.log(newArr)
        return newArr
      })
    },
    // 删除子节点
    removeLeaf (nodes) {
      nodes.children.forEach(node => {
        if (node.children) {
          this.removeLeaf(node)
        } else {
          let index = this.findIndexById(node.id, this.people)
          if (index >= 0) {
            this.people.splice(index, 1)
          }
        }
      })
    },
    // 根据id获取index
    findIndexById (id, arr) {
      return arr.findIndex((value, index) => {
        return value.id === id
      })
    },
    // 选择某个节点
    handleSelect (nodes) {
      // console.log("选择某个节点", nodes)
      let select = []
      if (nodes.children) {
        this.getLeaf(nodes, select)
      } else {
        // select = [{ id: nodes.id, name: nodes.label }]
        select = [nodes.id]
      }
      this.people = [...this.people, ...select]
      this.$emit('treeSelect', this.people)
    //   let $select = this.$refs['receiverSelect']
    //   console.log($select)
    //   $select.resetSearchQuery('')
    },
    // 取消勾选
    handleDeselect (nodes) {
      // console.log("取消勾选", nodes)
      // 如果该节点有子节点 删除子节点
      if (nodes.children) {
        if (nodes.id === 'dpt1') {
          this.people = []
          this.$emit('treeSelect', this.people)
        } else {
          this.removeLeaf(nodes)
        }
      } else {
        // 否则删除该节点
        let index = this.findIndexById(nodes.id, this.people)
        this.people.splice(index, 1)
        this.$emit('treeSelect', this.people)
      }
    },
    // 点击清除按钮
    handleClearAll () {
      // console.log("清除按钮")
      this.people = []
      this.$emit('treeSelect', this.people)
      return true
    },
    async loadOptions () {},
    // 获取部门信息
    getDeptInfo () {
      this.$axios({
        url: baseUrl + '/Structure/findStructureByCondition',
        method: 'post'
      })
        .then(res => {
        // console.log(res, 'res')
          if (res.data.code === 10000) {
            this.deptNames = res.data.content
          // console.log(this.deptNames, 'deptNames')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 展开树形数据结构
    flatTree (tree, flat) {
      tree.forEach(node => {
        flat.push({ id: 'dpt' + node.id, label: node.deptName, pid: 'dpt' + node.parentId })
        if (node.children.length) {
          this.flatTree(node.children, flat)
        }
      })
      return flat
    },
    // 格式化后台数据为树形数据结构
    getTree (data = [], id, pid = null) {
      const children = []
      for (const i in data) {
        const node = data[i]
        if (((!pid && !node.pid) || node.pid === pid) && node.id !== id) {
          children.push({
            id: node.id,
            value: node.id + '',
            label: node.nickname,
            children: this.getTree(data, id, node.id),
            ...node
          })
        }
      }
      return children.length ? children : undefined
    },
    // 获取人员的id,用于绑定
    getIds (array) {
      if (!array) return
      return array.map(item => {
        return item.id
      })
    }
  }
}
</script>

<style lang="less">
  @import '~@/assets/style/variables.less';
  .v-transfer-dom{
    position: relative;
    z-index: 10;
  }
  /**treeselect样式覆盖 */
  .vue-treeselect__menu-container>div{
    z-index: 20;
  }
  .vue-treeselect__value-remove{
    display: none;
  }
  .vue-treeselect--focused:not(.vue-treeselect--open) .vue-treeselect__control {
      border-color: @color-theme-green;
      // box-shadow: 0 0 0 3px rgba(3, 155, 229, 0.1);
    }
    .vue-treeselect__multi-value-item {
      color: @color-theme-green;
    }
    .vue-treeselect:not(.vue-treeselect--disabled) .vue-treeselect__multi-value-item:not(.vue-treeselect__multi-value-item-disabled):hover .vue-treeselect__multi-value-item:not(.vue-treeselect__multi-value-item-new) .vue-treeselect__multi-value-item:not(.vue-treeselect__multi-value-item-new):hover {
      color: @color-theme-green;
    }
    .vue-treeselect__label-container:hover .vue-treeselect__checkbox--unchecked {
      border-color: @color-theme-green;

    }
    .vue-treeselect__checkbox--indeterminate {
      border-color: @color-theme-green;
      background: @color-theme-green;
    }
    .vue-treeselect__label-container:hover .vue-treeselect__checkbox--indeterminate {
      border-color: @color-theme-green;
      background: @color-theme-green;
    }
    .vue-treeselect__checkbox--checked {
      border-color: @color-theme-green;
      background: @color-theme-green;
    }
    .vue-treeselect__label-container:hover .vue-treeselect__checkbox--checked {
      border-color: @color-theme-green;
      background: @color-theme-green;
    }
    .vue-treeselect__error-tip .vue-treeselect__retry {
      color: @color-theme-green;
    }
    .vue-treeselect__icon-loader::before {
      background: @color-theme-green;
    }
    .pre {
      font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","\5FAE\8F6F\96C5\9ED1",Arial,sans-serif;
    }
</style>
