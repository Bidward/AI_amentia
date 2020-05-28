<template>
  <div>
    <div class="level-three clearfix">
      <Button type="primary" class="searchbarLeft btns" v-if="permission.create"  @click="addExtension()">新增</Button>
      <Button class="searchbarLeft " @click="exportExcel">导出</Button>
      <div class="searchbar">
        <Input
          @on-search="()=>{detailHeader.currPage=1;detailSearch()}"
          placeholder="推广组、推广计划"
          search
          clearable
          v-model="detailHeader.text"
          class=""
          style="width:200px;margin-right:5px;"
        />
        <Button class="btns" icon="ios-loading" @click="()=>{reload();detailSearch()} "></Button>
        <TableHeaderSetting
          :totalTableHeader="totalTableHeader"
          :tableHeader.sync="tableHeader"
          key="extension"
          localKey="extension"
        />
      </div>
    </div>
    <!-- customType -->
    <Table
      :columns="tableHeader"
      :height="tableHeight"
      :data="tableContent"
      border
      @on-sort-change="sortChange"
    >
      <template slot-scope="{ row, index }" slot="customType">
        <span>{{row.customType | customType}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="edit">
        <!-- <Button class="btns" type="primary" v-if="permission.update" @click="editExtension(row,index)">编辑</Button> -->
        <Button class="btns" type="error" v-if="permission.delete" @click="deltetExtension(row)">刪除</Button>
        <Button class="btns" @click="toDetail(row)">详情</Button>
      </template>
    </Table>
    <div class="clearfix tableFooter">
      <Page
        :total="detailHeader.totalCount"
        :page-size="detailHeader.pageSize"
        :current="detailHeader.currPage"
        :page-size-opts="[20,50,100,300]"
        size="small"
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
// import moment from 'moment'
import { semUrl } from '@/api/base.js'
import TableHeaderSetting from '_c/table-header-setting'
import { semPermissionMixin } from '../../tools'
import { Track } from '@/libs/track.js'
const track = new Track('营销/精确模式/推广组')

export default {
  name: 'extension',
  components: {
    TableHeaderSetting
  },
  mixins: [semPermissionMixin],
  props: {
    tableHeight: {
      type: Number
    }
  },
  data () {
    return {
      totalTableHeader: [
        {
          title: '序号',
          type: 'index',
          key: 'index',
          width: 60,
          align: 'center',
          alwaysShow: true
        },
        // {
        //   title: '责任人',
        //   key: 'owner',
        //   align: 'center',
        //   width: 100,
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
        //             {params.column.title}
        //             <Icon
        //               type="md-search"
        //               size="14"
        //               class={this.detailHeader.user ? 'on' : ''}
        //             />
        //           </span>
        //         </Poptip>
        //       </span>
        //     )
        //   }
        // },
        {
          title: '账户名称',
          key: 'accountName',
          align: 'center',
          width: 100,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.accountName}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.accountName ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '推广计划',
          key: 'campaignName',
          align: 'center',
          minWidth: 120,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.campaignName}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ campaignName: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.campaignName ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '推广组',
          key: 'groupName',
          align: 'center',
          minWidth: 120,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.groupName}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ groupName: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.groupName ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '产品名',
          key: 'softName',
          align: 'center',
          minWidth: 120,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.softName}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ softName: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.softName ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '创意',
          key: 'customType',
          align: 'center',
          minWidth: 120,
          slot: 'customType',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Select
                      v-on: on-change={value =>
                        this.detailSearch({ currPage: 1 })
                      }
                      v-model={this.detailHeader.customType}
                    >
                      <Option value={''}>全部</Option>
                      <Option value={'fengwu'}>高级</Option>
                      <Option value={'simple'}>朴素</Option>
                    </Select>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.customType ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span >
            )
          }
        },
        {
          title: '默认出价',
          key: 'price',
          align: 'center',
          width: 150,
          sortable: 'custom'
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          width: 100,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.status}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ status: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.status ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '操作',
          key: 'edit',
          slot: 'edit',
          width: 220,
          align: 'center',
          alwaysShow: true
        }
      ],
      tableHeader: [],
      tableContent: [],
      detailHeader: {
        totalCount: 0,
        pageSize: 20,
        currPage: 1,
        owner: '', // 责任人
        orderby: '', // 根据什么字段排序
        desc: 'normal', // 排序的方式
        // timeRange: [],
        text: '', // 模糊搜索
        accountName: '', // 账户名
        softName: '', // 产品名
        campaignName: '', // 推广计划
        groupName: '', // 推广组
        status: '' // 状态
      }
    }
  },
  beforeCreate () {
    track.start()
  },
  mounted () {
    this.detailSearch()
  },
  methods: {
    // 导出excel
    exportExcel () {
      let sendData = this.getSendData()
      sendData.type = 'expt'
      delete sendData.pageSize
      delete sendData.currPage
      delete sendData.text
      let data = $qs.stringify(sendData)
      // window.open(semUrl + '/Group/exptCostGroup?' + data)
      window.open(semUrl + '/group/index?' + data)
    },
    // 搜索
    detailSearch (getData = {}) {
      let sendData = this.getSendData(getData)
      this.$axios({
        url: semUrl + '/group/index',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          let content = res.data.content
          this.tableContent = content.pageContent
          this.detailHeader.totalCount = content.totalCount
          this.detailHeader.currPage = content.currPage
          this.setTableHeight()
          this.$nextTick(() => {
            track.end()
          })
        })
        .catch(err => {
          console.error(err)
          this.$Notice.warning({
            title: '数据异常，请联系技术人员'
          })
        })
    },
    // 设置Table的高度
    setTableHeight () {
      this.$emit('on-set-table-height')
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
    // 清空搜索条件
    reload (data = {}) {
      // 页面初始化的时候的数据
      let initData = {
        totalCount: 0,
        pageSize: 20,
        currPage: 1,
        owner: '', // 责任人
        text: '', // 模糊搜索
        accountName: '', // 账户名
        softName: '', // 产品名
        campaignName: '', // 推广计划
        groupName: '', // 推广组
        status: '' // 状态
      }
      this.detailHeader = Object.assign(initData, data)
      return this.detailHeader
    },
    // 到新增的页面
    addExtension () {
      this.$router.push({ name: 'editExtension', query: { title: '新增' } })
    },
    // 到编辑页面
    editExtension (row, index) {
      // 朴素创意编辑页面
      if (row.customType === 'simple') {
        this.$router.push({
          name: 'editSimple',
          query: {
            title: '编辑',
            groupId: row.groupId
          }
        })
      } else {
        // 高级创意编辑页面
        this.$router.push({
          name: 'editExtension',
          query: {
            title: '编辑',
            groupId: row.groupId,
            type: row.customType || 'null'
          }
        })
      }
    },
    // 删除推广组
    deltetExtension (row) {
      this.$Modal.confirm({
        title: '提示',
        content: `是否删除推广组 ${row.groupName}`,
        onOk: () => {
          this.$axios({
            url: semUrl + `/Group/delGroup?groupId=${row.groupId}`
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.$Message.success(res.data.msg)
                this.detailSearch()
              } else {
                this.$Message.error(res.data.msg)
              }
            })
            .catch(err => {
              console.error(err)
              this.$Notice.warning({
                title: '数据异常，请联系技术人员'
              })
            })
          // this.$Modal.warning({
          //   title: '提示',
          //   content: '存在关联项，删除失败'
          // })
        }
      })
    },
    // 获取需要发送的数据的数值
    getSendData (data = {}) {
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
      // 如果是模糊搜索
      if (sendData.text) {
        // 清空搜索
        this.reload()
        sendData.text = sendData.text.trim()
        this.detailHeader.text = sendData.text
      } else {
        // sendData.date = moment(sendData.timeRange[0]).format("YYYY-MM-DD");
        // sendData.enddate = moment(sendData.timeRange[1]).format("YYYY-MM-DD");
      }
      delete sendData.timeRange
      delete sendData.totalCount
      sendData = Object.assign(sendData, data)
      // 如果排序清空，不需要带排序条件
      if (sendData.desc === 'normal') {
        delete sendData.orderby
        delete sendData.desc
      }
      this.detailHeader.currPage = sendData.currPage
      return sendData
    },
    // 到详情页面
    toDetail (row) {
      this.$router.push({
        name: 'showExtension',
        params: { id: row.groupId, type: row.customType }
      })
    }
  },
  filters: {
    customType (v) {
      if (v === 'fengwu') {
        return '高级'
      } else if (v === 'simple') {
        return '朴素'
      } else {
        return ''
      }
    }
  }
}
</script>
