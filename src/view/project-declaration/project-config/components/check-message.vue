<template>
    <!--信息核对 -->
    <div>
        <div>
            <sonCheck
                :channelParentSubConfigs="productOneLevel"
                style="float:left"
                @nextSet="showTwoConfig"
                :isEdit="isEdit"
                reminder="模块"
                @changeSwith="handleOneSwith"
                v-if="showModule"
            ></sonCheck>
            <sonCheck
                :channelParentSubConfigs="productTwoLevel"
                style="float:left"
                @nextSet="showThreeConfig"
                :isEdit="isEdit"
                v-if="showTwoSet"
                reminder="操作"
                @changeSwith="handleTwoSwith"
            ></sonCheck>
            <sonCheck
                :channelParentSubConfigs="productFourLevel"
                style="float:left"
                @nextSet="showLastConfig"
                :isEdit="isEdit"
                v-if="showFourSet"
                reminder="部门"
                @changeSwith="handleFourSwith"
            ></sonCheck>
            <sonCheck
                :channelParentSubConfigs="productLastLevel"
                :isEdit="isEdit"
                style="float:left"
                v-if="showLastSet"
                reminder="定岗定编"
                @changeSwith="handlePositionSwith"
            ></sonCheck>
        </div>
        <div style="clear:both"></div>
        <div v-if="permiss.edit" style="text-align: center;clear: both;" class="btn">
            <Card>
                <span v-if="isEdit">
                    <Button type="primary" @click="editConfig">编辑</Button>
                </span>
                <span v-else>
                    <Button @click="back">取消</Button>
                    <Button type="primary" @click="saveAll" :loading="loading">保存</Button>
                </span>
            </Card>
        </div>
    </div>
