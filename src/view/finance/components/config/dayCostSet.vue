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
            <i-switch @on-change="toshow()" />
          </span>
          <span style="float:right;cursor: pointer">
            <Icon type="ios-arrow-forward" size="16" />
          </span>
        </li>
      </ul>
    </Card>
    <Form
      ref="dayCostSet"
      :model="data"
      :rules="validate"
      label-position="right"
    >
      <Card style="width:350px;float: left;margin-right:20px" v-show="show">
        <p slot="title">
          <span class="title">数据补丁（6）</span>
        </p>
        <FormItem label="付款方式：" class="site-class" prop="paymentMethod">
          <Select
            style="width: 230px;"
            v-model="data.paymentMethod"
            @on-change="changeType"
            placeholder="请选择付款方式"
          >
            <Option value="1">单价计费</Option>
            <Option value="2">包月付款</Option>
          </Select>
        </FormItem>
        <FormItem label="渠道名称：" class="site-class" prop="channelName">
          <Input
            clearable
            placeholder="请输入渠道名称"
            style="width: 230px"
            v-model="data.channelName"
          />
        </FormItem>
        <FormItem label="所属站群：" class="site-class" prop="stations">
          <Input
            clearable
            placeholder="请输入所属站群"
            style="width: 230px;"
            v-model="data.stations"
          />
        </FormItem>
        <FormItem label="所属账期：" class="site-class" prop="date">
          <DatePicker
            :clearable="false"
            type="daterange"
            placeholder="请输入所属账期"
            style="width: 230px;"
            v-model="data.date"
          />
        </FormItem>
        <FormItem
          label="金额："
          class="site-class"
          style="margin-left: 35px;"
          prop="paymentAmount"
        >
          <InputNumber
            :min="0"
            :max="99999999999"
            style="width: 230px;"
            v-model="data.paymentAmount"
            :disabled="jine"
            placeholder="请输入金额"
          />
        </FormItem>
        <FormItem
          label="单价："
          class="site-class"
          style="margin-left: 35px;"
          prop="unitPrice"
        >
          <InputNumber
            :min="0"
            :max="99999999999"
            style="width: 230px;"
            v-model="data.unitPrice"
            :disabled="baoyue"
            placeholder="请输入单价"
          />
        </FormItem>
        <FormItem style="text-align: center;">
          <Button type="primary" class="btns" @click="submit">保存</Button>
          <Button class="btns" @click="cancel">清空</Button>
        </FormItem>
      </Card>
    </Form>
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
import moment from 'moment'
export default {
  name: 'dayCostSet',
  data () {
    return {
      baoyue: false,
      jine: false,
      show: false,
      oneLevelList: [
        {
          name: '渠道名称'
        }
      ],
      data: {
        channelName: '', // 渠道名
        paymentMethod: '', // 付款方式
        paymentAmount: 0, // 付款金额
        unitPrice: 0, // 单价
        stations: '', // 所属站群
        date: [] // 所属账期
      },
      validate: {
        channelName: [
          {
            required: true,
            transform: value => (value ? value.trim() : ''),
            message: '渠道名称必填',
            trigger: 'blur'
          }
        ],
        stations: [
          {
            required: true,
            transform: value => (value ? value.trim() : ''),
            message: '所属站群必填',
            trigger: 'blur'
          }
        ],
        paymentMethod: [
          { required: true, message: '付款方式必填', trigger: 'blur' }
        ],
        date: [
          {
            required: true,
            type: 'array',
            message: '日期必填',
            trigger: 'blur'
          }
        ],
        unitPrice: [{ type: 'number', trigger: 'blur' }],
        paymentAmount: [{ type: 'number', trigger: 'blur' }]
      }
    }
  },
  methods: {
    changeType (v) {
      if (v === '2') {
        this.baoyue = true
        this.jine = false
      } else if (v === '1') {
        this.jine = true
        this.baoyue = false
      }
    },
    toshow (v) {
      this.show = !this.show
    },
    cancel (data = {}) {
      let initData = {
        channelName: '', // 渠道名
        paymentMethod: '', // 付款方式
        paymentAmount: 0, // 付款金额
        unitPrice: 0, // 单价
        stations: '', // 所属站群
        date: [] // 所属账期
      }
      this.data = Object.assign(initData, data)
      return this.data
    },
    submit () {
      this.$refs.dayCostSet.validate(v => {
        if (!v) {
          return false
        } else {
          let startTime = moment(this.data.date[0]).format('YYYY-MM-DD')
          let endTime = moment(this.data.date[1]).format('YYYY-MM-DD')
          let paymentMethod = this.data.paymentMethod
          let channelName = this.data.channelName
          let paymentAmount = this.data.paymentAmount
          let stations = this.data.stations
          let unitPrice = this.data.unitPrice
          let sendData = {
            startTime,
            endTime,
            paymentMethod,
            channelName,
            paymentAmount,
            stations,
            unitPrice
          }
          this.$axios({
            url: baseUrl + '/accounting/concosttrack',
            method: 'post',
            data: $qs.stringify(sendData)
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
            } else {
              this.$Message.error(res.data.msg)
            }
          })
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
.site-class {
  margin-bottom: 15px;
}
</style>
