<template>
<!--渠道公司详情-->
<div class="productCompany">
    <div class="header" @click="closeContent()">渠道公司</div>
    <!--渠道信息 厂商为公司-->
    <div v-if="openProduct">
        <div class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">渠道信息</Col>
            </Row>
            <!--市场 公司/个人-->
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">
                市场：
                </Col>
                <Col span="5">
                <p class="content">{{companyInfo.businessIdName||'暂无'}}</p>
                </Col>

                <Col span="3" class="title">
                公司/个人：
                </Col>
                <Col span="5">
                <p class="content">{{companyInfo.channelTypeName||'暂无'}}</p>
                </Col>
            </Row>
            <!--是个人  姓名 身份证号-->
            <Row class="rowPadding" v-if="this.companyInfo.channelType === 2">
                <Col span="3" offset="3" class="title">
                姓名：
                </Col>
                <Col span="5">
                <p class="content">{{companyInfo.channelName||'暂无'}}</p>
                </Col>

                <Col span="3" class="title">
                身份证号：
                </Col>
                <Col span="5">
                <p class="content">{{companyInfo.channelCard||'暂无'}}</p>

                </Col>
            </Row>
            <!--是个人  对方联系地址 详细地址-->
            <Row class="rowPadding" v-if="this.companyInfo.channelType === 2">
                <Col span="3" offset="3" class="title">
                对方联系地址：
                </Col>
                <Col span="5">
                 <p class="content" style="margin-top: 5px;">{{companyInfo.contactAddr||'暂无'}}</p>
                </Col>

                <Col span="3" class="title">
                详细地址：
                </Col>
                <Col span="5">
                <p class="content">{{companyInfo.detailedAddress||'暂无'}}</p>
                </Col>
            </Row>
            <Row class="rowPadding" v-if="this.companyInfo.channelType === 2">
              <Col span="3" offset="3" class="title">
              量级：
              </Col>
              <Col span="5">
              <p class="content">{{companyInfo.magnitudeName||'暂无'}}</p>
              </Col>
            </Row>

            <!--公司名称 对方联系地址-->
            <Row class="rowPadding" v-if="this.companyInfo.channelType === 1">
                <Col span="3" offset="3" class="title">
                公司名称：
                </Col>
                <Col span="5">
                <p class="content">{{companyInfo.channelName||'暂无'}}</p>
                </Col>

                <Col span="3" class="title">
                对方联系地址：
                </Col>
                <Col span="5">
                 <p class="content" style="margin-top: 5px;">{{companyInfo.contactAddr||'暂无'}}</p>
                </Col>
            </Row>

            <!--详细地址 区域类型-->
            <Row class="rowPadding" v-if="this.companyInfo.channelType === 1">
                <Col span="3" offset="3" class="title">
                详细地址：
                </Col>
                <Col span="5">
                <p class="content">{{companyInfo.detailedAddress||'暂无'}}</p>
                </Col>
                <Col span="3" class="title">
                量级：
                </Col>
                <Col span="5">
                <p class="content">{{companyInfo.magnitudeName||'暂无'}}</p>
                </Col>
            </Row>
        </div>
        <!--联系人列表-->
        <div class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">联系人列表</Col>
            </Row>
            <Row class="rowPadding">
                <Col span="16" offset="4">
                <Table class="content" border id="contractTable" :columns="contractList.contractHeader" :data="contractList.contractData">
                    <template slot-scope="{ row, index }" slot="action">
                        <Button class="simple" v-if="row.istop !== 1" @click="setTop(row)">置顶</Button>
                    </template>
                </Table>
                </Col>
            </Row>
        </div>
        <!--开票信息-->
        <div class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">开票信息</Col>
            </Row>
            <Row class="rowPadding">
                <Col span="16" offset="4">
                <Table id="invoiceTable" border :columns="invoice.invoicetHeader" :data="invoice.invoiceData">
                    <template slot-scope="{ row, index }" slot="action">
                        <Button class="simple" @click="getInvoiceDetail(row)">详情</Button>
                    </template>
                </Table>
                </Col>
            </Row>
            <!--开票信息详情-->
            <Modal id="invoiceMoal" v-model="invoice.openInvioceModal" title="开票信息" ok-text="关闭" cancel-text=" ">
                <Row class="rowPadding">
                    <Col span="4" class="title">开户名：
                    </Col>
                    <Col span="6">
                    <p class="content" >{{invoiceModal.accountName||'暂无'}}</p>
                    </Col>

                    <Col span="6" class="title">纳税人识别号：
                    </Col>
                    <Col span="5">
                    <p class="content">{{invoiceModal.taxpayerCard||'暂无'}}</p>
                    </Col>
                </Row>
                <Row class="rowPadding">
                    <Col span="4" class="title">开户行：
                    </Col>
                    <Col span="6">
                    <p class="content">{{invoiceModal.openingBank||'暂无'}}</p>
                    </Col>

                    <Col span="6" class="title">开户行账号：
                    </Col>
                    <Col span="5">
                    <p class="content">{{invoiceModal.openingBankCard||'暂无'}}</p>
                    </Col>

                </Row>
                <Row class="rowPadding">
                    <Col span="4" class="title">开票地址：
                    </Col>
                    <Col span="6">
                    <p class="content">{{invoiceModal.billingAddress||'暂无'}}</p>
                    </Col>

                    <Col span="6" class="title">开票电话：
                    </Col>
                    <Col span="5">
                    <p class="content">{{invoiceModal.telephone||'暂无'}}</p>
                    </Col>
                </Row>
            </Modal>
        </div>
        <!--标签-->
        <div class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">标签</Col>
            </Row>
            <Row class="rowPadding" v-for="(addItem,key) in mainBusi.busiTimes" :key="key">
                <Col span="3" offset="3" class="title">
                一级标签：
                </Col>
                <Col span="5">
                <p class="content">{{mainBusi.busiTimes[key].oneLabelName||'暂无'}}</p>
                </Col>
                <Col span="3" class="title">
                二级标签：
                </Col>
                <Col span="7">
                <p class="content">{{ mainBusi.busiTimes[key].twoLabelName||'暂无'}}</p>
                </Col>
            </Row>
            <Row class="rowPadding">
                <Col span="3" offset="3" class="title">
                侧重标签：
                </Col>
                <Col span="5">
                <p class="content">{{mainBusi.typeImp||'暂无'}}</p>
                </Col>
            </Row>
        </div>
        <!--反向标签-->
        <Row class="rowPadding">
            <Col span="12" offset="4" class="cardTitle">反向标签</Col>
        </Row>
        <Row class="rowPadding"  v-for="(addItem,key) in mainBusi.reverseLabel" :key="key">
            <Col span="3" offset="3" class="title">一级标签：</Col>
            <Col span="5">
            <p class="top">{{mainBusi.reverseLabel[key].oneLabelName||'暂无'}}</p>
            </Col>
            <Col span="3" class="title">二级标签：</Col>
            <Col span="5">
            <p class="top">{{mainBusi.reverseLabel[key].twoLabelName||'暂无'}}</p>
            </Col>
        </Row>
        <!--备注-->
        <div class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">备注</Col>
            </Row>
            <!--备注-->
            <Row class="rowPadding">
                <Col span="5" offset="4">
                <p class="content">{{mainBusi.text||'暂无'}}</p>
                </Col>
            </Row>
        </div>
        <!--后面是推荐信息和已合作信息-->
        <div class="detailContent">
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">推荐信息</Col>
            </Row>
            <!--推荐信息-->
            <Row class="rowPadding">
                <Col span="17" offset="4">
                    <Table border :columns="recommendHeader" :data="recommendData">
                        <template slot-scope="{ row, index }" slot="action">
                            <Button type="primary" v-if="recommend._disabled" disabled size="small" @click="startUse(row)">启用</Button>
                            <Button type="primary" v-else  size="small" @click="startUse(row)">启用</Button>
                        </template>
                    </Table>
                <Page
                    :total="recommend.totalCount"
                    :page-size="recommend.pageSize"
                    :current="recommend.currPage"
                    size="small"
                    show-total
                    show-sizer
                    show-elevator
                    @on-change="(currPage)=>{recommend.currPage=currPage;getData()}"
                    @on-page-size-change="(pageSize)=>{recommend.pageSize=pageSize;getData()}"
                    style="float:right;color: #19aa8d;"
                />
                </Col>
            </Row>
            <!--启用弹出窗-->
            <Modal id="addNotice" :loading="onLoading" v-model="recommendModel" title="启用" @on-ok="startUseSure">
                <Table size="small"  highlight-row  border :columns="recommendModelHeader" :data="recommendModelData" @on-row-click="getChannelData"></Table>
                <div class="detailRow" v-if="recommend.getDetailData">
                    <Row class="rowPadding" style="margin-top:30px;">
                        <Col span="4" offset="2" class="title">链接名称：</Col>
                        <Col span="5">
                        <p class="top">{{recommend.linksName||'暂无'}}</p>
                        </Col>
                        <Col span="4" class="title">产品链接：</Col>
                        <Col span="5" style="word-wrap: break-word;word-break: break-all;">
                        <p class="top">{{recommend.productLinks||'暂无'}}</p>
                        </Col>
                    </Row>
                    <Row class="rowPadding" style="margin-top:15px;">
                        <Col span="4" offset="2" class="title">结算方式：</Col>
                        <Col span="5">
                        <p class="top">{{recommend.settlementName||'暂无'}}</p>
                        </Col>
                        <Col span="4" class="title">结算周期：</Col>
                        <Col span="5">
                        <p class="top">{{recommend.cycleName||'暂无'}}</p>
                        </Col>
                    </Row>
                    <Row class="rowPadding" style="margin-top:15px;">
                        <Col span="4" offset="2" class="title">包体类型：</Col>
                        <Col span="5">
                        <p class="top">{{recommend.enclavesName||'暂无'}}</p>
                        </Col>
                        <Col span="4" class="title">
                         <i class="require">*</i>业务类型：</Col>
                        <Col span="5">
                            <Select size="small" v-model="recommend.type" clearable style="margin-top:6px;">
                                <Option v-for="(item,index) in recommend.serviceType" :value="item.id" :key="index">{{item.value}}</Option>
                            </Select>
                        </Col>
                    </Row>
                    <!--安装-->
                    <div v-if="recommend.settlementName === '安装'">
                        <Row class="rowPadding" style="margin-top:15px;">
                            <Col span="4" offset="2" class="title">进价：</Col>
                            <Col span="5">
                            <p class="top">{{recommend.purchasePrice||'暂无'}}</p>
                            </Col>
                            <Col span="4" class="title">
                             <i class="require">*</i>出价：</Col>
                            <Col span="5">
                                <Input style="margin-top:6px;" v-model="recommend.purpricetrue" size="small" placeholder="输入出价" clearable></Input>
                                <p style="color:red" v-if="recommend.notUpto">利润率不达标</p>
                            </Col>
                        </Row>
                    </div>
                    <!--充值-->
                    <div v-if="recommend.settlementName === '充值'">
                        <Row class="rowPadding" style="margin-top:15px;">
                            <Col span="4" offset="2" class="title">进价：</Col>
                            <Col span="5">
                            <p class="top">{{ recommend.purchasePrice||'暂无'}}</p>
                            </Col>
                            <Col span="4" class="title">
                             <i class="require">*</i>出价：</Col>
                            <Col span="5">
                                <Input style="margin-top:6px;"  v-model="recommend.purpricetrue" size="small" placeholder="输入出价" clearable></Input>
                                <p style="color:red" v-if="recommend.notUpto">利润率不达标</p>
                            </Col>
                        </Row>
                        <Row class="rowPadding" style="margin-top:15px;">
                            <Col span="4" offset="2" class="title">充值(%):</Col>
                            <Col span="5">
                            <p class="top">{{recommend.percentage||'暂无'}}</p>
                            </Col>
                            <Col span="5" class="title">
                             <i class="require">*</i>充值出价(%)：</Col>
                            <Col span="5">
                                <Input style="margin-top:6px;"  v-model="recommend.sendpricetrue" size="small" placeholder="输入充值出价" clearable></Input>
                                <p style="color:red" v-if="recommend.notUpto">利润率不达标</p>
                            </Col>
                        </Row>
                    </div>
                    <!--留存-->
                    <div v-if="recommend.settlementName === '留存'">
                    <Row style="margin-top:15px;">
                        <Col span="4" offset="2"  class="title">进价：</Col>
                        <Col span="5">
                        <p class="top">{{recommend.purchasePrice||'暂无'}}</p>
                        </Col>
                        <Col span="4" class="title">
                         <i class="require">*</i>出价：</Col>
                        <Col span="5">
                            <Input style="margin-top:6px;"   v-model="recommend.purpricetrue" size="small" placeholder="输入出价" clearable></Input>
                            <p style="color:red" v-if="recommend.notUpto">利润率不达标</p>
                        </Col>
                    </Row>
                    <Row style="margin-top:15px;">
                        <Col span="4" offset="2" class="title">留存：</Col>
                        <Col span="5">
                        <p class="top">{{recommend.retain||'暂无'}}</p>
                        </Col>
                        <Col span="4" class="title">
                         <i class="require">*</i>留存出价：</Col>
                        <Col span="5">
                            <Input style="margin-top:6px;"  v-model="recommend.proposalRetain" size="small" placeholder="输入出价" clearable></Input>
                            <p style="color:red" v-if="recommend.notUpto">利润率不达标</p>
                        </Col>
                    </Row>
                    </div>
                    <!--分成-->
                    <div v-if="recommend.settlementName === '分成'">
                        <Row class="rowPadding" style="margin-top:15px;">
                            <Col span="4" offset="2" class="title">进价比(%)：</Col>
                            <Col span="5">
                            <p class="top">{{recommend.percentage||'暂无'}}</p>
                            </Col>
                            <Col span="4" class="title">
                            <i class="require">*</i>出价比(%)：</Col>
                            <Col span="5">
                                <Input style="margin-top:6px;"  v-model="recommend.sendpricetrue" size="small" placeholder="输入出价" clearable></Input>
                                <p style="color:red" v-if="recommend.notUpto">利润率不达标</p>
                            </Col>
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
                            <Col span="4" offset="2" class="title"><i class="require">*</i>通知人:</Col>
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
            <Modal v-model="recommend.approveNoticeModal" title="提醒" @on-ok="noticeSure">
                <p style="float:left">利润率为<p style=" display: contents;">{{recommend.profitPurchase+','+ recommend.profitProportion}}</p>不符合规范，是否提交审批</p>
            </Modal>
            <!--未达标 提出申请-->
            <Modal :loading="loading" id="toApprove" v-model="recommend.approveModal" title="审批申请" @on-ok="toApprove">
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
             <!--已合作信息-->
            <Row class="rowPadding">
                <Col span="12" offset="3" class="cardTitle">已合作信息</Col>
            </Row>
            <Row class="rowPadding">
                <Col span="17" offset="4">
                    <Table border :columns="isCooperateHeader"   :data="isCooperateData">
                        <template slot-scope="{ row, index }" slot="action">
                            <Button  size="small" @click="getIsCooperDetail(row)">详情</Button>
                        </template>
                    </Table>
                    <Page
                        :total="isCoopera.totalCount"
                        :page-size="isCoopera.pageSize"
                        :current="isCoopera.currPage"
                        size="small"
                        show-total
                        show-sizer
                        show-elevator
                        @on-change="(currPage)=>{isCoopera.currPage=currPage;getData()}"
                        @on-page-size-change="(pageSize)=>{isCoopera.pageSize=pageSize;getData()}"
                        style="float:right;color: #19aa8d;"
                    />
                </Col>
            </Row>
            <Modal  v-model="iscooperModel" title="详情" id="detailModel">
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
                        <p class="top">{{isCoopera.cycle||'暂无'}}</p>
                    </Col>
                </Row>
                <!--安装 或充值-->
                <div v-if="isCoopera.settlement == 1 ||isCoopera.settlement == 2">
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
                        <div v-if="isCoopera.backgroundType ===3 || isCoopera.backgroundType ===4">
                            <Col span="4" class="title"> 群名：</Col>
                            <Col span="5">
                                <p class="top">{{isCoopera.address||'暂无'}}</p>
                            </Col>
                        </div>
                    </Row>
                        <div v-if="isCoopera.backgroundType == 1">
                                <Row class="rowPadding" style="margin-top:15px;">
                                <Col span="4" offset="2" class="title">
                                    网址 :
                                </Col>
                                <Col span="5">
                                    <p class="top">{{isCoopera.address||'暂无'}}</p>
                                </Col>
                                </Row>
                                <Row class="rowPadding" style="margin-top:15px;">
                                <Col span="4" offset="2" class="title">
                                    账号 :
                                </Col>
                                <Col span="5">
                                    <p class="top">{{isCoopera.username||'暂无'}}</p>
                                </Col>
                                </Row>
                                <Row class="rowPadding" style="margin-top:15px;">
                                <Col span="4" offset="2" class="title">
                                    密码 :
                                </Col>
                                <Col span="5">
                                    <p class="top">{{isCoopera.password||'暂无'}}</p>
                                </Col>
                                </Row>
                        </div>
                        <div v-if="isCoopera.backgroundType == 2">
                            <Row class="rowPadding" style="margin-top:15px;">
                                <Col  span="4" offset="2" class="title">
                                    邮箱 :
                                </Col>
                                <Col span="5">
                                    <p class="top">{{isCoopera.address||'暂无'}}</p>
                                </Col>
                            </Row>
                            <Row class="rowPadding" style="margin-top:15px;">
                                <Col  span="4" offset="2" class="title">
                                    账号 :
                                </Col>
                                <Col span="5">
                                    <p class="top">{{isCoopera.username||'暂无'}}</p>
                                </Col>
                            </Row>
                            <Row class="rowPadding" style="margin-top:15px;">
                                <Col span="4" offset="2" class="title">
                                    密码 :
                                </Col>
                                <Col span="5">
                                    <p class="top">{{isCoopera.password||'暂无'}}</p>
                                </Col>
                            </Row>
                        </div>
                    </Row>
                </div>
                <!--留存-->
                <div v-if="isCoopera.settlement == 3">
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
                    <Row class="rowPadding" style="margin-top:15px;">
                        <Col span="4" offset="2" class="title">后台类型：</Col>
                        <Col span="5">
                            <p class="top">{{isCoopera.backgroundTypeName||'暂无'}}</p>
                        </Col>
                        <div v-if="isCoopera.backgroundType ===3 || isCoopera.backgroundType ===4">
                            <Col span="4" class="title"> 群名：</Col>
                            <Col span="5">
                                <p class="top">{{isCoopera.address||'暂无'}}</p>
                            </Col>
                        </div>
                    </Row>
                    <div v-if="isCoopera.backgroundType == 1">
                        <Row class="rowPadding" style="margin-top:15px;">
                            <Col span="4" offset="2" class="title">
                                网址 :
                            </Col>
                            <Col span="5">
                                <p class="top">{{isCoopera.address||'暂无'}}</p>
                            </Col>
                        </Row>
                        <Row class="rowPadding" style="margin-top:15px;">
                            <Col span="4" offset="2" class="title">
                                账号 :
                            </Col>
                            <Col span="5">
                                <p class="top">{{isCoopera.username||'暂无'}}</p>
                            </Col>
                        </Row>
                        <Row class="rowPadding" style="margin-top:15px;">
                            <Col span="4" offset="2" class="title">
                                密码 :
                            </Col>
                            <Col span="5">
                                <p class="top">{{isCoopera.password||'暂无'}}</p>
                            </Col>
                        </Row>
                    </div>
                    <div v-if="isCoopera.backgroundType == 2">
                        <Row class="rowPadding" style="margin-top:15px;">
                            <Col  span="4" offset="2" class="title">
                                邮箱 :
                            </Col>
                            <Col span="5">
                                <p class="top">{{isCoopera.address||'暂无'}}</p>
                            </Col>
                        </Row>
                        <Row class="rowPadding" style="margin-top:15px;">
                            <Col  span="4" offset="2" class="title">
                                账号 :
                            </Col>
                            <Col span="5">
                                <p class="top">{{isCoopera.username||'暂无'}}</p>
                            </Col>
                        </Row>
                        <Row class="rowPadding" style="margin-top:15px;">
                            <Col span="4" offset="2" class="title">
                                密码 :
                            </Col>
                            <Col span="5">
                                <p class="top">{{isCoopera.password||'暂无'}}</p>
                            </Col>
                        </Row>
                    </div>
                </div>
                <!--分成-->
                <div v-if="isCoopera.settlement == '4'">
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
                    <Row class="rowPadding" style="margin-top:15px;">
                        <Col span="4" offset="2" class="title">后台类型：</Col>
                        <Col span="5">
                            <p class="top">{{isCoopera.backgroundTypeName||'暂无'}}</p>
                        </Col>
                        <div v-if="isCoopera.backgroundType ===3 || isCoopera.backgroundType ===4">
                            <Col span="4" class="title"> 群名：</Col>
                            <Col span="5">
                                <p class="top">{{isCoopera.address||'暂无'}}</p>
                            </Col>
                        </div>
                    </Row>
                    <div v-if="isCoopera.backgroundType == 1">
                        <Row class="rowPadding" style="margin-top:15px;">
                            <Col span="4" offset="2" class="title">
                                网址 :
                            </Col>
                            <Col span="5">
                                <p class="top">{{isCoopera.address||'暂无'}}</p>
                            </Col>
                        </Row>
                        <Row class="rowPadding" style="margin-top:15px;">
                            <Col span="4" offset="2" class="title">
                                账号 :
                            </Col>
                            <Col span="5">
                                <p class="top">{{isCoopera.username||'暂无'}}</p>
                            </Col>
                        </Row>
                        <Row class="rowPadding" style="margin-top:15px;">
                            <Col span="4" offset="2" class="title">
                                密码 :
                            </Col>
                            <Col span="5">
                                <p class="top">{{isCoopera.password||'暂无'}}</p>
                            </Col>
                        </Row>
                    </div>
                    <div v-if="isCoopera.backgroundType == 2">
                        <Row class="rowPadding" style="margin-top:15px;">
                            <Col  span="4" offset="2" class="title">
                                邮箱 :
                            </Col>
                            <Col span="5">
                                <p class="top">{{isCoopera.address||'暂无'}}</p>
                            </Col>
                        </Row>
                        <Row class="rowPadding" style="margin-top:15px;">
                            <Col  span="4" offset="2" class="title">
                                账号 :
                            </Col>
                            <Col span="5">
                                <p class="top">{{isCoopera.username||'暂无'}}</p>
                            </Col>
                        </Row>
                        <Row class="rowPadding" style="margin-top:15px;">
                            <Col span="4" offset="2" class="title">
                                密码 :
                            </Col>
                            <Col span="5">
                                <p class="top">{{isCoopera.password||'暂无'}}</p>
                            </Col>
                        </Row>
                    </div>

                </div>
                <Row  class="rowPadding">
                    <Col span="5" offset="1" class="title">对应财务系统产品编码：</Col>
                    <Col span="5">
                      <p class="top">{{isCoopera.oldCode ||'暂无'}}</p>
                    </Col>
                </Row>
          </Modal>
        </div>
    </div>
    <div v-if="addData" style="text-align: center;height: 40px;background: #FFFBE6;border: 1px solid #FFE58F;line-height: 40px; width: 1000px;margin: 0 auto;margin-top: 10px;">
        <p style="display:inline"><Icon type="md-alert" style="color:rgb(255, 229, 143)"/>无产品信息，请录入产品</p><p style="color:#19a88d;display: INITIAL;" @click="toAddNewContract">新增产品</p>
    </div>
