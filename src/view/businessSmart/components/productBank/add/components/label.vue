<template>
    <!-- 标签 -->
    <div class="detailContent">
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
                    :multiple="true"
                    :options="scopeTypeList"
                    placeholder="建立联系必填项"
                    v-model="productTags.portType"
                    @select="openCustom"
                />
            </Col>
            <Col span="6" class="title">
                <span>软件功能：</span>
            </Col>
            <Col span="5">
                <treeselect
                    :multiple="true"
                    :options="softList"
                    placeholder="建立联系必填项"
                    v-model="productTags.softwareFunction"
                    @select="openCustom"
                />
            </Col>
        </Row>
        <Row style="margin-top:50px">
            <Col span="2" offset="2" class="title">
                <span>业务类型：</span>
            </Col>
            <Col span="5">
                <treeselect
                    :multiple="true"
                    :options="businessTypeList"
                    placeholder="建立联系必填项"
                    v-model="productTags.businessType"
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
                    :multiple="true"
                    :options="layTagList"
                    placeholder="建立联系必填项"
                    v-model="productTags.focusLabels"
                    @select="openCustom"
                />
            </Col>
        </Row>
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
import { proBaseUrl } from '@/api/base.js'
export default {
  name: 'labels',
  components: {
    Treeselect,
    LaunchTask
  },
  data () {
    return {
      scopeTypeList: [], // 端口类型下拉
      softList: [], // 软件功能下拉
      businessTypeList: [], // 业务类型下拉
      layTagList: [], // 侧重标签下拉

      productTags: {
        portType: [], // 端口类型
        softwareFunction: [], // 软件功能
        businessType: [], // 业务类型
        focusLabels: [] // 侧重标签
      },
      showWarn: false,
      showLaunch: false
    }
  },
  created () {
    this.getSelectData()
  },
  methods: {
    getSelectData () {
      // 获取端口类型
      this.$axios({
        url: proBaseUrl + '/busiConfig/listConfig',
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
      // 获取业务类型
      this.$axios({
        url: proBaseUrl + '/busiConfig/listConfig',
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
      // 获取软件功能
      this.$axios({
        url: proBaseUrl + '/busiConfig/listConfig',
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
      // 获取侧重标签
      this.$axios({
        url: proBaseUrl + '/busiConfig/listConfig',
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
            // console.log(this.businessTypeList)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 打开自定义
    openCustom (node, instanceId) {
      if (node.label === '自定义') {
        this.showWarn = true
      }
    },
    ensure () {
      this.showLaunch = true
      this.deleteCustom(-2, this.productTags.portType)
      this.deleteCustom(-2, this.productTags.softwareFunction)
      this.deleteCustom(-2, this.productTags.businessType)
      this.deleteCustom(-2, this.productTags.focusLabels)
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
      this.deleteCustom(-2, this.productTags.portType)
      this.deleteCustom(-2, this.productTags.softwareFunction)
      this.deleteCustom(-2, this.productTags.businessType)
      this.deleteCustom(-2, this.productTags.focusLabels)
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
</style>
