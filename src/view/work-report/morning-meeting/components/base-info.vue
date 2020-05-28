<template>
<div>
    <div class="level-three">
        <Button class="btns add" v-if="permiss.create" type="primary" @click="handleAddModal()">新增</Button>
        <div class="searchbar">
            <Input @on-search="getTableData()" @on-clear="getTableData()" v-model="searchContent" placeholder="输入关键字..." search clearable />
            <Button icon="ios-loading" @click="refresh()"></Button>
            <TableHeaderSetting
            :totalTableHeader="jobTableHeader"
            :tableHeader.sync="tableHeader"
            key="morningSettingTabelHeaders"
            localKey="morningSettingTabelHeaders"
            :defaultList="defaultList"
            />
        </div>
    </div>
    <Table border  :loading="loading" :columns="tableHeader" :data="jobTableData">
        <template slot-scope="{ row, index }" slot="option">
            <Button class="btns" type="primary" @click="handleEdit(row)">编辑</Button>
            <Button class="btns" type="error" v-if="permiss.delete" @click="handleDelete(row)">删除</Button>
        </template>
    </Table>
    <Modal v-model="showAdd" :loading="modalLoading" :title="modalTitle" @on-ok="saveAdd()">
        <Form ref="addContent" :model="addContent" :rules="rulesAddContent" :label-width="80">
            <FormItem label="主题:" prop="subject">
                <Row v-if="isEdit">
                    <Col span="14">
                    <p>{{addContent.subject}}</p>
                    </Col>
                </Row>
                <Row v-else>
                    <Col span="14">
                    <Select v-model="addContent.subject">
                        <Option v-for="item in subjectList" :value="item" :key="item" :label="item"></Option>
                    </Select>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="记录员:" prop="recorder">
                <Row>
                    <Col span="14">
                    <Select v-model="addContent.recorder" clearable filterable>
                        <Option v-for="item in employees" :value="item.id" :key="item.id" :label="item.nickname">{{item.nickname}}</Option>
                    </Select>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="参会成员:" prop="attendeeList">
                <Row>
                    <Col span="14">
                    <tree-select-vue :options="options" :value-consists-of="valueConsistsOf" v-model="addContent.attendeeList">
                    </tree-select-vue>
                    </Col>
                </Row>
            </FormItem>
        </Form>

    </Modal>
</div>
</template>

