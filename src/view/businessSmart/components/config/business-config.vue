<template>
    <!-- 业务配置 -->
    <div class="viewWrapper" style="padding:20px;">
        <div class="main">
            <Card
                style="width:320px;cursor:pointer;margin-bottom:10px"
                v-for="(item,index) in setList"
                :key="index"
                @click.native="changeConfig(item)"
                :class="moduleL.currentId === item.id ? 'active':''"
            >
                <div style="text-align:center">
                    <h3>{{item.tagName}}</h3>
                </div>
            </Card>
        </div>
        <div style="float:left;margin-bottom: 5%;">
            <!-- 渠道信息/来源配置/开票属性 -->
            <channelMessage
                :moduleL="moduleL"
                v-if="this.moduleL.currentId===1||this.moduleL.currentId===2||this.moduleL.currentId===7"
                ref="channelInfo"
            ></channelMessage>
            <!-- 客户等级 -->
            <clientLevel
                :moduleL="moduleL"
                v-if="this.moduleL.currentId===3||this.moduleL.currentId===8||this.moduleL.currentId===9"
                ref="client"
            ></clientLevel>
            <!-- 标签设置 -->
            <tagConfig v-if="this.moduleL.currentId===4" :moduleL="moduleL" ref="tagConfig"></tagConfig>
            <!-- 产品标签 -->
            <productTag v-if="this.moduleL.currentId===5" :moduleL="moduleL"></productTag>
            <!-- 渠道标签 -->
            <channelTag v-if="this.moduleL.currentId===6" :moduleL="moduleL"></channelTag>
            <!-- 信息核对 -->
            <checkMessage v-if="this.moduleL.currentId===10" :moduleL="moduleL"></checkMessage>
        </div>
        <div style="text-align: center;clear: both;" class="btn">
            <Card>
                <span v-if="moduleL.isEdit">
                    <Button type="primary" @click="editConfig">编辑</Button>
                </span>
                <span v-else>
                    <Button @click="cancel">取消</Button>
                    <Button type="primary" @click="saveAll">保存</Button>
                </span>
            </Card>
        </div>
        <div style="clear:both"></div>
        <OpLogs :task-logs="channelLog" @click.native="getLog"></OpLogs>
    </div>
</template>
<script>
import OpLogs from './../op-log' // 日志
import channelMessage from './components/channel-message'
import clientLevel from './components/client-level'
import SonSet from './components/sonSet'
import tagConfig from './components/tag-config'
import checkMessage from './components/check-message'
import productTag from './components/product-tag'
import channelTag from './components/channel-tag'
import { biUrl } from '@/api/base.js'
export default {
  name: 'businessSet',
  components: {
    SonSet,
    checkMessage,
    channelMessage, // 渠道信息
    clientLevel, // 客户等级
    tagConfig, // 标签配置
    productTag, // 产品标签
    channelTag, // 渠道标签
    OpLogs
  },
  data () {
    return {
      // isEdit: true, // 编辑
      moduleL: {
        currentFieldType: 0, // 模块类型
        currentTagId: '001', // tagid
        currentTagName: '渠道信息',
        currentId: 1, // 数据的id
        isEdit: true // 是不是编辑
      },
      setList: [],
      saveData: [],
      channelLog: [] // 日志
    }
  },
  mounted () {
    this.getData()
  },
  destroyed () {
    this.cancel()
  },
  methods: {
    // 编辑
    editConfig () {
      let sendData = {
        userId: this.$store.state.user.userId,
        backLogId: this.$route.query.id || -1
      }
      this.$axios({
        url: biUrl + '/busiConfig/editConfig',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.moduleL.isEdit = false
          } else {
            this.$Message.error(res.data.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 取消
    cancel () {
      let sendData = {
        userId: this.$store.state.user.userId
      }
      this.$axios({
        url: biUrl + '/busiConfig/cancelConfig',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.moduleL.isEdit = true
            this.moduleL.currentId = 1
            this.$refs.channelInfo.getData()
            // console.log()
          } else {
            this.$Message.error(res.data.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 保存
    saveAll () {
      let sendData = {
        userId: this.$store.state.user.userId,
        router: 'business/businessSet',
        backLogId: this.$route.query.id || -1
      }
      this.$axios({
        url: biUrl + '/busiConfig/saveConfig',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.setList = res.data.data
            this.moduleL.isEdit = true
            this.moduleL.currentId = 1
            this.$refs.channelInfo.getData()
            // location.reload()
            this.getData()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取左侧列表
    getData () {
      this.$axios({
        url: biUrl + '/busiConfig/init',
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.setList = res.data.data
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 切换选项(父)
    changeConfig (item) {
      this.moduleL.currentTagName = item.tagName
      this.moduleL.currentTagId = item.tagId
      this.moduleL.currentFieldType = item.fieldType
      this.moduleL.currentId = item.id
    },
    // 日志3
    getLog () {
      console.log(1)
    }
  }
}
</script>
<style scoped>
.main {
    float: left;
    padding: 0 20px;
    border-right: 1px solid #dcdee2;
    margin-right: 20px;
}
.active {
    background: #19aa8d;
    color: white;
    border-color: #19aa8d;
}
.btn {
    position: fixed;
    bottom: 5%;
    left: 48%;
    background: white;
    z-index: 10;
}
</style>
