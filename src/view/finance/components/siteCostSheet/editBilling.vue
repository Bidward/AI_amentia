<template>
  <div>
    <Modal
      :mask-closable="false"
      v-model="show"
      title="编辑"
      :loading="loading"
      @on-ok="submit"
    >
      <Form
        :label-width="100"
        ref="priceBilling"
        :model="data"
        :rules="validate"
        label-position="right"
      >
        <FormItem label="结算周期" prop="date">
          <DatePicker
            :clearable="false"
            type="daterange"
            placeholder="结算周期"
            v-model="data.date"
          />
        </FormItem>
        <FormItem label="单价" prop="unitPrice">
          <InputNumber
            :min="0"
            :max="99999999999"
            v-model="data.unitPrice"
            style="width:390px"
          />
        </FormItem>
        <FormItem label="修正金额" prop="revisedAmount">
          <InputNumber
            :min="0"
            :max="99999999999"
            v-model="data.revisedAmount"
            style="width:390px"
          />
        </FormItem>
        <FormItem label="修正原因" prop="cause">
          <Input v-model="data.cause" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
import moment from 'moment'
export default {
  name: 'editBilling',
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
        date: [], // 结算周期
        unitPrice: 0, // 单价
        revisedAmount: 0, // 修正金额
        cause: '' // 修正原因
      },
      validate: {
        unitPrice: [
          {
            required: true,
            type: 'number',
            message: '请输入正确格式',
            trigger: 'blur'
          }
        ],
        revisedAmount: [
          {
            required: true,
            type: 'number',
            message: '请输入正确格式',
            trigger: 'blur'
          }
        ],
        date: [
          {
            required: true,
            type: 'array',
            message: '日期必填',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    this.$axios({
      url: baseUrl + '/accounting/reunitprice',
      method: 'post',
      data: $qs.stringify({ id: this.id })
    }).then(res => {
      if (res.data.code === 10000) {
        let data = res.data.content
        let startTime = data.startTime
        let endTime = data.endTime
        data.date = [startTime, endTime]
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
      this.$refs.priceBilling.validate(v => {
        if (!v) {
          return false
        } else {
          let sendData = {
            startTime: moment(this.data.date[0]).format('YYYY-MM-DD'),
            endTime: moment(this.data.date[1]).format('YYYY-MM-DD'),
            revisedAmount: this.data.revisedAmount,
            unitPrice: this.data.unitPrice,
            cause: this.data.cause,
            id: this.id
          }
          this.$axios({
            url: baseUrl + '/accounting/modify',
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
