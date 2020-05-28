<template>
  <div>
    <div class="level-three clearfix">
      <!-- <Button class="searchbarLeft btns" @click="exportExcel">导出</Button> -->
      <div class="searchbar">
        <Input
          @on-search="()=>{detailHeader.currPage=1;detailSearch()}"
          placeholder="推广组、关键词、责任人"
          search
          clearable
          v-model="detailHeader.text"
          class
          style="width:200px;margin-right:5px;"
        />
        <Button class="btns" icon="ios-loading" @click="reload()"></Button>
        <TableHeaderSetting
          :totalTableHeader="totalTableHeader"
          :tableHeader.sync="tableHeader"
          key="semKeywordsList"
          localKey="semKeywordsList"
        />
      </div>
    </div>
    <Table
      :columns="tableHeader"
      :data="tableContent"
      border
      @on-sort-change="sortChange"
      :height="tableHeight"
      :loading="loading"
      @on-selection-change="selectionChange"
    >
      <template slot-scope="{ row, index }" slot="edit">
        <Button class="btns" type="primary" v-if="permission.update" @click="edit(row,index)">编辑</Button>
        <Button class="btns" type="error" v-if="permission.delete" @click="del(row,index)">删除</Button>
        <Button class="btns" @click="toDetail(row)">详情</Button>
      </template>
    </Table>
    <div class="tableFooter clearfix">
      <Dropdown :transfer="true" trigger="click" @on-click="handlerClickBatch">
        <Button type="primary">批量编辑</Button>
        <DropdownMenu slot="list">
          <DropdownItem name="owner" v-if="permission.config">更换责任人</DropdownItem>
          <DropdownItem name="status" v-if="permission.update">更改状态</DropdownItem>
          <DropdownItem name="showId" v-if="permission.update">更换模板</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Page
        size="small"
        :total="detailHeader.totalCount"
        :page-size="detailHeader.pageSize"
        :current="detailHeader.currPage"
        :page-size-opts="[20,50,100,300]"
        show-total
        show-sizer
        show-elevator
        @on-change="(currPage)=>{detailHeader.currPage=currPage;detailSearch()}"
        @on-page-size-change="(pageSize)=>{detailHeader.pageSize=pageSize;detailSearch()}"
      />
    </div>
    <editKeyword
      @updateList="detailSearch"
      v-if="showEdit"
      :show.sync="showEdit"
      :propData="propData"
    />
    <Modal
      v-model="showBatchModal"
      @on-ok="handlerBatchOk"
      :title="type[optType]"
      :loading="showEditLoading"
    >
      <Form>
        <FormItem label>
          <h4>您已选中{{ids.length}}个关键词</h4>
        </FormItem>
        <FormItem label="操作">
          <Select v-if="type[optType]==='批量更换责任人'" v-model="owner" filterable>
            <Option
              v-for="person in employees"
              :value="person.nickname"
              :key="person.id"
              :label="person.nickname"
            />
          </Select>
          <Select v-if="type[optType]==='批量上下线'" v-model="status">
            <Option value="enabled" key="enabled" label="启用" />
            <Option value="paused" key="paused" label="暂停" />
            <Option value="stop" key="stop" label="停用" />
          </Select>
          <Select v-if="type[optType]==='批量更换模板'" v-model="showId">
            <Option
              v-for="(item,index) in templates"
              :value="item.templateId"
              :key="index"
            >模板{{item.templateId}}--昨日安装量{{item.setups}}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { semUrl } from '@/api/base.js'
