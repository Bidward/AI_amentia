<template>
    <div class="viewWrapper bottom">
        <Row class="rowPadding">
            <Col span="22" class="titles">信息录入</Col>
        </Row>
        <div style="padding: 20px 150px;">
            <Form ref="info" :model="info" :rules="rules">
                <Row class="rowPadding">
                    <Col span="3" offset="2" class="title">
                        <i class="require">*</i>
                        <span>信息类型：</span>
                    </Col>
                    <Col span="18">
                        <span class="cont">{{info.infoType||'暂无'}}</span>
                    </Col>
                </Row>
                <Row class="rowPadding" v-for="(item,index) in info.projectNameList" :key="index">
                    <Col span="3" offset="2" class="title">
                        <i class="require">*</i>
                        <span>项目名称：</span>
                    </Col>
                    <Col span="18">
                        <span class="cont">{{item.projectName}}</span>
                    </Col>
                </Row>
            </Form>
        </div>
        <div class="btn">
            <Card>
                <Button @click="goBack">返回</Button>
            </Card>
        </div>
    </div>
</template>

<script>
export default {
  name: 'inputInfo',
  props: {
    infoType: {
      type: String,
      default: () => ''
    },
    projectName: {
      type: Object,
      default: () => {}
    }
    // inutInfo: {
    //   type: Object,
    //   default: () => {}
    // }
  },
  data () {
    return {
      infoTypeList: [
        { id: 1, name: '政策' },
        { id: 2, name: '申报通知' },
        { id: 3, name: '兑现通知' },
        { id: 4, name: '申报公示' },
        { id: 5, name: '兑现公示' }
      ],
      info: {
        infoType: '',
        projectNameList: []
      },
      rules: {}
    }
  },
  watch: {
    // inutInfo: {
    //     handler(val) {
    //         this.info.infoType = val.infoType;
    //         this.info.projectNameList = val.projectName || [];
    //         // 如果没有项目名称，显示暂无
    //         if (this.info.projectNameList.length === 0) {
    //             this.info.projectNameList.push({ projectName: "暂无" });
    //         }
    //     },
    //     deep: true
    // }
    // 信息类型
    infoType: {
      handler (val) {
        this.info.infoType = val
      },
      immediate: true
    },
    // 项目名称
    projectName: {
      handler (val) {
        this.info.projectNameList = val.data || []
        if (this.info.projectNameList.length === 0) {
          this.info.projectNameList.push({ projectName: '暂无' })
        }
      },
      deep: true
    }
  },
  methods: {
    // 返回
    goBack () {
      this.$router.go(-1)
      bus.$emit('on-myclose', this.$route)
    }
  }
}
</script>

<style lang="less" scoped>
.require {
    color: red;
    position: relative;
    top: 2px;
    right: 2px;
}
.titles {
    font-size: 15px;
    color: #19aa8d;
    font-weight: bold;
}
.title {
    text-align: right;
    line-height: 38px;
    margin-right: 10px;
    font-size: 14px;
}
.bottom {
    border-radius: 10px;
    position: relative;
    top: -75px;
    width: 85%;
    margin: auto;
    min-height: 300px;
    box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.2),
        0 0px 41px 0 rgba(246, 234, 234, 0.19);
    padding: 20px;
}
.rowPadding {
    margin-bottom: 20px;
}
.cont {
    position: relative;
    top: 10px;
    word-wrap: break-word;
}
.btn {
    position: fixed;
    bottom: 5%;
    left: 48%;
    background: white;
    z-index: 10;
}
</style>
