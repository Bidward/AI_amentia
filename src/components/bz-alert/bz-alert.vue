<template>
  <div class="bz-alert">
    <div class="alert-main" v-for="item in messages" :key="item.name">
      <div class="alert-content">{{ item.content }}</div>
    </div>
  </div>
</template>
<script>
let count = 0
function getUid () {
  return 'alert_' + (count++)
}
export default {
  data () {
    return {
      messages: []
    }
  },
  methods: {
    add (message) {
      const id = getUid()
      let _message = Object.assign({
        id: id
      }, message)
      this.messages.push(_message)

      const duration = message.duration
      setTimeout(() => {
        this.remove(id)
      }, duration * 1000)
    },
    remove (id) {
      const messages = this.messages
      for (let i = 0; i < messages.length; i++) {
        if (messages[i].id === id) {
          this.messages.splice(i, 1)
          break
        }
      }
    }
  }
}
</script>
<style>
  .bz-alert{
    position: fixed;
    width: 100%;
    top: 30%;
    left: 0;
    text-align: center;
    pointer-events: none;
  }
  .alert-content{
    display: inline-block;
    padding: 8px 16px;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
    margin-bottom: 8px;
    font-size: 36px;
  }
</style>
