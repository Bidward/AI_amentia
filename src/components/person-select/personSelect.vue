<template>
    <!-- 在职人员列表 -->
    <div>
    <Select slot="content" filterable clearable v-model="personValue" @on-change="choicePerson">
        <Option
            :value="person.nickname"
            :key="person.id"
            :label="person.nickname"
            v-for="person in employee"
        >
            <div>
                <div>{{person.nickname}}</div>
                <div style="font-weight: normal;">
                    <span>部门:</span>
                    <span>{{person.deptName}}</span>
                </div>
                <div style="font-weight: normal;">
                    <span>职位:</span>
                    <span>{{person.positionName}}</span>
                </div>
            </div>
        </Option>
    </Select>
    </div>
</template>
<script>
export default {
  name: 'personSelect',
  inject: ['app'],
  data () {
    return {
      personValue: ''
    }
  },
  computed: {
    // 获取在职人员
    employee () {
      return this.app.employees
    }
  },
  methods: {
    // 选择人员,传值
    choicePerson () {
      this.$emit('getData', this.personValue)
    }
  }
}
</script>
