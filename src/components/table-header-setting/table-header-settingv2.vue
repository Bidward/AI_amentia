<template>
  <!--
    @Author:NNNNzs
    @Date  :2020-3-1 02:53:55
    @description:自定义表头v2
  -->
  <div style="display: inline-block">
    <Button :icon="icon" @mouseover.native="createModal=true" @click="showModal=true"></Button>
    <div v-if="createModal">
      <Modal
        v-model="showModal"
        :width="width"
        title="表头设置"
        @on-ok="handleOk"
        @on-cancel="handleClose"
        :transfer='false'
        :mask-closable="false"
      >
        <Checkbox v-if="showCheckAll" :indeterminate="isIndeterminate" v-model="checkAll">全选</Checkbox>
        <CheckboxGroup v-model="checkedItems" class="table-header-setting-group">
          <Checkbox
            :style="`width:${100/cols}%`"
            v-for="item in totalTableHeader"
            :disabled="item.alwaysShow"
            :label="item.key"
            :key="item.key"
          >{{item.title}}</Checkbox>
        </CheckboxGroup>
      </Modal>
    </div>
  </div>
</template>
<script>
export default {
  name: 'tableHeaderSetterv2',
  data () {
    return {
      checkedItems: [],
      showModal: false,
      createModal: false
    }
  },
  props: {
    width: {
      type: [Number, String],
      default: 520
    },
    cols: {
      type: Number, // 多少列
      default: 4
    },
    icon: {
      type: String,
      default: 'ios-settings'
    },
    tableHeader: {
      type: Array
    },
    value: {
      type: Array
    },
    localKey: {
      type: String,
      default () {
        return this.$parent.$options.name
      }
    },
    defaultList: {
      type: Array,
      default () {
        // return this.totalTableHeader.map(e => e.key);
        // we can't use prop in an other prop default value,
        // so use computed to return all cols if defaultList is empty
        return []
      }
    },
    totalTableHeader: {
      type: Array,
      required: true
    },
    showCheckAll: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    const localValue = this.getValueFromLocal()
    if (localValue) {
      // if exist local
      this.checkedItems = localValue
    } else {
      // else first time create this template
      this.checkedItems = this.currentDefaultList
      this.setValueIntoLocal(this.checkedItems)
    }
    const value = this.getItemByChecked(this.checkedItems)
    this.$emit('input', value) // for v-model
    this.$emit('update:tableHeader', value) // for tableHeader.sync
  },
  methods: {
    handleOk () {
      const value = this.getItemByChecked(this.checkedItems)
      this.setValueIntoLocal(this.checkedItems)
      this.$emit('input', value)
      this.$emit('update:tableHeader', value)
      this.$emit('on-success', this.checkedItems)
      this.showModal = false
    },
    handleClose () {
      // reset table-header
      this.checkedItems = this.getValueFromLocal()
      this.showModal = false
      this.$emit('on-cancel')
    },
    // get keys from
    getValueFromLocal () {
      return JSON.parse(localStorage.getItem(this.localKey))
    },
    // set kyes
    setValueIntoLocal (value) {
      const str = JSON.stringify(value)
      localStorage.setItem(this.localKey, str)
    },
    // get whole column by checked keys
    // to optimize because of O(n²)
    getItemByChecked (checkedArr = []) {
      return this.totalTableHeader.filter(e => {
        return checkedArr.includes(e.key)
      })
    }
  },
  computed: {
    //   indeterminate
    isIndeterminate () {
      const hasCheck = this.checkedItems.length > 0
      const notCheckAll =
        this.totalTableHeader.length !== this.checkedItems.length
      return hasCheck && notCheckAll
    },
    // all checkbox is ready
    checkAll: {
      set (newVal) {
        if (this.checkAll) {
          //   if checkAll, cancel all check but alwaysShow
          this.checkedItems = this.totalTableHeader
            .filter(e => e.alwaysShow)
            .map(e => e.key)
        } else {
          //   if isIndeterminate or empty,then checkAll
          this.checkedItems = this.totalTableHeader.map(e => e.key)
        }
      },
      get () {
        return this.totalTableHeader.length === this.checkedItems.length
      }
    },
    // see props : defaultList
    currentDefaultList () {
      if (this.defaultList.length !== 0) {
        return this.defaultList
      } else {
        return this.totalTableHeader.map(e => e.key)
      }
    }
  }
}
</script>
<style lang="less">
.table-header-setting-group {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .ivu-checkbox-wrapper {
    margin-right: 0;
  }
}
</style>
