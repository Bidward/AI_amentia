<template>
  <div class="viewWrapper" style="overflow: auto; padding: 20px;" :class="isFullScreen ? 'fullScreen' : ''">
      <Policy class="top"/>
      <ProjectInfo class="bottom" projectInfoType="detail"/>
  </div>
</template>

<script>
import Policy from './component/policy'
import ProjectInfo from './component/project-info'
export default {
  name: 'editProject',
  components: { Policy, ProjectInfo },
  computed: {
    isFullScreen () {
      return this.$store.state.app.isTaskListFullScreen
    }
  }
}
</script>

<style lang="less" scoped>
  .top{
    position: relative;
  }
  .bottom{
    border: 5px solid #F6F6F6;
    border-left : 10px solid rgba(240, 240, 240, 0.5);
    border-right : 10px solid #F6F6F6;
    border-radius: 5px;
    position: relative;
    top: -100px;
    width: 85%;
    margin: auto;
  }

</style>
