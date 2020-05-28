<template>
<div class="viewWrapper">
    <div class="content">
        <Row>
            <Col span="3">
            <div class="main-title">晨会信息</div>
            </Col>
        </Row>
        <Form ref="baseInfo" :model="baseInfo" :rules="ruleValidate" :label-width="132">
            <Row>
                <Col span="6">
                <FormItem label="起始时间：" prop="startTime">
                    <DatePicker :options="disabledOption" placeholder="请选择起始时间" type="datetime" v-model="baseInfo.startTime" style="width: 100%" :value="baseInfo.startTime"></DatePicker>
                </FormItem>
                </Col>
                <Col span="3">
                    <DatePicker :options="disabledOption"  placeholder="请选择结束时间" type="datetime" v-model="baseInfo.endTime" style="width: 100%" :value="baseInfo.endTime"></DatePicker>
                </Col>
                <Col span="7">
                <FormItem label="主题：" prop="subject">
                    <Select v-model="baseInfo.subject" clearable @on-change = "changeAddSubject()">
                        <Option v-for="item in addSubjectList" :value="item.id" :label="item.subject" :key="item.id" filterable clearable>{{item.subject}}</Option>
                    </Select>
                </FormItem>
                </Col>
                <Col span="7">
                <FormItem label="附件：" prop="enclosure">
                    <Upload id="taskUpload" ref="upload" multiple name="fileData" :max-size="20480" :action="staticUrl+'/index.php'" :on-success="handleSuccess" :on-error="handleError" :on-exceeded-size="handleExceeded" :on-remove="handleRemove">
                        <Button style="width: 200px" class="uploadButton" id="uploadButton" icon="ios-cloud-upload-outline">
                            单个文件不能超过20M
                        </Button>
                    </Upload>
                </FormItem>
                </Col>
                <Col span="9">
                <FormItem label="参会人：" prop="attendeeList">
                    <treeselect
                        class="treeSelectWrapper"
                        @select="(node) => handleSelect(node)"
                        @deselect="(node) => handleDeselect(node)"
                        clearAllText="清空"
                        noResultsText="暂无数据"
                        placeholder="请选择参会人"
                        :appendToBody="true"
                        :beforeClearAll="() => handleClearAll()"
                        :maxHeight="200"
                        :value="baseInfo.attendeeList"
                        :multiple="true"
                        :options="options"
                        :value-consists-of="valueConsistsOf"
                        :default-expand-level="1"
                        :backspaceRemoves="false"
                        :flattenSearchResults="true"
                        :ref="'attendSelect'"
                    />
                </FormItem>
                </Col>
                <Col span="7">
                <FormItem label="未到人：" prop="unAttendeeList">
                    <div>
                        <tree-select-vue  :disabled="disabled" :options="options" :value-consists-of="valueConsistsOf" v-model="baseInfo.unAttendeeList">
                        </tree-select-vue>
                    </div>

                </FormItem>
                </Col>
                <Col span="7">
                <FormItem label="接收人：" prop="receiverList">
                    <tree-select-vue  :options="options" :value-consists-of="valueConsistsOf" v-model="baseInfo.receiverList">
                    </tree-select-vue>
                </FormItem>
                </Col>
            </Row>
        </Form>
    </div>
    <div class="content">
        <Row>
            <Col span="3">
            <div class="main-title">晨会内容</div>
            </Col>

        </Row>
        <Row style="display:none;">
            <Col span="7" offset="1">数据展示：</Col>
        </Row>
        <Row class="mgtop" style="display:none;">
            <Col span="7" offset="2">
            <Button type="primary">绩效分析</Button>
            <Button type="primary">诊断分析</Button>
            </Col>
        </Row>
        <Row class="mgtop">
            <Col span="7" offset="1">专项工作：</Col>
        </Row>
        <Row>
            <Col span="20" offset="2">
                <div class="meetingFocus" v-if="noData">
                    <Button type="primary" class="addBtn" @click="showAddEmphasis()">添加一行</Button>
                </div>
                <div v-else class="meetingFocus" v-for="(item,index) in baseInfo.emphasisList" :key="index">
                    <div style="float:left;width:50px;">{{index+1}}、</div>
                    <div style="float:left;">
                        <Tooltip  max-width="400"  :content="item.emphasis" placement="top-start">
                            <div style="float:left;width:400px;margin-right: 10px;">{{item.emphasis}}</div>
                        </Tooltip>
                    </div>

                    <div style="float:left;min-width:200px;">{{item.responsible}}</div>
                    <Button type="error" @click="handleDelete(item,index)">删除</Button>
                    <Button v-if="index===baseInfo.emphasisList.length-1" type="primary" class="addBtn" @click="showAddEmphasis()">添加一行</Button>
                </div>

            </Col>
        </Row>
        <Row class="mgtop">
            <Col span="7" offset="1">工作安排：</Col>
        </Row>
        <Row>
            <Col span="20" offset="2">
            <div class="level-three">
                <div class="searchbar">
                    <Input @on-search="searcheJobArrange()" @on-clear="searcheJobArrange()" v-model="searchContent" placeholder="输入关键字..." search clearable />
                    <Button icon="ios-loading" @click="getJobArrangeData()"></Button>
                    <TableHeaderSetting
                    :totalTableHeader="jobTableHeader"
                    :tableHeader.sync="tableHeader"
                    key="addmorningTabelHeaders"
                    localKey="addmorningTabelHeaders"
                    :defaultList="defaultList"
                    />
                </div>
            </div>
            <Table border :loading="loading" :columns="tableHeader" :data="jobTableData">
                <template slot-scope="{ row,index }" slot="option">
                    <Button type="primary" @click="handleJobArrangeEdit(row)">编辑</Button>
                    <Button type="error" @click="handleJobArrangeDelete(row)">删除</Button>
                </template>
            </Table>
            <div class="tableFooter">
                <Page
                :total="totalCount"
                :page-size="variableObject.pageSize"
                :current="variableObject.currPage" size="small" show-total show-sizer show-elevator
                @on-change="changeCurrentPage"
                @on-page-size-change="changePageSize"
                />
            </div>
            </Col>
        </Row>
    </div>
    <div style="margin-bottom:10px;">
        <Row>
            <Col span="7" offset="10">
            <Button type="default" class="btn" @click="goBack()">取消</Button>
            <Button type="primary" @click="totalSave()">保存</Button>
            </Col>
        </Row>
    </div>
    <Modal v-model="showEditModal" title="编辑" @on-ok="saveEditJobArrange()">
        <Form ref="baseInfoModal" :model="baseInfoModal" :rules="rulesbaseInfo" :label-width="80">
            <FormItem label="时间:" prop="time">
                <Row>
                    <Col span="14">
                    <p>{{time}}</p>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="工作事项:" prop="arrange">
                <Row>
                    <Col span="14">
                    <p>{{baseInfo.arrange}}</p>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="参与人:" prop="executorList">
                <Row>
                    <Col span="14">
                    <tree-select-vue :ref="'receiverList'" :options="options" :value-consists-of="valueConsistsOf" v-model="executorList">
                    </tree-select-vue>
                    </Col>
                </Row>
            </FormItem>
        </Form>
    </Modal>
    <Modal :loading="modalLoading" v-model="isAddModal" title="新增会议重点" @on-ok="addNewEmphasis()">
        <Form :label-width="80">
            <FormItem label="工作重点:">
                <Row>
                    <Col span="14">
                    <Input v-model="emphasis"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="负责人:">
                <Row>
                    <Col span="14">
                    <Select
                    label-in-value
                    multiple
                    filterable
                    clearable
                    v-model="responsibleList"
                    @on-change="v=>setLabel(v)">
                    <Option
                    v-for="person in employees"
                    :value="person.id"
                    :key="person.id"
                    :label="person.nickname"
                    >{{person.nickname}}</Option>
                </Select>
                    </Col>
                </Row>
            </FormItem>
        </Form>
    </Modal>
