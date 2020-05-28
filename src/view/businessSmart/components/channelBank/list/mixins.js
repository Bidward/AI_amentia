import TableHeaderSetting from './../../table-header-setting.vue'
import { biUrl } from '@/api/base.js'
import moment from 'moment'
import { HeaderInput } from '_c/table-header-search'
import TreeSelectVue from '_c/tree-select-vue/tree-select-vue'

export default {
  inject: ['app'],
  components: {
    TableHeaderSetting
  },
  data () {
    return {
      loading: false,
      channelLog: [], // 日志
      detailHeader: {
        backLogId: this.$route.query.id || -1, // 代办
        tagName: '', //
        userId: '',
        query: '', // 模糊搜索
        channelName: '', // 渠道名称
        marketResponsibleName: null, // 市场
        channelSource: '', // 来源
        companyName: '', // 公司名称
        contractStatus: '', // 合同状态
        type: '', // 信息核对
        runOffCallback: '', // 流失反馈
        belongTo: '', // 归属
        companyType: '', // 公司/个人
        website: '', // 网址
        channelType: '', // 渠道类型
        isCloud: '', // 是否云控
        inputTime: '', // 录入时间
        contractNumber: '', // 合同编号
        // timeRange:[],//签订时间
        contractStartTime: '', // 合同签订时间(不显示)
        contractEndTime: '', // 合同结束时间(不显示)
        totalCount: 0,
        pageSize: 20,
        currPage: 1,
        orderby: '', // 根据什么字段排序
        desc: 'normal', // 排序的方式
        domainName: ''
      },
      tableHeader: [],
      // 公司/个人
      companyTypeList: [
        {
          id: 0,
          name: '公司'
        },
        {
          id: 1,
          name: '个人'
        }
      ],
      // 渠道类型
      channelTypeList: [
        {
          id: 0,
          name: '站点'
        },
        {
          id: 1,
          name: '分发'
        },
        {
          id: 2,
          name: '下载器'
        }
      ],
      // 合同状态
      contractStatuList: [
        {
          id: 1,
          name: '合同期'
        },
        {
          id: 2,
          name: '到期'
        },
        {
          id: 3,
          name: '终止'
        }
      ],
      // 云控
      isCloudList: [
        {
          id: 0,
          name: '否'
        },
        {
          id: 1,
          name: '是'
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
      channelHeader: [
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
          title: '渠道名称',
          // slot: "name",
          align: 'center',
          key: 'channelName',
          'sortable': true,
          width: 200,
          fixed: 'left',
          renderHeader: (h, params) => {
            return (
              // <span>
              //   <Poptip transfer={true} placement="bottom">
              //     <span class="pointer">
              //       {params.column.title}
              //       <Icon type="md-search" size="14" />
              //     </span>
              //     <Input slot="content"
              //       v-model={this.detailHeader.channelName}
              //       search
              //       clearable
              //       onOn-search={value => {
              //         this.getData({ channelName: value, curPage: 1 })
              //       }}
              //     />
              //   </Poptip>
              // </span>
              <HeaderInput
                v-model={this.detailHeader.channelName}
                title={params.column.title}
                clearable={false}
                onOn-search={value => {
                  this.getData({ channelName: value, curPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader.channelName = ''
                  this.getData()
                }}
              >
              </HeaderInput>
            )
          }
        },
        {
          title: '市场',
          key: 'marketResponsibleName',
          align: 'center',
          'sortable': true,
          minWidth: 100,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom" transfer={true}>
                  <span class="cursor">
                    {params.column.title }
                    <Icon type="md-search" size="14" class={this.detailHeader.marketResponsibleName ? 'on' : ''} />
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
                          value={this.detailHeader.marketResponsibleName}
                          onInput={(value) => {
                            if (!value) {
                              value = {}
                            } else {
                              this.detailHeader.marketResponsibleName = value
                            }
                            this.getData({ marketResponsibleName: value.label, currPage: 1 })
                          }}
                        >
                        </TreeSelectVue>
                      </div>
                    </div>
                  </div>
                </Poptip>
              </span>
            )
          },
          render: (h, params) => {
            let { row } = params
            let name = row.marketResponsibleName
            return (
              <div>{name}</div>
            )
          }
          // renderHeader: (h, params) => {
          //   return (
          //     <span>
          //       <Poptip placement="bottom" transfer={true}>
          //         <span class="cursor">
          //           {params.column.title }
          //           <Icon type="md-search" size="14" />
          //         </span>
          //         <div slot="content" style="white-space: normal">
          //           <Select
          //             placeholder="接收人"
          //             slot="content"
          //             filterable
          //             size="small"
          //             clearable
          //             style="textAlign: left; width: 190px;"
          //             v-model={this.detailHeader.marketResponsibleName}
          //             onOn-change={value => {
          //               this.getData({ marketResponsibleName: value, currPage: 1 })
          //             }}
          //           >
          //             {(this.employees || []).map(person => {
          //               return (
          //                 <Option
          //                   value={person.nickname}
          //                   label={person.nickname}
          //                   key={person.id}
          //                 >
          //                   <div>
          //                     <div>{person.nickname}</div>
          //                     <div style="font-weight: normal;">
          //                       <span>部门:</span>
          //                       <span>{person.deptName}</span>
          //                     </div>
          //                     <div style="font-weight: normal;">
          //                       <span>职位:</span>
          //                       <span>
          //                         {person.positionName && person.positionName}
          //                       </span>
          //                     </div>
          //                   </div>
          //                 </Option>
          //               )
          //             })}
          //           </Select>
          //         </div>
          //       </Poptip>
          //     </span>)
          // }
        },
        {
          title: '来源',
          key: 'channelSource',
          align: 'center',
          'sortable': true,
          minWidth: 160,
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
                    v-model={this.detailHeader.channelSource}
                    filterable
                    placeholder="来源"
                    clearable
                    onOn-change={
                      value => {
                        this.getData({ channelSource: value, currPage: 1 })
                      }
                    }
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
          key: 'companyType',
          align: 'center',
          'sortable': true,
          width: 100,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom" transfer={true}>
                  <span class="cursor">
                    {params.column.title}
                    <Icon type="md-search" size="14" />
                  </span>
                  <div slot="content" style="white-space: normal">
                    <Select
                      placeholder={params.column.title}
                      slot="content"
                      filterable
                      size="small"
                      clearable
                      style="textAlign: left; width: 190px;"
                      v-model={this.detailHeader.companyType}
                      onOn-change={value => {
                        this.getData({ companyType: value, curPage: 1 })
                      }}
                    >
                      {(this.companyTypeList || []).map(item => {
                        return (
                          <Option value={item.name}>
                            {item.name}
                          </Option>
                        )
                      })}
                    </Select>
                  </div>
                </Poptip>
              </span>)
          }
        },
        {
          title: '公司名称',
          key: 'companyName',
          align: 'center',
          minWidth: 160,
          'sortable': true,
          renderHeader: (h, params) => {
            return (
              // <span>
              //   <Poptip transfer={true} placement="bottom">
              //     <span class="pointer">
              //       {params.column.title}
              //       <Icon type="md-search" size="14" />
              //     </span>
              //     <Input slot="content"
              //       v-model={this.detailHeader.companyName}
              //       search
              //       clearable
              //       onOn-search={value => {
              //         this.getData({ companyName: value, curPage: 1 })
              //       }}
              //     />
              //   </Poptip>
              // </span>
              <HeaderInput
                placeholder={params.column.title}
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
          key: 'username',
          align: 'center',
          minWidth: 160,
          'sortable': true,
          renderHeader: (h, params) => {
            return (
              // <span>
              //   <Poptip transfer={true} placement="bottom">
              //     <span class="pointer">
              //       {params.column.title}
              //       <Icon type="md-search" size="14" />
              //     </span>
              //     <Input slot="content"
              //       v-model={this.detailHeader.companyName}
              //       search
              //       clearable
              //       onOn-search={value => {
              //         this.getData({ companyName: value, curPage: 1 })
              //       }}
              //     />
              //   </Poptip>
              // </span>
              <HeaderInput
                placeholder={params.column.title}
                v-model={this.detailHeader.companyName}
                title={params.column.title}
                clearable={false}
                onOn-search={value => {
                  this.getData({ username: value, curPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader.username = ''
                  this.getData()
                }}
              >
              </HeaderInput>
            )
          }
        },
        {
          title: '渠道类型',
          key: 'channelType',
          align: 'center',
          'sortable': true,
          width: 100,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom" transfer={true}>
                  <span class="cursor">
                    {params.column.title }
                    <Icon type="md-search" size="14" />
                  </span>
                  <div slot="content" style="white-space: normal">
                    <Select
                      placeholder={params.column.title }
                      slot="content"
                      filterable
                      size="small"
                      clearable
                      style="textAlign: left; width: 190px;"
                      v-model={this.detailHeader.channelType}
                      onOn-change={value => {
                        this.getData({ channelType: value, curPage: 1 })
                      }}
                    >
                      {(this.channelTypeList || []).map(item => {
                        return (
                          <Option value={item.name}>
                            {item.name}
                          </Option>
                        )
                      })}
                    </Select>
                  </div>
                </Poptip>
              </span>)
          }
        },
        {
          title: '网址',
          key: 'website',
          align: 'center',
          'sortable': true,
          minWidth: 160,
          renderHeader: (h, params) => {
            return (
              // <span>
              //   <Poptip transfer={true} placement="bottom">
              //     <span class="pointer">
              //       {params.column.title}
              //       <Icon type="md-search" size="14" />
              //     </span>
              //     <Input slot="content"
              //       v-model={this.detailHeader.website}
              //       search
              //       clearable
              //       onOn-search={value => {
              //         this.getData({ website: value, curPage: 1 })
              //       }}
              //     />
              //   </Poptip>
              // </span>
              <HeaderInput
                v-model={this.detailHeader.website}
                title={params.column.title}
                clearable={false}
                onOn-search={value => {
                  this.getData({ website: value, curPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader.website = ''
                  this.getData()
                }}
              >
              </HeaderInput>
            )
          }
        },
        {
          title: '归属',
          key: 'belongTo',
          align: 'center',
          'sortable': true,
          width: 160,
          renderHeader: (h, params) => {
            return (
              // <span>
              //   <Poptip transfer={true} placement="bottom">
              //     <span class="pointer">
              //       {params.column.title}
              //       <Icon type="md-search" size="14" />
              //     </span>
              //     <Input slot="content"
              //       v-model={this.detailHeader.belongTo}
              //       search
              //       clearable
              //       onOn-search={value => {
              //         this.getData({ belongTo: value, curPage: 1 })
              //       }}
              //     />
              //   </Poptip>
              // </span>
              <HeaderInput
                v-model={this.detailHeader.belongTo}
                title={params.column.title}
                clearable={false}
                onOn-search={value => {
                  this.getData({ belongTo: value, curPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader.belongTo = ''
                  this.getData()
                }}
              >
              </HeaderInput>
            )
          }
        },
        {
          title: '量级',
          key: 'numberLevel',
          align: 'center',
          'sortable': true,
          width: 120,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom" transfer={true}>
                  <span class="cursor">
                    {params.column.title }
                    <Icon type="md-search" size="14" />
                  </span>
                  <div slot="content" style="white-space: normal">
                    <Select
                      placeholder="量级"
                      slot="content"
                      filterable
                      size="small"
                      clearable
                      style="textAlign: left; width: 190px;"
                      v-model={this.detailHeader.numberLevel}
                      onOn-change={value => {
                        this.getData({ numberLevel: value, curPage: 1 })
                      }}
                    >
                      {(this.magnitudeList || []).map(item => {
                        return (
                          <Option value={item.tagName}>
                            {item.tagName}
                          </Option>
                        )
                      })}
                    </Select>
                  </div>
                </Poptip>
              </span>)
          }
        },
        {
          title: '云控',
          key: 'isCloud',
          align: 'center',
          'sortable': true,
          width: 120,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom" transfer={true}>
                  <span class="cursor">
                    {params.column.title }
                    <Icon type="md-search" size="14" />
                  </span>
                  <div slot="content" style="white-space: normal">
                    <Select
                      placeholder="云控"
                      slot="content"
                      filterable
                      size="small"
                      clearable
                      style="textAlign: left; width: 190px;"
                      v-model={this.detailHeader.isCloud}
                      onOn-change={value => {
                        this.getData({ isCloud: value, curPage: 1 })
                      }}
                    >
                      {(this.isCloudList || []).map(item => {
                        return (
                          <Option value={item.id}>
                            {item.name}
                          </Option>
                        )
                      })}
                    </Select>
                  </div>
                </Poptip>
              </span>)
          }
        },
        {
          title: '合同编码',
          key: 'contractNumber',
          align: 'center',
          'sortable': true,
          width: 120,
          renderHeader: (h, params) => {
            return (
              // <span>
              //   <Poptip transfer={true} placement="bottom">
              //     <span class="pointer">
              //       {params.column.title}
              //       <Icon type="md-search" size="14" />
              //     </span>
              //     <Input slot="content"
              //       v-model={this.detailHeader.contractNumber}
              //       search
              //       clearable
              //       onOn-search={value => {
              //         this.getData({ contractNumber: value, curPage: 1 })
              //       }}
              //     />
              //   </Poptip>
              // </span>
              <HeaderInput
                v-model={this.detailHeader.contractNumber}
                title={params.column.title}
                clearable={false}
                onOn-search={value => {
                  this.getData({ contractNumber: value, curPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader.contractNumber = ''
                  this.getData()
                }}
              >
              </HeaderInput>
            )
          }
        },
        {
          title: '签订时间',
          key: 'contractStartTime',
          align: 'center',
          'sortable': true,
          width: 130,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <div>
                      <DatePicker
                        transfer={false}
                        type="date"
                        format="yyyy/MM/dd"
                        v-model={this.detailHeader.contractStartTime}
                        editable={false}
                        placement="bottom-start"
                        placeholder="输入时间"
                        onOn-change={() => {
                          this.getData()
                        }}
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '合同状态',
          key: 'contractStatus',
          align: 'center',
          'sortable': true,
          width: 100,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom" transfer={true}>
                  <span class="cursor">
                    {params.column.title }
                    <Icon type="md-search" size="14" />
                  </span>
                  <div slot="content" style="white-space: normal">
                    <Select
                      placeholder="合同状态"
                      slot="content"
                      filterable
                      size="small"
                      clearable
                      style="textAlign: left; width: 190px;"
                      v-model={this.detailHeader.contractStatus}
                      onOn-change={value => {
                        this.getData({ contractStatus: value, curPage: 1 })
                      }}
                    >
                      {(this.contractStatuList || []).map(item => {
                        return (
                          <Option value={item.id}>
                            {item.name}
                          </Option>
                        )
                      })}
                    </Select>
                  </div>
                </Poptip>
              </span>)
          }
        },
        {
          title: '信息核对',
          key: 'checkInfo',
          align: 'center',
          'sortable': true,
          width: 100,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom" transfer={true}>
                  <span class="cursor">
                    {params.column.title }
                    <Icon type="md-search" size="14" />
                  </span>
                  <div slot="content" style="white-space: normal">
                    <Select
                      placeholder="信息核对"
                      slot="content"
                      filterable
                      size="small"
                      clearable
                      style="textAlign: left; width: 190px;"
                      v-model={this.detailHeader.type}
                      onOn-change={value => {
                        this.getData({ type: value, curPage: 1 })
                      }}
                    >
                      {(this.InformCheckList || []).map(item => {
                        return (
                          <Option value={item.id}>
                            {item.name}
                          </Option>
                        )
                      })}
                    </Select>
                  </div>
                </Poptip>
              </span>)
          }
        },
        {
          title: '域名',
          key: 'domainName',
          align: 'center',
          'sortable': true,
          width: 120,
          renderHeader: (h, params) => {
            return (
              // <span>
              //   <Poptip transfer={true} placement="bottom">
              //     <span class="pointer">
              //       {params.column.title}
              //       <Icon type="md-search" size="14" />
              //     </span>
              //     <Input slot="content"
              //       v-model={this.detailHeader.domainName}
              //       search
              //       clearable
              //       onOn-search={value => {
              //         this.getData({ domainName: value, curPage: 1 })
              //       }}
              //     />
              //   </Poptip>
              // </span>
              <HeaderInput
                v-model={this.detailHeader.domainName}
                title={params.column.title}
                clearable={false}
                onOn-search={value => {
                  this.getData({ domainName: value, curPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader.domainName = ''
                  this.getData()
                }}
              >
              </HeaderInput>
            )
          }
        },
        {
          title: '录入时间',
          key: 'inputTime',
          align: 'center',
          'sortable': true,
          width: 120,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <div>
                      <DatePicker
                        transfer={false}
                        type="date"
                        format="yyyy/MM/dd"
                        v-model={this.detailHeader.inputTime}
                        editable={false}
                        placement="bottom-start"
                        placeholder="输入时间"
                        onOn-change={
                          () => {
                            this.getData()
                          }
                        }
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '未合作原因',
          key: 'failCooperationCause',
          align: 'center',
          'sortable': true,
          width: 160,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom" transfer={true}>
                  <span class="cursor">
                    {params.column.title }
                    <Icon type="md-search" size="14" />
                  </span>
                  <div slot="content" style="white-space: normal">
                    <Select
                      placeholder="未合作原因"
                      slot="content"
                      filterable
                      size="small"
                      clearable
                      style="textAlign: left; width: 190px;"
                      v-model={this.detailHeader.failCooperationCause}
                      onOn-change={value => {
                        this.getData({ failCooperationCause: value, curPage: 1 })
                      }}
                    >
                      {(this.reasonList || []).map(item => {
                        return (
                          <Option value={item.tagName}>
                            {item.tagName}
                          </Option>
                        )
                      })}
                    </Select>
                  </div>
                </Poptip>
              </span>)
          }
        },
        {
          title: '流失反馈',
          key: 'runOffCallback',
          align: 'center',
          'sortable': true,
          width: 160,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom" transfer={true}>
                  <span class="cursor">
                    {params.column.title }
                    <Icon type="md-search" size="14" />
                  </span>
                  <div slot="content" style="white-space: normal">
                    <Select
                      placeholder="流失反馈"
                      slot="content"
                      filterable
                      size="small"
                      clearable
                      style="textAlign: left; width: 190px;"
                      v-model={this.detailHeader.failCooperationCause}
                      onOn-change={value => {
                        this.getData({ failCooperationCause: value, curPage: 1 })
                      }}
                    >
                      {(this.loseBackList || []).map(item => {
                        return (
                          <Option value={item.tagName}>
                            {item.tagName}
                          </Option>
                        )
                      })}
                    </Select>
                  </div>
                </Poptip>
              </span>)
          }
        },
        {
          title: '操作',
          slot: 'action',
          key: 'action',
          align: 'center',
          alwaysShow: true,
          width: 200,
          fixed: 'right'
        }
      ],
      channelData: [],
      reasonList: [], // 为合作原因
      loseBackList: [], // 流失反馈
      magnitudeList: [], // 量级
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
    }
  },
  mounted () {
    this.checkBackLog()// 判断是否从待办跳来的
    this.getLIst()// 获取下拉列表
  },
  methods: {
    handleFullScreen () {
      this.$emit('update:isFullScreen', !this.isFullScreen)
      sessionStorage.setItem('bussiness-smart', JSON.stringify(!this.isFullScreen))
    },
    setTableHeight () {
      this.$emit('on-set-table-height')
    },
    // 判断是否从待办跳来的
    checkBackLog () {
      let query = this.$route.query.id || ''
      // var arr = Object.keys(query)
      // 如果路由参数为空，不是待办来的，正常请求数据接口
      if (query.length === 0) {
        this.getData()// 获取数据
      } else {
        this.checkBackLogStatus()// 检查代办状态
      }
    },
    // 检查代办状态
    checkBackLogStatus () {
      let sendData = {
        type: this.$route.query.type,
        channelId: this.$route.query.channelId,
        backLogId: this.$route.query.id
      }
      this.$axios({
        url: biUrl + '/backlog/checkBackLogStatus',
        data: $qs.stringify(sendData),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            let status = resp.data.data
            if (status) {
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
    // 获取下拉列表
    getLIst () {
      // 获取未合作原因
      this.$axios({
        url: biUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({ tagId: '008' })
      })
        .then(res => {
          if (res.data.code === 10000) {
            let data = res.data.data
            this.reasonList = data
          }
        })
        .catch(err => {
          console.log(err)
        })
      // 获取流失反馈
      this.$axios({
        url: biUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({ tagId: '009' })
      })
        .then(res => {
          if (res.data.code === 10000) {
            let data = res.data.data
            this.loseBackList = data
          }
        })
        .catch(err => {
          console.log(err)
        })
      // 获取量级
      this.$axios({
        url: biUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({ tagId: '001001' })
      })
        .then(res => {
          if (res.data.code === 10000) {
            let data = res.data.data
            this.magnitudeList = data
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 日志
    getLog () {
      this.$axios({
        url: biUrl + '/channel/showLog',
        method: 'post'
      }).then(res => {
        this.channelLog = res.data.data
      })
    },
    // 获取表头搜索有效参数
    getSendData (data) {
      let keys = Object.keys(this.detailHeader)
      let me = this
      let sendData = {}
      this.detailHeader.userId = this.$store.state.user.userId
      this.detailHeader.tagName = this.$route.query.tagName || sessionStorage.channelTabs

      // this.detailHeader.firstType = this.$route.query.type
      // this.detailHeader.firstId = this.$route.query.channelId
      // 非空字符串
      let hasValueKeys = keys.filter(e => {
        return me.detailHeader[e] !== ''
      })

      // 拷贝到sendData
      for (let i = 0; i < hasValueKeys.length; i++) {
        let key = hasValueKeys[i]
        let value = me.detailHeader[key]
        if (value == null) {
          continue
        }
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
      if (this.detailHeader.contractStartTime) {
        sendData.contractStartTime = moment(sendData.contractStartTime).format('YYYY-MM-DD')
      }
      // 录入时间
      if (this.detailHeader.inputTime) {
        sendData.inputTime = moment(sendData.inputTime).format('YYYY-MM-DD')
      }

      //   delete sendData.timeRange
      delete sendData.totalCount
      sendData = Object.assign(sendData, data)
      // 如果排序清空，不需要带排序条件
      if (sendData.desc === 'normal') {
        delete sendData.orderby
        delete sendData.desc
      }
      this.detailHeader.currPage = sendData.currPage
      return sendData
    },
    // 获取数据
    getData (data) {
      let sendData = this.getSendData(data)
      this.$axios({
        url: biUrl + '/channel/searchByCondition',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          let data = res.data.data
          this.channelData = data.result
          this.detailHeader.currPage = data.currPage
          this.detailHeader.pageSize = data.pageSize
          this.detailHeader.totalCount = data.totalSize

          this.headCount = data.countInfo

          this.$emit('update-count-info', this.headCount)
          // console.log(this.channelData[0].deleteShow)
          this.setTableHeight()
          // this.$Message.info('数据获取成功')
        })
        .catch(err => {
          console.error(err)
          this.$Notice.warning({
            title: '数据异常，请联系技术人员'
          })
        })
    },
    // 排序
    handleSort (column) {
      // 降序  "desc"
      let orderby = column.key
      let desc = column.order
      this.getData({ orderby, desc })
      this.detailHeader.orderby = column.key
      this.detailHeader.desc = column.order
    },
    // 刷新
    reload (data) {
      let initData = {
        userId: this.$store.state.user.userId, // 当前用户
        backLogId: this.$route.query.id || -1, // 代办
        tagName: this.$route.query.tagName || sessionStorage.channelTabs, // 标签页
        // firstType: '', // 两人两遍置顶
        // firstId: '',
        query: '', // 模糊搜索
        channelName: '', // 渠道名称
        marketResponsibleName: null, // 市场
        channelSource: '', // 来源
        companyName: '', // 公司名称
        contractStatus: '', // 合同状态
        type: '', // 信息核对
        runOffCallback: '', // 流失反馈
        belongTo: '', // 归属
        companyType: '', // 公司/个人
        website: '', // 网址
        channelType: '', // 渠道类型
        isCloud: '', // 是否云控
        inputTime: '', // 录入时间
        contractNumber: '', // 合同编号
        // timeRange: [], // 时间范围
        contractStartTime: '', // 合同签订时间(不显示)
        contractEndTime: '', // 合同结束时间(不显示)
        totalCount: 0,
        pageSize: 20,
        currPage: 1
      }
      this.detailHeader = Object.assign(initData, data)
      return this.detailHeader
    },
    // 编辑
    edit (row) {
      this.$router.push({
        name: 'channelEdit',
        query: {
          channelId: row.channelId,
          type: row.type,
          relatedId: row.relatedId
        }
      })
    },
    // 详情
    detail (row) {
      this.$router.push({
        name: 'channelDetail',
        query: {
          channelId: row.channelId,
          type: row.type,
          relatedId: row.relatedId
        }
      })
    },
    // 删除
    del (row) {
      let sendData = {
        userId: this.$store.state.user.userId,
        channelId: row.channelId,
        type: row.type,
        backLogId: this.$route.query.id || -1,
        tagName: sessionStorage.channelTabs,
        router: 'business/channel',
        channelName: row.channelName
      }
      this.$Modal.confirm({
        title: '提示',
        content: `是否对“${row.channelName}”进行删除`,
        onOk: () => {
          this.$axios({
            url: biUrl + '/channel/delete',
            method: 'post',
            data: $qs.stringify(sendData)
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.$Message.success(res.data.msg)
                this.getData({
                  channelId: row.channelId
                })
              } else {
                this.$Message.error(res.data.msg)
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    // 终止
    stop (row) {
      console.log(row)
      let sendData = {
        userId: this.$store.state.user.userId,
        channelId: row.channelId,
        type: row.type,
        backLogId: this.$route.query.id || -1,
        tagName: 'cooperationed',
        router: 'business/channel',
        contractId: row.contractId,
        channelName: row.channelName
      }
      this.$Modal.confirm({
        title: '提示',
        content: `是否终止“${row.channelName}”`,
        onOk: () => {
          this.$axios({
            url: biUrl + '/channel/terminate',
            method: 'post',
            data: $qs.stringify(sendData)
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.$Message.success(res.data.data)
                this.getData({
                  channelId: row.channelId
                })
              } else {
                this.$Message.error(res.data.msg)
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },

    getSourceList () {
      if (this.sourceList.length > 0) return

      // this.$axios({
      //   url: proBaseUrl + '/busiConfig/listConfig',
      //   method: 'post',
      //   data: $qs.stringify({ tagId: '002001' })
      // }).then(res => {
      //   if (res.data.code === 10000) {
      //     let data = res.data.data
      //     this.sourceList = data
      //   }
      // }).catch(err => {
      //   console.log(err)
      // })
      this.$axios({
        url: biUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({ tagId: '002002' })
      })
        .then(res => {
          if (res.data.code === 10000) {
            let data = res.data.data
            this.sourceList = data
            //  this[list]
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
