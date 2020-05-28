<!-- 定岗定编列表 -->
<template>
  <div class="viewWrapper">
    <duty-template
      :data="tableData"
      :type="type"
      :tableType="tableType"
      :template="template"
      @update="update"
      @cancel="cancel"
      >
    </duty-template>
    <div class="select" v-show="!isGeneral">
      <div class="title">对应人员:</div>
      <div style="width: 300px">
        <div
          @click="() => {isEditing = true}"
          v-if="!isEditing"
          class="pointer"
          style="padding: 5px; display: inline-block; border-bottom: 1px solid #ccc"
        >
          <span v-for="(item, index) in selectedName" :key="index">
            {{item}}{{(index === selectedName.length - 1) ? '' : ','}}
          </span>
          <span v-show="selectedName.length === 0">点击添加人员</span>
        </div>
        <tree-select-vue
          v-else
          :options="options"
          :value-consists-of="valueConsistsOf"
          v-model="selected"
        >
        </tree-select-vue>
      </div>
    </div>
    <div class="save">
      <Button @click="back">返回</Button>
      <Button type="primary" @click="save" v-show="hasChange">保存</Button>
    </div>
  </div>
</template>

<script>
import DutyTemplate from '../components/duty-template.vue'
import TreeSelectVue from '@/components/tree-select-vue/tree-select-vue'
import { baseUrl } from '@/api/base.js'
import { dClone } from '@/assets/js/tools.js'

