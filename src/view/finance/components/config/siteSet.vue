<template>
  <!-- 站点配置-->
  <div>
    <Card style="width:350px;float: left;margin-right:20px">
      <p slot="title">
        <span class="title">功能开关（1）</span>
      </p>
      <ul class="list-one">
        <li v-for="(item, i) in oneLevelList" :key="i">
          <span>
            <span class="oneTitle">{{ item.name }}</span>
            <span class="editIcon">
              <Icon type="ios-create-outline" size="16" />
            </span>
          </span>
          <span style="margin-left:15%">
            <i-switch v-model="switch1"  @on-change="toshow" />
          </span>
          <span style="float:right;cursor: pointer">
            <Icon type="ios-arrow-forward" size="16" />
          </span>
        </li>
      </ul>
    </Card>
    <Card style="width:350px;float: left;margin-right:20px" v-if="switch1">
      <p slot="title">
        <span class="title">提醒（1）</span>
      </p>
      <ul class="list-two">
        <li v-for="(item, i) in oneLevelList" :key="i">
          <span>
            <span>{{ item.name + ":" }}</span>
            <DatePicker
              :clearable="false"
              @on-ok="handleOk"
              v-model="data.date"
              confirm
              type="month"
              style="width: 230px;margin-left:10px"
            ></DatePicker>
          </span>
        </li>
      </ul>
    </Card>
  </div>
</template>
<script>
import moment from 'moment'
import { baseUrl } from '@/api/base.js'
export default {
  name: 'siteSet',
  data () {
    return {
      switch1: false,
      data: {
        date: ''
      },
      oneLevelList: [
        {
          name: '展示月份'
        }
      ]
    }
  },
  mounted () {
    this.getStatus()
  },
  methods: {
    getStatus () {
      let status = sessionStorage.month || ''
      if (status.length > 0) {
        this.switch1 = JSON.parse(sessionStorage.month)
        this.toshow(JSON.parse(sessionStorage.month))
      }
    },
    toshow (v) {
      let id = 1
      sessionStorage.setItem('month', v)
      if (v) {
        this.$axios({
          url: baseUrl + '/accounting/reclosingdate',
          method: 'post',
          data: $qs.stringify()
        }).then(res => {
          if (res.data.code === 10000) {
            this.data.date = res.data.content
          }
        })
      }
      if (!v) {
        id = 0
      }
      this.$axios({
        url: baseUrl + '/accounting/closingdate',
        method: 'post',
        data: $qs.stringify({ id: id })
      })
    },
    handleOk (e) {
      let date = moment(this.data.date).format('YYYY-MM-DD')
      let sendData = {
        date
      }
      this.$axios({
        url: baseUrl + '/accounting/consite',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.$Message.success(res.data.msg)
        }
      })
    }
  }
}
</script>
<style scoped>
.title {
  font-weight: bold;
  font-size: 14px;
}

.list-one li {
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #f8f8f8;
  margin-bottom: 10px;
  padding: 10px;
}

.list-two li {
  margin-bottom: 10px;
  padding: 6px;
}
.oneTitle {
  width: 30%;
  display: inline-block;
}
</style>
