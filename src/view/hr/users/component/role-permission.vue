<template>
<div>
    <Modal v-model="rolePermissionModal" title="角色设置" @on-ok="saveRoleSet"  @on-cancel="closeModal">
        <div>
            <Select v-model="roleId">
                <Option v-for="(item,key) in rolePermissionList" :value="item.roleId" :key="key" :label="item.roleName"></Option>
            </Select>
        </div>
    </Modal>
</div>
</template>

<script>
import mixins from '../mixins'
import {
  baseUrl
} from '@/api/base.js'
export default {
  name: 'rolePermission',
  mixins: [mixins],
  props: {
    'show': Boolean,
    'rowData': Object
  },
  data () {
    return {
      rolePermissionModal: this.show,
      roleId: this.rowData.roleId
    }
  },
  mounted () {
    this.getRolePermission()
  },
  methods: {
    closeModal () {
      this.$emit('update:show', false)
    },
    updataList () {
      this.$emit('updataList')
    },
    // 保存给用户设置的角色
    saveRoleSet () {
      let sendData = {
        userId: this.rowData.id,
        roleId: this.roleId
      }
      this.$axios({
        url: baseUrl + '/permission/updateUserRole',
        data: $qs.stringify(sendData),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.$Message.info(resp.data.msg)
            this.closeModal()
            this.updataList()
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    }

  },
  watch: {
    rolePermissionModal: {
      handler (newVal) {
        this.rolePermissionModal = this.show
      },
      immediate: true
    }
  }
}
</script>

<style lang="" scoped>

</style>
