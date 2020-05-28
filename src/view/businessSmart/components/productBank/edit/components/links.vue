<template>
  <div class="detailContent">
      <Row  class="rowPadding">
        <Col span="16" offset="4">
          <span class="addContract" @click="addLinks">+新增链接</span><span class="info">已合作必填项</span>
          <Table border :columns="linkHeader" :data="linkContent" :class="[red ?'red':'']">
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" @click="editLink(row,index)">编辑</Button>
            <Button type="error" size="small" @click="removeLink(index)">删除</Button>
          </template>
          </Table>
        </Col>
      </Row>
    <Modal :mask-closable="false"  :loading="loading" id="addNotice" v-model="showLink" :title="modalTitle" class="addlink" @on-ok="saveToTable">
      <Form ref="links" :model="links" :rules="ruleAddLink">
        <Row class="rowPadding">
          <Col span="4" offset="5" class="title">
          <i class="require">*</i>链接名称 :
          </Col>
          <Col span="10">
            <FormItem prop="linkName">
              <Input v-model="links.linkName"  clearable filterable maxlength="100" show-word-limit/>
             </FormItem>
          </Col>
        </Row>
        <Row class="rowPadding">
          <Col span="4"  offset="5" class="title">
          <i class="require">*</i>产品链接 :
          </Col>
          <Col span="10">
          <FormItem prop="productLink">
            <Input v-model="links.productLink"   clearable filterable maxlength="255" show-word-limit/>
          </FormItem>
          </Col>
        </Row>
        <!-- <Row class="rowPadding">
          <Col span="4"  offset="5" class="title">
          包体类型 :
          </Col>
          <Col span="10">
          <Select  v-model="links.enclaves"   clearable filterable>
            <Option v-for="item in bagTypeList"  :value="item.id" :key="item.id">{{ item.title }}</Option>
          </Select> -->
          <!-- <Button shape="circle" icon="ios-more-outline" @click="goCloudConfig"></Button> -->
          <!-- </Col>
        </Row> -->
        <Row class="rowPadding">
          <Col span="4"  offset="5" class="title">
          后台类型 :
          </Col>
          <Col span="10">
          <Select v-model="links.backgroundType" :label-in-value="true" clearable filterable @on-change="getTypeName">
            <Option
            v-for="item in backTypeList"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option>
          </Select>
          </Col>
        </Row>
        <Row class="rowPadding" v-if="links.backgroundType === 3 ||links.backgroundType === 4">
          <Col span="4"  offset="5" class="title">
          群名 :
          </Col>
          <Col span="10">
          <Input v-model="links.groupName"  clearable filterable maxlength="255" show-word-limit/>
          </Col>
        </Row>
        <div v-if="links.backgroundType === 1 ||links.backgroundType === 2">
          <Row class="rowPadding">
          <Col span="4"  offset="5" class="title">
              网址 :
          </Col>
          <Col span="10">
              <Input  v-model="links.groupName"   clearable filterable maxlength="255" show-word-limit/>
          </Col>
          </Row>
          <Row class="rowPadding">
          <Col span="4"  offset="5" class="title">
              账号 :
          </Col>
          <Col span="10">
              <Input v-model="links.account"  clearable filterable maxlength="50" show-word-limit/>
          </Col>
          </Row>
          <Row class="rowPadding">
          <Col span="4"  offset="5" class="title">
              密码 :
          </Col>
          <Col span="10">
              <Input v-model="links.password"   clearable filterable maxlength="50" show-word-limit/>
          </Col>
          </Row>
        </div>
        <Row class="rowPadding">
          <Col span="4"  offset="5" class="title">
          <i class=""></i>渠道 :
          </Col>
          <Col span="10">
          <FormItem prop="channel">
            <Input v-model="links.channel"  clearable filterable maxlength="100" show-word-limit/>
          </FormItem>
          </Col>
        </Row>
      </Form>
      </Modal>
  </div>
