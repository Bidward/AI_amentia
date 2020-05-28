import TableHeaderSetting from '../../table-header-setting'
import OpLogs from './../../op-log' // 日志
import { proBaseUrl } from '@/api/base.js'
import moment from 'moment'
import { HeaderInput } from '_c/table-header-search'
import TreeSelectVue from '_c/tree-select-vue/tree-select-vue'

export default {
  inject: ['app'],

  components: {
    TableHeaderSetting,
    OpLogs
  },

  data () {
    return {
      productLog: [],
      detailHeader: {
        stage: '', // tag标签名
        personId: '', // 当前用户ID
        query: '', // 表头设置的模糊搜索
        productName: '', // 产品名称
        productSource: '', // 来源
        companyName: '', // 公司名称
        productIscompany: '', // 公司个人
        companyNature: '', // 公司性质
        inputTime: '', // 签订时间
        userName: '', // 个人的姓名
        idCard: '', // 身份证
        contactAddress: '', // 地址
        customerLevel: '', // 客户登记
        controlVolume: '', // 控量
        budget: '', // 预算
        settlementCycles: '', // 结算周期
        settlementMethod: '', // 结算方法
        advancePayment: '', // 预收款项
        paymentMethod: '', // 付款方式
        businessAffairs: null, // 商务
        notCooperationReasons: '', // 未合作原因
        lossFeedback: '', // 流失反馈
        contractCode: '', // 合同编码
        contractTime: '', // 合同状态
        order: 1, // 排序
        orderby: '',
        desc: 'normal',
        totalCount: 0,
        pageSize: 20,
        currPage: 1,
        secondSigningPeople: null
      },
      userId: '',
      // 合同状态
      contractStatuList: [
        {
          id: 1,
          name: '合作中'
        },
        {
          id: 2,
          name: '未启用'
        }
      ],
      // 信息核对
      InformCheckList: [
        {
          id: 0,
          name: '未过白'
        },
        {
          id: 1,
          name: '已过白'
        }
      ],
      // 客户等级
      clientLevelList: [
        {
          id: 1,
          name: 'KA'
        },
        {
          id: 2,
          name: '中小'
        }
      ],
      // 公司/个人
      companyPersonList: [
        {
          id: 1,
          name: '公司'
        },
        {
          id: 2,
          name: '个人'
        }
      ],
      // 公司性质
      companyNatureList: [{ id: 1, name: '官方' }, { id: 2, name: '代理' }],
      // 控量
      controlVolumeList: [{ id: 1, name: '有' }, { id: 2, name: '无' }],
      // 结算周期
      settlementList: [{ id: 1, name: '单周' }, { id: 2, name: '双周' }, { id: 3, name: '月' }],
      // 结算方式
      settlementMethodList: [{ id: 1, name: '安装(CPA)' }, { id: 2, name: '充值(CPA+CPS)' }, { id: 3, name: '留存(CPL)' }, { id: 4, name: '分成(CPS)' }, { id: 5, name: '点击(CPC)' }, { id: 6, name: '包月(CPT)' }],
      // 付款方式
      paymentMethodList: [{ id: 1, name: '充值' }, { id: 2, name: '后付' }],
      // 未合作原因
      notCooperationReasonsList: [],
      // 流失反馈
      lossFeedbackList: [],
      // 合同状态
      contractTimeList: [{ id: 1, name: '到期' }, { id: 2, name: '合同期' }, { id: 3, name: '终止' }],
      tableHeader: [],
      productHeader: [
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
          title: '产品名称',
          // slot: "name",
          align: 'center',
          key: 'productName',
          width: 200,
          fixed: 'left',
          'sortable': true,
          renderHeader: (h, params) => {
            return (
              // <span>
              //   <Poptip transfer={true} placement="bottom">
              //     <span class="pointer">
              //       {params.column.title}
              //       <Icon type="md-search" size="14" />
              //     </span>
              //     <Input
              //       v-model={this.detailHeader.productName}
              //       clearable
              //       slot="content"
              //       placeholder={params.column.title}
              //       search
              //       onOn-search={value => {
              //         this.getData({ productName: value, curPage: 1 })
              //       }}
              //       // v-model={this.detailHeader.reason}
              //     />
              //   </Poptip>
              // </span>
              <HeaderInput
                v-model={this.detailHeader.productName}
                title={params.column.title}
                clearable={false}
                onOn-search={value => {
                  this.getData({ productName: value, curPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader.productName = ''
                  this.getData()
                }}
              >
              </HeaderInput>
            )
          }
        },
        {
          title: '来源',
          key: 'productSource',
          align: 'center',
          'sortable': true,
          minWidth: 120,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer" onClick={this.getSourceList}>
                    {params.column.title}
                    <Icon type="md-search" size="14" />
                  </span>
                  <Select
                    slot="content"
                    v-model={this.detailHeader.productSource}
                    filterable
                    placeholder="来源"
                    clearable
                    onOn-change={
                      value => {
                        if (!value) return
                        this.getData({ productSource: value, currPage: 1 })
                      }
                    }
                    onOn-clear={ () => {
                      this.detailHeader.productSource = ''
                      this.getData({ currPage: 1 })
                    }}
                  >
                    {
                      this.sourceList.map(item => {
                        return (
                          <Option
                            value={item.tagName}
                            key={item.id}
                            class="customSty"
                          >
                            {item.tagName}
                          </Option>
                        )
                      })
                    }
                  </Select>
                </Poptip>
              </span>

              // <HeaderInput
              //   v-model={this.detailHeader.productSource}
              //   title={params.column.title}
              //   clearable={false}
              //   onOn-search={value => {
              //     this.getData({ productSource: value, curPage: 1 })
              //   }}
              //   onOn-clear={() => {
              //     this.detailHeader.productSource = ''
              //     this.getData()
              //   }}
              // >
              // </HeaderInput>
            )
          }
        },
        {
          title: '公司/个人',
          key: 'productIscompany',
          align: 'center',
          minWidth: 120,
          'sortable': true,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" />
                  </span>
                  <div slot="content" style="white-space: normal">
                    <Select
                      placeholder={params.column.title}
                      slot="content"
                      filterable
                      clearable
                      style="textAlign: left; width: 190px;"
                      v-model={this.detailHeader.productIscompany}
                      onOn-change={value => {
                        if (!value) return
                        this.getData({ productIscompany: value, curPage: 1 })
                      }}
                      onOn-clear={ () => {
                        this.detailHeader.productIscompany = ''
                        this.getData({ currPage: 1 })
                      }}
                    >
                      {(this.companyPersonList || []).map(item => {
                        return (
                          <Option value={item.name}>
                            {item.name}
                          </Option>
                        )
                      })}
                    </Select>
                  </div>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '公司名称',
          key: 'companyName',
          align: 'center',
          minWidth: 120,
          'sortable': true,
          renderHeader: (h, params) => {
            return (
              // <span>
              //   <Poptip transfer={true} placement="bottom">
              //     <span class="pointer">
              //       {params.column.title}
              //       <Icon type="md-search" size="14" />
              //     </span>
              //     <Input
              //       v-model={this.detailHeader.companyName}
              //       clearable
              //       slot="content"
              //       placeholder={params.column.title}
              //       search
              //       onOn-search={(value) => {
              //         this.getData({ companyName: value, curPage: 1 })
              //       }}
              //     />
              //   </Poptip>
              // </span>
              <HeaderInput
                v-model={this.detailHeader.companyName}
                title={params.column.title}
                clearable={false}
                onOn-search={value => {
                  this.getData({ companyName: value, curPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader.companyName = ''
                  this.getData()
                }}
              >
              </HeaderInput>
            )
          }
        },
        {
          title: '姓名',
          key: 'userName',
          align: 'center',
          minWidth: 120,
          'sortable': true,
          renderHeader: (h, params) => {
            return (
              // <span>
              //   <Poptip transfer={true} placement="bottom">
              //     <span class="pointer">
              //       {params.column.title}
              //       <Icon type="md-search" size="14" />
              //     </span>
              //     <Input
              //       v-model={this.detailHeader.companyName}
              //       clearable
              //       slot="content"
              //       placeholder={params.column.title}
              //       search
              //       onOn-search={(value) => {
              //         this.getData({ companyName: value, curPage: 1 })
              //       }}
              //     />
              //   </Poptip>
              // </span>
              <HeaderInput
                v-model={this.detailHeader.companyName}
                title={params.column.title}
                clearable={false}
                onOn-search={value => {
                  this.getData({ companyName: value, curPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader.companyName = ''
                  this.getData()
                }}
              >
              </HeaderInput>
            )
          }
        },
        {
          title: '公司性质',
          key: 'companyNature',
          align: 'center',
          minWidth: 120,
          'sortable': true,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" />
                  </span>
                  <Select
                    v-model={this.detailHeader.companyNature}
                    placeholder={params.column.title}
                    slot="content"
                    filterable
                    clearable
                    onOn-change={value => {
                      if (!value) return
                      this.getData({ companyNature: value, curPage: 1 })
                    }}
                    onOn-clear={
                      () => {
                        this.detailHeader.companyNature = ''
                        this.getData({ curPage: 1 })
                      }
                    }
                    // v-model={this.detailHeader.userId}
                  >
                    {this.companyNatureList.map(item => {
                      return (
                        <Option value={item.name}>
                          {item.name}
                        </Option>
                      )
                    })}
                  </Select>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '客户等级',
          key: 'customerLevel',
          minWidth: 120,
          align: 'center',
          'sortable': true,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" />
                  </span>
                  <Select
                    v-model={this.detailHeader.customerLevel}
                    placeholder={params.column.title}
                    slot="content"
                    filterable
                    clearable
                    onOn-change={value => {
                      if (!value) return
                      this.getData({ customerLevel: value, currPage: 1 })
                    }}
                    onOn-clear={() => {
                      console.log('clear')
                      this.detailHeader.customerLevel = ''
                      this.getData({ currPage: 1 })
                    }}
                    // v-model={this.detailHeader.userId}
                  >
                    {this.clientLevelList.map(item => {
                      return (
                        <Option value={item.name}>
                          {item.name}
                        </Option>
                      )
                    })}
                  </Select>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '控量',
          key: 'controlVolume',
          align: 'center',
          minWidth: 120,
          'sortable': true,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" />
                  </span>
                  <Select
                    v-model={this.detailHeader.controlVolume}
                    placeholder={params.column.title}
                    slot="content"
                    filterable
                    clearable
                    onOn-change={value => {
                      if (!value) return
                      this.getData({ controlVolume: value, currPage: 1 })
                    }}
                    onOn-clear={
                      () => {
                        this.detailHeader.controlVolume = ''
                        this.getData({ currPage: 1 })
                      }
                    }
                    // v-model={this.detailHeader.userId}
                  >
                    {this.controlVolumeList.map(item => {
                      return (
                        <Option value={item.name}>
                          {item.name}
                        </Option>
                      )
                    })}
                  </Select>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '预算(元)',
          key: 'budget',
          align: 'center',
          'sortable': true,
          minWidth: 120,
          renderHeader: (h, params) => {
            return (
              // <span>
              //   <Poptip transfer={true} placement="bottom">
              //     <span class="pointer">
              //       {params.column.title}
              //       <Icon type="md-search" size="14" />
              //     </span>
              //     <Input
              //       v-model={this.detailHeader.budget}
              //       clearable
              //       slot="content"
              //       placeholder={params.column.title}
              //       search
              //       onOn-search={value => {
              //         this.getData({ budget: value, curPage: 1 })
              //       }}
              //     />
              //   </Poptip>
              // </span>
              <HeaderInput
                v-model={this.detailHeader.budget}
                title={params.column.title}
                clearable={false}
                onOn-search={value => {
                  this.getData({ budget: value, curPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader.budget = ''
                  this.getData()
                }}
              >
              </HeaderInput>
            )
          }
        },
        {
          title: '结算周期',
          key: 'settlementCycles',
          align: 'center',
          minWidth: 120,
          'sortable': true,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" />
                  </span>
                  <Select
                    v-model={this.detailHeader.settlementCycles}
                    placeholder={params.column.title}
                    slot="content"
                    filterable
                    clearable
                    onOn-change={value => {
                      if (!value) return
                      this.getData({ settlementCycles: value, currPage: 1 })
                    }}
                    onOn-clear={
                      () => {
                        this.detailHeader.settlementCycles = ''
                        this.getData({ currPage: 1 })
                      }
                    }
                    // v-model={this.detailHeader.userId}
                  >
                    {this.settlementList.map(item => {
                      return (
                        <Option value={item.name}>
                          {item.name}
                        </Option>
                      )
                    })}
                  </Select>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '结算方式',
          key: 'settlementMethod',
          align: 'center',
          minWidth: 120,
          'sortable': true,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" />
                  </span>
                  <Select
                    v-model={this.detailHeader.settlementMethod}
                    placeholder={params.column.title}
                    slot="content"
                    filterable
                    clearable
                    onOn-change={value => {
                      if (!value) return
                      this.getData({ settlementMethod: value, currPage: 1 })
                    }}
                    onOn-clear={
                      () => {
                        this.detailHeader.settlementMethod = ''
                        this.getData({ currPage: 1 })
                      }
                    }
                  >
                    {this.settlementMethodList.map(item => {
                      return (
                        <Option value={item.name}>
                          {item.name}
                        </Option>
                      )
                    })}
                  </Select>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '预收款项(元)',
          key: 'advancePayment',
          align: 'center',
          minWidth: 140,
          'sortable': true,
          renderHeader: (h, params) => {
            return (
              // <span>
              //   <Poptip transfer={true} placement="bottom">
              //     <span class="pointer">
              //       {params.column.title}
              //       <Icon type="md-search" size="14" />
              //     </span>
              //     <Input
              //       v-model={this.detailHeader.advancePayment}
              //       clearable
              //       slot="content"
              //       placeholder={params.column.title}
              //       search
              //       onOn-search={value => {
              //         this.getData({ advancePayment: value, curPage: 1 })
              //       }}
              //     />
              //   </Poptip>
              // </span>
              <HeaderInput
                v-model={this.detailHeader.advancePayment}
                title={params.column.title}
                clearable={false}
                onOn-search={value => {
                  this.getData({ advancePayment: value, curPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader.advancePayment = ''
                  this.getData()
                }}
              >
              </HeaderInput>
            )
          }
        },
        {
          title: '付款方式',
          key: 'paymentMethod',
          align: 'center',
          minWidth: 120,
          'sortable': true,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" />
                  </span>
                  <Select
                    v-model={this.detailHeader.paymentMethod}
                    placeholder={params.column.title}
                    slot="content"
                    filterable
                    clearable
                    onOn-change={value => {
                      if (!value) return
                      this.getData({ paymentMethod: value, currPage: 1 })
                    }}
                    onOn-clear={
                      () => {
                        this.detailHeader.paymentMethod = ''
                        this.getData({ currPage: 1 })
                      }
                    }
                  >
                    {this.paymentMethodList.map(item => {
                      return (
                        <Option value={item.name}>
                          {item.name}
                        </Option>
                      )
                    })}
                  </Select>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '商务',
          key: 'businessAffairs',
          align: 'center',
          minWidth: 120,
          'sortable': true,
          // renderHeader: (h, params) => {
          //   return (
          //     <span>
          //       <Poptip transfer={true} placement="bottom">
          //         <span class="pointer">
          //           {params.column.title}
          //           <Icon type="md-search" size="14" />
          //         </span>
          //         <Select
          //           v-model={this.detailHeader.businessAffairs}
          //           placeholder={params.column.title}
          //           slot="content"
          //           filterable
          //           clearable
          //           onOn-change={value => {
          //             this.getData({ businessAffairs: value, currPage: 1 })
          //           }}
          //         >
          //           {this.app.employees.map(person => {
          //             return (
          //               <Option
          //                 value={person.nickname}
          //                 label={person.nickname}
          //                 key={person.id}
          //               >
          //                 <div>
          //                   <div>
          //                     {person.nickname}
          //                   </div>
          //                   <div style="font-weight: normal;">
          //                     <span>部门:</span>
          //                     <span>
          //                       {
          //                         person.deptName
          //                       }
          //                     </span>
          //                   </div>
          //                   <div style="font-weight: normal;">
          //                     <span>职位:</span>
          //                     <span>
          //                       {person.positionName &&
          //                                                           person.positionName}
          //                     </span>
          //                   </div>
          //                 </div>
          //               </Option>
          //             )
          //           })}
          //         </Select>
          //       </Poptip>
          //     </span>
          //   )
          // }
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="cursor">
                    {params.column.title }
                    <Icon type="md-search" size="14" class={this.detailHeader.businessAffairs ? 'on' : ''} />
                  </span>
                  <div slot="content" style="height: 35px; width: 220px;">
                    <div style=" position: absolute; left: 8px; right: 8px;">
                      <div style="position: relative;">
                        <TreeSelectVue
                          transfer={true}
                          slot="content"
                          placeholder="商务"
                          options={this.treeoptions}

                          multiple={false}
                          disableBranchNodes={true}
                          value={this.detailHeader.businessAffairs}
                          value-format={'object'}
                          onInput={(value) => {
                            if (!value) {
                              value = {}
                            } else {
                              this.detailHeader.businessAffairs = value
                            }
                            this.getData({ businessAffairs: value.label, currPage: 1 })
                          }}
                        >
                        </TreeSelectVue>
                      </div>
                    </div>
                  </div>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '未合作原因',
          key: 'notCooperationReasons',
          align: 'center',
          minWidth: 140,
          'sortable': true,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" />
                  </span>
                  <Select
                    v-model={this.detailHeader.notCooperationReasons}
                    placeholder={params.column.title}
                    slot="content"
                    filterable
                    clearable
                    onOn-change={value => {
                      if (!value) return
                      this.getData({ notCooperationReasons: value, currPage: 1 })
                    }}
                    onOn-clear={
                      () => {
                        this.detailHeader.notCooperationReasons = ''
                        this.getData({ currPage: 1 })
                      }
                    }
                  >
                    {this.notCooperationReasonsList.map(item => {
                      return (
                        <Option value={item.tagName}>
                          {item.tagName}
                        </Option>
                      )
                    })}
                  </Select>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '流失反馈',
          key: 'lossFeedback',
          align: 'center',
          minWidth: 120,
          'sortable': true,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" />
                  </span>
                  <Select
                    v-model={this.detailHeader.lossFeedback}
                    placeholder={params.column.title}
                    slot="content"
                    filterable
                    clearable
                    onOn-change={value => {
                      if (!value) return
                      this.getData({ lossFeedback: value, currPage: 1 })
                    }}
                    onOn-clear={
                      () => {
                        this.detailHeader.lossFeedback = ''
                        this.getData({ currPage: 1 })
                      }
                    }
                  >
                    {this.lossFeedbackList.map(item => {
                      return (
                        <Option value={item.tagName}>
                          {item.tagName}
                        </Option>
                      )
                    })}
                  </Select>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '签订人',
          key: 'secondSigningPeople',
          align: 'center',
          'sortable': true,
          minWidth: 120,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom" transfer={true}>
                  <span class="cursor">
                    {params.column.title }
                    <Icon type="md-search" size="14" class={this.detailHeader.secondSigningPeople ? 'on' : ''} />
                  </span>
                  <div slot="content" style="height: 35px; width: 220px;">
                    <div style=" position: absolute; left: 8px; right: 8px;">
                      <div style="position: relative;">
                        <TreeSelectVue
                          slot="content"
                          placeholder={params.column.title}
                          options={this.treeoptions}
                          multiple={false}
                          disableBranchNodes={true}
                          value-format={'object'}
                          value={this.detailHeader.secondSigningPeople}
                          onInput={(value) => {
                            if (!value) {
                              value = {}
                            } else {
                              this.detailHeader.secondSigningPeople = value
                            }
                            this.getData({ secondSigningPeople: value && value.label, currPage: 1 })
                          }}
                        >
                        </TreeSelectVue>
                      </div>
                    </div>
                  </div>
                </Poptip>
              </span>
            )
          }
          // renderHeader: (h, params) => {
          //   return (
          //     <span>
          //       <Poptip transfer={true} placement="bottom">
          //         <span class="pointer">
          //           {params.column.title}
          //           <Icon type="md-search" size="14" />
          //         </span>
          //         <Select
          //           slot="content"
          //           filterable
          //           clearable
          //           v-model={this.detailHeader.secondSigningPeople}
          //           onOn-change={value => {
          //             this.getData({ secondSigningPeople: value, currPage: 1 })
          //           }}

          //         >
          //           {this.app.employees.map(person => {
          //             return (
          //               <Option
          //                 value={person.nickname}
          //                 label={person.nickname}
          //                 key={person.id}
          //               >
          //                 <div>
          //                   <div>
          //                     {person.nickname}
          //                   </div>
          //                   <div style="font-weight: normal;">
          //                     <span>部门:</span>
          //                     <span>
          //                       {
          //                         person.deptName
          //                       }
          //                     </span>
          //                   </div>
          //                   <div style="font-weight: normal;">
          //                     <span>职位:</span>
          //                     <span>
          //                       {person.positionName && person.positionName}
          //                     </span>
          //                   </div>
          //                 </div>
          //               </Option>
          //             )
          //           })}
          //         </Select>
          //       </Poptip>
          //     </span>
          //   )
          // }
        },
        // {
        //   title: '产品编码',
        //   key: 'productCode',
        //   minWidth: 120,
        //   align: 'center',
        //   'sortable': true,
        //   renderHeader: (h, params) => {
        //     return (
        //       <span>
        //         <Poptip transfer={true} placement="bottom">
        //           <span class="pointer">
        //             {params.column.title}
        //             <Icon type="md-search" size="14" />
        //           </span>
        //           <Input
        //             v-model={this.detailHeader.productCode}
        //             clearable
        //             slot="content"
        //             placeholder={params.column.title}
        //             search
        //             onOn-search={value => {
        //               this.getData({ productCode: value, curPage: 1 })
        //             }}
        //           />
        //         </Poptip>
        //       </span>
        //     )
        //   }
        // },
        {
          title: '合同编码',
          key: 'contractCode',
          minWidth: 120,
          align: 'center',
          'sortable': true,
          renderHeader: (h, params) => {
            return (
              // <span>
              //   <Poptip transfer={true} placement="bottom">
              //     <span class="pointer">
              //       {params.column.title}
              //       <Icon type="md-search" size="14" />
              //     </span>
              //     <Input
              //       v-model={this.detailHeader.contractCode}
              //       clearable
              //       slot="content"
              //       placeholder={params.column.title}
              //       search
              //       onOn-search={value => {
              //         this.getData({ contractCode: value, curPage: 1 })
              //       }}
              //     />
              //   </Poptip>
              // </span>
              <HeaderInput
                v-model={this.detailHeader.contractCode}
                title={params.column.title}
                clearable={false}
                onOn-search={value => {
                  this.getData({ contractCode: value, curPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader.contractCode = ''
                  this.getData()
                }}
              >
              </HeaderInput>
            )
          }
        },
        {
          title: '签订时间',
          key: 'signTime',
          minWidth: 120,
          align: 'center',
          'sortable': true,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" />
                  </span>
                  <div slot="content">
                    <div>
                      <DatePicker
                        type="date"
                        format="yyyy/MM/dd"
                        v-model={this.detailHeader.signTime}
                        transfer={false}
                        editable={false}
                        placement="bottom-start"
                        placeholder="输入时间"
                        onOn-change={() => {
                          this.getData()
                        }}
                      />
                    </div>
                  </div>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '合同状态',
          key: 'contractTime',
          align: 'center',
          minWidth: 120,
          'sortable': true,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" />
                  </span>
                  <Select
                    placeholder={params.column.title}
                    slot="content"
                    filterable
                    clearable
                    v-model={this.detailHeader.contractTime}
                    onOn-change={value => {
                      if (!value) return
                      this.getData({ contractTime: value, currPage: 1 })
                    }}
                    onOn-clear={
                      () => {
                        this.detailHeader.contractTime = ''
                        this.getData({ currPage: 1 })
                      }
                    }
                  >
                    {this.contractTimeList.map(item => {
                      return (
                        <Option value={item.name}>
                          {item.name}
                        </Option>
                      )
                    })}
                  </Select>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '信息核对',
          key: 'productPass',
          align: 'center',
          'sortable': true,
          minWidth: 120,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" />
                  </span>
                  <Select
                    placeholder={params.column.title}
                    slot="content"
                    filterable
                    clearable
                    v-model={this.detailHeader.canPass}
                    onOn-change={value => {
                      if (!value) return
                      this.getData({ canPass: value, currPage: 1 })
                    }}
                    onOn-clear={
                      () => {
                        this.detailHeader.canPass = ''
                        this.getData({ currPage: 1 })
                      }
                    }
                  >
                    {this.InformCheckList.map(item => {
                      return (
                        <Option value={item.id}>
                          {item.name}
                        </Option>
                      )
                    })}
                  </Select>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '操作',
          slot: 'action',
          key: 'action',
          align: 'center',
          width: 200,
          fixed: 'right',
          alwaysShow: true
        }
      ],
      productData: [],
      sourceList: []
    }
  },
  computed: {
    employees () {
      return this.app.employees // 在职人员列表
    },
    treeoptions () {
      return this.app.treeoptions
    }
  },
  watch: {
    isFullScreen (newVal) {
      this.setTableHeight()
    },
    productData (newVal) {
      this.$nextTick(() => {
        this.setTableHeight()
      })
    },
    tableHeight (newVal) {
      console.log(newVal, 'a')
    }
  },
  mounted () {
    this.checkBackLog()// 判断是否从待办跳来的
  },
  methods: {
    handleFullScreen () {
      this.$emit('update:isFullScreen', !this.isFullScreen)
      sessionStorage.setItem('product-fullscreen', !this.isFullScreen)
    },
    setTableHeight () {
      this.$emit('on-set-table-height')
    },
    // 判断是否从待办跳来的
    checkBackLog () {
      // 如果路由参数type为2，是待办来的，检查待办状态
      if (this.$route.query.type === '2') {
        this.checkBackLogStatus()// 检查代办状态
      } else { // 否则正常获取数据
        // this.getUser()// 获取当前用户
        this.getData()// 获取数据
      }
    },
    // 检查代办状态
    checkBackLogStatus () {
      let sendData = {
        canPass: this.$route.query.canPass,
        productId: this.$route.query.id[0],
        backLogId: this.$route.query.id[1],
        operate: this.$route.query.operate
      }
      this.$axios({
        url: proBaseUrl + '/product/checkBackLogStatus',
        data: $qs.stringify(sendData),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            let status = resp.data.data
            if (status) {
              // this.getUser()// 获取当前用户
              this.getData()// 获取数据
              this.getLog()// 获取日志
              // this.$Message.success(resp.data.msg)
            } else {
              this.$router.go(-1)
              bus.$emit('on-myclose', this.$route)
              this.$Message.error(resp.data.msg)
            }
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
    },
    // 日志
    getLog () {
      let sendData = {
        canPass: 0,
        id: 0
      }
      this.$axios({
        url: proBaseUrl + '/product/getSyslog',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        this.productLog = res.data.data
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取接口请求发送的数据
    getSendData (data) {
      let keys = Object.keys(this.detailHeader)
      let me = this
      let sendData = {}
      // this.detailHeader.personId = Number(localStorage.getItem('userId'))
      this.detailHeader.personId = this.$store.state.user.userId
      this.detailHeader.stage = this.$route.query.stage || sessionStorage.productTabs

      // 非空字符串
      let hasValueKeys = keys.filter(e => {
        return me.detailHeader[e] !== ''
      })
      // 拷贝到sendData
      for (let i = 0; i < hasValueKeys.length; i++) {
        let key = hasValueKeys[i]
        let value = me.detailHeader[key]
        if (!value) continue
        sendData[key] = typeof value === 'string' ? value.trim() : value
      }
      // 传进来的data去除首位空格
      for (let key in data) {
        if (typeof data[key] === 'string') {
          data[key] = data[key].trim()
        }
      }
      // 如果有模糊搜索，清空表头
      if (this.detailHeader.query) {
        // 清空搜索
        this.reload()
        sendData.query = sendData.query.trim()
        this.detailHeader.query = sendData.query
      }
      // 签订时间
      if (this.detailHeader.signTime) {
        sendData.signTime = moment(sendData.signTime).format('YYYY-MM-DD')
      }
      delete sendData.totalCount
      sendData = Object.assign(sendData, data)
      // 如果排序清空，不需要带排序条件
      if (sendData.desc === 'normal') {
        delete sendData.orderby
        delete sendData.desc
      } else if (sendData.desc === 'desc') {
        sendData.order = 0
      } else if (sendData.desc === 'asc') {
        sendData.order = 1
      }
      this.detailHeader.currPage = sendData.currPage
      return sendData
    },
    // 刷新/初始话数据
    reload (data) {
      let initData = {
        stage: this.$route.query.stage || sessionStorage.productTabs, // 标签页
        // personId: localStorage.getItem('userId'), // 当前用户ID
        personId: this.$store.state.user.userId, // 当前用户ID
        query: '', // 表头设置的模糊搜索
        productName: '', // 产品名称
        productSource: '', // 来源
        companyName: '', // 公司名称
        productIscompany: '', // 公司个人
        companyNature: '', // 公司性质
        inputTime: '', // 签订时间
        userName: '', // 个人的姓名
        idCard: '', // 身份证
        contactAddress: '', // 地址
        customerLevel: '', // 客户登记
        controlVolume: '', // 控量
        budget: '', // 预算
        settlementCycles: '', // 结算周期
        settlementMethod: '', // 结算方法
        advancePayment: '', // 预收款项
        paymentMethod: '', // 付款方式
        businessAffairs: null, // 商务
        notCooperationReasons: '', // 未合作原因
        lossFeedback: '', // 流失反馈
        contractCode: '', // 合同编码
        contractTime: '', // 合同状态
        order: 1, // 排序
        totalCount: 0,
        pageSize: 20,
        currPage: 1
      }
      this.detailHeader = Object.assign(initData, data)
      return this.detailHeader
    },
    // 排序
    handleSort (column) {
      // 降序  "desc"
      let orderby = column.key
      let desc = column.order
      console.log(column)
      this.getData({ orderby, desc })
      this.detailHeader.orderby = column.key
      this.detailHeader.desc = column.order
    },
    // 获取列表数据
    getData (data) {
      // 未合作原因
      this.$axios({
        url: proBaseUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({ tagId: '008' })
      }).then(res => {
        if (res.data.code === 10000) {
          this.notCooperationReasonsList = res.data.data
        }
      }).catch(err => {
        console.log(err)
      })
      // 流失反馈
      this.$axios({
        url: proBaseUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({ tagId: '009' })
      }).then(res => {
        if (res.data.code === 10000) {
          this.lossFeedbackList = res.data.data
          // this.setTableHeight()
        }
      }).catch(err => {
        console.log(err)
      })
      let sendData = this.getSendData(data)
      // let sendData = {
      //   stage: this.$route.query.stage || sessionStorage.productTabs,
      //   currentPage: this.detailHeader.currPage,
      //   pageSize: this.detailHeader.pageSize,
      //   personId: localStorage.getItem('userId')
      // }
      if (this.$route.query.type === '2') {
        sendData.deleteId = this.$route.query.id[0]// 被删除数据ID
        sendData.canPass = Number(this.$route.query.canPass) // 标识过白/不过白数据
        this.$axios({
          url: proBaseUrl + '/product/getDeleteProduct',
          method: 'post',
          data: sendData
        }).then(res => {
          console.log(res)
          if (res.data.code === 10000) {
            // this.$Message.info('数据获取成功')
            this.productData = res.data.data.result
            this.detailHeader.totalCount = res.data.data.count
            this.productData.map(item => {
              if (item.productPass === 0) {
                item.productPass = '未过白'
              } else {
                item.productPass = '已过白'
              }
              if (item.secondCompanyTerm) {
                item.signTime = (item.secondCompanyTerm.split('~', 1))[0]
              }
            })
            this.setTableHeight()
          } else {
            this.$Message.error('数据获取失败')
          }
        })
      } else {
        this.$axios({
          url: proBaseUrl + '/product/listProduct',
          method: 'post',
          data: sendData
        }).then(res => {
          if (res.data.code === 10000) {
            this.productData = res.data.data.result
            this.detailHeader.totalCount = res.data.data.count
            this.headCount = res.data.data.countInfo
            this.$emit('update-count-info', this.headCount)
            this.productData.map(item => {
              if (item.productPass === 0) {
                item.productPass = '未过白'
              } else {
                item.productPass = '已过白'
              }
              if (item.secondCompanyTerm) {
                item.signTime = (item.secondCompanyTerm.split('~', 1))[0]
              }
            })
            // this.$Message.info('数据获取成功')
            this.setTableHeight()
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    // 编辑
    edit (row) {
      // bus.$emit('on-myclose', this.$route)
      this.$router.push({
        path: 'editProducts',
        query: {
          id: row.productId,
          type: '1',
          canPass: row.productPass,
          showId: row.secondId
        }
      })
    },
    // 详情
    detail (row) {
      let canPass = ''
      if (row.productPass === '未过白') {
        canPass = 0
      } else {
        canPass = 1
      }
      this.$router.push({
        name: 'detailProducts',
        query: {
          canPass: canPass,
          id: row.productId
        }
      })
    },
    // 删除
    del (row) {
      let canPass = ''
      if (row.productPass === '未过白') {
        canPass = 0
      } else {
        canPass = 1
      }
      let sendData = {

        // personId: localStorage.getItem('userId'), // 当前用户ID
        personId: this.$store.state.user.userId, // 当前用户ID
        id: row.productId, // 产品ID
        canPass: canPass, // 是否过白
        stage: sessionStorage.productTabs, // tag标签页
        route: 'business/product', // 跳转的路由
        nickname: localStorage.getItem('username'), // 当前用户名
        productName: row.productName, // 产品名称
        customerRank: row.customerRank // 数据所在阶段
      }
      this.$Modal.confirm({
        title: '提示',
        content: `是否对“${row.productName}”进行删除`,
        onOk: () => {
          this.$axios({
            url: proBaseUrl + '/product/deleteProduct',
            method: 'post',
            data: $qs.stringify(sendData)
          }).then(res => {
            if (res.data.code === 10005) { // 删除成功
              this.$Message.info(res.data.msg)
              this.getData()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    // 合同终止
    contractTermination (row) {
      let sendData = {
        stage: sessionStorage.productTabs, // tag标签页
        productName: row.productName, // 产品名称
        contractTime: row.contractTime, // 签订时间
        route: 'business/product',
        id: row.productId,
        // personId: localStorage.getItem('userId'),
        personId: this.$store.state.user.userId,
        nickname: localStorage.getItem('username')
      }
      this.$Modal.confirm({
        title: '提醒',
        content: '是否终止合同',
        onOk: () => {
          this.$axios({
            url: proBaseUrl + '/product/contractTermination',
            method: 'post',
            data: $qs.stringify(sendData)
          }).then(res => {
            console.log(res)
            if (res.data.code === 10007) {
              this.$Message.success(res.data.msg)
              this.getData()
            }
          })
        }
      })
    },

    getSourceList () {
      if (this.sourceList.length > 0) return

      this.$axios({
        url: proBaseUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({ tagId: '002001' })
      }).then(res => {
        if (res.data.code === 10000) {
          let data = res.data.data
          this.sourceList = data
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
