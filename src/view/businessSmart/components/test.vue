<template>
    <div class="viewWrapper">
        产品名称：<Custom :customSettingList="customSettingList" @on-show-dropdownmenu="showList"  type="productName"/>
        来源：<Custom :customSettingList="customSettingList" @on-show-dropdownmenu="showList" type="source"/>
    </div>
</template>

<script>
import Custom from './test-custom'
export default {
  name: 'test',
  components: {
    Custom
  },
  data () {
    return {
      customSettingList: []
    }
  },
  methods: {
    showList (type) {
      console.log(type)
      // 根据 type 请求后端借口，然后给 this.customSettingList 赋值
      // 自定义弹框中的数据
      this.customSettingList = [
        { id: 1, name: '小野鸡炖蘑菇', selectStatus: 1 },
        { id: 2, name: '大野鸡炒鸡蛋', selectStatus: 1 }
      ]
    }
  }
}
</script>
