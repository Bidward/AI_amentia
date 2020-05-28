<template>
<!-- 业务配置 -->
<div class="cloudCooper">
  <Tabs value="1" tab="outTable"  :animated="false" @on-click="openComponent" >
    <TabPane label="业务配置" name="1"></TabPane>
    <TabPane label="标签关联管理" name="2"  ></TabPane>
    <TabPane label="待确认事项" name="3" ></TabPane>
  </Tabs>
    <!--区域配置-->
    <!-- 区域配置于2019年12月4日产品提出暂时用不着去掉 -->
    <!-- <div class="areaConfig">
        <span class="Title">区域配置</span>
        <div class="areaConfigMain main">
            <ul>
                <li>
                    <span>华东：</span>
                    <Select v-model="cloudConfig.eastChina" multiple style="width:500px" @on-change="changeEastArea" :disabled="!isEdit">
                        <Option v-for="item in chinaEst" :value="item.provinceID" :key="item.provinceID" :disabled="item.flag" :check="item.check">{{ item.province }}</Option>
                    </Select>
                </li>
                <li>
                    <span>华南：</span>
                    <Select v-model="cloudConfig.southChina" multiple style="width:500px" @on-change="changeSouthArea" :disabled="!isEdit">
                        <Option v-for="item in chinaSot" :value="item.provinceID" :key="item.provinceID" :disabled="item.flag" :check="item.check">{{ item.province }}</Option>
                    </Select>
                </li>
                <li>
                    <span>华北：</span>
                    <Select v-model="cloudConfig.nrothChina" multiple style="width:500px" @on-change="changeNorthArea" :disabled="!isEdit">
                        <Option v-for="item in chinaNor" :value="item.provinceID" :key="item.provinceID" :disabled="item.flag" :check="item.check">{{ item.province }}</Option>
                    </Select>
                </li>
            </ul>
        </div>
    </div> -->

     <!--客户等级-->
    <div class="businessType">
        <span class="Title">客户等级</span>
        <div class="businessTypeMain main">
            <ul>
                <li>
                    <span class="left">客户等级：</span>
                    <div class="businessTypeList">
                        <div v-for="(item,i) in customTypeList" :key="item.id" style="float:left">
                            <Tag :name="item.title" @on-close="deletCustom(item)" style="height: 35px;line-height: 35px;" v-if="editCustom[i]" :closable="isEdit">
                                {{ item.title }}
                                <span style="float:none;margin-left: 3px;" v-if="isEdit">
                                    <Icon type="md-color-filter" style="color: #a5a2a2;" @click="customeEdit(i)" />
                                </span>
                            </Tag>
                            <span v-else>
                                <Input v-model="item.title" @on-blur="saveCustomeTag(i,item)" placeholder="编辑客户等级" style="width: 130px" />
                            </span>
                        </div>
                    </div>
                </li>
                <div style="clear: both;"></div>
            </ul>
            <div class="addBust" v-if="isEdit">
                <Input v-model="addCustomType" placeholder="增加客户等级" style="width: 300px" />
                <Button @click="addCustom" class="btn" style="margin-left: -2px;">添加</Button>
            </div>
        </div>
    </div>

    <!--业务类型-->
    <div class="businessType">
        <span class="Title">业务类型</span>
        <div class="businessTypeMain main">
            <ul>
                <li>
                    <span class="left">业务类型：</span>
                    <div class="businessTypeList">
                        <div v-for="(item,i) in busTypeList" :key="item.id" style="float:left">
                            <Tag :name="item.title" @on-close="handleClose(item)" style="height: 35px;line-height: 35px;" v-if="editBus[i]" :closable="isEdit">
                                {{ item.title }}
                                <span style="float:none;margin-left: 3px;" v-if="isEdit">
                                    <Icon type="md-color-filter" style="color: #a5a2a2;" @click="busEdit(i)" />
                                </span>
                            </Tag>
                            <span v-else>
                                <Input v-model="item.title" @on-blur="saveTag(i,item)" placeholder="编辑业务类型" style="width: 130px" />
                            </span>
                        </div>
                    </div>
                </li>
                <div style="clear: both;"></div>
            </ul>
            <div class="addBust" v-if="isEdit">
                <Input v-model="addBusType" placeholder="增加业务类型" style="width: 300px" />
                <Button @click="addBuss" class="btn" style="margin-left: -2px;">添加</Button>
            </div>
        </div>
    </div>
    <!-- 标签 -->

    <div class="categoryLable">
        <span class="Title">标签</span>
        <!--
        <div class="layLableMain main">
            <ul>
                <li>
                    <span class="left">一级标签：</span>
                    <div class="businessTypeList">
                        <div v-for="(item,i) in firstTag" :key="item.id" style="float:left">
                            <Tag :name="item.tagName" @on-close="removeFirst(item)" style="height: 30px;line-height: 30px;" v-if="showedit[i]" :closable="isEdit">
                                {{ item.tagName }}
                                <span style="float:none;margin-left: 3px;" v-if="isEdit">
                                    <Icon type="md-color-filter" style="color: #a5a2a2;" @click="editFirstTag(i)" />
                                </span>
                            </Tag>
                            <span v-else>
                                <Input v-model="item.tagName" @on-blur="saveEditFirst(i,item)" style="width: 130px" />
                            </span>
                        </div>
                    </div>
                </li>
                <div style="clear: both;"></div>
            </ul>
            <div class="addBust" v-if="isEdit">
                <Input v-model="addCategory" placeholder="增加一级标签" style="width: 300px" />
                <Button @click="saveAddFirst" class="btn" style="margin-left: -2px;">添加</Button>
            </div>
        </div>
        -->
        <!--19.11.5 暂时隐藏二级标签-->
        <div class="categoryLableMain main" >
            <Table border :columns="tagListTitle" :data="tagLists"></Table>
            <p style="margin-top: 15px">
                <Button @click="setCategory" class="btn" v-if="isEdit">标签设置</Button>
            </p>
        </div>
    </div>
    <!-- 侧重标签 -->
    <div class="layLable">
        <span class="Title">侧重标签</span>
        <div class="layLableMain main">
            <ul>
                <li>
                    <span class="left">侧重标签：</span>
                    <div class="businessTypeList">
                        <div v-for="(item,i) in emphasisTagList" :key="item.id" style="float:left">
                            <Tag :name="item.title" @on-close="handleCloseLay(item)" style="height: 30px;line-height: 30px;" v-if="editEmphasis[i]" :closable="isEdit">
                                {{ item.title }}
                                <span style="float:none;margin-left: 3px;" v-if="isEdit">
                                    <Icon type="md-color-filter" style="color: #a5a2a2;" @click="emphasisEdit(i)" />
                                </span>
                            </Tag>
                            <span v-else>
                                <Input v-model="item.title" @on-blur="saveEmphasisTag(i,item)" style="width: 130px" />
                            </span>
                        </div>
                    </div>
                </li>
                <div style="clear: both;"></div>
            </ul>
            <div class="addBust" v-if="isEdit">
                <Input v-model="addEmphasis" placeholder="增加侧重标签" style="width: 300px" />
                <Button @click="addEmp" class="btn" style="margin-left: -2px;">添加</Button>
            </div>
        </div>
    </div>
    <!-- 开票属性 -->
    <div class="openTicket">
        <span class="Title">开票属性</span>
        <div class="openTicketMain main">
            <ul>
                <li>
                    <span class="left">开票类型：</span>
                    <div class="businessTypeList">
                        <div v-for="(item,i) in openTicketType" :key="item.id" style="float:left">
                            <Tag :name="item.title" @on-close="handleCloseType(item)" style="height: 30px;line-height: 30px;" v-if="editOpenTicketType[i]" :closable="isEdit">
                                {{ item.title }}
                                <span style="float:none;margin-left: 3px;" v-if="isEdit">
                                    <Icon type="md-color-filter" style="color: #a5a2a2;" @click="openTicketTypeEdit(i)" />
                                </span>
                            </Tag>
                            <span v-else>
                                <Input v-model="item.title" @on-blur="saveOpenTicketType(i,item)" style="width: 130px" />
                            </span>
                        </div>
                    </div>
                </li>
                <div style="clear: both;"></div>
                <div class="addBust" v-if="isEdit">
                    <Input v-model="addTicketType" placeholder="增加开票类型" style="width: 300px" />
                    <Button @click="addOpenTicketType" class="btn" style="margin-left: -2px;">添加</Button>
                </div>
                <br />
                <li>
                    <span class="left">开票内容：</span>
                    <div class="businessTypeList">
                        <div v-for="(item,i) in openTicketCont" :key="item.id" style="float:left">
                            <Tag :name="item.title" @on-close="handleCloseCont(item)" style="height: 30px;line-height: 30px;" v-if="editOpenTicketCont[i]" :closable="isEdit">
                                {{ item.title }}
                                <span style="float:none;margin-left: 3px;" v-if="isEdit">
                                    <Icon type="md-color-filter" style="color: #a5a2a2;" @click="openTicketContEdit(i)" />
                                </span>
                            </Tag>
                            <span v-else>
                                <Input v-model="item.title" @on-blur="saveOpenTicketCont(i,item)" style="width: 130px" />
                            </span>
                        </div>
                    </div>
                </li>
                <div style="clear: both;"></div>
                <div class="addBust" v-if="isEdit">
                    <Input v-model="addTicketCont" placeholder="增加开票内容" style="width: 300px" />
                    <Button @click="addOpenTicketCont" class="btn" style="margin-left: -2px;">添加</Button>
                </div>
            </ul>
        </div>
    </div>
    <!-- 包体类型 -->
    <div class="businessType">
        <span class="Title">包体类型</span>
        <div class="businessTypeMain main">
            <ul>
                <li>
                    <span class="left">包体类型：</span>
                    <div class="businessTypeList">
                        <div v-for="(item,i) in bagTypeList" :key="item.id" style="float:left">
                            <Tag :name="item.title" @on-close="handleCloseBag(item)" style="height: 35px;line-height: 35px;" v-if="editBag[i]" :closable="isEdit">
                                {{ item.title }}
                                <span style="float:none;margin-left: 3px;" v-if="isEdit">
                                    <Icon type="md-color-filter" style="color: #a5a2a2;" @click="bagEdit(i)" />
                                </span>
                            </Tag>
                            <span v-else>
                                <Input v-model="item.title" @on-blur="saveBag(i,item)" placeholder="编辑包体类型" style="width: 130px" />
                            </span>
                        </div>
                    </div>
                </li>
                <div style="clear: both;"></div>
            </ul>
            <div class="addBust" v-if="isEdit">
                <Input v-model="addbagType" placeholder="增加包体类型" style="width: 300px" />
                <Button @click="addbagTypes" class="btn" style="margin-left: -2px;">添加</Button>
            </div>
        </div>
    </div>
    <!-- 渠道信息 -->
    <div class="businessType">
        <span class="Title">渠道信息</span>
        <div class="businessTypeMain main">
            <ul>
                <li>
                    <span class="left">量级：</span>
                    <div class="businessTypeList">
                        <div v-for="(item,i) in magnitudeList" :key="item.id" style="float:left">
                            <Tag :name="item.title" @on-close="handleClosMagnitude(item)" style="height: 35px;line-height: 35px;" v-if="editMagnitude[i]" :closable="isEdit">
                                {{ item.title }}
                                <span style="float:none;margin-left: 3px;" v-if="isEdit">
                                    <Icon type="md-color-filter" style="color: #a5a2a2;" @click="magnitudeEdit(i)" />
                                </span>
                            </Tag>
                            <span v-else>
                                <Input v-model="item.title" @on-blur="savetMagnitude(i,item)" placeholder="编辑量级" style="width: 130px" />
                            </span>
                        </div>
                    </div>
                </li>
                <div style="clear: both;"></div>
            </ul>
            <div class="addBust" v-if="isEdit">
                <Input v-model="addMagnitude" placeholder="增加量级" style="width: 300px" />
                <Button @click="addMagnitudes" class="btn" style="margin-left: -2px;">添加</Button>
            </div>
        </div>
    </div>
    <!-- 取消保存 -->
    <div class="botomBtn">
        <Button style="margin-right: 30px;" v-if="isEdit" @click="cancleAll">返回</Button>
        <Button class="btn" @click="isEdit=!isEdit" v-else>编辑</Button>
    </div>

    <!-- 标签设置弹框 -->
    <Modal v-model="configCategory" title="标签设置"   width="700px" :mask-closable="false">
        <!-- 一级 -->
        <div class="category left">
            <ul>
                <div v-for="(item,i) in firstTag" :key="item.id">
                    <li :class="activeClass == item.id ? 'active':''" @click="changeShowSon(item)" @mousemove="showeditDel(i)" @mouseleave="noShoweditDel(i)" :name="item.tagName" v-if="showedit[i]" style="padding-left:10px">
                        <span>{{item.tagName}}</span>
                        <span v-show="showEditDel[i]">
                            <span class="right">
                                <Button shape="circle" icon="ios-remove" size="small" @click="removeFirst(item)"></Button>
                            </span>
                            <span class="right">
                                <Button shape="circle" icon="ios-brush-outline" size="small" @click="editFirstTag(i)"></Button>
                            </span>
                        </span>
                    </li>
                    <li v-else>
                        <Input style="width: 64%;" v-model="item.tagName" />
                        <Button @click="cancelEditFirst(i)">取消</Button>
                        <Button class="btn" @click="saveEditFirst(i,item)">保存</Button>
                    </li>
                </div>
                <p class="addCategory" @click="showAddCates" v-if="showAddCate" style="margin-top:8px;color: #19aa8d;font-size: 13px;">+新增</p>
                <p v-else>
                    <Input v-model="addCategory" placeholder="新增标签" style="width: 64%;" />
                    <Button @click="cancelAddFirst">取消</Button>
                    <Button class="btn" @click="saveAddFirst">保存</Button>
                </p>
            </ul>
        </div>
        <!-- 二级 -->
        <div class="category right">
            <ul>
                <div v-for="(item,i) in firstTagSon" :key="item.id">
                    <li @mousemove="showeditSon(i,item)" @mouseleave="noshoweditSon(i)" :name="item.tagName" v-if="showeditSecond[i]" style="padding-left:10px">
                        <span>{{item.tagName}}</span>
                        <span v-show="showeditSonDel[i]">
                            <span class="right">
                                <Button shape="circle" icon="ios-remove" size="small" @click="removeSecond(item)"></Button>
                            </span>
                            <span class="right">
                                <Button shape="circle" icon="ios-brush-outline" size="small" @click="editSecondTag(i)"></Button>
                            </span>
                        </span>
                    </li>
                    <li v-else>
                        <Input style="width: 64%;" v-model="item.tagName" />
                        <Button @click="cancelEditSecond(i)">取消</Button>
                        <Button class="btn" @click="saveEditSecond(i,item)">保存</Button>
                    </li>
                </div>
                <p class="addCategory" @click="showAddCateSons" v-if="showAddCateSon" style="margin-top:8px;color: #19aa8d;font-size: 13px;">+新增</p>
                <p v-else>
                    <Input v-model="addCategorySon" placeholder="新增标签" style="width: 64%;" />
                    <Button @click="cancelAddSecond">取消</Button>
                    <Button class="btn" @click="saveAddSecond">保存</Button>
                </p>
            </ul>
        </div>
        <div style="clear: both;"></div>
         <div slot="footer">
         <Button type="text" size="large"></Button>
        <Button  type="primary" size="large" @click="ok">关闭</Button>
       </div>
    </Modal>
