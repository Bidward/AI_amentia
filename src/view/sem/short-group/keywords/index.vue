<template>
  <div>
    <div class="level-three clearfix">
      <Button
        type="primary"
        class="searchbarLeft btns"
        v-if="permission.create"
        @click="addKeyword"
      >新增</Button>
      <Button class="searchbarLeft" @click="exportExcel">导出</Button>
      <div class="searchbar">
        <Input
          @on-search="(text)=>{detailSearch({text,currPage:1})}"
          placeholder="推广计划、责任人、推广组"
          search
          clearable
          v-model="detailHeader.text"
        />
        <Button class="btns" icon="ios-loading" @click="()=>{reload();detailSearch()}" />
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
          <!-- <DropdownItem name="showId" v-if="permission.update">更换模板</DropdownItem> -->
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
        @on-change="(currPage)=>{detailSearch({currPage})}"
        @on-page-size-change="(pageSize)=>{detailSearch({pageSize})}"
      />
    </div>
    <KeywordEdit
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
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { semUrl } from '@/api/base.js'
// import moment from 'moment'
import KeywordEdit from './KeywordEdit'
import TableHeaderSetting from '_c/table-header-setting'
import { semPermissionMixin } from '../../tools'
import { HeaderInput, HeaderSelect } from '_c/table-header-search'
import KeywordDetail from './KeywordDetail'
import { Track } from '@/libs/track'
const track = new Track('营销/短语模式/关键词')
export default {
  components: {
    KeywordEdit,
    TableHeaderSetting,
    HeaderInput,
    HeaderSelect
  },
  mixins: [semPermissionMixin],
  props: {
    tableHeight: {
      type: Number,
      default: 600
    }
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
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          title: '推广计划',
          key: 'campaignName',
          align: 'center',
          minWidth: 100,
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          title: '责任人',
          key: 'owner',
          align: 'center',
          minWidth: 100,
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          title: '产品名',
          key: 'softName',
          minWidth: 100,
          align: 'center',
          renderHeader: (h, params) => {
            let { key, title } = params.column
            return (
              <HeaderInput
                v-model={this.detailHeader[key]}
                title={title}
                onOn-search={value => {
                  this.detailSearch({ [key]: value, currPage: 1 })
                }}
              >
                <Checkbox
                  slot="pre"
                  trueValue={'1'}
                  falseValue={''}
                  v-model={this.detailHeader.softNameCheck}
                >
                  精确搜索
                </Checkbox>
              </HeaderInput>
            )
          }
        },
        {
          title: '推广组',
          key: 'groupName',
          minWidth: 100,
          align: 'center',
          renderHeader: (h, params) => {
            let { key, title } = params.column
            return (
              <HeaderInput
                v-model={this.detailHeader[key]}
                title={title}
                onOn-search={value => {
                  this.detailSearch({ [key]: value, currPage: 1 })
                }}
              >
                <Checkbox
                  slot="pre"
                  trueValue={'1'}
                  falseValue={''}
                  v-model={this.detailHeader.groupCheck}
                >
                  精确搜索
                </Checkbox>
              </HeaderInput>
            )
          }
        },
        {
          title: '关键词',
          key: 'keyword',
          align: 'center',
          minWidth: 100,
          renderHeader: (h, params) => {
            let { key, title } = params.column
            return (
              <HeaderInput
                v-model={this.detailHeader[key]}
                title={title}
                onOn-search={value => {
                  this.detailSearch({ [key]: value, currPage: 1 })
                }}
              >
                <Checkbox
                  slot="pre"
                  trueValue={'1'}
                  falseValue={''}
                  v-model={this.detailHeader.keywordCheck}
                >
                  精确搜索
                </Checkbox>
              </HeaderInput>
            )
          }
        },
        {
          title: '渠道号',
          key: 'appId',
          width: 100,
          align: 'center',
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          title: '出价',
          key: 'price',
          width: 80,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '软件ID',
          key: 'softId',
          width: 110,
          align: 'center',
          renderHeader: (h, params) => this.renderHeaderInput(h, params),
          render: (h, { row, column, index }) => {
            return (
              <a href={row.semUrl} target="_blank" title="打开页面">
                <span class="pointer">{row.softId}</span>
              </a>
            )
          }
        },
        {
          title: '状态',
          key: 'status',
          width: 80,
          align: 'center',
          renderHeader: (h, params) => {
            // <Option value="edited">待编辑</Option>
            let arr = [
              { label: '全部', value: '' },
              { label: '启用', value: 'enabled' },
              { label: '暂停', value: 'paused' },
              { label: '停用', value: 'stop' }
            ]
            let { key, title } = params.column
            return (
              <HeaderSelect
                options={arr}
                key={key}
                title={title}
                onOn-change={data => {
                  this.detailSearch()
                }}
                v-model={this.detailHeader.status}
              />
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
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
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
        campaignName: '', // 推广计划
        owner: '', // 责任人
        softName: '', // 产品名
        softNameCheck: '', // 产品名精确搜索
        groupName: '', // 推广组
        groupCheck: '', // 推广组精确搜索
        keyword: '', // 关键字
        keywordCheck: '', // 关键词精确搜索
        appId: '', // 渠道号
        softId: '', // 软件Id
        status: '', // 状态
        reason: '', // 下线原因
        sum: '' // 备注
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
    // 表头搜索输入框函数
    renderHeaderInput (h, params) {
      let { key, title } = params.column
      return (
        <HeaderInput
          v-model={this.detailHeader[key]}
          title={title}
          onOn-search={value => {
            this.detailSearch({ [key]: value, currPage: 1 })
          }}
        />
      )
    },
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
      }
    },
    // 点确定，更换责任人
    handlerChangeOwner () {
      let data = {
        ids: this.ids,
        owner: this.owner
      }
      this.$axios({
        url: semUrl + '/PhraseKeyword/uptOwner',
        method: 'post',
        data: $qs.stringify(data)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            this.showBatchModal = false
            this.ids = []
            this.owner = ''
            this.detailSearch()
          } else {
            this.$Message.error(res.data.msg)
            this.showBatchModal = false
            this.$nextTick(() => {
              this.showEditLoading = true
            })
          }
        })
        .catch(err => {
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
        url: semUrl + '/PhraseKeyword/uptStatus',
        method: 'post',
        data: $qs.stringify(data)
      }).catch(err => {
        this.$Message.error(err)
        this.showBatchModal = false
        this.$nextTick(() => {
          this.showEditLoading = true
        })
      })
      this.$Message.success('提交成功，后台处理中')
      this.showBatchModal = false
      this.detailSearch()
      this.ids = []
    },
    // 导出excel
    exportExcel () {
      let sendData = this.getSendData()
      sendData.type = 'expt'
      delete sendData.pageSize
      delete sendData.currPage
      delete sendData.text
      let data = $qs.stringify(sendData)
      window.open(semUrl + '/PhraseKeyword/index?' + data)
    },
    // 搜索
    detailSearch (getData = {}) {
      let sendData = this.getSendData(getData)
      this.loading = true
      this.$axios({
        url: semUrl + '/PhraseKeyword/index',
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
    },
    // 设置Table的高度
    setTableHeight () {
      this.$emit('on-set-table-height')
    },
    // 增加关键词
    addKeyword () {
      this.showEdit = true
      this.propData = {
        title: '新增'
      }
    },
    // 编辑
    edit (row, index) {
      this.$axios({
        url: semUrl + `/PhraseKeyword/show?keywordId=${row.keywordId}`
      }).then(res => {
        let data = res.data.data.keyword
        data.keywordId = row.keywordId
        this.propData = data
        this.propData.title = '编辑'
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
            url: semUrl + '/PhraseKeyword/delKeyword',
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
      this.$Modal.info({
        title: '详情',
        render: (h, params) => {
          return <KeywordDetail data={row} />
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

        accountName: '', // 账户名称
        campaignName: '', // 推广计划
        owner: '', // 责任人
        softName: '', // 产品名
        softNameCheck: '', // 产品名精确搜索
        groupName: '', // 推广组
        groupCheck: '', // 推广组精确搜索
        keyword: '', // 关键字
        keywordCheck: '', // 关键词精确搜索
        appId: '', // 渠道号
        softId: '', // 软件Id
        status: '', // 状态
        reason: '', // 下线原因
        sum: '' // 备注
      }
    },
    // 获取需要发送的数据的数值
    getSendData (data = {}) {
      // 1.字符串字段去空格
      // 2.有值的拷贝到新对象
      // 3.模糊搜索的时候，清空其他字段，新对象只保留部分值
      // 4.非模糊搜索,才有可能表头搜索,转换逗号
      // 5 删除不必要的字段，将处理完的数据合并回源对象

      const multipleArr = ['appId', 'softId'] // 需要转换成逗号分隔的字段
      this.detailHeader = Object.assign(this.detailHeader, data)
      let sendData = {}
      for (let key in this.detailHeader) {
        let value = this.detailHeader[key]
        value = typeof value === 'string' ? value.trim() : value
        if (value) {
          sendData[key] = value
        }
      }

      // 模糊搜索，清空其他内容，重新拿
      if (sendData.text) {
        this.reload()
        const { currPage, pageSize, text, desc, orderby } = sendData
        sendData = { currPage, pageSize, text, desc, orderby }
      } else {
        // 需要多选的
        multipleArr.forEach(key => {
          if (sendData[key]) {
            sendData[key] = sendData[key].split(' ').join(',')
          }
        })
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
  },
  computed: {
    employees () {
      return this.$store.state.user.employees
    }
  }
}
</script>
