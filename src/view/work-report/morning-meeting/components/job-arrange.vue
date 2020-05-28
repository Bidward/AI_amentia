<template>
<div>
    <div class="level-three">
        <div class="searchbar">
            <Input @on-search="getTableData()" @on-clear="getTableData()" v-model="searchContent" placeholder="输入关键字..." search clearable />
            <Button icon="ios-loading" @click="refresh()"></Button>
        </div>
    </div>
    <Table border :loading="loading" :columns="jobTableHeader" :data="jobTableData">
    </Table>
    <div class="tableFooter">
        <Page
        :total="totalCount"
        :page-size="variableObject.pageSize"
        :current="variableObject.currPage" size="small" show-total show-sizer show-elevator
        @on-change="(currPage)=>{variableObject.currPage=currPage;getTableData()}"
        @on-page-size-change="(pageSize)=>{variableObject.pageSize=pageSize;getTableData()}" />
    </div>
</div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
import morningMixins from '../morning-mixins'
import moment from 'moment'
export default {
  name: 'jobArrange',
  mixins: [morningMixins],
  data () {
    return {
      loading: false,
      searchContent: '',
      totalCount: 0,
      variableObject: {
        pageSize: 20,
        currPage: 1
      },
      timeRange: [],
      startTime: '',
      endTime: '',
      arrange: '',
      executor: '',
      source: '',
      jobTableData: [],
      jobTableHeader: [
        {
          title: '序号',
          type: 'index',
          align: 'center'
        },
        {
          title: '时间',
          key: 'time',
          minWidth: 80,
          align: 'center',
          sortable: true,
          renderHeader: (h, params) => {
            return (<span>
              <Poptip transfer={true} placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <Icon type="md-search" size="14"/>
                </span>
                <div slot="content">
                  <div>
                    <DatePicker
                      onOn-ok={() => {
                        this.getTableData()
                      }}
                      onOn-clear={() => {
                        this.timeRange = [null, null]
                        this.getTableData()
                      }}
                      type="daterange"
                      v-model={this.timeRange}
                      confirm
                      placement="bottom-start"
                      placeholder="输入时间"
                    />
                  </div>
                </div>
              </Poptip>
            </span>)
          }
        },
        {
          title: '工作安排',
          key: 'arrange',
          minWidth: 80,
          align: 'center',
          renderHeader: (h, params) => {
            return (<span>
              <Poptip transfer={true} placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <Icon type="md-search" size="14"/>
                </span>
                <div slot="content">
                  <Input
                    v-model={this.arrange}
                    search
                    clearable
                    onOn-search={value => {
                      this.getTableData()
                    }}
                    onOn-clear={() => {
                      this.arrange = ''
                      this.getTableData()
                    }}
                  />
                </div>
              </Poptip>
            </span>)
          }
        },
        {
          title: '执行人',
          key: 'executor',
          minWidth: 80,
          align: 'center',
          renderHeader: (h, params) => {
            return (<span>
              <Poptip transfer={true} placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <Icon type="md-search" size="14"/>
                </span>
                <Select
                  slot="content"
                  filterable
                  clearable
                  onOn-change={() => {
                    this.getTableData()
                  }}
                  onOn-clear={() => {
                    this.executor = ''
                    this.getTableData()
                  }}
                  v-model={this.executor}
                >
                  {this.employees.map(person => {
                    return <Option value={person.id} label={person.nickname}/>
                  })}
                </Select>
              </Poptip>
            </span>)
          }
        },
        {
          title: '数据源',
          key: 'sourceName',
          minWidth: 80,
          sortable: true,
          align: 'center',
          renderHeader: (h, params) => {
            return (<span>
              <Poptip transfer={true} placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <Icon type="md-search" size="14"/>
                </span>
                <div slot="content">
                  <Select
                    slot="content"
                    filterable
                    clearable
                    onOn-change={() => {
                      this.getTableData()
                    }}
                    onOn-clear={() => {
                      this.source = ''
                      this.getTableData()
                    }}
                    v-model={this.source}
                  >
                    <Option value='2' label='任务系统'/>
                    <Option value='1' label='定岗定编'/>
                  </Select>
                </div>
              </Poptip>
            </span>)
          }
        }]
    }
  },
  mounted () {
    this.getTableData()
  },
  methods: {
    refresh () {
      this.source = ''
      this.arrange = ''
      this.executor = ''
      this.timeRange = []
      this.searchContent = ''
      this.getTableData()
    },
    getTableData () {
      let sendData = {
        id: this.$route.query.id,
        source: this.source,
        arrange: this.arrange,
        executor: this.executor,
        currPage: this.variableObject.currPage,
        pageSize: this.variableObject.pageSize
      }
      if (this.timeRange[0]) {
        sendData.startTime = moment(this.timeRange[0]).format('YYYY-MM-DD')
        sendData.endTime = moment(this.timeRange[1]).format('YYYY-MM-DD')
      }
      if (this.searchContent) {
        sendData.searchContent = this.searchContent
      }
      this.$axios({
        url: baseUrl + '/morning/getMorningMeetingArrange',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.jobTableData = res.data.content.pageContent
          this.totalCount = res.data.content.totalCount
          this.currPage = res.data.content.currPage
          this.pageSize = res.data.content.pageSize
          this.$emit('getJobTableData', this.jobTableData)
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    handleRowClick (data) {
      if (data.source === 1) { // 跳到定岗定编
        this.$router.push({ name: 'memberDetail', query: { id: data.routeId } })
      } else { // 跳到任务系统
        this.$router.push({ name: 'detailMorning', query: { id: data.routeId } })
      }
    }

  }
}
</script>

<style lang="" scoped>

</style>
