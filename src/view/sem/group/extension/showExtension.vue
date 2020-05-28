<template>
  <div class="viewWrapper viewWrapperNoTabs" id="editExtension">
    <Form ref="editExtension" :label-width="80" :model="extensionData">
      <div class="selection">
        <h3>基础信息</h3>
        <Row>
          <Col span="12">
            <FormItem label="推广组" prop="groupName">
              <h4>{{extensionData.groupName}}</h4>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="责任人" prop="owner">
              <h4>{{extensionData.owner}}</h4>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="否定关键词" prop="phraseKeywords">
              <Input
                :disabled="true"
                type="textarea"
                :rows="10"
                v-model="extensionData.phraseKeywords"
                class="wd80"
              ></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="精确否定关键词" prop="exactKeywords">
              <Input
                :disabled="true"
                type="textarea"
                :rows="10"
                v-model="extensionData.exactKeywords"
                class="wd80"
              ></Input>
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection">
        <h3>一般创意</h3>
        <Row>
          <Col span="12">
            <FormItem label="创意标题" prop="title">
              <h4>{{extensionData.title}}</h4>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="创意描述1" prop="description1">
              <h4>{{extensionData.description1}}</h4>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="创意描述2" prop="description2">
              <h4>{{extensionData.description2}}</h4>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="链接网址" prop="destinationUrl">
              <h4>{{extensionData.destinationUrl}}</h4>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="显示网址" prop="displayUrl" v-show="false">
              <h4>{{extensionData.displayUrl}}</h4>
            </FormItem>
          </Col>
          <Col span="12" v-if="type==='fengwu'">
            <FormItem label="创意配图" prop="picUrl">
              <viewer class="imgBox" v-for="(pic,index) in extensionData.picUrl" :key="index">
                <img :src="pic" />
              </viewer>
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection" v-if="type==='fengwu'">
        <h3>导航创意</h3>
        <Row>
          <Col span="7" v-for="(linkItem,index) in extensionData.guides" :key="index">
            <FormItem :label="`导航${index+1}标签`">
              <h4>{{linkItem.title}}</h4>
            </FormItem>
          </Col>
        </Row>
        <!-- 有多少个子链，就有多少行 -->
        <Row v-for="(links,index1) in extensionData.guides[0].links" :key="index1">
          <!-- 第几列 只有三列 -->
          <Col span="7" v-for="(linkItem,index2) in extensionData.guides" :key="index2">
            <FormItem :label="`子链${index1+1}`">
              <h4>{{linkItem.links[index1].text}}</h4>
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection" v-if="type==='fengwu'">
        <h3>橱窗创意</h3>
        <Row>
          <Col span="6" v-for="(item,index) in extensionData.windows" :key="index">
            <FormItem label="商品名称" :prop="`windows[${index}].title`">
              <h4>{{item.title}}</h4>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6" v-for="(item,index) in extensionData.windows" :key="index+4">
            <FormItem label="商品描述" :prop="`windows[${index}].description`">
              <h4>{{item.description}}</h4>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6" v-for="(item,index) in extensionData.windows" :key="index+8">
            <FormItem>
              <viewer class="imgBox">
                <img :src="item.imageurl" />
              </viewer>
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection">
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
          <div class="link clearfix" v-if="type==='fengwu'">
            <p v-for="(linkItem,index) in extensionData.guides" :key="index">
              <span class="title">{{linkItem.title}}：</span>
              <span
                class="text"
                v-for="(linksItem,index2) in linkItem.links"
                :key="index2"
              >{{linksItem.text}}</span>
            </p>
          </div>
          <ul class="window clearfix" v-if="type==='fengwu'">
            <li class="fl" v-for="(item,index) in extensionData.windows" :key="index">
              <img :src="item.imageurl" alt="橱窗图片出错" />
              <p class="title">{{item.title}}</p>
              <p class="description">{{item.description}}</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="selection saveBox">
        <div class="save">
          <!-- <Button class="btns"  @click="closeRouter">取消</Button> -->
          <Button class="btns" type="primary" @click="closeRouter">关闭</Button>
        </div>
      </div>
    </Form>
  </div>
</template>
<script>
import moment from 'moment'
import { semUrl } from '@/api/base.js'
export default {
  name: 'showExtension', // 查看广组
  data () {
    return {
      type: '',
      groupId: '',
      toDay: moment().format('YYYY-MM-DD'),
      extensionData: {
        groupName: '', // 推广组名称
        owner: '', // 责任人
        title: '', // 创意标题
        description1: '', // 创意描述1
        description2: '', // 创意描述2
        destinationUrl: '', // 链接网址
        displayUrl: '', // 显示网址
        picUrl: '', // 创意图片
        // 导航样式
        guides: [
          {
            // 导航标签
            title: '',
            // 四个子链
            links: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }]
          },
          {
            title: '',
            links: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }]
          },
          {
            title: '',
            links: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }]
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
            title: '凤舞橱窗2',
            description: '凤舞橱窗描述2',
            imageurl: ''
          },
          {
            title: '凤舞橱窗3',
            description: '凤舞橱窗描述3',
            imageurl: ''
          },
          {
            title: '凤舞橱窗4',
            description: '凤舞橱窗描述4',
            imageurl: ''
          }
        ]
      }
    }
  },
  mounted () {
    // 录入人默认为当前登录用户
    if (this.$route.params.id) {
      let { id: groupId, type } = this.$route.params
      this.groupId = groupId
      this.type = type
      this.getData(groupId)
    } else {
      this.$Message.error('异常')
    }
  },
  filters: {
    replaceHttp (v) {
      return v.replace('https://', '').replace('http://', '')
    }
  },
  methods: {
    getData (id) {
      this.$axios({
        url: semUrl + '/group/showGroup',
        method: 'get',
        params: { groupid: id }
      }).then(res => {
        this.extensionData = res.data.content
        this.extensionData.phraseKeywords = res.data.content.phraseKeywords.replace(/,/g, '\n')
        this.extensionData.exactKeywords = res.data.content.exactKeywords.replace(/,/g, '\n')
      })
    },
    // 关闭当前页面
    closeRouter () {
      bus.$emit('on-myclose', this.$route)
    }
  },
  computed: {
    nickname () {
      return this.$store.state.user.nickname
    },
    showTitle () {
      let v = this.extensionData.title
      // let groupName = this.extensionData.groupName
      let s = v
        .replace(/\{/g, '<span style="color:red">')
        .replace(/\}/g, '</span>')
      return s
    },
    showDescription1 () {
      let v = this.extensionData.description1
      let s = v
        .replace(/\{/g, '<span style="color:red">')
        .replace(/\}/g, '</span>')

      return s
    },
    showDescription2 () {
      let v = this.extensionData.description2
      let s = v
        .replace(/\{/g, '<span style="color:red">')
        .replace(/\}/g, '</span>')
      return s
    }
  }
}
</script>
<style lang="less" scoped>
@import "./extension.less";
</style>
