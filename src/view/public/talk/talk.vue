<template>
  <div class="viewWrapper level-one">
    <Tabs v-model="checkTab" :animated="false" @on-click="changeTab">
      <!-- <div slot="extra" v-show="checkTab==='talkList'">
        <Button class="btns" @click="showSelect=!showSelect">
          <Icon :type="showSelect?'ios-arrow-up':'ios-arrow-down' "/>筛选
        </Button>
      </div> -->
      <TabPane label="成员面谈" name="talkList">
        <div class="level-three">
          <div class="searchbar" slot="extra">
            <Button class="btns" @click="showSelect=!showSelect">
              <Icon :type="showSelect?'ios-arrow-up':'ios-arrow-down' "/>筛选
            </Button>
          </div>
        </div>
        <Card style="margin:10px 0;padding:20px;" v-show="showSelect">
          <Form
            ref="formInline"
            :model="searchHeader"
            inline
            label-position="left"
            :label-width="60"
          >
            <FormItem label="开始时间">
              <DatePicker
                format="yyyy-MM-dd"
                @on-change="(v)=>searchHeader.startTime=v"
                v-model="searchHeader.startTime"
                placeholder="开始时间"
              ></DatePicker>
            </FormItem>
            <FormItem label="结束时间">
              <DatePicker
                format="yyyy-MM-dd"
                @on-change="(v)=>searchHeader.endTime=v"
                v-model="searchHeader.endTime"
                placeholder="结束时间"
              ></DatePicker>
            </FormItem>
            <FormItem label="面谈人">
              <Select filterable clearable v-model="searchHeader.mainPeople" placeholder="面谈人">
                <Option
                  v-for="item in userList"
                  :value="item.id"
                  :key="item.id"
                  :label="item.nickname"
                >{{ item.nickname }}</Option>
              </Select>
            </FormItem>
            <FormItem label="被面谈人">
              <Select filterable clearable v-model="searchHeader.uid" placeholder="被面谈人">
                <Option
                  v-for="item in userList"
                  :value="item.id"
                  :key="item.id"
                  :label="item.nickname"
                >{{ item.nickname }}</Option>
              </Select>
            </FormItem>
            <FormItem label="面谈类型">
              <Select v-model="searchHeader.talkType" placeholder="面谈类型">
                <Option value="-1" label="全部"></Option>
                <Option value="1" label="绩效面谈"></Option>
                <Option value="2" label="发展面谈"></Option>
              </Select>
            </FormItem>
          </Form>
          <div style="float:right;">
            <Button class="btns" type="primary" @click="()=>search(1,undefined)">搜索</Button>
            <Button class="btns" type="primary" icon="ios-arrow-up" @click="showSelect = false">收起</Button>
          </div>
        </Card>
        <Table border stripe :columns="tableHeader" :data="pageContent">
          <template slot-scope="{ row, index }" slot="option">
            <Button class="btns edit" type="primary" @click="showTalk(row)">查看</Button>
            <Button class="btns" type="error" @click="deletTalkLog(row)">删除</Button>
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
            @on-page-size-change="(pageSize)=>search(undefined,pageSize)"
            @on-change="(current)=>search(current,undefined)"
            style="float:right;"
          />
        </div>
      </TabPane>
      <TabPane label="发展面谈" name="devTalk">
        <Row v-if="showType==='add'">
          <Col span="2">
            <Select filterable v-model="toTalkPerson.talkPeopleId" placeholder="面谈人">
              <Option
                v-for="item in toTalkPerson.toTalkPeopleList"
                :value="item.id"
                :key="item.id"
                :label="item.nickname"
              >{{ item.nickname }}</Option>
            </Select>
          </Col>
        </Row>
        <Row v-else>
          <Col span="2">
            <Input :value="talkDetail.daytime" disabled>
              <span slot="prepend">日期</span>
            </Input>
          </Col>
          <Col span="2" offset="1">
            <Input :value="talkDetail.mainPeopleName" disabled>
              <span slot="prepend">主管</span>
            </Input>
          </Col>
          <Col span="2" offset="1">
            <Input :value="talkDetail.uName" disabled>
              <span slot="prepend">面谈人</span>
            </Input>
          </Col>
        </Row>
        <p>一、面谈目标的陈述：</p>
        <p>首先对你这一个月的辛勤工作表示感谢！这次面谈要达成二个目标：一是了解目前的工作进展；二是发现问题，看我能给你提供什么样的帮助。</p>
        <br>
        <p>二、面谈内容：</p>
        <Form label-position="top">
          <FormItem
            label="1、目前的工作职责：（注意主要描述花费时间较长的职责和体现岗位核心价值的职责；注意描述职责时动词，主要的：负责/制定/承担/统计、次要的：参与/协助/建议/配合）"
          >
            <Input v-model="devTalkContent[0].content"></Input>
          </FormItem>
          <FormItem label="2、kpi达成状况：（岗位职责实际履行状况）">
            <Input v-model="devTalkContent[1].content"></Input>
          </FormItem>
          <FormItem label="3、对自身而言，工作上需要改进之处及其所需的帮助或培训：">
            <Input v-model="devTalkContent[2].content"></Input>
          </FormItem>
          <FormItem label="4、对公司现在的业务内容意见，对现在的工作环境意见：">
            <Input v-model="devTalkContent[3].content"></Input>
          </FormItem>
          <FormItem label="5、就已取得的工作业绩而言，最有价值或最感兴趣的事项是：">
            <Input v-model="devTalkContent[4].content"></Input>
          </FormItem>
          <FormItem label="6、关于今后想挑战的业务领域：">
            <Input v-model="devTalkContent[5].content"></Input>
          </FormItem>
          <FormItem label="7、下一步职业发展目标建议：">
            <Input v-model="devTalkContent[6].content"></Input>
          </FormItem>
          <FormItem>
            <Button @click="save">保存</Button>
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="绩效面谈" name="kpiTalk">
        <Row v-if="showType==='add'">
          <Col span="2">
            <Select filterable v-model="toTalkPerson.talkPeopleId" placeholder="面谈人">
              <Option
                v-for="item in toTalkPerson.toTalkPeopleList"
                :value="item.id"
                :key="item.id"
                :label="item.nickname"
              >{{ item.nickname }}</Option>
            </Select>
          </Col>
        </Row>
        <Row v-else>
          <Col span="2">
            <Input :value="talkDetail.daytime" disabled>
              <span slot="prepend">日期</span>
            </Input>
          </Col>
          <Col span="2" offset="1">
            <Input :value="talkDetail.mainPeopleName" disabled>
              <span slot="prepend">主管</span>
            </Input>
          </Col>
          <Col span="2" offset="1">
            <Input :value="talkDetail.uName" disabled>
              <span slot="prepend">面谈人</span>
            </Input>
          </Col>
        </Row>
        <p>一、面谈目标的陈述：</p>
        <p>首先对你这一个月的辛勤工作表示感谢！根据公司考核制度和本次绩效考核的安排，对你在考核期的工作绩效予以评估。这次面谈要达成二个目标：一是与你沟通评估结果；二是明确下一阶段的绩效目标。</p>
        <br>
        <p>二、面谈内容：</p>
        <Form label-position="top">
          <FormItem label="1、下面就请你先简要地总结一下本考核期的工作情况吧。">
            <Input v-model="kpiTalkContent[0].content"></Input>
          </FormItem>
          <FormItem label="2、对统计出的业绩数据有异议吗？你自己认为哪些指标超越了目标?哪些达到了目标?哪些没有达到目标？ 改进的空间在哪里？">
            <Input v-model="kpiTalkContent[1].content"></Input>
          </FormItem>
          <FormItem label="3、下一周期的绩效目标是什么？">
            <Input v-model="kpiTalkContent[2].content"></Input>
          </FormItem>
          <FormItem label="4、你工作中遇到的最大障碍是什么？需要什么资源和支持？">
            <Input v-model="kpiTalkContent[3].content"></Input>
          </FormItem>
          <FormItem>
            5、让我们明确一下，上一阶段你的绩效分数是
            <Input style="width:50px;" v-model="kpiTalkContent[4].content"></Input>分
          </FormItem>
          <FormItem>
            <Button @click="save">保存</Button>
          </FormItem>
        </Form>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
