<template>
  <!-- 编辑事项 -->
  <div class="editDutyDetail">
    <Modal
      title="工作事项"
      :mask-closable="false"
      :loading="loading"
      v-model="showModal"
      width="920"
      @on-ok="saveSubItem"
    >
      <Form
        ref="form"
        :model="subItemData"
        :rules="validateRules"
        :label-width="80"
      >
        <Row class="bottomDistance" style="margin-left: 30px; margin-top: 20px">
          <Col span="11" offset="1">
            <Col span="20">
              <FormItem prop="name" label="工作事项">
                <Input
                  placeholder="工作事项"
                  clearable
                  filterable
                  v-model="subItemData.name"
                />
              </FormItem>
            </Col>
          </Col>
          <Col span="11">
            <Col span="20">
              <FormItem label="频率">
               <Select v-model="rateType">
                  <Option
                    v-for="item in frequency"
                    :value="item.id"
                    :key="item.id"
                  >
                    {{item.name}}
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Col>
        </Row>
        <Row class="bottomDistance" style="margin-left: 30px; margin-top: 10px">
          <Col span="11" offset="1">
            <Col span="20">
              <FormItem prop="startTime" label="开始时间">
                <Input
                  placeholder="开始时间"
                  @on-focus="handleFrequencyFocus"
                  :value="subItemData.startTime"
                  readonly
                />
              </FormItem>
            </Col>
          </Col>
          <Col span="11">
            <Col span="20">
              <FormItem label="工作要求" prop="jobRequire">
                <Input
                  placeholder="工作要求"
                  v-model="subItemData.jobRequire"
                  clearable
                  :autosize="true"
                  type="textarea"
                  class="textarea"
                />
              </FormItem>
            </Col>
          </Col>
        </Row>
        <Row class="bottomDistance" style="margin-left: 30px; ">
          <Col span="11" offset="1">
            <Col span="20">
              <FormItem label="备注">
                <Input
                  placeholder="备注"
                  v-model="subItemData.mark"
                  clearable
                  :autosize="true"
                  type="textarea"
                  class="textarea"
                />
              </FormItem>
            </Col>
          </Col>
          <Col span="11"></Col>
        </Row>
      </Form>
    </Modal>
    <!-- 频率 -->
    <Modal
      title="频率"
      v-model="showFrequencyModal"
      width="420"
      @on-ok="confirmTime"
      @on-cancel="cancelTime"
    >
      <div>
        <div style="display: flex; align-items: center">
          <span>频率：</span>
          <span>{{selected.name}}</span>
        </div>
        <div style="text-align: center">
          <div
            class="timeItem"
            v-for="(item, index) in frequency[rateType -1].value"
            :key="index"
          >
            <span>第{{index + 1}}次</span>
            <span>
              <time-setting
                :type="rateType"
                :value="item"
                :index="index"
                @change="changeValue"
              >
              </time-setting>
            </span>
            <span>
              <Icon
                type="md-trash"
                style="font-size: 16px"
                class="pointer"
                @click="deleteItem(index)"
              />
            </span>
          </div>
          <Button
            type="primary"
            @click="addFrequency"
            style="margin-top: 20px;"
          >增加</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
