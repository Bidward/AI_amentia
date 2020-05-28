<template>
  <div class="viewWrapper viewWrapperNoTabs" id="editExtension">
    <Form ref="editExtension" :label-width="110" :model="extensionData" :rules="validate">
      <div class="selection" v-if="error.length>0">
        <h3>错误信息</h3>
        <Row>
          <Col span="12">
            <FormItem v-for="(err,index) in error" :key="index" class="low">
              <h4 class="red">{{err}}</h4>
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection">
        <h3>基础信息</h3>
        <Row>
          <Col span="12">
            <FormItem label="推广组" prop="groupName">
              <Input :disabled="isEdit" v-model="extensionData.groupName" class="wd80" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="责任人" prop="owner">
              <Select :disabled="isEdit" filterable v-model="extensionData.owner" class="wd80">
                <Option
                  v-for="person in employees"
                  :value="person.nickname"
                  :key="person.id"
                >{{person.nickname}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="产品名" prop="softName">
              <Input
                :disabled="isEdit"
                v-model="extensionData.softName"
                @on-blur="getSoftCategoryBySoftName"
                class="wd80"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="产品类型" prop="category">
              <Select :disabled="isEdit" filterable v-model="extensionData.category" class="wd80">
                <Option
                  v-for="category in softCategoryAllList"
                  :value="category.catname"
                  :label="category.catname"
                  :key="category.catname"
                />
              </Select>
              <!-- <Input :disabled="isEdit" v-model="extensionData.category" class="wd80" /> -->
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="否定关键词" prop="phraseKeywords">
              <Input
                type="textarea"
                :rows="10"
                v-model="extensionData.phraseKeywords"
                class="wd80"
              />
              <span class="tip">
                <span :class="{red:phraseRowLength>200}">{{phraseRowLength}}</span>/200
              </span>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="精确否定关键词" prop="exactKeywords">
              <Input type="textarea" :rows="10" v-model="extensionData.exactKeywords" class="wd80" />
              <span class="tip">
                <span :class="{red:exactRowLength>400}">{{exactRowLength}}</span>/400
              </span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="备注" prop="sum">
              <Input type="textarea" :rows="5" v-model="extensionData.sum" class="wd80" />
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection" v-if="!isEdit">
        <h3>一般创意</h3>
        <Row>
          <Col span="12">
            <FormItem label="创意标题" prop="title">
              <Input v-model="extensionData.title" class="wd80" id="title">
                <span class="pointer" slot="append" @click="appendGroupName('title')">{ }</span>
              </Input>
              <span class="tip">
                <span
                  :class="{red:getStringLength(extensionData.title)>50||getStringLength(extensionData.title)<40}"
                >{{ getStringLength(extensionData.title)}}</span>/40~50
              </span>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="创意描述1" prop="description1">
              <Input v-model="extensionData.description1" id="description1" class="wd80">
                <span class="pointer" slot="append" @click="appendGroupName('description1')">{ }</span>
              </Input>
              <span class="tip">
                <span
                  :class="{red:getStringLength(extensionData.description1)>80||getStringLength(extensionData.description1)<64}"
                >{{getStringLength(extensionData.description1)}}</span>/64~80
              </span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="创意描述2" prop="description2">
              <Input v-model="extensionData.description2" id="description2" class="wd80">
                <span class="pointer" slot="append" @click="appendGroupName('description2')">{ }</span>
              </Input>
              <span class="tip">
                <span
                  :class="{red:getStringLength(extensionData.description2)>80||getStringLength(extensionData.description2)<64}"
                >{{getStringLength(extensionData.description2)}}</span>/64~80
              </span>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="链接网址" prop="destinationUrl" v-if="false">
              <Input
                :disabled="isEdit"
                v-model="extensionData.destinationUrl"
                @on-blur="setDisPlayUrl"
                class="wd80"
              ></Input>
            </FormItem>
            <FormItem label="软件ID" prop="softId">
              <Input :disabled="isEdit" v-model="extensionData.softId" class="wd80"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="显示网址" prop="displayUrl" v-if="false">
              <Input :disabled="isEdit" v-model="extensionData.displayUrl" class="wd80" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="创意配图" prop="picUrl">
              <viewer class="imgBox" v-for="(pic,index) in extensionData.picUrl" :key="index">
                <Icon class="delImg" size="19" type="ios-close" @click="delImg('picUrl',index)" />
                <img :src="pic" />
              </viewer>
              <cropper
                v-if="!isEdit"
                :key="'picUrl'"
                @on-success="(value)=>uploadSuccess('picUrl',0,value)"
                :showCropper.sync="showCropper"
              />
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection" v-if="!isEdit">
        <h3>导航创意</h3>
        <Row>
          <Col span="7" v-for="(linkItem,index) in extensionData.guides" :key="index">
            <FormItem
              :label="`导航${index+1}标签`"
              :prop="`guides[${index}].title`"
              :rules="{required:true,validator:validateLength,maxLength:8,minLength:4,trigger: 'blur'}"
            >
              <Input v-model="linkItem.title" class="wd60"></Input>
              <span class="tip">
                <span
                  :class="{red:getStringLength(linkItem.title)<4||getStringLength(linkItem.title)>8}"
                >{{getStringLength(linkItem.title)}}</span>/4~8
              </span>
            </FormItem>
          </Col>
        </Row>
        <!-- 有多少个子链，就有多少行 -->
        <Row v-for="(links,index1) in extensionData.guides[0].links" :key="index1">
          <!-- 第几列 只有三列 -->
          <Col span="7" v-for="(linkItem,index2) in extensionData.guides" :key="index2">
            <FormItem
              :prop="`guides[${index2}].links[${index1}].text`"
              :label="`子链${index1+1}`"
              :rules="{required:index1<3?true:false,validator:validateLength,maxLength:16,minLength:3,trigger: 'blur'}"
            >
              <Input v-model="linkItem.links[index1].text" class="wd60"></Input>
              <span class="tip">
                <span
                  :class="{red:getStringLength(linkItem.links[index1].text)<3||getStringLength(linkItem.links[index1].text)>16}"
                >{{getStringLength(linkItem.links[index1].text)}}</span>/3~16
              </span>
            </FormItem>
          </Col>
          <Col v-if="index1>2" span="1">
            <Button type="error" @click="delGuides(index1)">删除</Button>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <Button long type="primary" @click="addGuides">新增子链</Button>
          </Col>
        </Row>
      </div>
      <div class="selection" v-if="!isEdit">
        <h3>橱窗创意</h3>
        <Row>
          <Col span="6" v-for="(item,index) in extensionData.windows" :key="index">
            <FormItem
              label="商品名称"
              :prop="`windows[${index}].title`"
              :rules="{required:true,validator:validateLength,maxLength:16,minLength:2,trigger: 'blur'}"
            >
              <Input v-model="item.title"></Input>
              <span class="tip">
                <span
                  :class="{red:getStringLength(item.title)<2||getStringLength(item.title)>16}"
                >{{getStringLength(item.title)}}</span>/2~16
              </span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6" v-for="(item,index) in extensionData.windows" :key="index+4">
            <FormItem
              label="商品描述"
              :prop="`windows[${index}].description`"
              :rules="{required:true,validator:validateLength,maxLength:16,minLength:2,trigger: 'blur'}"
            >
              <Input v-model="item.description" />
              <span class="tip">
                <span
                  :class="{red:getStringLength(item.description)<2||getStringLength(item.description)>16}"
                >{{getStringLength(item.description)}}</span>/2~16
              </span>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="!isEdit">
          <Col span="6" v-for="(item,index2) in extensionData.windows" :key="index2+8">
            <FormItem
              :prop="`windows[${index2}].imageurl`"
              :rules="{required:true,message:'图片必上传',trigger:'blur'}"
            >
              <div v-if="!item.imageurl">
                <cropper
                  :key="index2"
                  @on-success="(value)=> uploadSuccess('imageurl',index2, value)"
                  :showCropper.sync="showCropper"
                />
              </div>
              <viewer v-else class="imgBox">
                <Icon class="delImg" size="19" @click="delImg('windows',index2)" type="ios-close" />
                <img :src="item.imageurl" />
              </viewer>
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection" v-if="!isEdit">
        <h3>预览</h3>
        <div class="preView">
          <h4 class="title" v-html="showTitle"></h4>
          <div class="clearfix normal">
            <img class="fl picUrl" :src="extensionData.picUrl[0]" />
            <div class="fl description">
              <p class="text" v-html="showDescription1"></p>
              <p class="text" v-html="showDescription2"></p>
              <p>
                <span>{{extensionData.displayUrl | replaceHttp}}-</span>
                <span>{{toDay}}</span>
                <span class="ad">广告</span>
              </p>
            </div>
          </div>
          <div class="link clearfix">
            <p v-for="(linkItem,index) in extensionData.guides" :key="index">
              <span class="title" v-show="linkItem.title">{{linkItem.title}}：</span>
              <span
                class="text"
                v-for="(linksItem,index2) in linkItem.links"
                :key="index2"
              >{{linksItem.text}}</span>
            </p>
          </div>
          <ul class="window clearfix">
            <li class="fl" v-for="(item,index) in extensionData.windows" :key="index">
              <img class="windowpic" :src="item.imageurl" />
              <p class="title">{{item.title}}</p>
              <p class="description">{{item.description}}</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="selection saveBox">
        <div class="save">
          <Button class="btns" @click="closeRouter">取消</Button>
          <Button class="btns" type="primary" @click="submit()">保存</Button>
        </div>
      </div>
    </Form>
  </div>
</template>
<script>
import { staticUrl, semUrl } from '@/api/base.js'
import { getCharLength } from '../../tools'
import moment from 'moment'
import cropper from './cropper.vue'
export default {
  name: 'editShortGroup', // 新增和编辑推广组
  components: {
    cropper
  },
  data () {
    return {
      toDay: moment().format('YYYY-MM-DD'),
      getCharLength: getCharLength,
      extensionDataBak: {}, // 备份
      showCropper: false, // 展示裁剪框
      error: [], // 错误信息
      templateList: [], // 模板列表
      softCategoryAllList: [], // 软件
      extensionData: {
        groupName: '', // 推广组名称
        owner: '', // 责任人
        softName: '', // 产品名
        category: '', // 产品类型
        title: '', // 创意标题
        description1: '', // 创意描述1
        description2: '', // 创意描述2
        destinationUrl: '', // 链接网址
        softId: '',
        displayUrl: '', // 显示网址
        picUrl: [], // 创意图片
        phraseKeywords: '', // 否定关键词
        exactKeywords: '', // 精确否定关键词
        // 导航样式
        guides: [
          {
            // 导航标签
            title: '',
            // 四个子链
            links: [{ text: '' }, { text: '' }, { text: '' }]
          },
          {
            title: '',
            links: [{ text: '' }, { text: '' }, { text: '' }]
          },
          {
            title: '',
            links: [{ text: '' }, { text: '' }, { text: '' }]
          }
        ],
        // 橱窗
        windows: [
          {
            title: '',
            description: '',
            imageurl: ''
          },
          {
            title: '',
            description: '',
            imageurl: ''
          },
          {
            title: '',
            description: '',
            imageurl: ''
          },
          {
            title: '',
            description: '',
            imageurl: ''
          }
        ],
        userInfo: {
          userId: this.userId,
          nickname: this.nickname
        }
      },
      isEdit: false, // 区分是编辑还是新增
      groupId: -1,
      validate: {
        groupName: [
          {
            required: true,
            trigger: 'change',
            maxLength: 32,
            validator: this.validateLength
          }
        ],
        owner: [{ required: true, message: '必填', trigger: 'change' }],
        softName: [{ required: true, message: '必填', trigger: 'blur' }],
        category: [{ required: true, message: '必填', trigger: 'blur' }],
        phraseKeywords: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let arr = value.split('\n')
              arr.some((e, index) => {
                if (getCharLength(e) > 40) {
                  callback(new Error(`第${index + 1}行超过40个字`))
                  return true
                }
              })
              if (this.phraseRowLength > 200) {
                callback(new Error('最多200行'))
              } else {
                callback()
              }
            }
          }
        ],
        exactKeywords: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let arr = value.split('\n')
              arr.some((e, index) => {
                if (getCharLength(e) > 40) {
                  callback(new Error(`第${index + 1}行超过40个字`))
                  return true
                }
              })
              if (this.exactRowLength > 400) {
                callback(new Error('最多400行'))
              } else {
                callback()
              }
            }
          }
        ],
        title: [
          {
            required: true,
            maxLength: 50,
            minLength: 40,
            validator: this.validateLength,
            trigger: 'blur'
          }
          // {
          //   validator: (rule, value, callback) => {
          //     let res = value.match(/[{}]/g)
          //     if (!res || value.match(/[{}]/g).length < 4) {
          //       callback(new Error('通配符不能少于两组'))
          //     } else {
          //       callback()
          //     }
          //   },
          //   trigger: 'blur'
          // }
        ],
        description1: [
          {
            required: true,
            trigger: 'blur',
            validator: this.validateLength,
            minLength: 60,
            maxLength: 80
          }
        ],
        description2: [
          {
            required: true,
            validator: this.validateLength,
            minLength: 60,
            maxLength: 80,
            trigger: 'blur'
          }
        ],
        destinationUrl: [
          {
            required: false,
            message: '必须是一个url',
            trigger: 'blur'
          }
        ],
        softId: [
          {
            required: true,
            message: '软件ID必填',
            trigger: 'blur'
          }
        ],
        displayUrl: [
          {
            required: false,
            type: 'url',
            message: '必须是一个url',
            trigger: 'change'
          }
        ],
        picUrl: [
          {
            required: true,
            type: 'array',
            message: '图片必填',
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted () {
    // 获取当前登录用户信息
    // 编辑，需要重新获取数据
    // 获取软件分类列表
    let extensionData = localStorage.getItem('extensionData1')
    if (extensionData) {
      this.extensionData = JSON.parse(extensionData)
    }
    this.getSoftCategoryAll()
    if (Number(this.$route.params.groupId)) {
      this.isEdit = true
      let groupId = this.$route.params.groupId
      this.groupId = groupId
      this.getData(groupId)
    } else {
      // 获取通用否定关键词
      this.getNagativeWords()
    }
    // 录入人默认为当前登录用户
    this.extensionData.owner = this.nickname
    // 备份页面初始数据
    this.extensionDataBak = JSON.parse(JSON.stringify(this.extensionData))
  },
  filters: {
    replaceHttp (v) {
      return v.replace('https://', '').replace('http://', '')
    }
  },
  methods: {
    // 获取否定关键词列表
    getNagativeWords () {
      this.$axios({
        url: semUrl + '/group/getNagativeWords',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.extensionData.phraseKeywords = res.data.content.join('\n')
          this.extensionDataBak = JSON.parse(
            JSON.stringify(this.extensionData)
          )
        }
      })
    },
    // 根据软件名获取软件类别
    getSoftCategoryBySoftName () {
      const title = this.extensionData.softName
      this.$axios({
        url: semUrl + '/PhraseGroup/getSoftCategory',
        method: 'get',
        params: { title }
      }).then(res => {
        const { code, data } = res.data
        if (code === 10000) {
          this.extensionData.category = data.category || ''
        }
      })
    },
    // 获取所有类别
    getSoftCategoryAll () {
      this.$axios({
        url: semUrl + '/PhraseGroup/getSoftCategoryAll',
        method: 'get'
      }).then(res => {
        const { code, data } = res.data
        if (code === 10000) {
          this.softCategoryAllList = data.list
        }
      })
    },
    // 回显数据
    getData (id) {
      this.$axios({
        url: semUrl + '/PhraseGroup/showGroup',
        method: 'get',
        params: { groupId: id }
      }).then(res => {
        let content = res.data.content
        let error =
          res.data.error && res.data.error.length > 0 ? res.data.error : []
        this.error = error
        content.phraseKeywords = arrToRow(content.phraseKeywords)
        content.exactKeywords = arrToRow(content.exactKeywords)
        this.extensionData = content

        this.extensionDataBak = JSON.parse(JSON.stringify(this.extensionData))
        function arrToRow (v) {
          return v.replace(/,/g, '\n')
        }
      })
    },
    // 上传图片
    uploadSuccess (type, index, res, file, fileList) {
      if (res.rel === true) {
        if (type === 'picUrl') {
          this.extensionData.picUrl.push(
            'http://zone.bz.cn' + staticUrl + res.msg
          )
        } else {
          this.extensionData.windows[index].imageurl =
            'http://zone.bz.cn' + staticUrl + res.msg
        }
      } else {
        console.error(res.msg)
      }
    },
    // 图片大小判断
    exceededSize (file, fileList) {
      this.$Message.error('图片大小超过30kb')
    },
    // 删除图片
    delImg (type, index) {
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除图片？',
        onOk: () => {
          if (type === 'picUrl') {
            this.extensionData.picUrl.splice(index, 1)
          } else if (type === 'windows') {
            this.extensionData.windows[index].imageurl = ''
          }
        }
      })
    },
    // 增加推广组模板
    appendGroupName (key) {
      let domId = document.querySelectorAll(`#editExtension #${key} input`)[0]
      let inputIndex = domId.selectionStart
      let insertStr = (soure, start, newStr) => {
        return soure.slice(0, start) + newStr + soure.slice(start)
      }
      this.extensionData[key] = insertStr(
        this.extensionData[key],
        inputIndex,
        `{${this.extensionData.groupName}}`
      )
    },
    // 设置显示网址
    setDisPlayUrl () {
      // let protocol = this.extensionData.destinationUrl.split('//')[0]
      // let host = this.extensionData.destinationUrl.split('/')[2]
      this.extensionData.displayUrl = ''
    },
    // 否定关键词转换,排重，去首位空格，去空字符串
    handleFormatKeywords (str) {
      let arr = str.split('\n')
      return Array.from(new Set([...arr])).map(e => e.trim()).filter(e => e !== '')
    },
    // 提交
    submit () {
      localStorage.setItem('extensionData1', JSON.stringify(this.extensionData))
      this.$refs.editExtension.validate(v => {
        if (v) {
          // 编辑
          if (this.isEdit) {
            this.$Spin.show()
            // 深拷贝一份页面保存时候的数据
            let oldData = JSON.parse(JSON.stringify(this.extensionData))
            // oldData.phraseKeywords = oldData.phraseKeywords.split('\n');
            // oldData.exactKeywords = oldData.exactKeywords.split('\n');
            oldData.phraseKeywords = this.handleFormatKeywords(oldData.phraseKeywords)
            oldData.exactKeywords = this.handleFormatKeywords(oldData.exactKeywords)
            // 页面加载完的数据和保存之前的数据对比，告诉后端哪些变了
            let guidesIsChange =
              JSON.stringify(this.extensionDataBak.guides) !==
              JSON.stringify(this.extensionData.guides)
            let windowsIsChange =
              JSON.stringify(this.extensionDataBak.windows) !==
              JSON.stringify(this.extensionData.windows)
            // 一般创意和基础信息列表
            let otherList = [
              'owner',
              'title',
              'description1',
              'description2',
              'destinationUrl',
              'showid',
              'displayUrl',
              'picUrl',
              'phraseKeywords',
              'exactKeywords'
            ]
            let otherIsChange = otherList.some(e => {
              // 某一个改变了,一般创意就变了
              let flag =
                JSON.stringify(this.extensionDataBak[e]) !==
                JSON.stringify(oldData[e])
              return flag
            })
            let sendData = {
              groupId: this.groupId,
              data: oldData,
              isChange: {
                guidesIsChange,
                windowsIsChange,
                otherIsChange
              }
            }
            this.$axios({
              url: semUrl + '/PhraseGroup/uptGroup',
              method: 'post',
              data: $qs.stringify(sendData)
            }).then(res => {
              if (res.data.code === 10000) {
                this.$Message.success(res.data.msg)
                this.extensionDataBak = JSON.parse(
                  JSON.stringify(this.extensionData)
                )
                localStorage.removeItem('extensionData1')
                this.$Spin.hide()
                this.closeRouter()
              } else {
                this.$Spin.hide()

                this.$Message.error(res.data.msg)
              }
            })
          } else {
            // 保存
            let sendData = JSON.parse(JSON.stringify(this.extensionData))
            sendData.phraseKeywords = this.handleFormatKeywords(sendData.phraseKeywords)
            sendData.exactKeywords = this.handleFormatKeywords(sendData.exactKeywords)

            this.$Spin.show()
            this.$axios({
              url: semUrl + '/PhraseGroup/saveGroup',
              method: 'post',
              data: $qs.stringify(sendData)
            })
              .then(res => {
                if (res.data.code === 10000) {
                  this.$Message.success(res.data.msg)
                  // this.$axios({ url: res.data.url, method: 'get' })
                  this.extensionDataBak = JSON.parse(
                    JSON.stringify(this.extensionData)
                  )
                  localStorage.removeItem('extensionData1')
                  this.$Spin.hide()
                  this.closeRouter()
                } else {
                  this.$Spin.hide()
                  this.$Modal.error({
                    title: '提示',
                    content: res.data.msg
                  })
                }
              })
              .catch(err => {
                this.$Spin.hide()
                this.$Modal.error({
                  title: '提示',
                  content: err
                })
              })
          }
        } else {
          this.$Message.error('格式有误')
        }
      })
    },
    // 获取字符的占位大小，中文算两个
    getStringLength (v) {
      if (!v) v = ''
      let l = 0
      for (let i = 0; i < v.length; i++) {
        let a = v.charAt(i)
        // 如果是中文，算两个
        if (a.match(/[^\x00-\xff]/gi) != null) {
          l += 2
        } else if (a === '{' || a === '}') {
          // 左右大括号不算
          continue
        } else {
          l += 1
        }
      }
      return l
    },
    // 验证长度
    validateLength (rule, value, callback) {
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
        this.getStringLength(value) < rule.minLength
      ) {
        callback(new Error('字数小于' + rule.minLength))
      } else if (
        rule.maxLength &&
        this.getStringLength(value) > rule.maxLength
      ) {
        callback(new Error('字数超过' + rule.maxLength))
      } else {
        callback()
      }
    },
    // 新增导航
    addGuides () {
      this.extensionData.guides[0].links.push({ text: '' })
      this.extensionData.guides[1].links.push({ text: '' })
      this.extensionData.guides[2].links.push({ text: '' })
    },
    // 删除子链
    delGuides (index) {
      this.$Modal.confirm({
        title: '提示',
        content: `确认删除子链${index + 1}？`,
        onOk: () => {
          this.extensionData.guides[0].links.splice(index, 1)
          this.extensionData.guides[1].links.splice(index, 1)
          this.extensionData.guides[2].links.splice(index, 1)
        }
      })
    },
    // 关闭当前页面
    closeRouter () {
      bus.$emit('on-myclose', this.$route)
    }
  },
  computed: {
    // 否定关键词的的行数
    phraseRowLength () {
      let s = this.extensionData.phraseKeywords || ''
      return s.split('\n').length
    },
    // 精准否定关键词的长度
    exactRowLength () {
      let s = this.extensionData.exactKeywords || ''
      return s.split('\n').length
    },
    userId () {
      return this.$store.state.user.userId
    },
    nickname () {
      return this.$store.state.user.nickname
    },
    // 预览的标题
    showTitle () {
      let v = this.extensionData.title
      let s = v
        .replace(/\{/g, '<span style="color:red" >')
        .replace(/\}/g, '</span>')
      return s
    },
    // 预览的描述1
    showDescription1 () {
      let v = this.extensionData.description1
      let s = v
        .replace(/\{/g, '<span style="color:red" >')
        .replace(/\}/g, '</span>')
      return s
    },
    // 预览的描述2
    showDescription2 () {
      let v = this.extensionData.description2
      let s = v
        .replace(/\{/g, '<span style="color:red" >')
        .replace(/\}/g, '</span>')
      return s
    },
    // 在职人员
    employees () {
      return this.$store.state.user.employees
    }
  },
  beforeRouteLeave (to, from, next) {
    let oldData = JSON.stringify(this.extensionDataBak)
    let newData = JSON.stringify(this.extensionData)
    if (oldData !== newData) {
      this.$Modal.confirm({
        title: '提示',
        content: '数据未保存，是否继续关闭?',
        onOk: () => {
          next()
        }
      })
    } else {
      next()
    }
  }
}
</script>
<style lang="less" scoped>
@import "./extension.less";
</style>
