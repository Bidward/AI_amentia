<template>
    <!-- 标签 -->
    <div class="detailContent">
        <Form ref="channel" :model="tag">
            <Row class="rowPadding">
                <Col span="2" offset="2" class="title">
                    <Tooltip
                        content="标注标签后表示该渠道只上线包含此标签的产品"
                        placement="top"
                        max-width="200"
                        :transfer="true"
                    >
                        <Icon type="md-help-circle" style="margin-right:5px" />
                    </Tooltip>
                    <span>端口类型：</span>
                </Col>
                <Col span="5">
                    <treeselect
                        :class="[errorPort ?'error':'']"
                        :multiple="true"
                        :options="scopeTypeList"
                        placeholder="建立联系必填项"
                        v-model="tag.portType"
                        style="width:300px;"
                        @select="openCustom"
                    />
                </Col>
                <Col span="6" class="title">
                    <span>软件功能：</span>
                </Col>
                <Col span="5">
                    <treeselect
                        :class="[errorSoft ?'error':'']"
                        :multiple="true"
                        :options="softList"
                        placeholder="建立联系必填项"
                        v-model="tag.softwareFunction"
                        style="width:300px;"
                        @select="openCustom"
                    />
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="2" offset="2" class="title">
                    <span>业务类型：</span>
                </Col>
                <Col span="5">
                    <treeselect
                        :class="[errorBusiness ?'error':'']"
                        :multiple="true"
                        :options="businessTypeList"
                        placeholder="建立联系必填项"
                        v-model="tag.businessType"
                        style="width:300px;"
                        @select="openCustom"
                    />
                </Col>
            </Row>
            <Row style="margin-top:50px">
                <Col span="2" offset="2" class="title">
                    <Tooltip
                        content="选择侧重标签后包含该标签的产品推荐优先级更高。"
                        placement="top"
                        max-width="200"
                        :transfer="true"
                    >
                        <Icon type="md-help-circle" style="margin-right:5px" />
                    </Tooltip>
                    <span>侧重标签：</span>
                </Col>
                <Col span="5">
                    <treeselect
                        :class="[errorFocus ?'error':'']"
                        :multiple="true"
                        :options="layTagList"
                        placeholder="建立联系必填项"
                        v-model="tag.focusTag"
                        style="width:300px;"
                        @select="openCustom"
                    />
                </Col>
            </Row>
            <Row style="margin-top:50px">
                <Col span="2" offset="2" class="title">
                    <Tooltip
                        content="选择反向标签后该渠道将不会匹配反向标签对应产品。"
                        placement="top"
                        max-width="200"
                        :transfer="true"
                    >
                        <Icon type="md-help-circle" style="margin-right:5px" />
                    </Tooltip>
                    <span>反向标签：</span>
                </Col>
                <Col span="5">
                    <treeselect
                        :class="[errorReverse ?'error':'']"
                        :multiple="true"
                        :options="reverseList"
                        placeholder="建立联系必填项"
                        v-model="tag.reverseTag"
                        style="width:300px;"
                        @select="openCustom"
                    />
                </Col>
            </Row>
        </Form>
        <Modal v-model="showWarn" title="提醒" @on-ok="ensure" @on-cancel="cancel">
            <p class="warn">该字段涉及逻辑和页面开发，是否发简易任务告知产品经理您的新需求</p>
        </Modal>
        <div v-if="showLaunch">
            <launch-task :show="showLaunch" @hideTask="hide"></launch-task>
        </div>
    </div>
