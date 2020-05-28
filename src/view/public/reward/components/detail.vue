<template>
<div>
  <Form inline :label-width="100" label-position="right" :model="detail">
    <Row>
      <Col span="12">
        <FormItem label="日期：">
          <p>{{detail.rewardTime}}</p>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="类型：">
          <p>{{detail.initiationDetailed}}</p>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="当事人：">
          <p>{{detail.nickName}}</p>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="分数：">
          <p>{{detail.score}}</p>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="连带人员：">
          <p>{{detail.relateName}}</p>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="发起人：">
          <p>{{detail.initiatorName}}</p>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="事项性质：">
          <p>{{detail.isCoreName}}</p>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="企业价值观：">
          <!-- <p>{{detail.corporateValueName}}</p> -->
          <p>{{detail.value}}</p>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem label="奖惩来源：">
          <p v-if="detail.rewardSource===1">内部奖惩</p>
          <p v-if="detail.rewardSource===2">外部奖惩</p>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <FormItem label="事项：">
          {{detail.reason}}
        </FormItem>
      </Col>
    </Row>
  </Form>

</div>
</template>
<script>
export default {
  name: 'detail',
  props: {
    detail: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
