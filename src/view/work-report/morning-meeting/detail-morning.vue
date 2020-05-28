<template>
<div class="viewWrapper">
    <div class="content">
        <Row>
            <Col span="24">
            <div class="main-top-title">
                <h3>晨会纪要详情</h3>
            </div>
            </Col>
        </Row>
        <Row>
            <Col span="3" offset="1">
            <div class="main-title">晨会信息</div>
            </Col>
        </Row>
        <Form ref="formValidate" :model="baseInfo" :rules="ruleValidate" :label-width="132">
            <Row>
                <Col span="7" offset="1">
                <FormItem label="起始时间：" prop="startTime">
                    <p>{{baseInfo.startTime +' - '+ baseInfo.endTime||'暂无'}}</p>
                </FormItem>
                </Col>
                <Col span="7">
                <FormItem label="主题：" prop="object">
                    <p>{{baseInfo.Subject || '暂无'}}</p>
                </FormItem>
                </Col>
                <Col span="7">
                <FormItem label="参会人：" prop="inpepleid">
                    <p>{{baseInfo.attendees || '暂无'}}</p>
                </FormItem>
                </Col>
                <Col span="7" offset="1">
                <FormItem label="未到人：" prop="outpepleid">
                    <p>{{baseInfo.unAttendees || '暂无'}}</p>
                </FormItem>
                </Col>
                <Col span="7">
                <FormItem label="接收人：" prop="acceptpepleid">
                    <p>{{baseInfo.receivers || '暂无'}}</p>
                </FormItem>
                </Col>

                <Col span="7">
                <FormItem label="附件：" prop="enclosure">
                    <ul>
                      <li
                        v-for="(item,index) in baseInfo.enclosureList"
                        :key="index"
                        class="attachment-item"
                        @mouseenter="showCancel(index)"
                        @mouseleave="hideCancel"
                      >
                        <a :href="staticUrl + item.enclosureUrl" :download="item.enclosureName">{{item.enclosureName}}</a>
                        <!-- <a href="http://origin.static.nnnnzs.cn/upload/bing/20190816.png" download="kkk">{{item.enclosureName}}</a> -->
                        <!-- <a @click="createALink(item)">{{item.enclosureName}}</a> -->
                      </li>
                    </ul>

                </FormItem>
                </Col>
            </Row>
        </Form>
    </div>
    <div class="content">
        <Row style="display:none;">
            <Col span="3" offset="1">
            <div class="main-title">数据展示</div>
            </Col>

        </Row>
        <Row style="display:none;">
            <Col span="7" offset="2">
            <Button type="primary">绩效分析</Button>
            <Button type="primary">诊断分析</Button>
            </Col>
        </Row>
        <Row class="mgtop">
            <Col span="7" offset="1">
            <div class="main-title">专项工作</div>
            </Col>
        </Row>
        <Row>
            <Col span="20" offset="2">
            <div class="meetingFocus" v-for="(item,index) in baseInfo.emphasisList" :key="index">
                    <div style="float:left;width:50px;">{{index+1}}、</div>
                    <div style="float:left;">
                        <Tooltip max-width="400"  :content="item.emphasis" placement="top-start">
                            <div style="float:left;width:400px;margin-right: 10px;">{{item.emphasis}}</div>
                        </Tooltip>
                    </div>
                    <div style="min-width:200px;">{{item.responsible}}</div>
                </div>
            </Col>
        </Row>
        <Row class="mgtop">
            <Col span="7" offset="1">
            <div class="main-title">工作安排</div>
            </Col>
        </Row>
        <Row>
            <Col span="20" offset="2">
            <job-arrange @getJobTableData="getJobTableData"></job-arrange>
            </Col>
        </Row>
        <Row>
            <Col span="20" offset="2" style="margin-left: 6%;">
                <reback></reback>
            </Col>
        </Row>
        <Row>
            <Col span="20" offset="2">
                <op-logs :task-logs="logData"></op-logs>
            </Col>
        </Row>
    </div>
    <Row>
        <Col span="3" offset="11">
        <Button type="warning" @click="goBack()" style="margin-bottom:20px">返回</Button>
        </Col>
    </Row>
</div>
</template>

<script>
import morningMixins from './morning-mixins'
import meetingFocus from './components/meeting-focus'
import jobArrange from './components/job-arrange'
import opLogs from './components/op-logs'
import reback from './components/reback'
import {
  staticUrl,
  baseUrl
} from '@/api/base.js'
export default {
  name: 'detailMorning',
  mixins: [morningMixins],
  components: {
    meetingFocus,
    jobArrange,
    opLogs,
    reback
  },
  data () {
    return {
      jobTableData: [],
      activeAttachmentIndex: -1,
      logData: [],
      staticUrl,
      baseInfo: {
        Subject: '',
        startTime: '',
        endTime: '',
        time: '',
        attendees: '',
        unAttendees: '',
        receivers: '',
        enclosureList: [],
        emphasisList: []
      },
      meettingFocusHeader: [{
        title: '序号',
        type: 'index',
        align: 'center'
      },
      {
        title: '会议重点',
        key: 'emphasis'
      },
      {
        title: '负责人',
        key: 'responsible'
      }
      ],
      ruleValidate: {}
    }
  },
  mounted () {
    this.getJobTableData()
    this.getDetailData()
    this.getopLog()
  },
  methods: {
    getDetailData () {
      this.$axios({
        url: baseUrl + '/morning/getMorningMeetingDetail',
        method: 'post',
        data: $qs.stringify({
          id: this.$route.query.id
        })
      }).then(res => {
        if (res.data.code === 10000) {
          this.baseInfo = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    getJobTableData (data) {
      this.jobTableData = data
    },
    // 显示附件删除按钮
    showCancel (index) {
      this.activeAttachmentIndex = index
    },
    // 隐藏附件删除按钮
    hideCancel () {
      this.activeAttachmentIndex = -1
    },
    // 日志
    getopLog () {
      this.$axios({
        url: baseUrl + '/morning/getMeetingLog',
        method: 'post',
        data: $qs.stringify({ id: this.$route.query.id })
      }).then(res => {
        if (res.data.code === 10000) {
          this.logData = res.data.content
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
    padding-top: 20px;

    .main-top-title {
        color: #19aa8d;
        border-bottom: 1px solid #ccc;
        margin-bottom: 10px;
    }

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
