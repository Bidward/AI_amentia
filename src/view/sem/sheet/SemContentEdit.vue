<template>
  <div>
    <Modal
      :mask-closable="false"
      @on-ok="submit"
      @on-cancel="closeModal"
      :loading="loading"
      v-model="show"
      title="内容编辑"
    >
      <Form :label-width="80">
        <FormItem label="关键词" prop="keyword">
          <Input disabled v-model="data.keyword" />
        </FormItem>
        <FormItem label="软件ID" prop="xzSoftid">
          <Input disabled v-model="data.xzSoftid" />
        </FormItem>
        <FormItem label="责任人" prop="owner">
          <Select v-model="data.owner" filterable>
            <Option
              v-for="(item,index) in employees"
              :key="index"
              :value="item.nickname"
            >{{item.nickname}}</Option>
          </Select>
        </FormItem>
        <FormItem label="产品名" prop="softName">
          <Input v-model="data.softName" />
          <p style="color:red;text-align:right">智能化上词更改产品名无效</p>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { semUrl } from '@/api/base.js'
export default {
  name: 'SemOwnerEdit',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    propData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      loading: true,
      show: this.value,
      data: {
        id: '',
        owner: '',
        keyword: ''
      }
    }
  },
  mounted () {
    const { id, owner, keyword, xzSoftid, softName } = this.propData
    this.data = { id, owner, keyword, xzSoftid, softName }
  },
  methods: {
    submit () {
      this.loading = true
      this.$axios({
        url: semUrl + '/CostT/uptCostOwner',
        method: 'post',
        data: $qs.stringify(this.data)
      }).then(res => {
        if (res.data.code === 10000) {
          this.$Message.success(res.data.msg)
          this.closeModal()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    closeModal () {
      this.$emit('input', false)
      this.$emit('on-success')
      this.$nextTick(() => {
        this.loading = true
      })
    }
  },
  computed: {
    employees () {
      return this.$store.state.user.employees
    }
  }
}
</script>
