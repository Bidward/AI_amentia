<template>
    <!--产品标签 -->
    <div>
        <sonCheck
            :channelParentSubConfigs="productOneLevel"
            style="float:left"
            @nextSet="showTwoConfig"
            :handleStatu="handleStatu"
            v-bind="$attrs"
        ></sonCheck>
        <sonCheck
            :channelParentSubConfigs="productTwoLevel"
            style="float:left"
            @nextSet="showThreeConfig"
            v-if="showTwoSet"
            :handleStatu="handleStatu"
            v-bind="$attrs"
        ></sonCheck>
        <sonCheck
            :channelParentSubConfigs="productThreeLevel"
            style="float:left"
            @nextSet="showFourConfig"
            v-if="showThreeSet"
            :handleStatu="handleStatu"
            v-bind="$attrs"
        ></sonCheck>
        <sonCheck
            :channelParentSubConfigs="productFourLevel"
            style="float:left"
            @nextSet="showLastConfig"
            v-if="showFourSet"
            :handleStatu="handleStatu"
            v-bind="$attrs"
        ></sonCheck>
        <lastSonSet2
            :lastSetData="productLastLevel"
            style="float:left"
            v-if="showLastSet"
            v-bind="$attrs"
            @changeSwith="handleSwith"
        ></lastSonSet2>
    </div>
</template>
<script>
import { biUrl } from '@/api/base.js'
import sonCheck from './son-check'
import lastSonSet2 from './last-son-set2'
export default {
  name: 'productTag',
  components: {
    sonCheck,
    lastSonSet2
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
      parentData: {}
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
          } else if (res.data.code === 60001) {
            this.$Message.error(res.data.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取二级配置
    showTwoConfig (item, status) {
      this.showLastSet = false
      if (status) {
        // fieldType=1代表全部
        if (item.fieldType === 1) {
          this.showTwoSet = false
          this.parentData = item
          let sendData = {
            userId: this.$store.state.user.userId,
            id: item.id,
            fieldType: item.fieldType,
            tagId: item.tagId,
            tagName: item.tagName,
            backlogId: this.$route.query.id || -1
          }
          this.$axios({
            url: biUrl + '/busiConfig/listProduct',
            method: 'post',
            data: $qs.stringify(sendData)
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.showLastSet = true
                this.productLastLevel = res.data.data
              } else if (res.data.code === 60001) {
                this.$Message.error(res.data.message)
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          this.parentData = item
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
              } else if (res.data.code === 60001) {
                this.$Message.error(res.data.message)
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      } else {
        this.showTwoSet = false
        this.showThreeSet = false
        this.showFourSet = false
        this.showLastSet = false
      }
    },
    // 获取三级配置
    showThreeConfig (item, status) {
      if (status) {
        if (item.fieldType === 1) {
          // this.showTwoSet = false;
          this.parentData = item
          let sendData = {
            userId: this.$store.state.user.userId,
            id: item.id,
            fieldType: item.fieldType,
            tagId: item.tagId,
            tagName: item.tagName,
            backlogId: this.$route.query.id || -1
          }
          this.$axios({
            url: biUrl + '/busiConfig/listProduct',
            method: 'post',
            data: $qs.stringify(sendData)
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.showLastSet = true
                this.productLastLevel = res.data.data
              } else if (res.data.code === 60001) {
                this.$Message.error(res.data.message)
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          this.parentData = item
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
              } else if (res.data.code === 60001) {
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
    // 获取四级的
    showFourConfig (item, status) {
      this.parentData = item
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
              this.showFourSet = true
              this.productFourLevel = res.data.data
            } else if (res.data.code === 60001) {
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
    // 获取最后的
    showLastConfig (item, status) {
      this.parentData = item
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
              this.showLastSet = true
              this.productLastLevel = res.data.data
            } else if (res.data.code === 60001) {
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
    // 开关
    handleSwith (v) {
      let sendData = {
        userId: this.$store.state.user.userId,
        tagId: v.id,
        fieldType: this.parentData.fieldType,
        status: v.status,
        tagName: v.name,
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
            // this.showLastConfig( this.parentData, true)
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
