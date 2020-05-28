<!-- 公共模块列表 -->
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
    <div class="save">
      <Button @click="back">返回</Button>
      <!-- <Button type="primary" @click="save" v-show="hasChange">保存</Button> -->
    </div>
  </div>
</template>

<script>
import DutyTemplate from '../components/duty-template.vue'
import { baseUrl } from '@/api/base.js'
import { dClone } from '@/assets/js/tools.js'
export default {
  components: { DutyTemplate },

  data () {
    return {
      // 公共模板
      type: 1,
      // 后端要求字段，生成代办事项，公共模板为1
      tableType: 1,
      template: {},
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
        //     type: 1
        //   }]
      ],
      clonedData: []
    }
  },

  created () {
    this.getTableData()
  },

  methods: {
    getTableData () {
      this.$axios({
        url: baseUrl + '/station/selectPublicTag',
        method: 'post',
        data: $qs.stringify({ id: this.$route.query.id })
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.tableData = res.data.content.children
            this.template = { name: res.data.content.name, id: res.data.content.id }
            this.clonedData = dClone(this.tableData)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    update () {
      this.getTableData()
    },
    // 取消编辑恢复原来数据
    cancel () {
      this.tableData = dClone(this.clonedData)
    },
    back () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang='less' scoped>
.save {
  text-align: center;
  margin: 50px 0;
}
</style>
