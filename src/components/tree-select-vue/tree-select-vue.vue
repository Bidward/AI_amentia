<template>
  <treeselect
    v-model="initValue"
    :multiple="multiple"
    :options="options"
    :value-consists-of="valueConsistsOf"
    :default-expand-level="defaultExpandLevel"
    :maxHeight="maxHeight"
    :placeholder="placeholder"
    :flattenSearchResults="true"
    :disableBranchNodes="disableBranchNodes"
    noResultsText="暂无数据"
    :valueFormat="valueFormat"
    ref="tree-select"
  />
</template>

<script>
// import { dClone } from '@/assets/js/tools'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },

  props: {
    options: {
      type: Array,
      default () {
        return []
      }
    },
    multiple: {
      type: Boolean,
      default: true
    },

    valueConsistsOf: {
      type: String,
      default: 'LEAF_PRIORITY'
    },

    defaultExpandLevel: {
      type: Number,
      default: 1
    },

    maxHeight: {
      type: Number,
      default: 200
    },

    placeholder: {
      type: String,
      default: '请选择'
    },

    disableBranchNodes: {
      type: Boolean,
      default: false
    },

    value: {
      type: [Array, String, Number, Object],
      default () {
        if (!this.multiple) {
          return {}
        }
      }
    },

    valueFormat: {
      type: String,
      default: 'id'
    }
  },
  data () {
    return {
      initValue: this.value,
      people: []
    }
  },

  mounted () {
    let dom = this.$refs['tree-select']
    console.log(dom)
  },
  methods: {
    // 获取纯子节点
    getLeaf (nodes, arr) {
      nodes.children.forEach(node => {
        if (node.children) {
          this.getLeaf(node, arr)
        } else {
        //   arr.push({ id: node.id, name: node.label })
          arr.push(node.id)
        }
      })
    },
    // 选择某个节点
    handleSelect (nodes) {
      // console.log("选择某个节点", nodes)
      let select = []
      if (nodes.children) {
        this.getLeaf(nodes, select)
      } else {
        // select = [{ id: nodes.id, name: nodes.label }]
        select = [nodes.id]
      }
      this.people = [...this.people, ...select]
      this.$emit('treeSelect', this.people)
      let $select = this.$refs['receiverSelect']
      $select.resetSearchQuery('')
    },
    handleDeselect (node, id) {
    //   console.log('deselect', node)
    }

  },
  watch: {
    value (newVal) {
      if (newVal) {
        this.initValue = newVal
      }
    },
    initValue (newVal, oldVal) {
      if (!newVal) {
        newVal = null
      }

      this.$emit('input', newVal)
    }
  }
}
</script>

<style lang="less">
@import '~@/assets/style/variables.less';
    .vue-treeselect__control {
      height: 32px;
    }
    /**treeselect样式覆盖 */
    .vue-treeselect--focused:not(.vue-treeselect--open) .vue-treeselect__control {
      border-color: @color-theme-green;
    }
    .vue-treeselect__multi-value-item {
      color: @color-theme-green;
      background: #eee;
    }
    .vue-treeselect__value-remove {
      color: @color-theme-green;
    }
    .vue-treeselect:not(.vue-treeselect--disabled) .vue-treeselect__multi-value-item:not(.vue-treeselect__multi-value-item-disabled):hover .vue-treeselect__multi-value-item:not(.vue-treeselect__multi-value-item-new) .vue-treeselect__multi-value-item:not(.vue-treeselect__multi-value-item-new):hover {
      color: @color-theme-green;
    }
    .vue-treeselect__label-container:hover .vue-treeselect__checkbox--unchecked {
      border-color: @color-theme-green;

    }
    .vue-treeselect__checkbox--indeterminate {
      border-color: @color-theme-green;
      background: @color-theme-green;
    }
    .vue-treeselect__label-container:hover .vue-treeselect__checkbox--indeterminate {
      border-color: @color-theme-green;
      background: @color-theme-green;
    }
    .vue-treeselect__checkbox--checked {
      border-color: @color-theme-green;
      background: @color-theme-green;
    }
    .vue-treeselect__label-container:hover .vue-treeselect__checkbox--checked {
      border-color: @color-theme-green;
      background: @color-theme-green;
    }
    .vue-treeselect__error-tip .vue-treeselect__retry {
      color: @color-theme-green;
    }
    .vue-treeselect__icon-loader::before {
      background: @color-theme-green;
    }
    .pre {
      font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","\5FAE\8F6F\96C5\9ED1",Arial,sans-serif;
    }

</style>
