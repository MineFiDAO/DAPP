<template>
  <div class="main">
    <div class="container">
      <van-nav-bar
        :title="title"
        @click-left="$router.back()"
        left-text
        @nav-bar-arrow-size="20"
        left-arrow
      />
      <div class="filter">
        <van-dropdown-menu class="lab_node">
          <van-dropdown-item
            style="width:170px;"
            v-model="chooseCAddr"
            @change="onChangeNode"
            :options="nodeOptions"
          ></van-dropdown-item>
        </van-dropdown-menu>

        <van-radio-group v-model="isShowSelf" direction="horizontal" @change="onChangeFilter">
          <van-radio :name="true">只看我的</van-radio>
          <van-radio :name="false">查看全部</van-radio>
        </van-radio-group>
      </div>
      <div class="filter">
        <div class="lab_tips" v-show="chooseCAddr!=null">
          <a @click.stop :href="vui.getCAddrUrl(chooseCAddr)" target="_blank">查看合约数据</a>
        </div>
        <div class="lab_tips" v-show="chooseCAddr==null"></div>
        <div class="lab_totalincome" v-show="isShowSelf">总收益：{{vui.formatFil(totalIncome)}}</div>
      </div>
      <div class="my-table">
        <div class="my-table-content">
          <MyTb
            :tbconfig="tbconfig"
            :loadData="getData"
            :isPage="true"
            ref="mytblist"
            :height="tbHeight"
            :pageSize="loadingSize"
            :isLoadingAll="isLoadingAll"
            :timeout="30"
          >
            <template slot="head">
              <th class="tb-value">节点名称</th>
              <th class="tb-value">NFT编号</th>
              <th class="tb-value">待转入收益</th>
              <th class="tb-value">状态</th>
            </template>
            <template slot="bodyrow" slot-scope="scope">
              <tr v-for="(row,index) in scope.tabledata" :key="index">
                <td class="tb-value">{{ row.Title }}</td>
                <td class="tb-value">{{ row.TokenNum }}</td>
                <td class="tb-value num">{{ vui.formatFil(row.Income) }}</td>
                <td class="tb-value">{{ row.StatusDesc }}</td>
              </tr>
            </template>
          </MyTb>
        </div>
      </div>
    </div>
  </div>
</template>
      <script scoped>
