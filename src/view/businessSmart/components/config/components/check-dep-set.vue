<template>
    <!-- 业务配置 -->
    <div>
        <Card style="width:400px;float: left;margin-right:20px">
            <p slot="title">
                <span class="title">{{parentSubConfigs.name}}({{parentSubConfigs.size}})</span>
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
                <li
                    v-for="(item,i) in parentSubConfigs.sub"
                    :key="i"
                    :class="[activeClass == item.id ? 'active':'' , {'changeRed':item.red}]"
                >
                    <span class="oneTitle">{{item.name}}</span>
                    <span style="margin-left:8%">
                        <i-switch
                            v-model="item.status"
                            @on-change="handleSwitch(item,i)"
                            :disabled="isEdit"
                        />
                    </span>
                    <span style="float:right;cursor: pointer">
                        <Icon
                            :stauts="goStauts[i]"
                            :type="iconType[i]"
                            size="16"
                            @click="goNextSet(item,i)"
                        />
                    </span>
                </li>
            </ul>
        </Card>
    </div>
</template>

<script>
import LaunchTask from '../../launch-task'
export default {
  name: 'sonCheck',
  props: {
    channelParentSubConfigs: {
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
  components: {
    LaunchTask
  },
  data () {
    return {
      activeClass: '', // 选中
      parentSubConfigs: {}, // 获取的数据
      goStauts: [], // ios-arrow-forward,down
      iconType: [],
      isEdit: '' // 是不是编辑
    }
  },
  computed: {
    tagName () {
      return this.$attrs.moduleL.currentId
    },
    isEdits () {
      return this.$attrs.moduleL.isEdit
    }
  },
  watch: {
    channelParentSubConfigs: {
      handler (newVal) {
        this.getData(newVal)
      },
      deep: true,
      immediate: true
    },
    // 监听是不是编辑
    isEdits: {
      handler (newVal) {
        this.isEdit = newVal
      },
      deep: true
    }
  },
  methods: {
    // 获取一级配置
    getData (v) {
      this.parentSubConfigs = v
      let sub = this.parentSubConfigs.sub || []
      this.goStauts = sub.map(e => true)
      this.iconType = sub.map(e => 'ios-arrow-down')
    },
    // 开关
    handleSwitch (item) {
      this.$emit('changeSwith', item)
    },
    // 获取下一级配置(切换状态 展开或闭合)
    goNextSet (item, i) {
      // 初始化(先把所有的闭合)
      this.iconType = this.parentSubConfigs.sub.map(
        e => 'ios-arrow-down'
      )
      if (this.goStauts[i]) {
        this.activeClass = item.id
        this.goStauts = this.parentSubConfigs.sub.map(e => true)
        this.$set(this.iconType, i, 'ios-arrow-forward')
        this.$emit('nextSet', item, this.goStauts[i])
        this.$set(this.goStauts, i, false)
      } else {
        this.activeClass = -1
        this.goStauts = this.parentSubConfigs.sub.map(e => true)
        this.$set(this.iconType, i, 'ios-arrow-down')
        this.$emit('nextSet', item, false)
      }
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
.warn {
    padding: 15px;
    text-align: center;
}
.active {
    background: #e8f4f2 !important;
    border: 1px solid #e8f4f2 !important;
}
.changeRed {
    border: 1px solid red !important;
}
</style>
