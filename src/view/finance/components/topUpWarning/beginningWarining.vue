<template>
  <!--期初-->
  <div id="beginningWarining">
    <div class="level-three">
      <Upload
        ref="upload"
        style="display:inline"
        name="file"
        accept=".xlsx, .xls, .cvs"
        :format="['xlsx', 'xls', 'cvs']"
        :action="baseUrl + '/importrechargecommence'"
        :show-upload-list="false"
        :with-credentials="true"
        :on-success="uploadSuccess"
        v-if="permission.w_edit"
      >
        <Button class="btns">导入</Button>
      </Upload>
      <!-- <DatePicker
        confirm
        @on-ok="handleOk"
        placeholder="选择月份查看"
        style="width: 200px"
        v-model="data.date"
        :clearable="false"
        v-if="permission.w_edit"
      ></DatePicker> -->
      <span>{{data.date}}</span>
      <div class="searchbar">
        <Input
          class="fuzzySearch"
          maxlength="50"
          @on-enter="() => {detailHeader.currPage = 1;detailSearch();}"
          v-model="detailHeader.businessName"
          placeholder="输入厂商"
          style="width:200px;margin-right:5px;"
        >
          <Icon
              class="pointer"
              @click="()=>{detailHeader.currPage=1;detailSearch()}"
              type="ios-search"
              slot="suffix"
           />
          <Icon
               class="pointer"
               type="ios-close-circle-outline"
               slot="suffix"
               v-show="detailHeader.businessName"
               @click="()=>{reload(0);detailSearch()}"
            />
        </Input>
        <Button
          :icon="isFullScreen ? 'md-contract' : 'md-expand'"
          @click="handleFullScreen"
        />
        <Button
          class="btns"
          icon="ios-loading"
          @click="
            () => {
              reload();
              detailSearch();
            }
          "
        />
        <TableHeaderSetting
          :totalTableHeader="totalTableHeader"
          :tableHeader.sync="tableHeader"
          key="beginningWarining"
          localKey="beginningWarining"
        />
      </div>
    </div>
    <Table
      :columns="tableHeader"
      :data="dataText"
      border
      show-summary
      :max-height="tableHeight"
      :summary-method="handleSummary"
      @on-sort-change="sortChange"
    >
      <template slot-scope="{ row }" slot="action">
        <Button
          class="btns"
          type="primary"
          size="small"
          @click="editWarining(row)"
           v-if="permission.w_edit"
          >编辑</Button
        >
      </template>
    </Table>
    <div class="tableFooter clearfix">
      <Page
        :total="detailHeader.sum"
        :page-size="detailHeader.pageSize"
        :current="detailHeader.currPage"
        :page-size-opts="[20, 50, 100]"
        size="small"
        show-total
        show-elevator
        show-sizer
        @on-change="
          currPage => {
            detailHeader.currPage = currPage;
            detailSearch();
          }
        "
        @on-page-size-change="
          pageSize => {
            detailHeader.pageSize = pageSize;
            detailSearch();
          }
        "
      />
    </div>
    <editWarining
      v-if="showEdit"
      :showEdit.sync="showEdit"
      @updataList="detailSearch"
      :id="id"
      :businessName="businessName"
    />
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
import moment from 'moment'
import TableHeaderSetting from '_c/table-header-setting'
import editWarining from './editWarining'
import { HeaderInput, HeaderSelect } from '_c/table-header-search'
import mixin from '../../mixin'
export default {
  name: 'beginningWarining',
  components: {
    TableHeaderSetting,
    editWarining,
    HeaderInput,
    HeaderSelect
  },
  mixins: [mixin],
  data () {
    return {
      baseUrl: baseUrl,
      showEdit: false,
      data: {
        date: '' // 时间
      },
      tableHeader: [],
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
          title: '厂商名称',
          key: 'businessName',
          minWidth: 110,
          align: 'center',
          alwaysShow: false,
          sortable: true
        },
        {
          title: '期初金额',
          key: 'initialAmount',
          minWidth: 110,
          align: 'center',
          sortable: true,
          alwaysShow: false,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <div>
                      <Select
                        v-model={this.detailHeader.condition}
                        style="width:30%;margin-top:0px"
                        placeholder="请输入条件"
                      >
                        <Option value="1">&gt;</Option>
                        <Option value="2">&lt;</Option>
                        <Option value="3">=</Option>
                        <Option value="4">&le;</Option>
                        <Option value="5">&ge;</Option>
                        <Option value="6">!=</Option>
                      </Select>
                      <Input
                        style="width:70%"
                        v-model={this.detailHeader.initialAmount}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            initialAmount: value,
                            currPage: 1
                          })
                        }}
                        onOn-clear={() => {
                          this.detailSearch({ currPage: 1 })
                        }}
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.initialAmount ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '商务',
          key: 'business',
          minWidth: 100,
          align: 'center',
          alwaysShow: false,
          sortable: true,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <div>
                      <Input
                        v-model={this.detailHeader.business}
                        clearable
                        slot="content"
                        search
                        onOn-search={value => {
                          this.detailSearch({
                            business: value,
                            currPage: 1
                          })
                        }}
                        onOn-clear={() => {
                          this.detailSearch({ currPage: 1 })
                        }}
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.business ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          slot: 'action',
          minWidth: 140,
          align: 'center',
          alwaysShow: false
        }
      ],
      dataText: [],
      sum: {},
      detailHeader: {
        sum: 0,
        pageSize: 20,
        currPage: 1,
        orderby: '', // 根据什么字段排序
        desc: '', // 排序的方式
        businessName: '', // 厂商名称
        business: '' // 厂商
      }
    }
  },
  mounted () {
    this.detailSearch()
    this.setTableHeight()
    this.reseveDate()
  },
  methods: {
    // 上传
    uploadSuccess (res) {
      if (res.code === 10000) {
        this.$Message.success(res.msg)
        this.detailSearch()
      } else if (res.code === 10101) {
        this.$Message.error(res.msg)
      } else {
        this.$Message.error(res.msg)
      }
    },
    // 排序
    sortChange (column) {
      let orderby = column.key
      let desc = column.order
      this.detailSearch({ orderby, desc })
      this.detailHeader.orderby = column.key
      this.detailHeader.desc = column.order
    },
    // 获取日期
    reseveDate () {
      this.$axios({
        url: baseUrl + '/accountingwarning/remonth',
        methods: 'post',
        data: $qs.stringify()
      }).then(res => {
        let date = res.data.content
        this.data.date = date
      })
    },
    // 选择日期
    handleOk (e) {
      let date = moment(this.data.date).format('YYYY-MM-DD')
      let sendData = {
        date
      }
      this.$axios({
        url: baseUrl + '/accountingwarning/upmonth',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.$Message.success(res.data.msg)
          this.detailSearch()
        }
      })
    },
    detailSearch (data = {}) {
      let sendData = this.getSendData(data)
      this.$axios({
        url: baseUrl + '/accountingwarning/commence',
        data: $qs.stringify(sendData),
        method: 'post'
      }).then(res => {
        this.dataText = res.data.content.listRecharge
        this.detailHeader.sum = res.data.content.sum
        let totalsum = res.data.content.totalSum
        let sum = {
          index: { key: 'index', value: '' },
          businessName: { key: 'businessName', value: '合计' },
          initialAmount: { key: 'initialAmount', value: totalsum },
          business: { key: 'index', value: '' },
          action: { key: 'action', value: '' }
        }
        this.sum = sum
      })
      this.setTableHeight()
    },
    // 总计
    handleSummary () {
      return this.sum
    },
    // 获取需要发送的数据的数值
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
      for (let key in data) {
        if (typeof data[key] === 'string') {
          data[key] = data[key].trim()
        }
      }
      if (sendData.productCode) {
        // 清空搜索
        this.reload()
        sendData.productCode = sendData.productCode.trim()
        this.detailHeader.productCode = sendData.productCode
      }
      delete sendData.timeRange
      delete sendData.sum
      sendData = Object.assign(sendData, data)
      // 如果排序清空，不需要带排序条件
      if (sendData.desc === 'normal') {
        delete sendData.orderby
        delete sendData.desc
      }
      this.detailHeader.currPage = sendData.currPage
      return sendData
    },
    // 清空表头
    reload (data = {}) {
      let initData = {
        totalCount: 0,
        pageSize: 20,
        currPage: 1,
        orderby: '', // 根据什么字段排序
        desc: 'normal', // 排序的方式
        businessName: '' // 厂商名称
      }
      this.reseveDate()
      this.detailHeader = Object.assign(initData, data)
      return this.detailHeader
    },
    // 编辑
    editWarining ({ id, businessName }) {
      this.id = id
      this.businessName = businessName
      this.showEdit = true
    }
  },
  computed: {
    permission () {
      return this.$store.state.user.userpermission.finance
    }
  }
}
</script>
<style lang="css" scoped>
.fuzzySearch >>> span {
  margin: 0 4px;
}
</style>
