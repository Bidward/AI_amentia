<template>
    <!-- 业务配置 -->
    <div>
        <Card style="width:400px;float: left;margin-right:20px">
            <p slot="title">
                <span class="title">{{parentSubConfigs.name}}({{parentSubConfigs.size}})</span>
                <span class="addIcon">
                    <Icon type="md-add" @click="addOneLevel" v-if="!isEdit" />
                </span>
            </p>
            <ul class="list">
                <li
                    v-for="(item,i) in parentSubConfigs.sub"
                    :key="i"
                    :class="[activeClass == item.id ? 'active':'' , {'changeRed':item.red}]"
                >
                    <span v-if="showEditOne[i]">
                        <span class="oneTitle">{{item.tagName}}</span>
                        <span class="editIcon" v-if="!isEdit">
                            <Icon type="ios-menu" size="22" @click="handleMenu(i)" />
                            <transition name="slide-fade">
                                <p v-if="showMenu[i]" style="display: inline;">
                                    <span>
                                        <Icon
                                            type="ios-create-outline"
                                            size="22"
                                            style="margin-left: 6%;cursor: pointer;"
                                            @click="editOneLevel(i)"
                                        />
                                    </span>
                                    <span>
                                        <Icon
                                            type="ios-trash-outline"
                                            size="22"
                                            style="margin-left: 6%;cursor: pointer;"
                                            @click="deleteParent(item,i)"
                                        />
                                    </span>
                                </p>
                            </transition>
                        </span>
                        <span style="margin-left:8%">
                            <i-switch v-model="item.status" @on-change="handleSwitch(item,i)" :disabled="isEdit"/>
                        </span>
                    </span>
                    <span v-else>
                        <Input
                            style="width:50%"
                            size="small"
                            @on-blur="saveEditOne(item,i)"
                            v-model="item.tagName"
                        />
                    </span>
                    <span style="float:right;cursor: pointer">
                        <!-- <Icon
                            :stauts="goStauts[i]"
                            :type="iconType[i]"
                            size="16"
                            @click="goNextSet(item,i)"
                        /> -->
                    </span>
                </li>
                <li v-if="showAddOne">
                    <Input style="width:50%;margin-right:8px" v-model="addValue" />
                    <Button class="btns" @click="cancelAddOne">取消</Button>
                    <Button class="btns" type="primary" @click="saveAddOne">保存</Button>
                </li>
            </ul>
        </Card>
    </div>
</template>

<script>
import LaunchTask from '../../launch-task'
export default {
  name: 'sonSet',
  props: {
    channelParentSubConfigs: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  components: {
    LaunchTask
  },
  data () {
    return {
      activeClass: '', // 选中
      parentSubConfigs: {},
      addValue: '', // 增加数据
      showMenu: [], // 操作菜单
      goStauts: [],
      iconType: [], // ios-arrow-forward,down
      showAddOne: false, // 新增一级配置
      showEditOne: [], // 编辑一级配置
      showWarn: false, // 提醒发简易任务
      showLaunch: false, // 显示简易任务
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
      // deep: true,
      immediate: true
    },
    // 监听是不是编辑
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
      this.parentSubConfigs = v
      let sub = this.parentSubConfigs.sub || []
      this.showMenu = sub.map(e => false)
      this.showEditOne = sub.map(e => true)
      this.goStauts = sub.map(e => true)
      this.iconType = sub.map(
        e => 'ios-arrow-forward'
      )
    },
    // 新增一级配置(显示)
    addOneLevel () {
      this.showAddOne = true
      this.addValue = ''
      this.showEditOne = this.parentSubConfigs.sub.map(e => true) // 初始化
    },
    // 取消新增一级配置
    cancelAddOne () {
      this.showAddOne = false
    },
    // 保存新增一级配置
    saveAddOne () {
      if (this.addValue === '') {
        this.$Message.warning('请输入名称')
        return
      }
      this.$emit('addConfig', this.addValue)
      this.showAddOne = false
    },
    // 显示操作菜单
    handleMenu (i) {
      // 初始化
      this.showAddOne = false
      if (this.showMenu[i] === true) {
        this.$set(this.showMenu, i, false)
      } else {
        this.showMenu = this.parentSubConfigs.sub.map(e => false) // 初始化
        this.$set(this.showMenu, i, true)
      }
    },
    // 显示编辑一级配置
    editOneLevel (i) {
      // 初始化
      this.showAddOne = false
      this.showEditOne = this.parentSubConfigs.sub.map(e => true)
      // 发待办事项
      this.$set(this.showEditOne, i, false)
    },
    // 保存编辑一级配置
    saveEditOne (item, i) {
      //  this.showMenu = this.lastSubConfigs.sub.map(e => false) // 初始化
      if (item.tagName === '') {
        this.$Message.warning('请输入名称')
        return
      }
      this.$set(this.showEditOne, i, true)
      this.$emit('editConfig', item)
    },
    // 开关
    handleSwitch (item) {
      this.$emit('changeSwith', item)
    },
    // 删除
    deleteParent (item, i) {
      this.$emit('deleteConfig', item)
      // this.parentSubConfigs.subConfig.splice(i, 1);
    },
    // 获取下一级配置(切换状态 展开或闭合)
    goNextSet (item, i) {
      // 初始化(先把所有的闭合)
      this.iconType = this.parentSubConfigs.sub.map(
        e => 'ios-arrow-forward'
      )
      if (this.goStauts[i]) {
        this.activeClass = item.id
        this.goStauts = this.parentSubConfigs.sub.map(e => true)
        this.$set(this.iconType, i, 'ios-arrow-down')
        this.$emit('nextSet', item, this.goStauts[i])
        this.$set(this.goStauts, i, false)
      } else {
        this.activeClass = -1
        this.goStauts = this.parentSubConfigs.sub.map(e => true)
        this.$set(this.iconType, i, 'ios-arrow-forward')
        this.$emit('nextSet', item, false)
      }
    },
    // 确定发任务
    ensure () {
      this.showLaunch = true
    },
    hide (v) {
      this.showLaunch = v
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
    width: 30%;
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
