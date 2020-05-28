<template>
  <div>
    <div class="level-three clearfix">
      <!-- <Button type="primary" class="btns" @click="addAccount()">新增</Button> -->
      <Button type="primary" class="btns" v-if="permission.create" @click="addAccount()">新增</Button>
      <Button class="searchbar" icon="ios-loading" @click="reload()" />
      <Input
        @on-search="detailSearch()"
        placeholder="账户名称"
        search
        clearable
        v-model="detailHeader.text"
        class="searchbar"
        style="width:200px;margin-right:5px;"
      />
    </div>
    <Table :columns="tableHeader" border :data="tableContent">
      <template slot-scope="{ row, index }" slot="edit">
        <Button class="btns" type="primary" v-if="permission.update" @click="editAccount(row)">编辑</Button>
        <Button class="btns" type="error" v-if="permission.delete" @click="deleteAccount(row)">刪除</Button>
      </template>
    </Table>
    <AccountEdit
      @on-success="detailSearch"
      v-if="showEdit"
      :showEdit.sync="showEdit"
      :accountId="accountId"
    />
  </div>
</template>

<script>
import { semPermissionMixin } from '../../tools'
import { semUrl } from '@/api/base.js'
import AccountEdit from './account-edit'
import { Track } from '@/libs/track.js'
const track = new Track('营销/基础信息/账户管理')

export default {
  name: 'SemAccountList',
  mixins: [semPermissionMixin],
  components: {
    AccountEdit
  },
  data () {
    return {
      tableHeader: [
        {
          type: 'index',
          title: '序号',
          align: 'center',
          width: 100
        },
        {
          key: 'accountName',
          title: '账户名称',
          minWidth: 100,
          align: 'center'
        },
        {
          key: 'siteGroup',
          title: '对应站群',
          minWidth: 100,
          align: 'center'
        },
        {
          key: 'accountRatio',
          title: '账户返点',
          minWidth: 100,
          align: 'center'
        },
        {
          key: 'domain',
          title: '账户域名',
          minWidth: 100,
          align: 'center'
        },
        {
          key: 'useType',
          title: '使用类型',
          minWidth: 100,
          align: 'center',
          render: (h, { row }) => {
            return <span>{this.getUseTypeName(row.useType)}</span>
          }
        },
        {
          key: 'status',
          title: '状态',
          minWidth: 100,
          align: 'center'
        },
        {
          key: 'sum',
          title: '备注',
          minWidth: 100,
          align: 'center'
        },
        {
          key: 'edit',
          slot: 'edit',
          title: '编辑',
          align: 'center',
          width: 140
        }
      ],
      showEdit: false,
      tableContent: [],
      detailHeader: {
        text: ''
      },
      accountId: -1
    }
  },
  beforeCreate () {
    track.start()
  },
  mounted () {
    this.detailSearch()
  },
  methods: {
    addAccount () {
      this.accountId = -1
      this.showEdit = true
    },
    editAccount ({ accountId }) {
      this.accountId = accountId
      this.showEdit = true
    },
    reload () {
      this.detailHeader.text = ''
      this.detailSearch()
    },
    // 根据使用类型，返回是自用还是外放账户
    getUseTypeName (useType) {
      return useType === '1' ? '自用' : '外放'
    },
    detailSearch () {
      this.$axios({
        url: semUrl + '/account/index',
        method: 'post',
        data: $qs.stringify(this.detailHeader)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.tableContent = res.data.content.pageContent
            this.$nextTick(() => {
              track.end()
            })
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    deleteAccount ({ accountId, accountName }) {
      this.$Modal.confirm({
        title: '提示',
        content: `是否删除${accountName}`,
        onOk: () => {
          this.$axios({
            url: semUrl + '/Account/delAccount ',
            method: 'post',
            data: $qs.stringify({ accountId })
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.detailSearch()
                this.$Message.success(res.data.msg)
              } else {
                this.$Message.error(res.data.msg)
              }
            })
            .catch(err => {
              console.error(err)
            })
        }
      })
    }
  }
}
</script>

<style>
</style>
