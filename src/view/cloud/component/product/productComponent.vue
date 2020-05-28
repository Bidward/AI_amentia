<template>
<!--产品公司详情 增加 产品详情-->
<div class="contractCompany">
    <div class="header" @click="closeContent()">产品</div>
    <div v-if="openProduct">
        <div v-for="(item,index) in totalContentList" :key="index" style="border-bottom:3px dashed #ccc;margin-bottom:30px"  class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="4" class="cardTitle">基础信息：</Col>
            </Row>
            <!--基础信息-->
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">产品名称：</Col>
                <Col span="5">
                <p class="top">{{item.commodityInfo.commodityName||'暂无'}}</p>
                </Col>
                <Col span="3" class="title">合同编码：</Col>
                <Col span="5">
                <p class="top">{{item.commodityInfo.card||'暂无'}}</p>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">结算方式：</Col>
                <Col span="5">
                <p class="top">{{item.commodityInfo.settlement||'暂无'}}</p>
                </Col>
                <Col span="3" class="title">结算周期：</Col>
                <Col span="5">
                <p class="top">{{item.commodityInfo.cycle||'暂无'}}</p>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">进价：</Col>
                <Col span="5">
                <p class="top">{{item.commodityInfo.purchasePrice||'暂无'}}</p>
                </Col>
                <Col span="3" class="title">建议出价：</Col>
                <Col span="5">
                <p class="top">{{item.commodityInfo.proposalPrice||'暂无'}}</p>
                </Col>
            </Row>
            <Row class="rowPadding" v-if="item.commodityInfo.settlement === '充值(CPA+CPS)'">
                <Col span="3" offset="3" class="title">充值(%):</Col>
                <Col span="5">
                <p class="top">{{item.commodityInfo.percentage||'暂无'}}</p>
                </Col>
                <Col span="3" class="title">建议充值出价(%)：</Col>
                <Col span="5">
                <p class="top">{{item.commodityInfo.proposalPercentage||'暂无'}}</p>
                </Col>
            </Row>
             <Row class="rowPadding" v-if="item.commodityInfo.settlement === '留存(CPL)'">
                <Col span="3" offset="3" class="title">留存:</Col>
                <Col span="5">
                <p class="top">{{item.commodityInfo.retain||'暂无'}}</p>
                </Col>
                <Col span="3" class="title">建议留存出价(%)：</Col>
                <Col span="5">
                <p class="top">{{item.commodityInfo.proposalRetain||'暂无'}}</p>
                </Col>
            </Row>
            <div  v-if="item.commodityInfo.settlement === '包月(CPT)'">
              <Row class="rowPadding">
                <Col span="3" offset="3" class="title">合作周期：</Col>
                <Col span="3">
                <p class="top">{{item.commodityInfo.startTime+' —— '+item.commodityInfo.endTime||'暂无'}}</p>
                </Col>
              </Row>
            </div>
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">预收款项：</Col>
                <Col span="5">
                <p class="top">{{item.commodityInfo.advance||'暂无'}}</p>
                </Col>
            </Row>
            <div v-if="item.commodityInfo.ladder.length>=1">
                <Row class="rowPadding">
                    <Col span="12" offset="4" class="cardTitle">阶梯价</Col>
                </Row>
                <!--阶梯价-->
                <Row class="rowPadding" v-for="(item,index) in item.commodityInfo.ladder" :key="index">
                    <Col span="3" offset="3" class="title">量级：</Col>
                    <Col span="5">
                    <p class="top">{{item.magnitude+'(万)'||'暂无'}}</p>
                    </Col>
                    <Col span="3" class="title">单价：</Col>
                    <Col span="5">
                    <p class="top">{{item.unitPrice+'(元)'||'暂无'}}</p>
                    </Col>
                </Row>
            </div>
            <!--匹配信息-->
            <Row class="rowPadding">
                <Col span="12" offset="4" class="cardTitle">匹配信息</Col>
            </Row>
            <Row  class="rowPadding">
              <Col span="17" offset="4">
                  <Table :columns="matchInfoColumn" :data="item.matchData" border>
                      <template slot-scope="{ row, index }" slot="action">
                          <Button size="small" @click="getIsMatchDetail(row)">详情</Button>
                      </template>
                  </Table>
                  <Page
                  :total="item.matchTotalCount"
                  :page-size="item.matchPageSize"
                  :current="item.matchCurrPage" size="small" show-total show-sizer show-elevator
                  @on-change="(currPage)=>{item.matchCurrPage=currPage;getData(item)}"
                  @on-page-size-change="(pageSize)=>{item.matchPageSize=pageSize;getData(item)}"
                  style="float:right;color: #19aa8d;" />
              </Col>
            </Row>
            <!--待合作信息   链接启用-->
            <Row class="rowPadding">
                <Col span="12" offset="4" class="cardTitle">链接启用</Col>
            </Row>
            <Row class="rowPadding" >
                <Col span="17" offset="4">
                <Table border :columns="waitCooperateHeader" :data="item.commodityData">
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" @click="startUse(row,item)">启用</Button>
                    </template>
                </Table>
                <Page
                    :total="item.totalCount"
                    :page-size="item.pageSize"
                    :current="item.currPage"
                    size="small"
                    show-total
                    show-sizer
                    show-elevator
                    @on-change="(currPage)=>{item.currPage=currPage;getData(item)}"
                    @on-page-size-change="(pageSize)=>{item.pageSize=pageSize;getData(item)}"
                    style="float:right;color: #19aa8d;"
                />
                </Col>
            </Row>
            <!--已合作信息-->
            <Row class="rowPadding">
                <Col span="12" offset="4" class="cardTitle">已合作信息</Col>
            </Row>
            <Row class="rowPadding">
                <Col span="17" offset="4">
                    <Table border :columns="isCooperateHeader"  :data="item.alreadyCommodityData">
                        <template slot-scope="{ row, index }" slot="action">
                            <Button size="small" @click="getIsCooperDetail(row)">详情</Button>
                        </template>
                    </Table>
                    <Page
                        :total="item.alreadyTotalCount"
                        :page-size="item.alreadyPageSize"
                        :current="item.alreadyCurrPage"
                        size="small"
                        show-total
                        show-sizer
                        show-elevator
                        @on-change="(currPage)=>{item.alreadyCurrPage=currPage;getData(item)}"
                        @on-page-size-change="(pageSize)=>{item.alreadyPageSize=pageSize;getData(item)}"
                        style="float:right;color: #19aa8d;"
                    />
                </Col>
            </Row>

            <!--标签-->
            <Row class="rowPadding">
                <Col span="12" offset="4" class="cardTitle">标签</Col>
            </Row>
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">一级标签：</Col>
                <Col span="5">
                <p class="top">{{item.commodityInfo.oneLabelName||'暂无'}}</p>
                </Col>
                <Col span="3" class="title">二级标签：</Col>
                <Col span="5">
                <p class="top">{{item.commodityInfo.twoLabelName||'暂无'}}</p>
                </Col>
            </Row>
            <Row class="rowPadding">
              <Col span="3" offset="3" class="title">侧重标签：</Col>
                <Col span="5">
                  <p class="top">{{item.commodityInfo.emphasis||'暂无'}}</p>
              </Col>
            </Row>
            <!--反向标签-->
            <!-- <Row class="rowPadding">
                <Col span="12" offset="4" class="cardTitle">反向标签</Col>
            </Row>
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">一级标签：</Col>
                <Col span="5">
                <p class="top">{{item.commodityInfo.oneReverseLabelName||'暂无'}}</p>
                </Col>
                <Col span="3" class="title">二级标签：</Col>
                <Col span="5">
                <p class="top">{{item.commodityInfo.twoReverseLabelName||'暂无'}}</p>
                </Col>
            </Row> -->

        </div>
    </div>
    <div v-if="addData" style="text-align: center;height: 40px;background: #FFFBE6;border: 1px solid #FFE58F;line-height: 40px; width: 1000px;margin: 10px auto;margin-top: 10px;">
        <p style="display:inline"><Icon type="md-alert" style="color:rgb(255, 229, 143)"/>无产品信息，请录入产品</p><p style="color:#19a88d;display: initial;cursor: pointer;" @click="toAddNewContract">新增产品</p>
    </div>
     <!--启用弹出窗-->
    <Modal  :loading="onLoading" id="addNotice"  v-model="waitCooModal" title="合作" @on-ok="startUseSure">
        <Table :row-class-name="rowClassName"  highlight-row size="small" border :columns="recommendModelHeader" :data="recommendModelData" @on-row-click="getChannelData"></Table>
            <Page
            :total="recommend.totalCount"
            :page-size="recommend.pageSize"
            :current="recommend.currPage"
            size="small"
            show-total
            show-sizer
            show-elevator
            @on-change="(currPage)=>{recommend.currPage=currPage;startUsePage()}"
            @on-page-size-change="(pageSize)=>{recommend.pageSize=pageSize;startUsePage()}"
            style="color: #19aa8d;position: relative; left: 31%;"
        />
        <div class="detailRow" v-if="recommend.getDetailData">
            <Row class="rowPadding" style="margin-top:30px;">
                <Col span="5" offset="1" class="title">渠道名称：</Col>
                <Col span="6">
                <p class="top">{{recommend.channelName||'暂无'}}</p>
                </Col>
                <Col span="5" class="title">市场：</Col>
                <Col span="6">
                <p class="top">{{recommend.businessName||'暂无'}}</p>
                </Col>
            </Row>
            <Row class="rowPadding" style="margin-top:15px;">
                <Col span="5" offset="1" class="title">结算方式：</Col>
                <Col span="6">
                <p class="top">{{recommend.settlementName||'暂无'}}</p>
                </Col>
                <Col span="5" class="title">结算周期：</Col>
                <Col span="6">
                <p class="top">{{recommend.cycleName||'暂无'}}</p>
                </Col>
            </Row>
            <Row class="rowPadding" style="margin-top:15px;">
                <Col span="5" offset="1" class="title">包体类型：</Col>
                <Col span="6">
                <p class="top">{{recommend.enclavesName||'暂无'}}</p>
                </Col>
                <Col span="5" class="title">
                <i class="require">*</i>业务类型：</Col>
                <Col span="6">
                    <Select size="small" v-model="recommend.type" clearable style="margin-top:6px;">
                        <Option v-for="(item,index) in recommend.serviceType" :value="item.id" :key="index">{{item.value}}</Option>
                    </Select>
                </Col>
            </Row>
            <!--安装-->
            <div v-if="recommend.settlementName == '安装(CPA)' || recommend.settlementName == '点击(CPC)'">
                <Row class="rowPadding" style="margin-top:15px;">
                    <Col span="5" offset="1" class="title">进价：</Col>
                    <Col span="6">
                    <p class="top">{{recommend.purchasePrice||'暂无'}}</p>
                    </Col>
                    <Col span="5" class="title">
                    <i class="require">*</i>出价：</Col>
                    <Col span="6">
                        <Input  style="margin-top:6px;" v-model="recommend.purpricetrue" size="small" placeholder="输入出价" clearable></Input>
                        <p style="color:red" v-if="recommend.notUpto">利润率不达标</p>
                    </Col>
                </Row>
            </div>
            <!--充值-->
            <div v-if="recommend.settlementName == '充值(CPA+CPS)'">
                <Row class="rowPadding" style="margin-top:15px;">
                    <Col span="5" offset="1" class="title">进价：</Col>
                    <Col span="6">
                    <p class="top">{{ recommend.purchasePrice||'暂无'}}</p>
                    </Col>
                    <Col span="5" class="title">
                    <i class="require">*</i>出价：</Col>
                    <Col span="6">
                        <Input style="margin-top:6px"  v-model="recommend.purpricetrue" size="small" placeholder="输入出价" clearable></Input>
                        <p style="color:red" v-if="recommend.notUpto">利润率不达标</p>
                    </Col>
                </Row>
                <Row class="rowPadding" style="margin-top:15px;">
                    <Col span="5" offset="1" class="title">充值(%):</Col>
                    <Col span="6">
                    <p class="top">{{recommend.percentage||'暂无'}}</p>
                    </Col>
                    <Col span="5" class="title">
                    <i class="require">*</i>充值出价(%)：</Col>
                    <Col span="6">
                        <Input style="margin-top:6px"  v-model="recommend.sendpricetrue" size="small" placeholder="输入充值出价" clearable></Input>
                        <p style="color:red" v-if="recommend.notUpto">利润率不达标</p>
                    </Col>
                </Row>
            </div>
            <!--留存-->
            <div v-if="recommend.settlementName == '留存(CPL)'">
            <Row class="rowPadding" style="margin-top:15px;">
                <Col span="5" offset="1"  class="title">进价：</Col>
                <Col span="6">
                <p class="top">{{recommend.purchasePrice||'暂无'}}</p>
                </Col>
                <Col span="5" class="title">
                <i class="require">*</i>出价：</Col>
                <Col span="6">
                    <Input style="margin-top:6px"  v-model="recommend.purpricetrue" size="small" placeholder="输入出价" clearable></Input>
                    <p style="color:red" v-if="recommend.notUpto">利润率不达标</p>
                </Col>
            </Row>
            <Row>
                <Col span="5" offset="1" class="title">留存：</Col>
                <Col span="6">
                <p class="top">{{recommend.retain||'暂无'}}</p>
                </Col>
                <Col span="5" class="title">
                <i class="require">*</i>留存出价：</Col>
                <Col span="6">
                    <Input style="margin-top:6px"  v-model="recommend.proposalRetain" size="small" placeholder="输入出价" clearable></Input>
                    <p style="color:red" v-if="recommend.notUpto">利润率不达标</p>
                </Col>
            </Row>
            </div>
            <!--分成-->
            <div v-if="recommend.settlementName == '分成(CPS)'">
                <Row class="rowPadding" style="margin-top:15px;">
                    <Col span="5" offset="1" class="title">进价比(%)：</Col>
                    <Col span="6">
                    <p class="top">{{recommend.percentage||'暂无'}}</p>
                    </Col>
                    <Col span="5" class="title">
                    <i class="require">*</i>出价比(%)：</Col>
                    <Col span="6">
                        <Input style="margin-top:6px" v-model="recommend.sendpricetrue" size="small" placeholder="输入出价" clearable></Input>
                        <p style="color:red" v-if="recommend.notUpto">利润率不达标</p>
                    </Col>
                </Row>
            </div>
            <!-- 包月 -->
            <div v-if="recommend.settlementName == '包月(CPT)'">
              <Row class="rowPadding" style="margin-top:15px;">
                <Col span="5" offset="1" class="title">进价：</Col>
                <Col span="6">
                <p class="top">{{ recommend.purchasePrice||'暂无'}}</p>
                </Col>
                <Col span="5" class="title">
                <i class="require">*</i>出价：</Col>
                <Col span="6">
                  <Input style="margin-top:6px"  v-model="recommend.purpricetrue" size="small" placeholder="输入出价" clearable></Input>
                  <p style="color:red" v-if="recommend.notUpto">利润率不达标</p>
                </Col>
              </Row>
              <Row class="rowPadding">
                <Col span="5" offset="1" class="title">合作周期：</Col>
                <p class="top">{{ recommend.timeRage||'暂无'}}</p>
              </Row>
            </div>
            <div>
              <Row class="rowPadding" style="margin-top:15px;">
                    <Col span="5" offset="1" class="title"><i class="require">*</i>对应财务系统产品编码:</Col>
                    <Col span="6">
                      <Input style="margin-top:6px" v-model="recommend.oldCode" size="small" clearable></Input>
                      <p style="color:grey">多个用英文逗号连接</p>
                    </Col>
                </Row>
            </div>
            <div>
              <Row class="rowPadding" style="margin-top:15px;">
                  <Col span="5" offset="1" class="title"><i class="require">*</i>通知人:</Col>
                  <Col span="6">
                      <Select style="margin-top:6px"  v-model="recommend.twoEntryId" size="small" filterable clearable>
                          <Option v-for="person in incumbencyTbUser" :key="person.id" :value="person.id" :label="person.nickname">
                              <div>
                                  <p>{{person.nickname}}</p>
                                  <p>部门：{{person.deptName}}</p>
                                  <p>职位：{{person.positionName}}</p>
                              </div>
                          </Option>
                      </Select>
                  </Col>
              </Row>
            </div>
        </div>
    </Modal>
    <Modal v-model="recommend.approveNoticeModal" title="提醒" @on-ok="approveModal = true">
        <p style="float: left;">当前利润率为<p>{{recommend.profitPurchase+','+ recommend.profitProportion}}</p>不符合规范，是否提交审批</p>
    </Modal>
    <Modal :loading="loading" id="toApprove" v-model="approveModal" title="审批申请" @on-ok="toApprove">
        <div class="approveModalFont">
            <Row class="rowPadding">
                <Col span="5" offset="4" class="title">链接名称:</Col>
                <Col span="7">
                <p class="top">{{recommend.linkname||'暂无'}}</p>
                </Col>
            </Row>
            <Row  class="rowPadding">
                <Col span="5"  offset="4" class="title">产品链接：</Col>
                <Col span="7">
                    <p class="top">{{recommend.productLinks||'暂无'}}</p>
                </Col>
            </Row>
            <Row  class="rowPadding">
                <Col span="5"  offset="4" class="title">渠道名称：</Col>
                <Col span="7">
                    <p class="top">{{recommend.channename||'暂无'}}</p>
                </Col>
            </Row>
            <Row  class="rowPadding">
                <Col span="5"  offset="4" class="title">
                <i class="require">*</i>申请原因：</Col>
                <Col span="7">
                    <Input v-model="recommend.applyReason"  type="textarea" placeholder="输入申请原因"></Input>
                </Col>
            </Row>
            <Row  class="rowPadding">
                <Col span="5"  offset="4" class="title">附件上传：</Col>
                <Col span="7">
                    <Upload class="bzUpload"
                        multiple
                        name="fileData"
                        :on-success="(value)=> uploadFileSuccess(value)"
                        :action="staticUrl+'/index.php'"
                    >
                        <Button icon="ios-cloud-upload-outline">单个文件不能超过20MB</Button>
                    </Upload>
                </Col>
            </Row>
            <Row  class="rowPadding">
                <Col span="5"  offset="4" class="title">审批人:</Col>
                <Col span="7">
                    <Select id="colorFont" v-model = "recommend.approveId" clearable disabled filterable>
                        <Option v-for="item in incumbencyTbUser" :value="item.id" :key="item.id">{{item.nickname}}</Option>
                    </Select>
                </Col>
            </Row>
        </div>
    </Modal>
    <Modal title="详情"  v-model="iscooperModel"  id="detailModel" @on-ok="stopProduct">
        <Row class="rowPadding" style="margin-top:15px;">
            <Col span="4" offset="2" class="title">产品编码：</Col>
            <Col span="5">
                <p class="top">{{isCoopera.codeId||'暂无'}}</p>
            </Col>
        </Row>
        <Row class="rowPadding" style="margin-top:15px;">
            <Col span="4" offset="2" class="title">产品链接：</Col>
            <Col span="5">
                <p class="top">{{isCoopera.linksName||'暂无'}}</p>
            </Col>
            <Col span="4" class="title">
            包体类型：</Col>
            <Col span="5">
                <p class="top">{{isCoopera.enclavesName||'暂无'}}</p>
            </Col>
        </Row>
        <Row class="rowPadding" style="margin-top:15px;">
            <Col span="4" offset="2" class="title">结算方式：</Col>
            <Col span="5">
                <p class="top">{{isCoopera.settlementName||'暂无'}}</p>
            </Col>
            <Col span="4" class="title">
            结算周期：</Col>
            <Col span="5">
                <p class="top">{{isCoopera.cycleName||'暂无'}}</p>
            </Col>
        </Row>
        <!--安装 或充值-->
        <div v-if="isCoopera.settlement === 1 ||isCoopera.settlement === 2">
            <Row class="rowPadding" style="margin-top:15px;">
                <Col span="4" offset="2" class="title">进价：</Col>
                <Col span="5">
                        <p class="top">{{isCoopera.purchasePrice||'暂无'}}</p>
                </Col>
                <Col span="4" class="title">
                出价：</Col>
                <Col span="5">
                    <p class="top">{{isCoopera.purpricetrue||'暂无'}}</p>
                </Col>
            </Row>
            <Row class="rowPadding" style="margin-top:15px;">
                <Col span="4" offset="2" class="title">后台类型：</Col>
                <Col span="5">
                    <p class="top">{{isCoopera.backgroundTypeName||'暂无'}}</p>
                </Col>
            </Row>
        </div>
        <!--留存-->
        <div v-if="isCoopera.settlement === 3">
            <Row class="rowPadding" style="margin-top:15px;">
                <Col span="4" offset="2" class="title">进价：</Col>
                <Col span="5">
                    <p class="top">{{isCoopera.purchasePrice||'暂无'}}</p>
                </Col>
                <Col span="4" class="title">
                出价：</Col>
                <Col span="5">
                    <p class="top">{{isCoopera.purpricetrue||'暂无'}}</p>
                </Col>
            </Row>
            <Row class="rowPadding" style="margin-top:15px;">
                <Col span="4" offset="2" class="title">留存：</Col>
                <Col span="5">
                    <p class="top">{{isCoopera.retain||'暂无'}}</p>
                </Col>
                <Col span="4" class="title">
                留存出价：</Col>
                <Col span="5">
                    <p class="top">{{isCoopera.proposalRetain||'暂无'}}</p>
                </Col>
            </Row>
        </div>
        <!--分成-->
        <div v-if="isCoopera.settlement === 4">
            <Row class="rowPadding" style="margin-top:15px;">
                <Col span="4" offset="2" class="title">进价比(%)：</Col>
                <Col span="5">
                    <p class="top">{{isCoopera.percentage||'暂无'}}</p>
                </Col>
                <Col span="4" class="title">
                出价比(%)：</Col>
                <Col span="5">
                    <p class="top">{{isCoopera.sendpricetrue||'暂无'}}</p>
                </Col>
            </Row>
        </div>
        <!--后台类型判断-->
        <Row  class="rowPadding" v-if="isCoopera.backgroundType === 3 || isCoopera.backgroundType === 4">
            <Col span="4" offset="2"  class="title">
                群名 :
            </Col>
            <Col span="5">
                <p class="top">{{isCoopera.address ||'暂无'}}</p>
            </Col>
        </Row>
        <div v-if="isCoopera.backgroundType === 1">
            <Row  class="rowPadding">
            <Col span="4" offset="2" class="title">
                网址 :
            </Col>
            <Col span="5">
                <p class="top">{{isCoopera.address ||'暂无'}}</p>
            </Col>
            </Row>
            <Row  class="rowPadding">
            <Col span="4" offset="2" class="title">
                账号 :
            </Col>
            <Col span="5">
                <p class="top">{{isCoopera.username ||'暂无'}}</p>
            </Col>
            </Row>
            <Row  class="rowPadding">
            <Col span="4" offset="2" class="title">
                密码 :
            </Col>
            <Col span="5">
                <p class="top">{{isCoopera.password ||'暂无'}}</p>
            </Col>
            </Row>
        </div>
        <div v-if="isCoopera.backgroundType === 2">
            <Row  class="rowPadding">
            <Col span="4" offset="2" class="title">
                邮箱 :
            </Col>
            <Col span="5">
                <p class="top">{{isCoopera.address ||'暂无'}}</p>
            </Col>
            </Row>
            <Row  class="rowPadding">
            <Col span="4" offset="2" class="title">
                账号 :
            </Col>
            <Col span="5">
                <p class="top">{{isCoopera.username ||'暂无'}}</p>
            </Col>
            </Row>
            <Row  class="rowPadding">
            <Col span="4" offset="2" class="title">
                密码 :
            </Col>
            <Col span="5">
                <p class="top">{{isCoopera.password ||'暂无'}}</p>
            </Col>
            </Row>
        </div>
        <Row  class="rowPadding">
            <Col span="5" offset="1" class="title">对应财务系统产品编码：</Col>
            <Col span="5">
              <p class="top">{{isCoopera.oldCode ||'暂无'}}</p>
            </Col>
        </Row>
        <Row  class="rowPadding">
            <Col span="4" offset="2" class="title">状态：</Col>
            <Col span="5">
                <Select v-model="isCoopera.productStatus">
                    <Option v-for="item in isCoopera.productStatusList" :value="item.id" :key="item.id">{{item.status}}</Option>
                </Select>
            </Col>
        </Row>
    </Modal>
