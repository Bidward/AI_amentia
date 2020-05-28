<template>
  <div class="dptTable">
    <spin fix v-if="loading" style="margin-top: 2px"></spin>
    <el-table
      :data="listData && listData"
      :span-method="objectSpanMethod"
      :header-cell-style="headerStyle"
      empty-text="暂无数据"
      class="tableArea"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="focus"
        label=""
        align="center"
        width="60"
      >
        <template slot-scope="scope">
          <div>
            <Tooltip :transfer="true" placement="top" :content="scope.row.tasksFocus ? '取消关注' : '关注任务'">
              <Icon
                :type="scope.row.tasksFocus ? 'ios-star' : 'ios-star-outline'"
                style="color: red; fontSize: 18px; cursor: pointer;"
                @click="() => focusTask(scope)"
              >
              </Icon>
            </Tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="count"
        label="序号"
        align="center"
        width="60"
      />
      <el-table-column
        prop="deptName"
        label="部门"
        align="center"
      >
        <template slot-scope="scope">
          <div>
            {{scope.row.deptName}}
          </div>
        </template>
        <template slot="header" slot-scope="scope">
          <span v-popover:depart class="pointer">
            {{scope.column.label}}
            <Icon type="md-search" size="14" :class="fields.deptId ? '' : 'off'" />
            <!-- <i class="el-icon-search" style="font-size: 8px; cursor: pointer;"></i> -->
          </span>
          <el-popover
            placement="bottom"
            ref="depart"
            trigger="click"
            width="230"
          >
            <el-select
              clearable
              no-match-text="无数据"
              placeholder="请选择部门"
              style="margin: 0;"
              v-model="fields.deptId"
              filterable
              size="small"
              @change="change"
            >
              <el-option
                :key="item.id"
                v-for="item in treeData"
                :label="item.title"
                :value="item.id">
              </el-option>
            </el-select>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="任务名称"
        align="center"
        minWidth="150"
      >
        <template slot-scope="scope">
          <span class="taskTitle">
            <a @click="checkDetail(scope.row)">{{scope.row.name}}</a>
          </span>
        </template>
        <template slot="header" slot-scope="scope">
          <span v-popover:name class="pointer">
            {{scope.column.label}}
            <Icon type="md-search" size="14" :class="fields.name ? '' : 'off'" />
            <!-- <i class="el-icon-search" style="fontSize: 8px; cursor: pointer;"></i> -->
          </span>
          <el-popover
            placement="bottom"
            width="200"
            trigger="click"
            ref="name"
          >
            <Input
              placeholder="任务名称"
              style="width:170px; padding: 0; margin: 0"
              suffix="ios-search"
              clearable
              search
              v-model="fields.name"
              @on-search="change"
            />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="taskLevel"
        label="任务等级"
        align="center"
        width="100"
      >
        <template slot="header" slot-scope="scope">
          <span v-popover:department class="pointer">
            {{scope.column.label}}
            <Icon type="md-search" size="14" :class="fields.taskLevel ? '' : 'off'" />
            <!-- <i class="el-icon-search" style="fontSize: 8px; cursor: pointer;"></i> -->
          </span>
          <el-popover
            placement="bottom"
            width="230"
            trigger="click"
            ref="department"
            >
            <el-select
              v-model="fields.taskLevel"
              clearable
              placeholder="任务等级"
              style="margin: 0; text-align: center"
              size="small"
              @change="change"
              >
              <el-option
                style="text-align: center;"
                v-for="level in taskLevels"
                :key="level.tasksLevelName"
                :label="level.tasksLevelName"
                :value="level.tasksLevelId"
                >
              </el-option>
            </el-select>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="acceptName"
        label="接收人"
        align="center"
        width="100"
      >
        <template slot="header" slot-scope="scope">
          <span v-popover:accept class="pointer">
            {{scope.column.label}}
            <Icon type="md-search" size="14" :class="fields.acceptUid ? '' : 'off'"/>
            <!-- <i class="el-icon-search" style="fontSize: 8px; cursor: pointer;"></i> -->
          </span>
          <el-popover
            placement="bottom"
            width="230"
            trigger="click"
            ref="accept"
            >
            <el-select
              v-model="fields.acceptUid"
              clearable
              placeholder="接收人"
              style="margin: 0; text-align: center"
              size="small"
              @change="change"
              >
              <el-option
                v-for="employee in employees"
                :key="employee.id"
                :label="employee.nickname"
                :value="employee.id"
                >
                    <div>{{employee.nickname}}</div>
                    <!-- <div>部门:{{employee.deptName && employee.deptName}}</div>
                    <div>职位:{{employee.positionName && employee.positionName}}</div> -->
              </el-option>
            </el-select>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="taskStatus"
        label="任务状态"
        align="center"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="type"
        label="任务类型"
        align="center"
        width="100">
      </el-table-column>
      <el-table-column
        prop="tasksTimeStartToEnd"
        label="时间"
        align="center"
        width="100">
        <template slot-scope="scope">
          <p>{{scope.row.sendTime}}</p>
          <span>~</span>
          <p>{{scope.row.endTime}}</p>
        </template>
        <template slot="header" slot-scope="scope">
          <span v-popover:time class="pointer">
            {{scope.column.label}}
            <Icon type="md-search" size="14" :class="fields.taskInfoEndDate ? '' : 'off'" />
            <!-- <i class="el-icon-search" style="font-size: 8px; cursor: pointer;"></i> -->
          </span>
          <el-popover
            placement="bottom"
            width="230"
            trigger="click"
            ref="time"
            >
            <DatePicker
               clearable
               type="daterange"
               confirm placement="bottom"
               placeholder="请选择时间"
               :transfer="false"
               style="width: 200px"
               @on-change="changeTime"
               @on-ok="change"
               @on-clear="clearTime"
               ></DatePicker>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="280"
        >
        <template slot-scope="scope">
          <list-buttons :row="scope.row"></list-buttons>
        </template>
      </el-table-column >
    </el-table>

  </div>
