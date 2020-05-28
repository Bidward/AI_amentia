<template>
    <!-- 渠道信息组件  -->
    <div>
        <Form ref="channel" :model="channel" :rules="ruleChannel">
            <Row class="rowPadding">
                <Col span="2" offset="2" class="title">
                    <i class="require">*</i>
                    <span>渠道名称：</span>
                </Col>
                <Col span="5">
                    <FormItem
                        prop="channelName"
                        :error="errors('channelName')"
                        :show-message="false"
                    >
                      <Input
                        v-model="channel.channelName"
                        placeholder="潜在客户必填字段"
                        maxlength="50"
                        show-word-limit
                        :clearable="closeIcon.channelName"
                        @mouseover.native="showClearable('channelName')"
                        @mouseout.native="hiddenClearable('channelName')"
                      />
                    </FormItem>
                </Col>
                <Col span="4" offset="2" class="title">
                    <span>来源：</span>
                </Col>
                <Col span="5">
                    <FormItem
                        prop="channelSource"
                        :error="errors('channelSource')"
                        :show-message="false"
                    >
                        <Select
                            v-model="channel.channelSource "
                            placeholder="潜在客户必填字段"
                            clearable
                            @on-change="openEasyTask"
                        >
                            <Option v-for="item in sourceList" :value="item.tagName" :key="item.id">
                                <span
                                    style="height: 1px; width:40%; background: #ccc;margin-top:8px;float:left; "
                                    v-if="item.id === -2"
                                ></span>
                                {{ item.tagName }}
                                <span
                                    style="height: 1px; width:40%; background: #ccc;margin-top:8px;float:right;"
                                    v-if="item.id === -2"
                                ></span>
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="2" offset="2" class="title">
                    <span>网址：</span>
                </Col>
                <Col span="5">
                    <FormItem prop="website" :error="errors('website')" :show-message="false">
                      <Input
                      v-model="channel.website"
                      placeholder="潜在客户必填字段"
                      maxlength="255"
                      show-word-limit
                      :clearable="closeIcon.website"
                      @mouseover.native="showClearable('website')"
                      @mouseout.native="hiddenClearable('website')"
                      />
                    </FormItem>
                </Col>
                <Col span="4" offset="2" class="title">
                    <span>公司/个人：</span>
                </Col>
                <Col span="5">
                    <FormItem
                        prop="companyType"
                        :error="errors('companyType')"
                        :show-message="false"
                    >
                        <Select
                            v-model="channel.companyType"
                            @on-change="selectPerOrCom"
                            clearable
                            placeholder="待联系必填字段"
                        >
                            <Option
                                v-for="item in perOrComList"
                                :value="item.label"
                                :key="item.value"
                            >
                                <span
                                    style="height: 1px;width: 41%; background: #ccc;margin-top:8px;float:left; "
                                    v-if="item.value === -2"
                                ></span>
                                {{ item.label }}
                                <span
                                    style="height: 1px;width: 41%; background: #ccc;margin-top:8px;float:right;"
                                    v-if="item.value === -2"
                                ></span>
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <!-- 公司 -->
            <Row class="rowPadding" v-if="channel.companyType==='公司'">
                <Col span="2" offset="2" class="title">
                    <span>公司名称：</span>
                </Col>
                <Col span="5">
                    <FormItem
                        prop="companyName"
                        :error="errors('companyName')"
                        :show-message="false"
                    >
                        <Input
                            v-model="channel.companyName"
                            placeholder="待联系必填字段"
                            @on-change="changeCompanyName"
                            maxlength="100"
                            show-word-limit
                            :clearable="closeIcon.companyName"
                            @mouseover.native="showClearable('companyName')"
                            @mouseout.native="hiddenClearable('companyName')"
                        />
                    </FormItem>
                </Col>
            </Row>
            <!-- 个人 -->
            <Row class="rowPadding" v-if="channel.companyType==='个人'">
                <Col span="2" offset="2" class="title">
                    <span>姓名：</span>
                </Col>
                <Col span="5">
                    <FormItem prop="personName" :error="errors('personName')" :show-message="false">
                        <Input
                            v-model="channel.personName"
                            placeholder="潜在客户必填字段"
                            @on-change="changePersonName"
                            maxlength="30"
                            show-word-limit
                            :clearable="closeIcon.personName"
                            @mouseover.native="showClearable('personName')"
                            @mouseout.native="hiddenClearable('personName')"
                        />
                    </FormItem>
                </Col>
                <Col span="4" offset="2" class="title">
                    <span>身份证：</span>
                </Col>
                <Col span="5">
                    <FormItem
                        prop="personCardId"
                        :error="errors('personCardId')"
                        :show-message="false"
                    >
                        <Input
                            v-model="channel.personCardId"
                            placeholder="建立联系必填字段"
                            @on-change="changePersonId"
                            maxlength="20"
                            show-word-limit
                            :clearable="closeIcon.personCardId"
                            @mouseover.native="showClearable('personCardId')"
                            @mouseout.native="hiddenClearable('personCardId')"
                        />
                    </FormItem>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="2" offset="2" class="title">
                    <span>联系地址：</span>
                </Col>
                <Col span="5">
                    <FormItem
                        prop="contactAddress"
                        :error="errors('contactAddress')"
                        :show-message="false"
                    >
                        <Input
                        v-model="channel.contactAddress"
                        placeholder="待联系必填字段"
                        maxlength="200"
                        show-word-limit
                        :clearable="closeIcon.contactAddress"
                        @mouseover.native="showClearable('contactAddress')"
                        @mouseout.native="hiddenClearable('contactAddress')"
                        />
                    </FormItem>
                </Col>
                <Col span="4" offset="2" class="title">
                    <span>渠道类型：</span>
                </Col>
                <Col span="5">
                    <FormItem
                        prop="channelType"
                        :error="errors('channelType')"
                        :show-message="false"
                    >
                        <Select
                            v-model="channel.channelType"
                            placeholder="待联系必填字段"
                            @on-change="selectChannelType"
                            clearable
                        >
                            <Option
                                v-for="item in channelTypeList"
                                :value="item.name"
                                :key="item.id"
                                clearable
                            >
                                <span
                                    style="height: 1px;width: 41%; background: #ccc;margin-top:8px;float:left; "
                                    v-if="item.id === -2"
                                ></span>
                                {{ item.name }}
                                <span
                                    style="height: 1px;width: 41%; background: #ccc;margin-top:8px;float:right;"
                                    v-if="item.id === -2"
                                ></span>
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <!-- 站点 -->
            <div v-if="channel.channelType==='站点'">
                <Row class="rowPadding">
                    <Col span="2" offset="2" class="title">
                        <span>归属：</span>
                    </Col>
                    <Col span="5">
                        <FormItem prop="belongTo" :error="errors('belongTo')" :show-message="false">
                            <Select v-model="channel.belongTo" placeholder="建立联系必填字段">
                                <Option
                                    v-for="item in affiliationList"
                                    :value="item.title"
                                    :key="item.id"
                                    clearable
                                >{{ item.title }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="4" offset="2" class="title">
                        <span>量级：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="numberLevel"
                            :error="errors('numberLevel')"
                            :show-message="false"
                        >
                            <Select v-model="channel.numberLevel" placeholder="建立联系必填字段">
                                <Option
                                    v-for="item in magnitudeList"
                                    :value="item.tagName"
                                    :key="item.id"
                                    clearable
                                >{{ item.tagName }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row class="rowPadding">
                    <Col span="2" offset="2" class="title">
                        <span>域名：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="domainName"
                            :error="errors('domainName')"
                            :show-message="false"
                        >
                            <Input
                            v-model="channel.domainName"
                            placeholder="建立联系必填字段"
                            maxlength="50"
                            show-word-limit
                            :clearable="closeIcon.domainName"
                            @mouseover.native="showClearable('domainName')"
                            @mouseout.native="hiddenClearable('domainName')"
                            />
                        </FormItem>
                    </Col>
                    <Col span="4" offset="2" class="title">
                        <span>云控：</span>
                    </Col>
                    <Col span="5">
                        <FormItem prop="isCloud" :error="errors('isCloud')" :show-message="false">
                            <Select v-model="channel.isCloud" placeholder="已合作必填字段">
                                <Option
                                    v-for="item in cloudControlList"
                                    :value="item.id"
                                    :key="item.id"
                                    clearable
                                >{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
            </div>
            <Row class="rowPadding">
                <Col span="2" offset="2" class="title">
                    <span>市场：</span>
                </Col>
                <Col span="5">
                    <FormItem
                        prop="marketResponsibleName"
                        :error="errors('marketResponsibleName')"
                        :show-message="false"
                    >
                        <!-- <Select
                            v-model="channel.marketResponsibleName"
                            placeholder="已合作必填字段"
                            clearable
                            filterable
                            @on-query-change="isCooperation"
                        >
                            <Option
                                v-for="item in employees"
                                :value="item.nickname"
                                :key="item.id"
                                clearable
                            >{{ item.nickname }}</Option>
                        </Select> -->
                        <TreeSelectVue
                          :options="treeoptions"
                          :multiple="false"
                          :disableBranchNodes="true"
                          :value="businessPeople"
                          value-format="object"
                          @input="handleInputChange"
                        >
            </TreeSelectVue>
                    </FormItem>
                </Col>
                <Col span="4" offset="2" class="title" v-if="isCooperations">
                    <span>未合作原因：</span>
                </Col>
                <Col span="5" v-if="isCooperations">
                    <FormItem
                        prop="failCooperationCause"
                        :error="errors('failCooperationCause')"
                        :show-message="false"
                    >
                        <Select
                            v-model="channel.failCooperationCause"
                            placeholder="已合作必填字段"
                            clearable
                            @on-change="openEasyTask"
                        >
                            <Option
                                v-for="item in reasonList"
                                :value="item.tagName"
                                :key="item.id"
                                clearable
                            >
                                <span
                                    style="height: 1px;width: 41%; background: #ccc;margin-top:8px;float:left;"
                                    v-if="item.id === -2"
                                ></span>
                                {{ item.tagName }}
                                <span
                                    style="height: 1px;width: 41%; background: #ccc;margin-top:8px;float:right;"
                                    v-if="item.id === -2"
                                ></span>
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <Row class="rowPadding" v-if="!isCooperations">
                <Col span="2" offset="2" class="title">
                    <span>流失反馈：</span>
                </Col>
                <Col span="5">
                    <FormItem
                        prop="runOffCallback"
                        :error="errors('runOffCallback')"
                        :show-message="false"
                    >
                        <Select
                            v-model="channel.runOffCallback"
                            placeholder="已合作必填字段"
                            clearable
                            @on-change="openEasyTask"
                        >
                            <Option
                                v-for="item in loseBackList"
                                :value="item.tagName"
                                :key="item.id"
                                clearable
                            >
                                <span
                                    style="height: 1px;width: 41%; background: #ccc;margin-top:8px;float:left;"
                                    v-if="item.id === -2"
                                ></span>
                                {{ item.tagName }}
                                <span
                                    style="height: 1px;width: 41%; background: #ccc;margin-top:8px;float:right;"
                                    v-if="item.id === -2"
                                ></span>
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <Modal v-model="showWarn" title="提醒" @on-ok="ensure">
            <p class="warn">该字段涉及逻辑和页面开发，是否发简易任务告知产品经理您的新需求</p>
        </Modal>
        <div v-if="showLaunch">
            <launch-task :show="showLaunch" @hideTask="hide"></launch-task>
        </div>
        <Modal v-model="showToConfig" width="360" @on-ok="toConfig">
            <p slot="header" style="color:#FF9900;margin-left:3%;font-size:16px;font-weight:900;">
                <Icon type="ios-information-circle"></Icon>
                <span>提醒</span>
            </p>
            <div style="margin-left:5%;font-size:14px;">
                <p>即将跳转到业务配置自定义您的需求。</p>
                <p>是否跳转？</p>
            </div>
        </Modal>
    </div>
</template>

<script>
import LaunchTask from '../../../launch-task'
import { biUrl, baseUrl } from '@/api/base.js'
import showIconMixin from '@/view/businessSmart/components/showCloseIconMixin'
import TreeSelectVue from '@/components/tree-select-vue/tree-select-vue'
export default {
  mixins: [showIconMixin],
  name: 'channelInfo',
  inject: ['app'],
  components: {
    LaunchTask,
    TreeSelectVue
  },
  props: {
    errorInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      showWarn: false, // 简易任务提示
      showLaunch: false, // 简易任务弹框
      isCooperations: true, // 是不是已合作阶段
      ruleChannel: {
        channelName: [
          {
            required: true,
            message: '渠道信息是必填哦',
            trigger: 'blur'
          }
        ]
      },
      sourceList: [], // 来源列表
      // 公司/个人
      perOrComList: [
        {
          value: 1,
          label: '公司'
        },
        {
          value: 2,
          label: '个人'
        },
        { value: -2, label: '自定义' }
      ],
      // 渠道类型
      channelTypeList: [
        {
          id: 1,
          name: '下载器'
        },
        {
          id: 2,
          name: '分发'
        },
        {
          id: 3,
          name: '站点'
        },
        { id: -2, name: '自定义' }
      ],
      affiliationList: [], // 归属列表
      magnitudeList: [], // 量级列表
      cloudControlList: [
        {
          id: 0,
          name: '否'
        },
        {
          id: 1,
          name: '是'
        }
      ], // 云控列表
      marketList: [], // 市场列表
      reasonList: [], // 未合作原因列表
      loseBackList: [], // 流失反馈
      channel: {
        channelName: '', // 渠道名称
        channelSource: '', // 来源
        website: '', // 网址
        companyType: '', // 公司/个人
        companyName: '', // 公司名称
        personName: '', // 姓名
        personCardId: '', // 身份证
        contactAddress: '', // 联系地址
        channelType: '', // 渠道类型
        belongTo: '', // 归属
        numberLevel: '', // 量级
        domainName: '', // 域名
        isCloud: '', // 云控
        failCooperationCause: '', // 未合作原因
        marketResponsibleName: '', // 市场
        runOffCallback: '' // 流失反馈
      },
      channelErro: [], // 字段不一致
      showConfig: false, // 展示自定义无权限访问业务配置弹窗
      showToConfig: false, // 展示自定义有权限访问业务配置弹窗
      businessPeople: null
    }
  },
  computed: {
    employees () {
      return this.app.employees // 在职人员列表
    },
    treeoptions () {
      return this.app.treeoptions
    }
    // errorInfos() {
    //     return this.errorInfo;
    // }
  },
  watch: {
    errorInfo: {
      handler (newVal) {
        // this.channelErro = newVal.channel
        console.log(newVal, this.errorInfo.channel)
      },
      deep: true
    }
  },
  mounted () {
    this.getList() // 获取谢啦狂内容
  },
  methods: {
    // 获取下拉框内容
    getList () {
      // 获取来源
      this.$axios({
        url: biUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({ tagId: '002002' })
      })
        .then(res => {
          if (res.data.code === 10000) {
            let data = res.data.data
            this.sourceList = data
            this.sourceList.push({ id: -2, tagName: '自定义' })
            //  this[list]
          }
        })
        .catch(err => {
          console.log(err)
        })
      // 获取未合作原因
      this.$axios({
        url: biUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({ tagId: '008' })
      })
        .then(res => {
          if (res.data.code === 10000) {
            let data = res.data.data
            this.reasonList = data
            this.reasonList.push({ id: -2, tagName: '自定义' })
          }
        })
        .catch(err => {
          console.log(err)
        })
      // 获取流失反馈
      this.$axios({
        url: biUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({ tagId: '009' })
      })
        .then(res => {
          if (res.data.code === 10000) {
            let data = res.data.data
            this.loseBackList = data
            this.loseBackList.push({ id: -2, tagName: '自定义' })
          }
        })
        .catch(err => {
          console.log(err)
        })
      // 获取量级
      this.$axios({
        url: biUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({ tagId: '001001' })
      })
        .then(res => {
          if (res.data.code === 10000) {
            let data = res.data.data
            this.magnitudeList = data
          }
        })
        .catch(err => {
          console.log(err)
        })
      // 获取归属
      this.$axios({
        url: biUrl + '/channel/listSite',
        method: 'post',
        data: $qs.stringify({ tagId: '001001' })
      })
        .then(res => {
          if (res.data.code === 10000) {
            let data = res.data.data
            this.affiliationList = data
          }
        })
        .catch(err => {
          console.log(err)
        })
      this.$axios({
        url: baseUrl + '/login/getuser',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 200) {
            this.showConfig = res.data.permission.busiConfig.update
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 判断是不是已合作阶段
    isCooperation (v = 0) {
      if (v.length === 0) {
        this.isCooperations = true
      } else {
        this.isCooperations = false
      }
    },
    openEasyTask (a) {
      if (a === '自定义') {
        if (!this.showConfig) {
          this.$Modal.warning({
            title: '提醒',
            content:
                            '您暂无业务配置的权限，请向有权限的人申请反馈你的需求'
          })
        } else {
          this.showToConfig = true
        }
      }
    },
    // 渠道类型s
    selectChannelType (s) {
      if (s === '下载器' || s === '分发') {
        this.channel.belongTo = ''
        this.channel.numberLevel = ''
        this.channel.domainName = ''
        this.channel.isCloud = ''
      }
      if (s === '自定义') {
        this.showWarn = true
      }
    },
    // 个人/公司
    selectPerOrCom (s) {
      // 初始化选择一个，把另外下面的内容清空
      if (s === '公司') {
        this.channel.personName = ''
        this.channel.personCardId = ''
      } else {
        this.channel.companyName = ''
      }
      // 传值给合同信息组件
      bus.$emit('getSelectPer', this.channel.companyType)
      if (s === '自定义') {
        this.showWarn = true
      }
    },
    // 公司名称传给合同信息
    changeCompanyName () {
      bus.$emit('getCompanyName', this.channel.companyName)
    },
    // 姓名传给合同信息
    changePersonName () {
      bus.$emit('getPersonName', this.channel.personName)
    },
    // 身份证传给合同信息
    changePersonId () {
      bus.$emit('getPersonId', this.channel.personCardId)
    },
    // 不同项目标红
    errors (key) {
      if (this.channelErro.some(e => e === key) ? '不一致' : false) {
        return '不一致'
      }
    },
    // 确定自定义跳转业务配置
    toConfig () {
      this.$router.push({
        path: '/business/businessSet'
      })
    },
    // 确定发简易任务
    ensure () {
      this.showLaunch = true
    },
    // 隐藏
    hide (v) {
      this.showLaunch = v
    },

    handleInputChange (value) {
      if (!value) {
        this.channel.marketResponsibleName = ''
      } else {
        this.channel.marketResponsibleName = value.label
      }
    }
  }
}
</script>

<style scoped>
.headerWithGreenbar {
    font-size: 14px;
    margin-left: 4%;
}

.rowPadding {
    margin-bottom: 20px;
}

.title {
    text-align: right;
    line-height: 30px;
    margin-right: 10px;
    font-size: 14px;
}

.ivu-select {
    margin-top: 0px;
}

.line {
    width: 40%;
    display: inline-block;
}

.lineCenter {
    width: 20%;
    display: inline-block;
    text-align: center;
}
.require{
  color: red;
}
</style>