</div>
</template>

<script>
import {
  phpURL,
  baseUrl,
  staticUrl
} from '@/api/base.js'
export default {
  name: 'productComponent',
  data () {
    return {
      staticUrl,
      onLoading: true,
      loading: true,
      detaileChannleID: '',
      pageSizeID: '',
      addData: false,
      recommend: {
        oldCode: '',
        twoEntryId: '',
        profitPurchase: '',
        profitProportion: '',
        enclosure: [],
        channelName: '', // 渠道名称
        businessName: '', // 商务
        enclaves: '', // 包体类型
        approveId: '', // 审批人
        applyReason: '', // 申请原因
        // incumbencyTbUser: [],
        approveNoticeModal: false, // 利润率未达标提醒弹窗
        approveModal: false, // 提出审批弹窗
        notUpto: false, // 未达标显示红字
        getDetailData: false,
        currLinkId: '', // 当前链接id
        linksName: '', // 链接名称
        card: '', // 合同编码
        cycle: '', // 结算z周期
        cycleName: '', // 结算周期
        timeRage: [], // 合作周期
        settlement: '', // 结算方式
        settlementName: '', // 结算方式name
        purchasePrice: '', // 进价
        percentage: '', // 留/充值/进价比
        proposalPercentage: '',
        purpricetrue: '', // 出价
        sendpricetrue: '', // 留出/充值出/出比
        proposalRetain: '',
        retain: '', // 留存
        totalCount: 0,
        pageSize: 20,
        currPage: 1,
        type: 2, // 业务类型
        serviceType: [{
          id: 1,
          value: '移动'
        }, {
          id: 2,
          value: 'pc'
        }]
      },
      recommendModelHeader: [{
        title: '序号',
        type: 'index',
        width: 60,
        align: 'center',
        cellClassName: {
          name: 'demo-table-info-row'
        }
      }, {
        title: '渠道名称',
        key: 'channelName',
        align: 'center',
        cellClassName: {
          name: 'demo-table-info-row'
        }
      }, {
        title: '市场',
        key: 'businessName',
        align: 'center',
        cellClassName: {
          name: 'demo-table-info-row'
        }
      }],
      recommendModelData: [],
      // 已合作信息
      isCoopera: {
        isCooperaId: '',
        productStatus: '',
        productStatusList: [{
          id: 1,
          status: '不启用'
        }, {
          id: 2,
          status: '启用'
        }, {
          id: 3,
          status: '暂停'
        }, {
          id: 4,
          status: '停跑'
        }],
        enclavesName: '',
        codeId: '', // 产品编码
        linksName: '', // 产品链接
        enclaves: '', // 包体类型
        settlement: '', // 结算方式
        settlementName: '',
        cycle: '', // 结算周期
        purchasePrice: '', // 进价
        percentage: '', // 进价比
        proposalPercentage: '',
        purpricetrue: '', // 出价
        sendpricetrue: '', // 出价比
        proposalRetain: '',
        retain: '',
        backgroundType: '', // 后台类型
        address: '', // 网址/群名
        username: '', // 账号
        password: '', // 密码
        oldCode: '',
        totalCount: 0,
        pageSize: 10,
        currPage: 1
      },
      iscooperModel: false,
      matchInfoColumn: [{
        title: '序号',
        type: 'index',
        width: 60,
        align: 'center'
      }, {
        title: '渠道公司名称',
        key: 'channelName',
        align: 'center'
      }, {
        title: '市场',
        key: 'channelBusiness',
        align: 'center'
      }, {
        title: '标签',
        key: 'channelLabel',
        align: 'center'
      }, {
        title: '与产品合作状态',
        key: 'iscooperation',
        align: 'center'
      }, {
        title: '操作',
        slot: 'action',
        align: 'center'
      }],
      matchData: [],
      isCooperateHeader: [{
        title: '序号',
        type: 'index',
        width: 60,
        align: 'center'
      }, {
        title: '产品编码',
        key: 'softcode',
        align: 'center'
      }, {
        title: '产品链接',
        key: 'productLinks',
        align: 'center'
      }, {
        title: '进价/比',
        key: 'purchasePrice',
        align: 'center'
      }, {
        title: '出价/比',
        key: 'sendPrice',
        align: 'center'
      }, {
        title: '上线渠道',
        key: 'channelName',
        align: 'center'
      }, {
        title: '操作',
        slot: 'action',
        align: 'center'
      }],
      isCooperateData: [{
        index: '1',
        productCode: '爱奇艺',
        productLink: 'baidu',
        inPercentag: '1',
        outPercentag: '2',
        onlineChannel: '冯伟'
      }],
      //   approveNoticeModal: false, // 审批提醒
      approveModal: false, // 审批申请
      waitCooModal: false, // 启用待合作信息
      openProduct: false, // 合同开关
      productBank: {
        commodityName: '', // 产品名称
        card: '', // 合同 传id
        settlement: '', // 结算方式
        cycle: '', // 结算周期
        purchasePrice: '', // 进价
        proposalPrice: '', // 建议出价
        busiType: '', // 业务类型 上线之后才会有的东西
        advance: '', // 预收款项
        ladder: [{
          magnitude: '', // 量级
          unitPrice: '' // 单价
        }], // 阶梯价数组
        totalCount: 0,
        pageSize: 10,
        currPage: 1
      },
      // 待合作信息表格数据
      commodityIdList: [],
      totalCountList: [],
      pageSizeList: [],
      currPageList: [],
      commodityData: [],
      waitCooperateData: [],
      totalContentList: [],
      productBankList: [],
      waitCooperateDataList: [],
      // 待合作信息表头
      waitCooperateHeader: [{
        title: '序号',
        type: 'index',
        width: 60,
        align: 'center'
      }, {
        title: '链接名称',
        key: 'linksName',
        align: 'center'
      }, {
        title: '产品链接',
        key: 'productLinks',
        align: 'center'
      }, {
        title: '包体类型',
        key: 'enclavesName',
        align: 'center'
      }, {
        title: '后台类型',
        key: 'backgroundType',
        align: 'center'
      }, {
        title: '网址/群名',
        key: 'address',
        align: 'center'
      },
      {
        title: '账号',
        key: 'username',
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
      // 启用弹出窗的model值
      waitCooModel: {
        channelName: '', // 启用弹出框的渠道名称
        channelNameList: [], // 启用弹出框的渠道列表
        totalCount: 0,
        pageSize: 20,
        currPage: 1,
        serviceType: [{
          id: 1,
          value: '移动'
        }, {
          id: 2,
          value: 'pc'
        }],
        incumbencyTbUser: [],
        enclosure: []
      },
      // 启用弹窗表格数据
      waitCooModalTableHeader: [{
        title: '序号',
        type: 'index',
        width: 60,
        align: 'center'
      }, {
        title: '渠道名称',
        key: 'channelName',
        align: 'center'
      }, {
        title: '渠道名称',
        key: 'channelBusi',
        align: 'center'
      }],
      // 启用弹窗表格表头
      waitCooModalTableData: [{
        index: '1',
        channelName: '老孔',
        channelBusi: '张三'
      }, {
        index: '2',
        channelName: '老孔1',
        channelBusi: '张三1'
      }]
    }
  },
  inject: ['app'],
  computed: {
    incumbencyTbUser () { // 在职人员
      return this.app.employees
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 获取匹配信息的详情
    getIsMatchDetail (row) {
      this.$router.push({
        name: 'detailChannel',
        query: {
          productChannelId: row.id
        }
      })
    },
    // 获取已合作信息的详情
    getIsCooperDetail (row) {
      this.isCoopera.isCooperaId = row.id
      this.iscooperModel = true
      this.$axios({
        url: baseUrl + '/Commodity/getCooperation',
        method: 'post',
        data: $qs.stringify({ id: row.id })
      }).then(res => {
        if (res.data.code === 10000) {
          this.isCoopera.address = res.data.content.address
          this.isCoopera.codeId = res.data.content.codeId
          this.isCoopera.businessIdName = res.data.content.businessIdName
          this.isCoopera.backgroundType = res.data.content.backgroundType
          this.isCoopera.cycle = res.data.content.cycle
          this.isCoopera.cycleName = res.data.content.cycleName
          this.isCoopera.linksName = res.data.content.linksName
          this.isCoopera.enclavesName = res.data.content.enclavesName
          this.isCoopera.password = res.data.content.password
          this.isCoopera.oldCode = res.data.content.oldCode
          this.isCoopera.purchasePrice = res.data.content.purchasePrice
          this.isCoopera.purpricetrue = res.data.content.purpricetrue
          this.isCoopera.sendPrice = res.data.content.sendPrice
          this.isCoopera.sendpricetrue = res.data.content.sendpricetrue
          this.isCoopera.proposalRetain = res.data.content.proposalRetain
          this.isCoopera.retain = res.data.content.retain
          this.isCoopera.settlement = res.data.content.settlement
          this.isCoopera.settlementName = res.data.content.settlementName
          this.isCoopera.backgroundTypeName = res.data.content.backgroundTypeName
          this.isCoopera.username = res.data.content.username
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 获取详细信息
    getData (item = {}) {
      let sendData = {
        commodityId: item.commodityId,
        pageSize: item.pageSize,
        currPage: item.currPage,
        alreadyPageSize: item.alreadyPageSize,
        alreadyCurrPage: item.alreadyCurrPage,
        matchPageSize: item.matchPageSize,
        matchCurrPage: item.matchCurrPage,
        productCompanyId: this.$route.query.productCompanyId
      }
      this.$axios({
        url: phpURL + '/cloud/getUnLinksByProductCompanyId',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.totalContentList = res.data.content
          if (res.data.content.length === 0) {
            this.addData = true
            this.openProduct = false
          }
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
      // 在职人员
      // this.$axios({
      //   url: baseUrl + '/user/getIncumbencyTbUser',
      //   method: 'post'
      // }).then(res => {
      //   if (res.data.code === 10000) {
      //     this.recommend.incumbencyTbUser = res.data.content
      //   } else {
      //     this.$Message.error(res.data.msg)
      //   }
      // }).catch(err => {
      //   console.error(err)
      // })
      // 默认审批人是主管
      this.$axios({
        url: baseUrl + '/contract/getSausage',
        method: 'post',
        data: $qs.stringify({ Type: 1 })
      }).then(res => {
        if (res.data.code === 10000) {
          this.recommend.approveId = res.data.content.id
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },

    // 启用待合作信息
    startUse (row, item) {
      this.oldCode = ''
      this.detaileChannleID = row.id
      this.pageSizeID = item.commodityId
      this.waitCooModal = true
      this.recommend.getDetailData = false
      this.$axios({
        url: baseUrl + '/recommend/recommendText',
        method: 'post',
        data: $qs.stringify({
          tableType: 2,
          // id:this.totalContentList.commodityId,
          currPage: this.recommend.currPage,
          pageSize: this.recommend.pageSize,
          id: item.commodityId
        })
      }).then(res => {
        if (res.data.code === 10000) {
          this.recommendModelData = res.data.content.pageContent
          this.recommend.totalCount = res.data.content.totalCount
          this.recommend.pageSize = res.data.content.pageSize
          this.recommend.currPage = res.data.content.currPage
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 启用分页
    startUsePage () {
      this.$axios({
        url: baseUrl + '/recommend/recommendText',
        method: 'post',
        data: $qs.stringify({
          tableType: 2,
          currPage: this.recommend.currPage,
          pageSize: this.recommend.pageSize,
          id: this.pageSizeID
        })
      }).then(res => {
        if (res.data.code === 10000) {
          this.recommendModelData = res.data.content.pageContent
          this.recommend.totalCount = res.data.content.totalCount
          this.recommend.pageSize = res.data.content.pageSize
          this.recommend.currPage = res.data.content.currPage
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 点击推荐信息弹窗的表格数据获取详细信息
    getChannelData (data) {
      if (!data._disabled) {
        this.recommend.notUpto = false
        this.recommend.currLinkId = data.id
        this.recommend.type = 2
        this.recommend.percentage = '0'
        this.recommend.purchasePrice = '0'
        this.recommend.sendpricetrue = '0'
        this.recommend.proposalRetain = '0'
        this.$axios({
          url: baseUrl + '/Commodity/getLinkById',
          method: 'post',
          data: $qs.stringify({ pid: data.id, id: this.detaileChannleID })
        }).then(res => {
          if (res.data.code === 10000) {
            this.recommend.purpricetrue = '0'
            this.recommend.sendpricetrue = '0'
            this.recommend.proposalRetain = '0'
            this.recommend.retain = '0'
            this.recommend.getDetailData = true
            this.recommend.channelName = res.data.content.channelName
            this.recommend.businessName = res.data.content.businessName
            this.recommend.settlementName = res.data.content.settlementName
            this.recommend.retain = res.data.content.retain
            this.recommend.card = res.data.content.card
            this.recommend.cycleName = res.data.content.cycleName
            this.recommend.enclavesName = res.data.content.enclavesName
            this.recommend.linksName = res.data.content.linksName
            this.recommend.percentage = res.data.content.percentage
            this.recommend.purchasePrice = res.data.content.purchasePrice
            this.recommend.timeRage = res.data.content.startTime + ' —— ' + res.data.content.endTime
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.error(err)
        })
      }
    },
    // 启用弹窗确定按钮
    startUseSure () {
      let flag = this.recommend.purpricetrue !== '' || this.recommend.proposalRetain !== '' || this.recommend.sendpricetrue !== ''
      if (this.recommend.twoEntryId !== '' && this.recommend.type !== '' && flag) {
        let sendData = {
          route: 'waitSureProductLink',
          channelName: this.recommend.channelName,
          twoEntryId: this.recommend.twoEntryId,
          oldCode: this.recommend.oldCode,
          purpricetrue: this.recommend.purpricetrue,
          sendpricetrue: this.recommend.sendpricetrue,
          proposalRetain: this.recommend.proposalRetain,
          retain: this.recommend.retain,
          type: this.recommend.type,
          purchasePrice: this.recommend.purchasePrice,
          percentage: this.recommend.percentage,
          channelId: this.recommend.currLinkId,
          settlementName: this.recommend.settlementName,
          id: this.detaileChannleID
        }
        this.$axios({
          url: baseUrl + '/recommend/determine',
          method: 'post',
          data: $qs.stringify(sendData)
        }).then(res => {
          if (res.data.code === 10000) {
            this.waitCooModal = false
            this.$Message.info(res.data.msg)
            this.getData()
          } else if (res.data.code === 10102) {
            this.waitCooModal = false
            this.recommend.notUpto = true// 显示未达标的字
            this.recommend.approveNoticeModal = true
            this.recommend.channename = res.data.content.channename
            this.recommend.linkname = res.data.content.linkname
            this.recommend.productLinks = res.data.content.productLinks
            this.recommend.profitPurchase = res.data.content.profitPurchase
            this.recommend.profitProportion = res.data.content.profitProportion
            this.$Message.error(res.data.msg)
          } else if (res.data.code === 10104) {
            this.waitCooModal = false
            this.$Message.error(res.data.msg)
          } else {
            this.waitCooModal = false
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.error(err)
        })
      } else {
        this.$Message.info('有必填项未填')
        this.onLoading = false
        this.$nextTick(() => {
          this.onLoading = true
        })
      }
    },
    // 附件上传成功
    uploadFileSuccess (response, file, fileList) {
      if (response.rel === true) {
        // 文件上传展示
        this.recommend.enclosure.push({
          enclosureUrl: staticUrl + '' + response.url,
          enclosureName: response.filename
        })
      } else {
        console.error(response.msg)
      }
    },
    // 审批
    toApprove () {
      if (this.recommend.applyReason !== '') {
        let sendData = {
          purpricetrue: this.recommend.purpricetrue,
          sendpricetrue: this.recommend.sendpricetrue,
          proposalRetain: this.recommend.proposalRetain,
          retain: this.recommend.retain,
          type: this.recommend.type,
          purchasePrice: this.recommend.purchasePrice,
          percentage: this.recommend.percentage,
          channelId: this.recommend.currLinkId,
          settlementName: this.recommend.settlementName,
          id: this.detaileChannleID,
          Route: 'toAuditOnline',
          approveId: this.recommend.approveId,
          applyReason: this.recommend.applyReason,
          enclosure: this.recommend.enclosure
        }
        this.$axios({
          url: baseUrl + '/recommend/determineApproval',
          method: 'post',
          data: sendData
        }).then(res => {
          if (res.data.code === 10000) {
            //  this.loading = false
            this.approveModal = false
            // this.$Message.info(res.data.msg)
            this.getData()
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.error(err)
        })
      } else {
        this.$Message.error('申请原因必填')
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      }
    },
    stopProduct () {
      let sendData = {
        type: this.isCoopera.productStatus,
        id: this.isCoopera.isCooperaId,
        Route: 'toAuditOnline'
      }
      this.$axios({
        url: baseUrl + '/recommend/updateApproval',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.getData()
          this.$Message.info(res.data.msg)
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    rowClassName (row, index) {
      if (row._disabled) {
        return 'demo-table-info-row'
      }
    },
    // 展开关闭合同详情
    closeContent () {
      this.openProduct === true
        ? (this.openProduct = false)
        : (this.openProduct = true)
    },
    toAddNewContract () {
      this.$router.push({
        name: 'productBank'
      })
    }
  }
}
</script>
<style>
.ivu-table .demo-table-info-row {
    cursor: no-drop !important;
    color: #ccc;
}
</style>
<style lang="less">
#addNotice .ivu-modal {
    width: 720px !important;
}
#addNotice{
    .ivu-btn-text:hover {
        color: #19aa8d;
        background-color: #fff;
        border: 1px solid;
    }
    .ivu-btn-text:active {
        color: #19aa8d;
        background-color: #fff;
        border: 1px solid;
    }
    .ivu-input:hover {
        border-color: #19a88d;
    }
    .ivu-input:focus {
        border-color: #19a88d;
        outline: 0;
        box-shadow:none;
    }
    .ivu-select-selection-focused, .ivu-select-selection:hover {
        border-color: #19aa8d;
    }
    .ivu-select-item-selected, .ivu-select-item-selected:hover {
        color: #19aa8d;
    }
}
#detailModel{
    .ivu-modal{
        width: 720px!important;
    }
    .ivu-select-selection-focused, .ivu-select-selection:hover {
        border-color: #19aa8d;
    }
}
#colorFont{
    .ivu-select {
    display: inline-block;
    width: 100%;
    box-sizing: border-box;
    vertical-align: middle;
    color: #515a6e;
    font-size: 14px;
    line-height: normal;
}
.ivu-select-single .ivu-select-selection {
    height: 32px;
    position: relative;
}
.ivu-select-input {
    display: inline-block;
    height: 32px;
    line-height: 32px;
    padding: 0 24px 0 8px;
    font-size: 12px;
    outline: 0;
    border: none;
    box-sizing: border-box;
    color: #515a6e !important;
    background-color: transparent;
    position: relative;
    cursor: pointer;
}
}
</style>
<style lang="less" scoped>
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
.top{
    margin-top:5px;
}

.rowPadding {
    margin-bottom: 20px;
}
.approveModalFont{
    font-size:14px;
}
.contractCompany {
    font-size: 14px;

    .detailContent {
        margin-top: 30px;

        .content {
            margin-top: 6px;
        }

        .top {
            margin-top: 4px;
        }
    }
}
.detailRow{
    font-size: 13px;
}

.header {
    width: 100%;
    height: 70px;
    line-height: 70px;
    background-color: #EAF8F5;
    text-align: center;
    margin: 0 auto;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
}
</style>
