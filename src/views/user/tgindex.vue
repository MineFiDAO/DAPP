<template>
  <div class="main">
    <div class="container">
      <div class="page-top">
        <div class="income-wrap" v-if="myinfo">
          <div class="income-left">
            <div class="txt">推广用户：{{ myinfo.FissUserCount }} 人</div>
            <div class="txt" v-show="false">累计收益：{{ vui.toFil(myinfo.FissTotalAmount) }}</div>
            <div class="txt" v-show="false">已领收益：{{ vui.toFil(myinfo.FissGetAmount)}}</div>
            <div class="txt">
              推广地址：{{ vui.getTGUrl() }}
              <van-tag plain type="primary" size="large" class="btncopy" @click="copyUrl">复制</van-tag>
            </div>
            <div class="my-btn" @click="$router.push('/fund')">返回</div>
          </div>
          <div class="income-right" v-show="false">
            <div class="txt">可领取收益</div>
            <div class="money">{{ vui.toFil(myinfo.FissCurrentAmount)}}</div>
            <div class="my-btn my-btn-large">领取收益</div>
          </div>
        </div>
      </div>
      <div class="my-table">
        <div class="my-table-nav">
          <div
            v-for="(item,key) in reportTabs"
            :class="'table-nav-item '+(curTab==key?'active':'')"
            :key="key"
            @click="swithtab(key)"
          >{{item}}</div>
        </div>
        <div>
          <FissUserList ref="fissuserlist"></FissUserList>
          <FissMoneyLog ref="fissmoneylog"></FissMoneyLog>
        </div>
      </div>
    </div>
  </div>
</template>
      <script scoped>
import clipboard from 'clipboard'
import FissUserList from '@/components/tg/fissuserlist'
import FissMoneyLog from '@/components/tg/fissmoneylog'
import wc from '@/utils/conwallet'
export default {
  components: {
    FissUserList,
    FissMoneyLog
  },
  mounted() {
    this.swithtab(this.curTab)
    this.conwallt(() => {
      wc.getBalanceAmount().then(amount => {
        this.filAmount = amount
      })
    })
    this.getMyInfo()
  },
  created() {

  },
  computed: {

  },
  data() {
    return {
      tbheight: document.body.clientHeight - 377,
      myinfo: null,
      filAmount: 0,
      curTab: 0,
      reportTabs: {
        0: '推广用户',
        // 1: '现金记录'
      }
    }
  },
  methods: {
    swithtab(k) {
      this.curTab = k
      var tabC = [
        this.$refs.fissuserlist,
        this.$refs.fissmoneylog
      ]
      tabC.forEach(c => c.hide())
      tabC[this.curTab].show()
    },
    getMyInfo() {
      this.req({
        url: '/user/wallet/GetWalletByAddress',
        params: {
          address: this.$store.state.user.userInfo.addr
        }
      }).then(res => {
        this.myinfo = res
      })
    },
    copyUrl() {
      var cp = new clipboard('.btncopy', {
        text: () => {
          return this.vui.getTGUrl()
        }
      })
      cp.on('success', () => {
        this.$toast('复制成功')
        cp.destory()
      })
      cp.on('error', () => {
        this.$toast('复制失败')
        cp.destory()
      })
    },
  }
}
      </script>
      
    <style src="@/assets/css/reset.css" scoped></style>
    <style src="@/assets/css/fund.css" scoped></style>
    <style src="@/assets/css/extend.css" scoped></style>
      <style lang="less" scoped >
.van-tag--large {
  padding: 4px 8px;
}
</style>