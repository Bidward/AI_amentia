# dept-tree-select API

## props
字段名 | 类型 | 说明 | require | 值
-|----|----|----|----|-
optionsProps | Array | 选项初始数据 | true | 
addLabel | Array | 在option中添加选项 | false | 见下例
modalData | Array | 父组件控制组件中modal的值 | false | 
valueConsistsOf | String | 默认显示父级优先 | false |  BRANCH_PRIORITY（默认）LEAF_PRIORITY（子集优先）
defaultExpandLevel | Number | 展开层级 | false | 默认1
flattenSearchResults | Boolean | 搜索是是否平铺树 | false | 默认true展开

eg:
```json
addLabel: [
    { 
        id: '0',                // 不要和原数组id重复
        label: '负责人',   // 标签显示的内容
        pid: 'dpt1'         // 上级的pid
    },
]
```

## event
事件名 | 说明 | 返回值
-|----|----|-
treeSelect | 选中选项的id | Array
