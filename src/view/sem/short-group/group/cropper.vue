<template>
  <div>
    <Button @click="showCropper=true" icon="ios-cloud-upload-outline">上传</Button>
    <Modal
      v-model="showCropper"
      :mask-closable="false"
      title="图片裁剪"
      :loading="loading"
      :width="640"
      @on-ok="submit"
      @on-cancel="closeModal"
    >
      <div class="cropper-example cropper-first" v-if="showCropper">
        <Cropper
          ref="cropper"
          :src="exampleImageSrc"
          crop-button-text="确认提交"
          @on-crop="handleCroped"
        ></Cropper>
      </div>
    </Modal>
  </div>
</template>

<script>
import Cropper from '@/components/cropper'
import { staticUrl } from '@/api/base.js'
export default {
  name: 'semCropper',
  props: {
  },
  components: {
    Cropper
  },
  data () {
    return {
      showCropper: false,
      loading: true,
      // show: this.showCropper,
      exampleImageSrc: null
    }
  },
  methods: {
    submit () {
      this.$refs.cropper.crop()
    },
    closeModal () {
      // this.$emit('update:showCropper', false)
      this.showCropper = false
    },
    handleCroped (blob) {
      if (!blob) {
        this.closeModal()
        return
      }
      const formData = new FormData()
      formData.append('fileData', blob)
      this.$axios
        .post(staticUrl + 'index.php', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(res => {
          this.$emit('on-success', res.data)
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
          this.closeModal()
        })
    }
  }
}
</script>
