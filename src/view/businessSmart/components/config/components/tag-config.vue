<template>
    <!--标签配置 -->
    <div>
        <SonSet
            :channelParentSubConfigs="tagOneLevelSubConfigs"
            style="float:left"
            @nextSet="getTwoConfig"
            v-bind="$attrs"
            @changeSwith="handleOneSwith"
        ></SonSet>
        <SonSet
            :channelParentSubConfigs="tagTwoLevelSubConfigs"
            style="float:left"
            @nextSet="getThreeConfig"
            v-if="showTwoConfig"
            v-bind="$attrs"
            @changeSwith="handleTwoSwith"
        ></SonSet>
        <!-- <SonSet
            :channelParentSubConfigs="tagThreeLevelSubConfigs"
            style="float:left"
            @nextSet="getLastUpConfig"
            v-if="showThreeConfig"
            v-bind="$attrs"
        ></SonSet> -->
        <LastSetUp
            :channelParentSubConfigs="lastUpSConfigs"
            style="float:left"
            v-if="showlastUpSConfigs"
            v-bind="$attrs"
            @addConfig="addParentConfigs"
            @editConfig="editParentConfigs"
            @deleteConfig="deleteParentConfigs"
            @changeSwith="handleFourSwith"
        ></LastSetUp>
        <!-- <lastSonSet
            :lastSetData="tagFourLevelSubConfigs"
            style="float:left"
            v-if="showLastConfig"
            v-bind="$attrs"
            @addConfig="addSonConfigs"
            @deleteConfig="deleteSonConfigs"
            @changeSwith="handleSonSwith"
            @editConfig="editSonConfigs"
        ></lastSonSet> -->
    </div>
</template>

