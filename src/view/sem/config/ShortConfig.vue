<template>
  <div class="viewWrapper semConfig">
    <Form
      :label-width="180"
      :model="data"
      :rules="validate"
      ref="semShortConfig"
      id="semShortConfig"
    >
      <div class="selection">
        <h3>营销智能化开关</h3>
        <Row>
          <Col span="12">
            <FormItem label="开关:">
              <i-switch
                :disabled="!isEdit"
                size="large"
                v-model="data.phraseSystemSwitch"
                :true-value="1"
                :false-value="0"
              />
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="selection">
        <h3>通用创意</h3>
        <Row>
          <Col span="12">
            <FormItem label="创意标题" prop="phraseCreativeTitleDefault">
              <div v-if="isEdit">
                <Input
                  class="wd80"
                  v-model="data.phraseCreativeTitleDefault"
                  id="phraseCreativeTitleDefault"
                >
                  <span
                    class="pointer"
                    slot="append"
                    @click="appendGroupName('phraseCreativeTitleDefault')"
                  >{ }</span>
                </Input>
                <span class="tip">
                  <span
                    :class="{red:this.phraseCreativeTitleDefaultOverflow>50}"
                  >{{ this.phraseCreativeTitleDefaultOverflow}}</span>/50
                </span>
              </div>
              <h3 v-else>{{data.phraseCreativeTitleDefault}}</h3>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="创意描述1" prop="phraseCreativeDescriptOneDefault">
              <div v-if="isEdit">
                <Input
                  class="wd80"
                  v-model="data.phraseCreativeDescriptOneDefault"
                  id="phraseCreativeDescriptOneDefault"
                >
                  <span
                    class="pointer"
                    slot="append"
                    @click="appendGroupName('phraseCreativeDescriptOneDefault')"
                  >{ }</span>
                </Input>
                <span class="tip">
                  <span
                    :class="{red:this.phraseCreativeDescriptOneDefaultOverflow>80}"
                  >{{ this.phraseCreativeDescriptOneDefaultOverflow}}</span>/80
                </span>
              </div>
              <h3 v-else>{{data.phraseCreativeDescriptOneDefault}}</h3>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="创意描述2" prop="phraseCreativeDescriptTwoDefault">
              <div v-if="isEdit">
                <Input
                  class="wd80"
                  v-model="data.phraseCreativeDescriptTwoDefault"
                  id="phraseCreativeDescriptTwoDefault"
                >
                  <span
                    class="pointer"
                    slot="append"
                    @click="appendGroupName('phraseCreativeDescriptTwoDefault')"
                  >{ }</span>
                </Input>
                <span class="tip">
                  <span
                    :class="{red:this.phraseCreativeDescriptTwoDefaultOverflow>80}"
                  >{{ this.phraseCreativeDescriptTwoDefaultOverflow}}</span>/80
                </span>
              </div>
              <h3 v-else>{{data.phraseCreativeDescriptTwoDefault}}</h3>
            </FormItem>
          </Col>
        </Row>
      </div>
      <!-- 推广组 -->
      <div class="selection">
        <h3>推广组</h3>
        <Row>
          <Col span="12">
            <FormItem label="默认出价" prop="price">
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseDefaultPrice"
                :step="0.01"
                :precision="2"
              />
            </FormItem>
          </Col>
        </Row>
      </div>
      <!-- 调价 -->
      <div class="selection">
        <h3>调价</h3>
        <Row>
          <Col span="12">
            <FormItem label="出价上限" prop="phraseBidCost">
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseBidCost"
                :step="0.01"
                :precision="2"
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="低展现关键词" prop="phraseBidCost">
              <span>若前一天启用关键词&lt;=</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseLowDisplayKeywordsViews"
                :step="0.01"
                :precision="2"
              />
              <span>，第二天自动加价</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseLowDisplayKeywordsMarkup"
                :step="0.01"
                :precision="2"
              />
              <span>，出价上限</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseLowDisplayKeywordsBidCost"
                :step="0.01"
                :precision="2"
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="广告点击量" prop="phraseBidCost">
              <span>累计</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseAdAccumulateHits"
                :step="0.01"
                :precision="2"
              />
              <span>广告点击量，点击安装率&lt;=</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseAdHitRatio"
                :step="0.01"
                :precision="2"
              />
              <span>%，盈亏&lt;</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseAdProfit"
                :step="0.01"
                :precision="2"
              />
              <span>的关键词，直接下线，平均每小时大于</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseAdMean"
                :step="0.01"
                :precision="2"
              />
              <span>的关键词发送站内信提醒</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="下降比率" prop="phraseBidCost">
              <span>累计</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseDeclineRatioAccumulate"
                :step="0.01"
                :precision="2"
              />
              <span>安装量判断打开安装率下降比率超过</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseDeclineRatioOsRatio"
                :step="0.01"
                :precision="2"
              />
              <span>%点击安装率下降比率超过</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseDeclineRatioCsRatio"
                :step="0.01"
                :precision="2"
              />
              <span>%，且昨日安装大于</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseDeclineRatioSetups"
                :step="0.01"
                :precision="2"
              />
              <span>的关键词，进行站内信提醒</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="安装量" prop="phraseSetupsAccumulate">
              <span>累计</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseSetupsAccumulate"
                :step="0.01"
                :precision="2"
              />
              <span>安装量进行调价判断</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="下线提醒" prop="phraseBidCost">
              <span>昨日安装量大于</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseOfflineSetups"
                :step="0.01"
                :precision="2"
              />
              <span>的关键词下线，进行站内信提醒</span>
            </FormItem>
          </Col>
        </Row>
        <!-- 调价流程 -->
        <Row>
          <Col span="12">
            <FormItem label="调价流程" prop="phraseBidCost">
              <span>昨日安装量&gt;=</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseAdjustPriceSetups"
                :step="0.01"
                :precision="2"
              />
              <span>的关键词，每天第一次调价使用成本表前一天的数据</span>
            </FormItem>
            <FormItem label="精确否词添加维度">
              <RadioGroup  v-model="data.exactNegativeWordsDimensionSwtich">
                <Radio :disabled="!isEdit" :label="1">
                  <span>推广组</span>
                </Radio>
                <Radio :disabled="!isEdit" :label="2">
                  <span>产品</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label prop="phraseBidCost">
              <span>编号【1.2】盈亏判断点：</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseAdjustPrice12Profit"
                :step="0.01"
                :precision="2"
              />
              <span>，排名判断点：</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseAdjustPrice12Position"
                :step="0.01"
                :precision="2"
              />
              <span>，编号【2】调到最大出价</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseAdjustPrice2MaxPriceTimes"
                :step="0.01"
                :precision="2"
              />
              <span>倍</span>
            </FormItem>
            <FormItem label prop="phraseBidCost">
              <span>编号【1.3.4】盈亏判断点</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseAdjustPrice134Profit"
                :step="0.01"
                :precision="2"
              />
            </FormItem>
            <FormItem label prop="phraseBidCost">
              <span>编号【3】盈亏判断点</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseAdjustPrice3Profit"
                :step="0.01"
                :precision="2"
              />
            </FormItem>
            <FormItem label prop="phraseBidCost">
              <span>编号【4】搜索词最大出价判断点</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseAdjustPriceMaxPricePoint"
                :step="0.01"
                :precision="2"
              />
            </FormItem>
            <FormItem label prop="phraseBidCost">
              <span>编号【2.5.6】盈亏判断点1：</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseAdjustPrice256ProfitOne"
                :step="0.01"
                :precision="2"
              />
              <span>，盈亏判断点2（小于1）：</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseAdjustPrice256ProfitTwo"
                :step="0.01"
                :precision="2"
              />
            </FormItem>
            <FormItem label prop="phraseBidCost">
              <span>编号【5】盈亏判断点：</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseAdjustPrice5Profit"
                :step="0.01"
                :precision="2"
              />
              <span>最大出价判断点</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseAdjustPrice5Maxprice"
                :step="0.01"
                :precision="2"
              />
              <span>，编号【5】调到最大出价</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseAdjustPrice5MaxPriceTimes"
                :step="0.01"
                :precision="2"
              />
              <span>倍，（不低于</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseAdjustPrice5GreaterThan"
                :step="0.01"
                :precision="2"
              />
              <span>）</span>
            </FormItem>
            <FormItem label prop="phraseBidCost">
              <span>编号【6】盈亏判断点：</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseAdjustPrice6Profit"
                :step="0.01"
                :precision="2"
              />
            </FormItem>
            <FormItem label prop="phraseBidCost">
              <span>编号【7】盈亏判断点：</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseAdjustPrice7Profit"
                :step="0.01"
                :precision="2"
              />
            </FormItem>
            <FormItem label prop="phraseBidCost">
              <span>编号【8】精确否词添加利润比例</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.phraseAdjustPrice8Ratio"
                :step="1"
                :precision="0"
              />
              <span>%</span>
            </FormItem>
            <FormItem label prop="phraseBidCost">
              <span>编号【10】从精确否定关键词中取出总利润</span>
              <InputNumber
                size="small"
                :disabled="!isEdit"
                v-model="data.profit4DeficitWords"
                :step="1"
                :precision="2"
              />
              <span>%的亏损词</span>
            </FormItem>
          </Col>
        </Row>
      </div>
      <!-- 重新上线 -->
      <div class="selection">
        <h3>上线</h3>
        <Row>
          <FormItem label>
            <Col span="24">
              <span>每天</span>
              <TimePicker
                :disabled="!isEdit"
                :clearable="false"
                v-model="data.phraseOffline2OnlineTimePoint"
                format="HH:mm"
              />
              <span>上线前一天安装量>=</span>
              <InputNumber
                :disabled="!isEdit"
                size="small"
                v-model="data.phraseOffline2OnlineYesterdaySetups"
                :min="1"
                :step="1"
                :precision="0"
              />
              <span>，最大出价>=</span>
              <InputNumber
                :disabled="!isEdit"
                size="small"
                v-model="data.phraseOffline2OnlineMaxPrice"
                :min="1"
                :step="1"
                :precision="0"
              />
              <span>的暂停关键词</span>
            </Col>
          </FormItem>
        </Row>
        <Row>
          <FormItem label>
            <Col span="24">
              <span>每个工作日</span>
              <TimePicker
                :disabled="!isEdit"
                :clearable="false"
                v-model="data.phraseProfitAutoAdjustFirstTimePoint"
                format="HH:mm"
              />
              <span>和</span>
              <TimePicker
                :disabled="!isEdit"
                :clearable="false"
                v-model="data.phraseProfitAutoAdjustSecondTimePoint"
                format="HH:mm"
              />
              <span>调整前</span>
              <InputNumber
                :disabled="!isEdit"
                size="small"
                v-model="data.phraseProfitAutoAdjustMinInterval"
                :min="1"
                :max="25"
                :step="1"
                :precision="0"
              />
              <span>个工作日和前</span>
              <InputNumber
                :disabled="!isEdit"
                size="small"
                v-model="data.phraseProfitAutoAdjustMaxInterval"
                :min="1"
                :max="25"
                :step="1"
                :precision="0"
              />
              <span>个工作日之间所有天数的真实收益</span>
            </Col>
          </FormItem>
        </Row>
        <Row>
          <FormItem label>
            <span>功能开关</span>
            <i-switch
              v-model="data.querywordRetrievalSwitch"
              :disabled="!isEdit"
              size="large"
              :true-value="1"
              :false-value="0"
            />
            <span>每天</span>
            <TimePicker
              v-model="data.querywordRetrievalTime"
              :disabled="!isEdit"
              :clearable="false"
              format="HH:mm"
            />
            <span>，拿每个关键词点击排名前</span>
            <InputNumber
              :disabled="!isEdit"
              size="small"
              v-model="data.querywordRetrievalRank"
              :step="1"
              :precision="0"
            />
            <span>的关键词（至少</span>
            <InputNumber
              :disabled="!isEdit"
              size="small"
              v-model="data.querywordRetrievalClicks"
              :step="1"
              :precision="0"
            />
            <span>个点击），和前</span>
            <InputNumber
              :disabled="!isEdit"
              size="small"
              v-model="data.querywordRetrievalDays"
              :step="1"
              :precision="0"
            />
            <span>天排名前{{data.querywordRetrievalRank}}的搜索词的数据对比，取出同样的搜索词，计算这些搜索词提升的变现，把当天加入的精确否定词根据提升变现的</span>
            <InputNumber
              :disabled="!isEdit"
              size="small"
              v-model="data.querywordRetrievalRatio"
              :step="1"
              :precision="0"
            />
            <span>%进行计算，移除可以不亏损的精确否词</span>
          </FormItem>
        </Row>
        <Row>
          <FormItem label>
            <span>功能开关</span>
            <i-switch
              v-model="data.clickRatio4RetrievalSwitch"
              :disabled="!isEdit"
              size="large"
              :true-value="1"
              :false-value="0"
            />
            <span>每天</span>
            <TimePicker
              v-model="data.clickRatio4RetrievalTime"
              :disabled="!isEdit"
              :clearable="false"
              format="HH:mm"
            />
            <span>，拿每个关键词点击排名前</span>
            <InputNumber
              :disabled="!isEdit"
              size="small"
              v-model="data.clickRatio4RetrievalRank"
              :step="1"
              :precision="0"
            />
            <span>的关键词（至少</span>
            <InputNumber
              :disabled="!isEdit"
              size="small"
              v-model="data.clickRatio4RetrievalClicks"
              :step="1"
              :precision="0"
            />
            <span>个点击），和前</span>
            <InputNumber
              :disabled="!isEdit"
              size="small"
              v-model="data.clickRatio4RetrievalDays"
              :step="1"
              :precision="0"
            />
            <span>天排名前{{data.clickRatio4RetrievalRank}}的搜索词的数据对比，取出同样的搜索词，计算这些搜索词提升的点击安装率，把当天加入的精确否定词根据提升点击安装率的</span>
            <InputNumber
              :disabled="!isEdit"
              size="small"
              v-model="data.clickRatio4RetrievalRatio"
              :step="1"
              :precision="0"
            />
            <span>%进行计算，移除可以不亏损的精确否词，点击安装率为0的搜索词不处理</span>
          </FormItem>
        </Row>
        <Row>
          <h3>待优化关键词表</h3>
          <FormItem>
            <span>点击&gt;=</span>
            <InputNumber
              :disabled="!isEdit"
              size="small"
              v-model="data.phraseKeywordOptimizeClick"
              :step="1"
              :precision="0"
            />
            <span>点击安装率&lt;=</span>
            <InputNumber
              :disabled="!isEdit"
              size="small"
              v-model="data.phraseKeywordOptimizeClicksetup"
              :step="1"
              :precision="0"
            />
            <span>优化方式：落地页优化</span>
          </FormItem>
          <FormItem>
            <span>安装&gt;=</span>
            <InputNumber
              :disabled="!isEdit"
              size="small"
              v-model="data.phraseKeywordOptimizeSetup"
              :step="1"
              :precision="0"
            />
            <span>下载器打开安装率&lt;=</span>
            <InputNumber
              :disabled="!isEdit"
              size="small"
              v-model="data.phraseKeywordOptimizeOpensetup"
              :step="1"
              :precision="0"
            />
            <span>优化方式：检查软件链接</span>
          </FormItem>
        </Row>
      </div>
      <!-- 搜索词取回 -->
      <div class="selection">
        <Row>
          <h3>搜索词取回</h3>
          <FormItem>
            <span>每天</span>
            <TimePicker
              :disabled="!isEdit"
              :clearable="false"
              v-model="data.time4QuerywordRetrieval"
              format="HH:mm"
            />
            <span>取回前一天安装&gt;=</span>
            <InputNumber
              :disabled="!isEdit"
              size="small"
              v-model="data.setup4QuerywordRetrieval"
              :min="1"
              :step="1"
              :precision="0"
            />
            <span>，最大出价&gt;=</span>
            <InputNumber
              :disabled="!isEdit"
              size="small"
              v-model="data.maxprice4QuerywordRetrieval"
              :min="0"
              :step="0.1"
              :precision="1"
            />
            <span>的搜索词</span>
          </FormItem>
        </Row>
        <Row>
          <FormItem>
            <span>每个工作日</span>
            <!-- <Select :disabled="!isEdit" v-model="data.timePoint4QuerywordRetrieval" multiple  style="width:200px">
              <Option v-for="time in 24" :value="(time-1)" :label="`${time-1}点`" :key="time-1">{{ time-1 }}点</Option>
            </Select>-->
            <span>
              <Tag
                v-for="(item,index) in data.timePoint4QuerywordRetrieval"
                @on-close="closeTimePoint(index)"
                :closable="isEdit"
                :key="item"
              >{{item}}</Tag>
            </span>
            <TimePicker
              :open="openTimePicker"
              v-model="openTimePickerValue"
              confirm
              format="HH:mm"
              @on-clear="handleClearTimePicker"
              @on-ok="handleOpenTimePicker"
            >
              <Button :disabled="!isEdit" @click="openTimePicker=true">添加时间</Button>
            </TimePicker>

            <span>调整前</span>
            <InputNumber
              :disabled="!isEdit"
              size="small"
              v-model="data.minInterval4QuerywordRetrieval"
              :min="0"
              :step="1"
              :precision="0"
            />
            <span>个工作日和前</span>
            <InputNumber
              :disabled="!isEdit"
              size="small"
              v-model="data.maxInterval4QuerywordRetrieval"
              :min="0"
              :step="1"
              :precision="0"
            />
            <span>个工作日之间所有天数搜索词的真实收益，并取回当天安装&gt;=</span>
            <InputNumber
              :disabled="!isEdit"
              size="small"
              v-model="data.install4QuerywordRetrieval"
              :min="0"
              :step="1"
              :precision="0"
            />
            <span>最大出价&gt;=</span>
            <InputNumber
              :disabled="!isEdit"
              size="small"
              v-model="data.maxBid4QuerywordRetrieval"
              :min="0"
              :step="1"
              :precision="0"
            />
            <span>的搜索词</span>
          </FormItem>
        </Row>
      </div>
      <div class="selection" style="text-align:center;">
        <Button class="btns" v-if="isEdit" @click="cancel">取消</Button>
        <Button class="btns" @click="closePage">关闭</Button>
        <Button class="btns" type="primary" v-if="isEdit" @click="submit">保存</Button>
        <Button class="btns" type="primary" v-else @click="isEdit=!isEdit">编辑</Button>
      </div>
    </Form>
  </div>
