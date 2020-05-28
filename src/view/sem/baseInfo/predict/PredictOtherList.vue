<template>
  <div class="viewWrapperNoTabs noMargin">
    <Form
      ref="form"
      :modal="data"
      :label-width="150"
      label-position="right"
      :rules="rules"
      :model="data"
    >
      <div class="selection">
        <h3>配置</h3>
        <Row type="flex" justify="center">
          <Col span="8">
            <FormItem label="360导航cpm">
              <span>{{data.profit360DH}}</span>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="人工配置cpm">
              <Input :disabled="disabled" v-model="data.profitSelf360DH" />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="配置生效日期" prop="profitSelf360DHTime">
              <DatePicker :disabled="disabled" v-model="data.profitSelf360DHTime" type="daterange" />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span="8">
            <FormItem label="百度导航cpm">
              <span>{{data.profitBaiduDH}}</span>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="人工配置cpm">
              <Input :disabled="disabled" v-model="data.profitSelfBaiduDH" />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="配置生效日期" prop="profitSelfBaiduDHTime">
              <DatePicker
                :disabled="disabled"
                v-model="data.profitSelfBaiduDHTime"
                type="daterange"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span="8">
            <FormItem label="搜狗导航cpm">
              <span>{{data.profitSogouDH}}</span>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="人工配置cpm">
              <Input :disabled="disabled" v-model="data.profitSelfSogouDH" />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="配置生效日期" prop="profitSelfSogouDHTime">
              <DatePicker
                :disabled="disabled"
                v-model="data.profitSelfSogouDHTime"
                type="daterange"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span="8">
            <FormItem label="360其他收益cpm">
              <span>{{data.profit360Other}}</span>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="人工配置cpm">
              <Input :disabled="disabled" v-model="data.profitSelf360Other" />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="配置生效日期" prop="profitSelf360OtherTime">
              <DatePicker
                :disabled="disabled"
                v-model="data.profitSelf360OtherTime"
                type="daterange"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span="8">
            <FormItem label="百度其他收益cpm">
              <span>{{data.profitBaiduOther}}</span>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="人工配置cpm">
              <Input :disabled="disabled" v-model="data.profitSelfBaiduOther" />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="配置生效日期" prop="profitSelfBaiduOtherTime">
              <DatePicker
                :disabled="disabled"
                v-model="data.profitSelfBaiduOtherTime"
                type="daterange"
              />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span="8">
            <FormItem label="搜狗其他收益cpm">
              <span>{{data.profitSogouOther}}</span>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="人工配置cpm">
              <Input :disabled="disabled" v-model="data.profitSelfSogouOther" />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="配置生效日期" prop="profitSelfSogouOtherTime">
              <DatePicker
                :disabled="disabled"
                v-model="data.profitSelfSogouOtherTime"
                type="daterange"
              />
            </FormItem>
          </Col>
        </Row>
      </div>
    </Form>
    <div style="text-align:center">
      <Button
        class="btns"
        v-if="permission.update&&disabled"
        type="primary"
        @click="disabled=false"
      >编辑</Button>
      <Button class="btns" v-if="permission.update&&!disabled" type="primary" @click="save">保存</Button>
      <Button class="btns" v-if="permission.update&&!disabled" type="primary" @click="cancel">取消</Button>
    </div>
  </div>
</template>

<script>
import { semUrl } from '@/api/base.js'
import moment from 'moment'
import { valiteDateArr, semPermissionMixin } from '../../tools'
const DateValiteObj = {
  required: true,
  msg: '日期必填',
  type: 'array',
  validator: valiteDateArr
}
export default {
  name: 'PredictOtherList',
  mixins: [semPermissionMixin],
  data () {
    return {
      disabled: true,
      databak: '',
      data: {
        profit360DH: '', // 360导航cpm
        profitSelf360DH: '', // 360导航收益
        profitSelf360DHTime: [], // 360导航时间
        profitBaiduDH: '', // 百度导航cpm
        profitSelfBaiduDH: '', // 百度导航收益
        profitSelfBaiduDHTime: [], // 百度导航时间
        profitSelfSogouDH: '', // 搜过导航收益
        profitSelfSogouDHTime: [], // 搜过导航时间

        profit360Other: '', // 360其他cpm
        profitSelf360Other: '', // 360其他
        profitSelf360OtherTime: [], // 360其他收益
        profitBaiduOther: '', // 百度其他cpm
        profitSelfBaiduOther: '', // 百度其他
        profitSelfBaiduOtherTime: [], // 百度其他收益
        profitSogouOther: '', // 搜狗其他cpm
        profitSelfSogouOther: '', // 搜狗其他
        profitSelfSogouOtherTime: [] // 搜狗其他收益
      },
      rules: {
        profitSelf360DHTime: [DateValiteObj],
        profitSelfBaiduDHTime: [DateValiteObj],
        profitSelfSogouDHTime: [DateValiteObj],
        profitSelf360OtherTime: [DateValiteObj],
        profitSelfBaiduOtherTime: [DateValiteObj],
        profitSelfSogouOtherTime: [DateValiteObj]
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 从营销配置拿来的配置
    getData () {
      this.$axios({
        url: semUrl + '/Market/getMarketConfig'
      }).then(res => {
        if (res.data.code === 10000) {
          let currentData = {}
          const data = res.data.data
          for (let key in data) {
            // 预估收益配置的配置项字段
            if (key.startsWith('profit')) {
              //
              if (key.endsWith('Start') || key.endsWith('End')) {
                let newKey = key.replace('Start', '') // 代表日期的字段
                // 将profitSelf360DHStart和profitSelf360DHEnd放到一个数组，
                // currentData[profitSelf360DHTime] = [profitSelf360DHStart,profitSelf360DHEnd]
                currentData[newKey + 'Time'] = [
                  data[newKey + 'Start'],
                  data[newKey + 'End']
                ]
              } else {
                // 其他的一些数字
                currentData[key] = data[key]
              }
            }
          }
          console.log(currentData)
          this.data = currentData
          this.databak = JSON.stringify(currentData)
        }
      })
    },
    // 保存按钮
    save () {
      this.$refs.form.validate(v => {
        if (!v) {
          this.$Message.error('格式错误')
          return false
        } else {
          let sendData = {}
          let keys = Object.keys(this.data)
          keys.forEach(key => {
            // 剔除cpm字段
            if (key.startsWith('profitSelf')) {
              // 将前端的profitSelf360DHTime数组，拆分成
              // profitSelf360DHStart,profitSelf360DHEnd，并格式化
              if (key.endsWith('Time')) {
                let newKey0 = key.replace('Time', 'Start')
                let newKey1 = key.replace('Time', 'End')
                sendData[newKey0] = moment(this.data[key][0]).format(
                  'YYYY-MM-DD'
                )
                sendData[newKey1] = moment(this.data[key][1]).format(
                  'YYYY-MM-DD'
                )
              } else {
                sendData[key] = this.data[key]
              }
            } else {
              // cpm类型的字段
            }
          })
          this.$axios({
            url: semUrl + '/Deploy/uptDhProfit',
            method: 'post',
            data: $qs.stringify(sendData)
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.disabled = true
              this.getData()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    cancel () {
      this.data = JSON.parse(this.databak)
      this.disabled = true
    }
  }
}
</script>
