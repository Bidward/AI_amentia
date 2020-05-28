<template>
  <div class="cloudCooper">
     <Tabs value="2" tab="outTable"  :animated="false" @on-click="openComponent" >
        <TabPane label="业务配置" name="1"></TabPane>
        <TabPane label="标签关联管理" name="2"  ></TabPane>
        <TabPane label="待确认事项" name="3" ></TabPane>
      </Tabs>
    <div class="container">
      <Row v-if="isOneEntry">
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
       <Row v-if="isOneEntryEdit">
        <Col span="8">
          <Menu  @on-select ="getId"   :active-name="activeNameEdit" :open-names="openNameEdit" accordion  ref="menus" >
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
      <!-- 第一人编辑 -->
      <div v-if="isOneEntry">
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
              <li v-for="(item,index) in product.ProductChannel" :key="index"><span>{{item.channelName}}</span><i-switch v-model="item.type"  size="small" class="switch"  @on-change="changeState(item)"/></li>
            </ul>
          </div>
        </div>
        <!-- 通知人 -->
        <div class="detailContent">
          <Row class="rowPadding">
            <Col span="12" offset="3" class="cardTitle">通知人</Col>
          </Row>
          <!--通知人-->
          <Row class="rowPadding" >
            <Col span="17" offset="4">
              <Icon type="ios-add-circle-outline" v-if="addTwoEntry" size="50" @click="showEntry=true"  style="margin-top: 22px; color: #CCC;cursor: pointer;"/>
              <div  v-else style="float: left;margin-right: 15px;">
                <Icon type="ios-contacts"  @click="showEntry=true"  size="50" style="display: block;"></Icon>
                <p style="">{{this.TwoEntryName+' '||'通知人'}}</p>
              </div>
            </Col>
          </Row>
          <!-- 通知人弹窗 -->
          <Modal :mask-closable="false" id="addNotice" v-model="showEntry" title="通知人" @on-ok="ok">
            <Select :value="TwoEntryNameId" filterable :label-in-value="true" @on-change="getEntryName">
              <Option v-for="person in notifierList" :key="person.id" :value="person.id" :label="person.nickname">
                <div>
                  <p>{{person.nickname}}</p>
                  <p>部门：{{person.deptName}}</p>
                  <p>职位：{{person.positionName}}</p>
                </div>
              </Option>
            </Select>
          </Modal>
        </div>
    </div>
    <!-- 待确认列表编辑进入 -->
    <div v-if="isOneEntryEdit">
        <!-- 右侧产品和渠道公司 -->
        <div class="rightContainer">
          <div class="product rightBox">
            <div class="titles"><h2>关联产品 ({{productEditSum}})</h2></div>
            <ul>
              <li v-for="(item,index) in productEdit.Commodity" :key="index"><span>{{item.commodityName}}</span><i-switch v-model="item.type" size="small" class="switch"  @on-change="changeState(item)"/></li>
            </ul>
          </div>
          <div class="channel rightBox">
            <div class="titles"><h2>关联渠道公司 ({{channelEditSum}})</h2></div>
            <ul>
              <li v-for="(item,index) in productEdit.ProductChannel" :key="index"><span>{{item.channelName}}</span><i-switch v-model="item.type" size="small" class="switch"  @on-change="changeState(item)"/></li>
            </ul>
          </div>
        </div>
        <!-- 通知人 -->
        <div class="detailContent">
          <Row class="rowPadding">
            <Col span="12" offset="3" class="cardTitle">通知人</Col>
          </Row>
          <!--通知人-->
          <Row class="rowPadding" >
            <Col span="17" offset="4">
              <!-- <Icon type="ios-add-circle-outline" v-if="addTwoEntry" size="50" @click="showEntry=true"  style="margin-top: 22px; color: #CCC;cursor: pointer;"/> -->
              <div  style="float: left;margin-right: 15px;">
                <Icon type="ios-contacts"  @click="showEntry=true"  size="50" style="display: block;"></Icon>
                <p style="">{{this.TwoEntryName+' '||'通知人'}}</p>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    <!-- 操作 -->
    <div class="detailContent">
      <Row class="rowPadding">
        <Col span="12" offset="10">
          <Button  style="margin-right:30px" @click="goBack()">取消</Button>
          <Button type="success" @click="saveData()">保存</Button>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
