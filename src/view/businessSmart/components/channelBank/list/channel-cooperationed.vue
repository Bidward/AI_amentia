<template>
    <!-- 已合作 -->
    <div>
        <div class="searchbox">
            <Input
                placeholder="输入渠道名称"
                @on-enter="() => {detailHeader.currPage=1; getData()}"
                style="width:200px;margin-right:5px;"
                v-model="detailHeader.query"
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
            <Button icon="ios-loading" @click="()=>{reload();getData()} "></Button>
            <TableHeaderSetting
                :totalTableHeader="channelHeader"
                :tableHeader.sync="tableHeader"
                key="channelCooperationedTabelHeader"
                localKey="channelCooperationedTabelHeader"
                :defaultList="defaultList"
            />
        </div>
        <Table
            :loading="loading"
            :columns="tableHeader"
            :data="channelData"
            border
            :max-height="tableHeight"
            @on-sort-change="handleSort"
        >
            <template slot-scope="{ row, index }" slot="action">
                <Button
                    type="primary"
                    size="small"
                    class="marginRight3px"
                    @click="edit(row)"
                    v-if="row.updateShow"
                    :disabled="row.updateGrey"
                >编辑</Button>
                <Button
                    type="error"
                    size="small"
                    @click="del(row)"
                    v-if="row.deleteShow"
                    :disabled="row.deleteGrey"
                >删除</Button>
                <Poptip placement="bottom" content="content" id="moreButtomPop">
                    <Button class="simple" size="small" style="margin-right: 5px;">更多</Button>
                    <div slot="content" style="padding: 8px 30px;">
                        <Button
                            type="error"
                            size="small"
                            @click="stop(row)"
                            v-if="row.terminateShow"
                            :disabled="row.terminateGrey"
                        >终止</Button>
                        <Button
                            class="simple"
                            size="small"
                            @click="detail(row)"
                            v-if="row.detailShow"
                            :disabled="row.detailGrey"
                        >详情</Button>
                    </div>
                </Poptip>
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
  name: 'channelCooperationed',
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
  components: {
    OpLogs
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
  mounted () {},
  methods: {
    // detailSearch() {}
  }
}
</script>
<style scoped>
.searchbox {
    margin-bottom: 10px;
    text-align: right;
    margin-top: -30px;
}
.choose {
    cursor: pointer;
}
.choose:hover {
    color: #19aa8d;
}
</style>
