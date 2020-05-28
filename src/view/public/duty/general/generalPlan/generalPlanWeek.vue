<template>
  <div class="generalPlan">
    <!-- <div class="datePicker"> -->
    <div class="datePicker ant-private" id="datePickerDay">
      <AWeekPicker :getCalendarContainer="datePickerDay" :allowClear="false" @change="onChange" :placeholder="`${myDate}周`"/>
    </div>
    <Spin fix v-if="loading" size="large"></Spin>
    <div v-if="planData.length!==0" class="week">
      <Card class="cards" v-for="(dayPlan, index) in planData" :key='index' @click.native="jumpToDay(dayPlan)">
        <div class="tital" slot="title">
          {{dayPlan.weekTime}}
          <Icon v-if="dayPlan.doneStatus===1" color="green" size="20" type="ios-checkmark-circle-outline" />
          <Icon v-else-if="dayPlan.doneStatus===0" color="red" size="20" type="ios-close-circle-outline" />
        </div>
        <div v-for="(item, index) in dayPlan.contentList" :key='index'>
          <p>{{item.workMatter}}</p>
        </div>
      </Card>
    </div>
    <div v-else>
      <p style="font-weight: bold">暂无数据</p>
    </div>
    <div v-if="planData.length!==0" class="level-three"></div>
    <div v-else style="padding-bottom:150px"></div>
  </div>
</template>

<script>
import DatePicker from 'ant-design-vue/lib/date-picker'
import { baseUrl } from '@/api/base.js'
import moment from 'moment'
export default {
  name: 'generalPlanWeek',
  components: { AWeekPicker: DatePicker.WeekPicker },
  props: {
    userIdProps: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      myDate: moment().format('YYYY-WW'),
      planData: [],
      loading: false,
      datePickerDay () {
        // return $('#datePickerDay')[0]
        return document.getElementById('datePickerDay')
      }
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
    onChange (date, dateString) {
      let changeTime = dateString.substring(0, dateString.length - 1)
      this.getPlan(changeTime)
      sessionStorage.setItem('changeTime', changeTime)
    },
    jumpToDay ({ dayTime }) {
      this.$emit('on-to-day', dayTime)
    },
    getPlan (changeTime) {
      let sendData = {
        userid: this.userIdProps,
        time: changeTime,
        searchType: 2
      }

      this.loading = true
      this.$axios({
        url: baseUrl + '/station/getWeekJobByWeekNumber',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.planData = res.data.content.pageContent
            this.$Message.success(res.data.msg)
          } else if (res.data.code === 10001) {
            this.planData = []
            this.$Message.warning(res.data.msg)
          } else {
            this.planData = []
            this.$Message.error(res.data.msg)
          }
          this.loading = false
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.generalPlan {
  position: relative;
  text-align: center;
  .datePicker {
    position: absolute;
    top: -55px;
    right: 176px;
  }
  .week {
    display: flex;
    .cards{
      flex: 1;
      border-radius: 0;
      .tital {
        text-align: center;
        font-weight: bold;
        height: 20px;
      }
      p{
        margin: 15px 0;
      }
    }
    .cards:hover {
      background-color: #EAF8F5;
      cursor: pointer;
    }
  }
}
</style>
<style lang="less">
@import 'ant-private.less';
</style>
