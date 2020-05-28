<template>
<!--任务详情-->
  <div class="detail-page-wrapper">
    <div class="detail-page" style="position: relative">
      <Spin size="large" fix v-show="spinShow && !isPhone"></Spin>
      <!--task general info-->
      <info-board :info="info" @button-back="handleButtonBack"></info-board>
      <!-- main-content -->
      <div class="page-middle-wrapper">
        <div class="page-middle" :class="(taskData.taskStatus === '完成' && !isCommenting && !taskData.button.levelChange) || (taskData.taskStatus !== '完成' && (!isSender && !isReceiver)) ? 'margin-bottom-30' : ''">
          <!-- 任务信息 -->
          <div class="section">
            <div class="title">
              <Icon type="md-school" style="color: #19aa8d;margin-right: 10px;" size="20"/>
              <span class="title-name">任务信息</span>
            </div>
            <!-- 不是编辑状态(或者没有编辑权限)||显示编辑按钮(有编辑权限)但是是接收人 -->
            <div class="content" v-if="!isEditing || isReceiver">
              <div class="task-row" style="display: flex;">
                <div class="row-item" style="display: flex;">
                  <div class="row-item-title">任务名称：</div>
                  <div class="row-item-content" style="word-break:break-all">{{taskData.taskName}}</div>
                </div>
                <div class="row-item">
                  <div class="row-item-title">任务类型：</div>
                  <div class="row-item-content">
                    {{taskData.taskType}}
                    <Tooltip v-if="taskData.taskType==='简易任务'" placement="top" max-width="450">
                      <Icon class="pointer" type="md-help-circle" size="16" style="margin-bottom: 2px"/>
                      <div slot="content">
                        <p>简易任务说明：</p>
                        <p>1、简易任务时间不得超过两天，发布后的任务不需要进行方案确认，会直接进入到“进行中”的状态。</p>
                        <p>2、无需另外填写任务方案，所填写的任务名称即为任务方案的唯一内容。</p>
                        <p>3、若截止时间选择了两天的任务，只会生成一条跨度为两天的任务方案，接收人需每天进行完成确认。</p>
                        <p>4、接收人整个任务完成后，发起人也需进行完成确认，确认后该任务结束。</p>
                      </div>
                    </Tooltip>
                  </div>
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
              <div class="task-row">
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
            <!-- 登录人是发起人并且在编辑 -->
            <div class="content" v-if="isSender && isEditing">
              <Form ref="formValidate" :model="taskData" :rules="ruleValidate" :label-width="80">
                <div class="task-row task-row-20">
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
                      <!-- <Input
                        v-model="taskData.taskStatus"
                        disabled
                      /> -->
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
                    <FormItem
                      class="formItem"
                      label="发起时间"
                      prop="sendTime"
                      v-show="taskData.taskStatus === '待确认'">
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
                <div class="task-row task-row-20">
                  <div class="row-item">
                    <FormItem label="发起人" class="formItem">
                      <Select
                        v-show="hasRightChangeSender"
                        style="text-align: left;"
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
                        v-show="!hasRightChangeSender"

                        v-model="taskData.sendName"
                        disabled
                      />
                    </FormItem>
                  </div>
                  <div class="row-item">
                    <FormItem prop="acceptName" label="接收人" class="formItem">
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
                    <FormItem label="任务等级" class="formItem">
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
                    <FormItem prop="endTime" label="截止日期" class="formItem">
                      <DatePicker
                        format="yyyy-MM-dd"
                        :value="taskData.endTime"
                        :options="taskEndOptions"
                        style="width: 100%"
                        @on-change="handleDateChange"
                        @on-open-change="handleEndTimeOpenChange"
                      ></DatePicker>
                    </FormItem>
                  </div>
                </div>
                <div class="task-row task-row-20">
                  <div class="row-item row-item-100">
                    <FormItem label="任务描述" class="formItem">
                      <Input
                        v-model="taskData.description"
                        type="textarea"
                        class="textArea"
                        :autosize="{minRow: 1}"
                        style="width: 100%;"
                      />
                    </FormItem>
                  </div>
                </div>
              </Form>
            </div>
            <!-- 上传附件 -->
            <div class="content enclosoure">
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
                        <!-- <a href="http://origin.static.nnnnzs.cn/upload/bing/20190816.png" download="kkk">{{item.enclosureName}}</a> -->
                        <!-- <a @click="createALink(item)">{{item.enclosureName}}</a> -->
                      </li>
                    </ul>
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
                      :on-exceeded-size="handleExceeded"
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
            <!-- 表格 -->
            <div class="table-content">
              <div class="task-table">
                <table>
                  <thead>
                    <tr class="head-row">
                      <th v-for="title in columns" :key="title.key">{{title.title}}</th>
                    </tr>
                  </thead>
                  <tbody v-if="taskData && taskData.taskType=='简易任务'">
                    <tr>
                      <td style="min-width: 50px">1</td>
                      <td style="min-width: 200px; width: 200px">
                        <div style="position: relative;">
                          <DatePicker
                            disabled
                            type="daterange"
                            placeholder="方案起止时间"
                            :transfer="true"
                            :options="planStartOptions"
                            :value="[taskData.sendTime, taskData.endTime]"
                          >
                          </DatePicker>
                        </div>
                      </td>
                      <td style="width: 200px; min-width: 200px;height: 100%;">
                        <div style="position: relative;">
                          <Input
                            disabled
                            type="textarea"
                            class="textArea"
                            :rows="1"
                            :autosize="true"
                            v-model="taskData.acceptName"
                          />
                        </div>
                      </td>
                      <td style="min-width:200px; width: 200px">
                        <div style="position: relative;">
                          <Input
                            disabled
                            type="textarea"
                            class="textArea"
                            :rows="1"
                            :autosize="true"
                            v-model="taskData.taskName"
                          />
                        </div>
                      </td>
                      <td style="min-width:100px;">
                        <!-- {{taskData.taskStatus}} -->
                        <span v-if="taskData.taskStatus=='完成'"  style="color: #19AA8D">{{taskData.taskStatus}}</span>
                        <span v-else style="color: #FAAD14">{{taskData.taskStatus}}</span>
                      </td>
                      <td style="min-width:150px;">
                        <Input
                          v-if="taskData.content && taskData.content.length"
                          type="textarea"
                          class="textArea"
                          placeholder="评论"
                          :autosize="{minRows: 1}"
                          v-model="taskData.content[0].comment"
                          @on-change="(e) => handleCommentChange(e, taskData.content[0])"
                        />
                      </td>
                      <td style="min-width:150px;">
                        <div>
                          <Button
                            type="primary"
                            style="marginRight: 5px;"
                            size="small"
                            :loading="loadingStatus"
                            @click="executorFinishTaskPlan(taskData.content[0])"
                            v-if="taskData.content && taskData.content[0] && taskData.content[0].completeButtonEmerge"
                          >完成
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <template v-if="hasPlan">
                      <tr v-if="hasCompletedPlan && showFoldBtn()">
                        <td colspan="7" style="text-align: center;">
                          <div v-show="fold">
                            <span @click="toggleFoldStatus" class="toggle close">点击合并已完成方案</span>
                          </div>
                          <div v-show="!fold">
                            <span @click="toggleFoldStatus" class="toggle open">点击展开已完成的方案</span>
                          </div>
                        </td>
                      </tr>
                      <!-- <transition-group name="slide"> -->
                      <tr
                        class="row"
                        v-for="(item, index) in rowData"
                        :key="item.id"
                        v-show="(item.taskPlanStatus !== '完成' || fold) || (taskData.taskStatus !== '完成' && item.taskPlanStatus =='完成' && shouldOpen(item))"
                      >
                        <td style="min-width: 50px;">{{index + 1}}</td>
                        <td style="width: 270px; min-width: 270px;">
                          <!-- 已完成不可编辑 -->
                          <div v-if="!isEditing || item.taskPlanStatus=='完成'">
                            <span>{{item.taskPlanStarttime}}</span> ~
                            <span>{{item.taskPlanEndtime}}</span>
                          </div>
                          <div v-show="isEditing && item.taskPlanStatus!== '完成'">
                            <div style="position: relative;">
                              <div v-show="item.errMsg && item.errMsg.dateErrMsg !== ''" class="popover" style="top: -45px;">
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
                            class=""
                            v-if="!isEditing || item.taskPlanStatus=='完成'"
                            style="position: relative; height: 100%; text-align: center;"
                            @mouseenter="handleMouseEnter(item.executors, $event, index)"
                            @mouseleave="handleMouseLeave"
                          >
                            <p style="text-align: left; display: inline-block;">{{item.executors | executor}}</p>
                            <transition name="fade">
                              <div
                                class="popover"
                                :style="styleObj"
                                v-show="activeIndex == index && (item.taskPlanStatus == '待确认' || '进行中')"
                              >
                                还有 {{item.executors | getUnConfirmed}} 未点击 {{item.taskPlanStatus == '待确认' ? '确认' : '完成'}}
                              </div>
                            </transition>
                          </div>
                          <div v-if="isEditing && item.taskPlanStatus!== '完成'" style="position: relative;">
                            <div v-show="item.errMsg && item.errMsg.executorErrMsg !== ''" class="popover" style="top: -45px;">
                              {{item.errMsg && item.errMsg.executorErrMsg}}
                            </div>
                            <Input
                              v-if="index !== currentSelectIndex"
                              type="textarea"
                              class="textArea"
                              :autosize="true"
                              :value="getNames(item.executors)"
                              placeholder="请选择执行人"
                              @on-focus="() => updateIndex(index)"
                            />
                            <treeselect
                              v-else
                              @keydown.ctrl.67.native="e=>copyExecutors(e,item)"
                              @keydown.ctrl.86.native="e=>pasteExecutors(e,item)"
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
                          <div v-if="!isEditing || item.taskPlanStatus=='完成'" style="text-align: left; overflow: hidden;">
                            <p style="overflow: hidden;">
                              <pre class="pre"
                                style="width: 200px; text-align: left; white-space: pre-wrap; word-wrap: break-word;"
                              >{{item.taskPlanContent}}</pre>
                            </p>
                          </div>
                          <div v-if="isEditing && item.taskPlanStatus!== '完成'" style="position: relative;">
                            <div v-show="item.errMsg && item.errMsg.planErrMsg !== ''" class="popover" style="top: -45px;">
                              {{item.errMsg && item.errMsg.planErrMsg}}
                            </div>
                            <Input
                              style="min-width: 200px;"
                              v-show="isEditing && item.taskPlanStatus!== '完成'"
                              type="textarea"
                              class="textArea"
                              :autosize="true"
                              warp="soft"
                              @on-change="(e) => handleTaskPlanChange(e, item, index)"
                              :value="item.taskPlanContent"
                              clearable
                            />
                            <!--  -->
                          </div>
                        </td>
                        <td style="min-width: 100px">
                          <div>
                            <!-- {{item.taskPlanStatus}} -->
                            <span v-if="item.taskPlanStatus=='完成'"  style="color: #19AA8D">{{item.taskPlanStatus}}</span>
                            <span v-else style="color: #FAAD14">{{item.taskPlanStatus}}</span>
                          </div>
                        </td>
                        <td style="min-width: 150px;">
                          <div>
                            <Input
                              type="textarea"
                              class="textArea"
                              :autosize="{minRows: 1}"
                              v-model="item.comment"
                              @on-change="(e) => handleCommentChange(e, item)"
                              placeholder="评论"
                            />
                              <!-- :disabled="!canComment(item)" -->
                          </div>
                        </td>
                        <td style="min-width: 150px">
                          <div v-if="item.taskPlanStatus == '完成' && isEditing">
                            <Button
                              type="primary"
                              size="small"
                              @click="addRowInline(index)"
                            >
                              增加
                            </Button>
                          </div>
                          <div v-if="!isEditing || item.taskPlanStatus=='完成'">
                            <Button
                              type="primary"
                              style="marginRight: 5px;"
                              size="small"
                              :loading="loadingStatus"
                              v-if="item.completeButtonEmerge"
                              @click="executorFinishTaskPlan(item)"
                            >
                              完成
                            </Button>
                            <Button
                              type="primary"
                              size="small"
                              v-if="item.confirmButtonEmerge"
                              @click="confirmTaskPlan(item)"
                            >
                              确认
                            </Button>
                          </div>
                          <div v-show="isEditing && item.taskPlanStatus!== '完成'">
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
                      <!-- </transition-group> -->
                      <tr v-show="rowData && rowData.length == 0">
                        <td colspan="7">
                          <span v-show="(isReceiver || isSender)" @click="addRow" style="cursor: pointer;">
                            <Icon type="md-add-circle" style="color: #19aa8d; margin-bottom: 3px; font-size: 18px;"/>
                            添加任务方案
                          </span>
                        </td>
                      </tr>
                    </template>
                    <template v-else>
                      <tr v-for="(item, index) in rowData" :key="item.id">
                        <td style="min-width: 50px;">
                          {{index + 1}}
                        </td>
                        <td style="width: 200px; min-width: 200px;">
                          <div style="position: relative;">
                            <div v-show="item.errMsg && item.errMsg.dateErrMsg !== ''" class="popover" style="top: -45px;">
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
                            <div v-show="item.errMsg && item.errMsg.executorErrMsg !== ''" class="popover" style="top: -45px;">
                              {{item.errMsg && item.errMsg.executorErrMsg}}
                            </div>
                            <Input
                              v-if="index !== currentSelectIndex"
                              type="textarea"
                              class="textArea"
                              :autosize="true"
                              :value="getNames(item.executors)"
                              placeholder="请选择执行人"
                              @on-focus="() => updateIndex(index)"
                            />
                            <treeselect
                              v-else
                              class="treeSelectWrapper"
                              @keydown.ctrl.67.native="e=>copyExecutors(e,item)"
                              @keydown.ctrl.86.native="e=>pasteExecutors(e,item)"
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
                        <td style="min-width: 200px; width: 200px">
                          <div style="position: relative;">
                            <div v-show="item.errMsg && item.errMsg.planErrMsg !== ''" class="popover" style="top: -45px;">
                              {{item.errMsg && item.errMsg.planErrMsg}}
                            </div>
                            <Input
                              type="textarea"
                              class="textArea"
                              :autosize="{minRows: 1}"
                              style="height: auto"
                              clearable
                              :value="item.taskPlanContent"
                              @on-change="(e) => handleTaskPlanChange(e, item)"
                            />
                          </div>
                        </td>
                        <td style="min-width: 100px;">{{item.taskPlanStatus}}</td>
                        <td style="min-width: 150px;">
                          <Input
                            v-model="item.comment"
                            :autosize="{minRows: 1}"
                            placeholder="评论"
                            @on-change="(e) => handleCommentChange(e, item)"
                          />
                            <!-- :disabled="!canComment(item)" -->
                        </td>
                        <td style="min-width: 150px">
                          <div>
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
                      <tr v-show="taskData.taskType!='简易任务' && rowData && rowData.length == 0">
                        <td colspan="7">
                          <span v-show="(!isEditing)">还没有任务方案</span>
                          <span v-show="(isEditing)" @click="addRow" style="display: inline-block; cursor: pointer;">
                            <Icon type="md-add-circle" style="color: #19aa8d; margin-bottom: 3px; font-size: 18px;"/>
                            添加任务方案
                          </span>
                        </td>
                      </tr>
                      <tr v-show="taskData.taskType=='简易任务'"></tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
            <!-- 日志 -->
            <op-logs :task-logs="taskData.taskLog"></op-logs>
          </div>
        </div>
      </div>
    </div>
    <div class="btnFixed" v-if="taskData.taskStatus !== '完成' || isCommenting || taskData.button.levelChange">
      <div class="operations">
        <Button
          v-show="showEditBtn && !showCancelBtn"
          class="edit-button btn"
          @click="handleEdit"
          :loading="editLoading"
          type="primary"
        >编辑方案
        </Button>
        <Button
          v-show="showCancelBtn && !saveLoading"
          class="cancel-button btn"
          type="error"
          @click="handleCancelEdit"
        >取消编辑
        </Button>
        <!-- v-if="showSaveBtn" -->
        <Button
          class="btn"
          type="primary"
          :loading="saveLoading"
          @click="handleSave"
          v-if="isEditing || isCommenting"
        >保存
        </Button>
        <!-- 编辑状态只显示保存，取消按钮 -->
        <template v-if="!isEditing">
          <!-- 发起人 -->
          <!-- 发起人确认全部任务方案，在执行人点击确认后 -->
          <Button
            class="btn"
            type="primary"
            :loading="loadingStatus"
            v-if="taskData.content && taskData.content.length > 0 && taskData.button && taskData.button.confirmTasks"
            @click="senderConfirmTaskPlans(taskData)"
          >确认方案</Button>
          <!-- 发起人阶段性确认 -->
          <Button
            class="btn"
            type="primary"
            :loading="loadingStatus"
            v-if="taskData.content && taskData.content.length > 0 && taskData.button && taskData.button.stageConfirm"
            @click="stageConfirm(taskData)"
          >阶段性确认</Button>
          <!-- 发起人确认任务完成 -->
          <Button
            class="btn"
            type="primary"
            :loading="loadingStatus"
            v-if="taskData.button && taskData.button.finishTasks"
            @click="senderConfirmTaskFinish(taskData)"
          >完成</Button>
          <Button
            class="btn"
            type="primary"
            v-if="taskData.button && taskData.button.extendTasks"
            @click="extendTask"
          >延长任务</Button>
          <Button
            v-if="taskData.button&&taskData.button.levelChange&&!$route.params.from"
            type="primary"
            class="btn"
            @click="adjustTaskLevel"
            >等级调整
          </Button>
          <Button
            class="btn"
            type="error"
            v-if="isSender && taskData.taskStatus && (taskData.taskStatus !== '完成' && taskData.taskStatus !=='暂缓')"
            @click="deferTask"
          >暂缓任务</Button>
          <Button
            class="btn"
            type="error"
            v-if="(isSender || isSimpleTaskSender) && taskData.taskStatus && (taskData.taskStatus !== '完成' && taskData.taskStatus !== '关闭')"
            @click="closeTask"
          >关闭任务</Button>
        </template>
      </div>
    </div>
    <level-change
      @hide-level-change="hideModal"
      :show-modal="showModal"
      :level="level"
      :name="name"
      :id="id"
    ></level-change>
  </div>
