<template>
  <div>
    <Modal
      width="550px"
      :mask-closable="false"
      v-model="show"
      draggable
      title="查看"
      :loading="loading"
      @on-ok="ok"
      @on-cancel="closeModal"
    >
      <Table :columns="tableHeader" :data="dataText" border> </Table>
    </Modal>
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
export default {
  name: 'detailsCollect',
  props: {
    showDetails: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number]
    },
    productCode: {
      type: String
    },
    startdate: {
      type: String
    },
    enddate: {
      type: String
    }
  },
  data () {
    return {
      loading: true,
      sum: {},
      tableHeader: [
        {
          title: '序号',
          type: 'index',
          key: 'index',
          minWidth: 25,
          align: 'center'
        },
        {
          title: '年份',
          key: 'year',
          minWidth: 50,
          align: 'center'
        },
        {
          title: '月份',
          key: 'month',
          minWidth: 50,
          align: 'center'
        },
        {
          title: '本期应收',
          key: 'currentAccounts',
          minWidth: 60,
          align: 'center',
          alwaysShow: true
        },
        {
          title: '本期核增',
          key: 'thisIncreased',
          minWidth: 60,
          align: 'center',
          alwaysShow: true
        },
        {
          title: '本期核减',
          key: 'thissubtract',
          minWidth: 60,
          align: 'center',
          alwaysShow: true
        },
        {
          title: '本期回款',
          key: 'thiscollection',
          minWidth: 60,
          align: 'center',
          alwaysShow: false
        }
      ],
      dataText: []
    }
  },
  mounted () {
    this.detail()
  },
  methods: {
    // 页面数据
    detail () {
      let sendData = {
        id: this.id,
        productCode: this.productCode,
        startdate: this.startdate,
        enddate: this.enddate
      }
      this.$axios({
        url: baseUrl + '/accounting/receiptdetails',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.dataText = res.data.content
        }
      })
    },
    closeModal () {
      this.$emit('update:showDetails', false)
    },
    updataList () {
      this.$emit('updataList')
    },
    ok () {
      this.closeModal()
    }
  },
  computed: {
    show: {
      set () {
        this.$emit('update:showDetails', false)
      },
      get () {
        return this.showDetails
      }
    }
  }
}
</script>
