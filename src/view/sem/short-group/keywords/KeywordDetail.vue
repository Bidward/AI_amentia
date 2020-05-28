<template>
  <Form :label-width="80">
    <FormItem class="mb10px" label="账户名称:">{{data.accountName}}</FormItem>
    <FormItem class="mb10px" label="推广计划:">{{data.campaignName}}</FormItem>
    <FormItem class="mb10px" label="责任人:">{{data.owner}}</FormItem>
    <FormItem class="mb10px" label="产品名:">{{data.softName}}</FormItem>
    <FormItem class="mb10px" label="推广组:">{{data.groupName}}</FormItem>
    <FormItem class="mb10px" label="关键词:">{{data.keyword}}</FormItem>
    <FormItem class="mb10px" label="链接网址:">{{data.semUrl}}</FormItem>
    <FormItem class="mb10px" label="状态:">{{data.status}}</FormItem>
    <FormItem class="mb10px" label="备注:">{{data.sum}}</FormItem>
  </Form>
</template>

<script>
export default {
  name: 'shortKeywordDetail',
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          accountName: '',
          campaignName: '',
          owner: '',
          softName: '',
          groupName: '',
          keyword: '',
          status: '',
          semUrl: '',
          sum: ''
        }
      }
    }
  }
}
</script>

<style>
.mb10px{
  margin-bottom:10px;
}
</style>
