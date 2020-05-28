<template>
<!--任务详情-->
  <div class="detail-page-wrapper">
    <div class="detailPage">
      <Spin size="large" fix v-show="spinShow"></Spin>
      <!-- 任务的general info -->
      <info-board :info="info" @button-back="handleButtonBack"></info-board>
      <div class="page-middle-wrapper">
        <div class="pageMiddle">
          <!-- 任务信息 -->
          <div class="section">
            <div class="title">
              <Icon type="md-school" style="color: #19aa8d;margin-right: 10px;" size="20"/>
              <span class="title-name">任务信息</span>
            </div>
            <div class="content" v-show="isReceiver">

              <div class="task-row" style="display: flex;">
                <div class="row-item" style="display: flex;">
                  <div class="row-item-title">任务名称：</div>
                  <div class="row-item-content" style="word-break:break-all">{{taskData.taskName}}</div>
                </div>
                <div class="row-item">
                  <div class="row-item-title">任务类型：</div>
                  <div class="row-item-content">{{taskData.taskType}}</div>
                </div>
                <div class="row-item">
                  <div class="row-item-title"> 任务状态：</div>
                  <div class="row-item-content">{{taskData.taskStatus}}</div>
                </div>
                <div class="row-item">
                  <div class="row-item-title">发起时间：</div>
                  <div class="row-item-content">{{taskData.sendTime}}</div>
                </div>
              </div>
              <div class='task-row'>
                <div class="row-item">
                  <div class="row-item-title">发起人：</div>
                  <div class="row-item-content">{{taskData.sendName}}</div>
                </div>
                <div class="row-item">
                  <div class="row-item-title">接收人：</div>
                  <div class="row-item-content">{{taskData.acceptName}}</div>
                </div>
                <div class="row-item">
                  <div class="row-item-title">任务等级：</div>
                  <div class="row-item-content">{{taskData.taskLevel}}</div>
                </div>
                <div class="row-item">
                  <div class="row-item-title">截止日期：</div>
                  <div class="row-item-content" v-show="taskData.endTime">{{taskData.endTime | timeFormat}}</div>
                  <div class="row-item-content" v-show="!taskData.endTime" style="color: #aaa;">空</div>
                </div>
              </div>
              <div class="task-row">
                <div class="row-item row-item-100">
                  <div class="row-item-title">任务描述：</div>
                  <div class="desc-content" v-show="taskData.description">{{taskData.description}}</div>
                  <div class="desc-content" v-show="!taskData.description" style="color: #aaa;">空</div>
                </div>
              </div>
            </div>
            <div class="content" v-show="!isReceiver">
              <Form ref="formValidate" :model="taskData" :rules="ruleValidate" :label-width="80">
                <div class="task-row">
                  <div class="row-item">
                    <FormItem prop="taskName" label="任务名称" class="formItem">
                      <Input
                        v-model="taskData.taskName"
                      />
                    </FormItem>
                  </div>
                  <div class="row-item">
                    <FormItem label="任务类型" class="formItem">
                      <Input
                        :value="taskData.taskType"
                        disabled
                      />
                    </FormItem>
                  </div>
                  <div class="row-item">
                    <FormItem label="任务状态" class="formItem">
                      <Input
                        v-model="taskData.taskStatus"
                        disabled
                        v-if="!canChangeTaskLevel || (canChangeTaskLevel && (taskData.taskStatus !== '待确认' && taskData.taskStatus !== '暂缓' && taskData.taskStatus !== '关闭'))"
                      />
                        <Select
                          v-if="canChangeTaskLevel && (taskData.taskStatus === '待确认' || taskData.taskStatus === '暂缓' || taskData.taskStatus === '关闭')"
                          v-model="taskData.taskStatus"
                          >
                          <Option
                            v-for="status in taskStatus"
                            :key="status.tasksStatusId"
                            :value="status.tasksStatusName"
                          >{{status.tasksStatusName}}</Option>
                        </Select>
                      </FormItem>
                  </div>
                  <div class="row-item">
                    <FormItem class="formItem" label="发起时间" prop="sendTime" v-show="taskData.taskStatus === '待确认'">
                      <!-- <DatePicker
                        placeholder="请选择任务的发起时间"
                        type="datetime"
                        style="width: 100%"
                        :value="taskData.sendTime"
                        :options="taskSendOption"
                        @on-change="handleSendTimeChange"
                      ></DatePicker> -->
                      <DatePicker
                        placeholder="请选择任务的发起时间"
                        type="datetime"
                        style="width: 100%"
                        :editable="false"
                        format="yyyy-MM-dd HH:mm:ss"
                        :options="taskSendOption"
                        :time-picker-options="timePickerOptions"
                        :value="taskData.sendTime"
                        @on-change="handleSendTimeChange"
                        @on-open-change="handleSendTimeOpenChange"
                      ></DatePicker>
                    </FormItem>
                    <FormItem
                      class="formItem"
                      label="发起时间"
                      v-show="taskData.taskStatus !== '待确认'">
                      <Input
                        :value="taskData.sendTime"
                        disabled
                      />
                    </FormItem>
                  </div>
                </div>
                <div class="task-row">
                  <div class="row-item">
                    <FormItem class="formItem" label="发起人">
                      <Select
                        v-if="hasRightChangeSender"
                        style="textAlign: left; width: 90%;"
                        :value="taskData.sendUid"
                        :label-in-value="true"
                        v-model="taskData.sendUid"
                        filterable
                        remote
                      >
                        <Option
                          v-for="(option, index) in senderList"
                          :label="option.nickname"
                          :value="option.id"
                          :key="index">{{option.nickname}}</Option>
                      </Select>
                      <Input
                        v-else
                        v-model="taskData.sendName"
                        disabled
                      />
                    </FormItem>
                  </div>
                  <div class="row-item">
                    <FormItem class="formItem" prop="acceptName" label="接收人">
                      <Select
                        style="text-align: left;"
                        v-model="taskData.acceptUid"
                        filterable
                      >
                        <Option
                          v-for="(option, index) in employees"
                          :label="option.nickname"
                          :value="option.id"
                          :key="index">
                            {{option.nickname}}
                        </Option>
                      </Select>
                    </FormItem>
                  </div>
                  <div class="row-item">
                    <FormItem class="formItem" label="任务等级">
                      <!-- <Input
                        :value="taskData.taskLevel"
                        disabled
                      /> -->
                      <Input
                        :value="taskData.taskLevel"
                        disabled
                        v-if="!canChangeTaskLevel"
                        />
                        <Select
                          v-model="taskData.taskLevel"
                          v-if="canChangeTaskLevel"
                        >
                          <Option
                            v-for="level in taskLevels"
                            :value="level.tasksLevelName"
                            :key="level.tasksLevelId"
                          >{{level.tasksLevelName}}</Option>
                        </Select>
                    </FormItem>
                  </div>
                  <div class="row-item">
                    <FormItem class="formItem" prop="endTime" label="截止日期">
                      <DatePicker
                        format="yyyy-MM-dd"
                        :value="taskData.endTime"
                        :options="taskEndOptions"
                        style="width: 100%;"
                        @on-change="handleDateChange"
                        @on-open-change="handleEndTimeOpenChange"
                      ></DatePicker>
                    </FormItem>
                  </div>
                </div>
                <div class="task-row">
                  <div class="row-item row-item-100">
                    <FormItem label="任务描述" class="formItem">
                      <Input
                        v-model="taskData.description"
                        type="textarea"
                        :autosize="{minRow: 1}"
                        class="textArea"
                        style="width: 100%;"
                      />
                    </FormItem>
                  </div>
                </div>
              </Form>
            </div>
            <!-- 上传附件 -->
            <div class="content">
              <div class="task-row">
                <div class="row-item row-item-50">
                  <div class="row-item-title">附件：</div>
                  <div class="row-item-content">
                    <ul v-if="enclousureList && enclousureList.length" style="listStyle: none;">
                      <li
                        v-for="(item, index) in enclousureList"
                        :key="index"
                        class="attachment-item"
                        @mouseenter="showCancel(index)"
                        @mouseleave="hideCancel"
                      >
                        <Icon
                          type="ios-close"
                          class="close-icon"
                          @click="deleteAttachment(index)"
                          v-show="activeAttachmentIndex == index"
                        />
                        <a :href="staticUrl + item.enclosureUrl" :download="item.enclosureName">{{item.enclosureName}}</a>
                      </li>
                    </ul>
                    <span v-else style="color: #aaa;">空</span>
                  </div>
                </div>
                <div class="row-item row-item-50">
                  <div class="row-item-title" style="margin-bottom: 6px;">上传附件：</div>
                  <div class="row-item-content">
                    <Upload
                      name="fileData"
                      :max-size="20480"
                      :action="staticUrl + '/index.php'"
                      :on-success="handleSuccess"
                    >
                      <Button class="uploadButton" icon="ios-cloud-upload-outline">单个文件不能超过20M</Button>
                    </Upload>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 任务方案 -->
          <div class="section">
            <div class="title border-none">
              <Icon type="md-school" style="color: #19aa8d;margin-right: 10px;" size="20"/>
              <span class="title-name">任务方案</span>
            </div>
            <div class="table-content">
              <div class="table">
                <table style="table-layout:automatic;word-break:break-all;">
                  <thead>
                    <tr class="head-row">
                      <th v-for="title in columns" :key="title.key">{{title.title}}</th>
                    </tr>
                  </thead>
                  <tbody v-if="hasPlan">
                    <!-- 是否有已完成方案 -->
                    <tr v-if="hasCompletedPlan">
                      <td colspan="7" style="textAlign: center;">
                        <div v-show="fold">
                          <span @click="toggleFoldStatus" class="toggle close">点击合并已完成方案</span>
                        </div>
                        <div v-show="!fold">
                          <span @click="toggleFoldStatus" class="toggle open">点击展开已完成的方案</span>
                        </div>
                      </td>
                    </tr>
                    <tr
                      v-for="(item, index) in rowData"
                      :key="item.id"
                      v-show="item.taskPlanStatus !== '完成' || fold"
                    >
                      <td style="min-width: 50px;">{{index + 1}}</td>
                      <td style="width: 270px; min-width: 270px;">
                        <!-- 已完成不可编辑 -->
                        <div v-show="item.taskPlanStatus=='完成'">
                            <span>{{item.taskPlanStarttime}}</span> ~
                            <span>{{item.taskPlanEndtime}}</span>
                        </div>
                        <div v-if="item.taskPlanStatus!== '完成'">
                          <div style="position: relative;">
                            <div v-if="item.errMsg && item.errMsg.dateErrMsg !== ''" class="popover" style="top: -45px;">
                              {{item.errMsg && item.errMsg.dateErrMsg}}
                            </div>
                            <DatePicker
                              type="daterange"
                              placeholder="方案起止时间"
                              :transfer="true"
                              :value="[item.taskPlanStarttime, item.taskPlanEndtime]"
                              :options="planStartOptions"
                              @on-change="(value) => changePlanDate(value, item, index)"
                              @on-open-change="(flag) => handleOpenChange(flag, item)"
                            >
                            </DatePicker>
                          </div>
                        </div>
                      </td>
                      <td style="width: 200px; min-width: 200px; height: 100%">
                        <div
                          v-if="item.taskPlanStatus=='完成'"
                          style="position: relative; height: 100%;"
                        >
                          {{item.executors | executor}}
                        </div>
                        <div v-if="item.taskPlanStatus!== '完成'" style="position: relative;">
                          <div v-if="item.errMsg && item.errMsg.executorErrMsg !== ''" class="popover" style="top: -45px;">
                            {{item.errMsg && item.errMsg.executorErrMsg}}
                          </div>
                          <Input
                            type="textarea"
                            class="textArea"
                            :autosize="true"
                            :value="getNames(item.executors)"
                            placeholder="请选择执行人"
                            v-if="index !== currentSelectIndex"
                            @on-focus="() => updateIndex(index, item)"
                          />
                          <treeselect
                            v-else
                            class="treeSelectWrapper"
                            @select="(node, nodeId) => handleSelect(node, nodeId, item, index)"
                            @deselect="(node, nodeId) => handleDeselect(node, nodeId, item, index)"
                            clearAllText="清空"
                            noResultsText="暂无数据"
                            placeholder="请选择执行人"
                            :appendToBody="true"
                            :beforeClearAll="() => handleClearAll(item)"
                            :maxHeight="200"
                            :value="getIds(item.executors)"
                            :multiple="true"
                            :options="options"
                            :value-consists-of="valueConsistsOf"
                            :default-expand-level="1"
                            :backspaceRemoves="false"
                            :flattenSearchResults="true"
                            :ref="'executorSelect' + index"
                          />
                        </div>
                      </td>
                      <td style="min-width: 200px; width: 200px;">
                        <div v-show="item.taskPlanStatus=='完成'" style="text-align: left; overflow: hidden;">
                          <!-- {{item.taskPlanContent}} -->
                          <p style="overflow: hidden;">
                            <pre class="pre" style="width: 200px; text-align: left; white-space: pre-wrap; word-wrap: break-word;">{{item.taskPlanContent}}</pre>
                          </p>
                        </div>
                        <div v-if="item.taskPlanStatus!== '完成'" style="position: relative;">
                          <div v-if="item.errMsg && item.errMsg.planErrMsg !== ''" class="popover" style="top: -45px;">
                            {{item.errMsg && item.errMsg.planErrMsg}}
                          </div>
                          <Input
                            style="min-width: 200px;"
                            type="textarea"
                            class="textArea"
                            :autosize="true"
                            warp="soft"
                            :value="item.taskPlanContent"
                            @on-change="(e) => handleTaskPlanChange(e, item)"
                          />

                        </div>
                      </td>
                      <td style="min-width: 100px">
                        <div>
                          <!-- {{item.taskPlanStatus}} -->
                          <span v-if="item.taskPlanStatus=='完成'"  style="color: #19AA8D">{{item.taskPlanStatus}}</span>
                          <span v-else style="color: #FAAD14">{{item.taskPlanStatus}}</span>
                        </div>
                      </td>
                      <td style="min-width: 150px">
                        <div v-if="item.taskPlanStatus=='完成'" style="text-align: left">
                          {{item.comment}}
                        </div>
                        <div v-if="item.taskPlanStatus!== '完成'">
                          <Input
                            type="textarea"
                            class="textArea"
                            :rows="1"
                            :autosize="true"
                            v-model="item.comment"
                            placeholder="评论"
                          />
                        </div>
                      </td>
                      <td style="min-width: 150px">
                        <div v-if="item.taskPlanStatus=='完成'">
                          <Button
                            type="primary"
                            size="small"
                            @click="addRowInline(index)"
                          >
                            增加
                          </Button>
                        </div>
                        <div v-if="item.taskPlanStatus!== '完成'">
                          <Button
                            type="primary"
                            size="small"
                            @click="addRowInline(index)"
                          >
                            增加
                          </Button>
                          <Button
                            type="error"
                            style="marginLeft: 5px;"
                            size="small"
                            @click="deleteRowInline(index)"
                          >
                            删除
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="rowData && rowData.length == 0">
                      <td colspan="7">
                        <span v-if="(isReceiver || isSender)" @click="addRow" style="cursor: pointer">
                          <Icon type="md-add-circle" style="color: #19aa8d; margin-bottom: 3px; font-size: 18px;"/>
                          添加任务方案
                        </span>
                      </td>
                    </tr>
                  </tbody>
                  <!-- 没有方案 -->
                  <tbody v-else>
                    <tr v-for="(item, index) in rowData" :key="item.id">
                      <td style="min-width: 50px;">
                        {{index + 1}}
                      </td>
                      <td style="width: 270px; min-width: 270px;">
                        <div style="position: relative;">
                          <div v-if="item.errMsg && item.errMsg.dateErrMsg !== ''" class="popover" style="top: -45px">
                            {{item.errMsg && item.errMsg.dateErrMsg}}
                          </div>
                          <DatePicker
                            type="daterange"
                            placeholder="方案起止时间"
                            :transfer="true"
                            :value="[item.taskPlanStarttime, item.taskPlanEndtime]"
                            :options="planStartOptions"
                            @on-change="(value) => changePlanDate(value, item, index)"
                            @on-open-change="(flag) => handleOpenChange(flag, item)"
                          >
                          </DatePicker>
                        </div>
                      </td>
                      <td style="width: 200px; min-width: 200px;">
                        <div style="position: relative;">
                          <div v-if="item.errMsg && item.errMsg.executorErrMsg !== ''" class="popover" style="top: -45px;">
                            {{item.errMsg && item.errMsg.executorErrMsg}}
                          </div>
                          <Input
                            type="textarea"
                            class="textArea"
                            :autosize="true"
                            :value="getNames(item.executors)"
                            placeholder="请选择执行人"
                            v-if="index !== currentSelectIndex"
                            @on-focus="() => updateIndex(index, item)"
                          />
                          <treeselect
                            v-else
                            class="treeSelectWrapper"
                            @select="(node, nodeId) => handleSelect(node, nodeId, item, index)"
                            @deselect="(node, nodeId) => handleDeselect(node, nodeId, item, index)"
                            clearAllText="清空"
                            noResultsText="暂无数据"
                            placeholder="请选择执行人"
                            :appendToBody="true"
                            :beforeClearAll="() => handleClearAll(item)"
                            :maxHeight="200"
                            :value="getIds(item.executors)"
                            :multiple="true"
                            :options="options"
                            :value-consists-of="valueConsistsOf"
                            :default-expand-level="1"
                            :backspaceRemoves="false"
                            :flattenSearchResults="true"
                            :ref="'executorSelect' + index"
                          />
                        </div>
                      </td>
                      <td style="min-width: 200px; width:200px">
                        <div style="position: relative;">
                          <div v-if="item.errMsg && item.errMsg.planErrMsg !== ''" class="popover" style="top: -45px;">
                            {{item.errMsg && item.errMsg.planErrMsg}}
                          </div>
                          <Input
                            type="textarea"
                            class="textArea"
                            :autosize="true"
                            :value="item.taskPlanContent"
                            @on-change="(e) => handleTaskPlanChange(e, item)"
                          />

                        </div>
                      </td>
                      <td style="min-width: 100px">
                        <!-- {{item.taskPlanStatus}} -->
                        <span v-if="item.taskPlanStatus=='完成'"  style="color: #19AA8D">{{item.taskPlanStatus}}</span>
                        <span v-else style="color: #FAAD14">{{item.taskPlanStatus}}</span>
                      </td>
                      <td style="min-width: 150px;">
                        <Input
                          v-model="item.comment"
                          placeholder="评论"
                        />
                      </td>
                      <td style="min-width: 150px">
                        <div>
                          <Button
                            type="primary"
                            size="small"
                            @click="addRowInline(index)"
                          >增加
                          </Button>
                          <Button
                            type="error"
                            style="marginLeft: 5px;"
                            size="small"
                            @click="deleteRowInline(index)"
                          >
                            删除
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr v-show="rowData && rowData.length == 0">
                      <td colspan="7">
                        <span v-show="(isReceiver || isSender)" @click="addRow" style="cursor: pointer">
                          <Icon type="md-add-circle" style="color: #19aa8d; margin-bottom: 3px; font-size: 18px;"/>
                          添加任务方案
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- <Table :columns="columns" :data="rowData" class="detail-table"></Table> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btnFixed">
      <Button
        class="cancel btn"
        type="default"
        @click="cancelEditInEdit"
        v-show="!saveLoading"
      >
      <!-- @click="handleCancelEdit" -->
        取消
      </Button>
      <Button
        class="submit btn"
        type="primary"
        @click="handleSave"
        :loading="saveLoading"
      >
        保存
      </Button>
    </div>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import InfoBoard from './components/info-board'
