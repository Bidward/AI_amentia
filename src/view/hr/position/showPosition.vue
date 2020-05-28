<template>
  <div>
    <Modal
      :title="config.title"
      v-model="show"
      @on-cancel="closeModal"
      @on-ok="ok"
      :width="550"
      :loading="loading"
      :class="config.tbcStatus?config.tbcStatus:'nomarl'"
      :ok-text="config.tbcStatus ==='secondDel'?'删除':'确定'"
    >
      <Form
        ref="showPosition"
        inline
        :label-width="80"
        :model="positionData"
        :rules="positionValidate"
      >
        <Row>
          <Col span="12">
            <FormItem prop="positionName" label="职位名称:">
              <span>{{propsData.positionName}}</span>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem prop="deptId" label="所属部门:">
              <span>{{propsData.deptName}}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem prop="positionLevel" label="职位等级:">
              <span>{{propsData.positionLevelName}}</span>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem prop="strengthNum" label="编制人数:">
              <span>{{propsData.strengthNum}}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem prop="qualification" label="任职资格:">
              <span>{{propsData.qualification}}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem prop="jobDuty" label="责任描述:">
              <span>{{propsData.jobDuty}}</span>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="config.tbcStatus==='firstDel'">
          <Col span="12">
            <FormItem prop="adviceUserId" label="通知人:">
              <Select v-model="positionData.adviceUserId" filterable style="width:162px;">
                <Option
                  v-for="person in incumbencyTbUser"
                  :key="person.id"
                  :value="person.id"
                >{{person.nickname}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
export default {
  name: 'showPosition',
  props: {
    propsData: {
      type: Object,
      default () {
        return {
          positionName: '',
          deptName: '',
          positionLevelName: '',
          strengthNum: '',
          qualification: '',
          jobDuty: ''
        }
      }
    },
    config: {
      type: Object,
      default () {
        return {
          title: '详情'
        }
      }
    },
    showDetail: {
      type: Boolean,
      default: false
    },
    incumbencyTbUser: Array
  },
  data () {
    return {
      show: this.showDetail,
      loading: true,
      positionData: {
        adviceUserId: ''
      },
      positionValidate: {
        adviceUserId: [
          {
            required: true,
            type: 'number',
            message: '通知人必填',
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted () { },
  methods: {
    closeModal () {
      this.$emit('update:showDetail', false)
    },
    ok () {
      if (this.config.tbcStatus === 'firstDel') {
        this.firstDel()
      } else if (this.config.tbcStatus === 'secondDel') {
        this.secondDel()
      } else {
        this.closeModal()
      }
    },
    // 一次删除
    firstDel () {
      this.$refs.showPosition.validate(v => {
        if (v) {
          let sendData = {}
          sendData.id = this.propsData.id
          sendData.adviceUserId = this.positionData.adviceUserId
          sendData.route = 'position'
          this.$axios({
            url: baseUrl + '/structure/delete',
            data: sendData,
            method: 'post'
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.$Message.success(res.data.msg)
                this.closeModal()
                this.$emit('reloadList', true)
              } else {
                this.$Message.error(res.data.msg)
                this.closeModal()
              }
            })
            .catch(err => {
              console.error(err)
            })
        } else {
          console.log(v)
        }
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      })
    },
    // 二次删除
    secondDel () {
      this.$axios({
        url: baseUrl + '/structure/deleteconfirm',
        method: 'post',
        data: { id: this.propsData.id }
      }).then(res => {
        if (res.data.code === 10000) {
          this.$Message.success(res.data.msg)
          this.closeModal()
          this.$emit('reloadList', true)
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  },
  watch: {
    showDetail: {
      handler (newVal) {
        this.show = newVal
      },
      immediate: true
    }
  }
}
</script>
<style>
.secondDel .ivu-modal .ivu-modal-footer .ivu-btn-primary {
  color: #fff;
  background-color: #ed4014;
  border-color: #ed4014;
}
</style>