import { findIndexById, dClone } from '@/assets/js/tools'
import { week } from '@/assets/js/constant'
import { padDate } from '@/assets/js/count-down'
import TimeSetting from './time-setting'
export default {
  name: 'edit-pannel',

  inject: ['app'],

  components: { TimeSetting },

  props: {
    show: {
      type: Boolean,
      default: false
    },
    itemData: {
      type: Object,
      default () {
        return {}
      }
    },
    type: {
      type: Number,
      default: 1
    }
  },

  data () {
    return {
      loading: true,
      showModal: this.show,
      showFrequencyModal: false,
      // 子项数据
      subItemData: this.itemData,
      // 频率类型
      rateType: 1,
      // 频率类型
      frequency: [
        {
          id: 1,
          name: '每日',
          value: []
        },
        {
          id: 2,
          name: '每周',
          value: []
        },
        {
          id: 3,
          name: '每月',
          value: []
        },
        {
          id: 4,
          name: '每年',
          value: []
        }
      ],
      // 发表单验证规则
      validateRules: {
        name: [
          {
            required: true,
            message: '请填写工作事项',
            type: 'string',
            trigger: 'blur'
          }
        ],
        rateType: [
          {
            required: false,
            message: '请选择频率',
            trigger: 'change'

          }
        ],
        startTime: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.subItemData.name) {
                if (!value) {
                  callback(new Error('请选择开始时间！！！'))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            }
          }
        ],
        jobRequire: [
          {
            required: true,
            type: 'string',
            message: '请填写工作要求',
            trigger: 'blur'
          }
        ]
      }
    }
  },

  methods: {
    // 显示弹框
    showTaskForm () {
      this.showModal = true
    },
    // 字符串该时间
    stringToArray (str) {
      let strArr = str.split(',')
      let array
      switch (this.rateType) {
        case 1:
          array = strArr.map(item => {
            let t = item.split(':')
            return { hour: parseInt(t[0]), minute: parseInt(t[1]) }
          })
          break
        case 2:
          array = strArr.map(item => {
            let index = week.indexOf(item)
            return { week: index }
          })
          break
        case 3:
          array = strArr.map(item => {
            // console.log(item, 'item')
            return { month: parseInt(item) }
          })
          break
        case 4:
          array = strArr.map(item => {
            let t = item.split('月')
            return { month: parseInt(t[0]), day: parseInt(t[1]) }
          })
          break
      }
      this.$set(this.frequency[this.rateType - 1], 'value', array)
    },
    // 数组转字符串
    arrayToString (arr) {
      // console.log(arr)
      let str
      switch (this.rateType) {
        case 1:
          str = arr.map(item => padDate(item.hour) + ':' + padDate(item.minute)).join(',')
          break
        case 2:
          str = arr.map(item => week[item.week]).join(',')
          break
        case 3:
          str = arr.map(item => padDate(item.month) + '日').join(',')
          break
        case 4:
          str = arr.map(item => padDate(item.month) + '月' + padDate(item.day) + '日').join(',')
      }
      return str
    },
    // 频率输入框
    handleFrequencyFocus () {
      this.showFrequencyModal = true
    },
    // 增加频率
    addFrequency () {
      let item = null
      switch (this.rateType) {
        case 1:
          item = { hour: 9, minute: 0 }
          break
        case 2:
          item = { week: 0 }
          break
        case 3:
          item = { month: 1 }
          break
        case 4:
          item = { month: 1, day: 1 }
      }
      this.frequency[this.rateType - 1].value.push(item)
    },
    // 删除频率
    deleteItem (index) {
      this.frequency[this.rateType - 1].value.splice(index, 1)
    },
    // 修改频率中的时间
    changeValue (obj) {
      console.log(obj)
      let { value, field, index } = obj

      this.frequency[this.rateType - 1].value[index][field] = value
      // this.$set(this.frequency[this.rateType - 1].value[index], field, value)
    },
    // 确认时间设置
    confirmTime () {
      this.$set(this.subItemData,
        'startTime',
        this.arrayToString(this.frequency[this.rateType - 1].value))
      // log(this.subItemData, 'log')
    },
    cancelTime () {
      this.$set(this.frequency[this.rateType - 1], 'value', this.initFrequency)
    },

    // 保存子项
    saveSubItem () {
      let form = this.$refs.form
      // 入参
      // let a = {
      //    "jobRequire": "每年1/7月第一工作日1223",
      //     "twoTagName": "定岗定编定制",
      //     "mark": "特别",
      //     "type": 3,
      //     "rateContent": "每月一次",
      //     "startTime": "15日,14日",
      //     "oneTagId":2,
      //     "id":50008
      // }
      let { name, jobRequire, mark, startTime, oneTagId, id, isAddSub, type } = this.subItemData
      let params = {
        id: isAddSub ? 0 : id,
        jobRequire,
        mark,
        startTime,
        oneTagId,
        type,
        rateType: this.rateType,
        twoTagName: name
      }
      form.validate(v => {
        if (v) {
          this.loading = true
          this.$axios({
            url: baseUrl + '/station/updatePublicTwoTag',
            method: 'post',
            data: params
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.showModal = false
                this.$Message.success(res.data.msg)
                this.$emit('update')
              } else {
                this.$Message.error(res.data.msg)
                this.keep()
              }
            })
            .catch(err => {
              console.log(err)
              this.keep()
            })
        } else {
          this.keep()
        }
      })
    },
    // modal点击确认不关闭
    keep () {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    }
  },

  watch: {
    show (newVal) {
      if (newVal) {
        this.showModal = newVal
      }
    },
    showModal (newVal) {
      if (!newVal) {
        this.$emit('hide')
        this.subItemData = {}
      }
    },
    // 频率选择弹窗
    showFrequencyModal (newVal) {
      if (newVal) {
        // 频率选择框弹出时拷贝一份当前设置的时间
        this.initFrequency = dClone(this.frequency[this.rateType - 1].value)
        // 如果是新增子项
        if (!this.subItemData.startTime && this.subItemData.isAddSub) {
          // 因为默认选中每天，如果不清除每天中的value，点开频率弹窗会有值
          this.$set(this.frequency[0], 'value', [])
        }
      }
    },
    itemData (newVal) {
      // console.log('newVal', newVal)
      this.subItemData = newVal
      this.rateType = newVal.rateType
      // 记录初始频率
      this.initrateType = newVal.rateType
      // 记录初始时间
      this.initStartTime = newVal.startTime
      if (newVal.startTime) {
        this.stringToArray(newVal.startTime)
      }
    },
    // 频率类型发生变化
    rateType (newVal, old) {
      if (newVal === this.initrateType) {
        this.$set(this.subItemData, 'startTime', this.initStartTime)
      } else {
        this.$set(this.subItemData, 'startTime', '')
        this.frequency[this.rateType - 1].value = []
      }
    }
  },

  computed: {
    // 选择的频率是天/周/月等
    selected () {
      let index = findIndexById(this.rateType, this.frequency)
      return this.frequency[index]
    }
  }
}
</script>

<style lang="less" scoped>
.timeItem {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
}
</style>
