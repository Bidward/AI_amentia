
export const dayTotalTableHeader = {
  data () {
    return {
      totalTableHeaders: [
        {
          title: '序号',
          key: 'index',
          align: 'center',
          alwaysShow: true,
          minWidth: 80,
          fixed: 'left',
          render: (h, { index }) => {
            if (index === this.tableContentLength - 1 || index === 0) {
              return (<span>合计</span>)
            } else {
              return (<span>{index}</span>)
            }
          }
        },
        {
          title: '关键词',
          key: 'keyword',
          align: 'center',
          alwaysShow: true,
          minWidth: 120,
          fixed: 'left',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Checkbox
                      true-value={'1'}
                      false-value={''}
                      v-model={this.detailHeader.keywordCheck}
                    >
                      精确搜索
                    </Checkbox>
                    <Input
                      v-model={this.detailHeader.keyword}
                      search
                      style="width:200px"
                      v-on: on-search={value => {
                        this.detailSearch({ keyword: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.keyword ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '渠道号',
          key: 'xzAppid',
          align: 'center',
          alwaysShow: true,
          minWidth: 120,
          fixed: 'left',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <div>
                      <Input
                        v-model={this.detailHeader.xzAppid}
                        search
                        clearable
                        v-on: on-search={value => {
                          this.detailSearch({ xzAppid: value, currPage: 1 })
                        }}
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.xzAppid ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '日期',
          key: 'date',
          align: 'center',
          width: 130,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <DatePicker
                      v-on: on-ok={() => {
                        this.detailSearch({ currPage: 1 })
                      }}
                      type="date"
                      v-model={this.detailHeader.date}
                      confirm
                      placement="bottom-start"
                      placeholder="输入时间"
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.date ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '小时',
          key: 'hour',
          align: 'center',
          sortable: 'custom',
          width: 100,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <div>
                      <Checkbox
                        true-value={'2'}
                        false-value={'1'}
                        v-model={this.detailHeader.hourMergin}
                      >
                        区间合并
                      </Checkbox>
                      <TimePicker
                        v-on: on-ok={() => {
                          this.detailSearch({ currPage: 1 })
                        }}
                        type="timerange"
                        v-model={this.detailHeader.timeRange}
                        placement="bottom-end"
                        placeholder="Select time"
                        style="width: 168px"
                        confirm
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.timeRange.length > 1 ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '账户名称',
          key: 'accountName',
          align: 'center',
          minWidth: 120,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.accountName}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.accountName ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '产品名',
          key: 'softName',
          align: 'center',
          minWidth: 120,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.softName}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ softName: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.softName ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '软件ID',
          key: 'xzSoftid',
          align: 'center',
          minWidth: 120,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <div>
                      <Input
                        v-model={this.detailHeader.xzSoftid}
                        search
                        clearable
                        v-on: on-search={value => {
                          this.detailSearch({ xzSoftid: value, currPage: 1 })
                        }}
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.sixzSoftidd ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          },
          render: (h, { row, column, index }) => {
            return (
              <a href={row.semUrl} target="_blank" title="打开页面">
                <span class="pointer">{row.xzSoftid}</span>
              </a>
            )
          }
        },
        {
          title: '广告展示数',
          key: 'semViews',
          align: 'center',
          minWidth: 100,
          sortable: 'custom'
        },
        {
          title: '环比',
          key: 'semViewsDod',
          align: 'center',
          minWidth: 80,
          sortable: 'custom',
          render: renderLow0Red
        },
        {
          title: '同比',
          key: 'semViewsMom',
          align: 'center',
          minWidth: 80,
          sortable: 'custom',
          render: renderLow0Red
        },
        {
          title: '广告点击数',
          key: 'semClicks',
          align: 'center',
          minWidth: 100,
          sortable: 'custom'
        },
        {
          title: '环比',
          key: 'semClicksDod',
          align: 'center',
          minWidth: 80,
          sortable: 'custom',
          render: renderLow0Red
        },
        {
          title: '同比',
          key: 'semClicksMom',
          align: 'center',
          minWidth: 80,
          sortable: 'custom',
          render: renderLow0Red
        },
        {
          title: '广告展示点击率',
          key: 'radioClickview',
          align: 'center',
          minWidth: 130,
          sortable: 'custom'
        },
        {
          title: '环比',
          key: 'radioClickviewDod',
          align: 'center',
          minWidth: 80,
          sortable: 'custom',
          render: renderLow0Red
        },
        {
          title: '同比',
          key: 'radioClickviewMom',
          align: 'center',
          minWidth: 80,
          sortable: 'custom',
          render: renderLow0Red
        },
        {
          title: '页面展现数',
          key: 'xzShow',
          align: 'center',
          minWidth: 100,
          sortable: 'custom'
        },
        {
          title: '环比',
          key: 'xzShowDod',
          align: 'center',
          minWidth: 80,
          sortable: 'custom',
          render: renderLow0Red
        },
        {
          title: '同比',
          key: 'xzShowMom',
          align: 'center',
          minWidth: 80,
          sortable: 'custom',
          render: renderLow0Red
        },
        {
          title: '广告点击页面展现率',
          key: 'radioShowclicks',
          align: 'center',
          minWidth: 150,
          sortable: 'custom',
          render: renderLow90Red
        },
        {
          title: '环比',
          key: 'radioShowclicksDod',
          align: 'center',
          minWidth: 80,
          sortable: 'custom',
          render: renderLow0Red
        },
        {
          title: '同比',
          key: 'radioShowclicksMom',
          align: 'center',
          minWidth: 80,
          sortable: 'custom',
          render: renderLow0Red
        },
        {
          title: '页面点击数',
          key: 'xzClick',
          align: 'center',
          minWidth: 100,
          sortable: 'custom'
        },
        {
          title: '环比',
          key: 'xzClickDod',
          align: 'center',
          minWidth: 80,
          sortable: 'custom',
          render: renderLow0Red
        },
        {
          title: '同比',
          key: 'xzClickMom',
          align: 'center',
          minWidth: 80,
          sortable: 'custom',
          render: renderLow0Red
        },
        {
          title: '页面展现点击率',
          key: 'radioShowclick',
          align: 'center',
          minWidth: 120,
          sortable: 'custom',
          render: renderLow90Red
        },
        {
          title: '环比',
          key: 'radioShowclickDod',
          align: 'center',
          minWidth: 80,
          sortable: 'custom',
          render: renderLow0Red
        },
        {
          title: '同比',
          key: 'radioShowclickMom',
          align: 'center',
          minWidth: 80,
          sortable: 'custom',
          render: renderLow0Red
        },
        {
          title: '打开数',
          key: 'xzOpen',
          align: 'center',
          minWidth: 120,
          sortable: 'custom'
        },
        {
          title: '环比',
          key: 'xzOpenDod',
          align: 'center',
          minWidth: 80,
          sortable: 'custom',
          render: renderLow0Red
        },
        {
          title: '同比',
          key: 'xzOpenMom',
          align: 'center',
          minWidth: 80,
          sortable: 'custom',
          render: renderLow0Red
        },
        {
          title: '点击打开率',
          key: 'radioClickopen',
          align: 'center',
          minWidth: 120,
          sortable: 'custom',
          render: renderLow70Red
        },
        {
          title: '环比',
          key: 'radioClickopenDod',
          align: 'center',
          minWidth: 80,
          sortable: 'custom',
          render: renderLow0Red
        },
        {
          title: '同比',
          key: 'radioClickopenMom',
          align: 'center',
          minWidth: 80,
          sortable: 'custom',
          render: renderLow0Red
        },
        {
          title: '安装数',
          key: 'xzSetups',
          align: 'center',
          minWidth: 120,
          sortable: 'custom'
        },
        {
          title: '环比',
          key: 'xzSetupsDod',
          align: 'center',
          minWidth: 80,
          sortable: 'custom',
          render: renderLow0Red
        },
        {
          title: '同比',
          key: 'xzSetupsMom',
          align: 'center',
          minWidth: 80,
          sortable: 'custom',
          render: renderLow0Red
        },
        {
          title: '打开安装率',
          key: 'radioOpensetups',
          align: 'center',
          minWidth: 120,
          sortable: 'custom',
          render: renderLow70Red
        },
        {
          title: '环比',
          key: 'radioOpensetupsDod',
          align: 'center',
          minWidth: 80,
          sortable: 'custom',
          render: renderLow0Red
        },
        {
          title: '同比',
          key: 'radioOpensetupsMom',
          align: 'center',
          minWidth: 80,
          sortable: 'custom',
          render: renderLow0Red
        }
      ]
    }
  }
}

// 值低于设定的率
const valueLowerRate = (value, rate = 0) => {
  let v = parseFloat(value)
  if (v < rate) {
    return 'red'
  } else {
    return ''
  }
}

/**
 *
 * 广告点击页面展现率 低于90%
 * 页面展现点击率 低于90%
 * 点击打开率 和 打开安装率 70%
 * 标红
 */
// 低于0的标红
const renderLow0Red = (h, { row, column }) => {
  return (
    <span class={valueLowerRate(row[column.key])}>{row[column.key]}</span>
  )
}

// 低于90的标红
const renderLow90Red = (h, { row, column }) => {
  return (
    <span class={valueLowerRate(row[column.key], 90)}>{row[column.key]}</span>
  )
}

// 低于70的标红
const renderLow70Red = (h, { row, column }) => {
  return (
    <span class={valueLowerRate(row[column.key], 70)}>{row[column.key]}</span>
  )
}
