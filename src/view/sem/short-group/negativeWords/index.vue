<template>
  <!-- 产品否定词 -->
  <div>
    <div class="level-three clearfix">
      <div class="searchbar">
        <Input
          @on-search="()=>{detailSearch({currPage:1})}"
          placeholder="精确搜索产品名"
          search
          clearable
          v-model="detailHeader.softName"
        />
        <Button class="btns" icon="ios-loading" @click="reload()"></Button>
        <TableHeaderSetting :totalTableHeader="totalTableHeader" v-model="tableHeader" />
      </div>
    </div>
    <Table
      :columns="tableHeader"
      :data="tableContent"
      @on-sort-change="sortChange"
      :maxHeight="tableHeight"
      border
      :loading="loading"
    ></Table>
    <div class="clearfix tableFooter">
      <Page
        size="small"
        :total="detailHeader.totalCount"
        :page-size="detailHeader.pageSize"
        :current="detailHeader.currPage"
        :page-size-opts="[20,50,100]"
        show-total
        show-sizer
        show-elevator
        @on-change="(currPage)=>{detailSearch({currPage})}"
        @on-page-size-change="(pageSize)=>{detailSearch({pageSize})}"
      />
    </div>
  </div>
</template>
<script>
import { semUrl } from '@/api/base.js'
import TableHeaderSetting from '_c/table-header-setting'
import { semPermissionMixin, renderHeaderMixins } from '../../tools'
import { Track } from '@/libs/track.js'
const track = new Track('营销/短语模式/产品否定词')
export default {
  components: {
    TableHeaderSetting
  },
  props: {
    tableHeight: {
      type: Number,
      default: 600
    }
  },
  mixins: [semPermissionMixin, renderHeaderMixins],
  beforeCreate () {
    track.start()
  },
  data () {
    return {
      tableHeader: [],
      loading: true,
      totalTableHeader: [
        {
          title: '序号',
          type: 'index',
          key: 'index',
          width: 80,
          align: 'center',
          alwaysShow: true
        },
        {
          title: '产品名',
          key: 'softName',
          minWidth: 100,
          align: 'center',
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          title: '否定关键词',
          key: 'negativeWordsCount',
          align: 'center',
          minWidth: 100,
          sortable: 'custom',
          render: (h, { row }) => {
            const value = row.negativeWordsCount
            return (
              <span class={Number(value) > 200 ? 'red' : ''}>{value}</span>
            )
          }
        },
        {
          title: '备注',
          key: 'sum',
          minWidth: 80,
          align: 'center',
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          title: '操作',
          key: 'edit',
          width: 100,
          align: 'center',
          alwaysShow: true,
          render: (h, { row, index }) => {
            if (this.permission.update) {
              return (
                <Button
                  type="primary"
                  onClick={() => {
                    this.edit(row, index)
                  }}
                >
                  编辑
                </Button>
              )
            }
          }
        }
      ],
      tableContent: [],
      detailHeader: {
        currPage: 1,
        pageSize: 20,
        totalCount: 0,
        orderby: '', // 根据什么字段排序
        desc: 'normal', // 排序的方式
        text: '', // 模糊搜索

        softName: '', // 产品名
        negativeWordsCount: '', // 否定关键词
        sum: '' // 备注
      }
    }
  },
  mounted () {
    this.detailSearch()
  },
  methods: {
    // 搜索
    detailSearch (getData = {}) {
      let sendData = this.getSendData(getData)
      this.loading = true
      this.$axios({
        url: semUrl + '/PhraseExact/negativeWords',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        const { list, totalCount } = res.data
        this.tableContent = list
        this.detailHeader.totalCount = Number(totalCount)
        // 合计放到最后一行
        this.loading = false
        this.setTableHeight()
        this.$nextTick(() => {
          track.end()
        })
      })
    },
    // 排序
    sortChange (column) {
      // 降序  "desc"
      let orderby = column.key
      let desc = column.order
      this.detailSearch({ orderby, desc })
      this.detailHeader.orderby = column.key
      this.detailHeader.desc = column.order
    },
    // 设置Table的高度
    setTableHeight () {
      this.$emit('on-set-table-height')
    },
    // 编辑
    edit (row, index) {
      const id = row.id
      this.$router.replace({
        name: 'negativeWordsDetail',
        query: { id }
      })
    },
    reload () {
      this.detailHeader = {
        currPage: 1,
        pageSize: 20,
        totalCount: 0,
        orderby: '', // 根据什么字段排序
        desc: 'normal', // 排序的方式
        text: '', // 模糊搜索

        softName: '', // 产品名
        negativeWordsCount: '', // 否定关键词
        sum: '' // 备注
      }
      this.detailSearch()
    },
    // 获取需要发送的数据的数值
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
      // 删除排序
      if (sendData.desc === 'normal') {
        delete sendData.orderby
        delete sendData.desc
      }
      delete sendData.totalCount
      this.detailHeader = Object.assign(this.detailHeader, sendData)
      return sendData
    }
  }
}
</script>
