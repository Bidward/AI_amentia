<template>
  <div>
    <Card id="editCompany" v-if="isPerson">
      <div class="baseInfo">
        <h3>基本信息</h3>
        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>类型：
          </Col>
          <Col span="5">
            <Select
              v-model="company.companyTypeName"
              @on-open-change="validate('companyTypeList')"
              class="inputbox"
            >
              <Option
                v-for="(item,index) in selectList.companyTypeList"
                :value="item"
                :key="index"
              >{{ item }}</Option>
            </Select>
            <p class="tips">{{rules.companyTypeName}}</p>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>状态：
          </Col>
          <Col span="5">
            <Select v-model="company.companyStatus" class="inputbox">
              <Option :value="0">启用</Option>
              <Option :value="1">禁用</Option>
            </Select>
            <p class="tips">{{rules.companyStatus}}</p>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>姓名：
          </Col>
          <Col span="5">
            <Input
              v-model="company.companyName"
              class="inputbox"
              @on-blur="validate('companyName')"
            ></Input>
            <p class="tips">{{rules.companyName}}</p>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>身份证号码：
          </Col>
          <Col span="5">
            <Input
              v-model="company.companyLegalPersonid"
              @on-blur="validate('companyLegalPersonid')"
              class="inputbox"
            ></Input>
            <p class="tips">{{rules.companyLegalPersonid}}</p>
          </Col>
        </Row>
      </div>
      <div class="accountInfo">
        <h3>账户信息</h3>

        <Row class="rowMargin" v-for="(row,index) in company.accounts" :key="index">
          <Col class="title" span="3">
            <i class="require">*</i>开户行：
          </Col>
          <Col span="5">
            <Input class="inputbox" v-model="company.accounts[index].accountBankName"></Input>
            <p class="tips">{{rules.accounts[index].accountBankName}}</p>
          </Col>
          <Col class="title" span="3" offset="2">
            <i class="require">*</i>账号：
          </Col>
          <Col span="5">
            <Input class="inputbox" v-model="company.accounts[index].account"></Input>
            <p class="tips">{{rules.accounts[index].account}}</p>
          </Col>
          <Col span="1" offset="1">
            <img :src="imgs.addImg" @click="handlAddAccount" class="operationImg" />
          </Col>
          <Col span="1">
            <img
              :src="imgs.reduceImg"
              @click="handlRemoveAccount(index)"
              v-if="company.accounts.length>=2"
              class="operationImg"
            />
          </Col>
        </Row>
      </div>
      <!-- 个人类型没有返税信息 -->
      <div class="supply">
        <h3>补充资料</h3>
        <Row class="rowMargin" v-for="(rows,index) in company.companyEnclosure" :key="index">
          <Col span="3" class="title">
            <span>补充资料：</span>
          </Col>
          <Col span="5">
            <Select v-model="rows.type" class="inputbox">
              <Option
                v-for="item in selectList.supplyList"
                :key="item.id"
                :value="item.id"
                :label="item.optionName"
              />
            </Select>
          </Col>
          <Col class="title" span="3" offset="2">文件上传：</Col>
          <Col span="5">
            <Upload
              v-if="isUpload"
              multiple
              class="bzUpload"
              name="fileData"
              :max-size="20480"
              :show-upload-list="false"
              :on-success="(value)=> supplyUploadSuccess(index,value)"
              :action="staticUrl+'/index.php'"
            >
              <Button icon="ios-cloud-upload-outline">单个文件不能超过20MB</Button>
            </Upload>
            <ul>
              <li class="supplyList" v-for="(file,findex) in  rows.enclosure" :key="findex">
                <a
                  :class="{green:file.isAdd===1}"
                  :href="staticUrl+file.enclosureUrl"
                  target="_blank"
                >{{file.enclosureName}}</a>
                <span
                  class="delSupply"
                  v-if="isUpload"
                  @click="delFile(index,findex,file.enclosureName)"
                >X</span>
              </li>
            </ul>
            <div class="operation" v-if="!isUpload">
              <Button
                :type="rows.agree===1?'success':'default'"
                class="btn"
                @click="rows.agree=1"
              >正确</Button>
              <Button :type="rows.agree===2?'error':'default'" class="btn" @click="rows.agree=2">错误</Button>
            </div>
            <span v-if="isUpload" style="color:red">{{rows.agree===2?'文件上传有误':''}}</span>
          </Col>
          <Col span="1" offset="1">
            <img :src="imgs.addImg" v-if="isUpload" @click="handlAddSupply" class="operationImg" />
          </Col>
          <Col span="1">
            <img
              :src="imgs.reduceImg"
              @click="handlRemoveSupply(index)"
              v-if="isUpload&&company.companyEnclosure.length>=2"
              class="operationImg"
            />
          </Col>
        </Row>
      </div>
      <div class="enclosure">
        <h3>附件</h3>
        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>身份证：
          </Col>
          <Col span="17">
            <div
              v-for="(img,i) in company.personIdUrl"
              :key="i"
              style="float:left;position:relative"
            >
              <img
                v-if="isUpload"
                :src="imgs.delImg"
                class="close"
                @click="deleteImg('personIdUrl',i)"
              />
              <viewer style="width:153px;">
                <div class="imgbox">
                  <img :src="staticUrl+img.url" class="inputbox" />
                </div>
                <div class="operation" v-if="!isUpload">
                  <Button
                    :type="img.status===1?'success':'default'"
                    class="btn"
                    @click="img.status=1"
                  >正确</Button>
                  <Button
                    :type="img.status===2?'error':'default'"
                    class="btn"
                    @click="img.status=2"
                  >错误</Button>
                </div>
                <span
                  v-if="isUpload"
                  style="margin-left:15px;;color:red"
                >{{img.status===2?'图片错误':''}}</span>
              </viewer>
            </div>
            <Upload
              v-if="isUpload"
              ref="upload"
              :format="['jpg','jpeg','png']"
              :max-size="20480"
              :show-upload-list="false"
              multiple
              name="fileData"
              :on-success="(value)=> uploadSuccess('personIdUrl', value)"
              type="drag"
              :action="staticUrl+'/index.php'"
              style="width:153px;padding-left: 10px;display:inline-block"
            >
              <div style="50%;line-height: 100px;padding-left:10px;">
                <Icon type="ios-camera" size="40"></Icon>
              </div>
            </Upload>
          </Col>
        </Row>
      </div>
      <div class="notice" v-if="showOwnerName">
        <h3>通知</h3>
        <Row class="code-row-bg">
          <Col span="5" push="8">
            <div style="text-align:center;margin:0 auto;cursor:pointer">
              <Icon @click="showNotic=true" type="ios-contacts" size="50" style="color: #515a6e;"></Icon>
              <p v-if="ownerName">{{ownerName}}</p>
              <p v-else>选择通知人</p>
            </div>
            <Modal
              :mask-closable="false"
              v-model="showNotic"
              @on-cancel="clearOwnerName"
              title="选择通知人"
            >
              <Select
                filterable
                clearable
                v-model="ownerId"
                style="width:100%"
                @on-change="obj=>ownerName=obj?obj.label:''"
                label-in-value
              >
                <!-- <Option v-for="item in personList" :value="item.id" :key="item.id">{{ item.nickname }}</Option> -->
                <Option
                  v-for="person in personList"
                  :value="person.id"
                  :key="person.id"
                  :label="person.nickname"
                >
                  <h3 class="demo-auto-complete-title">{{ person.nickname }}</h3>
                  <span style="width:50%;display:inline-block">部门：{{person.deptName}}</span>
                  <span style="width:50%;display:inline-block">职位：{{person.positionName}}</span>
                </Option>
              </Select>
            </Modal>
          </Col>
        </Row>
      </div>
      <div class="compare" v-if="showCompare">
        <h3>信息对比</h3>
        <Table :columns="compare.header" :data="compare.data"></Table>
      </div>
      <div class="save">
        <Row type="flex" justify="center" class="code-row-bg">
          <Col span="3">
            <Button
              size="large"
              style="background-color: #19AA8D;border-color: #19AA8D;color: #fff;"
              @click="save"
            >保存</Button>
          </Col>
          <Col span="3">
            <Button size="large" @click="closeTag">取消</Button>
          </Col>
        </Row>
      </div>
    </Card>
    <Card id="editCompany" v-else>
      <div class="baseInfo">
        <h3>基本信息</h3>
        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>公司类型：
          </Col>
          <Col span="5">
            <Select v-model="company.companyTypeName" class="inputbox">
              <Option
                v-for="(item,index) in selectList.companyTypeList"
                :value="item"
                :key="index"
              >{{ item }}</Option>
            </Select>
            <p class="tips">{{rules.companyTypeName}}</p>
          </Col>
          <Col span="3" offset="2" class="title" v-if="hasShareholder">
            <i class="require">*</i>股东：
          </Col>
          <Col span="5" v-if="hasShareholder">
            <Input
              v-model="company.companyShareholder"
              class="inputbox"
              @on-blur="validate('companyShareholder')"
            ></Input>
            <p class="tips">{{rules.companyShareholder}}</p>
          </Col>
        </Row>

        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>公司名称：
          </Col>
          <Col span="5">
            <Input
              v-model="company.companyName"
              class="inputbox"
              @on-blur="validate('companyName')"
            ></Input>
            <p class="tips">{{rules.companyName}}</p>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>统一社会信用代码：
          </Col>
          <Col span="5">
            <Input
              v-model="company.companyCode"
              class="inputbox"
              @on-blur="validate('companyCode')"
            ></Input>
            <p class="tips">{{rules.companyCode}}</p>
          </Col>
        </Row>

        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>法定代表人：
          </Col>
          <Col span="5">
            <Input
              v-model="company.companyLegal"
              class="inputbox"
              @on-blur="validate('companyLegal')"
            ></Input>
            <p class="tips">{{rules.companyLegal}}</p>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>实缴资本：
          </Col>
          <Col span="5">
            <Input
              v-model="company.companyActualCapital"
              class="inputbox"
              @on-blur="validate('companyActualCapital')"
            ></Input>
            <p class="tips">{{rules.companyActualCapital}}</p>
          </Col>
        </Row>

        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>法人身份证号：
          </Col>
          <Col span="5">
            <Input
              v-model="company.companyLegalPersonid"
              @on-blur="validate('companyLegalPersonid')"
              class="inputbox"
            ></Input>
            <p class="tips">{{rules.companyLegalPersonid}}</p>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>成立日期：
          </Col>
          <Col span="5">
            <DatePicker
              type="date"
              format="yyyy-MM-dd"
              v-model="company.companyStarttime"
              @on-change="company.companyStarttime=$event"
              placeholder="成立日期"
              class="inputbox"
              :options="startTime"
            ></DatePicker>
            <p class="tips">{{rules.companyStarttime}}</p>
          </Col>
        </Row>

        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>注册资本：
          </Col>
          <Col span="5">
            <Input
              v-model="company.companyRegisterCapital"
              @on-blur="validate('companyRegisterCapital')"
              class="inputbox"
            ></Input>
            <p class="tips">{{rules.companyRegisterCapital}}</p>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>经营期限自：
          </Col>
          <Col span="5">
            <DatePicker
              type="date"
              format="yyyy-MM-dd"
              v-model="company.companyStarttimeFrom"
              @on-change="company.companyStarttimeFrom=$event"
              placeholder="经营期限自"
              class="inputbox"
            ></DatePicker>
            <p class="tips">{{rules.companyStarttimeFrom}}</p>
          </Col>
        </Row>

        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>登记机关：
          </Col>
          <Col span="5">
            <Input
              v-model="company.companyRegisterOffice"
              @on-blur="validate('companyRegisterOffice')"
              class="inputbox"
            ></Input>
            <p class="tips">{{rules.companyRegisterOffice}}</p>
          </Col>
          <Col span="3" offset="2" class="title">
            <!-- <i class="require">*</i> -->
            经营期限至：
          </Col>
          <Col span="5">
            <DatePicker
              type="date"
              v-model="company.companyStarttimeEnd"
              @on-change="company.companyStarttimeEnd=$event"
              placeholder="经营期限至"
              format="yyyy-MM-dd"
              class="inputbox"
            ></DatePicker>
            <p class="tips">{{rules.companyStarttimeEnd}}</p>
          </Col>
        </Row>

        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>住所：
          </Col>
          <Col span="5">
            <Input
              v-model="company.companyAddress"
              @on-blur="validate('companyAddress')"
              class="inputbox"
            ></Input>
            <p class="tips">{{rules.companyAddress}}</p>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>状态：
          </Col>
          <Col span="5">
            <Select v-model="company.companyStatus" class="inputbox">
              <Option :value="0">启用</Option>
              <Option :value="1">禁用</Option>
            </Select>
            <p class="tips">{{rules.companyStatus}}</p>
          </Col>
        </Row>
        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>电话：
          </Col>
          <Col span="5">
            <Input
              v-model="company.companyTel"
              @on-blur="validate('companyTel')"
              class="inputbox"
              :autosize="{minRows: 3}"
            ></Input>
            <p class="tips">{{rules.companyTel}}</p>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>经营范围：
          </Col>
          <Col span="5">
            <Input
              v-model="company.companyScope"
              @on-blur="validate('companyScope')"
              class="inputbox"
              :autosize="{minRows: 3}"
              type="textarea"
            ></Input>
            <p class="tips">{{rules.companyScope}}</p>
          </Col>
        </Row>
      </div>
      <div class="accountInfo">
        <h3>账户信息</h3>

        <Row class="rowMargin" v-for="(row,index) in company.accounts" :key="index">
          <Col class="title" span="3">
            <i class="require">*</i>账户类型：
          </Col>
          <Col span="2">
            <!-- 如果是第一行，渲染所有类型 -->
            <Select v-model="company.accounts[index].accountTypeName" class="inputbox">
              <Option
                v-for="(item1,index2) in selectList.accountTypeList"
                :value="item1"
                :key="index2"
              >{{ item1 }}</Option>
            </Select>
            <p class="tips">{{rules.accounts[index].accountTypeName}}</p>
          </Col>
          <Col class="title" span="3">
            <i class="require">*</i>开户行：
          </Col>
          <Col span="3">
            <Input class="inputbox" v-model="company.accounts[index].accountBankName"></Input>
            <p class="tips">{{rules.accounts[index].accountBankName}}</p>
          </Col>
          <Col class="title" span="2">
            <i class="require">*</i>账号：
          </Col>
          <Col span="5">
            <Input class="inputbox" v-model="company.accounts[index].account"></Input>
            <p class="tips">{{rules.accounts[index].account}}</p>
          </Col>
          <Col span="1" offset="1">
            <img @click="handlAddAccount" :src="imgs.addImg" class="operationImg" />
          </Col>
          <Col span="1">
            <img
              :src="imgs.reduceImg"
              @click="handlRemoveAccount(index)"
              v-if="company.accounts.length>=2"
              class="operationImg"
            />
          </Col>
        </Row>
      </div>
      <div class="taxrebate">
        <h3>返税信息</h3>
        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>返税比例：
          </Col>
          <Col span="5">
            <Input
              v-model="company.taxrebateRate"
              class="inputbox"
              placeholder="返税百分比"
              @on-blur="validate('taxrebateRate')"
            >
              <span slot="append">%</span>
            </Input>
            <p class="tips">{{rules.taxrebateRate}}</p>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>返税类型：
          </Col>
          <Col span="5">
            <Select v-model="company.taxrebateTypeName" class="inputbox">
              <Option
                v-for="(item,index) in selectList.taxrebateTypeList"
                :value="item"
                :key="index"
              >{{ item }}</Option>
            </Select>
            <p class="tips">{{rules.taxrebateTypeList}}</p>
          </Col>
        </Row>
      </div>
      <div class="supply">
        <h3>补充资料</h3>
        <Row class="rowMargin" v-for="(rows,index) in company.companyEnclosure" :key="index">
          <Col span="3" class="title">
            <span>补充资料：</span>
          </Col>
          <Col span="5">
            <Select v-model="rows.type" class="inputbox">
              <Option
                v-for="item in selectList.supplyList"
                :key="item.id"
                :value="item.id"
                :label="item.optionName"
              />
            </Select>
          </Col>
          <Col class="title" span="3" offset="2">文件上传：</Col>
          <Col span="5">
            <Upload
              v-if="isUpload"
              multiple
              class="bzUpload"
              name="fileData"
              :max-size="20480"
              :show-upload-list="false"
              :on-success="(value)=> supplyUploadSuccess(index,value)"
              :action="staticUrl+'/index.php'"
            >
              <Button icon="ios-cloud-upload-outline">单个文件不能超过20MB</Button>
            </Upload>
            <ul>
              <li class="supplyList" v-for="(file,findex) in  rows.enclosure" :key="findex">
                <a
                  :class="{green:file.isAdd===1}"
                  :href="staticUrl+file.enclosureUrl"
                  target="_blank"
                >{{file.enclosureName}}</a>
                <span
                  class="delSupply"
                  v-if="isUpload"
                  @click="delFile(index,findex,file.enclosureName)"
                >X</span>
              </li>
            </ul>
            <div class="operation" v-if="!isUpload">
              <Button
                :type="rows.agree===1?'success':'default'"
                class="btn"
                @click="rows.agree=1"
              >正确</Button>
              <Button :type="rows.agree===2?'error':'default'" class="btn" @click="rows.agree=2">错误</Button>
              <span v-if="isUpload" style="color:red">{{rows.agree===2?'文件上传有误':''}}</span>
            </div>
          </Col>
          <Col span="1" offset="1">
            <img :src="imgs.addImg" @click="handlAddSupply" class="operationImg" />
          </Col>
          <Col span="1">
            <img
              :src="imgs.reduceImg"
              @click="handlRemoveSupply(index)"
              v-if="company.companyEnclosure.length>=2"
              class="operationImg"
            />
          </Col>
        </Row>
      </div>
      <div class="enclosure">
        <h3>附件</h3>
        <Row class="rowMargin">
          <Col span="3" class="title">
            <i class="require">*</i>营业执照：
          </Col>
          <Col span="5">
            <div
              v-for="(img,i) in company.licenseUrls"
              :key="i"
              style="width:50%;float:left;position:relative"
            >
              <img
                v-if="isUpload"
                :src="imgs.delImg"
                class="close"
                @click="deleteImg('licenseUrls',i)"
              />
              <viewer>
                <div class="imgbox">
                  <img :src="staticUrl+img.url" class="inputbox" />
                </div>
                <div class="operation" v-if="!isUpload">
                  <Button
                    class="btn"
                    :type="img.status===1?'success':'default'"
                    @click="img.status=1"
                  >正确</Button>
                  <Button
                    class="btn"
                    :type="img.status===2?'error':'default'"
                    @click="img.status=2"
                  >错误</Button>
                </div>
                <span v-if="isUpload" style="color:red">{{img.status===2?'图片错误':''}}</span>
              </viewer>
            </div>
            <Upload
              v-if="isUpload"
              ref="upload"
              :format="['jpg','jpeg','png']"
              :max-size="20480"
              multiple
              :show-upload-list="false"
              name="fileData"
              :on-success="(value)=> uploadSuccess('licenseUrls', value)"
              type="drag"
              :action="staticUrl+'/index.php'"
              style="width:50%;padding-left: 10px;display:inline-block"
            >
              <div style="50%;line-height: 100px;padding-left:10px;">
                <Icon type="ios-camera" size="40"></Icon>
              </div>
            </Upload>
          </Col>
          <Col span="3" offset="2" class="title">
            <i class="require">*</i>银行开户许可证：
          </Col>
          <Col span="5">
            <div
              v-for="(img,i) in company.bankLicenseUrls"
              :key="i"
              style="width:50%;float:left;position:relative"
            >
              <img
                v-if="isUpload"
                :src="imgs.delImg"
                class="close"
                @click="deleteImg('bankLicenseUrls',i)"
              />
              <viewer>
                <div class="imgbox">
                  <img :src="staticUrl+img.url" class="inputbox" />
                </div>
                <div class="operation" v-if="!isUpload">
                  <Button
                    class="btn"
                    :type="img.status===1?'success':'default'"
                    @click="img.status=1"
                  >正确</Button>
                  <Button
                    class="btn"
                    :type="img.status==2?'error':'default'"
                    @click="img.status=2"
                  >错误</Button>
                </div>
                <span v-if="isUpload" style="color:red">{{img.status===2?'图片错误':''}}</span>
              </viewer>
            </div>
            <Upload
              v-if="isUpload"
              ref="upload"
              :format="['jpg','jpeg','png']"
              :max-size="20480"
              :show-upload-list="false"
              multiple
              name="fileData"
              :on-success="(value)=> uploadSuccess('bankLicenseUrls', value)"
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
      <div class="notice" v-if="showOwnerName">
        <h3>通知</h3>
        <Row class="code-row-bg">
          <Col span="5" push="8">
            <div style="text-align:center;margin:0 auto;cursor:pointer">
              <Icon @click="showNotic=true" type="ios-contacts" size="50" style="color: #515a6e"></Icon>
              <p v-if="ownerName">{{ownerName}}</p>
              <p v-else>选择通知人</p>
            </div>
            <Modal
              :mask-closable="false"
              v-model="showNotic"
              @on-cancel="clearOwnerName"
              title="选择通知人"
            >
              <Select
                filterable
                clearable
                v-model="ownerId"
                style="width:100%"
                @on-change="obj=>ownerName=obj?obj.label:''"
                label-in-value
              >
                <!-- <Option v-for="item in personList" :value="item.id" :key="item.id">{{ item.nickname }}</Option> -->
                <Option
                  v-for="person in personList"
                  :value="person.id"
                  :key="person.id"
                  :label="person.nickname"
                >
                  <h3 class="demo-auto-complete-title">{{ person.nickname }}</h3>
                  <span style="width:50%;display:inline-block">部门：{{person.deptName}}</span>
                  <span style="width:50%;display:inline-block">职位：{{person.positionName}}</span>
                </Option>
              </Select>
            </Modal>
          </Col>
        </Row>
      </div>
      <div class="compare" v-if="showCompare">
        <h3>信息对比</h3>
        <Table :columns="compare.header" :data="compare.data"></Table>
      </div>
      <div class="save">
        <Row type="flex" justify="center" class="code-row-bg">
          <Col span="3">
            <Button
              size="large"
              style="background-color: #19AA8D;border-color: #19AA8D;color: #fff;"
              @click="save"
            >保存</Button>
          </Col>
          <Col span="3">
            <Button size="large" @click="closeTag">取消</Button>
          </Col>
        </Row>
      </div>
    </Card>
  </div>
