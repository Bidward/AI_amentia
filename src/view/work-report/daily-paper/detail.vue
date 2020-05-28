<template>
    <div class="viewWrapper">
        <div class="tableHeader-only">
            <Icon type="md-school" size="30" color="#19aa8d"/>工作事项
        </div>
        <section class="detailContent">
            <Button type="primary" @click="unfold">全部展开</Button>
            <Card dis-hover class="workItems" v-for="(workItem, index) in workItems" :key="workItem.id">
                <div class="workItemsHeader" @click="unfoldOne(workItem, index)">
                    <span class="workItemsHeaderTitle">{{workItem.id}}、{{workItem.title}}</span>
                    <span class="workItemsHeaderDate">{{workItem.date}}</span>
                    <span class="workItemsHeaderPro" @click.stop>
                        <Slider v-model="workItem.progress" disabled></Slider>
                    </span>
                </div>
                <div class="workItemsFeedback" v-if="workItem.isShow">
                    <div style="margin: 20px 0 5px; display: flex">
                        <span style="flex: 1; color: #a0a0a0">工作反馈：</span>
                        <span v-if="workItem.receiver.length!==0">接收人：{{workItem.receiver}}</span>
                        <span v-else>接收人：无</span>
                    </div>
                    <div class="lineHeight">{{workItem.feedback}}</div>
                    <!-- 评论 -->
                    <div style="margin: 20px 0 5px" class="grayFont" @click="unfoldComments(workItem, index)">
                        <Icon type="ios-text" size=18 color="#a0a0a0" />
                        <span v-if="workItem.comShow">收起评论</span>
                        <span v-else>
                            <span v-if="workItem.comments.length !== 0">{{workItem.comments.length}}条评论</span>
                            <span v-else>评论</span>
                        </span>
                    </div>
                    <section v-if="workItem.comShow" class="workItemsComment">
                        <!-- 评论内容 -->
                        <div
                            v-for="(comment, index2) in workItem.comments"
                            :key="comment.id">
                            <article class="boxMargin flexBox">
                                <Avatar :src="staticUrl + comment.picUrl" :size="20"/>
                                <span style="flex: 1">{{comment.comName}}</span>
                                <span>{{comment.comTime}}</span>
                            </article>
                            <article style="margin-left: 35px">
                                <div class="lineHeight">{{comment.comContent}}</div>
                                <div class="grayFont" v-if="comment.receiver.length !== 0">接收人：{{comment.receiver}}</div>
                                <div style="border-bottom: 1px solid #a0a0a0">
                                    <div class="grayFont" @click="returnInput(comment, index, index2)" v-if="!comment.showInput">
                                        <Icon type="ios-undo" size=18 color="#a0a0a0" />回复
                                    </div>
                                    <div class="grayFont" @click="returnInput(comment, index, index2)" v-else>
                                        <Icon type="md-remove" size=20 color="#a0a0a0" />取消回复
                                    </div>
                                    <!-- 回复输入框 -->
                                    <div class="boxMargin flexBox" v-if="comment.showInput">
                                        <Input v-model="comment.replyText" type="textarea" maxlength="200" show-word-limit/>
                                        <Button type="primary" style="margin: 0 10px 0" @click="addComment(comment, workItem.id, comment.id)">评论</Button>
                                        <span style="width: 120px; text-align: end; line-height: 35px">接收人：</span>
                                        <Select filterable multiple v-model="comment.receiver" style="width: 30%">
                                            <Option
                                                placeholder="请输入接收人"
                                                v-for="item in employees"
                                                :value="item.id"
                                                :key="item.id"
                                            >{{item.nickname}}</Option>
                                        </Select>
                                    </div>
                                </div>
                                <div class="grayFont boxMargin" v-if="comment.comChildern.length != 0" @click="showReply(comment, index, index2)">查看回复</div>
                                <!-- 子评论 -->
                                <section
                                    v-if="comment.showChildren"
                                    v-for="(comChild, index3) in comment.comChildern"
                                    :key="comChild.id">
                                    <article class="boxMargin flexBox">
                                        <span style="flex: 1">
                                            <Avatar :src="staticUrl + comChild.picUrl" :size="20"/>
                                            <span>{{comChild.comName}}</span>
                                            <span class="grayFont" style="margin: 0 10px 0 25px">回复</span>
                                            <Avatar :src="staticUrl + comChild.returnPicUrl" :size="20"/>
                                            <span>{{comChild.returnName}}</span>
                                        </span>
                                        <span>{{comChild.comTime}}</span>
                                    </article>
                                    <article style="margin-left: 35px">
                                        <div class="lineHeight">{{comChild.comContent}}</div>
                                        <div class="grayFont" v-if="comChild.receiver.length !== 0">接收人：{{comChild.receiver}}</div>
                                        <div style="border-bottom: 1px solid #a0a0a0">
                                            <div class="grayFont" @click="returnChildInput(comChild, index, index2, index3)" v-if="!comChild.showInput">
                                                <Icon type="ios-undo" size=18 color="#a0a0a0" />回复
                                            </div>
                                            <div class="grayFont" @click="returnChildInput(comChild, index, index2, index3)" v-else>
                                                <Icon type="md-remove" size=20 color="#a0a0a0" />取消回复
                                            </div>
                                            <!-- 回复输入框 -->
                                            <div class="boxMargin flexBox" v-if="comChild.showInput">
                                                <Input v-model="comChild.replyText" type="textarea" maxlength="200" show-word-limit/>
                                                <Button type="primary" style="margin: 0 10px 0" @click="addComment(comChild, workItem.id, comment.id, comChild.id)">评论</Button>
                                                <span style="width: 120px; text-align: end; line-height: 35px">接收人：</span>
                                                <Select filterable multiple v-model="comChild.receiver" style="width: 30%">
                                                    <Option
                                                        placeholder="请输入接收人"
                                                        v-for="item in employees"
                                                        :value="item.id"
                                                        :key="item.id"
                                                    >{{item.nickname}}</Option>
                                                </Select>
                                            </div>
                                        </div>
                                    </article>
                                </section>
                            </article>
                        </div>
                        <!-- 评论输入框 -->
                        <div class="boxMargin flexBox">
                            <Input v-model="workItem.replyText" type="textarea" maxlength="200" show-word-limit/>
                            <Button type="primary" style="margin: 0 10px 0" @click="addComment(workItem, workItem.id)">评论</Button>
                            <span style="width: 120px; text-align: end; line-height: 35px">接收人：</span>
                            <Select filterable multiple v-model="workItem.commentReceiver" style="width: 30%">
                                <Option
                                    placeholder="请输入接收人"
                                    v-for="item in employees"
                                    :value="item.id"
                                    :key="item.id"
                                >{{item.nickname}}</Option>
                            </Select>
                        </div>
                    </section>
                </div>
            </Card>
        </section>

        <div class="tableHeader-only">
            <Icon type="md-school" size="30" color="#19aa8d"/>附件
        </div>
        <section class="detailContent">
            <ul v-if="dailyEnclosuresList && dailyEnclosuresList.length">
                <li v-for="item in dailyEnclosuresList" :key="item.id">
                    <a :href="staticUrl + item.enclosureUrl" :download="item.enclosureName">{{item.enclosureName}}</a>
                </li>
            </ul>
        </section>

        <div class="tableFooter" style="text-align: center">
            <Button @click="goBack">返回</Button>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import { staticUrl } from '@/api/base.js'
