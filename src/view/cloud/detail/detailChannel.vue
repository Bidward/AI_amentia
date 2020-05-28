<template>
<!--渠道公司详情-->
<div class="cloudCooper">
    <Tabs value="1" tab="outTable" :animated="false">
        <TabPane label="渠道公司" name="1">
            <!--渠道公司-->
            <channelCompnent></channelCompnent>
            <br>
            <!--合同库-->
            <contractComponent></contractComponent>
            <div class="detailContent" v-if="noticeDelete">
                <Row class="rowPadding">
                    <Col span="12" offset="3" class="cardTitle">通知人</Col>
                </Row>
                <!--通知人-->
                <Row class="rowPadding">
                    <Col span="17" offset="4">
                    <Icon type="ios-add-circle-outline" v-if="addTwoEntry" size="50" @click="showEntry=true" style="margin-top: 22px; color: #CCC; cursor: pointer;" />
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
                    <Col span="6" offset="11" >
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
import channelCompnent from '../component/product/channelCompnent'
import contractComponent from '../component/product/contractComponent'
import {
  baseUrl
} from '@/api/base.js'
export default {
  name: 'detaileChannel',
  components: {
    channelCompnent,
    contractComponent
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
      if (this.$router.currentRoute.query.type === 'delete' || this.$router.currentRoute.query.type === 'deleteTbc') {
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
        name: 'channelCompany'
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
        url: baseUrl + '/productChannel/delect',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.$Message.info(res.data.msg)
          bus.$emit('on-myclose', this.$route)
          this.$router.push({
            name: 'channelCompany'
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
            route: 'waitConChannel',
            id: this.$route.query.productChannelId
          }
          this.deleAxiox(sendData)
        } else {
          this.$Message.info('请选择通知人!')
        }
      } else {
        sendData = {
          tbcId: this.$route.query.tbcId,
          twoEntryId: this.twoEntryId,
          route: 'waitConChannel',
          id: this.$route.query.productChannelId
        }
        this.deleAxiox(sendData)
      }
    }
  }
}
</script>

<style lang="less" scope>

</style>
