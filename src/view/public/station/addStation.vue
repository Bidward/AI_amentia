<template>
  <div>
    <Form
      ref="addStation"
      :model="addStation"
      inline
      label-position="right"
      :label-width="100"
      :rules="addStationValidate"
    >
      <FormItem prop="stationReceiver" label="接收人：" class="stationReceiver">
          <div style="width:355px">
              <dept-tree-select @treeSelect="receiver" :optionsProps="incumbencyTbUser" :valueConsistsOf="valueConsistsOf "></dept-tree-select>
          </div>
        <!-- <Select filterable style="width:395px" multiple v-model="addStation.stationReceiver">
          <Option
            v-for="person in incumbencyTbUser"
            :value="person.id"
            :key="person.id"
            :label="person.nickname"
          >
            <h3>{{ person.nickname }}</h3>
            <h4 class="selectDept">部门：{{person.deptName}}</h4>
            <h4 class="selectDept">职位：{{person.positionName}}</h4>
          </Option>
        </Select> -->
      </FormItem>
      <FormItem prop="content" label="内容：">
        <Input
          v-model="addStation.content"
          style="width:355px"
          type="textarea"
          maxlength="500"
          show-word-limit
          :autosize="{minRows: 4}"
          placeholder="输入内容"
        ></Input>
      </FormItem>
      <FormItem label="提醒时间">
        <DatePicker
          v-for="(item,index) in addStation.reminderTimeList"
          :key="index"
          type="datetime"
          v-model="addStation.reminderTimeList[index]"
          style="width: 330px"
          :format="'yyyy-MM-dd HH:mm:ss'"
          @on-change="(v)=>{addStation.reminderTimeList[index]=v}"
        ></DatePicker>
        <Icon class="pointer" @click="addReminderTime" v-if="addStation.reminderTimeList.length<5" type="md-add" size="24" />
        <Icon class="pointer" @click="removeReminderTime" v-if="addStation.reminderTimeList.length>1" type="md-remove" size="24" />
      </FormItem>
    </Form>
  </div>
</template>
<script>
import moment from 'moment'
import deptTreeSelect from '_c/dept-tree-select'
export default {
  name: 'addStation',
  components: { deptTreeSelect },
  props: {
    incumbencyTbUser: {
      type: Array
    }
  },
  data () {
    return {
      addStation: {
        route: 'station',
        stationReceiver: [],
        content: '',
        sendingTime: moment().format('YYYY-MM-DD HH:mm:ss'), // 定时发送时间
        reminderTimeList: [''] // 提醒时间
      },
      valueConsistsOf: 'LEAF_PRIORITY', // 子集优先
      addStationValidate: {
        stationReceiver: [
          {
            required: true,
            type: 'array',
            message: '通知人不能为空',
            trigger: 'change'
          }
        ],
        content: [
          {
            required: true,
            type: 'string',
            message: '内容不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    receiver (receiver) {
      this.addStation.stationReceiver = receiver
    },
    addReminderTime () {
      this.addStation.reminderTimeList.push('')
    },
    removeReminderTime () {
      this.addStation.reminderTimeList.pop()
    }
  }
}
</script>