</template>
<script>
import ElementUI from 'element-ui'
import Vue from 'vue'
import i18n from '@/locale'
import 'element-ui/lib/theme-chalk/index.css'
import ListButtons from './list-buttons'
import { baseUrl } from '@/api/base.js'
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
export default {
  name: '',
  components: {
    ListButtons
  },
  props: {
    employees: {
      type: Array
    },
    taskLevels: {
      type: Array
    },
    taskStatus: {
      type: Array
    },
    rowData: {
      type: Array,
      default () {
        return []
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
  data () {
    return {
      rowList: [],
      spanArr: [],
      position: 0,
      listData: [],
      load: this.loading,
      treeData: [],
      fields: {
        taskLevel: '', // 任务等级
        taskStatus: null, // 任务状态
        name: '', // 任务名称
        deptId: '', // 时间范围
        sendUid: '', // 发起人id
        sendName: '', // 发起人姓名
        acceptUid: '', // 接收人id
        acceptName: '', // 接受人姓名
        executeUid: '', // 执行人id
        executeName: '', // 执行人姓名
        taskInfoStartDate: '', // 开始时间
        taskInfoEndDate: '', // 结束时间
        searchType: 0
      },
      // 将搜索条件深拷贝一份，防止子组件修改相关属性父组件传入的值也被修改
      pageInfo: JSON.parse(JSON.stringify(this.page)),
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        },
        {
          id: 4,
          label: '二级 2-1',
          children: [{
            id: 9,
            label: '三级 1-2-1'
          }, {
            id: 10,
            label: '三级 1-2-2'
          }]
        }
        ]
      }]
    }
  },
  created () {
    this.getPositionData()
  },
  methods: {
    // 查看祥情
    checkDetail (row) {
      // this.$router.push('/task/detail/' + row.id)
      this.$router.push({ name: 'taskDetail', params: { id: row.id } })
    },
    // 计算合并的row-span和col-span
    rowspan () {
      this.spanArr = []
      this.listData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1)
          this.position = 0
          item.count = 1
        } else {
          if (this.listData[index].deptId === this.listData[index - 1].deptId) {
            this.spanArr[this.position] += 1
            this.spanArr.push(0)
            item.count = this.spanArr[this.position]
          } else {
            this.spanArr.push(1)
            this.position = index
            item.count = this.spanArr[this.position]
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
    },
    // 表头样式
    headerStyle ({ row, column, rowIndex }) {
      return {
        color: '#19aa8d',
        'font-size': '12px',
        'box-shadow': 'none',
        'background': '#f8f8f9',
        'padding': '9px 0'
      }
    },
    // 关注任务
    focusTask (params) {
      let data = {
        taskId: params.row.id,
        isFocus: !params.row.tasksFocus
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
    },

    // 获取职位列表
    getPositionData () {
      this.$axios({
        url: baseUrl + '/structure/init',
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.treeData = res.data.content.deptTreeList
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    // 表头字段新值传到父组件
    change (value) {
      // console.log(this.fields, 'fields')
      this.$emit('params', this.fields)
    },
    clearTime () {
      this.fields.taskInfoStartDate = ''
      this.fields.taskInfoEndDate = ''
      this.change()
    },
    changeTime (timeRange, dataType) {
      this.fields.taskInfoStartDate = timeRange[0]
      this.fields.taskInfoEndDate = timeRange[1]
      // console.log(timeRange,dataType)//[开始时间,结束时间] data
    }
  },
  watch: {
    rowData (newVal) {
      this.listData = newVal
      this.$nextTick(() => {
        this.rowspan()
      })
    },
    loading (newVal) {
      this.load = newVal
    }
  }
}
</script>
<style lang="less">
@import '~@/assets/style/variables.less';
.taskTitle {
  // border: 1px solid green;
  position: relative;
  a {
    color: #515a6e;
    &:after {
      content: '';
      display: block;
      left: 50%;
      right: 0;
      bottom: 0px;
      height: 1px;
      width: 0;
      position: absolute;
      transition: all .3s linear;
      background: @color-theme-green;
    }
    &:hover {
      color: @color-theme-green;
      &:after {
        left: 0;
        width: 100%;
      }
    }
  }
}
.el-table--enable-row-hover .el-table__body tr:hover>td{
  background-color: @color-bg-hover !important;
}
.el-input__inner:focus {
  border: 1px solid @color-theme-green !important;
}
// .is-focus {
//   border: 1px solid @color-theme-green;
// }
.height-control {
  .el-select-dropdown__item {
    height: 102px;
    font-size: 12px;
  }
}
.dptTable {
  margin-bottom: 10px;
  position: relative;
}
.pointer {
    .off {
        color: #909399;
    }
}
</style>
