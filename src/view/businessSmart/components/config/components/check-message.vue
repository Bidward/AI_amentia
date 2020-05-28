<template>
    <!--信息核对 -->
    <div>
        <sonCheck
            :channelParentSubConfigs="productOneLevel"
            style="float:left"
            @nextSet="showTwoConfig"
            v-bind="$attrs"
            reminder="模块"
            @changeSwith="handleOneSwith"
        ></sonCheck>
        <sonCheck
            :channelParentSubConfigs="productTwoLevel"
            style="float:left"
            @nextSet="showThreeConfig"
            v-show="showTwoSet"
            v-bind="$attrs"
            reminder="操作"
            @changeSwith="handleTwoSwith"
        ></sonCheck>
        <sonCheck
            :channelParentSubConfigs="productThreeLevel"
            style="float:left"
            @nextSet="showFourConfig"
            v-show="showThreeSet"
            v-bind="$attrs"
            reminder="字段"
            @changeSwith="handleThreeSwith"
        ></sonCheck>
        <checkDepSet
            :channelParentSubConfigs="productFourLevel"
            style="float:left"
            @nextSet="showLastConfig"
            v-show="showFourSet"
            v-bind="$attrs"
            reminder="部门"
            @changeSwith="handleFourSwith"
        ></checkDepSet>
        <lastSonSet2
            :lastSetData="productLastLevel"
            style="float:left"
            v-show="showLastSet"
            v-bind="$attrs"
            reminder="职位"
            @changeSwith="handlePositionSwith"
        ></lastSonSet2>
    </div>
</template>
<script>
import { biUrl } from '@/api/base.js'
import sonCheck from './son-check'
import checkDepSet from './check-dep-set'
import lastSonSet2 from './last-son-set2'
export default {
  name: 'checkMessage',
  components: {
    sonCheck,
    lastSonSet2,
    checkDepSet
  },
  props: {},
  data () {
    return {
      showTwoSet: false,
      showThreeSet: false,
      showLastSet: false,
      showFourSet: false,
      handleStatu: false, // 操作状态传给子组件隐藏开关
      all: true,
      productOneLevel: {}, // 产品一级标签c
      productTwoLevel: {}, // 产品二级标签
      productThreeLevel: {}, // 产品三级标签
      productFourLevel: {}, // 产品四级标签
      productLastLevel: {}, // 产品末级标签
      selectData: {},
      module: {}, // 点击模块的数据
      operation: {}, // 点击操作的数据
      fieldData: {}, // 点击字段的数据，存下传给后端
      department: {} // 点击的部门
    }
  },
  computed: {
    currentIds () {
      return this.$attrs.moduleL.currentId
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
  methods: {
    // 获取数据
    getData () {
      let sendData = {
        userId: this.$store.state.user.userId,
        id: this.$attrs.moduleL.currentId,
        fieldType: this.$attrs.moduleL.currentFieldType,
        tagId: this.$attrs.moduleL.currentTagId,
        tagName: this.$attrs.moduleL.currentTagName,
        backlogId: this.$route.query.id || -1
      }
      this.$axios({
        url: biUrl + '/busiConfig/listSubConfig',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.productOneLevel = res.data.data
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
          tagName: item.tagName,
          backlogId: this.$route.query.id || -1
        }
        this.$axios({
          url: biUrl + '/busiConfig/listSubConfig',
          method: 'post',
          data: $qs.stringify(sendData)
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.showTwoSet = true
              this.productTwoLevel = res.data.data
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
    // 获取字段/部门
    showThreeConfig (item, status) {
      this.showThreeSet = false
      this.showFourSet = false
      this.showLastSet = false
      if (status) {
        // 获取部门
        if (item.fieldType === 3) {
          this.fieldData = item // 选择的字段
          let sendData = {
            userId: this.$store.state.user.userId,
            fieldType: item.fieldType,
            tagId: item.tagId,
            tagName: item.tagName,
            backlogId: this.$route.query.id || -1
          }
          this.$axios({
            url: biUrl + '/busiConfig/listDept',
            method: 'post',
            data: $qs.stringify(sendData)
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.showFourSet = true
                this.productFourLevel = res.data.data
              } else {
                this.showFourSet = false
                this.$Message.error(res.data.message)
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          this.operation = item // 选择的操作
          let sendData = {
            userId: this.$store.state.user.userId,
            id: item.id,
            fieldType: item.fieldType,
            tagId: item.tagId,
            tagName: item.tagName,
            backlogId: this.$route.query.id || -1
          }
          this.$axios({
            url: biUrl + '/busiConfig/listSubConfig',
            method: 'post',
            data: $qs.stringify(sendData)
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.showThreeSet = true
                this.productThreeLevel = res.data.data
              } else {
                this.$Message.error(res.data.message)
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      } else {
        this.showThreeSet = false
        this.showFourSet = false
        this.showLastSet = false
      }
    },
    // 获取部门的
    showFourConfig (item, status) {
      this.fieldData = item // 选择的字段
      // this.selectData = item
      this.showLastSet = false
      if (status) {
        let sendData = {
          userId: this.$store.state.user.userId,
          fieldType: item.fieldType,
          tagId: item.tagId,
          tagName: item.tagName,
          backlogId: this.$route.query.id || -1
        }
        this.$axios({
          url: biUrl + '/busiConfig/listDept',
          method: 'post',
          data: $qs.stringify(sendData)
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.showFourSet = true
              this.productFourLevel = res.data.data
            } else {
              this.showFourSet = false
              this.$Message.error(res.data.message)
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
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
          backlogId: this.$route.query.id || -1,
          fieldId: item.fieldId
        }
        this.$axios({
          url: biUrl + '/busiConfig/listPosition',
          method: 'post',
          data: $qs.stringify(sendData)
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.showLastSet = true
              this.productLastLevel = res.data.data
            } else {
              this.$Message.error(res.data.message)
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
        backlogId: this.$route.query.id || -1,
        parentTagId: this.$attrs.moduleL.currentTagId
      }
      this.$axios({
        url: biUrl + '/busiConfig/updateConfig',
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
        backlogId: this.$route.query.id || -1,
        parentTagId: this.module.tagId
      }
      this.$axios({
        url: biUrl + '/busiConfig/updateConfig',
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
        backlogId: this.$route.query.id || -1,
        parentTagId: this.operation.tagId
      }
      this.$axios({
        url: biUrl + '/busiConfig/updateConfig',
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
        fieldType: this.fieldData.fieldType,
        status: v.status,
        tagName: v.name,
        backlogId: this.$route.query.id || -1,
        parentTagId: this.fieldData.tagId,
        fieldId: v.fieldId,
        moduleId: v.moduleId,
        operationId: v.operationId
      }
      this.$axios({
        url: biUrl + '/busiConfig/updateConfig',
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
        tagId: v.id,
        fieldType: this.department.fieldType,
        status: v.status,
        tagName: v.name,
        backlogId: this.$route.query.id || -1,
        fieldId: v.fieldId,
        moduleId: v.moduleId,
        operationId: v.operationId,
        parentTagId: this.department.id
      }
      this.$axios({
        url: biUrl + '/busiConfig/updateConfig',
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
    }
  }
}
</script>
