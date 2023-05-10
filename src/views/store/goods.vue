<template>
  <div class="main">
    <div class="container" v-if="goods!=null">
      <van-nav-bar
        title="商品详情"
        @click-left="$router.push('/store')"
        left-text
        @nav-bar-arrow-size="20"
        left-arrow
      />
      <div style="height: 10px"></div>
      <div class="goods-list">
        <div class="goods-item">
          <div class="goods-title">{{ goods.Title }}</div>
          <div class="cell-main">
            <div class="cell-item">
              <div class="cell-name">单份存储</div>
              <div class="cell-value">{{ goods.UnitStorage }}TiB</div>
            </div>
            <div class="cell-item">
              <div class="cell-name">单份价格</div>
              <div class="cell-value">{{ vui.toFil(goods.UnitPrice) }}FIL</div>
            </div>
            <div class="cell-item">
              <div class="cell-name">单份质押数量</div>
              <div class="cell-value">{{ vui.toFil(goods.StakeAmount) }}FIL</div>
            </div>
            <div class="cell-item">
              <div class="cell-name">收益分成比例</div>
              <div class="cell-value">{{ vui.toFil(goods.Scale*100,2) }}%</div>
            </div>
            <div class="cell-item">
              <div class="cell-name">服务周期</div>
              <div class="cell-value">{{ goods.Period }}天</div>
            </div>
            <div class="cell-item">
              <div class="cell-name">剩余份数</div>
              <div class="cell-value">{{ goods.NftCount }}份</div>
            </div>
            <div class="cell-item">
              <div class="cell-name">7日年化收益率</div>
              <div class="cell-value">{{ goods.Day7Profit }}</div>
            </div>
            <div class="cell-item">
              <div class="cell-name">540日年化收益率</div>
              <div class="cell-value">{{ goods.Day540Profit }}</div>
            </div>
            <div class="cell-item">
              <div class="cell-name">启动时间</div>
              <div class="cell-value">
                {{
                vui.formatDateTime(goods.StartTime, "YYYY-MM-DD HH:mm")
                }}
              </div>
            </div>
            <div class="cell-item">
              <div class="cell-name">合约地址</div>
              <div class="cell-value">
                <a
                  class="caddr"
                  :href="vui.getCAddrUrl(goods.ContractAddress)"
                  target="_blank"
                >{{ goods.ContractAddress }}</a>
              </div>
            </div>
          </div>
          <div class="cell-main">
            <div class="cell-title">产品优势</div>
            <div class="cell-pic line20" v-html="(goods.NftSuper.replace(/\n/g,'<br>'))">
              <!-- <img class="pic" src="" /> -->
            </div>
          </div>
          <div class="cell-main">
            <div class="cell-title">产品说明</div>
            <div class="cell-pic line20" v-html="goods.NftDesc.replace(/\n/g,'<br>')">
              <!-- <img class="pic" src="" /> -->
            </div>
          </div>
          <div class="cell-main">
            <div class="cell-title">产品收益计算方式</div>
            <div class="cell-pic line20">本产品每日收益按主网挖矿规则计算发放。</div>
          </div>
        </div>
      </div>
      <div class="btn-wrap">
        <div class="btn-container" @click="goBuy">
          <div class="goods-price">
            单份
            <span class="price">{{ vui.toFil(goods.UnitPrice) }} FIL</span>
          </div>
          <div class="my-btn">立即购买</div>
        </div>
      </div>
    </div>
  </div>
</template>
      
      <script>


export default {
  components: {

  },
  mounted() {

  },
  created() {
    this.nodeID = this.$route.params.nodeid
    this.getNode()
  },
  computed: {

  },
  data() {
    return {
      goods: null,
      nodeID: null
    }
  },
  methods: {
    goBuy() {
      this.conwallt(() => {
        this.$router.push('/store/goodsconfirm/' + this.nodeID)
      })
    },
    getNode() {
      this.req({
        url: '/node/GetNodeByID',
        params: {
          nodeID: this.nodeID
        }
      }).then(res => {
        this.goods = res
      })
    }
  }
}
      </script>
      <style src="@/assets/css/reset.css" scoped></style>
      <style src="@/assets/css/store.css" scoped></style>
      <style src="@/assets/css/goods.css" scoped></style>
      <style src="@/assets/css/extend.css" scoped></style>
      <style >
.van-nav-bar__arrow {
  font-size: 24px;
}
.van-nav-bar .van-icon {
  color: #323233;
}
.line20 {
  line-height: 25px;
}
</style>
      