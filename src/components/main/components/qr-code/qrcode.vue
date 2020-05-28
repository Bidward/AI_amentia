<template>
  <span>
    <img @click="handleShow" :src="src" alt="二维码" class="qrcode" />
    <div v-if="show">
      <Modal v-model="show" title="温馨提示">
        <div class="preview-img t-align-c">
          <img class="preview-img" :src="images" alt="微信二维码" />
          <h2>微信扫一扫</h2>
          <h2>关联待办事项提醒</h2>
        </div>
      </Modal>
    </div>
  </span>
</template>

<script>
import QRCode from '@/assets/images/qr-code.svg'
import { baseUrl } from '@/api/base'
export default {
  name: 'QRcode',
  data () {
    return {
      src: QRCode,
      show: false,
      images: ''
    }
  },
  methods: {
    handleShow () {
      this.show = true
      this.$axios({
        url: baseUrl + '/backlog/mobile'
      }).then(res => {
        if (res.data.code === 10000) {
          this.images = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
.qrcode {
  vertical-align: middle;
  height: 20px;
}
.t-align-c {
  text-align: center;
}
.preview-img {
  margin: 0 auto;
  max-width: 400px;
}
</style>
