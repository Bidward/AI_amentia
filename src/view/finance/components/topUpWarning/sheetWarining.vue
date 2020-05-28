<template>
  <div id="sheetWarining">
    <div class="level-three clearfix">
      <Button @click="exportExcel">导出</Button>
      <DatePicker
        :editable='false'
        type="daterange"
        placeholder="选择日期搜索"
        style="width: 200px;"
        @on-change="detailSearch()"
        :clearable="false"
        v-model="detailHeader.timeRange"
      />
      <Button type="primary" style="margin-left:7px" @click="warningRefresh()">预警数据刷新</Button>
      <div class="searchbar">
        <Input
          class="fuzzySearch"
          maxlength="50"
          @on-enter="() => {detailHeader.currPage = 1;detailSearch();}"
          v-model.trim="detailHeader.businessName"
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
          :defaultList='defaultList'
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
      :loading="loading"
      key="sheetWarining"
    >
    </Table>
    <div class="tableFooter clearfix">
      <Page
        :total="detailHeader.sum"
        :page-size="detailHeader.pageSize"
        :current="detailHeader.currPage"
        :page-size-opts="[10, 20, 50, 100]"
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
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
import moment from 'moment'
import TableHeaderSetting from '_c/table-header-setting'
import { HeaderInput, HeaderSelect } from '_c/table-header-search'
import mixin from '../../mixin'
export default {
  name: 'sheetWarining',
  components: {
    TableHeaderSetting,
    HeaderInput,
    HeaderSelect
  },
  mixins: [mixin],
  data () {
    return {
      defaultList: [
        'index', 'businessName', 'initialAmount', 'recharge',
        'refund', 'destroy', 'destroyAdd', 'destroyReduce',
        'finalAmount', 'weekDown', 'downAmount', 'downDay'
      ],
      loading: true,
      tableHeader: [],
      totalTableHeader: [
        {
          title: '序号',
          type: 'index',
          key: 'index',
          minWidth: 40,
          align: 'center',
          alwaysShow: true
        },
        {
          title: '厂商',
          key: 'businessName',
          minWidth: 90,
          align: 'center',
          sortable: true,
          render: (h, params) => {
            let { downDay, businessName } = params.row
            if (downDay <= 7) {
              let str = `${businessName}`
              return <span style="color:red">{str}</span>
            } else {
              let str = `${businessName}`
              return <span>{str}</span>
            }
          }
        },
        {
          title: '期初金额',
          key: 'initialAmount',
          minWidth: 100,
          align: 'center',
          alwaysShow: false,
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span style="width:200px">
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
          title: '充值',
          key: 'recharge',
          minWidth: 80,
          align: 'center',
          alwaysShow: false,
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span style="width:200px">
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
                        v-model={this.detailHeader.recharge}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            recharge: value,
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
                      class={this.detailHeader.recharge ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '退款',
          key: 'refund',
          minWidth: 80,
          align: 'center',
          alwaysShow: false,
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span style="width:200px">
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
                        v-model={this.detailHeader.refund}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            refund: value,
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
                      class={this.detailHeader.refund ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '消耗',
          key: 'destroy',
          minWidth: 80,
          align: 'center',
          alwaysShow: false,
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span style="width:200px">
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
                        v-model={this.detailHeader.destroy}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            destroy: value,
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
                      class={this.detailHeader.destroy ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '核增',
          key: 'destroyAdd',
          minWidth: 80,
          align: 'center',
          alwaysShow: false,
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span style="width:200px">
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
                        v-model={this.detailHeader.destroyAdd}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            destroyAdd: value,
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
                      class={this.detailHeader.destroyAdd ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '核减',
          key: 'destroyReduce',
          minWidth: 80,
          align: 'center',
          alwaysShow: false,
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span style="width:200px">
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
                        v-model={this.detailHeader.destroyReduce}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            destroyReduce: value,
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
                      class={this.detailHeader.destroyReduce ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '期末金额',
          key: 'finalAmount',
          minWidth: 100,
          align: 'center',
          alwaysShow: false,
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span style="width:200px">
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
                        v-model={this.detailHeader.finalAmount}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            finalAmount: value,
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
                      class={this.detailHeader.finalAmount ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '可消耗余额',
          key: 'destroyAmount',
          minWidth: 110,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span style="width:200px">
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
                        v-model={this.detailHeader.destroyAmount}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            destroyAmount: value,
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
                      class={this.detailHeader.destroyAmount ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '阿拉丁未核销',
          key: 'aladdinNoCancel',
          minWidth: 120,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span style="width:200px">
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
                        v-model={this.detailHeader.aladdinNoCancel}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            aladdinNoCancel: value,
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
                      class={this.detailHeader.aladdinNoCancel ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '下载器未核销',
          key: 'downNoCancel',
          minWidth: 120,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span style="width:200px">
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
                        v-model={this.detailHeader.downNoCancel}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            downNoCancel: value,
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
                      class={this.detailHeader.downNoCancel ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '7日最高(阿拉丁)',
          key: 'weekAladdin',
          minWidth: 135,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span style="width:200px">
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
                        v-model={this.detailHeader.weekAladdin}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            weekAladdin: value,
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
                      class={this.detailHeader.weekAladdin ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '7日最高(下载器)',
          key: 'weekDown',
          minWidth: 135,
          align: 'center',
          alwaysShow: false,
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span style="width:200px">
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
                        v-model={this.detailHeader.weekDown}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            weekDown: value,
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
                      class={this.detailHeader.weekDown ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '下载器余额',
          key: 'downAmount',
          minWidth: 110,
          align: 'center',
          alwaysShow: false,
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span style="width:200px">
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
                        style="width:70%;"
                        v-model={this.detailHeader.downAmount}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            downAmount: value,
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
                      class={this.detailHeader.downAmount ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '下载器剩余天数',
          key: 'downDay',
          minWidth: 135,
          align: 'center',
          alwaysShow: false,
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span style="width:200px">
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
                        style="width:70%;"
                        v-model={this.detailHeader.downDay}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            downDay: value,
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
                      class={this.detailHeader.downDay ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          },
          render: (h, params) => {
            let { downDay } = params.row
            if (downDay <= 7) {
              let str = `${downDay}`
              return <span style="color:red">{str}</span>
            } else {
              let str = `${downDay}`
              return <span>{str}</span>
            }
          }
        }
      ],
      dataText: [],
      sum: {
        index: { key: 'index', value: '' },
        businessName: { key: 'businessName', value: '' },
        initialAmount: { key: 'initialAmount', value: '' },
        recharge: { key: 'recharge', value: '' },
        refund: { key: 'refund', value: '' },
        destroy: { key: 'destroy', value: '' },
        destroyAdd: { key: 'destroyAdd', value: '' },
        destroyReduce: { key: 'destroyReduce', value: '' },
        aladdinNoCancel: { key: 'aladdinNoCancel', value: '' },
        downNoCancel: { key: 'downNoCancel', value: '' },
        finalAmount: { key: 'finalAmount', value: '' },
        destroyAmount: { key: 'destroyAmount', value: '' },
        weekAladdin: { key: 'weekAladdin', value: '' },
        weekDown: { key: 'weekDown', value: '' },
        downAmount: { key: 'downAmount', value: '' },
        downDay: { key: 'downDay', value: '' }
      },
      detailHeader: {
        sum: 0,
        pageSize: 20,
        currPage: 1,
        orderby: '', // 根据什么字段排序
        desc: 'normal', // 排序的方式
        timeRange: [], // 时间范围
        businessName: this.$route.query.businessName || '', // 厂商
        condition: '3'
      },
      isFullScreen: false
    }
  },
  mounted () {
    this.detailSearch()
  },
  methods: {
    // 预警数据刷新
    warningRefresh () {
      this.$axios({
        url: baseUrl + '/accountingwarning/refreshcach',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.$Message.success(res.data.msg)
        }
      })
    },
    // 代办事项跳转并搜索
    test () {
      let detailName = this.$route.query.businessName
      if (detailName) {
        this.detailHeader.businessName = detailName
        this.detailSearch()
      }
    },
    // 导出excel
    exportExcel () {
      let sendData = this.getSendData()
      sendData.type = 'expt'
      delete sendData.pageSize
      delete sendData.currPage
      delete sendData.productCode
      let data = $qs.stringify(sendData)
      window.open(baseUrl + '/accountingwarning/exportrecharge?' + data)
    },
    // 排序
    sortChange (column) {
      let orderby = column.key
      let desc = column.order
      this.detailSearch({ orderby, desc })
      this.detailHeader.orderby = column.key
      this.detailHeader.desc = column.order
    },
    detailSearch (data = {}) {
      this.loading = true
      let sendData = this.getSendData(data)
      this.$axios({
        url: baseUrl + '/accountingwarning/sumrecharge',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        let dataSum = res.data.content
        let totalInitialAmount = dataSum.totalInitialAmount // 期初
        let totalRecharge = dataSum.totalRecharge // 充值
        let totalRefund = dataSum.totalRefund // 退款
        let totalDestroy = dataSum.totalDestroy // 核销
        let totalDestroyAdd = dataSum.totalDestroyAdd // 核增
        let totalDestroyReduce = dataSum.totalDestroyReduce // 核减
        let totalAladdinNoCancel = dataSum.totalAladdinNoCancel // 阿拉丁未核销
        let totalDownNoCancel = dataSum.totalDownNoCancel // 下载器未核销
        let totalFinalAmount = dataSum.totalFinalAmount // 期末金额
        let totalDestroyAmount = dataSum.totalDestroyAmount // 可销毁余额
        // let weekAladdin = dataSum.weekAladdin // 七日最高阿拉丁
        // let weekDown = dataSum.weekDown // 七日下载器
        let totalDownAmount = dataSum.totalDownAmount // 下载器余额
        let sum = {
          index: { key: 'index', value: '' },
          businessName: { key: 'businessName', value: '合计金额' },
          initialAmount: { key: 'initialAmount', value: totalInitialAmount },
          recharge: { key: 'recharge', value: totalRecharge },
          refund: { key: 'refund', value: totalRefund },
          destroy: { key: 'destroy', value: totalDestroy },
          destroyAdd: { key: 'destroyAdd', value: totalDestroyAdd },
          destroyReduce: { key: 'destroyReduce', value: totalDestroyReduce },
          aladdinNoCancel: {
            key: 'aladdinNoCancel',
            value: totalAladdinNoCancel
          },
          downNoCancel: { key: 'downNoCancel', value: totalDownNoCancel },
          finalAmount: { key: 'finalAmount', value: totalFinalAmount },
          destroyAmount: { key: 'destroyAmount', value: totalDestroyAmount },
          weekAladdin: { key: 'weekAladdin', value: '' },
          weekDown: { key: 'weekDown', value: '' },
          downAmount: { key: 'downAmount', value: totalDownAmount },
          downDay: { key: 'downDay', value: '' }
        }
        this.sum = sum
      })
      this.$axios({
        url: baseUrl + '/accountingwarning/rechargecollect',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        this.dataText = res.data.content.listRecharge
        this.detailHeader.sum = res.data.content.sum
        let startdate = res.data.content.startdate
        let enddate = res.data.content.enddate
        let timeRange = [startdate, enddate]
        this.detailHeader.timeRange = timeRange
        this.loading = false
      })
      this.setTableHeight()
    },
    // 合计
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
      if (sendData.timeRange[1]) {
        sendData.startdate = moment(sendData.timeRange[0]).format('YYYY-MM-DD')
        sendData.enddate = moment(sendData.timeRange[1]).format('YYYY-MM-DD')
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
      // 未核销刷新;
      this.$axios({
        url: baseUrl + '/accountingwarning/refreshnocancel',
        method: 'post'
      })
      let initData = {
        currPage: 1,
        pageSize: 20,
        totalCount: 0,
        orderby: '', // 根据什么字段排序
        desc: 'normal', // 排序的方式
        timeRange: [] // 时间范围
      }
      this.detailHeader = Object.assign(initData, data)
      return this.detailHeader
    }
  }
}
</script>
<style lang="css" scoped>
.fuzzySearch >>> span {
  margin: 0 4px;
}
</style>