</div>
</template>

<script>
import { phpURL } from '@/api/base.js'
export default {
  name: 'businessConfigCon',
  data () {
    return {
      isEdit: false,
      // chinaEst: [], // 华东
      // chinaSot: [], // 华南
      // chinaNor: [], // 华北
      // cloudConfig: {
      //   eastChina: [], // 华东
      //   southChina: [], // 华南
      //   nrothChina: [], // 华北
      //   businessName: '', // 业务名称
      //   businessType: '' // 业务类型
      // },
      // busType: '',
      editBus: [], // 编辑业务类型
      editEmphasis: [], // 编辑侧重标签
      busTypeList: [], // 业务类型
      addBusType: '', // 增加业务类型

      editCustom: [], // 编辑客户等级
      customTypeList: [], // 客户等级
      addCustomType: '', // 增加客户等级

      configCategory: false,
      emphasisTagList: [], // 侧重标签
      addEmphasis: '', // 增加侧重标签
      showedit: [], // 一级标签设置编辑弹框
      showeditSecond: [], // 二级标签设置编辑弹框
      showAddCate: true,
      showAddCateSon: true,
      showSonMain: false, // 显示子菜单
      openTicketType: [], // 开票类型
      editOpenTicketType: [], // 编辑开票类型
      addTicketType: '', // 增加开票类型
      openTicketCont: [], // 开票内容
      editOpenTicketCont: [], // 编辑开票类型
      addTicketCont: '', // 增加开票内容
      bagTypeList: [], // 包体类型
      editBag: [], // 编辑包体类型
      addbagType: '', // 增加包体类型
      magnitudeList: [], // 渠道信息量级
      editMagnitude: [], // 编辑渠道信息量级
      addMagnitude: '', // 新增渠道信息量级
      showEditDel: [], // 显示一级标签的编辑删除
      showeditSonDel: [], // 显示一级标签的编辑删除
      // 标签
      tagListTitle: [{
        title: '一级标签',
        key: 'tagName',
        align: 'center'
      },
      {
        title: '二级标签',
        key: 'secondTagNames',
        align: 'center'
      }
      ],
      tagLists: [], // 标签表格数据
      activeClass: 1, // 默认选中的标签颜色
      // 一级新增标签
      firstTag: [],
      // 一级新增标签model
      addCategory: '',
      // 二级新增标签
      firstTagSon: [],
      // 二级新增标签model
      addCategorySon: '',
      selectedFid: 0
    }
  },
  // 页面加载时获取业务类型数据
  mounted () {
    this.getData() // 获取业务类型数据
    // this.getEastData() // 获取华东区
    // this.getSouthData() // 获取华南区
    // this.getNorthData() // 获取华北区
    this.getEmphasisData() // 获取侧重标签
    this.getFirstTsg() // 获取一级标签
    this.getSecondTsg() // 获取二级标签
    this.getTagList() // 获取标签表格数据
    this.getOpenTicketType() // 获取开票类型数据
    this.getOpenTicketCont() // 获取开票内容
    this.getBagTypeList() // 获取包体类型
    this.getMagnitudeList()// 获取渠道信息量级
  },
  methods: {
    // 获取业务类型数据 和 客户等级数据
    getData () {
      this.$axios({
        url: phpURL + '/cloud/customerLevelList',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.customTypeList = res.data.content
            this.editCustom = this.customTypeList.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })

      this.$axios({
        url: phpURL + '/cloud/busTypeList',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.busTypeList = res.data.content
            this.editBus = this.busTypeList.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 打开不同组件
    openComponent (name) {
      switch (name) {
        case '1':
          this.$router.push({
            name: 'businessConfig'
          })
          break
        case '2':
          this.$router.push({
            name: 'labelManage'
          })
          break
        case '3':
          this.$router.push({
            name: 'waitConfirmCon'
          })
          break
      }
    },
    // 删除客户等级
    deletCustom (item) {
      let sendData = {
        id: item.id
      }
      this.$axios({
        url: phpURL + '/cloud/customerLevelDel',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.customTypeList = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 删除业务类型
    handleClose (item) {
      let sendData = {
        id: item.id
      }
      this.$axios({
        url: phpURL + '/cloud/busTypeDel',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.busTypeList = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 新增客户等级
    addCustom () {
      let sendData = {
        title: this.addCustomType
      }
      this.$axios({
        url: phpURL + '/cloud/customerLevelAdd',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.customTypeList = res.data.content
            this.editCustom = this.customTypeList.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
      this.addCustomType = ''
    },
    // 新增业务类型
    addBuss () {
      let sendData = {
        title: this.addBusType
      }
      this.$axios({
        url: phpURL + '/cloud/busTypeAdd',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.busTypeList = res.data.content
            this.editBus = this.busTypeList.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
      this.addBusType = ''
    },
    // 编辑客户等级
    customeEdit (i) {
      this.$set(this.editCustom, i, false)
    },
    // 保存编辑客户等级
    saveCustomeTag (i, item) {
      this.$set(this.editCustom, i, true)
      let sendData = {
        title: item.title,
        id: item.id
      }
      this.$axios({
        url: phpURL + '/cloud/customerLevelEdit',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.customTypeList = res.data.content
            this.editCustom = this.customTypeList.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
            this.getData()
          }
        })
        .catch(err => {
          console.log(err.data)
        })
      this.addCustomType = ''
    },
    // 编辑业务类型
    busEdit (i) {
      this.$set(this.editBus, i, false)
    },
    // 保存编辑业务类型
    saveTag (i, item) {
      this.$set(this.editBus, i, true)
      let sendData = {
        title: item.title,
        id: item.id
      }
      this.$axios({
        url: phpURL + '/cloud/busTypeEdit',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.busTypeList = res.data.content
            this.editBus = this.busTypeList.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
            this.getData()
          }
        })
        .catch(err => {
          console.log(err.data)
        })
      this.addBusType = ''
    },
    // 获取华北区配置
    // getNorthData () {
    //   this.$axios({
    //     url: phpURL + '/cloud/getAreaProvinces',
    //     method: 'post',
    //     data: $qs.stringify({
    //       areaId: 2
    //     })
    //   }).then(res => {
    //     this.chinaNor = res.data.content
    //     this.cloudConfig.nrothChina = res.data.content
    //       .filter(e => {
    //         return e.check
    //       })
    //       .map(e => {
    //         return e.provinceID
    //       })
    //   })
    // },
    // 改变华北区配置
    // changeNorthArea () {
    // if (v) return;
    //   let sendData = {
    //     areaId: 2,
    //     provinceIds: this.cloudConfig.nrothChina.join(',')
    //   }
    //   this.$axios({
    //     url: phpURL + '/cloud/areaProvinceConfig',
    //     method: 'post',
    //     data: $qs.stringify(sendData)
    //   }).then(res => {
    //     if (res.data.code === 10000) {
    //   this.$Message.success(res.data.msg);
    //       this.getNorthData()
    //       this.getEastData()
    //       this.getSouthData()
    //     }
    //   })
    // },
    // 获取华南区配置
    // getSouthData () {
    //   this.$axios({
    //     url: phpURL + '/cloud/getAreaProvinces',
    //     method: 'post',
    //     data: $qs.stringify({
    //       areaId: 3
    //     })
    //   }).then(res => {
    //     this.chinaSot = res.data.content
    //     this.cloudConfig.southChina = res.data.content
    //       .filter(e => {
    //         return e.check
    //       })
    //       .map(e => {
    //         return e.provinceID
    //       })
    //   })
    // },
    // 改变华南区配置
    // changeSouthArea () {
    // if (v) return;
    //   let sendData = {
    //     areaId: 3,
    //     provinceIds: this.cloudConfig.southChina.join(',')
    //   }
    //   this.$axios({
    //     url: phpURL + '/cloud/areaProvinceConfig',
    //     method: 'post',
    //     data: $qs.stringify(sendData)
    //   }).then(res => {
    //     if (res.data.code === 10000) {
    //   this.$Message.success(res.data.msg);
    //       this.getSouthData()
    //       this.getNorthData()
    //       this.getEastData()
    //     }
    //   })
    // },
    // 获取华东区配置
    // getEastData () {
    //   this.$axios({
    //     url: phpURL + '/cloud/getAreaProvinces',
    //     method: 'post',
    //     data: $qs.stringify({
    //       areaId: 1
    //     })
    //   }).then(res => {
    //     this.chinaEst = res.data.content
    //     this.cloudConfig.eastChina = res.data.content
    //     //
    //       .filter(e => {
    //         return e.check
    //       })
    //       .map(e => {
    //         return e.provinceID
    //       })
    //   })
    // },
    // 改变华东区配置
    // changeEastArea () {
    // if (v) return;
    //   let sendData = {
    //     areaId: 1,
    //     provinceIds: this.cloudConfig.eastChina.join(','),
    //     province: this.cloudConfig.eastChina
    //   }
    //   this.$axios({
    //     url: phpURL + '/cloud/areaProvinceConfig',
    //     method: 'post',
    //     data: $qs.stringify(sendData)
    //   }).then(res => {
    //     if (res.data.code === 10000) {
    //   this.$Message.success(res.data.msg);
    //       this.getEastData()
    //       this.getSouthData()
    //       this.getNorthData()
    //     }
    //   })
    // },
    // 获取标签表格的数据
    getTagList () {
      this.$axios({
        url: phpURL + '/cloud/tagList',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.tagLists = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 获取一级标签数据
    getFirstTsg () {
      this.$axios({
        url: phpURL + '/cloud/getFirstTag',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.firstTag = res.data.content
            this.showedit = this.firstTag.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 增加一级标签数据
    saveAddFirst () {
      this.$axios({
        url: phpURL + '/cloud/tagConfig',
        method: 'post',
        data: $qs.stringify({
          tagName: this.addCategory.replace(/\s+/g, '')
        })
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.firstTag = res.data.content
            this.showedit = this.firstTag.map(e => true)
            this.changeShowSon(this.firstTag[this.firstTag.length - 1])
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
      this.addCategory = ''
      this.showAddCate = true
    },
    // 取消增加一级标签
    cancelAddFirst () {
      this.showAddCate = true
      this.addCategory = ''
    },
    // 编辑一级标签
    editFirstTag (i) {
      for (let j in this.showedit) {
        this.showedit[j] = true
      }
      this.showAddCate = true
      this.noShoweditDel(i)
      this.$set(this.showedit, i, false)
      this.cancelEditFirst()
    },
    // 取消编辑一级标签
    cancelEditFirst (i) {
      this.$set(this.showedit, i, true)
    },
    // 保存编辑一级标签
    saveEditFirst (i, item) {
      this.$set(this.showedit, i, true)
      let sendData = {
        tagName: item.tagName.replace(/\s+/g, ''),
        id: item.id
      }
      this.$axios({
        url: phpURL + '/cloud/tagEdit',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.firstTag = res.data.content
            this.showedit = this.firstTag.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
            this.getFirstTsg()
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 删除一级标签
    removeFirst (item) {
      this.$axios({
        url: phpURL + '/cloud/tagDel',
        method: 'post',
        data: $qs.stringify({
          id: item.id
        })
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.firstTag = res.data.content
            this.changeShowSon(this.firstTag[0])
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 获取二级标签数据
    getSecondTsg () {
      this.$axios({
        url: phpURL + '/cloud/getSecondTag',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.firstTagSon = res.data.content
            this.showeditSecond = this.firstTagSon.map(e => true) // 编辑弹框
          } else {
            // this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 改变获取二级标签数据
    changeShowSon (item) {
      this.activeClass = item.id
      let sendData = {
        fid: item.id
      }
      this.$axios({
        url: phpURL + '/cloud/getSecondTag',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.firstTagSon = res.data.content
            this.selectedFid = sendData.fid
            this.showeditSecond = this.firstTagSon.map(e => true) // 编辑弹框
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 显示一级标签编辑
    showeditDel (i) {
      this.$set(this.showEditDel, i, true)
    },
    noShoweditDel (i) {
      this.$set(this.showEditDel, i, false)
    },
    // 显示二级标签编辑
    showeditSon (i, item) {
      if (item.tagName === '全部') {
        this.$set(this.showeditSonDel, i, false)
      } else {
        this.$set(this.showeditSonDel, i, true)
      }
    },
    noshoweditSon (i) {
      this.$set(this.showeditSonDel, i, false)
    },
    // 标签设置弹框
    setCategory () {
      this.configCategory = true
      if (this.firstTag.length === 0) {
        console.log('暂无数据')
      } else {
        this.changeShowSon(this.firstTag[0])
      }
    },
    // 标签点击确定刷新表格内容
    ok () {
      this.configCategory = false
      this.getTagList()
    },
    // 取消
    cancleAll () {
      // this.$Modal.info({
      //     title: '提示',
      //     content: '未保存是否取消',
      // })
      this.isEdit = false
    },
    // 保存
    saveAll () {
      this.isEdit = false
    },
    // 新增标签弹框
    showAddCates () {
      for (let j in this.showedit) {
        this.showedit[j] = true
      }
      this.showAddCate = false
      this.addCategory = ''
    },
    // 二级新增弹框
    showAddCateSons () {
      for (let j in this.showeditSecond) {
        this.showeditSecond[j] = true
      }
      this.showAddCateSon = false
    },
    // 增加二级标签
    saveAddSecond (item) {
      console.log(this.selectedFid)
      this.$axios({
        url: phpURL + '/cloud/tagConfig',
        method: 'post',
        data: $qs.stringify({
          fid: this.selectedFid,
          tagName: this.addCategorySon.replace(/\s+/g, '')
        })
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.firstTagSon = res.data.content
            this.showeditSecond = this.firstTagSon.map(e => true)
            // this,getSecondTag()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
      this.addCategorySon = ''
      this.showAddCateSon = true
    },
    // 取消增加二级标签
    cancelAddSecond () {
      this.showAddCateSon = true
      this.addCategorySon = ''
    },
    // 编辑二级标签
    editSecondTag (i) {
      for (let j in this.showeditSecond) {
        this.showeditSecond[j] = true
      }
      this.showAddCateSon = true
      this.noshoweditSon(i)
      this.$set(this.showeditSecond, i, false)
    },
    // 取消编辑二级标签
    cancelEditSecond (i) {
      this.$set(this.showeditSecond, i, true)
    },
    // 保存编辑二级标签
    saveEditSecond (i, item) {
      this.$set(this.showeditSecond, i, true)
      let sendData = {
        tagName: item.tagName.replace(/\s+/g, ''),
        id: item.id
      }
      this.$axios({
        url: phpURL + '/cloud/tagEdit',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.firstTagSon = res.data.content
            this.showeditSecond = this.firstTagSon.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
            this.getSecondTsg()
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 删除二级标签
    removeSecond (item) {
      this.$axios({
        url: phpURL + '/cloud/tagDel',
        method: 'post',
        data: $qs.stringify({
          id: item.id
        })
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.firstTagSon = res.data.content
            this.showeditSecond = this.firstTagSon.map(e => true)
            //  this.getFirstTsg()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 获取侧重标签数据
    getEmphasisData () {
      this.$axios({
        url: phpURL + '/cloud/emphasisTagList',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.emphasisTagList = res.data.content
            this.editEmphasis = this.emphasisTagList.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 编辑侧重标签数据
    emphasisEdit (i) {
      this.$set(this.editEmphasis, i, false)
    },
    // 保存编辑侧重标签
    saveEmphasisTag (i, item) {
      this.$set(this.editEmphasis, i, true)
      let sendData = {
        title: item.title,
        id: item.id
      }
      this.$axios({
        url: phpURL + '/cloud/emphasisTagEdit',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.emphasisTagList = res.data.content
            this.editEmphasis = this.emphasisTagList.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
            this.getEmphasisData()
          }
        })
        .catch(err => {
          console.log(err.data)
        })
      this.addBusType = ''
    },
    // 删除侧重标签数据
    handleCloseLay (item) {
      let sendData = {
        id: item.id
      }
      this.$axios({
        url: phpURL + '/cloud/emphasisTagDel',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.emphasisTagList = res.data.content
            this.editEmphasis = this.emphasisTagList.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 增加侧重标签数据
    addEmp () {
      let sendData = {
        title: this.addEmphasis
      }
      this.$axios({
        url: phpURL + '/cloud/emphasisTagAdd',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.emphasisTagList = res.data.content
            this.editEmphasis = this.emphasisTagList.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
      this.addEmphasis = ''
    },
    // 获取开票类型数据
    getOpenTicketType () {
      this.$axios({
        url: phpURL + '/cloud/ticketTypeList',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.openTicketType = res.data.content
            this.editOpenTicketType = this.openTicketType.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 编辑开票类型
    openTicketTypeEdit (i) {
      this.$set(this.editOpenTicketType, i, false)
    },
    // 保存编辑开票类型
    saveOpenTicketType (i, item) {
      this.$set(this.editOpenTicketType, i, true)
      let sendData = {
        title: item.title,
        id: item.id
      }
      this.$axios({
        url: phpURL + '/cloud/ticketTypeEdit',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.openTicketType = res.data.content
            this.editOpenTicketType = this.openTicketType.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
            this.getOpenTicketType()
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 删除开票类型
    handleCloseType (item) {
      let sendData = {
        id: item.id
      }
      this.$axios({
        url: phpURL + '/cloud/ticketTypeDel',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.openTicketType = res.data.content
            this.editOpenTicketType = this.openTicketType.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
            this.getOpenTicketType()
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 增加开票类型
    addOpenTicketType () {
      let sendData = {
        title: this.addTicketType
      }
      this.$axios({
        url: phpURL + '/cloud/ticketTypeAdd',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.openTicketType = res.data.content
            this.editOpenTicketType = this.openTicketType.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
      this.addTicketType = ''
    },
    // 获取开票内容数据
    getOpenTicketCont () {
      this.$axios({
        url: phpURL + '/cloud/ticketContentList',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.openTicketCont = res.data.content
            this.editOpenTicketCont = this.openTicketCont.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 编辑开票内容
    openTicketContEdit (i) {
      this.$set(this.editOpenTicketCont, i, false)
    },
    // 保存编辑开票内容
    saveOpenTicketCont (i, item) {
      this.$set(this.editOpenTicketCont, i, true)
      let sendData = {
        title: item.title,
        id: item.id
      }
      this.$axios({
        url: phpURL + '/cloud/ticketContentEdit',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.openTicketCont = res.data.content
            this.editOpenTicketCont = this.openTicketCont.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
            this.getOpenTicketCont()
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 删除开票内容
    handleCloseCont (item) {
      let sendData = {
        id: item.id
      }
      this.$axios({
        url: phpURL + '/cloud/ticketContentDel',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.openTicketCont = res.data.content
            this.editOpenTicketCont = this.openTicketCont.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
            this.getOpenTicketCont()
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 增加开票内容
    addOpenTicketCont () {
      let sendData = {
        title: this.addTicketCont
      }
      this.$axios({
        url: phpURL + '/cloud/ticketContentAdd',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.openTicketCont = res.data.content
            this.editOpenTicketCont = this.openTicketCont.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
            this.getOpenTicketCont()
          }
        })
        .catch(err => {
          console.log(err.data)
        })
      this.addTicketCont = ''
    },
    // 获取包体类型数据
    getBagTypeList () {
      this.$axios({
        url: phpURL + '/cloud/bagTypeList',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.bagTypeList = res.data.content
            this.editBag = this.bagTypeList.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 编辑包体类型
    bagEdit (i) {
      this.$set(this.editBag, i, false)
    },
    // 保存编辑包体类型
    saveBag (i, item) {
      this.$set(this.editBag, i, true)
      let sendData = {
        title: item.title,
        id: item.id
      }
      this.$axios({
        url: phpURL + '/cloud/bagTypeEdit',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.bagTypeList = res.data.content
            this.editBag = this.bagTypeList.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
            this.getBagTypeList()
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 删除包体类型
    handleCloseBag (item) {
      let sendData = {
        id: item.id
      }
      this.$axios({
        url: phpURL + '/cloud/bagTypeDel',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.bagTypeList = res.data.content
            this.editBag = this.bagTypeList.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
            this.getBagTypeList()
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 增加包体类型
    addbagTypes () {
      let sendData = {
        title: this.addbagType
      }
      this.$axios({
        url: phpURL + '/cloud/bagTypeAdd',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.bagTypeList = res.data.content
            this.editBag = this.bagTypeList.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
            this.getBagTypeList()
          }
        })
        .catch(err => {
          console.log(err.data)
        })
      this.addbagType = ''
    },
    // 获取渠道信息量级数据
    getMagnitudeList () {
      this.$axios({
        url: phpURL + '/cloud/magnitudeList',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.magnitudeList = res.data.content
            this.editMagnitude = this.magnitudeList.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 编辑渠道信息量级
    magnitudeEdit (i) {
      this.$set(this.editMagnitude, i, false)
    },
    // 保存编辑渠道信息量级
    savetMagnitude (i, item) {
      this.$set(this.editMagnitude, i, true)
      let sendData = {
        title: item.title,
        id: item.id
      }
      this.$axios({
        url: phpURL + '/cloud/magnitudeEdit',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.magnitudeList = res.data.content
            this.editMagnitude = this.magnitudeList.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
            this.getMagnitudeList()
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 增加渠道信息量级
    addMagnitudes () {
      let sendData = {
        title: this.addMagnitude
      }
      this.$axios({
        url: phpURL + '/cloud/magnitudeAdd',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.magnitudeList = res.data.content
            this.editMagnitude = this.magnitudeList.map(e => true)
            this.addMagnitude = ''
          } else {
            this.$Message.error(res.data.msg)
            this.getMagnitudeList()
          }
        })
        .catch(err => {
          console.log(err.data)
        })
      this.addbagType = ''
    },
    // 删除渠道信息量级
    handleClosMagnitude (item) {
      let sendData = {
        id: item.id
      }
      this.$axios({
        url: phpURL + '/cloud/magnitudeDel',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.magnitudeList = res.data.content
            this.editMagnitude = this.magnitudeList.map(e => true)
          } else {
            this.$Message.error(res.data.msg)
            this.getMagnitudeList()
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    }

  }
}
</script>

<style scoped>
ul li {
    list-style: none;
}
#cloudConfig {
    background: white;
    padding: 10px 50px;
    width: 1200px;
    margin: auto;
}

.Title {
    font-size: 14px;
    padding-left: 10px;
    border-left: 3px solid #19aa8d;
    height: 25px;
    line-height: 25px;
    display: block;
    font-weight: bold;
}

.main {
    margin: 20px 70px;
    font-size: 13px;
}

.areaConfigMain ul li {
    margin: 20px 0px;
}

.left {
    float: left;
}

.right {
    float: right;
}

i {
    color: red;
}

.businessTypeList span {
    margin-left: 10px;
    float: left;
}

.businessTypeList {
    width: 470px;
    height: auto;
    float: left;
    overflow: auto;
    margin-top: -6px;
}

.businessTypeList div {
    margin: 5px 5px 0px 0px;
}

.businessTypeList button {
    margin: 5px 5px 0px 0px;
}

.addBust {
    margin-left: 65px;
    margin-top: 20px;
}

.btn {
    background-color: #19aa8d;
    color: white;
}

.botomBtn {
    text-align: center;
    margin-top: 50px;
    margin-bottom: 20px;
}

#cloudConfig .ivu-input:hover {
    border-color: #19aa8d;
}

.ivu-input-wrapper.ivu-input-wrapper-default.ivu-input-type input:hover {
    border-color: #19aa8d;
}

.category {
    width: 50%;
    height: 200px;
    border: 1px solid #e9e9e9;
    overflow: auto;
}

.category ul li {
    /* height: 30px; */
    line-height: 30px;
    /* padding-left: 10px; */
    width: 100%;
}

.addCategory {
    padding-left: 10px;
    color: #808080;
    cursor: pointer;
}

.category.left li:hover {
    background: #f2f2f2;
    color: black;
    cursor: pointer;
}

.category.right li:hover {
    background: #f2f2f2;
    /* color: white; */
    cursor: pointer;
}
  .category::-webkit-scrollbar{
    width: 4px;
    height: 0;
  }
  .category::-webkit-scrollbar-thumb{
    border-radius: 5px;
    box-shadow: inset 0 0 4px #e2e2e2;
    background:#e2e2e2;
  }
  .category::-webkit-scrollbar-track{
    box-shadow: inset 0 0 5px #FFF;;
    border-radius: 0;
    background: #FFF;
  }

.active {
    background: #19aa8d;
    color: white;
    cursor: pointer;
}
</style>
