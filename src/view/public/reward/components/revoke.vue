<template>
  <div>
    <Form
      inline
      :label-width="80"
      label-position="right"
      :model="revokeData"
      :rules="revokeValidate"
      ref="revokeForm"
    >
      <FormItem label="销分说明" prop="applyReason">
        <Input class="full" v-model="revokeData.applyReason" placeholder="销分说明"></Input>
      </FormItem>
      <FormItem label="图片：" prop="enclosureList">
        <Upload
          multiple
          :format="['jpg','jpeg','png']"
          :max-size="20480"
          :show-upload-list="false"
          name="fileData"
          :action="staticUrl+'/index.php'"
          :on-success="(response, file, fileList)=> uploadSuccess(response, file, fileList)"
          :on-format-error="handleFormatError"
          class="full"
        >
            <Tooltip content="请上传jpg，jpeg，png格式的图片" placement="right">
                <Button icon="ios-cloud-upload-outline">上传图片</Button>
          </Tooltip>
        </Upload>
        <viewer v-for="(img,index) in revokeData.enclosureList" :value="index" :key="`img+${index}`" class="inputbox">
          <img :src="img.enclosureUrl" class="inputbox">
          <Icon class="close" size="40" @click="delImg(index)" type="ios-close"/>
        </viewer>
      </FormItem>
      <!-- <FormItem prop label="审批人：">
        <Select class="helf" disabled filterable v-model="revokeData.approveId">
          <Option
            v-for="person in incumbencyTbUser"
            :value="person.id"
            :key="person.id"
            :label="person.nickname"
            class="helf"
          ></Option>
        </Select>
      </FormItem>
      <FormItem prop="copyPerson" label="抄送人">
        <Select class="helf" filterable clearable multiple v-model="revokeData.copyPerson">
          <Option
            v-for="person in incumbencyTbUser"
            :value="person.id"
            :key="person.id"
            :label="person.nickname"
            class="self"
          >
            <h3>{{ person.nickname }}</h3>
            <h6>部门：{{person.deptName}}</h6>
            <h6>职位：{{person.positionName}}</h6>
          </Option>
        </Select>
      </FormItem> -->
    </Form>
  </div>
</template>
<script>
import { staticUrl } from '@/api/base.js'
export default {
  name: 'revoke',
  props: {
    revokeId: {
      type: Number,
      default: 0
    },
    incumbencyTbUser: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    const validateReason = (rule, value, callback) => {
      if (value.trim() === '') {
        return callback(new Error('销分说明不能为空'))
      } else {
        callback()
      }
    }
    return {
      revokeData: {
        rewardId: this.revokeId, // 销分id
        applyReason: '', // 消分说明
        enclosureList: [] // 截图
      },
      staticUrl,
      revokeValidate: {
        applyReason: [
          {
            validator: validateReason,
            required: true,
            trigger: 'blur'
          }
        ],
        enclosureList: [
          {
            required: true,
            message: '图片必须上传'
          }
        ]
      }
    }
  },
  methods: {
    delImg (index) {
      this.revokeData.enclosureList.splice(index, 1)
    },
    uploadSuccess (response, file, fileList) {
      let imgs = {
        enclosureName: response.filename,
        enclosureUrl: staticUrl + response.url
      }
      this.revokeData.enclosureList.push(imgs)
    },
    handleFormatError (file) {
      this.$Message.error('图片格式有误')
    }
  }
}
</script>
<style scoped>
.helf {
  width: 134px;
}
.full {
  width: 395px;
}
.inputbox {
  width: 50%;
  position: relative;
}
.inputbox .close {
  position: absolute;
  cursor: pointer;
  right: 0;
  top: 0;
  border-radius: 50%;
  z-index: 99;
}
</style>
