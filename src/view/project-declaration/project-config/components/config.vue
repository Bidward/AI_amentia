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
                    <h3>{{item.name}}</h3>
                </div>
            </Card>
        </div>
        <div style="float:left;margin-bottom: 5%;">
            <!-- 信息核对 -->
            <checkMessage v-if="this.moduleL.currentId==='1'" :moduleL="moduleL"></checkMessage>
        </div>
        <div style="clear:both"></div>
        <OpLogs :task-logs="Log" @click.native="getLog"></OpLogs>
    </div>
</template>
<script>
import { phpURL } from '@/api/base.js'
import OpLogs from '../../op-log'
import checkMessage from './check-message'
export default {
  name: 'projectSet',
  components: {
    checkMessage,
    OpLogs
  },
  data () {
    return {
      moduleL: {
        currentFieldType: 0, // 模块类型
        currentTagId: '001', // tagid
        currentTagName: '信息核对',
        currentId: '' // 数据的id
      },
      setList: [],
      Log: [] // 日志
    }
  },
  mounted () {
    this.getDatas()
  },
  methods: {
    // 获取左侧列表
    getDatas () {
      this.$axios({
        url: phpURL + '/declareProject/OutreachConfig/init',
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.setList = res.data.content
            this.moduleL.currentId = '1'
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
      this.moduleL.currentTagName = item.name
      this.moduleL.currentTagId = item.tagId
      this.moduleL.currentFieldType = item.fieldType
      this.moduleL.currentId = item.id
    },
    // 日志3
    getLog () {
      this.$axios({
        url: phpURL + '/declareProject/OutreachConfig/getOutreachLog',
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.Log = res.data.content
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
