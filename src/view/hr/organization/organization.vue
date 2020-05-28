<template>
  <div class="viewWrapper organization">
    <Tabs name="0" v-model="tabsType" class="level-one" :animated="false">
      <TabPane tab="0" border label="架构图" name="positionPic">
        <div class="inner" v-if="tabsType==='positionPic'">
          <Tabs name="1" type="card" class="level-two" :animated="false">
            <TabPane tab="1" label="组织架构图">
              <div class="level-three">
                <Button @click="getPic('#positionPic')">导出图片</Button>
              </div>
              <div class="org-tree-drag-wrapper">
                <bzTree domId="positionPic" :data="originzationData[0]"></bzTree>
              </div>
            </TabPane>
            <TabPane tab="1" label="项目架构图">
              <div class="level-three" >
                <Button @click="getPic('#projectPic')">导出图片</Button>
              </div>
              <div class="org-tree-drag-wrapper">
                <bzTree domId="projectPic" :data="projectData[0]"></bzTree>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </TabPane>
      <TabPane tab="0" border label="组织架构" name="deptList">
        <deptList
          v-if="tabsType==='deptList'"
          :incumbencyUserList="incumbencyUserList"
          :tbcId="deptTbcId"
        ></deptList>
      </TabPane>
      <TabPane tab="0" border label="项目架构" name="projectList">
        <projectList
          v-if="tabsType==='projectList'"
          :incumbencyUserList="incumbencyUserList"
          :tbcId="projectTbcId"
        ></projectList>
      </TabPane>
      <TabPane tab="0" border :label="tbcTitle" name="tbcList">
        <Table v-if="tabsType==='tbcList'" :columns="tbcTableHeader" :data="tbcTableContent" border>
          <template slot-scope="{ row, index }" slot="action">
            <Button class="btns" type="primary" @click="toSecondEdit(row)">编辑</Button>
            <Button class="btns" @click="revoke(row)" v-if="row.oneEntryId===userId">撤销</Button>
            <!-- <Button class="btns" @click="detail(row)">详情</Button> -->
          </template>
        </Table>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import bzTree from './bzTree'
import { baseUrl } from '@/api/base.js'
import html2canvas from 'html2canvas'
import deptList from './deptList'
import projectList from './projectList'
import { Track } from '@/libs/track.js'
const track = new Track('人力运营中心/组织规划/架构图')

export default {
  name: 'originzation',
  components: {
    bzTree,
    deptList,
    projectList
  },
  data () {
    return {
      deptTbcId: -1,
      projectTbcId: -1,
      tabsType: 'positionPic',
      originzationData: [{}], // 组织架构对象
      projectData: [{}], // 项目架构图片
      incumbencyUserList: [], // 在职人员列表
      tbcTableHeader: [
        { type: 'index', title: '序号' },
        { key: 'entryMeanName', title: '模块' },
        { key: 'oneEntryName', title: '发起人' },
        { key: 'twoEntryName', title: '通知人' },
        { key: 'tbcStatusName', title: '状态' },
        { slot: 'action', title: '操作' }
      ],
      tbcTableContent: [],
      tbcNum: 0
    }
  },
  beforeCreate () {
    track.start()
  },
  mounted () {
    this.getOriginzation()
    this.getProject()
    // 获取在职人员列表
    this.getIncumbencyUserList()
    // 需要获取待办事项条数
    this.getTbcList()
  },
  methods: {
    getPic (domId) {
      let dom = document.querySelector(domId)
      html2canvas(dom).then(canvas => {
        let image = canvas.toDataURL('image/png')
        fileDownload(image)
      })
      function fileDownload (downloadUrl) {
        let aLink = document.createElement('a')
        aLink.style.display = 'none'
        aLink.href = downloadUrl
        aLink.download =
          domId === '#positionPic' ? '组织架构图.png' : '项目架构图.png'
        // 触发点击-然后移除
        document.body.appendChild(aLink)
        aLink.click()
        document.body.removeChild(aLink)
      }
    },
    // 获取组织架构
    getOriginzation () {
      this.$axios({
        url: baseUrl + '/Structure/findStructureByCondition',
        method: 'post'
      })
        .then(res => {
          let data = res.data
          this.originzationData = data.content
          this.$nextTick(() => {
            track.end()
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取项目架构
    getProject () {
      this.$axios({
        url: baseUrl + '/project/getAllProject',
        method: 'post'
      })
        .then(res => {
          let data = res.data
          this.projectData = data.content
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取在职人员列表
    getIncumbencyUserList () {
      this.$axios({
        url: baseUrl + '/user/getIncumbencyTbUser',
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.incumbencyUserList = res.data.content
          }
        })
        .catch(err => {
          console.error('getIncumbencyUserList', err)
        })
    },
    // 获取待确认列表
    getTbcList () {
      this.$axios({
        url: baseUrl + '/Structure/getTodo',
        method: 'post'
      })
        .then(res => {
          if (res.data.code) {
            this.tbcTableContent = res.data.content
            this.tbcNum = res.data.content.length
          }
        })
        .catch(err => {
          console.error('getTbcList', err)
        })
    },
    // 撤销
    revoke (row) {
      this.$Modal.confirm({
        title: '撤回提示',
        content: '确定撤销更改?',
        onOk: () => {
          this.$axios({
            url: baseUrl + '/Structure/withdrawTodo',
            method: 'post',
            data: $qs.stringify({ tbcId: row.tbcId, backlogId: row.backlogId })
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.getTbcList()
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    // 跳转到编辑页面，开启编辑
    toSecondEdit (row) {
      if (row.entryMeanName === '组织架构') {
        this.tabsType = 'deptList'
        this.deptTbcId = row.tbcId
      } else if (row.entryMeanName === '项目架构') {
        this.tabsType = 'projectList'
        this.projectTbcId = row.tbcId
      }
    },
    //
    detail (row) {
      console.log(row)
    }
  },
  watch: {
    tabsType: {
      handler (newVal, oldVal) {
        if (newVal === 'tbcList') {
          this.getTbcList()
          this.deptTbcId = -1
          this.projectTbcId = -1
        }
        if (oldVal === 'deptList') {
          // 从组织架构出去的，清空组织架构id
          this.deptTbcId = -1
        } if (oldVal === 'projectList') {
          // 从项目架构出去的，清空项目架构id
          this.projectTbcId = -1
        }
      },
      immediate: true
    },
    $route: {
      handler (to, from) {
        if (to.query.type === 'tbc') {
          this.tabsType = 'tbcList'
        }
      },
      immediate: true
    }
  },
  computed: {
    userId () {
      return this.$store.state.user.userId
    },
    tbcTitle () {
      return this.tbcNum > 0 ? `待处理事项(${this.tbcNum})` : `待处理事项`
    }
  }
}
</script>
<style lang="less">
.organization {
  .org-tree-drag-wrapper {
    border: 1px solid #e8e8e8;
    padding: 10px;
    text-align: center;
    overflow-x: auto;
  }
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: #f5f5f5;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #f5f5f5;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px #19aa8d;
    background-color: #555;
  }
}
</style>