<script>
import TreeSelectVue from '@/components/tree-select-vue/tree-select-vue'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import morningMixins from '../morning-mixins'
import TableHeaderSetting from '_c/table-header-setting'
import {
  baseUrl
} from '@/api/base'
export default {
  name: 'baseInfo',
  mixins: [morningMixins],
  components: {
    TreeSelectVue,
    TableHeaderSetting
  },
  data () {
    return {
      isEdit: false,
      modalTitle: '',
      currId: '',
      options: [],
      valueConsistsOf: 'LEAF_PRIORITY',
      addContent: {
        subject: '',
        recorder: '',
        attendeeList: []
      },
      rulesAddContent: {
        subject: [{
          required: true,
          message: '必填项',
          trigger: 'blur'
        }],
        recorder: [{
          required: true,
          message: '必填项',
          trigger: 'blur'
        }],
        attendeeList: [{
          required: true,
          message: '必填项',
          trigger: 'blur'
        }]
      },
      showAdd: false,
      loading: false,
      modalLoading: true,
      searchContent: '',
      timeRange: [],
      jobArrange: '',
      executor: '',
      dataSource: '',
      jobTableData: [],
      tableHeader: [],
      defaultList: [
        'index',
        'subject',
        'attendeeName',
        'recorderName',
        'option'
      ],
      jobTableHeader: [{
        title: '序号',
        key: 'index',
        type: 'index',
        align: 'center',
        alwaysShow: true
      },
      {
        title: '主题',
        key: 'subject',
        minWidth: 80,
        align: 'center'
      },
      {
        title: '参会人员',
        key: 'attendeeName',
        minWidth: 80,
        align: 'center'
      },
      {
        title: '记录员',
        key: 'recorderName',
        minWidth: 80,
        align: 'center'
      },
      {
        title: '操作',
        slot: 'option',
        key: 'option',
        width: 230,
        align: 'center',
        alwaysShow: true
      }
      ]
    }
  },
  mounted () {
    this.getTableData()
    this.getTreeData()
  },
  methods: {
    getTableData () {
      let sendData = {}
      if (this.searchContent) {
        sendData.searchContent = this.searchContent.trim()
      }
      this.$axios({
        url: baseUrl + '/morning/baseInfo',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.jobTableData = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    handleAddModal () {
      this.showAdd = true
      this.modalTitle = '新增配置'
      this.isEdit = false
      this.addContent.subject = ''
      this.addContent.recorder = ''
      this.addContent.attendeeList = []
      this.getSubject()
    },
    getTreeData () {
      this.$axios({
        url: baseUrl + '/user/getIncumbencyTbUserBySort',
        method: 'get'
      })
        .then(res => {
          this.options = res.data.content
        })
    },
    // 编辑
    handleEdit (row) {
      this.modalTitle = '编辑配置'
      this.showAdd = true
      this.isEdit = true
      this.currId = row.id
      this.$axios({
        url: baseUrl + '/morning/meetingDetail',
        method: 'post',
        data: $qs.stringify({
          id: row.id
        })
      }).then(res => {
        if (res.data.code === 10000) {
          this.addContent = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 新增 编辑
    saveAdd () {
      let notEmpty = this.addContent.subject !== '' && (this.addContent.recorder !== undefined && this.addContent.recorder !== '') && this.addContent.attendeeList.length !== 0
      console.log(this.addContent.subject)
      console.log(this.addContent.recorder)
      console.log(this.addContent.attendeeList.length)
      console.log(notEmpty)
      if (this.modalTitle === '新增配置') {
        if (notEmpty) {
          let sendData = {
            subject: this.addContent.subject,
            recorder: this.addContent.recorder,
            attendeeList: this.addContent.attendeeList
          }
          this.$axios({
            url: baseUrl + '/morning/addMeeting',
            method: 'post',
            data: sendData
          }).then(res => {
            if (res.data.code === 10000) {
              this.showAdd = false
              this.$Message.info(res.data.msg)
              this.getTableData()
            } else if (res.data.code === 10105) {
              this.$Message.error(res.data.msg)
              this.showAdd = false
            }
          }).catch(err => {
            console.log('err', err)
          })
        } else {
          this.modalLoading = false
          this.$nextTick(() => {
            this.modalLoading = true
            this.$Message.error('有必填项未填')
          })
        }
      } else {
        if (notEmpty) {
          let sendData = this.addContent
          sendData.id = this.currId
          this.$axios({
            url: baseUrl + '/morning/editMeeting',
            method: 'post',
            data: sendData
          }).then(res => {
            if (res.data.code === 10000) {
              this.showAdd = false
              this.$Message.info(res.data.msg)
              this.getTableData()
            } else {
              this.$Message.error(res.data.msg)
            }
          }).catch(err => {
            console.log('err', err)
          })
        } else {
          this.modalLoading = false
          this.$nextTick(() => {
            this.modalLoading = true
            this.$Message.error('有必填项未填')
          })
        }
      }
    },
    handleDelete (row) {
      this.$axios({
        url: baseUrl + '/morning/deleteMeeting',
        method: 'post',
        data: $qs.stringify({
          id: row.id
        })
      }).then(res => {
        if (res.data.code === 10000) {
          this.$Message.info(res.data.msg)
          this.getTableData()
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    refresh () {
      this.searchContent = ''
      this.getTableData()
    }
  }
}
</script>

<style lang="" scoped>

</style>
