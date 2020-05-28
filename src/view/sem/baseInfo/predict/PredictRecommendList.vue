<template>
  <div id="semDayList">
    <div class="level-three clearfix">
      <!-- <Button @click="exportExcel">导出</Button> -->
      <div class="searchbar">
        <Input
          @on-search="()=>{detailHeader.currPage=1;detailSearch()}"
          placeholder="产品编码"
          search
          clearable
          v-model="detailHeader.text"
          style="width:200px;margin-right:5px;"
        />
        <Button icon="ios-loading" @click="()=>{reload();detailSearch()}" />
      </div>
    </div>
    <Table border :columns="tableHeader" :data="tableContent" key="staticDayList">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" v-if="permission.update" @click="uptSoftProfit(row)">编辑</Button>
      </template>
    </Table>
    <preditEdit v-if="show" :show.sync="show" :propData="propData" @on-success="detailSearch" />
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
import { semPermissionMixin } from '../../tools'
import preditEdit from './preditEdit'
import { Track } from '@/libs/track.js'
const track = new Track('营销/基础信息/预估收益配置')
export default {
  name: 'profitchglist',
  mixins: [semPermissionMixin],
  components: {
    preditEdit
  },
  data () {
    return {
      show: false,
      propData: {},
      detailHeader: {
        totalCount: 0,
        pageSize: 20,
        currPage: 1,
        softType: '',
        text: ''
      },
      tableHeader: [
        { title: '序号', type: 'index', align: 'center', minWidth: 100 },
        { title: '产品编码', key: 'softCode', align: 'center', minWidth: 100 },
        {
          title: '类型',
          key: 'softType',
          align: 'center',
          minWidth: 100,
          render: (h, { row, params }) => {
            return <span>{row.softType === '1' ? '软件' : '换包'}</span>
          },
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Select
                      v-model={this.detailHeader.softType}
                      v-on:on-change={value => {
                        this.detailSearch({ softType: value, currPage: 1 })
                      }}
                    >
                      <Option value="">全部</Option>
                      <Option value="1">软件</Option>
                      <Option value="2">换包</Option>
                    </Select>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.softType ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: 'cpm(安装)',
          key: 'softPriceAuto',
          align: 'center',
          minWidth: 100
        },
        {
          title: '人工配置cpm',
          key: 'softPriceSelf',
          align: 'center',
          minWidth: 100
        },
        {
          title: '配置生效日期',
          key: 'expireTime',
          align: 'center',
          minWidth: 100,
          render: (h, { row }) => {
            if (!row.expireEndTime) {
              return <span></span>
            }
            return (
              <span>
                {row.expireStartTime}~{row.expireEndTime}
              </span>
            )
          }
        },
        { title: '备注', key: 'sum', align: 'center', minWidth: 100 },
        { title: '操作', slot: 'action', align: 'center', minWidth: 100 }
      ],
      tableContent: []
    }
  },
  beforeCreate () {
    track.start()
  },
  mounted () {
    this.detailSearch()
  },
  methods: {
    detailSearch () {
      let { pageSize, currPage, softType, text } = this.detailHeader
      this.$axios({
        url: semUrl + '/Deploy/softProfit',
        method: 'post',
        data: $qs.stringify({ pageSize, currPage, softType, text })
      }).then(res => {
        if (res.data.code === 10000) {
          let { pageContent, totalCount } = res.data.content
          this.tableContent = pageContent
          this.detailHeader.totalCount = totalCount
          this.$nextTick(() => {
            track.end()
          })
        }
      })
    },
    uptSoftProfit (row) {
      this.show = true
      this.propData = row
    },
    reload () {
      this.detailHeader = {
        totalCount: 0,
        pageSize: 20,
        currPage: 1,
        softType: '',
        text: ''
      }
    }
  }
}
</script>