import moment from 'moment'
export default {
  name: 'talk',
  data () {
    return {
      checkTab: 'talkList',
      showSelect: false,
      tableHeader: [
        { title: '日期', key: 'daytime' },
        { title: '类型', key: 'talkType' },
        { title: '面谈人', key: 'uName' },
        { title: '主管', key: 'mainPeopleName' },
        { title: '操作', slot: 'option' }
      ],
      pageContent: [],
      searchHeader: {
        startTime: '',
        endTime: '',
        mainPeople: '',
        pageSize: 20,
        currPage: 1,
        uid: '',
        talkType: '-1'
      },
      totalCount: 0,
      userList: [],
      devTalkContent: [
        { content: '' },
        { content: '' },
        { content: '' },
        { content: '' },
        { content: '' },
        { content: '' },
        { content: '' }
      ],
      kpiTalkContent: [
        { content: '' },
        { content: '' },
        { content: '' },
        { content: '' },
        { content: '' }
      ],
      toTalkPerson: {
        toTalkPeopleList: [], // 待面谈人列表
        talkPeopleId: ''
      },
      showType: 'show',
      talkDetail: {
        daytime: '',
        mainPeopleName: '',
        uName: '',
        detailsId: ''
      }
    }
  },
  mounted () {
    this.setThisMonth()
    this.search()
    this.getTbUser()
  },
  methods: {
    // 回退到列表页
    returnToList () {
      console.log('returnToList')
      this.checkTab = 'talkList'
    },
    // 获取转正在职人员
    getTbUser () {
      this.$axios({
        url: baseUrl + '/talk/getTbUser',
        method: 'post'
      })
        .then(res => {
          this.userList = res.data.content
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 设置起始日期为本月
    setThisMonth () {
      this.searchHeader.startTime =
        moment()
          .add('month', 0)
          .format('YYYY-MM') + '-01'
      this.searchHeader.endTime = moment(this.searchHeader.startTime)
        .add('month', 1)
        .add('days', -1)
        .format('YYYY-MM-DD')
    },
    // 页面初始化，分页，搜索
    search (
      currPage = this.searchHeader.currPage,
      pageSize = this.searchHeader.pageSize
    ) {
      this.searchHeader.currPage = currPage
      this.searchHeader.pageSize = pageSize
      let data = this.searchHeader
      data.startTime = moment(data.startTime).format('YYYY-MM-DD')
      data.endTime = moment(data.endTime).format('YYYY-MM-DD')
      data.userId = this.userId
      this.$axios({
        url: baseUrl + '/talk/getTalkDetails',
        data: $qs.stringify(data),
        method: 'post'
      })
        .then(res => {
          let content = res.data.content
          this.searchHeader.currPage = content.currPage
          this.searchHeader.pageSize = content.pageSize
          this.totalCount = content.totalCount
          this.pageContent = content.pageContent
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 删除面谈记录
    deletTalkLog (row) {
      let data = { detailsId: row.detailsId }
      this.$Modal.confirm({
        title: '温馨提示',
        content: '是否删除',
        onOk: () => {
          this.$axios({
            url: baseUrl + '/talk/prohibitDetails',
            method: 'post',
            data: $qs.stringify(data)
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.search()
              }
            })
            .catch(err => {
              console.log('删除面谈记录' + err)
            })
        }
      })
    },
    // 手动切换的Tab，是进行面谈，要有时间判定，
    changeTab (name) {
      // 先把类型设为新增类型
      this.showType = 'add'
      this.clearTalkContent()
      switch (name) {
        // 发展面谈
        case 'devTalk': {
          this.$axios({
            url: baseUrl + '/talk/getIsInterview',
            method: 'post',
            data: $qs.stringify({ userId: this.userId, talkTypeId: '2' })
          }).then(res => {
            if (res.data.code === 10000) {
              this.toTalkPerson.toTalkPeopleList = res.data.content
            } else {
              // 不在面谈时间或者没有可面谈人
              this.$Notice.success({
                title: '通知',
                desc: res.data.msg
              })
              this.returnToList()
            }
          })
          break
        }

        // 绩效面谈
        case 'kpiTalk': {
          this.$axios({
            url: baseUrl + '/talk/getIsInterview',
            method: 'post',
            data: $qs.stringify({ userId: this.userId, talkTypeId: '1' })
          }).then(res => {
            if (res.data.code === 10000) {
              this.toTalkPerson.toTalkPeopleList = res.data.content
            } else {
              // 不在面谈时间或者没有可面谈人
              this.$Notice.success({
                title: '通知',
                desc: res.data.msg
              })
              this.returnToList()
            }
          })
          break
        }
        default: {
          break
        }
      }
      // 点击查看跳转到对应面谈的详情
    },
    // 点击查看对应的面谈详情
    showTalk (row) {
      // 先把类型设置为查看类型
      this.showType = 'show'
      // 设置面谈详情的内容
      this.talkDetail.daytime = row.daytime || ''
      this.talkDetail.mainPeopleName = row.mainPeopleName || ''
      this.talkDetail.uName = row.uName || ''
      this.talkDetail.detailsId = row.detailsId
      if (row.talkType === '绩效面谈') {
        this.$axios({
          url: baseUrl + '/talk/getTalkDetailsById',
          method: 'post',
          data: $qs.stringify({ detailsId: row.detailsId })
        }).then(res => {
          if (res.data.content) {
            this.kpiTalkContent = res.data.content
            this.checkTab = 'kpiTalk'
          } else {
            this.$Notice.success({
              title: '通知',
              desc: '查无内容'
            })
            this.returnToList()
          }
        })
      } else {
        // 发展面谈
        this.$axios({
          url: baseUrl + '/talk/getTalkDetailsById',
          method: 'post',
          data: $qs.stringify({ detailsId: row.detailsId })
        }).then(res => {
          if (res.data.content) {
            this.devTalkContent = res.data.content
            this.checkTab = 'devTalk'
          } else {
            this.$Notice.success({
              title: '通知',
              desc: '查无内容'
            })
            this.returnToList()
          }
        })
      }
    },
    // 清空搜索框内容
    clearTalkContent () {
      this.devTalkContent.fill({ content: '' }, 0, 7)
      this.kpiTalkContent.fill({ content: '' }, 0, 5)
    },
    // 新增或编辑面谈记录
    save () {
      // 1是绩效面谈，2是发展面谈
      let data
      let me = this
      if (this.showType === 'add') {
        data = {
          talkDetails: {
            talktype: me.checkTab === 'devTalk' ? '2' : '1',
            daytime: moment().format('YYYY-MM-DD'),
            mainPeople: me.userId,
            uid: me.toTalkPerson.talkPeopleId
          },
          info:
            me.checkTab === 'devTalk' ? me.devTalkContent : me.kpiTalkContent
        }
      } else {
        // 编辑
        data = {
          info:
            me.checkTab === 'devTalk' ? me.devTalkContent : me.kpiTalkContent,
          detailsId: me.talkDetail.detailsId
        }
      }
      console.log(data)
      this.$axios({
        url: baseUrl + '/talk/submissionTalk',
        method: 'post',
        data: data
      }).then(res => {
        if (res.data.code === 10000) {
          this.$Message.success(res.data.msg)
          this.returnToList()
        }
      })
    }
  },
  computed: {
    userId () {
      return this.$store.state.user.userId
    }
  }
}
</script>
<style scoped>
.tabs{
  margin-bottom: 10px;
}
</style>>
</style>
