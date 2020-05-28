<template>
  <div class="bzCard">
    <div class="header">
      <h3 class="title">{{msg.detailsReadType}}</h3>
      <Icon class="close" @click="handleRead" type="ios-close" size="30"/>
      <Icon
        class="close"
        v-if="overflow"
        @click="showAll?showAll=false:showAll=true"
        :type="showAll?'md-arrow-dropup':'md-arrow-dropdown'"
        size="30"
      />
    </div>
    <div class="content" @click="toList(msg)">
      <!-- <p v-html="msg.detailsContent"></p> -->
      <p class="showDetail" v-if="overflow"></p>
      <p class="text" :class="showAll?'overflow':'unOverflow'">{{msg.detailsContent}}</p>
    </div>
    <div class="footer">
      <h4>{{msg.detailsSendingTime}}</h4>
    </div>
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
import { mapMutations } from 'vuex'
export default {
  name: 'stationCard',
  props: {
    msg: {
      type: Object
    }
  },
  data () {
    return {
      showAll: false,
      overflow: this.msg.detailsContent.length >= 70 // 字数是否超过上限
    }
  },
  mounted () {},
  methods: {
    ...mapMutations(['handleCloseDrawer', 'handleShowDrawer', 'setUnreadNum']),
    toList (row) {
      this.handleCloseDrawer()
      this.$store.state.station.stationData = row
      this.$router.push({
        name: row.detailsRoute,
        query: row.routeType
      })
    },
    handleRead () {
      let id = this.msg.stationId
      let data = [id]
      this.$axios({
        url: baseUrl + '/station/updateIsStatus',
        method: 'post',
        data: data
      })
        .then(res => {
          // 通知抽屉更新
          this.$emit('updateList')
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
<style scoped lang="less">
@green: rgba(49, 179, 153, 1);
@borderColor: rgb(228, 228, 228);
.bzCard {
  position: relative;
  padding: 10px;
  border: 1px solid @borderColor;
  border-radius: 5px;
  margin-bottom: 20px;
  .showDetail {
    float: right;
  }
  .text {
    line
    -height: 1rem;
    height: 3rem;
    width: 100%;
    &.unOverflow {
      overflow: hidden;
    }
    &.overflow {
      overflow: visible;
      height: auto;
    }
    // text-overflow: ellipsis;
    // display: -webkit-box;
    // -webkit-line-clamp: 3; //规定几行显示省略号
    // -webkit-box-orient: vertical;
  }

  .title {
    display: inline;
  }
  .close {
    float: right;
  }
}
</style>
