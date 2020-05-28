<template>
  <div>
    <vxe-table
      border
      column-min-width="10%"
      :resizable="false"
      ref="xTree"
      row-id="id"
      :loading="loading"
      :data="tableData"
      show-overflow
      highlight-hover-row
      header-row-class-name="header-row"
      header-cell-class-name="header-cell"
      align="center"
      :tree-config="{children: 'children', expandRowKeys: [1], iconOpen: 'fa fa-minus-square-o', iconClose: 'fa fa-plus-square-o'}">
      <vxe-table-column field="typeFormworkName" title="分类" width="120px">
        <template slot-scope="scope" field="typeFormworkName">
          <div v-if="scope.level === 0">
            {{scope.row.typeFormworkName}}
          </div>
        </template>
      </vxe-table-column>
      <vxe-table-column field="name" title="工作事项" tree-node align="left" header-align="center"></vxe-table-column>
      <vxe-table-column field="rateContent" title="频率"></vxe-table-column>
      <vxe-table-column field="startTime" title="开始时间"></vxe-table-column>
      <!-- <vxe-table-column field="progress" title="进度"></vxe-table-column> -->
      <vxe-table-column field="jobRequire" title="工作要求"></vxe-table-column>
      <vxe-table-column field="mark" title="备注"></vxe-table-column>
    </vxe-table>
  </div>
</template>

<script>

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
      tableData: this.data
    }
  },
  created () {
    // this.tableData = window.MOCK_TREE_DATA_LIST.slice(0)
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
