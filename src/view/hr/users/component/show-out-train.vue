<template>
<div>
    <div class="section">
        <div class="title">
            <Icon type="md-school" style="color: #19aa8d;margin-right: 10px;" size="20" />
            <span class="title-name">外出培训</span>
            <div class="wrapper" v-if="isEdit">
                <Button class="btn" @click="handleCancle()">取消</Button>
                <Button type="primary" @click="saveInfo()">保存</Button>
            </div>
            <div class="wrapper" v-else>
                <Button v-if="!this.$route.query.type && permiss.update" type="primary" @click="()=>isEdit = true">编辑</Button>
            </div>
        </div>
        <div class="content">
            <!-- <Row>
                <Col span="3" offset="2">
                    <div class="main-title">外出培训记录</div>
                </Col>
            </Row> -->
            <Row>
                <Col span="22" class="tableBox">
                    <table style="word-break: break-all;">
                        <thead>
                            <tr>
                                <th v-for="title in editHeader" :key="title.key">{{title.title}}</th>
                            </tr>
                        </thead>
                        <tbody v-if="trains.length===0 && !isEdit">
                            <tr>
                                <td colspan="5">暂无数据</td>
                            </tr>
                        </tbody>
                        <tbody v-if="trains.length===0 && isEdit">
                            <tr>
                                <td colspan="5">
                                    <span @click="addRow" style="cursor: pointer">
                                        <Icon type="md-add-circle" style="color: #19aa8d; margin-bottom: 3px; font-size: 18px;"/>
                                        添加外出信息
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr v-for="(item, index) in trains" :key="item.id">
                                <td style="width: 80px">{{index + 1}}</td>
                                <td style="width: 270px;">
                                    <div v-if="isEdit" style="position: relative;">
                                        <!-- <div v-if="item.errMsg && item.errMsg.dateErrMsg !== ''" class="popover" style="top: -45px;">
                                            {{item.errMsg && item.errMsg.dateErrMsg}}
                                        </div> -->
                                        <DatePicker
                                            type="daterange"
                                            placeholder="培训起止时间"
                                            :transfer="true"
                                            :value="[item.startTime, item.endTime]"
                                            :options="planStartOptions"
                                            @on-change="(value) => handleData(value, item, index)">
                                        </DatePicker>
                                    </div>
                                    <span v-else>{{item.startTime}}~{{item.endTime}}</span>
                                </td>
                                <td style="width: 200px">
                                    <div v-if="isEdit" style="position: relative;">
                                        <!-- <div v-if="item.errMsg && item.errMsg.placeErrMsg !== ''" class="popover" style="top: -45px;">
                                            {{item.errMsg && item.errMsg.placeErrMsg}}
                                        </div> -->
                                        <Input
                                            v-model="item.trainPlace"
                                            placeholder="请输入培训地点"
                                            @on-change="(e) => handleTrainPlace(e, item)"
                                        />
                                    </div>
                                    <span v-else>{{item.trainPlace}}</span>
                                </td>
                                <td style="width: 270px">
                                    <div v-if="isEdit" style="position: relative;">
                                        <!-- <div v-if="item.errMsg && item.errMsg.contentErrMsg !== ''" class="popover" style="top: -45px;">
                                            {{item.errMsg && item.errMsg.contentErrMsg}}
                                        </div> -->
                                        <Input
                                            v-model="item.trainContent"
                                            placeholder="请输入培训内容"
                                            @on-change="(e) => handleTrainContent(e, item)"
                                        />
                                    </div>
                                    <span v-else>{{item.trainContent}}</span>
                                </td>
                                <td style="width: 180px">
                                    <Button v-if="isEdit" type="primary" @click="addRow(index)">增加</Button>
                                    <Button v-if="isEdit" type="error" @click="deleteRow(index)">删除</Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Col>
            </Row>
        </div>
    </div>
</div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
// import moment from 'moment'
import mixins from '../mixins'
export default {
  name: 'showAccountInfo',
  mixins: [mixins],
  data () {
    return {
      isEdit: false,
      planStartOptions: {},
      editHeader: [
        {
          title: '序号',
          key: 'index'
        },
        {
          title: '外出培训时间',
          key: 'trainDate'
        },
        {
          title: '外出培训地点',
          key: 'trainPlace'
        },
        {
          title: '培训内容',
          key: 'trainContent'
        },
        {
          title: '操作',
          key: ''
        }
      ],
      trains: []
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.$axios({
        url: baseUrl + '/user/trainDetail',
        data: $qs.stringify({
          id: this.$route.query.id
        }),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.trains = resp.data.content
            this.trains.forEach(plan => {
              this.$set(plan, 'errMsg', {
                dateErrMsg: '',
                executorErrMsg: '',
                planErrMsg: ''
              })
            })
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    handleCancle () {
      this.$Modal.confirm({
        title: '取消编辑',
        content: '<p>正在编辑，确认要取消吗？</p>',
        onOk: () => {
          this.isEdit = false
          this.getData()
        }
      })
    },
    addRow (index = 0) {
      this.trains.splice(index + 1, 0, {
        startTime: '',
        endTime: '',
        trainPlace: '',
        trainContent: '',
        errMsg: {
          dateErrMsg: '',
          contentErrMsg: '',
          placeErrMsg: ''
        }
      })
    },
    deleteRow (index) {
      this.trains.splice(index, 1)
    },
    // handleOpenData (flag, item) {
    //   @on-open-change="(flag) => handleOpenData(flag, item)"
    //   if (flag) {
    //     this.planStartOptions = {
    //       disabledDate: (date) => {
    //         return date && date.valueOf() < moment().valueOf() - 86400000
    //       }
    //     }
    //   }
    // },
    handleData (value, item, index) {
      item.startTime = value[0]
      item.endTime = value[1]
      if (value[0]) {
        item.errMsg.dateErrMsg = ''
      } else {
        item.errMsg.dateErrMsg = '日期不能为空'
      }
    },
    handleTrainContent (e, item) {
      item.trainContent = item.trainContent.trim()
      if (e.target.value) {
        item.errMsg.contentErrMsg = ''
      } else {
        item.errMsg.contentErrMsg = '内容不能为空'
      }
    },
    handleTrainPlace (e, item) {
      item.trainPlace = item.trainPlace.trim()
      if (e.target.value) {
        item.errMsg.placeErrMsg = ''
      } else {
        item.errMsg.placeErrMsg = '地点不能为空'
      }
    },
    saveInfo () {
      let sendData = {
        user: {
          id: this.$route.query.id,
          trainList: this.trains
        }
      }
      this.$axios({
        url: baseUrl + '/user/editTrainInfo',
        data: sendData,
        method: 'post'
      }).then(resp => {
        if (resp.data.code === 10000) {
          this.isEdit = false
          this.getData()
        } else {
          this.$Message.error(resp.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/style/variables.less';
.section {
    .title {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;

        .title-name {
            font-size: 18px;
        }

        .wrapper {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            margin-bottom: 3px;

            .btn {
                margin-right: 10px;
            }
        }
    }

    .content {
        padding:63px;
        .main-title {
            border-left: 2px solid #19aa8d;
            padding-left: 10px;
            font-size: 13px;
            margin: 10px 0px 30px 0px;
        }
    }
}
.tableBox {
    table {
        width: 100%;
        border-collapse: collapse;
        tr {
            height: 35px;
            th {
                color: #19AA8D;
                background-color: #f8f8f9;
                border: 1px solid #e8eaec;
            }
            td {
                text-align: center;
                padding: 10px;
                border: 1px solid #e8eaec;
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
            }
        }
    }
}
</style>
