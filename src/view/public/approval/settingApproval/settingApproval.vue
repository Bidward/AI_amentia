<template>
    <div class="viewWrapperGray">
        <!-- 2019.12.2庞颖 -->
        <!-- <section>
            <header class="titleGray">任务审批流程设置</header>
            <div v-for="(item,index) in approveProcess" :value="index" :key="`item+${index}`">
                <Row class="row-approval" v-if="item.approveTypeName!=='日常奖惩销分'">
                    <Col span="8">
                        <span>类型：</span>
                        <span>{{item.approveTypeName}}</span>
                    </Col>
                    <Col span="8">
                        <Col span="5">
                            <span style="font-weight: bold;">审批人：</span>
                        </Col>
                        <Col span="19">
                            <span v-if="item.userList[0]!==null">
                                <span v-for="(user,index) in item.userList" :value="index" :key="`user+${index}`">
                                    <span v-if="index===item.userList.length-1">{{user.name}}</span>
                                    <span v-else>
                                        {{user.name}}
                                        <Icon class="iconProcess" type="ios-arrow-round-forward" />
                                    </span>
                                </span>
                            </span>
                            <span v-else></span>
                        </Col>
                    </Col>
                    <Col span="4" offset="4">
                        <Approver @get='getApproveProcess' :approveType="item.approveType"/>
                    </Col>
                </Row>
            </div>
        </section> -->
        <section>
            <header class="titleGray">日常奖惩销分审批流程设置</header>
            <div v-for="(item,index) in approveProcess" :value="index" :key="`item+${index}`">
                <Row class="row-approval" v-if="item.approveTypeName==='日常奖惩销分'">
                    <Col span="8">
                        <span>类型：</span>
                        <span>{{item.approveTypeName}}</span>
                    </Col>
                    <Col span="8">
                        <Col span="5">
                            <span style="font-weight: bold;">审批人：</span>
                        </Col>
                        <Col span="19">
                            <span v-if="item.userList.length>=1">
                                <span v-for="(user,index) in item.userList" :value="index" :key="`user+${index}`">
                                    <span v-if="user">
                                        <span v-if="index===item.userList.length-1">{{user.name}}</span>
                                        <span v-else>
                                            {{user.name}}
                                            <Icon class="iconProcess" type="ios-arrow-round-forward" />
                                        </span>
                                    </span>
                                </span>
                            </span>
                            <span v-else></span>
                        </Col>
                    </Col>
                    <Col span="4" offset="4">
                        <SettingApprovalModal @get='getApproveProcess' :approveType="item.approveType"/>
                    </Col>
                </Row>
            </div>
        </section>
    </div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
import SettingApprovalModal from './settingApprovalModal'
export default {
  name: 'settingApproval',
  components: { SettingApprovalModal },
  data () {
    return {
      approveProcess: []
    }
  },
  mounted () {
    this.getApproveProcess()
  },
  methods: {
    // 获取审批流程列表页
    getApproveProcess () {
      this.$axios({
        url: baseUrl + '/approve/getProcess',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.approveProcess = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.viewWrapperGray{
    .row-approval{
        padding: 20px 80px;
        .ivu-col{
            line-height: 32px;
            .iconProcess:before{
                color: #19aa8d;
                font-size: 20px;
                font-weight: bold;
            }
        }
    }
}
</style>
