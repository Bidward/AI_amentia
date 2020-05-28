<!-- 添加部门模板 -->
<template>
  <add-template
    :post-api="postApi"
    :del-api="delApi"
    :route-name="routeName"
    :cards="cards"
    :type="type"
    @update="update"
  >
  </add-template>
</template>

<script>
import AddTemplate from '../components/add-template.vue'
import { baseUrl } from '@/api/base'

export default {
  name: 'addDept',
  components: { AddTemplate },
  data () {
    return {
      postApi: '/station/insertJobCategory',
      getApi: '/station/getJobCategory',
      delApi: '/station/delJobCategory',
      routeName: 'privateDuty',
      type: 2,
      cards: []
    }
  },
  created () {
    this.getTags()
  },
  methods: {
    getTags () {
      this.$axios({
        url: baseUrl + this.getApi,
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.cards = res.data.content.pageContent
          }
        })
    },
    update (type) {
      // console.log('add-dept', type)
      this.getTags()
    }
  }
}
</script>

<style lang='less' scoped>
</style>
