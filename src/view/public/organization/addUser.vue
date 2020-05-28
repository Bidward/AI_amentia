<template>
  <div>
    <Card id="addUser">
      <div class="accountInfo">
        <h3>账户信息</h3>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">
            <i class="require">*</i>姓名：
          </Col>
          <Col span="5" class="inputbox">
            <Input
              :disabled="isNewPerson"
              v-model="accountInfo.nickname"
              placeholder="请输入中文名称"
              @on-blur="getBasic"
            ></Input>
          </Col>
          <Col span="3" offset="2" class="title">工号：</Col>
          <Col span="5" class="inputbox">
            <Input disabled v-model="accountInfo.jobNumber" placeholder="系统自动生成"></Input>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">
            <i class="require">*</i>登录名：
          </Col>
          <Col span="5" class="inputbox">
            <Input :disabled="isNewPerson" v-model="accountInfo.username"></Input>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>密码：
          </Col>
          <Col span="5" class="inputbox">
            <Input
              v-if="visible"
              :disabled="isNewPerson"
              v-model="accountInfo.password"
              icon="ios-eye"
              title="显示密码"
              @on-click="changePass('show')"
              style="cursor:pointer;"
            ></Input>
            <Input
              v-else
              :disabled="isNewPerson"
              v-model="accountInfo.password"
              type="password"
              icon="ios-eye-off"
              title="隐藏密码"
              @on-click="changePass('hide')"
              style="cursor:pointer;"
            ></Input>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">
            <i class="require">*</i>手机号：
          </Col>
          <Col span="5" class="inputbox">
            <Input @on-blur="validate('phone')" :disabled="isNewPerson" v-model="accountInfo.phone"></Input>
            <span class="tips">{{rules.phone}}</span>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>企业邮箱：
          </Col>
          <Col span="5" class="inputbox">
            <Input :disabled="isNewPerson" v-model="accountInfo.email"></Input>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">
            <i class="require">*</i>部门：
          </Col>
          <Col span="5" class="inputbox">
            <Select
              :disabled="isNewPerson"
              filterable
              class="inputbox"
              @on-change="getPositionByDeptId"
              v-model="accountInfo.deptId"
            >
              <Option
                v-for="(item,index) in selection.deptList"
                :value="item.id"
                :id="item.id"
                :key="index"
              >{{item.title}}</Option>
            </Select>
            <span class="tips">{{rules.deptId}}</span>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>职位：
          </Col>
          <Col span="5" class="inputbox">
            <Select
              :disabled="isNewPerson"
              @on-change="validate('positionId')"
              filterable
              v-model="accountInfo.positionId"
              style="width:100%"
              placeholder="请选择职位"
            >
              <Option
                v-for="item in selection.positionList"
                :value="item.positionId"
                :key="item.positionId"
              >{{ item.positionName }}</Option>
            </Select>
            <span class="tips">{{rules.positionId}}</span>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">
            <i class="require">*</i>角色：
          </Col>
          <Col span="5" class="inputbox">
            <Select
              :disabled="isNewPerson"
              filterable
              class="inputbox"
              v-model="accountInfo.roleId"
            >
              <Option
                v-for="(item,index) in selection.roleList"
                :value="item.roleId"
                :label="item.roleName"
                :id="item.roleId"
                :key="index"
              >{{item.roleName}}</Option>
            </Select>
            <span class="tips">{{rules.roleId}}</span>
          </Col>
        </Row>
      </div>
      <div class="baseInfo" v-if="!isAdd">
        <h3>基础信息</h3>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">
            <i class="require">*</i>身份证号码：
          </Col>
          <Col span="5" class="inputbox">
            <Input v-model="baseInfo.personId" :disabled="isAdd" @on-blur="validate('personId')"></Input>
            <span class="tips">{{rules.personId}}</span>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>性别：
          </Col>
          <Col span="5" class="inputbox">
            <Select v-model="baseInfo.sex" :disabled="isAdd">
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
            <span class="tips">{{rules.sex}}</span>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">
            <i class="require">*</i>生日：
          </Col>
          <!-- <Col span="2" class="inputbox">
            <Select v-model="baseInfo.birthdayType" :disabled="true">
              <Option value="公历" key="公历">公历</Option>
              <Option value="阴历" key="阴历">阴历</Option>
            </Select>
          </Col> -->
          <Col span="5" class="inputbox">
            <DatePicker
              v-model="baseInfo.birthday"
              @on-change="validate('birthday')"
              format="yyyy-MM-dd"
              :disabled="isAdd"
              style="width:100%"
            ></DatePicker>
            <!-- @on-change="baseInfo.birthday=$event" -->
            <span class="tips">{{rules.birthday}}</span>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>民族：
          </Col>
          <Col span="5" class="inputbox">
            <Input v-model="baseInfo.race" @on-blur="validate('race')" :disabled="isAdd"></Input>
            <span class="tips">{{rules.race}}</span>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">
            <i class="require">*</i>户口类型：
          </Col>
          <Col span="5" class="inputbox">
            <Select
              v-model="baseInfo.householdType"
              @on-change="validate('householdType')"
              :disabled="isAdd"
            >
              <Option value="农村户口">农村户口</Option>
              <Option value="城镇户口">城镇户口</Option>
            </Select>
            <span class="tips">{{rules.householdType}}</span>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>婚育状况：
          </Col>
          <Col span="5" class="inputbox">
            <Select
              v-model="baseInfo.maritalStatus"
              @on-blur="validate('maritalStatus')"
              :disabled="isAdd"
            >
              <Option value="未婚未育">未婚未育</Option>
              <Option value="未婚已育">未婚已育</Option>
              <Option value="已婚未育">已婚未育</Option>
              <Option value="已婚已育">已婚已育</Option>
            </Select>
            <span class="tips">{{rules.maritalStatus}}</span>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">
            <i class="require">*</i>户籍地址：
          </Col>
          <Col span="5" class="inputbox">
            <Input
              v-model="baseInfo.permanentAddress"
              @on-blur="validate('permanentAddress')"
              :disabled="isAdd"
            ></Input>
            <span class="tips">{{rules.permanentAddress}}</span>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>家庭住址：
          </Col>
          <Col span="5" class="inputbox">
            <Input
              v-model="baseInfo.homeAddress"
              @on-blur="validate('homeAddress')"
              :disabled="isAdd"
            ></Input>
            <span class="tips">{{rules.homeAddress}}</span>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">
            <i class="require">*</i>毕业院校：
          </Col>
          <Col span="5" class="inputbox">
            <Input
              v-model="baseInfo.graduateSchool"
              @on-blur="validate('graduateSchool')"
              :disabled="isAdd"
            ></Input>
            <span class="tips">{{rules.graduateSchool}}</span>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>毕业时间：
          </Col>
          <Col span="5" class="inputbox">
            <DatePicker
              type="month"
              v-model="baseInfo.graduateDate"
              format="yyyy-MM"
              @on-change="validate('graduateDate')"
              :disabled="isAdd"
              style="width:100%"
            ></DatePicker>
            <!-- @on-change="baseInfo.graduateDate=$event" -->
            <span class="tips">{{rules.graduateDate}}</span>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">
            <i class="require">*</i>学历：
          </Col>
          <Col span="5" class="inputbox">
            <Select
              v-model="baseInfo.educateId"
              @on-change="validate('educateId')"
              :disabled="isAdd"
            >
              <Option
                v-for="item in selection.educateList"
                :key="item.rankId"
                :value="item.rankId"
                :label="item.rankName"
              >{{item.rankName}}</Option>
            </Select>
            <span class="tips">{{rules.educateId}}</span>
          </Col>
          <Col span="3" offset="2" class="title">专业：</Col>
          <Col span="5" class="inputbox">
            <Input v-model="baseInfo.major" :disabled="isAdd"></Input>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">
            <i class="require">*</i>政治面貌：
          </Col>
          <Col span="5" class="inputbox">
            <Select
              v-model="baseInfo.politicsFace"
              @on-change="validate('politicsFace')"
              :disabled="isAdd"
            >
              <Option value="党员" key="党员">党员</Option>
              <Option value="预备党员" key="预备党员">预备党员</Option>
              <Option value="民主党派" key="民主党派">民主党派</Option>
              <Option value="团员" key="团员">团员</Option>
              <Option value="群众" key="群众">群众</Option>
              <Option value="其他" key="其他">其他</Option>
            </Select>
            <span class="tips">{{rules.politicsFace}}</span>
          </Col>
          <Col span="3" offset="2" class="title">职称：</Col>
          <Col span="5" class="inputbox">
            <Input v-model="baseInfo.title" :disabled="isAdd"></Input>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">驾照领取时间：</Col>
          <Col span="5" class="inputbox">
            <DatePicker
              v-model="baseInfo.driveLicenseDate"
              :disabled="isAdd"
              format="yyyy-MM-dd"
              @on-change="baseInfo.driveLicenseDate=$event"
              style="width:100%"
            ></DatePicker>
          </Col>
          <Col span="3" offset="2" class="title">外语语种及水平：</Col>
          <Col span="5" class="inputbox">
            <Input v-model="baseInfo.foreignLevel" :disabled="isAdd"></Input>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">兴趣及特长：</Col>
          <Col span="5" class="inputbox">
            <Input v-model="baseInfo.hobby" :disabled="isAdd"></Input>
          </Col>
          <Col span="3" offset="2" class="title">计算机水平：</Col>
          <Col span="5" class="inputbox">
            <Input v-model="baseInfo.computerLevel" :disabled="isAdd"></Input>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">俱乐部：</Col>
          <Col span="15">
            <CheckboxGroup size="large" v-model="baseInfo.clubNames">
              <Checkbox
                v-for="(item,index) in selection.clubs"
                :label="item.optionName"
                :key="index"
              >
                <span>{{item.optionName}}</span>
              </Checkbox>
            </CheckboxGroup>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">工作经历：</Col>
          <Col span="15"></Col>
          <Col span="15">
            <Table
              disabled-hover
              border
              :columns="tableHeader.workExperiences"
              :data="baseInfo.workExperiences"
            >
              <template slot-scope="{ row,index }" slot="timeFromTo">
                <Input
                  v-model="row.timeFromTo"
                  placeholder="例:2018.02-2019.03"
                  @on-blur="editTable('baseInfo','workExperiences',index,'timeFromTo',row.timeFromTo)"
                ></Input>
              </template>
              <template slot-scope="{ row,index }" slot="companyName">
                <Input
                  v-model="row.companyName"
                  @on-blur="editTable('baseInfo','workExperiences',index,'companyName',row.companyName)"
                ></Input>
              </template>
              <template slot-scope="{ row,index }" slot="workContent">
                <Input
                  v-model="row.workContent"
                  @on-blur="editTable('baseInfo','workExperiences',index,'workContent',row.workContent)"
                ></Input>
              </template>
              <template slot-scope="{ row,index }" slot="certifier">
                <Input
                  v-model="row.certifier"
                  @on-blur="editTable('baseInfo','workExperiences',index,'certifier',row.certifier)"
                ></Input>
              </template>
              <template slot-scope="{ row,index }" slot="telephoneNumber">
                <Input
                  v-model="row.telephoneNumber"
                  @on-blur="editTable('baseInfo','workExperiences',index,'telephoneNumber',row.telephoneNumber)"
                ></Input>
              </template>
            </Table>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">家庭主要成员：</Col>
          <Col span="15">
            <Table
              disabled-hover
              border
              :columns="tableHeader.familyMembers"
              :data="baseInfo.familyMembers"
            >
              <template slot-scope="{ row,index }" slot="appellation">
                <Input
                  v-model="row.appellation"
                  @on-blur="editTable('baseInfo','familyMembers',index,'appellation',row.appellation)"
                ></Input>
              </template>
              <template slot-scope="{ row,index }" slot="name">
                <Input
                  v-model="row.name"
                  @on-blur="editTable('baseInfo','familyMembers',index,'name',row.name)"
                ></Input>
              </template>
              <template slot-scope="{ row,index }" slot="workUnit">
                <Input
                  v-model="row.workUnit"
                  @on-blur="editTable('baseInfo','familyMembers',index,'workUnit',row.workUnit)"
                ></Input>
              </template>
              <template slot-scope="{ row,index }" slot="duty">
                <Input
                  v-model="row.duty"
                  @on-blur="editTable('baseInfo','familyMembers',index,'duty',row.duty)"
                ></Input>
              </template>
              <template slot-scope="{ row,index }" slot="telephoneNumber">
                <Input
                  v-model="row.telephoneNumber"
                  @on-blur="editTable('baseInfo','familyMembers',index,'telephoneNumber',row.telephoneNumber)"
                ></Input>
              </template>
            </Table>
          </Col>
        </Row>
      </div>
      <div class="inPositionInfo" v-if="isHrEdit">
        <h3>在职信息</h3>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">状态：</Col>
          <Col span="5" class="inputbox">
            <Select :disabled="isAdd" v-model="inPositionInfo.userStatus">
              <Option :value="0" key="在职">在职</Option>
              <Option :value="1" key="离职">离职</Option>
            </Select>
          </Col>
          <Col span="3" offset="2" class="title">入职日期：</Col>
          <Col span="5" class="inputbox">
            <DatePicker
              :disabled="isAdd"
              :value="inPositionInfo.entryDate"
              v-model="inPositionInfo.entryDate"
              style="width:100%"
              @on-change="inPositionInfo.entryDate=$event"
              format="yyyy-MM-dd"
              size="default"
              type="date"
              placeholder="入职日期"
            ></DatePicker>
          </Col>
        </Row>
        <Row class="rowMargin" v-if="isLeave">
          <Col span="3" offset="1" class="title">
            <i class="require">*</i>离职时间：
          </Col>
          <Col span="5" class="inputbox">
            <DatePicker
              :disabled="isAdd"
              :value="inPositionInfo.leaveDate"
              v-model="inPositionInfo.leaveDate"
              style="width:100%"
              @on-change="inPositionInfo.leaveDate=$event"
              format="yyyy-MM-dd"
              size="default"
              type="date"
              placeholder="离职时间"
            ></DatePicker>
            <span class="tips">{{rules.leaveDate}}</span>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">职级：</Col>
          <Col span="5" class="inputbox">
            <Select :disabled="isAdd" v-model="inPositionInfo.rankId" clearable filterable>
              <Option
                v-for="item in selection.rankList"
                :value="item.rankId"
                :label="item.rankName"
                :key="item.rankId"
              >{{item.rankName}}</Option>
            </Select>
          </Col>
          <Col span="3" offset="2" class="title">工龄：</Col>
          <Col span="5" class="inputbox">
            <Input disabled v-model="inPositionInfo.workingYears"></Input>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">师傅：</Col>
          <Col span="5" class="inputbox">
            <Select :disabled="isAdd" v-model="inPositionInfo.masterId" clearable filterable>
              <Option
                v-for="item in selection.masterList"
                :value="item.id"
                :key="item.id"
                :label="item.nickname"
              >{{item.nickname}}</Option>
            </Select>
          </Col>
          <Col span="3" offset="2" class="title">工资卡号：</Col>
          <Col span="5" class="inputbox">
            <Input :disabled="isAdd" v-model="inPositionInfo.cardNumber" clearable></Input>
          </Col>
        </Row>

        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">合同起始日期：</Col>
          <Col span="5" class="inputbox">
            <DatePicker
              :disabled="isAdd"
              :value="inPositionInfo.contractStartDate"
              v-model="inPositionInfo.contractStartDate"
              style="width:100%"
              @on-change="inPositionInfo.contractStartDate=$event"
              format="yyyy-MM-dd"
              size="default"
              type="date"
              placeholder="合同起始时间"
            ></DatePicker>
          </Col>
          <Col span="3" offset="2" class="title">合同到期日期：</Col>
          <Col span="5" class="inputbox">
            <DatePicker
              :disabled="isAdd"
              :value="inPositionInfo.contractEndDate"
              v-model="inPositionInfo.contractEndDate"
              style="width:100%"
              @on-change="inPositionInfo.contractEndDate=$event"
              format="yyyy-MM-dd"
              size="default"
              type="date"
              placeholder="合同到期日期"
            ></DatePicker>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">转正日期：</Col>
          <Col span="5" class="inputbox">
            <DatePicker
              :disabled="isAdd"
              :value="inPositionInfo.conversionDate"
              v-model="inPositionInfo.conversionDate"
              style="width:100%"
              @on-change="inPositionInfo.conversionDate=$event"
              format="yyyy-MM-dd"
              size="default"
              type="date"
              placeholder="转正时间"
            ></DatePicker>
          </Col>
          <Col span="3" offset="2" class="title">社保起始月份：</Col>
          <Col span="5" class="inputbox">
            <DatePicker
              type="month"
              :disabled="isAdd"
              :value="inPositionInfo.socialSecurityDate"
              v-model="inPositionInfo.socialSecurityDate"
              style="width:100%"
              @on-change="inPositionInfo.socialSecurityDate=$event"
              format="yyyy-MM"
              size="default"
              placeholder="社保起始月份"
            ></DatePicker>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">公积金起始月份：</Col>
          <Col span="5" class="inputbox">
            <DatePicker
              type="month"
              :disabled="isAdd"
              :value="inPositionInfo.fundStartDate"
              v-model="inPositionInfo.fundStartDate"
              style="width:100%"
              @on-change="inPositionInfo.fundStartDate=$event"
              format="yyyy-MM"
              size="default"
              placeholder="公积金起始月份"
            ></DatePicker>
          </Col>
          <Col span="3" offset="2" class="title">未购原因：</Col>
          <Col span="5" class="inputbox">
            <Input
              :disabled="isAdd"
              v-model="inPositionInfo.notBuyReason"
              type="textarea"
              clearable
            ></Input>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">外出培训记录：</Col>
          <Col
            span="15"
            class="title"
            style="text-align:left"
            v-show="showTrains"
            @click="showTrains=false"
          >
            <span @click="showTrains=false" style="cursor:pointer">
              收起
              <Icon type="md-arrow-dropup"/>
            </span>
          </Col>
          <Col
            span="15"
            class="title"
            style="text-align:left"
            v-show="!showTrains"
            @click="showTrains=true"
          >
            <span @click="showTrains=true" style="cursor:pointer">
              展开
              <Icon type="md-arrow-dropdown"/>
            </span>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="15" offset="4" v-show="showTrains">
            <Table
              disabled-hover
              border
              :columns="tableHeader.trains"
              :data="inPositionInfo.trains"
            >
              <template slot-scope="{ row,index }" slot="trainDate">
                <Input
                  v-model="row.trainDate"
                  placeholder="例如：2019.03"
                  @on-blur="editTable('inPositionInfo','trains',index,'trainDate',row.trainDate)"
                ></Input>
              </template>
              <template slot-scope="{ row,index }" slot="trainPlace">
                <Input
                  v-model="row.trainPlace"
                  @on-blur="editTable('inPositionInfo','trains',index,'trainPlace',row.trainPlace)"
                ></Input>
              </template>
              <template slot-scope="{ row,index }" slot="trainContent">
                <Input
                  v-model="row.trainContent"
                  @on-blur="editTable('inPositionInfo','trains',index,'trainContent',row.trainContent)"
                ></Input>
              </template>
            </Table>
            <Button type="primary" class="addBtn" @click="addTrains">添加一行</Button>
          </Col>
        </Row>
      </div>
      <div class="enclosure" v-if="!isAdd">
        <h3>附件</h3>
        <Row class="rowMargin">
          <Col span="3" offset="1" class="title">
            <i class="require">*</i>身份证：
          </Col>
          <Col span="5">
            <div
              v-for="(img,i) in enclosure.personIdUrl"
              :key="i"
              style="width:50%;float:left;position:relative"
            >
              <img :src="imgs.delImg" class="close" @click="deleteImg('personIdUrl',i)">
              <viewer>
                <div class="imgbox">
                  <img :src="staticUrl+img.url" class="inputbox">
                </div>
              </viewer>
            </div>
            <Upload
              :format="['jpg','jpeg','png']"
              :max-size="20480"
              multiple
              :show-upload-list="false"
              name="fileData"
              :on-success="(value)=> uploadSuccess('personIdUrl', value)"
              type="drag"
              :action="staticUrl+'/index.php'"
              style="width:50%;padding-left: 10px;display:inline-block"
            >
              <div style="50%;line-height: 100px;padding-left:10px;">
                <Icon type="ios-camera" size="40"></Icon>
              </div>
            </Upload>
          </Col>
          <Col span="3" offset="2" class="title">证书：</Col>
          <Col span="5">
            <div
              v-for="(img,i) in enclosure.certificateUrl"
              :key="i"
              style="width:50%;float:left;position:relative"
            >
              <img :src="imgs.delImg" class="close" @click="deleteImg('certificateUrl',i)">
              <viewer>
                <div class="imgbox">
                  <img :src="staticUrl+img.url" class="inputbox">
                </div>
              </viewer>
            </div>
            <Upload
              :format="['jpg','jpeg','png']"
              :max-size="20480"
              :show-upload-list="false"
              multiple
              name="fileData"
              :on-success="(value)=> uploadSuccess('certificateUrl', value)"
              type="drag"
              :action="staticUrl+'/index.php'"
              style="width:50%;padding-left: 10px;display:inline-block"
            >
              <div style="50%;line-height: 100px;padding-left:10px;">
                <Icon type="ios-camera" size="40"></Icon>
              </div>
            </Upload>
          </Col>
        </Row>
      </div>
      <div class="actionButton">
        <Row class="rowMargin">
          <Col span="3" offset="10">
            <Button class="saveData" type="primary" @click="saveData">保存</Button>
            <Button class="cancelAdd" @click="closeTag">取消</Button>
          </Col>
        </Row>
      </div>
    </Card>
  </div>
