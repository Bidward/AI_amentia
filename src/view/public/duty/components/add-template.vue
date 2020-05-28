<!-- 模板添加 -->
<template>
  <div class="addTemplate">
    <div v-if="templateData.length > 0">
      <div v-for="(item, index) in templateData" :key="index">
        <div class="headerWithGreenbar">
          <span>{{item.name}}</span>
          <span class="pointer template" @click="editTemplate(item.stationPublicCategorySingle || {...item.stationJobCategorySingle, general: true})">{{templateTitle}}</span>
        </div>
        <div style="display: flex; flex-wrap: wrap">
          <bz-card
            v-for="card in (item.stationPublicCategory || item.stationJobCategory) "
            :key="card.id"
            :name="card.publicCategoryName || card.jobCategoryName"
            icon="md-person"
            @click.native="editTemplate(card)"
            @delete="deleteTag(card.id)"
          ></bz-card>
          <bz-card name="新增" @click.native="showAddTemplate = true; deptId = item.deptId"></bz-card>
        </div>
      </div>
    </div>

    <!-- <div class="headerWithGreenbar">
      <span>开发部</span>
      <span class="pointer template" @click="editTemplate">{{templateTitle}}</span>
    </div>
    <div style="display: flex; flex-wrap: wrap">
      <bz-card
        v-for="card in cards"
        :key="card.id"
        :name="card.publicCategoryName || card.jobCategoryName"
        icon="md-person"
        @click.native="editTemplate(card)"
        @delete="deleteTag(card.id)"
      ></bz-card>
      <bz-card name="新增" @click.native="showAddTemplate = true"></bz-card>
    </div> -->

    <Modal
      v-model="showAddTemplate"
      title="新增"
      ok-text="保存"
      @on-ok="addTag"
      width="360px"
      :loading="loading">
      <div class="contentItem">
        <span style="margin-right: 10px">模板名称 :</span>
        <Input style="width: 200px" v-model="templateName"/>
      </div>
      <div
        class="contentItem"
        v-if="type === 2"
        >
        <span style="margin-right: 10px">公共模板 :</span>
        <Select v-model="templateId" style="width: 200px" @on-open-change="getTemplates">
          <Option
            v-for="template in publicTemplates"
            :key="template.id"
            :value="template.id"
          >
            {{template.publicCategoryName}}
          </Option>
        </Select>
      </div>
    </Modal>
  </div>
</template>

<script>
import BzCard from './bz-card.vue'
import { baseUrl } from '@/api/base'
export default {
  components: { BzCard },

  props: {
    postApi: {
      type: String,
      default: ''
    },
    delApi: {
      type: String,
      default: ''
    },
    getApi: {
      type: String,
      default: ''
    },
    routeName: {
      type: String,
      default: ''
    },
    type: {
      type: Number,
      // 1 是公共模板
      default: 1
    },
    cards: {
      type: Array,
      default () {
        return []
      }
    },
    commonTemplate: {
      type: Object,
      default () {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    },
    templateData: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      showAddTemplate: false,
      templateName: '',
      templateId: 19,
      loading: false,
      publicTemplates: [],
      deptId: ''
    }
  },
  methods: {
    getTags () {
      this.$axios({
        url: baseUrl + this.getApi,
        method: 'post'
      })
        .then(res => {
          // console.log(res)
          if (res.data.code === 10000) {
            // this.cards = res.data.content.stationPublicCategory
            // this.commonTemplate = res.data.content.stationPublicCategorySingle
            // this.title = res.data.content.name
            this.templateData = res.data.content
            // console.log(this.templateData)
            // console.log(this.templateData, 'template')
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    addTag () {
      if (this.templateName) {
        let params = this.type === 2
          ? { name: this.templateName, publicCategoryId: this.templateId, deptId: this.deptId }
          : { name: this.templateName }
        // 发送请求
        this.loading = true
        this.$axios({
          // url: baseUrl + '/station/insertPublicCategory',
          url: baseUrl + this.postApi,
          method: 'post',
          data: $qs.stringify(params)
        })
          .then(res => {
            // console.log(res)
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.loading = false
              this.$emit('update', this.type)
            } else {
              this.$Message.error(res.data.msg)
              this.loading = false
              this.$nextTick(() => {
                this.loading = true
              })
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.$Message.error('请填写模板名称')
        this.loading = false
      }
      this.templateName = ''
    },
    deleteTag (id) {
      // this.$axios({
      //   url: baseUrl + this.delApi,
      //   method: 'post',
      //   data: $qs.stringify({ id })
      // }).then(res => {
      //   this.$Message.error(res.data.msg)
      //   // this.getTemplates()
      //   this.$emit('update', this.type)
      // })
      this.$axios({
        url: baseUrl + this.delApi,
        method: 'post',
        data: $qs.stringify({ id })
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$emit('update', this.type)
            this.$Message.success(res.data.msg)
          } else if (res.data.code === 10101) {
            if (this.type === 2) {
              this.$Modal.confirm({
                title: '提醒',
                content: '该模板下存在子项目或已分配人员是否仍要删除',
                onOk: () => {
                  this.$axios({
                    url: baseUrl + this.delApi,
                    method: 'post',
                    data: $qs.stringify({ id, delete: 1 })
                  })
                    .then(res => {
                      if (res.data.code === 10000) {
                        this.$emit('update', this.type)
                        this.$Message.success(res.data.msg)
                      } else {
                        this.$Message.error(res.data.msg)
                      }
                    })
                    .catch(err => {
                      console.log(err)
                    })
                }
              })
            } else {
              this.$Message.error(res.data.msg)
            }
          }
        })
    },
    editTemplate (card) {
      let query = this.type === 2
        ? { id: card.id, pid: card.publicCategoryId, general: card.general ? card.general : false }
        : { id: card.id }
      this.$router.push({ name: this.routeName, query: query })
    },
    getTemplates (open) {
      if (open) {
        this.$axios({
          url: baseUrl + '/station/getPublicCategory',
          method: 'post'
        })
          .then(res => {
            // console.log(res)
            if (res.data.code === 10000) {
              this.publicTemplates = res.data.content[0].stationPublicCategory
            } else {
              this.$Message.error(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  },
  computed: {
    templateTitle () {
      return this.type === 1 ? '公共事项配置' : '专项工作'
    }
  }
}
</script>

<style lang='less' scoped>
.contentItem {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}
.template {
  color: rgb(255, 153, 0);
  display: inline-block;
  margin-left: 20px;
}
</style>