</template>

<script>
import { baseUrl, staticUrl } from '@/api/base.js'
import { DatetoString } from '@/libs/tools.js'
import addImg from '@/assets/images/add.png'
import reduceImg from '@/assets/images/reduce.png'
import delImg from '@/assets/images/close.png'

export default {
  name: 'addCompany',
  mounted () {
    this.init()
    this.getSupplyList()
  },
  data () {
    return {
      imgs: {
        addImg,
        reduceImg,
        delImg
      },
      staticUrl,
      selectList: {
        companyTypeList: [
          '个人独资企业',
          '股份有限公司',
          '有限责任公司',
          '个人'
        ],
        accountTypeList: ['基本户', '一般户', '支付宝'],
        taxrebateTypeList: ['年返', '月返', '季返'],
        supplyList: []
      },

      accountTypeWithoutBase: ['一般户', '支付宝'],
      company: {
        companyTypeName: '', // 公司类型
        companyName: '', // 公司名称
        companyCode: '', // 统一社会信用代码
        companyLegal: '', // 法定代表人
        companyShareholder: '', // 股东
        companyActualCapital: '', // 实缴资本
        companyLegalPersonid: '', // 法人身份证号
        companyStarttime: '', // 成立日期
        companyRegisterCapital: '', // 注册资本
        companyStarttimeFrom: '', // 经营期限自
        companyStarttimeEnd: '', // 经营期限至
        companyRegisterOffice: '', // 登记机关
        companyAddress: '', // 住所
        companyStatus: 0, // 状态0启用1禁用
        companyTel: '', // 电话号码
        companyScope: '', // 经营范围
        accounts: [
          // 账户类型
          {
            accountTypeName: '', // 账户类型名
            accountBankName: '', // 开户行
            account: '' // 账号
          }
        ],
        taxrebateRate: '', // 返税比例
        taxrebateTypeName: '', // 返税类型
        // 图片地址相对路径！
        // 营业执照
        licenseUrls: [
          // {name:'营业执照',status:0,url:'Uploads/20190226/443e084efeba3a9e28f02b482870967b.jpg'},
        ],
        // 银行开户许可
        bankLicenseUrls: [
          // {name:'银行开户许可',status:0,url:'Uploads/20190226/443e084efeba3a9e28f02b482870967b.jpg'},
        ],
        // 账户类型为个人时，身份证图片
        personIdUrl: [
          // {name: "银行开户许可",status: 0, url: "Uploads/20190226/443e084efeba3a9e28f02b482870967b.jpg"}
        ],
        // 补充资料
        companyEnclosure: [
          {
            type: '',
            agree: 0,
            enclosure: []
          }
        ]
      },
      ownerName: '', // 通知人的名字
      ownerId: '', // 通知人id
      // 验证规则和回显内容提示绑定占位字段
      rules: {
        companyTypeName: '', // 公司类型
        companyName: '', // 公司名称
        companyCode: '', // 统一社会信用代码
        companyLegal: '', // 法定代表人
        companyShareholder: '', // 股东
        companyActualCapital: '', // 实缴资本
        companyLegalPersonid: '', // 法人身份证号
        companyStarttime: '', // 成立日期
        companyRegisterCapital: '', // 注册资本
        companyStarttimeFrom: '', // 经营期限自
        companyStarttimeEnd: '', // 经营期限至
        companyRegisterOffice: '', // 登记机关
        companyAddress: '', // 住所
        companyStatus: '', // 状态0启用1禁用
        companyTel: '', // 电话号码
        companyScope: '', // 经营范围
        accounts: [{ accountTypeName: '', accountBankName: '', account: '' }], // 账户类型
        taxrebateRate: '', // 返税比例
        taxrebateType: '', // 返税类型
        license: [], // 营业执照
        bankLicense: [], // 银行开户许可
        personIdUrl: [] // 账户类型为个人时，身份证图片
      },
      startTime: {
        disabledDate (date) {
          // 今天之前
          return date && date.valueOf() > Date.now() - 86400000
        }
      },
      compare: {
        header: [
          // 比较信息的表头
          { title: '不同项', key: 'type' },
          { title: '张三', key: 'name1' },
          { title: '李四', key: 'name2' }
        ],
        data: [
          // 比较信息的内容
          { type: '注册资本', name1: '1', name2: '3' },
          { type: '成立日期', name1: '2', name2: '4' },
          { type: '注册资本', name1: '3', name2: '4' }
        ]
      },
      // personNameList: [], // 通知人姓名列表
      personList: [], // 通知人列表
      showNotic: false, // 通知人弹窗
      isInitiator: '1', // 是否为发起人,0是1否，字符串类型
      schedule: '', // 两人两遍进度0待二次录入1两次录入不一致2待二次编辑3待二次删除，字符串类型
      showCompare: false // 是否展示对比信息
    }
  },
  computed: {
    hasShareholder () {
      let hasShareholderCompany = ['股份有限公司', '有限责任公司'] // 有股东的公司名
      return hasShareholderCompany.includes(this.company.companyTypeName)
    },
    isPerson () {
      return this.company.companyTypeName === '个人'
    },
    // 是否有上传图片的权限
    isUpload () {
      // 是发起人或者状态为添加的或者第一次编辑
      return (
        this.isInitiator === '0' || this.type === 'add' || this.type === 'show'
      )
    },
    examineImg () {
      // 两人两遍进度为待二次录入，二次录入不一致，待二次编辑时，且不为发起人必审核图片
      return (
        (this.schedule === '0' ||
          this.schedule === '1' ||
          this.schedule === '2') &&
        this.isInitiator === '1'
      )
    },
    type () {
      return this.$route.query.type || 'show'
    },
    showOwnerName () {
      // 是否显示通知人
      // 是发起人，状态为add或者show
      return (
        this.isInitiator === '0' || this.type === 'add' || this.type === 'show'
      )
    }
  },
  methods: {
    save () {
      if (!this.checkAll()) {
        this.$Message.error('格式有误，请检查')
        return false
      }
      let me = this
      me.company.companyStarttime = DatetoString(me.company.companyStarttime)
      me.company.companyStarttimeFrom = DatetoString(
        me.company.companyStarttimeFrom
      )
      me.company.companyStarttimeEnd = DatetoString(
        me.company.companyStarttimeEnd
      )
      switch (this.type) {
        case 'add': {
          this.$axios({
            url: baseUrl + '/company/singleentry',
            method: 'post',
            data: {
              company: me.company,
              route: 'editCompany',
              ownerId: me.ownerId
            }
          })
            .then(res => {
              if (res.data.code === 10010) {
                this.$Modal.info({
                  title: '通知',
                  content: res.data.msg,
                  onOk () {
                    me.closeTag()
                  }
                })
              } else {
                this.$Message.success(res.data.msg)
              }
            })
            .catch(err => {
              console.error(err)
            })
          break
        }
        case 'tbc': {
          this.$axios({
            url: baseUrl + '/company/edittbc',
            method: 'post',
            data: {
              company: me.company,
              route: 'editCompany',
              ownerId: me.ownerId,
              schedule: this.schedule, // 两人两遍操作进度
              isInitiator: this.isInitiator // 是否为发起人,0是1否
            }
          })
            .then(res => {
              if (res.data.code === 10020) {
                // 两人两遍通过，弹窗关闭标签页
                this.$Modal.warning({
                  title: '通知',
                  content: res.data.msg
                })
                this.closeTag()
              } else if (res.data.code === 10021) {
                // 提交失败，对比信息不正确
                this.$Modal.warning({
                  title: '通知',
                  content: '信息不一致，请查看对比信息'
                })
                this.compare = res.data.content.compareResult
                this.showCompare = true
              } else if (res.data.code === 10022) {
                this.$Message.success(res.data.msg)
                this.closeTag()
              } else {
                this.$Message.error(res.data.msg)
              }
            })
            .catch(err => {
              console.error(err)
            })
          break
        }
        default: {
          // 第一次编辑
          // 需要通知人，图片可编辑
          this.$axios({
            url: baseUrl + '/company/edit',
            method: 'post',
            data: {
              company: me.company,
              route: 'editCompany',
              ownerId: me.ownerId
            }
          })
            .then(res => {
              if (res.data.code === 10040) {
                // 一次编辑成功
                this.$Message.success(res.data.msg)
                // 这里有个问题，closeTag是返回上一级，如果从查看页面点编辑条转来的，
                // 那么该数据等待二次编辑，不应该跳回到正在被编辑公司信息的查看页面
                this.closeTag()
              } else {
                // 提交失败，对比信息不正确
                this.$Message.error(res.data.msg)
              }
            })
            .catch(err => {
              console.error(err)
            })
          break
        }
      }
    },
    // 获取附加资料配置项
    getSupplyList () {
      this.$axios({
        url: baseUrl + '/SysOption/findSysOptionsByCondition',
        method: 'post',
        data: $qs.stringify({ optionType: '补充资料' })
      }).then(res => {
        if (res.data.code === 10000) {
          // 下拉选项列表
          this.selectList.supplyList = res.data.content
        }
      })
    },
    // 添加附加资料
    handlAddSupply () {
      this.company.companyEnclosure.push({
        type: -1,
        agree: 0,
        enclosure: []
      })
    },
    // 添加账户类型
    handlAddAccount () {
      // 添加账户新行
      this.company.accounts.push({
        accountTypeName: '',
        accountBankName: '',
        account: ''
      })
      // 添加新的验证规则提示行
      this.rules.accounts.push({
        accountTypeName: '',
        accountBankName: '',
        account: ''
      })
    },
    // 删除账户类型
    handlRemoveAccount (index) {
      // 删除账户类型和账户类型验证
      this.company.accounts.splice(index, 1)
      this.rules.accounts.splice(index, 1)
    },
    // 删除补充资料
    handlRemoveSupply (index) {
      this.company.companyEnclosure.splice(index, 1)
    },
    // 图片上传成功回调函数
    uploadSuccess (type, response, file, fileList) {
      // response是图片上传接口返回的消息,rel===true时，msg为图片相对路径
      if (response.rel === true) {
        // type可能有licenseUrls、bankLicenseUrls、personIdUrl
        this.company[type].push({ name: type, status: 0, url: response.msg })
      } else {
        console.error(response.msg)
      }
    },
    // 附加资料上传成功回调
    supplyUploadSuccess (index, response, file, fileList) {
      if (response.rel === true) {
        let url = response.msg
        let filename = response.filename
        this.company.companyEnclosure[index].enclosure.push({
          enclosureName: filename,
          isAdd: 1,
          enclosureUrl: url
        })
      }
      console.log(file)
    },
    // 删除附加资料里面的具体文具
    delFile (index, findex, fname) {
      this.$Modal.confirm({
        title: '删除提示',
        content: `是否删除${fname}`,
        onOk: () => {
          this.company.companyEnclosure[index].enclosure.splice(findex, 1)
        }
      })
    },
    // 表单验证函数
    validate (key) {
      let me = this
      // let contentText = this.company[key]
      function checkEmpty (string) {
        if (string) {
          me.company[key] = me.company[key].trim()
        }
        if (me.company[key] === '') {
          me.rules[key] = '非空项'
          return false
        } else {
          me.rules[key] = ''
          return true
        }
      }
      switch (key) {
        case 'companyTypeName': {
          return checkEmpty(1)
        }
        case 'companyName': {
          return checkEmpty(1)
        }
        case 'companyCode': {
          // 18位数字和大写字母
          let reg = /^[0-9A-Z]{18}$/
          me.company[key] = me.company[key].trim()
          if (!reg.test(this.company[key])) {
            me.rules[key] = '18位数字或大写字母'
            return false
          } else {
            me.rules[key] = ''
            return true
          }
        }
        case 'companyLegal': {
          return checkEmpty(1)
        }
        case 'companyShareholder': {
          if (!this.hasShareholder) {
            return true
          } else {
            return checkEmpty(1)
          }
        }
        case 'companyActualCapital': {
          return checkEmpty(1)
        }
        case 'companyLegalPersonid': {
          let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
          me.company[key] = me.company[key].trim()
          if (!reg.test(me.company[key])) {
            me.rules[key] = '身份证号码错误'
            return false
          } else {
            me.rules[key] = ''
            return true
          }
        }

        case 'companyStarttime': {
          return checkEmpty()
        }
        case 'companyRegisterCapital': {
          return checkEmpty()
        }
        case 'companyStarttimeFrom': {
          return checkEmpty()
        }
        case 'companyStarttimeEnd': {
          return checkEmpty()
        }
        case 'companyRegisterOffice': {
          return checkEmpty(1)
        }
        case 'companyAddress': {
          return checkEmpty(1)
        }
        case 'companyStatus': {
          return checkEmpty()
        }
        case 'companyTel': {
          return checkEmpty(1)
        }
        case 'companyScope': {
          return checkEmpty(1)
        }
        case 'accounts': {
          let accounts = me.company.accounts
          // 基本户类型只能有一个
          if (
            accounts.filter(e => {
              return e.accountTypeName === '基本户'
            }).length > 1
          ) {
            this.$Message.error('基本户只能有一个')
            return false
          }
          return accounts.every(account => {
            // 如果是个人，只验证开户行和账号
            if (me.isPerson) {
              if (account['accountBankName'] && account['account']) {
                return true
              } else {
                this.$Message.error('请完善账户信息')
                return false
              }
            } else {
              // 其他全部验证
              if (
                account['accountTypeName'] &&
                account['account'] &&
                account['accountBankName']
              ) {
                return true
              } else {
                this.$Message.error('请完善账户信息')
                return false
              }
            }
          })
        }
        case 'taxrebateRate': {
          if (!this.company[key]) {
            me.rules[key] = '必填项'
            return false
          }
          if (isNaN(parseFloat(this.company[key]))) {
            me.rules[key] = '请填写数字'
            return false
          }
          this.company[key] = parseFloat(this.company[key])
          if (this.company[key] < 0 || this.company[key] > 100) {
            me.rules[key] = '返税比例0-100'
            return false
          } else {
            this.company[key] += '' // 转换成字符串
            me.rules[key] = ''
            return true
          }
        }
        case 'taxrebateTypeName': {
          return checkEmpty()
        }
        case 'licenseUrls': {
          // 如果有上传的框，必须上传
          if (this.isUpload) {
            if (me.company.licenseUrls.length === 0) {
              this.$Message.error('请上传营业执照')
              return false
            } else {
              return true
            }
          }
          // 需要审核照片
          if (this.examineImg) {
            // 所有图片是否已审核
            let isAllExamine = me.company.licenseUrls.every(e => {
              return e.status !== 0
            })
            if (!isAllExamine) {
              this.$Message.error('请审核营业执照')
              return false
            } else {
              return true
            }
          }
          break
        }
        case 'bankLicenseUrls': {
          // 如果有上传的框，必须上传
          if (this.isUpload) {
            if (me.company.bankLicenseUrls.length === 0) {
              this.$Message.error('请上传银行开户许可')
              return false
            } else {
              return true
            }
          }
          // 当状态为待二次编辑，二次录入，且非发起人，图片必审核
          if (this.examineImg) {
            // 所有图片都审核
            let isAllExamine = me.company.bankLicenseUrls.every(e => {
              return e.status !== 0
            })
            if (!isAllExamine) {
              this.$Message.error('请审核银行开户许可')
              return false
            } else {
              return true
            }
          }
          break
        }
        case 'personIdUrl': {
          // 如果有上传的框，必须上传
          if (this.isUpload) {
            if (me.company.personIdUrl.length === 0) {
              this.$Message.error('身份证照片必填')
              return false
            } else {
              return true
            }
          }
          // 当状态为待二次编辑，二次录入，且非发起人，图片必审核
          if (this.examineImg) {
            // 所有图片都审核
            let isAllExamine = me.company.personIdUrl.every(e => {
              return e.status !== 0
            })
            if (!isAllExamine) {
              this.$Message.error('请审核身份证照片')
              return false
            } else {
              return true
            }
          }
          break
        }
        case 'ownerId': {
          if (!this.ownerId) {
            this.$Message.error('请选择通知人')
          } else {
            return true
          }
        }
      }
    },
    // 整体的表单验证
    checkAll () {
      let checkList = []
      if (this.isPerson) {
        // 个人类型需要验证的字段
        checkList = [
          'accounts',
          'ownerId',
          'companyStatus',
          'companyName',
          'companyLegalPersonid',
          'personIdUrl'
        ]
      } else {
        // 非个人类型没有股东的公司需要验证的字段
        checkList = [
          'accounts',
          'companyName',
          'companyCode',
          'companyLegal',
          'companyActualCapital',
          'companyLegalPersonid',
          'companyStarttime',
          'companyRegisterCapital',
          'companyStarttimeFrom',
          'companyRegisterOffice',
          'companyAddress',
          'companyStatus',
          'companyTel',
          'companyScope',
          'licenseUrls',
          'bankLicenseUrls',
          'taxrebateRate',
          'taxrebateTypeName',
          'ownerId'
        ] // 有股东的添加字段
        if (this.hasShareholder) {
          checkList.push('companyShareholder')
        }
      }
      return checkList.every(e => {
        return this.validate(e)
      })
    },
    // 获取有两人两遍全写的通知人列表
    searchPerson () {
      let me = this
      this.$axios({
        // url: baseUrl + '/user/getadviceuser',
        url: baseUrl + '/user/getIncumbencyTbUser',
        method: 'post',
        data: $qs.stringify({ menuName: '公司信息' })
      })
        .then(res => {
          let userList = res.data.content
          // [{id: 2, nickname: "高汉", password: "12345", username: "gaohan"}]
          me.personList = userList
          // me.personNameList = userList.map(e => e.nickname)
        })
        .catch(err => {
          console.error(err)
        })
    },
    init () {
      this.getData(this.type)
      this.searchPerson() // 获取通知人列表
    },
    clearOwnerName () {
      // 清空通知人暂时不做
    },
    // 页面初始化的时候获取数据
    getData (type) {
      switch (type) {
        case 'tbc': {
          this.$axios({
            url: baseUrl + '/company/looktbc', // 第二次录入的
            method: 'post',
            data: $qs.stringify({ companyId: this.$route.query.id })
          })
            .then(res => {
              if (res.data.code === 10000) {
                let content = res.data.content
                this.schedule = content.schedule // 两人两遍操作进度
                this.isInitiator = content.isInitiator // 是否为发起人,0是1否
                // 附加资料信息由前端放到 editCompany里面
                content.editCompany.companyEnclosure = content.companyEnclosure
                this.company = content.editCompany // 公司信息
                this.ownerName = content.editCompany.ownerUserName // 通知人姓名
                this.ownerId = content.editCompany.ownerId // 通知人id

                // 如果有对比信息，则展示对比信息
                if (res.data.content.compareResult) {
                  // 展示对比信息
                  this.compare = res.data.content.compareResult
                  this.showCompare = true
                }
                // 待二次录入时账号回显空数组，默认添加一个账户信息
                if (this.company.accounts.length === 0) {
                  this.handlAddAccount()
                }
                // 如果有已经被修改的信息，展示XX字段已被修改
                if (res.data.content.modifyField && this.schedule === '2') {
                  // 回传的是被修改的字段的key
                  let diff = res.data.content.modifyField
                  for (let key in diff) {
                    if (diff[key] === 1 && key !== 'accounts') {
                      this.rules[key] = '已被修改'
                    }
                  }
                }

                // 根据返回的账户信息行数，添加账户信息rules
                this.rules.accounts = content.editCompany.accounts.map(e => {
                  return {
                    accountTypeName: '',
                    accountBankName: '',
                    account: ''
                  }
                })
                // if(res.data.content.modifyField.accounts){
                //     //如果账号有变动，返回1，在最后行账户显示账号有变动
                //     let l = this.company.accounts.length;
                //     this.rules.accounts[l-1].account = '账户有变动'
                //   }
              }
            })
            .catch(err => {
              console.log(err)
            })
          break
        }
        case 'add': {
          break
        }
        default: {
          this.$axios({
            url: baseUrl + '/company/look', // 确认的公司信息，第一次修改的
            method: 'post',
            data: $qs.stringify({ companyId: this.$route.query.id })
          })
            .then(res => {
              this.company = res.data.content
              // 动态添加账户信息提示栏，否则rules报错
              this.rules.accounts = this.company.accounts.map(e => {
                return {
                  accountTypeName: '',
                  accountBankName: '',
                  account: ''
                }
              })
              // 动态添加补充资料，不然一行都没有
              if (this.company.companyEnclosure.length === 0) {
                this.handlAddSupply()
              }
            })
            .catch(err => {
              console.error(err)
            })
        }
      }
    },
    /** 传入类别和要删除的类型和在数组中的位置 */
    deleteImg (type, index) {
      this.company[type].splice(index, 1)
    },
    closeTag () {
      // 手动关闭标签页
      bus.$emit('on-myclose', this.$route)
    }
  }
}
</script>

