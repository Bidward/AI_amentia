<template>
  <div>
    <div class="level-three clearfix">
      <Button class="btns add" type="primary" v-if="permission.create" @click="addPosition">新增</Button>
      <Button class="btns" @click="exportExcel()">导出</Button>
      <div class="searchbar">
        <Input
          placeholder="职位名称、职位等级、所属部门"
          @on-search="()=>{reload(searchHeader.searchContent);detailSearch()}"
          search
          v-model="searchHeader.searchContent"
          class=""
          style="width:250px;margin-right:5px;"
        ></Input>
        <Button class="square" icon="ios-loading" @click="()=>{reload();detailSearch()}"></Button>
      </div>
    </div>
    <Table border :columns="tableHeader" :data="tableContent" @on-sort-change="shortChange">
      <template slot-scope="{ row, index }" slot="edit">
        <Button class="btns" type="primary" v-if="permission.update"  @click="editPosition(row)">编辑</Button>
        <Button class="btns" type="error" v-if="permission.delete" @click="delPosition(row)">删除</Button>
        <Button class="btns" @click="handleShow(row)">详情</Button>
      </template>
    </Table>
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
    <editPosition
      v-if="showModal"
      :show.sync="showModal"
      :config="config"
      :propsData="propsData"
      :positionLevelList="options"
      :incumbencyTbUser="incumbencyTbUser"
      :deptTreeList="deptTreeList"
      @reloadList="detailSearch"
    ></editPosition>
    <showPosition
      v-if="showDetail"
      :showDetail.sync="showDetail"
      :incumbencyTbUser="incumbencyTbUser"
      :config="config"
      :propsData="propsData"
      @reloadList="detailSearch"
    ></showPosition>
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
import editPosition from './editPosition.vue'
import showPosition from './showPosition.vue'
import { Track } from '@/libs/track.js'
const track = new Track('人力运营中心/职位管理/职位管理')
export default {
  name: 'positionList',
  components: {
    editPosition,
    showPosition
  },
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
  data () {
    return {
      propsData: {},
      showModal: false,
      showDetail: false,
      config: {
        // title
        // showNotice
        // getPropsData
        // tbcStatus
      },
      tableHeader: [
        { title: '序号', type: 'index', width: 60, align: 'center' },
        {
          title: '职位名称',
          key: 'positionName',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.searchHeader.positionName ? 'on' : ''}
                    />
                  职位名称
                  </span>
                  <Select
                    slot="content"
                    clearable
                    filterable
                    style="width:248px;"
                    v-on:on-change={() => {
                      this.detailSearch()
                    }}
                    v-model={this.searchHeader.positionName}
                  >
                    {this.positionNameList.map(position => {
                      return (
                        <Option v-model={position}>
                          {position}
                        </Option>
                      )
                    })}
                  </Select>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '职位等级',
          key: 'positionLevelName',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.searchHeader.positionLevel ? 'on' : ''}
                    />
                  职位等级
                  </span>
                  <Select
                    slot="content"
                    clearable
                    filterable
                    v-on:on-change={() => {
                      this.detailSearch()
                    }}
                    v-model={this.searchHeader.positionLevel}
                  >
                    {this.options.map(level => {
                      return (
                        <Option v-model={level.id}>{level.optionName}</Option>
                      )
                    })}
                  </Select>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '所属部门',
          key: 'deptName',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.searchHeader.positionLevel ? 'on' : ''}
                    />
                  职位等级
                  </span>
                  <Select
                    slot="content"
                    clearable
                    filterable
                    v-on:on-change={() => {
                      this.detailSearch()
                    }}
                    v-model={this.searchHeader.positionLevel}
                  >
                    {this.options.map(level => {
                      return (
                        <Option v-model={level.id}>{level.optionName}</Option>
                      )
                    })}
                  </Select>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '编制人数',
          key: 'strengthNum',
          align: 'center',
          width: 260,
          sortable: 'custom'
        },
        {
          title: '操作',
          slot: 'edit',
          align: 'left'
        }
      ],
      totalCount: 100,
      tableContent: [],
      searchHeader: {
        positionName: '',
        deptId: '',
        positionLevel: '',
        order: 'strength', // 排序的类型
        sort: '-1', // 0升序，1降序
        searchType: 0, // 0表头搜索，1模糊搜索
        searchContent: '',
        currPage: 1,
        pageSize: 20
      }
    }
  },
  mounted () {
    this.detailSearch()
  },
  methods: {
    // 搜索
    detailSearch (data) {
      let sendDate = this.getSendData(data)
      this.$axios({
        url: baseUrl + '/structure/page',
        method: 'post',
        data: $qs.stringify(sendDate)
      })
        .then(res => {
          if (res.data.code === 10000) {
            let data = res.data
            this.tableContent = data.content.pageContent
            this.totalCount = data.content.totalCount
            this.$emit('on-update-tbc', true)
            this.$nextTick(() => {
              track.end()
            })
          } else {
            this.$Message.error(data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    // 清空搜索
    reload (searchContent = '') {
      let searchHeader = {
        positionName: '',
        deptId: '',
        positionLevel: '',
        order: 'strength', // 排序的类型
        sort: '-1', // 0升序，1降序
        searchType: 0, // 0表头搜索，1模糊搜索
        searchContent: searchContent,
        currPage: 1,
        pageSize: 20
      }
      this.searchHeader = searchHeader
    },
    getSendData () {
      let sendData = JSON.parse(JSON.stringify(this.searchHeader))
      // 模糊搜索
      if (sendData.searchContent) {
        sendData.searchType = 1
      } else {
        sendData.searchType = 0
      }
      // 排序
      if (sendData.sort === '-1') {
        delete sendData.sort
        delete sendData.order
      }
      for (let key in sendData) {
        if (!sendData[key]) {
          delete sendData[key]
        }
      }
      return sendData
    },
    // 新增职位
    addPosition () {
      this.config.title = '新增'
      this.config.showNotice = 0
      this.config.getPropsData = false
      this.config.tbcStatus = 'firstAdd'
      this.showModal = true
    },
    // 导出
    exportExcel () {
      window.open(baseUrl + '/structure/export')
    },
    // 关闭对话框
    closeModal (data) {
      this.showModal = data
    },
    // 编辑职位
    editPosition (row) {
      this.config.title = '编辑'
      this.config.showNotice = 0
      this.config.getPropsData = true
      this.config.tbcStatus = 'firstEdit'
      this.propsData = JSON.parse(JSON.stringify(row))
      this.showModal = true
    },
    // 删除职位
    delPosition (row) {
      this.showDetail = true
      this.propsData = row
      this.config = {
        title: '删除',
        tbcStatus: 'firstDel'
      }
    },
    // 查看详情
    handleShow (row) {
      this.showDetail = true
      this.propsData = row
      console.log(row)
      this.config = {
        title: '查看',
        tbcStatus: 'show'
      }
    },
    // 设置排序
    shortChange (data) {
      let sort
      if (data.order === 'desc') {
        sort = '1'
      } else if (data.order === 'asc') {
        sort = '0'
      } else {
        sort = '-1'
      }
      this.searchHeader.sort = sort
      this.searchHeader.order = data.key
      this.detailSearch()
    }
  },
  computed: {
    permission () {
      return this.$store.state.user.userpermission.position
    }
  }
}
</script>
