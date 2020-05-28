<template>
  <div class="cloudCooper" >
    <Tabs value="2" tab="outTable"  :animated="false"  @on-click="openComponent" >
      <TabPane label="业务配置" name="1"></TabPane>
      <TabPane label="标签关联管理" name="2"  ></TabPane>
      <TabPane label="待确认事项" name="3" ></TabPane>
    </Tabs>
    <div class="container">
      <Row >
        <Col span="8">
          <Menu  @on-select ="getId"   :active-name="activeName" :open-names="myOpenName" accordion  ref="menus" >
            <Submenu v-for="item in treeData" :name ="item.name"  :key="item.title">
              <template slot="title">
                <Icon type="ios-paper" />
                {{item.title}}
              </template>
              <MenuItem  v-for="item1 in item.children" :name ='item1.name' :key="item1.title">{{item1.title}}</MenuItem>
            </Submenu>
          </Menu>
        </Col>
      </Row>
      <!-- 第二人编辑 -->
      <div>
        <!-- 右侧产品和渠道公司 -->
        <div class="rightContainer">
          <div class="product rightBox">
            <div class="titles"><h2>关联产品 ({{productSum}})</h2></div>
            <ul>
              <li v-for="(item,index) in product.Commodity" :key="index"><span>{{item.commodityName}}</span><i-switch v-model="item.type" size="small" class="switch"  @on-change="changeState(item)"/></li>
            </ul>
          </div>
          <div class="channel rightBox">
            <div class="titles"><h2>关联渠道公司 ({{channelSum}})</h2></div>
            <ul>
              <li v-for="(item,index) in product.ProductChannel" :key="index"><span>{{item.channelName}}</span><i-switch v-model="item.type" size="small" class="switch"  @on-change="changeState(item)"/></li>
            </ul>
          </div>
        </div>
         <!--信息对比-->
        <div class="detailContent" v-if="compareContent">
          <Row class="rowPadding">
            <Col span="12" offset="1" class="cardTitle">信息对比</Col>
          </Row>
          <Row class="rowPadding" >
            <Col span="24" offset="4">
              <div class="compareClasee">
                <div class="compareHeader">不同项</div>
                <div class="compareContentClass" v-for ="(item,index) in compareData" :key="index">
                  <p>{{item}}</p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    <!-- 操作 -->
    <div class="detailContent" >
      <Row class="rowPadding" style="marfin-top:30px">
        <Col span="12" offset="10">
          <Button  style="margin-right:30px" @click="goBack()">取消</Button>
          <Button type="success" @click="saveData()">保存</Button>
        </Col>
      </Row>
    </div>
    </div>
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
export default {
  name: 'towEditLableManage',
  data () {
    return {
      treeData: [], // 树形数据
      product: {}, // 产品和渠道的数据
      tbcId: '-1', // 列表ID
      activeName: this.$route.params.activeNameEdit, // 菜单展开二级标签
      myOpenName: this.$route.params.openNameEdit, // 菜单展开一级标签
      oneLabel: 0, // 一级标签ID
      twoLabel: 0, // 二级标签ID
      isOneEntry: false, // 是否为第一人编辑
      isOneEntryEdit: false, // 待确认列表进入
      // isTwoEntry:false,//第二人编辑
      showEntry: false, // 是否展示通知人ICON
      addTwoEntry: true, // 是否展示添加通知人ICON
      TwoEntryName: this.$route.params.twoEntryName, // 通知人
      TwoEntryNameId: '', // 通知人ID
      username: [], // 当前用户名
      notifierList: [], // 通知人列表
      changeLabel: false, // 是否可以更改二级标签
      compareContent: false, // 信息对比
      compareData: [], // 不同信息
      productSum: '',
      channelSum: ''
    }
  },
  mounted () {
    this.getTreeData() // 获取树形菜单数据
    this.getListData() // 获取渠道数据和产品数据
    this.getUsername()// 获取当前用户名
  },
  methods: {
    // 获取当前用户名
    getUsername () {
      this.$axios({
        url: baseUrl + '/login/getuser',
        method: 'get'
      }).then(res => {
        if (res.data.code === 200) {
          this.username = res.data.nickname
        }
      })
    },
    // 获取树形菜单数据
    getTreeData () {
      this.$axios({
        url: baseUrl + '/Business/findAll',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.treeData = res.data.content
          this.activeName = ''
          this.$nextTick(() => {
            this.activeName = this.$route.params.activeNameEdit
            this.myOpenName = this.$route.params.openNameEdit
            this.$refs.menus.updateOpened()
            this.$refs.menus.updateActiveName()
          })
          this.oneLabel = this.$route.params.openNameEdit[0]
          this.twoLabel = this.$route.params.activeNameEdit
          this.tbcId = this.$route.params.tbcId
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取右侧产品和渠道数据
    getListData () {
      let sendData = {
        id: this.$route.params.activeNameEdit
      }
      this.$axios({
        url: baseUrl + '/Business/setCommodityAndProductChannel  ',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.product = res.data.content
          this.productSum = res.data.content.CommodityCount
          this.channelSum = res.data.content.ProductChannelCount
          if (this.product.Commodity.length === 0 && this.product.ProductChannel.length === 0) {
            this.$Message.info('暂无数据')
          }
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 未点保存不允许切换二级标签
    getId (name) {
      if (this.changeLabel === false) {
        this.$Message.error('请保存')
        this.getTreeData()
      } else {
        this.$axios({
          url: baseUrl + '/Business/setCommodityAndProductChannel  ',
          method: 'post',
          data: $qs.stringify({ id: name })
        }).then(res => {
          if (res.data.code === 10000) {
            this.product = res.data.content
            if (this.product.Commodity.length === 0 && this.product.ProductChannel.length === 0) {
              this.$Message.info('暂无数据')
            }
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    // 返回按钮
    goBack () {
      bus.$emit('on-myclose', this.$route)
      this.$router.push({
        name: 'labelManage'
      })
    },
    openComponent (name) {
      switch (name) {
        case '1':
          this.$router.push({
            name: 'cloudConfig'
          })
          break
        case '2':
          this.$router.push({
            name: 'labelManage'
          })
          break
        case '3':
          this.$router.push({
            name: 'waitConfirmCon'
          })
          break
      }
    },
    // 判断产品是否包含当前标签为最后一个标签
    changeState (item) {
      // if (item.onlyOneLabel === false && item.type === false) {
      //   this.$Message.info('该产品必须至少拥有一个标签,请开启')
      //   for (let i in this.product.Commodity) {
      //     if (this.product.Commodity[i].id === item.id) {
      //       this.product.Commodity[i].type = true
      //     }
      //   }
      // }
      if (item.type === false && item.commodity === 'commodity') {
        this.productSum = this.productSum - 1
      } else if (item.type === true && item.commodity === 'commodity') {
        this.productSum = this.productSum + 1
      } else if (item.type === false && item.productChannel === 'productChannel') {
        this.channelSum = this.channelSum - 1
      } else {
        this.channelSum = this.channelSum + 1
      }
    },
    // 保存
    saveData () {
      this.changeLabel = true
      let sendData = {
        channel: this.product.ProductChannel,
        commdity: this.product.Commodity,
        oneLable: this.oneLabel,
        twoLable: this.twoLabel,
        tbcId: this.tbcId
      }
      this.$axios({
        url: baseUrl + '/Business/insert',
        method: 'post',
        data: sendData
      }).then(res => {
        if (res.data.code === 10000) {
          this.$Message.info(res.data.msg)
          this.compareContent = false
          this.compareData = []
          bus.$emit('on-myclose', this.$route)
          this.$router.push({
            path: '/set/labelManage',
            query: {
              type: 'twoEditRouter',
              oneLabels: sendData.oneLable,
              twoLabels: sendData.twoLable
            }
          })
        } else if (res.data.code === 10021) {
          this.compareContent = true
          this.compareData = res.data.content
        } else {
          this.$Message.error(res.data.msg)
          this.compareContent = false
          this.compareData = []
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
    background:#F7F7F7;
    z-index: 2;
    border: 1px solid #E2E2E2;
    border-right: none;
    width: 239px;
    border-radius: 5px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    font-weight: 600;
    line-height: 0px;
    height: 30px;
    overflow: hidden;
    white-space: pre;  //不换行
    text-overflow: ellipsis; //超出部分省略号
}
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):after{
  background: none;
}
.ivu-menu-item{
  height: 30px;
  font-size: 13px;
  line-height: 0px;
  margin-top: 15px;
  overflow: hidden;
  white-space: pre;  //不换行
  text-overflow: ellipsis; //超出部分省略号

}
.container{
    display: flex;
    margin-top: 50px;
  .tree{
    width: 225px;
    border-right: 1px solid #E2E2E2;
    margin-right: 20px;
  }
  .ivu-tree-title {
    font-size: 14px;
    font-weight: 600;
  }
  .ivu-tree-title{
    font-size: 13px;
  }
  .rightContainer{
    display: flex;
    width: 680px;
    flex-wrap: wrap;
    margin-left: 20px;
  }
  .rightBox{
    width: 320px;
    height: 600px;
    border: 1px solid #E2E2E2;
    margin-right: 20px;
     ul{
       margin-left: 8px;
       overflow-y: auto;
       height: 565px;
      li{
        margin-top: 8px;
        background: #F7F7F7;
        border: 1px solid #e2e2e2;
        border-radius: 3px;
        height: 30px;
        line-height: 30px;
        width: 299px;
        box-sizing: border-box;
        padding-left: 5px;
        overflow: hidden;
        font-size: 13px;
        color: #999;
        position: relative;
        span:first-child{
          display: block;
          width: 250px;
          overflow: hidden;
          white-space: nowrap;  //不换行
          text-overflow: ellipsis; //超出部分省略号
        }
      }
      li:last-child{
        margin-bottom: 8px;
      }
    }
    ul::-webkit-scrollbar{
      width: 4px;
      height: 0;
    }
    ul::-webkit-scrollbar-thumb{
      border-radius: 5px;
      box-shadow: inset 0 0 4px #e2e2e2;
      background:#e2e2e2;
    }
    ul::-webkit-scrollbar-track{
      box-shadow: inset 0 0 5px #FFF;;
      border-radius: 0;
      background: #FFF;
    }
  }
  .channel{
    width: 320px;
    height: 600px;
    border: 1px solid #E2E2E2;
  }
  .titles{
    line-height: 35px;
    height: 35px;
    border-bottom: 1px solid #e2e2e2;
    h2{
      color: #666;
      margin-left: 20px;
      font-size: 14px;
    }
  }
  .switch{
    position: absolute;
    top: 7px;
    bottom: 0;
    right: 8px;
  }
  .detailContent{
    margin-top:40px;
  }
}
</style>
<style lang="less" scoped>
.compareClasee{
  .compareHeader{
      border:1px solid #e8eaec;
      background-color: #f8f8f9;
      color: #515a6e;
      text-align: center;
  }
  .compareContentClass{
      border:1px solid #e8eaec;
      border-top:none;
      text-align: center;
      p{
          padding:3px;
          font-size: 12px;
      }
  }
}
.detailContent{
  margin-top: 50px;
}
// .ivu-row {
//   position: relative;
//   margin-left: 0;
//   margin-right: 0;
//   height: auto;
//   zoom: 1;
//   display: block;
//   margin-top: 50px;
// }
</style>
