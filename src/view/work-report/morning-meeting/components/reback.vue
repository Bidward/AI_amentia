<template>
<div>
    <section class="detailContent">
        <!-- 评论 -->
        <div style="margin: 20px 0 5px" class="grayFont pointer" @click="comShow=!comShow">
            <Icon type="ios-text" size=18 color="#a0a0a0" />
            <span v-if="comShow">收起评论</span>
            <span v-else>
                <span v-if="comments.length !== 0">{{comments.length}}条评论</span>
                <span v-else>评论</span>
            </span>
        </div>
        <section v-if="comShow" class="workItemsComment">
            <!-- 评论内容 -->
            <div v-for="(comment, index) in comments" :key="comment.id">
                <article class="boxMargin flexBox">
                    <Avatar :src="staticUrl + comment.picUrl" :size="20" />
                    <span style="flex: 1">{{comment.userName}}      {{comment.userPosition}}</span>
                    <span>{{comment.replyTime}}</span>
                </article>
                <article style="margin-left: 35px">
                    <div class="lineHeight">{{comment.comment}}</div>
                    <div class="grayFont">接收人：{{comment.receiver}}</div>
                    <div style="border-bottom: 1px solid #a0a0a0">
                        <div class="grayFont pointer" @click="returnInput(comment.showInput, index)" v-if="!comment.showInput">
                            <Icon type="ios-undo" size=18 color="#a0a0a0" />回复
                        </div>
                        <div class="grayFont pointer" @click="returnInput(comment.showInput, index)" v-else>
                            <Icon type="md-remove" size=20 color="#a0a0a0" />取消回复
                        </div>
                        <!-- 回复输入框 -->
                        <div class="boxMargin flexBox" v-if="comment.showInput">
                            <Input v-model="replyComment" type="textarea" maxlength="200" show-word-limit :rows="1" style="margin-top: 5px;"/>
                            <span style="width: 120px; text-align: end; line-height: 35px">接收人：</span>
                            <Select filterable multiple v-model="replyCommentReceiver" style="width: 30%">
                                <Option placeholder="请输入接收人" v-for="item in employees" :value="item.id" :key="item.id">{{item.nickname}}</Option>
                            </Select>
                            <Button type="primary" style="margin: 3px 10px" @click="addComment(2, comment.id)">评论</Button>
                        </div>
                    </div>
                    <div v-if="comment.children.length!==0" class="grayFont boxMargin pointer" @click="showReply(comment.showChildren, index)">查看回复</div>
                    <!-- 子评论 -->
                    <section v-if="comment.showChildren" >
                        <div v-for="(comChild, index2) in comment.children" :key="comChild.id">
                            <article class="boxMargin flexBox">
                                <span style="flex: 1">
                                    <Avatar :src="staticUrl + comChild.picUrl" :size="20" />
                                    <span>{{comChild.userName}}  {{comment.userPosition}}</span>
                                    <span class="grayFont" style="margin: 3px 10px 25px">回复</span>
                                    <Avatar :src="staticUrl + comChild.replyPicUrl" :size="20" />
                                    <span>{{comChild.replyName}}  {{comment.replyPosition}}</span>
                                </span>
                                <span>{{comChild.replyTime}}</span>
                            </article>
                            <article style="margin-left: 35px">
                                <div class="lineHeight">{{comChild.comment}}</div>
                                <div class="grayFont">接收人：{{comChild.receiver}}</div>
                                <div style="border-bottom: 1px solid #a0a0a0">
                                    <div class="grayFont pointer" @click="returnChildInput(comChild.showInput, index, index2)" v-if="!comChild.showInput">
                                        <Icon type="ios-undo" size=18 color="#a0a0a0" />回复
                                    </div>
                                    <div class="grayFont pointer" @click="returnChildInput(comChild.showInput, index, index2)" v-else>
                                        <Icon type="md-remove" size=20 color="#a0a0a0" />取消回复
                                    </div>
                                    <!-- 回复输入框 -->
                                    <div class="boxMargin flexBox" v-if="comChild.showInput">
                                        <Input v-model="replyChildComment" type="textarea" maxlength="200" show-word-limit :rows="1" style="margin-top: 5px;"/>
                                        <span style="width: 120px; text-align: end; line-height: 35px">接收人：</span>
                                        <Select filterable multiple v-model="replyChildCommentReceiver" style="width: 30%">
                                            <Option placeholder="请输入接收人" v-for="item in employees" :value="item.id" :key="item.id">{{item.nickname}}</Option>
                                        </Select>
                                        <Button type="primary" style="margin: 3px 10px" @click="addComment(3, comment.id)">评论</Button>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </section>
                </article>
            </div>
            <!-- 主评论输入框 -->
            <div class="boxMargin flexBox">
                <Input v-model="firstComment" type="textarea" maxlength="200" show-word-limit :rows="1" style="margin-top: 5px;" />
                <span style="width: 120px; text-align: end; line-height: 35px">接收人：</span>
                <Select filterable multiple v-model="firstCommentReceiver" style="width: 30%">
                    <Option placeholder="请输入接收人" v-for="item in employees" :value="item.id" :key="item.id">{{item.nickname}}</Option>
                </Select>
                <Button type="primary" style="margin: 3px 10px" @click="addComment(1)">评论</Button>
            </div>
        </section>
    </section>
