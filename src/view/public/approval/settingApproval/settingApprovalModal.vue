<template>
<!-- 选择审批人的弹框 -->
    <div>
        <Button class="btn-green" @click="showModal">选择审批人</Button>
        <Modal
            title="选择审批人"
            v-model="approverModal"
            :mask-closable="false"
            @on-ok="approvalOk()"
            @on-cancel="approvalCancel()"
            class-name="vertical-center-modal">
            <section class="rows">
                审批人(按先后顺序进行审批流程)：
                <!-- <Select v-model="approver" filterable clearable multiple style="min-height:20px">
                    <Option v-for="item in incumbencyTbUser" :value="item.id" :key="item.id">{{ item.nickname }}</Option>
                </Select> -->
                <dept-tree-select
                    @treeSelect="receiver"
                    :optionsProps="employees"
                    :modalData="approver"
                    :valueConsistsOf="valueConsistsOf"
                    :addLabel="addOptions"></dept-tree-select>
                <!-- <treeselect
                  class="treeSelectWrapper"
                  clearAllText="清空"
                  noResultsText="暂无数据"
                  placeholder="请选择执行人"
                  :appendToBody="true"
                  :maxHeight="200"
                  :multiple="true"
                  :options="options"
                  :value="getIds(employees)"
                  :value-consists-of="valueConsistsOf"
                  v-model="approver"
                  :load-options="loadOptions"
                  :default-expand-level="1"
                  :disable-branch-nodes="true"
                  :flattenSearchResults="true"
                /> -->
            </section>
            <section class="rows">
                <Button class="btn-green" @click="addDeptManage">申请人部门负责人</Button>
                <Button class="btn-green" @click="addPreDeptManage">前一审批人部门负责人</Button>
            </section>
            <section class="rows">
                部门负责人空缺时：
                <Select v-model="empty" style="width:38%">
                  <Option v-for="item in opts" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </section>
        </Modal>
    </div>
</template>

<script>
import deptTreeSelect from '_c/dept-tree-select'
import { baseUrl } from '@/api/base.js'
export default {
  name: 'settingApprovalModal',
  components: { deptTreeSelect },
  inject: ['app'],
  props: {
    approveType: { // 1：暂缓 2：关闭 3：日常奖惩销分
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      approverModal: false,
      valueConsistsOf: 'LEAF_PRIORITY', // 子集优先
      approver: [],
      deptManageIndex: 0, // 申请人部门负责人,插入的位置
      addIndex: 0, // 申请人部门负责人 添加索引
      addPreIndex: -1, // 前一审批人 添加索引
      opts: [
        {
          value: '0',
          label: '保持空缺'
        },
        {
          value: '1',
          label: '查找上级部门'
        }
      ],
      empty: '0'
    }
  },
  computed: {
    employees () { // 在职人员
      return this.app.employees
    },
    addOptions () {
      return [
        { id: '0', label: '申请人部门负责人', pid: 'dpt1' },
        { id: this.addPreIndex + '', label: '前一审批人部门负责人', pid: 'dpt1' }
      ]
    }
  },
  methods: {
    receiver (receiver) {
      this.approver = receiver
    },
    showModal () {
      this.approver = []
      this.approverModal = true
    },
    addDeptManage () {
    //   let addIndexFlag = this.approver.includes('0')
      let deptManageIndex = this.approver.findIndex(item => item === '0')
      if (deptManageIndex >= 0) {
        this.approver.splice(deptManageIndex, 1)
        this.addIndex = 0
      } else {
        if (this.addIndex === 0) {
          this.approver.push(this.addIndex.toString())
          this.deptManageIndex = this.approver.length - 1 // 位置 存起来
          this.addIndex = 1.1
        } else {
          this.approver.splice(this.deptManageIndex, 1)
          this.addIndex = 0
        }
      }
    },
    addPreDeptManage () {
      if (this.approver.length === 0) {
        this.$Message.error('请先添加审批人')
      } else {
        this.addPreIndex--
        this.approver.push(this.addPreIndex.toString())
      }
    },
    // 选择审批人
    approvalOk () {
      let sendData = {
        headIsEmpty: this.empty,
        approveProcess: this.approver.join(),
        approveType: this.approveType.toString()
      }

      this.$axios({
        url: baseUrl + '/approve/setProcess',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.$Message.success(res.data.msg)
          this.$emit('get', true)
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
      this.approver = []
    },
    approvalCancel () {}
  }
}
</script>

<style lang="less">
//   @import '~@/assets/style/variables.less';
//   .v-transfer-dom{
//     position: relative;
//     z-index: 10;
//   }
//   /**treeselect样式覆盖 */
//   .vue-treeselect__menu-container>div{
//     z-index: 20;
//   }
//   .vue-treeselect__value-remove{
//     display: none;
//   }
//   .vue-treeselect--focused:not(.vue-treeselect--open) .vue-treeselect__control {
//       border-color: @color-theme-green;
//       // box-shadow: 0 0 0 3px rgba(3, 155, 229, 0.1);
//     }
//     .vue-treeselect__multi-value-item {
//       color: @color-theme-green;
//     }
//     .vue-treeselect:not(.vue-treeselect--disabled) .vue-treeselect__multi-value-item:not(.vue-treeselect__multi-value-item-disabled):hover .vue-treeselect__multi-value-item:not(.vue-treeselect__multi-value-item-new) .vue-treeselect__multi-value-item:not(.vue-treeselect__multi-value-item-new):hover {
//       color: @color-theme-green;
//     }
//     .vue-treeselect__label-container:hover .vue-treeselect__checkbox--unchecked {
//       border-color: @color-theme-green;

//     }
//     .vue-treeselect__checkbox--indeterminate {
//       border-color: @color-theme-green;
//       background: @color-theme-green;
//     }
//     .vue-treeselect__label-container:hover .vue-treeselect__checkbox--indeterminate {
//       border-color: @color-theme-green;
//       background: @color-theme-green;
//     }
//     .vue-treeselect__checkbox--checked {
//       border-color: @color-theme-green;
//       background: @color-theme-green;
//     }
//     .vue-treeselect__label-container:hover .vue-treeselect__checkbox--checked {
//       border-color: @color-theme-green;
//       background: @color-theme-green;
//     }
//     .vue-treeselect__error-tip .vue-treeselect__retry {
//       color: @color-theme-green;
//     }
//     .vue-treeselect__icon-loader::before {
//       background: @color-theme-green;
//     }
//     .pre {
//       font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","\5FAE\8F6F\96C5\9ED1",Arial,sans-serif;
//     }
</style>
<style lang="less" scope>
.vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
    .ivu-modal{
        top: 0;
        .rows{
            margin: 20px 10px;
        }
    }
}
</style>
