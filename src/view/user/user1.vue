<template>
    <div class="viewWrapper" id="user">
        <Tabs name="out" v-model="out" class="level-one" :animated="false">
            <TabPane tab="out" :label="'待办事项('+waitHandel+')'" name="todoList">
                <Tabs name="todoList" v-model="innerToDo" type="card" class="level-two" :animated="false" v-if="out=='todoList'">
                    <TabPane tab="todoList" label="全部" name="0">
                        <todo :sonTabName="innerToDo" @numData="getNumData" v-if="innerToDo==='0'" />
                    </TabPane>
                    <TabPane tab="todoList" label="定岗定编" name="1">
                        <todo :sonTabName="innerToDo" v-if="innerToDo==='1'" />
                    </TabPane>
                    <TabPane tab="todoList" label="任务系统" name="2">
                        <todo :sonTabName="innerToDo" v-if="innerToDo==='2'" />
                    </TabPane>
                </Tabs>
            </TabPane>
            <TabPane tab="out" label="已完成事项" name="doneList">
                <Tabs name="doneList" v-model="innerDone" type="card" class="level-two" :animated="false" v-if="out=='doneList'">
                    <TabPane tab="doneList" label="全部" name="0">
                        <done :sonTabName="innerDone"  v-if="innerDone==='0'" />
                    </TabPane>
                    <TabPane tab="doneList" label="定岗定编" name="1">
                        <done :sonTabName="innerDone" v-if="innerDone==='1'" />
                    </TabPane>
                    <TabPane tab="doneList" label="任务系统" name="2">
                        <done :sonTabName="innerDone" v-if="innerDone==='2'" />
                    </TabPane>
                </Tabs>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
import todo from './components/toDo'
import done from './components/done'
export default {
  name: 'user',
  components: {
    todo,
    done
  },
  data () {
    return {
      out: 'todoList',
      innerToDo: '0',
      innerDone: '0',
      waitHandel: '0'
    }
  },
  methods: {
    // 待办事项条数
    getNumData (nums) {
      this.waitHandel = nums
    }
  }
}
</script>

<style scoped>
.things {
    margin: 20px 0;
}
</style>