</div>
</template>

<script>
import { baseUrl, staticUrl } from '@/api/base.js'
export default {
  name: 'detaileChannel',
  data () {
    return {
      staticUrl,
      onLoading: true,
      loading: true,
      addData: false,
      // 已合作信息
      isCoopera: {
        codeId: '', // 产品编码
        linksName: '', // 产品链接
        enclaves: '', // 包体类型
        settlement: '', // 结算方式
        settlementName: '',
        cycle: '', // 结算周期
        purchasePrice: '', // 进价
        percentage: '', // 进价比
        purpricetrue: '', // 出价
        sendpricetrue: '', // 出价比
        retain: '',
        proposalRetain: '',
        backgroundType: '', // 后台类型
        address: '', // 网址/群名
        username: '', // 账号
        password: '', // 密码
        oldCode: '',
        backgroundTypeName: '', // 后台类型
        totalCount: 0,
        pageSize: 10,
        currPage: 1,
        _disabled: true
      },
      iscooperModel: false,
      isCooperateHeader: [{
        title: '序号',
        type: 'index',
        width: 60,
        align: 'center'
      }, {
        title: '产品编码',
        key: 'codeId',
        align: 'center'
      }, {
        title: '产品链接',
        key: 'linksName',
        align: 'center'
      }, {
        title: '上线时间',
        key: 'data',
        align: 'center'
      }, {
        title: '商务',
        key: 'businessIdName',
        align: 'center'
      }, {
        title: '进价',
        key: 'purchasePrice',
        align: 'center'
      }, {
        title: '操作',
        slot: 'action',
        align: 'center'
      }],
      isCooperateData: [],
      // 推荐信息
      recommend: {
        twoEntryId: '',
        oldCode: '',
        profitPurchase: '',
        profitProportion: '',
        channename: '',
        linkname: '',
        enclosure: [],
        enclaves: '', // 包体类型
        enclavesName: '',
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
        settlement: '', // 结算方式
        settlementName: '', // 结算方式name
        purchasePrice: '', // 进价
        percentage: '', // 留/充值/进价比
        purpricetrue: '', // 出价
        sendpricetrue: '0', // 留出/充值出/出比
        proposalRetain: '0',
        retain: '0', // 留存
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
      // 推荐信息表格表头
      recommendHeader: [{
        title: '序号',
        type: 'index',
        width: 60,
        align: 'center'
      }, {
        title: '产品名称',
        key: 'commodityName',
        align: 'center'
      }, {
        title: '链接数量',
        key: 'linkCount',
        align: 'center'
      }, {
        title: '结算方式',
        key: 'settlementName',
        align: 'center'
      }, {
        title: '商务',
        key: 'bName',
        align: 'center'
      }, {
        title: '操作',
        slot: 'action',
        align: 'center'
      }],
      // 推荐信息表格数据
      recommendData: [],

      // 推荐信息启用
      recommendModel: false,
      // 推荐框表格
      recommendModelHeader: [{
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
      }],
      recommendModelData: [],
      openProduct: true,
      person: false, // 产品公司类型为个人
      showNotice: false, // 通知人弹窗
      // 公司信息
      companyInfo: {
        businessId: '', // 市场id
        // incumbencyTbUser: [], // 市场列表
        channelType: '', // 公司或个人  1为公司2为个人
        channelTypeList: [],
        channelName: '', // 公司名称
        contactAddr: '',
        busicityList: [], // 对方联系地址
        detailedAddress: '', // 详细地址
        magnitudeName: '', // 量级
        channelCard: '', // 身份证号
        channelTypeName: '',
        busicityListData: []//
      },
      // 联系人列表
      contractList: {
        // 联系人表头
        contractHeader: [{
          title: '联系人',
          key: 'contactsName',
          align: 'center'
        }, {
          title: '联系电话',
          key: 'telephone',
          align: 'center'
        }, {
          title: 'QQ',
          key: 'qq',
          align: 'center'
        }, {
          title: '微信',
          key: 'wechat',
          align: 'center'
        }, {
          title: '邮箱',
          key: 'email',
          align: 'center'
        }, {
          title: '公司职位',
          key: 'contactsPosition',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
        ],
        contractData: [] // 联系人数据
      },
      invoice: {
        openInvioceModal: false, // 开票信息详情弹窗开关
        // 表头
        invoicetHeader: [{
          title: '开户名',
          key: 'accountName',
          align: 'center'
        },
        {
          title: '开户行',
          key: 'openingBank',
          align: 'center'
        },
        {
          title: '开户行账号',
          key: 'openingBankCard',
          align: 'center'
        },
        {
          title: '纳税人识别号',
          key: 'taxpayerCard',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
        ],
        // 新增发票人数据
        invoiceData: []
      },
      invoiceModal: {
        accountName: '', // 开户名
        taxpayerCard: '', // 纳税人识别号
        openingBankCard: '', // 开户行账号
        openingBank: '', // 开户行
        billingAddress: '', // 开票地址
        telephone: '' // 开票电话
      },
      // 标签
      mainBusi: {
        busiTimes: [{
          oneLabel: '', // 一类标签
          twoLabel: '', // 二类标签
          twoLabelName: '', // 二类标签name
          oneLabelName: ''// 一类标签name
        }],
        reverseLabel: [{
          oneLabel: '', // 一级标签
          twoLabel: '', // 二级标签
          twoLabelName: '', // 二类标签name
          oneLabelName: ''// 一类标签name
        }],
        // 标签
        getFirstTag: [], // 一类标签数组 他的modal值是 oneLabel
        getSecondTag: [], // 二类标签数组 他的modal值是 twoLabel
        typeImp: [], // 选中的侧重标签
        emphasisTagList: [], // 侧重标签列表数据
        oneLabel: '',
        twoLabel: '',
        text: '', // 备注
        copier: [], // 抄送人id
        copierName: [] // 抄送人姓名 用于显示
      }
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
    // 获取已合作信息的详情
    getIsCooperDetail (row) {
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
          this.isCoopera.backgroundTypeName = res.data.content.backgroundTypeName
          this.isCoopera.cycle = res.data.content.cycle
          this.isCoopera.linksName = res.data.content.linksName
          this.isCoopera.password = res.data.content.password
          this.isCoopera.oldCode = res.data.content.oldCode
          this.isCoopera.purchasePrice = res.data.content.purchasePrice
          this.isCoopera.settlement = res.data.content.settlement
          this.isCoopera.username = res.data.content.username
          this.isCoopera.settlementName = res.data.content.settlementName
          this.isCoopera.enclavesName = res.data.content.enclavesName
          this.isCoopera.percentage = res.data.content.percentage
          this.isCoopera.sendpricetrue = res.data.content.sendpricetrue
          this.isCoopera.proposalRetain = res.data.content.proposalRetain
          this.isCoopera.retain = res.data.content.retain
          this.isCoopera.purpricetrue = res.data.content.purpricetrue
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 推荐信息启用
    startUse (row) {
      this.recommendModel = true
      this.oldCode = ''
      this.recommend.getDetailData = false
      // this.recommend.type = 2
      this.$axios({
        url: baseUrl + '/Commodity/getLinkbyCC',
        method: 'post',
        data: $qs.stringify({ id: row.id })
      }).then(res => {
        if (res.data.code === 10000) {
          this.recommendModelData = res.data.content.pageContent
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 点击推荐信息弹窗的表格数据获取详细信息
    getChannelData (data) {
      this.recommend.notUpto = false
      this.recommend.currLinkId = data.id
      this.$axios({
        url: baseUrl + '/Commodity/getLinkById',
        method: 'post',
        data: $qs.stringify({ id: data.id })
      }).then(res => {
        if (res.data.code === 10000) {
          this.recommend.purpricetrue = '0'
          this.recommend.getDetailData = true
          this.recommend.linksName = res.data.content.linksName
          this.recommend.productLinks = res.data.content.productLinks
          this.recommend.card = res.data.content.card
          this.recommend.cycleName = res.data.content.cycleName
          this.recommend.enclavesName = res.data.content.enclavesName
          this.recommend.linksName = res.data.content.linksName
          this.recommend.percentage = res.data.content.percentage
          this.recommend.purchasePrice = res.data.content.purchasePrice
          this.recommend.sendpricetrue = '0'
          this.recommend.proposalRetain = '0'
          this.recommend.retain = '0'
          //   this.recommend.retain = res.data.content.retain
          this.recommend.settlementName = res.data.content.settlementName
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 启用弹窗确定按钮
    startUseSure () {
      let flag = this.recommend.purpricetrue !== '' || this.recommend.sendpricetrue !== '' || this.recommend.proposalRetain !== ''
      if (this.recommend.twoEntryId !== '' && this.recommend.type !== '' && flag) {
        let sendData = {
          route: 'waitSureProductLink',
          channelName: this.companyInfo.channelName,
          twoEntryId: this.recommend.twoEntryId,
          oldCode: this.recommend.oldCode,
          purpricetrue: this.recommend.purpricetrue,
          sendpricetrue: this.recommend.sendpricetrue,
          proposalRetain: this.recommend.proposalRetain,
          retain: this.recommend.retain,
          type: this.recommend.type,
          purchasePrice: this.recommend.purchasePrice,
          percentage: this.recommend.percentage,
          channelId: this.$route.query.productChannelId,
          settlementName: this.recommend.settlementName,
          id: this.recommend.currLinkId
        }
        this.$axios({
          url: baseUrl + '/recommend/determine',
          method: 'post',
          data: $qs.stringify(sendData)
        }).then(res => {
          if (res.data.code === 10000) {
            this.recommendModel = false
            this.$Message.info(res.data.msg)
            this.getData()
          } else if (res.data.code === 10102) {
            this.recommendModel = false
            this.recommend.notUpto = true// 显示未达标的字
            this.recommend.approveNoticeModal = true
            this.recommend.channename = res.data.content.channename
            this.recommend.linkname = res.data.content.linkname
            this.recommend.productLinks = res.data.content.productLinks
            this.recommend.profitPurchase = res.data.content.profitPurchase
            this.recommend.profitProportion = res.data.content.profitProportion
          } else if (res.data.code === 10104) {
            this.recommendModel = false
            this.$Message.error(res.data.msg)
          } else {
            this.recommendModel = false
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
    noticeSure () {
      this.recommend.approveModal = true
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
          channelId: this.$route.query.productChannelId,
          settlementName: this.recommend.settlementName,
          id: this.recommend.currLinkId,
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
            this.recommend.approveModal = false
            this.$Message.info(res.data.msg)
            this.getData()
          } else {
            this.recommend.approveModal = false
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
    // 获取回显数据
    getData () {
      // 获取省市区
      this.$axios({
        url: baseUrl + '/Auditing/Busicity',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.companyInfo.busicityListData = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
      // 待合作信息回显
      this.$axios({
        url: baseUrl + '/Commodity/getcooperation',
        method: 'post',
        data: $qs.stringify({
          channelId: this.$route.query.productChannelId,
          currPage: this.isCoopera.currPage,
          pageSize: this.isCoopera.pageSize
        })
      }).then(res => {
        if (res.data.code === 10000) {
          this.isCooperateData = res.data.content.pageContent
          this.isCoopera.totalCount = res.data.content.totalCount
          this.isCoopera.pageSize = res.data.content.pageSize
          this.isCoopera.currPage = res.data.content.currPage
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
      // 推荐信息回显
      this.$axios({
        url: baseUrl + '/recommend/recommendText',
        method: 'post',
        data: $qs.stringify({
          tableType: 1,
          id: this.$route.query.productChannelId,
          currPage: this.recommend.currPage,
          pageSize: this.recommend.pageSize
        })
      }).then(res => {
        if (res.data.code === 10000) {
          this.recommendData = res.data.content.pageContent
          this.recommend.totalCount = res.data.content.totalCount
          this.recommend.pageSize = res.data.content.pageSize
          this.recommend.currPage = res.data.content.currPage
          this.recommend._disabled = res.data.content._disabled
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
      // 渠道公司详情
      let sendData = {
        productChannelId: this.$route.query.productChannelId
      }
      this.$axios({
        url: baseUrl + '/productChannel/channelinfo',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          if (res.data.content.length === 0) {
            this.addData = true
          }
          // 渠道信息
          let _c = this.companyInfo
          let _con = res.data.content
          let _p = res.data.content.productChannel
          _c.businessIdName = _p.businessIdName
          _c.channelType = _p.channelType
          _c.channelName = _p.channelName
          _c.contactAddr = _p.contactAddr
          _c.channelCard = _p.channelCard
          _c.busicityList = _p.busicityList
          _c.magnitudeName = _p.magnitudeName
          _c.detailedAddress = _p.detailedAddress
          _c.channelTypeName = _p.channelTypeName
          this.mainBusi.busiTimes = res.data.content.productChannel.busiTimes
          // if (_c.channelType === 1) {
          //   this.person = true
          // } else {
          //   this.person = false
          // }
          // 联系人列表
          this.contractList.contractData = _con.contacts
          // 发票信息
          this.invoice.invoiceData = _con.invoices
          // 标签
          this.mainBusi.reverseLabel = _p.reverseLabel
          // 编辑时若没有数据则手动添加一行
          if (this.mainBusi.busiTimes.length === 0) {
            this.mainBusi.busiTimes.push({
              oneLabel: '', // 一类标签
              twoLabel: '' // 二类标签
            })
          }
          if (this.mainBusi.reverseLabel.length === 0) {
            this.mainBusi.reverseLabel.push({
              oneLabel: '', // 一类标签
              twoLabel: '' // 二类标签
            })
          }
          // 侧重标签
          this.mainBusi.typeImp = _p.typeImps
          // 备注
          this.mainBusi.text = _p.text
          // 抄送人
          this.mainBusi.copierName = _p.copierName
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 展开关闭产品公司详情
    closeContent () {
      this.openProduct === true
        ? (this.openProduct = false)
        : (this.openProduct = true)
    },
    // 设置置顶
    setTop (row) {
      let sendData = {
        id: row.id
      }
      this.$axios({
        url: baseUrl + '/productChannel/Top',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.contractList.contractData = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 查看发票详情
    getInvoiceDetail (row) {
      this.invoice.openInvioceModal = true
      this.invoiceModal.accountName = row.accountName
      this.invoiceModal.taxpayerCard = row.taxpayerCard
      this.invoiceModal.openingBankCard = row.openingBankCard
      this.invoiceModal.openingBank = row.openingBank
      this.invoiceModal.billingAddress = row.billingAddress
      this.invoiceModal.telephone = row.telephone
    }
  }
}
</script>
<style lang="less">
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
#invoiceMoal {
    .rowPadding {
        padding: 20px;
    }

    .title {
        text-align: right;
    }
}
#toApprove{
    .ivu-input:hover {
        border-color: #19aa8d;
    }
    .ivu-btn:hover {
        color: #19aa8d;
        background-color: #fff;
        border-color: #19aa8d;
    }
    .ivu-select-selection-focused, .ivu-select-selection:hover {
        border-color: #19aa8d;
    }
    .ivu-input:focus {
        border-color: #19a88d;
        outline: 0;
        box-shadow:none;
    }
}
#addNotice{
    .ivu-modal{
        width: 720px !important;
    }
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
}

#hideAll input{
    color:#515a6e;
    border: none;
    background: white;
    font-size: 14px;
    margin-top: -2px;
    cursor: auto;
}
#hideAll i{
    display: none
}
#hideAll .ivu-select-dropdown{
    display: none
}
</style>
<style lang="less" scoped>
.content{
    margin-top: 7px;
}
.productCompany {
    font-size: 14px;

    .detailContent {
        margin-top: 30px;

        .content {
            margin-top: 6px;
        }
    }
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
.top{
    margin-top:5px;
}

.rowPadding {
    margin-bottom: 20px;
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
