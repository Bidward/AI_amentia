import TableHeaderSetting from '_c/table-header-setting'
import { HeaderInput, HeaderSelect } from '_c/table-header-search'
import { prUrl } from '@/api/base.js'
import { debounce } from '@/libs/tools'
import { mapMutations } from 'vuex'
// import { prUrl } from '@/api/base.js'
import moment from 'moment'
export default {
  inject: ['app'],
  components: {
    TableHeaderSetting, HeaderInput, HeaderSelect
  },
  data () {
    return {
      loading: false, // 表格是否加载状态
      tableHeight: 600,
      projectLog: [], // 项目申报日志
      isFullScreen: this.$store.state.app.isTaskListFullScreen,
      detailHeader: {// 表格所有表头字段
        query: '', // 模糊搜索
        projectName: '', // 项目名称
        declareLevel: '', // 申请级别
        examined: '', // 年审   申报成功中有
        existenceAward: '', // 奖补 申报成功中有
        pastTime: '', // 往年申报时间  待奖补中没有
        deadline: '', // 截止时间
        company: '', // 公司
        policyDocument: '', // 政策文件
        awardMoney: '', // 奖补金额(万元)
        awardUnit: '', // 奖补单位 申报成功中有 待兑现中有
        fromDepartment: '', // 归口部门
        contacts: '', // 联系人
        contactInfo: '', // 联系方式
        completeTime: '', // 完成时间 待奖补中有  奖惩完成里面有
        projectStatus: '', // 状态  只有全部中有
        projectProgress: '', // 项目条件进度 待奖补中没有
        passType: '', // 信息核对  待奖补中没有
        totalCount: 0,
        pageSize: 20,
        currPage: 1,
        personId: '',
        stage: '',
        order: 1,
        orderBy: 'inputtime', // 根据什么字段排序
        desc: '' // 排序的方式
      },
      tableHeader: [], // 表头设置表头
      projectHeader: [ // 表格表头,搜索排序
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center',
          key: 'index',
          alwaysShow: true,
          fixed: 'left'
        },
        {
          title: '项目名称',
          align: 'center',
          key: 'projectName',
          width: 200,
          fixed: 'left',
          renderHeader: (h, params) => {
            let { key, title } = params.column
            return (
              <HeaderInput
                v-model={this.detailHeader[key]}
                title={title}
                clearable={false}
                onOn-search={value => {
                  this.getData({ [key]: value, currPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader[key] = ''
                  this.getData()
                }}
              >
              </HeaderInput>
            )
          }
        },
        {
          title: '申请级别',
          key: 'declareLevel',
          align: 'center',
          sortable: 'custom',
          minWidth: 100,
          fixed: 'left',
          renderHeader: (h, params) => {
            const options = [
              { label: '区级', value: '区级' },
              { label: '市级', value: '市级' },
              { label: '省级', value: '省级' },
              { label: '国家级', value: '国家级' }
            ]
            let { key, title } = params.column
            return (
              <HeaderSelect
                options={options}
                key={key}
                title={title}
                clearable
                onOn-change={() => {
                  this.getData()
                }}
                v-model={this.detailHeader.declareLevel}
              />
            )
          }
        },
        {
          title: '年审',
          align: 'center',
          key: 'examined',
          width: 80,
          fixed: 'left',
          renderHeader: (h, params) => {
            const options = [
              { label: '是', value: '是' },
              { label: '否', value: '否' }
            ]
            let { key, title } = params.column
            return (
              <HeaderSelect
                options={options}
                key={key}
                title={title}
                clearable
                onOn-change={() => {
                  this.getData()
                }}
                v-model={this.detailHeader.examined}
              />
            )
          }
        },
        {
          title: '奖补',
          align: 'center',
          key: 'existenceAward',
          width: 80,
          fixed: 'left',
          renderHeader: (h, params) => {
            const options = [
              { label: '是', value: '是' },
              { label: '否', value: '否' }
            ]
            let { key, title } = params.column
            return (
              <HeaderSelect
                options={options}
                key={key}
                title={title}
                clearable
                onOn-change={() => {
                  this.getData()
                }}
                v-model={this.detailHeader.existenceAward}
              />
            )
          }
        },
        {
          title: '往年申报时间',
          key: 'pastTime',
          align: 'center',
          sortable: 'custom',
          width: 130,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <div>
                      <DatePicker
                        onOn-change={() => {
                          this.getData()
                        }}
                        type="date"
                        format="yyyy/MM/dd"
                        v-model={this.detailHeader.pastTime}
                        placement="bottom-start"
                        placeholder="输入时间"
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.pastTime ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '截止时间',
          key: 'deadline',
          align: 'center',
          sortable: 'custom',
          width: 130,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <div>
                      <DatePicker
                        onOn-change={() => {
                          this.getData()
                        }}
                        type="date"
                        format="yyyy/MM/dd"
                        v-model={this.detailHeader.deadline}
                        placement="bottom-start"
                        placeholder="输入时间"
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.deadline ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '公司',
          align: 'center',
          key: 'company',
          width: 200,
          alwaysShow: true,
          renderHeader: (h, params) => {
            let { key, title } = params.column
            return (
              <HeaderInput
                v-model={this.detailHeader[key]}
                title={title}
                clearable={false}
                onOn-search={value => {
                  this.getData({ [key]: value, currPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader[key] = ''
                  this.getData()
                }}
              >
              </HeaderInput>
            )
          }
        },
        {
          title: '政策文件',
          align: 'center',
          key: 'policyDocument',
          width: 200,
          alwaysShow: true,
          renderHeader: (h, params) => {
            let { key, title } = params.column
            return (
              <HeaderInput
                v-model={this.detailHeader[key]}
                title={title}
                clearable={false}
                onOn-search={value => {
                  this.getData({ [key]: value, currPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader[key] = ''
                  this.getData()
                }}
              >
              </HeaderInput>
            )
          }
        },
        {
          title: '奖补金额(万元)',
          align: 'center',
          key: 'awardMoney',
          width: 200,
          renderHeader: (h, params) => {
            let { key, title } = params.column
            return (
              <HeaderInput
                v-model={this.detailHeader[key]}
                title={title}
                clearable={false}
                onOn-search={value => {
                  this.getData({ [key]: value, currPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader[key] = ''
                  this.getData()
                }}
              >
              </HeaderInput>
            )
          }
        },
        {
          title: '奖补单位',
          align: 'center',
          key: 'awardUnit',
          width: 200,
          renderHeader: (h, params) => {
            let { key, title } = params.column
            return (
              <HeaderInput
                v-model={this.detailHeader[key]}
                title={title}
                clearable={false}
                onOn-search={value => {
                  this.getData({ [key]: value, currPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader[key] = ''
                  this.getData()
                }}
              >
              </HeaderInput>
            )
          }
        },
        {
          title: '归口部门',
          align: 'center',
          key: 'fromDepartment',
          width: 200,
          renderHeader: (h, params) => {
            let { key, title } = params.column
            return (
              <HeaderInput
                v-model={this.detailHeader[key]}
                title={title}
                clearable={false}
                onOn-search={value => {
                  this.getData({ [key]: value, currPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader[key] = ''
                  this.getData()
                }}
              >
              </HeaderInput>
            )
          }
        },
        {
          title: '联系人',
          align: 'center',
          key: 'contacts',
          width: 200,
          renderHeader: (h, params) => {
            let { key, title } = params.column
            return (
              <HeaderInput
                v-model={this.detailHeader[key]}
                title={title}
                clearable={false}
                onOn-search={value => {
                  this.getData({ [key]: value, currPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader[key] = ''
                  this.getData()
                }}
              >
              </HeaderInput>
            )
          }
        },
        {
          title: '联系方式',
          align: 'center',
          key: 'contactInfo',
          width: 200,
          renderHeader: (h, params) => {
            let { key, title } = params.column
            return (
              <HeaderInput
                v-model={this.detailHeader[key]}
                title={title}
                clearable={false}
                onOn-search={value => {
                  this.getData({ [key]: value, currPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader[key] = ''
                  this.getData()
                }}
              >
              </HeaderInput>
            )
          }
        },
        {
          title: '完成时间',
          key: 'completeTime',
          align: 'center',
          sortable: 'custom',
          width: 130,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <div>
                      <DatePicker
                        onOn-change={() => {
                          this.getData()
                        }}
                        type="date"
                        format="yyyy/MM/dd"
                        v-model={this.detailHeader.completeTime}
                        placement="bottom-start"
                        placeholder="输入时间"
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.completeTime ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '状态',
          align: 'center',
          key: 'projectRank',
          width: 200,
          renderHeader: (h, params) => {
            const options = [
              { label: '待完善', value: '待完善' },
              { label: '待申报', value: '待申报' },
              { label: '待审核', value: '待审核' },
              { label: '申报成功', value: '申报成功' },
              { label: '待兑现', value: '待兑现' },
              { label: '待兑现审核', value: '待兑现审核' },
              { label: '待奖补', value: '待奖补' },
              { label: '奖补完成', value: '奖补完成' }
            ]
            let { key, title } = params.column
            return (
              <HeaderSelect
                options={options}
                key={key}
                title={title}
                clearable
                onOn-change={() => {
                  this.getData()
                }}
                v-model={this.detailHeader.projectStatus}
              />
            )
          }
        },
        {
          title: '项目条件进度',
          align: 'center',
          key: 'projectProgress',
          width: 200,
          sortable: 'custom',
          renderHeader: (h, params) => {
            let { key, title } = params.column
            return (
              <HeaderInput
                v-model={this.detailHeader[key]}
                title={title}
                clearable={false}
                onOn-search={value => {
                  this.getData({ [key]: value, currPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader[key] = ''
                  this.getData()
                }}
              >
              </HeaderInput>
            )
          }
        },
        {
          title: '信息核对',
          align: 'center',
          key: 'passType',
          sortable: 'custom',
          width: 200,
          renderHeader: (h, params) => {
            const options = [
              { label: '未过白', value: '未过白' },
              { label: '已过白', value: '已过白' }
            ]
            let { key, title } = params.column
            return (
              <HeaderSelect
                options={options}
                key={key}
                title={title}
                clearable
                onOn-change={() => {
                  this.getData()
                }}
                v-model={this.detailHeader.passType}
              />
            )
          }
        },
        {
          title: '操作',
          slot: 'action',
          key: 'action',
          align: 'center',
          alwaysShow: true,
          width: 120,
          fixed: 'right'
        }
      ],
      projectData: [] // 表格数据
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
    }),
    // 获取接口请求发送的数据
    getSendData () {
      let sendData = {}
      let keys = Object.keys(this.detailHeader)
      this.detailHeader.personId = Number(localStorage.getItem('userId'))
      this.detailHeader.stage = this.$route.query.stage || sessionStorage.projectTabs || 'allProject'

      keys.filter(item => {
        if (this.detailHeader[item] !== '') {
          let value = this.detailHeader[item]
          sendData[item] = typeof value === 'string' ? value.trim() : value
          if (item === 'query' && value) {
            this.reload(value.trim())
          } else if (item === 'pastTime' && value) {
            sendData.pastTime = moment(value).format('YYYY-MM-DD')
          } else if (item === 'deadline' && value) {
            sendData.deadline = moment(value).format('YYYY-MM-DD')
          } else if (item === 'completeTime' && value) {
            sendData.completeTime = moment(value).format('YYYY-MM-DD')
          }
        }
      })
      return sendData
    },

    getData () {
      this.loading = true
      let sendData = this.getSendData()
      this.$axios({
        url: prUrl + '/project/selectAllProject',
        method: 'post',
        data: sendData
      }).then(res => {
        if (res.data.code === 10000) {
          this.projectData = res.data.data.projectBaseInfos
          this.detailHeader.totalCount = res.data.data.count
        } else {
          this.$Message.error(res.data.msg)
        }
        this.setTableHeight()
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    // 排序
    handleSort (column) {
      // 降序  "desc"
      this.detailHeader.orderBy = column.order === 'normal' ? 'inputtime' : column.key
      this.detailHeader.desc = column.order === 'normal' ? '' : column.order
      this.getData()
    },
    // 刷新
    reload (data) {
      this.detailHeader = {
        query: data,
        projectName: '',
        declareLevel: '',
        pastTime: '',
        deadline: '',
        company: '',
        policyDocument: '',
        awardMoney: '',
        fromDepartment: '',
        contacts: '',
        contactInfo: '',
        projectStatus: '',
        projectProgress: '',
        passType: '',
        totalCount: 0,
        pageSize: 20,
        currPage: 1,
        personId: Number(localStorage.getItem('userId')),
        order: 1
      }
    },
    // 编辑
    edit (row) {
      this.$router.push(
        { name: 'editProject',
          query: {
            id: row.id,
            passType: row.passType,
            oldId: row.oldId,
            type: row.type
          },
          params: {
            projectName: row.projectName
          }
        })
    },
    // 详情
    detail (row) {
      this.$router.push({
        name: 'detailProject',
        query: {
          id: row.id,
          passType: row.passType
        },
        params: {
          projectName: row.projectName
        }
      })
    }
  }
}