</template>
<script>
import { phpURL } from '@/api/base.js'
export default {
  props: {
    linkData: {
      type: Array,
      default () {
        return []
      }
    },
    errorInfo: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      linkHeader: [
        {
          title: '序号',
          type: 'index',
          width: 70,
          align: 'center'
        },
        {
          title: '链接名称',
          key: 'linkName',
          align: 'center'
        },
        {
          title: '产品链接',
          key: 'productLink',
          align: 'center'
        },
        {
          title: '后台类型',
          key: 'backgroundType',
          align: 'center'
        },
        {
          title: '网址/群名',
          key: 'groupName',
          align: 'center'
        },
        {
          title: '账号',
          key: 'account',
          align: 'center'
        },
        {
          title: '密码',
          key: 'password',
          align: 'center'
        },
        {
          title: '渠道',
          key: 'channel',
          align: 'center'
        },
        {
          title: '操作',
          width: 120,
          slot: 'action',
          align: 'center'
        }
      ], // 链接表头
      // 后台类型
      backTypeList: [
        {
          value: 1,
          label: '网站'
        },
        {
          value: 2,
          label: '邮箱'
        },
        {
          value: 3,
          label: 'QQ'
        },
        {
          value: 4,
          label: '微信'
        },
        {
          value: 5,
          label: '按我司返数'
        }
      ],
      linkContent: [],
      loading: true,
      links: {
        linkName: '', // 链接名称
        productLink: '', // 产品链接
        enclaves: '', // 包体类型
        backgroundType: '', // 后台类型
        groupName: '', // 群名，网址
        account: '', // 账号
        password: '', // 密码
        channel: '', // 渠道
        TypeName: ''// 后台类型
      },
      modalTitle: '',
      red: false, // 错误标红
      showLink: false, // 新增链接弹框
      bagTypeList: [], // 包体类型列表
      ruleAddLink: {
        linkName: [{ required: true, message: '链接名称是必填项哦' }],
        productLink: [{ required: true, message: '产品链接是必填项哦' }],
        channel: [{ required: false, message: '渠道是必填项哦' }]
      }
    }
  },
  mounted () {
    this.getData()
  },
  watch: {
    linkData (newV) {
      if (newV) {
        this.linkContent = newV
      }
    },
    errorInfo (newV) {
      if (newV) {
        this.red = newV.includes('linkInfo')
      }
    }
  },
  methods: {
    getData () {
      // 获取包体类型
      this.$axios({
        url: phpURL + '/cloud/bagTypeList',
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          this.bagTypeList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err.data)
      })
    },
    // 删除新增的链接
    removeLink (index) {
      this.linkContent.splice(index, 1)
    },
    // 点击新增链接清空弹窗内容
    addLinks () {
      this.modalTitle = '新增链接'
      this.showLink = true
      this.links.linkName = ''
      this.links.productLink = ''
      this.links.enclaves = ''
      this.links.backgroundType = ''
      this.links.groupName = ''
      this.links.account = ''
      this.links.password = ''
      this.links.channel = ''
    },
    getTypeName (ids) {
      if (ids) {
        this.links.TypeName = ids.label
      }
    },
    saveToTable () {
      if (this.modalTitle === '新增链接') {
        let valueList = Object.values(this.links)
        let open = 0
        for (let i in valueList) {
          if (valueList[i] === '') {
            open = open + 1
          }
        }
        if (open === 9) {
          // this.showLink = false
          this.$Message.error('请录入数据')
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
          return
        }
        this.$refs.links.validate((valid) => {
          if (valid) {
            this.showLink = false
            let _p = this.links
            this.linkContent.push({
              linkName: _p.linkName,
              productLink: _p.productLink,
              enclaves: _p.enclaves,
              backgroundType: _p.TypeName,
              // backgroundType: _p.TypeName,
              groupName: _p.groupName,
              account: _p.account,
              password: _p.password,
              channel: _p.channel
            })
            this.$emit('on-links', this.linkContent)
          } else {
            this.loading = false
            this.$nextTick(() => {
              this.loading = true
            })
          }
        })
      } else {
        this.$refs.links.validate((valid) => {
          if (valid) {
            this.showLink = false
            let _self = this.links
            let xx = {
              linkName: _self.linkName,
              productLink: _self.productLink,
              enclaves: _self.enclaves,
              backgroundType: _self.TypeName,
              TypeName: _self.TypeName,
              groupName: _self.groupName,
              account: _self.account,
              password: _self.password,
              channel: _self.channel
            }
            this.linkContent.splice(_self.index, 1, xx)
          } else {
            this.loading = false
            this.$nextTick(() => {
              this.loading = true
            })
          }
        })
      }
    },
    editLink (row, index) {
      this.modalTitle = '编辑链接'
      this.showLink = true
      let _self = this.links
      switch (row.backgroundType) {
        case '网站':
          this.backgroundType = 1
          break
        case '邮箱':
          this.backgroundType = 2
          break
        case 'QQ':
          this.backgroundType = 3
          break
        case '微信':
          this.backgroundType = 4
      }
      _self.linkName = row.linkName
      _self.productLink = row.productLink
      _self.enclaves = row.enclaves
      _self.groupName = row.groupName
      _self.account = row.account
      _self.password = row.password
      _self.channel = row.channel
      // _self.TypeName = row.backgroundType
      _self.index = index
    }
  }
}
</script>
<style lang="less" scoped>
.red{
  border:1px solid red;
}
.info{
  color: #ccc;
  margin-left: 20px;
}
.addContract{
  color:#19aa8d;
  cursor: pointer;
  margin-bottom: 5px;
}
.title{
    text-align: right;
    line-height: 30px;
    margin-right: 10px;
    font-size: 14px;
  }
  .rowPadding{
    margin-bottom:20px;
  }
.require{
    font-size: 17px;
    color: red;
    position: relative;
    top: 5px;
    right: 3px;
}
  .ivu-select{
    margin: 0;
    width: 100%;
  }
  .ivu-form-item {
    margin-bottom: 0;
  }
</style>
