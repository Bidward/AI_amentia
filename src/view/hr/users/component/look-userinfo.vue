<template>
<div class="detail-page-wrapper">
    <div class="detail-page" style="position: relative">
        <!--headinf s-->
        <headeInfo :info="info"></headeInfo>
        <!--main content s-->
        <div class="page-middle-wrapper">
            <div class="page-middle">
                <!--用户信息处进入查看用户信息 没有编辑-->
                <showBaseInfo v-if="this.$route.query.type"></showBaseInfo>
                <!--查看进入 可以进行编辑操作-->
                <Tabs size="small" v-else :animated="false">
                    <TabPane label="基础信息">
                        <!--查看用户信息 s-->
                        <showBaseInfo @showEdit="showEdit" v-if="!isEidt"></showBaseInfo>
                        <!--编辑用户信息 s-->
                        <editBaseInfo
                            @showEdit="showEdit"
                            v-if="isEidt"
                            @getBaseInfo="getBaseInfo"
                            ref="basicInfo"
                        ></editBaseInfo>
                    </TabPane>
                    <TabPane label="账号信息">
                        <showAccountInfo ref="accountInfo"></showAccountInfo>
                    </TabPane>
                    <TabPane label="外出培训">
                        <showOutTrain ref="training"></showOutTrain>
                    </TabPane>
                    <TabPane v-if="this.$route.query.status" label="离职信息">
                        <showLeaveInfo></showLeaveInfo>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import mixins from '../mixins'
import headeInfo from './heade-info'
import showBaseInfo from './show-base-info'
import editBaseInfo from './edit-base-info'
import showAccountInfo from './show-account-info'
import showOutTrain from './show-out-train'
import showLeaveInfo from './show-leave-info'
export default {
  name: 'completeInfo',
  components: {
    headeInfo,
    editBaseInfo,
    showBaseInfo,
    showAccountInfo,
    showOutTrain,
    showLeaveInfo
  },
  mixins: [mixins],
  data () {
    return {
      isEidt: false,
      info: {},
      baseInfo: {

      }
    }
  },
  methods: {
    showEdit (data) {
      this.isEidt = data
    },
    getBaseInfo (data) {
      this.baseInfo = data
    }
  },
  beforeRouteLeave (to, from, next) {
    let hasChange = false
    let components = [this.$refs.accountInfo, this.$refs.basicInfo, this.$refs.training]
    components.some(component => {
      if (component) {
        if (component.hasContentChanged && component.hasContentChanged()) {
          hasChange = true
        }
      }
    })
    if (hasChange) {
      this.$Modal.confirm({
        title: '取消编辑',
        content: '<p>还有未保存的内容，确认取消吗</p>',
        onOk: () => {
          next()
        }
      })
    } else {
      next()
    }
  }
}
</script>

<style lang="less">
.detail-page-wrapper {
    background-color: #fff;
    table input {
        border-radius: unset;
        border: none;
        border-bottom: 1px solid #dcdee2;
        outline: none;
    }
    .ivu-tabs-bar{
        border-bottom:none;
        margin-left: -15px;
    }
    .ivu-tabs-ink-bar{
        background-color:#fff;
    }
    .ivu-form-item-label{
        color:#666666;
        font-size: 14px;
    }
    .ivu-form-item-content p{
        color: #999999;
        font-size:14px;
    }
}
</style>
<style lang="less" scoped>
@import '~@/assets/style/variables.less';

.detail-page-wrapper {
    background-color: #fff;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    overflow-y: scroll;

    .detail-page {
        height: 100%;
        position: relative;
        height: 100%;

        .page-middle-wrapper {
            border-radius: 25px;
            position: absolute;
            top: 180px;
            bottom: 0;
            left: 30px;
            right: 30px;
            box-sizing: border-box;
            background: #fff;

            .page-middle {
                background: #fff;
                padding: 30px 30px;
                border-radius: 10px;
                margin-bottom: 100px;
                box-shadow: 0 2px 13px 0 rgba(0, 0, 0, 0.12);

            }
        }
    }
}
</style>
