<template>
  <div class="generalPlan">
    <div class="datePicker">
    <!-- <div class="datePicker ant-private" id="datePickerDay"> -->
      <!-- <AMonthPicker :getCalendarContainer="datePickerDay" @change="onChange" :allowClear="false" :placeholder="myDate"/> -->
      <DatePicker type="month" :placeholder="myDate" :clearable="false" @on-change="onChange"></DatePicker>
    </div>
    <Spin fix v-if="loading" size="large"></Spin>
    <div v-if="planData.length!==0">
      <div class="monthHead" v-for="head in columns" :key="head.id">{{head.title}}</div>
      <Card class="monthCard" dis-hover v-for="(dayPlan, index) in planData" :key="index" @click.native="jumpToDay(dayPlan)">
        <p class="cardTitle">
          {{dayPlan.dayTime}}
          <Icon v-if="dayPlan.doneStatus===1" color="green" size="20" type="ios-checkmark-circle-outline" />
          <Icon v-else-if="dayPlan.doneStatus===0" color="red" size="20" type="ios-close-circle-outline" />
        </p>
        <div class="cardContent" v-for="(plan, index1) in dayPlan.contentList" :key="index1" >
          <p>{{plan.workMatter}}</p>
        </div>
      </Card>
    </div>
    <div v-else>
      <p style="font-weight: bold">暂无数据</p>
    </div>
    <div style="float: left; width: 100%; height: 50px;"></div>

    <div v-if="planData.length!==0" style="float: left; width: 100%; height: 50px;"></div>
    <div v-else style="padding-bottom:150px"></div>
  </div>
</template>

<script>
// import DatePicker from 'ant-design-vue/lib/date-picker'
import { baseUrl } from '@/api/base.js'
import moment from 'moment'
export default {
  name: 'generalPlanMonth',
  //   components: { AMonthPicker: DatePicker.MonthPicker },
  props: {
    userIdProps: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      myDate: moment().format('YYYY-MM'),
      columns: [
        {
          id: -1,
          title: '周日'
        },
        {
          id: -2,
          title: '周一'
        },
        {
          id: -3,
          title: '周二'
        },
        {
          id: -4,
          title: '周三'
        },
        {
          id: -5,
          title: '周四'
        },
        {
          id: -6,
          title: '周五'
        },
        {
          id: -7,
          title: '周六'
        }
      ],
      planData: [],
      loading: false
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
    let changeTime = this.myDate + '-01'
    this.getPlan(changeTime)
    sessionStorage.setItem('changeTime', changeTime)
  },
  methods: {
    onChange (date) {
      let changeTime = date + '-01'
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
        searchType: 3
      }

      this.loading = true
      this.$axios({
        url: baseUrl + '/station/getShowJob',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            let data = res.data.content.pageContent
            for (let i = 0, l = data[0].tagDayToWeekDay; i < l; i++) {
              data.unshift({ dayTime: '', contentList: [] })
            }
            this.planData = data
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
  width: 100%;
  position: relative;
  text-align: center;
  .datePicker {
    position: absolute;
    top: -55px;
    right: 176px;
  }
  .monthHead {
    float: left;
    width: 14%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-weight: bold;
    border: 1px solid #dcdee2;
  }
  .monthCard {
    float: left;
    width: 14%;
    height: 190px;
    border-radius: 0;
    border: none;
    border: 1px solid #dcdee2;
    // overflow: hidden;
    overflow-y: scroll;
    &:hover{
      background-color: #EAF8F5;
    }
    &::-webkit-scrollbar {/*滚动条整体样式*/
      width: 2px;     /*高宽分别对应横竖滚动条的尺寸*/
    }
    &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      background: #dcdee2;
    }
    .cardTitle {
      font-weight: bold
    }
    .cardContent {
      text-align: left;
    }
  }
}
</style>
<style lang="less">
// @import 'ant-private.less';
</style>
