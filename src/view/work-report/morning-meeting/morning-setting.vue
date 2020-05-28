<template>
<div class="viewWrapper">
    <div class="content">
        <Row>
            <Col span="24">
            <div class="main-top-title">
                <h3>晨会配置</h3>
            </div>
            </Col>
        </Row>

        <Row>
            <Col span="3" offset="1">
            <div class="main-title">奖惩设置</div>
            </Col>
        </Row>
        <Row>
            <Col span="3" offset="2">
            <div>时间奖惩：</div>
            </Col>
        </Row>
        <Row>
            <Col span="3" offset="2">
            <div style="color:grey;">节假日后一天</div>
            </Col>
        </Row>
        <Row>
            <Col span="2" offset="2" class="mgr5">开始时间:</Col>
            <Col span="4">
            <p v-if="!isEdit">{{rewardInfo.list[0].startTime}}</p>
            <TimePicker v-else type="time" v-model="rewardInfo.list[0].startTime"  placeholder="Select time" style="width: 100%"></TimePicker>
            </Col>
            <Col span="2" class="mgr5">结束时间:</Col>
            <Col span="4">
            <p v-if="!isEdit">{{rewardInfo.list[0].endTime}}</p>
            <TimePicker v-else type="time" v-model="rewardInfo.list[0].endTime"  placeholder="Select time" style="width: 100%"></TimePicker>
            </Col>
            <Col span="2" class="mgr5">奖惩:</Col>
            <Col span="4">
            <p v-if="!isEdit">{{rewardInfo.list[0].score}}分</p>
            <Select v-else v-model="rewardInfo.list[0].score"  clearable>
                <Option v-for="(item,index) in scoreList" :value="item.id" :key="index">{{item.score}}</Option>
            </Select>
            </Col>
        </Row>
        <Row>
            <Col span="3" offset="2">
            <div style="color:grey;">其他工作日</div>
            </Col>
        </Row>
        <Row>
            <Col span="2" offset="2" class="mgr5">开始时间:</Col>
            <Col span="4">
            <p v-if="!isEdit">{{rewardInfo.list[1].startTime}}</p>
            <TimePicker v-else type="time" v-model="rewardInfo.list[1].startTime"  placeholder="Select time" style="width: 100%"></TimePicker>
            </Col>
            <Col span="2" class="mgr5">结束时间:</Col>
            <Col span="4">
            <p v-if="!isEdit">{{rewardInfo.list[1].endTime}}</p>
            <TimePicker v-else type="time" v-model="rewardInfo.list[1].endTime" placeholder="Select time" style="width: 100%"></TimePicker>
            </Col>
            <Col span="2" class="mgr5">奖惩:</Col>
            <Col span="4">
            <p v-if="!isEdit">{{rewardInfo.list[1].score}}分</p>
            <Select v-else v-model="rewardInfo.list[1].score" clearable>
                 <Option v-for="(item,index) in scoreList" :value="item.id" :key="index">{{item.score}}</Option>
            </Select>
            </Col>
        </Row>
        <Row>
            <Col span="3" offset="2">
            <div>奖惩状态：</div>
            </Col>
        </Row>
        <Row>
            <Col span="2" offset="2" class="mgr5">状态:</Col>
            <Col span="4">
            <p v-if="!isEdit">未读</p>
            <Select v-else v-model="status">
                <Option value="0">未读</Option>
            </Select>
            </Col>
            <Col span="2" class="mgr5">奖惩:</Col>
            <Col span="4">
            <p v-if="!isEdit">{{rewardInfo.score}}分</p>
            <Select  v-else  v-model="rewardInfo.score" clearable>
                 <Option v-for="(item,index) in scoreList" :value="item.id" :key="index">{{item.score}}</Option>
            </Select>
            </Col>
        </Row>

        <Row>
            <Col span="3" offset="1">
            <div class="main-title">基本信息</div>
            </Col>
        </Row>
        <Row>
            <Col span="20" offset="2">
            <base-info></base-info>
            </Col>
        </Row>
        <Row>
            <Col span="20" offset="1">
            <opLogs :task-logs="logData" :getopLog="getopLog"></opLogs>
            </Col>
        </Row>
        <Row>
            <Row>
                <Col span="3" offset="10">
                <Button type="default" v-if="isEdit" @click="toEdit()" style="margin-bottom:20px">取消</Button>
                <Button type="primary" v-if="isEdit" @click="setReward()" style="margin-bottom:20px">保存</Button>
                <Button type="primary" v-else @click="toEdit()" style="margin-bottom:20px">编辑</Button>
                </Col>
            </Row>
        </Row>

    </div>
