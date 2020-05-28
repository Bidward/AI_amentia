<template>
  <div class="bz-table">
    <Table
      border
      ref="selection"
      :columns="columns"
      :data="rowData"
      :loading="loadingStatus"
    >
      <!-- @on-row-dblclick="handleRowClick" -->
      <template
        slot-scope="{ row, index }"
        slot="action"
      >
        <list-buttons-monthly
          v-if="name == 'taskMonthly'"
          :row="row"
        >
        </list-buttons-monthly>
        <list-buttons-pending
          v-else-if="name == 'taskPending'"
          :row="row">
        </list-buttons-pending>
        <list-buttons
          @click="handleClick"
          :row="row"
          v-else>
        </list-buttons>
      </template>
    </Table>
    <div class="tableFooter">
      <Page
        :total="pageInfo.totalCount"
        :page-size="pageInfo.pageSize"
        :current="pageInfo.currentPage"
        size="small"
        show-total
        show-sizer
        show-elevator
        @on-change="currentPageChange"
        @on-page-size-change="pageSizeChange"
        class="tablePages"
      />
    </div>
  </div>
</template>

<script>
import ListButtons from './list-buttons'
import ListButtonsMonthly from './list-buttons-monthly'
import ListButtonsPending from './list-buttons-pending'
import { baseUrl } from '@/api/base'
import { buttonMixin } from '@/assets/js/mixins.js'
export default {
  name: 'bz-table',
  mixins: [buttonMixin],
  components: {
    ListButtons,
    ListButtonsMonthly,
    ListButtonsPending
  },
  props: {
    rowData: {
      type: Array,
      default () {
        return [{
          index: '',
          taskName: '',
          time: '',
          promoter: '',
          receiver: '',
          executor: '',
          taskGrade: '',
          taskStatus: '',
          focus: null
        }]
      }
    },
    searchCondition: {
      type: Object,
      default () {
        return {}
      }
    },
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    page: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  mounted () {
  },
  data () {
    return {
      loadingStatus: this.loading,
      // 将搜索条件深拷贝一份，防止子组件修改相关属性父组件传入的值也被修改
      pageInfo: JSON.parse(JSON.stringify(this.page))
    }
  },
  methods: {
    // 关注任务
    focusTask (index, params) {
      let data = {
        taskId: params.row.id,
        isFocus: params.row.focus
      }
      this.$axios({
        url: baseUrl + '/tasks/focus',
        data: $qs.stringify(data),
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          // 只要成功走这里，无论取消或者关注
          this.$Message.success(res.data.msg)
          params.row.tasksFocus = !params.row.tasksFocus
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 改变当前页码
    currentPageChange (current) {
      this.$emit('current-page', current)
    },
    // 改变每页条数
    pageSizeChange (pageSize) {
      this.$emit('page-size', pageSize)
      sessionStorage.setItem('page-size', pageSize)
    },
    // 点击表格行
    handleRowClick (row, index) {
      this.$router.push({ name: 'taskDetail', params: { id: row.id } })
    },
    handleClick () {
      this.$emit('click')
    }
  },
  watch: {
    loading (newVal) {
      this.loadingStatus = newVal
    },
    page: {
      handler (newVal) {
        this.pageInfo = newVal
      },
      deep: true
    }
  },
  computed: {
    name () {
      return this.$route.name
    }
  }

}
</script>

<style lang="less" scoped>
  @import '~@/assets/style/variables.less';
  // @media screen and (min-width: 1024px) {
  //   // 分辨率缩放需要出现滚动条所以注释掉
  //   .bz-table /deep/ .ivu-table-overflowX {
  //     // overflow-x: hidden !important;
  //   }
  // }
  .bz-table /deep/ .ivu-table {
    width: 100%;
  }
  .bz-table-phone /deep/ .ivu-table-overflowX {
    overflow-x: scroll
  }
  .bz-table /deep/ .ivu-table-header {
    color: @color-theme-green;
  }
  .bz-table /deep/ .ivu-table-tbody {
    .ivu-table-cell {
      // padding: 0 10px;
      display: inline-block;
      text-align: center;
      span {
        display: block;
        text-align: left;
        padding: 0 2px;
      }
    }
  }
  .bz-table /deep/ .ivu-table-tbody  {
    // display: flex;
    // border: 1px solid green;
    .ivu-table-column-center {
      padding-top: 8px;
    }
  }
  .list-btn {
    margin: 10px;
  }
</style>
