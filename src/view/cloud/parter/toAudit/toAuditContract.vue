<template>
  <!-- 待审核合同 -->
  <div>
    <div class="level-three">
      <div class="searchbar">
        <Input
          placeholder="公司名称"
          search
          v-model="headerSearch.text"
          @on-search="getListData()"
        />
        <Button icon="ios-loading" @click="reloadPage"></Button>
      </div>
    </div>
    <div style="clear:both"></div>
    <Table border :columns="toContractHeader" :data="toContractContent" :loading="loading">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button
          type="primary"
          size="small"
          style="margin-right: 5px"
          @click="audit(row)"
          v-if="row.isApproval"
        >审批</Button>
        <Button
          type="error"
          size="small"
          style="margin-right: 5px"
          @click="remove(row)"
          v-if="row.isDelete"
        >删除</Button>
        <Button  type="primary" class="marginRight3px" size="small" @click="detail(row)" v-if="row.isDetails">详情</Button>
        <Button class="simple" size="small" @click="revocation(row)" v-if="row.isRevoke">撤销</Button>
      </template>
    </Table>
    <div class="tableFooter">
      <Page
        :total="headerSearch.totalCount"
        :page-size="headerSearch.pageSize"
        :current="headerSearch.currPage"
        size="small"
        show-total
        show-sizer
        show-elevator
        @on-change="(currPage)=>{headerSearch.currPage=currPage;getListData()}"
        @on-page-size-change="(pageSize)=>{headerSearch.pageSize=pageSize;getListData()}"
      />
    </div>
  </div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
export default {
  name: 'toAuditContract',
  data () {
    return {
      loading: true,
      headerSearch: {
        text: '', // 全局搜索公司
        myCompanyName: '', // 我方公司
        totalCount: 0,
        pageSize: 20,
        currPage: 1
      },
      toContractHeader: [
        {
          title: '序号',
          type: 'index',
          width: 70,
          align: 'center'
        },
        {
          title: '合同类型',
          key: 'contractTypeName',
          align: 'center'
        },
        {
          title: '申请时间',
          key: 'contractData',
          align: 'center',
          width: 100
        },
        {
          title: '我方公司',
          key: 'myCompanyName',
          align: 'center'
        },
        {
          title: '对方公司名称/姓名',
          key: 'otherCompanyName',
          align: 'center',
          width: 150
        },
        {
          title: '签订人',
          key: 'signerName',
          align: 'center'
        },
        {
          title: '合同状态',
          key: 'approvalStatusName',
          align: 'center',
          width: 100
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      toContractContent: [] // 待审核表内容
    }
  },
  mounted () {
    this.getListData()
  },
  methods: {
    getListData () {
      // 列表数据
      let { text, pageSize, currPage } = this.headerSearch
      let sendData = {}
      // 如果有模糊搜索，清空表头内容
      if (text) {
        sendData.text = text
        this.clearSearchHeader(text)
      }
      sendData.pageSize = pageSize
      sendData.currPage = currPage
      sendData.id = this.$route.query.backlogId
      this.$axios({
        url: baseUrl + '/contract/tab',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.toContractContent = res.data.content.pageContent
          }
          // 查无数据
          if (res.data.code === 10001) {
            this.loading = false
            let _self = this.headerSearch
            this.toContractContent = []
            _self.totalCount = 0
            _self.pageSize = 20
            _self.currPage = 1
          } else if (res.data.code === 10000) {
            let _self = this.headerSearch
            this.toContractContent = res.data.content.pageContent
            _self.totalCount = res.data.content.totalCount
            _self.pageSize = res.data.content.pageSize
            _self.currPage = res.data.content.currPage
            this.loading = false
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    clearSearchHeader (text) {
      this.headerSearch = {
        myCompanyName: '', // 我方公司
        text: text
      }
    },
    reloadPage () {
      this.clearSearchHeader()
      this.getListData()
    },
    // 审批
    audit (row) {
      if (row.contractType === 1) {
        // 如果是收款
        this.$router.push({
          name: 'contractApprove',
          query: {
            id: row.id
          }
        })
      } else if (row.contractType === 2) {
        // 如果是付款
        this.$router.push({
          name: 'payContractApprove',
          query: {
            id: row.id
          }
        })
      }
    },
    // 详情
    detail (row) {
      if (row.contractType === 1) {
        // 如果是收款
        this.$router.push({
          name: 'toAuditDetail',
          query: {
            id: row.id
          }
        })
      } else if (row.contractType === 2) {
        // 如果是付款
        this.$router.push({
          name: 'payToAuditDetail',
          query: {
            id: row.id
          }
        })
      }
    },
    // 删除
    remove (row) {
      this.$Modal.confirm({
        title: '提示',
        content: `是否确认删除该信息？`,
        onOk: () => {
          this.$axios({
            url: baseUrl + '/contract/deleteApproval',
            data: $qs.stringify({ id: row.id }),
            method: 'post'
          }).then(res => {
            if (res.data.code === 10000) {
              this.getListData()
              this.loading = true
              this.$Message.success(res.data.msg)
            }
          })
        }
      })
    },
    // 撤销
    revocation (row) {
      this.$Modal.confirm({
        title: '提示',
        content: `是否确认撤销申请?`,
        onOk: () => {
          this.$axios({
            url: baseUrl + '/contract/undo',
            data: $qs.stringify({ id: row.id }),
            method: 'post'
          }).then(res => {
            if (res.data.code === 10000) {
              this.getListData()
              this.$Message.success(res.data.msg)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less">

</style>
