<template>
<!-- 这是编辑产品库 -->
<div class="cloudCooper" id="productBank">
    <!-- 基础信息 -->
    <Form ref="productBank" :model="productBank" :rules="ruleProductBank">
        <div class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">基础信息</Col>
            </Row>
            <div>
                <Row class="rowPadding">
                    <Col span="3" offset="3" class="title">
                    <i class="require">*</i>产品名称 :
                    </Col>
                    <Col span="5">
                    <FormItem prop="commodityName">
                        <Input v-model="productBank.commodityName" clearable filterable />
                    </FormItem>
                    </Col>
                    <Col span="3" class="title">
                    <i class="require">*</i>公司名称 :
                    </Col>
                    <Col span="5">
                    <FormItem prop="productCompanyId">
                        <Select v-model="productBank.productCompanyId" clearable filterable @click="getAllProductCompanies" @on-change="getContract">
                            <Option v-for="item in productBank.productCompanyList" :value="item.productCompanyId" :key="item.productCompanyId">{{ item.companyName }}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
                <Row class="rowPadding">
                    <Col span="3" offset="3" class="title">
                    <i class="require">*</i>结算方式 :
                    </Col>
                    <Col span="5">
                    <FormItem prop="settlement">
                        <Select v-model="productBank.settlement" clearable filterable>
                            <Option v-for="item in settlementList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="3" class="title">
                    <i class="require">*</i>结算周期 :
                    </Col>
                    <Col span="5">
                    <FormItem prop="cycle">
                        <Select v-model="productBank.cycle" clearable filterable>
                            <Option v-for="item in cycleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
                <!-- 安装 -->
                <div v-if="productBank.settlement == '1'||productBank.settlement == '5'">
                    <Row class="rowPadding">
                        <Col span="3" offset="3" class="title">
                        <i class="require">*</i>进价 :
                        </Col>
                        <Col span="5">
                        <FormItem prop="purchasePrice">
                            <Input v-model="productBank.purchasePrice" clearable filterable />
                        </FormItem>
                        </Col>
                        <Col span="3" class="title">建议出价 :</Col>
                        <Col span="5">
                        <Input v-model="productBank.proposalPrice" clearable filterable />
                        </Col>
                    </Row>
                </div>
                <!-- 充值 -->
                <div v-if="productBank.settlement == 2">
                    <Row class="rowPadding">
                        <Col span="3" offset="3" class="title">
                        <i class="require">*</i>进价 :
                        </Col>
                        <Col span="5">
                        <FormItem prop="purchasePrice">
                            <Input v-model="productBank.purchasePrice" clearable filterable />
                        </FormItem>
                        </Col>
                        <Col span="3" class="title">建议出价 :</Col>
                        <Col span="5">
                        <FormItem prop="proposalPrice">
                            <Input v-model="productBank.proposalPrice" clearable filterable />
                        </FormItem>
                        </Col>
                    </Row>
                    <Row class="rowPadding">
                        <Col span="3" offset="3" class="title">
                        <i class="require">*</i>充值(%) :
                        </Col>
                        <Col span="5">
                        <FormItem prop="percentage">
                            <Input v-model="productBank.percentage" clearable filterable />
                        </FormItem>
                        </Col>
                        <Col span="3" class="title">建议充值出价(%) :</Col>
                        <Col span="5">
                        <Input v-model="productBank.proposalPercentage" style="width: 235px" clearable filterable />
                        </Col>
                    </Row>
                </div>
                <!-- 留存 -->
                <div v-if="productBank.settlement == 3">
                    <Row class="rowPadding">
                        <Col span="3" offset="3" class="title">
                        <i class="require">*</i>进价 :
                        </Col>
                        <Col span="5">
                        <FormItem prop="purchasePrice">
                            <Input v-model="productBank.purchasePrice" clearable filterable />
                        </FormItem>
                        </Col>
                        <Col span="3" class="title">建议出价 :</Col>
                        <Col span="5">
                        <Input v-model="productBank.proposalPrice" clearable filterable />
                        </Col>
                    </Row>
                    <Row class="rowPadding">
                        <Col span="3" offset="3" class="title">
                        <i class="require">*</i>留存 :
                        </Col>
                        <Col span="5">
                        <FormItem prop="retain">
                            <Input v-model="productBank.retain" clearable filterable />
                        </FormItem>
                        </Col>
                        <Col span="3" class="title">建议留存出价 :</Col>
                        <Col span="5">
                        <Input v-model="productBank.proposalRetain"  clearable filterable />
                        </Col>
                    </Row>
                </div>

                <!-- 分成 -->
                <div v-if="productBank.settlement == 4">
                    <Row class="rowPadding">
                        <Col span="3" offset="3" class="title">
                        <i class="require">*</i>进价比(%):
                        </Col>
                        <Col span="5">
                        <FormItem prop="percentage">
                            <Input v-model="productBank.percentage" clearable filterable />
                        </FormItem>
                        </Col>
                        <Col span="3" class="title">建议出价比(%) :</Col>
                        <Col span="5">
                        <Input v-model="productBank.proposalPercentage" style="width: 265px" clearable filterable />
                        </Col>
                    </Row>
                </div>
                <!-- 包月 -->
                <div v-if="productBank.settlement == '6'">
                  <Row class="rowPadding">
                    <Col span="3"  offset="3" class="title">
                    <i class="require">*</i>进价 :
                    </Col>
                    <Col span="5">
                    <FormItem prop="purchasePrice">
                        <Input v-model="productBank.purchasePrice"  clearable filterable/>
                    </FormItem>
                    </Col>
                    <Col span="3" class="title">建议出价 :</Col>
                    <Col span="5">
                        <Input v-model="productBank.proposalPrice"  clearable filterable/>
                    </Col>
                  </Row>
                  <Row class="rowPadding">
                    <Col span="3"  offset="3" class="title">
                      <i class="require">*</i>合作周期 :
                    </Col>
                    <Col span="5">
                    <FormItem prop="timeRage">
                        <DatePicker @on-change="dataChange" v-model="productBank.timeRage" type="daterange" split-panels placeholder="选择期限" style="width: 100%"></DatePicker>
                    </FormItem>
                    </Col>
                  </Row>
                </div>
                <Row class="rowPadding">
                    <Col span="3" offset="3" class="title">
                    <i class="require">*</i>预收款项 :
                    </Col>
                    <Col span="5">
                    <FormItem prop="advance">
                        <Select v-model="productBank.advance" clearable filterable>
                            <Option v-for="item in getMoneyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="3" class="title">
                    <i class="require">*</i>合同 :
                    </Col>
                    <Col span="5">
                    <FormItem prop="contractId">
                        <Select v-model="productBank.contractId" clearable filterable>
                            <Option v-for="item in contractList" :value="item.id" :key="item.id">{{ item.contract }}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
            </div>
        </div>
        <!-- 阶梯价 -->
        <div class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">阶梯价</Col>
            </Row>
            <Row v-for="(item,index) in productBank.Ladder" :key="index" class="rowPadding">
                <Col span="1" offset="4" class="title">量级:</Col>
                <Col span="3">
                <FormItem prop="magnitude">
                    <Input v-model="item.magnitude" style="width: 100px" clearable filterable />(万)
                </FormItem>
                </Col>
                <Col span="1"  class="title">单价:</Col>
                <Col span="3">
                <FormItem prop="unitPrice">
                    <Input v-model="item.unitPrice" style="width: 100px" clearable filterable />(元)
                </FormItem>
                </Col>
                <Col span="2"  class="title">建议出价:</Col>
                <Col span="3">
                <Input v-model="item.proposalPrice" style="width: 100px" clearable filterable />
                <Button shape="circle" icon="md-add" @click="addLadder" style="margin:0px 0px 0px 5px"></Button>
                <Button v-if="productBank.Ladder.length>=2" shape="circle" icon="md-remove" @click="removeLadder(index)"></Button>
                </Col>
            </Row>
        </div>

        <!-- 链接信息 -->
        <div class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">链接信息</Col>
            </Row>
            <Row class="rowPadding">
                <Col span="16" offset="4">
                <span class="addContractIcon">+</span>
                <span class="addContract" @click="openAddModal">新增链接</span>
                <Table border :columns="productBank.LinkHeader" :data="productBank.LinkContent" style="line-height: 19px;" id="link">
                    <template slot-scope="{ row }" slot="name">
                        <strong>{{ row.name }}</strong>
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" @click="editProduct(row)" style="margin-right:3px;">编辑</Button>
                        <Button type="error" size="small" @click="removeProduct(row)">删除</Button>
                    </template>
                </Table>
                </Col>
            </Row>

            <!-- 新增链接弹窗 -->
            <Modal :mask-closable="false" v-model="showLink" title="新增链接" class="addlink" @on-ok="saveToTable" id="addNotice">
                    <Row class="rowPadding">
                        <Col span="3" offset="3" class="title">
                        <i class="require">*</i>链接名称 :
                        </Col>
                        <Col span="12">
                        <Input v-model="productBank.linksName" clearable filterable />
                        </Col>
                    </Row>
                    <Row class="rowPadding">
                        <Col span="3" offset="3" class="title">
                        <i class="require">*</i>产品链接 :
                        </Col>
                        <Col span="12">
                        <Input v-model="productBank.productLinks" clearable filterable />
                        </Col>
                    </Row>
                    <Row class="rowPadding">
                        <Col span="3" offset="3" class="title">
                        <i class="require">*</i>包体类型 :
                        </Col>
                        <Col span="12">
                        <Select  v-model="productBank.enclaves" clearable filterable style="width:210px">
                            <Option v-for="item in bagTypeList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                        </Select>
                        <Button shape="circle" icon="ios-more-outline" @click="goCloudConfig"></Button>
                        </Col>
                    </Row>
                    <Row class="rowPadding">
                        <Col span="3" offset="3" class="title">
                        <i class="require">*</i>后台类型 :
                        </Col>
                        <Col span="12">
                        <Select v-model="productBank.backgroundType" :label-in-value="true" @on-change="getTypeName" clearable filterable>
                            <Option v-for="item in backTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        </Col>
                    </Row>
                    <Row v-if="productBank.backgroundType === 3 ||productBank.backgroundType === 4" class="rowPadding">
                        <Col span="3" offset="3" class="title">
                        <i class="require">*</i>群名 :
                        </Col>
                        <Col span="12">
                        <Input v-model="productBank.address" clearable filterable />
                        </Col>
                    </Row>
                    <div v-if="productBank.backgroundType === 1 ||productBank.backgroundType === 2">
                        <Row class="rowPadding">
                            <Col span="3" offset="3" class="title">
                            <i class="require">*</i>网址 :
                            </Col>
                            <Col span="12">
                            <Input v-model="productBank.address" clearable filterable />
                            </Col>
                        </Row>
                        <Row class="rowPadding">
                            <Col span="3" offset="3" class="title">
                            <i class="require">*</i>账号 :
                            </Col>
                            <Col span="12">
                            <Input v-model="productBank.userName" clearable filterable />
                            </Col>
                        </Row>
                        <Row class="rowPadding">
                            <Col span="3" offset="3" class="title">
                            <i class="require">*</i>密码 :
                            </Col>
                            <Col span="12">
                            <Input v-model="productBank.password" clearable filterable />
                            </Col>
                        </Row>
                    </div>

            </Modal>
        </div>
        <!-- 编辑链接弹窗 -->
        <Modal id="addNotice" v-model="editLink" title="编辑链接" class="addlink" @on-ok="eidtProductLink">
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">
                <i class="require">*</i>链接名称 :
                </Col>
                <Col span="12">
                <Input v-model="productBank.linksName" clearable filterable />
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">
                <i class="require">*</i>产品链接 :
                </Col>
                <Col span="12">
                <Input v-model="productBank.productLinks" clearable filterable />
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">
                <i class="require">*</i>包体类型 :
                </Col>
                <Col span="12">
                <Select style="width:170px" v-model="productBank.enclaves" clearable filterable>
                    <Option v-for="item in bagTypeList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                </Select>
                <Button shape="circle" icon="ios-more-outline" @click="goCloudConfig"></Button>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">
                <i class="require">*</i>后台类型 :
                </Col>
                <Col span="12">
                <Select v-model="productBank.backgroundType" style="width:200px" clearable filterable @on-change="getTypeName">
                    <Option v-for="item in backTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                </Col>
            </Row>
            <Row v-if="productBank.backgroundType === 3 ||productBank.backgroundType === 4" class="rowPadding">
                <Col span="3" offset="3" class="title">
                <i class="require">*</i>群名 :
                </Col>
                <Col span="12">
                <Input v-model="productBank.address" clearable filterable />
                </Col>
            </Row>
            <div v-if="productBank.backgroundType === 1 ||productBank.backgroundType === 2" class="rowPadding">
                <Row>
                    <Col span="3" offset="3" class="title">
                    <i class="require">*</i>网址 :
                    </Col>
                    <Col span="12">
                    <Input v-model="productBank.address" clearable filterable />
                    </Col>
                </Row>
                <Row class="rowPadding">
                    <Col span="3" offset="3" class="title">
                    <i class="require">*</i>账号 :
                    </Col>
                    <Col span="12">
                    <Input v-model="productBank.userName" clearable filterable />
                    </Col>
                </Row>
                <Row class="rowPadding">
                    <Col span="3" offset="3" class="title">
                    <i class="require">*</i>密码 :
                    </Col>
                    <Col span="12">
                    <Input v-model="productBank.password" clearable filterable />
                    </Col>
                </Row>
            </div>
        </Modal>
        <!-- 标签 -->
        <div class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">标签</Col>
            </Row>
            <div class="detailContent">
                <Row v-for="(addItem,index) in productBank.label" :key="addItem.id" class="rowPadding">
                    <Col span="3" offset="3" class="title">
                    <i class="require">*</i>一级标签 :
                    </Col>
                    <Col span="5">
                    <Select v-model="productBank.label[index].oneLabel" clearable filterable style="width:200px;" @on-change="getSecondTagFun(index,productBank.label[index])">
                        <Option v-for="item in productBank.getFirstTag" :value="item.id" :key="item.id">{{ item.label }}</Option>
                    </Select>
                    </Col>
                    <Col span="3" class="title">
                    <i class="require">*</i>二级标签 :
                    </Col>
                    <Col span="7">
                    <!-- <Select v-model="productBank.label[index].twoLabel" clearable filterable style="width:200px;">
                        <Option v-for="item in productBank.getSecondTag[index]" :value="item.id" :key="item.id">{{ item.tagName }}</Option>
                    </Select> -->
                    <treeselect
                    :multiple="true"
                    :options="productBank.getSecondTag[index]"
                    placeholder="请选择二级标签"
                    v-model="productBank.label[index].twoLabel"
                    style="width:200px;float:left"
                    />
                    <span style="cursor: pointer;margin-left: 5px;">
                        <Button shape="circle" icon="ios-more-outline" style="margin-right:5px;" @click="goCloudConfig"></Button>
                        <Button shape="circle" icon="md-add" @click="addLabel" style="margin-right:5px;"></Button>
                        <Button v-if="productBank.label.length>=2" shape="circle" icon="md-remove" @click="removeLable(index)"></Button>
                    </span>
                    </Col>
                </Row>
                <Row class="detailContent">
                    <Col span="3" offset="3" class="title">侧重标签 :</Col>
                    <Col span="5">
                    <Select v-model="productBank.emphasis" multiple clearable filterable style="width:200px;">
                        <Option v-for="item in productBank.emphasisTagList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                    </Select>
                    <span style="cursor: pointer;margin-left: 5px;"></span>
                    </Col>
                </Row>
            </div>
        </div>
        <!-- 反向标签 -->
        <!-- <div class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">反向标签
                  <Tooltip content="设置反向标签后，该产品将不会匹配反向标签对应的渠道" placement="top" max-width='150' >
                    <span class='help'>
                      <Icon type="md-help-circle" style="color: grey;"/>
                    </span>
                  </Tooltip>
                </Col>
            </Row>
            <div class="detailContent">
                <Row v-for="(addItem,index) in productBank.reverseLabel" :key="addItem.id" class="rowPadding">
                <Col span="3"  offset="3" class="title">
                  一级标签 :
                </Col>
                <Col span="5">
                    <Select v-model="productBank.reverseLabel[index].oneLabel" clearable filterable style="width:200px" @on-change="getSecondTagReverseFun(index,productBank.reverseLabel[index])" >
                    <Option v-for="item in productBank.getFirstTag" :value="item.id" :key="item.id">{{ item.tagName }}</Option>
                    </Select>
                </Col>
                <Col span="3" class="title">
                  二级标签 :
                </Col>
                <Col span="7">
                    <Select v-model="productBank.reverseLabel[index].twoLabel" clearable filterable style="width:200px">
                    <Option v-for="item in productBank.getSecondTagReverse[index]" :value="item.id" :key="item.id">{{ item.tagName }}</Option>
                    </Select>
                    <span style="cursor: pointer;margin-left: 5px;">
                    <Button shape="circle" icon="ios-more-outline" style="margin-right:5px;" @click="goCloudConfig"></Button>
                    <Button shape="circle" icon="md-add" @click="addReverseLabel" style="margin-right:5px;"></Button>
                    <Button v-if="productBank.reverseLabel.length>=2" shape="circle" icon="md-remove" @click="removeReverseLabel(index)"></Button>
                    </span>
                </Col>
                </Row>
            </div>
        </div> -->
         <!--信息对比-->
        <div class="detailContent" v-if="compareContent">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">信息对比</Col>
            </Row>
            <Row class="rowPadding" >
                <Col span="16" offset="4">
                    <div class="compareClasee">
                        <div class="compareHeader">不同项</div>
                        <div class="compareContentClass" v-for = "(item,index) in compareData" :key="index">
                            <p>{{item}}</p>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
        <!--通知人-->
        <div class="detailContent" v-if="isTwo">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">通知人</Col>
            </Row>
            <!--通知人-->
            <Row class="rowPadding" >
                <Col span="17" offset="4">
                    <Icon type="ios-add-circle-outline" v-if="addTwoEntry" size="50" @click="showEntry=true" style="margin-top: 22px;color: #515a6e !important; cursor: pointer;"/>
                    <div  v-else style="float: left;margin-right: 15px;">
                        <Icon type="ios-contacts" size="50" style="display: block;color:#515a6e !important" @click="showEntry=true" ></Icon>
                        <p style="">{{this.productBank.twoEntryName+'  '||'通知人'}}</p>
                    </div>
                </Col>
            </Row>
        </div>
        <div class="detailContent" v-if="isOne">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">通知人</Col>
            </Row>
            <!--通知人-->
            <Row class="rowPadding" >
                <Col span="17" offset="4">
                    <div style="float: left;margin-right: 15px;">
                        <Icon type="ios-contacts" size="50" style="display: block;color:#515a6e !important"  ></Icon>
                        <p style="">{{this.productBank.twoEntryName+'  '||'通知人'}}</p>
                    </div>
                </Col>
            </Row>
        </div>
        <!-- 抄送人 -->
        <div class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">抄送人</Col>
            </Row>
            <Row class="rowPadding">
            <Col span="17" offset="4">
                <div class="main">
                    <div v-for="(item,index) in this.productBank.copierName" :key="index" style="float: left;margin-right: 15px;">
                        <Icon type="md-close" style="color: red; position: relative;left: 33px;top: 12px;cursor: pointer;" @click="deletCopier(index)" />
                        <Icon type="ios-contacts" size="50" @click="showNotice=true" style="display: block;"></Icon>
                        <p style>{{item+' '||'抄送人'}}</p>
                    </div>
                    <Icon type="ios-add-circle-outline" size="50" @click="showNotice=true" style="margin-top: 22px; color: #515a6e;" />
                </div>
            </Col>
            </Row>
             <!--通知人弹窗-->
            <Modal  :mask-closable="false" id="addNotice" v-model="showEntry" title="通知人" @on-ok="ok">
                <Select :value="productBank.twoEntryId" filterable  :label-in-value="true" @on-change="getEntryName">
                    <Option v-for="person in incumbencyTbUser" :key="person.id" :value="person.id" :label="person.nickname">
                        <div>
                            <p>{{person.nickname}}</p>
                            <p>部门：{{person.deptName}}</p>
                            <p>职位：{{person.positionName}}</p>
                        </div>
                    </Option>
                </Select>
            </Modal>
            <!--抄送人弹窗-->
            <Modal id="addNotice" :mask-closable="false" v-model="showNotice" title="抄送人" @on-ok="addCopier()">
                <Select :value="productBank.copier" filterable multiple :label-in-value="true" @on-change="getNoticeName">
                    <Option v-for="person in incumbencyTbUser" :key="person.id" :value="person.id" :label="person.nickname">
                        <div>
                            <p>{{person.nickname}}</p>
                            <p>部门：{{person.deptName}}</p>
                            <p>职位：{{person.positionName}}</p>
                        </div>
                    </Option>
                </Select>
            </Modal>
            <!--操作按钮-->
            <div class="detailContent">
                <Row class="rowPadding">
                    <Col span="12" offset="10">
                    <Button type="warning" @click="goBack" style="margin-right:30px">返回</Button>
                    <Button type="primary" @click="saveNewPro('productBank')">保存</Button>
                    </Col>
                </Row>
            </div>
        </div>
        <Spin size="large" fix v-if="showLoading"></Spin>
    </Form>
     <!-- 配置跳转弹框 -->
        <Modal
            v-model="showConfig"
            title="提示"
            @on-ok="goConfig">
            <p>当前信息未保存，是否确认前往到配置页面？</p>
        </Modal>
