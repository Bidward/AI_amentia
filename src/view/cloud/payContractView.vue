<template>
<!-- 这是付款合同预览 -->
<div class="cloudCooper">
    <div id="page1">
        <div class="viewTop" style="text-align: center; font-size: 24px;font-weight: 700;">
            <span>马鞍山百助网络科技信息服务框架合同</span>
        </div>
        <div class="viewContent" style=" margin-top: 30px;font-size: 14px;">
            <!-- 甲方 -->
            <ul style="list-style: none; margin-bottom: 30px;">
                <li>
                    <span style="font-size: 14px;line-height: 30px;">甲方：</span>
                    <span style="font-size: 14px;line-height: 30px;">{{addIncome.wecompanyName}}</span>
                </li>

                <li>
                    <span style="font-size: 14px;line-height: 30px;">公司地址：</span>
                    <span style="font-size: 14px;line-height: 30px;">安徽省马鞍山市花山区霍里山大道软件园A栋9楼</span>
                </li>
                <li>
                    <span style="font-size: 14px;line-height: 30px;">联 系 人：</span>
                    <span style="font-size: 14px;line-height: 30px;">{{addIncome.signerName}}</span>
                </li>
                <li>
                    <span style="font-size: 14px;line-height: 30px;">联系电话：</span>
                    <span style="font-size: 14px;line-height: 30px;"></span>
                </li>
                <li>
                    <span style="font-size: 14px;line-height: 30px;">邮 箱：</span>
                    <span style="font-size: 14px;line-height: 30px;"></span>
                </li>
            </ul>
            <!-- 乙方 -->
            <ul style="list-style: none; margin-bottom: 30px;">
                <li>
                    <span style="font-size: 14px;line-height: 30px;">乙方：</span>
                    <span style="font-size: 14px;line-height: 30px;">{{addIncome.contacts}}</span>
                </li>
                <li>
                    <span style="font-size: 14px;line-height: 30px;">公司地址：</span>
                    <span style="font-size: 14px;line-height: 30px;">{{addIncome.openingAddress}}</span>
                </li>
                <li>
                    <span style="font-size: 14px;line-height: 30px;">联 系 人：</span>
                    <span style="font-size: 14px;line-height: 30px;">{{addIncome.contacts}}</span>
                </li>
                <li>
                    <span style="font-size: 14px;line-height: 30px;">联系电话：</span>
                    <span style="font-size: 14px;line-height: 30px;">{{addIncome.tel}}</span>
                </li>
                <li>
                    <!--todo -->
                    <span style="font-size: 14px;line-height: 30px;">邮 箱：</span>
                    <span style="font-size: 14px;line-height: 30px;"></span>
                </li>

            </ul>
            <!-- 鉴于 -->
            <div class="think" style="line-height: 30px;">
                <span>鉴于：</span>
                <p>甲方以及甲方关联企业是运营移动及PC客户端产品推广服务业务的企业，乙方拥有丰富的渠推广资源。</p>
                <p>
                    甲乙双方本着平等互利、优势互补的原则，经协商一致，就乙方为甲方提供
                    <span class="modelData" style="border-bottom: 1px solid #4b4848;">{{addIncome.serviceTwo}}</span>推广服务订立本合同，以兹双方共同遵照执行。
                </p>
            </div>
            <!-- 第一章 -->
            <div class="first" style="margin-top:30px">
                <p class="firstTop" style="text-align: center;font-weight: 600;">
                    <span style="font-size: 14px;line-height: 30px;">第一章</span>
                    <span style="margin-left:20px">声明及保证</span>
                </p>
                <div class="firstMain" style="line-height: 30px; margin-top: 30px;">
                    <p>1.1法律地位</p>
                    <p>每一方均声明及保证，自本合同签署之日起：</p>
                    <p>1）其有资格从事本合同项下之交易，而该等交易符合其经营范围之规定；</p>
                    <p>2）其可全权订立本合同并履行其于本合同项下之义务；</p>
                    <p>3）其授权代表拥有充分授权代表其签署本合同；</p>
                    <p>4）就其所知，其已向另一方披露经注册地或营业地政府部门签发的、可能对履行本合同项下义务产生重大不利影响的所有文件；而且其并非清算、解散或破产程序之主体。</p>
                    <p>1.2 法律效力</p>
                    <p>1）自生效日起，本合同对双方均具有法律约束力。</p>
                    <p>2）每一方均保证本合同的签署与履行及根据本合同所计划之商业交易在任何方面均不违反中国法律。</p>
                </div>
            </div>
            <!-- 第二章 -->
            <div class="first" style="margin-top:30px">
                <p class="firstTop"  style="text-align: center;font-weight: 600;">
                    <span style="font-size: 14px;line-height: 30px;">第二章</span>
                    <span style="margin-left:20px">合同期限</span>
                </p>
                <div class="firstMain" style="line-height: 30px; margin-top: 30px;">
                    <p>
                        本合同期限自
                        <span class="modelData" style="border-bottom: 1px solid #4b4848;">{{addIncome.startTime}}</span>起至
                        <span class="modelData" style="border-bottom: 1px solid #4b4848;">{{addIncome.endTime}}</span>日止。合同期限届满时是否续签，由双方另行协商确定。
                    </p>
                </div>
            </div>
            <!-- 第三章 -->
            <div class="first" style="margin-top:30px">
                <p class="firstTop"  style="text-align: center;font-weight: 600;">
                    <span style="font-size: 14px;line-height: 30px;">第三章</span>
                    <span style="margin-left:20px">合作内容</span>
                </p>
                <div class="firstMain" style="line-height: 30px; margin-top: 30px;">
                    <p>
                        3.1 乙方在甲方指引下为甲方提供
                        <span class="modelData" style="border-bottom: 1px solid #4b4848;">{{addIncome.serviceTwo}}</span> 推广服务，甲方依本合同第五章之约定向乙方支付推广服务报酬。推广价格将以该产品推广当期的价格为准，由双方商议决定。
                    </p>
                    <p>
                        3.2 合作的具体形式为：甲方负责向乙方提供
                        <span class="modelData" style="border-bottom: 1px solid #4b4848;">{{addIncome.service}}</span>业务产品（以下简称“甲方产品”），乙方在其推广渠道（以下简称“乙方渠道”）上发布、推广。
                    </p>
                </div>
            </div>
            <!-- 第四章 -->
            <div class="first" style="margin-top:30px">
                <p class="firstTop" style="text-align: center;font-weight: 600;">
                    <span  style="font-size: 14px;line-height: 30px;">第四章</span>
                    <span style="margin-left:20px">双方权利和义务</span>
                </p>
                <div class="firstMain" style="line-height: 30px; margin-top: 30px;">
                    <p>4.1 甲方的权利和义务</p>
                    <p>4.1.1 甲方负责甲方产品及相关服务的合法性、适当性。</p>
                    <p>4.1.2 甲方负责甲方产品及相关服务的维护、运营和用户管理、客户服务，并承担相应产生的一切费用。</p>
                    <p>4.1.3 甲方按照本协议第五章的约定及时向乙方支付推广服务报酬。</p>
                    <p>4.1.4 甲方应为乙方提供数据查询平台或与结算有关的数据，保证乙方可通过查询平台或者结算数据查询乙方推广产生的独立有效用户数的情况。不同产品的数据核对方式视具体情况而定，详情将在结算单中说明。</p>
                    <p>4.2 乙方的权利和义务</p>
                    <p>4.2.1 乙方在其渠道对甲方产品及相关服务进行宣传推广。</p>
                    <p>4.2.2 乙方负责乙方渠道的建设、技术支持和维护、运营以及对甲方产品进行推广，并承担相应产生的一切费用。</p>
                    <p>4.2.3 乙方保证在推广中保持甲方产品软件的独立和完整性，不对甲方产品软件进行任何的修改或增减，包括程序和内置链接等，也不得封装或捆绑其他任何无关软件、程序或指令。否则，由此引起的法律责任或招致第三方索偿由乙方承担和处理；甲方有权不予结算并立即终止合作，并向乙方追偿因此给甲方造成的全部损失。</p>
                    <p>4.2.4 乙方对甲方产品及相关服务所进行的宣传推广应符合事实及相关法律法规，保证乙方渠道为合法经营网站，并且不基于非法内容进行宣传推广，否则由乙方承担全部责任和损失。</p>
                    <p>4.2.5 乙方保证在推广中不进行任何作弊行为以产生虚假的实施数据或信息，包括操纵以重复手动下载、点击、激活、注册，或通过漫游器、自动化工具、或其它欺骗软件或手段产生下载、点击、激活、注册等制造虚假实施情况数据信息的行为。甲方对乙方作弊行为产生的推广实施数据不予认可。甲方如发现乙方有作弊行为的，应及时通知并将产品方反馈的作弊信息提供给乙方，若乙方在收到甲方信息的24小时内不能举证非乙方渠道责任的，甲方有权即时单方终止合同并终止与乙方结算。</p>
                    <p>4.3 双方共同的权利和义务</p>
                    <p>任何一方经提前10日书面通知对方，可终止或中止合同。但合同之终止或中止并不影响合同项下未完成之结算或任何一方之付款义务以及其它在终止或中止之日前已产生的义务或权利。</p>
                </div>
            </div>
            <!-- 第五章 -->
            <div class="first" style="margin-top:30px">
                <p class="firstTop" style="text-align: center;font-weight: 600;">
                    <span style="font-size: 14px;line-height: 30px;">第五章</span>
                    <span style="margin-left:20px">推广服务报酬</span>
                </p>
                <div class="firstMain" style="line-height: 30px; margin-top: 30px;">
                    <p>5.1 推广服务报酬：</p>
                    <p>甲方向乙方按照单个合作产品进行推广服务费结算的约定，见当期结算单（结算单包括产品名称、渠道号、单价、结算周期、结算数据、结算金额等信息) ，结算单须经双方确认签字/盖章后，方可生效，将作为本合同不可分割的部分，与本合同具有同等法律效力。</p>
                    <p>5.2 结算</p>
                    <p>5.2.1 双方以甲方为乙方提供的，并且双方均确认无误的数据，作为结算依据。</p>
                    <p>5.2.2 结算周期：合作产品结算周期以结算单为准。</p>
                    <p>5.2.3 结算时间:</p>
                    <p>
                        月结产品：甲方与乙方对账出结算单以后，乙方将签章（签章名称须与协议乙方名称完全一致）的结算单（原件）与完整、正确并符合国家税务机关要求之发票一同以快递的形式寄到甲方地址，甲方收到发票和结算单原件确认无误后，须在10个工作日内将乙方收入汇至本协议中乙方指定的收款账号。上述指定截止日期如遇国家法定节假日顺延。如遇特殊情况，双方协商解决。费用结算采用汇款方式，乙方为甲方提供
                        <span class="modelData" style="border-bottom: 1px solid #4b4848;">{{addIncome.tickTypeName}}</span> ，发票的内容为
                        <span class="modelData" style="border-bottom: 1px solid #4b4848;">{{addIncome.tickTextName}}</span>信息/技术服务费</span> 。（乙方如为个人，则只需要将签字的结算单寄给甲方）
                    </p>
                    <p>周结产品：甲乙双方对账出结算单以后，甲方先按结算单金额每周将上周费用支付给乙方，月底乙 方一次性为甲方开具整个月的发票，并将发票及结算单寄到甲方地址。（乙方如为个人，则月底一次性将签字的结算单寄到甲方地址）</p>
                    <p>【乙方的开票信息如下】</p>
                    <ul style="margin-left:20px;margin-top:10px;list-style:none">
                        <li>
                            <span>公司名称：</span>
                            <span>{{addIncome.contractPartycompanyName}}</span>
                        </li>
                        <li>
                            <span>税 号：</span>
                            <span>{{addIncome.contractNum}}</span>
                        </li>
                        <li>
                            <span>地 址：</span>
                            <span>{{addIncome.openingAddress}}</span>
                        </li>
                        <li>
                            <span>联系电话：</span>
                            <span>{{addIncome.tel}}</span>
                        </li>
                        <li>
                            <span>开 户 行：</span>
                            <span>{{addIncome.openbank}}</span>
                        </li>
                        <li>
                            <span>帐 号：</span>
                            <span>{{addIncome.openbankId}}</span>
                        </li>
                    </ul>
                    <p>5.3 甲方指定的用于结算的银行帐户资料如下：</p>
                    <ul style="margin-left:20px;margin-top:10px;list-style:none">
                        <li>
                            <span>开户名：</span>
                            <span>{{addIncome.wecompanyName}}</span>
                        </li>
                        <li>
                            <span>开 户 行：</span>
                            <span></span>
                        </li>
                        <li>
                            <span>帐 号：</span>
                            <span>{{addIncome.wecompanybankName}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 第六章 -->
            <div class="first" style="margin-top:30px">
                <p class="firstTop" style="text-align: center;font-weight: 600;">
                    <span style="font-size: 14px;line-height: 30px;">第六章</span>
                    <span style="margin-left:20px">保密义务</span>
                </p>
                <div class="firstMain" style="line-height: 30px; margin-top: 30px;">
                    <p>6.1 未经对方(“被披露方”)书面许可，任何一方(“披露方”)不得向第三方（有关法律、法规、政府部门、证券交易所或其他监管机构要求和双方的法律、会计、商业及其他顾问、雇员除外）泄露本合同内容以及本合同的签订及履行情况，以及通过签订和履行本合同而获知的对方及对方关联公司的任何信息，否则披露方应承担被披露方因此而受到的损失。</p>
                    <p>6.2 本保密条款在本合同期限内及终止后叁(3)年内仍具有法律效力。</p>
                </div>
            </div>
            <!-- 第七章 -->
            <div class="first" style="margin-top:30px">
                <p class="firstTop" style="text-align: center;font-weight: 600;">
                    <span style="font-size: 14px;line-height: 30px;">第七章</span>
                    <span style="margin-left:20px">反商业贿赂条款</span>
                </p>
                <div class="firstMain" style="line-height: 30px; margin-top: 30px;">
                    <p>7.1 在本合同签订以及履行过程中，乙方：</p>
                    <p>7.1.1 不得向与其有实际或潜在业务关系的甲方或甲方关联公司的员工和/或家属提供任何酬金、礼物或其它有形或无形的利益。</p>
                    <p>7.1.2 不得为甲方或甲方关联公司的员工和/或家属安排可能影响公正签订和/或履行合同的任何活动。</p>
                    <p>7.1.3 给予甲方的折扣均应在合同或补充协议中明示，不得以任何形式在合同或补充协议之外，向甲方或甲方关联公司的员工和/或家属返回折扣、劳务费或信息费等。</p>
                    <p>上述行为或类似行为应被视为商业贿赂，一经发现，即可被视为已经对甲方造成实质性损害，甲方可解除合同，停止所有向乙方的付款，还可要求乙方三倍返还其根据相关合同已经获得的分成或其他合作费用。如因此给甲方或甲方关联公司造成损失，乙方还应继续负责赔偿。乙方在合同签订和履行过程中，如遇甲方或甲方关联公司的员工和/或家属向其索要商业贿赂，应及时向甲方投诉，不得隐瞒。</p>
                    <p>
                        7.2 在本合同签订以及履行过程中，甲方工作人员及其亲属，不得以任何名义接受、索要商业贿赂。甲方工作人员应坚持客观、公正、公平的原则，甲方工作人员或其亲属如与乙方工作人员或亲属有利害关系，甲方工作人员应主动执行回避制度，乙方则应及时通报甲方，不得暗箱操作、恶意串通和
                        弄虚作假，从而抵毁、排挤其他竞争者。如有上述不正当行为发生，甲方除有权给予相关责任人通报批评或经济处罚，涉嫌违法犯罪的移交司法机关处理外，甲方还可解除合同，停止所有向乙方的付款，还可要求乙方三倍返还其根据相关合同已经获得的分成或其他合作费用。如因此给甲方或甲方关联公司造成损失，乙方还应继续负责赔偿。
                    </p>
                </div>
            </div>
            <!-- 第八章 -->
            <div class="first" style="margin-top:30px">
                <p class="firstTop" style="text-align: center;font-weight: 600;">
                    <span style="font-size: 14px;line-height: 30px;">第八章</span>
                    <span style="margin-left:20px">适用法律与争议之解决</span>
                </p>
                <div class="firstMain" style="line-height: 30px; margin-top: 30px;">
                    <p>8.1 适用法律</p>
                    <p>本合同之签署、效力、解释和执行以及本合同项下争议之解决均应适用中国法律。</p>
                    <p>8.2 协商与调解</p>
                    <p>8.2.1 对于因本合同的解释及执行而产生之争议，应首先由双方通过友好协商解决。</p>
                    <p>
                        8.2.2 如双方通过友好协商未能解决争议，则任何一方应将有关争议提交
                        <span class="modelData" style="border-bottom: 1px solid #4b4848;">{{addIncome.court}}</span>（所在地）的人民法院，通过诉讼解决。
                    </p>
                </div>
            </div>
            <!-- 第九章 -->
            <div class="first" style="margin-top:30px">
                <p class="firstTop" style="text-align: center;font-weight: 600;">
                    <span style="font-size: 14px;line-height: 30px;">第九章</span>
                    <span style="margin-left:20px">附则</span>
                </p>
                <div class="firstMain" style="line-height: 30px; margin-top: 30px;">
                    <p>9.1 不可抗力</p>
                    <p>9.1.1 “不可抗力”是指合同双方不能合理控制、不可预见或即使预见亦无法避免的事件，该事件妨碍、影响或延误任何一方根据合同履行其全部或部分义务。该事件包括但不限于任何相关政府机构颁布或修改法规、条例或规定导致本合同的主要条款无效或无法执行、自然灾害、战争、黑客攻击或任何其它类似事件。</p>
                    <p>9.1.2 出现不可抗力事件时，知情方应及时、充分地向对方以书面形式发通知，并告知对方该类事件对本合同可能产生的影响，并应当在15天内提供相关证明。</p>
                    <p>9.1.3 由于以上所述不可抗力事件致使合同的部分或全部不能履行或延迟履行，则双方于彼此间不承担任何违约责任。</p>
                    <p>9.2 修改</p>
                    <p>本合同唯经双方签署之书面合同方可修改。</p>
                    <p>9.3 完整合同</p>
                    <p>本合同构成双方之间完整合同，取代先前所有谈判、协商及合同。本合同之附件是本合同的不可分割的重要组成部分，与本合同具有同等的法律效力。</p>
                    <p>9.4 通知</p>
                    <p>9.4.1 双方之间的任何通知或书面函件必须以中文写成，以传真、专人送达（包括特快专递）或挂号邮件或电子邮件之形式发送。</p>
                    <p>9.4.2 通知及函件之送达为传真形式，则应以传真传送记录所显示之确切时间为准，除非发出该传真之时间为该日下午五（5）时之后，或收件一方所在地之时间并非营业日，则收件日期应为收件一方所在地时间之下一个营业日；若为电子邮件形式，则邮件进入收件方指定之电子邮件系统的时间即视为已送达；若为专人派送时(包括特快专递)，按收件一方签收之日期为准；若以挂号邮件发送时，以邮局所出具之收据为凭，自寄发日起计五(5)个营业日为准。本项所指传真、送达地址及电子邮件信息如下，如有变更应当及时通知另一方</p>
                    <table width="1000" height="200" border="1" cellpadding="0" cellspacing="0" class="tb" style="text-align: center;margin: auto; margin-top: 20px;margin-bottom: 20px">
                        <tr>
                            <td></td>
                            <td>甲方</td>
                            <td>乙方</td>
                        </tr>
                        <tr>
                            <td>送达地址</td>
                            <td>{{addIncome.openingAddress}}</td>
                            <!--乙方地址-->
                            <td></td>
                        </tr>
                        <tr>
                            <td>收件负责人</td>
                            <td>{{addIncome.contacts}}</td>
                            <td>{{addIncome.signerName}}</td>
                        </tr>
                        <tr>
                            <td>联系电话</td>
                            <td>{{addIncome.tel}}</td>
                            <!--乙方联系电话-->
                            <td></td>
                        </tr>
                    </table>
                    <p>9.5 除因履行本合同所必需外，未经对方事先书面同意，一方不得擅自使用、复制对方的商标、标志、商业信息、技术及其他资料。</p>
                    <p>9.6 本合同所指之日为公历日，本合同所指之营业日系指中国的商业银行均营业之日。</p>
                    <p>9.7 本合同自甲乙双方签署之日起生效。本合同一式两份，分别由双方各存壹份，具有同等的法律效力。</p>
                </div>
            </div>
            <!-- 盖章 -->
            <div class="first bottom" style="margin-top:30px">
                <div class="firstMain" style="text-align: center;font-weight: 600;">
                    <p>（以下无正文）</p>
                    <p>本合同由以下各方具有合法之授权代表在合同尾部签署</p>
                    <ul style="margin-top:30px;">
                        <li class="left" style="min-width: 400px;width: 700px; list-style: none;float:left">
                            <span>甲方：</span>
                            <span>马鞍山百助网络科技有限公司</span>
                        </li>
                        <li class="right" style="min-width: 400px;width: 700px; list-style: none;float:right">
                            <span>乙方：</span>
                            <span></span>
                        </li>
                        <div style="clear:both"></div>
                        <div style="margin-top:80px">
                            <li class="left" style="min-width: 400px;width: 700px; list-style: none;float:left">
                                <span>（盖章）</span>
                            </li>
                            <li class="right" style="min-width: 400px;width: 700px; list-style: none;float:right">
                                <span>（盖章）</span>
                            </li>
                            <li class="left" style="min-width: 400px;width: 700px; list-style: none;float:left">
                                <span>授权代表：</span>
                            </li>
                            <li class="right" style="min-width: 400px;width: 700px; list-style: none;float:right">
                                <span>授权代表：</span>
                            </li>
                            <li class="left" style="min-width: 400px;width: 700px; list-style: none;float:left">
                                <span>签字日期：</span>
                            </li>
                            <li class="right" style="min-width: 400px;width: 700px; list-style: none;float:right">
                                <span>签字日期：</span>
                            </li>
                        </div>
                    </ul>
                    <div style="clear:both"></div>
                </div>
            </div>
        </div>
        <!-- 打印关闭 -->
    </div>
    <div class="close">
        <Button class="simple" @click="goBack" style="margin-right:40px">关闭</Button>
        <!-- <Button type="primary" v-print="'#printTest'">打印</Button> -->
    </div>
</div>
</template>

<script>
import {
  baseUrl
} from '@/api/base.js'
// import moment from 'moment'
export default {
  name: 'contracView',
  data () {
    return {
      addIncome: {
        // 甲方
        contractPartycompanyName: [], // 公司名称
        openingAddress: '', // 公司地址，开票地址
        contractNum: '', // 纳说人识别号
        contacts: '', // 联系人
        tel: '', // 联系电话
        openbank: '', // 开户行
        openbankId: '', // 开会行账号
        // 乙方
        wecompanyName: '', // 公司名称
        signerName: '', // 签订人也就是联系人
        wecompanybankName: '', // 账号
        // 鉴定
        serviceTwo: '', // 乙对甲方
        service: '', // 甲方对乙方
        // 第二章
        timeRage: [],
        startTime: '',
        endTime: '',
        ticketType: '',
        tickTextName: '',
        court: '' // 法院
      }
    }
  },
  mounted () {
    this.getData()
  },
  updated () {
    this.print()
  },
  methods: {
    // 获取数据
    getData () {
      console.log(11)
      this.$axios({
        url: baseUrl + '/contract/info',
        method: 'post',
        data: $qs.stringify({
          id: this.$route.query.id
        })
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.addIncome = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err.data)
        })
    },
    // 返回
    goBack () {
      bus.$emit('on-myclose', this.$route)
    },
    // 打印
    print () {
      var tableToPrint = document.getElementById('page1') // 将要被打印的表格
      var newWin = window.open('') // 新打开一个空窗口
      newWin.document.write(tableToPrint.outerHTML) // 将表格添加进新的窗口
      newWin.document.close() // 在IE浏览器中使用必须添加这一句
      newWin.focus() // 在IE浏览器中使用必须添加这一句

      newWin.print() // 打印
      newWin.close() // 关闭窗口
    }
  }
}
</script>

<style scoped>
ul li {
    list-style: none;
}

.viewTop {
    text-align: center;
    font-size: 24px;
    font-weight: 700;
}

.viewContent {
    margin-top: 30px;
    font-size: 14px;
}

.viewContent ul li span {
    font-size: 14px;
    line-height: 30px;
}

.viewContent ul {
    margin-bottom: 30px;
}

.viewContent .think {
    line-height: 30px;
}

.modelData {
    border-bottom: 1px solid #4b4848;
}

.first {
    margin-top: 30px;
}

.firstTop {
    text-align: center;
    font-weight: 600;
}

.firstMain {
    line-height: 30px;
    margin-top: 30px;
}

table {
    text-align: center;
    margin: auto;
    margin-top: 20px;
    margin-bottom: 20px
}

.bottom ul li {
    min-width: 400px;
    width: 700px
}

.left {
    float: left;
}

.right {
    float: right
}

.close {
    text-align: center;
    margin-bottom: 40px;
    margin-top: 40px
}

.btn {
    background: #19aa8d;
    color: white
}
</style>
