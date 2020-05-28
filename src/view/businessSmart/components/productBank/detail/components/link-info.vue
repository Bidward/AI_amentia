<template>
  <div class="detailContent">
    <Row  class="rowPadding">
      <Col span="16" offset="3">
        <Table border :columns="columns" :data="linkInfoData">
          <template slot-scope="{ row, index }" slot="action" >
            <Button type="primary"  size="small" style="margin-right: 5px" @click="edit(row,index)">编辑</Button>
            <!-- <Button type="primary"  size="small" style="margin-right: 5px" @click="edit(row,index)">启用</Button> -->
            <Button type="error"  size="small" style="margin-right: 5px" @click="deleteRow(row,index)">删除</Button>
          </template>
        </Table>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  props: {
    linkInfos: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      linkInfoHeader: [{
        title: '序号',
        type: 'index',
        key: 'Num',
        align: 'center'
      }, {
        title: '链接名称',
        key: 'linkName',
        align: 'center'
      }, {
        title: '产品链接',
        key: 'productLink',
        align: 'center'
      }, {
        title: '后台类型',
        key: 'backgroundType',
        align: 'center'
      }, {
        title: '网址/群名',
        key: 'groupName',
        align: 'center'
      }, {
        title: '账号',
        key: 'account',
        align: 'center'
      }, {
        title: '密码',
        key: 'password',
        align: 'center'
      }, {
        title: '渠道',
        key: 'channel',
        align: 'center'
      }, {
        title: '操作',
        slot: 'action',
        width: 160,
        align: 'center'
      }], // 表头
      linkInfoData: [], // 表格内容,
      routeName: this.$route.name
    }
  },
  mounted () {
    console.log(this.$route, 'route')
  },
  watch: {
    linkInfos (newData) {
      if (newData) {
        this.linkInfoData = newData
      }
    }
  },
  computed: {
    columns () {
      if (this.routeName === 'detailProducts') {
        return this.linkInfoHeader.slice(0, this.linkInfoHeader.length - 1)
      } else {
        return this.linkInfoHeader
      }
    }
  }
}
</script>
<style lang="less" scoped>
.info{
  color: #ccc;
  margin-left: 20px;
}
.addContract{
  color:#19aa8d;
  cursor: pointer;
  margin-bottom: 5px;
}
</style>
