<template>
  <div>
    <Form ref="projectBaseInfo" :model="projectBaseInfo">
      <!-- 基本信息 标题 -->
      <div class="rowPaddingBig">
        <Col span="4" class="title">基本信息</Col>
        <Col
          span="1"
          offset="19"
          @click.native="showInfo()"
          style="cursor:pointer;"
          v-if="showInfoBtn"
        >收起</Col>
        <Col span="1" offset="19" @click.native="showInfo()" style="cursor:pointer;" v-else>展开</Col>
      </div>
      <!-- 基本信息 DOM -->
      <div class="projectBaseInfo" v-show="showBasicInformation">
        <Row class="rowPadding">
          <Col class="explain" span="4" offset="0">项目名称：</Col>
          <Col span="5">
            <Tooltip max-width="400" :content="projectBaseInfo.projectName" placement="top" style="width: 100%;">
              <Input maxlength="100" v-model="projectBaseInfo.projectName" placeholder="请输入项目名称" :disabled="true"/>
            </Tooltip>
          </Col>
          <Col class="explain" span="4" offset="2">截止时间：</Col>
          <Col span="5">
            <FormItem :error="errors('deadline')" :show-message="false">
              <DatePicker
                v-model="projectBaseInfo.deadline"
                type="date"
                placeholder="请选择截至时间"
                :transfer="true"
                style="width:100%;"
                clearable
              ></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row class="rowPadding">
          <Col class="explain" span="4" offset>申报级别：</Col>
          <Col span="5">
            <FormItem  :error="errors('declareLevel')" :show-message="false">
              <Select v-model="projectBaseInfo.declareLevel" clearable>
                <Option
                  v-for="item in declareLevelList"
                  :value="item.label"
                  :key="item.id"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col class="explain" span="2" offset="4">联系人：</Col>
          <Col span="5">
            <FormItem :error="errors('contacts')" :show-message="false">
              <Input
                maxlength="50"
                show-word-limit
                :clearable="closeIcon.contacts"
                @mouseover.native="showClearable('contacts')"
                @mouseout.native="hiddenClearable('contacts')"
                v-model.trim="projectBaseInfo.contacts"
                placeholder="请输入联系人"
              />
            </FormItem>
          </Col>
        </Row>
        <Row class="rowPadding">
          <Col span="4" offset="0" class="explain">归口部门：</Col>
          <Col span="5">
            <FormItem  :error="errors('fromDepartment')" :show-message="false">
              <Input
                maxlength="100"
                show-word-limit
                :clearable="closeIcon.fromDepartment"
                @mouseover.native="showClearable('fromDepartment')"
                @mouseout.native="hiddenClearable('fromDepartment')"
                v-model.trim="projectBaseInfo.fromDepartment"
                placeholder="请输入归口部门"
              />
            </FormItem>
          </Col>
          <Col class="explain" span="2" offset="4">联系方式：</Col>
          <Col span="5">
            <FormItem  :error="errors('contactInfo')" :show-message="false">
              <Input
                maxlength="100"
                show-word-limit
                :clearable="closeIcon.contactInfo"
                @mouseover.native="showClearable('contactInfo')"
                @mouseout.native="hiddenClearable('contactInfo')"
                v-model.trim="projectBaseInfo.contactInfo"
                placeholder="请输入联系方式"
              />
            </FormItem>
          </Col>
        </Row>
        <Row class="rowPadding">
          <Col span="4" class="explain">年审：</Col>
          <Col span="5">
            <FormItem  :error="errors('examined')" :show-message="false">
              <Select v-model="projectBaseInfo.examined" clearable>
                <Option v-for="item in isOrNo" :value="item.label" :key="item.id">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col class="explain" span="2" offset="4">加急：</Col>
          <Col span="5">
            <FormItem :error="errors('urgent')" :show-message="false">
              <Select v-model="projectBaseInfo.urgent" clearable>
                <Option v-for="item in isOrNo" :value="item.label" :key="item.id">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row class="rowPadding">
          <Col span="4" class="explain">可兑现：</Col>
          <Col span="5">
            <FormItem  :error="errors('redeemable')" :show-message="false">
              <Select v-model="projectBaseInfo.redeemable" @on-change="isNegotiable" clearable>
                <Option v-for="item in isOrNo" :value="item.label" :key="item.id">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col class="explain" span="4" offset="2">往年申报时间：</Col>
          <Col span="5">
            <FormItem  :error="errors('pastTime')" :show-message="false">
              <DatePicker
                v-model="projectBaseInfo.pastTime"
                type="date"
                placeholder="请选择往年申报时间"
                :transfer="true"
                style="width:100%;"
                clearable
              ></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row class="rowPadding pre">
          <Col span="4" class="explain">存在奖补：</Col>
          <Col span="5">
            <FormItem  :error="errors('existenceAward')" :show-message="false">
              <Select v-model="projectBaseInfo.existenceAward" clearable>
                <Option v-for="item in isOrNo" :value="item.label" :key="item.id">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col class="explain" span="4" offset="2">奖补单位：</Col>
          <Col span="5">
            <FormItem  :error="errors('awardUnit')" :show-message="false">
              <Input
                maxlength="200"
                show-word-limit
                :clearable="closeIcon.awardUnit"
                @mouseover.native="showClearable('awardUnit')"
                @mouseout.native="hiddenClearable('awardUnit')"
                v-model.trim="projectBaseInfo.awardUnit"
                placeholder="请填写..."
              />
            </FormItem>
          </Col>
        </Row>
        <Row class="rowPadding">
          <Col span="12">
            <div v-for="(item,index) in projectBaseInfo.awardMoneys" :key="index">
              <Col span="8" class="explain">第{{index+1}}次奖补金额：</Col>
              <Col span="10"  style="margin-bottom: 26px">
                <FormItem
                  :prop="`awardMoneys[${index}].awardMoney`"
                  :error="errors('awardMoney')"
                  :rules="{ validator: validateNumber, trigger: 'change' }"
                >
                  <Input maxlength="100" v-model.trim="item.awardMoney" placeholder="请填写..." clearable>
                    <span slot="append">万元</span>
                  </Input>
                </FormItem>
              </Col>
              <Col span="4">
                <Button shape="circle" icon="md-add" @click="addMoney" style="margin:0px 5px 0px 5px"></Button>
                <Button
                  v-if="projectBaseInfo.awardMoneys.length>=2"
                  shape="circle"
                  icon="md-remove"
                  @click="removeMoney(index)"
                ></Button>
              </Col>
            </div>
          </Col>
          <Col span="12">
            <Col class="explain" span="6">跟进人：</Col>
              <Col span="10">
                <FormItem  :error="errors('followPersons')" :show-message="false">
                  <tree-select-vue
                    :class="errors('followPerson')==='不一致' ? 'treeSelect':''"
                    :options="options"
                    :value-consists-of="valueConsistsOf"
                    v-model="projectBaseInfo.followPersons"
                  >
                  </tree-select-vue>
                  <!-- <Select filterable v-model="projectBaseInfo.followPerson" style="width:100%;" clearable>
                    <Option
                      v-for="item in incumbencyTbUser"
                      :value="item.nickname"
                      :key="item.id"
                    >{{ item.nickname }}</Option>
                  </Select> -->
                </FormItem>
              </Col>
          </Col>
        </Row>
      </div>
    </Form>
    <Form ref="projectCondition" :model="projectCondition" :rules="conditionRule">
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
          <Col span="5">
            <FormItem prop="establishYears" :error="errors('establishYears')">
              <Input
                maxlength="100"
                clearable
                v-model.trim="projectCondition.establishYears"
                placeholder="请输入..."
              >
                <span slot="append">年</span>
              </Input>
            </FormItem>
            <span>
              <i class="iconfont icon-zhuanhuan"></i>
            </span>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
          <Col span="4" offset="1" class="explain">公司所在区域：</Col>
          <Col span="5">
            <FormItem  :error="errors('companyArea')" :show-message="false">
              <Input
                maxlength="200"
                show-word-limit
                :clearable="closeIcon.companyArea"
                @mouseover.native="showClearable('companyArea')"
                @mouseout.native="hiddenClearable('companyArea')"
                v-model.trim="projectCondition.companyArea"
                placeholder="请输入..."
              />
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
        </Row>
        <Row class="rowPadding">
          <Col span="4" class="explain">注册资本：</Col>
          <Col span="5">
            <FormItem prop="registeredCapital" :error="errors('registeredCapital')" :show-message="false">
              <Input :class="errors('registeredCapital')==='不一致'?'inputErr':''" maxlength="100" v-model.trim="projectCondition.registeredCapital" placeholder="请输入..." clearable>
                <span slot="append">万元</span>
              </Input>
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
          <Col span="4" offset="1" class="explain">规模以上：</Col>
          <Col span="5">
            <FormItem  :error="errors('scale')" :show-message="false">
              <Select v-model="projectCondition.scale" clearable>
                <Option v-for="item in needOrNo" :value="item.label" :key="item.id">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
        </Row>
        <Row class="rowPadding">
          <Col span="4" class="explain">区域面积：</Col>
          <Col span="5">
            <FormItem prop="area" :error="errors('area')" :show-message="false">
              <Input :class="errors('area')==='不一致'?'inputErr':''" maxlength="100" v-model.trim="projectCondition.area" placeholder="请输入..." clearable>
                <span slot="append">平方米</span>
              </Input>
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
          <Col span="4" offset="1" class="explain">行业：</Col>
          <Col span="5">
            <FormItem  :error="errors('trade')" :show-message="false">
              <Input
                maxlength="100"
                show-word-limit
                :clearable="closeIcon.trade"
                @mouseover.native="showClearable('trade')"
                @mouseout.native="hiddenClearable('trade')"
                v-model.trim="projectCondition.trade"
                placeholder="请输入..."
              />
              <!-- <Select v-model="projectCondition.trade" clearable>
                <Option v-for="item in tradeList" :value="item.label" :key="item.id">{{ item.label }}</Option>
              </Select> -->
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
        </Row>
        <!-- 公司人员配置 DOM -->
        <Row>
          <Col span="4" class="secondTitle">公司人员配置</Col>
        </Row>
        <Row class="rowPadding">
          <Col span="4" class="explain">人员类型：</Col>
          <Col span="5">
            <FormItem  :error="errors('personnelType')" :show-message="false">
              <Input
                maxlength="100"
                show-word-limit
                :clearable="closeIcon.personnelType"
                @mouseover.native="showClearable('personnelType')"
                @mouseout.native="hiddenClearable('personnelType')"
                v-model.trim="projectCondition.personnelType"
                placeholder="请输入..."
              />
              <!-- <Select v-model="projectCondition.personnelType" clearable>
                <Option
                  v-for="item in personnelTypeList"
                  :value="item.label"
                  :key="item.id"
                >{{ item.label }}</Option>
              </Select> -->
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
          <Col span="4" offset="1" class="explain">占比率：</Col>
          <Col span="5">
            <FormItem prop="percentage" :error="errors('percentage')" :show-message="false">
              <Input
                :class="errors('percentage')==='不一致'?'inputErr':''"
                maxlength="100"
                show-word-limit
                :clearable="closeIcon.percentage"
                @mouseover.native="showClearable('percentage')"
                @mouseout.native="hiddenClearable('percentage')"
                v-model.trim="projectCondition.percentage"
                placeholder="请输入..."
              />
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
        </Row>
        <Row class="rowPadding">
          <Col span="4" class="explain">社保人数：</Col>
          <Col span="5">
            <FormItem prop="socialSecurityNumber" :error="errors('socialSecurityNumber')" :show-message="false">
              <Input
                :class="errors('socialSecurityNumber')==='不一致'?'inputErr':''"
                maxlength="100"
                show-word-limit
                :clearable="closeIcon.socialSecurityNumber"
                @mouseover.native="showClearable('socialSecurityNumber')"
                @mouseout.native="hiddenClearable('socialSecurityNumber')"
                v-model.trim="projectCondition.socialSecurityNumber"
                placeholder="请输入..."
              />
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
        </Row>
        <!-- 公司软实力 DOM -->
        <Row>
          <Col span="4" class="secondTitle">公司软实力</Col>
        </Row>
        <Row class="rowPadding">
          <Col span="4" class="explain">资质：</Col>
          <Col span="5">
          <FormItem  :error="errors('qualifications')" :show-message="false">
            <Input
              maxlength="100"
              show-word-limit
              :clearable="closeIcon.qualifications"
              @mouseover.native="showClearable('qualifications')"
              @mouseout.native="hiddenClearable('qualifications')"
              v-model.trim="projectCondition.qualifications"
              placeholder="请输入..."
            />
          </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
          <Col span="4" offset="1" class="explain">知识产权类型：</Col>
          <Col span="5">
            <FormItem  :error="errors('knowledgeType')" :show-message="false">
              <Select v-model="projectCondition.knowledgeType" clearable>
                <Option
                  v-for="item in knowledgeTypeList"
                  :value="item.label"
                  :key="item.id"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
        </Row>
        <Row class="rowPadding">
          <Col span="4" class="explain">数量：</Col>
          <Col span="5">
            <FormItem prop="number" :error="errors('number')" :show-message="false">
              <Input
                :class="errors('number')==='不一致'?'inputErr':''"
                maxlength="100"
                show-word-limit
                :clearable="closeIcon.number"
                @mouseover.native="showClearable('number')"
                @mouseout.native="hiddenClearable('number')"
                v-model="projectCondition.number"
                placeholder="请输入..."
              />
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
          <Col span="4" offset="1" class="explain">产学研合作：</Col>
          <Col span="5">
            <FormItem  :error="errors('partnership')" :show-message="false">
              <Select v-model="projectCondition.partnership" clearable>
                <Option v-for="item in needOrNo" :value="item.label" :key="item.id">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
        </Row>
        <Row class="rowPadding">
          <Col span="4" class="explain">域名注册证：</Col>
          <Col span="5">
          <FormItem  :error="errors('domainName')" :show-message="false">
            <Select v-model="projectCondition.domainName" clearable>
              <Option v-for="item in needOrNo" :value="item.label" :key="item.id">{{ item.label }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
          <Col span="4" offset="1" class="explain">网络优化许可证：</Col>
          <Col span="5">
            <FormItem  :error="errors('networkCultureLicense')" :show-message="false">
              <Select v-model="projectCondition.networkCultureLicense" clearable>
                <Option v-for="item in needOrNo" :value="item.label" :key="item.id">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
        </Row>
        <Row class="rowPadding">
          <Col span="4" class="explain">中小企业名录库：</Col>
          <Col span="5">
          <FormItem  :error="errors('enterpriseDirectory')" :show-message="false">
            <Select v-model="projectCondition.enterpriseDirectory" clearable>
              <Option v-for="item in needOrNo" :value="item.label" :key="item.id">{{ item.label }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
          <Col span="4" offset="1" class="explain">ICP：</Col>
          <Col span="5">
          <FormItem  :error="errors('icp')" :show-message="false">
            <Select v-model="projectCondition.icp" clearable>
              <Option v-for="item in icpList" :value="item.label" :key="item.id">{{ item.label }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
        </Row>
        <!-- 附件上传，需求单独增加标红功能 -->
        <Row class="rowPadding">
          <!-- 查新报告上传 -->
          <Col span="4" class="explain">查新报告：</Col>
          <Col span="5">
            <Upload
              multiple
              class="bzUpload"
              :action="staticUrl+'index.php'"
              :max-size="20480"
              name="fileData"
              :show-upload-list="false"
              :on-success="(value)=> uploadSuccess(value,1)"
              :on-exceeded-size="(error)=>uploadError(error)"
            >
              <Button icon="ios-cloud-upload-outline" :disabled="showAttBtn">单个文件不能超过20M</Button>
            </Upload>
            <ul>
              <li
                  v-for="(item, index) in attachmentDTO.noveltySearchReport"
                  :key="index"
                  class="enclosuresList"
                  >
                  <Icon
                      v-if="type===1"
                      @click="deleteFile(index,1)"
                      class="close-icon"
                      type="ios-close-circle-outline"/>
                  <Tooltip placement="top">
                      <a :href="item.attachmentUrl" :download="item.attachmentName" style="width: 192px">{{item.attachmentName}}</a>
                      <div slot="content" style="width: 220px; white-space:normal; word-break:break-all; word-wrap: break-word;">
                          {{item.attachmentName}}
                      </div>
                  </Tooltip>
              </li>
            </ul>
            <!-- <div v-for="(item,index) in attachmentDTO.noveltySearchReport" :key="index">
              <Icon
                v-if="type===1"
                type="ios-close-circle-outline"
                class="deleteFile"
                @click="deleteFile(index,1)"
              />
              <span>
                <a :href="item.attachmentUrl" :download="item.attachmentName" class="file">{{item.attachmentName}}</a>
              </span>
            </div> -->
            <div v-if="showAttBtn && attachmentDTO.noveltySearchReport.length!==0 && this.passType==='未过白'"  style="margin-top:5%;">
              <Button :type="attBtnTypeY.findBtn" @click="ensure('findBtn','findBtn','noveltySearchReportState')">正确</Button>
              <Button :type="attBtnTypeN.findBtn" @click="misjudgement('findBtn','findBtn','noveltySearchReportState')">错误</Button>
            </div>
            <div style="color:red;font-size:14px;" v-if="projectBaseInfo.type === 1 && shwoAttrErrorInfo.noveltySearchReport">
              附件有误!
            </div>
          </Col>
          <!-- 检查报告上传 -->
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
          <Col span="4" offset="1" class="explain">检测报告：</Col>
          <Col span="5">
            <Upload
              multiple
              class="bzUpload"
              :action="staticUrl+'index.php'"
              :max-size="20480"
              name="fileData"
              :show-upload-list="false"
              :on-success="(value)=> uploadSuccess(value,2)"
              :on-exceeded-size="(error)=>uploadError(error)"
            >
              <Button icon="ios-cloud-upload-outline" :disabled="showAttBtn">单个文件不能超过20M</Button>
            </Upload>
            <ul>
              <li
                  v-for="(item, index) in attachmentDTO.testReport"
                  :key="index"
                  class="enclosuresList"
                  >
                  <Icon
                      v-if="type===1"
                      @click="deleteFile(index,2)"
                      class="close-icon"
                      type="ios-close-circle-outline"/>
                  <Tooltip placement="top">
                      <a :href="item.attachmentUrl" :download="item.attachmentName" style="width: 192px">{{item.attachmentName}}</a>
                      <div slot="content" style="width: 220px; white-space:normal; word-break:break-all; word-wrap: break-word;">
                          {{item.attachmentName}}
                      </div>
                  </Tooltip>
              </li>
            </ul>
            <!-- <div v-for="(item,index) in attachmentDTO.testReport" :key="index">
              <Icon
                v-if="type===1"
                type="ios-close-circle-outline"
                class="deleteFile"
                @click="deleteFile(index,2)"
              />
              <span>
                <a :href="item.attachmentUrl" :download="item.attachmentName" class="file">{{item.attachmentName}}</a>
              </span>
            </div> -->
            <div v-if="showAttBtn && attachmentDTO.testReport.length!==0 && this.passType==='未过白'" style="margin-top:5%;">
              <Button :type="attBtnTypeY.testBtn" @click="ensure('testBtn','testBtn','testReportState')">正确</Button>
              <Button :type="attBtnTypeN.testBtn" @click="misjudgement('testBtn','testBtn','testReportState')">错误</Button>
            </div>
            <div style="color:red;font-size:14px;" v-if="projectBaseInfo.type === 1 && shwoAttrErrorInfo.testReport">
              附件有误!
            </div>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
        </Row>
        <!-- 附件上传，需求单独增加标红功能 -->
        <Row class="rowPadding" style="margin-bottom:2%;">
          <Col span="4" class="explain">新产品：</Col>
          <Col span="5">
            <Upload
              multiple
              class="bzUpload"
              :action="staticUrl+'index.php'"
              :max-size="20480"
              name="fileData"
              :show-upload-list="false"
              :on-success="(value)=> uploadSuccess(value,3)"
              :on-exceeded-size="(error)=>uploadError(error)"
            >
              <Button icon="ios-cloud-upload-outline" :disabled="showAttBtn">单个文件不能超过20M</Button>
            </Upload>
            <ul>
              <li
                  v-for="(item, index) in attachmentDTO.newProject"
                  :key="index"
                  class="enclosuresList"
                  >
                  <Icon
                      v-if="type===1"
                      @click="deleteFile(index,3)"
                      class="close-icon"
                      type="ios-close-circle-outline"/>
                  <Tooltip placement="top">
                      <a :href="item.attachmentUrl" :download="item.attachmentName" style="width: 192px">{{item.attachmentName}}</a>
                      <div slot="content" style="width: 220px; white-space:normal; word-break:break-all; word-wrap: break-word;">
                          {{item.attachmentName}}
                      </div>
                  </Tooltip>
              </li>
            </ul>
            <!-- <div v-for="(item,index) in attachmentDTO.newProject" :key="index">
              <Icon
                v-if="type===1"
                type="ios-close-circle-outline"
                class="deleteFile"
                @click="deleteFile(index,3)"
              />
              <span>
                <a :href="item.attachmentUrl" :download="item.attachmentName" class="file">{{item.attachmentName}}</a>
              </span>
            </div> -->
            <div  v-if="showAttBtn && attachmentDTO.newProject.length!==0 && this.passType==='未过白'"  style="margin-top:5%;">
              <Button :type="attBtnTypeY.newProjectBtn" @click="ensure('newProjectBtn','newProjectBtn','newProjectState')">正确</Button>
              <Button :type="attBtnTypeN.newProjectBtn" @click="misjudgement('newProjectBtn','newProjectBtn','newProjectState')">错误</Button>
            </div>
            <div style="color:red;font-size:14px;" v-if="projectBaseInfo.type === 1 && shwoAttrErrorInfo.newProject">
              附件有误!
            </div>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
          <Col span="4" offset="1" class="explain">证明材料：</Col>
          <Col span="5">
            <Upload
              multiple
              class="bzUpload"
              :action="staticUrl+'index.php'"
              :max-size="20480"
              name="fileData"
              :show-upload-list="false"
              :on-success="(value)=> uploadSuccess(value,4)"
              :on-exceeded-size="(error)=>uploadError(error)"
            >
              <Button icon="ios-cloud-upload-outline" :disabled="showAttBtn">单个文件不能超过20M</Button>
            </Upload>
            <ul>
              <li
                  v-for="(item, index) in attachmentDTO.proofMaterial"
                  :key="index"
                  class="enclosuresList"
                  >
                  <Icon
                      v-if="type===1"
                      @click="deleteFile(index,4)"
                      class="close-icon"
                      type="ios-close-circle-outline"/>
                  <Tooltip placement="top">
                      <a :href="item.attachmentUrl" :download="item.attachmentName" style="width: 192px">{{item.attachmentName}}</a>
                      <div slot="content" style="width: 220px; white-space:normal; word-break:break-all; word-wrap: break-word;">
                          {{item.attachmentName}}
                      </div>
                  </Tooltip>
              </li>
            </ul>
            <!-- <div v-for="(item,index) in attachmentDTO.proofMaterial" :key="index">
              <Icon
                v-if="type===1"
                type="ios-close-circle-outline"
                class="deleteFile"
                @click="deleteFile(index,4)"
              />
              <span>
                <a :href="item.attachmentUrl" :download="item.attachmentName" class="file">{{item.attachmentName}}</a>
              </span>
            </div> -->
            <div v-if="showAttBtn && attachmentDTO.proofMaterial.length!==0 && this.passType==='未过白'" style="margin-top:5%;">
              <Button :type="attBtnTypeY.proofMaterialBtn" @click="ensure('proofMaterialBtn','proofMaterialBtn','proofMaterialState')">正确</Button>
              <Button :type="attBtnTypeN.proofMaterialBtn" @click="misjudgement('proofMaterialBtn','proofMaterialBtn','proofMaterialState')">错误</Button>
            </div>
            <div style="color:red;font-size:14px;" v-if="projectBaseInfo.type === 1 && shwoAttrErrorInfo.proofMaterial">
              附件有误!
            </div>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
        </Row>
        <Row style="margin-top:1%;" v-for="(item,index) in projectCondition.honors" :key="index">
          <Col span="4" class="explain">荣誉：</Col>
          <Col span="5">
            <FormItem  :error="errors('honor')" :show-message="false">
              <Input
                maxlength="100"
                show-word-limit
                v-model.trim="item.honor"
                placeholder="请输入..."
              />
            </FormItem>
          </Col>
          <Col span="2">
            <Button shape="circle" icon="md-add" @click="addHonor" style="margin:0px 0px 0px 5px"></Button>
            <Button
              v-if="projectCondition.honors.length>=2"
              shape="circle"
              icon="md-remove"
              @click="removeReturn(index)"
            ></Button>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
        </Row>
        <!-- 公司财务 DOM -->
        <Row style="margin-top:2%;">
          <Col span="4" class="secondTitle">公司财务</Col>
        </Row>
        <Row class="rowPadding">
          <Col span="4" class="explain">完税证明：</Col>
          <Col span="5">
            <FormItem  :error="errors('dutyPaidCertificate')" :show-message="false">
              <Select v-model="projectCondition.dutyPaidCertificate" clearable>
                <Option v-for="item in needOrNo" :value="item.label" :key="item.id">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
          <Col span="4" offset="1" class="explain">纳税申报表：</Col>
          <Col span="5">
            <FormItem  :error="errors('taxReturn')" :show-message="false">
              <Select v-model="projectCondition.taxReturn" clearable>
                <Option v-for="item in needOrNo" :value="item.label" :key="item.id">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
        </Row>
        <!-- 附件上传，需要单独增加标红功能 -->
        <Row class="rowPadding">
          <Col span="4" class="explain">审计报告：</Col>
          <Col span="5">
            <Upload
              multiple
              class="bzUpload"
              name="fileData"
              :show-upload-list="false"
              :action="staticUrl+'index.php'"
              :max-size="20480"
              :on-success="(value)=> uploadSuccess(value,5)"
              :on-exceeded-size="(error)=>uploadError(error)"
            >
              <Button icon="ios-cloud-upload-outline" :disabled="showAttBtn">单个文件不能超过20M</Button>
            </Upload>
            <ul>
              <li
                  v-for="(item, index) in attachmentDTO.auditReport"
                  :key="index"
                  class="enclosuresList"
                  >
                  <Icon
                      v-if="type===1"
                      @click="deleteFile(index,5)"
                      class="close-icon"
                      type="ios-close-circle-outline"/>
                  <Tooltip placement="top">
                      <a :href="item.attachmentUrl" :download="item.attachmentName" style="width: 192px">{{item.attachmentName}}</a>
                      <div slot="content" style="width: 220px; white-space:normal; word-break:break-all; word-wrap: break-word;">
                          {{item.attachmentName}}
                      </div>
                  </Tooltip>
              </li>
            </ul>
            <!-- <div v-for="(item,index) in attachmentDTO.auditReport" :key="index">
              <Icon
                v-if="type===1"
                type="ios-close-circle-outline"
                class="deleteFile"
                @click="deleteFile(index,5)"
              />
              <span>
                <a :href="item.attachmentUrl" :download="item.attachmentName" class="file">{{item.attachmentName}}</a>
              </span>
            </div> -->
            <div v-if="showAttBtn && attachmentDTO.auditReport.length!==0 && this.passType==='未过白'" style="margin-top:5%;">
              <Button :type="attBtnTypeY.auditReportBtn" @click="ensure('auditReportBtn','auditReportBtn','auditReportState')">正确</Button>
              <Button :type="attBtnTypeN.auditReportBtn" @click="misjudgement('auditReportBtn','auditReportBtn','auditReportState')">错误</Button>
            </div>
            <div style="color:red;font-size:14px;" v-if="projectBaseInfo.type === 1 && shwoAttrErrorInfo.auditReport">
              附件有误!
            </div>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
          <Col span="4" offset="1" class="explain">营业收入：</Col>
          <Col span="5">
            <FormItem prop="businessIncome" :error="errors('businessIncome')" :show-message="false">
              <Input :class="errors('businessIncome')==='不一致'?'inputErr':''" maxlength="100" v-model.trim="projectCondition.businessIncome" placeholder="请输入..." clearable>
                <span slot="append">万元</span>
              </Input>
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
        </Row>
        <Row class="rowPadding">
          <Col span="4" class="explain">利润总额：</Col>
          <Col span="5">
            <FormItem prop="totalProfit" :error="errors('totalProfit')" :show-message="false">
              <Input :class="errors('totalProfit')==='不一致'?'inputErr':''" maxlength="100" v-model.trim="projectCondition.totalProfit" placeholder="请输入..." clearable>
                <span slot="append">万元</span>
              </Input>
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
          <Col span="4" offset="1" class="explain">资产总额：</Col>
          <Col span="5">
            <FormItem prop="totalAssets" :error="errors('totalAssets')" :show-message="false">
              <Input :class="errors('totalAssets')==='不一致'?'inputErr':''" maxlength="100" v-model.trim="projectCondition.totalAssets" placeholder="请输入..." clearable>
                <span slot="append">万元</span>
              </Input>
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
        </Row>
        <Row class="rowPadding">
          <Col span="4" class="explain">进项票(技术服务费)：</Col>
          <Col span="5">
          <FormItem prop="entryTicket" :error="errors('entryTicket')" :show-message="false">
            <Input :class="errors('entryTicket')==='不一致'?'inputErr':''" maxlength="100" v-model.trim="projectCondition.entryTicket" placeholder="请输入..." clearable>
              <span slot="append">万元</span>
            </Input>
          </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
          <Col span="4" offset="1" class="explain">研发费用占比：</Col>
          <Col span="5">
            <FormItem prop="costRatio" :error="errors('costRatio')" :show-message="false">
              <Input :class="errors('costRatio')==='不一致'?'inputErr':''" maxlength="100" v-model.trim="projectCondition.costRatio" placeholder="请输入..." clearable>
                <span slot="append">%</span>
              </Input>
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
        </Row>
        <Row class="rowPadding">
          <Col span="4" class="explain">纳税总额：</Col>
          <Col span="5">
            <FormItem prop="totalTaxPayment" :error="errors('totalTaxPayment')" :show-message="false">
              <Input :class="errors('totalTaxPayment')==='不一致'?'inputErr':''" maxlength="100" v-model.trim="projectCondition.totalTaxPayment" placeholder="请输入..." clearable>
                <span slot="append">万元</span>
              </Input>
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
          <Col span="4" offset="1" class="explain">研发设备原值：</Col>
          <Col span="5">
            <FormItem prop="equipmentValue" :error="errors('equipmentValue')" :show-message="false">
              <Input :class="errors('equipmentValue')==='不一致'?'inputErr':''" maxlength="100" v-model.trim="projectCondition.equipmentValue" placeholder="请输入..." clearable>
                <span slot="append">万元</span>
              </Input>
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
        </Row>
        <Row class="rowPadding">
          <Col span="4" class="explain">资产负债率：</Col>
          <Col span="5">
          <FormItem prop="assetLiabilityRatio" :error="errors('assetLiabilityRatio')" :show-message="false">
            <Input :class="errors('assetLiabilityRatio')==='不一致'?'inputErr':''" maxlength="100" v-model.trim="projectCondition.assetLiabilityRatio" placeholder="请输入..." clearable>
              <span slot="append">%</span>
            </Input>
          </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
          <Col span="4" offset="1" class="explain">增长年数：</Col>
          <Col span="5">
            <FormItem prop="assetGrowthYear" :error="errors('assetGrowthYear')">
              <Input
                maxlength="100"
                clearable
                v-model.trim="projectCondition.assetGrowthYear"
                placeholder="请输入..."
              >
                <span slot="append">年</span>
              </Input>
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
        </Row>
        <Row class="rowPadding">
          <Col span="4" class="explain">利润负债率：</Col>
          <Col span="5">
            <FormItem prop="profitLiabilityRatio" :error="errors('profitLiabilityRatio')" :show-message="false">
              <Input :class="errors('profitLiabilityRatio')==='不一致'?'inputErr':''" maxlength="100" v-model.trim="projectCondition.profitLiabilityRatio" placeholder="请输入..." clearable>
                <span slot="append">%</span>
              </Input>
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
          <Col span="4" offset="1" class="explain">增长年数：</Col>
          <Col span="5">
            <FormItem prop="profitGrowthYear" :error="errors('profitGrowthYear')">
              <Input
                maxlength="100"
                clearable
                v-model.trim="projectCondition.profitGrowthYear"
                placeholder="请输入..."
              >
                <span slot="append">年</span>
              </Input>
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
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
      <!-- 附件上传，需要单独增加标红功能 -->
        <Row class="rowPadding">
          <Col span="4" class="explain">申报材料：</Col>
          <Col span="5">
            <Upload
              multiple
              class="bzUpload"
              name="fileData"
              :show-upload-list="false"
              :action="staticUrl+'index.php'"
              :max-size="20480"
              :on-success="(value)=> uploadSuccess(value,6)"
              :on-exceeded-size="(error)=>uploadError(error)"
            >
              <Button icon="ios-cloud-upload-outline" :disabled="showAttBtn">单个文件不能超过20M</Button>
            </Upload>
            <ul>
              <li
                  v-for="(item, index) in attachmentDTO.applicationMaterials"
                  :key="index"
                  class="enclosuresList"
                  >
                  <Icon
                      v-if="type===1"
                      @click="deleteFile(index,6)"
                      class="close-icon"
                      type="ios-close-circle-outline"/>
                  <Tooltip placement="top">
                      <a :href="item.attachmentUrl" :download="item.attachmentName" style="width: 192px">{{item.attachmentName}}</a>
                      <div slot="content" style="width: 220px; white-space:normal; word-break:break-all; word-wrap: break-word;">
                          {{item.attachmentName}}
                      </div>
                  </Tooltip>
              </li>
            </ul>
            <!-- <div v-for="(item,index) in attachmentDTO.applicationMaterials" :key="index">
              <Icon
                v-if="type===1"
                type="ios-close-circle-outline"
                class="deleteFile"
                @click="deleteFile(index,6)"
              />
              <span>
                <a :href="item.attachmentUrl" :download="item.attachmentName" class="file">{{item.attachmentName}}</a>
              </span>
            </div> -->
            <div  v-if="showAttBtn && attachmentDTO.applicationMaterials.length!==0 && this.passType==='未过白'"  style="margin-top:5%;">
              <Button :type="attBtnTypeY.applicationMaterialsBtn" @click="ensure('applicationMaterialsBtn','applicationMaterialsBtn','applicationMaterialsState')">正确</Button>
              <Button :type="attBtnTypeN.applicationMaterialsBtn" @click="misjudgement('applicationMaterialsBtn','applicationMaterialsBtn','applicationMaterialsState')">错误</Button>
            </div>
            <div style="color:red;font-size:14px;" v-if="projectBaseInfo.type === 1 && shwoAttrErrorInfo.applicationMaterials">
              附件有误!
            </div>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
          <Col span="4" offset="1" class="explain">待审核：</Col>
          <Col span="5">
            <FormItem  :error="errors('checkPending')" :show-message="false">
              <Select v-model="projectCondition.checkPending" clearable>
                <Option v-for="item in isOrNo" :value="item.label" :key="item.id">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
          </Col>
        </Row>
        <Row class="rowPadding">
          <Col span="4" class="explain">申报成功：</Col>
          <Col span="5">
          <FormItem  :error="errors('successfulDeclaration')" :show-message="false">
            <Select v-model="projectCondition.successfulDeclaration" clearable>
              <Option v-for="item in isOrNo" :value="item.label" :key="item.id">{{ item.label }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="1" class="iconfont">
            <Icon type="md-swap" class="icon" @click="transfer" />
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
            <Col span="5">
            <FormItem prop="amountReceivable" :error="errors('amountReceivable')" :show-message="false">
              <Input :class="errors('amountReceivable')==='不一致'?'inputErr':''" maxlength="100" v-model.trim="projectCondition.amountReceivable" placeholder="请输入..." clearable>
                <span slot="append">万元</span>
              </Input>
            </FormItem>
            </Col>
            <Col span="4" offset="2" class="explain">待兑现审核：</Col>
            <Col span="5">
            <FormItem prop="pendingReview" :error="errors('pendingReview')" :show-message="false">
              <Input :class="errors('pendingReview')==='不一致'?'inputErr':''" maxlength="100" v-model.trim="projectCondition.pendingReview" placeholder="请输入..." clearable>
                <span slot="append">万元</span>
              </Input>
            </FormItem>
            </Col>
          </Row>
        <!-- 沟通记录附件上传单独增加附件判断 -->
          <Row class="rowPadding">
            <Col span="4" class="explain">沟通记录：</Col>
            <Col span="5">
              <Upload
                multiple
                class="bzUpload"
                :action="staticUrl+'index.php'"
                :max-size="20480"
                name="fileData"
                :show-upload-list="false"
                :on-success="(value)=> uploadSuccess(value,7)"
                :on-exceeded-size="(error)=>uploadError(error)"
              >
                <Button icon="ios-cloud-upload-outline" :disabled="showAttBtn">单个文件不能超过20M</Button>
              </Upload>
              <ul>
                  <li
                      v-for="(item, index) in attachmentDTO.communicationRecord"
                      :key="index"
                      class="enclosuresList"
                      >
                      <Icon
                          v-if="type===1"
                          @click="deleteFile(index,7)"
                          class="close-icon"
                          type="ios-close-circle-outline"/>
                      <Tooltip placement="top">
                          <a :href="item.attachmentUrl" :download="item.attachmentName" style="width: 192px">{{item.attachmentName}}</a>
                          <div slot="content" style="width: 220px; white-space:normal; word-break:break-all; word-wrap: break-word;">
                              {{item.attachmentName}}
                          </div>
                      </Tooltip>
                  </li>
              </ul>
              <!-- <div v-for="(item, index) in attachmentDTO.communicationRecord" :key="index">
                <Icon
                  v-if="type===1"
                  type="ios-close-circle-outline"
                  class="deleteFile"
                  @click="deleteFile(index,7)"
                />
                <span>
                  <a :href="item.attachmentUrl" :download="item.attachmentName" class="file">{{item.attachmentName}}</a>
                </span>
              </div> -->
              <div  v-if="showAttBtn && attachmentDTO.communicationRecord.length!==0 && this.passType==='未过白'" style="margin-top:5%;">
                <Button :type="attBtnTypeY.communicationRecordBtn" @click="ensure('communicationRecordBtn','communicationRecordBtn','communicationRecordState')">正确</Button>
                <Button :type="attBtnTypeN.communicationRecordBtn" @click="misjudgement('communicationRecordBtn','communicationRecordBtn','communicationRecordState')">错误</Button>
              </div>
              <div style="color:red;font-size:14px;" v-if="projectBaseInfo.type === 1 && shwoAttrErrorInfo.communicationRecord">
                附件有误!
              </div>
            </Col>
            <Col span="4" offset="2" class="explain">已收金额：</Col>
            <Col span="5">
            <FormItem prop="amountReceived" :error="errors('amountReceived')">
              <Input :class="errors('amountReceived')==='不一致'?'inputErr':''" maxlength="100" v-model.trim="projectCondition.amountReceived" placeholder="请输入..." clearable>
                <span slot="append">万元</span>
              </Input>
            </FormItem>
            </Col>
          </Row>
        </div>
      </div>
    </Form>
    <Modal @on-ok="addProject" title="转化项目" v-model="showModel" :loading="Modelloading">
      <Form ref="addForm" :model="addForm" :rules="addFormRule" :label-width="90">
        <FormItem label="项目名称：" prop="addProjectName" style="margin-bottom: 24px">
          <Input v-model.trim="addForm.addProjectName" placeholder="请输入项目名称"></Input>
        </FormItem>
        <FormItem label="文件上传：" prop="addProjectFile">
          <Upload
              multiple
              class="bzUpload"
              name="fileData"
              :show-upload-list="false"
              :action="staticUrl+'index.php'"
              :max-size="20480"
              :on-success="(value)=> uploadSuccess(value,8)"
              :on-exceeded-size="(error)=>uploadError(error)"
            >
              <Button style="margin-bottom: 10px;" icon="ios-cloud-upload-outline">单个文件不能超过20M</Button>
            </Upload>
            <ul>
                <li
                    v-for="(item, index) in addForm.addProjectFile"
                    :key="index"
                    class="enclosuresList"
                    style="line-height: 14px;"
                    >
                    <Icon
                        v-if="addForm.addProjectFile.length>=1"
                        @click="deleteFile(index,8)"
                        class="close-icon"
                        type="ios-close-circle-outline"/>
                    <Tooltip placement="top">
                        <a :href="item.attachmentUrl" :download="item.attachmentName" style="width: 192px">{{item.attachmentName}}</a>
                        <div slot="content" style="width: 220px; white-space:normal; word-break:break-all; word-wrap: break-word;">
                            {{item.attachmentName}}
                        </div>
                    </Tooltip>
                </li>
            </ul>
            <!-- <div v-for="(item,index) in addForm.addProjectFile" :key="index">
              <Icon
                v-if="addForm.addProjectFile.length>=1"
                type="ios-close-circle-outline"
                class="deleteFile"
                @click="deleteFile(index,8)"
              />
              <span>
                <a :href="item.attachmentUrl" :download="item.attachmentName" class="file">{{item.attachmentName}}</a>
              </span>
            </div> -->
        </FormItem>
      </Form>
    </Modal>
    <!-- <Card style="position: fixed; bottom: 0; left: 40%">
      <Button @click="goBack">返回</Button>
      <Button type="primary" @click="save" :loading="loading">保存</Button>
    </Card> -->
  </div>
</template>

<script>
import { staticUrl, prUrl, baseUrl, phpURL } from '@/api/base.js'
import moment from 'moment'
import TreeSelectVue from '@/components/tree-select-vue/tree-select-vue'
const validateNumber = (rule, value, callback) => {
  let reg = /^[0-9]+(.[0-9]{0,3})?$/g
  if (value === null || value.trim() === '') {
    callback()
  } else if (!reg.test(value)) {
    return callback(new Error('请输入数字 (保留小数点后三位)'))
  } else {
    callback()
  }
}
export default {
  name: '',
  data () {
    return {
      staticUrl,
      validateNumber,
      options: [], // 在职人员
      valueConsistsOf: 'LEAF_PRIORITY',
      showInfoBtn: true, // 基本信息展开按钮状态
      showProjectBtn: true, // 项目条件展开按钮状态
      showDeclaretBtn: true, // 申报条件展开按钮状态
      showReturnMoneyBtn: true, // 回款信息展开按钮状态
      showBasicInformation: true, // 基本信息展示
      showProjectInfo: true, // 项目条件展示
      showDeclaret: true, // 申报条件展示
      showReturnMoneyInfo: true, // 回款信息展示
      isReturnMoney: true, // 根据可兑现展示回款信息
      showModel: false, // 显示转换弹窗
      showAttBtn: false, // 展示附件判断的按钮
      // addProjectName: '', // 转换项目的项目名称
      // addProjectFile: [], // 转换项目的上传文件
      addForm: {
        addProjectName: '',
        addProjectFile: []
      },
      addFormRule: {
        addProjectName: [ { required: true, message: '项目名称不能为空', trigger: 'blur' } ]
      },
      Modelloading: true, // 弹窗加载状态
      // loading: false, // 状态加载
      backLogPerson: '', // 接收待办的人
      type: 1, // 标识第几人
      oldId: '', // 老数据ID
      errorInfo: [], // 错误项
      shwoAttrErrorInfo: {
        noveltySearchReport: false
      }, // 标识附件有误
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
        noveltySearchReportState: true,
        testReportState: true,
        newProjectState: true,
        proofMaterialState: true,
        auditReportState: true,
        applicationMaterialsState: true,
        communicationRecordState: true
      },
      conditionRule: {
        registeredCapital: [{ validator: validateNumber, trigger: 'change' }],
        area: [{ validator: validateNumber, trigger: 'change' }],
        socialSecurityNumber: [{ validator: validateNumber, trigger: 'change' }],
        percentage: [{ validator: validateNumber, trigger: 'change' }],
        number: [{ validator: validateNumber, trigger: 'change' }],
        businessIncome: [{ validator: validateNumber, trigger: 'change' }],
        totalAssets: [{ validator: validateNumber, trigger: 'change' }],
        totalProfit: [{ validator: validateNumber, trigger: 'change' }],
        entryTicket: [{ validator: validateNumber, trigger: 'change' }],
        costRatio: [{ validator: validateNumber, trigger: 'change' }],
        totalTaxPayment: [{ validator: validateNumber, trigger: 'change' }],
        equipmentValue: [{ validator: validateNumber, trigger: 'change' }],
        assetLiabilityRatio: [{ validator: validateNumber, trigger: 'change' }],
        profitLiabilityRatio: [{ validator: validateNumber, trigger: 'change' }],
        establishYears: [{ validator: validateNumber, trigger: 'change' }],
        assetGrowthYear: [{ validator: validateNumber, trigger: 'change' }],
        profitGrowthYear: [{ validator: validateNumber, trigger: 'change' }],
        amountReceivable: [{ validator: validateNumber, trigger: 'change' }],
        pendingReview: [{ validator: validateNumber, trigger: 'change' }],
        amountReceived: [{ validator: validateNumber, trigger: 'change' }]
      },
      projectBaseInfo: { // 基本信息
        projectName: '', // 项目名称
        deadline: '', // 截止时间
        contacts: '', // 联系人
        declareLevel: '', // 申报级别
        fromDepartment: '', // 归口部门
        contactInfo: '', // 联系方式
        examined: '', // 年审
        urgent: '', // 加急
        redeemable: '', // 可兑现
        pastTime: '', // 往年申报时间
        existenceAward: '', // 存在奖补 existenceAward existenceAward
        awardUnit: '', // 奖补单位
        awardMoneys: [], // 奖补金额
        followPersons: [] // 跟进人
      },
      projectCondition: {// 项目条件
        establishYears: '', // 成立年限
        companyArea: '', // 公司所在区域
        registeredCapital: '', // 注册资本
        scale: '', // 规模以上
        area: '', // 区域面积
        trade: '', // 行业
        personnelType: '', // 人员类型
        percentage: '', // 占比率
        socialSecurityNumber: '', // 社保人数
        qualifications: '', // 资质
        knowledgeType: '', // 知识产权类型
        number: '', // 数量
        partnership: '', // 产学研合作
        domainName: '', // 域名注册证
        networkCultureLicense: '', // 网络优化许可证
        enterpriseDirectory: '', // 中小企业名录库
        icp: '', // icp的
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
        checkPending: '', // 申报条件的待审核
        amountReceivable: '', // 回款信息的应收金额
        amountReceived: '', // 回款信息的已收金额
        pendingReview: ''// 回款信息的带兑现审核
      },
      attachmentDTO: { // 所有附件保存的对象
        noveltySearchReport: [], // 查新报告
        testReport: [], // 检测报告
        newProject: [], // 新产品
        proofMaterial: [], // 证明材料
        auditReport: [], // 审计报告
        applicationMaterials: [], // 申报材料
        communicationRecord: [] // 沟通记录
      },
      declareLevelList: [ // 申报级别下拉
        { id: 1, label: '区级' },
        { id: 2, label: '市级' },
        { id: 3, label: '省级' },
        { id: 4, label: '国家级' }
      ],
      isOrNo: [ // 是和否下拉
        { id: 1, label: '是' },
        { id: 2, label: '否' }
      ],
      needOrNo: [ // 需要或者不需要下拉
        { id: 1, label: '需要' },
        { id: 2, label: '不需要' }
      ],
      tradeList: [ // 行业的下拉
        { id: 1, label: '制造业企业' },
        { id: 2, label: '计算机及通信' }
      ],
      personnelTypeList: [ // 人员类型下拉
        { id: 1, label: '中大专以上学历' },
        { id: 2, label: '中专及以上技术职称专业人员' }
      ],
      knowledgeTypeList: [ // 知识产权类型下拉
        { id: 1, label: '专利' },
        { id: 2, label: '软件著作权' },
        { id: 3, label: '商标' },
        { id: 4, label: '其他' }
      ],
      icpList: [ // ICP下拉
        { id: 1, label: 'ICP备案' },
        { id: 2, label: 'ICP许可证' },
        { id: 3, label: 'ICP经营许可证' }
      ],
      closeIcon: {
        contacts: false,
        fromDepartment: false,
        contactInfo: false,
        awardUnit: false,
        awardMoney: false,
        establishYears: false,
        companyArea: false,
        trade: false,
        personnelType: false,
        percentage: false,
        socialSecurityNumber: false,
        qualifications: false,
        number: false,
        honor: false,
        assetGrowthYear: false,
        profitGrowthYear: false
      },
      passType: this.$route.query.passType || '未过白'
    }
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    loading (newV, oldV) {
      if (newV) {
        this.save()
      }
    }
  },
  components: { TreeSelectVue },
  inject: ['app'],
  created () {
    this.getRouteData()
  },
  mounted () {
    this.addHonor() // 增加荣誉
    this.getBackLog()
    this.checkBackLog()
    this.getTreeData()
    // this.checkBackLogStatus()
  },
  methods: {
    showClearable (name) {
      // this.$refs[name].clearable = true
      this.closeIcon[name] = true
    },
    hiddenClearable (name) {
      // this.$refs[name].clearable = false
      this.closeIcon[name] = false
    },
    getTreeData () {
      this.$axios({
        url: baseUrl + '/user/getIncumbencyTbUserBySort',
        method: 'get'
      })
        .then(res => {
          this.options = res.data.content
        })
    },
    // 获取路由值
    getRouteData () {
      let type = Number(this.$route.query.type)
      if (type === 2) {
        this.type = 2
        this.showAttBtn = true
      } else {
        this.type = 1
        this.showAttBtn = false
      }
      this.oldId = Number(this.$route.query.oldId)
    },
    // 格式化时间
    formatTime () {
      if (this.projectBaseInfo.deadline) {
        this.projectBaseInfo.deadline = moment(this.projectBaseInfo.deadline).format('YYYY-MM-DD')
      }
      if (this.projectBaseInfo.pastTime) {
        this.projectBaseInfo.pastTime = moment(this.projectBaseInfo.pastTime).format('YYYY-MM-DD')
      }
    },
    // 回显数据
    getShowData () {
      let sendData = {
        id: Number(this.$route.query.id),
        passType: this.passType,
        type: this.type,
        oldId: this.oldId
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
          // if(this.projectCondition.honors.length && this.projectCondition.honors.length === 0){
          //   this.addHonor()
          // }
          if (Array.isArray(this.projectCondition.honors) && this.projectCondition.honors.length === 0) {
            this.addHonor()
          }
          if (!(this.projectCondition.honors)) {
            this.projectCondition.honors = []
            this.addHonor()
          }
          // if(this.projectBaseInfo.type === 2){
          //   this.showAttBtn = true
          // }else{
          //   this.showAttBtn = false
          // }
          if (res.data.data.differentFields) {
            this.errorInfo = res.data.data.differentFields
            this.shwoAttrErrorInfo.noveltySearchReport = this.errorInfo.includes('noveltySearchReport')
            this.shwoAttrErrorInfo.applicationMaterials = this.errorInfo.includes('applicationMaterials')
            this.shwoAttrErrorInfo.auditReport = this.errorInfo.includes('auditReport')
            this.shwoAttrErrorInfo.communicationRecord = this.errorInfo.includes('communicationRecord')
            this.shwoAttrErrorInfo.newProject = this.errorInfo.includes('newProject')
            this.shwoAttrErrorInfo.proofMaterial = this.errorInfo.includes('proofMaterial')
            this.shwoAttrErrorInfo.testReport = this.errorInfo.includes('testReport')
          }
          // bus.$emit('projectName', this.projectBaseInfo.projectName)
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err)
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
      this.projectBaseInfo.awardMoneys.push({
        awardMoney: ''
      })
    },
    // 增加荣誉
    addHonor () {
      this.projectCondition.honors.push({
        honor: ''
      })
    },
    // 删除奖补金额
    removeMoney (index) {
      this.projectBaseInfo.awardMoneys.splice(index, 1)
    },
    // 删除荣誉
    removeReturn (index) {
      this.projectCondition.honors.splice(index, 1)
    },
    // 转换弹窗
    transfer () {
      this.showModel = true
    },
    // 根据可兑现展示回款信息模块
    isNegotiable (ids) {
      if (ids === '是') {
        this.isReturnMoney = true
      } else {
        this.isReturnMoney = false
      }
    },
    // 获取发送给待办的人
    getBackLog () {
      let sendData = {
        userId: this.$store.state.user.userId,
        moduleName: 'project',
        operation: 'update'
      }
      this.$axios({
        url: phpURL + '/declareProject/OutreachConfig/getPersonId',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.backLogPerson = res.data.content
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 文件上传成功
    uploadSuccess (response, type) {
      if (response.rel) {
        switch (type) {
          case 1: // 查新报告上传成功
            this.attachmentDTO.noveltySearchReport.push({
              attachmentName: response.filename,
              attachmentUrl: staticUrl + '' + response.url
            })
            break
          case 2: // 检查报告上传成功
            this.attachmentDTO.testReport.push({
              attachmentName: response.filename,
              attachmentUrl: staticUrl + '' + response.url
            })
            break
          case 3: // 新产品上传成功
            this.attachmentDTO.newProject.push({
              attachmentName: response.filename,
              attachmentUrl: staticUrl + '' + response.url
            })
            break
          case 4: // 证明材料
            this.attachmentDTO.proofMaterial.push({
              attachmentName: response.filename,
              attachmentUrl: staticUrl + '' + response.url
            })
            break
          case 5: // 审计报告
            this.attachmentDTO.auditReport.push({
              attachmentName: response.filename,
              attachmentUrl: staticUrl + '' + response.url
            })
            break
          case 6: // 申报材料
            this.attachmentDTO.applicationMaterials.push({
              attachmentName: response.filename,
              attachmentUrl: staticUrl + '' + response.url
            })
            break
          case 7: // 沟通记录
            this.attachmentDTO.communicationRecord.push({
              attachmentName: response.filename,
              attachmentUrl: staticUrl + '' + response.url
            })
            break
          case 8: // 转换项目弹窗的文件上传
            this.addForm.addProjectFile.push({
              attachmentName: response.filename,
              attachmentUrl: staticUrl + '' + response.url
            })
            break
        }
      }
    },
    // 删除上传文件
    deleteFile (index, type) {
      switch (type) {
        case 1:
          this.attachmentDTO.noveltySearchReport.splice(index, 1)
          break
        case 2:
          this.attachmentDTO.testReport.splice(index, 1)
          break
        case 3:
          this.attachmentDTO.newProject.splice(index, 1)
          break
        case 4:
          this.attachmentDTO.proofMaterial.splice(index, 1)
          break
        case 5:
          this.attachmentDTO.auditReport.splice(index, 1)
          break
        case 6:
          this.attachmentDTO.applicationMaterials.splice(index, 1)
          break
        case 7:
          this.attachmentDTO.communicationRecord.splice(index, 1)
          break
        case 8:
          this.addForm.addProjectFile.splice(index, 1)
          break
      }
    },
    // 文件上传失败
    uploadError (error) {
      if (error.size > 20480) {
        this.$Message.error('文件不能超过20M')
      }
    },
    // 添加转换项目
    addProject () {
      if (this.addForm.addProjectName.length === 0) {
        this.$Message.error('请输入转化项目')
        this.Modelloading = false
        this.$nextTick(() => {
          this.Modelloading = true
        })
      } else {
        let sendData = {
          sonProject: {
            projectName: this.addForm.addProjectName,
            parentProjectName: this.projectBaseInfo.projectName
          },
          attachments: this.addForm.addProjectFile
        }
        this.$axios({
          url: prUrl + '/project/insertProject',
          method: 'post',
          data: sendData
        }).then(res => {
          if (res.data.code === 10000) {
            this.$Message.info(res.data.msg)
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
        this.showModel = false
        this.Modelloading = false
        this.addForm.addProjectName = ''
        this.addForm.addProjectFile = []
      }
    },
    // 错误标红项
    errors (key) {
      if (this.errorInfo.some(e => e === key)) {
        return '不一致'
      }
    },
    // 保存
    async save () {
      let valid = await this.$refs.projectBaseInfo.validate()
      let valid2 = await this.$refs.projectCondition.validate()
      if (!valid || !valid2) {
        this.$Message.error('有不合法的输入内容')
        this.$emit('on-save')
        return false
      }

      this.formatTime()
      let attrLength = Object.values(this.attachmentDTO)
      let num = 0
      for (let i in attrLength) {
        if (attrLength[i].length > 0) {
          num++
        }
      }
      let sendData = {
        attachmentSize: num,
        projectBaseInfo: this.projectBaseInfo,
        projectCondition: this.projectCondition,
        attachmentState: this.attachmentState,
        type: this.type,
        route: 'projectDeclaration/editProject',
        userInfoDTO: {
          personId: this.userId,
          nickname: this.nickname
        },
        doublePersons: Object.values(this.backLogPerson)
      }

      if (this.$route.query.secondId) {
        sendData.secondId = Number(this.$route.query.secondId)
      } else {
        sendData.secondId = this.projectBaseInfo.secondId
      }
      if (this.type === 2) {
        sendData.attachmentDTO = {}
      } else {
        sendData.attachmentDTO = this.attachmentDTO
      }
      this.$axios({
        url: prUrl + '/project/updateProject',
        method: 'post',
        data: sendData
      }).then(res => {
        if (res.data.code === 10000) {
          this.$Message.info(res.data.msg)
        } else {
          this.$Message.error(res.data.msg)
        }
        bus.$emit('on-myclose', this.$route)
        this.$router.push({
          name: 'projectBank'
        })
      }).catch(err => {
        console.log(err)
      })
    },
    // 返回
    goBack () {
      const title = '提示'
      const content = '<p>记得保存后再返回哦~</p>'
      this.$Modal.confirm({
        title: title,
        content: content,
        okText: '去保存',
        cancelText: '返回',
        onCancel: () => {
          bus.$emit('on-myclose', this.$route)
          this.$router.push({
            name: 'projectBank'
          })
        }
      })
    },
    // 附件判断正确
    ensure (ensureBtnType, errorBtnType, attachmentType) {
      // 第一个形参为正确按钮状态
      // 第二个形参为错误按钮状态
      // 第三个形参为需要判断的附件的状态
      this.attBtnTypeY[ensureBtnType] = 'success'
      this.attBtnTypeN[errorBtnType] = 'default'
      this.attachmentState[attachmentType] = true
    },
    misjudgement (ensureBtnType, errorBtnType, attachmentType) {
      // 第一个形参为正确按钮状态
      // 第二个形参为错误按钮状态
      // 第三个形参为需要判断的附件的状态
      this.attBtnTypeY[ensureBtnType] = 'default'
      this.attBtnTypeN[errorBtnType] = 'error'
      this.attachmentState[attachmentType] = false
    },
    // 解锁页面
    clearLock () {
      let sendData = {
        backLogId: sessionStorage.projectBacklogId
      }
      this.$axios({
        url: prUrl + '/backlog/releaseBackLog',
        data: $qs.stringify(sendData),
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          // console.log(res)
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 判断是否从待办跳来的
    checkBackLog () {
      let query = this.$route.query.backLogId || ''
      // 如果路由id为空，不是待办来的，正常请求数据接口
      if (query.length === 0) {
        this.getShowData()
      } else {
        this.checkBackLogStatus() // 检查代办状态
        sessionStorage.setItem('projectBacklogId', this.$route.query.backLogId) // 在session存待办id，解锁时用
      }
    },
    // 检查代办状态
    checkBackLogStatus () {
      let sendData = {
        projectId: this.$route.query.secondId,
        backLogId: this.$route.query.backLogId
      }
      this.$axios({
        url: prUrl + '/project/checkBackLogStatus',
        data: $qs.stringify(sendData),
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          let status = res.data.data
          if (status === true) {
            this.getShowData()
          } else {
            this.$router.go(-1)
            bus.$emit('on-myclose', this.$route)
            this.$Message.error(res.data.msg)
          }
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  },
  computed: {
    userId () {
      return this.$store.state.user.userId
    },
    nickname () {
      return this.$store.state.user.nickname
    }
  }
}
</script>

<style lang='less'>
 .ivu-modal-confirm-footer{
   .ivu-btn-text{
     border: 1px solid #DCDEE2  !important;
   }
  .ivu-btn-text:hover{
     color:#4abba4;
     border: 1px solid #4abba4 !important;
   }
 }
</style>
<style lang="css" scoped>
.ivu-input-group-with-append >>> .ivu-input-icon-clear {
  right: 50px;
}
.treeSelect >>> .vue-treeselect__control,
.treeSelect >>> .vue-treeselect__control:hover {
  border-color: red;
  line-height: 18px;
}
.inputErr >>> input{
  border-color: red;
}
</style>
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
.ivu-select {
  margin: 0;
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
.deleteFile {
  cursor: pointer;
  position: relative;
  right: -100%;
  top: 0px;
  color: red;
}
.file {
  font-size: 12px;
}
.btns {
  display: flex;
  justify-content: space-between;
}
.ivu-form-item {
  margin: 0;
}
// .ivu-modal-confirm-footer{
// /deep/  button:nth-of-type(1){
//     border: 1px solid #DCDEE2  !important;
//   }
// }

i.require {
  color: red;
  font-size: 14px;
  margin-right: 4px;
}
.require-tips {
  color: red;
}
.none {
  display: none;
}
.closeIcon {
  position: absolute;
  top: 8px;
  right: 36px;
  z-index: 1;
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
    .close-icon {
        position: absolute;
        right: 0;
        margin-right: 2px;
        font-size: 18px;
        cursor: pointer;
        z-index: 1;
    }
}
</style>
