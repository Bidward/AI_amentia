<template>
  <div>
    <div class="level-three clearfix">
      <Button
        type="primary"
        class="searchbarLeft btns"
        v-if="permission.create"
        @click="addExtension()"
      >新增</Button>
      <Button class="searchbarLeft" @click="exportExcel">导出</Button>
      <div class="searchbar">
        <Input
          @on-search="(text)=>{detailSearch({text,currPage:1})}"
          placeholder="推广组、推广计划、责任人"
          search
          clearable
          v-model="detailHeader.text"
        />
        <Button class="btns" icon="ios-loading" @click="()=>{reload();detailSearch()} "></Button>
        <TableHeaderSetting :totalTableHeader="totalTableHeader" :tableHeader.sync="tableHeader" />
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
      <template slot-scope="{ row, index }" slot="edit">
        <Button
          class="btns"
          type="primary"
          v-if="permission.update"
          @click="editExtension(row,index)"
        >编辑</Button>
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
        @on-change="(currPage)=>{detailSearch({currPage})}"
        @on-page-size-change="(pageSize)=>{detailSearch({pageSize})}"
      />
    </div>
  </div>
</template>
<script>
// import moment from 'moment'
import { semUrl } from '@/api/base.js'
import TableHeaderSetting from '_c/table-header-setting'
import { semPermissionMixin } from '../../tools'
import { HeaderInput, HeaderSelect } from '_c/table-header-search'
import { Track } from '@/libs/track'
const track = new Track('营销/短语模式/推广组')
export default {
  name: 'shortGroup',
  components: {
    TableHeaderSetting,
    HeaderInput,
    HeaderSelect
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
        {
          title: '账户名称',
          key: 'accountName',
          align: 'center',
          width: 100,
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          title: '推广计划',
          key: 'campaignName',
          align: 'center',
          minWidth: 120,
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          title: '推广组',
          key: 'groupName',
          align: 'center',
          minWidth: 120,
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
          title: '产品名',
          key: 'softName',
          align: 'center',
          minWidth: 120,
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
          title: '责任人',
          key: 'owner',
          align: 'center',
          minWidth: 120,
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          width: 100,
          renderHeader: (h, params) => {
            const options = [
              { label: '全部', value: '' },
              { label: '启用', value: 'enabled' },
              { label: '停用', value: 'stop' }
            ]
            let { key, title } = params.column
            return (
              <HeaderSelect
                options={options}
                key={key}
                title={title}
                onOn-change={data => {
                  this.detailSearch({ currPage: 1 })
                }}
                v-model={this.detailHeader.status}
              />
            )
          }
        },
        {
          title: '备注',
          key: 'sum',
          align: 'center',
          minWidth: 100,
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
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
        text: '', // 模糊搜索
        orderby: '', // 根据什么字段排序
        desc: 'normal', // 排序的方式
        accountName: '', // 账户名
        campaignName: '', // 推广计划
        groupName: '', // 推广组
        groupCheck: '', // 推广组精确搜索
        softName: '', // 产品名
        softNameCheck: '', // 产品名精确搜索
        owner: '', // 责任人
        status: '', // 状态
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
    // 导出excel
    exportExcel () {
      let sendData = this.getSendData()
      sendData.type = 'expt'
      delete sendData.pageSize
      delete sendData.currPage
      delete sendData.text
      let data = $qs.stringify(sendData)
      window.open(semUrl + '/PhraseGroup/index?' + data)
    },
    // 搜索
    detailSearch (getData = {}) {
      let sendData = this.getSendData(getData)
      this.$axios({
        url: semUrl + '/PhraseGroup/index',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          let content = res.data
          this.tableContent = content.list
          this.detailHeader.totalCount = content.totalCount
          this.detailHeader.currPage = content.pageNum
          this.setTableHeight()
          track.end()
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
    },

    // 到新增的页面
    addExtension () {
      this.$router.push({
        name: 'editShortGroup',
        params: { title: 'add', groupId: 0 }
      })
    },
    // 到编辑页面
    editExtension ({ groupId }, index) {
      this.$router.push({
        name: 'editShortGroup',
        params: { groupId, title: '编辑' }
      })
    },
    // 删除推广组
    deltetExtension (row) {
      this.$Modal.confirm({
        title: '提示',
        content: `是否删除推广组 ${row.groupName}`,
        onOk: () => {
          this.$axios({
            url: semUrl + `/PhraseGroup/delGroup?groupId=${row.groupId}`
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
        }
      })
    },
    // 清空搜索条件
    reload () {
      // 页面初始化的时候的数据
      this.detailHeader = {
        currPage: 1,
        pageSize: 20,
        totalCount: 0,
        text: '', // 模糊搜索
        orderby: '', // 根据什么字段排序
        desc: 'normal', // 排序的方式

        accountName: '', // 账户名
        campaignName: '', // 推广计划
        groupName: '', // 推广组
        groupCheck: '', // 推广组精确搜索
        softName: '', // 产品名
        softNameCheck: '', // 产品名精确搜索
        owner: '', // 责任人
        status: '', // 状态
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

      // 模糊搜索，清空其他内容
      if (sendData.text) {
        this.reload(sendData.text)
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
    },
    // 到详情页面
    toDetail (row) {
      this.$router.push({
        name: 'showShortGroup',
        params: { groupId: row.groupId }
      })
    }
  }
}
</script>
