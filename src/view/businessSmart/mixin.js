export default {
  data () {
    return {
      headCount: {
        all: 0,
        cooperationed: 0,
        hide: 0,
        lose: 0,
        setContact: 0,
        toContact: 0
      },
      headerCount: [
        {
          count: (h) => {
            return h('div', [
              h('span', '全部'),
              h('Badge', {
                props: {
                  count: this.headCount.countAll
                  // count: 100,
                },
                class: {
                  'task-badge': true,
                  'active-badge': this.currentTab === '1'
                },
                style: {
                  marginLeft: '5px'
                }
              })
            ])
          }
        },
        {
          count: (h) => {
            return h('div', [
              h('span', '潜在客户'),
              h('Badge', {
                props: {
                  count: this.headCount.countTbc
                  // count: 10
                },
                class: {
                  'task-badge': true,
                  'active-badge': this.currentTab === '2'
                },
                style: {
                  marginLeft: '5px'
                }
              })
            ])
          }
        },
        {
          count: (h) => {
            return h('div', [
              h('span', '待联系'),
              h('Badge', {
                props: {
                  count: this.headCount.countOngoing
                },
                class: {
                  'task-badge': true,
                  'active-badge': this.currentTab === '3'
                },
                style: {
                  marginLeft: '5px'
                }
              })
            ])
          }
        },
        {
          count: (h) => {
            return h('div', [
              h('span', '建立联系'),
              h('Badge', {
                props: {
                  count: this.headCount.countDefer
                },
                class: {
                  'task-badge': true,
                  'active-badge': this.currentTab === '4'
                },
                style: {
                  marginLeft: '5px'
                }
              })
            ])
          }
        },
        {
          count: (h) => {
            return h('div', [
              h('span', '已合作'),
              h('Badge', {
                props: {
                  count: this.headCount.countClose
                },
                class: {
                  'task-badge': true,
                  'active-badge': this.currentTab === '5'
                },
                style: {
                  marginLeft: '5px'
                }
              })
            ])
          }
        },
        {
          count: (h) => {
            return h('div', [
              h('span', '流失'),
              h('Badge', {
                props: {
                  count: this.headCount.countDone
                },
                class: {
                  'task-badge': true,
                  'active-badge': this.currentTab === '6'
                },
                style: {
                  marginLeft: '5px'
                }
              })
            ])
          }
        }
      ]
    }
  }
}
