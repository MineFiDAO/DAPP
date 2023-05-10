<template>
  <div class="main">
    <div class="container">
      <div class="page-top" ref="pagetop">
        <!-- 未登录 -->
        <div class="userinfo" v-if="!$store.state.user.isLogon">
          <div class="my-btn" @click="login()">去登录</div>
        </div>
        <!-- 已登录 -->
        <div class="income-wrap" v-if="$store.state.user.isLogon &&  myinfo!=null">
          <div class="income-left">
            <div class="userpic" v-show="false">
              <div class="headpic" v-show="false" id="qrcode" ref="qrcode"></div>
              <img class="headpic" src="@/assets/images/nft.png" />
            </div>
            <div class="txt">
              钱包地址：{{ formatAddr($store.state.user.userInfo.addr) }}
              <van-tag
                class="pointer"
                plain
                type="primary"
                size="large"
                @click="$store.commit('user/USER_SIGNOUT')"
              >退出</van-tag>
            </div>
            <div class="txt">钱包余额：{{ vui.formatFil(filAmount) }}</div>
            <div class="txt">累计领取：{{ isloadingIncome?"--":vui.formatFil(totalIncome) }}</div>
            <!-- <div class="my-btn" @click="$store.commit('user/USER_SIGNOUT')">退出登录</div> -->
            <div>
              <span class="pointer linktxt" @click="$router.push('/user/tgindex')">邀请好友</span>
            </div>
          </div>
          <div class="income-right">
            <div class="txt">当前可领取收益</div>
            <div class="money">{{ isloadingIncome?"--":vui.formatFil(curIncome,18) }}</div>
            <div
              class="waitCollectedtxt pointer"
              @click="$router.push('/user/waitprofitlog')"
            >待转入：{{ vui.toFil(myinfo.WaitCollectedAmount) }}</div>
            <div class="my-btn my-btn-large" @click="withdraw">领取收益</div>
          </div>
        </div>
        <div class="income-group" v-show="$store.state.user.isLogon" v-if="myinfo!=null">
          <div class="income-group-item">
            <div class="income-group-item-lab">释放总额:</div>
            <div class="income-group-item-val">{{ vui.toFil(myinfo.TotalReleaseProfit) }} FIL</div>
          </div>
          <div class="income-group-item">
            <div class="income-group-item-lab">昨日释放总额:</div>
            <div class="income-group-item-val">
              {{vui.toFil(myinfo.YesterdayReleaseProfit)}} FIL
              <a
                :href="vui.getDocUrl()"
                target="_blank"
              >
                <van-icon class="helpIco" name="question-o" />
              </a>
            </div>
          </div>
          <div class="income-group-item">
            <div class="income-group-item-lab">线性释放总额:</div>
            <div class="income-group-item-val">{{vui.toFil(myinfo.TotalDelayReleaseProfit)}} FIL</div>
          </div>
          <div class="income-group-item">
            <div class="income-group-item-lab">昨日线性释放总额:</div>
            <div class="income-group-item-val">{{vui.toFil(myinfo.YesterdayDelayReleaseProfit)}} FIL</div>
          </div>
          <div class="income-group-item">
            <div class="income-group-item-lab">待线性释放总额:</div>
            <div class="income-group-item-val">{{vui.toFil(myinfo.RemainReleaseProfit)}} FIL</div>
          </div>
          <div class="income-group-item">
            <div class="income-group-item-lab">24h 平均收益:</div>
            <div class="income-group-item-val" v-if="lastAvgProfit!=null">
              <span
                class="linktxt pointer"
                @click.stop="$router.push('/user/dayAvgProfit')"
              >{{ vui.toFil(lastAvgProfit) }} FIL/TiB</span>
            </div>
            <div class="income-group-item-val" v-if="lastAvgProfit==null">--</div>
          </div>
        </div>
      </div>
      <div class="my-table" v-if="$store.state.user.isLogon">
        <div class="my-table-nav">
          <div
            v-for="(item,key) in reportTabs"
            :class="'table-nav-item '+(curTab==key?'active':'')"
            :key="key"
            @click="changeTab(key)"
          >{{item}}</div>
        </div>
        <div v-show="$store.state.user.isLogon" @click.stop>
          <MyNftList ref="mynftlist"></MyNftList>
          <MyProfitList ref="myprofitlist"></MyProfitList>
          <MyTxList ref="mytxlist"></MyTxList>
        </div>
      </div>
      <div class="page-footer" v-show="false">
        <div class="contact">
          联系我们：
          <a class="tel" href="tel:+028-0123456">Tel xxxxxx</a>
        </div>
        <div class="copyright">© Copyright 2023 版权所有</div>
      </div>
    </div>
  </div>
