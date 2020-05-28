<template>
  <div>
    <div class="level-three">
      <Form
        ref="totalSearchBar"
        :model="totalSearchHeader"
        inline
        label-position="right"
        :label-width="60"
        style="float:right; height: 30px;"
      >
        <FormItem label="开始时间">
          <DatePicker
            format="yyyy-MM-dd"
            @on-change="(v)=>totalSearchHeader.startTime=v"
            v-model="totalSearchHeader.startTime"
            placeholder="开始时间"
            :transfer="true"
            style="margin-right: 25px"
          />
        </FormItem>
        <FormItem label="结束时间">
          <DatePicker
            format="yyyy-MM-dd"
            @on-change="(v)=>totalSearchHeader.endTime=v"
            v-model="totalSearchHeader.endTime"
            placeholder="结束时间"
            :transfer="true"
          />
        </FormItem>
        <FormItem label="类型">
          <Select v-model="totalSearchHeader.type">
            <Option value="1">默认</Option>
            <Option value="0">全部</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button @click="getStatistics()">搜索</Button>
        </FormItem>
      </Form>
    </div>
    <Row :gutter="20">
      <Col span="8" v-for="(item,index) in totalContent" :key="index">
        <Table border class="r-table" :columns="totalHeader" :data="item" />
      </Col>
    </Row>
    <div class="tableFooter"></div>
  </div>
</template>
<script>
import moment from 'moment'
import { baseUrl } from '@/api/base.js'
export default {
  name: 'rewardRankOld',
  props: {
    showSelect: {
      type: Boolean
    }
  },
  mounted () {
    this.initStartTime()
    this.getStatistics()
  },
  data () {
    return {
      // 奖惩排名页面的表头
      totalHeader: [
        { title: '奖惩排名', key: 'rank', align: 'center' },
        { title: '姓名', key: 'nickName', align: 'center' },
        { title: '奖惩分数', key: 'score', align: 'center' }
      ],
      // 奖惩排名页的搜索框
      totalSearchHeader: {
        startTime: '',
        endTime: '',
        type: '1'
      },
      // 奖惩排名页面的内容
      totalContent: [
        [{ rank: '1', name: 'XXX', score: '100' }],
        [{ rank: '1', name: 'XXXX', score: '100' }]
      ]
    }
  },

  methods: {
    // 获取奖惩统计的排名列表
    getStatistics () {
      this.totalSearchHeader.startTime = moment(
        this.totalSearchHeader.startTime
      ).format('YYYY-MM-DD')
      this.totalSearchHeader.endTime = moment(
        this.totalSearchHeader.endTime
      ).format('YYYY-MM-DD')
      let data = this.totalSearchHeader
      this.$axios({
        url: baseUrl + '/reward/getStatistics',
        method: 'post',
        data: $qs.stringify(data)
      })
        .then(res => {
          this.formatTotal(res.data.content)
        })
        .catch(err => {
          console.log('getStatistics' + err)
        })
    },
    // 将拿到的数据格式化，每15切一次
    formatTotal (a) {
      let FunData = e => {
        let proportion = 15 // 按照比例切割
        let num = 0
        let _data = []
        for (let i = 0; i < e.length; i++) {
          if (i % proportion === 0 && i !== 0) {
            _data.push(e.slice(num, i))
            num = i
          }
          if (i + 1 === e.length) {
            _data.push(e.slice(num, i + 1))
          }
        }
        return _data
      }
      this.totalContent = FunData(a)
    },
    initStartTime () {
      let firstDayOfMonth =
        moment()
          .add(0, 'month')
          .format('YYYY-MM') + '-01'
      let lastDayOfMonth = moment(firstDayOfMonth)
        .add(1, 'month')
        .add(-1, 'days')
        .format('YYYY-MM-DD')
      this.totalSearchHeader.startTime = firstDayOfMonth
      this.totalSearchHeader.endTime = lastDayOfMonth
    }
  }
}
</script>
<style scoped>
/* .tableBox {
  display: flex;
  flex-wrap:wrap;
  justify-content: space-between;
} */
/* .tableBox {
  width: 100%;
  overflow: hidden;
} */
.r-table {
  float: left;
  width: 100%;
  margin-bottom: 20px;
  margin-right: calc((100% - 1500px) / 3);
}
</style>
