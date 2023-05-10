<template>
  <div class="tb-group" :style="'max-height:'+height+'px'">
    <div class="tb-list" ref="tblist" :style="'max-height:'+height+'px'">
      <table
        cellspacing="0"
        cellpadding="0"
        border="0"
        class="tb-item tb-title-th"
        :style="'min-width:'+tbWidth+'px;'"
        @click.stop
      >
        <colgroup>
          <col v-for="(c,index) in columnconfig" :key="index" :width="c" />
        </colgroup>
        <thead>
          <tr>
            <slot name="head"></slot>
          </tr>
        </thead>
      </table>
      <div
        @scroll="onScroll"
        ref="nftgroup"
        class="loadingtdlist"
        :style="'min-width:'+tbWidth+'px;max-height:'+(height-46)+'px'"
      >
        <table
          cellspacing="0"
          cellpadding="0"
          border="0"
          class="tb-item"
          :style="'min-width:'+tbWidth+'px;'"
        >
          <colgroup>
            <col v-for="(c,index) in columnconfig" :key="index" :width="c" />
          </colgroup>
          <tbody>
            <slot name="bodyrow" :colconfig="columnconfig" :tabledata="tabledata"></slot>
            <tr v-for="m in tabledata" :key="m.hash">
              <slot name="body" :row="m" :colconfig="columnconfig"></slot>
            </tr>
            <tr>
              <td :colspan="tbconfig.length">
                <div class="loadlisttips" v-show="!finished && !isReqErr">
                  <van-loading />加载中……
                </div>
                <div class="loadlisttips" v-show="finished">没有更多数据</div>
                <div class="loadlisttips" v-show="isReqErr" @click="loadRecord">加载失败，点击重试</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
    <script>

export default ({
  mounted() {
    window.onresize = () => {
      this.updateTableConfig()
    }
  },
  props: {
    isPage: {},
    tbconfig: {},
    loadData: {
      type: Function,
      default: () => { }
    },
    height: {
      type: Number,
      default: 450
    },
    pageSize: {
      type: Number,
      default: 50
    },
    timeout: {
      type: Number,
      default: 30
    },
    isLoadingAll: {
      type: Boolean,
      default: false
    }
  },
  created() {
  },
  computed: {
  },
  data() {
    return {
      finished: false,
      loading: false,
      pageTotal: 0,
      pageIndex: 1,
      tabledata: [],
      txlist: [],
      tbWidth: 0,
      columnconfig: {},
      isReqErr: false,
      reqID: 0,
      timeoutHand: null
    }
  },
  methods: {
    hide() {
      this.finished = false
      this.loading = false
      this.pageTotal = 0
      this.pageIndex = 1
      this.tabledata = []
    },
    show() {
      this.hide()
      this.vui.showLoadingforever()
      this.loadRecord()
      this.$nextTick(() => {
        this.updateTableConfig()
      })
    },
    changeData(data) {
      this.hide()
      this.vui.showLoadingforever()
      var sel = this.$refs.nftgroup
      sel.scrollTop = 0
      this.$nextTick(() => {
        this.updateTableConfig()
      })
      return new Promise((r, e) => {
        setTimeout(() => {
          this.tabledata = data
          this.vui.hideLoading()
          r()
        }, 100)
      })
    },
    setFinish() {
      this.loading = false
      this.finished = true
      this.isReqErr = false
    },
    checkScrollIsBottom() {
      var sel = this.$refs.nftgroup
      var a = sel.scrollHeight
      var b = sel.clientHeight
      var c = sel.scrollTop

      //判断是否已经滚动底部
      if (!this.isReqErr && !this.isLoadingAll && b + c >= a - 50 && !this.loading && !this.finished) {
        return true
      } else {
        return false
      }
    },
    onScroll() {
      //判断是否已经滚动底部
      if (this.checkScrollIsBottom()) {
        this.loading = true
        this.loadRecord()
      }
    },
    setReqErr() {
      this.isReqErr = true
      this.reqID += 1
      console.log('setReqErr change reqid', this.reqID, this.isLoadingAll)
      this.vui.hideLoading()
      if (this.isLoadingAll) {
        this.loadRecord()
      }
    },
    loadRecord() {
      var p = null
      this.loading = true
      this.isReqErr = false
      this.reqID += 1
      console.log('loadrecord change reqid', this.reqID)

      if (this.timeoutHand) {
        clearTimeout(this.timeoutHand)
        this.timeoutHand = null
      }
      this.timeoutHand = setTimeout(() => {
        console.log('超时计算结束：', new Date().getTime())
        this.setReqErr()
      }, this.timeout * 1000)
      console.log('超时计算开始：', new Date().getTime())
      if (this.isPage) {
        p = this.loadData(this.pageIndex, this.pageSize)
      } else {
        p = this.loadData()
      }
      var rid = this.reqID
      p.then(res => {
        if (this.timeoutHand) {
          clearTimeout(this.timeoutHand)
          this.timeoutHand = null
        }
        //如果这一次请求ID与当前记录的请求ID不一致，说明这些请求已经失效，不做任何处理
        if (rid != this.reqID) {
          return
        }
        var d = res.data
        console.log(res)
        this.pageTotal = d.total
        this.tabledata = this.tabledata.concat(d.list)
        var curTotal = this.pageSize * this.pageIndex
        console.log('-----------this.isPage , curTotal , d.total', this.isPage, curTotal, d.total)
        if (!this.isPage || curTotal >= d.total) {
          console.log("全部加载完成")
          this.finished = true
        }

        this.loading = false
        this.vui.hideLoading()
        console.log('---finished,isLoadingAll', this.finished, this.isLoadingAll)
        if (!this.finished && this.isLoadingAll) {
          this.loadRecord()
        }
        this.pageIndex += 1

        setTimeout(() => {
          if (rid == this.reqID) {
            this.onScroll()
          }
        }, 500)
      }).catch(() => {
        clearTimeout(this.timeoutHand)
        this.setReqErr()
      })
    },
    initTbConfig() {
      for (var i = 0; i < this.tbconfig.length; i++) {
        this.columnconfig[i.toString()] = this.tbconfig[i]
      }
    },
    updateTableConfig() {
      var w = this.$refs.tblist.offsetWidth
      var sumW = this.vui.sum(this.tbconfig)
      if (w > sumW) {
        var onew = w / sumW
        for (var i = 0; i < this.tbconfig.length; i++) {
          this.columnconfig[i.toString()] = this.tbconfig[i] * onew
        }
      } else {
        this.initTbConfig()
      }
      this.tbWidth = 0
      for (var k in this.columnconfig) {
        this.tbWidth += this.columnconfig[k]
      }

    }
  }
})
    </script>
    <style src="@/assets/css/reset.css" scoped></style>
    <style src="@/assets/css/fund.css" scoped></style>
    <style src="@/assets/css/extend.css" scoped></style>
    <style lang="less" scoped>
.loadingtdlist {
  overflow-y: auto;
  overflow-x: hidden;
}
</style>