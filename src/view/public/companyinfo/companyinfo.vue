<template>
  <div id="mainWrap">
    <div id="companyInfo" class="viewWrapper">
      <Tabs type="card" class="level-two" :animated="false" v-model="currentTab" @on-click="changeTab">
        <TabPane label="公司信息" name="0" key="companyInfo">
          <Card style="margin-top:10px;padding:20px;" v-if="company.filterCard">
            <div>
              名称:
              <Select
                v-model="company.searchCompanyName"
                filterable
                clearable
                style="width:200px"
                ref="resetcompanyName"
              >
                <Option
                  v-for="(item,index) in company.searchCompanyNameList"
                  :value="item"
                  :key="index"
                >{{ item }}</Option>
              </Select>法定代表人:
              <Select
                v-model="company.searchCompanyLegal"
                filterable
                clearable
                style="width:200px"
                ref="resetcompanyLegal"
              >
                <Option
                  v-for="(item,index) in company.searchCompanyLegalList"
                  :value="item"
                  :key="index"
                >{{ item }}</Option>
              </Select>状态:
              <Select
                v-model="company.searchStatus"
                filterable
                clearable
                style="width:200px"
                ref="resetcompanyStatus"
              >
                <Option
                  v-for="(item,index) in company.stateList"
                  :value="item.value"
                  :key="index"
                >{{ item.label }}</Option>
              </Select>
            </div>
            <div style="float:right;">
              <Button class="five" @click="clearCompany">
                <Icon type="ios-trash-outline"/>清空搜索
              </Button>
              <Button class="five" @click="companyinnerSearch" type="primary">公司信息搜索</Button>
              <Button class="five" type="primary" @click="company.filterCard = false">
                <Icon type="ios-arrow-up"/>收起
              </Button>
            </div>
          </Card>
            <!-- :loading="company.loading" -->
          <Table
            id="jobTable"
            style="margin-top:10px"
            border
            :columns="company.columns"
            :data="company.companyTableList"
          >
            <template slot-scope="{ row, index }" slot="indexnum">
              <span>{{index+1}}</span>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button
                v-if="permissionRetire"
                type="primary"
                id="edit"
                size="default"
                style="margin-right: 5px"
                @click="showCompany(row.id)"
              >
                <Icon type="md-eye"/>查看
              </Button>
              <Button
                v-if="permissionUpdate"
                type="primary"
                id="edit"
                size="default"
                style="margin-right: 5px"
                @click="editCompany(row.id)"
              >
                <Icon type="ios-create-outline"/>编辑
              </Button>
            </template>
          </Table>
          <div class="tableFooter">
            <Page
              :total="company.total"
              :page-size="company.pageSize"
              :current="company.currPage"
              size="small"
              show-total
              show-sizer
              show-elevator
              @on-page-size-change="(pagesize)=>companyCurrentPage(company.currPage,pagesize)"
              @on-change="(current)=>companyCurrentPage(current,company.pageSize)"
              class="tablePages"
            />
          </div>
        </TabPane>
        <TabPane :label="'待确认公司信息('+waitHandel+')'" name="1" key="toConfirm">
          <Card style="margin-top:10px;padding:20px;" v-if="waitConfirm.filterCard">
            <div>
              名称:
              <Select
                class="five"
                v-model="waitConfirm.searchCompanyName"
                filterable
                clearable
                style="width:200px"
                ref="resetconfirmName"
              >
                <Option
                  v-for="item in waitConfirm.searchCompanyNameList"
                  :value="item"
                  :key="item"
                >{{ item }}</Option>
              </Select>状态:
              <Select
                v-model="waitConfirm.searchStatus"
                filterable
                clearable
                style="width:200px"
                ref="resetconfirmStatus"
              >
                <Option
                  v-for="item in waitConfirm.stateList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </div>
            <div style="float:right;">
              <Button class="five" @click="clearConfirm">
                <Icon type="ios-trash-outline"/>清空搜索
              </Button>
              <Button class="five" @click="waitConfirminnerSearch" type="primary">待确认搜索</Button>
              <Button class="five" type="primary" @click="company.filterCard = false">
                <Icon type="ios-arrow-up"/>收起
              </Button>
            </div>
          </Card>
          <Table
            id="jobTable"
            :loading="waitConfirm.loading"
            style="margin-top:10px"
            border
            :columns="waitConfirm.columns"
            :data="waitConfirm.waitConfirmTableList"
          >
            <template slot-scope="{ row, index }" slot="indexnum">
              <span>{{index+1}}</span>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button
                v-if="row.tbcStatus===3 && permissionUpdate"
                type="primary"
                id="edit"
                size="default"
                style="margin-right: 5px;"
                @click="delCompany(row.id,'tbc')"
              >
                <Icon type="ios-create-outline"/>编辑
              </Button>
              <Button
                v-else
                type="primary"
                id="edit"
                size="default"
                style="margin-right: 5px"
                @click="editCompany(row.id,'tbc')"
              >
                <Icon type="ios-create-outline"/>编辑
              </Button>
            </template>
          </Table>
          <div class="tableFooter">
            <Page
              :total="waitConfirm.total"
              :page-size="waitConfirm.pageSize"
              :current="waitConfirm.currPage"
              size="small"
              show-total
              show-sizer
              show-elevator
              @on-page-size-change="(pageSize)=>waitConfirmCompanyCurrentPage(waitConfirm.currPage,pageSize)"
              @on-change="(current)=>waitConfirmCompanyCurrentPage(current,waitConfirm.pageSize)"
              class="tablePages"
            />
            </div>
        </TabPane>
        <Button
          v-if="companyFlag == true && permissionCreat"
          @click="addCompany()"
          slot="extra"
          class="addNew"
        >
          <Icon type="md-add-circle"/>新增
        </Button>
        <Button
          v-if="companyFlag == true && permissionExport"
          @click="outputExcel()"
          slot="extra"
          style="margin-right:10px;"
        >
          <Icon type="ios-log-out"/>导出
        </Button>
        <!--公司信息-->
        <Button v-if="companyFlag == true" @click="openfilterCard" slot="extra">
          <Icon type="ios-arrow-up " v-if="company.filterCard"/>
          <Icon type="ios-arrow-down" v-else/>筛选
        </Button>
        <!--待确认公司信息-->
        <Button v-if="companyFlag == false" @click="openwaitfilterCard" slot="extra">
          <Icon type="ios-arrow-up " v-if="waitConfirm.filterCard"/>
          <Icon type="ios-arrow-down" v-else/>筛选
        </Button>
      </Tabs>
    </div>
  </div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