import { staticUrl } from '@/api/base'
import { detailAndEditMixin } from '@/assets/js/mixins.js'

import moment from 'moment'

export default {
  name: 'taskedit',
  mixins: [detailAndEditMixin],
  components: {
    InfoBoard,
    Treeselect
  },
  data () {
    return {
      // 当前点击的下拉选择框（执行人）
      currentSelectIndex: -1,
      index: '',
      edit: false,
      show: true,
      // 标识位，用来判断是否点击后退
      isRouteLeaving: false,
      offsetHeight: 0,
      // 是否显示提示为点击popover
      activeIndex: -1,
      // 保存按钮
      showSaveBtn: false,
      // 取消编辑
      showCancelBtn: false,
      // 是否可以修改发起人
      hasRightChangeSender: false,
      // 可选发起人列表
      senderList: [],
      // 是否有任务方案
      hasPlan: false,
      // 合并展开已完成任务
      fold: false,
      // 静态资源上传地址
      staticUrl,
      // 表头信息
      columns: [
        {
          title: '序号',
          key: 'itemNo'
        },
        {
          title: '完成时间',
          key: 'finishTime'
        },
        {
          title: '执行人',
          key: 'executor'
        },
        {
          title: '方案',
          key: 'taskPlan'
        },
        {
          title: '方案状态',
          key: 'taskPlanStatus'
        },
        {
          title: '评论',
          key: 'comment'
        },
        {
          title: '操作',
          key: ''
        }
      ],
      // 添加行的字段
      initTaskPlanData: {
        taskPlanEndtime: '',
        executors: '',
        taskPlanContent: '',
        taskPlanStatus: '',
        comment: '',
        errMsg: {
          dateErrMsg: '',
          executorErrMsg: '',
          planErrMsg: ''
        }
      },
      // 表体信息
      rowData: [],
      taskData: {}
    }
  },
  created () {
    // 当前登录人id
    this.uid = this.$store.state.user.userId
    // 任务id
    this.tid = this.$route.params.id
    // this.getTaskData()
    this.initTaskData = {}
    this.canChangeSender()
  },
  methods: {
    // formatList(list) {
    //   let arr = [{
    //     id: 'bz',
    //     label: '马鞍山百助网络科技有限公司',
    //     children: []
    //   }]
    //   let obj = {}
    //   list.forEach((item, index) => {
    //     if (!obj[item.deptName]) {
    //       obj[item.deptName] = {}
    //       obj[item.deptName].label = item.deptName
    //       obj[item.deptName].id = item.deptName
    //       obj[item.deptName].children = []
    //     }
    //     obj[item.deptName].children.push({
    //       id: item.id,
    //       label: item.nickname
    //     })
    //   })
    //   let keys = Object.keys(obj)
    //   keys.forEach(key => {
    //     console.log(key)
    //     if (key !== 'undefined') {
    //       if (key === '马鞍山百助网络科技有限公司') {
    //         arr[0].children = [...obj[key].children, ...arr[0].children]
    //       } else {
    //         arr[0].children.push(obj[key])
    //       }
    //     }
    //   })
    //   // console.log(arr, 'arr')
    //   return arr
    // }
  },
  filters: {
    executor (data) {
      if (!data) return
      let names = data.map(person => {
        return person.name
      })
      return names.join(' ')
    },
    timeFormat (date) {
      if (!date) return
      return moment(date).format('YYYY-MM-DD')
    },
    getUnConfirmed (executors) {
      let arr = []
      let unConfirmed = executors.filter(executor => {
        return executor.red
      })

      unConfirmed.forEach(item => {
        arr.push(`"${item.name}"`)
      })
      return arr.join(' ')
    }
  }
}
</script>
<style lang="less">
  @import '~@/assets/style/variables.less';
  /**treeselect样式覆盖 */
  .vue-treeselect--focused:not(.vue-treeselect--open) .vue-treeselect__control {
      border-color: @color-theme-green;
      // box-shadow: 0 0 0 3px rgba(3, 155, 229, 0.1);
    }
    .vue-treeselect__multi-value-item {
      color: @color-theme-green;
    }
    .vue-treeselect:not(.vue-treeselect--disabled) .vue-treeselect__multi-value-item:not(.vue-treeselect__multi-value-item-disabled):hover .vue-treeselect__multi-value-item:not(.vue-treeselect__multi-value-item-new) .vue-treeselect__multi-value-item:not(.vue-treeselect__multi-value-item-new):hover {
      color: @color-theme-green;
    }
    .vue-treeselect__label-container:hover .vue-treeselect__checkbox--unchecked {
      border-color: @color-theme-green;

    }
    .vue-treeselect__checkbox--indeterminate {
      border-color: @color-theme-green;
      background: @color-theme-green;
    }
    .vue-treeselect__label-container:hover .vue-treeselect__checkbox--indeterminate {
      border-color: @color-theme-green;
      background: @color-theme-green;
    }
    .vue-treeselect__checkbox--checked {
      border-color: @color-theme-green;
      background: @color-theme-green;
    }
    .vue-treeselect__label-container:hover .vue-treeselect__checkbox--checked {
      border-color: @color-theme-green;
      background: @color-theme-green;
    }
    .vue-treeselect__error-tip .vue-treeselect__retry {
      color: @color-theme-green;
    }
    .vue-treeselect__icon-loader::before {
      background: @color-theme-green;
    }
    .pre {
      font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","\5FAE\8F6F\96C5\9ED1",Arial,sans-serif;
    }
