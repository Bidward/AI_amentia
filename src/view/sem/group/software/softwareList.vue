<template>
<!-- 产品否定词 -->
  <div>
    <div class="level-three clearfix">
      <div class="searchbar">
        <Input
          @on-search="()=>{detailHeader.currPage=1;detailSearch()}"
          placeholder="精确搜索产品名"
          search
          clearable
          v-model="detailHeader.softname"
          class=""
          style="width:200px;margin-right:5px;"
        />
        <Button class="btns" icon="ios-loading" @click="reload()"></Button>
        <TableHeaderSetting
          :totalTableHeader="totalTableHeader"
          :tableHeader.sync="tableHeader"
          key="SemProductList"
          localKey="SemProductList"
        />
      </div>
    </div>
    <Table
      :columns="tableHeader"
      :data="tableContent"
      @on-sort-change="sortChange"
      :height="tableHeight"
      border
      :loading="loading"
    >
      <template slot-scope="{ row, index }" slot="negative_words_count">
        <span :class="{red:Number(row.negative_words_count)>200}">{{Number(row.negative_words_count)}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="exactnegative_words_count">
        <span :class="{red:Number(row.exactnegative_words_count)>400}">{{Number(row.exactnegative_words_count)}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="edit">
        <Button  type="primary" v-if="permission.update" @click="edit(row,index)">编辑</Button>
      </template>
    </Table>
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
        @on-change="(currPage)=>{detailHeader.currPage=currPage;detailSearch()}"
        @on-page-size-change="(pageSize)=>{detailHeader.pageSize=pageSize;detailSearch()}"
      />
    </div>
  </div>
</template>
<script>
import { semUrl } from '@/api/base.js'
import TableHeaderSetting from '_c/table-header-setting'
import { semPermissionMixin } from '../../tools'
import { Track } from '@/libs/track.js'
const track = new Track('营销/精确模式/产品否定词')
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
  mixins: [semPermissionMixin],
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
          key: 'softname',
          minWidth: 100,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.softname}
                      search
                      clearable
                      placeholder="精确搜索产品名"
                      v-on: on-search={value => {
                        this.detailSearch({ softname: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader.softname ? 'on' : ''} />
                    {params.column.title}
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        // {
        //   title: '责任人',
        //   key: 'owner',
        //   align: 'center',
        //   minWidth: 100,
        //   renderHeader: (h, params) => {
        //     return (
        //       <span>
        //         <Poptip placement="bottom">
        //           <div slot="content">
        //             <Input
        //               v-model={this.detailHeader.owner}
        //               search
        //               clearable
        //               v-on: on-search={value => {
        //                 this.detailSearch({ owner: value, currPage: 1 })
        //               }}
        //             />
        //           </div>
        //           <span class="pointer">
        //             <Icon type="md-search" size="14" class={this.detailHeader.owner ? 'on' : ''} />
        //             {params.column.title}
        //           </span>
        //         </Poptip>
        //       </span >
        //     )
        //   }
        // },
        {
          title: '否定关键词',
          key: 'negative_words_count',
          slot: 'negative_words_count',
          align: 'center',
          minWidth: 100,
          sortable: 'custom'
        },
        {
          title: '精确否定词',
          key: 'exactnegative_words_count',
          slot: 'exactnegative_words_count',
          align: 'center',
          minWidth: 100,
          sortable: 'custom'
        },
        {
          title: '备注',
          key: 'sum',
          minWidth: 80,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.sum}
                      search
                      style="width:200px"
                      v-on: on-search={value => {
                        this.detailSearch({ sum: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader.sum ? 'on' : ''} />
                    {params.column.title}
                  </span>
                </Poptip>
              </span >
            )
          }
        },
        {
          title: '操作',
          key: 'edit',
          slot: 'edit',
          minWidth: 160,
          align: 'center',
          alwaysShow: true
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
        softname: '', // 产品名
        owner: '', // 责任人
        negative_words_count: '', // 否定关键词
        exactnegative_words_count: '', // 精确否定关键词
        sum: ''// 备注
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
        url: semUrl + '/group/softName',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        this.tableContent = res.data.content.pageContent
        this.detailHeader.totalCount = Number(res.data.content.totalCount)
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
      let id = row.id
      this.$router.push({
        name: 'softDetail',
        query: {
          id
        }
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
        softname: '', // 产品名
        owner: '', // 责任人
        negative_words_count: '', // 否定关键词
        exactnegative_words_count: '', // 精确否定关键词
        sum: ''// 备注
      }
      this.detailSearch()
    },
    // 获取需要发送的数据的数值
    getSendData (data = {}) {
      let keys = Object.keys(this.detailHeader)
      let me = this
      let hasValueKeys = keys.filter(e => {
        // 非空字符串，非空数组,timeRage第二项有值才算
        return me.detailHeader[e] !== ''
      })
      let sendData = {}
      // 只拿非空的数字
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
      // 如果是模糊搜索
      if (sendData.text) {
        sendData.text = sendData.text.trim()
        this.detailHeader.text = sendData.text
      }
      delete sendData.totalCount
      sendData = Object.assign(sendData, data)
      // 如果排序清空，不需要带排序条件
      if (sendData.desc === 'normal') {
        delete sendData.orderby
        delete sendData.desc
      }
      this.detailHeader.currPage = sendData.currPage
      return sendData
    }
  }
}
</script>
