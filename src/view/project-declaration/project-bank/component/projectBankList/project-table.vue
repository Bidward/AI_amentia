<template>
    <!--项目库 全部 -->
    <div>
        <div class="level-three">
            <div class="searchbox" style="float: right;">
                <Input class="fuzzySearch"
                    placeholder="输入关键字..."
                    style="width:200px;margin-right:5px;"
                    v-model.trim="detailHeader.query"
                    @on-enter="()=>{reload(detailHeader.query);getData()}"
                >
                  <Icon
                    @click="getData"
                    class="pointer"
                    type="ios-search"
                    slot="suffix"
                  />
                  <Icon
                    v-show="detailHeader.query"
                    @click="()=>{reload();getData()}"
                    class="pointer"
                    type="ios-close-circle-outline"
                    slot="suffix"
                  />
                </Input>
                <Button
                  @click="handleFullScreen"
                  :icon="isFullScreen ? 'md-contract' : 'md-expand'"
                />
                <Button icon="ios-loading" @click="()=>{reload();getData()}"></Button>
                <TableHeaderSetting
                    :totalTableHeader="projectHeader"
                    :tableHeader.sync="tableHeader"
                    :key="localKey"
                    :localKey="localKey"
                    :defaultList="defaultList"
                />
            </div>
        </div>
        <Table
            :loading="loading"
            :columns="tableHeader"
            :data="projectData"
            :height="tableHeight"
            border
            @on-sort-change="handleSort"
        >
            <template slot-scope="{ row, index }" slot="action">
                <Button v-if="permiss.edit" type="primary" size="small" class="marginRight3px" @click="edit(row)">编辑</Button>
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
                @on-page-size-change="(pageSize)=>{detailHeader.pageSize=pageSize;getData()}"
                style="float:right;"
            />
        </div>
        <OpLogs :task-logs="projectLog" @click.native="getLog"></OpLogs>
    </div>
</template>
<script>
import { prUrl } from '@/api/base.js'
import OpLogs from './op-log'
import projectMixins from './projectMixins.js'
export default {
  props: {
    localKey: {
      type: String,
      default: () => ''
    },
    defaultList: {
      type: Array,
      default: () => []
    }
  },
  name: 'allProject',
  components: {
    OpLogs
  },
  mixins: [projectMixins],
  data () {
    return {
      projectLog: []
    }
  },
  computed: {
    permiss () {
      return this.$store.state.user.userpermission.projectReportProject
    }
  },
  methods: {
    getLog () {
      this.$axios({
        url: prUrl + '/project/selectProjectLog',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.projectLog = res.data.data
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="css" scoped>
.fuzzySearch>>>span {
  margin: 0 4px;
}
</style>
