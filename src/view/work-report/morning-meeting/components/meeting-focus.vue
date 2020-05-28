<template>
<div>
    <Table disabled-hover border :columns="emphasisTableHeader" :data="emphasisObj.emphasisList">
        <template slot-scope="{ row,index }" slot="emphasis">
            <Input v-model="row.emphasis" @on-blur="editTable('emphasisObj','emphasisList',index,'emphasis',row.emphasis)"></Input>
        </template>
        <template slot-scope="{ row,index }" slot="responsible">
            <Input v-model="row.responsible" @on-blur="editTable('emphasisObj','emphasisList',index,'responsible',row.responsible)"></Input>
        </template>
        <template slot-scope="{ row,index }" slot="option">
            <Button type="error" @click="handleDelete(index)">删除</Button>
        </template>
    </Table>
    <Button type="primary" class="addBtn" @click="addTrains()">添加一行</Button>
</div>
</template>

<script>
import morningMixins from '../morning-mixins'
export default {
  name: 'meetingFocus',
  mixins: [morningMixins],

  data () {
    return {
      loading: false,
      emphasisObj: {
        emphasisList: []
      },
      emphasisTableHeader: [{
        title: '序号',
        type: 'index',
        align: 'center',
        width: 80
      },
      {
        title: '主题',
        key: 'emphasis',
        render: (h, params) => {
          return (
            <span class="taskTitle" style="cursor: pointer">
              <a onClick={() => this.checkDetail(params.row)}>{params.row.emphasis}</a>
            </span>
          )
        }
      },
      {
        title: '执行人',
        key: 'responsible'
      },
      {
        title: '操作',
        slot: 'option',
        width: 100
      }
      ]
    }
  },
  methods: {
    getTableData () {

    },
    editTable (obj, type, index, key, value) {
      let newValue = value
      this[obj][type][index][key] = newValue
    },
    addTrains () {
      this.emphasisObj.emphasisList.push({
        index: '',
        emphasis: '',
        responsible: ''
      })
    },
    handleDelete (index) {
      this.emphasisObj.emphasisList.splice(index, 1)
    },
    checkDetail (row) {
      this.$router.push({ name: 'detailMorning', query: { id: row.id } })
    }
  }
}
</script>

<style lang="" scoped>

</style>
