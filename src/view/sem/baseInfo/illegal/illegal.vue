<template>
  <div>
    <div class="level-three clearfix">
      <Button type="primary" class="btns" v-if="permission.create" @click="addModel()">新增</Button>
      <!-- <Button class="btns">导入</Button> -->
      <div class="searchbar">
        <Input
          @on-search="()=>{detailHeader.currPage=1;detailSearch()}"
          placeholder="黑名单词、备注"
          search
          clearable
          v-model="detailHeader.text"
          class=""
          style="width:200px;margin-right:5px;"
        />
        <Button class="" icon="ios-loading" @click="reload()"></Button>
      </div>
    </div>
    <Table :columns="tableHeader" border :data="tableContent" >
      <template slot-scope="{ row, index }" slot="edit">
        <Button class="btns" type="primary" v-if="permission.update" @click="editIllegal(row,index)">编辑</Button>
        <Button class="btns" type="error" v-if="permission.delete" @click="deleteIllegal(row)">刪除</Button>
        <Button class="btns" @click="showIllegal(row)">详情</Button>
      </template>
    </Table>
    <div class="tableFooter clearfix">
      <Page
        :total="detailHeader.totalCount"
        :page-size="detailHeader.pageSize"
        :current="detailHeader.currPage"
        size="small"
        show-total
        show-sizer
        show-elevator
        @on-change="(currPage)=>{detailHeader.currPage=currPage;detailSearch()}"
        @on-page-size-change="(pageSize)=>{detailHeader.pageSize=pageSize;detailSearch()}"
        style="float:right;"
      />
    </div>
    <editIllegal
      v-if="showModel"
      :config="config"
      :show.sync="showModel"
      :propData="propData"
      @updataList="detailSearch"
    />
  </div>
</template>
<script>
import editIllegal from './editIllegal.vue'
import { semUrl } from '@/api/base.js'
import { semPermissionMixin } from '../../tools'
import { Track } from '@/libs/track.js'
const track = new Track('营销/基础信息/黑名单词库')
export default {
  name: 'illegal',
  components: {
    editIllegal
  },
  mixins: [semPermissionMixin],
  data () {
    return {
      config: {
        title: '新增'
      },
      propData: {},
      showModel: false,
      detailHeader: {
        currPage: 1,
        pageSize: 20,
        totalCount: 0,
        title: '', // 黑名单词
        type: '', // 类型
        keywordReason: '', // 原因
        sum: '', // 备注
        text: ''
      },
      tableHeader: [
        { title: '序号', type: 'index', align: 'center' },
        {
          title: '黑名单词',
          key: 'title',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <div>
                      <Input
                        v-model={this.detailHeader.title}
                        search
                        clearable
                        v-on: on-search={value => {
                          this.detailSearch({ title: value, currPage: 1 })
                        }}
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" class={this.detailHeader.title ? 'on' : ''} />
                  </span>
                </Poptip>
              </span >
            )
          }
        },
        {
          title: '类别',
          key: 'type',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <div>
                      <Input
                        v-model={this.detailHeader.type}
                        search
                        clearable
                        v-on: on-search={value => {
                          this.detailSearch({ type: value, currPage: 1 })
                        }}
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" class={this.detailHeader.type ? 'on' : ''} />
                  </span>
                </Poptip>
              </span >
            )
          }
        },
        {
          title: '原因',
          key: 'keywordReason',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <div>
                      <Input
                        v-model={this.detailHeader.keywordReason}
                        search
                        clearable
                        v-on: on-search={value => {
                          this.detailSearch({ keywordReason: value, currPage: 1 })
                        }}
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" class={this.detailHeader.keywordReason ? 'on' : ''} />
                  </span>
                </Poptip>
              </span >
            )
          }
        },
        {
          title: '备注',
          key: 'sum',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <div>
                      <Input
                        v-model={this.detailHeader.sum}
                        search
                        clearable
                        v-on: on-search={value => {
                          this.detailSearch({ sum: value, currPage: 1 })
                        }}
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" class={this.detailHeader.sum ? 'on' : ''} />
                  </span>
                </Poptip>
              </span >
            )
          }
        },
        { title: '操作', slot: 'edit', align: 'center' }
      ],
      tableContent: []
    }
  },
  beforeCreate () {
    track.start()
  },
  mounted () {
    this.detailSearch()
  },
  methods: {
    addModel () {
      this.config.title = '新增'
      this.showModel = true
    },
    detailSearch (data = {}) {
      let sendData = this.getSendData(data)
      this.$axios({
        url: semUrl + '/Banword/index',
        data: $qs.stringify(sendData),
        method: 'post'
      }).then(res => {
        this.tableContent = res.data.content.pageContent
        this.detailHeader.totalCount = res.data.content.totalCount
        this.$nextTick(() => {
          track.end()
        })
      })
    },
    // 获取表头选中的数据
    getSendData (data) {
      let keys = Object.keys(this.detailHeader)
      let me = this
      let sendData = {}
      // 非空字符串
      let hasValueKeys = keys.filter(e => {
        return me.detailHeader[e] !== ''
      })
      // 拷贝到sendData
      for (let i = 0; i < hasValueKeys.length; i++) {
        let key = hasValueKeys[i]
        let value = me.detailHeader[key]
        sendData[key] = typeof value === 'string' ? value.trim() : value
      }
      // 传进来的data去除首位空格
      for (let key in data) {
        if (typeof data[key] === 'string') {
          data[key] = data[key].trim()
        }
      }
      return sendData
    },
    editIllegal (row) {
      this.propData = JSON.parse(JSON.stringify(row))
      this.config.title = '编辑'
      this.showModel = true
    },
    showIllegal (row) {
      this.propData = JSON.parse(JSON.stringify(row))
      this.config.title = '查看'
      this.showModel = true
    },
    deleteIllegal (row) {
      this.$Modal.confirm({
        title: '提示',
        content: `是否删除${row.title}？`,
        onOk: () => {
          this.$axios({
            url: semUrl + '/Banword/delBanword',
            data: $qs.stringify({ id: row.id }),
            method: 'post'
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.detailSearch()
            }
          })
        }
      })
    },
    reload () {
      this.detailHeader = {
        currPage: 1,
        pageSize: 20,
        totalCount: 0,
        title: '', // 黑名单词
        type: '', // 类型
        keywordReason: '', // 原因
        sum: '', // 备注
        text: ''
      }
      this.detailSearch()
    }
  }
}
</script>
