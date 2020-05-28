export default {
  methods: {
    tabChangeClick (name) {
      switch (name) {
        case '1':
          this.$router.push({
            name: 'productCompany'
          })
          break
        case '2':
          this.$router.push({
            name: 'channelCompany'
          })
          break
        case '3':
          this.$router.push({
            name: 'contractBank'
          })
          break
        case '4':
          this.$router.push({
            name: 'productBank'
          })
          break
        case '5':
          this.$router.push({
            name: 'productLink'
          })
          break
        case '6':
          this.$router.push({
            name: 'toAuditInform'
          })
          break
      }
    }
  }
}