</template>

<script>
import { semUrl, semGaohanUrl } from '@/api/base.js'
import { getCharLength, validateLength } from '../tools'
import { Track } from '@/libs/track.js'
const track = new Track('营销/配置/短语配置')
export default {
  name: 'ShortConfig',
  data () {
    return {
      getCharLength,
      isEdit: false,
      openTimePicker: false,
      openTimePickerValue: '', // 添加的值
      data: {
        // 开关
        phraseSystemSwitch: 0, // 开关
        // 通用创意
        phraseCreativeTitleDefault: '', // 创意标题
        phraseCreativeDescriptOneDefault: '', // 创意描述1
        phraseCreativeDescriptTwoDefault: '', // 创意描述2
        // 推广组
        phraseDefaultPrice: 0.35, // 默认出价
        // 调价
        phraseBidCost: 0, // 出价上限
        // 低展现
        phraseLowDisplayKeywordsViews: 0, // 前一天启用关键词<=?
        phraseLowDisplayKeywordsMarkup: 0, // 第二天自动加价?
        phraseLowDisplayKeywordsBidCost: 0, // 出价上限?
        // 广告点击量
        phraseAdAccumulateHits: 0, // 累计?广告点击量
        phraseAdHitRatio: 0, // 广告点击安装率<=?
        phraseAdProfit: 0, // 盈亏<?的关键词，直接下线
        phraseAdMean: 0, // 平均每小时>点击的关键词发送站内信
        // 下降比率
        phraseDeclineRatioAccumulate: 0, // 累计?安装量判断
        phraseDeclineRatioOsRatio: 0, // 判断打开安装率下降比率超过?
        phraseDeclineRatioCsRatio: 0, // 点击安装率下降比率超过
        phraseDeclineRatioSetups: 0, // 且昨日安装>?的关键词
        // 安装量
        phraseSetupsAccumulate: 0, // 累计?安装量进行调价判断
        // 下线提醒
        phraseOfflineSetups: 0, // 昨日安装量>？的关键词，进行站内信提醒
        // 调价流程
        phraseAdjustPriceSetups: 0, // 昨日安装量>=？的关键词，每天第一次调价使用成本表前一天的数据
        // 精确否词添加维度
        exactNegativeWordsDimensionSwtich: 1,

        // 编号1.2
        phraseAdjustPrice12Profit: 0, // 编号1.2盈亏判断点
        phraseAdjustPrice12Position: 0, // 排名判断点?
        phraseAdjustPrice2MaxPriceTimes: 0, // 编号2调到最大出价?倍
        // 编号134
        phraseAdjustPrice134Profit: 0, // 134盈亏判断点
        // 编号3
        phraseAdjustPrice3Profit: 0, // 编号3盈亏判断点
        // 编号4
        phraseAdjustPriceMaxPricePoint: 0, // 编号4搜索词最大出价判断点
        // 编号256
        phraseAdjustPrice256ProfitOne: 0, // 256盈亏判断点1
        phraseAdjustPrice256ProfitTwo: 0, // 256盈亏判断点2
        // 编号5
        phraseAdjustPrice5Profit: 0, // 编号5盈亏判断点?
        phraseAdjustPrice5Maxprice: 0, // 最大出价判断点
        phraseAdjustPrice5MaxPriceTimes: 0, // 编号5最大出价?倍，
        phraseAdjustPrice5GreaterThan: 0, // 编号5调到最大出价1.0倍，不低于?
        // 编号6
        phraseAdjustPrice6Profit: 0, // 编号6盈亏判断点
        // 编号7
        phraseAdjustPrice7Profit: 0, // 编号7盈亏判断点
        // 编号8
        phraseAdjustPrice8Ratio: 0, // 精确否词添加利润比例
        // 编号10
        profit4DeficitWords: 0, // 编号10取出总利润${}

        // 重新上线
        phraseOffline2OnlineTimePoint: '', // 每天(?)上线
        phraseOffline2OnlineYesterdaySetups: 0, // 前一天安装 >= (?)
        phraseOffline2OnlineMaxPrice: 0, // 最大出价 >= (?)的暂停关键词
        phraseProfitAutoAdjustFirstTimePoint: '', // 每个工作日(?)和13:01
        phraseProfitAutoAdjustSecondTimePoint: '', // 每个工作日9:01和(?)
        phraseProfitAutoAdjustMinInterval: 0, // 调整前(?)个工作日
        phraseProfitAutoAdjustMaxInterval: 0, // 和前(?)个工作日之间所有天数的真实收益

        querywordRetrievalSwitch: 1, // 开关(?)
        querywordRetrievalTime: '', // 每天(?),拿每个关键词
        querywordRetrievalRank: 10, // 点击排名前(?)的搜索词
        querywordRetrievalClicks: 0, // （至少(?)个点击）
        querywordRetrievalDays: 0, // 和前(?)天排名前10的搜索词的数据对比
        querywordRetrievalRatio: 0, // 把当天加入的精确否词根据提升变现的(?

        clickRatio4RetrievalSwitch: 1, // 开关
        clickRatio4RetrievalTime: '', // 每天(?),拿每个关键词
        clickRatio4RetrievalRank: 10, // 点击排名前(?)的搜索词
        clickRatio4RetrievalClicks: 0, // （至少(?)个点击）
        clickRatio4RetrievalDays: 0, // 和前(?)天排名前10的搜索词的数据对比
        clickRatio4RetrievalRatio: 0, // 把当天加入的精确否词根据提升变现的(?

        // 优化关键词表
        phraseKeywordOptimizeClick: 0, // 短语模式待优化关键词：点击数
        phraseKeywordOptimizeClicksetup: 0, // 短语模式待优化关键词：安装数
        phraseKeywordOptimizeSetup: 0, // 短语模式待优化关键词：点击安装率
        phraseKeywordOptimizeOpensetup: 0, // 短语模式待优化关键词：下载器安装率

        // 搜索词取回
        time4QuerywordRetrieval: '', // 每天(?)取回前一天
        setup4QuerywordRetrieval: 0, // 安装》=(?)
        maxprice4QuerywordRetrieval: 0, // 最大出价>=的搜索词

        timePoint4QuerywordRetrieval: [], // 每个工作日${}时间点
        minInterval4QuerywordRetrieval: 0, // 前${}
        maxInterval4QuerywordRetrieval: 0, // 和前?天
        install4QuerywordRetrieval: 0, // 安装大于等于?
        maxBid4QuerywordRetrieval: 0 // 最大出价
      },
      dataBak: {}, // 备份数据
      validate: {
        phraseDefaultPrice: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        phraseCreativeTitleDefault: [
          {
            required: true,
            maxLength: 50,
            validator: validateLength,
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              let res = value.match(/[{}]/g)
              if (!res || value.match(/[{}]/g).length < 4) {
                callback(new Error('通配符不能少于两组'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        phraseCreativeDescriptOneDefault: [
          {
            required: true,
            trigger: 'blur',
            validator: validateLength,
            maxLength: 80
          }
        ],
        phraseCreativeDescriptTwoDefault: [
          {
            required: true,
            trigger: 'blur',
            validator: validateLength,
            maxLength: 80
          }
        ]
      }
    }
  },
  beforeCreate () {
    track.start()
  },
  mounted () {
    this.getMarketConfig()
  },
  methods: {
    getMarketConfig () {
      this.$axios({
        url: semUrl + '/Market/getMarketConfig',
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            let content = res.data.data
            for (let key in content) {
              let isString = typeof content[key] === 'string'
              let isNumber = !isNaN(Number(content[key]))
              if (isString && isNumber) {
                content[key] = Number(content[key])
              }
            }
            this.data = content
            this.dataBak = Object.freeze(JSON.parse(JSON.stringify(this.data)))
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
    // 取消
    cancel () {
      if (JSON.stringify(this.data) !== JSON.stringify(this.dataBak)) {
        this.$Modal.confirm({
          title: '提示',
          content: '未保存，是否取消编辑？',
          onOk: () => {
            this.data = JSON.parse(JSON.stringify(this.dataBak))
            this.isEdit = false
          }
        })
      } else {
        this.data = this.dataBak
        this.isEdit = false
      }
    },
    submit () {
      if (JSON.stringify(this.data) !== JSON.stringify(this.dataBak)) {
        let sendData = JSON.parse(
          JSON.stringify(Object.assign(this.data, { nickname: this.nickname }))
        )
        this.$refs.semShortConfig.validate(v => {
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
                  this.noticeGaoHan()
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
    // 当配置项中这些值发生变化，通知高汉的服务端
    noticeGaoHan () {
      const keys = [
        'phraseOffline2OnlineTimePoint',
        'phraseProfitAutoAdjustFirstTimePoint',
        'phraseProfitAutoAdjustSecondTimePoint',
        'querywordRetrievalTime',
        'clickRatio4RetrievalTime',
        'time4QuerywordRetrieval',
        'timePoint4QuerywordRetrieval'
      ]
      let queryString = []
      keys.forEach(key => {
        let oldData = this.data[key]
        let newData = this.dataBak[key]
        // 有些数组类型
        if (JSON.stringify(oldData) !== JSON.stringify(newData)) {
          queryString.push(key)
        }
      })
      if (queryString.length > 0) {
        let s = queryString.join(',')
        // let semGaohanUrl = 'http://192.168.5.122:8080/BzSystem';
        let img = new Image()
        img.src = `${semGaohanUrl}/sem/timeAdjust?key4TimeAdjust=${s}`
      }
    },
    closePage () {
      bus.$emit('on-myclose', this.$route)
    },
    // 添加推广组
    appendGroupName (key) {
      let domId = document.querySelectorAll(`#semShortConfig #${key} input`)[0]
      let inputIndex = domId.selectionStart
      let insertStr = (soure, start, newStr) => {
        return soure.slice(0, start) + newStr + soure.slice(start)
      }
      this.data[key] = insertStr(this.data[key], inputIndex, `{推广组}`)
    },
    closeTimePoint (index) {
      this.data.timePoint4QuerywordRetrieval.splice(index, 1)
    },
    handleOpenTimePicker () {
      let value = this.openTimePickerValue
      if (value) {
        this.data.timePoint4QuerywordRetrieval.push(value)
      }
      this.openTimePicker = false
    },
    handleClearTimePicker () {
      this.openTimePickerValue = ''
      this.openTimePicker = false
    }
  },
  computed: {
    nickname () {
      return this.$store.state.user.nickname
    },
    phraseCreativeTitleDefaultOverflow () {
      return getCharLength(this.data.phraseCreativeTitleDefault, 50)
    },
    phraseCreativeDescriptOneDefaultOverflow () {
      return getCharLength(this.data.phraseCreativeDescriptOneDefault, 80)
    },
    phraseCreativeDescriptTwoDefaultOverflow () {
      return getCharLength(this.data.phraseCreativeDescriptTwoDefault, 80)
    }
  }
}
</script>

<style>
</style>