<style lang="less">
#editCompany {
  overflow-x: hidden;
  margin: 20px;
  padding: 20px;
  .rowMargin {
    margin: 10px;
  }
  .operationImg {
    width: 25px;
    height: 25px;
    line-height: 25px;
    margin-top: 3px;
    cursor: pointer;
  }
  .title {
    text-align: right;
    line-height: 30px;
    color: #000;
    font-weight: 600;
  }
  .inputbox {
    text-align: left;
    width: 70%;
    min-width: 100px;
  }
  .imgbox {
    width: 100%;
    display: inline-block;
    position: relative;
  }
  .close {
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
  img.inputbox {
    height: 100px;
    width: 100%;
    padding-left: 10px;
  }
  .operation .btn {
    width: calc(50% - 10px);
    margin-left: 10px;
  }
  .ivu-col p.tips {
    text-align: right;
    height: 1em;
    color: red;
  }
  .accountInfo .fl,
  .taxrebate .fl {
    margin: 10px 0;
  }
  i.require {
    color: red;
  }
  h3 {
    text-indent: 2em;
    color: #3db79f;
    // background-color: #f2f2f2;
  }

  h3::before {
    content: '';
    display: inline-block;
    background-color: #34b49a;
    width: 3px;
    height: 1em;
    position: relative;
    top: 2px;
    left: -32px;
  }
  .save {
    margin-top: 30px;
  }
  .supplyList {
    list-style: none;
    display: flex;
    justify-content: space-between;
    a{
      color: #000;
    }
    .delSupply {
      cursor: pointer;
    }
    .green {
      color: #34b49a;
    }
  }
  .ivu-btn-primary {
    background-color: #19aa8d;
    border-color: #19aa8d;
    color: #fff;
  }
  .ivu-btn-primary:hover {
    background-color: #088f74;
    border-color: #088f74;
    color: #fff;
  }
}
</style>
