<template>
  <div id="addReward">
    <Button
      :type="addReward.initiationType===2?'primary':'default'"
      @click="addReward.initiationType=2"
      class="btns"
    >个人</Button>
    <Button
      :type="addReward.initiationType===1?'primary':'default'"
      @click="addReward.initiationType=1"
      class="btns"
    >百助</Button>
    <hr style="margin-bottom:30px" />
    <Form
      ref="addRewardForm"
      :model="addReward"
      inline
      label-position="right"
      :label-width="90"
      :rules="addValidate"
    >
      <Row>
        <Col span="10">
          <FormItem label="日期" prop="rewardDate">
            <DatePicker
              :clearable="false"
              style="width:165px"
              format="yyyy-MM-dd"
              @on-change="(v)=>addReward.rewardDate=v"
              v-model="addReward.rewardDate"
              placeholder="日期"
            />
          </FormItem>
        </Col>
        <Col span="10">
          <FormItem prop="initiatorId" label="发起人">
            <Select filterable v-model="addReward.initiatorId" style="width:165px">
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
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row v-for="(item,index) in addReward.rewardUserList" :key="index">
        <Col span="10">
          <FormItem
            label="当事人"
            :prop="'rewardUserList.' + index + '.rewardUserId'"
            :rules="{required: true,type: 'number',message: '当事人不能为空',trigger: 'change'}"
          >
            <Select
              @on-change="getDerictLeader(item.rewardUserId,index)"
              filterable
              v-model="item.rewardUserId"
              style="width:165px"
            >
              <Option
                v-for="person in incumbencyTbUser"
                :value="person.id"
                :key="person.id"
                :label="person.nickname"
                style="width:100%"
              >
                <h3>{{ person.nickname }}</h3>
                <span class="selectDept">部门：{{person.deptName}}</span>
                <span class="selectDept">职位：{{person.positionName}}</span>
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="10">
          <FormItem label="连带人员">
            <Select filterable multiple v-model="item.relatedUserIds" style="width:165px">
              <Option
                v-for="person in incumbencyTbUser"
                :value="person.id"
                :key="person.id"
                :label="person.nickname"
                style="width:100%"
              >
                <h3>{{ person.nickname }}</h3>
                <h4 class="selectDept">部门：{{person.deptName}}</h4>
                <h4 class="selectDept">职位：{{person.positionName}}</h4>
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="2">
          <Button class="square" icon="md-add" @click="addRewardUser" />
        </Col>
        <Col span="2" v-if="index>0">
          <Button class="square" icon="md-remove" @click="removeRewardUser(index)" />
        </Col>
      </Row>
      <Row>
        <Col span="10">
          <FormItem prop="score" label="分数">
            <InputNumber style="width:165px" :step="2" v-model="addReward.score" :precision='0' number></InputNumber>
          </FormItem>
        </Col>
        <Col span="10">
          <FormItem prop="isCore" label="事项性质">
            <Select v-model="addReward.isCore" filterable :clearable="false" style="width:165px">
              <Option
                v-for="person in isCoreList.filter(e=>e.id>=0)"
                :value="person.id"
                :key="person.id"
                :label="person.value"
              ></Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="10">
          <FormItem prop="corporateValue" label="企业价值观">
            <Select v-model="addReward.corporateValue" filterable :clearable="false" style="width:165px">
              <Option
                v-for="person in corporateValueList.filter(e=>e.id>=1)"
                :value="person.id"
                :key="person.id"
                :label="person.value"
              ></Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="10">
          <FormItem  v-if="addReward.corporateValue!=7" prop="corporateValueLevel" label="星级">
            <Select v-model="addReward.corporateValueLevel" :clearable="false" style="width:165px">
              <Option v-for="level in 5" :value="level" :key="level" :label="level"></Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="20">
          <FormItem prop="reason" label="事项">
            <Input style="width:444px" v-model="addReward.reason" />
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<script>
import moment from 'moment'
import { baseUrl } from '@/api/base.js'
import corporate from '../corporate'
export default {
  name: 'addReward',
  props: {
    incumbencyTbUser: {
      type: Array,
      default () {
        return []
      }
    }
  },
  mixins: [corporate],
  data () {
    const validateScore = (rule, value, callback) => {
    //   let pattern = String(value).indexOf('.') + 1
      if (!value || value === 0) {
        return callback(new Error('请输入分值'))
        //   } else if (pattern > 0) {
        //     return callback(new Error('分值不能为小数'))
      } else {
        callback()
      }
    }
    const validateReason = (rule, value, callback) => {
      if (value.trim() === '') {
        return callback(new Error('事项不能为空'))
      } else {
        callback()
      }
    }
    return {
      addReward: {
        rewardDate: moment().format('YYYY-MM-DD'), // 发起日期
        entryUserId: this.$store.state.user.userId, // 录入人id
        initiationType: 2, // 发起类型 1：百助，2：个人
        // 当事人列表
        rewardUserList: [
          {
            rewardUserId: '', // 当事人id
            relatedUserIds: [] // 连带人id
          }
        ],
        isCore: '', // 事项性质是否为核心
        corporateValue: '',
        corporateValueLevel: 1, // 价值观星级
        initiatorId: '', // 发起人id
        score: 0, // 奖惩分值
        reason: '' // 奖惩原因
      },
      // 新增奖惩的表单验证
      addValidate: {
        rewardDate: [
          {
            required: true,
            message: '发起日期不能为空',
            type: 'string',
            trigger: 'change'
          }
        ],
        initiatorId: [
          {
            required: true,
            type: 'number',
            message: '发起人不能为空',
            trigger: 'change'
          }
        ],
        corporateValue: [
          {
            required: true,
            type: 'number',
            message: '企业价值观不能为空',
            trigger: 'change'
          }
        ],
        corporateValueLevel: [
          {
            required: true,
            type: 'number',
            message: '星级不能为空',
            trigger: 'change'
          }
        ],
        score: [
          { validator: validateScore, required: true, type: 'number', trigger: 'change' }
        ],
        isCore: [
          {
            required: true,
            type: 'number',
            message: '事项性质不能为空',
            trigger: 'change'
          }
        ],
        reason: [{ validator: validateReason, required: true, trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取连带人
    getDerictLeader (id, index) {
      let initiatorId = this.addReward.initiatorId
      this.$axios({
        url: baseUrl + '/reward/getDerictLeader',
        method: 'post',
        data: $qs.stringify({ userId: id, initiatorId })
      })
        .then(res => {
          if (res.data.code === 10000) {
            let data = res.data
            let ids = data.content.map(e => {
              return e.id
            })
            this.addReward.rewardUserList[index].relatedUserIds = ids
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 添加当事人
    addRewardUser () {
      this.addReward.rewardUserList.push({
        rewardUserId: '', // 当事人id
        relatedUserIds: [] // 连带人id
      })
    },
    // 减少当事人
    removeRewardUser (i) {
      this.addReward.rewardUserList.splice(i, 1)
    }
  },
  computed: {
    userId () {
      return this.$store.state.user.userId
    }
  }
}
</script>
<style scoped>
.selectDept {
  width: 50%;
  /* display: inline-block; */
}
</style>
