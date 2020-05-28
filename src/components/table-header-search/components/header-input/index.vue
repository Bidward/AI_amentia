<template>
  <span @mouseover="show=true" :title="domTitle">
    <Poptip placement="bottom" v-if="show||!lazy">
      <div slot="content">
        <slot name="pre"></slot>
        <Input
          class="fuzzySearch"
          :value="value"
          :clearable="clearable"
          :placeholder="placeholder"
          @input="(data)=>$emit('input',data)"
          @on-enter="()=>$emit('on-search',value)"
        >
          <Icon
            @click="()=>$emit('on-search',value)"
            class="pointer"
            type="ios-search"
            slot="suffix"
          />
          <Icon
            v-show="value"
            @click="()=>{$emit('on-clear')}"
            class="pointer"
            type="ios-close-circle-outline"
            slot="suffix"
          />
        </Input>
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
  name: 'table-header-input',
  props: {
    clearable: {
      type: Boolean,
      default: true
    },
    value: {
      required: true,
      type: String
    },
    // 懒加载弹出框的内容，性能节省开销
    lazy: {
      type: Boolean,
      default: true
    },
    // 原生的title，放上去预览
    domTitle: {
      type: String,
      default: ''
    },
    // 表格的表头文字
    title: {
      required: true,
      type: String
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      show: false
    }
  }
}
</script>

<style lang="css" scoped>
.fuzzySearch {
  width: 200px;
}
.fuzzySearch>>>span {
  margin: 0 4px;
}
</style>
