<template>
    <!-- 建立联系 -->
    <div>
        <div class="searchbox">
            <Input
              placeholder="输入渠道名称"
              style="width:200px;margin-right:5px;"
              v-model="detailHeader.query"
              @on-enter="() => {detailHeader.currPage=1; getData()}"
            >
               <!-- @on-search="()=>{detailHeader.currPage=1;getData()}" -->
            <Icon
                @click="() => {detailHeader.currPage=1; getData()}"
                class="pointer"
                type="ios-search"
                slot="suffix"
              />
              <Icon
                v-show="detailHeader.query"
                @click="()=>{ detailHeader.query = '' ; getData(); }"
                class="pointer"
                type="ios-close-circle-outline"
                slot="suffix"
              />
            </Input>
            <Button :icon="isFullScreen?'md-contract':'md-expand'" @click="handleFullScreen"></Button>
            <Button icon="ios-loading"  @click="()=>{reload();getData()}"></Button>
            <TableHeaderSetting
                :totalTableHeader="channelHeader"
                :tableHeader.sync="tableHeader"
                key="channelSetContactTabelHeader"
                localKey="channelSetContactTabelHeader"
                :defaultList="defaultList"
            />
        </div>
        <Table :loading="loading" :columns="tableHeader" :max-height="tableHeight" :data="channelData" border @on-sort-change="handleSort">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" class="marginRight3px" @click="edit(row)" v-if="row.updateShow" :disabled="row.updateGrey">编辑</Button>
                <Button type="error" size="small" @click="del(row)" v-if="row.deleteShow" :disabled="row.deleteGrey">删除</Button>
                <Button class="simple marginRight3px" size="small" @click="detail(row)" v-if="row.detailShow" :disabled="row.detailGrey">详情</Button>
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
                @on-page-size-change="(pageSize)=>{detailHeader.pageSize=pageSize;getData()}"
                style="float:right;"
            />
        </div>
        <OpLogs
          v-if="!isFullScreen"
          style="padding-bottom: 0; margin-top: 0"
          :task-logs="channelLog"
          @click.native="getLog"

        ></OpLogs>
    </div>
</template>
<script>
import mixins from './mixins'
import OpLogs from './../../op-log' // 日志
export default {
  name: 'channelSetContact',
  components: {
    OpLogs
  },
  props: {
    isFullScreen: {
      type: Boolean,
      default: false
    },
    tableHeight: {
      type: Number,
      default: 500
    }
  },
  mixins: [mixins],
  data () {
    return {
      defaultList: [
        'index',
        'channelName', // 渠道名称
        'channelType', // 渠道类型
        'marketResponsibleName', // 市场
        'channelSource', // 来源
        'companyName', // 公司名称
        'checkInfo', // 信息核对
        'action'
      ]
    }
  },
  mounted () {
    console.log(132456)
  },
  methods: {
    // detailSearch () {}
  }
}
</script>
<style scoped>
.searchbox {
    margin-bottom: 10px;
    text-align: right;
    margin-top: -30px;
}
</style>
