import { debounce } from '@/libs/tools'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      isFullScreen: this.$store.state.app.isTaskListFullScreen,
      tableHeight: 600
    }
  },
  mounted () {
    this.getData()
    window.addEventListener('resize', debounce(this.setTableHeight))
  },
  beforeDestroy () {
    window.removeEventListener('resize', debounce(this.setTableHeight))
  },
  methods: {
    setTableHeight () {
      let TABLE_MARGIN_HEIGHT = 380
      let pagePaddingHeight = document
        .querySelectorAll('body')[0]
        .getClientRects()[0].height
      this.tableHeight = pagePaddingHeight - TABLE_MARGIN_HEIGHT
    },
    // 切换全屏状态
    handleFullScreen () {
      this.isFullScreen = !this.isFullScreen
      this.setFullScreen(this.isFullScreen)
    },

    ...mapMutations({
      setFullScreen: 'toggleFullScreenState'
    })
  }
}
// export const TABLE_MARGIN_HEIGHT = 410
// export const getFixedTableHeight = (isFullScreen) => {
//   let tableHeight = 600
//   let pagePaddingHeight = document
//     .querySelectorAll('body')[0]
//     .getClientRects()[0].height
//   if (isFullScreen) {
//     tableHeight = pagePaddingHeight - TABLE_MARGIN_HEIGHT + 140
//   } else {
//     tableHeight = pagePaddingHeight - TABLE_MARGIN_HEIGHT
//   }
//   return tableHeight
// }

// // 设置表头固定的minxin，常用于列表页
// export const setFixeTableMixin = {
//   data () {
//     return {
//       tableHeight: 600
//     }
//   },
//   mounted () {
//     window.addEventListener('resize', debounce(this.setTableHeight))
//   },
//   methods: {
//     setTableHeight () {
//       this.tableHeight = getFixedTableHeight(this.isFullScreen || false)
//     }
//   },
//   beforeDestroy () {
//     window.removeEventListener('resize', debounce(this.setTableHeight))
//   }
// }
