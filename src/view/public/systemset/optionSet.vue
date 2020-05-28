<template>
<div id="mainWrap">
    <div class="menu">
        <Table border :data="menuData" :columns="menuColumns" @on-row-click="getDetail"></Table>
    </div>
    <div class="detail">
        <Table border :columns="detailColumns" :data="detailData">
            <template slot-scope="{ row,index }" slot="name">
                <Input type="text" v-model="optionName"  v-if="editIndex === index" />
                <span v-else>{{ row.optionName }}</span>
            </template>
            <template slot-scope="{ row,index }" slot="status">
                <RadioGroup v-model="statusName" v-if="editIndex === index">
                    <Radio label="有效">
                        <span>有效</span>
                    </Radio>
                    <Radio label="无效">
                        <span>无效</span>
                    </Radio>
                </RadioGroup>
                <span v-else>{{ row.statusName }}</span>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <div v-if="editIndex === index">
                    <Button v-if="isNewAdd"  @click="handAddleSave(row,index)">保存</Button>
                    <Button v-if="isNewAdd" @click="handleCancal(row,index)">取消</Button>
                    <Button v-if="!isNewAdd" @click="handleSave(row,index)">保存</Button>
                    <Button v-if="!isNewAdd" @click="editIndex = -1">取消</Button>

                </div>
                <div v-else>
                    <Button id="edit" type="primary"  @click="handleEdit(row, index)">编辑</Button>
                    <Button v-if= "row.status == 1" @click="changeStatus(row, index)">启用</Button>
                    <Button v-if="row.status == 0" @click="changeStatus(row, index)" type="error">禁用</Button>
                    <Button v-if="index!==0" @click="moveUp(row,index)">上移</Button>
                    <Button v-if="index!==(detailData.length-1)"  @click="moveDown(row,index)">下移</Button>
                </div>
            </template>
        </Table>
        <Button class="addBtn" type="primary" @click="handlAddTd">新增</Button>
    </div>

</div>
</template>

<script>
import ZkSwitch from '_c/switch/switch'
import { baseUrl } from '@/api/base.js'
import { Track } from '@/libs/track'
const track = new Track('系统设置/选项设置/选项设置')
export default {
  components: {
    ZkSwitch
  },
  data () {
    return {
      isNewAdd: false,
      editIndex: -1,
      optionName: '',
      statusName: '有效',
      btnStatus: 0, // 0启用 1禁用
      typeoptionId: '',
      menuColumns: [{
        title: '类别',
        key: 'optionType',
        align: 'center'
      }],
      menuData: [],
      detailColumns: [{
        title: '名称',
        slot: 'name',
        align: 'center'
      }, {
        title: '状态',
        slot: 'status',
        align: 'center'
      }, {
        title: '操作',
        slot: 'action'
      }],
      detailData: []
    }
  },
  beforeCreate () {
    track.start()
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      let sendTodoData = {}
      this.$axios({
        url: baseUrl + '/SysOption/findSysOptionType',
        data: $qs.stringify(sendTodoData),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.menuData = resp.data.content
          } else {
            this.$Message.error(resp.data.msg)
          }
          this.$nextTick(() => {
            track.end()
          })
        })
        .catch(err => {
          console.log('err', err)
        })
      this.getDetail(1)
    },
    getDetail (index) {
      this.typeoptionId = index.optionType
      let sendTodoData = {
        optionType: this.typeoptionId
      }
      this.$axios({
        url: baseUrl + '/SysOption/findSysOptionsByCondition',
        data: $qs.stringify(sendTodoData),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.detailData = resp.data.content
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    changeStatus (row, index) {
      let sendData = {
        id: row.id,
        status: row.status
      }
      this.$axios({
        url: baseUrl + '/SysOption/updateSysOptionStatus',
        data: $qs.stringify(sendData),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.detailData = resp.data.content
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    handleEdit (row, index) {
      this.isNewAdd = false
      this.optionName = row.optionName
      this.editIndex = index
      this.statusName = row.statusName
    },
    handleCancal (row, index) {
      this.detailData.splice(index, 1)
    },
    handleSave (row, index) {
      this.detailData[index].name = this.optionName
      this.editIndex = -1
      let sendTodoData = {
        id: row.id,
        status: this.statusName,
        optionName: this.optionName
      }
      this.$axios({
        url: baseUrl + '/SysOption/updateSysOptionStatus',
        data: $qs.stringify(sendTodoData),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.detailData = resp.data.content
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    // 新增保存
    handAddleSave (row, index) {
      if (this.optionName === '' || this.statusName === '') {
        this.$Message.error('有必填项未填写')
      } else {
        this.editIndex = -1
        let sendAddData = {
          optionType: this.typeoptionId,
          optionName: this.optionName,
          status: this.statusName
        }
        this.$axios({
          url: baseUrl + '/SysOption/insertSysOptionName',
          data: $qs.stringify(sendAddData),
          method: 'post'
        })
          .then(resp => {
            if (resp.data.code === 10000) {
              this.detailData = resp.data.content
            } else {
              this.$Message.error(resp.data.msg)
            }
          })
          .catch(err => {
            console.log('err', err)
          })
      }
    },
    handlAddTd (row, index) {
      this.optionName = ''
      this.statusName = '有效'
      this.isNewAdd = true
      this.editIndex = this.detailData.length
      this.detailData.push({
        optionName: '',
        statusName: ''
      })
    },
    move (sendData) {
      this.$axios({
        url: baseUrl + '/SysOption/updateSysOptionOrder',
        data: $qs.stringify(sendData),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.detailData = resp.data.content
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    moveUp (row, index) {
      let sendData = {
        id: row.id,
        moveId: 1
      }
      this.move(sendData)
    },
    moveDown (row, index) {
      let sendData = {
        id: row.id,
        moveId: 2
      }
      this.move(sendData)
    }

  }
}
</script>

<style scoped>
#mainWrap {
    padding: 10px 50px;
    margin: 20px;
    background-color: #fff;
    min-height: 900px;
}

#mainWrap .menu {
    width: 28%;
    display: inline-block;
}

.addBtn {
    width: 100%;
}

#mainWrap #edit,
#mainWrap .addBtn {
    background-color: #19AA8D;
    border-color: #19AA8D;
}

#mainWrap #edit:hover,
#mainWrap .addBtn:hover {
    background-color: #19AA8D;
    border-color: #19AA8D;
}

#mainWrap .detail {
    width: 70%;
    float: right;
}

#mainWrap Button {
    margin-right: 3px
}
</style>
