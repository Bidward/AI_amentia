<!-- 职责表格 -->
<template>
  <div style="display: flex">
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :indent="32"
      default-expand-all
      empty-text="暂无数据"
      :span-method="objectSpanMethod"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="item"
        label="工作事项"
        width="180">
        <template slot-scope="scope">
          <!-- <span>kkkk</span> -->
          <input type="text" style="width: 100px; border: none;" v-model="scope.row.item" @change="(e) => editItem(e, scope)"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="frequency"
        label="频率">
        <template slot-scope="scope">
          <div v-if="scope.row.isAddSub" style="border-bottom: 1px solid #333; height: 30px;"></div>
        </template>
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="开始时间">
        <template slot-scope="scope">
          <div v-if="scope.row.isAddSub" style="border-bottom: 1px solid #333; height: 30px;"></div>
        </template>
      </el-table-column>
      <el-table-column
        prop="requirement"
        label="工作要求">
        <template slot-scope="scope">
          <div v-if="scope.row.isAddSub" style="border-bottom: 1px solid #333; height: 30px;"></div>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注">
        <template slot-scope="scope">
          <div v-if="scope.row.isAddSub" style="border-bottom: 1px solid #333; height: 30px;"></div>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="分类"
        width="180"
        >
      </el-table-column>
      <el-table-column
        prop="operate"
        label="操作">
        <template slot-scope="scope">
          <Button type="primary" v-if="scope.row && scope.row.id.indexOf('p') > -1" size="small" @click="addSubItem(scope)">
            {{scope.row.operate}}
          </Button>
          <Button type="error" v-if="scope.row && scope.row.id.indexOf('s') > -1" size="small" @click="delSubItem(scope)">
            删除
          </Button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import i18n from '@/locale'
import ElementUI from 'element-ui'
import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
export default {
  components: {},
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
      tableData: this.data,
      position: 0

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
  },

  mounted () {
    this.children = {
      id: '',
      item: '',
      frequency: '',
      startTime: '',
      requirement: '',
      operate: '',
      type: '公共事项'
    }
    this.uUid = 0
  },

  methods: {
    editItem (e, scope) {
      console.log(e.target.value)
      console.log(scope)
      console.log(this.tableData)
    },
    addSubItem (scope) {
      this.uUid++
      // console.log(this.tableData)
      // console.log(scope, 'scope')
      let id = scope.row.id
      let index = this.findIndexById(id, this.tableData)
      if (!this.tableData[index].children) {
        this.$set(this.tableData[index], 'children', [])
      }
      this.tableData[index].children.push(JSON.parse(JSON.stringify({ ...this.children, id: 's' + this.uUid, isAddSub: true, pid: this.tableData[index].id })))
    },
    delSubItem (scope) {
      // console.log(scope)
      let pIndex = this.findIndexById(scope.row.pid, this.tableData)
      let sIndex = this.findIndexById(scope.row.id, this.tableData[pIndex].children)
      // console.log(pIndex, sIndex)
      this.tableData[pIndex].children.splice(sIndex, 1)
    },
    findIndexById (id, array) {
      return array.findIndex(item => {
        if (item.children) {
          this.findIndexById(id, item.children)
        }
        return item.id === id
      })
    },
    // 计算合并的row-span和col-span
    rowspan () {
      this.spanArr = []
      this.tableData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1)
          this.position = 0
          // item.count = 1
        } else {
          if (this.tableData[index].deptId === this.tableData[index - 1].deptId) {
            this.spanArr[this.position] += 1
            this.spanArr.push(0)
            // item.count = this.spanArr[this.position]
          } else {
            this.spanArr.push(1)
            this.position = index
            // item.count = this.spanArr[this.position]
          }
        }
      })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) { // 表格合并行
      if (columnIndex === 2) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    }
  },

  computed: {}
}
</script>

<style lang='less' scoped>
</style>
