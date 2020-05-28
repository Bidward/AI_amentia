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
        <FormItem label="账户密码" prop="passwd">
          <Input v-model="data.passwd" />
        </FormItem>
        <FormItem label="对应站群" prop="siteGroup">
          <Input v-model="data.siteGroup" />
        </FormItem>
        <FormItem label="账户返点" prop="accountRatio">
          <Input v-model="data.accountRatio" />
        </FormItem>
        <FormItem label="账户域名" prop="domain">
          <Input v-model="data.domain" />
        </FormItem>
        <FormItem label="使用类型" prop="useType">
          <RadioGroup v-model="data.useType">
            <Radio label="1">自用</Radio>
            <Radio label="2">外放</Radio>
        </RadioGroup>
        </FormItem>
        <FormItem v-if="data.useType==='2'" label="外放返点" prop="useAccountRatio">
          <Input v-model="data.useAccountRatio" />
        </FormItem>
        <FormItem label="状态" prop="status">
          <Select v-model="data.status">
            <Option value="1" label="启用" />
            <Option value="3" label="暂停" />
          </Select>
        </FormItem>
        <FormItem label="排序" prop="orderBy">
          <Input v-model="data.orderBy" />
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
export default {
  name: 'SemAccountEdit',
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
        siteGroup: '', // 对应站群
        accountRatio: '', // 账户返点,
        domain: '', // 账户域名
        useType: '', // 使用类型,（外放、自用）
        useAccountRatio: '', // 外放返点
        status: '', // 状态
        orderBy: '', // 排序
        sum: ''// 备注
      },
      validate: {
        accountName: [{ required: true, message: '账户名称必填', trigger: 'blur' }],
        passwd: [{ required: true, message: '密码必填', trigger: 'blur' }],
        siteGroup: [{ required: true, message: '站群必填', trigger: 'blur' }],
        accountRatio: [{ required: true, message: '账户返点', trigger: 'blur' }],
        domain: [{ required: true, message: '域名必填', trigger: 'blur' }],
        status: [{ required: true, message: '状态必填', trigger: 'blur' }],
        orderBy: [{ required: true, message: '排序必填', trigger: 'blur' }],
        useType: [{ required: true, message: '使用类型必填', trigger: 'blur' }],
        useAccountRatio: [{ required: true, message: '外放返点必填', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    if (this.accountId !== -1) {
      this.$axios({
        url: semUrl + '/account/showAccount',
        method: 'post',
        data: $qs.stringify({ accountId: this.accountId })
      }).then(res => {
        if (res.data.code === 10000) {
          this.data = res.data.data
        }
      })
    } else {
      this.data.useType = '1'
    }
  },
  methods: {
    save () {
      this.loading = false
      this.$refs.AccountEdit.validate(v => {
        if (!v) {
          return false
        } else {
          // 新增、编辑同一个接口
          this.$axios({
            url: semUrl + '/account/saveAccount',
            method: 'post',
            data: $qs.stringify(this.data)
          }).then(res => {
            if (res.data.code === 10000) {
              this.show = false
              this.$emit('on-success', true)
            } else {
              this.$Message.error('失败')
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

<style>
</style>
