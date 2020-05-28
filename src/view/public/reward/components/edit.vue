<template>
    <Form
        inline
        :label-width="100"
        label-position="right"
        :model="detail"
        :rules="ruleValidate"
        ref="editForm"
    >
        <Row>
            <Col span="12">
                <FormItem label="日期：">
                    <p class="half">{{detail.rewardTime}}</p>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="类型：">
                    <p class="half">{{detail.initiationDetailed}}</p>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="当事人：">
                    <p class="half">{{detail.nickName}}</p>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="分数：">
                    <p class="half">{{detail.score}}</p>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="连带人员：">
                    <p class="half">{{detail.relateName}}</p>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="发起人：">
                    <p class="half">{{detail.initiatorName}}</p>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="事项性质：" prop="isCore">
                    <Select v-model="detail.isCore" filterable :clearable="false">
                        <Option
                            v-for="person in isCoreList.filter(e=>e.id>=0)"
                            :value="person.id"
                            :key="person.id"
                            :label="person.value"
                        ></Option>
                    </Select>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="奖惩来源：">
                    <p class="half" v-if="detail.rewardSource===1">内部奖惩</p>
                    <p class="half" v-if="detail.rewardSource===2">外部奖惩</p>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="企业价值观：" prop="corporateValue">
                    <Select v-model="detail.corporateValue" filterable :clearable="false">
                        <Option
                            v-for="person in corporateValueList.filter(e=>e.id>=1)"
                            :value="person.id"
                            :key="person.id"
                            :label="person.value"
                        ></Option>
                    </Select>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="星级：" prop="corporateValueLevel">
                    <Select v-model="detail.corporateValueLevel" filterable :clearable="false">
                        <Option v-for="level in 5" :value="level" :key="level" :label="level"></Option>
                    </Select>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <FormItem label="事项：" prop="reason">
                    <Input style="width: 380px" v-model="detail.reason" />
                </FormItem>
            </Col>
        </Row>
    </Form>
</template>
<script>
import { baseUrl } from '@/api/base.js'
import corporate from '../corporate'
export default {
  name: 'detail',
  mixins: [corporate],
  props: {
    rewardEditId: {
      type: [Number, String]
    }
  },
  data () {
    const validateReason = (rule, value, callback) => {
      if (value.trim() === '') {
        return callback(new Error('事项不能为空'))
      } else {
        callback()
      }
    }
    return {
      detail: {},
      ruleValidate: {
        isCore: [
          {
            required: true,
            type: 'number',
            message: '事项性质不能为空',
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
        reason: [
          {
            validator: validateReason,
            required: true,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    rewardEditId (newV, oldV) {
      this.$axios({
        url: baseUrl + '/reward/getDetail',
        method: 'post',
        data: $qs.stringify({ id: newV })
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.detail = res.data.content
          }
        })
        .catch(err => {
          console.log('getDetail', err)
        })
    }
  }
}
</script>