</template>
<script>
import LaunchTask from '../../../launch-task'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { biUrl } from '@/api/base.js'
export default {
  name: 'labels',
  components: {
    Treeselect,
    LaunchTask
  },
  props: {
    lableInfo: {
      type: Object,
      default: () => {}
    },
    errorInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      scopeTypeList: [],
      softList: [],
      businessTypeList: [],
      layTagList: [],
      reverseList: [],
      tag: {
        portType: [],
        softwareFunction: [],
        businessType: [],
        focusTag: [],
        reverseTag: []
      },
      showWarn: false,
      showLaunch: false,
      tagErro: [], // 不一致字段
      errorPort: false,
      errorSoft: false,
      errorBusiness: false,
      errorFocus: false,
      errorReverse: false
    }
  },
  mounted () {
    this.getList()
  },
  watch: {
    lableInfo (newVal) {
      this.tag = newVal
    },
    deep: true,
    errorInfo: {
      handler (newVal) {
        let tag = newVal.tag || []
        this.errorPort = tag.includes('portType')
        this.errorSoft = tag.includes('softwareFunction')
        this.errorBusiness = tag.includes('businessType')
        this.errorFocus = tag.includes('focusTag')
        this.errorReverse = tag.includes('reverseTag')
      },
      deep: true
    }
  },
  methods: {
    getList () {
      // 端口类型
      this.$axios({
        url: biUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({ tagId: '004001001' })
      })
        .then(res => {
          if (res.data.code === 10000) {
            let data = res.data.data
            this.scopeTypeList = data.map(e => {
              if (e.subConfigs === null) {
                return {
                  id: e.tagId,
                  label: e.tagName
                }
              } else {
                return {
                  id: e.tagId,
                  label: e.tagName,
                  children: e.subConfigs.map(e => {
                    return {
                      id: e.tagId,
                      label: e.tagName
                    }
                  })
                }
              }
            })
            this.scopeTypeList.push({ id: -2, label: '自定义' })
          }
        })
        .catch(err => {
          console.log(err)
        })
      // 软件功能
      this.$axios({
        url: biUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({ tagId: '004001003' })
      })
        .then(res => {
          if (res.data.code === 10000) {
            let data = res.data.data
            this.softList = data.map(e => {
              if (e.subConfigs === null) {
                return {
                  id: e.tagId,
                  label: e.tagName
                }
              } else {
                return {
                  id: e.tagId,
                  label: e.tagName,
                  children: e.subConfigs.map(e => {
                    return {
                      id: e.tagId,
                      label: e.tagName
                    }
                  })
                }
              }
            })
            this.softList.push({ id: -2, label: '自定义' })
          }
        })
        .catch(err => {
          console.log(err)
        })
      // 业务类型
      this.$axios({
        url: biUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({ tagId: '004001002' })
      })
        .then(res => {
          if (res.data.code === 10000) {
            let data = res.data.data
            this.businessTypeList = data.map(e => {
              if (e.subConfigs === null) {
                return {
                  id: e.tagId,
                  label: e.tagName
                }
              } else {
                return {
                  id: e.tagId,
                  label: e.tagName,
                  children: e.subConfigs.map(e => {
                    return {
                      id: e.tagId,
                      label: e.tagName
                    }
                  })
                }
              }
            })
            this.businessTypeList.push({ id: -2, label: '自定义' })
          }
        })
        .catch(err => {
          console.log(err)
        })
      // 侧重标签
      this.$axios({
        url: biUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({ tagId: '004002' })
      })
        .then(res => {
          if (res.data.code === 10000) {
            let data = res.data.data
            this.layTagList = data.map(e => {
              if (e.subConfigs === null) {
                return {
                  id: e.tagId,
                  label: e.tagName
                }
              } else {
                return {
                  id: e.tagId,
                  label: e.tagName,
                  children: e.subConfigs.map(e => {
                    return {
                      id: e.tagId,
                      label: e.tagName
                    }
                  })
                }
              }
            })
            this.layTagList.push({ id: -2, label: '自定义' })
          }
        })
        .catch(err => {
          console.log(err)
        })
      // 反向标签
      this.$axios({
        url: biUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({ tagId: '004001' })
      })
        .then(res => {
          if (res.data.code === 10000) {
            let data = res.data.data
            this.reverseList = data.map(e => {
              if (e.subConfigs === null) {
                return {
                  id: e.tagId,
                  label: e.tagName
                }
              } else {
                return {
                  id: e.tagId,
                  label: e.tagName,
                  children: e.subConfigs.map(e => {
                    return {
                      id: e.tagId,
                      label: e.tagName
                    }
                  })
                }
              }
            })
            this.reverseList.push({ id: -2, label: '自定义' })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 不同项目标红
    // errors (key) {
    //   let erro = this.tagErro || []
    //   if (erro.some(e => e === key) ? '不一致' : false) {
    //     return '不一致'
    //   }
    // },
    openCustom (node, instanceId) {
      if (node.label === '自定义') {
        this.showWarn = true
      }
    },
    ensure () {
      this.showLaunch = true
      this.deleteCustom(-2, this.tag.portType)
      this.deleteCustom(-2, this.tag.softwareFunction)
      this.deleteCustom(-2, this.tag.businessType)
      this.deleteCustom(-2, this.tag.focusTag)
      this.deleteCustom(-2, this.tag.reverseTag)
    },
    hide (v) {
      this.showLaunch = v
    },
    // 删除选中的自定义选项
    deleteCustom (str, arr) {
      let index = arr.indexOf(str)
      if (index >= 0) {
        arr.splice(index, 1)
      }
    },
    // 自定义弹窗取消按钮
    cancel () {
      this.deleteCustom(-2, this.tag.portType)
      this.deleteCustom(-2, this.tag.softwareFunction)
      this.deleteCustom(-2, this.tag.businessType)
      this.deleteCustom(-2, this.tag.focusTag)
      this.deleteCustom(-2, this.tag.reverseTag)
    }
  }
}
</script>
<style lang="less" scoped>
.title {
    text-align: right;
    line-height: 30px;
    margin-right: 10px;
    font-size: 14px;
}
.rowPadding {
    margin-bottom: 20px;
}
.error {
    border: 1px solid red;
    border-radius: 5px;
}
</style>
