<template>
  <!-- 日常奖惩公示 -->
  <div>
    <div class="level-three clearfix">
      <DatePicker
        class="searchbar"
        style="width:200px;margin-left:5px;"
        type="date"
        v-model="time"
        :transfer="true"
        :clearable="false"
        @on-change="getPublicity"
      />
      <Button class="searchbar" @click="output()">导出</Button>
    </div>
    <Table border id="showReward" :columns="tableHeader" :data="list" />
    <div class="tableFooter"></div>
  </div>
</template>

<script>
import dom2pic from '@/libs/dom2pic.js'
import { baseUrl } from '@/api/base.js'
import moment from 'moment'
export default {
  name: 'rewardShow',
  data () {
    return {
      tableHeader: [
        { title: '序号', type: 'index', width: 60, align: 'center' },
        { title: '日期', minWidth: 60, align: 'center', key: 'rewardTime' },
        { title: '当事人', minWidth: 60, align: 'center', key: 'nickName' },
        { title: '分数', minWidth: 60, align: 'center', key: 'score' },
        { title: '事项', minWidth: 400, align: 'center', key: 'reason' },
        { title: '事项性质', minWidth: 60, align: 'center', key: 'isCoreName' },
        { title: '企业价值观', minWidth: 80, align: 'center', key: 'value' },
        { title: '发起人', minWidth: 60, align: 'center', key: 'initiatorName' }
      ],
      time: moment().format('YYYY-MM-DD'),
      list: []
    }
  },
  mounted () {
    this.getPublicity()
  },
  methods: {
    // 导出
    output () {
      let time = moment(this.time).format('YYYY-MM-DD')
      dom2pic('#showReward', time + '日常奖惩.png')
    },
    getPublicity () {
      let time = moment(this.time).format('YYYY-MM-DD')
      this.$axios({
        url: baseUrl + '/reward/getPublicity',
        method: 'post',
        data: $qs.stringify({
          time
        })
      }).then(res => {
        this.list = res.data.content
      })
    }
  }
}
</script>

<style scoped lang="less">
.header {
  width: 100%;
  .title {
    float: left;
    border-left: 2px solid;
  }
  .search {
    float: right;
  }
  &::after {
    clear: both;
    content: '';
  }
}
</style>