export default {
  components: { DutyTemplate, TreeSelectVue },

  inject: ['app'],

  data () {
    return {
      type: 2,
      selected: [],
      initSelectedId: [],
      selectedName: [],
      template: {},
      tableType: 2,
      tableData: [
        // {
        //   id: 1,
        //   name: '定岗定编',
        //   typeName: '公共事项',
        //   type: 1,
        //   children: [{
        //     id: 31,
        //     name: '定岗定编sub1',
        //     rateContent: '每日三次',
        //     rateType: 1,
        //     startTime: '9:00, 10:30, 11:30',
        //     jobRequire: '每年17月第一个工作日管理',
        //     mark: '这是sub1的备注',
        //     typeName: '公共事项',
        //     type: 1,
        //     oneTagId: 1
        //   },
        //   {
        //     id: 33,
        //     oneTagId: 1,
        //     name: '定岗定编sub2',
        //     rateContent: '每周一次',
        //     rateType: 2,
        //     startTime: '周三,周四',
        //     jobRequire: '每年17月第一个工作日管理',
        //     mark: '这是sub1的备注',
        //     typeName: '公共事项',
        //     type: 1,

        //   },
        //   {
        //     id: 34,
        //     oneTagId: 1,
        //     name: '定岗定编sub3',
        //     rateContent: '每月一次',
        //     rateType: 3,
        //     startTime: '16日,17日',
        //     jobRequire: '每年17月第一个工作日管理',
        //     mark: '这是sub1的备注',
        //     typeName: '公共事项',
        //     type: 1
        //   },
        //   {
        //     id: 35,
        //     oneTagId: 1,
        //     name: '定岗定编sub3',
        //     rateContent: '每年一次',
        //     rateType: 4,
        //     startTime: '3月3日,4月4日',
        //     jobRequire: '每年17月第一个工作日管理',
        //     typeName: '公共事项',
        //     mark: '这是sub1的备注',
        //     type: 1
        //   }]
        // },
        // {
        //   id: 2,
        //   name: '工作手册',
        //   typeName: '公共事项',
        //   type: 1,
        //   children: [
        //     {
        //       id: 33,
        //       oneTagId: 2,
        //       name: '工作手册sub1',
        //       rateContent: '每月一次',
        //       rateType: 1,
        //       startTime: '15日',
        //       jobRequire: '每年17月第一个工作日管理',
        //       mark: '这是sub1的备注',
        //       typeName: '公共事项',
        //       type: 1
        //     },
        //     {
        //       id: 34,
        //       oneTagId: 2,
        //       name: '工作手册sub2',
        //       rateContent: '每月一次',
        //       rateType: 2,
        //       startTime: '15日',
        //       jobRequire: '每年17月第一个工作日管理',
        //       mark: '这是sub1的备注',
        //       typeName: '公共事项',
        //       type: 1
        //     }
        //   ]
        // },
        // {
        //   id: 3,
        //   name: '扫地',
        //   typeName: '专项工作',
        //   type: 1,
        //   children: [{
        //     id: 31,
        //     oneTagId: 3,
        //     name: '定岗定编sub1',
        //     rateContent: '每日三次',
        //     rateType: 1,
        //     startTime: '9:00, 10:30, 11:30',
        //     jobRequire: '每年17月第一个工作日管理',
        //     mark: '这是sub1的备注',
        //     typeName: '专项工作',
        //     type: 1
        //   },
        //   {
        //     id: 33,
        //     oneTagId: 3,
        //     name: '定岗定编sub2',
        //     rateContent: '每周一次',
        //     rateType: 2,
        //     startTime: '周三,周四',
        //     jobRequire: '每年17月第一个工作日管理',
        //     mark: '这是sub1的备注',
        //     typeName: '专项工作',
        //     type: 1
        //   },
        //   {
        //     id: 34,
        //     oneTagId: 3,
        //     name: '定岗定编sub3',
        //     rateContent: '每月一次',
        //     rateType: 3,
        //     startTime: '16日,17日',
        //     jobRequire: '每年17月第一个工作日管理',
        //     mark: '这是sub1的备注',
        //     typeName: '专项工作',
        //     type: 1
        //   },
        //   {
        //     id: 35,
        //     oneTagId: 3,
        //     name: '定岗定编sub3',
        //     rateContent: '每年一次',
        //     rateType: 4,
        //     startTime: '3月3日,4月4日',
        //     jobRequire: '每年17月第一个工作日管理',
        //     typeName: '专项工作',
        //     mark: '这是sub1的备注',
        //     type: 1
        //   }]
        // },
        // {
        //   id: 4,
        //   name: '烧开水',
        //   typeName: '专项工作',
        //   type: 1,
        //   children: [
        //     {
        //       id: 33,
        //       oneTagId: 4,
        //       name: '工作手册sub1',
        //       rateContent: '每月一次',
        //       rateType: 1,
        //       startTime: '15日',
        //       jobRequire: '每年17月第一个工作日管理',
        //       mark: '这是sub1的备注',
        //       typeName: '专项工作',
        //       type: 1
        //     },
        //     {
        //       id: 34,
        //       oneTagId: 4,
        //       name: '工作手册sub2',
        //       rateContent: '每月一次',
        //       rateType: 2,
        //       startTime: '15日',
        //       jobRequire: '每年17月第一个工作日管理',
        //       mark: '这是sub1的备注',
        //       typeName: '专项工作',
        //       type: 1
        //     }
        //   ]
        // }
      ],
      options: [],
      valueConsistsOf: 'LEAF_PRIORITY',
      // 是否编辑对应人员
      isEditing: false,
      isGeneral: false
    }
  },

  mounted () {
    // this.mergeData()
    this.getTableData()
    this.getTreeData()
    // 如果是公用模板不显示人员配置选择框
    this.isGeneral = this.$route.query.general
  },

  methods: {
    getTableData () {
      this.$axios({
        url: baseUrl + '/station/selectJobTag',
        method: 'post',
        data: $qs.stringify({ id: this.$route.query.id })
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.template = { name: res.data.content.jobName, id: res.data.content.id, publicCategoryName: res.data.content.publicCategoryName }
            // console.log(res.data.content, 'content')
            this.selected = res.data.content.personId ? res.data.content.personId : []
            this.initSelectedId = dClone(this.selected)
            this.selectedName = res.data.content.personName
            this.tableData = res.data.content.children
            this.clonedData = dClone(this.tableData)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    getTreeData () {
      this.$axios({
        url: baseUrl + '/user/getIncumbencyTbUserBySort',
        method: 'get'
      })
        .then(res => {
          this.options = res.data.content
        })
    },
    // // 获取公共模板数据
    // getPubData () {
    //   return this.$axios({
    //     url: baseUrl + '/station/selectPublicTag',
    //     method: 'post',
    //     data: $qs.stringify({id: this.$route.query.pid})
    //   })
    // },
    // // 获取定岗定编数据
    // getPvtData () {
    //   return this.$axios({
    //     url: baseUrl + '/station/selectJobTag',
    //     method: 'post',
    //     data: $qs.stringify({id: this.$route.query.id})
    //   })
    // },
    // 合并数据
    // mergeData () {
    //   let that = this
    //   this.$axios
    //     .all([that.getPubData(), that.getPvtData()])
    //     .then(that.$axios.spread((pub, pvt) => {
    //       this.templateName = pvt.data.content.name
    //       this.selected = pvt.data.content.personId
    //       pub = pub.data.content.children
    //       pvt = pvt.data.content.children
    //       this.tableData = [...pub, ...pvt]
    //       this.clonedData = dClone(this.tableData)
    //     }))
    //     .catch(err => {
    //       console.log(err)
    //     })
    // },
    // 插入/修改数据成功后跟新数据
    update () {
      // this.mergeData()
      this.getTableData()
    },
    // 取消编辑回复原来数据
    cancel () {
      this.tableData = dClone(this.clonedData)
    },
    //
    async save () {
      // 人员模板情况
      let templateSituation = []
      let res
      try {
        res = await this.$axios({ url: baseUrl + '/stationSceen/stationListAll' })
      } catch (err) {
        console.log(err)
      }

      if (res.data.code === 10000) {
        templateSituation = res.data.content
      }

      let jobCategoryId = parseInt(this.$route.query.id)
      let personId = this.selected
      let params = { jobCategoryId, personId }
      let len = this.selected.length
      let newSelected = [] // 新增人员
      let alreadyHasTemplateList = [] // 新增人员是否已有模板

      for (let i = len - 1; i >= 0; i--) {
        // 初始对应人员中找目前选择的人员
        // 没找到说明是新增
        if (this.initSelectedId.indexOf(this.selected[i]) === -1) {
          newSelected.push(this.selected[i])
        }
      }

      newSelected.forEach(person => {
        let index = this.findIndexById(person, templateSituation)
        if (index >= 0) {
          // 如果新增人员stationFormwork字段不为空 说明有模板
          if (templateSituation[index].stationFormwork) {
            alreadyHasTemplateList.push(templateSituation[index])
          }
        }
      })

      if (alreadyHasTemplateList.length > 0) {
        let names = alreadyHasTemplateList.map(item => {
          return item.nickname
        })
        let nameStr = names.length === 1 ? names[0] : names.join('、')
        this.$Modal.confirm({
          title: '提醒',
          content: `${nameStr}目前已有模板，确认变更吗？`,
          onOk: () => {
            this.$axios({
              url: baseUrl + '/station/insertPerson',
              method: 'post',
              data: params
            })
              .then(res => {
                // console.log(res)
                if (res.data.code === 10000) {
                  this.$Message.success(res.data.msg)
                  // this.mergeData()
                  this.isEditing = false
                  this.getTableData()
                } else {
                  this.$Message.success(res.data.msg)
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        })
      } else {
        this.$axios({
          url: baseUrl + '/station/insertPerson',
          method: 'post',
          data: params
        })
          .then(res => {
            // console.log(res)
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              // this.mergeData()
              this.isEditing = false
              this.getTableData()
            } else {
              this.$Message.success(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    back () {
      this.$router.go(-1)
    },
    findIndexById (id, arr) {
      return arr.findIndex((value, index) => {
        return value.id === parseInt(id)
      })
    }
  },

  computed: {
    employees () {
      return this.app.employees
    },
    hasChange () {
      if (this.selected && this.initSelectedId) {
        if (this.selected.length !== this.initSelectedId.length) {
          return true
        } else {
          let sortedNew = [...this.selected].sort((a, b) => (parseInt(a) - parseInt(b))).toString()
          let sortedOrigin = [...this.initSelectedId].sort((a, b) => (parseInt(a) - parseInt(b))).toString()
          // console.log(sortedNew)
          // console.log(sortedOrigin)
          if (sortedNew === sortedOrigin) {
            return false
          } else {
            return true
          }
        }
      }
      // console.log(this.selected.length, this.initSelectedId.length)
    }
  }
}
</script>

<style lang='less' scoped>
.select {
  display: flex;
  align-items: center;
  margin-top: 50px;
  .title {
    margin-right: 10px;
    min-width: 60px;
  }
}
.save {
  text-align: center;
  margin: 50px 0;
}
</style>
