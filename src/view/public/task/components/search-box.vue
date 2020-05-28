<template>
  <div class="search-box">
    <!-- 先注释 -->
    <!-- <reward-detail></reward-detail> -->
    <Input
      search
      clearable
      placeholder="任务名称、接收人、执行人"
      v-model="searchCont"
      @on-change="handleSearchContentChange"
      @on-search="handleSearch"
      style="width: 200px;"
    />
    <Button style="margin-left: 5px" @click="refresh">
      <Icon type="md-refresh" size="small"></Icon>
    </Button>
    <TableHeaderSetting
      v-show="showSearch"
      :totalTableHeader="totalTableHeader"
      :tableHeader.sync="tableHeader"
      :key="searchTableHeader"
      :localKey="searchTableHeader"
      :defaultList="defaultList"
    />
  </div>
</template>

<script>
import RewardDetail from './reward-detail'
import TableHeaderSetting from '_c/table-header-setting'
export default {
  components: {
    RewardDetail,
    TableHeaderSetting
  },
  props: {
    searchContent: {
      type: String,
      default: ''
    },
    totalTableHeader: {
      type: Array,
      default () {
        return []
      }
    },
    defaultList: {
      type: Array,
      default () {
        return []
      }
    },
    searchType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      searchCont: this.searchContent.trim(),
      tableHeader: [],
      showSearch: true,
      searchTableHeader: 'propose'
    }
  },
  mounted () {
    this.showSearchBox()
    this.setLocalhost()
  },
  methods: {
    showSearchBox () {
      if (this.searchType === 'depart') {
        this.showSearch = false
      } else {
        this.showSearch = true
      }
    },
    setLocalhost () {
      this.searchTableHeader = this.searchType
    },
    handleSearchContentChange () {
      this.$emit('search-content-change', this.searchCont.trim())
    },
    handleSearch () {
      if (!this.searchCont) return
      this.$emit('inaccurate-search')
    },
    refresh () {
      this.searchCont = ''
      this.$emit('refresh')
    }
  },
  watch: {
    searchContent (newVal) {
      this.searchCont = newVal.trim()
      // console.log(this.searchCont)
    },
    tableHeader (newV) {
      if (newV) {
        this.$emit('tableHeaders', newV)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .search-box {
    display: flex;
  }
</style>
