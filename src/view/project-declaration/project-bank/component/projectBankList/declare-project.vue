<template>
    <!--项目库 申报成功 -->
    <div>
        <projectTable localKey="declareProjectHeaderV2" :defaultList="defaultList"></projectTable>
    </div>
</template>
<script>
import projectMixins from './projectMixins.js'
import projectTable from './project-table'
export default {
  name: 'declareProject',
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
        'examined', // 年审   申报成功中有
        'existenceAward', // 奖补 申报成功中有
        'pastTime', // 往年申报时间
        'deadline', // 截止时间
        // 'company', // 公司
        // 'policyDocument', // 政策文件
        'awardMoney', // 奖补金额(万元)
        'awardUnit', // 奖补单位
        'fromDepartment', // 归口部门
        'contacts', // 联系人
        'contactInfo', // 联系方式
        'projectProgress', // 项目条件进度
        'checkInfo', // 信息核对
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
