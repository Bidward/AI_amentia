<template>
  <div>
    <Modal
      v-model="show"
      title="编辑"
      :loading="loading"
      @on-ok="submit"
      :mask-closable="false"
    >
      <Form
        :label-width="100"
        ref="editReceipt"
        :model="data"
        :rules="validate"
        label-position="right"
      >
        <FormItem label="收款时间" prop="paydate">
          <DatePicker
            :clearable="false"
            type="date"
            placeholder="收款时间"
            v-model="data.paydate"
          />
        </FormItem>
        <FormItem label="开票时间" prop="publishtime">
          <DatePicker
            :clearable="false"
            type="datetime"
            placeholder="开票时间"
            v-model="data.publishtime"
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
          <Input v-model="data.businessName" />
        </FormItem>
        <FormItem label="商务" prop="business">
          <Input v-model="data.business" />
        </FormItem>
        <FormItem label="账户名称" prop="accountName">
          <Input v-model="data.accountName" />
        </FormItem>
        <FormItem label="收款账号" prop="account">
          <Input v-model="data.account" />
        </FormItem>
        <FormItem label="备注" prop="remarks">
          <Input v-model="data.remarks" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
import moment from 'moment'
export default {
  name: 'editReceipt',
  props: {
    showEdit: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number]
    }
  },
  data () {
    return {
      loading: true,
      data: {
        paydate: '', // 收款时间
        publishtime: '', // 开票时间
        money: 0, // 收款金额
        businessName: '', // 厂商名称
        accountName: '', // 账户名称
        account: '', // 收款账号
        business: '', // 商务
        remarks: '' // 备注
      },
      validate: {
        paydate: [
          {
            required: true,
            type: 'date',
            message: '日期必填',
            trigger: 'change'
          }
        ],
        publishtime: [
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
        business: [
          {
            required: true,
            message: '商务必填',
            trigger: 'change'
          }
        ],
        accountName: [
          {
            required: true,
            message: '账户名称必填',
            trigger: 'change'
          }
        ],
        account: [
          {
            required: true,
            message: '收款账号必填',
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted () {
    this.$axios({
      url: baseUrl + '/accounting/rereceipt',
      method: 'post',
      data: $qs.stringify({ id: this.id })
    }).then(res => {
      if (res.data.code === 10000) {
        let data = res.data.content
        this.data = data
      }
    })
  },
  methods: {
    updataList () {
      this.$emit('updataList')
    },
    // 保存
    submit () {
      this.loading = false
      this.$refs.editReceipt.validate(v => {
        if (!v) {
          return false
        } else {
          let sendData = {
            paydate: moment(this.data.paydate).format('YYYY-MM-DD'),
            makedate: moment(this.data.publishtime).format(
              'YYYY-MM-DD HH:mm:ss'
            ),
            money: this.data.money,
            businessName: this.data.businessName,
            account: this.data.accountName,
            accountNumber: this.data.account,
            business: this.data.business,
            id: this.id,
            remarks: this.data.remarks
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
        this.$emit('update:showEdit', false)
      },
      get () {
        return this.showEdit
      }
    }
  }
}
</script>
