<template>
  <div class="my-table-content" v-show="showui">
    <MyTb :tbconfig="tbconfig" :loadData="getData" :isPage="true" ref="mytblist" :height="tbHeight">
      <template slot="head">
        <th class="tb-value">NFT名称</th>
        <th class="tb-value">
          编号
          <br />面值
        </th>
        <th class="tb-value">总收益</th>
        <th class="tb-value">
          质押数量
          <br />可赎回数
        </th>
        <th class="tb-value">有效时间</th>
        <th class="tb-value">状态</th>
        <th class="tb-value">节点</th>
        <th class="tb-value">操作</th>
      </template>
      <template slot="bodyrow" slot-scope="scope">
        <tr v-for="(row,index) in scope.tabledata" :key="index">
          <td class="tb-value">
            <a @click.stop :href="vui.getCTxUrl(row.TxID)" target="_blank">
              <img class="nft-pic" :src="row.Node.NftUri" />
              <div
                class="ellipsistxt"
                :style="'font-size:12px;width:'+scope.colconfig[0]+'px;'"
              >{{row.Node.AliasName}}</div>
            </a>
          </td>
          <td class="tb-value link" @click.stop="openProfitList(row)">
            {{ row.NumID }}
            <div class="line"></div>
            <div class="txtmin">{{ row.Node.UnitStorage }}TiB</div>
          </td>
          <td
            class="tb-value link"
            @click.stop="openProfitList(row)"
          >{{ vui.toFil(row.TotalProfit) }}</td>
          <td class="tb-value txtmin">
            {{ vui.toFil(row.Node.StakeAmount) }}FIL
            <div
              v-if="row.IsExpire && row.Node.Status!=em.NodeStatus.Abort"
            >{{ vui.toFil(row.Node.StakeAmount) }}FIL</div>
            <div
              v-if="row.Node.Status==em.NodeStatus.Abort"
            >{{ vui.formatFil(row.ransomPledge) }}FIL</div>
            <div v-if="!row.IsExpire && row.Node.Status!=em.NodeStatus.Abort">--</div>
          </td>
          <td class="tb-value">
            {{vui.formatDateTime(row.BeginProfitTime, "YYYY-MM-DD")}}
            <br />
            {{vui.formatDateTime(row.EndProfitTime, "YYYY-MM-DD")}}
          </td>

          <td class="tb-value">{{ em.NftStatus_em[row.Status] }}</td>
          <td class="tb-value link txtmin">
            <a target="_blank" :href="vui.getNodeUrl(row.Node.MinerID)">{{ row.Node.MinerID }}</a>
          </td>
          <td class="tb-value">
            <span v-if="!isShowGet(row)">--</span>
            <a @click.stop="ransomPledge(row)" href="#" v-if="isShowGet(row)">赎回</a>
          </td>
        </tr>
      </template>
    </MyTb>
  </div>
