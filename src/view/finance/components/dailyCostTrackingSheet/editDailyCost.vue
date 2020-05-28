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
        ref="dailyCostTracking"
        :model="data"
        :rules="validate"
        label-position="right"
      >
        <FormItem label="付款方式" prop="methodName">
          <Select v-model="data.methodName" @on-change="changeType">
            <Option
              v-for="item in methods"
              :value="item.value"
              :key="item.id"
              >{{ item.value }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="所属站群" prop="stations">
          <Input v-model="data.stations" />
        </FormItem>
        <FormItem label="当日成本" prop="cost">
          <InputNumber
            :min="0"
            :max="99999999999"
            v-model="data.cost"
            :disabled="data.method === 1 ? true : false"
            style="width:390px"
          />
        </FormItem>
        <FormItem label="单价" prop="unitPrice">
          <InputNumber
            :min="0"
            :max="99999999999"
            v-model="data.unitPrice"
            :disabled="data.method === 2 ? true : false"
            style="width:390px"
          />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
export default {
  name: 'editDailyCost',
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
      methods: [
        {
          id: 1,
          value: '单价计费'
        },
        {
          id: 2,
          value: '包月付款'
        }
      ],
      data: {
        methodName: '',
        stations: '', // 站群
        cost: 0, // 成本
        unitPrice: 0 // 单价
      },
      validate: {
        unitPrice: [
          {
            required: true,
            type: 'number',
            message: '请输入正确格式',
            trigger: 'change'
          }
        ],
        cost: [
          {
            required: true,
            type: 'number',
            message: '请输入正确格式',
            trigger: 'change'
          }
        ],
        method: [
          {
            required: true,
            message: '付款方式必填',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    this.$axios({
      url: baseUrl + '/accounting/recosttrack',
      method: 'post',
      data: $qs.stringify({ id: this.id })
    }).then(res => {
      if (res.data.code === 10000) {
        this.data = res.data.content
        if (res.data.content.method === 1) {
          this.data.method = 1
        } else {
          this.data.method = 2
        }
      }
    })
  },
  watch: {},
  methods: {
    changeType (v) {
      this.data.method = v === '单价计费' ? 1 : 2
    },
    updataList () {
      this.$emit('updataList')
    },
    submit () {
      this.loading = false
      this.$refs.dailyCostTracking.validate(v => {
        if (!v) {
          return false
        } else {
          let sendData = {
            method: this.data.method,
            stations: this.data.stations,
            cost: this.data.cost,
            unitPrice: this.data.unitPrice,
            id: this.id
          }
          this.$axios({
            url: baseUrl + '/accounting/modifytrack',
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
  },
  filters: {
    trim: function (value) {
      return value.trim()
    }
  }
}
</script>