</div>
</template>

<script>
import {
  staticUrl,
  baseUrl
} from '@/api/base.js'
export default {
  name: 'dailyDetail',
  inject: ['app'],
  data () {
    return {
      staticUrl,
      firstComment: '', // 第一个评论内容
      firstCommentReceiver: [], // 第一个评论接收人
      replyComment: '', // 回复评论内容
      replyCommentReceiver: [], // 回复评论接收人
      replyChildComment: '', // 回复子评论内容
      replyChildCommentReceiver: [], // 回复子评论接收人
      comShow: true, // 默认展开评论
      comments: [
        {
          id: '',
          replyId: '',
          userId: '',
          userName: '', // 评论人
          receiver: '', // 接收人
          userPosition: '',
          picUrl: '',
          replyTime: '',
          comment: '',
          showInput: 0, // 显示回复框【默认为0】
          showChildren: 0, // 显示子回复【默认为0】
          children: [{
            comment: '', // 评论内容
            id: '',
            morningId: '',
            replyPicUrl: '',
            picUrl: '',
            receiver: '', // 接收人
            replyId: '',
            replyName: '', // 回复的人的性姓名
            replyPosition: '', // 回复的人的职位
            replyTime: '',
            replyUserId: '',
            userId: '',
            userName: '', // 评论人姓名
            userPosition: '', // 评论人职位
            showInput: 0 // 显示回复框【默认为0】
          }
          ]
        }
      ]
    }
  },
  computed: {
    employees () {
      return this.app.employees
    }
  },
  created () {
    this.getMeetingComment()
  },
  methods: {
    getMeetingComment () {
      this.$axios({
        url: baseUrl + '/morning/getMeetingComment',
        method: 'post',
        data: $qs.stringify({
          id: this.$route.query.id
        })
      }).then(res => {
        if (res.data.code === 10000) {
          this.comments = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 发表评论——sign：标记1位主评论，2为回复评论，3位回复子评论；replyId：回复评论的id(是主评论时为0)
    addComment (sign, replyId = 0) {
      let sendData = {}
      sendData.id = replyId
      sendData.morningId = this.$route.query.id
      if (sign === 1 && this.firstComment.trim() !== '') {
        sendData.comment = this.firstComment
        sendData.receiverList = this.firstCommentReceiver
        this.sendComment(sendData)
      } else if (sign === 2 && this.replyComment.trim() !== '') {
        sendData.comment = this.replyComment
        sendData.receiverList = this.replyCommentReceiver
        this.sendComment(sendData)
      } else if (sign === 3 && this.replyChildComment.trim() !== '') {
        sendData.comment = this.replyChildComment
        sendData.receiverList = this.replyChildCommentReceiver
        this.sendComment(sendData)
      } else {
        this.$Message.error('评论不能为空')
        this.firstComment = ''
        this.replyComment = ''
        this.replyChildComment = ''
      }
    },
    sendComment (sendData) {
      this.$axios({
        url: baseUrl + '/morning/replyComment',
        method: 'post',
        data: sendData
      }).then(res => {
        if (res.data.code === 10000) {
          this.$Message.info(res.data.msg)
          // 清空输入框
          this.firstComment = ''
          this.firstCommentReceiver = []
          this.replyComment = ''
          this.replyCommentReceiver = []
          this.replyChildComment = ''
          this.replyChildCommentReceiver = []
          this.getMeetingComment()
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 显示回复评论框
    returnInput (showInput, index) {
      this.comments[index].showInput = !showInput
    },
    // 显示子评论
    showReply (showChildren, index) {
      this.comments[index].showChildren = !showChildren
    },
    // 显示子回复框
    returnChildInput (showInput, index, index2) {
      this.comments[index].children[index2].showInput = !showInput
    }
  }
}
</script>

<style lang="less" scoped>
.detailContent {
    margin: 0 30px;
    .workItemsComment {
        border: 1px solid #dcdee2;
        border-radius: 5px;
        padding: 20px;

        textarea{
            height:32px;
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
