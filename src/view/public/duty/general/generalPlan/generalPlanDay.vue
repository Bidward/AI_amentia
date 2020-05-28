<template>
  <div class="generalPlan">
    <!-- <div class="datePicker ant-private" id="datePickerDay"> -->
    <div class="datePicker">
      <!-- <ADatePicker :getCalendarContainer="datePickerDay" @change="onChange" :allowClear="false" :placeholder="myDate"/> -->
      <DatePicker type="date" :placeholder="myDate" @on-change="onChange"></DatePicker>
    </div>
    <Table :loading="loading" border :columns="columns" :data="planData">
      <template slot-scope="{ row, index }" slot="edit">
        <Button v-if="row.backlogType===2 && myself===userIdProps" type="primary" @click="complete(row.tasksPlanId)">完成</Button>
        <Button v-if="row.backlogType===2" @click="toTask(row.taskId)">详情</Button>
        <Button
            v-if="row.backlogType===1 && row.objectId!==0  && myself===userIdProps && row.itemSchedule!==100 && row.backlogEditStatus === 0"
            type="primary"
            @click="feedBack(row.objectId)">结果反馈
        </Button>
        <Button v-if="row.backlogType===1 && row.objectId!==0" @click="toDetail(row.objectId, userIdProps)">详情</Button>
      </template>
    </Table>
    <div v-if="planData.length!==0" class="level-three"></div>
    <div v-else style="padding-bottom:150px"></div>
    <Modal title="结果反馈"
        v-model="showModal"
      >
      <generalPlanDayModal @refresh="refresh" v-if="showModal" :feedBackId="feedBackId"/>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
// import DatePicker from 'ant-design-vue/lib/date-picker'
// import { DatePicker } from 'ant-design-vue'
import { baseUrl } from '@/api/base.js'
import generalPlanDayModal from './generalPlanDayModal'
import { Track } from '@/libs/track.js'
const track = new Track('人力运营中心/定岗定编/定岗定编总览')
export default {
  name: 'generalPlanDay',
  //   components: { ADatePicker: DatePicker, generalPlanDayModal },
  components: { generalPlanDayModal },
  props: {
    myDateProps: {
      type: String
    },
    userIdProps: {
      type: Number,
      default: 1
    }
  },
  beforeCreate () {
    track.start()
  },
  data () {
    return {
      myself: this.$store.state.user.userId,
      myDate: this.myDateProps,
      loading: true,
      columns: [
        {
          title: '时间',
          key: 'workTime',
          align: 'center'
        },
        {
          title: '工作事项',
          key: 'workMatter',
          align: 'center'
        },
        {
          title: '工作要求',
          key: 'workRequirement',
          align: 'center'
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          render: (h, params) => {
            const status = params.row.status
            switch (status) {
              case 0:
                return h(
                  'div',
                  '未完成'
                )
              case 1:
                return h(
                  'div',
                  '已完成'
                )
            }
          }
        },
        {
          title: '操作',
          align: 'center',
          slot: 'edit'
        }
      ],
      planData: [],
      showModal: false,
      feedBackId: ''
    //   datePickerDay () {
    //     return $('#datePickerDay')[0]
    //   }
    }
  },
  watch: {
    userIdProps (newV) {
      this.getPlan(sessionStorage.changeTime)
    }
  },
  mounted () {
    this.getPlan(this.myDate)
    sessionStorage.setItem('changeTime', this.myDate)
  },
  methods: {
    complete (id) {
      this.$axios({
        url: baseUrl + `/taskplan/operate/finish?taskPlanId=${id}`,
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.getPlan(this.myDate)
            this.$Message.success(res.data.msg)
          } else {
            this.$Message.error(res.data.msg)
          }
          this.loading = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    refresh () {
      this.getPlan(this.myDate)
      this.showModal = false
    },
    onChange (date) {
      this.getPlan(date)
      sessionStorage.setItem('changeTime', date)
    },
    getPlan (date) {
      let sendData = {
        userid: this.userIdProps,
        time: date,
        searchType: 1
      }

      this.$axios({
        url: baseUrl + '/station/getShowJob',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.planData = res.data.content.pageContent
          } else if (res.data.code === 10001) {
            this.planData = []
            this.$Message.success(res.data.msg)
          } else {
            this.planData = []
            this.$Message.error(res.data.msg)
          }
          this.loading = false
          this.$nextTick(() => {
            track.end()
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    feedBack (objectId) {
      this.showModal = true
      this.feedBackId = objectId
    },
    close () {
      this.showDetail = false
    },
    toDetail (id, userIdProps) {
      this.$router.push({
        name: 'planDayDetail',
        query: { id: id, userIdProps: userIdProps }
      })
    },
    toTask (id) {
      this.$router.push({
        name: 'taskDetail',
        params: { id: id }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.generalPlan {
  // @import '~ant-design-vue/dist/antd.min.css';
  position: relative;
  text-align: center;
  .datePicker {
    position: absolute;
    top: -55px;
    right: 176px;
  }
}
</style>
<style lang="less">
// @import 'ant-private.less';
</style>
