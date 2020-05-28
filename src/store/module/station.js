
export default {
  state: {
    showDrawer: false,
    showType: {},
    messageQueue: [],
    unread: 0,
    stationData: {}
  },
  // mutactions一般都是同步的，
  mutations: {
    unshiftMessage (state) {
      state.messageQueue.unshift({})
    },
    handleShowDrawer (state) {
      state.showDrawer = true
    },
    handleCloseDrawer (state) {
      state.showDrawer = false
      state.showType = {}
    },
    setUnreadNum (state, num) {
      state.unread = num
    },
    setShowType (state, type) {
      state.showType = type
    }
  },
  // actions一般都是异步
  actions: {
  }
}
