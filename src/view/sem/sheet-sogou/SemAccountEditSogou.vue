<template>
  <div>
    <Modal v-model="show" :title="typeName" @on-ok="save" :loading="loading">
      <Form
        ref="AccountEdit"
        :model="data"
        :rules="validate"
        label-position="right"
        :label-width="80"
      >
        <FormItem label="账户名称" prop="accountName">
          <Input v-model="data.accountName" />
        </FormItem>
        <FormItem label="账户密码" prop="password">
          <Input v-model="data.password" />
        </FormItem>
        <FormItem label="token" prop="token">
          <Input v-model="data.token" />
        </FormItem>
        <FormItem label="账户返点" prop="accountRatio">
          <Input v-model="data.accountRatio" />
        </FormItem>
        <FormItem label="状态" prop="status">
          <Select v-model="data.status">
            <Option value="1" label="启用" />
            <!-- <Option value="2" label="只取数据" /> -->
            <Option value="3" label="暂停" />
          </Select>
        </FormItem>

        <FormItem label="日均消费日期" prop="date">
          <DatePicker v-model="data.date" :clearable="false" type="date" placeholder="Select date" style="width:100%"/>
        </FormItem>

        <FormItem label="备注">
          <Input type="textarea" v-model="data.sum" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { semUrl } from '@/api/base.js'
import moment from 'moment'
export default {
  name: 'SemAccountEditBaidu',
  props: {
    showEdit: {
      type: Boolean,
      default: false
    },
    accountId: {
      type: [String, Number]
    }
  },
  data () {
    return {
      loading: true,
      data: {
        accountName: '', // 账户名称
        passwd: '', // 密码
        token: '',
        accountRatio: '', // 账户返点
        sum: '', // 备注
        date: ''// 日期
      },
      validate: {
        accountName: [{ required: true, message: '账户名称必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        token: [{ required: true, message: 'token必填', trigger: 'blur' }],
        accountRatio: [{ required: true, message: '账户返点', trigger: 'blur' }],
        status: [{ required: true, message: '状态必填', trigger: 'blur' }],
        date: [{ required: true,
          message: '日期必填',
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (!value) callback(new Error('必填'))
            value = moment(value).format('YYYY-MM-DD')
            callback()
          } }]
      }
    }
  },
  mounted () {
    if (this.accountId !== -1) {
      this.$axios({
        url: semUrl + '/AccountSogou/showAccount',
        method: 'post',
        data: $qs.stringify({ accountId: this.accountId })
      }).then(res => {
        if (res.data.code === 10000) {
          this.data = res.data.data
        }
      })
    }
  },
  methods: {
    save () {
      this.loading = false
      this.$refs.AccountEdit.validate(v => {
        if (!v) {
          return false
        } else {
          let sendData = this.data
          sendData.date = moment(this.data.date).format('YYYY-MM-DD')
          // 新增、编辑同一个接口
          this.$axios({
            url: semUrl + '/AccountSogou/saveAccount',
            method: 'post',
            data: $qs.stringify(sendData)
          }).then(res => {
            if (res.data.code === 10000) {
              this.show = false
              this.$Message.success(res.data.msg)
              this.$emit('on-success', true)
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
    },
    typeName () {
      return this.accountId === -1 ? '新增' : '编辑'
    }
  }
}
</script>
