<template>
    <div>
        <Dropdown trigger="click" @on-click="chooseModule" style="width: 100%" :transfer="false">
            <Input
                @on-focus="showDropdownMenu"
                readonly
                :value="inputData.name"
                :placeholder="placeholder"
                />
            <DropdownMenu slot="list">
                <DropdownItem
                    v-for="item in selectedSettings"
                    :key="item.id"
                    :name="item.id"
                >{{item.name}}</DropdownItem>
                <DropdownItem :name="-1">
                    <div style="text-align: center;display: flex; align-items: center; justify-content: center;">
                        <div style="height: 1px;width: 40%; background: #ccc"></div>
                        <div style="margin: 0 5px;">自定义</div>
                        <div style="height: 1px;width: 40%; background: #ccc"></div>
                    </div>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
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
                    <!-- <Icon
                        type="md-close"
                        style="font-size: 14px;"
                        class="pointer"
                        @click="delModuleLabel(index)"
                    /> -->
                </div>
                <Button @click="addModuleName" style="margin-left: 10px">添加类别</Button>
            </div>
            </Modal>
    </div>
</template>
<script>
import { findIndexById } from '@/assets/js/tools.js'
export default {
  name: 'test-custom',
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    // 自定义弹框中的数据
    customSettingList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      showCustomSetting: false,
      customSettingLoading: true,
      inputData: {}
    }
  },
  computed: {
    // 下拉列表中的数据
    selectedSettings () {
      // 当勾选框选中时，显示在下拉列表中
      return this.customSettingList.filter(item => {
        return item.selectStatus === 1
      })
    }
  },
  mounted () {
    this.uUid = 0
  },
  methods: {
    chooseModule (id) {
      if (id === -1) {
        this.showCustomSetting = true
      } else {
        let index = findIndexById(id, this.selectedSettings)
        this.inputData = this.selectedSettings[index]
      }
    },
    saveCustomSetting () {
      let name = []
      this.customSettingList.forEach(item => {
        name.push(item.name)
      })
      let set = new Set(name)
      if (set.size !== name.length) {
        this.$Message.error('自定义内容不能重复')
        this.customSettingLoading = false
        this.$nextTick(() => {
          this.customSettingLoading = true
        })
      }
      // 把 this.customSettingList 传给后端
      // ……
    },
    addModuleName () {
      this.uUid++
      // id：新增的id统一为0      rid：用于循环        selectStatus：表示勾选状态
      this.customSettingList.push({ id: 0, rid: this.uUid, name: '', selectStatus: 0 })
    },
    delModuleLabel (index) {
      this.customSettingList.splice(index, 1)
    },
    handleInput (e, index) {
      let value = e.target.value
      this.$set(this.customSettingList[index], 'name', value)
    },
    toggleSelectStatus (flag, index) {
      let num = flag ? 1 : 0
      this.$set(this.customSettingList[index], 'selectStatus', num)
    },
    toBoolean (status) {
      return status !== 0
    },
    // 让父组件请求下拉框数据
    showDropdownMenu () {
      this.$emit('on-show-dropdownmenu', this.type)
    }
  }
}
</script>
<style lang="css" scoped>
  /* .ivu-select-dropdown .ivu-dropdown-transfer{
    color:red !important;
  } */
</style>
