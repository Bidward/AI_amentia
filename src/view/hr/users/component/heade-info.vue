<template>
<div class="page-top">
    <span class="back" @click="handleBack()">
        <Icon type="ios-arrow-back" style="margin: 0 0 0 10px;" />
        <span style="color: #fff;">返回</span>
    </span>
    <div class="basic-info-content">
        <div class="basic-info-left" @mouseover="overChangePhoto()" @mouseout="outChangePhoto()">
            <div :class="{showImgBox:isShowImgBox}">
                <viewer>
                    <div class="imgbox">
                        <img :src="staticUrl + strPicUrl" class="inputbox">
                    </div>
                </viewer>
            </div>
            <Upload
                :class="{showImgBox:!isShowImgBox}"
                style="height: 112px;line-height: 112px;"
                :format="['jpg','jpeg','png']"
                multiple
                :show-upload-list="false"
                name="fileData"
                :on-success="(value)=> uploadSuccess('strPicUrl', value)" type="drag"
                :action="staticUrl+'/index.php'">
                <div class="uploadDiv">
                    <Icon type="ios-camera" size="20"></Icon>
                </div>
            </Upload>
        </div>
        <div class="basic-info-right">
            <div class="basic-info-top">
                <div class="basic-info-name">{{nickname}}</div>
                <div class="basic-info-icon">
                    <img v-if="userStatusName === '在职'" :src="imgs.inimg">
                    <img v-if="userStatusName === '离职'" :src="imgs.outimg">
                </div>
            </div>
            <div class="basic-info-bottom">
                <p>
                    <Icon type="ios-card" size="18" /><span>部门：{{deptName}}</span></p>
                <p>
                    <Icon type="ios-card" size="18" /><span>入职日期：{{entryDate}}</span></p>

                <p v-if="userStatusName === '离职'">
                    <Icon type="ios-card" size="18" /><span>离职日期：{{leaveDate}}</span></p>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {
  baseUrl,
  staticUrl
} from '@/api/base.js'
import inimg from '@/assets/images/inimg.png'
import outimg from '@/assets/images/outimg.png'
export default {
  name: 'headeInfo',
  props: {
    info: {
      type: Object,
      default () {
        return {

        }
      }
    }
  },
  data () {
    return {
      imgs: {
        inimg,
        outimg
      },
      isShowImgBox: true,
      mask: false,
      staticUrl,
      baseUrl,
      strPicUrl: '',
      nickname: '',
      deptName: '',
      entryDate: '',
      leaveDate: '',
      userStatusName: ''
    }
  },
  mounted () {
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      this.$axios({
        url: baseUrl + '/user/getBaseInfo',
        data: $qs.stringify({
          id: this.$route.query.id
        }),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.nickname = resp.data.content.nickname
            this.deptName = resp.data.content.deptName
            this.userStatusName = resp.data.content.userStatusName
            this.leaveDate = resp.data.content.leaveDate
            this.entryDate = resp.data.content.entryDate
            this.strPicUrl = resp.data.content.strPicUrl
            this.isShowImgBox = false
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    overChangePhoto () {
      this.isShowImgBox = true
    },
    outChangePhoto () {
      this.isShowImgBox = false
    },
    // 图片上传成功回调函数
    uploadSuccess (type, response, file, fileList) {
      // response是图片上传接口返回的消息,rel===true时，msg为图片相对路径
      if (response.rel === true) {
        // type可能有strPicUrl、certificateUrl
        this.strPicUrl = response.msg
        this.isShowImgBox = false
        this.$axios({
          url: baseUrl + '/user/updatePic',
          method: 'post',
          data: $qs.stringify({
            id: this.$route.query.id,
            url: this.strPicUrl
          })
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.$Message.info('上传成功!')
            } else {
              this.$Message.error(res.data.msg)
            }
          })
          .catch(err => {
            console.log('tbcSave' + err)
          })
      } else {
        console.error(response.msg)
      }
    },
    handleBack () {
      this.$router.go(-1)
    //   this.$router.push({
    //     name: 'userManagement'
    //   })
    }
  }
}
</script>

<style lang="less">
.basic-info-left {
    .ivu-upload.ivu-upload-drag {
        border-radius: 80px;
    }
}
</style><style lang="less" scoped>
@import '~@/assets/style/variables.less';

.page-top {
    width: 100%;
    height: 250px;
    padding: 11px 10px 0 10px;
    background: @color-theme-green;
    position: relative;

    .back {
        display: inline-block;
        width: 70px;
        height: 30px;
        border: 1px solid #fff;
        border-radius: 3px;
        font-size: 14px;
        line-height: 26px;
        margin: 5px 5px;
        cursor: pointer;
        color: #fff;
        position: relative;
    }

    .basic-info-content {
        padding: 0 95px;
        width: 100%;
        position: relative;
        display: flex;
        z-index: 0;

        .basic-info-left {
            width: 130px;
            height: 130px;
            float: left;

            .showImgBox {
                display: none;
            }

            .imgbox {
                img {
                    position: relative;
                    cursor: pointer;
                    overflow: hidden;
                    width: 112px;
                    height: 112px;
                    line-height: 112px;
                    border-radius: 80px;
                }
            }
        }

        .basic-info-right {
            width: 100%;
            margin: 0 0 0 43px;
            color: #fff;

            .basic-info-top {
                width: 100%;
                height: 43px;
                border-bottom: 1px solid #fff;
            }

            .basic-info-name {
                display: inline-block;
                font-size: 24px;
                max-width: 500px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                vertical-align: middle;
            }

            .basic-info-icon {
                width: auto;
                height: auto;
                display: inline-block;
                margin: 0 0 0 6px;
                vertical-align: middle;

            }

            .basic-info-bottom {
                width: 100%;
                margin: 10px 0 0 0;

                i {
                    margin-right: 5px;
                }

                span {
                    vertical-align: middle;
                    font-size:14px;
                }
            }
        }

    }
}
</style>
