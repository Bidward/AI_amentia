<!--  -->
<template>
  <div class="select-frequency">
    <div class="time" v-if="type == 1">
      <InputNumber
        class="numInput"
        :max="23"
        :min="0"
        :formatter="timeFormatter"
        type="number"
        :value="hour"
        @on-change="(v) => changeValue(v, type, 'hour')"
      />
        <span style="display: inline-block;">:</span>
      <InputNumber
        class="numInput"
        :max="60"
        :min="0"
        type="number"
        :formatter="timeFormatter"
        :value="minute"
        @on-change="(v) => changeValue(v, type, 'minute')"
      />
    </div>
    <div class="week" v-if="type == 2">
      <InputNumber
        :editable="false"
        class="numInput"
        :max="5"
        :min="0"
        :formatter="weekFormatter"
        :value="week"
        @on-change="(v) => changeValue(v, type, 'week')"
      ></InputNumber>
      <!-- :formatter="weekFormatter" -->
    </div>
    <div class="month" v-if="type == 3">
      <InputNumber
        class="numInput"
        :max="30"
        :min="1"
        :value="date"
        type="number"
        @on-change="(v) => changeValue(v, type, 'month')"
      />日
      <!-- :formatter="(value) => value + '日'" -->
    </div>
    <div class="year" v-if="type == 4">
      <InputNumber
        class="numInput"
        type="number"
        :max="12"
        :min="1"

        :value="month"
        @on-change="(v) => changeValue(v, type, 'month')"
      />月
      <!-- :formatter="timeFormatter" -->
      <InputNumber
        class="numInput"
        type="number"
        :max="30"
        :min="1"
        :value="day"

        @on-change="(v) => changeValue(v, type, 'day')"
      />日
      <!-- :formatter="timeFormatter" -->
    </div>
  </div>
</template>

<script>
import { week } from '@/assets/js/constant'
export default {

  props: {
    type: {
      type: Number,
      default: 1
    },
    value: {
      type: [String, Object],
      default: ''
    },
    index: {
      type: Number,
      default: 0
    }
  },

  methods: {
    weekFormatter (value) {
      return week[value]
    },
    changeValue (value, type, field) {
      if (value === null) {
        value = 0
      }

      this.$emit('change', { value, type, field, index: this.index })
    },
    timeFormatter (value) {
      return value < 10 ? '0' + value : value
    }
  },

  computed: {
    hour () {
      return this.value ? parseInt(this.value.hour) : 9
    },
    minute () {
      return this.value ? parseInt(this.value.minute) : 0
    },
    week () {
      // let index = week.indexOf(this.value.week)
      // return index === -1 ? 0 : index
      return this.value ? this.value.week : 0
    },
    date () {
      let ret = this.value ? parseInt(this.value.month) : 1
      return ret
    },
    month () {
      return this.value ? this.value.month : 1
    },
    day () {
      return this.value ? this.value.day : 1
    }
  },

  watch: {
    value (newVal) {
      // console.log(newVal)
    }
  }
}
</script>

<style lang='less'>
.select-frequency {
  .numInput {
    width: 60px;
    border: none;
    outline-style: none;
    text-align: center;
  }
  .ivu-input-number-input {
    text-align: center;
  }
  .ivu-input-number-handler-wrap {
    border: none;
    background: none;
  }
  .ivu-input-number-handler-down {
    border: none;
  }
  .ivu-input-number-handler-up-inner,
   .ivu-input-number-handler-down-inner {
     top: 4px;
     font-size: 16px;
  }
}
</style>
