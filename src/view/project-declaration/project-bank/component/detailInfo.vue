<template>
  <div>
    <!-- 基本信息 标题 -->
    <Row class="rowPaddingBig">
      <Col span="4" class="title">基本信息</Col>
      <Col
        span="1"
        offset="19"
        @click.native="showInfo()"
        style="cursor:pointer;"
        v-if="showInfoBtn"
      >收起</Col>
      <Col span="1" offset="19" @click.native="showInfo()" style="cursor:pointer;" v-else>展开</Col>
    </Row>
    <!-- 基本信息 DOM -->
    <div class="projectBaseInfo" v-show="showBasicInformation">
      <Row class="rowPadding">
        <Col class="explain" span="4" offset>项目名称：</Col>
        <Col span="5" class="projectInfo">
          {{projectBaseInfo.projectName || '暂无'}}
        </Col>
        <Col class="explain" span="4" offset="4">截止时间：</Col>
        <Col span="5" class="projectInfo">
          {{projectBaseInfo.deadline || '暂无'}}
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col class="explain" span="4" offset>申报级别：</Col>
        <Col span="5" class="projectInfo">
          {{projectBaseInfo.declareLevel || '暂无'}}
        </Col>
        <Col class="explain" span="4" offset="4">联系人：</Col>
        <Col span="5" class="projectInfo">
          {{projectBaseInfo.contacts || '暂无'}}
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="4" offset="0" class="explain">归口部门：</Col>
        <Col span="5" class="projectInfo">
          {{projectBaseInfo.fromDepartment || '暂无'}}
        </Col>
        <Col class="explain" span="4" offset="4">联系方式：</Col>
        <Col span="5" class="projectInfo">
          {{projectBaseInfo.contactInfo || '暂无'}}
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="4" class="explain">年审：</Col>
        <Col span="5" class="projectInfo">
          {{projectBaseInfo.examined || '暂无'}}
        </Col>
        <Col class="explain" span="4" offset="4">加急：</Col>
        <Col span="5" class="projectInfo">
          {{projectBaseInfo.urgent || '暂无'}}
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="4" class="explain">可兑现：</Col>
        <Col span="5" class="projectInfo">
          {{projectBaseInfo.redeemable || '暂无'}}

        </Col>
        <Col class="explain" span="4" offset="4">往年申报时间：</Col>
        <Col span="5" class="projectInfo">
          {{projectBaseInfo.pastTime || '暂无'}}
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="4" class="explain">存在奖补：</Col>
        <Col span="5" class="projectInfo">
          {{projectBaseInfo.existenceAward || '暂无'}}
        </Col>
        <Col class="explain" span="4" offset="4">奖补单位：</Col>
        <Col span="5" class="projectInfo">
          {{projectBaseInfo.awardUnit || '暂无'}}
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="12">
          <div v-for="(item,index) in projectBaseInfo.awardMoneys" :key="index">
            <Col span="8" class="explain">第{{index+1}}次奖补金额：</Col>
            <Col span="10" class="projectInfo">
              {{item.awardMoney || '暂无'}} <span v-if="item.awardMoney !== '暂无'">万元</span>
            </Col>
          </div>
        </Col>
        <Col span="12">
          <Col class="explain" span="6" offset="4" style="padding-right:5px;">跟进人：</Col>
          <Col span="12" class="projectInfo">
            {{projectBaseInfo.followPerson || '暂无'}}
          </Col>
        </Col>
      </Row>

    </div>
    <!-- 项目条件 标题 -->
    <Row class="rowPaddingBig">
      <Col span="4" class="title">项目条件</Col>
      <Col
        span="1"
        offset="19"
        @click.native="showProject()"
        style="cursor:pointer;"
        v-if="showProjectBtn"
      >收起</Col>
      <Col span="1" offset="19" @click.native="showProject()" style="cursor:pointer;" v-else>展开</Col>
    </Row>
    <!-- 项目条件 DOM -->
    <div class="projectCondition" v-show="showProjectInfo">
      <!-- 公司性质 DOM -->
      <Row>
        <Col span="4" class="secondTitle">公司性质</Col>
      </Row>
      <Row class="rowPadding">
        <Col span="4" class="explain">成立年限：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.establishYears || '暂无'}} <span v-if="projectCondition.establishYears">年</span>
        </Col>
        <Col span="4" offset="4" class="explain">公司所在区域：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.companyArea || '暂无'}}
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="4" class="explain">注册资本：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.registeredCapital || '暂无'}} <span v-if="projectCondition.registeredCapital">万元</span>
        </Col>
        <Col span="4" offset="4" class="explain">规模以上：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.scale || '暂无'}}
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="4" class="explain">区域面积：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.area || '暂无'}} <span v-if="projectCondition.area">平方米</span>
        </Col>
        <Col span="4" offset="4" class="explain">行业：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.trade || '暂无'}}
        </Col>
      </Row>
      <!-- 公司人员配置 DOM -->
      <Row>
        <Col span="4" class="secondTitle">公司人员配置</Col>
      </Row>
      <Row class="rowPadding">
        <Col span="4" class="explain">人员类型：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.personnelType || '暂无'}}
        </Col>
        <Col span="4" offset="4" class="explain">占比率：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.percentage || '暂无'}}
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="4" class="explain">社保人数：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.socialSecurityNumber || '暂无'}}
        </Col>
      </Row>
      <!-- 公司软实力 DOM -->
      <Row>
        <Col span="4" class="secondTitle">公司软实力</Col>
      </Row>
      <Row class="rowPadding">
        <Col span="4" class="explain">资质：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.qualifications || '暂无'}}
        </Col>
        <Col span="4" offset="4" class="explain">知识产权类型：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.knowledgeType || '暂无'}}
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="4" class="explain">数量：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.number || '暂无'}}
        </Col>
        <Col span="4" offset="4" class="explain">产学研合作：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.partnership || '暂无'}}
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="4" class="explain">域名注册证：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.domainName || '暂无'}}
        </Col>
        <Col span="4" offset="4" class="explain">网络优化许可证：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.networkCultureLicense || '暂无'}}
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="4" class="explain">中小企业名录库：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.enterpriseDirectory || '暂无'}}
        </Col>
        <Col span="4" offset="4" class="explain">ICP：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.icp || '暂无'}}
        </Col>
      </Row>
      <Row class="rowPadding">
        <!-- 查新报告上传 -->
        <Col span="4" class="explain">查新报告：</Col>
        <Col span="5" class="">
          <ul v-if="attachmentDTO.noveltySearchReport.length">
            <li
                v-for="(item,index) in attachmentDTO.noveltySearchReport"
                :key="index"
                class="enclosuresList"
                >
                <Tooltip placement="top">
                    <a :href="item.attachmentUrl" :download="item.attachmentName" style="width: 192px">{{item.attachmentName}}</a>
                    <div slot="content" style="width: 220px; white-space:normal; word-break:break-all; word-wrap: break-word;">
                        {{item.attachmentName}}
                    </div>
                </Tooltip>
            </li>
          </ul>
          <!-- <div v-if="attachmentDTO.noveltySearchReport.length" v-for="(item,index) in attachmentDTO.noveltySearchReport" :key="index">
            <span>
              <a :href="item.attachmentUrl" :download="item.attachmentName" class="file">{{item.attachmentName}}</a>
            </span>
          </div> -->
          <div v-if="!attachmentDTO.noveltySearchReport.length" class="projectInfo">暂无</div>
        </Col>
        <!-- 检查报告上传 -->
        <Col span="4" offset="4" class="explain">检测报告：</Col>
        <Col span="5">
          <ul v-if="attachmentDTO.testReport.length">
            <li
                v-for="(item,index) in attachmentDTO.testReport"
                :key="index"
                class="enclosuresList"
                >
                <Tooltip placement="top">
                    <a :href="item.attachmentUrl" :download="item.attachmentName" style="width: 192px">{{item.attachmentName}}</a>
                    <div slot="content" style="width: 220px; white-space:normal; word-break:break-all; word-wrap: break-word;">
                        {{item.attachmentName}}
                    </div>
                </Tooltip>
            </li>
          </ul>
          <!-- <div v-for="(item,index) in attachmentDTO.testReport" v-if="attachmentDTO.testReport.length" :key="index">
            <span>
              <a :href="item.attachmentUrl" :download="item.attachmentName" class="file">{{item.attachmentName}}</a>
            </span>
          </div> -->
          <div v-if="!attachmentDTO.testReport.length" class="projectInfo">暂无</div>
        </Col>
      </Row>
      <Row class="rowPadding" style="margin-bottom:2%;">
        <Col span="4" class="explain">新产品：</Col>
        <Col span="5">
          <ul v-if="attachmentDTO.newProject.length">
            <li
                v-for="(item,index) in attachmentDTO.newProject"
                :key="index"
                class="enclosuresList"
                >
                <Tooltip placement="top">
                    <a :href="item.attachmentUrl" :download="item.attachmentName" style="width: 192px">{{item.attachmentName}}</a>
                    <div slot="content" style="width: 220px; white-space:normal; word-break:break-all; word-wrap: break-word;">
                        {{item.attachmentName}}
                    </div>
                </Tooltip>
            </li>
          </ul>
          <!-- <div v-for="(item,index) in attachmentDTO.newProject"  v-if="attachmentDTO.newProject.length" :key="index">
            <span>
              <a :href="item.attachmentUrl" :download="item.attachmentName" class="file">{{item.attachmentName}}</a>
            </span>
          </div> -->
          <div v-if="!attachmentDTO.newProject.length" class="projectInfo">暂无</div>
        </Col>
        <Col span="4" offset="4" class="explain">证明材料：</Col>
        <Col span="5">
          <ul v-if="attachmentDTO.proofMaterial.length">
            <li
                v-for="(item,index) in attachmentDTO.proofMaterial"
                :key="index"
                class="enclosuresList"
                >
                <Tooltip placement="top">
                    <a :href="item.attachmentUrl" :download="item.attachmentName" style="width: 192px">{{item.attachmentName}}</a>
                    <div slot="content" style="width: 220px; white-space:normal; word-break:break-all; word-wrap: break-word;">
                        {{item.attachmentName}}
                    </div>
                </Tooltip>
            </li>
          </ul>
          <!-- <div v-for="(item,index) in attachmentDTO.proofMaterial" v-if="attachmentDTO.proofMaterial.length" :key="index">
            <span>
              <a :href="item.attachmentUrl" :download="item.attachmentName" class="file">{{item.attachmentName}}</a>
            </span>
          </div> -->
          <div v-if="!attachmentDTO.proofMaterial.length" class="projectInfo">暂无</div>
        </Col>
      </Row>
      <Row style="margin-top:1%;" v-for="(item,index) in projectCondition.honors" :key="index">
        <Col span="4" class="explain">荣誉：</Col>
        <Col span="5" class="projectInfo">
          {{item.honor || '暂无'}}
        </Col>
      </Row>
      <!-- 公司财务 DOM -->
      <Row style="margin-top:2%;">
        <Col span="4" class="secondTitle">公司财务</Col>
      </Row>
      <Row class="rowPadding">
        <Col span="4" class="explain">完税证明：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.dutyPaidCertificate || '暂无'}}
        </Col>
        <Col span="4" offset="4" class="explain">纳税申报表：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.taxReturn || '暂无'}}
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="4" class="explain">审计报告：</Col>
        <Col span="5" >
          <ul v-if="attachmentDTO.auditReport.length">
            <li
                v-for="(item,index) in attachmentDTO.auditReport"
                :key="index"
                class="enclosuresList"
                >
                <Tooltip placement="top">
                    <a :href="item.attachmentUrl" :download="item.attachmentName" style="width: 192px">{{item.attachmentName}}</a>
                    <div slot="content" style="width: 220px; white-space:normal; word-break:break-all; word-wrap: break-word;">
                        {{item.attachmentName}}
                    </div>
                </Tooltip>
            </li>
          </ul>
          <!-- <div v-for="(item,index) in attachmentDTO.auditReport" v-if="attachmentDTO.auditReport.length" :key="index">
            <span>
              <a :href="item.attachmentUrl" :download="item.attachmentName" class="file">{{item.attachmentName}}</a>
            </span>
          </div> -->
          <div v-if="!attachmentDTO.auditReport.length" class="projectInfo">暂无</div>
        </Col>
        <Col span="4" offset="4" class="explain">营业收入：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.businessIncome || '暂无'}}  <span v-if="projectCondition.businessIncome">万元</span>
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="4" class="explain">利润总额：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.totalProfit || '暂无'}} <span v-if="projectCondition.totalProfit">万元</span>
        </Col>
        <Col span="4" offset="4" class="explain">资产总额：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.totalAssets || '暂无'}} <span v-if="projectCondition.totalAssets">万元</span>
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="4" class="explain">进项票(技术服务费)：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.entryTicket || '暂无'}} <span v-if="projectCondition.entryTicket">万元</span>
        </Col>
        <Col span="4" offset="4" class="explain">研发费用占比：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.costRatio || '暂无'}} <span v-if="projectCondition.costRatio">%</span>
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="4" class="explain">纳税总额：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.totalTaxPayment || '暂无'}} <span v-if="projectCondition.totalTaxPayment">万元</span>
        </Col>
        <Col span="4" offset="4" class="explain">研发设备原值：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.equipmentValue || '暂无'}} <span v-if="projectCondition.equipmentValue">万元</span>
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="4" class="explain">资产负债率：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.assetLiabilityRatio || '暂无'}} <span v-if="projectCondition.assetLiabilityRatio">%</span>
        </Col>
        <Col span="4" offset="4" class="explain">增长年数：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.assetGrowthYear || '暂无'}} <span v-if="projectCondition.assetGrowthYear">年</span>
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="4" class="explain">利润负债率：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.profitLiabilityRatio || '暂无'}} <span v-if="projectCondition.profitLiabilityRatio">%</span>
        </Col>
        <Col span="4" offset="4" class="explain">增长年数：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.profitGrowthYear || '暂无'}} <span v-if="projectCondition.profitGrowthYear">年</span>
        </Col>
      </Row>
    </div>
    <!-- 申报条件 标题 -->
    <Row class="rowPaddingBig">
      <Col span="4" class="title">申报条件</Col>
      <Col
        span="1"
        offset="19"
        @click.native="showDeclare()"
        style="cursor:pointer;"
        v-if="showDeclaretBtn"
      >收起</Col>
      <Col span="1" offset="19" @click.native="showDeclare()" style="cursor:pointer;" v-else>展开</Col>
    </Row>
    <!-- 申报条件 DOM -->
    <div class="Declaret" v-show="showDeclaret">
      <Row class="rowPadding">
        <Col span="4" class="explain">申报材料：</Col>
        <Col span="5" >
          <ul v-if="attachmentDTO.applicationMaterials.length">
            <li
                v-for="(item,index) in attachmentDTO.applicationMaterials"
                :key="index"
                class="enclosuresList"
                >
                <Tooltip placement="top">
                    <a :href="item.attachmentUrl" :download="item.attachmentName" style="width: 192px">{{item.attachmentName}}</a>
                    <div slot="content" style="width: 220px; white-space:normal; word-break:break-all; word-wrap: break-word;">
                        {{item.attachmentName}}
                    </div>
                </Tooltip>
            </li>
          </ul>
          <!-- <div v-for="(item,index) in attachmentDTO.applicationMaterials" v-if="attachmentDTO.applicationMaterials.length" :key="index">
            <span>
              <a :href="item.attachmentUrl" :download="item.attachmentName" class="file">{{item.attachmentName}}</a>
            </span>
          </div> -->
          <div v-if="!attachmentDTO.applicationMaterials.length" class="projectInfo">暂无</div>
        </Col>
        <Col span="4" offset="4" class="explain">待审核：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.successfulDeclaration || '暂无'}}
        </Col>
      </Row>
      <Row class="rowPadding">
        <Col span="4" class="explain">申报成功：</Col>
        <Col span="5" class="projectInfo">
          {{projectCondition.successfulDeclaration || '暂无'}}
        </Col>
      </Row>
    </div>
    <!-- 回款信息模块 -->
    <div v-show="isReturnMoney">
      <!-- 回款信息 标题 -->
      <Row class="rowPaddingBig">
        <Col span="4" class="title">回款信息</Col>
        <Col
          span="1"
          offset="19"
          @click.native="showReturnMoney()"
          style="cursor:pointer;"
          v-if="showReturnMoneyBtn"
        >收起</Col>
        <Col
          span="1"
          offset="19"
          @click.native="showReturnMoney()"
          style="cursor:pointer;"
          v-else
        >展开</Col>
      </Row>
      <!-- 回款信息 DOM -->
      <div class="showReturnMoneyInfo" v-show="showReturnMoneyInfo">
        <Row class="rowPadding">
          <Col span="4" class="explain">应收金额：</Col>
          <Col span="5" class="projectInfo">
            {{projectCondition.amountReceivable || '暂无'}} <span v-if="projectCondition.amountReceivable">万元</span>
          </Col>
          <Col span="4" offset="4" class="explain">待兑现审核：</Col>
          <Col span="5" class="projectInfo">
            {{projectCondition.amountReceived || '暂无'}} <span v-if="projectCondition.amountReceived">万元</span>
          </Col>
        </Row>
        <Row class="rowPadding">
          <Col span="4" class="explain">沟通记录：</Col>
          <Col span="5" class="projectInfo">
            <ul v-if="attachmentDTO.communicationRecord.length">
              <li
                  v-for="(item,index) in attachmentDTO.communicationRecord"
                  :key="index"
                  class="enclosuresList"
                  >
                  <Tooltip placement="top">
                      <a :href="item.attachmentUrl" :download="item.attachmentName" style="width: 192px">{{item.attachmentName}}</a>
                      <div slot="content" style="width: 220px; white-space:normal; word-break:break-all; word-wrap: break-word;">
                          {{item.attachmentName}}
                      </div>
                  </Tooltip>
              </li>
            </ul>
            <!-- <div v-for="(item,index) in attachmentDTO.communicationRecord" v-if="attachmentDTO.communicationRecord.length" :key="index">
              <span>
                <a :href="item.attachmentUrl" :download="item.attachmentName" class="file">{{item.attachmentName}}</a>
              </span>
            </div> -->
            <div v-if="!attachmentDTO.communicationRecord.length">暂无</div>
          </Col>
          <Col span="4" offset="4" class="explain">已收金额：</Col>
          <Col span="5" class="projectInfo">
            {{projectCondition.pendingReview || '暂无'}} <span v-if="projectCondition.amountReceived">万元</span>
          </Col>
        </Row>
      </div>
    </div>
    <!-- <Card style="position: fixed; bottom: 0; left: 40%">
      <Button @click="goBack">返回</Button>
    </Card> -->
  </div>
