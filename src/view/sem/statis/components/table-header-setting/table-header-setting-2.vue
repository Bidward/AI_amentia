<template>
  <div style="display: inline-block">
    <Button :icon="icon" @click="showSetTable=true"></Button>
    <Modal
      v-model="showSetTable"
      :width="width"
      title="表头设置"
      @on-ok="setTable(true)"
      @on-cancel="cancel"
      :mask-closable="false"
    >
      <CheckboxGroup v-model="tableConfigList">
        <Checkbox
          :style="`width:calc(${parseFloat(100/cols).toFixed(2)}% - 8px )`"
          v-for="item in currentTableHeader"
          :disabled="item.alwaysShow===true"
          :label="item.key"
          :key="item.key"
        >{{item.title}}</Checkbox>
      </CheckboxGroup>
      <div>
        <Checkbox
          :style="`width:calc(${parseFloat(100/cols).toFixed(2)}% - 8px )`"
          label="环比"
          key="Dod"
        >环比</Checkbox>
        <Checkbox
          :style="`width:calc(${parseFloat(100/cols).toFixed(2)}% - 8px )`"
          label="同比"
          key="Mom"
        >同比</Checkbox>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'tableHeaderSetterV2',
  props: {
    totalTableHeader: {
      type: Array,
      required: true
    },
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
    tableHeader: Array,
    localKey: {
      type: String,
      required: true
    },
    defaultList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      showSetTable: false,
      tableConfigList: []// 回传的列表
    }
  },
  mounted () {
    this.setTable()
  },
  methods: {
    cancel () {
      let localKey = this.localKey
      this.tableConfigList = JSON.parse(localStorage.getItem(localKey))
    },
    setTable (byUser) {
      let localKey = this.localKey
      let localConfig = localStorage.getItem(localKey)
      let list = []
      let defaultList = this.defaultList
      // 如果不存在本地配置
      if (!localConfig) {
        if (defaultList.length > 1) {
          // 有默认配置项,设置本地缓存
          localStorage.setItem(localKey, JSON.stringify(defaultList))
          this.setTable()
        } else {
          // 全部列表
          list = this.currentTableHeader
          localStorage.setItem(localKey, JSON.stringify(list.map(e => e.key)))
          this.$emit('update:tableHeader', list)
        }
      } else {
        // 读取本地列表
        // 如果是主动设置，则更新本地缓存
        if (byUser) {
          localConfig = this.tableConfigList
          localStorage.setItem(localKey, JSON.stringify(localConfig))
        } else {
          // 否则读取本地缓存
          this.tableConfigList = JSON.parse(localConfig)
          localConfig = JSON.parse(localConfig)
        }
        this.totalTableHeader.forEach(e => {
          if (localConfig.includes(e.key)) {
            list.push(e)
          } else if (e.alwaysShow) {
            list.push(e)
          }
        })
        this.$emit('update:tableHeader', list)
      }
    }
  },
  computed: {
    currentTableHeader () {
      let currentTableHeader = []
      this.totalTableHeader.forEach(e => {
        if (!e.key.endsWith('Mom') && !e.key.endsWith('Dod')) {
          currentTableHeader.push(e)
        }
      })
      return currentTableHeader
    }
  }
}
</script>
