<template>
  <div class="pagePadding" id="user">
    <Tabs type="card" v-model="tabsType" :animated="false">
      <div slot="extra" v-show="tabsType==='talkRelationship'">
        <Button
          class="btns"
          icon="md-add-circle"
          style="background-color: #19aa8d;border-color: #19aa8d;color: #fff;"
          @click="addTalkRelationship"
        >新增</Button>
        <Button class="btns" @click="updataTalkList">更新</Button>
        <Button class="btns" @click="showSelect=!showSelect">
          <Icon :type="showSelect?'ios-arrow-up':'ios-arrow-down' "/>筛选
        </Button>
      </div>
      <!-- 面谈关系页面 -->
      <TabPane label="面谈关系" name="talkRelationship">
        <Card style="margin:10px 0;padding:20px;" v-show="showSelect">
          <Row>
            <Form
              ref="formInline"
              :model="searchHeader"
              inline
              label-position="left"
              :label-width="100"
            >
              <FormItem label="面谈人：">
                <Select filterable clearable v-model="searchHeader.mainUid">
                  <Option
                    v-for="item in userList"
                    :value="item.id"
                    :key="item.id"
                  >{{ item.nickname }}</Option>
                </Select>
              </FormItem>
              <FormItem label="被面谈人：">
                <Select filterable clearable v-model="searchHeader.uid">
                  <Option
                    v-for="item in userList"
                    :value="item.id"
                    :key="item.id"
                  >{{ item.nickname }}</Option>
                </Select>
              </FormItem>
            </Form>
          </Row>
          <div style="float:right;">
            <Button class="btns" icon="ios-trash-outline" @click="clearSearch">清空搜索</Button>
            <Button class="btns" type="primary" @click="getTalkRelationship">搜索</Button>
            <Button class="btns" type="primary" icon="ios-arrow-up" @click="showSelect = false">收起</Button>
          </div>
        </Card>
        <Table border :columns="tableHeader" :data="tableContent">
          <template slot-scope="{ row, index }" slot="edit">
            <Button type="primary" class="btns edit"  @click="edit(row)">编辑</Button>
            <Button type="error" class="btns delete"  @click="deleteTalkRelationship(row)">删除</Button>
          </template>
        </Table>
      </TabPane>
      <Modal v-model="showModal" title="面谈设置" @on-ok="saveTalkRelationShip" :mask-closable="false">
        <Form :label-width="80">
          <FormItem label="*面谈人">
            <Select v-model="modal.mainUid" multiple filterable>
              <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.nickname }}</Option>
            </Select>
          </FormItem>
          <FormItem label="*被面谈人">
            <Select v-model="modal.intervieweeIds" multiple filterable>
              <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.nickname }}</Option>
            </Select>
          </FormItem>
        </Form>
      </Modal>
      <!-- 面谈时间页面 -->
      <TabPane label="面谈时间" name="talkTime">
        <Card>
          <Row class-name="talkTimeRow">
            <Col span="10" offset="1">
              <h2 @click="dateFomat">发展面谈</h2>
            </Col>
            <Col span="10" offset="2">
              <h2>绩效面谈</h2>
            </Col>
          </Row>

          <Row v-for="(row,index) in talkTime" :key="index" class-name="talkTimeRow">
            <Col span="1">
              <span style="line-height:32px;">{{index+1}}月</span>
            </Col>
            <Col span="10">
              <DatePicker show-week-numbers v-model="row.devStart" style="width:40%;"></DatePicker>
              <span>&nbsp;至&nbsp; </span>
              <DatePicker show-week-numbers v-model="row.devEnd" style="width:40%;"></DatePicker>
              <Checkbox
                :true-value="1"
                :false-value="0"
                v-model="row.isDev"
                :disabled="checkBoxDisable(row.devStart,row.devEnd,row)"
              >启用</Checkbox>
            </Col>
            <Col span="10" offset="2">
              <DatePicker show-week-numbers v-model="row.kpiStart" style="width:40%;"></DatePicker>
              <span> &nbsp;至&nbsp; </span>
              <DatePicker show-week-numbers v-model="row.kpiEnd" style="width:40%;"></DatePicker>
              <Checkbox
                :true-value="1"
                :false-value="0"
                v-model="row.isKpi"
              >启用</Checkbox>
            </Col>
          </Row>
          <!-- <table border="none" cellspacing="0" id="talkTimeTable">
            <thead>
              <tr class="ivu-table-row">
                <td>月份</td>
                <td>面谈类型</td>
                <td>开始时间</td>
                <td>结束时间</td>
                <td>是否启用</td>
              </tr>
            </thead>
            <tbody >
              <template v-for="(row,index) in talkTime">
                <tr class="ivu-table-row">
                  <td rowspan="2">{{index+1}}月</td>
                  <td>发展面谈</td>
                  <td>
                    <DatePicker show-week-numbers v-model="row.devStart"></DatePicker>
                  </td>
                  <td>
                    <DatePicker show-week-numbers v-model="row.devEnd"></DatePicker>
                  </td>
                  <td>
                    <Checkbox :disabled="checkBoxDisable(row.devStart,row.devEnd,row)" :true-value="1" :false-value="0" v-model="row.isDev">启用</Checkbox>
                  </td>
                </tr>
                <tr>
                  <td>绩效面谈</td>
                  <td>
                    <DatePicker show-week-numbers v-model="row.kpiStart"></DatePicker>
                  </td>
                  <td>
                    <DatePicker show-week-numbers v-model="row.kpiEnd"></DatePicker>
                  </td>
                  <td>
                    <Checkbox :disabled="checkBoxDisable(row.devStart,row.devEnd,row)" :true-value="1" :false-value="0" v-model="row.isKpi">启用</Checkbox>
                  </td>
                </tr>
              </template>
            </tbody>
          </table> -->
          <Row type="flex" justify="center">
            <Col span="4">
              <Button @click="saveTalkTime">保存</Button>
            </Col>
            <Col span="4">
              <Button>取消</Button>
            </Col>
          </Row>
        </Card>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