</template>
<script>
import NFTC from '@/utils/NFTContract'
import MinerC from '@/utils/minerContract'
import chainmgr from '@/utils/chainmgr'
export default ({
  created() {
  },
  computed: {

  },
  data() {
    return {
      showui: false,
      tbHeight: this.$parent.tbHeight,
      tbconfig: [100, 60, 60, 80, 80, 60, 60, 60],
      nodeExpireTime: {},
      NFTLinkInfo: {},
      minerAddr: null
    }
  },
  methods: {
    //是否显示续回
    isShowGet(m) {
      return m.Status != this.em.NftStatus.Burned && (m.abort || m.IsExpire)
    },
    hide() {
      this.showui = false
      if (this.$refs.mytblist) {
        this.$refs.mytblist.hide()
      }
    },
    getConfig(callfun) {
      this.req({
        url: '/node/GetConfig'
      }).then(res => {
        console.log(res)
        this.minerAddr = res.MinerAddr
        callfun()
      })
    },
    show() {
      this.showui = true
      this.getConfig(() => {
        this.$refs.mytblist.show()
      })
    },
    openProfitList(m) {
      var title = this.vui.strFormat('{0} NFT编号：{1}-{2} 收益明细', m.Node.Title, m.TokenID, m.NumID)
      var path = this.vui.strFormat('/user/myprofitlog/nftid/{0}/{1}', m.Id, title)
      this.$router.push(path)
    },
    ransomPledge(m) {
      this.conwallt(() => {
        var isExistsPending = chainmgr.isExists(a => a.type == this.em.HashType.RansomPledge && a.status != this.em.HashStatus.Fail
          && a.caddr == m.Node.ContractAddress && a.data.numids.indexOf(m.NumID) != -1)
        if (isExistsPending) {
          this.vui.alert("赎回操作正在处理中，请稍后再试。")
          return
        }

        new Promise((r, e) => {
          if (m.Node.Status == this.em.NodeStatus.Abort) {
            this.req({
              url: '/user/wallet/GetStakingReturnByNftID',
              method: 'get',
              params: {
                nftID: m.Id
              }
            }).then(res => {
              var tips = this.vui.strFormat('操作将销毁NFT并绑定当前钱包地址为收益发放地址，由于扇区异常终止惩罚，{0}Fil将被扣除，当前可赎回数量为{1}Fil。自扇区终止后NFT将不再产生新收益，但已有待线性释放收益仍将按照主网规则每日释放至收益发放地址直到完全释放，请您及时领取。', this.vui.toFil(res.CAmount), this.vui.toFil(res.Amount))
              this.vui.confirm(tips).then(r)
            })
          } else if (m.ReleaseEnd) {
            NFTC.queryRansomPledge(m.Node.ContractAddress, [m.NumID]).then(_amount => {
              var tips = this.vui.strFormat('赎回数量：{0}Fil,是否确认?', this.vui.formatFil(_amount.toBigInt()))
              this.vui.confirm(tips).then(r)
            })
          } else if (m.IsExpire) {
            var tips = '操作将销毁NFT并绑定当前钱包地址为收益发放地址，剩余待线性释放收益仍将按照主网规则每日释放至收益发放地址直到完全释放，请您及时领取。'
            this.vui.confirm(tips).then(r)
          }
        }).then(() => {
          this.vui.showLoadingforever(15)
          NFTC.ransomPledge(m.Node.ContractAddress, m.Node.Title, [m.NumID]).then(() => {
            this.vui.confirm("操作成功，是否查看详情?").then((result) => {
              this.$parent.switchtabname('txlist')
            })
          }).catch(res => {
            this.vui.alert("操作失败")
          })

        })
      })
    },
    //获取NFT链上信息
    getNFTLinkInfo(caddr, callfun) {
      if (this.NFTLinkInfo[caddr] != null && typeof (this.NFTLinkInfo[caddr].time) != "undefined") {
        callfun(this.NFTLinkInfo[caddr])
      } else {
        this.NFTLinkInfo[caddr] = {}
        NFTC.getLastPledgeAuditTime(caddr).then(time => {
          this.NFTLinkInfo[caddr].time = time
          callfun(this.NFTLinkInfo[caddr])
        })
      }
    },
    getData(index, size) {
      return new Promise((r, e) => {
        this.req({
          url: '/user/wallet/GetNftListByWalletID',
          method: 'get',
          params: {
            pageIndex: index,
            pageSize: size
          }
        }).then(res => {
          var d = {
            total: res.TotalCount,
            list: res.PageData
          }
          if (d.list.length > 0) {
            var nlist = {}
            d.list.forEach(m => {
              if (m.Node.Status == this.em.NodeStatus.Abort) {
                if (!nlist[m.Node.ContractAddress]) {
                  nlist[m.Node.ContractAddress] = []
                }
                nlist[m.Node.ContractAddress].push(m.NumID)
              }
            })

            this.vui.eachAryAsyn(nlist, (m) => {
              return new Promise((_r, _e) => {
                NFTC.getPledgeDatas(m.key, m.val).then(rlist => {
                  rlist.forEach(r => {
                    d.list.forEach(_n => {
                      if (_n.Node.ContractAddress == m.key && _n.NumID == r.TokenNum.toBigInt()) {
                        _n.ransomPledge = r.Amount.toBigInt()
                      }
                    })
                  })
                  _r()
                })
              })
            }).then(() => {
              this.vui.eachAryAsyn(d.list, (nft) => {
                return new Promise((_r, _e) => {
                  this.getNFTLinkInfo(nft.Node.ContractAddress, (linkdata) => {
                    nft.abort = linkdata.time > 0
                    _r()
                  })
                })
              }).then(() => {
                r({ data: d })
              })
            })
          } else {
            d.list.forEach(n => n.abort = false)
            r({ data: d })
          }
        })
      })
    }
  }
})
</script>
<style src="@/assets/css/reset.css" scoped></style>
<style src="@/assets/css/fund.css" scoped></style>
<style src="@/assets/css/extend.css" scoped></style>
<style lang="less" scoped>
@tbheight: 500px;
.tb-list {
  min-height: @tbheight;
}
.loadingtdlist {
  height: @tbheight - 146;
  overflow-y: auto;
  overflow-x: hidden;
}
.tb-value {
  padding: 5px 0px;
}
.tb-value.link {
  color: #2973ff;
  cursor: pointer;
}
.tb-value.link a {
  text-decoration: none;
}
.line {
  border-top: #9e9a9a dashed 1px;
  width: 10px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1px;
  margin-bottom: 3px;
}
</style>
