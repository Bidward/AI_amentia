<template>
    <div>
        <div class="level-three">
            <Button v-if="permiss.create" type="primary" @click="showAdd=true">新增</Button>
            <div style="float: right">
                <Input class="fuzzySearch"
                    placeholder="输入信息名称/渠道"
                    style="width:200px;margin-right:5px;"
                    v-model.trim="detailHeader.query"
                    @on-enter="()=>{detailHeader.currPage=1;getData()}"
                >
                    <Icon
                        class="pointer"
                        @click="()=>{detailHeader.currPage=1;getData()}"
                        type="ios-search"
                        slot="suffix"
                    />
                    <Icon
                        class="pointer"
                        type="ios-close-circle-outline"
                        slot="suffix"
                        v-show="detailHeader.query"
                        @click="()=>{reload(0);getData()}"
                    />
                </Input>
                <Button
                  @click="handleFullScreen"
                  :icon="isFullScreen ? 'md-contract' : 'md-expand'"
                />
                <Button icon="ios-loading" @click="()=>{reload(0);getData()}"></Button>
                <TableHeaderSetting
                    :totalTableHeader="infoBankHeader"
                    :tableHeader.sync="tableHeader"
                    key="infoBankTabelHeader"
                    localKey="infoBankTabelHeader"
                    :defaultList="defaultList"
                />
            </div>
        </div>
        <Table
            :loading="tableLoading"
            :columns="tableHeader"
            :data="infoBankData"
            :height="tableHeight"
            border
            @on-sort-change="handleSort"
        >
            <template slot-scope="{ row, index }" slot="action">
                <Button v-if="permiss.edit" type="primary" size="small" class="marginRight3px" @click="edit(row)">编辑</Button>
                <Button class="simple marginRight3px" size="small" @click="detail(row)">详情</Button>
            </template>
        </Table>
        <div class="clearfix tableFooter">
            <Page
                :total="detailHeader.totalCount"
                :page-size="detailHeader.pageSize"
                :current="detailHeader.currPage"
                size="small"
                show-total
                show-sizer
                show-elevator
                @on-change="(currPage)=>{detailHeader.currPage=currPage;getData()}"
                @on-page-size-change="(pageSize)=>{detailHeader.pageSize=pageSize;detailHeader.currPage=1;getData()}"
                style="float:right;"
            />
        </div>
        <OpLogs :task-logs="Log" @click.native="getLog"></OpLogs>
        <div v-if="showAdd">
            <Modal
                v-model="showAdd"
                title="新增信息"
                @on-ok="esure('infoForm')"
                :mask-closable="false"
                :loading="loading"
                @on-cancel="cancel"
            >
                <Form ref="infoForm" :label-width="80" :model="infoForm" :rules="rules">
                    <FormItem label="信息名称:" prop="infoName">
                        <Input
                            v-model.trim="infoForm.infoName"
                            placeholder="请输入信息名称"
                            maxlength="200"
                            show-word-limit
                        />
                    </FormItem>
                    <FormItem label="渠道:" prop="channel">
                        <Input
                            v-model.trim="infoForm.channel"
                            placeholder="请输入渠道"
                            maxlength="200"
                            show-word-limit
                        />
                    </FormItem>
                    <FormItem label="网址:" prop="webSite">
                        <Input
                            v-model.trim="infoForm.webSite"
                            placeholder="请输入网址"
                            maxlength="500"
                            show-word-limit
                        />
                    </FormItem>
                    <FormItem label="发布日期:" prop="releaseDate">
                        <DatePicker
                            type="date"
                            placeholder="请选择发布日期"
                            v-model.trim="infoForm.releaseDate"
                            style="width: 100%;"
                        ></DatePicker>
                    </FormItem>
                    <FormItem label="文件上传:" prop="attachment">
                        <Upload
                            class="bzUpload"
                            multiple
                            :max-size="20480"
                            name="fileData"
                            :on-success="(value)=> uploadFileSuccess(value)"
                            :on-exceeded-size="uploadFileError"
                            :action="staticUrl+'/index.php'"
                            ref="uploadFile"
                            :on-remove="handleRemove"
                        >
                            <Button icon="ios-cloud-upload-outline">单个文件不能超过20MB</Button>
                        </Upload>
                        <!-- <span
                            class="file"
                            v-for="(item,index) in infoForm.attachmentList"
                            :key="index"
                        >
                            <a style="color:#515a6e" :href="item.url"  :download="item.name">{{item.name}}</a>
                            <span class="del" @click="removeFile(index)">X</span>
                        </span>-->
                    </FormItem>
                </Form>
            </Modal>
        </div>
    </div>