export default {
  name: 'editLabelManage',
  data () {
    return {
      treeData: [], // 树形数据
      product: {}, // 第一人编辑产品和渠道对象
      productEdit: {}, // 第一人待确认列表产品和渠道对象
      tbcId: '-1', // 列表ID
      activeName: this.$route.params.id, // 第一人编辑菜单展开的二级标签
      myOpenName: this.$route.params.parentId, // 第一人编辑菜单展开的一级标签
      activeNameEdit: this.$route.params.activeNameEdit, // 第一人待确认列表编辑菜单展开的二级标签
      openNameEdit: this.$route.params.openNameEdit, // 第一人待确认列表编辑菜单展开的二级标签
      oneLabel: 0, // 一级标签ID
      twoLabel: 0, // 二级标签ID
      isOneEntry: false, // 是否为第一人编辑
      isOneEntryEdit: false, // 待确认列表进入
      showEntry: false, // 是否展示通知人ICON
      addTwoEntry: true, // 是否展示通知人添加ICON
      TwoEntryName: '', // 通知人
      TwoEntryNameId: '', // 通知人ID
      username: [], // 当前用户名
      notifierList: [], // 通知人列表
      changeLabel: false, // 是否可以更改二级标签
      showTwoEntryNames: '', // 展现通知人
      channelSum: '',
      productSum: '',
      productEditSum: '',
      channelEditSum: ''
    }
  },
  mounted () {
    this.getTreeData()// 获取树形菜单方法
    this.getUsername()// 获取当前用户名方法
    this.getNotifierList() // 获取通知人列表方法
    if (this.$route.params.type === 'isOneEntry') { // 如果是第一个人编辑进入
      this.isOneEntry = true
    } else if (this.$route.params.type === 'isOneEntryEdit') { // 如果是待确认列表进入
      this.isOneEntryEdit = true
      this.getUpdate() // 回显数据方法
    }
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
    // 打开不同组件
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
    // 回显
    getUpdate () {
      let sendData = {
        tbcId: this.$route.params.tbcId
      }
      this.$axios({
        url: baseUrl + '/Business/display',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.productEditSum = res.data.content.commdityCount
          this.channelEditSum = res.data.content.channelCount
          this.productEdit.Commodity = res.data.content.commdity
          this.productEdit.ProductChannel = res.data.content.channel
          this.tbcId = this.$route.params.tbcId
          this.TwoEntryName = res.data.content.twoEntryName
          this.TwoEntryNameId = res.data.content.twoEntryId
          this.oneLabel = res.data.content.oneLable
          this.twoLabel = res.data.content.twoLable
          this.$nextTick(() => {
            this.activeNameEdit = this.$route.params.activeNameEdit
            this.openNameEdit = this.$route.params.openNameEdit
            this.$refs.menus.updateOpened()
            this.$refs.menus.updateActiveName()
          })
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
      console.log(this.productSum)
    },
    // 获取树形菜单数据
    getTreeData () {
      this.$axios({
        url: baseUrl + '/Business/findAll',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.treeData = res.data.content
          this.getListData()// 获取产品和渠道列表方法
          this.activeName = ''
          this.$nextTick(() => {
            this.activeName = this.$route.params.id
            this.myOpenName = this.$route.params.parentId
            this.$refs.menus.updateOpened()
            this.$refs.menus.updateActiveName()
          })
          this.oneLabel = this.$route.params.parentId[0]
          this.twoLabel = this.$route.params.id
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取产品和渠道列表数据
    getListData () {
      let sendData = {
        id: this.$route.params.id
      }
      this.$axios({
        url: baseUrl + '/Business/setCommodityAndProductChannel  ',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.product = res.data.content
          this.productSum = this.product.CommodityCount
          this.channelSum = this.product.ProductChannelCount
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
    // 获取通知人列表
    getNotifierList () {
      this.$axios({
        url: baseUrl + '/user/getIncumbencyTbUser',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.notifierList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 判断通知人不能为自己
    getEntryName (ids) {
      // if (this.username === ids.label) {
      //   this.$Message.error('通知人不能是自己哦')
      // } else {
      //   this.showTwoEntryNames = ids.label
      // }
      this.showTwoEntryNames = ids.label
      this.showTwoEntryNameId = ids.value
    },
    // 展示通知人名字
    ok () {
      if (this.showTwoEntryNameId === undefined) {
        this.TwoEntryName = ''
        this.addTwoEntry = true
      } else {
        this.addTwoEntry = false
        this.TwoEntryName = this.showTwoEntryNames
        this.TwoEntryNameId = this.showTwoEntryNameId
      }
    },
    getId (name) {
      if (this.changeLabel === false) {
        this.$Message.error('操作未保存')
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
    // 更改状态
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
        this.productEditSum = this.productEditSum - 1
      } else if (item.type === true && item.commodity === 'commodity') {
        this.productSum = this.productSum + 1
        this.productEditSum = this.productEditSum + 1
      } else if (item.type === false && item.productChannel === 'productChannel') {
        this.channelSum = this.channelSum - 1
        this.channelEditSum = this.channelEditSum - 1
      } else if (item.type === true && item.productChannel === 'productChannel') {
        this.channelSum = this.channelSum + 1
        this.channelEditSum = this.channelEditSum + 1
      }
    },
    // 返回按钮
    goBack () {
      bus.$emit('on-myclose', this.$route)
      this.$router.push({
        name: 'labelManage'
      })
    },
    // 保存按钮
    saveData () {
      this.changeLabel = true
      if (this.$route.params.type === 'isOneEntry') {
        let sendData = {
          tbcId: this.tbcId,
          commdity: this.product.Commodity,
          channel: this.product.ProductChannel,
          twoEntryId: this.TwoEntryNameId,
          twoEntryName: this.TwoEntryName,
          oneLable: this.oneLabel,
          twoLable: this.twoLabel,
          route: 'waitConfirmCon',
          commdityCount: this.productSum,
          channelCount: this.channelSum
        }
        this.$axios({
          url: baseUrl + '/Business/insert',
          method: 'post',
          data: sendData
        }).then(res => {
          if (res.data.code === 10000) {
            this.$Message.info(res.data.msg)
            bus.$emit('on-myclose', this.$route)
            this.$router.push({
              name: 'waitConfirmCon'
            })
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      } else if (this.$route.params.type === 'isOneEntryEdit') {
        let sendData = {
          tbcId: this.$route.params.tbcId,
          commdity: this.productEdit.Commodity,
          channel: this.productEdit.ProductChannel,
          twoEntryId: this.TwoEntryNameId,
          twoEntryName: this.TwoEntryName,
          oneLable: this.oneLabel,
          twoLable: this.twoLabel,
          route: 'waitConfirmCon'
        }
        this.$axios({
          url: baseUrl + '/Business/insert',
          method: 'post',
          data: sendData
        }).then(res => {
          if (res.data.code === 10000) {
            this.$Message.info(res.data.msg)
            bus.$emit('on-myclose', this.$route)
            this.$router.push({
              name: 'waitConfirmCon'
            })
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      }
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
        font-size: 13px;
        color: #999;
        overflow: hidden;
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
    margin-top: 30px;
    margin-left:-11%;
  }
}
</style>