import MineC from '@/utils/NFTContract'
import NFTContract from '../../utils/NFTContract'
export default {
  mounted() {
    this.conwallt(() => {
      this.getUserWaitCollectedNftIDs().then((res) => {
        for (var i in res.myNftIDs) {
          this.myNftIDs[res.myNftIDs[i].ContractAddress] = res.myNftIDs[i].NumIds
        }

        this.nodeList = res.nodeList
        this.nodeOptions = [{ text: '全部', value: null }].concat(res.nodeList.map(m => { return { text: m.Title, value: m.ContractAddress } }))
        this.serverTime = res.serverTime
        this.chooseCAddr = null
        if (res.nodeList.length > 0) {
          this.chooseCAddr = this.nodeOptions[0].value
          this.getAllNodeMaxInfo(() => {
            this.onChangeFilter()
          })
        }
      })
    })
  },
  created() {
    switch (this.$route.params.type) {
      case "time":
        this.beginTime = this.$route.params.p1
        this.endTime = this.beginTime + ' 23:59:59'
        this.title = this.$route.params.p2
        break
      case "nftid":
        this.nftID = this.$route.params.p1
        this.title = this.$route.params.p2
        break
    }
  },
  computed: {

  },
  data() {
    return {
      title: '链上待转入收益查询',
      nftID: null,
      tbconfig: [150, 100, 100, 100],
      nodeCount: 0,
      IncomeList: [],
      MyIncomeList: [],
      myNftIDs: [],
      nodeList: [],
      nodeOptions: [],
      chooseCAddr: null,
      statusDesc: '',
      serverTime: 0,
      isShowSelf: true,
      tbHeight: document.body.clientHeight - 198,
      totalIncome: 0,
      isLoading: false,
      isLoadingAll: false,
      loadingSize: 1000,
      searchList: []
    }
  },
  methods: {
    getAllNodeMaxInfo(callfun) {
      this.vui.eachAryAsyn(this.nodeList, (n) => {
        return new Promise((r, e) => {
          NFTContract.getLastMaxNum(n.ContractAddress).then(maxCount => {
            n.NumTotalCount = parseInt(maxCount.toBigInt())
            r()
          }).catch(e)
        })
      }).then(callfun)
    },
    getNodeByCAddr(caddr) {
      for (var i in this.nodeList) {
        if (this.nodeList[i].ContractAddress == caddr) {
          return this.nodeList[i]
        }
      }
      return null
    },
    onChangeFilter() {
      this.totalIncome = 0
      this.isLoadingAll = this.isShowSelf
      this.isLoading = true
      var tableList = []
      this.updateSum()
      this.setMaxCount()
      this.searchList = []

      if (this.isShowSelf) {
        var mynftlist = []
        if (this.chooseCAddr == null) {
          mynftlist = this.myNftIDs
        } else {
          mynftlist[this.chooseCAddr] = this.myNftIDs[this.chooseCAddr]
        }
        var mlist = []
        var numIds = []
        for (var c in mynftlist) {
          mlist = mynftlist[c]
          var pageIndex = 1
          if (mlist && mlist.length > 0) {
            numIds = this.vui.getAryPage(mlist, pageIndex, this.loadingSize)
            while (numIds.length > 0) {
              pageIndex++
              this.addSearchInfo(c, true, numIds)
              numIds = this.vui.getAryPage(mlist, pageIndex, this.loadingSize)
            }
          }
        }
      } else {
        var allnftlist = []
        if (this.chooseCAddr == null) {
          allnftlist = this.nodeList
        } else {
          allnftlist = this.nodeList.filter(n => n.ContractAddress == this.chooseCAddr)
        }
        allnftlist.forEach(n => {
          var curNumID = 1
          while (curNumID < n.NumTotalCount) {
            this.addSearchInfo(n.ContractAddress, false, curNumID)
            curNumID = curNumID + this.loadingSize
          }
        })
      }

      this.$refs.mytblist.changeData(tableList).then(() => {
        this.vui.showLoadingforever()
        this.$refs.mytblist.loadRecord()
      })
    },
    addSearchInfo(caddr, isSelf, params) {
      this.searchList.push({ node: this.getNodeByCAddr(caddr), caddr: caddr, isSelf: isSelf, isSearch: false, params: params })
    },
    setMaxCount() {
      if (this.isShowSelf) {
        if (this.chooseCAddr == null) {
          for (var caddr in this.myNftIDs) {
            this.maxCount += this.myNftIDs[caddr].length
          }
        } else {
          this.maxCount = this.myNftIDs[this.chooseCAddr].length
        }
      } else {
        if (this.chooseCAddr == null) {
          this.maxCount = this.vui.sum(this.nodeList, 'NumTotalCount')
        } else {
          this.maxCount = this.nodeList.filter(n => n.ContractAddress == this.chooseCAddr)[0].NumTotalCount
        }
      }
    },
    updateSum() {
      if (this.isLoading) {
        this.totalIncome = null
        return
      }
      this.totalIncome = 0
      if (this.isShowSelf) {
        this.MyIncomeList.forEach(v => {
          this.totalIncome += v.Income
        })
      } else {
        this.IncomeList.forEach(v => {
          this.totalIncome += v.Income
        })
      }
    },
    onChangeNode() {
      this.IncomeList = []
      this.MyIncomeList = []
      this.onChangeFilter()
    },
    getUserWaitCollectedNftIDs() {
      return this.req({
        url: '/user/wallet/GetUserWaitCollectedNftIDs',
        method: 'get',
      })
    },
    getViewDataNew() {
      return new Promise((r, e) => {
        var slist = this.searchList.filter(s => s.isSearch == false)
        if (slist.length <= 0) {
          r(this.getNullPageData())
          this.isLoading = false
          this.updateSum()
          return
        }

        var s = slist[0]
        var isSelf = s.isSelf
        var req = null
        var rid = this.$refs.mytblist.reqID
        if (s.isSelf) {
          req = MineC.getMyViewData(s.caddr, s.params)
        } else {
          var size = this.loadingSize
          if (s.params + this.loadingSize > s.node.NumTotalCount) {
            size = s.node.NumTotalCount - s.params
          }
          req = MineC.getViewData(s.caddr, s.params, size)
        }
        req.then(list => {
          if (rid != this.$refs.mytblist.reqID) {
            console.log('reqID不一致停止操作', rid, this.$refs.mytblist.reqID)
            return
          }
          console.log('reqID一致正常操作', rid, this.$refs.mytblist.reqID)
          var datalist = []
          for (var i in list) {
            var m = list[i]
            var d = {
              Title: s.node.Title,
              NodeID: s.node.NodeID,
              CAddr: s.node.ContractAddress,
              Id: parseFloat(m.TokenNum.toBigInt()),
              Income: parseFloat(m.CurIncome.toBigInt()),
              TokenNum: parseFloat(m.TokenNum.toBigInt()),
              StatusDesc: '待转入'
            }
            if (d.Id > 0) {
              datalist.push(d)
            }
          }
          var pd = {
            total: 0,
            list: datalist
          }
          if (isSelf) {
            this.MyIncomeList = this.MyIncomeList.concat(datalist)
          } else {
            this.IncomeList = this.IncomeList.concat(datalist)
          }
          pd.total = this.searchList.length * this.loadingSize + 1
          s.isSearch = true
          if (this.searchList.filter(s => s.isSearch == false).length == 0) {
            pd.total = 0
            this.isLoading = false
            this.updateSum()
          }
          r({ data: pd })


        }).catch((err) => {
          console.log(err)
          if (rid != this.$refs.mytblist.reqID) {
            console.log('reqID不一致停止操作', rid, this.$refs.mytblist.reqID)
            return
          } else {
            e()
          }
        })
      })
    },
    getData(index, size) {
      this.isLoading = true
      return this.getViewDataNew()
      // if (!this.isShowSelf) {
      //   var minNum = 1
      //   if (this.IncomeList.length > 0) {
      //     minNum = this.IncomeList[this.IncomeList.length - 1].TokenNum
      //   }
      //   return this.getViewData(minNum, size)
      // } else {
      //   var curIndex = this.MyIncomeList.length
      //   if (this.myNftIDs[this.chooseCAddr]) {
      //     var numIds = this.myNftIDs[this.chooseCAddr].slice(curIndex, curIndex + size)
      //     return this.getViewData(numIds)
      //   } else {
      //     return new Promise((r, e) => {
      //       r(this.getNullPageData())
      //       this.isLoading = false
      //       this.updateSum()
      //     })
      //   }
      // }
    },
    getNullPageData() {
      return {
        data: {
          total: 0,
          list: []
        }
      }
    },
    getViewData() {
      var args = arguments
      return new Promise((r, e) => {
        var node = this.nodeList.find(m => m.ContractAddress == this.chooseCAddr)
        if (node == null) {
          r(this.getNullPageData())
        } else {
          var req = null
          var isSelf = this.isShowSelf
          var rid = this.$refs.mytblist.reqID
          console.log('获取到reqID', rid)
          if (!isSelf) {
            var minNum = args[0]
            var count = args[1]
            var mcount = this.maxCount
            var curCount = this.IncomeList.length
            count = mcount < curCount + count ? mcount - curCount : count
            if (count <= 0) {
              r(this.getNullPageData())
              return
            } else {
              req = MineC.getViewData(node.ContractAddress, minNum, count)
            }
          } else {
            var numIds = args[0]
            req = MineC.getMyViewData(node.ContractAddress, numIds)
          }
          req.then(list => {
            if (rid != this.$refs.mytblist.reqID) {
              console.log('reqID不一致停止操作', rid, this.$refs.mytblist.reqID)
              return
            }
            console.log('reqID一致正常操作', rid, this.$refs.mytblist.reqID)
            var datalist = []
            for (var i in list) {
              var m = list[i]
              var d = {
                Title: node.Title,
                NodeID: node.NodeID,
                CAddr: node.ContractAddress,
                Id: parseFloat(m.TokenNum.toBigInt()),
                Income: parseFloat(m.CurIncome.toBigInt()),
                TokenNum: parseFloat(m.TokenNum.toBigInt()),
                StatusDesc: '待转入'
              }
              datalist.push(d)
            }
            var pd = {
              total: 0,
              list: datalist
            }
            if (isSelf) {
              this.MyIncomeList = this.MyIncomeList.concat(datalist)
              pd.total = this.MyIncomeList.length + 1
            } else {
              this.IncomeList = this.IncomeList.concat(datalist)
              pd.total = this.IncomeList.length + 1
            }
            if (datalist.length == 0 || datalist.length < this.loadingSize || this.maxCount == this.IncomeList.length) {
              pd.total = 0
            }
            r({ data: pd })
            if (pd.total == 0) {
              this.isLoading = false
              this.updateSum()
            }
          }).catch((err) => {
            console.log(err)
            if (rid != this.$refs.mytblist.reqID) {
              console.log('reqID不一致停止操作', rid, this.$refs.mytblist.reqID)
              return
            } else {
              e()
            }
          })
        }
      })
    }
  }
}
      </script>
      
    <style src="@/assets/css/reset.css" scoped></style>
    <style src="@/assets/css/fund.css" scoped></style>
    <style src="@/assets/css/extend.css" scoped></style>
<style >
.van-nav-bar__arrow {
  font-size: 24px;
}

.van-nav-bar .van-icon {
  color: #323233;
}
</style>

<style lang="less" scoped>
.van-tag--large {
  padding: 4px 8px;
}

@tbheight: 800px;
.tb-list {
  min-height: @tbheight;
}
.loadingtdlist {
  height: @tbheight - 146;
  overflow-y: auto;
  overflow-x: hidden;
}
.my-table {
  top: 0;
}
.filter {
  padding: 5px 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.van-radio--horizontal {
  margin-right: 10px;
}
.lab_totalincome,
.lab_tips {
  display: inline-block;
  color: #2973ff;
  padding-top: 3px;
  text-align: right;
}
.lab_tips {
  color: #ff8d00;
  text-align: left;
}
.lab_node {
  max-width: 160px;
}
</style>