</div>
</template>

<script>
import {
  phpURL,
  baseUrl
} from '@/api/base.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import moment from 'moment'
export default {
  name: 'editProduckBank',
  components: {
    Treeselect
  },
  data () {
    return {
      showLoading: false, // 展示Loading状态
      isTwo: true,
      isOne: false,
      showConfig: false,
      showEntry: false,
      addTwoEntry: true,
      editLink: false,
      compareContent: false,
      compareData: [], // 信息对比数据
      productBank: {
        linkId: '', // 链接id
        incumbencyTbUser: [], // 在职人员
        copierName: [], // 抄送人name
        copier: [], // 抄送人
        commodityName: '', // 产品名称
        productCompanyId: '', // 产品公司id
        productCompanyList: [], // 产品公司list
        settlement: '', // 结算方式
        cycle: '', // 结算周期
        purchasePrice: '', // 进价
        proposalPrice: '', // 建议出价
        percentage: '', // 百分比
        proposalPercentage: '', // 建议百分比
        retain: '', // 留存
        proposalRetain: '', // 建议留存
        advance: '', // 预收款项
        contractId: '', // 合同 传id
        timeRage: [], // 合作周期
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        Ladder: [{
          magnitude: '', // 量级
          unitPrice: '', // 单价
          proposalPrice: '' // 建议出价
        }], // 阶梯价数组
        linksName: '', // 链接名称
        productLinks: '', // 产品链接
        enclaves: '', // 包体类型
        backgroundType: '', // 后台类型
        TypeName: '',
        address: '', // 网站 群名
        userName: '', // 账号
        password: ' ', // 密码
        // 链接信息表头
        LinkHeader: [{
          title: '序号',
          type: 'index',
          width: 70,
          align: 'center'
        },
        {
          title: '链接名称',
          key: 'linksName',
          align: 'center'
        },
        {
          title: '产品链接',
          key: 'productLinks',
          align: 'center'
        },
        {
          title: '后台类型',
          key: 'TypeName',
          align: 'center'
        },
        {
          title: '网址/群名',
          key: 'address',
          align: 'center'
        },
        {
          title: '账号',
          key: 'userName',
          align: 'center'
        },
        {
          title: '密码',
          key: 'password',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
        ],
        LinkContent: [], // 链接信息表格内容
        links: [{
          linksName: '', // 链接名称
          productLinks: '', // 产品链接
          enclaves: '', // 包体类型
          backgroundType: '' // 后台类型
        }],
        label: [{
          oneLabel: '', // 一级标签
          twoLabel: [] // 二级标签
        }],
        // reverseLabel: [{
        //   oneLabel: '', // 一级标签
        //   twoLabel: ''// 二级标签
        // }],
        getFirstTag: [], // 一级标签
        getSecondTag: [], // 二级标签
        getSecondTagReverse: [],
        emphasis: [], // 侧重标签
        emphasisTagList: [], // 侧重标签List
        twoEntryId: '', // 通知人id
        twoEntryName: ''// 通知人姓名用于显示
      },
      // 必填验证
      ruleProductBank: {
        commodityName: [{
          required: true,
          message: '产品名称是必填项哦'
        }],
        productCompanyId: [{
          required: true,
          message: '公司名称是必填项哦'
        }],
        settlement: [{
          required: true,
          message: '结算方式是必填项哦'
        }],
        cycle: [{
          required: true,
          message: '是必填项哦'
        }],
        advance: [{
          required: true,
          message: '是必填项哦'
        }],
        purchasePrice: [{
          required: true,
          message: '是必填项哦'
        }, {
          message: '只能是数字',
          trigger: 'change',
          pattern: /^(([1-9]\d{0,3})|0)(\.\d{0,2})?$/
        }],
        percentage: [{
          required: true,
          message: '是必填项哦'
        },
        {
          message: '只能是数字',
          trigger: 'change',
          pattern: /^(([1-9]\d{0,3})|0)(\.\d{0,2})?$/
        }
        ],
        contractId: [{
          required: true,
          message: '是必填项哦'
        }],
        proposalPercentage: [{
          required: true,
          message: '是必填项哦'
        },
        {
          message: '只能是数字',
          trigger: 'change',
          pattern: /^(([1-9]\d{0,3})|0)(\.\d{0,2})?$/
        }
        ],
        retain: [{
          required: true,
          message: '是必填项哦'
        },
        {
          message: '只能是数字',
          trigger: 'change',
          pattern: /^(([1-9]\d{0,3})|0)(\.\d{0,2})?$/
        }
        ]
      },
      // 结算方式
      settlementList: [
        {
          value: '1',
          label: '安装(CPA)'
        },
        {
          value: '2',
          label: '充值(CPA+CPS)'
        },
        {
          value: '3',
          label: '留存(CPL)'
        },
        {
          value: '4',
          label: '分成(CPS)'
        },
        {
          value: '5',
          label: '点击(CPC)'
        },
        {
          value: '6',
          label: '包月(CPT)'
        }
      ],
      // 结算周期
      cycleList: [{
        value: 1,
        label: '单周'
      },
      {
        value: 2,
        label: '双周'
      },
      {
        value: 3,
        label: '月'
      }
      ],
      // 预收款项
      getMoneyList: [{
        value: 1,
        label: '有'
      },
      {
        value: 2,
        label: '无'
      }
      ],
      // 合同
      contractList: [],
      showNotice: false, // 通知人弹框
      showLink: false, // 新增链接弹框
      bagTypeList: [], // 包体类型列表
      // 后台类型
      backTypeList: [{
        value: 1,
        label: '网站'
      },
      {
        value: 2,
        label: '邮箱'
      },
      {
        value: 3,
        label: 'QQ'
      },
      {
        value: 4,
        label: '微信'
      }
      ]
    }
  },
  beforeRouteLeave (to, from, next) {
    if (from.name === 'editProduckBank') {
      if (sessionStorage.businessId) {
        let id = sessionStorage.businessId
        sessionStorage.setItem('businessID', id)
      }
    } else {
      sessionStorage.clear()
    }
    console.log(from)
    next()
  },
  inject: ['app'],
  computed: {
    incumbencyTbUser () { // 在职人员
      return this.app.employees
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    $route (to, from) {
      this.init()
    }
  },
  methods: {
    init () {
      this.getData()
      if (this.$route.query.person === 'twoEntry') {
        this.isTwo = false
      } else if (this.$route.query.person === 'oneEntry') {
        this.getEchoData()
        this.isTwo = false
        this.isOne = true
      } else if (this.$route.query.person === undefined) {
        this.getEchoDataOne()
      } else {
        this.isTwo = true
      }
      if (this.$route.query.type === 'tbcEdit') {
        this.isTwo = false
        this.isOne = false
      }
      if (this.$route.query.msg === 'twoEdit') {
        this.getEchoDataOne()
        this.isTwo = false
        this.isOne = false
      }
    },
    // 合同期限日期变化时拆分出开始时间和结束时间
    dataChange () {
      this.productBank.startTime = moment(this.productBank.timeRage[0]).format('YYYY-MM-DD')
      this.productBank.endTime = moment(this.productBank.timeRage[1]).format('YYYY-MM-DD')
      console.log(this.productBank.startTime, this.productBank.endTime)
      console.log(111)
    },
    // 获取初始选项数据
    getData () {
      // 获取包体类型
      this.$axios({
        url: phpURL + '/cloud/bagTypeList',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.bagTypeList = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
      // 公司名称
      this.$axios({
        url: phpURL + '/cloud/getAllCompaniesName',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.productBank.productCompanyList = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
      // 获取一级标签
      this.$axios({
        url: baseUrl + '/tagConf/getOneLabel',
        method: 'get'
      }).then(res => {
        if (res.data.code === 10000) {
          this.productBank.getFirstTag = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err.data)
      })
      // 获取侧重标签数据
      this.$axios({
        url: phpURL + '/cloud/emphasisTagList',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.productBank.emphasisTagList = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 根据通知人id 获得对应的通知人name
    getNoticeName (ids) {
      let arrName = []
      let arrId = []
      ids.map(item => {
        arrName.push(item.label)
        arrId.push(item.value)
      })
      this.productBank.showCopierName = arrName
      this.productBank.showCopierId = arrId
      this.productBank.showCopierName = Array.from(new Set(this.productBank.showCopierName))
      this.productBank.showCopierId = Array.from(new Set(this.productBank.showCopierId))
    },
    addCopier () {
      this.productBank.copier = this.productBank.showCopierId
      this.productBank.copierName = this.productBank.showCopierName
    },
    // 根据通知人id
    getEntryName (ids) {
      this.productBank.showTwoEntryName = ids.label
      this.productBank.showTwoEntryId = ids.value
    },
    ok () {
      if (this.productBank.showTwoEntryName === undefined) {
        this.productBank.twoEntryName = ''
      } else {
        this.addTwoEntry = false
        this.productBank.twoEntryName = this.productBank.showTwoEntryName
        this.productBank.twoEntryId = this.productBank.showTwoEntryId
      }
    },
    getAllProductCompanies () {
      console.log(123)
    },
    // 根据公司名称 获取 合同
    getContract () {
      // 合同
      this.$axios({
        url: phpURL + '/cloud/getContractByProductCompanyId',
        method: 'post',
        data: $qs.stringify({
          productCompanyId: this.productBank.productCompanyId
        })
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.contractList = res.data.content
          } else {
            // this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },

    // 增加一列阶梯价
    addLadder () {
      this.productBank.Ladder.push({
        magnitude: '', // 量级
        unitPrice: '', // 单价
        proposalPrice: '' // 建议出价
      })
    },
    // 删除一列
    removeLadder (index) {
      this.productBank.Ladder.splice(index, 1)
    },
    // 增加一列标签
    addLabel () {
      this.productBank.label.push({
        oneLabel: '',
        twoLabel: []
      })
    },
    // addReverseLabel () {
    //   this.productBank.reverseLabel.push({
    //     oneLabel: '',
    //     twoLabel: ''
    //   })
    // },
    // 删除一列标签
    removeLable (index) {
      this.productBank.label.splice(index, 1)
      this.productBank.getSecondTag.splice(index, 1)
    },
    // 删除一列反向标签
    removeReverseLabel (index) {
      this.productBank.reverseLabel.splice(index, 1)
      this.productBank.getSecondTagReverse.splice(index, 1)
    },
    // 跳转配置弹框
    goCloudConfig () {
      this.showConfig = true
    },
    // 跳转到设置区域类型页面
    goConfig () {
      this.$router.push({
        name: 'cloudConfig'
      })
    },
    // 删除抄送人
    deletCopier (index) {
      this.productBank.copier.splice(index, 1)
      this.productBank.copierName.splice(index, 1)
    },
    // 打开新增弹窗同时清空已有数据
    openAddModal () {
      this.showLink = true
      let _p = this.productBank
      _p.linksName = ''
      _p.productLinks = ''
      _p.enclaves = ''
      _p.backgroundType = ''
      _p.address = ''
      _p.userName = ''
      _p.password = ''
    },
    // 前端保存数据到表格
    saveToTable () {
      let _p = this.productBank
      if (this.$route.name === 'editProduckBank') {
        if (this.$route.query.type === undefined) {
          // 编辑时走接口
          this.productBank.LinkContent.push({
            linksName: _p.linksName,
            productLinks: _p.productLinks,
            enclaves: _p.enclaves,
            backgroundType: _p.backgroundType,
            TypeName: _p.TypeName,
            address: _p.address,
            userName: _p.userName,
            password: _p.password
          })
          let sendLinkData = {
            links: this.productBank.LinkContent,
            commodityId: this.$route.query.commodityId
          }
          this.$axios({
            url: baseUrl + '/Commodity/insertLinks',
            method: 'post',
            data: sendLinkData
          })
            .then(res => {
              this.productBank.LinkContent = res.data.content
            })
            .catch(err => {
              console.log(err.data)
            })
        } else {
          this.productBank.LinkContent.push({
            linksName: _p.linksName,
            productLinks: _p.productLinks,
            enclaves: _p.enclaves,
            backgroundType: _p.backgroundType,
            TypeName: _p.TypeName,
            address: _p.address,
            userName: _p.userName,
            password: _p.password
          })
          let sendLinkData = {
            links: this.productBank.LinkContent,
            commodityId: this.$route.query.tbcId
          }
          this.$axios({
            url: baseUrl + '/Commodity/insertLinks',
            method: 'post',
            data: sendLinkData
          })
            .then(res => {
              this.productBank.LinkContent = res.data.content
            })
            .catch(err => {
              console.log(err.data)
            })
        }
      } else {
        // 新增时前端自己保存
        let _p = this.productBank
        this.productBank.LinkContent.push({
          linksName: _p.linksName,
          productLinks: _p.productLinks,
          enclaves: _p.enclaves,
          backgroundType: _p.backgroundType,
          TypeName: _p.TypeName,
          address: _p.address,
          userName: _p.userName,
          password: _p.password
        })
      }
    },
    // 根据一级标签获取二级标签
    getSecondTagFun (index, key) {
      let sendData = {
        id: key.oneLabel
      }
      this.$axios({
        url: baseUrl + '/tagConf/getTwoLabel',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.productBank.label[index].twoLabel = [res.data.content[0].id]
          this.$set(this.productBank.getSecondTag, index, res.data.content)
          this.productBank.getSecondTag[index] = res.data.content
        }
      }).catch(err => {
        console.log(err.data)
      })
    },
    getSecondTagReverseFun (index, key) {
      let sendData = {
        fid: key.oneLabel
      }
      this.$axios({
        url: phpURL + '/cloud/getSecondTag',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$set(
              this.productBank.getSecondTagReverse,
              index,
              res.data.content
            )
            this.productBank.getSecondTagReverse[index] = res.data.content
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 按钮操作返回
    goBack () {
      bus.$emit('on-myclose', this.$route)
      this.$router.push({
        name: 'productBank'
      })
    },
    getTypeName (ids) {
      this.productBank.TypeName = ids.label
    },
    // 编辑链接信息
    editProduct (row) {
      this.editLink = true
      let _p = this.productBank
      _p.linkId = row.id
      _p.linksName = row.linksName
      _p.productLinks = row.productLinks
      _p.enclaves = row.enclaves
      _p.backgroundType = row.backgroundType
      _p.TypeName = row.TypeName
      _p.address = row.address
      _p.userName = row.userName
      _p.password = row.password
    },
    eidtProductLink () {
      let _p = this.productBank
      let sendData = {
        commodityId: this.$route.query.commodityId,
        id: this.productBank.linkId,
        linksName: _p.linksName,
        productLinks: _p.productLinks,
        enclaves: _p.enclaves,
        backgroundType: _p.backgroundType,
        address: _p.address,
        userName: _p.userName,
        password: _p.password
      }
      this.$axios({
        url: baseUrl + '/Commodity/updateLinks',
        method: 'post',
        data: sendData
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.productBank.LinkContent = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    //  删除链接信息
    removeProduct (row) {
      let sendData = {
        id: row.id
      }
      this.$axios({
        url: baseUrl + '/Commodity/deleteLinks',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.productBank.LinkContent = res.data.content
            this.$Message.info(res.data.msg)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 获取产品库的回显数据
    getEchoDataOne () {
      let sendData = {
        commodityId: this.$route.query.commodityId
      }
      this.$axios({
        url: phpURL + '/cloud/getCommodityInfoById',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          let _p = this.productBank
          let _r = res.data.content
          _p.commodityName = _r.commodityName
          _p.productCompanyId = _r.productCompanyId
          this.productBank.timeRage = [_r.startTime, _r.endTime]
          // 根据公司名称获取合同
          this.$axios({
            url: phpURL + '/cloud/getContractByProductCompanyId',
            method: 'post',
            data: $qs.stringify({
              productCompanyId: _p.productCompanyId
            })
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.contractList = res.data.content
              } else {
                // this.$Message.error(res.data.msg)
              }
            })
            .catch(err => {
              console.log(err.data)
            })
          this.productBank.contractId = res.data.content.contractId
          _p.settlement = String(_r.settlement)
          _p.cycle = _r.cycle
          _p.purchasePrice = _r.purchasePrice
          _p.proposalPrice = _r.proposalPrice
          _p.percentage = _r.percentage
          _p.roposalPercentage = _r.proposalPercentage
          _p.proposalRetain = _r.proposalRetain
          _p.retain = _r.retain
          _p.proposalPercentage = _r.proposalPercentage
          _p.advance = _r.advance
          // 对比信息
          if (_r.differenceJson === undefined) {
            this.compareContent = false
          } else {
            this.compareContent = true
            this.compareData = _r.differenceJson
          }
          _p.Ladder = _r.ladder
          if (_p.Ladder.length === 0) {
            this.addLadder()
          }
          _p.LinkContent = _r.links
          let sendLinkData = {
            links: _p.LinkContent,
            commodityId: this.$route.query.commodityId
          }
          this.$axios({
            url: baseUrl + '/Commodity/insertLinks',
            method: 'post',
            data: sendLinkData
          })
            .then(res => {
              _p.LinkContent = res.data.content
            })
            .catch(err => {
              console.log(err.data)
            })
          _p.emphasis = _r.emphasis
          //   _p.copierName = _r.copierName
          _p.label = _r.label
          if (_p.label.length === 0) {
            this.addLabel()
          }
          for (let i = 0; i <= _p.label.length; i++) {
            if (_p.label[i]) {
              let sendId = {
                id: _p.label[i].oneLabel
              }
              this.$axios({
                url: baseUrl + '/tagConf/getTwoLabel',
                method: 'post',
                data: $qs.stringify(sendId)
              })
                .then(res => {
                  if (res.data.code === 10000) {
                    this.$set(
                      this.productBank.getSecondTag,
                      i,
                      res.data.content
                    )
                    this.productBank.getSecondTag[i] = res.data.content
                  }
                })
                .catch(err => {
                  console.log(err.data)
                })
            }
          }
          this.productBank.reverseLabel = res.data.content.reverseLabel
          if (this.productBank.reverseLabel.length === 0) {
            this.addReverseLabel()
          }
          for (let i = 0; i <= this.productBank.reverseLabel.length; i++) {
            if (this.productBank.reverseLabel[i]) {
              let sendId = {
                fid: this.productBank.reverseLabel[i].oneLabel
              }

              this.$axios({
                url: phpURL + '/cloud/getSecondTag',
                method: 'post',
                data: $qs.stringify(sendId)
              })
                .then(res => {
                  if (res.data.code === 10000) {
                    this.$set(this.productBank.getSecondTagReverse, i, res.data.content)
                    this.productBank.getSecondTagReverse[i] = res.data.content
                  }
                })
                .catch(err => {
                  console.log(err.data)
                })
            }
          }
        } else {
          // this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err.data)
      })
    },
    // 获取待确认列表的回显数据
    getEchoData () {
      let sendData = {
        id: this.$route.query.tbcId
      }
      this.$axios({
        url: baseUrl + '/Commodity/updateinfo',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          let _p = this.productBank
          let _r = res.data.content
          // 对比信息
          if (_r.differenceJson === undefined) {
            this.compareContent = false
          } else {
            this.compareContent = true
            this.compareData = _r.differenceJson
          }
          _p.advance = _r.advance
          this.productBank.productCompanyId = res.data.content.productCompanyId
          // 根据公司名称获取合同
          this.$axios({
            url: phpURL + '/cloud/getContractByProductCompanyId',
            method: 'post',
            data: $qs.stringify({
              productCompanyId: this.productBank.productCompanyId
            })
          }).then(res => {
            if (res.data.code === 10000) {
              this.contractList = res.data.content
            } else {
              // this.$Message.error(res.data.msg)
            }
          })
            .catch(err => {
              console.log(err.data)
            })
          this.productBank.contractId = res.data.content.contractId

          _p.Ladder = _r.ladder
          if (_p.Ladder.length === 0) {
            this.addLadder()
          }
          _p.LinkContent = _r.links
          let sendLinkData = {
            links: _p.LinkContent,
            commodityId: this.$route.query.tbcId
          }
          this.$axios({
            url: baseUrl + '/Commodity/insertLinks',
            method: 'post',
            data: sendLinkData
          })
            .then(res => {
              _p.LinkContent = res.data.content
            })
            .catch(err => {
              console.log(err.data)
            })
          _p.emphasis = _r.emphasis
          _p.copier = _r.copier
          _p.twoEntryName = _r.twoEntryName
          _p.commodityName = _r.commodityName
          _p.settlement = String(_r.settlement)
          _p.cycle = _r.cycle
          _p.purchasePrice = _r.purchasePrice
          _p.proposalPrice = _r.proposalPrice
          _p.percentage = _r.percentage
          _p.roposalPercentage = _r.proposalPercentage
          _p.proposalRetain = _r.proposalRetain
          _p.retain = _r.retain
          _p.proposalPercentage = _r.proposalPercentage
          _p.timeRage = [_r.startTime, _r.endTime]
          _p.startTime = _r.startTime
          _p.endTime = _r.endTime
          if (res.data.content.transfer === undefined) {
            this.productBank.label = [{ oneLabel: '', twoLabel: [] }]
          } else {
            this.productBank.label = res.data.content.transfer
          }
          this.productBank.reverseLabel = res.data.content.reverseLabel
          if (this.productBank.label.length === 0) {
            this.addLabel()
          }
          for (let i = 0; i <= this.productBank.label.length; i++) {
            if (this.productBank.label[i]) {
              let sendId = {
                id: this.productBank.label[i].oneLabel
              }
              this.$axios({
                url: baseUrl + '/tagConf/getTwoLabel',
                method: 'post',
                data: $qs.stringify(sendId)
              }).then(res => {
                if (res.data.code === 10000) {
                  this.$set(this.productBank.getSecondTag, i, res.data.content)
                  this.productBank.getSecondTag[i] = res.data.content
                }
              }).catch(err => {
                console.log(err.data)
              })
            }
          }
          if (this.productBank.reverseLabel.length === 0) {
            this.addReverseLabel()
          }
          for (let i = 0; i <= this.productBank.reverseLabel.length; i++) {
            if (this.productBank.reverseLabel[i]) {
              let sendId = {
                fid: this.productBank.reverseLabel[i].oneLabel
              }
              this.$axios({
                url: phpURL + '/cloud/getSecondTag',
                method: 'post',
                data: $qs.stringify(sendId)
              }).then(res => {
                if (res.data.code === 10000) {
                  this.$set(this.productBank.getSecondTagReverse, i, res.data.content)
                  this.productBank.getSecondTagReverse[i] = res.data.content
                }
              }).catch(err => {
                console.log(err.data)
              })
            }
          }
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err.data)
      })
    },
    editInsertAxiox (sendData) {
      this.$axios({
        url: baseUrl + '/Commodity/insert',
        method: 'post',
        data: sendData
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.showLoading = false
            this.$Message.info(res.data.msg)
            bus.$emit('on-myclose', this.$route)
            this.$router.push({
              name: 'productBank'
            })
          } else if (res.data.code === 10021) {
            this.showLoading = false
            this.$Message.info('信息不一致')
            this.compareContent = true
            this.compareData = res.data.content
          } else if (res.data.code === 10105) {
            this.showLoading = false
            this.$Message.error(res.data.msg)
          } else {
            this.showLoading = false
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 编辑后保存
    saveNewPro (productBank) {
      // 12.24王诗鑫要求增加结算方式新增“点击”“包月”两个字段，但是选择这两个字段，保存时提示结算方式不存在，后期有逻辑再解开
      if (this.productBank.settlement === '5') {
        this.$Message.error('当前结算方式不存在')
      } else {
        this.showLoading = true
        this.$refs.productBank.validate(valid => {
          if (valid) {
            if (this.productBank.Ladder[0].magnitude !== '') {
              if (this.productBank.Ladder[0].proposalPrice !== '') {
                if (this.productBank.label[0].oneLabel !== '' && this.productBank.label[0].twoLabel.length !== 0) {
                  let _p = this.productBank
                  if (this.$route.query.type === undefined) {
                    let sendData = {
                      id: this.$route.query.commodityId,
                      commodityName: _p.commodityName,
                      contractId: _p.contractId,
                      productCompanyId: _p.productCompanyId,
                      settlement: _p.settlement,
                      cycle: _p.cycle,
                      purchasePrice: _p.purchasePrice,
                      advance: _p.advance,
                      proposalPrice: _p.proposalPrice,
                      percentage: _p.percentage,
                      proposalPercentage: _p.proposalPercentage,
                      retain: _p.retain,
                      proposalRetain: _p.proposalRetain,
                      emphasis: _p.emphasis,
                      links: _p.LinkContent,
                      transfer: _p.label,
                      reverseLabel: _p.reverseLabel,
                      ladder: _p.Ladder,
                      copier: _p.copier,
                      twoEntryId: _p.twoEntryId,
                      tbcId: -1,
                      route: 'waitSureProductBanckCon',
                      startAndEndTime: _p.timeRage,
                      startTime: _p.startTime,
                      endTime: _p.endTime
                    }
                    this.editInsertAxiox(sendData)
                  } else {
                    let sendData = {
                      id: this.$route.query.commodityId,
                      commodityName: _p.commodityName,
                      contractId: _p.contractId,
                      productCompanyId: _p.productCompanyId,
                      settlement: _p.settlement,
                      cycle: _p.cycle,
                      purchasePrice: _p.purchasePrice,
                      advance: _p.advance,
                      proposalPrice: _p.proposalPrice,
                      percentage: _p.percentage,
                      proposalPercentage: _p.proposalPercentage,
                      retain: _p.retain,
                      proposalRetain: _p.proposalRetain,
                      emphasis: _p.emphasis,
                      links: _p.LinkContent,
                      transfer: _p.label,
                      reverseLabel: _p.reverseLabel,
                      ladder: _p.Ladder,
                      copier: _p.copier,
                      twoEntryId: _p.twoEntryId,
                      tbcId: this.$route.query.tbcId,
                      route: 'waitSureProductBanckCon',
                      startAndEndTime: _p.timeRage,
                      startTime: _p.startTime,
                      endTime: _p.endTime
                    }
                    this.editInsertAxiox(sendData)
                  }
                } else {
                  this.showLoading = false
                  this.$Message.error('标签必填')
                }
              } else {
                this.showLoading = false
                this.$Message.error('建议出价必填')
              }
            } else {
              if (this.productBank.label[0].oneLabel !== '' && this.productBank.label[0].twoLabel.length !== 0) {
                let _p = this.productBank
                if (this.$route.query.type === undefined) {
                  let sendData = {
                    id: this.$route.query.commodityId,
                    commodityName: _p.commodityName,
                    contractId: _p.contractId,
                    productCompanyId: _p.productCompanyId,
                    settlement: _p.settlement,
                    cycle: _p.cycle,
                    advance: _p.advance,
                    purchasePrice: _p.purchasePrice,
                    proposalPrice: _p.proposalPrice,
                    percentage: _p.percentage,
                    proposalPercentag: _p.proposalPercentag,
                    retain: _p.retain,
                    proposalRetain: _p.proposalRetain,
                    emphasis: _p.emphasis,
                    links: _p.LinkContent,
                    transfer: _p.label,
                    reverseLabel: _p.reverseLabel,
                    ladder: _p.Ladder,
                    copier: _p.copier,
                    tbcId: -1,
                    twoEntryId: _p.twoEntryId,
                    route: 'waitSureProductBanckCon',
                    startAndEndTime: _p.timeRage,
                    startTime: _p.startTime,
                    endTime: _p.endTime
                  }
                  this.editInsertAxiox(sendData)
                } else {
                  let sendData = {
                    id: this.$route.query.commodityId,
                    commodityName: _p.commodityName,
                    contractId: _p.contractId,
                    productCompanyId: _p.productCompanyId,
                    settlement: _p.settlement,
                    cycle: _p.cycle,
                    advance: _p.advance,
                    purchasePrice: _p.purchasePrice,
                    proposalPrice: _p.proposalPrice,
                    percentage: _p.percentage,
                    proposalPercentag: _p.proposalPercentag,
                    retain: _p.retain,
                    proposalRetain: _p.proposalRetain,
                    emphasis: _p.emphasis,
                    links: _p.LinkContent,
                    transfer: _p.label,
                    reverseLabel: _p.reverseLabel,
                    ladder: _p.Ladder,
                    copier: _p.copier,
                    tbcId: this.$route.query.tbcId,
                    twoEntryId: _p.twoEntryId,
                    route: 'waitSureProductBanckCon',
                    startAndEndTime: _p.timeRage,
                    startTime: _p.startTime,
                    endTime: _p.endTime
                  }
                  this.editInsertAxiox(sendData)
                }
              } else {
                this.showLoading = false
                this.$Message.error('标签必填')
              }
            }
          } else {
            this.showLoading = false
            this.$Message.error('有必填项未填写哦')
          }
        })
      }
    }
  }
}
</script>

<style lang="less">
.compareClasee{
    .compareHeader{
        border:1px solid #e8eaec;
        background-color: #f8f8f9;
        color: #515a6e;
        text-align: center;
    }
    .compareContentClass{
        border:1px solid #e8eaec;
        border-top:none;
        text-align: center;
        p{
            padding:3px;
            font-size: 12px;
        }
    }
}
//增加通知人弹窗
#addNotice {
    .ivu-modal-footer button:first-child {
        color: #19aa8d;
        background-color: #fff;
        border-color: #19aa8d;
    }

    //选择框
    .ivu-select-selection:hover {
        border-color: #19aa8d;
        outline: none;
    }

    .ivu-select-selection:focus {
        border-color: #19aa8d;
        outline: none;
        box-shadow: none;
    }

    .ivu-select-visible .ivu-select-selection {
        border-color: #19aa8d;
        outline: none;
        box-shadow: none;
    }

    .ivu-select-multiple .ivu-select-item-selected {
        color: #19aa8d;
        background: #fff;
    }

    .ivu-select-multiple .ivu-select-item-selected:after {
        color: #19aa8d;
    }
}

//增加联系人弹窗
#addContract {
    .ivu-modal {
        width: 800px !important;
    }

    .ivu-modal-footer button:first-child {
        color: #19aa8d;
        background-color: #fff;
        border-color: #19aa8d;
    }

    .title {
        text-align: right;
        line-height: 30px;
        margin-right: 10px;
    }

    .require {
        font-size: 17px;
        color: red;
        position: relative;
        top: 5px;
        right: 3px;
    }

    .rowPadding {
        margin-bottom: 20px;
    }

    //输入框
    .ivu-input:hover {
        border-color: #19aa8d;
    }

    .ivu-input:focus {
        border-color: #19aa8d;
        outline: 0;
        box-shadow: none;
    }
}
</style>
<style lang="less">
#addNotice {
    .ivu-modal-footer button:first-child {
        color: #19aa8d;
        background-color: #fff;
        border-color: #19aa8d;
    }

    //输入框
    .ivu-input:hover {
        border-color: #19aa8d;
    }

    .ivu-input:focus {
        border-color: #19aa8d;
        outline: 0;
        box-shadow: none;
    }

    //选择框
    .ivu-select-selection:hover {
        border-color: #19aa8d;
        outline: none;
    }

    .ivu-select-selection:focus {
        border-color: #19aa8d;
        outline: none;
        box-shadow: none;
    }

    .ivu-select-visible .ivu-select-selection {
        border-color: #19aa8d;
        outline: none;
        box-shadow: none;
    }

    .ivu-select-multiple .ivu-select-item-selected {
        color: #19aa8d;
        background: #fff;
    }

    .ivu-select-multiple .ivu-select-item-selected:after {
        color: #19aa8d;
    }
}
</style>
<style lang="less" >
  .vue-treeselect__multi-value-item{
    display: inline-table;
    font-size: 12px;
    vertical-align: top;
    color: #515a6e;
    padding: 0 8px;
    border: 1px solid #e8eaec;
    border-radius: 3px;
    background: #f7f7f7;
    font-size: 12px;
    vertical-align: middle;
    opacity: 1;
    overflow: hidden;
    cursor: pointer;
    height: 24px;
  }
.vue-treeselect__value-remove{
    color: #515a6e;
    padding-left: 5px;
    border-left:none;
    line-height: 0;
}
/* #productBank {
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
.title{
    text-align: right;
    line-height: 30px;
    margin-right: 10px;
}

.main {
  margin: 20px 70px;
  font-size: 13px;
  line-height: 30px;
}

i {
  color: red;
  position: relative;
  top: 3px;
}

.ivu-row {
  margin-top: 20px;
}

.add {
  color: #19aa8d;
  cursor: pointer;
}

.person i {
  color: #515a6e;
  cursor: pointer;
}
.addlink .ivu-col.ivu-col-span-3 {
  margin-top: 8px;
}
#link tbody tr td div{
       padding-left: 10px !important;
       padding-right: 10px !important;
} */
.require{
    color: red
}

#addNotice .title{
    margin-top: 7px
}
.rowPadding{
    margin-bottom: 15px
}
</style>