</template>

<script>
import { baseUrl, staticUrl } from '@/api/base.js'
import addImg from '@/assets/images/add.png'
import reduceImg from '@/assets/images/reduce.png'
import delImg from '@/assets/images/close.png'
import TreeSelect from '_c/tree-select'
import { DatetoString, DatetoMonthString } from '@/libs/tools.js'
// import {getIntersection} from '@/libs/tools.js'
export default {
  name: 'addUser',
  components: {
    TreeSelect
  },
  data () {
    return {
      showTrains: false,
      imgs: {
        addImg,
        reduceImg,
        delImg
      },
      staticUrl,
      baseUrl,
      visible: true, // 是否展示明文 true:暗文显示，false:明文显示
      // 账户信息
      accountInfo: {
        nickname: '', // 姓名
        jobNumber: '', // 工号
        username: '', // 登录名
        password: '', // 密码
        phone: '', // 手机号
        email: '', // 邮箱
        deptId: '', // 部门id
        positionId: '', // 职位id
        roleId: ''// 角色id
      },
      // 基础信息
      baseInfo: {
        personId: '', // 身份证号码
        sex: '', // 性别
        birthdayType: '公历', // 生日类型
        birthday: '', // 生日
        race: '汉族', // 民族
        householdType: '城镇户口', // 户口类型
        maritalStatus: '', // 婚育状况
        permanentAddress: '', // 户籍地址
        homeAddress: '', // 家庭住址
        graduateSchool: '', // 毕业院校
        graduateDate: '', // 毕业时间
        educateId: '', // 学历
        major: '', // 专业
        politicsFace: '', // 政治面貌
        title: '', // 职称
        driveLicenseDate: '', // 驾照领取时间
        foreignLevel: '', // 外语水平
        hobby: '', // 兴趣特长
        computerLevel: '', // 计算机水平
        clubNames: [], // 俱乐部名
        workExperiences: [
          // 工作经历
          {
            timeFromTo: '',
            companyName: '',
            workContent: '',
            certifier: '',
            telephoneNumber: ''
          }
        ],
        familyMembers: [
          // 家庭成员
          {
            appellation: '',
            name: '',
            workUnit: '',
            duty: '',
            telephoneNumber: ''
          }
        ]
      },
      // 在职信息
      inPositionInfo: {
        userStatus: 0, // 在职离职状态
        entryDate: '', // 入职日期
        leaveDate: '', // 离职时间
        rankId: '-1', // 职级
        workingYears: '', // 工龄
        masterId: '-1', // 师傅
        cardNumber: '', // 银行卡号
        contractStartDate: '', // 合同起始日期
        contractEndDate: '', // 合同到期日期
        conversionDate: '', // 转正日期
        socialSecurityDate: '', // 社保起始月份
        fundStartDate: '', // 公积金起始月份
        notBuyReason: '', // 公积金未购原因
        trains: [] // 外出培训记录
      },
      // 附件
      enclosure: {
        personIdUrl: [
          // 身份证图片
          // {name: "银行开户许可",status: 0,url: "Uploads/20190226/443e084efeba3a9e28f02b482870967b.jpg"}
        ],
        certificateUrl: [
          // 证书图片
          // {name: "银行开户许可",status: 0,url: "Uploads/20190226/443e084efeba3a9e28f02b482870967b.jpg"}
        ]
      },
      // 下拉列表们
      selection: {
        deptList: [], // 部门list
        positionList: [], // 职位列表
        educateList: [], // 学历
        rankList: [], // 职级,
        masterList: [], // 成员列表
        clubs: [], // 俱乐部
        roleList: []// 角色列表
      },
      tableHeader: {
        workExperiences: [
          {
            title: '起止时间',
            slot: 'timeFromTo',
            key: 'timeFromTo'
          },
          { title: '公司名称', slot: 'companyName' },
          { title: '工作内容', slot: 'workContent' },
          { title: '证明人', slot: 'certifier' },
          { title: '联系电话', slot: 'telephoneNumber' }
          // {title: '操作',slot: 'action'}
        ],
        familyMembers: [
          { title: '称谓', slot: 'appellation' },
          { title: '姓名', slot: 'name' },
          { title: '工作单位', slot: 'workUnit' },
          { title: '职务', slot: 'duty' },
          { title: '联系电话', slot: 'telephoneNumber' }
        ],
        trains: [
          { title: '外出培训时间', slot: 'trainDate' },
          { title: '外出培训地点', slot: 'trainPlace' },
          { title: '培训内容', slot: 'trainContent' }
        ]
      },
      keys: {
        accountInfo: [],
        baseInfo: [],
        inPositionInfo: []
      },
      editTableContent: '',
      rules: {
        nickname: '', // 姓名
        jobNumber: '', // 工号
        username: '', // 登录名
        password: '', // 密码
        phone: '', // 手机号
        email: '', // 邮箱
        deptId: '', // 部门id
        positionId: '', // 职位id
        personId: '', // 身份证号码
        sex: '', // 性别
        birthdayType: '公历', // 生日类型
        birthday: '', // 生日
        race: '', // 民族
        householdType: '', // 户口类型
        maritalStatus: '', // 婚育状况
        permanentAddress: '', // 户籍地址
        homeAddress: '', // 家庭住址
        graduateSchool: '', // 毕业院校
        graduateDate: '', // 毕业时间
        educateId: '', // 学历
        major: '', // 专业
        politicsFace: '', // 政治面貌
        title: '', // 职称
        driveLicenseDate: '', // 驾照领取时间
        foreignLevel: '', // 外语水平
        hobby: '', // 兴趣特长
        computerLevel: '', // 计算机水平
        leaveDate: '', // 离职日期
        roleId: ''// 角色
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getKeys() // 存keys
      this.getSelectionData() // 获取下拉列表
      this.getData() // 页面初始化
      this.getdeptList() // 获取部门列表
      this.getRoleList()// 获取角色列表
    },
    getKeys () {
      // 字段太多，存key，保存的时候只传需要传的key
      this.keys.accountInfo = Object.keys(this.accountInfo)
      this.keys.baseInfo = Object.keys(this.baseInfo)
      this.keys.inPositionInfo = Object.keys(this.inPositionInfo)
    },
    getData () {
      if (this.type === 'tbc') {
        // 从待办事项来的，带回账户信息
        this.$axios({
          url: baseUrl + '/user/detail',
          data: $qs.stringify({
            id: this.$route.query.id
          }),
          method: 'post'
        })
          .then(resp => {
            if (resp.data.code === 10000) {
              let _this = this.accountInfo
              let contentData = resp.data.content
              _this.nickname = contentData.nickname
              _this.jobNumber = contentData.jobNumber
              _this.username = contentData.username
              _this.password = contentData.password
              _this.phone = contentData.phone
              _this.email = contentData.email
              _this.deptId = contentData.deptId
              // _this.deptId = contentData.deptId;
              _this.positionId = contentData.positionId
              this.getPositionByDeptId(this.accountInfo.deptId)
            } else {
              this.$Message.error(resp.data.msg)
            }
          })
          .catch(err => {
            console.log('err', err)
          })
      } else if (this.type === 'edit') {
        // 人资编辑，带回所有信息
        this.$axios({
          url: baseUrl + '/user/detail',
          data: $qs.stringify({
            id: this.$route.query.id
          }),
          method: 'post'
        })
          .then(resp => {
            if (resp.data.code === 10000) {
              let content = resp.data.content
              this.keys.accountInfo.forEach(key => {
                this.accountInfo[key] = content[key]
              })
              this.keys.baseInfo.forEach(key => {
                this.baseInfo[key] = content[key]
              })
              this.keys.inPositionInfo.forEach(key => {
                this.inPositionInfo[key] = content[key]
              })
              this.enclosure.personIdUrl = content.personIdUrl
              this.enclosure.certificateUrl = content.certificateUrl
              // 获取职位的列表，否则部门联动职位失败
              this.getPositionByDeptId(this.accountInfo.deptId)
              // 填充工作经历和家庭成员信息，最少五行
              for (let i = this.baseInfo.workExperiences.length; i < 5; i++) {
                this.baseInfo.workExperiences.push({
                  timeFromTo: '',
                  companyName: '',
                  workContent: '',
                  certifier: '',
                  telephoneNumber: ''
                })
              }
              for (let i = this.baseInfo.familyMembers.length; i < 5; i++) {
                this.baseInfo.familyMembers.push({
                  appellation: '',
                  name: '',
                  workUnit: '',
                  duty: '',
                  telephoneNumber: ''
                })
              }
            } else {
              this.$Message.error(resp.data.msg)
            }
          })
          .catch(err => {
            console.log('err', err)
          })
      }
    },
    // 获取职级部门职位学历师傅列表的下拉框内容
    getSelectionData () {
      this.$axios({
        url: baseUrl + '/user/pageInitCondition',
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.selection.rankList = resp.data.content.rank // 职级
            this.selection.educateList = resp.data.content.educate // 学历
            this.selection.masterList = resp.data.content.master // 师傅列表
            this.selection.clubs = resp.data.content.clubs // 俱乐部信息
            // this.selection.deptList = resp.data.content.deptTree; // 部门已用下拉框替代
            // this.selection.positionList = resp.data.content.position // 职位已经和部门联动
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('getSelectionData', err)
        })
    },
    getPositionByDeptId (deptId) {
      this.validate('deptId')
      this.$axios({
        url: baseUrl + '/structure/findByPosition',
        data: $qs.stringify({ deptId: deptId }),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.selection.positionList = resp.data.content // 职位
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('getPositionByDeptId', err)
        })
    },
    // 获取登录名和企业邮箱
    getBasic () {
      this.accountInfo.nickname = this.accountInfo.nickname.trim()
      if (!this.accountInfo.nickname) return false
      let _this = this.accountInfo
      let sendData = {
        nickname: _this.nickname
      }
      this.$axios({
        url: baseUrl + '/user/getusername',
        data: $qs.stringify(sendData),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            _this.username = resp.data.content.username
            _this.email = resp.data.content.email
            _this.password = resp.data.content.password
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    saveData () {
      // 保存，type="add"为人资开户
      let userId = { id: this.$route.query.id }
      let flag = this.validateAll()
      if (!flag) {
        this.$Message.error('格式错误，请检查')
        return false
      }
      if (this.type === 'add') {
        let _this = this.accountInfo
        let sendData = {
          route: 'addUser',
          tbuser: {
            // 用户对象
            nickname: _this.nickname, // 用户姓名
            username: _this.username, // 用户登录名
            password: _this.password, // 密码
            phone: _this.phone, // 联系方式
            email: _this.email, // 邮箱
            deptId: _this.deptId, // 部门编号
            positionId: _this.positionId, // 职位编号
            roleId: _this.roleId// 角色id
          }
        }
        this.$axios({
          url: baseUrl + '/user/saveuser',
          data: sendData,
          method: 'post'
        })
          .then(resp => {
            if (resp.data.code === 10010) {
              this.$Message.info(resp.data.msg)
              this.closeTag()
            } else {
              this.$Message.error(resp.data.msg)
            }
          })
          .catch(err => {
            console.log('err', err)
          })
      } else if (this.type === 'tbc') {
        this.dateFormat()
        let tbuser = Object.assign(
          this.baseInfo,
          this.accountInfo,
          this.inPositionInfo,
          { personIdUrl: this.enclosure.personIdUrl },
          { certificateUrl: this.enclosure.certificateUrl },
          userId
        )
        this.$axios({
          url: baseUrl + '/user/edituserinfo',
          method: 'post',
          data: {
            backlogId: this.$route.query.backlogId,
            tbuser: tbuser
          }
        })
          .then(res => {
            if (res.data.code === 10040) {
              this.$Message.success(res.data.msg)
            } else {
              this.$Message.error(res.data.msg)
            }
          })
          .catch(err => {
            console.log('tbcSave' + err)
          })
      } else if (this.type === 'edit') {
        // 先把时间格式处理好
        this.dateFormat()
        // 拼接基本信息，个人信息，在职信息，附件，userId
        let tbuser = Object.assign(
          this.baseInfo,
          this.accountInfo,
          this.inPositionInfo,
          { personIdUrl: this.enclosure.personIdUrl },
          { certificateUrl: this.enclosure.certificateUrl },
          userId
        )
        // 没有师傅和职级传-1
        tbuser.masterId = tbuser.masterId ? tbuser.masterId : '-1'
        tbuser.rankId = tbuser.rankId ? tbuser.rankId : '-1'
        this.$axios({
          url: baseUrl + '/user/edituserinfo',
          method: 'post',
          data: {
            backlogId: this.$route.query.backlogId,
            tbuser: tbuser
          }
        })
          .then(res => {
            if (res.data.code === 10040) {
              this.$Message.success(res.data.msg)
              // this.init();
              // 保存成功后跳转到查看页面
              let id = this.$route.query.id
              this.closeTag()
              this.$nextTick(() => {
                this.$router.push({
                  name: 'showUser',
                  query: {
                    id,
                    type: 'show'
                  }
                })
              })
            } else {
              this.$Message.error(res.data.msg)
            }
          })
          .catch(err => {
            console.log('editSave' + err)
          })
      }
    },
    validate (key, value) {
      switch (key) {
        case 'nickname': {
          if (!this.accountInfo.nickname) {
            this.rules.nickname = '非空项'
            return false
          } else {
            this.rules.nickname = ''
            return true
          }
        }
        case 'password': {
          return true
        }
        case 'phone': {
          if (!this.accountInfo.phone) {
            this.rules.phone = '非空项'
            return false
          }
          if (isNaN(this.accountInfo.phone)) {
            this.rules.phone = '请填写数字'
            return false
          } else if (this.accountInfo.phone.length !== 11) {
            this.rules.phone = '手机号11位'
            return false
          } else {
            this.rules.phone = ''
            return true
          }
        }
        case 'deptId': {
          if (!this.accountInfo.deptId) {
            this.rules.deptId = '非空项'
            return false
          } else {
            this.rules.deptId = ''
            return true
          }
        }
        case 'positionId': {
          if (!this.accountInfo.positionId) {
            this.rules.positionId = '非空项'
            return false
          } else {
            this.rules.positionId = ''
            return true
          }
        }
        case 'personId': {
          let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
          this.baseInfo.personId = this.baseInfo.personId.trim()
          if (!reg.test(this.baseInfo.personId)) {
            this.rules.personId = '身份证号码错误'
            return false
          } else {
            let birthday = this.baseInfo.personId.substr(6, 8)
            let Num17 = this.baseInfo.personId.charAt(16)
            // 倒数第二位偶数为女，奇数为男
            if (Num17 % 2 === 0) {
              this.baseInfo.sex = '女'
            } else {
              this.baseInfo.sex = '男'
            }
            // birthday = 19970507 1997-05-07
            let Y = birthday.substr(0, 4)
            let M = birthday.substr(4, 2)
            let D = birthday.substr(6, 2)
            this.baseInfo.birthday = Y + '-' + M + '-' + D
            this.rules.personId = ''
            return true
          }
        }
        case 'sex': {
          if (!this.baseInfo.sex) {
            this.rules.sex = '非空项'
            return false
          } else {
            this.rules.sex = ''
            return true
          }
        }
        case 'birthday': {
          if (!this.baseInfo.birthday) {
            this.rules.birthday = '非空项'
            return false
          } else {
            this.rules.birthday = ''
            return true
          }
        }
        case 'race': {
          if (!this.baseInfo.race) {
            this.rules.race = '非空项'
            return false
          } else {
            this.rules.race = ''
            return true
          }
        }
        case 'householdType': {
          if (!this.baseInfo.householdType) {
            this.rules.householdType = '非空项'
            return false
          } else {
            this.rules.householdType = ''
            return true
          }
        }
        case 'maritalStatus': {
          if (!this.baseInfo.maritalStatus) {
            this.rules.maritalStatus = '非空项'
            return false
          } else {
            this.rules.maritalStatus = ''
            return true
          }
        }
        case 'permanentAddress': {
          if (!this.baseInfo.permanentAddress) {
            this.rules.permanentAddress = '非空项'
            return false
          } else {
            this.rules.permanentAddress = ''
            return true
          }
        }
        case 'homeAddress': {
          if (!this.baseInfo.homeAddress) {
            this.rules.homeAddress = '非空项'
            return false
          } else {
            this.rules.homeAddress = ''
            return true
          }
        }
        case 'graduateSchool': {
          if (!this.baseInfo.graduateSchool) {
            this.rules.graduateSchool = '非空项'
            return false
          } else {
            this.rules.graduateSchool = ''
            return true
          }
        }
        case 'graduateDate': {
          if (!this.baseInfo.graduateDate) {
            this.rules.graduateDate = '非空项'
            return false
          } else {
            this.rules.graduateDate = ''
            return true
          }
        }
        case 'educateId': {
          if (!this.baseInfo.educateId) {
            this.rules.educateId = '非空项'
            return false
          } else {
            this.rules.educateId = ''
            return true
          }
        }
        case 'politicsFace': {
          if (!this.baseInfo.politicsFace) {
            this.rules.politicsFace = '非空项'
            return false
          } else {
            this.rules.politicsFace = ''
            return true
          }
        }
        case 'personIdUrl': {
          if (this.enclosure.personIdUrl.length === 0) {
            this.$Message.info('身份证照片必须上传')
            return false
          } else {
            return true
          }
        }
        case 'leaveDate': {
          if (!this.inPositionInfo.leaveDate) {
            this.rules.leaveDate = '非空项'
            return false
          } else {
            this.rules.leaveDate = ''
            return true
          }
        }
      }
    },
    validateAll () {
      if (this.type === 'add') {
        let validateList = ['phone', 'deptId', 'positionId']
        return validateList.every(key => {
          return this.validate(key)
        })
      } else if (this.type === 'tbc') {
        let validateList = [
          'personId',
          'sex',
          'birthday',
          'race',
          'maritalStatus',
          'permanentAddress',
          'homeAddress',
          'graduateSchool',
          'graduateDate',
          'educateId',
          'politicsFace',
          'personIdUrl'
        ]
        return validateList.every(key => {
          return this.validate(key)
        })
      } else {
        let validateList = [
          'phone',
          'deptId',
          'positionId',
          'personId',
          'sex',
          'birthday',
          'race',
          'maritalStatus',
          'permanentAddress',
          'homeAddress',
          'graduateSchool',
          'graduateDate',
          'educateId',
          'politicsFace',
          'personIdUrl'
        ]
        // 如果离职，离职日期必填
        if (this.isLeave) {
          validateList.push('leaveDate')
        }
        return validateList.every(key => {
          return this.validate(key)
        })
      }
    },
    getdeptList () {
      // 获取部门下拉列表
      this.$axios({
        url: baseUrl + '/structure/findDeptList',
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.selection.deptList = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log('editSave' + err)
        })
    },
    // 获取角色列表
    getRoleList () {
      this.$axios({
        url: baseUrl + '/permission/lookRole',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.selection.roleList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    dateFormat () {
      // 基础信息
      this.baseInfo.birthday = DatetoString(this.baseInfo.birthday)
      this.baseInfo.graduateDate = DatetoMonthString(
        this.baseInfo.graduateDate
      ) // 毕业精确到月份
      this.baseInfo.driveLicenseDate = DatetoString(
        this.baseInfo.driveLicenseDate
      )
      // 在职信息
      this.inPositionInfo.entryDate = DatetoString(
        this.inPositionInfo.entryDate
      )
      this.inPositionInfo.contractStartDate = DatetoString(
        this.inPositionInfo.contractStartDate
      )
      this.inPositionInfo.contractEndDate = DatetoString(
        this.inPositionInfo.contractEndDate
      )
      this.inPositionInfo.conversionDate = DatetoString(
        this.inPositionInfo.conversionDate
      )
      // 离职时间
      this.inPositionInfo.leaveDate = DatetoString(
        this.inPositionInfo.leaveDate
      )
      // 公积金起始月份
      this.inPositionInfo.fundStartDate = DatetoMonthString(
        this.inPositionInfo.fundStartDate
      )
      // 社保起始月份
      this.inPositionInfo.socialSecurityDate = DatetoMonthString(
        this.inPositionInfo.socialSecurityDate
      )
    },
    addTrains () {
      this.inPositionInfo.trains.push({
        trainDate: '',
        trainPlace: '',
        trainContent: ''
      })
    },
    // 密码隐藏显示
    changePass (value) {
      this.visible = !(value === 'show')
    },
    // 手动关闭标签页
    closeTag () {
      bus.$emit('on-myclose', this.$route)
    },
    // 图片上传成功回调函数
    uploadSuccess (type, response, file, fileList) {
      // response是图片上传接口返回的消息,rel===true时，msg为图片相对路径
      if (response.rel === true) {
        // type可能有personIdUrl、certificateUrl
        this.enclosure[type].push({
          name: type,
          status: 0,
          url: response.msg
        })
      } else {
        console.error(response.msg)
      }
    },
    deleteImg (type, index) {
      this.enclosure[type].splice(index, 1)
    },
    editTable (obj, type, index, key, value) {
      let newValue = value
      this[obj][type][index][key] = newValue
    }
  },
  computed: {
    type () {
      // add代表人资开户,tbc为新人录入，edit为人资编辑
      return this.$route.query.type || 'edit'
    },
    isAdd () {
      // 开户
      return this.type === 'add'
    },
    isNewPerson () {
      // 新人第一次编辑个人信息
      return this.type === 'tbc'
    },
    isHrEdit () {
      // 人资编辑
      return this.$route.query.type === 'edit' && true // 且是hr
    },
    isLeave () {
      return this.inPositionInfo.userStatus === 1
    }
  },
  watch: {
    $route (to, from) {
      this.init()
    }
  }
}
</script>

<style>
#addUser {
  padding: 20px;
}

#addUser .rowMargin {
  margin: 10px;
}
#addUser .addBtn {
  width: 100%;
}
#addUser .addBtn {
  background-color: #19aa8d;
  border-color: #19aa8d;
}
#addUser table input {
  border-radius: unset;
  border: none;
  border-bottom: 1px solid #dcdee2;
  outline: none;
}
#addUser table .ivu-input:focus {
  /* border-radius: unset;
  border: none;
  border-bottom: 1px solid #dcdee2; */
}

#addUser .addBtn:hover {
  background-color: #19aa8d;
  border-color: #19aa8d;
}

