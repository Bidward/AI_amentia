<template>
<div id="mainWrap">
    <el-table :data="tableData" :span-method="objectSpanMethod" border style="width: 100%; margin-top: 20px">
        <el-table-column prop="first" label="一级菜单" width="180">
            <template slot-scope="scope">
                <el-checkbox-group v-model="scope.row.first.value">
                    <el-checkbox @change="changePer(scope.row,item.id,scope.$index)" v-for="item in scope.row.first.key" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </template>
        </el-table-column>
        <el-table-column prop="second" label="二级菜单">
            <template slot-scope="scope">
                <el-checkbox-group v-model="scope.row.second.value">
                    <el-checkbox @change="changePer(scope.row,item.id,scope.$index)" v-for="item in scope.row.second.key" :label="item.id" :value="item.id" :key="item.id">{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </template>
        </el-table-column>
        <el-table-column prop="three" label="三级菜单">
            <template slot-scope="scope">
                <el-checkbox-group v-model="scope.row.three.value">
                    <el-checkbox @change="changePer(scope.row,item.id,scope.$index)" v-for="item in scope.row.three.key" :label="item.id" :value="item.id" :key="item.id">{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </template>
        </el-table-column>
        <el-table-column prop="four" label="功能点">
            <template slot-scope="scope">
                <el-checkbox-group v-model="scope.row.four.value">
                    <el-checkbox @change="changePer(scope.row,item.id,scope.$index)" v-for="item in scope.row.four.key" :label="item.id" :value="item.id" :key="item.id">{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </template>
        </el-table-column>
    </el-table>
</div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [{
        first: {
          key: [{
            name: '个人主页',
            id: 1
          }],
          value: [],
          row: 1
        },
        second: {
          key: [],
          value: [],
          row: 1
        },
        three: {
          key: [],
          value: [],
          row: 1
        },
        four: {
          key: [],
          value: [],
          row: 1
        }
      }, {
        first: {
          key: [{
            name: '综合模块',
            id: 2
          }],
          value: [],
          row: 3
        },
        second: {
          key: [{
            name: '公司信息',
            id: 3
          }],
          value: [],
          row: 1
        },
        three: {
          key: [],
          value: [],
          row: 1
        },
        four: {
          key: [{
            name: '新增',
            id: 4
          }, {
            name: '编辑',
            id: 5
          }],
          value: [],
          row: 1
        }
      }, {
        first: {
          key: [],
          value: [],
          row: 0
        },
        second: {
          key: [{
            name: '组织架构1',
            id: 6
          }],
          value: [],
          row: 2
        },
        three: {
          key: [{
            name: '组织架构tu',
            id: 7
          }],
          value: [],
          row: 1
        },
        four: {
          key: [{
            name: '新增',
            id: 8
          }, {
            name: '编辑',
            id: 9
          }],
          value: [],
          row: 1
        }
      }, {
        first: {
          key: [],
          value: [],
          row: 0
        },
        second: {
          key: [],
          value: [],
          row: 0
        },
        three: {
          key: [{
            name: '用户管理',
            id: 10
          }],
          value: [],
          row: 1
        },
        four: {
          key: [{
            name: '用户管理',
            id: 11
          }],
          value: [],
          row: 1
        }
      }]
    }
  },
  methods: {
    changePer (row, checkid, $index) {
      let newi
      // console.log(row,checkid)
      let keysArr = Object.keys(row)
      // console.log(keysArr)
      for (let i = 0; i < keysArr.length; i++) {
        let keys = keysArr[i]
        let ischeckid = row[keys].key.find((item) => item.id === checkid)
        if (ischeckid) {
          newi = i
          break
        }
      }
      console.log(newi)
      for (let i = 0; i < keysArr.length; i++) {
        if (i < newi) {
          console.log(i)
          let keys = keysArr[i]
          let tempRow = row
          let index = $index
          console.log(index)
          while (tempRow[keys].row === 0) {
            tempRow = this.tableData[--index]
          }
          console.log(index)
          console.log(keys)
          tempRow[keys].value = []
          tempRow[keys].key.forEach((item) => tempRow[keys].value.push(item.id))
        }
      }
    },
    objectSpanMethod ({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      let keys = Object.keys(row)
      let key = keys[columnIndex]
      let rowNum = row[key].row
      if (rowNum === 0) {
        return [0, 0]
      } else {
        return [rowNum, 1]
      }
    }
  }
}
</script>

<style>
#mainWrap {
    top: 100px;
    padding: 30px;
}
</style>
