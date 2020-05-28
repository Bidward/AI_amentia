<template>
    <div class="top">
        <Row class="rowPadding">
            <Col
                offset="3"
                span="19"
                class="info m-content overflow-line Pop-Over"
                v-html="info"
                ref="getheight"
                :class="{isMore:handelShow}"
            ></Col>
            <Col
                span="2"
                offset="11"
                @click.native="showAll"
                style="cursor:pointer;color: #99a6a8;padding: 15px 0;"
                v-if="isShowMore"
            >
                    <span>{{moreTitle}}</span>
                    <Icon  :type="iconType" />
            </Col>
        </Row>
        <Row>
            <Col span="2" offset="1" class="title">附件下载：</Col>
        </Row>
        <Row style="padding-bottom:10%;">
            <Col offset="3">
                <a
                    class="fileTop"
                    v-for="(item,index) in attachmentBack"
                    :key="index"
                    :href="item.url"
                    :download="item.name"
                >{{item.name}}</a>
            </Col>
        </Row>
    </div>
</template>

<script>
export default {
  name: 'infoPolicy',
  props: {
    describe: {
      type: String,
      default: () => ''
    },
    attachmentList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isShowMore: false,
      info: '', // 描述
      attachmentBack: [], // 附件
      domHeight: '',
      moreTitle: '',
      handelShow: false,
      iconType: ''
    }
  },
  watch: {
    describe: {
      handler (val) {
        this.info = val
        this.showInfo()
      }
    },
    attachmentList: {
      handler (val) {
        this.attachmentBack = val
      }
    }
  },
  methods: {
    // 点击展示更多
    showAll () {
      this.handelShow = !this.handelShow
      this.moreTitle = this.handelShow ? '展开显示更多' : '收起'
      this.iconType = this.handelShow ? 'ios-arrow-down' : 'ios-arrow-up'
    },
    // 判断高度，显示展示
    showInfo () {
      this.$nextTick(() => {
        let domHeight = this.$refs.getheight.$el.offsetHeight
        if (domHeight >= '250') {
          // 初始化
          this.isShowMore = true
          this.handelShow = true
          this.moreTitle = '展开显示更多'
          this.iconType = 'ios-arrow-down'
        }
      })
    },
    handelCss () {
      // $('p').css({'margin-bottom':'6%'})
    }
  }
}
</script>

<style lang="less" scoped>
.top {
    margin: 2% 0 0 2%;
    border: 3px solid #42b9a2;
    border-radius: 10px;
    width: 96%;
    .rowPadding {
        padding: 2% 0 1% 0;
    }
    .title {
        font-size: 14px;
        line-height: 32px;
        text-align: right;
    }
    .info {
        font-size: 14px;
        line-height: 32px;
    }
}
// .infoBtn {
//     font-size: 14px;
//     line-height: 32px;
//     color: #999;
// }

.ivu-select {
    margin: 0;
}
.m-content {
    &.overflow-line {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        // -webkit-line-clamp: 3;
        overflow: hidden;
    }
}
.fileTop {
    position: relative;
    top: 8px;
    display: block;
}
img {
    display: none;
}
p {
    margin-bottom: 30px;
}
.isMore {
    height: 248px;
}
</style>