#addUser .title {
  text-align: right;
  line-height: 30px;
  color: #000;
  font-weight: 600;
}

#addUser h3 {
  text-indent: 5em;
  color: #3db79f;
  background-color: #f2f2f2;
}
#addUser .inputbox {
  position: relative;
}
#addUser .tips {
  line-height: 32px;
  float: left;
  min-width: 100px;
  position: absolute;
  color: red;
}

#addUser i.require {
  color: red;
  margin-right: 5px;
}

#addUser .imgbox {
  width: 100%;
  display: inline-block;
  position: relative;
}

#addUser img.inputbox {
  height: 100px;
  width: 100%;
  padding-left: 10px;
}

#addUser .close {
  display: inline-block;
  cursor: pointer;
  color: red;
  position: absolute;
  right: -5px;
  top: -5px;
  width: 20px;
  height: 20px;
  z-index: 2;
}

#addUser h3::before {
  content: "";
  display: inline-block;
  background-color: #34b49a;
  width: 3px;
  height: 1em;
  position: relative;
  top: 2px;
  left: -32px;
}

.actionButton {
  margin-top: 30px;
}

#addUser .actionButton .saveData.ivu-btn-primary {
  background-color: #19aa8d;
  border-color: #19aa8d;
  color: #fff;
  margin-right: 20px;
}
</style>
