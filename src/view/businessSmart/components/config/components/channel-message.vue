<template>
    <!-- 渠道信息/来源配置/开票属性 -->
    <div>
        <SonSet
            style="float:left"
            @nextSet="gonextConfig"
            ref="parentConfig"
            v-bind="$attrs"
            :channelParentSubConfigs="channelParentSubConfigs"
            v-if="showFirst"
            @changeSwith="handleParentSwith"
        ></SonSet>
        <lastSonSet
            style="float:left"
            v-if="showLast"
            ref="sonConfig"
            :lastSetData="lastSubConfigs"
            v-bind="$attrs"
            @addConfig="addConfigs"
            @deleteConfig="deleteConfigs"
            @changeSwith="handleSwith"
            @editConfig="editConfigs"
        ></lastSonSet>
    </div>
</template>

<script>
import { biUrl } from '@/api/base.js'
import SonSet from './sonSet'
import lastSonSet from './last-son-set'
export default {
  name: 'channelMessage',
  components: {
    SonSet,
    lastSonSet
  },
  props: {},
  data () {
    return {
      channelParentSubConfigs: {}, // 一级数据
      lastSubConfigs: {}, // 二级数据
      channelSubConfigs: [],
      showLast: false, // 显示最后一个
      sonSetData1: {},
      sonSetData2: {},
      currentId: this.$attrs.moduleL.currentId,
      showFirst: false,
      parentData: {} // 选中的父级的值
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
      this.showLast = false // 初始化
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
            this.channelParentSubConfigs = res.data.data
            this.showFirst = true
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 显示下一级
    gonextConfig (item, stauts) {
      this.parentData = item
      if (stauts) {
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
              this.lastSubConfigs = res.data.data
              this.showLast = true
            } else if (res.data.code === 60001) {
              this.$Message.error(res.data.message)
            }
          })
          .catch(err => {
            console.log(err)
            this.$Message.error(res.data.message)
          })
      } else {
        this.showLast = false
      }
    },
    // 一级开关
    handleParentSwith (v) {
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
            this.showLast = false
            // this.gonextConfig(this.parentData, true)
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
    // 二级开关
    handleSwith (v) {
      let sendData = {
        userId: this.$store.state.user.userId,
        tagId: v.tagId,
        fieldType: this.parentData.fieldType,
        status: v.status,
        tagName: v.tagName,
        backlogId: this.$route.query.id || -1,
        parentTagId: this.parentData.tagId
      }
      this.$axios({
        url: biUrl + '/busiConfig/updateConfig',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            this.gonextConfig(this.parentData, true)
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
    // 新增
    addConfigs (v) {
      let sendData = {
        userId: this.$store.state.user.userId,
        tagName: v,
        fieldType: this.parentData.fieldType,
        parentTagId: this.parentData.tagId,
        backlogId: this.$route.query.id || -1
      }
      this.$axios({
        url: biUrl + '/busiConfig/addConfig',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            this.gonextConfig(this.parentData, true)
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
    // 编辑
    editConfigs (v) {
      let sendData = {
        userId: this.$store.state.user.userId,
        tagId: v.tagId,
        fieldType: this.parentData.fieldType,
        tagName: v.tagName,
        status: v.status,
        backlogId: this.$route.query.id || -1,
        parentTagId: this.parentData.tagId
      }
      this.$axios({
        url: biUrl + '/busiConfig/updateConfig',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            this.gonextConfig(this.parentData, true)
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
    // 删除
    deleteConfigs (v) {
      let sendData = {
        userId: this.$store.state.user.userId,
        tagId: v.tagId,
        fieldType: this.parentData.fieldType,
        backlogId: this.$route.query.id || -1
      }
      this.$Modal.confirm({
        title: '提示',
        content: `是否对“${v.tagName}”进行删除`,
        onOk: () => {
          this.$axios({
            url: biUrl + '/busiConfig/deleteConfig',
            method: 'post',
            data: $qs.stringify(sendData)
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.$Message.success(res.data.msg)
                this.gonextConfig(this.parentData, true)
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
        }
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
