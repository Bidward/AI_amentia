# 百助空间智能化系统

## 项目简介
该项目起步于2019年年初，目的是百助年度目标——以智能化系统打造更好的团队
项目来源于iview-admin，具体可参考 [说明文档](README.OLD.MD) 
[项目实例](http://https://admin.iviewui.com/home)

## git地址
https://baizhu.5upm.net/git/BzSystemFront.git

## 文件结构
```shell
.
├── build                      项目构建配置
├── config                     开发相关配置
├── public                     打包所需静态资源
        ├── static             不需要webpack打包的文件，如icon,jquery
        └── index.html         出口
└── src
    ├── api  AJAX请求
        └──  base.js           根据域名判断测试还是正式服环境,暴露baseUrl
    └── assets                 项目静态资源
        ├── icons              自定义图标资源
        └── images             图片资源
    ├── components             业务组件，必须用index.js暴露
    ├── config                 项目运行配置
    ├── directive              自定义指令
    ├── libs                   封装工具函数
    ├── locale                 多语言文件
    ├── mock                   mock模拟数据,只会拦截走代理的数据
    ├── router                 路由配置
    ├── store                  Vuex配置
    ├── view                   页面文件
        ├── public             公共模块       一级目录
        ├── sem                营销
        ├── hr                 人力运营中心
            ├── organization   组织架构  二级目录
            └── position       职位配置
        ....
        
    └── tests  测试相关
```

# 规范
[风格指南](https://cn.vuejs.org/v2/style-guide])
## 上线流程
1. 接到开发需求，需要在master切出功能分支，如果只更改某个菜单下某一个功能，分支名为：二级目录名称/功能名，若多人开发一个功能，需要先切出分支，推送到远端，协同开发者都拉取同一分支，再在功能分支上协同开发。
2. 若直接连接后端ip开发，需要在vue.config.js里面更改代理配置为后端ip地址，需要注意端口号和二级目录，需注意更改vue.config.js文件需要重启本地服务。
3. 开发完成，并且和后端本地自测无异常后，功能分支合并到dev分支,若有安装新的依赖模块，需在git打标签，并在dev分支上重新安装依赖后打包上线测试服，地址为45服务器 /newhome/test.ai.bz.cn文件夹。备份上线当天，线上文件index.html文件和static文件夹，以日期结尾，如：index_191030.html留存在服务器上，保留最近三份代码即可。
4. 需求方在测试服验收完成之后，根据上线邮件，合并到master分支，打包上线，正式服代码备份方式和测试服同理。
5. 所有测试服、正式服上线需确认后端数据库变动以及接口文件上线完成之后，才能上线前端代码。
6. 跟踪上线及使用情况，若一周内无因本次功能改动产生的影响，可删除本地和远端的功能分支，功能开发完成。

## 文件及命名规范
1. 	文件名以及文件夹多个单词以连字符连接，原因是windows不区分文件大小写。
2.	变量、文件语义化命名,常量全大写，下划线连接，如：DEFAULT_URL，变量小驼峰命名，如：keywordId。
3.	/src/view/下文件夹应该是二级菜单，再对应三级目录或者tabs，应和routers层级保持一致，当前模块多次复用的组件应放在components文件夹内。
## 模板规范
1.	公用的组件应在/src/components/文件夹下建立组件文件夹，用index.js暴露，并完善组件使用说明文档。
2.	每一个组件都应命名，如果某个路由只有单个组件，路由名应该和组件名保持一致，只有这样路由的noCache才生效。
## 样式规范
1.	抽出themes.less，如@primary-color等。
2.	抽出一个公用的reset.less,将复写的属性整合(button、modal、tabs)
3.	抽出public.less，用于常用属性，如clearfix等。
4.	组件内部样式用scoped,或在不影响其他页面的前提下添加更高权重选择器复写。
5.	多个页面同一套样式，用@import 引入样式文件到局部样式，提高复用率，减少冗余代码。
6.	不允许直接用标签选择器，多单词链接的选择器用小驼峰命名。
7.	样式选择器不应超过三层。
## 路由规范
1.	根据二级目录，对子路由进行拆分成单文件，提高代码可阅读性。
2.	router的组件用懒加载，写法为: component:()=>import ../xx-router.js
3.	多tabs的页面用路由多层嵌套。
4.	子路由path不需要加/，是直接追加到父路由的后面。
5.	路由跳转使用name,而不是path，name以二级目录路由名开头。
## 脚本规范
1.	可重复使用私有属性，私有方法，使用mixins混入。
2.	props写默认值和type。
3.	vuex的state必须用mutations改变，响应式数据用computed获取
4.	生产环境文件的导出应该是 export 而不是module.exports
5.	禁止使用var
6.  用===代替==，对于判断可以用隐式类型转换做真假判断，如if(isActive)，
7.  变量先定义后使用，不适用的变量不要定义和引用
8.  不重复注释，不嵌套注释
9.  不要return 赋值表达式
10. 表达式后面要么不写逗号和分号，不要有不明确的逗号
11. 注意检查，不要定义数组的时候 连续两个逗号
12. 禁止绕过提交lint钩子


## todoList
1. iview升级4.x?
2. 样式统一 参考[全局样式复写](https://github.com/iview/iview/blob/2.0/src/styles/custom.less) 
    1. 统一几个类型样式，直接复用
    2. reset.less里面已经复写的样式 在各组件里面删除不必要的样式复写
    3. css重复打包的问题
3. 多个路由共用一个tabs功能待开发
4. 清理项目内实例文件、图片等
5. 表头搜索在切换菜单之后poptip不消失的问题
6. iview表格在切换tab之后宽度丢失(日常奖惩)
7. 表头搜索如何复用问题
8. 有些只在某些页面使用的组件，应该只在页面里面引用，没必要在首页加载的时候就加载，如OrgTree等等
9. 云平台的//公用函数Vue.tabChangeClick，完全没有必要
10. 待办事项过乱，应统一为落地页路由的name和id，params传参拼接/:id形式，query加上from或者type，将两人两遍判断写在业务里而不是待办事项
