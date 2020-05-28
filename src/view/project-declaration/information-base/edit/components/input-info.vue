<template>
    <div class="viewWrapper bottom" id="inputInfo">
        <Row class="rowPadding">
            <Col span="22" class="titles">信息录入</Col>
        </Row>
        <div style="padding: 20px 150px;">
            <Form ref="info" :model="info" :rules="rules">
                <Row class="rowPadding">
                    <Col span="3" offset="2" class="title">
                        <i class="require">*</i>
                        <span>信息类型：</span>
                    </Col>
                    <Col span="18">
                        <FormItem prop="infoType">
                            <Select
                                v-model="info.infoType"
                                placeholder="选择"
                                style="width:85%"
                                :disabled="disabled"
                            >
                                <Option
                                    v-for="item in infoTypeList"
                                    :value="item.name"
                                    :key="item.id"
                                >{{item.name}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row class="rowPadding" v-for="(item,index) in info.projectNameList" :key="index">
                    <Col span="3" offset="2" class="title">
                        <i class="require">*</i>
                        <span>项目名称：</span>
                    </Col>
                    <Col span="18">
                        <FormItem prop="projectName">
                            <Input
                                v-model.trim="item.projectName"
                                placeholder="请输入"
                                style="width:85%"
                                :class="{red:item.red}"
                                maxlength="200"
                                show-word-limit
                            />
                            <Button
                                shape="circle"
                                icon="md-add"
                                @click="addProject"
                                style="margin:0px 5px 0px 5px"
                            ></Button>
                            <Button
                                v-if="info.projectNameList.length>=2"
                                shape="circle"
                                icon="md-remove"
                                @click="removeProject(index)"
                            ></Button>
                        </FormItem>
                    </Col>
                </Row>
                <Row class="rowPadding" v-if="backLogType==='24'">
                    <Col span="3" offset="5" class="title" v-if="accordance">
                        <span style="color:red">项目数量不一致</span>
                    </Col>
                </Row>
            </Form>
        </div>
        <Row>
          <Card class="btn">
                <Button @click="goBack" style="margin-right:8px">返回</Button>
                <Button type="primary" @click="saveData">保存</Button>
            </Card>
        </Row>
    </div>
</template>

<script>
import { prUrl, phpURL } from '@/api/base.js'
export default {
  name: 'inputInfo',
  props: {
    infoType: {
      type: String,
      default: () => ''
    },
    projectName: {
      type: Object,
      default: () => {}
    },
    attachmentList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      infoTypeList: [
        { id: 1, name: '政策' },
        { id: 2, name: '申报通知' },
        { id: 3, name: '兑现通知' },
        { id: 4, name: '申报公示' },
        { id: 5, name: '兑现公示' }
      ],
      info: {
        infoType: '',
        projectNameList: []
      },
      rules: {},
      backLogPerson: [], // 待办的人
      attachmentBack: [], // 附件
      disabled: false,
      accordance: '' // 数量一致
      // backLogType:"",//待办类型，判断是新增还是编辑
    }
  },
  mounted () {
    if (this.$route.query.backLogId) {
      this.disabled = true
    }
    this.getBackLog() // 获取待办
    this.addProject()
  },
  watch: {
    // 信息类型
    infoType: {
      handler (val) {
        this.info.infoType = val
      }
    },
    // 项目名称
    projectName: {
      handler (val) {
        this.info.projectNameList = val.data || []
        this.accordance = val.msg
        if (this.info.projectNameList.length === 0) {
          this.info.projectNameList.push({ projectName: '' })
        }
      },
      deep: true
    },
    attachmentList: {
      handler (val) {
        this.attachmentBack = val
      },
      immediate: true
    }
  },
  computed: {
    // 待办类型，判断是新增还是编辑
    backLogType () {
      return this.$route.query.backLogType
    }
  },
  methods: {
    // 获取待办
    getBackLog () {
      let sendData = {
        userId: this.$store.state.user.userId,
        moduleName: 'info',
        operation: 'update'
      }
      this.$axios({
        url: phpURL + '/declareProject/OutreachConfig/getPersonId',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.backLogPerson = res.data.content
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 新增项目名称
    addProject () {
      this.info.projectNameList.push({
        projectName: ''
      })
    },
    // 删除项目名称
    removeProject (index) {
      this.info.projectNameList.splice(index, 1)
    },
    // 返回
    goBack () {
      const title = '提示'
      const content = '<p>记得保存后再返回哦~</p>'
      this.$Modal.confirm({
        title: title,
        content: content,
        okText: '去保存',
        cancelText: '返回',
        onCancel: () => {
          this.$router.go(-1)
          bus.$emit('on-myclose', this.$route)
        }
      })
    },
    // 保存
    saveData () {
      // 信息类型不能为空
      if (
        this.info.infoType === null ||
                this.info.infoType.length === 0
      ) {
        this.$Message.error('请选择信息类型')
        return
      }
      let haveNull = true // 标志位
      this.info.projectNameList.map(e => {
        if (e.projectName.length === 0) {
          // 如果项目名称有空的,更改标识状态
          haveNull = false
        }
      })
      // 如果项目名称为空，提示
      if (!haveNull) {
        this.$Message.error('请输入项目名称')
        return
      }
      let list = sessionStorage.messageTabs || ''
      let infoStatus = ''
      if (list === 'processed') {
        infoStatus = 1
      } else {
        infoStatus = 0
      }
      let sendData = {
        infoId: this.$route.query.infoId, // 数据id
        infoName: this.$route.query.infoName, // 信息名称
        infoStatus: infoStatus, // 0表示待处理 1已处理
        relatedId: this.$route.query.relatedId || -1, // 关联id
        backLogId: this.$route.query.backLogId || -1, // 待办id
        operatorId: this.$store.state.user.userId, // 当前用户
        infoType: this.info.infoType, // 信息类型
        projectList: this.info.projectNameList, // 项目名称
        router: 'projectDeclaration/editInfo', // 路由
        status: this.$route.query.status, // 数据状态，0未过白1过白
        acceptIdList: Object.values(this.backLogPerson), // 待办发送人
        attachmentList: this.attachmentBack, // 附件
        backLogType: this.$route.query.backLogType // 代办类型
      }
      this.$axios({
        url: prUrl + '/info/save',
        method: 'post',
        data: sendData
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            bus.$emit('on-myclose', this.$route)
            this.$router.push({ name: 'informationPending' })
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
<style>
.ivu-btn-text {
    border-color: #dcdee2;
}
 .ivu-btn-text:hover{
  border-color: #47bba4;
}
</style>
<style lang="less" scoped>
.require {
    color: red;
    position: relative;
    top: 2px;
    right: 2px;
}
.titles {
    font-size: 15px;
    color: #19aa8d;
    font-weight: bold;
}
.title {
    text-align: right;
    line-height: 38px;
    margin-right: 10px;
    font-size: 14px;
}
.bottom {
    border-radius: 10px;
    position: relative;
    top: -75px;
    width: 85%;
    margin: auto;
    min-height: 300px;
    box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.2),
        0 0px 41px 0 rgba(246, 234, 234, 0.19);
    padding: 20px;
}
.rowPadding {
    margin-bottom: 20px;
}
.red {
    border: 1px solid red;
    border-radius: 5px;
}
.btn {
    position: fixed;
    bottom: 5%;
    left: 48%;
    background: white;
    z-index: 10;
}
</style>