export default {
  name: 'dailyDetail',
  inject: ['app'],
  data () {
    return {
      staticUrl,
      workItems: [
        {
          id: 1,
          isShow: 0, // 1展开，0关闭【默认为0】
          title: '更改原型图',
          date: '2019.12.10-2019.12.12',
          progress: 20,
          feedback: 'feedbackfeedbackfeedbackfeedback',
          receiver: '锅志远，老庞', // 接收人
          commentReceiver: [], // 临时变量
          replyText: '',
          comShow: 0, // 显示评论【默认为0】
          comments: [
            {
              id: 1,
              comName: '锅志远', // 评论人
              picUrl: '',
              comTime: '2019-12-12  14:48:25',
              comContent: '评论评论评论评论评论评论评论评论评论评论',
              receiver: [],
              replyText: '',
              showInput: 0, // 显示回复框【默认为0】
              showChildren: 0, // 显示子回复【默认为0】
              comChildern: [
                {
                  id: 1,
                  comName: '老庞', // 回复人
                  picUrl: '',
                  returnName: '锅志远', // 回复给returnName
                  returnPicUrl: '',
                  comTime: '2019-12-12  14:48:25',
                  comContent: '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
                  receiver: [],
                  replyText: '',
                  showInput: 0 // 显示回复框【默认为0】
                },
                {
                  id: 2,
                  comName: '黛玉',
                  picUrl: '',
                  returnName: '老庞',
                  returnPicUrl: '',
                  comTime: '2019-12-12  14:48:25',
                  comContent: '巴啦啦啦啦啦啦啦啦啦啦阿',
                  receiver: [],
                  replyText: '',
                  showInput: 0 // 显示回复框【默认为0】
                }
              ]
            }
          ]
        },
        {
          id: 2,
          isShow: 0, // 1展开，0关闭【默认关闭】
          title: '完成需求文档',
          date: '2019.12.10-2019.12.12',
          progress: 50,
          feedback: 'feedbackfeedbackfeedbackfeedback',
          receiver: '',
          commentReceiver: [],
          comShow: 0, // 显示评论
          comments: []
        }
      ],
      dailyEnclosuresList: [] // 附件
    }
  },
  computed: {
    employees () {
      return this.app.employees
    }
  },
  created () {
    this.getWorkItems()
  },
  methods: {
    getWorkItems () {
      // console.log(this.$route.query.id)
    },
    // 发表评论
    addComment (json, itemId = -1, comId = -1, comChildId = -1) {
      let sendData = {
        itemId: itemId, // 事项id
        comId: comId, // 评论id
        comChildId: comChildId, // 回复id
        comName: this.$store.state.user.userId, // 评论人
        comTime: moment().format('YYYY-MM-DD HH:mm:ss')
      }
      if (comChildId !== -1 || comId !== -1) { // 子/父级回复
        sendData.comContent = json.replyText
        sendData.receiver = json.receiver
      } else if (itemId !== -1) { // 评论
        sendData.comContent = json.replyText
        sendData.receiver = json.commentReceiver
      }
      console.log(sendData)
    },
    // 展开全部
    unfold () {
      this.workItems.map((workItem, index) => {
        let keys = Object.keys(workItem)
        keys.filter(item => {
          if (item === 'isShow') workItem[item] = 1
        })
      })
    },
    // 展开某一个
    unfoldOne (workItem, index) {
      this.workItems[index].isShow = !workItem.isShow
    },
    // 打开评论【一级评论】
    unfoldComments (workItem, index) {
      this.workItems[index].comShow = !workItem.comShow
    },
    returnInput (comment, index, index2) {
      this.workItems[index].comments[index2].showInput = !comment.showInput
    },
    showReply (comment, index, index2) {
      this.workItems[index].comments[index2].showChildren = !comment.showChildren
    },
    returnChildInput (comChild, index, index2, index3) {
      this.workItems[index].comments[index2].comChildern[index3].showInput = !comChild.showInput
    },
    goBack () {
      this.$router.go(-1)
      bus.$emit('on-myclose', this.$route)
    }
  }
}
</script>
<style lang="less" scoped>
.tableHeader-only {
    font-size: 16px;
}
.detailContent {
    margin: 0 30px;
}
// 工作事项
.workItems {
    cursor: pointer;
    margin-top: 20px;
    .workItemsHeader {
        display: flex;
        color: #19aa8d;
        .workItemsHeaderTitle {
            font-size: 18px;
            font-weight: bold;
        }
        .workItemsHeaderDate {
            font-size: 14px;
            flex: 1;
            text-align: center;
        }
        .workItemsHeaderPro {
            width: 100px;
        }
    }
    .workItemsFeedback {
        border-top: 1px solid #e8eaec;
        .workItemsComment {
            border: 1px solid #dcdee2;
            border-radius: 5px;
            padding: 20px;

        }
    }
}
.lineHeight {
    line-height: 22px;
}
.flexBox {
    display: flex;
}
.grayFont {
    color: #a0a0a0;
}
.boxMargin {
    margin: 10px 0;
}
</style>