</template>
<script>
import { phpURL } from '@/api/base.js'
import sonCheck from './son-check'
export default {
  name: 'checkMessage',
  components: {
    sonCheck
  },
  props: {},
  data () {
    return {
      loading: false, // 保存按钮状态
      isEdit: true, // 编辑
      showModule: true,
      showTwoSet: false,
      showThreeSet: false,
      showLastSet: false,
      showFourSet: false,
      productOneLevel: {}, // 产品一级标签
      productTwoLevel: {}, // 产品二级标签
      productFourLevel: {}, // 产品四级标签
      productLastLevel: {}, // 产品末级标签
      module: {}, // 点击模块的数据
      operation: {}, // 点击操作的数据
      fieldData: {}, // 点击字段的数据，存下传给后端
      department: {} // 点击的部门
    }
  },
  computed: {
    currentIds () {
      return this.$attrs.moduleL.currentId
    },
    permiss () {
      return this.$store.state.user.userpermission.projectReportConfig
    }
  },
  watch: {
    currentIds: {
      handler () {
        this.getData()
      },
      immediate: true
    }
  },
  destroyed () {
    this.cancel()
  },
  methods: {
    // 获取数据
    getData () {
      let sendData = {
        userId: this.$store.state.user.userId,
        id: this.$attrs.moduleL.currentId,
        fieldType: this.$attrs.moduleL.currentFieldType,
        tagId: this.$attrs.moduleL.currentTagId,
        tagName: this.$attrs.moduleL.currentTagName
      }
      this.$axios({
        url: phpURL + '/declareProject/OutreachConfig/listSubConfig',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.productOneLevel = res.data.content
          } else {
            this.$Message.error(res.data.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取操作
    showTwoConfig (item, status) {
      this.module = item // 选择的模块
      this.showThreeSet = false
      this.showFourSet = false
      this.showLastSet = false
      if (status) {
        let sendData = {
          userId: this.$store.state.user.userId,
          id: item.id,
          fieldType: item.fieldType,
          tagId: item.tagId,
          tagName: item.name,
          status: item.status
        }
        this.$axios({
          url:
                        phpURL + '/declareProject/OutreachConfig/listSubConfig',
          method: 'post',
          data: $qs.stringify(sendData)
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.showTwoSet = true
              this.productTwoLevel = res.data.content
            } else {
              this.showTwoSet = false
              this.$Message.error(res.data.message)
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.showTwoSet = false
        this.showThreeSet = false
        this.showFourSet = false
        this.showLastSet = false
      }
    },
    // 获取部门
    showThreeConfig (item, status) {
      this.showThreeSet = false
      this.showFourSet = false
      this.showLastSet = false
      if (status) {
        this.operation = item // 选择的字段
        let sendData = {
          userId: this.$store.state.user.userId,
          fieldType: item.fieldType,
          tagId: item.tagId,
          tagName: item.name,
          status: item.status
        }
        this.$axios({
          url: phpURL + '/declareProject/OutreachConfig/listDept',
          method: 'post',
          data: $qs.stringify(sendData)
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.showFourSet = true
              this.productFourLevel = res.data.content
            } else {
              this.showFourSet = false
              this.$Message.error(res.data.message)
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.showThreeSet = false
        this.showFourSet = false
        this.showLastSet = false
      }
    },
    // 获取职位
    showLastConfig (item, status) {
      this.department = item // 选择的部门
      if (status) {
        let sendData = {
          userId: this.$store.state.user.userId,
          deptId: item.id,
          operationId: item.operationId,
          moduleId: item.moduleId,
          deptName: item.name,
          fieldType: item.fieldType,
          fieldId: item.fieldId,
          status: item.status
        }
        this.$axios({
          url: phpURL + '/declareProject/OutreachConfig/listStation',
          method: 'post',
          data: $qs.stringify(sendData)
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.showLastSet = true
              this.productLastLevel = res.data.content
            } else {
              this.$Message.error(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.showLastSet = false
      }
    },
    // 模块开关
    handleOneSwith (v) {
      let sendData = {
        userId: this.$store.state.user.userId,
        tagId: v.tagId,
        fieldType: this.$attrs.moduleL.currentFieldType,
        status: v.status,
        tagName: v.tagName,
        parentTagId: this.$attrs.moduleL.currentTagId
      }
      this.$axios({
        url: phpURL + '/declareProject/OutreachConfig/updateConfig',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            this.showTwoSet = false
            this.showThreeSet = false
            this.showFourSet = false
            this.showLastSet = false
          } else {
            this.$Message.error(res.data.message)
          }
          if (res.data.code === 10010) {
            this.remind()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 操作开关
    handleTwoSwith (v) {
      let sendData = {
        userId: this.$store.state.user.userId,
        tagId: v.tagId,
        fieldType: this.module.fieldType,
        status: v.status,
        tagName: v.tagName,
        parentTagId: this.module.tagId
      }
      this.$axios({
        url: phpURL + '/declareProject/OutreachConfig/updateConfig',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            this.showThreeSet = false
            this.showFourSet = false
            this.showLastSet = false
          } else {
            this.$Message.error(res.data.message)
          }
          if (res.data.code === 10010) {
            this.remind()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 字段开关
    handleThreeSwith (v) {
      let sendData = {
        userId: this.$store.state.user.userId,
        tagId: v.tagId,
        fieldType: this.operation.fieldType,
        status: v.status,
        tagName: v.tagName,
        parentTagId: this.operation.tagId
      }
      this.$axios({
        url: phpURL + '/declareProject/OutreachConfig/updateConfig',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            this.showFourSet = false
            this.showLastSet = false
          } else {
            this.$Message.error(res.data.message)
          }
          if (res.data.code === 10010) {
            this.remind()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 部门开关
    handleFourSwith (v) {
      let sendData = {
        userId: this.$store.state.user.userId,
        tagId: v.id,
        fieldType: this.operation.fieldType,
        status: v.status,
        tagName: v.name,
        parentTagId: this.operation.tagId,
        fieldId: v.fieldId,
        moduleId: v.moduleId,
        operationId: v.operationId
      }
      this.$axios({
        url: phpURL + '/declareProject/OutreachConfig/updateConfig',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            this.showLastSet = false
          } else {
            this.$Message.error(res.data.message)
          }
          if (res.data.code === 10010) {
            this.remind()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 职位开关
    handlePositionSwith (v) {
      let sendData = {
        userId: this.$store.state.user.userId,
        // tagId: v.id,
        fieldType: this.department.fieldType,
        status: v.status,
        tagName: v.name,
        fieldId: v.fieldId,
        moduleId: v.moduleId,
        operationId: v.operationId,
        parentTagId: this.department.id,
        tagId: v.tagId
      }
      this.$axios({
        url: phpURL + '/declareProject/OutreachConfig/updateConfig',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
          } else {
            this.$Message.error(res.data.message)
          }
          if (res.data.code === 10010) {
            this.remind()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 第三方编辑提示
    remind () {
      const title = '提示'
      const content = '<p>配置时间过长，操作失败，请返回重新编辑</p>'
      this.$Modal.warning({
        title: title,
        content: content
      })
    },
    // 编辑
    editConfig () {
      let sendData = {
        userId: this.$store.state.user.userId
      }
      this.$axios({
        url: phpURL + '/declareProject/OutreachConfig/editConfig',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.isEdit = false
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //
    back () {
      const title = '提示'
      const content = '<p>记得保存后再返回哦~</p>'
      this.$Modal.confirm({
        title: title,
        content: content,
        okText: '去保存',
        cancelText: '返回',
        onCancel: () => {
          this.cancel()
        }
      })
    },
    // 取消
    cancel () {
      let sendData = {
        userId: this.$store.state.user.userId
      }
      this.$axios({
        url: phpURL + '/declareProject/OutreachConfig/cancelConfig',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.getData()
            this.isEdit = true
            this.showModule = false
            this.showTwoSet = false
            this.showFourSet = false
            this.showLastSet = false
            this.$nextTick(() => {
              this.showModule = true
            })
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 保存
    saveAll () {
      this.loading = true
      let sendData = {
        userId: this.$store.state.user.userId
      }
      this.$axios({
        url: phpURL + '/declareProject/OutreachConfig/saveConfig',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            this.isEdit = true
            this.showModule = false
            this.showTwoSet = false
            this.showFourSet = false
            this.showLastSet = false
            this.loading = false
            this.$nextTick(() => {
              this.showModule = true
            })
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
<style scoped>
.btn {
    position: fixed;
    bottom: 5%;
    left: 48%;
    background: white;
    z-index: 10;
}
</style>