</div>
</template>

<script>
import baseInfo from './components/base-info'
import opLogs from './components/op-logs'
import {
  baseUrl
} from '@/api/base.js'
export default {
  name: 'morningSetting',
  components: {
    baseInfo,
    opLogs
  },
  data () {
    return {
      logData: [],
      isEdit: false,
      scoreList: [{
        id: -1,
        score: '-1分'
      },
      {
        id: -2,
        score: '-2分'
      },
      {
        id: -4,
        score: '-4分'
      }, {
        id: -6,
        score: '-6分'
      }, {
        id: -8,
        score: '-8分'
      }],
      rewardInfo: {
        list: [{
          dateType: 1, // 节假日后一天
          startTime: '',
          endTime: '',
          score: ''
        }, {
          dateType: 2, // 其他工作日
          startTime: '',
          endTime: '',
          score: ''
        }],
        score: ''
      },
      status: '0'

    }
  },
  mounted () {
    this.getReward()
    this.getopLog()
  },
  methods: {
    getReward () {
      this.$axios({
        url: baseUrl + '/morning/rewardDetail',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.rewardInfo = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    setReward () {
      let notEmpty = this.rewardInfo.list[0].score !== '' && this.rewardInfo.list[1].score !== '' && this.rewardInfo.list[0].startTime !== '' && this.rewardInfo.list[1].startTime !== '' && this.rewardInfo.list[0].endTime !== '' && this.rewardInfo.list[1].endTime !== '' && this.rewardInfo.score !== ''
      let notUndefined = this.rewardInfo.list[0].score !== undefined && this.rewardInfo.list[1].score !== undefined && this.rewardInfo.list[0].startTime !== undefined && this.rewardInfo.list[1].startTime !== undefined && this.rewardInfo.list[0].endTime !== undefined && this.rewardInfo.list[1].endTime !== undefined && this.rewardInfo.score !== undefined
      let nomalTime = this.rewardInfo.list[0].startTime < this.rewardInfo.list[0].endTime && this.rewardInfo.list[1].startTime < this.rewardInfo.list[1].endTime
      if (notEmpty && notUndefined) {
        if (nomalTime) {
          let sendData = {
            score: this.rewardInfo.score,
            list: [{
              dateType: 1, // 节假日后一天
              score: this.rewardInfo.list[0].score
            },
            {
              dateType: 2, // 其他工作日
              score: this.rewardInfo.list[1].score
            }
            ]
          }
          sendData.list[0].startTime = this.rewardInfo.list[0].startTime
          sendData.list[0].endTime = this.rewardInfo.list[0].endTime
          sendData.list[1].startTime = this.rewardInfo.list[1].startTime
          sendData.list[1].endTime = this.rewardInfo.list[1].endTime
          this.$axios({
            url: baseUrl + '/morning/setReward',
            method: 'post',
            data: sendData
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.info(res.data.msg)
              this.isEdit = !this.isEdit
              this.getReward()
            } else {
              this.$Message.error(res.data.msg)
            }
          }).catch(err => {
            console.log('err', err)
          })
        } else {
          this.$Message.error('结束时间不能早于开始时间')
        }
      } else {
        this.$Message.error('请设置奖惩信息')
      }
    },
    toEdit () {
      this.isEdit = !this.isEdit
    },
    getopLog () {
      this.$axios({
        url: baseUrl + '/morning/getSettingLog',
        method: 'post'
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

    .main-title {
        border-left: 2px solid #19aa8d;
        padding-left: 10px;
        font-size: 13px;
        margin: 10px 0px 20px 0px;
    }
    p{
        margin-top: 6px;
    }

    .mgtop {
        margin-top: 20px;

    }

    .mgr5 {
        text-align: right;
        margin-right: 5px;
        margin-top: 6px;
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
</style>
