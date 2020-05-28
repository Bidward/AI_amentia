<template>
  <div>
    <div class="level-three clearfix">
      <Button type="primary" class="btns" v-if="permission.create" @click="addModel()">新增</Button>
      <Button class="btns" @click="expt" >导出</Button>
      <div class="searchbar">
        <Input
          @on-search="()=>{detailHeader.currPage=1;detailSearch()}"
          placeholder="搜索短语模板"
          search
          clearable
          v-model="detailHeader.text"
          class
          style="width:200px;margin-right:5px;"
        />
        <Button class icon="ios-loading" @click="reload()"></Button>
      </div>
    </div>
    <Table border :columns="tableHeader" :data="tableContent">
      <template slot-scope="{ row, index }" slot="edit">
        <Button
          class="btns"
          type="primary"
          v-if="permission.update"
          @click="editShortModel(row,index)"
        >编辑</Button>
        <Button class="btns" type="error" v-if="permission.delete" @click="deltetExtension(row)">刪除</Button>
        <Button class="btns" @click="showShortModel(row)">详情</Button>
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
      />
    </div>
    <editModel
      v-if="showModal"
      @on-updateList="e=>{detailSearch()}"
      :config="config"
      :propData="propData"
      :show.sync="showModal"
    />
  </div>
</template>
<script>
import editModel from './editModel'
import { semUrl } from '@/api/base.js'
import { semPermissionMixin } from '../../tools'
import { Track } from '@/libs/track.js'
const track = new Track('营销/基础信息/短语模板')
export default {
  name: 'shortModel',
  components: {
    editModel
  },
  mixins: [semPermissionMixin],
  data () {
    return {
      tabsType: 'shortModel',
      showModal: false,
      config: {
        title: '新增'
      },
      tableHeader: [
        { title: '序号', type: 'index', align: 'center' },
        {
          title: '短语模板',
          key: 'title',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.title}
                      search
                      clearable
                      v-on:on-search={title => {
                        this.detailSearch({ title, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.title ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '短语模式',
          key: 'qwStatus',
          align: 'center',
          render: (h, { row }) => {
            return (
              <span>{row.qwStatus === '0' ? '停用' : '启用'}</span>
            )
          },
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Select
                      v-model={this.detailHeader.qwStatus}
                      v-on:on-change={qwStatus => {
                        this.detailSearch({ qwStatus, currPage: 1 })
                      }}
                    >
                      <Option value="">全部</Option>
                      <Option value="1">启用</Option>
                      <Option value="0">停用</Option>
                    </Select>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.qwStatus ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
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
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.sum}
                      search
                      clearable
                      v-on:on-search={sum => {
                        this.detailSearch({ sum, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.sum ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        { title: '操作', key: 'edit', slot: 'edit', align: 'center' }
      ],
      tableContent: [],
      detailHeader: {
        totalCount: 0,
        text: '', // 模糊搜索
        currPage: 1,
        pageSize: 20,
        title: '', // 短语模板
        qwStatus: '', // 短语模板模式
        sum: ''// 备注
      },
      propData: {}
    }
  },
  beforeCreate () {
    track.start()
  },
  mounted () {
    this.detailSearch()
  },
  methods: {
    expt () {
      let exptData = this.getSendData()
      delete exptData.pageSize
      delete exptData.currPage
      exptData.type = 'expt'
      let url = semUrl + '/Shortmodel/index?' + $qs.stringify(exptData)
      window.open(url)
    },
    getSendData (data = {}) {
      this.detailHeader = Object.assign(this.detailHeader, data)
      let sendData = {}
      for (let key in this.detailHeader) {
        let value = this.detailHeader[key]
        value = typeof value === 'string' ? value.trim() : value
        if (value) {
          sendData[key] = value
        }
      }
      delete sendData.totalCount
      return sendData
    },
    // 搜索
    detailSearch (data = {}) {
      let sendData = this.getSendData(data)
      this.$axios({
        url: semUrl + '/Shortmodel/index',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.detailHeader.totalCount = res.data.content.totalCount
            this.tableContent = res.data.content.pageContent
            this.$nextTick(() => {
              track.end()
            })
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 新增
    addModel () {
      this.config.title = '新增'
      this.showModal = true
    },
    // 编辑
    editShortModel (row) {
      this.config.title = '编辑'
      this.propData = JSON.parse(JSON.stringify(row))
      this.showModal = true
    },
    // 查看
    showShortModel (row) {
      this.config.title = '查看'
      this.propData = JSON.parse(JSON.stringify(row))
      this.showModal = true
    },
    reload () {
      this.detailHeader.currPage = 1
      this.detailHeader.pageSize = 20
      this.detailHeader.text = ''
      this.detailSearch()
    },
    // 删除推广组
    deltetExtension (row) {
      this.$Modal.confirm({
        title: '提示',
        content: `是否删除${row.title}`,
        onOk: () => {
          this.$axios({
            url: semUrl + '/Shortmodel/delShort',
            method: 'post',
            data: $qs.stringify({ id: row.id })
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.detailSearch()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    }
  }
}
</script>