import moment from 'moment'
export default {
  name: 'talkRelationship',
  data () {
    return {
      tabsType: 'talkRelationship',
      showModal: false,
      showSelect: false,
      tableHeader: [
        { title: '面谈人', key: 'mainName' },
        { title: '被面谈人', key: 'uidName' },
        { title: '编辑', slot: 'edit' }
      ],
      tableContent: [],
      userList: [], // 转正人员列表
      talkTime: [], // 面谈时间设置列表
      // 搜索框的值
      searchHeader: {
        mainUid: '',
        uid: ''
      },
      // modal框里面绑定的内容
      modal: {
        mainUid: [],
        intervieweeIds: [],
        talkUserId: ''
      },
      talkTimeHeader: [
        { title: '月份', slot: 'month' },
        { title: '面谈类型', slot: 'type' },
        { title: '开始时间', slot: 'startTime' },
        { title: '结束时间', slot: 'endTime' },
        { title: '是否启用', slot: 'option' }
      ]
    }
  },
  mounted () {
    this.getTalkRelationship() // 获取面谈关系列表
    this.getTalkTime() // 获取面谈时间列表
    this.getTbUser() // 获取转正人员名单
  },
  methods: {
    // 获取面谈关系列表
    getTalkRelationship () {
      let data = this.searchHeader
      this.$axios({
        url: baseUrl + '/talk/getTalkRelationship',
        method: 'post',
        data: $qs.stringify(data)
      }).then(res => {
        if (res.data.code === 10000) {
          this.tableContent = res.data.content
        } else {
          this.$Message.error('查无数据')
          this.tableContent = []
        }
      })
    },
    // 获取面谈时间
    getTalkTime () {
      this.$axios({
        url: baseUrl + '/talk/getTalk',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.talkTime = res.data.content
          // this.$set(this, 'talkTime', res.data.content)
        }
      })
    },
    // 根据组织架构一键更新面谈关系
    updataTalkList () {
      this.$axios({
        url: baseUrl + '/talk/getTalkRelationshipByStructure',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.talkTime = res.data.content
          this.$Message.success('更新成功')
          this.getTalkRelationship()
        }
      })
    },
    // 获取在职转正人员
    getTbUser () {
      this.$axios({
        url: baseUrl + '/talk/getTbUser',
        method: 'post'
      })
        .then(res => {
          this.userList = res.data.content
        })
        .catch(err => {
          console.log('获取在职转正人员' + err)
        })
    },
    // 点编辑按钮出弹窗
    edit (row) {
      this.showModal = true
      this.modal.mainUid = row.mainUidList
      this.modal.intervieweeIds = row.intervieweeIds
      this.modal.talkUserId = row.talkUserId
    },
    // 批量更新面谈时间设置里的日期格式
    dateFomat () {
      this.talkTime.forEach(e => {
        e.devStart = moment(e.devStart).format('YYYY-MM-DD')
        e.devEnd = moment(e.devEnd).format('YYYY-MM-DD')
        e.kpiStart = moment(e.kpiStart).format('YYYY-MM-DD')
        e.kpiEnd = moment(e.kpiEnd).format('YYYY-MM-DD')
      })
    },
    // 新增面谈关系
    addTalkRelationship () {
      this.showModal = true
      // 清空modal框的内容
      this.modal.mainUid = []
      this.modal.intervieweeIds = []
      this.modal.talkUserId = undefined
    },
    // 新增和更新面谈关系设置
    saveTalkRelationShip () {
      // 如果有talkUserId，是编辑
      if (this.modal.talkUserId) {
        let data = {
          mainUid: this.modal.mainUid,
          uid: this.modal.intervieweeIds,
          talkUserId: this.modal.talkUserId
        }
        this.$axios({
          url: baseUrl + '/talk/editorTalkRelationship',
          method: 'post',
          data: data
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.getTalkRelationship()
            }
          })
          .catch(err => {
            console.log('更新面谈关系设置', err)
          })
      } else {
        // 新增
        let data = {
          mainUid: this.modal.mainUid,
          uid: this.modal.intervieweeIds
        }
        this.$axios({
          url: baseUrl + '/talk/newTalkRelationship',
          method: 'post',
          data: data
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.getTalkRelationship()
            }
          })
          .catch(err => {
            console.log('更新面谈关系设置', err)
          })
      }
    },
    // 删除已配置的面谈关系
    deleteTalkRelationship (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认删除',
        onOk: () => {
          this.modal.talkUserId = row.talkUserId
          let data = {
            talkUserId: this.modal.talkUserId
          }
          this.$axios({
            url: baseUrl + '/talk/deleteTalkRelationship',
            method: 'post',
            data: $qs.stringify(data)
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.getTalkRelationship()
            }
          })
        },
        onCancel: () => {
          this.modal.talkUserId = ''
        }
      })
    },
    // 面谈时间保存
    saveTalkTime () {
      this.dateFomat()
      this.$axios({
        url: baseUrl + '/talk/updateTalkTime',
        method: 'post',
        data: this.talkTime
      }).then(res => {
        if (res.data.code === 10000) {
          this.$Message.success(res.data.msg)
          this.getTalkTime()
        }
      })
    },
    clearSearch () {
      this.searchHeader = {
        mainUid: '',
        uid: ''
      }
    },
    checkBoxDisable (start, end, row) {
      let isEmpty = !(start && end)
      let isBefore = !moment(start).isBefore(end)
      if (isEmpty || isBefore) {
        row.isDev = 0
        return true
      } else {
        return false
      }
    }
  }
}
</script>
<style>
.talkTimeRow {
  padding: 20px;
  border-bottom: 1px dashed #eeeeee;
}
.talkTimeRow span {
  line-height: 1.5;
}
.talkTimeRow .ivu-checkbox-wrapper {
  margin-left: 10px;
}
#talkTimeTable{
  border: 1px solid #000000;
}
#talkTimeTable thead tr td{
  width: 20%;
}

</style>
