
<template>
  <div style="margin: 10px 0 0">
    <tree-table-vxe :data="tableData"></tree-table-vxe>
    <div class="level-three"></div>
  </div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
import TreeTableVxe from '../tree-table-vxe.vue'
export default {
  name: 'generalMine',
  components: { TreeTableVxe },
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.getTreeTable()
  },
  methods: {
    getTreeTable () {
      this.$axios({
        url: baseUrl + '/station/selectMyTag',
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.tableData = res.data.content.children
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
