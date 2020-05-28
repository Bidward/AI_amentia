<template>
  <div class="viewWrapper" style="overflow:hidden">
    <div class="level-three clearfix">
      <Button @click="addDept" type="primary">新增主部门</Button>
      <div class="searchbar">
        <Input
          @on-search="()=>{detailSearch({currPage:1})}"
          placeholder="部门名称、姓名、负责人"
          search
          clearable
          v-model.trim="detailHeader.text"
        />
        <Button icon="ios-loading" @click="()=>{reload();detailSearch()}"></Button>
        <!-- <TableHeaderSetting
          :totalTableHeader="totalTableHeader"
          :tableHeader.sync="tableHeader"
          key="semLogList"
        />-->
      </div>
    </div>
    <Table
      class="important-fixed-center"
      row-key="id"
      :columns="tableHeader"
      :data="tableContent"
      border
      :loading="loading"
    >
      <template slot="edit" slot-scope="{row}">
        <Button v-if="!row.personId" class type="primary" @click="addSubDept(row)">新增</Button>
        <Button @click="editDept(row)">编辑</Button>
        <Button type="error" @click="delDept(row)">删除</Button>
      </template>
    </Table>
    <DeptUserAdd
      v-if="showDeptUserAdd"
      v-model="showDeptUserAdd"
      :propsData="propsData"
      :editType="editType"
      @on-success="detailSearch()"
    />
    <DeptEdit
      v-if="showDeptEdit"
      :editType="editType"
      v-model="showDeptEdit"
      :propsData="propsData"
      @on-success="detailSearch()"
    />
    <UserEdit
      v-if="showUserEdit"
      :editType="editType"
      v-model="showUserEdit"
      :propsData="propsData"
      @on-success="detailSearch()"
    />
  </div>
</template>

<script>
import DeptUserAdd from './dept-user-add'
import DeptEdit from './dept-edit'
import UserEdit from './user-edit'
// import SpanTreeTable from "_c/span-tree-table";
import { phpURL } from '@/api/base.js'
import { HeaderInputMixin } from '_c/table-header-search'
export default {
  name: 'relationship',
  components: {
    DeptUserAdd,
    DeptEdit,
    UserEdit
  },
  mixins: [HeaderInputMixin],
  data () {
    return {
      loading: false,
      showDeptUserAdd: false,
      showDeptEdit: false,
      showUserEdit: false,
      propsData: {},
      editType: '新增',
      tableHeader: [
        // { title: '类型', key: 'type', align: 'center', minWidth: 120 },
        {
          title: '部门',
          key: 'unitName',
          align: 'left',
          minWidth: 120,
          className: 'dept-class-padding',
          tree: true,
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          title: '职务',
          key: 'job',
          align: 'center',
          minWidth: 120,
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          title: '姓名',
          key: 'name',
          align: 'center',
          minWidth: 120,
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          title: '联系电话',
          key: 'phone',
          align: 'center',
          minWidth: 120,
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          title: '负责人',
          key: 'charge',
          align: 'center',
          minWidth: 120,
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          title: '频率',
          key: 'times',
          align: 'center',
          minWidth: 120,
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          title: '可参加人员',
          key: 'partner',
          align: 'center',
          minWidth: 120,
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          title: '操作',
          key: 'edit',
          align: 'left',
          width: 200,
          slot: 'edit'
        }
      ],
      detailHeader: {
        unitName: '', // 部门名称
        job: '', // 职位
        name: '', // 姓名
        phone: '', // 联系方式
        charge: '', // 负责人
        times: '', // 频率
        partner: '', // 可参加人
        text: '' // 模糊搜索
      },
      tableContent: []
    }
  },
  mounted () {
    this.detailSearch()
  },
  methods: {
    // 左上角按钮，新增主部门
    addDept () {
      const parentId = '0'
      this.editType = '新增主部门'
      this.propsData = { parentId }
      this.showDeptEdit = true
    },
    // 操作列按钮新增
    addSubDept (row) {
      // 新增子部门或者新增部门下联系人
      const { unitId } = row
      this.editType = '新增'
      this.propsData = { unitId }
      this.showDeptUserAdd = true
    },
    // 编辑部门
    editDept (row) {
      const { personId } = row
      // 根据是否有personId判断是编辑部门还是编辑人
      if (personId) {
        console.log(row)
        this.editType = '编辑人员'
        const {
          personId,
          job,
          name,
          phone,
          chargeUID,
          times,
          partnerUID
        } = row
        this.propsData = {
          personId,
          job,
          name,
          phone,
          chargeUID,
          times,
          partnerUID
        }
        this.showUserEdit = true
      } else {
        this.editType = '编辑部门'
        const { unitName, unitId, parentId } = row
        this.propsData = { unitName, unitId, parentId }
        this.showDeptEdit = true
      }
    },
    // 删除部门
    delDept (row) {
      const { personId, unitId, unitName, name } = row
      let content = personId ? name : unitName
      let sendData = {}
      if (!personId) {
        sendData.type = 'dept'
        sendData.unitId = unitId
      } else {
        sendData.type = 'person'
        sendData.personId = personId
      }
      this.$Modal.confirm({
        title: '提示',
        content: `是否删除${content}`,
        onOk: () => {
          this.$axios({
            url: phpURL + '/declareProject/ContactUnit/delUnit',
            data: $qs.stringify(sendData),
            method: 'post'
          }).then(res => {
            const { code, msg } = res.data
            if (code === 10000) {
              this.$Message.success('删除成功')
              this.detailSearch()
            } else {
              this.$Message.error(msg)
            }
          })
        }
      })
    },
    // 清空搜索字段
    reload () {
      this.detailHeader = {
        unitName: '',
        job: '',
        name: '',
        phone: '',
        charge: '',
        times: '',
        partner: '',
        text: ''
      }
    },
    // 获取需要发送的值
    getSendData (data = {}) {
      this.detailHeader = Object.assign(this.detailHeader, data)
      let sendData = {}
      for (let key in this.detailHeader) {
        let value = this.detailHeader[key]
        value = typeof value === 'string' ? value.trim() : value
        if (value) {
          sendData[key] = value
        }
      }
      this.detailHeader = Object.assign(this.detailHeader, sendData)
      return sendData
    },
    // 搜索
    detailSearch (currentData = {}) {
      let sendData = this.getSendData(currentData)
      this.$axios({
        url: phpURL + '/declareProject/ContactUnit/index',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        let content = res.data.content
        this.tableContent = content.map(e => {
          return Object.assign(e, { _showChildren: true })
        })
      })
    },
    // 合并单元格
    handleSpan ({ row, column, rowIndex, columnIndex }) {
      const colKey = 'type'
      if (row.children && row._showChildren && column.key === colKey) {
        let childrenLength = this.calcChildrenLength(row.children)
        return [childrenLength + 1, 1]
      }
    },
    // 计算总共有多少个展开的后代
    calcChildrenLength (item) {
      let count = 0
      for (let i = 0; i < item.length; i++) {
        let son = item[i]
        // 如果有子代，递归+1
        if (son.children && son.children.length && son._showChildren) {
          count += this.calcChildrenLength(son.children)
        }
        // 当前+1
        count += 1
      }
      return count
    }
  }
}
</script>

<style lang="less">
.important-fixed-center {
  .ivu-table-header {
    .ivu-table-column-left {
      text-align: center;
    }
  }
}
.dept-class-padding {
  padding-left: 20px;
}
</style>
