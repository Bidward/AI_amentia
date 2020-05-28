<template>
  <div class="cloudCooper">
    <Tabs value="2" tab="outTable"  :animated="false" @on-click="openComponent" >
        <TabPane label="业务配置" name="1"></TabPane>
        <TabPane label="标签关联管理" name="2"  ></TabPane>
        <TabPane label="待确认事项" name="3" ></TabPane>
      </Tabs>
    <div class="container">
      <Row>
        <Col span="8">
            <Menu @on-select ="getId"  @on-open-change="getSubmenuId" :active-name="activeName" :open-names="myOpenName" accordion  ref="menus" on-select="getId">
              <Submenu v-for="item in treeData" :name ="item.name"  :key="item.id" >
                <template slot="title">
                  <Icon type="ios-paper" />
                  {{item.title}}
                </template>
                <MenuItem  v-for="item1 in item.children" :name ='item1.name' :key="item1.id">{{item1.title}}</MenuItem>
              </Submenu>
            </Menu>
        </Col>
      </Row>
      <div class="rightContainer">
        <div class="product rightBox">
          <div class="titles"><h2>关联产品 ({{prodcutSum}})</h2></div>
          <ul>
            <li v-for="(item,index) in product.Commodity" :key="index"><span>{{item.commodityName}}</span></li>
          </ul>
        </div>
        <div class="channel rightBox">
          <div class="titles"><h2>关联渠道公司 ({{channelSum}})</h2></div>
            <ul>
            <li v-for="(item,index) in product.ProductChannel" :key="index"><span>{{item.channelName}}</span></li>
          </ul>
        </div>
        <Button type="success" class="editBtn" @click="editBtn">编辑</Button>
      </div>
    </div>
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
export default {
  name: 'lableManageCon',
  data () {
    return {
      treeData: [], // 树形数据
      product: {},
      activeName: '',
      labelId: '', // 二级标签ID
      parentId: [], // 一级标签ID
      prodcutSum: '', // 用于展示标签有n个产品公司
      channelSum: '', // 用于展示标签有n个渠道
      timer: ''// 定时器
    }
  },
  created () {
    this.getTreeData()
  },
  computed: {
    myOpenName () {
      if (this.$route.query.type === 'twoEditRouter') {
        return [this.$route.query.oneLabels]
      } else if (this.treeData.length > 0) {
        return [this.treeData[0].name]
      }
    }
  },
  methods: {
    getTreeData () {
      this.$axios({
        url: baseUrl + '/Business/findAll',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.treeData = res.data.content
          this.activeName = ''
          this.parentId = [this.treeData[0].name]
          if (this.$route.query.type === 'twoEditRouter') {
            this.labelId = this.$route.query.twoLabels
          } else {
            this.labelId = this.treeData[0].children[0].id
          }
          this.getListData()
          this.$nextTick(() => {
            if (this.$route.query.type === 'twoEditRouter') {
              this.activeName = this.$route.query.twoLabels
            } else {
              this.activeName = this.treeData[0].children[0].name
            }
            this.$refs.menus.updateOpened()
            this.$refs.menus.updateActiveName()
          })
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getListData () {
      let sendData = {
        id: this.labelId
      }
      this.$axios({
        url: baseUrl + '/Business/getCommodityAndProductChannel  ',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.product = res.data.content
          this.prodcutSum = this.product.Commodity.length
          this.channelSum = this.product.ProductChannel.length
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
    getId (name) {
      this.labelId = name
      this.getListData()
    },
    getSubmenuId (e) {
      this.parentId = e
    },
    editBtn () {
      this.$axios({
        url: baseUrl + '/Business/getCountLabel',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10104) {
          this.$Message.error(res.data.msg)
        } else {
          bus.$emit('on-myclose', this.$route)
          this.$router.push({
            name: 'editLabelManage',
            params: {
              id: this.labelId,
              parentId: this.parentId,
              type: 'isOneEntry'
            }
          })
        }
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
    }
  }
}
</script>

<style lang="less" scoped>
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
    // color: #19AA8D;
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

}
.ivu-menu-item{
  display: block;
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
        font-size: 13px;
        color: #999;
        box-sizing: border-box;
        padding-left: 5px;
        overflow: hidden;
        span{
          display: block;
          width: 280px;
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
  .editBtn{
    margin-top: 20px;
    // font-size: 13px;
    width: 56px;
    text-align: center;
    height: 32px;
  }
}
</style>
