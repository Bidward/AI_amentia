<template>
  <div>
    <Modal
      title="详情"
      @on-ok="closeModal"
      @on-cancel="closeModal"
      :mask-closable="false"
      v-model="showModal"
    >
      <!-- 项目组查看 -->
      <div v-if="data.children&&data.children.length>0">
        <h3>{{data.deptName}}</h3>
        <div class="row">
          <h4 v-for="(dept,index) in data.children" :key="index">
            <span class="deptName">{{dept.deptName}}：</span>
            <span class="head">{{dept.head}}</span>
          </h4>
        </div>
      </div>
      <!-- 职能查看 -->
      <div v-else>
        <h3>{{data.deptName}}</h3>
        <div class="row">
          <h4>
            <span class="deptName">成员：</span>
            <span class="head">{{data.head}}</span>
          </h4>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'showProject',
  props: {
    data: Object,
    show: Boolean
  },
  data () {
    return {
      showModal: this.show
    }
  },
  methods: {
    closeModal () {
      this.$emit('update:show', false)
    }
  },
  watch: {
    show: {
      handler (newVal) {
        this.showModal = newVal
      },
      immediate: true
    }
  }
}
</script>
<style scoped lang="less">
h3 {
  text-align: center;
}
h4 {
  text-align: center;
  line-height: 1.5;
  .row{
    margin: 20px ;
  }
  .deptName,
  .head {
    width: 50%;
    display: inline-block;
    text-align: center;
  }
  .deptName {
    text-align: right;
  }
  .head {
    text-align: left;
  }
}
</style>
