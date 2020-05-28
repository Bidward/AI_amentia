<!-- 公共事项模板 -->
<template>
  <div>
    <div class="tableHeader-only">
      <div class="contentWrapper">
        <Button
          type="primary"
          @click="addJob"
        >新增工作
        </Button>
        <div style="display: flex; align-items: center; margin-left: 20px; font-size: 14px;">
          <span style="min-width: 80px;">模板名称：</span>
          <template v-if="!editing">
            <span style="display: inline-block;margin-right: 10px;">{{templateName}}{{template.publicCategoryName}}</span>
            <span class="pointer" @click="editTemplateName"><i class="fa fa-pencil fa-fw"></i></span>
          </template>
          <template v-else>
            <Input
              type="text"
              ref="input"
              :value="templateName"
              @on-change="updateTemplateName"
              @on-blur="saveNewTemplateName"
            />
          </template>
        </div>
      </div>
    </div>
    <tree-table-vxe
      ref="vxeTable"
      :data="tableData"
      @edit="handleEdit"
      @update="update"
      @show-sub-modal="showSubModal"
    >
    </tree-table-vxe>
    <!-- main-title-modal -->
    <Modal
      v-model="showMain"
      title="工作事项"
      ok-text="保存"
      @on-ok="saveMainItem"
      :loading="loading"
      >
      <div style="display: flex; justify-content: center;">
        <Form :label-width="80" :rules="rules" ref="form" :model="formValidate">
          <FormItem label="模块" prop="formworkConfigName">
            <Dropdown trigger="click" @on-click="chooseModule">
              <Input
                style="width: 200px;"
                readonly
                :value="tableData[mainIndex] && tableData[mainIndex].formworkConfigName"
              />
              <DropdownMenu slot="list" style="width: 200px;">
                <DropdownItem
                  :name="item.id"
                  :key="item.rid"
                  :selected="tableData[mainIndex] && tableData[mainIndex].formworkConfigId === item.id"
                  v-for="item in selectedSettings"
                >{{item.name}}</DropdownItem>
                <DropdownItem :name="-1">
                  <div style="text-align: center;display: flex; align-items: center; justify-content: center;">
                    <div style="height: 1px;width: 50px; background: #ccc"></div>
                    <div style="margin: 0 5px;">自定义</div>
                    <div style="height: 1px;width: 50px; background: #ccc"></div>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </FormItem>
          <FormItem label="工作事项" prop="name">
            <Input
              style="width: 200px"
              :value="tableData[mainIndex] && tableData[mainIndex].name"
              @on-change="editMainItem"
            />
          </FormItem>
        </Form>
      </div>
    </Modal>
    <!-- 频率设置 -->
    <edit-pannel
      :show="showSub"
      :itemData="subItem"
      @hide="hideEditPannel"
      @update="update"
    ></edit-pannel>
    <Modal
      v-model="showCustomSetting"
      title="模块自定义配置"
      ok-text="确定"
      @on-ok="saveCustomSetting"
      :loading="customSettingLoading"
    >
      <div style="display: flex; flex-wrap: wrap">
        <div
          v-for="(item, index) in customSettingList"
          :key="item.rid"
          style="display: inline-block;margin:10px"
        >
          <Checkbox
            :value="toBoolean(customSettingList[index].selectStatus)"
            @on-change="(flag) => toggleSelectStatus(flag, index)">
            <input
              type="text"
              :value="item.name"
              @input="handleInput($event, index)"
              style="text-align: center; padding: 0 5px; width: 100px; -webkit-appearance: none; border: none; border-bottom: 1px solid #ddd;outline-style: none;" />
          </Checkbox>
          <Icon
            type="md-close"
            style="font-size: 14px;"
            class="pointer"
            @click="delModuleLabel(index)"
          />
        </div>
        <!-- <Input v-for="item in customSettingList" :key="item.id" value/> -->
        <Button @click="addModuleName" style="margin-left: 10px">添加类别</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import TreeTableVxe from './tree-table-vxe.vue'
