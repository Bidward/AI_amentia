<!-- 模板添加 -->
<template>
  <Card
    class="tempCard"
    >
    <div class="cardContent">
      <Icon :type="icon" class="iconPerson"/>
      <h1 style="font-weight: normal; flex: 1">{{name}}</h1>
      <Icon
        v-show="name !== '新增'"
        type="ios-close-circle"
        class="pointer iconAdd"
        style=""
        @click.stop="deleteTag"
      />
    </div>
  </Card>
</template>

<script>
export default {
  components: {},
  props: {
    name: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'md-person-add'
    }
  },

  mounted () {},

  methods: {
    deleteTag () {
      this.$emit('delete')
    }
  }

}
</script>

<style lang='less' scoped>
.tempCard {
  width: 300px;
  display: inline-block;
  cursor: pointer;
  margin: 10px 20px;
  .cardContent {
    display: flex;
    align-items: center;
    position: relative;
    .iconPerson {
      font-size: 70px;
      margin-right: 40px;
    }
    .iconAdd {
      font-size: 20px;
      position: absolute;
      top: 0;
      right: 0
    }
  }
}
</style>
