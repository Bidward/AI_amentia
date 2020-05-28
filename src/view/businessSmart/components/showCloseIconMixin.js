export default {
  data () {
    return {
      closeIcon: {}
    }
  },
  methods: {
    showClearable (key) {
      this.$set(this.closeIcon, key, true)
    },

    hiddenClearable (key) {
      this.$set(this.closeIcon, key, false)
      console.log(this.closeIcon)
    }
  }
}
