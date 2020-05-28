<template>
  <!-- 编辑联系人 -->
  <div>
    <Modal
      :title="editType"
      v-model="showModal"
      :loading="loading"
      :mask-closable="false"
      @on-ok="submit"
    >
      <Form :label-width="100" ref="detpEditForm" :model="data" :rules="rules">
        <FormItem key="job" label="职务:" prop="job">
          <Input v-model.trim="data.job" />
        </FormItem>
        <FormItem key="name" label="姓名:" prop="name">
          <Input v-model.trim="data.name" />
        </FormItem>
        <FormItem key="phone" label="联系电话:" prop="phone">
          <Input v-model.trim="data.phone" />
        </FormItem>
        <FormItem key="chargeUID" label="负责人:" prop="chargeUID">
          <Select v-model="data.chargeUID" filterable>
            <Option
              v-for="person in employees"
              :value="person.id"
              :key="person.id"
              :label="person.nickname"
            />
          </Select>
        </FormItem>
        <FormItem key="times" label="频率:" prop="times">
          <AutoComplete v-model.trim="data.times" :data="timesList" placeholder="请选择频率" />
        </FormItem>
        <FormItem key="partnerUID" label="可参加人员:" prop="partnerUID">
          <Select v-model="data.partnerUID" multiple filterable>
            <Option
              v-for="person in employees"
              :value="person.id"
              :key="person.id"
              :label="person.nickname"
            />
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { timesList } from '../data'
import { phpURL } from '@/api/base.js'
const validate = [{ required: true, message: '必填', trigger: 'blur' }]
export default {
  name: 'userEdit',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    editType: {
      type: String,
      default: '新增'
    },
    propsData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      timesList,
      loading: true,
      data: {
        type: 'person',
        job: '', // 职务
        name: '', // 姓名
        phone: '', // 联系电话
        chargeUID: '', // 负责人,公司负责人
        times: '', // 频率
        partnerUID: [] // 可参加人员
      },
      rules: {
        type: validate,
        unitName: validate,
        job: validate,
        name: validate,
        phone: validate,
        chargeUID: validate,
        times: validate,
        partnerUID: []
      }
    }
  },
  mounted () {
    this.data = Object.assign(this.data, this.propsData)
  },
  methods: {
    submit () {
      this.$refs.detpEditForm.validate(v => {
        if (v) {
          if (this.isAdd) {
            this.addDept()
          } else {
            this.editDept()
          }
        }
      })
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    addDept () {
      let data = this.data
      this.$axios({
        url: phpURL + '/declareProject/ContactUnit/saveUnit',
        method: 'post',
        data: $qs.stringify(data)
      }).then(res => {
        const { code, msg } = res.data
        if (code === 10000) {
          this.submitOk()
        } else {
          this.$Message.error(msg)
        }
      })
    },
    editDept () {
      // updateDept
      let data = this.data
      this.$axios({
        url: phpURL + '/Outreach/updateDept',
        method: 'post',
        data: $qs.stringify(data)
      }).then(res => {
        const { code, msg } = res.data
        if (code === 10000) {
          this.submitOk()
        } else {
          this.$Message.error(msg)
        }
      })
    },
    //
    submitOk () {
      this.showModal = false
      this.$emit('on-success', true)
      this.$emit('input', false)
    }
  },
  computed: {
    showModal: {
      get () {
        return this.value
      },
      set () {
        this.$emit('input', false)
      }
    },
    employees () {
      return this.$store.state.user.employees
    }
  }
}
</script>

<style>
</style>
