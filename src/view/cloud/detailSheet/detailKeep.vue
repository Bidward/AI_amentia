<template>
  <!-- 这是数据表详情  留存-->
  <div class="cloudCooper">
    <Tabs :animated="false" value="name1" tab="outTable">
      <TabPane label="数据表" name="name1">
        <!-- 基础信息 -->
        <div class="baseInformation">
          <span class="Title">基础信息</span>
          <div class="main" style="border: 1px solid #ccc;border-top:none">
            <p class="mainTop">{{detail.baseInfo.code||'暂无'}}</p>
            <div class="mainCont">
              <ul>
               <div v-if="detail.baseInfo.backgroundType===1 ||detail.baseInfo.backgroundType=== 2">
                    <li style="width:100%">
                    <span>后台：</span>
                    <span><a :href="detail.baseInfo.address">{{detail.baseInfo.address||'暂无'}}</a></span>
                    </li>
                </div>
                <div v-if="detail.baseInfo.backgroundType===3 ||detail.baseInfo.backgroundType=== 4">
                    <li style="width:100%">
                    <span>后台：</span>
                    <span>{{detail.baseInfo.address||'暂无'}}</span>
                    </li>
                </div>
                <div>
                  <div v-if="detail.baseInfo.backgroundType===1 ||detail.baseInfo.backgroundType=== 2">
                    <li class="left">
                        <span>账号：</span>
                        <span>{{detail.baseInfo.userName||'暂无'}}</span>
                    </li>
                    <li class="right">
                        <span>密码：</span>
                        <span>{{detail.baseInfo.password||'暂无'}}</span>
                    </li>
                  </div>
                  <li class="left">
                    <span>商务：</span>
                    <span>{{detail.baseInfo.saleName||'暂无'}}</span>
                  </li>
                  <li class="right">
                    <span>市场：</span>
                    <span>{{detail.baseInfo.marketName||'暂无'}}</span>
                  </li>
                  <li class="left">
                    <span>区域类型：</span>
                    <span>{{detail.baseInfo.areaName||'暂无'}}</span>
                  </li>
                  <li class="right">
                    <span>业务类型：</span>
                    <span>{{detail.baseInfo.bussinessName||'暂无'}}</span>
                  </li>
                  <li class="left">
                    <span>结算方式：</span>
                    <span>{{detail.baseInfo.settlementName||'暂无'}}</span>
                  </li>
                  <div>
                    <li class="right">
                      <span>状态：</span>
                      <span>{{detail.baseInfo.statusName||'暂无'}}</span>
                    </li>
                    <!-- 阶梯价 -->
                    <!-- 留存 -->
                    <div>
                      <li class="left">
                        <span>进价：</span>
                        <span>{{detail.baseInfo.purpricetrue||'暂无'}}</span>
                      </li>
                      <li class="right">
                        <span>出价：</span>
                        <span>{{detail.baseInfo.sendpricetrue||'暂无'}}</span>
                      </li>
                      <li class="left">
                        <span>留存：</span>
                        <span>{{detail.baseInfo.percentage||'暂无'}}</span>
                      </li>
                      <li class="right">
                        <span>留存出价：</span>
                        <span>{{detail.baseInfo.sendPercentage || '暂无'}}</span>
                      </li>
                      <div v-for="(item,index) in detail.ladderInfo" :key="index">
                        <div v-if="item.magnitude != ''">
                            <li>
                            <span>量级：</span>
                            <span>{{item.magnitude}}(万)</span>
                            </li>
                            <div style="clear:both;margin-bottom:45px"></div>
                            <span>
                            <li class="left">
                                <span>进价：</span>
                                <span>{{item.unitPrice||'暂无'}}</span>
                            </li>
                            <li class="right">
                                <span>出价：</span>
                                <span>{{detail.baseInfo.sendpricetrue||'暂无'}}</span>
                            </li>
                            <div style="clear:both"></div>
                            </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ul>
              <div style="clear:both"></div>
            </div>
          </div>
        </div>
        <!-- 官返信息 -->
        <div class="backInformation">
          <span class="Title">官返信息</span>
          <div class="main">
            <!-- 留存 -->
            <Table
              border
              id="productLinkId"
              :columns="keepHeader"
              :data="sheetData.keepContent"
            ></Table>
          </div>
        </div>
        <!-- 返回 -->
        <div class="back">
          <Button @click="backDataSheet">返回</Button>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
