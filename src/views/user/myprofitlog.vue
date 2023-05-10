<template>
  <div class="main">
    <div class="container">
      <van-nav-bar
        :title="title"
        @click-left="$router.back()"
        left-text
        @nav-bar-arrow-size="20"
        left-arrow
      >
        <template #right>
          <a :href="vui.getDocUrl()" target="_blank">
            <van-icon class="helpIco" name="question-o" />
          </a>
        </template>
      </van-nav-bar>

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
              <th class="tb-value">
                NFT编号
                <br />名称
              </th>
              <th class="tb-value">当日产出</th>
              <th class="tb-value">立即释放</th>
              <th class="tb-value">当日冻结</th>
              <th class="tb-value">
                当日线性
                <br />释放
              </th>
              <th class="tb-value">状态</th>
              <th class="tb-value">运行天数</th>
            </template>
            <template slot="bodyrow" slot-scope="scope">
              <tr v-for="(row,index) in scope.tabledata" :key="index">
                <td class="tb-value">{{vui.formatDateTime(row.CreateTime, "YYYY-MM-DD")}}</td>
                <td class="tb-value">
                  <div class="txtmin">{{ row.NftID }}</div>
                  <div
                    class="ellipsistxt txtmin"
                    :style="'width:'+scope.colconfig[1]+'px'"
                  >{{ row.Nft.Node.Title }}</div>
                </td>
                <td class="tb-value num">{{ vui.toFil(row.ReleaseToday) }}</td>
                <td class="tb-value num">{{ vui.toFil(row.ReleaseNow) }}</td>
                <td class="tb-value num">{{ vui.toFil(row.WaitRelease) }}</td>
                <td class="tb-value num">{{ vui.toFil(row.ReleaseDelay) }}</td>
                <td
                  :class="'tb-value txtmin '+(row.Status!=em.ProfitStatus.Confirmed?'unget':'')"
                >{{ em.ProfitStatus_em[row.Status] }}</td>
                <td class="tb-value">{{ row.RunDays }}</td>
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
      title: '收益明细',
      nftID: null,
      tbconfig: [90, 100, 80, 80, 80, 80, 60, 40],
      beginTime: null,
      endTime: null,
      tbHeight: document.body.clientHeight - 146 - 20,
    }
  },
  methods: {
    getData(index, size) {
      return new Promise((r, e) => {
        this.req({
          url: '/user/wallet/GetNftProfitLog',
          method: 'get',
          params: {
            pageIndex: index,
            pageSize: size,
            nftID: this.nftID,
            beginTime: this.beginTime,
            endTime: this.endTime
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
.tb-value {
  padding: 10px 0;
}
.unget.tb-value {
  color: #2973ff;
}
</style>