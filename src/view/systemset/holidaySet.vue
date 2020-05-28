<template>
  <div class="viewWrapper">
    <Card style="margin: 20px 0">
      <div id="holidayWrap">
        <table id="holiday">
          <caption>
            <div class="calendarTitle">
              <Icon class="pointer" size="24" @click.native="changeMonth('pre')"  type="ios-arrow-back" />

              <span class="calendarTitleTxt">{{thisMonth|MonthFormat}}</span>
              <Icon class="pointer" size="24" @click="changeMonth('next')" type="ios-arrow-forward" />

            </div>
          </caption>
          <thead>
            <tr>
              <th>星期一</th>
              <th>星期二</th>
              <th>星期三</th>
              <th>星期四</th>
              <th>星期五</th>
              <th>星期六</th>
              <th>星期日</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(week, weekIndex) in dateList" :key="weekIndex">
              <td
                class="dayBox"
                :class="setClass(day)"
                v-for="(day, dayIndex) in week"
                :key="dayIndex"
              >
                <div v-if="day">
                  <div class="tip" v-if="day.holidayStatus==='0'">法</div>
                  <div class="tip" v-else-if="day.holidayStatus==='3'">休</div>
                  <div class="tip" v-else-if="day.holidayStatus==='4'">班</div>
                  <div class="day">
                    <span :class="day.date===today?'today':''">{{day.day}}</span>
                  </div>
                  <p>{{day.holidayName}}</p>
                  <p>{{isWork(day&&day.holidayStatus)?'班':'休'}}</p>
                  <div
                    v-if="permission.update"
                    @click="setWorkOrRest(day)"
                    class="change"
                    :class="isWork(day&&day.holidayStatus)?'toRest':'toWork'"
                  >{{isWork(day&&day.holidayStatus)?'设置为休息':'设置为上班'}}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
import moment from 'moment'
import { Track } from '@/libs/track'
const track = new Track('系统设置/节假日设置/节假日设置')
export default {
  name: 'holidaySet',
  data () {
    return {
      dateList: [],
      today: '',
      thisMonth: '',
      moment: moment
    }
  },
  beforeCreate () {
    track.start()
  },
  filters: {
    MonthFormat (val) {
      return moment(val).format('YYYY年MM月')
    }
  },
  // 页面渲染时调用数据
  mounted () {
    this.today = moment().format('YYYY-MM-DD') // 获取今天日期
    this.thisMonth = moment().format('YYYY-MM') // 默认获取本月月份
    this.getData()
  },
  methods: {
    // 根据类型设置类
    setClass (day) {
      let holidayStatus = day ? day.holidayStatus : null
      switch (holidayStatus) {
        case '0': {
          // 法定节假日
          return 'law'
        }
        case '1': {
          return 'rest'
        }
        case '2': {
          return 'work'
        }
        case '3': {
          return 'toRest'
        }
        case '4': {
          return 'toWork'
        }
        case null: {
          return 'notMonth'
        }
      }
    },
    // 根据类型判断是否工作日
    isWork (holidayStatus) {
      switch (holidayStatus) {
        case '0': {
          return false
        }
        case '1': {
          return false
        }
        case '2': {
          return true
        }
        case '3': {
          return false
        }
        case '4': {
          return true
        }
      }
    },
    // 调整节假日
    setWorkOrRest (oneDay) {
      let { day, holidayStatus, id } = oneDay
      let data = { day, holidayStatus, id }
      let weekIndex = moment(oneDay.date).day()
      let weekToChinese = ['日', '一', '二', '三', '四', '五', '六']
      // let tips = moment(day.date).format('YYYY年MM月DD日星期') + weekToChinese[weekIndex]
      let tips = moment(oneDay.date).format('YYYY年MM月DD日星期') + weekToChinese[weekIndex]
      let setType = this.isWork(holidayStatus) ? '设为休息日' : '设为上班'
      let string = `确定将“<span style="color:#FAAD14">${tips}</span>”${setType}吗？`
      this.$Modal.confirm({
        title: '温馨提示',
        content: string,
        onOk: () => {
          this.$axios({
            url: baseUrl + '/holiday/update',
            data: data,
            method: 'post'
          })
            .then(res => {
              if (res.data.code === 10040) {
                this.$Message.success(res.data.msg)
                this.getData()
              } else {
                this.$Message.error(res.data.msg)
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    // 初始化数据
    getData () {
      let data = { monthOfYear: this.thisMonth }
      this.$axios({
        url: baseUrl + '/holiday/list',
        method: 'get',
        params: data
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.dateList = resp.data.content.days
            this.$nextTick(() => {
              track.end()
            })
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    changeMonth (type) {
      if (type === 'next') {
        let thisMonth = moment(this.thisMonth)
          .add(1, 'M')
          .format('YYYY-MM')
        this.thisMonth = thisMonth
      } else {
        let thisMonth = moment(this.thisMonth)
          .subtract(1, 'M')
          .format('YYYY-MM')
        this.thisMonth = thisMonth
      }
    }
  },
  computed: {
    permission () {
      return this.$store.state.user.userpermission.holiday
    }
  },
  watch: {
    thisMonth (newVal, oldVal) {
      this.getData()
    }
  }
}
</script>
<style lang="less">
@lawColor: rgba(237, 85, 101, 1);
@restColor: rgba(25, 170, 141, 1);
@notMonth: rgba(242, 242, 242, 1);
@borderColor: #d7d7d7;
@primaryColor: #19aa8d;
#holiday {
  margin: 0 auto;
  border: 1px solid #eeeeee;
  border-spacing: 0px;
  caption {
    margin-bottom: 20px;
  }
}
.dayBox {
  width: 140px;
  height: 120px;
  border: 1px solid @borderColor;
  overflow: hidden;
  position: relative;
  text-align: center;
  &:hover:not(.notMonth) {
    border: 1px solid red;
    cursor: pointer;
  }
  &:hover .change {
    bottom: 0;
    display: block;
  }
  &.notMonth {
    background-color: #f2f2f2;
  }
  &.law {
    color: red;
  }
  &.rest {
    color: red;
  }
  &.toRest {
    background-color: #fbdde0;
  }
  &.toWork {
    background-color: #e8f7f4;
    .tip {
      background-color: @primaryColor;
    }
  }
  .tip {
    position: absolute;
    left: 0;
    top: 0;
    width: 25px;
    height: 25px;
    background-color: @lawColor;
    color: #fff;
    line-height: 25px;
  }
  .today {
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    color: #fff;
    background-color: #19aa8d;
    border-radius: 50%;
  }
  .change {
    position: absolute;
    width: 100%;
    height: 20px;
    bottom: -20px;
    display: none;
    &.toWork {
      background-color: @notMonth;
      color: @primaryColor;
    }
    &.toRest {
      background-color: #fbdde0;
      color: #ee5d6c;
    }
  }
}
</style>
