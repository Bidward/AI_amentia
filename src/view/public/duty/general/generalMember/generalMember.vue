<template>
  <!-- 成员定岗定编 -->
  <div style="margin: 10px 0 0">
    <Table border :columns="memberHeader" :data="memberData" :loading="loading">
      <template slot-scope="{ row, index }" slot="edit" class="btn">
        <Button
          type="primary"
          @click="showChangeModal(row)"
          v-show="changeTemplatePermission"
          >更换模板</Button>
        <Button @click="detailTemplate(row)">详情</Button>
      </template>
    </Table>
    <div class="tableFooter">
      <Page
        :total="headerSearch.totalCount"
        :page-size="headerSearch.pageSize"
        :current="headerSearch.currPage"
        size="small"
        show-total
        show-sizer
        show-elevator
        @on-change="(currPage)=>{headerSearch.currPage=currPage;getData()}"
        @on-page-size-change="(pageSize)=>{headerSearch.pageSize=pageSize;getData()}"
      />
    </div>
    <!-- 更换模板弹窗 -->
    <Modal
        v-model="changeModal"
        title="更换模板"
        width="360px"
        @on-ok="sureChange"
    >
        <div style="display: flex; align-items: center; justify-content: center;">
            <span style="margin-right: 10px">模板名称:</span>
            <Select v-model="templateId" :placeholder="templateNames" style="width:200px" clearable>
                <Option
                    v-for="item in templateList"
                    :value="item.jobCategoryId"
                    :key="item.jobCategoryId"
                >{{ item.categoryName }}</Option>
            </Select>
        </div>
    </Modal>
  </div>
</template>

<script>
import personSelect from '@/components/person-select'
import { baseUrl } from '@/api/base.js'
export default {
  name: 'generalMember',
  inject: ['app'],
  data () {
    return {
      changeModal: false,
      loading: true,
      deptTreeList: [], // 部门
      positionNameList: [], // 职位
      templateList: [], // 模板
      templateId: '', // 模板id,
      personId: '',
      templateNames: '',
      headerSearch: {
        name: '',
        dept: '',
        position: '',
        totalCount: 0,
        pageSize: 20,
        currPage: 1
      },
      memberHeader: [
        {
          title: '序号',
          type: 'index',
          width: 100,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'nickname',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" />
                  </span>
                  <personSelect
                    slot="content"
                    onGetData={this.getData}
                  ></personSelect>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '部门',
          key: 'deptName',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" />
                  </span>
                  <Select
                    slot="content"
                    filterable
                    clearable
                    v-on:on-change={() => {
                      this.getData()
                    }}
                    v-model={this.headerSearch.dept}
                  >
                    {(this.deptTreeList || []).map(dept => {
                      return (
                        <Option
                          value={dept.title}
                          key={dept.id}
                          label={dept.title}
                        ></Option>
                      )
                    })}
                  </Select>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '职位',
          key: 'positionName',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" />
                  </span>
                  <Select
                    slot="content"
                    filterable
                    clearable
                    v-on:on-change={() => {
                      this.getData()
                    }}
                    v-model={this.headerSearch.position}
                  >
                    {(this.positionNameList || []).map(
                      position => {
                        return (
                          <Option v-model={position}>
                            {position}
                          </Option>
                        )
                      }
                    )}
                  </Select>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '模板',
          key: 'stationFormwork',
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          slot: 'edit'
        }
      ],
      memberData: []
    }
  },
  computed: {
    employees () {
      return this.app.employees
    },
    changeTemplatePermission () {
      return this.$store.state.user.userpermission.duty.updateTemplate
    }
  },
  mounted () {
    this.getSection() // 获取部门、职位
    this.getData() // 获取成员定岗定编列表
  },
  methods: {
    // 展示更换模板弹窗
    showChangeModal (row) {
      this.changeTemplate() // 显示模板;
      this.changeModal = true
      this.personId = row.id
      this.templateNames = row.stationFormwork
    },
    // 成员定岗定编-详情
    detailTemplate (row) {
      this.$router.push({
        name: 'generalMemberDetail',
        query: { userId: row.id }
      })
    },
    // 保存
    sureChange () {
      if (!this.templateId) {
        this.$Message.warning('请选择模板')
      } else {
        let sendData = {
          personId: this.personId,
          jobCategoryId: this.templateId
        }
        this.$axios({
          url: baseUrl + '/stationSceen/updateStationFormwork',
          method: 'post',
          data: $qs.stringify(sendData)
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.getData()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    // 获取部门、职位
    getSection () {
      this.$axios({
        url: baseUrl + '/structure/init',
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            let content = res.data.content
            this.deptTreeList = content.deptTreeList // 部门列表
            this.positionNameList = content.positionNameList // 职位列表
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取成员定岗定编列表
    getData (personID) {
      let sendData = {
        userName: personID,
        deptName: this.headerSearch.dept,
        positionName: this.headerSearch.position,
        currPage: this.headerSearch.currPage,
        pageSize: this.headerSearch.pageSize
      }
      this.$axios({
        url: baseUrl + '/stationSceen/stationList',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.memberData = res.data.content.pageContent
            this.headerSearch.totalCount = res.data.content.totalCount
            this.headerSearch.pageSize = res.data.content.pageSize
            this.headerSearch.currPage = res.data.content.currPage
            this.loading = false
          } else {
            this.loading = false
            this.memberData = []
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 显示模板
    changeTemplate () {
      this.$axios({
        url: baseUrl + '/stationSceen/getStationFormwork',
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.templateList = res.data.content.pageContent
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
