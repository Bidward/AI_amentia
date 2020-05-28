<template>
  <div>
    <Modal
      v-model="showModal"
      :title="typeName"
      :loading="loading"
      @on-ok="handleOk"
      :mask-closable="false"
      @on-cancel="handleCancel"
    >
      <Form ref="form" :label-width="100" label-position="right" :model="data" :rules="validate">
        <FormItem label="产品编码">
          <span>{{data.softCode}}</span>
        </FormItem>
        <FormItem label="类型">
          <span>{{typeName}}</span>
        </FormItem>
        <FormItem label="cpm(安装)">
          <span>{{data.softPriceAuto}}</span>
        </FormItem>
        <FormItem label="人工配置cpm">
          <Input v-model="data.softPriceSelf" class="wd200px" />
        </FormItem>
        <FormItem label="配置生效日期" prop="expireTime">
          <DatePicker v-model="data.expireTime" type="daterange" class="wd200px" />
        </FormItem>
        <FormItem label="备注">
          <Input v-model="data.sum" class="wd200px" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { semUrl } from '@/api/base.js'
import moment from 'moment'
import { valiteDateArr } from '../../tools'
export default {
  name: 'predictEdit',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    propData: {
      type: Object
    }
  },
  mounted () {
    let {
      softCode,
      softType,
      softPriceAuto,
      softPriceSelf,
      sum,
      expireStartTime,
      expireEndTime
    } = this.propData
    this.data = {
      softCode,
      softType,
      softPriceAuto,
      softPriceSelf,
      expireTime: [expireStartTime, expireEndTime],
      sum
    }
  },
  data () {
    return {
      validate: {
        expireTime: [
          {
            required: true,
            msg: '必填',
            type: 'array',
            validator: valiteDateArr
          }
        ]
      },
      loading: true,
      data: {
        softCode: '',
        softType: '',
        softPriceAuto: '',
        softPriceSelf: '',
        expireTime: [
          moment().format('YYYY-MM-DD'),
          moment().format('YYYY-MM-DD')
        ],
        sum: ''
      }
    }
  },
  methods: {
    handleOk () {
      this.$refs.form.validate(v => {
        if (!v) {
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
          return false
        }
        let sendData = JSON.parse(JSON.stringify(this.data))
        sendData.expireStartTime = moment(sendData.expireTime[0]).format(
          'YYYY-MM-DD'
        )
        sendData.expireEndTime = moment(sendData.expireTime[1]).format(
          'YYYY-MM-DD'
        )
        delete sendData.expireTime
        this.$axios({
          url: semUrl + '/Deploy/uptSoftProfit',
          data: $qs.stringify(sendData),
          method: 'post'
        }).then(res => {
          if (res.data.code === 10000) {
            this.$emit('on-success', true)
            this.$Message.success(res.data.msg)
            this.showModal = false
          } else {
            this.$Message.error(res.data.msg)
          }
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
        })
      })
    },
    handleCancel () {
      this.showModal = false
    }
  },
  computed: {
    showModal: {
      get () {
        return this.show
      },
      set (newVal) {
        this.$emit('update:show', newVal)
      }
    },
    typeName () {
      return this.propData.softType === '1' ? '推广软件' : '换包软件'
    }
  }
}
</script>

<style scoped>
.wd200px {
  width: 200px;
}
</style>
