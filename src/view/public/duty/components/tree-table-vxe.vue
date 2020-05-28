<template>
  <div>
    <vxe-table
      border
      ref="xTree"
      row-id="id"
      :loading="loading"
      :data="tableData"
      align="center"
      highlight-hover-row
      :tree-config="treeConfig"
      header-row-class-name="header-row"
      header-cell-class-name="header-cell"
    >
      <vxe-table-column
        field="typeFormworkName"
        title="类型"
        width="120px"
      >
        <template
          slot-scope="scope"
          field="typeFormworkName"
        >
          <div v-if="scope.level === 0">
            {{scope.row.typeFormworkName}}
          </div>
        </template>
      </vxe-table-column>
      <vxe-table-column field="formworkConfigName" title="模块"></vxe-table-column>
      <vxe-table-column field="name" title="工作事项" tree-node align="left" header-align="center"></vxe-table-column>
      <vxe-table-column field="rateContent" title="频率"></vxe-table-column>
      <vxe-table-column field="startTime" title="开始时间"></vxe-table-column>
      <vxe-table-column field="jobRequire" title="工作要求"></vxe-table-column>
      <vxe-table-column field="mark" title="备注"></vxe-table-column>
      <vxe-table-column field="operate" title="操作" width="250px">
        <template slot-scope="scope">
          <div class="btns">
            <!-- main title -->
            <Button
              class="opButton"
              type="primary"
              :size="size"
              @click="edit(scope)"
              >
              编辑
            </Button>
            <Button
              class="opButton"
              type="error"
              v-if="scope && scope.level === 0"
              @click="delMainItem(scope)"
              :size="size"
              >
              删除
            </Button>
            <Button
              class="opButton"
              type="error"
              v-if="scope && scope.level === 1"
              @click="delSubItem(scope)"
              :size="size"
              >
              删除
            </Button>
            <Button
              class="opButton"
              type="primary"
              @click="addSubItem(scope)"
              v-if="scope && scope.level === 0"
              :size="size"
              >添加子项
            </Button>
          </div>
        </template>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
import { dClone } from '@/assets/js/tools'

import Vue from 'vue'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
Vue.use(VXETable)

export default {
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      loading: false,
      show: this.showSpin,
      tableData: this.data,
      removeList: [],
      size: 'default',
      expand: [62],
      treeConfig: {
        children: 'children',
        // expandAll: true,
        // expandRowKeys: [62],
        iconOpen: 'fa fa-minus-square-o',
        iconClose: 'fa fa-plus-square-o'
      }
    }
  },

  created () {
    this.children = {
      id: 1,
      name: '',
      rateCotent: '',
      rateType: 1,
      startTime: '',
      jobRequire: '',
      mark: ''
    }
    this.uUid = 0
  },

  methods: {
    addSubItem (scope) {
      this.uUid++
      let id = scope.row.id
      let index = this.findIndexById(id, this.tableData)
      if (!this.tableData[index].children) {
        this.$set(this.tableData[index], 'children', [])
      }
      let subItem = dClone({ ...this.children, id: 's' + this.uUid, isAddSub: true, oneTagId: this.tableData[index].id, type: this.tableData[index].type })
      this.tableData[index].children.push(subItem)

      // 点击添加子行父行展开
      this.$refs.xTree.setTreeExpansion([scope.row], true)
      this.$emit('show-sub-modal', subItem)
    },
    delSubItem (scope) {
      // console.log(scope)
      let isAdd = scope.row.isAddSub
      let pIndex = this.findIndexById(scope.row.oneTagId, this.tableData)
      let sIndex = this.findIndexById(scope.row.id, this.tableData[pIndex].children)
      if (!isAdd) {
        this.$axios({
          url: baseUrl + '/station/delTag',
          method: 'post',
          data: $qs.stringify({ oneTagId: scope.row.oneTagId, twoTagId: scope.row.id })
        })
          .then(res => {
            // console.log(res)
            if (res.data.code === 10000) {
              this.$Message.success('删除成功！')
              // 从数据库删除后删除本地数据
              this.tableData[pIndex].children.splice(sIndex, 1)
            } else {
              this.$Message.error(res.data.code)
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.tableData[pIndex].children.splice(sIndex, 1)
      }
    },
    // 删除一级工作事项
    delMainItem (scope) {
      // console.log(scope)
      let isAdd = scope.row.isAddMain
      let index = this.findIndexById(scope.row.id, this.tableData)
      let params = { oneTagId: this.tableData[index].id }
      if (!isAdd) {
        this.$axios({
          url: baseUrl + '/station/delTag',
          method: 'post',
          data: $qs.stringify(params)
        })
          .then(res => {
            // console.log(res)
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.$emit('update')
            } else {
              this.$Message.error(res.data.msg)
            }
          })
      } else {
        this.tableData.splice(index, 1)
      }
    },
    findIndexById (id, array) {
      return array.findIndex(item => {
        if (item.children) {
          this.findIndexById(id, item.children)
        }
        return item.id === id
      })
    },
    edit (scope) {
      this.$emit('edit', scope)
    }
  },

  watch: {
    data: {
      handler (newVal) {
        if (newVal) {
          this.tableData = newVal
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="less">
@import '~@/assets/style/variables.less';
  .header-cell {
    color: @color-theme-green;
  }
  .vxe-table {
    .vxe-body--row {
      &.row--hover {
        background-color: @color-bg-hover;
      }
    }
  }
</style>

<style lang="less" scoped>
.btns {
    text-align: left;
}
</style>
