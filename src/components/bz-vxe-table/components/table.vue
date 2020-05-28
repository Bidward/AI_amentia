<template >
  <vxe-table
    ref="vxeTable"
    class="bz-vxe-table"
    border
    show-overflow
    show-header-overflow
    show-footer-overflow
    highlight-hover-row
    :height="height"
    :data="data"
    align="center"
    @sort-change="sortChange"
    :sort-config="sortConfig"
    auto-resize
  >
    <template v-for="(col,index) in columns">
      <vxe-table-column
        :key="col.key"
        :field="col.key"
        :title="col.title"
        :width="col.width"
        :minWidth="col.minWidth"
        :type="col.type&&typeTransfer(col.type)"
        :sortable="col.sortable==='custom'"
        :align="col.align"
        :fixed="col.fixed||null"
      >
        <!-- 自定义渲染表头 -->
        <template v-if="typeof col.renderHeader==='function'" v-slot:header="scope">
          <renderTemplate :render="col.renderHeader" :scope="scope" />
        </template>
        <!-- 自定义渲染表格内容 -->
        <template v-if="typeof col.render==='function'&&!col.type" v-slot:default="scope">
          <renderTemplate :render="col.render" :scope="scope" :index="index" />
        </template>
      </vxe-table-column>
    </template>
  </vxe-table>
</template>

<script>
import vue from 'vue'
import 'xe-utils'
import VXETable from 'vxe-table'
vue.use(VXETable)
// 渲染的纯函数
const renderTemplate = {
  name: 'renderTemplate',
  functional: true,
  props: {
    render: Function,
    index: Number,
    scope: Object
  },
  render: (h, ctx) => {
    const { row, column } = ctx.props.scope
    column.key = column.property
    const index = ctx.props.scope.rowIndex
    const params = { row, column, index }
    return ctx.props.render(h, params)
  }
}

export default {
  name: 'bz-vxe-table',
  components: {
    renderTemplate
  },
  props: {
    columns: Array,
    data: Array,
    height: {
      type: [String, Number],
      default: '100%'
    },
    sortConfig: {
      type: Object,
      default () {
        return { remote: true }
      }
    }
  },
  methods: {
    sortChange (data) {
      const { order, field: key } = data
      this.$emit('on-sort-change', { order, key })
    },
    typeTransfer (type) {
      if (type === 'selection') {
        return 'checkbox'
      } else if (type === 'index') {
        return 'seq'
      } else {
        return null
      }
    }
  }
}
</script>

<style lang="less">
.bz-vxe-table {
  @import "~vxe-table/lib/index.css";
  &.vxe-table {
    font-size: 12px;
    .vxe-cell {
      padding: 0 7px;
    }
    .vxe-body--column:not(.col--ellipsis),
    .vxe-footer--column:not(.col--ellipsis),
    .vxe-header--column:not(.col--ellipsis) {
      padding: 8px 0;
    }
    .vxe-cell--sort .vxe-sort--asc-btn.sort--active,
    .vxe-cell--sort .vxe-sort--desc-btn.sort--active {
      color: #19aa8d;
    }
  }
}
</style>
