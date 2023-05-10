<template>
  <div v-show="showui">
    <div class="my-table-content">
      <MyTb
        :tbconfig="tbconfig"
        :loadData="getData"
        :isPage="true"
        ref="mytblist"
        :height="tbHeight"
      >
        <template slot="head">
          <th class="tb-value">日期</th>
          <th class="tb-value">当日产出</th>
          <th class="tb-value">立即释放</th>
          <th class="tb-value">当日冻结</th>
          <th class="tb-value">当日线性释放</th>
        </template>
        <template slot="bodyrow" slot-scope="scope">
          <tr v-for="(row,index) in scope.tabledata" :key="index" @click="OpenProfitList(row)">
            <td class="tb-value">{{vui.formatDateTime(row.CreateTime, "YYYY-MM-DD")}}</td>
            <td class="tb-value">{{ vui.toFil(row.ReleaseToday) }}</td>
            <td class="tb-value">{{ vui.toFil(row.ReleaseNow) }}</td>
            <td class="tb-value">{{ vui.toFil(row.WaitRelease) }}</td>
            <td class="tb-value">{{ vui.toFil(row.ReleaseDelay) }}</td>
          </tr>
        </template>
      </MyTb>
    </div>
  </div>
</template>
  <script>

export default ({
  created() {
  },
  data() {
    return {
      showui: false,
      tbHeight: this.$parent.tbHeight,
      tbconfig: [100, 90, 90, 90, 100],
      nftID: null,
      title: ''
    }
  },
  methods: {
    hide() {
      this.showui = false
      if (this.$refs.mytblist) {
        this.$refs.mytblist.hide()
      }
    },
    show() {
      this.showui = true
      this.$refs.mytblist.show()
    },
    getData(index, size) {
      return new Promise((r, e) => {
        this.req({
          url: '/user/wallet/GetNftProfitLogStat',
          method: 'get',
          params: {
            pageIndex: index,
            pageSize: size,
            nftID: this.nftID
          }
        }).then(res => {
          var d = {
            total: res.TotalCount,
            list: res.PageData
          }
          r({ data: d })
        })
      })
    },
    OpenProfitList(m) {
      var title = this.vui.strFormat('{0} 收益明细', this.vui.formatDateTime(m.CreateTime, 'YYYY-MM-DD'))
      var path = this.vui.strFormat('/user/myprofitlog/time/{0}/{1}', this.vui.formatDateTime(m.CreateTime, 'YYYY-MM-DD'), title)
      this.$router.push(path)
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
  padding: 10px 2px;
}
</style>
  