</template>

<script>
import { staticUrl, prUrl } from '@/api/base.js'
export default {
  name: '',
  data () {
    return {
      staticUrl,
      showInfoBtn: true, // 基本信息展开按钮状态
      showProjectBtn: true, // 项目条件展开按钮状态
      showDeclaretBtn: true, // 申报条件展开按钮状态
      showReturnMoneyBtn: true, // 回款信息展开按钮状态
      showBasicInformation: true, // 基本信息展示
      showProjectInfo: true, // 项目条件展示
      showDeclaret: true, // 申报条件展示
      showReturnMoneyInfo: true, // 回款信息展示
      isReturnMoney: false, // 根据可兑现展示回款信息
      showModel: false, // 显示转换弹窗
      showAttBtn: false, // 展示附件判断的按钮
      addProjectName: '', // 转换项目的项目名称
      addProjectFile: [], // 转换项目的上传文件
      attBtnTypeY: {// 附件判断的正确按钮状态类型
        findBtn: 'default',
        testBtn: 'default',
        newProjectBtn: 'default',
        proofMaterialBtn: 'default',
        auditReportBtn: 'default',
        applicationMaterialsBtn: 'default',
        communicationRecordBtn: 'default'
      },
      attBtnTypeN: { // 附件判断的错误按钮状态类型
        findBtn: 'default',
        testBtn: 'default',
        newProjectBtn: 'default',
        proofMaterialBtn: 'default',
        auditReportBtn: 'default',
        applicationMaterialsBtn: 'default',
        communicationRecordBtn: 'default'
      },
      attachmentState: { // 所有附件判断的状态
        noveltySearchReportState: false,
        testReportState: false,
        newProjectState: false,
        proofMaterialState: false,
        auditReportState: false,
        applicationMaterialsState: false,
        communicationRecordState: false
      },
      projectBaseInfo: {
        // 基本信息
        projectName: '', // 项目名称
        deadline: '', // 截止时间
        contacts: '', // 联系人
        declareLevel: '', // 申报级别
        fromDepartment: '', // 归口部门
        contactInfo: '', // 联系方式
        examined: '', // 年审
        urgent: '', // 加急
        redeemable: '是', // 可兑现
        pastTime: '', // 往年申报时间
        existenceAward: '', // 存在奖补
        awardUnit: '', // 奖补单位
        awardMoneys: [], // 奖补金额
        followPerson: '' // 跟进人
      },
      projectCondition: {
        // 项目条件
        establishYears: '', // 成立年限
        companyArea: '', // 公司所在区域
        registeredCapital: '', // 注册资本
        scale: '', // 规模以上
        area: '', // 区域面积
        personnelType: '', // 人员类型
        percentage: '', // 占比率
        socialSecurityNumber: '', // 社保人数
        qualifications: '', // 资质
        knowledgeType: '', // 知识产权类型
        number: '', // 数量
        partnership: '', // 产学研合作
        domainName: '', // 域名注册证
        networkCultureLicense: '', // 网络优化许可证
        honors: [], // 荣誉
        dutyPaidCertificate: '', // 完税证明
        taxReturn: '', // 纳税申报表
        businessIncome: '', // 营业营收
        totalProfit: '', // 利润总额
        totalAssets: '', // 资产总额
        entryTicket: '', // 进项票
        costRatio: '', // 研发费用占比
        totalTaxPayment: '', // 纳税总额
        equipmentValue: '', // 研发设备原值
        assetLiabilityRatio: '', // 资产负债率
        assetGrowthYear: '', // 资产负债率的增长年数
        profitLiabilityRatio: '', // 利润负债率
        profitGrowthYear: '', // 利润总负债率的增长年数
        successfulDeclaration: '', // 申报条件的申报成功
        amountReceivable: '', // 回款信息的应收金额
        amountReceived: '' // 回款信息的已收金额
      },
      attachmentDTO: {
        noveltySearchReport: [], // 查新报告
        testReport: [], // 检测报告
        newProject: [], // 新产品
        proofMaterial: [], // 证明材料
        auditReport: [], // 审计报告
        applicationMaterials: [], // 申报材料
        communicationRecord: [] // 沟通记录
      },
      declareLevelList: [
        { id: 1, label: '区级' },
        { id: 2, label: '市级' },
        { id: 3, label: '省级' },
        { id: 4, label: '国家级' }
      ],
      isOrNo: [
        // 是否下拉
        { id: 1, label: '是' },
        { id: 2, label: '否' }
      ],
      needOrNo: [
        // 需要不需要下拉
        { id: 1, label: '需要' },
        { id: 2, label: '不需要' }
      ],
      tradeList: [
        // 行业
        { id: 1, label: '制造业企业' },
        { id: 2, label: '计算机及通信' }
      ],
      personnelTypeList: [
        { id: 1, label: '中大专以上学历' },
        { id: 2, label: '中专及以上技术职称专业人员' }
      ],
      knowledgeTypeList: [
        // 知识产权类型
        { id: 1, label: '专利' },
        { id: 2, label: '软件专利' },
        { id: 3, label: '商标' },
        { id: 4, label: '其他' }
      ],
      icpList: [
        // ICP下拉
        { id: 1, label: 'ICP备案' },
        { id: 2, label: 'ICP许可证' },
        { id: 3, label: 'ICP经营许可证' }
      ]
    }
  },
  inject: ['app'],
  computed: {
    incumbencyTbUser () {
      // 在职人员
      return this.app.employees
    }
  },
  mounted () {
    this.getShowData()
    // this.addMoney()
    // this.addHonor()
  },
  methods: {
    getShowData () {
      let sendData = {
        id: Number(this.$route.query.id),
        passType: this.$route.query.passType,
        type: 1
      }
      this.$axios({
        url: prUrl + '/project/selectProject',
        method: 'post',
        data: sendData
      }).then(res => {
        if (res.data.code === 10000) {
          this.attachmentDTO = res.data.data.attachmentDTO
          this.projectBaseInfo = res.data.data.projectBaseInfo
          this.projectCondition = res.data.data.projectCondition
          if (this.projectBaseInfo.awardMoneys.length === 0) {
            this.addMoney() // 增加奖补金额
          }
          if (Array.isArray(this.projectCondition.honors) && this.projectCondition.honors.length === 0) {
            this.addHonor()
          }
          if (!(this.projectCondition.honors)) {
            this.projectCondition.honors = []
            this.addHonor()
          }
          this.isNegotiable()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 基本信息展开收起
    showInfo () {
      this.showBasicInformation = !this.showBasicInformation
      this.showInfoBtn = !this.showInfoBtn
    },
    // 项目条件展开收起
    showProject () {
      this.showProjectInfo = !this.showProjectInfo
      this.showProjectBtn = !this.showProjectBtn
    },
    // 申报条件展开收起
    showDeclare () {
      this.showDeclaret = !this.showDeclaret
      this.showDeclaretBtn = !this.showDeclaretBtn
    },
    // 回款信息展开收起
    showReturnMoney () {
      this.showReturnMoneyInfo = !this.showReturnMoneyInfo
      this.showReturnMoneyBtn = !this.showReturnMoneyBtn
    },
    // 增加奖补金额
    addMoney () {
      if (this.projectBaseInfo.awardMoneys.length === 0) {
        this.projectBaseInfo.awardMoneys = [{ awardMoney: '暂无' }]
      }
    },
    // 增加荣誉
    addHonor () {
      if (this.projectCondition.honors.length === 0) {
        this.projectCondition.honors = [{ honor: '暂无' }]
      }
    },
    // 根据可兑现展示回款信息模块
    isNegotiable () {
      if (this.projectBaseInfo.redeemable === '是') {
        this.isReturnMoney = true
      } else {
        this.isReturnMoney = false
      }
    },
    // 返回
    // goBack () {
    //   bus.$emit('on-myclose', this.$route)
    //   this.$router.push({
    //     name: 'projectBank'
    //   })
    // },
    // 获取路由传值
    getRouterData () {
      if (this.$route.query.typeof === 'one') {
        this.showAttBtn = false
      } else {
        this.showAttBtn = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.rowPaddingBig {
  background-color: #f6f6f6;
  height: 40px;
  line-height: 40px;
  margin: 1% 0;
}
.title {
  border-left: 2px solid #19aa8d;
  padding-left: 10px;
  font-size: 14px;
  font-weight: 900;
}
.rowPadding {
  padding: 2% 0;
}
.projectBaseInfo {
  margin-bottom: 2%;
}
.explain {
  font-size: 14px;
  line-height: 32px;
  text-align: right;
}
.par {
  position: relative;
}
.last {
  position: absolute;
  right: -42%;
  bottom: -68%;
  width: 100%;
  z-index: 10;
}
.projectCondition {
  .secondTitle {
    font-size: 16px;
    line-height: 32px;
    font-weight: 900;
    text-align: right;
    margin: 1% 0;
  }
}
.iconfont {
  text-align: center;
}
.icon {
  cursor: pointer;
  font-size: 25px;
  line-height: 32px;
}
.file {
  font-size: 14px;
  line-height: 32px;
}
.btns {
  text-align: center;
}
.projectInfo{
  font-size: 14px;
  line-height: 32px;
}
.enclosuresList {
    position: relative;
    display: block;
    padding: 4px 0;
    border-radius: 3px;
    &:hover {
        background: #f3f3f3;
    }
    a {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
    }
}
</style>
