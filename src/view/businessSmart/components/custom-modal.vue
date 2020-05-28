<template>
  <Modal
    v-model="showModal"
    title="自定义"
    ok-text="确定"
    @on-ok="saveCustomList"
    @on-cancel="$emit('on-custom-cancel')"
  >
    <div style="display: flex; flex-wrap: wrap">
    <div
      v-for="(item,index) in customList"
      :key="item.id"
      style="display: inline-block;margin:10px"
    >
      <Checkbox :value="toBoolean(customList[index].selectStatus)">
        <input
          type="text"
          v-model="customList[index].name"
          style="text-align: center; padding: 0 5px; width: 100px; -webkit-appearance: none; border: none; border-bottom: 1px solid #ddd;outline-style: none;" />
      </Checkbox>
      <Icon
        type="md-close"
        style="font-size: 14px;"
        class="pointer"
        @click="delModuleLabel(index)"
      />
    </div>
    <Button @click="addModuleName" style="margin-left: 10px">添加</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    customList: {
      type: Array,
      default: () => []
    },
    cityList: {
      type: Array,
      default: () => []
    },
    show: {
      type: Boolean,
      default: false
    },
    keys: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showModal: this.show
    }
  },
  watch: {
    show (newVal) {
      this.showModal = newVal
    }
  },
  mounted () {
    this.toBoolean()
  },
  methods: {
    // 自定义弹窗新增新增
    addModuleName () {
      let id = this.customList.length + 1
      this.customList.push({ id: id, name: '', selectStatus: 0 })
    },
    // 自定义弹窗中每一个后面×
    delModuleLabel (index) {
      this.customList.splice(index, 1)
    },
    // 转换成布尔
    toBoolean (status) {
      return status !== 0
    },
    // 弹窗按钮点确定
    saveCustomList () {
      this.$emit('on-custom-cancel')
      //   let name = []
      //   this.customList.forEach(item => {
      //     name.push(item.name)
      //   })
      //   console.log(name)
      //   for(let i in this.customList){
      //     this.cityList.push(this.customList[i])
      //   }
      this.$emit('on-modal-data', this.customList, this.keys)
    }
  }
}
</script>
