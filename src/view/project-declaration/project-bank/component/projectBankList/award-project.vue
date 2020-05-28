<!--项目库 奖补完成 -->
<template>
    <!--项目库 奖补完成 -->
    <div>
        <projectTable localKey="unawardProjectHeaderV2" :defaultList="defaultList"></projectTable>
    </div>
</template>
<script>
import projectMixins from './projectMixins.js'
import projectTable from './project-table'
export default {
  name: 'unawardProject',
  components: {
    projectTable
  },
  mixins: [projectMixins],
  data () {
    return {
      defaultList: [
        'index',
        'projectName', // 项目名称
        'declareLevel', // 申请级别
        'pastTime', // 往年申报时间
        'deadline', // 截止时间
        // 'company', // 公司
        // 'policyDocument', // 政策文件
        'awardMoney', // 奖补金额(万元)
        'fromDepartment', // 归口部门
        'contacts', // 联系人
        'contactInfo', // 联系方式
        'completeTime', // 完成时间
        'action'
      ]
    }
  },
  methods: {

  }
}
</script>
<style scoped>

</style>
