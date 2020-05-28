<template>
  <span @mouseover="show=true">
    <Poptip placement="bottom" v-if="show||!lazy">
      <div slot="content">
        <slot name="pre"></slot>
        <Select
          :value="value"
          :clearable="clearable"
          :filterable="filterable"
          :multiple="multiple"
          :labelInValue="labelInValue"
          @input="data=>$emit('input',data)"
          @on-change="data =>$emit('on-change',data)"
        >
          <Option
            v-for="item in _options"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </Select>
        <slot name="after"></slot>
      </div>
      <span class="pointer">
        {{title}}
        <Icon type="md-search" size="14" :class="{'on':value}" />
      </span>
    </Poptip>
    <span class="pointer" v-else>
      {{title}}
      <Icon type="md-search" size="14" :class="{'on':value}" />
    </span>
  </span>
</template>

<script>

export default {
  name: 'table-header-select',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Array],
      required: true,
      default: ''
    },
    // 懒加载模式
    lazy: {
      type: Boolean,
      default: true
    },
    labelInValue: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: true
    },
    title: {
      required: true,
      type: String
    },
    options: {
      type: Array,
      required: true
    },
    propsLabel: {
      type: String
    },
    propsValue: {
      type: String
    }
  },
  data () {
    return {
      show: false
    }
  },
  computed: {
    _options () {
      const label = this.propsLabel || 'label'
      const value = this.propsValue || 'value'
      return this.options.map(e => {
        return {
          label: e[label],
          value: e[value]
        }
      })
    }
  }
}
</script>
