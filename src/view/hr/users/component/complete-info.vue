<template>
<div class="detail-page-wrapper">
    <div class="detail-page" style="position: relative">
        <!--headinf s-->
        <headeInfo :info="info"></headeInfo>
        <!--main content s-->
        <div class="page-middle-wrapper">
            <div class="page-middle">
                <!--基础信息 s-->
                <editBaseInfo></editBaseInfo>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import mixins from '../mixins'
import headeInfo from './heade-info'
import editBaseInfo from './edit-base-info'
export default {
  name: 'completeInfo',
  components: {
    headeInfo,
    editBaseInfo
  },
  mixins: [mixins],
  data () {
    return {
      info: {}
    }
  }

}
</script>

<style>
.detail-page-wrapper table input {
    border-radius: unset;
    border: none;
    border-bottom: 1px solid #dcdee2;
    outline: none;
}
</style><style lang="less" scoped>
@import '~@/assets/style/variables.less';

.detail-page-wrapper {
    background-color: #fff;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    overflow-y: scroll;

    .detail-page {
        height: 100%;
        position: relative;
        height: 100%;

        .page-middle-wrapper {
            border-radius: 25px;
            position: absolute;
            top: 180px;
            bottom: 0;
            left: 30px;
            right: 30px;
            box-sizing: border-box;
            background: #fff;

            .page-middle {
                background: #fff;
                padding: 30px 30px;
                border-radius: 10px;
                margin-bottom: 100px;
                box-shadow: 0 2px 13px 0 rgba(0, 0, 0, 0.12);
            }
        }
    }
}
</style>