<script>
import { biUrl } from '@/api/base.js'
import SonSet from './sonSet'
import lastSonSet from './last-son-set'
import LastSetUp from './tag-last-set'
export default {
  name: 'tagConfig',
  components: {
    SonSet,
    lastSonSet,
    LastSetUp
  },
  props: {},
  data () {
    return {
      showTwoConfig: false,
      showThreeConfig: false,
      showlastUpSConfigs: false, // 最后一个的上一个
      showLastConfig: false, // 显示最后一个
      tagOneLevelSubConfigs: {}, // 一级标签
      tagTwoLevelSubConfigs: {}, // 二级标签
      tagThreeLevelSubConfigs: {}, // 三级标签
      tagFourLevelSubConfigs: {}, // 四级配置
      lastUpSConfigs: {},
      // oneLevelData: {}, //标签
      // twoLevelData: {}, //侧重标签
      parentsData: {}, // 父级数据
      lastData: {} // 子级数据
    }
  },
  computed: {
    currentIds () {
      return this.$attrs.moduleL.currentId
    }
  },
  watch: {
    currentIds: {
      handler () {
        this.getData()
      },
      immediate: true
    }
  },
  methods: {
    // 获取数据(标签配置)
    getData () {
      let sendData = {
        userId: this.$store.state.user.userId,
        id: this.$attrs.moduleL.currentId,
        fieldType: this.$attrs.moduleL.currentFieldType,
        tagId: this.$attrs.moduleL.currentTagId,
        tagName: this.$attrs.moduleL.currentTagName,
        backlogId: this.$route.query.id || -1
      }
      this.$axios({
        url: biUrl + '/busiConfig/listSubConfig',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.tagOneLevelSubConfigs = res.data.data
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取数据
    getTwoConfig (item, stauts) {
      if (stauts) {
        let sendData = {
          userId: this.$store.state.user.userId,
          id: item.id,
          fieldType: item.fieldType,
          tagId: item.tagId,
          tagName: item.tagName,
          backlogId: this.$route.query.id || -1
        }
        this.$axios({
          url: biUrl + '/busiConfig/listSubConfig',
          method: 'post',
          data: $qs.stringify(sendData)
        })
          .then(res => {
            if (res.data.code === 10000) {
              if (item.tagId === '004002') {
                // 选择侧重标签，数据渲染到可编辑的组件
                this.lastData = item
                this.lastUpSConfigs = res.data.data
                this.showlastUpSConfigs = true
                this.showTwoConfig = false
                this.showThreeConfig = false
              } else if (item.tagId === '004001') {
                // 选择标签，数据渲染不可编辑的组件
                this.parentsData = item// 选择的一级数据
                this.tagTwoLevelSubConfigs = res.data.data
                this.showTwoConfig = true
                this.showlastUpSConfigs = false
                this.showThreeConfig = false
              }
            } else {
              this.$Message.error(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.showTwoConfig = false
        this.showThreeConfig = false
        this.showLastConfig = false
        this.showlastUpSConfigs = false
      }
    },
    // 点击端口类型一级
    getThreeConfig (item, stauts) {
      // this.parentsData = item// 选择的端口类型一级
      this.lastData = item
      this.showLastConfig = false
      if (stauts) {
        let sendData = {
          userId: this.$store.state.user.userId,
          id: item.id,
          fieldType: item.fieldType,
          tagId: item.tagId,
          tagName: item.tagName,
          backlogId: this.$route.query.id || -1
        }
        this.$axios({
          url: biUrl + '/busiConfig/listSubConfig',
          method: 'post',
          data: $qs.stringify(sendData)
        })
          .then(res => {
            if (res.data.code === 10000) {
              this.lastUpSConfigs = res.data.data
              this.showlastUpSConfigs = true
            } else {
              this.$Message.error(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.showThreeConfig = false
        this.showLastConfig = false
        this.showlastUpSConfigs = false
      }
    },
    // getLastUpConfig(item, stauts) {
    //     this.showlastUpSConfigs = false
    //     this.parentsData = item;
    //     if (stauts) {
    //         let sendData = {
    //             userId: this.$store.state.user.userId,
    //             id: item.id,
    //             fieldType: item.fieldType,
    //             tagId: item.tagId,
    //             tagName: item.tagName
    //         };
    //         this.$axios({
    //             url: biUrl + "/busiConfig/listSubConfig",
    //             method: "post",
    //             data: $qs.stringify(sendData)
    //         })
    //             .then(res => {
    //                 if (res.data.code === 10000) {
    //                     this.showlastUpSConfigs = true;
    //                     this.lastUpSConfigs = res.data.data;
    //                 } else {
    //                     this.$Message.error(res.data.msg);
    //                 }
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //             });
    //     } else {
    //         this.showLastConfig = false;
    //     }
    // },
    // getLastConfig(item, stauts) {
    //     this.lastData = item;
    //     if (stauts) {
    //         let sendData = {
    //             userId: this.$store.state.user.userId,
    //             id: item.id,
    //             fieldType: item.fieldType,
    //             tagId: item.tagId,
    //             tagName: item.tagName
    //         };
    //         this.$axios({
    //             url: biUrl + "/busiConfig/listSubConfig",
    //             method: "post",
    //             data: $qs.stringify(sendData)
    //         })
    //             .then(res => {
    //                 if (res.data.code === 10000) {
    //                     this.showLastConfig = true;
    //                     this.tagFourLevelSubConfigs = res.data.data;
    //                 } else {
    //                     this.$Message.error(res.data.msg);
    //                 }
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //             });
    //     } else {
    //         this.showLastConfig = false;
    //     }
    // },
    // 一级开关
    handleOneSwith (v) {
      let sendData = {
        userId: this.$store.state.user.userId,
        tagId: v.tagId,
        fieldType: this.$attrs.moduleL.currentFieldType,
        status: v.status,
        tagName: v.tagName,
        backlogId: this.$route.query.id || -1,
        parentTagId: this.$attrs.moduleL.currentTagId
      }
      this.$axios({
        url: biUrl + '/busiConfig/updateConfig',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            this.showTwoConfig = false
            this.showLastConfig = false
            this.showlastUpSConfigs = false
          } else {
            this.$Message.error(res.data.message)
          }
          if (res.data.code === 10010) {
            this.remind()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 二级开关
    handleTwoSwith (v) {
      let sendData = {
        userId: this.$store.state.user.userId,
        tagId: v.tagId,
        fieldType: this.parentsData.fieldType,
        status: v.status,
        tagName: v.tagName,
        backlogId: this.$route.query.id || -1,
        parentTagId: this.parentsData.tagId
      }
      this.$axios({
        url: biUrl + '/busiConfig/updateConfig',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            this.showlastUpSConfigs = false
          } else {
            this.$Message.error(res.data.message)
          }
          if (res.data.code === 10010) {
            this.remind()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 新增父级
    addParentConfigs (v) {
      let sendData = {
        userId: this.$store.state.user.userId,
        tagName: v,
        fieldType: this.lastData.fieldType,
        parentTagId: this.lastData.tagId,
        backlogId: this.$route.query.id || -1
      }
      this.$axios({
        url: biUrl + '/busiConfig/addConfig',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            this.getThreeConfig(this.lastData, true)
          } else {
            this.$Message.error(res.data.message)
          }
          if (res.data.code === 10010) {
            this.remind()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 编辑父级
    editParentConfigs (v) {
      let sendData = {
        userId: this.$store.state.user.userId,
        tagId: v.tagId,
        fieldType: this.lastData.fieldType,
        tagName: v.tagName,
        status: v.status,
        backlogId: this.$route.query.id || -1,
        parentTagId: this.lastData.tagId
      }
      this.$axios({
        url: biUrl + '/busiConfig/updateConfig',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            this.getThreeConfig(this.lastData, true)
          } else {
            this.$Message.error(res.data.message)
          }
          if (res.data.code === 10010) {
            this.remind()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 删除父级
    deleteParentConfigs (v) {
      let sendData = {
        userId: this.$store.state.user.userId,
        tagId: v.tagId,
        fieldType: this.lastData.fieldType,
        backlogId: this.$route.query.id || -1
      }
      this.$Modal.confirm({
        title: '提示',
        content: `是否对“${v.tagName}”进行删除`,
        onOk: () => {
          this.$axios({
            url: biUrl + '/busiConfig/deleteConfig',
            method: 'post',
            data: $qs.stringify(sendData)
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.$Message.success(res.data.msg)
                this.getThreeConfig(this.lastData, true)
              } else {
                this.$Message.error(res.data.message)
              }
              if (res.data.code === 10010) {
                this.remind()
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    // 四级开关(pc客户端一级)
    handleFourSwith (v) {
      let sendData = {
        userId: this.$store.state.user.userId,
        tagId: v.tagId,
        fieldType: this.lastData.fieldType,
        status: v.status,
        tagName: v.tagName,
        backlogId: this.$route.query.id || -1,
        parentTagId: this.lastData.tagId
      }
      this.$axios({
        url: biUrl + '/busiConfig/updateConfig',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            // this.showLastConfig = false;
          } else {
            this.$Message.error(res.data.message)
          }
          if (res.data.code === 10010) {
            this.remind()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // // 新增子级
    // addSonConfigs(v) {
    //     let sendData = {
    //         userId: this.$store.state.user.userId,
    //         tagName: v,
    //         fieldType: this.twoLevelData.fieldType,
    //         parentTagId: this.twoLevelData.tagId
    //     };
    //     this.$axios({
    //         url: biUrl + "/busiConfig/addConfig",
    //         method: "post",
    //         data: $qs.stringify(sendData)
    //     })
    //         .then(res => {
    //             if (res.data.code === 10000) {
    //                 this.$Message.success(res.data.msg);
    //                 // this.getLastUpConfig(this.twoLevelData,true)
    //             } else {
    //                 this.$Message.error(res.data.message);
    //             }
    //             if (res.data.code === 10010) {
    //                 this.remind();
    //             }
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         });
    // },
    // // 删除子级
    // deleteSonConfigs(v) {
    //     let sendData = {
    //         userId: this.$store.state.user.userId,
    //         tagId: v.tagId,
    //         fieldType: v.fieldType
    //     };
    //     this.$Modal.confirm({
    //         title: "提示",
    //         content: `是否对“${v.tagName}”进行删除`,
    //         onOk: () => {
    //             this.$axios({
    //                 url: biUrl + "/busiConfig/deleteConfig",
    //                 method: "post",
    //                 data: $qs.stringify(sendData)
    //             })
    //                 .then(res => {
    //                     if (res.data.code === 10000) {
    //                         this.$Message.success(res.data.msg);
    //                         // this.gonextConfig(this.parentData, true);
    //                     } else {
    //                         this.$Message.error(res.data.message);
    //                     }
    //                     if (res.data.code === 10010) {
    //                         this.remind();
    //                     }
    //                 })
    //                 .catch(err => {
    //                     console.log(err);
    //                 });
    //         }
    //     });
    // },
    // // 子级开关
    // handleSonSwith(v) {
    //     let sendData = {
    //         userId: this.$store.state.user.userId,
    //         tagId: v.tagId,
    //         fieldType: v.fieldType,
    //         status: v.status,
    //         tagName: v.tagName
    //     };
    //     this.$axios({
    //         url: biUrl + "/busiConfig/updateConfig",
    //         method: "post",
    //         data: $qs.stringify(sendData)
    //     })
    //         .then(res => {
    //             if (res.data.code === 10000) {
    //                 this.$Message.success(res.data.msg);
    //             } else {
    //                 this.$Message.error(res.data.message);
    //             }
    //             if (res.data.code === 10010) {
    //                 this.remind();
    //             }
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         });
    // },
    // // 编辑子级
    // editSonConfigs(v) {
    //     let sendData = {
    //         userId: this.$store.state.user.userId,
    //         tagId: v.tagId,
    //         fieldType: v.fieldType,
    //         status: v.status,
    //         tagName: v.tagName
    //     };
    //     this.$axios({
    //         url: biUrl + "/busiConfig/updateConfig",
    //         method: "post",
    //         data: $qs.stringify(sendData)
    //     })
    //         .then(res => {
    //             if (res.data.code === 10000) {
    //                 this.$Message.success(res.data.msg);
    //             } else {
    //                 this.$Message.error(res.data.message);
    //             }
    //             if (res.data.code === 10010) {
    //                 this.remind();
    //             }
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         });
    // },
    // 第三方编辑提示
    remind () {
      const title = '提示'
      const content = '<p>配置时间过长，操作失败，请返回重新编辑</p>'
      this.$Modal.warning({
        title: title,
        content: content
      })
    }
  }
}
</script>