import EditPannel from './edit-pannel'
import { findIndexById, dClone } from '@/assets/js/tools.js'
import { baseUrl } from '@/api/base.js'
export default {

  components: {
    TreeTableVxe,
    EditPannel
  },

  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    // 公共模板 || 定岗定编
    type: {
      type: Number,
      default: 1
    },
    tableType: {
      type: Number,
      default: 1
    },
    template: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  data () {
    return {
      // 自定义模块名称
      showCustomSetting: false,
      customSettingLoading: true,
      loading: true,
      tableData: this.data,
      // 主工作事项模态框
      showMain: false,
      // 子工作事项模态框
      showSub: false,
      mainIndex: 0,
      subItem: {},
      editing: false,
      newTemplateName: '',
      templateName: this.template.name,
      formValidate: {
        formworkConfigName: '',
        name: ''
      },
      rules: {
        formworkConfigName: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请填写模块名称'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        name: [{
          required: true, trigger: 'blur', message: '请填写工作事项'
        }]
      },
      // 自定义模块列表
      customSettingList: [],
      selectedSettings: []
    }
  },

  created () {
    this.uUid = 0
    this.getCustomSettingData()
  },

  methods: {
    delModuleLabel (index) {
      this.customSettingList.splice(index, 1)
    },
    toBoolean (status) {
      return status !== 0
    },
    saveCustomSetting () {
      let name = []
      this.customSettingList.forEach(item => {
        name.push(item.name)
      })
      let set = new Set(name)
      // console.log(set.size, name.length)
      if (set.size !== name.length) {
        this.$Message.error('标签名不能重复')
        this.customSettingLoading = false
        this.$nextTick(() => {
          this.customSettingLoading = true
        })
        return
      }
      this.customSettingList = this.customSettingList.filter(item => item.name)
      this.selectedSettings = this.customSettingList.filter(item => {
        return item.selectStatus === 1
      })
      let params = {
        type: this.type,
        categoryId: this.template.id,
        stationFormworkConfig: this.customSettingList
      }
      this.$axios({
        url: baseUrl + '/station/insertFromworkConfig',
        method: 'post',
        data: params
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.showCustomSetting = false
            this.getCustomSettingData()
          } else {
            this.customSettingLoading = false
            this.$nextTick(() => {
              this.customSettingLoading = true
            })
          }
        })
    },
    getCustomSettingData () {
      let params = { categoryId: this.$route.query.id, type: this.type }
      this.$axios({
        url: baseUrl + '/station/getFromworkConfigByOneTagId',
        method: 'get',
        params: params
      })
        .then(res => {
          console.log(res)
          if (res.data.code === 10000) {
            this.customSettingList = res.data.content
            this.selectedSettings = this.customSettingList.filter(item => {
              return item.selectStatus === 1
            })
          }
        })
    },
    toggleSelectStatus (flag, index) {
      let num = flag ? 1 : 0
      this.$set(this.customSettingList[index], 'selectStatus', num)
    },
    handleInput (e, index) {
      let value = e.target.value
      this.$set(this.customSettingList[index], 'name', value)
    },
    addModuleName () {
      this.uUid++
      this.customSettingList.push({ id: 0, rid: this.uUid, name: '', selectStatus: 1 })
    },
    // 选择/自定义模块名称
    chooseModule (id) {
      if (id === -1) {
        this.showCustomSetting = true
      } else {
        let index = findIndexById(id, this.selectedSettings)
        this.selectModuleId = id
        this.selectModuleName = this.selectedSettings[index].name
        this.$set(this.formValidate, 'formworkConfigName', this.selectModuleName)
        this.$set(this.tableData[this.mainIndex], 'formworkConfigId', this.selectModuleId)
        this.$set(this.tableData[this.mainIndex], 'formworkConfigName', this.selectModuleName)
      }
    },
    updateTemplateName (e) {
      this.newTemplateName = e.target.value
    },
    saveNewTemplateName () {
      if (!this.newTemplateName) {
        this.editing = false
      } else {
        let url = this.type === 1
          ? '/station/updatePublicCategory'
          : '/station/updateJobCategory'
        this.$axios({
          url: baseUrl + url,
          params: { id: this.template.id, name: this.newTemplateName },
          method: 'post'
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.editing = false
              this.$emit('update')
            }
          })
      }
    },
    editTemplateName () {
      this.editing = true
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    // 添加工作
    addJob () {
      this.uUid++
      this.tableData.push(JSON.parse(JSON.stringify({ ...this.initData, id: 'p' + this.uUid })))
      // 点击添加工作显示主事项弹窗
      this.showMain = true
      this.mainIndex = this.tableData.length - 1
    },
    // 点击编辑显示编辑弹窗（分为主事项和子事项）
    handleEdit (scope) {
      if (scope.level === 0) {
        this.showMain = true
        this.mainIndex = findIndexById(scope.row.id, this.tableData)
      } else {
        this.showSub = true
        this.subItem = dClone(scope.row)
      }
    },
    // 编辑主事项名称
    editMainItem (e) {
      this.$set(this.tableData[this.mainIndex], 'name', e.target.value)
      this.formValidate.name = e.target.value
    },
    // 保存主事项名称
    saveMainItem () {
      let mainItem = this.tableData[this.mainIndex]
      let isAddMain = mainItem.isAddMain
      let params = {
        oneTagName: mainItem.name,
        categoryId: this.$route.query.id,
        id: isAddMain ? 0 : mainItem.id,
        type: mainItem.type,
        tableType: this.tableType,
        formworkId: mainItem.formworkConfigId
      }

      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(valid)
          this.$axios({
            url: baseUrl + '/station/updatePublicTag',
            method: 'post',
            data: $qs.stringify(params)
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.showMain = false
                this.$Message.success(res.data.msg)
                this.$emit('update')
              } else {
                this.loading = false
                this.$nextTick(() => {
                  this.loading = true
                })
                this.$Message.error(res.data.msg)
              }
            })
            .catch(err => {
              this.$nextTick(() => {
                this.loading = false
              })
              console.log(err)
            })
        } else {
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
        }
      })
    },
    // 隐藏子事项编辑面板
    hideEditPannel () {
      this.showSub = false
    },
    update () {
      this.$emit('update')
    },
    // 点击添加子项时显示子事项编辑面板
    showSubModal (item) {
      this.showSub = true
      this.subItem = item
    }
  },

  computed: {
    initData () {
      return {
        id: 1,
        name: '',
        formworkConfigName: '',
        moduleId: 0,
        typeFormworkName: this.type === 1 ? '公共事项' : '专项事项',
        type: this.type,
        isAddMain: true
      }
    }
  },

  watch: {
    data (newVal) {
      if (newVal) {
        this.tableData = newVal
      }
    },
    // 如果关闭主事项编辑面板，恢复元数据
    showMain (newVal) {
      if (!newVal) {
        this.$emit('cancel')
      } else {
        this.formValidate.name = this.tableData[this.mainIndex].name
        this.formValidate.formworkConfigName = this.tableData[this.mainIndex].formworkConfigName
      }
    },
    'template.name' (newVal) {
      this.templateName = newVal
    }
  }
}
</script>

<style lang='less' scoped>
.contentWrapper {
  display: flex;
  align-items: center;
}
</style>