</template>
<script>
import TableHeaderSetting from '_c/table-header-setting'
import { HeaderInput, HeaderSelect } from '_c/table-header-search'
import OpLogs from '../../op-log'
import { staticUrl, prUrl } from '@/api/base.js'
import mixin from './mixin'
import moment from 'moment'
export default {
  name: 'pending',
  components: {
    TableHeaderSetting,
    HeaderInput,
    HeaderSelect,
    OpLogs
  },
  mixins: [mixin],
  data () {
    return {
      staticUrl,
      loading: true,
      tableLoading: true,
      showAdd: false,
      detailHeader: {
        userId: this.$store.state.user.userId,
        query: '', // 模糊搜索
        infoName: '', // 信息名称
        releaseDate: '', // 日期
        website: '', // 网址
        channel: '', // 渠道
        infoStatus: 0, // 列表
        orderBy: '', // 根据什么字段排序
        order: 'normal', // 排序的方式
        totalCount: 0,
        pageSize: 20,
        currPage: 1
      },
      Log: [], // 日志
      defaultList: [
        'index',
        'infoName',
        'action',
        'releaseDate',
        'website',
        'channel'
      ], // 默认表头
      // 表头
      infoBankHeader: [
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center',
          key: 'index',
          alwaysShow: true
        },
        {
          title: '日期',
          key: 'releaseDate',
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" />
                  </span>
                  <div slot="content">
                    <div>
                      <DatePicker
                        onOn-change={() => {
                          this.detailHeader.currPage = 1
                          this.getData()
                        }}
                        type="date"
                        v-model={this.detailHeader.releaseDate}
                        placement="bottom-start"
                        placeholder="输入时间"
                      />
                    </div>
                  </div>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '信息名称',
          align: 'center',
          key: 'infoName',
          minWidth: 200,
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
          title: '网址',
          align: 'center',
          key: 'website',
          minWidth: 200,
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
          title: '渠道',
          align: 'center',
          key: 'channel',
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
          title: '操作',
          slot: 'action',
          key: 'action',
          align: 'center',
          alwaysShow: true
        }
      ],
      tableHeader: [], // 表头
      infoBankData: [], // 数据
      infoForm: {
        infoName: '', // 信息名称
        channel: '', // 渠道
        webSite: '', // 网址
        releaseDate: '', // 发布日期
        attachmentList: [] // 附件
      },
      rules: {
        infoName: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          }
        ],
        channel: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          }
        ],
        webSite: [
          // {
          //   required: true,
          //   message: '必填',
          //   trigger: 'blur'
          // }
        ],
        releaseDate: [
          // {
          //   required: true,
          //   message: '必填'
          //   // trigger: "blur"
          // }
        ]
      }
    }
  },
  computed: {
    permiss () {
      return this.$store.state.user.userpermission.projectReportInfo
    }
  },
  mounted () {
    this.setTableHeight()
  },
  methods: {
    // 新增
    esure (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let date = this.infoForm.releaseDate
          if (date) {
            date = moment(this.infoForm.releaseDate).format(
              'YYYY-MM-DD'
            )
          }
          let sendData = {
            infoName: this.infoForm.infoName,
            website: this.infoForm.webSite,
            channel: this.infoForm.channel,
            releaseDate: date,
            attachmentList: this.infoForm.attachmentList,
            userId: this.$store.state.user.userId
          }
          this.$axios({
            url: prUrl + '/info/addInfo',
            method: 'post',
            data: sendData
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.showAdd = false
              this.clearModel()
              this.getData()
            } else {
              this.$Message.error(res.data.msg)
            }
            // this.loading = false;
            // this.$nextTick(() => {
            //     this.loading = true;
            // });
          })
          // .catch(err => {
          //   this.$Notice.warning({
          //     title: '数据异常，请联系技术人员'
          //   })
          // })
        }
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      })
    },
    // 取消
    cancel () {
      this.clearModel()
    },
    // 清空弹窗内容
    clearModel () {
      // this.$refs.uploadFile.fileList.splice(0);
      this.infoForm.attachmentList = []
      this.infoForm.infoName = ''
      this.infoForm.channel = ''
      this.infoForm.webSite = ''
      this.infoForm.releaseDate = ''
      //  = {
      //   infoName: '', // 信息名称
      //   channel: '', // 渠道
      //   webSite: '', // 网址
      //   releaseDate: '', // 发布日期
      //   attachment: [] // 附件x
      // }
    },
    // 附件上传成功
    uploadFileSuccess (response, file, fileList) {
      if (response.rel === true) {
        // 文件上传展示
        this.infoForm.attachmentList.push({
          url: staticUrl + '' + response.url,
          name: response.filename
        })
      } else {
        console.error(response.msg)
      }
    },
    // 上传文件超过20M
    uploadFileError (response, file, fileList) {
      if (response.size > 20480) {
        this.$Message.warning('文件上传失败 大小超过20M')
      }
    },
    removeFile (index) {
      this.infoForm.attachmentList.splice(index, 1)
    },
    handleRemove (file, fileList) {
      console.log(file)
      if (!fileList.length) {
        this.infoForm.attachmentList = []
      } else {
        let list = []
        fileList.forEach(file => {
          if (file.response) {
            list.push({
              url: file.response.url,
              name: file.response.filename
            })
          }
        })
        this.infoForm.attachmentList = list
      }
    }
  }
}
</script>

<style lang="css" scoped>
.fuzzySearch>>>span {
  margin: 0 4px;
}
</style>
<style scoped>
.file {
    display: block;
    color: #515a6e;
    text-indent: 1em;
    margin-top: 6px;
    border-radius: 5px;
    width: 80%;
    cursor: pointer;
}
.file:hover {
    background: #dddddd;
}
.del {
    float: right;
    position: relative;
    right: 8px;
    cursor: pointer;
    color: #677271;
    /* top: -6px; */
}
</style>
