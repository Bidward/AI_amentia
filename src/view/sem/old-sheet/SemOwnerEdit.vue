<template>
  <div>
    <Modal
      :mask-closable="false"
      @on-ok="submit"
      @on-cancel="closeModal"
      :loading="loading"
      v-model="show"
      title="更换责任人"
    >
      <Form :label-width="80">
        <FormItem label="关键词" prop="keyword">
          <Input disabled v-model="data.keyword" />
        </FormItem>
        <FormItem label="责任人" prop="owner">
          <Select v-model="data.owner" filterable>
            <Option
              v-for="(item,index) in incumbencyUserList"
              :key="index"
              :value="item.nickname"
            >{{item.nickname}}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { baseUrl, semUrl } from '@/api/base.js'
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
      incumbencyUserList: [],
      data: {
        accountName: '',
        accountId: '',
        groupId: '',
        groupName: '',
        keyword: '',
        owner: ''
      }
    }
  },
  mounted () {
    this.getIncumbency()
    let { accountName, accountId, groupId, groupName, keyword, user: owner } = this.propData
    this.data = { accountName, accountId, groupId, groupName, keyword, owner }
  },
  methods: {
    submit () {
      this.loading = true
      this.$axios({
        url: semUrl + '/Sheet/updateDayPersonName',
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
      this.closeModal()
    },
    closeModal () {
      this.$emit('input', false)
      this.$emit('updateList')
      this.$nextTick(() => {
        this.loading = true
      })
    },
    getIncumbency () {
      this.$axios({
        url: baseUrl + '/user/getIncumbencyTbUser',
        method: 'post'
      }).then(res => {
        this.incumbencyUserList = res.data.content
      })
    }
  },
  watch: {
    show (newV) {

    }
  }
}
</script>
