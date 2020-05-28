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
        ref="initialAmountMath"
        :model="data"
        :rules="validate"
        label-position="right"
      >
        <FormItem label="期初金额" prop="initialAmountMath">
          <InputNumber
            :min="-99999999999"
            :max="99999999999"
            v-model="data.initialAmountMath"
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
  name: 'editWarining',
  props: {
    showEdit: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number]
    },
    businessName: {
      type: [String]
    }
  },
  data () {
    return {
      loading: true,
      data: {
        initialAmountMath: 0 // 金额
      },
      validate: {
        initialAmountMath: [
          {
            required: true,
            type: 'number',
            message: '请输入正确格式',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    this.$axios({
      url: baseUrl + '/accountingwarning/recommence',
      method: 'post',
      data: $qs.stringify({ id: this.id, businessName: this.businessName })
    }).then(res => {
      if (res.data.code === 10000) {
        let data = res.data.content.initialAmountMath
        this.data.initialAmountMath = data
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
      this.$refs.initialAmountMath.validate(v => {
        if (!v) {
          return false
        } else {
          let sendData = {
            initialAmount: this.data.initialAmountMath,
            id: this.id,
            businessName: this.businessName
          }
          this.$axios({
            url: baseUrl + '/accountingwarning/upcommence',
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
