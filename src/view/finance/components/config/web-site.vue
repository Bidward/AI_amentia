<template>
  <div class="viewWrapper" style="padding:20px">
    <div class="main">
      <Card
        style="width:320px;cursor:pointer;margin-bottom:10px"
        v-for="tab in setList"
        :key="tab.id"
        :class="currentSet === tab.name ? 'active' : ''"
        @click.native="currentSet = tab.name"
      >
        <div style="text-align:center">
          <h3>{{ tab.title }}</h3>
        </div>
      </Card>
    </div>
    <component :is="currentSet"></component>
  </div>
</template>
<script>
import siteSet from './siteSet'
import dayCostSet from './dayCostSet'
import { Track } from '@/libs/track'
const track = new Track('财务运营中心/业务配置/站点配置')
export default {
  name: 'webSite',
  components: {
    siteSet,
    dayCostSet
  },
  data () {
    return {
      currentSet: 'siteSet',
      setList: [
        {
          id: 1,
          title: '日成本跟踪表',
          name: 'dayCostSet'
        },
        {
          id: 2,
          title: '站点成本表',
          name: 'siteSet'
        }
      ]
    }
  },
  beforeCreate () {
    track.start()
  },
  mounted () {
    this.$nextTick(() => {
      track.end()
    })
  },
  methods: {}
}
</script>
<style scoped>
.main {
  float: left;
  padding: 0 20px;
  border-right: 1px solid #dcdee2;
  margin-right: 20px;
}
.active {
  background: #19aa8d;
  color: white;
  border-color: #19aa8d;
}
</style>
