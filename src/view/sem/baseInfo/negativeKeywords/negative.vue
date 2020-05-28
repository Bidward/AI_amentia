<template>
  <div>
    <div class="level-three clearfix">
      <Button type="primary" v-if="permission.create" class="btns" @click="addModel()">新增</Button>
      <!-- <Button class="btns">导入</Button> -->
      <div class="searchbar">
        <Input
          @on-search="()=>{detailHeader.currPage=1;detailSearch()}"
          placeholder="否定关键词，备注"
          search
          clearable
          v-model="detailHeader.text"
          class=""
          style="width:200px;margin-right:5px;"
        />
        <Button class="" icon="ios-loading" @click="reload()"></Button>
      </div>
    </div>
    <Table :columns="tableHeader" :data="tableContent" border>
      <template slot-scope="{ row, index }" slot="edit">
        <Button class="btns" type="primary" v-if="permission.update" @click="editNegative(row,index)">编辑</Button>
        <Button class="btns" type="error" v-if="permission.delete" @click="deleteNegative(row)">刪除</Button>
        <Button class="btns" @click="showNegative(row)">详情</Button>
      </template>
    </Table>
    <div class="tableFooter clearfix">
      <Page
        :total="detailHeader.totalCount"
        :page-size="detailHeader.pageSize"
        :current="detailHeader.currPage"
        size="small"
        show-total
        show-sizer
        show-elevator
        @on-change="(currPage)=>{detailHeader.currPage=currPage;detailSearch()}"
        @on-page-size-change="(pageSize)=>{detailHeader.pageSize=pageSize;detailSearch()}"
        style="float:right;"
      />
    </div>
    <editNegative
      v-if="showModel"
      :config="config"
      :show.sync="showModel"
      :propData="propData"
      @updataList="detailSearch"
    />
  </div>
</template>
<script>
import editNegative from './editNagative'
import { semUrl } from '@/api/base.js'
import { semPermissionMixin } from '../../tools'
import { Track } from '@/libs/track.js'
const track = new Track('营销/基础信息/否定关键词')
export default {
  name: 'negative',
  components: {
    editNegative
  },
  mixins: [semPermissionMixin],
  data () {
    return {
      showModel: false,
      config: {},
      propData: {},
      detailHeader: {
        currPage: 1,
        pageSize: 20,
        totalCount: 0,
        text: ''
      },
      tableHeader: [
        { title: '序号', type: 'index', align: 'center' },
        { title: '否定词关键词', key: 'title', align: 'center' },
        { title: '备注', key: 'sum', align: 'center' },
        { title: '操作', slot: 'edit', align: 'center' }
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
    addModel () {
      this.config.title = '新增'
      this.showModel = true
    },
    detailSearch () {
      this.$axios({
        url: semUrl + '/Blackword/index',
        data: $qs.stringify(this.detailHeader),
        method: 'post'
      }).then(res => {
        this.tableContent = res.data.content.pageContent
        this.detailHeader.totalCount = res.data.content.totalCount
        this.$nextTick(() => {
          track.end()
        })
      })
    },
    editNegative (row) {
      this.propData = JSON.parse(JSON.stringify(row))
      this.config.title = '编辑'
      this.showModel = true
    },
    showNegative (row) {
      this.propData = JSON.parse(JSON.stringify(row))
      this.config.title = '查看'
      this.showModel = true
    },
    deleteNegative (row) {
      this.$Modal.confirm({
        title: '提示',
        content: `是否删除${row.title}？`,
        onOk: () => {
          this.$axios({
            url: semUrl + '/Blackword/delBlackword',
            data: $qs.stringify({ id: row.id }),
            method: 'post'
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.detailSearch()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    reload () {
      this.detailHeader.currPage = 1
      this.detailHeader.pageSize = 20
      this.detailHeader.text = ''
      this.detailSearch()
    }
  }
}
</script>
