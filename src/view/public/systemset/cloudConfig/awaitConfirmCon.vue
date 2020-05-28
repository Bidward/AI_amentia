<template>
  <div class="cloudCooper">
    <Tabs value="3" tab="outTable"  :animated="false" @on-click="openComponent" >
        <TabPane label="业务配置" name="1"></TabPane>
        <TabPane label="标签关联管理" name="2"  ></TabPane>
        <TabPane label="待确认事项" name="3" ></TabPane>
    </Tabs>
    <Table border  :columns="waitConfirmHeader" :data="waitConfirmContent" class="waitConfirmTable">
      <template slot-scope="{ row, index }" slot="action">
        <Button v-if="row.update" type="primary" size="small" class="space" @click="editLabelManage(row)" style="margin-right:10px">编辑</Button>
        <Button v-if="row.revocation" class="simple" size="small" @click="revocation(row)">撤销</Button>
      </template>
    </Table>
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
export default {
  name: 'awaitConfirmCon',
  data () {
    return {
      waitConfirmHeader: [
        {
          title: '序号', key: 'key', align: 'center'
        }, {
          title: '模块', key: 'moduleName', align: 'center'
        }, {
          title: '发起人', key: 'oneEntryName', align: 'center'
        }, {
          title: '通知人', key: 'twoEntryName', align: 'center'
        }, {
          title: '状态', key: 'statusName', align: 'center'
        }, {
          title: '操作', key: 'operation', align: 'center', slot: 'action'
        }
      ], // 表头
      waitConfirmContent: [], // 表格内容
      username: ''// 当前用户名
    }
  },
  mounted () {
    this.getConfirmLabelManagement()
    this.getUsername()
  },
  methods: {
    // 获取当前用户名
    getUsername () {
      this.$axios({
        url: baseUrl + '/login/getuser',
        method: 'get'
      }).then(res => {
        if (res.data.code === 200) {
          this.username = res.data.nickname
        }
      })
    },
    // 获取待确认列表数据
    getConfirmLabelManagement () {
      this.$axios({
        url: baseUrl + '/Business/toConfirmLabelManagement',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.waitConfirmContent = res.data.content
          for (let i in this.waitConfirmContent) {
            this.waitConfirmContent[i].key = Number(i) + 1
          }
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    editLabelManage (row) {
      if (this.username === row.oneEntryName) {
        this.$router.push({
          name: 'editLabelManage',
          params: {
            tbcId: row.tbcId,
            type: 'isOneEntryEdit',
            activeNameEdit: row.twoLabel,
            openNameEdit: [row.oneLabel]
          }
        })
      } else if (this.username === row.twoEntryName) {
        this.$router.push({
          name: 'twoEditLabelManage',
          params: {
            tbcId: row.tbcId,
            type: 'isTwoEntry',
            activeNameEdit: row.twoLabel,
            openNameEdit: [row.oneLabel],
            twoEntryName: row.twoEntryName
          }
        })
      }
    },
    revocation (row) {
      let sendData = {
        tbcId: row.tbcId
      }
      this.$axios({
        url: baseUrl + '/Business/delete',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.$Message.info(res.data.msg)
          this.getConfirmLabelManagement()
        }
      })
    },
    openComponent (name) {
      switch (name) {
        case '1':
          this.$router.push({
            name: 'cloudConfig'
          })
          break
        case '2':
          this.$router.push({
            name: 'labelManage'
          })
          break
        case '3':
          this.$router.push({
            name: 'waitConfirmCon'
          })
          break
      }
    }
  }
}
</script>
