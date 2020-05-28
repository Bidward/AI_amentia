<template>
    <!-- 业务配置 -->
    <div>
        <Card style="width:400px;float: left;margin-right:20px">
            <p slot="title">
                <span class="title">{{lastSubConfigs.name}}({{lastSubConfigs.size}})</span>
                 <Tooltip
                    :content="`请选择需要两人两遍的${reminder}！`"
                    placement="top"
                    max-width="200"
                    :transfer="true"
                    v-if="reminder"
                >
                    <Icon type="md-help-circle" style="margin-right:5px;color:#a3a4a3;;" />
                </Tooltip>
            </p>
            <ul class="list">
                <li v-for="(item,i) in lastSubConfigs.sub" :key="i" :class="[activeClass == item.id ? 'active':'' , {'changeRed':item.red}]">
                    <span class="oneTitle">{{item.name}}</span>
                    <span style="margin-left:20%">
                        <i-switch v-model="item.status" @on-change="handleSwitch(item,i)"  :disabled="isEdit"/>
                    </span>
                </li>
            </ul>
        </Card>
    </div>
</template>

<script>
export default {
  name: 'lastSonSet2',
  props: {
    lastSetData: {
      type: Object,
      default () {
        return {}
      }
    },
    reminder: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      activeClass: '', // 选中
      lastSubConfigs: {}, // 数据
      isEdit: '' // 是不是编辑
    }
  },
  computed: {
    isEdits () {
      return this.$attrs.moduleL.isEdit
    }
  },
  watch: {
    lastSetData: {
      handler (newVal) {
        this.getData(newVal)
      },
      deep: true,
      immediate: true
    },
    isEdits: {
      handler (newVal) {
        this.isEdit = newVal
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 获取一级配置
    getData (v) {
      this.lastSubConfigs = v
    },
    // 开关
    handleSwitch (item, i) {
      this.$emit('changeSwith', item)
    }
  }
}
</script>
<style scoped>
.title {
    font-weight: bold;
}
.addIcon {
    float: right;
    cursor: pointer;
}
.list li {
    border: 1px solid #ccc;
    border-radius: 5px;
    background: #f8f8f8;
    margin-bottom: 10px;
    padding: 10px;
}
.editIcon {
    margin-left: 12%;
    cursor: pointer;
}
.oneTitle {
    width: 40%;
    display: inline-block;
    word-wrap: break-word;
}
.slide-fade-enter-active {
    transition: all 0.3s ease;
}
.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(-10px);
    opacity: 0;
}
.changeRed {
    border: 1px solid red !important;
}
</style>
