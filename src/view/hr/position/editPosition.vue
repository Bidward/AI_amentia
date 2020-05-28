
<template>
  <div>
    <Modal
      v-model="showModal"
      :title="config.title"
      @on-cancel="closeModal"
      @on-ok="ok"
      :loading="loading"
      :width="600"
      :mask-closable="false"
    >
      <Form
        ref="editPosition"
        inline
        :label-width="80"
        :model="positionData"
        :rules="positionValidate"
      >
        <Row>
          <Col span="12">
            <FormItem prop="positionName" label="职位名称:">
              <Input
                type="text"
                placeholder="职位名称"
                style="width:162px;"
                v-model="positionData.positionName"
              ></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem prop="deptId" label="所属部门:">
              <Select v-model="positionData.deptId" style="width:162px;" filterable clearable>
                <Option :key="dept.id" v-for="dept in deptTreeList" :value="dept.id">{{dept.title}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem prop="positionLevel" label="职位等级:">
              <Select v-model="positionData.positionLevel" style="width:162px;" filterable>
                <Option
                  :key="position.id"
                  v-for="position in positionLevelList"
                  :value="position.id"
                >{{position.optionName}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem prop="strengthNum" label="编制人数:">
              <Input
                type="text"
                style="width:162px;"
                v-model="positionData.strengthNum"
                placeholder="编制人数"
              ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem prop="qualification" label="任职资格:">
              <Input
                type="textarea"
                v-model="positionData.qualification"
                style="width:445px;"
                :rows="3"
                placeholder="任职资格："
              ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem prop="jobDuty" label="责任描述:">
              <Input
                type="textarea"
                v-model="positionData.jobDuty"
                style="width:445px;"
                :rows="3"
                placeholder="责任描述"
              ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem prop="adviceUserId" label="通知人:" v-if="config.showNotice<=1">
              <Select
                v-model="positionData.adviceUserId"
                filterable
                :disabled="config.showNotice===1"
                style="width:162px;"
              >
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
      <Form v-if="showDiff">
        <Table :columns="diffTableHeader" :data="diffTableContent"></Table>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
export default {
  name: 'editPositon',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '新增'
    },
    // 传进来的数据
    propsData: {
      type: Object,
      default () {
        return {}
      }
    },
    deptTreeList: {
      type: Array
    },
    // 职位等级
    positionLevelList: {
      type: Array
    },
    // 在职人员列表
    incumbencyTbUser: Array,
    config: {
      type: Object,
      default () {
        return {
          title: '新增', // 弹出框的标题
          showNotice: 0, // 是否显示通知人0可选1禁用2不显示
          getPropsData: false,
          tbcStatus: -1 // 待确认状态
        }
      }
    }
  },
  data () {
    return {
      showModal: this.show,
      loading: true,
      positionData: {
        positionName: '', // 职位名
        deptId: '', // 所属部门
        strengthNum: '', // 编制人数
        positionLevel: '', // 职位等级
        qualification: '', // 任职资格
        jobDuty: '', // 责任描述
        adviceUserId: '' // 通知人id
      },
      positionValidate: {
        positionName: [
          { required: true, message: '职位名称必填', trigger: 'blur' }
        ],
        deptId: [
          {
            required: true,
            type: 'number',
            message: '部门必填',
            trigger: 'change'
          }
        ],
        adviceUserId: [
          {
            required: true,
            type: 'number',
            message: '通知人必填',
            trigger: 'change'
          }
        ],
        positionLevel: [
          {
            required: true,
            type: 'number',
            message: '职位等级必填',
            trigger: 'change'
          }
        ]
      },
      showDiff: false, // 展示对比信息
      diffTableHeader: [],
      diffTableContent: []
    }
  },
  mounted () {
    // 是否需要回显,布尔值
    if (this.config.getPropsData) {
      this.positionData = this.propsData
    }
  },
  methods: {
    // 点击确定后的操作
    ok () {
      this.$refs.editPosition.validate(v => {
        if (v) {
          this.submit()
        }
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      })
    },
    // 提交表单
    submit () {
      switch (this.config.tbcStatus) {
        // 初次新增
        case 'firstAdd': {
          let sendData = {}
          sendData.position = this.positionData
          sendData.adviceUserId = this.positionData.adviceUserId
          sendData.route = 'position'
          this.$axios({
            url: baseUrl + '/structure/insert',
            data: sendData,
            method: 'post'
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.$Message.success(res.data.msg)
                this.closeModal()
              } else {
                this.$Message.error(res.data.msg)
              }
            })
            .catch(err => {
              console.log(err)
            })
          break
        }
        // 初次编辑
        case 'firstEdit': {
          let sendData = {}
          sendData.position = this.positionData
          sendData.position.id = this.propsData.id
          sendData.adviceUserId = this.positionData.adviceUserId
          sendData.route = 'position'
          this.$axios({
            url: baseUrl + '/structure/update',
            data: sendData,
            method: 'post'
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.$Message.success(res.data.msg)
                this.closeModal()
              } else {
                this.$Message.error(res.data.msg)
              }
            })
            .catch(err => {
              console.log(err)
            })
          break
        }
        // 待办事项列表里面来的编辑
        default: {
          let sendData = {}
          sendData.position = this.positionData
          sendData.id = this.propsData.id
          this.$axios({
            url: baseUrl + '/structure/check',
            data: sendData,
            method: 'post'
          })
            .then(res => {
              let content = res.data.content
              if (res.data.code === 10000) {
                if (content.flag === 1) {
                  // 信息不一致，显示对比信息
                  if (content.tbcStatus === 1) {
                    // 信息不一致，显示对比信息
                    this.$Message.error('信息不一致')
                    this.showDiff = true
                    this.diffTableHeader = content.compareResult.header
                    this.diffTableContent = content.compareResult.data
                  } else {
                    // 第二个人未录入也修改了
                    this.$Message.success('修改成功')
                    this.closeModal()
                    this.reloadList()
                  }
                } else if (content.flag === 0) {
                  // 核对成功
                  this.$Message.success('两人两遍核对成功')
                  this.closeModal()
                  this.reloadList()
                } else if (content.flag === 2) {
                  // 发起人已经撤销
                  this.$Message.error('发起人已经撤销')
                  this.closeModal()
                  this.reloadList()
                }
              } else {
                this.$Message.error(res.data.msg)
                this.closeModal()
                this.reloadList()
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      }
    },
    // 关闭弹出框
    closeModal () {
      this.$emit('update:show', false)
      this.reloadList()
    },
    // 重新加载列表页
    reloadList () {
      this.$emit('reloadList', true)
    }
  },
  watch: {
    show (newVal) {
      this.showModal = newVal
    }
  }
}
</script>