// import moment from 'moment'
import editKeyword from './editKeyword'
import TableHeaderSetting from '_c/table-header-setting'
import { semPermissionMixin } from '../../tools'
import { Track } from '@/libs/track.js'
const track = new Track('营销/精确模式/关键词')
export default {
  components: {
    editKeyword,
    TableHeaderSetting
  },
  mixins: [semPermissionMixin],
  props: {
    tableHeight: {
      type: Number,
      default: 600
    }
  },
  beforeCreate () {
    track.start()
  },
  data () {
    return {
      title: '', // 弹出框的标题
      optType: '',
      type: {
        owner: '批量更换责任人',
        status: '批量上下线',
        showId: '批量更换模板'
      },
      showBatchModal: false, // 批量更改的弹窗
      showEditLoading: true, // 展示loading

      ids: [], // 选中的勾选框
      owner: '', // 更换责任人绑定的新责任人
      status: '', // 更改上下线的状态
      showId: '', // 新的模板号

      showEdit: false,
      propData: {}, // 传递的数据
      tableHeader: [],
      loading: true,
      tableConfigList: [
        'index',
        'addTime',
        'accountName',
        'groupName',
        'plainGroupName',
        'owner',
        'keyword',
        'price',
        'matchType',
        'showId',
        'status',
        'sum',
        'edit'
      ],
      totalTableHeader: [
        {
          title: '批量',
          type: 'selection',
          key: 'selection',
          width: 50,
          align: 'center'
        },
        {
          title: '序号',
          type: 'index',
          key: 'index',
          width: 80,
          align: 'center',
          alwaysShow: true
        },
        {
          title: '账户名称',
          key: 'accountName',
          minWidth: 100,
          align: 'center',
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
          title: '推广组',
          key: 'groupName',
          minWidth: 100,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Checkbox
                      true-value={'1'}
                      false-value={''}
                      v-model={this.detailHeader.groupCheck}
                    >
                      精确搜索
                    </Checkbox>
                    <Input
                      v-model={this.detailHeader.groupName}
                      search
                      style="width:200px"
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
          minWidth: 100,
          align: 'center',
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
          title: '推广计划',
          key: 'campaignName',
          align: 'center',
          minWidth: 100,
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
          title: '责任人',
          key: 'owner',
          align: 'center',
          minWidth: 100,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.owner}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ owner: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.owner ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '关键词',
          key: 'keyword',
          align: 'center',
          minWidth: 100,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Checkbox
                      true-value={'1'}
                      false-value={''}
                      v-model={this.detailHeader.keywordCheck}
                    >
                      精确搜索
                    </Checkbox>
                    <Input
                      v-model={this.detailHeader.keyword}
                      search
                      style="width:200px"
                      v-on: on-search={value => {
                        this.detailSearch({ keyword: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.keyword ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '出价',
          key: 'price',
          width: 80,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '历史最大点击',
          key: 'maxClick',
          width: 130,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '昨日点击数',
          key: 'lastClick',
          width: 120,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '点击差值',
          key: 'diffLastClick',
          width: 120,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '下线差值',
          key: 'promote',
          width: 110,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '历史最高安装',
          key: 'maxSetups',
          width: 130,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '匹配方式',
          key: 'matchType',
          align: 'center',
          width: 120,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Select
                      v-model={this.detailHeader.matchType}
                      v-on: on-change={value => {
                        this.detailSearch({ matchType: value, currPage: 1 })
                      }}
                    >
                      <Option value="">全部</Option>
                      <Option value="短精">短精</Option>
                      <Option value="短">短</Option>
                      <Option value="精">精</Option>
                    </Select>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.matchType ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span >
            )
          }
        },
        {
          title: '软件ID',
          key: 'softId',
          width: 110,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.softId}
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
                      class={this.detailHeader.softId ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          },
          render: (h, { row, column, index }) => {
            return (
              <a href={row.semUrl} target="_blank" title="打开页面">
                <span class="pointer">{row.softId}</span>
              </a>
            )
          }
        },
        {
          title: '模板',
          key: 'showId',
          width: 80,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.showId}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ showId: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.showId ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '渠道号',
          key: 'appId',
          width: 100,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.appId}
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
                      class={this.detailHeader.appId ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '状态',
          key: 'optStatus',
          width: 80,
          align: 'center',
          renderHeader: (h, params) => {
            // <Option value="edited">待编辑</Option>
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Select
                      v-model={this.detailHeader.optStatus}
                      v-on: on-change={value => {
                        this.detailSearch({ optStatus: value, currPage: 1 })
                      }}
                    >
                      <Option value="">全部</Option>
                      <Option value="enabled">启用</Option>
                      <Option value="paused">暂停</Option>
                      <Option value="stop">停用</Option>
                    </Select>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.optStatus ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span >
            )
          }
        },
        {
          title: '下线原因',
          key: 'reason',
          minWidth: 180,
          align: 'center',
          tooltip: true
          /**  2019年12月27日，后端关联查询无法表头搜索 PHP lv
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.reason}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ reason: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.reason ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        */
        },
        {
          title: '备注',
          key: 'sum',
          minWidth: 80,
          align: 'center',
          tooltip: true,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.sum}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ sum: value, currPage: 1 })
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
        {
          title: '操作',
          key: 'edit',
          slot: 'edit',
          minWidth: 230,
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
        accountName: '', // 账户名称
        groupName: '', // 推广组
        softName: '', // 产品名
        owner: '', // 责任人
        keyword: '', // 关键字
        promote: '', // 下线差值
        campaignName: '', // 推广计划
        matchType: '', // 匹配方式
        softId: '', // 软件Id
        appId: '', // 渠道号
        keywordCheck: '', // 关键词精确搜索
        groupCheck: '', // 推广组精确搜索
        maxSetups: '', // 历史最高安装
        reason: '', // 下线原因
        sum: ''// 备注
      },
      templates: []// 模板列表
    }
  },
  mounted () {
    this.detailSearch()
  },
  methods: {
    // 勾选之后
    selectionChange (rows) {
      let selection = rows.map(e => e.id)
      this.ids = selection
    },
    // 批量的按钮
    handlerClickBatch (name) {
      if (this.ids.length === 0) {
        this.$Message.error('请先勾选关键词')
        return false
      }
      switch (name) {
        case 'owner': {
          this.title = '批量更换责任人'
          break
        }
        case 'status': {
          this.title = '批量上下线'
          break
        }
        case 'showId': {
          if (this.templates.length === 0) {
            this.$axios({
              url: semUrl + '/Templat/index',
              data: $qs.stringify({ pageSize: '100', currPage: '1' }),
              method: 'post'
            }).then(res => {
              this.templates = res.data.content.pageContent
            })
            this.title = '批量更换模板'
          }
          break
        }
      }
      this.optType = name
      this.showBatchModal = true
    },
    // 弹出框点击OK的后的操作
    handlerBatchOk () {
      let name = this.optType
      switch (name) {
        case 'owner': {
          this.handlerChangeOwner()
          break
        }
        case 'status': {
          this.handlerChangeStatus()
          break
        }
        case 'showId': {
          this.handlerChangeShowId()
          break
        }
      }
    },
    // 点确定，更换责任人
    handlerChangeOwner () {
      let data = {
        ids: this.ids,
        owner: this.owner
      }
      this.$axios({
        url: semUrl + '/Keyword/uptOwnerBatch',
        method: 'post',
        data: $qs.stringify(data)
      }).then(res => {
        if (res.data.code === 10000) {
          this.$Message.success(res.data.msg)
          this.showBatchModal = false
          this.detailSearch()
        } else {
          this.$Message.error(res.data.msg)
          this.showBatchModal = false
          this.$nextTick(() => {
            this.showEditLoading = true
          })
        }
      }).catch(err => {
        this.$Message.error(err)
        this.showBatchModal = false
        this.$nextTick(() => {
          this.showEditLoading = true
        })
      })
    },
    // 点确定，批量更新状态
    handlerChangeStatus () {
      let data = {
        ids: this.ids,
        status: this.status
      }
      this.$axios({
        url: semUrl + '/Keyword/uptStatusBatch',
        method: 'post',
        data: $qs.stringify(data)
      }).then(res => {
        console.log(res.data)
      }).catch(err => {
        this.$Message.error(err)
        this.showBatchModal = false
        this.$nextTick(() => {
          this.showEditLoading = true
        })
      })
      this.$Message.success('提交成功，后台处理中')
      this.showBatchModal = false
    },
    // 点确定，批量更改模板
    handlerChangeShowId () {
      let data = {
        ids: this.ids,
        showId: this.showId
      }
      this.$axios({
        url: semUrl + '/Keyword/uptShowIdBatch',
        method: 'post',
        data: $qs.stringify(data)
      }).then(res => {
        // console.log(res.data)
        this.$Message.success('提交成功，后台处理中')
      }).catch(err => {
        this.$Message.error(err)
        this.showEditLoading = false
        this.$nextTick(() => {
          this.showEditLoading = true
        })
      })
      this.showBatchModal = false
    },
    // 导出excel
    exportExcel () {
      let sendData = this.getSendData()
      delete sendData.pageSize
      delete sendData.currPage
      delete sendData.text
      let data = $qs.stringify(sendData)
      window.open(semUrl + '/Keyword/exptCostKeyword?' + data)
    },
    // 搜索
    detailSearch (getData = {}) {
      let sendData = this.getSendData(getData)
      this.loading = true
      this.$axios({
        url: semUrl + '/keyword/index',
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
      this.$axios({
        url: semUrl + `/keyword/show?keywordId=${row.keywordId}`
      }).then(res => {
        let data = res.data.data.keyword
        data.keywordId = row.keywordId
        this.propData = data
        this.showEdit = true
        // this.propData = JSON.parse(JSON.stringify(row))
      })
    },
    // 删除关键词
    del (row, index) {
      const { keyword, keywordId, id } = row
      this.$Modal.confirm({
        title: '提示',
        content: `是否删除关键词 ${keyword}`,
        onOk: () => {
          this.$axios({
            url: semUrl + '/Keyword/delKeyword',
            method: 'post',
            data: $qs.stringify({ keywordId, id })
          }).then(res => {
            const data = res.data
            if (data.code === 10000) {
              this.$Message.success(data.msg)
              this.detailSearch()
            } else {
              this.$Message.error(data.msg)
            }
          })
        }
      })
    },
    // 到关键词详情页
    toDetail (row) {
      this.$router.push({
        name: 'semKeywordDetail',
        params: { id: row.keywordId }

      })
    },
    reload () {
      this.detailHeader = {
        currPage: 1,
        pageSize: 20,
        totalCount: 0,
        orderby: '', // 根据什么字段排序
        desc: 'normal', // 排序的方式
        // timeRange: [], // 时间范围
        text: '', // 模糊搜索
        accountName: '', // 账户名称
        groupName: '', // 推广组
        softName: '', // 产品名
        owner: '', // 责任人
        keyword: '', // 关键字
        campaignName: '', // 推广计划
        matchType: '', // 匹配方式
        keywordCheck: '', // 关键词精确搜索
        groupCheck: '', // 推广组精确搜索
        maxSetups: '', // 历史最高安装
        reason: '', // 下线原因
        sum: '' // 备注
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
      for (let i = 0; i < hasValueKeys.length; i++) {
        let key = hasValueKeys[i]
        let value = me.detailHeader[key]
        sendData[key] = typeof value === 'string' ? value.trim() : value
        if (key === 'softId') {
          sendData.softId = sendData.softId.split(' ').join(',')
        }
        if (key === 'appId') {
          sendData.appId = sendData.appId.split(' ').join(',')
        }
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
  },
  computed: {
    employees () {
      return this.$store.state.user.employees
    }
  }
}
</script>
