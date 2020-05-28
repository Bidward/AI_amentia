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
        ref="initialAmount"
        :model="data"
        :rules="validate"
        label-position="right"
      >
        <FormItem label="期初金额" prop="initialAmount">
          <InputNumber
            :min="-99999999999"
            :max="99999999999"
            v-model="data.initialAmount"
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
  name: 'editInitial',
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
        initialAmount: 0 // 金额
      },
      validate: {
        initialAmount: [
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
      url: baseUrl + '/accounting/recommence',
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
      this.$refs.initialAmount.validate(v => {
        if (!v) {
          return false
        } else {
          let sendData = {
            initialAmount: this.data.initialAmount,
            id: this.id
          }
          this.$axios({
            url: baseUrl + '/accounting/upcommence',
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
