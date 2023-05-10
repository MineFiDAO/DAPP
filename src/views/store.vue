<template>
  <div class="main">
    <div class="container">
      <div class="page-title">MineFI NFT</div>
      <div class="page-subtitle">
        <!-- <div class="my-btn">FIL存储</div> -->
      </div>
      <div class="goods-list">
        <div class="goods-item" v-for="m in nftList" :key="m.nid" @click="goGoods(m)">
          <div class="goods-title">{{ m.Title }}</div>
          <div class="cell-main">
            <div class="cell-item">
              <div class="cell-name">单份存储</div>
              <div class="cell-value">{{ m.UnitStorage }}TiB</div>
            </div>
            <div class="cell-item">
              <div class="cell-name">单份价格</div>
              <div class="cell-value">{{ vui.toFil(m.UnitPrice) }}FIL</div>
            </div>
            <div class="cell-item">
              <div class="cell-name">单份质押数量</div>
              <div class="cell-value">{{ vui.toFil(m.StakeAmount) }}FIL</div>
            </div>
            <div class="cell-item">
              <div class="cell-name">收益分成比例</div>
              <div class="cell-value">{{ vui.toFil(m.Scale*100,2) }}%</div>
            </div>
            <div class="cell-item">
              <div class="cell-name">服务周期</div>
              <div class="cell-value">{{ m.Period }}天</div>
            </div>
            <div class="cell-item">
              <div class="cell-name">剩余份数</div>
              <div class="cell-value">{{ m.NftCount }}份</div>
            </div>
            <div class="cell-item">
              <div class="cell-name">7日年化收益率</div>
              <div class="cell-value">{{ m.Day7Profit }}</div>
            </div>
            <div class="cell-item">
              <div class="cell-name">540日年化收益率</div>
              <div class="cell-value">{{ m.Day540Profit }}</div>
            </div>
            <div class="cell-item">
              <div class="cell-name">启动时间</div>
              <div class="cell-value">{{ vui.formatDateTime(m.StartTime, "YYYY-MM-DD HH:mm") }}</div>
            </div>
            <div class="cell-item">
              <div class="cell-name">合约地址</div>
              <div class="cell-value">
                <a
                  @click.stop
                  class="caddr"
                  :href="vui.getCAddrUrl(m.ContractAddress)"
                  target="_blank"
                >{{ m.ContractAddress }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script >
var ethers = require('ethers')
export default {
  components: {

  },
  mounted() {

  },
  created() {
    this.getNFTList()
  },
  computed: {

  },
  data() {
    return {
      nftList: [

      ]
    }
  },
  methods: {
    goGoods(m) {
      this.$router.push('/store/goods/' + m.Id)
    },
    getNFTList() {
      this.req({
        url: '/node/GetNodeList',
        params: {
          pageIndex: 1,
          pageSize: 1000,
          status: this.em.NodeStatus.Online
        }
      }).then(res => {
        console.log(res)
        this.nftList = res.PageData
      })
    }
  }
}
  </script>    
  <style src="@/assets/css/reset.css" scoped></style>
  <style src="@/assets/css/store.css" scoped></style>
  <style src="@/assets/css/extend.css" scoped></style>
  <style scoped>
.comingsong {
  text-align: center;
  padding-top: 20%;
  font-size: 2rem;
}
</style>
