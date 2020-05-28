<template>
  <!-- 业务配置 -->
  <div class="cloudCooper">
    <Tabs value="1" tab="outTable"  :animated="false" @on-click="openComponent" >
      <TabPane label="业务配置" name="1"></TabPane>
      <TabPane label="标签关联管理" name="2"  ></TabPane>
      <TabPane label="待确认事项" name="3" ></TabPane>
    </Tabs>
    </div>
</template>
<script>
export default {
  name: 'cloudConfig',
  data () {
    return {
      labelManages: false,
      awaitConfirm: false
    }
  },
  mounted () {
    this.openComponent(name)
  },
  methods: {
    openComponent (name) {
      if (name === '') {
        // this.$router.push({
        //     name: 'businessConfig'
        // })
      } else {
        switch (name) {
          case '1':
            this.$router.push({
              name: 'cloudConfig'
            })
            break
          case '2':
            this.$router.push({
              name: 'labelManage'
            })
            break
          case '3':
            this.$router.push({
              name: 'waitConfirmCon'
            })
            break
        }
      }
    }
  }

}
</script>
