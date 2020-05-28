<template>
  <div>
    <div class="level-three clearfix">
      <Button type="primary" class="btns" v-if="permission.create" @click="addModel()">新增</Button>
      <div class="searchbar">
        <Input
          @on-search="()=>{detailHeader.currPage=1;detailSearch()}"
          placeholder="备注"
          search
          clearable
          v-model="detailHeader.text"
          class=""
          style="width:200px;margin-right:5px;"
        />
        <Button class="" icon="ios-loading" @click="reload()"></Button>
      </div>
    </div>
    <Table border :columns="tableHeader" :data="tableContent">
      <template slot-scope="{ row, index }" slot="edit">
        <Button
          class="btns"
          type="primary"
          v-if="permission.update"
          @click="editTemplate(row,index)"
        >编辑</Button>
        <Button class="btns" type="error" v-if="permission.delete" @click="deleteTemplate(row)">刪除</Button>
        <Button class="btns" @click="showTemplate(row)">详情</Button>
      </template>
    </Table>
    <div class="tableFooter">
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
    <editTemplate
      v-if="showModel"
      :config="config"
      :show.sync="showModel"
      :propData="propData"
      @updataList="detailSearch"
    />
  </div>
</template>
<script>
import editTemplate from './editTemplate'
import { semUrl } from '@/api/base.js'
import { semPermissionMixin } from '../../tools'
import { Track } from '@/libs/track.js'
const track = new Track('营销/基础信息/模板配置')

export default {
  name: 'myTemplate',
  components: {
    editTemplate
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
        { title: '模板编号', key: 'templateId', align: 'center' },
        { title: '昨日安装量', key: 'setups', align: 'center' },
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
        url: semUrl + '/Templat/index',
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
    editTemplate (row) {
      this.propData = JSON.parse(JSON.stringify(row))
      this.config.title = '编辑'
      this.showModel = true
    },
    showTemplate (row) {
      this.propData = JSON.parse(JSON.stringify(row))
      this.config.title = '查看'
      this.showModel = true
    },
    deleteTemplate (row) {
      this.$Modal.confirm({
        title: '提示',
        content: `是否删除模板${row.templateId}？`,
        onOk: () => {
          this.$axios({
            url: semUrl + '/Templat/delTemplat',
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
