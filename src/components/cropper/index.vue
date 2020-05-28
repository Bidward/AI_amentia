<template>
  <div class="cropper-wrapper">
    <div class="img-box">
      <img class="cropper-image" :id="imgId" alt="">
    </div>
    <div class="right-con">
      <div v-if="preview" class="preview-box" :id="previewId"></div>
      <div class="button-box">
        <slot>
          <Upload action="image/upload" :before-upload="beforeUpload">
            <Button style="width: 121px;" type="primary">上传图片</Button>
          </Upload>
        </slot>
        <div v-show="insideSrc">
          <Button  class="cropperBtns" type="primary" @click="rotate">
            <Icon type="md-refresh" :size="18"/>
          </Button>
          <Button  class="cropperBtns" type="primary" @click="shrink">
            <Icon type="md-remove" :size="18"/>
          </Button>
          <Button  class="cropperBtns" type="primary" @click="magnify">
            <Icon type="md-add" :size="18"/>
          </Button>

          <Button  class="cropperBtns" type="primary" @click="scale('X')">
            <!-- <Icon custom="iconfont icon-shuipingfanzhuan" :size="18"/> -->
            <svg t="1564554257501" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="835" width="18" height="18"><path d="M252.76928 299.904l146.2784 0 0 472.42752-146.2784 0 0-472.42752Z" p-id="836" fill="#ffffff"></path><path d="M477.48096 85.34528l70.87104 0 0 885.80608-70.87104 0 0-885.80608Z" p-id="837" fill="#ffffff"></path><path d="M629.80096 284.8l31.0016 0 0 502.88128-31.0016 0L629.80096 284.8zM776.42752 284.8l31.0016 0 0 502.88128-31.0016 0L776.42752 284.8zM657.09056 315.8016l0-31.0016 123.04896 0 0 31.0016L657.09056 315.8016zM657.27488 787.64544l0-31.0016 123.04896 0 0 31.0016L657.27488 787.64544z" p-id="838" fill="#ffffff"></path></svg>
          </Button>
           <Button  class="cropperBtns" type="primary" @click="move(0, -moveStep)">
            <Icon type="md-arrow-round-up" :size="18"/>
          </Button>
          <Button  class="cropperBtns" type="primary" @click="scale('Y')">
            <!-- <Icon custom="iconfont icon-chuizhifanzhuan" :size="18"/> -->
            <svg t="1564554277299" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1092" width="18" height="18"><path d="M286.01856 250.91584l472.4224 0 0 146.2784-472.4224 0 0-146.2784Z" p-id="1093" fill="#ffffff"></path><path d="M87.19872 475.62752l885.80096 0 0 70.87104-885.80096 0 0-70.87104Z" p-id="1094" fill="#ffffff"></path><path d="M773.55008 627.94752l0 31.0016L270.6688 658.94912l0-31.0016L773.55008 627.94752zM773.55008 774.5792l0 31.0016L270.6688 805.5808l0-31.0016L773.55008 774.5792zM742.54848 655.24224l31.0016 0 0 123.04896-31.0016 0L742.54848 655.24224zM270.70464 655.42144l31.0016 0 0 123.04896-31.0016 0L270.70464 655.42144z" p-id="1095" fill="#ffffff"></path></svg>
            </Button>

          <Button  class="cropperBtns" type="primary" @click="move(-moveStep, 0)">
            <Icon type="md-arrow-round-back" :size="18"/>
          </Button>
          <Button  class="cropperBtns" type="primary" @click="move(0, moveStep)">
            <Icon type="md-arrow-round-down" :size="18"/>
          </Button>
          <Button  class="cropperBtns" type="primary" @click="move(moveStep, 0)">
            <Icon type="md-arrow-round-forward" :size="18"/>
          </Button>
          <Button style="width: 150px;margin-top: 10px;" type="primary" @click="crop">{{ cropButtonText }}</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import './index.less'
import 'cropperjs/dist/cropper.min.css'
export default {
  name: 'Cropper',
  props: {
    src: {
      type: String,
      default: ''
    },
    preview: {
      type: Boolean,
      default: true
    },
    moveStep: {
      type: Number,
      default: 4
    },
    cropButtonText: {
      type: String,
      default: '裁剪'
    }
  },
  data () {
    return {
      cropper: null,
      insideSrc: ''
    }
  },
  computed: {
    imgId () {
      return `cropper${this._uid}`
    },
    previewId () {
      return `cropper_preview${this._uid}`
    }
  },
  watch: {
    src (src) {
      this.replace(src)
    },
    insideSrc (src) {
      this.replace(src)
    }
  },
  methods: {
    beforeUpload (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        this.insideSrc = event.srcElement.result
      }
      return false
    },
    replace (src) {
      this.cropper.replace(src)
      this.insideSrc = src
    },
    rotate () {
      this.cropper.rotate(90)
    },
    shrink () {
      this.cropper.zoom(-0.1)
    },
    magnify () {
      this.cropper.zoom(0.1)
    },
    scale (d) {
      this.cropper[`scale${d}`](-this.cropper.getData()[`scale${d}`])
    },
    move (...argu) {
      this.cropper.move(...argu)
    },
    crop () {
      // let a = this.cropper.getCroppedCanvas({width: 121, height: 75})
      // let image = a.toDataURL('image/png')

      // 没填但是手贱点了确认,翻滚吧牛宝宝
      if (!this.cropper.getCroppedCanvas()) {
        this.$emit('on-crop', null)
        return
      }
      this.cropper.getCroppedCanvas({ width: 121, height: 75 }).toBlob(blob => {
        this.$emit('on-crop', blob)
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      let dom = document.getElementById(this.imgId)
      this.cropper = new Cropper(dom, {
        preview: `#${this.previewId}`,
        checkCrossOrigin: true,
        dragCrop: false, // 是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域
        cropBoxResizable: true, // 是否允许改变裁剪框的大小
        autoCropArea: 1,
        minCanvasWidth: 100,
        aspectRatio: 121 / 75
      })
    })
  }
}
</script>
<style lang="less" scoped>
.cropperBtns{
  width: 40px;
}
</style>