export default {
  name: 'companyInfo',
  data () {
    return {
      /**
       * currentTab tab切换0为公司信息 1为待确认公司信息
       * companyFlag 待办事项不显示新增与导出按钮
       * waitHandel 待处理公司信息总数
       * company 公司信息下数据
       * companyNameVisible 是否显示名称搜索框
       * companyLegalVisible 是否显示法定代表人搜索框
       * searchStatusVisible 是否显示状态搜索框
       * searchCompanyName 名称模糊匹配关键字
       * searchCompanyLegal 法定代表人模糊匹配关键字
       * searchStatus 状态默认值是-1，-1 代表全部 0代表启用 1代表禁用
       * stateList 状态栏
       * companyTableList 公司信息列表页数据
       * waitConfirm 待确认公司信息数据 除两人两遍进度其余一致
       * searchCompanyLegal 两人两遍进度 pay attention
       **/
      currentTab: '0',
      companyFlag: true,
      waitHandel: 0,
      permissionCreat: false, // 新增
      permissionRetire: false, // 查看
      permissionExport: false, // 导出
      permissionUpdate: false, // 更新
      permissionDelet: false, // 删除
      company: {
        loading: false,
        filterCard: false,
        companyLegal: '',
        searchActive: false, // todo
        companyNameVisible: false,
        companyLegalVisible: false,
        searchStatusVisible: false,
        searchCompanyName: '',
        searchCompanyNameList: [],
        searchCompanyLegal: '',
        searchCompanyLegalList: [],
        searchStatus: '',
        stateList: [
          {
            value: -1,
            label: '全部'
          },
          {
            value: 0,
            label: '启用'
          },
          {
            value: 1,
            label: '禁用'
          }
        ],
        columns: [
          {
            title: '序号',
            slot: 'indexnum',
            align: 'center'
          },
          {
            title: '公司名称',
            key: 'companyName',
            align: 'center'
          },
          {
            title: '法定代表人',
            key: 'companyLegal',
            align: 'center'
          },
          {
            title: '状态',
            key: 'companyStatusName',
            align: 'center'
          },
          {
            title: '操作',
            slot: 'action',
            align: 'center'
          }
        ],
        companyTableList: [],
        total: 15,
        pageSize: 20,
        currPage: 1
      },
      waitConfirm: {
        loading: false,
        filterCard: false,
        companyLegal: '',
        searchCompanyName: '',
        searchCompanyNameList: [],
        searchStatus: '',
        stateList: [
          {
            value: 0,
            label: '待二次录入'
          },
          {
            value: 1,
            label: '信息不一致'
          },
          {
            value: 2,
            label: '待二次编辑'
          },
          {
            value: 3,
            label: '待二次删除'
          },
          {
            value: -1,
            label: '全部'
          }
        ],
        columns: [
          {
            title: '序号',
            slot: 'indexnum',
            align: 'center'
          },
          {
            title: '公司名称',
            key: 'companyName',
            align: 'center'
          },
          {
            title: '法定代表人',
            key: 'companyLegal',
            align: 'center'
          },
          {
            title: '状态',
            key: 'tbcStatusName',
            align: 'center'
          },
          {
            title: '操作',
            slot: 'action',
            align: 'center'
          }
        ],
        waitConfirmTableList: [],
        total: 15,
        pageSize: 20,
        currPage: 1
      }
    }
  },
  mounted () {
    this.getPermission()
    this.getCompanyData()
    this.getWaitCompanyData()
  },
  watch: {},
  methods: {
    // 获取当前页面权限
    getPermission () {
      this.permissionRetire = this.$store.state.user.userpermission.company.retrie
      this.permissionCreat = this.$store.state.user.userpermission.company.create
      this.permissionUpdate = this.$store.state.user.userpermission.company.update
      this.permissionDelet = this.$store.state.user.userpermission.company.delete
      this.permissionExport = this.$store.state.user.userpermission.company.export
    },
    // 公司信息清空搜索
    clearCompany () {
      this.$refs.resetcompanyName.clearSingleSelect()
      this.$refs.resetcompanyLegal.clearSingleSelect()
      this.$refs.resetcompanyStatus.clearSingleSelect()
    },
    // 待确认公司信息清空搜索
    clearConfirm () {
      this.$refs.resetconfirmName.clearSingleSelect()
      this.$refs.resetconfirmStatus.clearSingleSelect()
    },
    // 公司信息扩展card搜索按钮
    companyinnerSearch () {
      let _this = this.company
      let sendData = {
        companyName: _this.searchCompanyName,
        companyLegal: _this.searchCompanyLegal,
        companyStatus: _this.searchStatus,
        currPage: _this.currPage,
        pageSize: _this.pageSize
      }
      _this.loading = true
      this.$axios({
        url: baseUrl + '/company/pagecheck',
        data: $qs.stringify(sendData),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            _this.companyTableList = resp.data.content.page.pageContent
            _this.total = resp.data.content.page.totalCount
            _this.loading = false
          } else {
            this.$Message.error(resp.data.msg)
            _this.companyTableList = resp.data.content.page.pageContent
            _this.total = resp.data.content.page.totalCount
            _this.loading = true
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    // 待确认公司信息扩展card搜索按钮
    waitConfirminnerSearch () {
      let _cthis = this.waitConfirm
      let sendData = {
        companyName: _cthis.searchCompanyName,
        tbcStatus: _cthis.searchStatus,
        currPage: _cthis.currPage,
        pageSize: _cthis.pageSize
      }
      _cthis.loading = true
      this.$axios({
        url: baseUrl + '/company/pagetbc',
        data: $qs.stringify(sendData),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            _cthis.waitConfirmTableList = resp.data.content.page.pageContent
            _cthis.total = resp.data.content.page.totalCount
            _cthis.loading = false
          } else {
            this.$Message.error(resp.data.msg)
            _cthis.waitConfirmTableList = resp.data.content.page.pageContent
            _cthis.total = resp.data.content.page.totalCount
            _cthis.loading = true
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    // 公司信息打开扩展搜索
    openfilterCard () {
      this.company.filterCard === true
        ? (this.company.filterCard = false)
        : (this.company.filterCard = true)
    },
    // 待确认公司信息打开扩展搜索
    openwaitfilterCard () {
      this.waitConfirm.filterCard === true
        ? (this.waitConfirm.filterCard = false)
        : (this.waitConfirm.filterCard = true)
    },
    /**
     * getCompanyData 获取公司信息
     * 回显{
     * companyName 名称
     * companyLegal  法人
     * companyStatusName 状态
     * pageSize 当前页显示条数 [10,20,30,40]
     * currPage 当前页
     * totalCount 数据总数
     * }
     **/
    getCompanyData () {
      let _this = this.company
      let sendData = {
        companyName: _this.searchCompanyName,
        companyLegal: _this.searchCompanyLegal,
        companyStatus: _this.searchStatus,
        currPage: _this.currPage,
        pageSize: _this.pageSize
      }
      _this.loading = true
      this.$axios({
        url: baseUrl + '/company/pagecheck',
        data: $qs.stringify(sendData),
        method: 'post'
      })
        .then(resp => {
          let _this = this.company
          _this.companyTableList = resp.data.content.page.pageContent
          _this.total = resp.data.content.page.totalCount
          _this.searchCompanyNameList = resp.data.content.autoCompanyNames
          _this.searchCompanyLegalList = resp.data.content.autoCompanyLegals
          _this.loading = false
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    /**
     * getWaitCompanyData 获取待确认公司信息
     * 回显{
     * companyName 名称
     * companyLegal  两人两遍进度
     * companyStatusName 状态
     * pageSize 当前页显示条数 [10,20,30,40]
     * currPage 当前页
     * totalCount 数据总数
     * }
     **/
    getWaitCompanyData () {
      let _cthis = this.waitConfirm
      let sendData = {
        companyName: _cthis.searchCompanyName,
        companyLegal: _cthis.searchCompanyLegal,
        companyStatus: _cthis.searchStatus,
        currPage: _cthis.currPage,
        pageSize: _cthis.pageSize
      }
      _cthis.loading = true
      this.$axios({
        url: baseUrl + '/company/pagetbc',
        data: $qs.stringify(sendData),
        method: 'post'
      })
        .then(resp => {
          _cthis.waitConfirmTableList = resp.data.content.page.pageContent
          _cthis.total = resp.data.content.page.totalCount
          _cthis.searchCompanyNameList = resp.data.content.autoCompanyNames
          this.waitHandel = _cthis.total
          _cthis.loading = false
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    // 切换tab
    changeTab (name) {
      if (name === '1') {
        this.companyFlag = false
        this.getWaitCompanyData()
      } else {
        this.companyFlag = true
        this.getCompanyData()
      }
    },
    // 公司信息分页
    companyCurrentPage (currPage, pageSize) {
      let _this = this.company
      _this.pageSize = pageSize
      let sendData = {
        companyName: this.company.searchCompanyName,
        companyLegal: this.company.searchCompanyLegal,
        companyStatus: this.company.searchStatus,
        currPage: currPage,
        pageSize: this.company.pageSize
      }
      _this.loading = true
      this.$axios({
        url: baseUrl + '/company/pagecheck',
        data: $qs.stringify(sendData),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.company.companyTableList = resp.data.content.page.pageContent
            this.company.total = resp.data.content.page.totalCount
            _this.loading = false
          } else {
            this.$Message.error(resp.data.msg)
            _this.loading = true
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    // 待确认公司信息分页
    waitConfirmCompanyCurrentPage (currPage, pageSize) {
      let _cthis = this.waitConfirm
      _cthis.pageSize = pageSize
      let sendData = {
        companyName: _cthis.searchCompanyName,
        companyLegal: _cthis.searchCompanyLegal,
        companyStatus: _cthis.searchStatus,
        currPage: currPage,
        pageSize: _cthis.pageSize
      }
      _cthis.loading = true
      this.$axios({
        url: baseUrl + '/company/pagetbc',
        data: $qs.stringify(sendData),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            _cthis.waitConfirmTableList = resp.data.content.page.pageContent
            _cthis.total = rsesp.data.content.page.totalCount
            this.waitHandel = _cthis.total
            _cthis.loading = false
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    // 公司信息查看 todo
    showCompany (index) {
      this.$router.push({
        name: 'showCompany',
        query: {
          id: index
        }
      })
    },
    // 新增公司信息 todo
    addCompany () {
      this.$router.push({
        name: 'addCompany',
        query: {
          type: 'add'
        }
      })
    },
    // 公司信息编辑 todo
    editCompany (index, type) {
      this.$router.push({
        name: 'editCompany',
        query: {
          type: type,
          id: index
        }
      })
    },
    delCompany (index, type) {
      this.$router.push({
        name: 'showCompany',
        query: {
          type: type,
          id: index
        }
      })
    },
    outputExcel () {
      // 导出公司信息 todo
      let data = {
        companyName: this.company.searchCompanyName,
        companyLegal: this.company.searchCompanyLegal,
        companyStatus: this.company.searchStatus
      }
      window.open(baseUrl + '/company/export?' + $qs.stringify(data))
    }
  }
}
</script>

<style scoped>
.viewWrapper{
  padding: 20px
}
/* #mainWrap {
  top: 100px;
  padding: 20px;
  background-color: #f3f3f3;
}

#companyInfo {
  width: 100%;
  margin-top: 0px;
  background-color: #fff;
}

#companyInfo .ivu-tabs-tab.ivu-tabs-tab-active.ivu-tabs-tab-focused {
  background-color: #19aa8d;
  color: #fff;
}

#companyInfo .ivu-tabs-tab:hover {
  color: #4f5e6b;
}

#companyInfo .ivu-tabs-bar {
  border-bottom: 2px solid #088f74;
  padding: 1px 0;
} */

#companyInfo .ivu-icon {
  font-weight: 800 !important;
  font-size: 13px !important;
}

#companyInfo .ivu-input:hover,
#companyInfo .ivu-input:focus {
  border-color: #088f74 !important;
}

#companyInfo .ivu-btn:hover,
#companyInfo .ivu-btn:focus {
  border-color: #088f74 !important;
}

.table {
  position: relative;
  width: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #fff;
  border: 1px solid #e9eaec;
  font-size: 12px;
  line-height: 26px;
  color: #6a6a68;
}

.table_head_wrap {
  font-size: 12px;
  line-height: 26px;
  color: #6a6a68;
}

.table_head {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0;
}

.table_head_row {
  height: 40px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #f8f8f9;
  border-bottom: 1px solid #e9eaec;
}

.table_head_cell,
.table_body_cell {
  border-right: 1px solid #e9eaec;
  text-align: center;
  color: #088f74;
  font-weight: 700;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  vertical-align: middle;
  word-break: break-all;
  overflow: hidden;
}

.table_body_wrap {
  height: auto;
}

.table_body {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0;
}

.table_body_cell {
  color: #6a6a68;
}

.table_body_row {
  height: 48px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-bottom: 1px solid #e9eaec;
}

.table_heade_inner,
.table_body_inner {
  display: inline-block;
}

.ivu-icon.ivu-icon-ios-search {
  color: #6a6a68;
}

.ivu-icon.ivu-icon-ios-search:hover {
  color: #19aa8d;
}

#companyInfo .searchActive {
  color: #19aa8d;
}

.addNew,
#edit,
#view {
  background-color: #19aa8d;
  border-color: #19aa8d;
  color: #fff;
  margin-right: 10px;
}

.addNew:hover,
#edit:hover,
#view:hover {
  background-color: #088f74;
  border-color: #088f74;
  color: #fff;
}

.search-btn {
  background-color: #19aa8d;
  border-color: #19aa8d;
  color: #fff;
}

.search-btn:hover {
  background-color: #088f74;
  border-color: #088f74;
  color: #fff;
}

.five {
  margin-right: 5px;
}

.ivu-btn-primary {
  background-color: #19aa8d;
  border-color: #19aa8d;
  color: #fff;
}

.ivu-btn-primary:hover {
  background-color: #088f74;
  border-color: #088f74;
  color: #fff;
}
</style>
