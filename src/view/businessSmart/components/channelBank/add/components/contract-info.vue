<template>
    <!-- 合同信息 -->
    <div>
        <Form ref="contract" :model="contract" :rules="rulesContract">
            <Row class="rowPadding">
                <Col span="2" offset="2" class="title">
                    <span>合同拟定方：</span>
                </Col>
                <Col span="5">
                    <FormItem
                        prop="contractFrom"
                        :error="errors('contractFrom')"
                        :show-message="false"
                    >
                        <Select
                            v-model="contract.contractFrom"
                            placeholder="潜在客户必填字段"
                            @on-change="selectFrom"
                        >
                            <Option
                                v-for="item in protocolList"
                                :value="item.name"
                                :key="item.id"
                                clearable
                            >
                                <span
                                    style="height: 1px;width: 110px; background: #ccc;margin-top:8px;float:left;margin-right:6%;"
                                    v-if="item.id === -2"
                                ></span>
                                {{ item.name }}
                                <span
                                    style="height: 1px;width: 110px; background: #ccc;margin-top:8px;float:right;"
                                    v-if="item.id === -2"
                                ></span>
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="4" offset="2" class="title">
                    <span>合同类型：</span>
                </Col>
                <Col span="5">
                    <FormItem
                        prop="contractType"
                        :error="errors('contractType')"
                        :show-message="false"
                    >
                        <Select
                            v-model="contract.contractType"
                            placeholder="潜在客户必填字段"
                            @on-change="selectType"
                        >
                            <Option
                                v-for="item in contractTypeList"
                                :value="item.label"
                                :key="item.value"
                                clearable
                            >
                                <span
                                    style="height: 1px;width: 110px; background: #ccc;margin-top:8px;float:left;margin-right:6%;"
                                    v-if="item.value === -2"
                                ></span>
                                {{ item.label }}
                                <span
                                    style="height: 1px;width: 110px; background: #ccc;margin-top:8px;float:right;"
                                    v-if="item.value === -2"
                                ></span>
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <!-- 付款合同 -->
            <div v-if="contract.contractType==='付款合同'">
                <Row>
                    <Col span="12" offset="1">
                        <span>甲方:</span>
                    </Col>
                </Row>
                <Row class="rowPadding">
                    <Col span="2" offset="2" class="title">
                        <span>签订人：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="firstSigner"
                            :error="errors('firstSigner')"
                            :show-message="false"
                        >
                            <Select v-model="contract.firstSigner" placeholder="建立联系必填字段" filterable>
                                <Option
                                    v-for="item in employees"
                                    :value="item.nickname"
                                    :key="item.id"
                                    clearable
                                    filterable
                                >{{ item.nickname }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="4" offset="2" class="title">
                        <span>我方公司：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="firstCompanyId"
                            :error="errors('firstCompanyId')"
                            :show-message="false"
                        >
                            <Select
                                v-model="contract.firstCompanyId"
                                placeholder="建立联系必填字段"
                                :label-in-value="true"
                                @on-change="getCompanyCard"
                            >
                                <Option
                                    v-for="item in ourCompanyList"
                                    :value="item.id"
                                    :key="item.id"
                                    clearable
                                >
                                    <span
                                        style="height: 1px;width: 110px; background: #ccc;margin-top:8px;float:left;margin-right:6%;"
                                        v-if="item.id === -2"
                                    ></span>
                                    {{ item.companyName }}
                                    <span
                                        style="height: 1px;width: 110px; background: #ccc;margin-top:8px;float:right;"
                                        v-if="item.id === -2"
                                    ></span>
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row class="rowPadding">
                    <Col span="2" offset="2" class="title">
                        <span>公司账号：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="firstCompanyAccount"
                            :error="errors('firstCompanyAccount')"
                            :show-message="false"
                        >
                            <Select
                                v-model="contract.firstCompanyAccount"
                                placeholder="建立联系必填字段"
                                @on-change="openEasyTask"
                            >
                                <Option
                                    v-for="item in companyIdList"
                                    :value="item.account"
                                    :key="item.id"
                                    clearable
                                >
                                    <span
                                        style="height: 1px;width: 110px; background: #ccc;margin-top:8px;float:left;margin-right:6%;"
                                        v-if="item.id === -2"
                                    ></span>
                                    {{ item.account }}
                                    <span
                                        style="height: 1px;width: 110px; background: #ccc;margin-top:8px;float:right;"
                                        v-if="item.id === -2"
                                    ></span>
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="4" offset="2" class="title">
                        <span>合同期限：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="contractTime"
                            :error="errors('contractTime')"
                            :show-message="false"
                        >
                            <DatePicker
                                @on-change="getContractTime"
                                v-model="contract.contractTime"
                                type="daterange"
                                split-panels
                                placeholder="选择期限"
                                class="contractTime"
                            ></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
                <Row class="rowPadding">
                    <Col span="2" offset="2" class="title">
                        <span>合同金额：</span>
                    </Col>
                    <Col span="5">
                        <FormItem prop="contractMoney" :error="errors('contractMoney')">
                            <Input
                                v-model="contract.contractMoney"
                                placeholder="潜在客户必填字段"
                                maxlength="20"
                                show-word-limit
                                :clearable="closeIcon.contractMoney"
                                @mouseover.native="showClearable('contractMoney')"
                                @mouseout.native="hiddenClearable('contractMoney')"
                            />
                        </FormItem>
                    </Col>
                    <Col span="4" offset="2" class="title">
                        <span>是否开票：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="isReceipt"
                            :error="errors('isReceipt')"
                            :show-message="false"
                        >
                            <Select v-model="contract.isReceipt" placeholder="潜在客户必填字段">
                                <Option
                                    v-for="item in isOpenTicketList"
                                    :value="item.id"
                                    :key="item.id"
                                    clearable
                                >{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row class="rowPadding">
                    <Col span="2" offset="2" class="title">
                        <span>开票类型：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="receiptType"
                            :error="errors('receiptType')"
                            :show-message="false"
                        >
                            <Select v-model="contract.receiptType" placeholder="建立联系必填字段" clearable>
                                <Option
                                    v-for="item in openTicketTypeList"
                                    :value="item.tagName"
                                    :key="item.id"
                                    clearable
                                >{{ item.tagName }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="4" offset="2" class="title">
                        <span>开票内容：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="receiptContent"
                            :error="errors('receiptContent')"
                            :show-message="false"
                        >
                            <Select v-model="contract.receiptContent" placeholder="建立联系必填字段" clearable>
                                <Option
                                    v-for="item in openTicketMainList"
                                    :value="item.tagName"
                                    :key="item.id"
                                    clearable
                                >{{ item.tagName }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12" offset="1">
                        <span>乙方:</span>
                    </Col>
                </Row>
                <Row class="rowPadding">
                    <Col span="2" offset="2" class="title">
                        <span>公司/个人：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="secondCompanyType"
                            :error="errors('secondCompanyType')"
                            :show-message="false"
                             @on-change="selectPerOrCom"
                        >
                            <Select v-model="contract.secondCompanyType" placeholder="待联系必填字段">
                                <Option
                                    v-for="item in perOrComTwoList"
                                    :value="item.name"
                                    :key="item.id"
                                    clearable
                                >{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <span v-if="contract.secondCompanyType==='公司'">
                        <Col span="4" offset="2" class="title">
                            <span>公司名称：</span>
                        </Col>
                        <Col span="5">
                            <FormItem
                                prop="secondCompanyName"
                                :error="errors('secondCompanyName')"
                                :show-message="false"
                            >
                                <Input
                                    v-model="contract.secondCompanyName"
                                    placeholder="待联系必填字段"
                                    maxlength="50"
                                    show-word-limit
                                    :clearable="closeIcon.secondCompanyName"
                                    @mouseover.native="showClearable('secondCompanyName')"
                                    @mouseout.native="hiddenClearable('secondCompanyName')"
                                />
                            </FormItem>
                        </Col>
                    </span>
                    <span v-if="contract.secondCompanyType==='个人'">
                        <Col span="4" offset="2" class="title">
                            <span>姓名：</span>
                        </Col>
                        <Col span="5">
                            <FormItem
                                prop="personName"
                                :error="errors('personName')"
                                :show-message="false"
                            >
                                <Input
                                v-model="contract.personName"
                                placeholder="待联系必填字段"
                                maxlength="20"
                                show-word-limit
                                :clearable="closeIcon.personName"
                                @mouseover.native="showClearable('personName')"
                                @mouseout.native="hiddenClearable('personName')"
                                />
                            </FormItem>
                        </Col>
                    </span>
                </Row>
                <Row class="rowPadding" v-if="contract.secondCompanyType==='个人'">
                    <Col span="2" offset="2" class="title">
                        <span>身份证：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="personCardId"
                            :error="errors('personCardId')"
                            :show-message="false"
                        >
                            <Input
                            v-model="contract.personCardId"
                            placeholder="潜在客户必填字段"
                            maxlength="30"
                            show-word-limit
                            :clearable="closeIcon.personCardId"
                            @mouseover.native="showClearable('personCardId')"
                            @mouseout.native="hiddenClearable('personCardId')"
                            />
                        </FormItem>
                    </Col>
                </Row>
                <Row class="rowPadding">
                    <Col span="2" offset="2" class="title">
                        <span>开户行账号：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="secondBankAccount"
                            :error="errors('secondBankAccount')"
                            :show-message="false"
                        >
                            <Input
                            v-model="contract.secondBankAccount"
                            placeholder="潜在客户必填字段"
                            maxlength="30"
                            show-word-limit
                            :clearable="closeIcon.secondBankAccount"
                            @mouseover.native="showClearable('secondBankAccount')"
                            @mouseout.native="hiddenClearable('secondBankAccount')"
                            />
                        </FormItem>
                    </Col>
                    <Col span="4" offset="2" class="title">
                        <span>开户行：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="secondBank"
                            :error="errors('secondBank')"
                            :show-message="false"
                        >
                            <Input
                            v-model="contract.secondBank"
                            placeholder="建立联系必填字段"
                            maxlength="30"
                            show-word-limit
                            :clearable="closeIcon.secondBank"
                            @mouseover.native="showClearable('secondBank')"
                            @mouseout.native="hiddenClearable('secondBank')"
                            />
                        </FormItem>
                    </Col>
                </Row>
                <Row class="rowPadding">
                    <Col span="2" offset="2" class="title">
                        <span>对方联系人：</span>
                    </Col>
                    <Col span="5">
                        <FormItem :error="errors('secondContactPerson')" :show-message="false">
                             <Input
                             v-model="contract.secondContactPerson"
                             placeholder="潜在客户必填字段"
                             maxlength="30"
                             show-word-limit
                             :clearable="closeIcon.secondContactPerson"
                            @mouseover.native="showClearable('secondContactPerson')"
                            @mouseout.native="hiddenClearable('secondContactPerson')"
                             />
                            <!-- <Select
                                v-model="contract.secondContactPerson"
                                filterable
                                allow-create
                                clearable
                                @on-create="handeloppositeLinkManList"
                            >
                                <Option
                                    v-for="item  in oppositeLinkManList"
                                    :value="item.name"
                                    :key="item.id"
                                >{{item.name}}</Option>
                            </Select> -->
                        </FormItem>
                    </Col>
                    <Col span="4" offset="2" class="title">
                        <span>联系电话：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="secondContactPersonPhone"
                            :error="errors('secondContactPersonPhone')"
                            :show-message="false"
                        >
                            <Input
                                v-model="contract.secondContactPersonPhone"
                                placeholder="建立联系必填字段"
                                maxlength="20"
                                show-word-limit
                                :clearable="closeIcon.secondContactPersonPhone"
                                @mouseover.native="showClearable('secondContactPersonPhone')"
                                @mouseout.native="hiddenClearable('secondContactPersonPhone')"
                            />
                        </FormItem>
                    </Col>
                </Row>
            </div>
            <!-- 收款合同 -->
            <div v-if="contract.contractType==='收款合同' ">
                <Row>
                    <Col span="12" offset="1">
                        <span>甲方:</span>
                    </Col>
                </Row>
                <Row class="rowPadding">
                    <Col span="2" offset="2" class="title">
                        <span>公司/个人：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="secondCompanyType"
                            :error="errors('secondCompanyType')"
                            :show-message="false"
                             @on-change="selectPerOrCom"
                        >
                            <Select v-model="contract.secondCompanyType" placeholder="待联系必填字段">
                                <Option
                                    v-for="item in perOrComTwoList"
                                    :value="item.name"
                                    :key="item.id"
                                    clearable
                                >{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <span v-if="contract.secondCompanyType==='公司'">
                        <Col span="4" offset="2" class="title">
                            <span>公司名称：</span>
                        </Col>
                        <Col span="5">
                            <FormItem
                                prop="secondCompanyName"
                                :error="errors('secondCompanyName')"
                                :show-message="false"
                            >
                                <Input
                                v-model="contract.secondCompanyName"
                                placeholder="待联系必填字段"
                                maxlength="50"
                                show-word-limit
                                :clearable="closeIcon.secondCompanyName"
                                @mouseover.native="showClearable('secondCompanyName')"
                                @mouseout.native="hiddenClearable('secondCompanyName')"
                                />
                            </FormItem>
                        </Col>
                    </span>
                    <span v-if="contract.secondCompanyType==='个人'">
                        <Col span="4" offset="2" class="title">
                            <span>姓名：</span>
                        </Col>
                        <Col span="5">
                            <FormItem
                                prop="personName"
                                :error="errors('personName')"
                                :show-message="false"
                            >
                                <Input
                                v-model="contract.personName"
                                placeholder="待联系必填字段"
                                maxlength="20"
                                show-word-limit
                                :clearable="closeIcon.personName"
                                @mouseover.native="showClearable('personName')"
                                @mouseout.native="hiddenClearable('personName')"
                                />
                            </FormItem>
                        </Col>
                    </span>
                </Row>
                <Row class="rowPadding" v-if="contract.secondCompanyType==='个人'">
                    <Col span="2" offset="2" class="title">
                        <span>身份证：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="personCardId"
                            :error="errors('personCardId')"
                            :show-message="false"
                        >
                            <Input
                            v-model="contract.personCardId"
                            placeholder="潜在客户必填字段"
                            maxlength="30"
                            show-word-limit
                            :clearable="closeIcon.personCardId"
                            @mouseover.native="showClearable('personCardId')"
                            @mouseout.native="hiddenClearable('personCardId')"
                            />
                        </FormItem>
                    </Col>
                </Row>
                <Row class="rowPadding">
                    <Col span="2" offset="2" class="title">
                        <span>对方联系人：</span>
                    </Col>
                    <Col span="5">
                        <FormItem :error="errors('secondContactPerson')" :show-message="false">
                            <Input
                            v-model="contract.secondContactPerson"
                            placeholder="潜在客户必填字段"
                            maxlength="30"
                            show-word-limit
                            :clearable="closeIcon.secondContactPerson"
                            @mouseover.native="showClearable('secondContactPerson')"
                            @mouseout.native="hiddenClearable('secondContactPerson')"
                            />
                            <!-- <Select
                                v-model="contract.secondContactPerson"
                                filterable
                                allow-create
                                clearable
                                @on-create="handeloppositeLinkManList"
                            >
                                <Option
                                    v-for="item  in oppositeLinkManList"
                                    :value="item.name"
                                    :key="item.id"
                                >{{item.name}}</Option>
                            </Select> -->
                        </FormItem>
                    </Col>
                    <Col span="4" offset="2" class="title">
                        <span>开票地址：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="receiptAddress"
                            :error="errors('receiptAddress')"
                            :show-message="false"
                        >
                            <Input
                            v-model="contract.receiptAddress"
                            placeholder="建立联系必填字段"
                            maxlength="100"
                            show-word-limit
                            :clearable="closeIcon.receiptAddress"
                            @mouseover.native="showClearable('receiptAddress')"
                            @mouseout.native="hiddenClearable('receiptAddress')"
                            />
                        </FormItem>
                    </Col>
                </Row>
                <Row class="rowPadding">
                    <Col span="2" offset="2" class="title">
                        <span>开票类型：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="receiptType"
                            :error="errors('receiptType')"
                            :show-message="false"
                        >
                            <Select v-model="contract.receiptType" filterable clearable>
                                <Option
                                    v-for="item  in openTicketTypeList"
                                    :value="item.tagName"
                                    :key="item.id"
                                    clearable
                                >{{item.tagName}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="4" offset="2" class="title">
                        <span>联系电话：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="secondContactPersonPhone"
                            :error="errors('secondContactPersonPhone')"
                            :show-message="false"
                        >
                            <Input
                                v-model="contract.secondContactPersonPhone"
                                placeholder="建立联系必填字段"
                                maxlength="20"
                                show-word-limit
                                :clearable="closeIcon.secondContactPersonPhone"
                                @mouseover.native="showClearable('secondContactPersonPhone')"
                                @mouseout.native="hiddenClearable('secondContactPersonPhone')"
                            />
                        </FormItem>
                    </Col>
                </Row>
                <Row class="rowPadding">
                    <Col span="2" offset="2" class="title">
                        <span>发票寄送地址：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="sendAddress"
                            :error="errors('sendAddress')"
                            :show-message="false"
                        >
                            <Input
                            v-model="contract.sendAddress"
                            placeholder="待联系必填字段"
                            maxlength="100"
                            show-word-limit
                            :clearable="closeIcon.sendAddress"
                            @mouseover.native="showClearable('sendAddress')"
                            @mouseout.native="hiddenClearable('sendAddress')"
                            />
                        </FormItem>
                    </Col>
                    <Col span="6" class="title">
                        <span>开票内容：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="openTicketInfo"
                            :error="errors('openTicketInfo')"
                            :show-message="false"
                        >
                            <Select v-model="contract.openTicketInfo" filterable clearable>
                                <Option
                                    v-for="item  in openTicketMainList"
                                    :value="item.tagName"
                                    :key="item.id"
                                    clearable
                                >{{item.tagName}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12" offset="1">
                        <span>乙方:</span>
                    </Col>
                </Row>
                <Row class="rowPadding">
                    <Col span="2" offset="2" class="title">
                        <span>签订人：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="firstSigner"
                            :error="errors('firstSigner')"
                            :show-message="false"
                        >
                            <Select v-model="contract.firstSigner" placeholder="建立联系必填字段" filterable>
                                <Option
                                    v-for="item in employees"
                                    :value="item.nickname"
                                    :key="item.id"
                                    clearable
                                >{{ item.nickname }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="4" offset="2" class="title">
                        <span>我方公司：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="firstCompanyId"
                            :error="errors('firstCompanyId')"
                            :show-message="false"
                        >
                            <Select
                                v-model="contract.firstCompanyId"
                                placeholder="建立联系必填字段"
                                :label-in-value="true"
                                @on-change="getCompanyCard"
                            >
                                <Option
                                    v-for="item in ourCompanyList"
                                    :value="item.id"
                                    :key="item.id"
                                    clearable
                                >
                                    <span
                                        style="height: 1px;width: 110px; background: #ccc;margin-top:8px;float:left;margin-right:6%;"
                                        v-if="item.id === -2"
                                    ></span>
                                    {{ item.companyName }}
                                    <span
                                        style="height: 1px;width: 110px; background: #ccc;margin-top:8px;float:right;"
                                        v-if="item.id === -2"
                                    ></span>
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row class="rowPadding">
                    <Col span="2" offset="2" class="title">
                        <span>公司账号：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="firstCompanyAccount"
                            :error="errors('firstCompanyAccount')"
                            :show-message="false"
                        >
                            <Select
                                v-model="contract.firstCompanyAccount"
                                placeholder="建立联系必填字段"
                                @on-change="openEasyTask"
                            >
                                <Option
                                    v-for="item in companyIdList"
                                    :value="item.account"
                                    :key="item.id"
                                    clearable
                                >
                                    <span
                                        style="height: 1px;width: 110px; background: #ccc;margin-top:8px;float:left;margin-right:6%;"
                                        v-if="item.id === -2"
                                    ></span>
                                    {{ item.account }}
                                    <span
                                        style="height: 1px;width: 110px; background: #ccc;margin-top:8px;float:right;"
                                        v-if="item.id === -2"
                                    ></span>
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="4" offset="2" class="title">
                        <span>合同期限：</span>
                    </Col>
                    <Col span="5">
                        <FormItem
                            prop="contractTime"
                            :error="errors('contractTime')"
                            :show-message="false"
                        >
                            <DatePicker
                                v-model="contract.contractTime"
                                type="daterange"
                                split-panels
                                placeholder="选择期限"
                                class="contractTime"
                            ></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
                <Row class="rowPadding">
                    <Col span="2" offset="2" class="title">
                        <span>合同金额：</span>
                    </Col>
                    <Col span="5">
                        <FormItem prop="contractMoney" :error="errors('contractMoney')">
                            <Input
                            v-model="contract.contractMoney"
                            placeholder="潜在客户必填字段"
                            maxlength="20"
                            show-word-limit
                            :clearable="closeIcon.contractMoney"
                            @mouseover.native="showClearable('contractMoney')"
                            @mouseout.native="hiddenClearable('contractMoney')"
                            />
                        </FormItem>
                    </Col>
                </Row>
            </div>
        </Form>
        <Modal v-model="showWarn" title="提醒" @on-ok="ensure">
            <p class="warn">该字段涉及逻辑和页面开发，是否发简易任务告知产品经理您的新需求</p>
        </Modal>
        <div v-if="showLaunch">
            <launch-task :show="showLaunch" @hideTask="hide"></launch-task>
        </div>
    </div>
</template>

<script>
import LaunchTask from '../../../launch-task'
import { biUrl, phpURL } from '@/api/base.js'
import moment from 'moment'
import showIconMixin from '@/view/businessSmart/components/showCloseIconMixin'
export default {
  mixins: [showIconMixin],
  name: 'contract-info',
  inject: ['app'],
  components: {
    LaunchTask
  },
  props: {
    errorInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      showWarn: false, // 简易任务提示
      showLaunch: false, // 简易任务弹框
      protocolList: [
        { id: 1, name: '我方合同' },
        { id: 2, name: '对方合同' },
        { id: -2, name: '自定义' }
      ], // 合同拟定方
      // 合同类型
      contractTypeList: [
        {
          value: 1,
          label: '收款合同'
        },
        {
          value: 2,
          label: '付款合同'
        },
        { value: -2, label: '自定义' }
      ],
      ourCompanyList: [], // 我方公司
      companyIdList: [], // 公司账号
      isOpenTicketList: [
        {
          id: 0,
          name: '否'
        },
        {
          id: 1,
          name: '是'
        }
      ], // 是否开票
      openTicketTypeList: [], // 开票类型列表
      openTicketMainList: [], // 开票内容列表
      perOrComTwoList: [
        {
          id: 1,
          name: '公司'
        },
        {
          id: 2,
          name: '个人'
        }
      ], // 公司/个人列表
      oppositeLinkManList: [], // 对方联系人
      contract: {
        contractFrom: '我方合同', // 合同拟定方
        contractType: '付款合同', // 合同类型
        firstSigner: '', // 签订人
        firstCompanyId: '', // 我方公司
        firstCompanyAccount: '', // 公司账号
        contractTime: [], // 合同期限
        contractStartTime: '', // 开始时间
        contractEndTime: '', // 结束时间
        contractMoney: '', // 合同金额
        isReceipt: '', // 是否开票
        receiptType: '', // 开票类型
        receiptContent: '', // 开票内容
        secondCompanyType: '', // 公司/个人
        secondCompanyName: '', // 公司名称
        personName: '', // 姓名
        personCardId: '', // 身份证
        secondBank: '', // 开户行
        secondBankAccount: '', // 开户行账号
        secondContactPerson: '', // 联系人
        secondContactPersonPhone: '', // 联系电话
        oppositeLinkMan: '', // 对方联系人
        receiptAddress: '', // 开票地址
        sendAddress: '', // 发票寄送地址
        openTicketInfo: '' // 开票内容
      },
      contractErro: [],
      rulesContract: {
        contractMoney: [
          {
            pattern: /^\d+(\.\d{0,2})?$/,
            message: '只能输入数字且最多两位小数'
          }
        ]
      }
    }
  },
  computed: {
    employees () {
      return this.app.employees // 在职人员列表
    }
  },
  watch: {
    errorInfo: {
      handler (newVal) {
        this.contractErro = newVal.contract
      },
      deep: true
    }
  },
  mounted () {
    this.getList() // 获取下拉列表
    // 监听渠信息组件传的(公司/个人)
    bus.$on('getSelectPer', msg => {
      this.contract.secondCompanyType = msg
      this.contract.secondCompanyType = msg
    })
    // 监听渠信息组件传的公司名称
    bus.$on('getCompanyName', msg => {
      this.contract.secondCompanyName = msg
    })
    // 监听渠信息组件传的姓名
    bus.$on('getPersonName', msg => {
      this.contract.personName = msg
    })
    // 监听渠信息组件传的身份证
    bus.$on('getPersonId', msg => {
      this.contract.personCardId = msg
    })
    // 监听联系人
    bus.$on('on-tel', msg => {
      let data = msg || []
      //   this.contract.secondContactPersonPhone = data[0].contactPhone
      this.oppositeLinkManList = []
      data.map((item, index) => {
        this.oppositeLinkManList.push({
          name: item.contactName,
          id: index
        })
      })
    })
  },
  methods: {
    // 获取下拉列表
    getList () {
      // 获取开票类型
      this.$axios({
        url: biUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({
          tagId: '007001'
        })
      })
        .then(res => {
          if (res.data.code === 10000) {
            let data = res.data.data
            this.openTicketTypeList = data
            //  this[list]
          }
        })
        .catch(err => {
          console.log(err)
        })
      // 获取开票内容
      this.$axios({
        url: biUrl + '/busiConfig/listConfig',
        method: 'post',
        data: $qs.stringify({
          tagId: '007002'
        })
      })
        .then(res => {
          if (res.data.code === 10000) {
            let data = res.data.data
            this.openTicketMainList = data
            //  this[list]
          }
        })
        .catch(err => {
          console.log(err)
        })
      // 我方公司
      this.$axios({
        url: biUrl + '/channel/listCompany',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.ourCompanyList = res.data.data
            this.ourCompanyList.push({
              id: -2,
              companyName: '自定义'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取公司账号
    getCompanyCard (ids) {
      if (ids) {
        let sendData = {
          ourCompanyId: ids.value
        }
        this.$axios({
          url: phpURL + '/cloud/getAccountByOurCompanyId',
          method: 'post',
          data: $qs.stringify(sendData)
        }).then(res => {
          if (res.data.code === 10000) {
            this.companyIdList = res.data.content
            this.companyIdList.push({ id: -2, account: '自定义' })
            this.contract.firstCompanyAccount =
                            this.companyIdList[0].account || ''
          }
        })
        if (ids.value === -2) {
          this.showWarn = true
        }
      }
    },
    selectPerOrCom (name) {
      // 初始化选择一个，把另外下面的内容清空
      if (name === '公司') {
        this.contract.personName = ''
        this.contract.personCardId = ''
      } else {
        this.contract.secondCompanyName = ''
      }
    },
    // 合同拟定
    selectFrom (s) {
      if (s === -2) {
        this.showWarn = true
      }
    },
    // 合同类型
    selectType (s) {
      if (s === '自定义') {
        this.showWarn = true
      }
      // 清空对象中每一个key的值
      Object.keys(this.contract).map(key => {
        this.contract[key] = ''
      })
      this.contract.contractType = s
      this.contract.contractFrom = '我方合同'
    },
    getContractTime () {
      this.contract.contractStartTime = moment(
        this.contract.contractTime[0]
      ).format('YYYY-MM-DD')
      this.contract.contractEndTime = moment(
        this.contract.contractTime[1]
      ).format('YYYY-MM-DD')
    },
    // 不同项目标红
    errors (key) {
      if (this.contractErro.some(e => e === key) ? '不一致' : false) {
        return '不一致'
      }
    },
    // 对方联系人输入添加
    handeloppositeLinkManList (Val) {
      this.oppositeLinkManList.push({
        name: Val,
        id: Val
      })
    },
    // 打开自定义
    openCustom (a) {
      if (a === '自定义') {
        this.showSource = true
      }
    },
    // 打开简易任务
    openEasyTask (a) {
      if (a === '自定义') {
        this.showWarn = true
      }
    },
    // 确定发简易任务
    ensure () {
      this.showLaunch = true
    },
    // 隐藏
    hide (v) {
      this.showLaunch = v
    }
  }
}
</script>

<style scoped>
.headerWithGreenbar {
    font-size: 14px;
    margin-left: 4%;
}

.rowPadding {
    margin-bottom: 20px;
}

.title {
    text-align: right;
    line-height: 30px;
    margin-right: 10px;
    font-size: 14px;
}

.ivu-select {
    margin-top: 0px;
}

.line {
    width: 40%;
    display: inline-block;
}

.lineCenter {
    width: 20%;
    display: inline-block;
    text-align: center;
}

.contractTime {
    width: 100%;
}
</style>
