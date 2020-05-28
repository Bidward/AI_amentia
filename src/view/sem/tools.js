import { debounce } from '@/libs/tools'

import { HeaderInput } from '_c/table-header-search'

/**
 * @param {String} v 需要计算长度的字符串
 * @param {Number} t {推广组}算几个字
 * @description 获取字符长度，中文算两个
 */

export const getCharLength = function (v, t) {
  if (t) {
    let s = ''
    for (let j = 0; j < t; j++) {
      s += 'a'
    }
    v = v.replace(/\{推广组\}/g, s)
  }
  let l = 0
  for (let i = 0; i < v.length; i++) {
    let a = v.charAt(i)
    // 如果是中文，算两个
    if (a.match(/[^\x00-\xff]/gi) != null) {
      l += 2
    } else {
      l += 1
    }
  }
  return l
}
/**
 *
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 * @description 详情见iview的form自定义表单验证,必填，minLength,maxLength
 */
export const validateLength = function (rule, value, callback) {
  // 必填且未填
  if (rule.required && !value) {
    callback(new Error('必填项'))
  } else if (
    // 非必填，没有值，过白
    !rule.required &&
    !value
  ) {
    callback()
  } else if (
    rule.minLength &&
    getStringLength(value) < rule.minLength
  ) {
    callback(new Error('字数小于' + rule.minLength))
  } else if (
    rule.maxLength &&
    getStringLength(value) > rule.maxLength
  ) {
    callback(new Error('字数超过' + rule.maxLength))
  } else {
    callback()
  }
}

//
/**
 *
 * @param {*} v
 * @param {*} t
 * @description 获取字符的占位大小，中文算两个,{推广组}不算
 */
export const getStringLength = function (v, t) {
  if (t) {
    v.replace(/\{推广组\}/g, '')
  }
  let l = 0
  for (let i = 0; i < v.length; i++) {
    let a = v.charAt(i)
    // 如果是中文，算两个
    if (a.match(/[^\x00-\xff]/gi) != null) {
      l += 2
    } else {
      l += 1
    }
  }
  return l
}

/**
 *
 * @param {String} v 根据换行符获取
 */
export const getRowLength = function (v) {
  return v.split('\n').length
}

export const semPermissionMixin = {
  computed: {
    permission () {
      /**
       * config 配置
       * create 新增
       * delete 删除
       * retrie 查看
       * update 编辑
       */
      return this.$store.state.user.userpermission.sem
    }
  }
}

// 一个固定数值，页面里面有一个居中的tabs，有分页，那么表头固定就需要减去这个值
// 一定要按照规范，有分页的距离，有右上角的模糊搜索等等

export const TABLE_MARGIN_HEIGHT = 330

export const getFixedTableHeight = (isFullScreen) => {
  let tableHeight = 600
  let pagePaddingHeight = document
    .querySelectorAll('body')[0]
    .getClientRects()[0].height
  if (isFullScreen) {
    tableHeight = pagePaddingHeight - TABLE_MARGIN_HEIGHT + 140
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

export const mixins = {
  data () {
    return {
      defaultList: ['index', 'keyword', 'date', 'queryWord', 'accountName', 'softName', 'owner', 'semMatch', 'semClickSetup', 'semClickView', 'semCost', 'profitPer', 'profitIn', 'semViews', 'semClicks', 'xzSetups', 'semConsume', 'xzAppid', 'xzOpenSetup', 'numKeywords', 'numSofts']
    }
  },
  methods: {
    // 关键词包含推广组颜色
    keyWordIncludeSoftNameColor (softName, keyword) {
      if (!softName) return '' // 没有产品名
      let r = new RegExp(softName, 'gi') // 动态创建规则
      let hasSoftName = r.test(keyword)
      if (!hasSoftName) {
        return 'red'
      } else {
        return ''
      }
    },
    // 点击安装率颜色
    semClickSetupColor (setupRadio) {
      let num = parseFloat(setupRadio)
      if (num < 40 || isNaN(num)) {
        return 'red'
      } else if (num < 50) {
        return 'orange'
      } else {
        return ''
      }
    },
    // 最大出价颜色
    profitMaxpriceColor (maxprice) {
      let num = Number(maxprice)
      if (num <= 0.22 || isNaN(num)) {
        return 'red'
      } else if (num < 0.3) {
        return 'orange'
      } else {
        return ''
      }
    },
    /**
     * 盈亏
     * 盈亏的红色就是利润和盈亏都是负值
     * 盈亏的橙色就是利润是正值，但是盈亏是负值
     */
    profitInoutColor (percost, profitIn) {
      let g = Number(profitIn) // 利润
      let p = Number(percost) // 盈亏
      if (g < 0 && p < 0) {
        return 'red'
      } else if (g >= 0 && p < 0) {
        return 'orange'
      } else {
        return ''
      }
    },
    // 单位收益
    profitPerColor (profitPer) {
      let num = Number(profitPer)
      if (num < 0.2 || isNaN(num)) {
        return 'red'
      } else if (num < 0.4) {
        return 'orange'
      } else {
        return ''
      }
    },
    // 利润
    profitInColor (profitIn) {
      let num = Number(profitIn)
      if (num < 0 || isNaN(num)) {
        return 'red'
      } else {
        return ''
      }
    },
    // 利润率
    profitInradioColor (profitInradio) {
      let num = parseFloat(profitInradio)
      if (num < 0 || isNaN(num)) {
        return 'red'
      } else {
        return ''
      }
    },
    // 推荐软件
    xzSofttjColor (xzSofttj) {
      let num = Number(xzSofttj)
      if (num < 2 || isNaN(num)) {
        return 'red'
      } else if (num < 2.5) {
        return 'orange'
      } else {
        return ''
      }
    },
    // 安装数
    xzSetupsColor (setups) {
      if (setups < 5) {
        return 'red'
      } else {
        return ''
      }
    },
    // 上周同期差值
    xzDiffLastweekColor (xzDiffLastweek) {
      if (xzDiffLastweek < 0) {
        return 'red'
      } else {
        return ''
      }
    },
    // 昨日差值
    xzDiffLastdayColor (xzDiffLastday) {
      if (xzDiffLastday < 0) {
        return 'red'
      } else {
        return ''
      }
    },
    // 历史最高差值
    xzDiffMaxsetupColor (maxSetups) {
      if (maxSetups < 0) {
        return 'red'
      } else {
        return ''
      }
    },
    // 打开安装率
    xzOpenSetupColor (xzOpenSetup) {
      let num = parseFloat(xzOpenSetup)
      if (num < 40 || isNaN(num)) {
        return 'red'
      } else if (num < 50) {
        return 'orange'
      } else {
        return ''
      }
    }
  },
  computed: {
    permission () {
      /**
       * config 配置
       * create 新增
       * delete 删除
       * retrie 查看
       * update 编辑
       */
      return this.$store.state.user.userpermission.sem
    }
  }
}

// 日期控件daterang验证规则
export const valiteDateArr = function (rule, value, callback) {
  if (value.every(e => e)) {
    callback()
  } else {
    callback(new Error('日期必填'))
  }
}
export const renderHeaderMixins = {
  components: {
    HeaderInput
  },
  methods: {
    // 表头搜索输入框函数
    renderHeaderInput (h, params) {
      let { key, title } = params.column
      return (
        <HeaderInput
          v-model={this.detailHeader[key]}
          title={title}
          onOn-search={value => {
            this.detailSearch({ [key]: value, currPage: 1 })
          }}
        />
      )
    }
  }
}
