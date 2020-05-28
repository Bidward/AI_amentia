<template>
    <!-- 客户等级/未合作原因/流失反馈 -->
    <div>
        <lastSonSet
            :lastSetData="clientSubConfigs"
            style="float:left"
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
import lastSonSet from './last-son-set'
export default {
  name: 'clientLevel',
  components: {
    lastSonSet
  },
  props: {},
  data () {
    return {
      clientSubConfigs: {}
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
        tagName: this.$attrs.moduleL.currentTagName
      }
      this.$axios({
        url: biUrl + '/busiConfig/listSubConfig',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.clientSubConfigs = res.data.data
          } else {
            this.$Message.error(res.data.msg)
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
        fieldType: this.$attrs.moduleL.currentFieldType,
        parentTagId: this.$attrs.moduleL.currentTagId,
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
            this.getData()
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
        fieldType: this.$attrs.moduleL.currentFieldType,
        tagName: v.tagName,
        status: v.status,
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
            this.getData()
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
        fieldType: this.$attrs.moduleL.currentFieldType,
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
                this.getData()
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
    // 开关
    handleSwith (v) {
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
            this.getData()
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
