<template>
    <!-- 业务配置 -->
    <div>
        <Card style="width:400px;float: left;margin-right:20px">
            <p slot="title">
                <span class="title">{{lastSubConfigs.name}}({{lastSubConfigs.size}})</span>
                <span class="addIcon">
                    <Icon type="md-add" @click="addOneLevel" v-if="!isEdit" />
                </span>
            </p>
            <ul class="list">
                <li v-for="(item,i) in lastSubConfigs.sub" :key="i"  :class="[activeClass == item.id ? 'active':'' , {'changeRed':item.red}]">
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
                                            @click="editOneLevel(item,i)"
                                        />
                                    </span>
                                    <span>
                                        <Icon
                                            type="ios-trash-outline"
                                            size="22"
                                            style="margin-left: 6%;cursor: pointer;"
                                            @click="deleteOneLevel(item,i)"
                                        />
                                    </span>
                                </p>
                            </transition>
                        </span>
                        <span style="margin-left:8%" >
                            <i-switch v-model="item.status" @on-change="handleSwitch(item,i)"  :disabled="isEdit"/>
                        </span>
                        <!-- <Input
                            style="width:50%"
                            size="small"
                            v-model="item.tagName"
                            @on-blur="saveEditOne(item,i)"
                        />-->
                    </span>
                    <span v-else>
                        <Input
                            style="width:50%"
                            size="small"
                            v-model="item.tagName"
                            @on-blur="saveEditOne(item,i)"
                        />
                    </span>
                </li>
                <li v-if="showAddOne">
                    <Input style="width:50%;margin-right:8px" v-model="addVal" />
                    <Button class="btns" @click="cancelAddOne">取消</Button>
                    <Button class="btns" type="primary" @click="saveAddOne">保存</Button>
                </li>
            </ul>
        </Card>
    </div>
</template>

<script>
export default {
  name: 'lastSonset',
  props: {
    lastSetData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      activeClass: '', // 选中
      addVal: '', // 新增
      showMenu: [], // 操作菜单
      showAddOne: false, // 新增一级配置
      showEditOne: [], // 编辑一级配置
      lastSubConfigs: {}, // 数据
      isEdit: '' // 判断是不是编辑
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
      // deep:true,
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
      this.lastSubConfigs = v
      let sub = this.lastSubConfigs.sub || []
      this.showEditOne = sub.map(e => true)
      this.showMenu = sub.map(e => false)
    },
    // 新增一级配置(显示)
    addOneLevel () {
      this.showAddOne = true
      this.addVal = ''
      this.showEditOne = this.lastSubConfigs.sub.map(e => true) // 初始化
    },
    // 取消新增一级配置
    cancelAddOne () {
      this.showAddOne = false
    },
    // 保存新增一级配置
    saveAddOne () {
      if (this.addVal === '') {
        this.$Message.warning('请输入名称')
        return
      }
      this.$emit('addConfig', this.addVal, this.lastSubConfigs.sub)
      this.showAddOne = false
    },
    // 开关
    handleSwitch (item, i) {
      this.$emit('changeSwith', item)
    },
    // 显示操作菜单
    handleMenu (i) {
      // 初始化
      this.showAddOne = false
      if (this.showMenu[i] === true) {
        this.$set(this.showMenu, i, false)
      } else {
        this.showMenu = this.lastSubConfigs.sub.map(e => false) // 初始化
        this.$set(this.showMenu, i, true)
      }
    },
    // 显示编辑一级配置
    editOneLevel (item, i) {
      // 初始化
      this.showAddOne = false
      this.showEditOne = this.lastSubConfigs.sub.map(e => true)
      this.$set(this.showEditOne, i, false)
    },
    // 保存编辑一级配置
    saveEditOne (item, i) {
      this.showMenu = this.lastSubConfigs.sub.map(e => false) // 初始化
      if (item.tagName === '') {
        this.$Message.warning('请输入名称')
        return
      }
      this.$set(this.showEditOne, i, true)
      this.$emit('editConfig', item)
    },
    // 删除
    deleteOneLevel (item, i) {
      this.$emit('deleteConfig', item)
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
    width: 35%;
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
