const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/'
  : '/'

module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  publicPath: BASE_URL,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  assetsDir: 'static', // 静态资源目录
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      .set('_v', resolve('src/view'))
  },
  css: {
    loaderOptions: { // 向 CSS 相关的 loader 传递选项
      less: {
        javascriptEnabled: true // 详情见https://blog.csdn.net/weixin_41652495/article/details/83626651
      }
    }
  },
  // 打包时不生成.map文件
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true, // 允许不检验来路host
    // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的publicPath要写为 '' ，即空字符串
    proxy: {
      // 营销php
      '^/sem': {
        target: 'https://zone.bz.cn'
      },
      // java智能化
      '^/BzSystem': {
        target: 'https://test.zone.bz.cn'
        // target: 'https://zone.bz.cn'
      },
      // php支持服务
      '^/support': {
        target: 'https://test.zone.bz.cn'
      },
      '^/resources': {
        target: 'https://test.zone.bz.cn'
      },
      '^/bi': {
        target: 'https://test.zone.bz.cn'
        // target: 'http://192.168.3.60:8080'
        // target: 'http://192.168.1.50:8080'// 老王
        // target: 'http://192.168.5.122:8080'// 汉子
        // target: 'http://116.62.140.161'
      },
      // 晏子用go语言写的接口,用来统计页面加载速度
      '^/goTrack': {
        target: 'https://test.zone.bz.cn'
      },
      '^/pr': {
        // target: 'http://192.168.1.50:8080',
        target: 'https://test.zone.bz.cn'
        // target: 'http://192.168.1.50:8080'
        // target: 'http://192.168.3.60:8080'
      }
    }
  }

  /** 2019年12月27日 IE11兼容并不是因为这个问题解决的，影响打包速度故注释 NNNNzs
  // 文章来源 https://blog.csdn.net/lin13958756858/article/details/94731392
  configureWebpack: {
    module: {
      rules: [ // 'transform-runtime'插件告诉Babel,要引用runtime来代替注入。
        {
          test: /\.m?js$/,
          include: [
            resolve('src'),
            resolve('test'),
            resolve('node_modules/webpack-dev-server/client'),
            resolve('node_modules/iview/src'),
            resolve('node_modules/tree-table-vue/lib'),
            resolve('node_modules/v-org-tree/dist'),
            resolve('node_modules/vue-echarts/dist'),
            resolve('node_modules/echarts/dist')
          ],
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
  }
  */
}
