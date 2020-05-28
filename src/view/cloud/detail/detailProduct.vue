<template>
<!--产品公司详情-->
<div class="cloudCooper">
    <Tabs value="1" tab="outTable" :animated="false">
        <TabPane label="产品公司" name="1">
            <!--产品公司详情-->
            <detailComponent></detailComponent>
            <br>
            <!--合同详情-->
            <contractComponent></contractComponent>
            <br>
            <!--产品详情-->
            <productComponent></productComponent>

            <div class="detailContent" v-if="noticeDelete">
                <Row class="rowPadding">
                    <Col span="12" offset="3" class="cardTitle">通知人</Col>
                </Row>
                <!--通知人-->
                <Row class="rowPadding">
                    <Col span="17" offset="4">
                    <Icon type="ios-add-circle-outline" v-if="addTwoEntry" size="50" @click="showEntry=true" style="margin-top: 22px; color: #CCC;cursor: pointer;" />
                    <div v-else style="float: left;margin-right: 15px;">
                        <Icon type="ios-contacts" size="50" style="display: block;" @click="showEntry=true"></Icon>
                        <p style="">{{this.twoEntryName+' '||'通知人'}}</p>
                    </div>
                    </Col>
                </Row>
            </div>
            <!--通知人弹窗-->
            <Modal :mask-closable="false" id="addNotice" v-model="showEntry" title="通知人" @on-ok="ok">
                <Select :value="twoEntryId" filterable :label-in-value="true" @on-change="getEntryName">
                    <Option v-for="person in incumbencyTbUser" :key="person.id" :value="person.id" :label="person.nickname">
                        <div>
                            <p>{{person.nickname}}</p>
                            <p>部门：{{person.deptName}}</p>
                            <p>职位：{{person.positionName}}</p>
                        </div>
                    </Option>
                </Select>
            </Modal>
            <!--操作按钮-->
            <div class="detailContent" style="margin-top:20px">
                <Row class="rowPadding" style="margin-left:5%">
                    <Col span="6" offset="11">
                    <Button type="warning" @click="goBack" style="margin-right:30px">返回</Button>
                    <Button type="error" v-if="delectButton" @click="deletProduct">删除</Button>
                    </Col>
                </Row>
            </div>
        </TabPane>
    </Tabs>
</div>
</template>

<script>
import detailComponent from '../component/product/detailComponent'
import contractComponent from '../component/product/contractComponent'
import productComponent from '../component/product/productComponent'
import {
  baseUrl
} from '@/api/base.js'
export default {
  name: 'detaileProduct',
  components: {
    detailComponent,
    contractComponent,
    productComponent
  },
  data () {
    return {
      noticeDelete: false,
      delectButton: false,
      showEntry: false,
      addTwoEntry: true,
      twoEntryName: '',
      twoEntryId: ''
      // incumbencyTbUser: []
    }
  },
  beforeRouteLeave (to, from, next) {
    if (from.name === 'detailProduct') {
      console.log(sessionStorage.businessId)
      if (sessionStorage.businessId) {
        let id = sessionStorage.businessId
        sessionStorage.setItem('businessID', id)
      }
    } else {
      sessionStorage.clear()
    }
    console.log(from)
    next()
  },
  inject: ['app'],
  computed: {
    incumbencyTbUser () { // 在职人员
      return this.app.employees
    }
  },
  mounted () {
    // this.getData()
    this.isDelete()
  },
  methods: {
    isDelete () {
      if (this.$router.currentRoute.query.type === 'delete' || this.$router.currentRoute.query.type === 'deleteTbc' || this.$router.currentRoute.query.type === 'delProdctBanck') {
        this.delectButton = true
      }
      if (this.$router.currentRoute.query.type === 'delete') {
        this.noticeDelete = true
      }
    },
    // getData () {
    //   // 在职人员
    //   this.$axios({
    //     url: baseUrl + '/user/getIncumbencyTbUser',
    //     method: 'post'
    //   }).then(res => {
    //     if (res.data.code === 10000) {
    //       this.incumbencyTbUser = res.data.content
    //     } else {
    //       this.$Message.error(res.data.msg)
    //     }
    //   }).catch(err => {
    //     console.error(err)
    //   })
    // },
    goBack () {
      bus.$emit('on-myclose', this.$route)
      this.$router.push({
        name: 'productBank'
      })
    },
    // 根据通知人id
    getEntryName (ids) {
      this.showTwoEntryName = ids.label
      this.showTwoEntryId = ids.value
    },
    ok () {
      if (this.showTwoEntryName === undefined) {
        this.twoEntryName = ''
      } else {
        this.addTwoEntry = false
        this.twoEntryName = this.showTwoEntryName
        this.twoEntryId = this.showTwoEntryId
      }
    },
    deleAxiox (sendData) {
      this.$axios({
        url: baseUrl + '/productCompany/delect',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.$Message.info(res.data.msg)
          bus.$emit('on-myclose', this.$route)
          this.$router.push({
            name: 'waitConProduct'
          })
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    deletProduct () {
      let sendData = {}
      // 第一遍删除
      if (this.$router.currentRoute.query.type === 'delete') {
        // 是否有通知人
        if (this.twoEntryId !== '') {
          sendData = {
            twoEntryId: this.twoEntryId,
            route: 'waitConProduct',
            id: this.$route.query.productCompanyId
          }
          this.deleAxiox(sendData)
        } else {
          this.$Message.info('请选择通知人!')
        }
        // 第二人删除
      } else if (this.$router.currentRoute.query.type === 'delProdctBanck') { // 产品库过来的删除
        sendData = {
          tbcId: this.$route.query.tbcId,
          //   route: 'productCompany',
          id: this.$route.query.productCompanyId
        }
        this.$axios({
          url: baseUrl + '/Commodity/deleteCommodity',
          method: 'post',
          data: $qs.stringify(sendData)
        }).then(res => {
          if (res.data.code === 10000) {
            this.$Message.info(res.data.msg)
            bus.$emit('on-myclose', this.$route)
            this.$router.push({
              name: 'productBank'
            })
          } else if (res.data.code === 10104) {
            this.$Modal.confirm({
              title: '提醒',
              content: '<p>当前产品存在产品编码无法删除</p>',
              cancelText: ' '
            })
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.error(err)
        })
      } else {
        sendData = {
          tbcId: this.$route.query.tbcId,
          twoEntryId: this.twoEntryId,
          route: 'waitConProduct',
          id: this.$route.query.productCompanyId
        }
        this.deleAxiox(sendData)
      }
    }
  }
}
</script>

<style lang="less" scope>

</style>
