<template>
  <div class="viewWrapper">
    <Tabs value="name1" style="margin:1% 0;">
        <TabPane label="信息录入" name="name1">
          <InputInfo
            v-if="showType === 'edit'"
            :loading="loading"
            @on-save="stopSave"
          />
          <DetailInfo v-if="showType === 'detail'" />
        </TabPane>
        <TabPane label="关联项目" disabled name="name2">待开发</TabPane>
        <TabPane label="匹配详情" disabled name="name3">待开发</TabPane>
    </Tabs>
    <Card style="position: fixed; bottom: 40px; left: 50%">
      <Button @click="goBack">返回</Button>
      <Button
        v-if="showType === 'edit'"
        :loading="loading"
        @click="save"
        type="primary"
      >保存</Button>
    </Card>
  </div>
</template>

<script>
import InputInfo from './inputInfo'
import DetailInfo from './detailInfo'
export default {
  props: {
    projectInfoType: {
      type: String,
      default: () => 'edit'
    }
  },
  name: '',
  components: { InputInfo, DetailInfo },
  data () {
    return {
      showType: '',
      loading: false
    }
  },
  methods: {
    save () {
      this.loading = true
    },
    stopSave () {
      this.loading = false
    },
    // 返回
    goBack () {
      if (this.showType === 'detail') {
        bus.$emit('on-myclose', this.$route)
        this.$router.push({
          name: 'projectBank'
        })
      } else {
        const title = '提示'
        const content = '<p>记得保存后再返回哦~</p>'
        this.$Modal.confirm({
          title: title,
          content: content,
          okText: '去保存',
          cancelText: '返回',
          onCancel: () => {
            bus.$emit('on-myclose', this.$route)
            this.$router.push({
              name: 'projectBank'
            })
          }
        })
      }
    }
  },
  watch: {
    projectInfoType: {
      handler (v) {
        this.showType = v
      },
      immediate: true
    }
  }
}
</script>
