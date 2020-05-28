<template>
    <!-- 已合作联系 -->
    <div>
        <div class="searchbox">
            <Input
              placeholder="输入产品名称"
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
            <Button icon="ios-loading" @click="()=>{reload();getData()}"></Button>
            <TableHeaderSetting
                :totalTableHeader="productHeader"
                :tableHeader.sync="tableHeader"
                key="productCooperationedTabelHeader"
                localKey="productCooperationedTabelHeader"
                :defaultList="defaultList"
            />
        </div>
        <Table :loading="loading" :columns="tableHeader" :max-height="tableHeight" :data="productData" border @on-sort-change="handleSort">
            <template slot-scope="{ row, index }" slot="action">
                <Button
                    type="primary"
                    size="small"
                    class="marginRight3px"
                    @click="edit(row)"
                    v-if="row.editPermission"
                    :disabled="!row.editType"
                >编辑</Button>
                <Button type="error" size="small" @click="del(row)" v-if="row.deletePermission"  :disabled="!row.deleteType" >删除</Button>
                <Poptip placement="bottom" content="content" id="moreButtomPop">
                    <Button class="simple" size="small" style="margin-right: 5px;">更多</Button>
                    <div slot="content" style="padding: 8px 30px;">
                        <Button  class="choose" size="small" type="error" @click="contractTermination(row)" v-if="row.terminationPermission"  :disabled="!row.terminationType">终止</Button>
                        <Button  class="choose" size="small" @click="detail(row)"  >详情</Button>
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
        <OpLogs v-if="!isFullScreen" style="padding-bottom: 0; margin-top: 0" :task-logs="productLog" @click.native="getLog"></OpLogs>
    </div>
</template>
<script>
import mixins from './mixins'
export default {
  name: 'productCooperationed',
  mixins: [mixins],
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
  data () {
    return {
      loading: false,
      productData: [],
      defaultList: [
        'index',
        'productName', // 产品名称
        'businessAffairs', // 商务
        'contractTime', // 合同状态
        'productPass', // 信息核对
        'secondSigningPeople', // 签订人
        'action'
      ],
      detailHeader: {
        totalCount: 0,
        pageSize: 20,
        currPage: 1
      }
    }
  },
  created () {
  },
  methods: {
    detailSearch () {
      this.getData()
    }
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
