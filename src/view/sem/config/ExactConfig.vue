<template>
  <div class="viewWrapper semConfig">
    <Form :label-width="180" :model="data" :rules="validate" id="semConfig" ref="semConfig">
      <div class="selection">
        <h3>营销智能化开关</h3>
        <Row>
          <Col span="12">
            <FormItem label="开关:">
              <i-switch
                :disabled="!isEdit"
                size="large"
                v-model="data.systemSwitch"
                :true-value="1"
                :false-value="0"
              />
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection">
        <h3>全局配置</h3>
        <Row>
          <Col span="10">
            <FormItem label="01账号公司网址" prop="domain">
              <Input class="wd80" v-if="isEdit" v-model="data.domain" />
              <h3 v-else>{{data.domain}}</h3>
            </FormItem>
          </Col>
          <Col span="2">
            <Button v-if="isEdit&&!isTest" @click="setDomain">调整</Button>
          </Col>
        </Row>
      </div>
      <div class="selection">
        <h3>通用创意</h3>
        <Row>
          <Col span="12">
            <FormItem label="创意标题" prop="creativeTitleNormal">
              <div v-if="isEdit">
                <Input class="wd80" v-model="data.creativeTitleNormal" id="creativeTitleNormal">
                  <span
                    class="pointer"
                    slot="append"
                    @click="appendGroupName('creativeTitleNormal')"
                  >{ }</span>
                </Input>
                <span class="tip">
                  <span
                    :class="{red:getCharLength(data.creativeTitleNormal,20)>50}"
                  >{{ getCharLength(data.creativeTitleNormal,20)}}</span>/50
                </span>
              </div>
              <h3 v-else>{{data.creativeTitleNormal}}</h3>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="创意描述1" prop="creativeDescriptOneNormal">
              <div v-if="isEdit">
                <Input
                  class="wd80"
                  v-model="data.creativeDescriptOneNormal"
                  id="creativeDescriptOneNormal"
                >
                  <span
                    class="pointer"
                    slot="append"
                    @click="appendGroupName('creativeDescriptOneNormal')"
                  >{ }</span>
                </Input>
                <span class="tip">
                  <span
                    :class="{red:getCharLength(data.creativeDescriptOneNormal,20)>80}"
                  >{{ getCharLength(data.creativeDescriptOneNormal,20)}}</span>/80
                </span>
              </div>
              <h3 v-else>{{data.creativeDescriptOneNormal}}</h3>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="创意描述2" prop="creativeDescriptTwoNormal">
              <div v-if="isEdit">
                <Input
                  class="wd80"
                  v-model="data.creativeDescriptTwoNormal"
                  id="creativeDescriptTwoNormal"
                >
                  <span
                    class="pointer"
                    slot="append"
                    @click="appendGroupName('creativeDescriptTwoNormal')"
                  >{ }</span>
                </Input>
                <span class="tip">
                  <span
                    :class="{red:getCharLength(data.creativeDescriptTwoNormal,20)>80}"
                  >{{ getCharLength(data.creativeDescriptTwoNormal,20)}}</span>/80
                </span>
              </div>
              <h3 v-else>{{data.creativeDescriptTwoNormal}}</h3>
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection">
        <h3>朴素创意（默认版）</h3>
        <Row>
          <Col span="12">
            <FormItem label="创意标题:" prop="creativeTitleDefault">
              <div v-if="isEdit">
                <Input class="wd80" v-model="data.creativeTitleDefault" id="creativeTitleDefault">
                  <span
                    class="pointer"
                    slot="append"
                    @click="appendGroupName('creativeTitleDefault')"
                  >{ }</span>
                </Input>
                <span class="tip">
                  <span
                    :class="{red:getCharLength(data.creativeTitleDefault,20)>50}"
                  >{{ getCharLength(data.creativeTitleDefault,20)}}</span>/50
                </span>
              </div>
              <h3 v-else>{{data.creativeTitleDefault}}</h3>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="创意描述1:" prop="creativeDescriptOneDefault">
              <div v-if="isEdit">
                <Input
                  class="wd80"
                  v-model="data.creativeDescriptOneDefault"
                  id="creativeDescriptOneDefault"
                >
                  <span
                    class="pointer"
                    slot="append"
                    @click="appendGroupName('creativeDescriptOneDefault')"
                  >{ }</span>
                </Input>
                <span class="tip">
                  <span
                    :class="{red:getCharLength(data.creativeDescriptOneDefault,20)>80}"
                  >{{ getCharLength(data.creativeDescriptOneDefault,20)}}</span>/80
                </span>
              </div>
              <h3 v-else>{{data.creativeDescriptOneDefault}}</h3>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="创意描述2:" prop="creativeDescriptTwoDefault">
              <div v-if="isEdit">
                <Input
                  class="wd80"
                  v-model="data.creativeDescriptTwoDefault"
                  id="creativeDescriptTwoDefault"
                >
                  <span
                    class="pointer"
                    slot="append"
                    @click="appendGroupName('creativeDescriptTwoDefault')"
                  >{ }</span>
                </Input>
                <span class="tip">
                  <span
                    :class="{red:getCharLength(data.creativeDescriptTwoDefault,20)>80}"
                  >{{ getCharLength(data.creativeDescriptTwoDefault,20)}}</span>/80
                </span>
              </div>
              <h3 v-else>{{data.creativeDescriptTwoDefault}}</h3>
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection">
        <h3>朴素创意（缩短版）</h3>
        <Row>
          <Col span="12">
            <FormItem label="创意标题:" prop="creativeTitleShort">
              <div v-if="isEdit">
                <Input class="wd80" v-model="data.creativeTitleShort" id="creativeTitleShort">
                  <span
                    class="pointer"
                    slot="append"
                    @click="appendGroupName('creativeTitleShort')"
                  >{ }</span>
                </Input>
                <span class="tip">
                  <span
                    :class="{red:getCharLength(data.creativeTitleShort,36)>50}"
                  >{{ getCharLength(data.creativeTitleShort,36)}}</span>/50
                </span>
              </div>
              <h3 v-else>{{data.creativeTitleShort}}</h3>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="创意描述1:" prop="creativeDescriptOneShort">
              <div v-if="isEdit">
                <Input
                  class="wd80"
                  v-model="data.creativeDescriptOneShort"
                  id="creativeDescriptOneShort"
                >
                  <span
                    class="pointer"
                    slot="append"
                    @click="appendGroupName('creativeDescriptOneShort')"
                  >{ }</span>
                </Input>
                <span class="tip">
                  <span
                    :class="{red:getCharLength(data.creativeDescriptOneShort,36)>80}"
                  >{{ getCharLength(data.creativeDescriptOneShort,36)}}</span>/80
                </span>
              </div>
              <h3 v-else>{{data.creativeDescriptOneShort}}</h3>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="创意描述2:" prop="creativeDescriptTwoShort">
              <div v-if="isEdit">
                <Input
                  class="wd80"
                  v-model="data.creativeDescriptTwoShort"
                  id="creativeDescriptTwoShort"
                >
                  <span
                    class="pointer"
                    slot="append"
                    @click="appendGroupName('creativeDescriptTwoShort')"
                  >{ }</span>
                </Input>
                <span class="tip">
                  <span
                    :class="{red:getCharLength(data.creativeDescriptTwoShort,36)>80}"
                  >{{ getCharLength(data.creativeDescriptTwoShort,36)}}</span>/80
                </span>
              </div>
              <h3 v-else>{{data.creativeDescriptTwoShort}}</h3>
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection">
        <h3>更换模板</h3>
        <Row>
          <Col span="24">
            <FormItem>
              <span>更换模板时间</span>
              <CheckboxGroup v-model="data.changeTemplateTime">
                <Checkbox
                  :disabled="!isEdit"
                  v-for="item in 24"
                  :value="item-1"
                  :key="item-1"
                  :label="item-1"
                >
                  <span>{{item-1}}</span>
                </Checkbox>
              </CheckboxGroup>
              <!-- <span>不更换模板时间段</span>
            <TimePicker :disabled="!isEdit" :clearable="false" v-model="data.changeTemplateStartTime" format="HH:mm" />
            <span>至</span>
              <TimePicker :disabled="!isEdit" :clearable="false" v-model="data.changeTemplateEndTime" format="HH:mm" />-->
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem>
              <span>单位收益低于</span>
              <InputNumber size="small" :disabled="!isEdit" v-model="data.changeTemplateLowProfit" />
              <span>直接下线</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem>
              <span>达到</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.changeTemplateNum"
                :precision="0"
              />
              <span>安装量，未达到</span>
              <InputNumber size="small" :disabled="!isEdit" v-model="data.changeTemplateRatio" />
              <span>%点击安装率进行更换，盈亏大于</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.changeTemplateGreaterPercost"
              />
              <span>不进行更换</span>
              <!-- 2017.8.27注释，不再需要 -->
              <!-- <span>，盈亏小于</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.changeTemplateSmallerPercost"
              />
              <span>直接下线</span>-->
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem>
              <span>所有模板更换完成，记录所有超过</span>
              {{data.changeTemplateRatio}}
              <span>%点击安装率的模板数据，超过</span>
              {{data.changeTemplateRatio}}
              <span>%点击安装率的模板不足</span>
              <InputNumber size="small" :disabled="!isEdit" v-model="data.changeTemplateBeyondNum" />
              <span>个时，记录点击安装率排名前{{data.changeTemplateBeyondNum}}</span>
              <span>的所有模板数据</span>
            </FormItem>
          </Col>
        </Row>
      </div>

      <div class="selection">
        <h3>推广组</h3>
        <Row>
          <Col span="12">
            <FormItem label="默认出价：" prop="price">
              <InputNumber v-if="isEdit" :max="10" :min="0.3" :step="0.01" v-model="data.price" />
              <h3 v-else>{{data.price}}</h3>
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection">
        <h3>关键词</h3>
        <Row>
          <Col span="8">
            <FormItem prop="checkAreas" label="盈利情况，最低出价：">
              <InputNumber size="small" :disabled="!isEdit" v-model="data.keywordProfitLowPrice" />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem prop="checkAreas" label="亏损情况，最低出价：">
              <InputNumber size="small" :disabled="!isEdit" v-model="data.keywordDeficitLowPrice" />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem prop="checkAreas" label="短语转精确，最低点击数：">
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.keywordTurnLowClicks"
                :precision="0"
              />
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection">
        <h3>违规词类别</h3>
        <Row>
          <Col span="12">
            <FormItem prop="banList" label="违规词原因：">
              <div class="wd80">
                <Tag
                  v-for="(item,index) in data.keywordTag"
                  :key="index"
                  :closable="isEdit"
                  @on-close="handleClose(index,'keywordTag')"
                >{{item}}</Tag>
              </div>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="isEdit">
          <Col span="12">
            <FormItem prop="banList" class="addBanList">
              <Input
                class="wd80"
                v-model="banItem.keywordTag"
                search
                enter-button="添加"
                @on-search="v=>addList(v,'keywordTag')"
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem prop="banList" label="违法词原因：">
              <div class="wd80">
                <Tag
                  v-for="(item,index) in data.keywordReason"
                  :key="index"
                  :closable="isEdit"
                  @on-close="handleClose(index,'keywordReason')"
                >{{item}}</Tag>
              </div>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="isEdit">
          <Col span="12">
            <FormItem prop="banList" class="addBanList">
              <Input
                class="wd80"
                v-model="banItem.keywordReason"
                search
                enter-button="添加"
                @on-search="v=>addList(v,'keywordReason')"
              />
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection">
        <h3>默认点击数</h3>
        <Row>
          <Col span="12" prop="clickPerWords">
            <FormItem label="单个搜索词累加总点击数：">
              <InputNumber v-if="isEdit" v-model="data.clickPerWords" :precision="0" />
              <h3 v-else>{{data.clickPerWords}}</h3>
            </FormItem>
          </Col>
          <Col span="12" prop="clickPerhour">
            <FormItem label="每小时关键词平均点击数：">
              <InputNumber v-if="isEdit" v-model="data.clickPerhour" :precision="0" />
              <h3 v-else>{{data.clickPerhour}}</h3>
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection">
        <h3>调价</h3>
        <Row>
          <Col>
            <FormItem label="出价上限：">
              <InputNumber size="small" :disabled="!isEdit" v-model="data.maxPrice" :precision="2" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="低展现关键词：">
              <span>若前一天启用关键词展现数&lt;=</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.lowPvKeywordPv"
                :precision="0"
              />
              <span>，第二天自动加价</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.lowPvKeywordAddPrice"
                :precision="2"
              />
              <span>，出价上限</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.lowPvKeywordMaxPrice"
                :precision="2"
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="广告点击量：">
              <span>累计</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.priceCountClicks"
                :precision="0"
              />
              <span>广告点击量，广告点击安装率=&lt;</span>
              <!-- <span>点击量判断点击安装率低于</span> -->
              <InputNumber size="small" :disabled="!isEdit" v-model="data.priceCountClicksRatio" />
              <span>%，或</span>
            </FormItem>
            <FormItem>
              <span>累计</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.click4Offline"
                :precision="0"
              />
              <span>广告点击量，广告点击安装率&lt;=</span>
              <!-- <span>点击量，点击安装率&lt;=</span> -->
              <InputNumber size="small" :disabled="!isEdit" v-model="data.setupRatio4Offline" />
              <span>%的亏损词，直接下线</span>
              <!-- <span>%，直接下线</span> -->
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="下降比率：">
              <span>累计</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.priceCountSetups"
                :precision="0"
              />
              <span>安装量判断打开安装率下降比率超过</span>
              <InputNumber size="small" :disabled="!isEdit" v-model="data.priceCountSetupsRatio" />
              <span>%，</span>
              <span>点击安装率下降比率超过</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.priceCountClicksSetupsRatio"
              />
              <span>%</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="安装量：">
              <span>累计</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.priceCountSetupsCheck"
                :precision="0"
              />
              <span>安装量进行调价判断</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="竞价最大出价计算的点击安装率：">
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.priceCompetMaxPriceSetupsRatio"
              />%
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="盈亏/最大出价系数：">
              <InputNumber size="small" :disabled="!isEdit" v-model="data.numRatio" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="账户返点系数：">
              <InputNumber size="small" :disabled="!isEdit" v-model="data.accountRatio" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="媒体返点">
              <InputNumber size="small" :disabled="!isEdit" v-model="data.mediaRadio" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="最大出价判断点：">
              <InputNumber size="small" :disabled="!isEdit" v-model="data.priceMaxPrice" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="竞价最大出价判断点：">
              <InputNumber size="small" :disabled="!isEdit" v-model="data.priceCompetSetupRatio" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="无排名：">
              <span>【编号22】盈亏&gt;=</span>
              <InputNumber size="small" :disabled="!isEdit" v-model="data.priceRankPercost22" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem>
              <span>【编号23】盈亏&lt;{{data.priceRankPercost22}}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="第一次调价（8:15）：">
              <span>昨日安装量&gt;=</span>
              <InputNumber size="small" :disabled="!isEdit" v-model="data.yesterdaySetupsForJudge" />
              <span>的关键词，每天第一次调价使用成本表前一天的数据</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem>
              <span>【编号2.3.4】盈亏&gt;=</span>
              <InputNumber size="small" :disabled="!isEdit" v-model="data.priceOne234Percost" />
              <span>，排名1到</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.priceOne234RankFirst"
                :precision="2"
              />
              <span>，{{data.priceOne234RankFirst+0.01}}到</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.priceOne234RankEnd"
                :precision="2"
              />，
              <span>{{data.priceOne234RankEnd+0.01}}到+∞</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem>
              【编号5.6.7.8.24】盈亏&lt;0，排名1到
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.priceOne567Rank"
                :precision="2"
              />
              <span>；{{data.priceOne567Rank+0.01}}到+∞，</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="第二次调价（9:15）：">
              <span>【编号9.10】盈亏&gt;=</span>
              <InputNumber size="small" :disabled="!isEdit" v-model="data.priceTwo910Percost" />
              <span>，排名判断点判断点：</span>
              <InputNumber size="small" :disabled="!isEdit" v-model="data.priceTwo910Rank" />
              <!-- <span>，展现点击率下降判断点：</span>
              <InputNumber size="small" :disabled="!isEdit" v-model="data.priceTwo910ClickRatio" />%-->
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem>
              <span>【编号11】盈亏&lt;{{data.priceTwo910Percost}}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem>
              <span>【编号12.13】盈亏判断点：</span>
              <InputNumber size="small" :disabled="!isEdit" v-model="data.priceTwo1213Percost" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem>
              <span>【编号12.22】排名判断点：</span>
              <InputNumber size="small" :disabled="!isEdit" v-model="data.priceTwo1222Rank" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem>
              <span>【编号14】盈亏判断点：</span>
              <InputNumber size="small" :disabled="!isEdit" v-model="data.priceTwo14Percost" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem>
              <span>【编号16.17.18】盈亏判断点：</span>
              <InputNumber size="small" :disabled="!isEdit" v-model="data.priceTwo161718Percost" />
            </FormItem>
          </Col>
        </Row>
        <!-- 2019年12月11日 PM汪洋注释 -->
        <!-- <Row>
          <Col span="24">
            <FormItem label="第三次调价（10:15）：">
              <span>【编号19.20】盈亏&gt;=</span>
              <InputNumber size="small" :disabled="!isEdit" v-model="data.priceTwo1920Percost" />
              <span>，展现点击率下降判断点：</span>
              <InputNumber size="small" :disabled="!isEdit" v-model="data.priceTwo1920ClickRatio" />%
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem>
              <span>【编号21】盈亏&lt;{{data.priceTwo1920Percost}}</span>
            </FormItem>
          </Col>
        </Row> -->
        <Row>
          <Col span="24">
            <FormItem label="下线：">
              <span>【编号27.28】点击安装率判断点：</span>
              <InputNumber size="small" :disabled="!isEdit" v-model="data.offline2627SetupsRatio" />
              <span>%</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem>
              <span>【编号26.27】：盈亏判断点</span>
              <InputNumber size="small" :disabled="!isEdit" v-model="data.offline2527Percost" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem>
              <span>【编号28】：转朴素单位收益判断点</span>
              <InputNumber size="small" :disabled="!isEdit" v-model="data.offline28ProfitCheck" />
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection">
        <h3>站内信</h3>
        <Row>
          <FormItem label>
            <Col span="12">
              <span>打开安装率降低超过</span>
              <!-- 19.11.27注释 PM汪洋 -->
              <!-- <InputNumber v-model="data.stationXzOpenSetupFallRation" :disabled="!isEdit" size="small" /> -->
              <span>{{data.priceCountSetupsRatio}}%，且昨日安装大于</span>
              <InputNumber
                v-model="data.stationXzOpenSetupLastdayNum"
                :disabled="!isEdit"
                size="small"
              />
              <span>，进行站内信提醒</span>
            </Col>
            <Col span="12">
              <span>点击安装率下降超过</span>
              <!-- 19.11.27注释  PM汪洋-->
              <!-- <InputNumber v-model="data.stationClickSetupFallRation" :disabled="!isEdit" size="small" /> -->
              <span>{{data.priceCountClicksSetupsRatio}}%，且昨日安装大于</span>
              <InputNumber
                v-model="data.stationClickSetupLastdayNum"
                :disabled="!isEdit"
                size="small"
              />
              <span>，进行站内信提醒</span>
            </Col>
          </FormItem>
        </Row>
        <Row>
          <FormItem label>
            <Col span="12">
              <span>调价流程报异常，且昨日安装大于</span>
              <InputNumber v-model="data.stationErrorLastdayNum" :disabled="!isEdit" size="small" />
              <span>，进行站内信提醒</span>
            </Col>
            <Col span="12">
              <span>关键词下线，且昨日安装大于</span>
              <InputNumber
                v-model="data.stationOfflineLastdayNum"
                :disabled="!isEdit"
                size="small"
              />
              <span>，进行站内信提醒</span>
            </Col>
          </FormItem>
        </Row>
        <Row>
          <FormItem label>
            <Col span="12">
              <span>关键词转朴素，且昨日安装大于</span>
              <InputNumber
                v-model="data.stationToSimplyLastdayNum"
                :disabled="!isEdit"
                size="small"
              />
              <span>，进行站内信提醒</span>
            </Col>
          </FormItem>
        </Row>
      </div>
      <div class="selection">
        <h3>上线</h3>
        <Row>
          <Col span="24">
            <FormItem label>
              <span>变现差值</span>
              <InputNumber
                :disabled="!isEdit"
                size="small"
                v-model="promote"
                :min="0"
                :step="0.01"
                :precision="2"
              />
              <span>以内的关键词上线</span>
              <Button type="primary" :disabled="!isEdit||isTest" @click="handlePromote">上线</Button>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label>
              <span>每天</span>
              <TimePicker
                :disabled="!isEdit"
                :clearable="false"
                v-model="data.onlineDayTime"
                format="HH:mm"
              />
              <span>上线前一天盈利达到</span>
              <InputNumber
                :disabled="!isEdit"
                size="small"
                v-model="data.onlineDayUpTime"
                :min="1"
                :max="25"
                :step="1"
                :precision="0"
              />
              <span>小时的关键词</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label>
              <span>每天</span>
              <TimePicker
                :disabled="!isEdit"
                :clearable="false"
                v-model="data.onlineStopTime"
                format="HH:mm"
              ></TimePicker>
              <span>上线前一天安装&gt;=</span>
              <InputNumber :disabled="!isEdit" size="small" v-model="data.onlineYesterdaySetups" />
              <span>，最大出价&gt;=</span>
              <InputNumber :disabled="!isEdit" size="small" v-model="data.onlineMaxPriceUp" />
              <span>的暂停词语</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label>
              <span>每个工作日</span>
              <TimePicker
                :disabled="!isEdit"
                :clearable="false"
                v-model="data.autoProChangeTimeFrom"
                format="HH:mm"
              />
              <span>和</span>
              <TimePicker
                :disabled="!isEdit"
                :clearable="false"
                v-model="data.autoProChangeTimeTo"
                format="HH:mm"
              />
              <span>调整前</span>
              <InputNumber
                :disabled="!isEdit"
                size="small"
                v-model="data.autoProChangeDayFrom"
                :step="1"
                :precision="0"
              />
              <span>个工作日和前</span>
              <InputNumber
                :disabled="!isEdit"
                size="small"
                v-model="data.autoProChangeDayTo"
                :step="1"
                :precision="0"
              />
              <span>个工作日之间所有天数的真实收益</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label>
              <span>在</span>
              <InputNumber
                :disabled="!isEdit"
                size="small"
                v-model="data.onlineDayProfitChange"
                :step="1"
                :precision="0"
              />
              <span>天内进行收益调整的情况下，安装数&gt;=</span>
              <InputNumber :disabled="!isEdit" size="small" v-model="data.onlineProfitSetupsUp" />
              <span>，最大出价&gt;=</span>
              <InputNumber :disabled="!isEdit" size="small" v-model="data.onlineMaxPriceUp" />
              <span>的关键词，若盈利则原价上线，若亏损则以最大出价上线</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label>
              <span>新词第二天上线时，点击安装率&lt;</span>
              <InputNumber :disabled="!isEdit" size="small" v-model="data.onlineSetupsRadioLow" />
              <span>%，或单位收益&lt;</span>
              <InputNumber :disabled="!isEdit" size="small" v-model="data.onlineProfitLow" />
              <span>的关键词，不重新上线</span>
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection">
        <h3>下线</h3>
        <Row>
          <Col span="20">
            <FormItem>
              <span>日期：</span>
              <DatePicker
                v-model="offline.date"
                :disabled="!isEdit"
                :options="options"
                type="date"
                placement="bottom-end"
                class="wd120"
              />
            </FormItem>
            <FormItem>
              <span>单位收益：推广软件收益</span>
              <Select v-model="offline.recommendType" :disabled="!isEdit" class="wd120">
                <Option label="增加" value="add" />
                <Option label="减少" value="reduce" />
              </Select>
              <InputNumber v-model="offline.recommendNum" :min="0" :disabled="!isEdit" />
              <span>%，</span>
            </FormItem>
            <FormItem>
              <span>换包收益</span>
              <Select v-model="offline.change" :disabled="!isEdit" class="wd120">
                <Option label="正常" value="normal" />
                <Option label="取消" value="cancel" />
              </Select>
            </FormItem>
            <FormItem>
              <span>其他收益</span>
              <Select v-model="offline.otherType" :disabled="!isEdit" class="wd120">
                <Option label="增加" value="add" />
                <Option label="减少" value="reduce" />
              </Select>
              <InputNumber v-model="offline.otherNum" :min="0" :disabled="!isEdit" />
              <span>后，</span>
            </FormItem>
            <FormItem>
              <span>最大出价&gt;=</span>
              <InputNumber v-model="offline.maxPrice" :disabled="!isEdit" />
              <span>的关键词上线，最大出价&lt;{{offline.maxPrice}}的关键词下线</span>
              <Button :disabled="!isEdit||isTest" @click="handleOffline" type="error">调整</Button>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem prop="isolateProductName">
              <span title="英文逗号隔开">智能化屏蔽产品：</span>
              <Input :disabled="!isEdit" v-model="data.isolateProductName" />
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection">
        <h3>优化关键词</h3>
        <Row>
          <FormItem label>
            <span>历史最大点击&gt;=</span>
            <InputNumber v-model="data.optWordMaxClick" :disabled="!isEdit" size="small" />
            <span>或历史最大安装&gt;=</span>
            <InputNumber v-model="data.optWordMaxSetup" :disabled="!isEdit" size="small" />
          </FormItem>
        </Row>
        <Row>
          <FormItem label>
            <span>小时达到</span>
            <InputNumber v-model="data.optWordSetupHour" :disabled="!isEdit" size="small" />
            <span>安装或每天达到</span>
            <InputNumber v-model="data.optWordSetupDay" :disabled="!isEdit" size="small" />
            <span>安装，且历史最大出价&gt;=</span>
            <InputNumber v-model="data.optWordMaxPrice" :disabled="!isEdit" size="small" />
          </FormItem>
        </Row>
        <Row>
          <FormItem label>
            <span>点击安装率&lt;</span>
            <InputNumber v-model="data.optWordSetupClick" :disabled="!isEdit" size="small" />
            <span>%或点击安装率&lt;</span>
            <InputNumber v-model="data.optWordSetupOpen" :disabled="!isEdit" size="small" />
            <span>%</span>
          </FormItem>
        </Row>
      </div>
      <div class="selection">
        <h3>成本表</h3>
        <Row>
          <FormItem label>
            <span>周末推广软件收益占工作日收益比例为</span>
            <InputNumber v-model="data.weekendIncomeRadio" :disabled="!isEdit" size="small" />
            <span>%</span>
          </FormItem>
        </Row>
        <Row>
          <FormItem label>
            <span>数据预警时间</span>
            <!-- <TimePicker type="timerange" v-model="data.timeRange" placement="bottom-end" placeholder="时间选择" class="wd120" /> -->
            <InputNumber
              v-model="data.warnTimeStart"
              :min="0"
              :max="23"
              :disabled="!isEdit"
              size="small"
            />
            <span>点至</span>
            <InputNumber
              v-model="data.warnTimeEnd"
              :min="0"
              :max="23"
              :disabled="!isEdit"
              size="small"
            />
            <span>点，正常数据范围：</span>
          </FormItem>
          <FormItem>
            <span>点击安装率</span>
            <InputNumber
              v-model="data.warnClickSetupStart"
              :min="0"
              :max="100"
              :disabled="!isEdit"
              size="small"
            />
            <span>%到</span>
            <InputNumber
              v-model="data.warnClickSetupEnd"
              :min="0"
              :max="100"
              :disabled="!isEdit"
              size="small"
            />
            <span>%，平均排名</span>
            <InputNumber
              v-model="data.warnAvgPostionStart"
              :min="1"
              :disabled="!isEdit"
              size="small"
            />
            <span>到</span>
            <InputNumber
              v-model="data.warnAvgPostionEnd"
              :min="1"
              :disabled="!isEdit"
              size="small"
            />
            <span>，平均出价</span>
            <InputNumber v-model="data.warnAvgPriceStart" :disabled="!isEdit" size="small" />
            <span>到</span>
            <InputNumber v-model="data.warnAvgPriceEnd" :disabled="!isEdit" size="small" />
            <span>，最大出价</span>
            <InputNumber v-model="data.warnMaxPriceStart" :disabled="!isEdit" size="small" />
            <span>到</span>
            <InputNumber v-model="data.warnMaxPriceEnd" :disabled="!isEdit" size="small" />
          </FormItem>
          <FormItem>
            <span>展现点击率</span>
            <InputNumber v-model="data.warnViewClickStart" :disabled="!isEdit" size="small" />
            <span>%到</span>
            <InputNumber v-model="data.warnViewClickEnd" :disabled="!isEdit" size="small" />
            <span>%，盈亏</span>
            <InputNumber v-model="data.warnProfitInoutStart" :disabled="!isEdit" size="small" />
            <span>到</span>
            <InputNumber v-model="data.warnProfitInoutEnd" :disabled="!isEdit" size="small" />
            <span>，成本</span>
            <InputNumber v-model="data.warnCostStart" :disabled="!isEdit" size="small" />
            <span>到</span>
            <InputNumber v-model="data.warnCostEnd" :disabled="!isEdit" size="small" />
            <span>，单位收益</span>
            <InputNumber v-model="data.warnProfitAllStart" :disabled="!isEdit" size="small" />
            <span>到</span>
            <InputNumber v-model="data.warnProfitAllEnd" :disabled="!isEdit" size="small" />
          </FormItem>
          <FormItem>
            <span>换包收益</span>
            <InputNumber v-model="data.warnProfitChgStart" :disabled="!isEdit" size="small" />
            <span>到</span>
            <InputNumber v-model="data.warnProfitChgEnd" :disabled="!isEdit" size="small" />
            <span>，利润率</span>
            <InputNumber v-model="data.warnProfitInradioStart" :disabled="!isEdit" size="small" />
            <span>%到</span>
            <InputNumber v-model="data.warnProfitInradioEnd" :disabled="!isEdit" size="small" />
            <span>%，推荐软件</span>
            <InputNumber v-model="data.warnSoftTjStart" :disabled="!isEdit" size="small" />
            <span>到</span>
            <InputNumber v-model="data.warnSoftTjEnd" :disabled="!isEdit" size="small" />
            <span>，打开安装率</span>
            <InputNumber v-model="data.warnOpenSetupStart" :disabled="!isEdit" size="small" />
            <span>%到</span>
            <InputNumber v-model="data.warnOpenSetupEnd" :disabled="!isEdit" size="small" />
            <span>%</span>
          </FormItem>
          <FormItem>
            <span>小时和天表的合计/平均数据超出上述数据范围后，自动关闭智能化开关，并发送钉钉提醒。</span>
          </FormItem>
        </Row>
      </div>
      <div class="selection">
        <h3>360数据统计</h3>
        <Row>
          <Col span="12">
            <FormItem label="根据安装量">
              <span>每日表放入昨日安装量&gt;=</span>
              <InputNumber v-model="data.statisDaySetup" :disabled="!isEdit" size="small" />
              <span>安装量的关键词</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem>
              <span>小时表放入昨日安装量&gt;=</span>
              <InputNumber v-model="data.statisHourSetup" :disabled="!isEdit" size="small" />
              <span>安装量的关键词，或今日累计安装量&gt;=</span>
              <InputNumber v-model="data.statisHourAddupSetup" :disabled="!isEdit" size="small" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="根据点击数">
              <span>每日表放入昨日点击数&gt;=</span>
              <InputNumber v-model="data.statisDayClick" :disabled="!isEdit" size="small" />
              <span>点击数的关键词</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem>
              <span>小时表放入昨日点击数&gt;=</span>
              <InputNumber v-model="data.statisHourClick" :disabled="!isEdit" size="small" />
              <span>点击数的关键词，或今日累计点击数&gt;=</span>
              <InputNumber v-model="data.statisHourAddupClick" :disabled="!isEdit" size="small" />
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection">
        <h3 title="格式为：1-100,101-200">营销渠道号区间</h3>
        <Row>
          <Col span="12">
            <FormItem label="360营销区间" prop="appIdRange360">
              <Input v-model="data.appIdRange360" :disabled="!isEdit" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="百度营销区间" prop="appIdRangeBaidu">
              <Input v-model="data.appIdRangeBaidu" :disabled="!isEdit" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="搜狗营销区间" prop="appIdRangeSogou">
              <Input v-model="data.appIdRangeSogou" :disabled="!isEdit" />
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection">
        <h3>钉钉默认接收人</h3>
        <Row>
          <Col span="12">
            <FormItem label="钉钉默认接收人" prop="ddReceiver">
              <Select filterable v-model="data.ddReceiver" multiple :disabled="!isEdit">
                <Option
                  v-for="person in incumbencyUserList"
                  :value="person.nickname"
                  :key="person.id"
                >{{person.nickname}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection">
        <h3>检测地区</h3>
        <Row>
          <Col span="12">
            <FormItem prop="checkAreas" label="检测地区:">
              <Input type="textarea" v-if="isEdit" v-model="data.checkAreas" />
              <h3 v-else>{{data.checkAreas}}</h3>
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection">
        <h3>投放地区</h3>
        <Row>
          <Tree :data="treeData" ref="tree" show-checkbox check-directly></Tree>
        </Row>
      </div>
      <div class="selection" style="text-align:center;">
        <Button class="btns" v-if="isEdit" @click="cancel">取消</Button>
        <Button class="btns" @click="closePage">关闭</Button>
        <Button class="btns" type="primary" v-if="isEdit" @click="submit">保存</Button>
        <Button class="btns" type="primary" v-else-if="permission.config" @click="isEdit=!isEdit">编辑</Button>
      </div>
    </Form>
  </div>
</template>
<script>
import { semUrl, baseUrl, semGaohanUrl } from '@/api/base.js'
import { getCharLength } from '../tools'
import { areaToCity } from './area.js'
import moment from 'moment'
import config from '@/config'
import { Track } from '@/libs/track.js'
const { isTest } = config
const track = new Track('营销/配置/精确配置')

export default {
  name: 'semConfig',
  data () {
    return {
      isTest,
      isEdit: false,
      treeData: [],
      promote: 0.03,
      incumbencyUserList: [], // 在职人员列表
      data: {
        systemSwitch: '1', // 营销智能化开关

        // 全局配置
        domain: 'http://www.daque.cn', // 01账号公司网址
        // 通用创意
        creativeTitleNormal: '', // 创意标题
        creativeDescriptOneNormal: '', // 创意描述1
        creativeDescriptTwoNormal: '', // 创意描述2
        // 朴素创意默认
        creativeTitleDefault: '', // 创意标题
        creativeDescriptOneDefault: '', // 创意描述1
        creativeDescriptTwoDefault: '', // 创意描述2
        // 朴素缩短版
        creativeTitleShort: '', // 创意标题
        creativeDescriptOneShort: '', // 创意描述1
        creativeDescriptTwoShort: '', // 创意描述2
        // 更换模板
        changeTemplateTime: [], // 更换模板的时间数组
        // changeTemplateStartTime: '', // 不更模板开始时间
        // changeTemplateEndTime: '', // 不更换模板结束时间

        changeTemplateLowProfit: 0, // 单位收益低于${}直接下线
        changeTemplateNum: 0, // 达到${}点击安装率
        changeTemplateGreaterPercost: 0, // 盈亏大于${}不进行更换
        // changeTemplateSmallerPercost: 0, // 小于${}直接下线
        changeTemplateRatio: 0, // 未达到${}点击安装率
        changeTemplateBeyondNum: 0, // ${}个时
        // 推广组
        price: 0, // 默认出价
        // 关键词
        keywordProfitLowPrice: 0, // 盈利最低出价
        keywordDeficitLowPrice: 0, // 亏损最低出价
        keywordTurnLowClicks: 0, // 短语转精确最低点击
        // 违规词类别
        keywordTag: [], // 违法词原因
        keywordReason: [], // 违法词原因

        // 默认点击数
        clickPerWords: 0, // 单个搜索词累加总点击数
        clickPerhour: 0, // 每小时关键词平均总点击数

        // 调价
        // 出价上限
        maxPrice: 0,

        // 低展现关键词
        lowPvKeywordPv: 0, // 昨日展现数量
        lowPvKeywordAddPrice: 0, // 自动加价
        lowPvKeywordMaxPrice: 0, // 最大出价

        // 广告点击量
        priceCountClicks: 0, // 累计${}安装量
        priceCountClicksRatio: 0, // 点击量判断点击安装率低于${}%
        click4Offline: 0, // 累计${}点击量
        setupRatio4Offline: 0, // 点击安装率<=${}，直接下线

        // 下降比率
        priceCountSetups: 0, // 累计${}安装量判断
        priceCountSetupsRatio: 0, // 打开安装率下降比例超过${}
        priceCountClicksSetupsRatio: 0, // 点击安装率下降比率
        // 安装量
        priceCountSetupsCheck: 0, // 累计${}安装量进行调价判断
        // 竞价最大出价计算的点击安装率：
        priceCompetMaxPriceSetupsRatio: 0, // 竞价最大出价计算的点击安装率：
        // 盈亏/最大出价系数
        numRatio: 0, // 盈亏/最大出价系数
        // 账户返点系数：
        accountRatio: 0, // 账户返点系数
        // 媒体返点
        mediaRadio: 0, // 媒体返点
        // 最大出价判断点：
        priceMaxPrice: 0,
        // 竞价最大出价判断点：
        priceCompetSetupRatio: 0,
        // 调价-无排名
        priceRankPercost22: 0, // 编号22

        // 调价-第一次调价
        yesterdaySetupsForJudge: 0, // 点击安装率${}的关键词
        priceOne234Percost: 0, // 编号[2.3.4]盈亏≥${}
        priceOne234RankFirst: 0, // 排名1到${}
        priceOne234RankEnd: 0, // ${}到+∞

        // 编号5.6.7.8.24
        priceOne567Rank: 0, // 排名1到

        // 第二次9.10调价
        priceTwo910Percost: 0, // 盈亏
        priceTwo910Rank: 0, // 排名判断点
        priceTwo910ClickRatio: 0, // 展现点击率下降判断点
        // 编号12.13
        priceTwo1213Percost: 0, // 1213盈亏判断点
        priceTwo1222Rank: 0, // 12.22排名判断点

        // 编号14
        priceTwo14Percost: 0, // 盈亏判断点
        // 16.17.18盈亏小于0
        priceTwo161718Percost: 0, //
        // 第三次调价
        priceTwo1920Percost: 0, // 盈亏大于等于${}
        priceTwo1920ClickRatio: 0, // 展现点击率下降判断点
        // 下线
        offline2627SetupsRatio: 0, // 【编号26.27】点击安装率判断点：
        offline2527Percost: 0, // 【编号25.27】：盈亏判断点
        offline28ProfitCheck: 0, // 【编号28】转朴素单位收益判断点
        isolateProductName: '', // 屏蔽关键词

        // 站内信
        stationXzOpenSetupFallRation: 0, // 打开安装率降低超过百分比
        stationXzOpenSetupLastdayNum: 0, // 打开安装率降低且昨日安装大于
        stationClickSetupFallRation: 0, // 点击安装率下降超过比率
        stationClickSetupLastdayNum: 0, // 点击安装率下降且昨日安装大于
        stationErrorLastdayNum: 0, // 调价流程异常且昨日安装大于
        stationOfflineLastdayNum: 0, // 关键词下线，且昨日安装大于
        stationToSimplyLastdayNum: 0, // 转朴素且昨日安装大于

        // 上线
        onlineDayTime: '', // 每天${}点
        onlineDayUpTime: 0, // 盈利达到${}小时

        onlineStopTime: '', // 每天${}上线前一天安装
        onlineYesterdaySetups: 0, // ${}，最大出价
        onlineMaxPriceUp: 0, // ${}的暂停词语
        onlineDayProfitChange: 0, // ${}天进行收益调整
        onlineProfitSetupsUp: 0, // 安装数>=${},

        // 自动调整收益为真实收益
        autoProChangeTimeFrom: '', // 每个工作日开始时间
        autoProChangeTimeTo: '', // 每个工作日结束时间
        autoProChangeDayFrom: 0, // 工作日前${}天
        autoProChangeDayTo: 0, // 至${}个工作日

        onlineSetupsRadioLow: 0, // 上线点击安装率低于
        onlineProfitLow: 0, // 单位收益低于

        // 优化关键词
        optWordMaxClick: 0, // 历史最大点击数大于%{}
        optWordMaxSetup: 0, // 历史最大安装大于等于%{}
        optWordSetupHour: 0, // 小时达到%{}
        optWordSetupDay: 0, // 每天达到${}安装量
        optWordMaxPrice: 0, // 历史最大出价大于等于${}
        optWordSetupClick: 0, // 点击安装率小于等于${}
        optWordSetupOpen: 0, // 打开安装率小于${}

        // 成本表
        weekendIncomeRadio: 85, // 周末推广软件收益占工作日收益比例为

        // 预警
        warnTimeStart: 0, // 开始时间
        warnTimeEnd: 0, // 结束时间
        warnClickSetupStart: 0, // 点击安装率开始
        warnClickSetupEnd: 0, // 结束
        warnAvgPostionStart: 0, // 平均排名开始
        warnAvgPostionEnd: 0, // 结束
        warnAvgPriceStart: 0, // 平均出价开始
        warnAvgPriceEnd: 0, // 平均出价结束
        warnMaxPriceStart: 0, // 最大出价开始
        warnMaxPriceEnd: 0, // 结束
        warnViewClickStart: 0, // 展现点击率开始
        warnViewClickEnd: 0, // 结束
        warnProfitInoutStart: 0, // 盈亏开始
        warnProfitInoutEnd: 0, // 结束
        warnCostStart: 0, // 成本开始
        warnCostEnd: 0, // 结束
        warnProfitAllStart: 0, // 单位收益开始
        warnProfitAllEnd: 0, // 结束
        warnProfitChgStart: 0, // 换包收益开始
        warnProfitChgEnd: 0, // 结束
        warnProfitInradioStart: 0, // 利润率开始
        warnProfitInradioEnd: 0, // 结束
        warnSoftTjStart: 0, // 推荐软件开始
        warnSoftTjEnd: 0, // 结束
        warnOpenSetupStart: 0, // 打开安装率开始
        warnOpenSetupEnd: 0, // 结束

        // 360数据统计
        statisDaySetup: 0, // 天表阈值
        statisHourSetup: 0, // 小时表阈值
        statisHourAddupSetup: 0, // 小时表阈值

        statisDayClick: 0, // 天表阈值
        statisHourClick: 0, // 小时阈值
        statisHourAddupClick: 0, // 小时表阈值

        // 营销区间
        appIdRange360: '', // 360营销区间
        appIdRangeBaidu: '', // 百度营销区间
        appIdRangeSogou: '', // 搜狗营销渠道区间

        ddReceiver: [], // 钉钉默认接收人
        deliveryArea: [], // 投放地区
        checkAreas: '' // 检测地区
      },
      // 下线
      offline: {
        date: moment()
          .subtract('1', 'day')
          .format('YYYY-MM-DD'), // 日期
        recommendType: 'add', // 推荐软件状态
        recommendNum: 0, // 推荐软件变化量
        change: 'normal', // 换包状态
        otherType: 'add', // 其他收益状态
        otherNum: 0, // 其他收益变化量
        maxPrice: 0.3 // 最大出价
      },
      options: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now() - 86400000 // 减一天
        }
      },
      dataBak: {},
      banItem: {
        keywordTag: '',
        keywordReason: ''
      },
      validate: {
        domain: [
          {
            required: true,
            trigger: 'blur',
            message: '必填'
          }
        ],
        creativeTitleNormal: [
          {
            required: true,
            validator: this.validateCharLength,
            defaultLength: 4,
            maxLength: 50,
            trigger: 'change'
          }
        ],
        creativeDescriptOneNormal: [
          {
            required: true,
            validator: this.validateCharLength,
            defaultLength: 4,
            maxLength: 80,
            trigger: 'change'
          }
        ],
        creativeDescriptTwoNormal: [
          {
            required: true,
            validator: this.validateCharLength,
            defaultLength: 4,
            maxLength: 80,
            trigger: 'change'
          }
        ],
        checkAreas: [
          {
            trigger: 'change',
            validator (rule, value, callback) {
              // 大写逗号报错
              if (/，/g.test(value)) {
                callback(new Error('逗号小写'))
              } else {
                callback()
              }
            }
          }
        ],
        creativeTitleDefault: [
          {
            required: true,
            validator: this.validateCharLength,
            defaultLength: 20,
            maxLength: 50,
            trigger: 'change'
          }
        ],
        creativeDescriptOneDefault: [
          {
            required: true,
            validator: this.validateCharLength,
            defaultLength: 20,
            maxLength: 80,
            trigger: 'change'
          }
        ],
        creativeDescriptTwoDefault: [
          {
            required: true,
            validator: this.validateCharLength,
            defaultLength: 20,
            maxLength: 80,
            trigger: 'change'
          }
        ],
        creativeTitleShort: [
          {
            required: true,
            validator: this.validateCharLength,
            defaultLength: 32,
            maxLength: 50,
            trigger: 'change'
          }
        ],
        creativeDescriptOneShort: [
          {
            required: true,
            validator: this.validateCharLength,
            defaultLength: 32,
            maxLength: 80,
            trigger: 'change'
          }
        ],
        creativeDescriptTwoShort: [
          {
            required: true,
            validator: this.validateCharLength,
            defaultLength: 32,
            maxLength: 80,
            trigger: 'change'
          }
        ],
        // 360营销区间
        appIdRange360: [
          {
            require: true,
            trigger: 'blur',
            validator: this.checkAppIdsRange
          }
        ],
        appIdRangeBaidu: [
          {
            require: true,
            trigger: 'blur',
            validator: this.checkAppIdsRange
          }
        ],
        appIdRangeSogou: [
          {
            require: true,
            trigger: 'blur',
            validator: this.checkAppIdsRange
          }
        ]
      },
      getCharLength: getCharLength
    }
  },
  mounted () {
    // 获取地区信息
    this.getAreaDict()
    // 获取人员列表
    this.getIncumbencyTbUser()
    track.start()
  },
  methods: {
    // 获取转正人员
    getIncumbencyTbUser () {
      this.$axios({
        url: baseUrl + '/user/getIncumbencyTbUser'
      }).then(res => {
        this.incumbencyUserList = res.data.content
      })
    },
    // 判断营销区间设置是否复合格式
    checkAppIdsRange (rule, value, callback) {
      let arr = value.split(',')
      let rangeValite = arr.every(str => {
        let v = true
        let range = str.split('-')
        let start = Number(range[0])
        let end = Number(range[1])
        if (range.length !== 2) {
          callback(new Error('小写逗号隔开，英文连字符连接'))
          v = false
        }
        if (isNaN(start) || isNaN(end)) {
          callback(new Error('只能输入数字'))
          v = false
        }
        if (start > end) {
          callback(new Error('开始渠道号数字应该小于结束渠道号'))
          v = false
        }
        return v
      })
      if (rangeValite) {
        callback()
      }
    },
    // 设置公司账号
    setDomain () {
      const domain = this.data.domain
      this.$Modal.confirm({
        title: '提示',
        content: `修改新的域名为${domain}？`,
        onOk: () => {
          this.$axios({
            url: semUrl + '/Market/chgDomain',
            method: 'post',
            data: $qs.stringify({ domain })
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    // 添加到标签
    addList (value, type) {
      if (!value) return
      this.data[type].push(value)
      this.banItem[type] = ''
    },
    // 删除标签
    handleClose (index, type) {
      this.data[type].splice(index, 1)
    },
    // 获取选中的项
    getCheck () {
      let node = this.$refs.tree.getCheckedNodes()
      let checkNodeIds = node
        .filter(e => {
          return e.areacode
        })
        .map(e => {
          return e.areacode
        })
      return checkNodeIds
    },
    // 获取配置项
    getMarketConfig () {
      this.$axios({
        url: semUrl + '/Market/getMarketConfig',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            let content = res.data.data
            // console.log(content)
            for (let key in content) {
              let isString = typeof content[key] === 'string'
              let isNumber = !isNaN(Number(content[key]))
              if (isString && isNumber) {
                content[key] = Number(content[key])
              }
            }
            // 更换模板时间数组，里面是字符串，转换成数字类型
            content.changeTemplateTime = content.changeTemplateTime || [].map(e =>
              Number(e)
            ) || []
            // console.log(content)
            this.data = content
            this.data.keywordTag = content.keywordTag || []
            this.dataBak = JSON.parse(JSON.stringify(this.data))
            this.setCheckedByIds(this.data.deliveryArea)
            this.$nextTick(() => {
              track.end()
            })
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.warn(err)
        })
    },
    // 获取地区字典
    getAreaDict () {
      this.$axios({
        url: semUrl + '/Keyword/areaDict'
      }).then(res => {
        // 设置树形结构
        this.arealistToTree(res.data.area)
        // 获取配置信息信息
        this.getMarketConfig()
      })
    },
    // 把360sb接口的数据遍历成树，增加华东。。华中这些地区
    arealistToTree (list) {
      // arealevel 0省级，1市级
      // areaname地区名称
      // areacode地区id
      // parentareacode父级id
      // 创建0级树，全部
      let topTreeNode = {
        title: '全部',
        areacode: '0',
        arealevel: 0,
        children: [],
        level: 0,
        expand: true,
        disabled: true,
        checked: false
      }

      // 创建一级的树，地区
      let areas = Object.keys(areaToCity)
      for (let i = 0; i < areas.length; i++) {
        topTreeNode.children.push({
          title: areas[i],
          level: 1,
          expand: false,
          checked: false,
          disabled: true,
          childrenName: areaToCity[areas[i]],
          children: []
        })
      }
      // 创建二级的树，省级
      for (let i = 0; i < list.length; i++) {
        let node = list[i]
        if (node.arealevel === 0 && node.areaname !== '全部') {
          for (let j = 0; j < topTreeNode.children.length; j++) {
            // 如果当前地区名在childrenName列表里
            if (topTreeNode.children[j].childrenName.includes(node.areaname)) {
              node.level = 2
              node.title = node.areaname
              node.checked = false
              node.disabled = true
              node.children = []
              topTreeNode.children[j].children.push(node)
            }
          }
        }
      }
      // 创建三级树，市区
      for (let i = 0; i < list.length; i++) {
        let node = list[i]
        if (node.arealevel === 1) {
          creatLeve3Tree(node, topTreeNode.children)
        }
      }

      this.treeData.push(topTreeNode)
      function creatLeve3Tree (node, tree) {
        for (let i = 0; i < tree.length; i++) {
          let parentNode = tree[i]
          if (parentNode.areacode === node.parentareacode) {
            node.expand = false
            node.checked = false
            node.disabled = true
            node.title = node.areaname
            parentNode.children.push(node)
          } else if (parentNode.children && parentNode.children.length > 0) {
            creatLeve3Tree(node, parentNode.children)
          }
        }
      }
    },
    // 根据已经选择的id数组，选中树的复选框
    setCheckedByIds (list) {
      setCheck(list, this.treeData)
      function setCheck (list, tree, value = true) {
        for (let i = 0; i < tree.length; i++) {
          let node = tree[i]
          if (node.areacode && list.includes(node.areacode)) {
            node.checked = value
          } else if (node.children && node.children.length > 0) {
            setCheck(list, node.children)
          }
        }
      }
    },
    // 变现差值一定范围内的上线
    handlePromote () {
      let data = this.promote
      this.$Modal.confirm({
        title: '提示',
        content: `变现差值${data}以内的关键词上线？`,
        onOk: () => {
          this.$axios({
            url: `${semGaohanUrl}/sem/plainOnline`,
            method: 'post',
            data: $qs.stringify({ promote: data })
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.$Message.success(res.data.message)
              } else {
                this.$Message.error(res.data.message)
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    // 保存
    submit () {
      this.data.deliveryArea = this.getCheck()
      if (JSON.stringify(this.data) !== JSON.stringify(this.dataBak)) {
        let sendData = Object.assign(this.data, { nickname: this.nickname })
        this.$refs.semConfig.validate(v => {
          if (v) {
            delete sendData.domain
            this.$axios({
              url: semUrl + '/Market/saveMarketConfig',
              method: 'post',
              data: $qs.stringify(sendData)
            })
              .then(res => {
                if (res.data.code === 10000) {
                  this.$Message.success(res.data.msg)
                  this.isEdit = false
                  this.getMarketConfig()
                } else {
                  this.$Message.error(res.data.msg)
                }
              })
              .catch(err => {
                console.warn(err)
              })
          } else {
            this.$Message.error('格式错误')
          }
        })
      } else {
        this.$Message.error('没有任何改动')
        this.isEdit = false
      }
    },
    // 设置树状图是否可以编辑
    setTreDisable (value) {
      run(this.treeData, value)
      function run (tree, value) {
        for (let i = 0; i < tree.length; i++) {
          let node = tree[i]
          node.disabled = !value
          if (node.children && node.children.length > 1) {
            run(node.children, value)
          }
        }
      }
    },
    // 获取字符的占位大小，中文算两个
    getStringLength (v, t) {
      if (t) {
        v.replace(/\{推广组\}/g, '')
      }
      let l = 0
      for (let i = 0; i < v.length; i++) {
        let a = v.charAt(i)
        // 如果是中文，算两个
        if (a.match(/[^\x00-\xff]/gi) != null) {
          l += 2
        } else {
          l += 1
        }
      }
      return l
    },
    // 验证长度
    validateCharLength (rule, value, callback) {
      // 字符串长度，中文算两个，第二个参数表示{推广组}算几个字
      let charLength = getCharLength(value, rule.defaultLength)
      if (rule.require && !value) {
        callback(new Error('必填项'))
      } else if (rule.maxLength && charLength < rule.minLength) {
        callback(new Error('字数小于' + rule.minLength))
      } else if (rule.maxLength && charLength > rule.maxLength) {
        callback(
          new Error(
            `字数超过${rule.maxLength}({推广组}算${rule.defaultLength}字)`
          )
        )
      } else {
        callback()
      }
    },
    // 添加推广组
    appendGroupName (key) {
      let domId = document.querySelectorAll(`#semConfig #${key} input`)[0]
      let inputIndex = domId.selectionStart
      let insertStr = (soure, start, newStr) => {
        return soure.slice(0, start) + newStr + soure.slice(start)
      }
      this.data[key] = insertStr(this.data[key], inputIndex, `{推广组}`)
    },
    // 取消
    cancel () {
      this.data.deliveryArea = this.getCheck()
      if (JSON.stringify(this.data) !== JSON.stringify(this.dataBak)) {
        this.$Modal.confirm({
          title: '提示',
          content: '未保存，是否取消编辑？',
          onOk: () => {
            this.data = JSON.parse(JSON.stringify(this.dataBak))
            this.setCheckedByIds(this.data.deliveryArea)
            this.isEdit = false
          }
        })
      } else {
        this.data = this.dataBak
        this.setCheckedByIds(this.data.deliveryArea)
        this.isEdit = false
      }
    },
    // 下线按钮
    handleOffline () {
      this.$Modal.confirm({
        title: '提示',
        content: '确定执行下线操作？',
        onOk: () => {
          let data = this.offline
          data.date = moment(data.date).format('YYYY-MM-DD')
          this.$axios({
            url: `${semGaohanUrl}/sem/liquidationAdjustment`,
            data: $qs.stringify(data),
            method: 'post'
          })
            .then(res => {
              console.log(res)
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    closePage () {
      bus.$emit('on-myclose', this.$route)
    }
  },
  watch: {
    isEdit (newVal) {
      this.setTreDisable(newVal)
    }
  },
  computed: {
    nickname () {
      return this.$store.state.user.nickname
    },
    permission () {
      /**
       * config 配置
       * create 新增
       * delete 删除
       * retrie 查看
       * update 编辑
       */
      return this.$store.state.user.userpermission.sem
    }
  }
}
</script>
<style lang="less" scoped>
.wd120 {
  width: 120px;
}
</style>
