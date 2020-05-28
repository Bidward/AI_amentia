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
