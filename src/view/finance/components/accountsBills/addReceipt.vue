<template>
  <div>
    <Modal
      v-model="show"
      title="新增"
      :loading="loading"
      @on-ok="add"
      :mask-closable="false"
    >
      <Form
        :label-width="100"
        ref="addReceipt"
        :model="data"
        :rules="validate"
        label-position="right"
      >
        <FormItem label="收款时间" prop="date">
          <DatePicker
            :clearable="false"
            type="date"
            placeholder="收款时间"
            v-model="data.date"
          />
        </FormItem>
        <FormItem label="开票时间" prop="makedate">
          <DatePicker
            :clearable="false"
            type="datetime"
            placeholder="开票时间"
            v-model="data.makedate"
          />
        </FormItem>
        <FormItem label="收款金额" prop="money">
          <InputNumber
            :min="0"
            :max="99999999999"
            v-model="data.money"
            style="width:390px"
            placeholder="请输入收款金额"
          />
        </FormItem>
        <FormItem label="厂商名称" prop="businessName">
          <Select
            filterable
            clearable
            v-model="data.businessName"
            placeholder="请选择厂商"
          >
            <Option
              v-for="(item, index) in headerSelection.businessName"
              :value="item.ticketCompany"
              :id="item.id"
              :key="index"
              >{{ item.ticketCompany }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="商务" prop="business">
          <Input placeholder="请选择商务" v-model="data.business" />
        </FormItem>
        <FormItem label="收款账号" prop="account">
          <Input
            filterable
            clearable
            v-model="data.account"
            placeholder="请选择收款账号"
            @on-change="getBasicTwo()"
          />
        </FormItem>
        <FormItem label="账户名称" prop="accountName">
          <Input
            placeholder="请选择账户名称"
            disabled
            v-model="data.accountName"
          />
          <!-- <Select
            filterable
            clearable
            v-model="data.accountName"
            placeholder="请选择账户名称"
          >
            <Option
              v-for="(item, index) in headerSelection.accountName"
              :value="item.name"
              :key="index"
              >{{ item.name }}</Option
            >
          </Select> -->
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
import moment from 'moment'
export default {
  name: 'addReceipt',
  props: {
    showEditAdd: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: true,
      data: {
        date: '', // 收款时间
        makedate: '', // 开票时间
        money: 0, // 收款金额
        businessName: '', // 厂商名称
        business: '', // 商务
        accountName: '', // 账户名称
        account: '' // 收款账号
      },
      headerSelection: {
        businessName: [] // 厂商名称
        // accountName: [] // 账户名称
      },
      validate: {
        date: [
          {
            required: true,
            type: 'date',
            message: '日期必填',
            trigger: 'change'
          }
        ],
        money: [
          {
            required: true,
            type: 'number',
            message: '收款金额必填',
            trigger: 'change'
          }
        ],
        businessName: [
          {
            required: true,
            message: '厂商名称必填',
            trigger: 'change',
            type: 'string'
          }
        ],
        accountName: [
          {
            required: true,
            message: '请输入正确的收款账号',
            trigger: 'change',
            type: 'string'
          }
        ],
        account: [
          {
            required: true,
            message: '收款账号必填',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    this.$axios({
      url: baseUrl + '/accounting/getbusiness',
      data: $qs.stringify({ falg: 1 }),
      method: 'post'
    }).then(res => {
      if (res.data.code === 10000) {
        this.headerSelection.businessName = res.data.content.businessName
      } else {
        this.$Message.error(res.data.msg)
      }
    })
  },
  methods: {
    // 获取账户名称
    getBasicTwo () {
      this.$axios({
        url: baseUrl + '/accounting/getbusiness/',
        data: $qs.stringify({ falg: 3, account: this.data.account }),
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.data.accountName = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 新增
    add () {
      this.loading = false
      this.$refs.addReceipt.validate(v => {
        if (!v) {
          return false
        } else {
          let sendData = {
            paydate: moment(this.data.date).format('YYYY-MM-DD'),
            makedate: moment(this.data.makedate).format('YYYY-MM-DD HH:mm:ss'),
            money: this.data.money,
            businessName: this.data.businessName,
            business: this.data.business,
            account: this.data.accountName,
            accountNumber: this.data.account
          }
          this.$axios({
            url: baseUrl + '/accounting/setreceipt',
            method: 'post',
            data: $qs.stringify(sendData)
          }).then(res => {
            if (res.data.code === 10000) {
              this.show = false
              this.$Message.success(res.data.msg)
              this.$emit('updataList', true)
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
      this.$nextTick(() => {
        this.loading = true
      })
    }
  },
  computed: {
    show: {
      set () {
        this.$emit('update:showEditAdd', false)
      },
      get () {
        return this.showEditAdd
      }
    }
  }
}
</script>
