<template>
  <div>
    <Modal
      :mask-closable="false"
      v-model="show"
      title="查看"
      :loading="loading"
      @on-ok="closeModal"
      @on-cancel="closeModal"
    >
      <Table
        :columns="tableHeader"
        :data="dataText"
        border
        show-summary
        :summary-method="handleSummary"
      >
        <template slot-scope="{ row, index }" slot="actualAmount">
          <InputNumber :min="0"  :max="99999999999" v-model="actualAmount" v-if="editIndex === index" />
          <span v-else>{{ row.actualAmount }}</span>
          <span>/{{ row.invoiceAmount }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <div v-if="editIndex === index">
            <Button
              v-if="!isNewAdd"
              size="small"
              @click="handleSave(row, index)"
              >保存</Button
            >
            <Button v-if="!isNewAdd" size="small" @click="editIndex = -1"
              >取消</Button
            >
          </div>
          <div v-else>
            <Button
              id="edit"
              size="small"
              type="primary"
              @click="handleEdit(row, index)"
              >编辑</Button
            >
          </div>
        </template>
      </Table>
    </Modal>
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
export default {
  name: 'detailsReceipt',
  props: {
    showDetails: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number]
    }
  },
  data () {
    return {
      loading: true,
      isNewAdd: false,
      actualAmount: null,
      editIndex: -1,
      sum: {},
      tableHeader: [
        {
          title: '序号',
          type: 'index',
          key: 'index',
          Width: 30,
          align: 'center'
        },
        {
          title: '产品编码',
          key: 'productCode',
          minWidth: 130,
          align: 'center'
        },
        {
          title: '金额',
          key: 'payStauts',
          slot: 'actualAmount',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          minWidth: 80,
          slot: 'action',
          align: 'center'
        }
      ],
      dataText: []
    }
  },
  mounted () {
    this.detail()
  },
  methods: {
    detail () {
      this.$axios({
        url: baseUrl + '/accounting/getdetails',
        method: 'post',
        data: $qs.stringify({ id: this.id })
      }).then(res => {
        if (res.data.code === 10000) {
          this.dataText = res.data.content.listFinancaials
          let totalSum = res.data.content.totalFinalAmount // 结余
          let sum = {
            index: '',
            productCode: { key: 'productCode', value: '结余' },
            payStauts: { key: 'payStauts', value: totalSum },
            action: ''
          }
          this.sum = sum
        }
      })
    },
    closeModal () {
      this.$emit('update:showDetails', false)
    },
    updataList () {
      this.$emit('updataList')
    },
    // 结余
    handleSummary () {
      return this.sum
    },
    // 编辑
    handleEdit (row, index) {
      this.isNewAdd = false
      this.actualAmount = row.actualAmount
      this.editIndex = index
    },
    // 编辑保存
    handleSave (row, index) {
      this.dataText[index].name = this.actualAmount
      this.editIndex = -1
      let sendData = {
        id: row.id,
        actualAmount: this.actualAmount,
        rid: this.id
      }
      this.$axios({
        url: baseUrl + '/accounting/uptreceipt',
        data: $qs.stringify(sendData),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.$Message.success(resp.data.msg)
            this.detail()
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
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
