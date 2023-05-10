<template>
  <div>
    <div class="main">
      <div class="container">
        <van-nav-bar
          title="提交订单"
          @click-left="$router.push('/store/goods/'+nodeID)"
          left-text
          @nav-bar-arrow-size="20"
          left-arrow
        />
        <div v-if="goods!=null">
          <div style="height: 10px"></div>
          <div class="goods-list">
            <div class="goods-item">
              <div class="cell-main">
                <div class="cell-item">
                  <div class="cell-name">产品名称</div>
                  <div class="cell-value">{{ goods.Title }}</div>
                </div>
                <div class="cell-item">
                  <div class="cell-name">单份价格</div>
                  <div class="cell-value">{{ vui.toFil(goods.UnitPrice) }}FIL</div>
                </div>
                <div class="cell-item">
                  <div class="cell-name">单份存储</div>
                  <div class="cell-value">{{ goods.UnitStorage }}TiB</div>
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
                  <div class="cell-value">{{ goods.NftCount-buyNum }}份</div>
                </div>
                <div class="cell-item">
                  <div class="cell-name">7日年化收益率</div>
                  <div class="cell-value">{{goods.Day7Profit }}</div>
                </div>
                <div class="cell-item">
                  <div class="cell-name">540日年化收益率</div>
                  <div class="cell-value">{{goods.Day540Profit}}</div>
                </div>
              </div>
            </div>
            <div class="goods-item">
              <div class="cell-main">
                <div class="cell-item">
                  <div class="cell-name">购买份数</div>
                  <div class="cell-value">
                    <div class="numberbox">
                      <div
                        :class="'numberbox-reduce ' + checkChangeBtn('-')"
                        @click="changeBuyNum('-')"
                      ></div>

                      <input
                        @input="onBuyNumChange"
                        type="text"
                        v-model="buyNum"
                        maxlength="6"
                        class="numberbox-numtxt"
                      />

                      <div
                        :class="'numberbox-plus ' + checkChangeBtn('+')"
                        @click="changeBuyNum('+')"
                      ></div>
                    </div>
                  </div>
                </div>
                <div class="cell-item">
                  <div class="cell-name">到手存储</div>
                  <div class="cell-value">{{ TotalAmount }}TiB</div>
                </div>
                <div class="cell-item">
                  <div class="cell-name"></div>
                  <div class="cell-value" style="color:red;">单次最多购买 {{this.maxBuyNum}} 份</div>
                </div>
              </div>
            </div>
            <div class="goods-item payways">
              <div class="cell-main">
                <div class="cell-title">选择支付方式</div>
                <div class="cell-item on">
                  <div class="cell-name">FIL</div>
                  <div class="cell-value">可用{{vui.formatFil(filAmount)}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="btn-wrap">
            <div class="agreement" @click="agree=!agree">
              <div :class="'checkbox '+(agree?'on':'')"></div>
              <div class="agreement-text">
                我同意
                <span class="color-blue">《IPFS存储服务销售协议》</span>
              </div>
            </div>
            <div class="btn-container" @click="checkBuy">
              <div class="goods-price">
                合计
                <span class="price">{{ vui.toFil(buyNum * goods.UnitPrice) }} FIL</span>
              </div>
              <div class="my-btn">立即支付</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-wrap show" v-show="showConfirm">
      <div class="dialog-content">
        <div class="dialog-title">确认购买</div>
        <div class="dialog-container">确认要购买吗？购买后不可撤回！</div>
        <div class="dialog-btn">
          <div class="btn-item" @click="showConfirm=false">取消</div>
          <div class="btn-item btn-blue" @click="buy()">确认</div>
        </div>
      </div>
    </div>
  </div>
</template>
    
    <script>
const ethers = require('ethers')
import wc from '@/utils/conwallet'
import MineC from '@/utils/NFTContract'
export default {
  components: {

  },
  mounted() {

  },
  created() {
    this.nodeID = this.$route.params.nodeid
    this.getNode()
    this.conwallt(() => {
      wc.getBalanceAmount().then(amount => {
        this.filAmount = amount
      })
    })
  },
  computed: {
    TotalAmount() {
      return this.buyNum * this.goods.UnitStorage
    }
  },
  data() {
    return {
      goods: null,
      nodeID: null,
      buyNum: 0,
      agree: true,
      showConfirm: false,
      filAmount: 0,
      maxBuyNum: 5000
    }
  },
  methods: {
    getNode() {
      this.req({
        url: '/node/GetNodeByID',
        params: {
          nodeID: this.nodeID
        }
      }).then(res => {
        this.goods = res
      })
    },
    BuyNumIsAllowChange(ctype) {
      switch (ctype) {
        case "+":
          return this.buyNum + 1 <= this.goods.NftCount
        case "-":
          return this.buyNum - 1 > 0
      }
      return false
    },
    checkChangeBtn(ctype) {
      return this.BuyNumIsAllowChange(ctype) ? "" : "disable"
    },
    changeBuyNum(ctype) {
      if (this.BuyNumIsAllowChange(ctype)) {
        switch (ctype) {
          case "+":
            this.buyNum++
            break
          case "-":
            this.buyNum--
            break
        }
      }
    },
    onBuyNumChange() {
      this.buyNum = this.buyNum.replace(/[^\d]+/g, '')
      if (this.buyNum == "") {
        this.buyNum = 0
      }
      this.buyNum = parseInt(this.buyNum)
      if (this.buyNum > this.goods.NftCount) {
        this.buyNum = this.goods.NftCount
      } else if (this.buyNum < 0) {
        this.buyNum = 0
      }
      this.buyNum = this.buyNum > this.maxBuyNum ? this.maxBuyNum : this.buyNum
    },
    checkBuy() {
      if (this.buyNum <= 0) {
        this.vui.errMsg('最少购买一份')
        return
      }
      if (this.TotalAmount * parseFloat(this.goods.UnitPrice) > this.filAmount / 1e18) {
        this.vui.errMsg('余额不足')
        return
      }
      if (!this.agree) {
        this.vui.alert('请同意 《IPFS存储服务销售协议》 后购买')
        return
      }
      if (this.goods.Status != this.em.NodeStatus.Online) {
        this.vui.alert('节点暂时不能购买')
        return
      }
      this.showConfirm = true
    },
    buy() {
      this.showConfirm = false
      this.vui.showLoadingforever(15)
      this.conwallt(() => {
        MineC.getRemainCount(this.goods.ContractAddress).then((bnum) => {
          bnum = bnum.toBigInt()
          if (bnum <= 0) {
            this.vui.alert('已经售馨，请联系客服')
          } else if (bnum <= this.buyNum) {
            this.vui.alert('库存不足')
          }
          else {
            var actBuy = (num) => {
              var oneTimesNum = 500
              if (num <= 0) {
                return
              }
              var curNum = num < oneTimesNum ? num : oneTimesNum
              MineC.Mint(this.goods.ContractAddress, this.goods.UnitPrice, curNum, this.goods.Title).then(hash => {
                if (num - curNum <= 0) {
                  this.vui.confirm("操作成功，是否查看详情?").then((result) => {
                    this.$router.push('/fund/txlist')
                  })
                } else {
                  actBuy(num - oneTimesNum)
                }
              }).catch((e) => {
                var submitNum = this.buyNum - num
                this.vui.alert(this.vui.strFormat("购买失败,成功提交{0}份,请稍后再试", submitNum))
              })
            }
            actBuy(this.buyNum)
          }
        })
      })
    },
  }
}
    </script>  
    <style src="@/assets/css/reset.css" scoped></style>
    <style src="@/assets/css/store.css" scoped></style>
    <style src="@/assets/css/order.css" scoped></style>
    <style src="@/assets/css/extend.css" scoped></style>
    <style >
.van-nav-bar__arrow {
  font-size: 24px;
}
.van-nav-bar .van-icon {
  color: #323233;
}
.numberbox-numtxt {
  display: inline-block;
  height: 30px;
  width: 60px;
  margin: 0 4px;
  background: #fff;
  text-align: center;
  font-size: 14px;
  line-height: 30px;
  vertical-align: middle;
}
</style>
    