</template>
    <script>
import QRCode from 'qrcodejs2'
import MyNftList from '@/components/user/mynftlist'
import MyTxList from '@/components/user/mytxlist'
import MyProfitList from '@/components/user/myprofitlist'
import wc from '@/utils/conwallet'
import NFTC from '@/utils/NFTContract'
import chainmgr from '@/utils/chainmgr'

export default {
  components: {
    MyNftList,
    MyProfitList,
    MyTxList
  },
  mounted() {
    if (this.$store.state.user.isLogon) {
      this.vui.showLoadingforever()
      this.loginAfter()
    }
    this.getLastAvgProfit()
    setInterval(() => {
      this.getLastAvgProfit()
    }, 120 * 1000)
    this.bus.$on('HashTxListChange', (m => {
      if (m.type == this.em.HashType.GetIncome) {
        this.loginAfter()
      }
    }))
  },
  created() {

  },
  computed: {

  },
  data() {
    return {
      filAmount: 0,
      curTab: 0,
      reportTabs: [
        '我的NFT',
        '收益记录',
        '操作记录',
      ],
      totalIncome: 0,
      curIncome: 0,
      lastAvgProfit: null,
      allNftInfo: [],
      myinfo: null,
      isloadingIncome: true,
      tbHeight: document.body.clientHeight - 400,
    }
  },
  methods: {
    formatAddr(addr) {
      return addr.substr(0, 4) + '***' + addr.substr(addr.length - 4, 4)
    },
    changeTab(key) {
      var path = '/fund/' + key
      if (this.$route.path != path) {
        this.$router.push(path)
      }
      this.swithtab(key)
    },
    switchtabname(tab) {
      var tabs = {
        profitlist: 1,
        txlist: 2,
      }
      if (tab && tabs[tab]) {
        this.swithtab(tabs[tab])
      }
    },
    swithtab(k) {
      this.curTab = k
      var tabC = [
        this.$refs.mynftlist,
        this.$refs.myprofitlist,
        this.$refs.mytxlist,
      ]
      tabC.forEach(c => c.hide())
      tabC[this.curTab].show()
    },
    loginAfter() {
      this.conwallt(() => {
        this.vui.hideLoading()
        var tab = this.$route.params.tab
        if (typeof (tab) != "undefined") {
          if (/\d+/.test(tab)) {
            this.swithtab(parseInt(tab))
          } else {
            this.switchtabname(tab)
          }
        } else {
          this.swithtab(this.curTab)
        }
        wc.getBalanceAmount().then(amount => {
          this.filAmount = amount
        })
        this.getMyInfo()
        this.getAllNftInfo()
      })
    },
    login() {
      this.$store.commit('user/USER_SIGNOUT')
      this.vui.showLoadingforever()
      setTimeout(() => {
        this.vui.hideLoading()
        this.conwallt(() => {
          var wcClose = document.getElementById('walletconnect-qrcode-close')
          if (wcClose) {
            wcClose.click()
          }
          this.loginAfter()
        })
      }, 500)
    },
    setHeadQR() {
      this.$refs.qrcode.innerHTML = ''
      this.qr = new QRCode('qrcode', {
        width: 60,
        height: 60,
        text: this.$store.state.user.userInfo.addr
      })
    },
    getMyInfo() {
      this.req({
        url: '/user/wallet/GetUserDetail'
      }).then(res => {
        this.myinfo = res
      })
    },
    getLastAvgProfit() {
      this.req({
        url: '/user/wallet/GetLastAvgProfit'
      }).then(res => {
        this.lastAvgProfit = res
      })
    },
    getAllNftInfo() {
      this.req({
        url: '/user/wallet/GetUserAllNftInfo',
        method: 'get'
      }).then(res => {
        this.allNftInfo = res
        this.totalIncome = 0
        this.curIncome = 0
        this.searchIncome(this.vui.clone(res))
      })
    },
    queryIncome(caddr, index, allNumIds, callfun) {
      var size = 3000
      var numIds = this.vui.getAryPage(allNumIds, index, size)
      if (numIds.length == 0) {
        callfun()
        return
      }
      NFTC.queryIncome(caddr, numIds).then(income => {
        this.curIncome += parseFloat(income.toBigInt())
        console.log('查询可领取收益,', caddr, index, numIds[0], numIds[numIds.length - 1], this.vui.formatFil(income))
        setTimeout(() => {
          this.queryIncome(caddr, index + 1, allNumIds, callfun)
        }, 100);
      }).catch(() => {
        this.queryIncome(caddr, index, allNumIds, callfun)
      })
    },
    queryHasWithdraw(caddr, index, allNumIds, callfun) {
      var size = 3000
      var numIds = this.vui.getAryPage(allNumIds, index, size)
      if (numIds.length == 0) {
        callfun()
        return
      }
      NFTC.queryHasWithdraw(caddr, numIds).then(income => {
        this.totalIncome += parseFloat(income.toBigInt())
        console.log('查询累计收益,', caddr, index, numIds[0], numIds[numIds.length - 1], this.vui.formatFil(income))
        setTimeout(() => {
          this.queryHasWithdraw(caddr, index + 1, allNumIds, callfun)
        }, 100);
      }).catch(() => {
        this.queryHasWithdraw(caddr, index, allNumIds, callfun)
      })
    },
    searchIncome(nftlist, callfun) {
      var nft = nftlist.shift()
      if (nft != null) {
        this.isloadingIncome = true
        this.queryIncome(nft.ContractAddress, 1, nft.NumIDs, () => {
          this.queryHasWithdraw(nft.ContractAddress, 1, nft.NumIDs, () => {
            this.searchIncome(nftlist, callfun)
          })
        })
      } else {
        this.isloadingIncome = false
        if (callfun) {
          callfun()
        }
      }
    },
    withdraw() {
      var isExistsPending = chainmgr.isExists(m => m.type == this.em.HashType.GetIncome && m.status == this.em.HashStatus.Pending)
      if (isExistsPending) {
        this.vui.alert("前一次领取操作正在处理中，请稍后再试。")
        return
      }
      if (this.isloadingIncome) {
        this.vui.alert("等待可领取的收益查询完成后再操作")
        return
      }
      if (this.isloadingIncome || this.allNftInfo.length <= 0 || this.curIncome <= 0) {
        this.vui.alert("暂时无可领取的收益")
        return
      }
      this.vui.showLoadingforever(15)
      var successTimes = 0
      var failTimes = 0
      var runWithdraw = (nftlist, nindex) => {
        var nft = this.vui.getAryPage(nftlist, nindex, 1)
        if (nft.length == 0) {
          if (successTimes > 0) {
            this.vui.confirm("操作完成,是否跳转到操作记录查询信息?").then((result) => {
              this.changeTab(2)
            })
            return
          } else if (failTimes > 0 && successTimes == 0) {
            this.vui.alert("操作失败,请稍后再试")
            return
          }
        } else {
          nft = nft[0]
          var reqWithdraw = (caddr, title, index, allNumIds) => {
            var size = 1000
            var numIds = this.vui.getAryPage(allNumIds, index, size)
            if (numIds.length == 0) {
              runWithdraw(nftlist, nindex + 1)
              return
            }
            NFTC.withdraw(caddr, title, numIds).then(() => {
              successTimes++
              setTimeout(() => {
                reqWithdraw(caddr, title, index + 1, allNumIds)
              }, 100)
            }).catch(() => {
              failTimes++
              setTimeout(() => {
                reqWithdraw(caddr, title, index + 1, allNumIds)
              }, 100)
            })
          }
          reqWithdraw(nft.ContractAddress, nft.Title, 1, nft.NumIDs)
        }
      }
      runWithdraw(this.allNftInfo, 1)
    }
  }
}
    </script>
    
  <style src="@/assets/css/reset.css" scoped></style>
  <style src="@/assets/css/fund.css" scoped></style>
  <style src="@/assets/css/extend.css" scoped></style>
  <style lang="less" scoped>
.van-tag--large {
  padding: 4px 8px;
}
.income-wrap {
  padding-bottom: 20px;
}
.income-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 0px 40px;
  color: #fff;
}
.income-group-item {
  flex: 50%;
  min-width: 150px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.income-group-item-lab,
.income-group-item-val {
  height: 25px;
  line-height: 25px;
  display: inline-block;
  min-width: 100px;
}
.income-group-item-lab {
  min-width: 120px;
}
.income-group-item-lab {
  text-align: right;
}

.income-group :nth-child(2n) {
  text-align: right;
}
.income-group-item-val {
  margin-right: 0px;
}

@media screen and (max-width: 580px) {
  .income-group-item {
    flex: 100%;
  }
}
.txt {
  white-space: nowrap;
}
.waitCollectedtxt {
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 700;
  color: #ff7600;
  text-decoration: underline;
  white-space: nowrap;
}
.linktxt {
  text-decoration: underline;
  color: #e9a8a5;
  font-size: 12px;
}
.helpIco {
  margin-right: -18px;
  color: white;
}
</style>