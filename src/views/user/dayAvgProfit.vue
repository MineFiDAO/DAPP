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
      <div class="my-table">
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
              <th class="tb-value">24h平均收益</th>
            </template>
            <template slot="bodyrow" slot-scope="scope">
              <tr v-for="(row,index) in scope.tabledata" :key="index">
                <td class="tb-value">{{vui.formatDateTime(row.StatTime, "YYYY-MM-DD")}}</td>
                <td class="tb-value num">{{ vui.toFil(row.AvgProfit) }}</td>
              </tr>
            </template>
          </MyTb>
        </div>
      </div>
    </div>
  </div>
</template>
        <script scoped>
export default {
  mounted() {
    this.$refs.mytblist.show()
  },
  created() {
  },
  computed: {

  },
  data() {
    return {
      title: '24小时平均收益',
      nftID: null,
      tbconfig: [100, 80],
      beginTime: null,
      endTime: null,
      tbHeight: document.body.clientHeight - 146 - 20,
    }
  },
  methods: {
    getData(index, size) {
      return new Promise((r, e) => {
        this.req({
          url: '/user/wallet/GetDayAvgProfit',
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
          r({ data: d })
        })
      })
    }
  }
}
        </script>
        
      <style src="@/assets/css/reset.css" scoped></style>
      <style src="@/assets/css/fund.css" scoped></style>
      <style src="@/assets/css/extend.css" scoped></style>
  
  <style lang="less" scoped>
.my-table {
  top: 0;
}
.tb-value {
  padding: 10px 0;
}
</style>