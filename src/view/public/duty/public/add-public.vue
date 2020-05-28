<!-- 模板添加 -->
<template>
  <add-template
    :title="title"
    :post-api="postApi"
    :get-api="getApi"
    :del-api="delApi"
    :route-name="routeName"
    :cards="cards"
    :type="type"
    :template-data="templateData"
    @update="update"
  ></add-template>
</template>

<script>
import AddTemplate from '../components/add-template'
import { baseUrl } from '@/api/base'

export default {
  name: 'addPublic',
  components: { AddTemplate },
  data () {
    return {
      postApi: '/station/insertPublicCategory',
      getApi: '/station/getPublicCategory',
      delApi: '/station/delPublicCategory',
      routeName: 'publicDuty',
      commonTemplate: {},
      title: '',
      type: 1,
      cards: [],
      templateData: []
    }
  },
  created () {
    this.getTags()
  },
  methods: {
    getTags () {
      this.$axios({
        url: baseUrl + this.getApi,
        method: 'post'
      })
        .then(res => {
          console.log(res)
          if (res.data.code === 10000) {
            // this.cards = res.data.content.stationPublicCategory
            // this.commonTemplate = res.data.content.stationPublicCategorySingle
            // this.title = res.data.content.name
            this.templateData = res.data.content
            console.log(this.templateData)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    update (type) {
      if (this.type === type) {
        this.getTags()
      }
    }
  }
}
</script>

<style lang='less' scoped>

</style>