import moment from 'moment'
export default {
  data () {
    return {
      // 详情
      detail: {
        baseInfo: {},
        ladderInfo: []
      },
      // 表头搜索
      headerSearch: {
        date: [] // 日期
      },
      // 留存
      keepHeader: [
        {
          title: '日期',
          key: 'date',
          align: 'center',
          width: 110,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <i class="ivu-icon ivu-icon-ios-search" />
                  </span>
                  <div slot="content">
                    <div>
                      <DatePicker
                        v-on:on-ok={() => {
                          this.getListData()
                        }}
                        type="daterange"
                        v-model={this.headerSearch.date}
                        confirm
                        placement="bottom-start"
                        placeholder="输入时间"
                      />
                    </div>
                  </div>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '安装数',
          key: 'proNum',
          align: 'center'
        },
        {
          title: '留存数',
          key: 'rechargeNum',
          align: 'center'
        },
        {
          title: '应收',
          key: 'receivePrice',
          align: 'center'
        },
        {
          title: '应付',
          key: 'payPrice',
          align: 'center'
        },
        {
          title: '利润',
          key: 'profit',
          align: 'center'
        }
      ],
      sheetData: {
        keepContent: [] // 留存数据
      }
    }
  },
  mounted () {
    this.getData() // 获取详情数据
    this.getListData() // 获取表格数据
  },
  methods: {
    // 获取详情数据
    getData () {
      this.$axios({
        url: baseUrl + '/data/getDetail',
        method: 'post',
        data: $qs.stringify({
          id: this.$route.query.id
        })
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.detail = res.data.content
            this.settlementId = res.data.content.baseInfo.settlementId
          } else {
            // this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 获取表格数据
    getListData () {
      let {
        date // 日期
      } = this.headerSearch

      let sendData = {
        startTime: '', // 合同开始时间
        endTime: '', // 合同结束时间
        id: this.$route.query.id
      }
      if (date[0]) {
        sendData.startTime = moment(date[0]).format('YYYY-MM-DD')
        sendData.endTime = moment(date[1]).format('YYYY-MM-DD')
      }
      this.$axios({
        url: baseUrl + '/data/getRetain',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            // 留存
            this.sheetData.keepContent = res.data.content.retainInfo
            var sum2 = res.data.content.totalInfo
            sum2.date = '合计'
            this.sheetData.keepContent.push(sum2)
          } else {
            // this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },

    // 返回
    backDataSheet () {
      this.$router.push({
        name: 'dataSheet'
      })
    }
  }
}
</script>

<style scoped>
ul li {
  list-style: none;
}

.Title {
  font-size: 14px;
  padding-left: 10px;
  border-left: 3px solid #19aa8d;
  height: 25px;
  line-height: 25px;
  display: block;
  font-weight: bold;
}

.main {
  margin: 20px 70px;
  font-size: 13px;
}

.mainTop {
  height: 50px;
  background: #ebeaea;
  line-height: 50px;
  text-align: center;
  font-weight: bold;
  color: #19aa8d;
}

.mainCont {
  width: 800px;
  margin: auto;
  font-size: 14px;
  margin-top: 20px;
}

.mainCont ul li {
  width: 300px;
  height: 50px;
  line-height: 50px;
}

.left {
  float: left;
}

.right {
  float: right;
}
.backInformation {
  margin-bottom: 50px;
}
.back {
  text-align: center;
  margin-bottom: 30px;
}
</style>
<style lang="less">
#productLinkId{
.ivu-btn.ivu-btn-primary.ivu-btn-small{
        background-color: #fff;
}
.ivu-btn.ivu-btn-default.ivu-btn-small:hover{
    color: #19aa8d;
    background-color: #fff;
    border-color: #19aa8d;
}
.ivu-date-picker-cells-cell-selected em, .ivu-date-picker-cells-cell-selected:hover em {
    background: #19aa8d;
    color: #fff;
}
.ivu-date-picker-cells-focused em{
    box-shadow: 0 0 0 1px #19aa8d inset;

}
.ivu-date-picker-focused input{
    border-color: #19aa8d;
    outline: 0;
    box-shadow: none;
}
}

</style>
