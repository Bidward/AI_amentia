import { debounce } from '@/libs/tools'

export const TABLE_MARGIN_HEIGHT = 380
export const getFixedTableHeight = (isFullScreen) => {
  let tableHeight
  let pagePaddingHeight = document
    .querySelectorAll('body')[0]
    .getClientRects()[0].height
  if (isFullScreen) {
    tableHeight = pagePaddingHeight - TABLE_MARGIN_HEIGHT + 180
  } else {
    tableHeight = pagePaddingHeight - TABLE_MARGIN_HEIGHT
  }
  return tableHeight
}

// 设置表头固定的minxin，常用于列表页
export const setFixeTableMixin = {
  data () {
    return {
      tableHeight: 600
    }
  },
  mounted () {
    window.addEventListener('resize', debounce(this.setTableHeight))
  },
  methods: {
    setTableHeight () {
      this.tableHeight = getFixedTableHeight(this.isFullScreen || false)
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', debounce(this.setTableHeight))
  }
}
