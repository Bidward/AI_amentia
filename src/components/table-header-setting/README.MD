# 自定义表头设置
1. 存放在localStorage里面

## table-header-setting API
字段名|类型|备注
-|----|----|-
totalTableHeader| Array|所有表头的数据
icon|String|button的样式
tableHeader|Array|双向绑定到iview-table，的字段
localKey|String|存在本地localStorage里的字段名，不应该重复
defaultList|Array|默认展示的的表头字段key，不填展示全部
width|Number、String|弹出框的宽度，默认500
cols|Number|多少列，默认4
showCheckAll|Boolen|是否展示全选框



### totalTableHeader
除了iview的column里面所有的值，还可以增加
alwaysShow属性，设置为true后，勾选框禁止取消勾选