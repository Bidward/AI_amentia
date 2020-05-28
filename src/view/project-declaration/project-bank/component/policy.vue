<template>
<!-- 头部 绿框里面的内容 -->
  <div class="top">
    <Row class="rowPadding">
      <Col span="2" class="title" offset="1">关联信息：</Col>
      <Col span="2">
        <Select :disabled="infoType? false:true" v-model="infoType" @on-change="changeInfo">
          <Option v-for="item in relatedInfoList" :value="item.label" :key="item.id">{{ item.label }} </Option>
        </Select>
      </Col>
      <Col span="2" offset="1" class="title">信息名称：</Col>
      <Col span="5">
        <Select :disabled="infoName? false:true" v-model="infoName" >
          <Option v-for="item in infoNameList" :value="item.infoName" :key="item.id">{{ item.infoName }}</Option>
        </Select>
      </Col>
    </Row>
    <Row class="rowPadding">
      <Col offset="3" span="19" class="info m-content overflow-line" v-html="info"  ref="getheight"  :class="[handelShow ? 'isMore':'']">
          <!-- {{info}} -->
      </Col>
      <Col
          span="2"
          offset="11"
          @click.native="showAll"
          style="cursor:pointer;color: #99a6a8;font-size:14px;line-height: 32px;"
          v-if="isShowMore"
      >
          <span>{{moreTitle}}</span>
          <Icon  :type="iconType" />
      </Col>
      <!-- <Col span="2" offset="11" @click.native="showAll($event)" class="infoBtn" style="cursor:pointer;text-align:center;"  v-if="isShowMore" >展开显示更多<Icon type="ios-arrow-down" /></Col> -->
    </Row>
    <Row class="rowPadding" style="padding-bottom:10%;">
      <Col span="2" offset="1" class="title">附件下载：</Col>
      <Col offset="3" style="font-size: 14px; line-height: 32px">
        <ul>
          <li
            v-for="(item,index) in attmentList"
            :key="index"
            class="enclosuresList"
            >
            <Tooltip placement="top">
                <a :href="item.attachUrl" :download="item.attachName" style="width: 500px">{{item.attachName}}</a>
                <div slot="content" style="width: 220px; white-space:normal; word-break:break-all; word-wrap: break-word;">
                    {{item.attachName}}
                </div>
            </Tooltip>
          </li>
        </ul>
        <!-- <a v-for="(item,index) in attmentList" :key="index" :href="item.attachUrl" :download="item.attachName">{{item.attachName}}</a> -->
      </Col>
    </Row>
  </div>
</template>

<script>
import { phpURL } from '@/api/base.js'
export default {
  data () {
    return {
      isShowMore: false,
      isDescStatus: true,
      infoType: '',
      infoName: '',
      domHeight: '',
      moreTitle: '',
      infoNameList: [],
      handelShow: false,
      iconType: '',
      projectName: this.$route.params.projectName,
      info: '',
      relatedInfoList: [
        { id: 1, label: '政策' },
        { id: 2, label: '申报通知' },
        { id: 3, label: '兑现通知' },
        { id: 4, label: '申报公示' },
        { id: 5, label: '兑现公示' }
      ],
      attmentList: []
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      let senDdata = {
        projectName: this.projectName
      }
      this.$axios({
        url: phpURL + '/declareProject/OutreachConfig/getInfoIntroduceByProjectNameAndType',
        method: 'post',
        data: $qs.stringify(senDdata)
      }).then(res => {
        if (res.data.code === 10000) {
          this.infoType = res.data.content.infoType
          this.info = res.data.content.content
          this.attmentList = res.data.content.attach
          this.infoNameList = res.data.content.info
          this.infoName = res.data.content.info[0].infoName
          this.showInfo()
        }
      }).catch(err => {
        console.log(err)
      })
      // bus.$on('projectName', v => {
      //   if (v) {
      //     this.projectName = v
      //     let senDdata = {
      //       projectName: this.projectName
      //     }
      //     this.$axios({
      //       url: phpURL + '/declareProject/OutreachConfig/getInfoIntroduceByProjectNameAndType',
      //       method: 'post',
      //       data: $qs.stringify(senDdata)
      //     }).then(res => {
      //       if (res.data.code === 10000) {
      //         this.infoType = res.data.content.infoType
      //         this.info = res.data.content.content
      //         this.attmentList = res.data.content.attach
      //         this.infoNameList = res.data.content.info
      //         this.infoName = res.data.content.info[0].infoName
      //         this.showInfo()
      //       }
      //     }).catch(err => {
      //       console.log(err)
      //     })
      //   }
      // })
    },
    changeInfo (ids) {
      let sendData = {
        infoType: ids,
        projectName: this.projectName
      }
      this.$axios({
        url: phpURL + '/declareProject/OutreachConfig/getInfoNameByProjectNameAndType',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          if (res.data.content.infoName.length === 0) {
            this.info = ''
            this.attmentList = []
            this.$Message.error('暂无数据')
          } else {
            this.info = res.data.content.infoDetail.content
            this.attmentList = res.data.content.infoDetail.attach
            this.infoNameList = res.data.content.infoName
            this.infoName = res.data.content.infoName[0].infoName
            this.showInfo()
          }
        }
      })
    },
    showAll () {
      this.handelShow = !this.handelShow
      this.moreTitle = this.handelShow ? '展开显示更多' : '收起'
      this.iconType = this.handelShow ? 'ios-arrow-down' : 'ios-arrow-up'
    },
    // 判断高度，显示展示
    showInfo () {
      // setTimeout(()=>{
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
      // },2500)
    }
    // showInfo () {
    //   console.log(this.info.length)
    //   if (this.info.length > 500) {
    //     this.isShowMore = true
    //   }
    // }
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
.enclosuresList {
    position: relative;
    display: block;
    border-radius: 3px;
    width: 500px;
    height: 28px;
    margin-bottom: 6px;
    &:hover {
        background: #f3f3f3;
    }
    a {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
    }
}
</style>
