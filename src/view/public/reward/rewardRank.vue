<template>
<div>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Card class="totalRank">
        <p slot="title" class="title">
            <Row>
                <Col :md="2" :lg="2">
                    <Avatar size="66" :src="staticUrl + mine.picUrl" />
                </Col>
                <Col :xs="2" :sm="4" :md="6" :lg="8">
                    <span>{{mine.nickName}}</span>
                    <span style="display: block; margin-top: 12px">第{{mine.rank}}名，奖惩 {{mine.score}} 分</span>
                </Col>
                <Col span="6" style="float: right">时间：
                    <DatePicker type="daterange"
                        show-week-numbers
                        placement="bottom-end"
                        v-model="time"
                        @on-change="handleChange"
                        :clearable="false"
                        placeholder=""
                        style="width: 74%"></DatePicker>
                </Col>
            </Row>
        </p>
        <Row :gutter="20" >
            <Col span="8"
                item-layout="vertical"
                v-for="(list,index) in totalContent" :key="index"
                :style="index === totalContent.length-1 ? '' : 'border-right: 1px solid #e8eaec'">
                <List>
                    <!-- <ListItem v-for="(item,index2) in list" :key="index2" class="listItme" :style="item.front ? 'height: 136px' : ''"> -->
                    <ListItem v-for="(item,index2) in list" :key="index2" class="listItme">
                        <div v-if="item.unfold" class="unfold pointer" @click="()=>{fold = true; spinShow = true}">
                            <span>点击展开，显示全部
                                <Icon type="ios-arrow-down" />
                            </span>
                        </div>
                        <div v-else style="text-align: center; width: 100%;">
                            <div v-if="item.fold" class="unfold pointer" @click="()=>{fold = false; spinShow = true}">
                                <span>点击收起
                                    <Icon type="ios-arrow-up" />
                                </span>
                            </div>
                            <div v-else class="rowData">
                                <span class="rankText">{{item.rank}} . </span>
                                <span class="avatar">
                                    <img class="crown" v-if="item.front" :src="crown" alt="王冠">
                                    <Avatar class="rankText" v-if="item.behind" :src="sad" :size="50" />
                                    <Avatar class="rankText" v-else :src="staticUrl + item.picUrl" :size="50" />
                                    <!-- <Avatar class="rankText" v-if="item.behind" :src="sad" :size="44" />
                                    <Avatar class="rankText" v-else :src="staticUrl + item.picUrl" :size="item.front ? '66' : '44'" /> -->
                                </span>
                                <span class="rankText">{{item.nickName}}</span>
                                <span class="rankText">{{item.score}}</span>
                            </div>
                        </div>
                    </ListItem>
                </List>
            </Col>
        </Row>
    </Card>
    <div class="tableFooter"></div>
</div>
</template>

<script>
import crown from '@/assets/images/crown.png'
import sad from '@/assets/images/sad.png'
import moment from 'moment'
import { baseUrl, staticUrl } from '@/api/base.js'
export default {
  name: 'rewardRank',
  data () {
    return {
      spinShow: true,
      crown,
      sad,
      staticUrl,
      fold: false,
      time: [],
      totalContent: [],
      mine: []
    }
  },
  mounted () {
    this.setTimeRange()
    this.getStatistics()
  },
  watch: {
    fold (newV) {
      this.getStatistics()
    }
  },
  methods: {
    handleChange (e) {
      this.time = e
      this.getStatistics()
    },
    handleList (arr, proportion) {
      let num = 0
      let _data = []
      for (let i = 0; i < arr.length; i++) {
        if (i % proportion === 0 && i !== 0) {
          _data.push(arr.slice(num, i))
          num = i
        }
        if (i + 1 === arr.length) {
          _data.push(arr.slice(num, i + 1))
        }
      }
      return _data
    },
    formatTotal (a) {
      if (this.fold) {
        a.push({ fold: true })
        this.totalContent = this.handleList(a, Math.ceil(a.length / 3))
        this.spinShow = false
      } else {
        let front = [] // 前三
        let other = [] // 其他
        let otherNum // 其他人显示的数量
        let behind = [] // 后三
        let totalList = []
        a.map(item => {
          if (item.front) {
            front.push(item)
          } else if (item.behind) {
            behind.push(item)
          }
        })
        behind.unshift({ unfold: true })
        otherNum = 24 - (front.length) - behind.length
        // otherNum = 24 - (front.length) * 2 - behind.length
        other = a.slice(front.length, front.length + otherNum)
        totalList = front.concat(other, behind)
        this.totalContent = this.handleList(totalList, 8)
        // totalList.reverse()
        // this.totalContent = this.handleList(totalList, 8).reverse().map(item => {
        //   return item.reverse()
        // })
        this.spinShow = false
      }
    },
    getStatistics () {
      let sendData = {
        startTime: this.time[0],
        endTime: this.time[1]
      }
      this.$axios({
        url: baseUrl + '/reward/getStatistics',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          this.mine = res.data.content.filter(item => {
            return item.id === this.$store.state.user.userId
          })[0]
          this.formatTotal(res.data.content)
        })
        .catch(err => {
          console.log(err)
        })
    },
    setTimeRange () {
      let firstDayOfMonth = moment().format('YYYY-MM') + '-01'
      let lastDayOfMonth = moment(firstDayOfMonth).add(1, 'month').add(-1, 'days').format('YYYY-MM-DD')
      this.time = [ firstDayOfMonth, lastDayOfMonth ]
    }
  }
}
</script>

<style lang="less" scoped>
.totalRank{
    padding: 20px;
    .title {
        height: 65px;
    }
    .listItme {
        border: none;
        text-align: center;
        height: 84px; // 每一条高度
        .unfold {
            margin: auto;
            font-weight: bold;
            font-size: 14px;
            height: 44px;
            line-height: 44px;
        }
        .avatar {
            position: relative;
            .crown {
                position: absolute;
                transform:rotate(-40deg);
                z-index: 1;
                top: -35px; // 王冠位置
                left: -12px;
            }
        }
        .rankText {
            display: inline-block;
            width: 20%;
            margin-right: 10px;
        }
    }
}
</style>
