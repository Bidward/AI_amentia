<template>
    <div class="container">
        <Row>
            1. 选择需要导入的类型或模板下载
            <Tooltip placement="bottom-start" max-width="450">
                <Icon type="md-alert" color="#f90" size="16" style="margin-bottom: 2px" />
                <div slot="content">
                    <p>1、您选择导入的Exel表的信息必须</p>
                    <p>按照导入模板第三行的列名信息填写</p>
                    <p>2、导入文件必须是xls，xlsx格式</p>
                </div>
            </Tooltip>
        </Row>
        <Row>
            <a :href="staticUrl + 'Uploads/20200301/3.1%E7%99%BE%E5%8A%A9%E7%A9%BA%E9%97%B4%E5%A5%96%E6%83%A9%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF%20%E7%8E%8B%E8%AF%97%E9%91%AB.xlsx'">
                <Button>下载模板</Button>
            </a>
        </Row>
        <Row class="marginTop">
            2. 填写模板文件选择文件，可开始导入
        </Row>
        <Row type="flex" justify="space-between">
            <Col span="14">
                <!-- <div class="fileName">
                    <span v-if="file !== null" class="fileNameText">{{file.name}}</span>
                </div> -->
                <Input v-if="file !== null" v-model="file.name" readonly />
                <Input v-else />
            </Col>
            <Col span="4">
                <Upload
                    :format="['xlsx','xls','cvs']"
                    accept=".xlsx, .xls, .cvs"
                    :show-upload-list="false"
                    name="file"
                    :with-credentials="true"
                    :action="baseUrl+'/import'"
                    :before-upload="handleUpload"
                >
                    <Button>选择文件</Button>
                </Upload>
            </Col>
            <Col span="4">
                <Button type="primary" @click="upload" :loading="loadingStatus">
                    {{ loadingStatus ? '导入中' : '开始导入' }}
                </Button>
            </Col>
        </Row>
    </div>
</template>

<script>
import { baseUrl, staticUrl } from '@/api/base.js'
export default {
  name: 'addImport',
  data () {
    return {
      baseUrl,
      staticUrl,
      file: null,
      loadingStatus: false
    }
  },
  methods: {
    handleUpload (file) {
      this.file = file
      return false
    },
    upload () {
      if (this.file !== null) {
        this.loadingStatus = true
        const formData = new FormData()
        formData.append('file', this.file)
        this.$axios({
          url: baseUrl + '/import',
          method: 'post',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' }
        })
          .then(res => {
            this.loadingStatus = false
            if (res.data.code === 10000) {
              this.file = null
              this.$Message.success(res.data.msg)
              this.$emit('on-import-success')
            } else {
              this.$Message.error('模板格式有误，请下载模板后导入')
            }
          }).catch(err => {
            this.loadingStatus = false
            console.error(err)
          })
      } else {
        this.$Message.warning('请选择文件')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
    padding: 10px 20px 20px;
    .marginTop {
        margin-top: 20px;
    }
    .fileName {
        height: 32px;
        border: 1px solid #dcdee2;
        border-radius: 4px;
        padding: 0 10px;
        overflow: hidden;
        .fileNameText {
            line-height: 32px
        }
    }
}
</style>
