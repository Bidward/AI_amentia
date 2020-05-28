export default {
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
    setupRadioColor (setupRadio) {
      let num = parseFloat(setupRadio)
      if (num < 40) {
        return 'red'
      } else if (num < 50) {
        return 'orange'
      } else {
        return ''
      }
    },
    // 最大出价颜色
    maxpriceColor (maxprice) {
      let num = Number(maxprice)
      if (num <= 0.22) {
        return 'orange'
      } else if (num < 0.3) {
        return 'red'
      } else {
        return ''
      }
    },
    /**
     * 盈亏
     * 盈亏的红色就是利润和盈亏都是负值
     * 盈亏的橙色就是利润是正值，但是盈亏是负值
     */
    percostColor (percost, grossProfit) {
      let g = Number(grossProfit) // 利润
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
    profitColor (profit) {
      let num = Number(profit)
      if (num < 0.2) {
        return 'red'
      } else if (num < 0.4) {
        return 'orange'
      } else {
        return ''
      }
    },
    // 利润
    grossProfitColor (grossProfit) {
      if (Number(grossProfit) < 0) {
        return 'red'
      } else {
        return ''
      }
    },
    // 利润率
    profitRatioColor (profitRatio) {
      if (parseFloat(profitRatio) < 0) {
        return 'red'
      } else {
        return ''
      }
    },
    // 推荐软件
    ratioColor (ratio) {
      let num = Number(ratio)
      if (num < 2) {
        return 'red'
      } else if (num < 2.5) {
        return 'orange'
      } else {
        return ''
      }
    },
    // 安装数
    setupsColor (setups) {
      if (setups < 5) {
        return 'red'
      } else {
        return ''
      }
    },
    // 上周同期差值
    lastWeekSetupsColor (lastWeekSetups) {
      if (lastWeekSetups < 0) {
        return 'red'
      } else {
        return ''
      }
    },
    // 昨日差值
    lastDaySetupsColor (lastDaySetups) {
      if (lastDaySetups < 0) {
        return 'red'
      } else {
        return ''
      }
    },
    // 历史最高差值
    maxSetupsColor (maxSetups) {
      if (maxSetups < 0) {
        return 'red'
      } else {
        return ''
      }
    },
    // 打开安装率
    appratioColor (appratio) {
      let num = parseFloat(appratio)
      if (num < 40) {
        return 'red'
      } else if (num < 50) {
        return 'orange'
      } else {
        return ''
      }
    }
  }
}