</div>
</template>

<script>
import TreeSelectVue from '@/components/tree-select-vue/tree-select-vue'
import deptTreeSelect from '_c/dept-tree-select'

import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import morningMixins from './morning-mixins'
import moment from 'moment'
import TableHeaderSetting from '_c/table-header-setting'
import {
  staticUrl,
  baseUrl
} from '@/api/base.js'
export default {
  name: 'addNewMorning',
  mixins: [morningMixins],
  components: {
    TreeSelectVue,
    deptTreeSelect,
    Treeselect,
    TableHeaderSetting
  },
  inject: ['app'],
  data () {
    return {
      isAddModal: false,
      noData: false,
      emphasis: '',
      disabled: true,
      options: [],
      addSubjectList: [],
      addEmphasisList: [],
      addEmphasisListIndex: '',
      valueConsistsOf: 'LEAF_PRIORITY',
      showEditModal: false,
      responsibleList: [],
      responsibleSring: '',
      staticUrl,
      searchContent: '',
      rulesbaseInfo: {},
      baseInfoModal: {},
      eidtArrageId: '',
      emphasisTableHeader: [{
        title: '序号',
        type: 'index',
        align: 'center',
        width: 80
      },
      {
        title: '主题',
        key: 'emphasis',
        slot: 'emphasis'
      },
      {
        title: '执行人',
        key: 'responsible',
        slot: 'responsible'
      },
      {
        title: '操作',
        slot: 'option',
        width: 100
      }
      ],
      addTimeRange: [null, null],
      baseInfo: {
        id: '',
        startTime: '',
        endTime: '',
        subject: '',
        time: [],
        arrange: '',
        attendeeList: [],
        settingAttendeeList: [], // 晨会配置里的参会人
        unAttendeeList: [],
        receiverList: [],
        emphasisList: [],
        enclosureUrlList: []
      },
      time: '',
      modalLoading: true,
      executorList: [],
      timeRange: [null, null],
      ruleValidate: {
        subject: [{
          required: true,
          message: '必填项',
          type: 'number',
          trigger: 'blur'
        }],
        attendeeList: [{
          required: true,
          message: '必填项',
          type: 'array',
          trigger: 'blur'
        }]
      },
      totalCount: 0,
      variableObject: {
        currPage: 1,
        pageSize: 20
      },
      jobTableData: [],
      tableHeader: [],
      defaultList: [
        'index',
        'time',
        'arrange',
        'executor',
        'sourceName',
        'option'
      ],
      jobTableHeader: [{
        title: '序号',
        type: 'index',
        key: 'index',
        align: 'center',
        alwaysShow: true
      },
      {
        title: '时间',
        key: 'time',
        minWidth: 80,
        align: 'center',
        sortable: true,
        renderHeader: (h, params) => {
          return (<span>
            <Poptip transfer={true} placement="bottom">
              <span class="pointer">
                {params.column.title}
                <Icon type="md-search" size="14"/>
              </span>
              <div slot="content">
                <div>
                  <DatePicker
                    onOn-ok={() => {
                      this.searcheJobArrange()
                    }}
                    onOn-clear={() => {
                      this.timeRange = [null, null]
                      this.searcheJobArrange()
                    }}
                    type="daterange"
                    v-model={this.timeRange}
                    confirm
                    placement="bottom-start"
                    placeholder="输入时间"
                  />
                </div>
              </div>
            </Poptip>
          </span>)
        }
      },
      {
        title: '工作安排',
        key: 'arrange',
        minWidth: 80,
        align: 'center',
        renderHeader: (h, params) => {
          return (<span>
            <Poptip transfer={true} placement="bottom">
              <span class="pointer">
                {params.column.title}
                <Icon type="md-search" size="14"/>
              </span>
              <div slot="content">
                <Input
                  v-model={this.baseInfo.arrange}
                  search
                  clearable
                  onOn-search={value => {
                    this.searcheJobArrange()
                  }}
                />
              </div>
            </Poptip>
          </span>)
        },
        render: (h, params) => {
          return (
            <span class="taskTitle" style="cursor: pointer">
              <a onClick={() => this.checkDetail(params.row)}>{params.row.arrange}</a>
            </span>
          )
        }
      },
      {
        title: '执行人',
        key: 'executor',
        minWidth: 80,
        align: 'center',
        renderHeader: (h, params) => {
          return (<span>
            <Poptip transfer={true} placement="bottom">
              <span class="pointer">
                {params.column.title}
                <Icon type="md-search" size="14"/>
              </span>
              <Select
                slot="content"
                filterable
                clearable
                onOn-change={() => {
                  this.searcheJobArrange()
                }}
                v-model={this.baseInfo.executor}
              >
                {this.employees.map(person => {
                  return <Option value={person.id} label={person.nickname}/>
                })}
              </Select>
            </Poptip>
          </span>)
        }
      },
      {
        title: '数据源',
        key: 'sourceName',
        minWidth: 80,
        sortable: true,
        align: 'center',
        renderHeader: (h, params) => {
          return (<span>
            <Poptip transfer={true} placement="bottom">
              <span class="pointer">
                {params.column.title}
                <Icon type="md-search" size="14"/>
              </span>
              <div slot="content">
                <Select
                  slot="content"
                  filterable
                  clearable
                  onOn-change={() => {
                    this.searcheJobArrange()
                  }}
                  v-model={this.baseInfo.source}
                >
                  <Option value='2' label='任务系统'/>
                  <Option value='1' label='定岗定编'/>
                </Select>
              </div>
            </Poptip>
          </span>)
        }
      }, {
        title: '操作',
        slot: 'option',
        key: 'option',
        align: 'center',
        width: 150,
        alwaysShow: true
      }]
    }
  },
  mounted () {
    this.getAddSubectList()
    this.getTreeData()
    this.getEchoData()
  },
  computed: {
    employees () { // 在职人员
      return this.app.employees
    }
  },
  watch: {
    'baseInfo.emphasisList.length': {
      handler (newValue, oldValue) {
        if (this.baseInfo.emphasisList.length === 0) {
          this.noData = true
        } else {
          this.noData = false
        }
      }
    }
  },
  methods: {
    // 晨会信息 会议重点初始数据
    getEchoData () {
      this.$axios({
        url: baseUrl + '/morning/getAddMeetingDetail',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.baseInfo = res.data.content
          if (this.baseInfo.emphasisList.length === 0) {
            this.noData = true
          } else {
            this.noData = false
          }
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
      this.getJobArrangeData()
    },
    // 添加会议重点
    showAddEmphasis () {
      this.isAddModal = true
      this.emphasis = ''
      this.responsibleList = []
    },
    setLabel (v) {
      if (v) {
        this.responsibleSring = v.map(e => { return e.label }).join()
      } else {
        this.responsibleSring = v.label
      }
    },
    addNewEmphasis () {
      this.noData = false
      if (this.emphasis.trim() !== '' && this.responsibleSring.length !== 0) {
        this.baseInfo.emphasisList.push({
          emphasis: this.emphasis.trim(),
          responsible: this.responsibleSring,
          responsibleList: this.responsibleList
        })
        this.isAddModal = false
      } else {
        this.modalLoading = false
        this.$nextTick(() => {
          this.modalLoading = true
          if (this.emphasis.trim() === '') {
            this.emphasis = ''
          }
          if (this.baseInfo.emphasisList.length === 0) {
            this.noData = true
          } else {
            this.noData = false
          }
          this.$Message.error('有必填项未填')
        })
      }
    },
    // 删除会议重点
    handleDelete (item, i) {
      if (item.id !== undefined) {
        this.$axios({
          url: baseUrl + '/morning/deleteEmphasis',
          method: 'post',
          data: $qs.stringify({ id: item.id })
        }).then(res => {
          if (res.data.code === 10000) {
            this.$Message.info(res.data.msg)
            this.baseInfo.emphasisList = res.data.content
            if (this.baseInfo.emphasisList.length === 0) {
              this.noData = true
            } else {
              this.noData = false
            }
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.log('err', err)
        })
      } else {
        this.baseInfo.emphasisList.splice(i, 1)
        // console.log(this.baseInfo.emphasisList)
        // this.addEmphasisList.splice(i, 1)
        // console.log(this.addEmphasisList)
      }
    },
    // 工作安排初始数据
    getJobArrangeData () {
      this.$axios({
        url: baseUrl + '/morning/getAddArrange',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.jobTableData = res.data.content.pageContent
          this.totalCount = res.data.content.totalCount
          this.variableObject.currPage = res.data.content.currPage
          this.variableObject.pageSize = res.data.content.pageSize
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 工作安排搜索分页
    searcheJobArrange (currPage, pageSize) {
      let _b = this.baseInfo
      let sendData = {
        id: _b.id,
        source: _b.source,
        arrange: _b.arrange,
        executor: _b.executor,
        currPage: currPage,
        pageSize: pageSize || this.variableObject.pageSize
      }
      if (this.searchContent) {
        sendData.searchContent = this.searchContent.trim()
      }
      if (this.timeRange[0]) {
        sendData.startTime = moment(this.timeRange[0]).format('YYYY-MM-DD')
        sendData.endTime = moment(this.timeRange[1]).format('YYYY-MM-DD')
      }
      this.$axios({
        url: baseUrl + '/morning/getAddMorningMeetingArrange',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.jobTableData = res.data.content.pageContent
          this.totalCount = res.data.content.totalCount
          this.variableObject.currPage = res.data.content.currPage
          this.variableObject.pageSize = res.data.content.pageSize
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 页码改变
    changeCurrentPage (currPage) {
      this.searcheJobArrange(currPage, sessionStorage.pageSize)
    },
    // 切换每页条数
    changePageSize (pageSize) {
      sessionStorage.pageSize = pageSize
      this.searcheJobArrange(this.variableObject.currPage, pageSize)
    },
    // 工作安排编辑
    handleJobArrangeEdit (row) {
      this.showEditModal = true
      this.eidtArrageId = row.id
      this.$axios({
        url: baseUrl + '/morning/getArrangeDetail',
        method: 'post',
        data: $qs.stringify({ id: row.id, type: 1 })
      }).then(res => {
        if (res.data.code === 10000) {
          this.time = res.data.content.time
          this.baseInfo.arrange = res.data.content.arrange
          this.executorList = res.data.content.executorList
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    saveEditJobArrange () {
      this.$axios({
        url: baseUrl + '/morning/addMorningArrange',
        method: 'post',
        data: { id: this.eidtArrageId, executorList: this.executorList }
      }).then(res => {
        if (res.data.code === 10000) {
          this.$Message.info(res.data.msg)
          this.getJobArrangeData()
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 工作安排删除
    handleJobArrangeDelete (row) {
      this.$Modal.confirm({
        title: '提醒',
        content: '是否确定删除？',
        onOk: () => {
          this.$axios({
            url: baseUrl + '/morning/deleteMorningArrange',
            method: 'post',
            data: $qs.stringify({ id: row.id })
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.info(res.data.msg)
              this.searcheJobArrange()
            } else {
              this.$Message.error(res.data.msg)
            }
          }).catch(err => {
            console.log('err', err)
          })
        }
      })
    },
    // 获取树形结构人员名单
    getTreeData () {
      this.$axios({
        url: baseUrl + '/user/getIncumbencyTbUserBySort',
        method: 'get'
      })
        .then(res => {
          this.options = res.data.content
        })
    },
    // 获取晨会信息主题
    getAddSubectList () {
      this.$axios({
        url: baseUrl + '/morning/getAddSubject',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.addSubjectList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 改变晨会主题重新获取
    changeAddSubject () {
      this.$axios({
        url: baseUrl + '/morning/getChangeSubjectInfo',
        method: 'post',
        data: $qs.stringify({ id: this.baseInfo.subject })
      }).then(res => {
        if (res.data.code === 10000) {
          this.baseInfo.attendeeList = res.data.content.attendeeList
          this.baseInfo.unAttendeeList = []
          this.baseInfo.emphasisList = res.data.content.emphasisList
          this.baseInfo.settingAttendeeList = res.data.content.settingAttendeeList
          this.baseInfo.time = res.data.content.time
          this.baseInfo.id = res.data.content.id
          if (this.baseInfo.emphasisList.length === 0) {
            this.noData = true
          } else {
            this.noData = false
          }
          this.searcheJobArrange()
        } else {
        //   this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 总保存
    totalSave () {
      this.addEmphasisList = this.baseInfo.emphasisList.filter(function (item) {
        return item.id === undefined
      })
      let nomalTime = this.baseInfo.startTime < this.baseInfo.endTime
      if (this.baseInfo.endTime !== undefined) {
        if (nomalTime) {
          this.$refs.baseInfo.validate((valid) => {
            if (valid) {
              let _b = this.baseInfo
              let sendData = {
                attendeeList: _b.attendeeList,
                unAttendeeList: _b.unAttendeeList,
                receiverList: _b.receiverList,
                enclosureList: _b.enclosureUrlList,
                emphasisList: this.addEmphasisList,
                id: _b.subject
              }
              sendData.startTime = moment(this.baseInfo.startTime).format('YYYY-MM-DD HH:mm:ss')
              sendData.endTime = moment(this.baseInfo.endTime).format('YYYY-MM-DD HH:mm:ss')
              this.$axios({
                url: baseUrl + '/morning/addMorningMeeting',
                method: 'post',
                data: sendData
              }).then(res => {
                if (res.data.code === 10000) {
                  this.$Message.info(res.data.msg)
                  bus.$emit('on-myclose', this.$route)
                  this.getmyMorningTableData()
                } else {
                  this.$Message.error(res.data.msg)
                }
              }).catch(err => {
                console.log('err', err)
              })
            } else {
              this.$Message.error('有必填项未填写')
            }
          })
        } else {
          this.$Message.error('结束时间不能早于开始时间')
        }
      } else {
        this.$Message.error('结束时间必填')
      }
    },
    // 附件上传
    handleSuccess (response, file, fileList) {
      let list = []
      fileList.forEach(file => {
        if (file.response) {
          list.push({
            enclosureUrl: file.response.url,
            enclosureName: file.response.filename
          })
        }
      })
      this.baseInfo.enclosureUrlList = list
    },
    handleError (error) {
      console.log(error)
    },
    handleExceeded () {
      this.$Message.error('上传失败，文件超过20M')
    },
    handleRemove (file, fileList) {
      if (!fileList.length) {
        this.baseInfo.enclosureUrlList = []
      } else {
        let list = []
        fileList.forEach(file => {
          if (file.response) {
            list.push({
              enclosureUrl: file.response.url,
              enclosureName: file.response.filename
            })
          }
        })
        this.baseInfo.enclosureUrlList = list
      }
    },
    // 工作安排主题跳转到详情
    checkDetail (row) {
      if (row.sourceName === '定岗定编') {
        // 定岗定编跳转到工作计划详情 /duty/resultFb?id=5925947&userIdProps=271
        this.$router.push({ name: 'planDayDetail', query: { id: row.routeId, userIdProps: this.$store.state.user.userId } })
      } else if (row.sourceName === '任务系统') {
        // 任务系统跳转到任务详情 /duty/resultFb?id=5925947&userIdProps=271
        this.$router.push('/task/detail/' + row.routeId)
      }
    },
    // 取消
    goBack () {
      this.$axios({
        url: baseUrl + '/morning/caccelAddMeeting',
        method: 'post',
        data: $qs.stringify({ id: this.baseInfo.id })
      }).then(res => {
        if (res.data.code === 10000) {
        //   this.$Message.info(res.data.msg)
          this.$router.push({
            name: 'morningMeeting'
          })
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.content {
    // padding: 63px;
    .main-title {
        border-left: 2px solid #19aa8d;
        padding-left: 10px;
        font-size: 13px;
        margin: 10px 0px 30px 0px;
    }

    .mgtop {
        margin-top: 20px;

    }
}

.btnFixed {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    box-shadow: 0px 0px 6px 3px #eee;
    border-radius: 5px;
    padding: 0 10px;

    .btn {
        margin: 15px 10px;
    }
}
.meetingFocus{
    padding:5px;
    div{
        display:block;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
    }
}
</style>