</style>
<style scoped lang="less">
@import '~@/assets/style/variables.less';
.textArea /deep/ textarea {
  font-size: 14px;
}
.detail-page-wrapper {
  margin: 20px;
  box-sizing: border-box;
  overflow: hidden;
  background: #fff;
  height: calc(100vh - 145px);
  position: relative;
  .btnFixed {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    background:#fff;
    box-shadow: 0px 0px 6px 3px #eee;
    border-radius: 5px;
    padding: 0 10px;
    .btn {
      margin: 15px 10px;
    }
  }
}
.menu {
  width:100%;
}
.taskContent {
  font-size:14px;
}
.rowContent {
  padding:5px 15px;
  &:first-child {
    padding-top: 20px;
  }
}
.detailPage {
  height: 100%;
  overflow-y: scroll;
  position: relative;
}
.detailPage .pageTop  {
  width: 100%;
  height: 250px;
  padding: 11px 10px 0 10px;
  background: #19aa8d;
  position: relative;
}
.pageTop .basicInfoContent {
    /* margin: 13px 0 0 0; */
    padding: 0 95px;
    width: 100%;
    position: relative;
    z-index: 0;
}
.basicInfoContent .basicInfo {
    display: flex;
}
.basicInfo .basicInfoBox {
    width: 100%;
    margin: 0 0 0 0;
    color: #fff;
}
.basicInfo .basicInfoTop {
    width: 100%;
    /* height: 50px; */
    border-bottom: 1px solid #fff;
}
.basicInfoBox .basicInfoName {
  display: inline-block;
  font-size: 24px;
  max-width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.basicInfoBox .basicInfoBottom {
  width: 100%;
  margin: 10px 0 0 0;
}
.basicInfoBox .contentBox {
  margin: 0;
  padding: 0;
  display: inline-block;
}
.basicInfoBox .timeCount {
  float: right;
}
.detailPage .pageMiddle {
  background: #fff;
  padding: 0px 30px;
  border-radius: 10px;
  margin-bottom: 100px;
  box-shadow: 1px 1px 10px 0px #ddd;
}
.page-middle-wrapper {
  position: absolute;
  top: 205px;
  bottom: 0;
  left: 30px;
  right: 30px;
  box-sizing: border-box;
  // overflow-y: scroll;
}
.section {
  .title {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ddd;
    height: 50px;
    line-height: 50px;
    &.border-none {
      border-bottom: none;
    }
    .title-name {
      font-size: 16px;
      font-weight: 700;
    }
    .wrapper {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      .edit-button {
        color: @color-theme-green;
        border: 1px solid @color-theme-green;
      }
    }
  }
  .content {
    padding: 20px 20px 0 20px;
    &:last-child {
      padding-top: 0;
    }
    .task-row {
      display: flex;
      margin: 18px 0;
      .row-item {
        display: flex;
        align-items: center;
        width: 25%;
        &.row-item-100 {
          width: 100%;
        }
        &.row-item-50 {
          width: 50%;
        }
        .row-item-title {
          min-width: 80px;
          text-align: right;
          font-size: 14px;
          font-weight: 700;
        }
        .row-item-content {
          font-size: 14px;
        }
        .formItem {
          width: 100%;
          font-weight: 700;
        }
        .formItem /deep/ .ivu-form-item-label {
          font-size: 14px !important;
        }
        .desc-content {
          width: 95%;
          word-break: break-all;
        }
      }
    }
    // .rowContent {
    //   .content-title {
    //     text-align: right;
    //     .task-desc {
    //       margin-left: 7px;
    //     }
    //   }
    // }

  }
  .table-content {
    @media screen and (max-width: 980px) {
      .table {
        overflow-x: scroll;
      }
      table {
        width: 150%;
      }
    }
    .table {
      margin-top: 5px;
      padding-bottom: 15px;
      width: 100%;
      overflow-x: scroll;
      font-size: 14px;
      table {
        width: 100%;
        border-collapse: collapse;
        tr {
          height: 35px;
          &.head-row {
            background:#f8f8f9;
          }
        }
        th, td {
          border: 1px solid #e8eaec;
          text-align: center;
          padding: 10px;
          .popover {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            left: 50%;
            transform: translateX(-50%);
            color: #fff;
            width: 150px;
            background: rgba(0,0,0,.7);
            border-radius: 3px;
            padding: 10px;
            box-sizing: border-box;
            z-index: 100;
            &::after {
              position: absolute;
              content: '';
              width: 0;
              height: 0;
              border-top: 5px solid;
              border-top-color:rgba(0, 0, 0, 0.7);
              border-left: 5px solid transparent;
              border-bottom: 5px solid transparent;
              border-right: 5px solid transparent;
              bottom: -10px;
              left: 50%;
              transform: translateX(-50%);
            }
          }
          .hide {
            animation: cssHide 0s ease-in 1s forwards;
            animation-fill-mode: forwards;
          }
          @keyframes cssHide {
            to {
              width: 0;
              height: 0;
              opacity: 0;
              overflow: hidden;
            }
          }
        }
      }
      .toggle {
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
  .logs {
    margin-top: 30px;
    .ivu-collapse {
      border: none;
      .log-detail {
        box-shadow: 3px 3px 3px #ccc;
        padding: 10px;
      }
      .log-btn {
        color: @color-theme-green;
        border: 1px solid @color-theme-green;
      }
    }
  }
  .operations {
    text-align: center;
    margin-top: 20px;
    .confirm {
      background: @color-theme-green;
      color: #fff;
    }
    .delay {
      margin: 0 30px;
    }
    .submit {
      margin-right: 30px;
    }
  }
  .attachment-item {
    position: relative;
    display: block;
    margin: 5px 10px;
    // margin-right: 10px;
    border-radius: 3px;
    &:hover {
      background: #f3f3f3;
    }
    a {
      // display: inline-block;
      display: inline-block;
      padding: 0 20px 0 10px;
    }
    .close-icon {
      position: absolute;
      right: 0;
      font-size: 18px;
    }
  }
}

.clearfix{
    zoom:1;
    overflow: hidden;
}
.pageMiddle .menu{
    display: inline-block;
}
.pageMiddle .menu ul {
    margin: 0;
    padding: 0;
    float: left;
}
.pageMiddle .menu ul li{
    margin: 0 10px 0 0;
    font-size: 14px;
    color: #666666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    float: left;
    cursor: pointer;
}
.pageMiddle .menu ul span {
    margin: 0 0 0 10px;
}
.pageMiddle .menu ul .menuActive{
    color: #19aa8d !important;
}
.flexField{
    margin-top: 20px;
}
.flexField .header{
    padding: 0 0 10px 0;
    border-bottom: 1px solid #E0E0E0;
}
.flexField .basicFlexName{
    font-size: 18px;
    color: #333333;
    vertical-align: middle;
    margin: 0 0 0 10px;
}
.flexField .buttonBox{
    float:right;
}

.flexField .ivu-btn {
    color: #19aa8d;
    background-color: #fff;
    border-color: #19aa8d;
}
.flexField .ivu-btn {
    box-shadow:  #19aa8d;
}
.indexBody #detailContent .ivu-tabs-bar{
    border-bottom:none;
}

</style>
