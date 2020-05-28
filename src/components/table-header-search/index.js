import HeaderInput from './components/header-input'
import HeaderSelect from './components/header-select'

const components = {
  HeaderInput
}

// 一般的表头搜索的输入框的Mixin
const HeaderInputMixin = {
  components: {
    HeaderInput
  },
  methods: {
    renderHeaderInput (h, params) {
      let { key, title } = params.column
      return (
        <HeaderInput
          v-model={this.detailHeader[key]}
          title={title}
          onOn-search={value => {
            this.detailSearch({ [key]: value, currPage: 1 })
          }}
        />
      )
    }
  }
}
export { HeaderInput, HeaderSelect, HeaderInputMixin }

export default components
