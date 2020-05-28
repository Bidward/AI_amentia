<template>
  <div>
    <div class="level-three clearfix">
      <div class="searchbar">
        <Input
          placeholder="输入发起人、通知人"
          @on-search="detailSearch()"
          search
          v-model="searchHeader.searchContent"
          class=""
          style="width:250px;margin-right:5px;"
        ></Input>
        <Button class="square" icon="ios-loading" @click="reload()"></Button>
      </div>
    </div>
    <Table border ref="selection" :columns="tableHeader" :data="tableContent">
      <template slot-scope="{ row, index }" slot="tbcStatus">{{row.tbcStatus | tbcStatus}}</template>
      <template slot-scope="{ row, index }" slot="edit">
        <Button class="btns" type="primary" v-if="row.tbcStatus!==3" @click="edit(row)">编辑</Button>
        <!-- 发起人人才能撤销 -->
        <Button class="btns" v-if="row.firstInputId===userId" @click="revoke(row)">撤销</Button>
        <!-- 待二次删除，且是通知人 -->
        <Button
          class="btns"
          type="error"
          v-if="row.tbcStatus===3&&row.secInputId===userId"
          @click="delPosition(row)"
        >删除</Button>
      </template>
    </Table>
    <editPosition
      v-if="showModal"
      :show.sync="showModal"
      :config="config"
      :positionLevelList="options"
      :propsData="propsData"
      :incumbencyTbUser="incumbencyTbUser"
      :deptTreeList="deptTreeList"
      @reloadList="detailSearch"
    />
    <showPosition
      v-if="showDetail"
      :showDetail.sync="showDetail"
      :config="config"
      :propsData="propsData"
      @reloadList="detailSearch"
    />
    <div class="tableFooter">
      <Page
        :total="totalCount"
        :page-size="searchHeader.pageSize"
        :current="searchHeader.currPage"
        size="small"
        show-total
        show-sizer
        show-elevator
        @on-change="(currPage)=>{searchHeader.currPage=currPage;detailSearch()}"
        @on-page-size-change="(pageSize)=>{searchHeader.pageSize=pageSize;detailSearch()}"
        style="float:right;"
      />
    </div>
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
import editPosition from './editPosition.vue'
import showPosition from './showPosition.vue'
import { Track } from '@/libs/track.js'
const track = new Track('人力运营中心/职位管理/待确认职位管理')
export default {
  name: 'tbcPosition',
  beforeCreate () {
    track.start()
  },
  props: {
    options: {
      type: Array,
      default () {
        return []
      }
    },
    deptTreeList: {
      type: Array,
      default () {
        return []
      }
    },
    positionNameList: {
      type: Array,
      default () {
        return []
      }
    },
    incumbencyTbUser: {
      type: Array,
      default () {
        return []
      }
    }
  },
  components: {
    editPosition,
    showPosition
  },
  data () {
    return {
      showModal: false,
      showDetail: false,
      config: {
        // title
        // showNotice
        // getPropsData
        // tbcStatus
      },
      propsData: {}, // 需要传到弹出框里面的内容
      tableHeader: [
        { title: '序号', type: 'index', width: 60, align: 'center' },
        {
          title: '职位名称',
          key: 'firstShow',
          align: 'center'
        },
        {
          title: '所属部门',
          key: 'secShow',
          align: 'center'
        },
        {
          title: '发起人',
          key: 'firstInputNickName',
          align: 'center'
        },
        {
          title: '通知人',
          key: 'secInputNickName',
          align: 'center'
        },
        {
          title: '状态',
          slot: 'tbcStatus',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'edit',
          align: 'left',
          minWidth: 80
        }
      ],
      totalCount: 100,
      tableContent: [],
      searchHeader: {
        positionName: '', // 职位名称
        deptName: '', // 部门名称
        firstInputId: '', // 录入人
        secInputId: '', // 通知人id
        tbcStatus: '', // 两人两遍状态
        searchType: '0', // 搜索类型0=表头搜索 1=模糊搜索
        searchContent: '', // 模糊搜索内容
        currPage: 1,
        pageSize: 20
      }
    }
  },
  mounted () {
    this.detailSearch()
  },
  filters: {
    tbcStatus (value) {
      switch (value) {
        case 0: {
          return '待二次录入'
        }
        case 1: {
          return '信息不一致'
        }
        case 2: {
          return '待二次编辑'
        }
        case 3: {
          return '待二次删除'
        }
      }
    }
  },

  methods: {
    // 二次录入
    edit (row) {
      this.showModal = true
      this.config = {
        title: '编辑',
        showNotice: 1,
        getPropsData: true,
        tbcStatus: row.tbcStatus
      }
      // console.log(row)
      let isFirst = row.firstInputId === this.userId // 是否是发起人
      // 本人是发起人,编辑都会回显
      if (isFirst) {
        this.propsData = row.firstInputObj
      } else {
        this.config.showNotice = 2
        // 如果是第二个人看，第二次录入，不回显
        if (row.tbcStatus === 0) {
          this.config.getPropsData = false
        }
        // 设置第二个人录入的内容
        this.propsData = row.secInputObj || {}
      }
      this.propsData.id = row.id
      console.log(this.propsData)
    },
    // 搜索
    detailSearch () {
      let sendData = this.getSendData()
      this.$axios({
        url: baseUrl + '/structure/pagetbc',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$emit('on-update-tbc', true)
            this.tableContent = res.data.content.pageContent
            this.totalCount = res.data.content.totalCount
          } else {
            this.$Message.error(res.data.msg)
          }
          this.$nextTick(() => {
            track.end()
          })
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    getSendData () {
      let sendData = JSON.parse(JSON.stringify(this.searchHeader))
      // 模糊搜索
      if (sendData.searchContent) {
        sendData.searchType = '1'
        this.reload(sendData.searchContent)
      } else {
        sendData.searchType = '0'
      }
      // 去掉为空的属性
      for (let key in sendData) {
        if (!sendData[key]) {
          delete sendData[key]
        }
      }
      return sendData
    },
    // 撤销
    revoke (row) {
      let id = row.id
      this.$Modal.confirm({
        title: '提示',
        content: '确认撤销？',
        onOk: () => {
          this.$axios({
            url: baseUrl + '/structure/repeal',
            method: 'post',
            data: { id }
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
    // 删除职位
    delPosition (row) {
      this.showDetail = true
      this.propsData = Object.assign(row.firstInputObj, { id: row.id })
      // this.propsData = row.firstInputObj
      console.log(this.propsData)
      this.config = {
        title: '删除',
        tbcStatus: 'secondDel'
      }
    },
    // 删除
    del (row) {
      let id = row.id
      this.$Modal.confirm({
        title: '提示',
        content: '确认删除？',
        onOk: () => {
          this.$axios({
            url: baseUrl + '/structure/deleteconfirm',
            method: 'post',
            data: { id }
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
    // 清空搜索
    reload (searchContent = '') {
      this.searchHeader = {
        positionName: '', // 职位名称
        deptName: '', // 部门名称
        firstInputId: '', // 录入人
        secInputId: '', // 通知人id
        tbcStatus: '', // 两人两遍状态
        searchType: '0', // 搜索类型0=表头搜索 1=模糊搜索
        searchContent: searchContent, // 模糊搜索内容
        currPage: 1,
        pageSize: 20
      }
    }
  },
  computed: {
    userId () {
      return this.$store.state.user.userId
    }
  }
}
</script>
