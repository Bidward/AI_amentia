<template>
    <!-- 已处理 -->
    <div>
        <div class="level-three">
            <div style="float: right">
                <Input class="fuzzySearch"
                    placeholder="输入信息名称/渠道"
                    style="width:200px;margin-right:5px;"
                    v-model.trim="detailHeader.query"
                    @on-enter="()=>{detailHeader.currPage=1;getData()}"
                >
                  <Icon class="pointer" @click="()=>{detailHeader.currPage=1;getData()}" type="ios-search" slot="suffix" />
                  <Icon class="pointer"  type="ios-close-circle-outline" slot="suffix" v-show="detailHeader.query" @click="()=>{reload(1);getData()}"/>
                </Input>
                <Button
                  @click="handleFullScreen"
                  :icon="isFullScreen ? 'md-contract' : 'md-expand'"
                />
                <Button icon="ios-loading" @click="()=>{reload(1);getData()}"></Button>
                <TableHeaderSetting
                    :totalTableHeader="infoBankHeader"
                    :tableHeader.sync="tableHeader"
                    key="infoProBankTabelHeader"
                    localKey="infoProBankTabelHeader"
                    :defaultList="defaultList"
                />
            </div>
        </div>
        <Table
            :loading="tableLoading"
            :columns="tableHeader"
            :data="infoBankData"
            :height="tableHeight"
            border
            @on-sort-change="handleSort"
        >
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" class="marginRight3px" @click="edit(row)">编辑</Button>
                <Button class="simple marginRight3px" size="small" @click="detail(row)">详情</Button>
            </template>
        </Table>
        <div class="clearfix tableFooter">
            <Page
                :total="detailHeader.totalCount"
                :page-size="detailHeader.pageSize"
                :current="detailHeader.currPage"
                size="small"
                show-total
                show-sizer
                show-elevator
                @on-change="(currPage)=>{detailHeader.currPage=currPage;getData()}"
                @on-page-size-change="(pageSize)=>{detailHeader.pageSize=pageSize;detailHeader.currPage=1;getData()}"
                style="float:right;"
            />
        </div>
        <OpLogs :task-logs="Log" @click.native="getLog"></OpLogs>
    </div>
</template>
<script>
import TableHeaderSetting from '_c/table-header-setting'
import { HeaderInput, HeaderSelect } from '_c/table-header-search'
import OpLogs from '../../op-log'
import { staticUrl } from '@/api/base.js'
import mixin from './mixin'
export default {
  name: 'pending',
  components: {
    TableHeaderSetting,
    HeaderInput,
    HeaderSelect,
    OpLogs
  },
  mixins: [mixin],
  data () {
    return {
      staticUrl,
      tableLoading: true,
      detailHeader: {
        userId: this.$store.state.user.userId,
        query: '', // 模糊搜索
        infoName: '', // 信息名称
        releaseDate: '', // 日期
        infoType: '', // 信息类型
        channel: '', // 渠道
        handlePerson: '', // 处理人
        status: '', // 状态
        checkInfo: '', // 信息核对
        infoStatus: 1, // 列表
        orderBy: '', // 根据什么字段排序
        order: '', // 排序的方式
        totalCount: 0,
        pageSize: 20,
        currPage: 1
      },
      Log: [], // 日志
      defaultList: [
        'index',
        'infoName',
        'action',
        'infoType',
        'releaseDate',
        'handlePerson',
        'channel',
        // 'status',
        'checkInfo'
      ], // 默认表头
      // 表头
      infoBankHeader: [
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center',
          key: 'index',
          alwaysShow: true
        },
        {
          title: '日期',
          key: 'releaseDate',
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" />
                  </span>
                  <div slot="content">
                    <div>
                      <DatePicker
                        onOn-change={() => {
                          this.detailHeader.currPage = 1
                          this.getData()
                        }}
                        type="date"
                        v-model={this.detailHeader.releaseDate}
                        placement="bottom-start"
                        placeholder="输入时间"
                      />
                    </div>
                  </div>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '信息名称',
          align: 'center',
          key: 'infoName',
          minWidth: 200,
          renderHeader: (h, params) => {
            let { key, title } = params.column
            return (
              <HeaderInput
                v-model={this.detailHeader[key]}
                title={title}
                clearable={false}
                onOn-search={value => {
                  this.getData({ [key]: value, currPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader[key] = ''
                  this.getData()
                }}
              >
              </HeaderInput>
            )
          }
        },
        {
          title: '渠道',
          align: 'center',
          key: 'channel',
          renderHeader: (h, params) => {
            let { key, title } = params.column
            return (
              <HeaderInput
                v-model={this.detailHeader[key]}
                title={title}
                clearable={false}
                onOn-search={value => {
                  this.getData({ [key]: value, currPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader[key] = ''
                  this.getData()
                }}
              >
              </HeaderInput>
            )
          }
        },
        {
          title: '信息类型',
          align: 'center',
          key: 'infoType',
          sortable: 'custom',
          renderHeader: (h, params) => {
            const options = [
              { label: '政策', value: '政策' },
              { label: '申报通知', value: '申报通知' },
              { label: '兑现通知', value: '兑现通知' },
              { label: '申报公示', value: '申报公示' },
              { label: '兑现公示', value: '兑现公示' }
            ]
            let { key, title } = params.column
            return (
              <HeaderSelect
                options={options}
                key={key}
                title={title}
                clearable
                onOn-change={() => {
                  this.getData()
                }}
                v-model={this.detailHeader.infoType}
              />
            )
          }
        },
        {
          title: '处理人',
          align: 'center',
          key: 'handlePerson'
        },
        {
          title: '信息核对',
          align: 'center',
          key: 'checkInfo',
          renderHeader: (h, params) => {
            const options = [
              { label: '未过白', value: '0' },
              { label: '已过白', value: '1' }
            ]
            let { key, title } = params.column
            return (
              <HeaderSelect
                options={options}
                key={key}
                title={title}
                clearable
                onOn-change={() => {
                  this.getData()
                }}
                v-model={this.detailHeader.status}
              />
            )
          }
        },
        {
          title: '操作',
          slot: 'action',
          key: 'action',
          align: 'center',
          alwaysShow: true
        }
      ],
      tableHeader: [], // 表头
      infoBankData: [] // 数据
    }
  },
  mounted () {
    this.setTableHeight()
  },
  methods: {
    // getLog(){}
  }
}
</script>

<style lang="css" scoped>
.fuzzySearch>>>span {
  margin: 0 4px;
}
</style>
