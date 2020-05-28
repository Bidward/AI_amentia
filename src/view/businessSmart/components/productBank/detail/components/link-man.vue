<template>
<div>
  <Row>
    <Col span="16" offset="3" >
      <Table :columns="linkManHead" :data="linkManTab" border></Table>
    </Col>
  </Row>
</div>

</template>
<script>
export default {
  props: {
    contractData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      linkManHead: [
        {
          title: '联系人',
          key: 'contactName',
          align: 'center'
        }, {
          title: '联系电话',
          key: 'contactNumber',
          align: 'center'
        }, {
          title: 'QQ',
          key: 'contactQq',
          align: 'center'
        }, {
          title: '微信',
          key: 'contactWechat',
          align: 'center'
        }, {
          title: '邮箱',
          key: 'contactEmail',
          align: 'center'
        }, {
          title: '公司职位',
          key: 'contactPosition',
          align: 'center'
        }
      ], // 联系人表头
      linkManTab: []
    }
  },
  watch: {
    contractData (newData) {
      if (newData) {
        this.linkManTab = newData
      }
    }
  }
}
</script>