</template>

<script>
// import bzTableVue from './components/bz-table.vue'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import OpLogs from './components/op-logs'
import InfoBoard from './components/info-board'
import LevelChange from './components/level-change'
import { baseUrl, staticUrl } from '@/api/base'
import { detailAndEditMixin } from '@/assets/js/mixins.js'
import moment from 'moment'

export default {
  name: 'taskdetail',
  mixins: [detailAndEditMixin],
  components: {
    OpLogs,
    InfoBoard,
    Treeselect,
    LevelChange
  },

  data () {
    return {
      // 当前点击的下拉选择框（执行人）
      currentSelectIndex: -1,
      baseUrl: baseUrl,
      staticUrl,
      info: {},
      // level: '',
      // name: '',
      edit: false,
      // 等级调整弹窗
      showModal: false,
      show: true,
      // 未完成任务人员提示框偏移量
      offsetHeight: 0,
      // 是否显示提示(未点击确认人的popover)
      activeIndex: -1,
      // 保存按钮
      showSaveBtn: false,
      // 取消编辑
      showCancelBtn: false,
      // 是否可以修改发起人
      hasRightChangeSender: false,
      // 可选发起人列表
      senderList: [],
      // 是否在编辑
      isEditing: false,
      // 是否有任务方案
      hasPlan: false,
      // 合并展开已完成任务
      fold: false,
      // 是否在评论
      isCommenting: false,
      // 编辑按钮loading
      editLoading: false,
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
        // comment: '',
        errMsg: {
          dateErrMsg: '',
          executorErrMsg: '',
          planErrMsg: ''
        }
      },
      initTaskData: {},
      // 表体信息
      rowData: [],
      taskData: {},
      copyExecutorsIds: []
    }
  },
  methods: {
    // 收起展开按钮
    showFoldBtn () {
      // 任务已完成一定显示
      if (this.taskData.taskStatus === '完成') return true
      // 最后一条完成方案时间等于第一条方案时间不显示
      console.log(this.lastCompletePlanTime, 'sss')
      // let hasForCompletePlan
      if (this.lastCompletePlanTime === this.rowData[0].taskPlanEndtime && !this.hasForCompletePlan) {
        return false
      } else {
        return true
      }
    },
    shouldOpen (item) {
      // 如果最后一条已完成方案的时间等于之前完成方案的起始时间或者截止时间说明他们是一个阶段的任务
      return this.lastCompletePlanTime === item.taskPlanEndtime || this.lastCompletePlanTime === item.taskPlanStarttime
    },
    // 延长任务
    extendTask () {
      if (this.isApproving(this.taskData)) return
      this.$axios({
        url: baseUrl + '/tasks/opertate/extendTasks?id=' + this.tid,
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            this.app.reload()
          }
        })
    },
    // 暂缓任务
    deferTask () {
      this.$Modal.confirm({
        title: '暂缓任务',
        content: '确定暂缓该任务吗？',
        onOk: () => {
          this.$axios({
            url: baseUrl + '/tasks/opertate/deferTasks?id=' + this.tid,
            method: 'get'
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.$Message.success(res.data.content)
                this.app.reload()
              }
            })
            .catch(err => {
              console.log(err)
            })
        },
        onCancel: () => {
          // todo
        }
      })
    },
    // 关闭任务
    closeTask () {
      this.$Modal.confirm({
        title: '关闭任务',
        content: '确定关闭该任务吗？',
        onOk: () => {
          this.$axios({
            url: baseUrl + '/tasks/opertate/closeTasks?id=' + this.tid,
            method: 'get'
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.$Message.success(res.data.content)
                this.app.reload()
              }
            })
            .catch(err => {
              console.log(err)
            })
        },
        onCancel: () => {

        }
      })
      // this.$axios({
      //   url: baseUrl + '/tasks/opertate/closeTasks?id=' + this.tid,
      //   method: 'get'
      // })
      //   .then(res => {
      //     if (res.data.code === 10000) {
      //       this.$Message.success(res.data.content)
      //       this.app.reload()
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })
    },
    // 执行人点击任务完成
    executorFinishTaskPlan (row) {
      if (this.isApproving(this.taskData)) return
      this.loadingStatus = true
      // 判断是否在开始时间之前点击完成
      let temp = moment().isBefore(row.taskPlanStarttime)
      if (temp) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>是否提前完成该任务方案？</p>',
          onOk: () => {
            this.$axios({
              url: baseUrl + '/taskplan/operate/finish?taskPlanId=' + row.taskPlanId,
              method: 'get'
            })
              .then(res => {
                if (res.data.code === 10000) {
                  this.$Message.success(res.data.msg)
                  this.getTaskData()
                  this.loadingStatus = false
                }
              })
              .catch(e => {
                console.log(e)
                this.loadingStatus = false
              })
          }
        })
      } else {
        this.$axios({
          url: baseUrl + '/taskplan/operate/finish?taskPlanId=' + row.taskPlanId,
          method: 'get'
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.getTaskData()
              this.loadingStatus = false
            }
          })
          .catch(e => {
            console.log(e)
            this.loadingStatus = false
          })
      }
    },
    // 发起人确认全部任务方案
    senderConfirmTaskPlans () {
      if (this.isApproving(this.taskData)) return
      this.loadingStatus = true
      this.$axios({
        url: baseUrl + '/tasks/opertate/confirmTasks?id=' + this.tid,
        method: 'get'
      })
        .then(res => {
          let msg = res.data.msg
          if (res.data.code === 10000) {
            this.$Message.success(msg)
            this.app.reload()
            // item.button.confirmButtonEmerge = false
          } else {
            this.$Message.error(msg)
          }
          this.loadingStatus = false
        })
        .catch(err => {
          console.log(err)
          this.loadingStatus = false
        })
    },
    // 发起人确认任务完成
    senderConfirmTaskFinish () {
      if (this.isApproving(this.taskData)) return
      this.loadingStatus = true
      this.$axios({
        url: baseUrl + '/tasks/opertate/finishTasks?id=' + this.tid,
        // params: $qs.stringify({taskPlanId: item.taskPlanId}),
        method: 'get'
      })
        .then(res => {
          let msg = res.data.msg
          if (res.data.code === 10000) {
            this.$Message.success(msg)
            // this.app.reload()
            this.getTaskData()
          } else {
            this.$Message.error(msg)
          }
          this.loadingStatus = false
        })
        .catch(err => {
          console.log(err)
          this.loadingStatus = false
        })
    },
    // 发起人阶段性确认
    stageConfirm (row) {
      if (this.isApproving(this.taskData)) return
      this.loadingStatus = true
      this.$axios({
        url: baseUrl + '/tasks/opertate/stageConfirmTasks?id=' + this.tid,
        method: 'get'
      })
        .then(res => {
          let msg = res.data.msg
          if (res.data.code === 10000) {
            this.$Message.success(msg)
            // this.app.reload()
            this.getTaskData()
          } else {
            this.$Message.error(msg)
          }
          this.loadingStatus = false
        })
        .catch(err => {
          console.log(err)
          this.loadingStatus = false
        })
    },
    // 判断能否发表评论
    canComment (row) {
      if (!row.executors) return
      let executors = row.executors
      let isExecutor = executors.some(executor => {
        if (executor.id === this.uid) {
          return true
        }
        return false
      })
      let sendUid = this.taskData.sendUid
      let acceptUid = this.taskData.acceptUid
      // return (this.isSender || this.isReceiver || isExecutor)
      return ((sendUid === this.uid) || (acceptUid === this.uid) || isExecutor)
    },
    hideModal () {
      // add
      this.showModal = false
    },
    // 等级调整
    adjustTaskLevel () {
      this.showModal = true
    },
    // 复制执行人
    copyExecutors (e, item) {
      const { executors } = item
      this.copyExecutorsIds = executors
    },
    // 粘贴执行人
    pasteExecutors (e, item) {
      if (this.copyExecutorsIds.length >= 0) {
        item.executors = this.copyExecutorsIds
      }
    }
  },
  computed: {
    level () {
      return this.taskData.taskLevel
    },
    name () {
      return this.taskData.taskName
    },
    id () {
      return this.tid
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
  margin-top: 1px;
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
  @media screen and (max-width: 980px) {
    .btnFixed {
      bottom: 10%;
    }
  }
  .detail-page {
    height: 100%;
    overflow-y: scroll;
    position: relative;
    .page-middle-wrapper {
      position: absolute;
      top: 205px;
      bottom: 0;
      left: 30px;
      right: 30px;
      box-sizing: border-box;
      // background: #fff;
      .page-middle {
        background: #fff;
        padding: 0px 30px;
        border-radius: 10px;
        margin-bottom: 100px;
        box-shadow: 0px 0px 10px 6px rgba(0, 0, 0, 0.09);
        &.margin-bottom-30 {
          margin-bottom: 30px;
        }
        .section {
          .title {
            display: flex;
            align-items: center;
            border-bottom: 1px solid #ddd;
            height: 50px;
            line-height: 50px;
            &.border-none{
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
            padding: 50px 20px 0 20px;
            &.enclosure {
              padding-top: 0;
            }
            &:last-child {
              padding-top: 0;
            }
            .task-row {
              display: flex;
              margin-bottom: 35px;
              &.task-row-20 {
                margin-bottom: 20px;
              }
              .row-item {
                display: flex;
                align-items: center;
                width: 25%;
                // border: 1px solid green;
                &.row-item-100 {
                  width: 100%;
                }
                &.row-item-50 {
                  width: 50%;
                  padding: 0;
                  margin: 0;
                  min-height: 21px;
                }
                .row-item-title {
                  min-width: 80px;
                  text-align: right;
                  font-size: 14px;
                  font-weight: 700;
                  // border: 1px solid green;
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
                  // border: 1px solid green;
                  width: 95%;
                  word-break: break-all;
                }
              }
            }
            // .row-content {
            //   padding: 15px;
            //   .content-title {
            //     text-align: right;
            //     .task-desc {
            //       margin-left: 7px;
            //     }
            //   }
            // }
          }
          .table-content {
            margin-top: 3px;
            @media screen and (max-width: 980px) {
              .task-table {
                overflow-x: scroll;
              }
              table {
                width: 150%;
              }
            }
            .task-table {
              width: 100%;
              overflow-x: scroll;
              padding-top: 120px;
              margin-top: -120px;
              font-size: 14px;
              table {
                width: 100%;
                border-collapse: collapse;
                border: none;
                tr {
                  height: 35px;
                  &.head-row {
                    background: #f8f8f9;
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
                    &.fade-enter, &.fade-leave-to {
                      opacity: 0;
                    }
                    &.fade-enter-active, &.fade-leave-active {
                      transition: all 0.5s
                    }
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
                .row {
                  &.slide-enter, &.slide-leave-to {
                    height: 0;
                  }
                  &.slide-enter-active, &.slide-leave-active {
                    transition: all 0.2s ease;
                  }
                }
              }
              .toggle {
                font-size: 14px;
                cursor: pointer;
              }
            }
          }
          .attachment-item {
            // padding: 5px 10px;
            position: relative;
            display: block;
            margin:5px 10px;
            border-radius: 3px;
            &:hover {
              background: #f3f3f3;
            }
            a {
              display: block;
              padding: 0px 20px 0 10px;
            }
            .close-icon {
              position: absolute;
              right: 0;
              font-size: 16px;
              cursor: pointer;
            }
          }
          .attachment-display {
            position: relative;
            display: inline-block;
            margin-right: 10px;
            border-radius: 3px;
          }
          .btn {
            margin: 0 15px;
          }
        }
      }
    }
  }
  .rowContent {
    padding:5px 15px !important;
    &:first-child {
      padding-top: 20px !important;
    }
  }
}
</style>
