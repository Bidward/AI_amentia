<template>
    <div class="viewWrapper">
      <div class="tableHeader-only">
        <Select
          filterable
          v-model="userId"
          @on-change="getUserPlan"
          style="width:220px"
          v-if="!$route.query.from"
        >
          <Option
            v-for="person in employees"
            :value="person.id"
            :key="person.id"
            :label="person.nickname"
          >
            <h3>{{ person.nickname }}</h3>
            <h4 class="selectDept">部门：{{person.deptName}}</h4>
            <h4 class="selectDept">职位：{{person.positionName}}</h4>
          </Option>
        </Select>
        <Select
            v-else
            filterable
            v-model="deptId"
            @on-change="getDutyDetail"
            style="width:220px"
            >
            <Option
                v-for="dept in deptList"
                :value="dept.id"
                :key="dept.id"
                :label="dept.name"
            >
                <p>{{ dept.name }}</p>
            </Option>
        </Select>
        <span class="switch pointer" v-show="!$route.query.from">
          <Icon type="ios-stats" size="24" color="#19aa8d"/>
          <span class="changeWork" @click="planDayChange">
            <span v-if="change">切换每日工作表</span>
            <span v-else>切换成员定岗定编</span>
          </span>
        </span>
      </div>

      <tree-table-vxe v-if="change" :data="tableData"></tree-table-vxe>
      <generalPlan :userId="userId" v-else/>
      <div class="tableFooter center">
          <Button @click="goBack">返回</Button>
      </div>
    </div>
</template>

<script>
import generalPlan from '../generalPlan/generalPlan'
import TreeTableVxe from '../tree-table-vxe.vue'
import { baseUrl } from '@/api/base.js'
export default {
  name: 'generalMemberDetail',
  inject: ['app'],
  components: { TreeTableVxe, generalPlan },
  data () {
    return {
      deptList: [],
      deptId: Number(this.$route.query.deptId),
      userId: Number(this.$route.query.userId) || 1,
      change: sessionStorage.planDayChange !== 'false',
      tableData: []
    }
  },
  computed: {
    employees () {
      return this.app.employees
    }
  },
  created () {
    if (this.$route.query.from) this.getDeptList()
    this.getDutyDetail()
  },
  methods: {
    planDayChange () {
      this.change = !this.change
      sessionStorage.setItem('planDayChange', this.change)
      this.getDutyDetail()
    },
    getUserPlan () {
      if (this.change) {
        this.getDutyDetail()
      } else {
        this.$emit('user-id', this.userId)
      }
    },
    getDeptList () {
      this.$axios({
        url: baseUrl + '/stationSceen/deptList',
        method: 'post',
        data: $qs.stringify({ pageSize: 40 })
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.deptList = res.data.content.pageContent
          } else {
            this.deptList = []
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getDutyDetail () {
      let path = '/station/selectMyTag'
      let deptId = this.deptId === 0 || this.deptId
      if (deptId) {
        path = '/station/selectJobTag'
      }
      this.$axios({
        url: baseUrl + path,
        method: 'post',
        data: $qs.stringify({ id: this.deptId || this.userId })
      })
        .then(res => {
          if (res.data.code === 10000) {
            // this.tableData = res.data.content.children
            if (res.data.content) {
              this.tableData = res.data.content.children
            } else {
              this.tableData = []
            }
            this.$Message.success(res.data.msg)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    goBack () {
      this.$router.go(-1)
      bus.$emit('on-myclose', this.$route)
    }
  }
}
</script>

<style lang="less" less>
  .switch{
    float: right;
    font-size: 14px;
    color: #19aa8d;
    &:hover{
      color: #19aa8d;
      text-decoration: underline;
    }
    .changeWork{
      position: relative;
      top: 2px;
    }
  }
  .center {
      text-align: center;
  }
</style>
