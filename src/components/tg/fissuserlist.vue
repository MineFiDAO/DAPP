<template>
  <div class="my-table-content" v-show="showui">
    <MyTb :tbconfig="tbconfig" :loadData="getData" :isPage="true" ref="mytblist" :height="tbheight">
      <template slot="head">
        <th class="tb-value">钱包地址</th>
        <th class="tb-value">消费FIL</th>
        <th class="tb-value">创建时间</th>
      </template>
      <template slot="body" slot-scope="scope">
        <td class="tb-value addrsize">{{scope.row.Address}}</td>
        <td class="tb-value">{{ vui.toFil(scope.row.TotalPayAmount) }}</td>
        <td class="tb-value">{{vui.formatDateTime(scope.row.CreateTime, "YYYY-MM-DD HH:mm")}}</td>
      </template>
    </MyTb>
  </div>
</template>
  <script>

export default ({
  created() {
  },
  computed: {
    tbWidth() {
      return this.vui.sum(this.columnconfig) + 50
    }
  },
  data() {
    return {
      showui: false,
      tbconfig: [270, 80, 150],
      tbheight: this.$parent.tbheight
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
    getData(index, pageSize) {
      return new Promise((r, e) => {
        this.req({
          url: '/user/fiss/GetFissUserList',
          method: 'get',
          params: {
            pageIndex: index,
            pageSize: pageSize
          }
        })
          .then(res => {
            var d = {
              total: res.TotalCount,
              list: res.PageData
            }
            r({ data: d })
          })
      })
    },
  }
})
  </script>
  <style src="@/assets/css/reset.css" scoped></style>
  <style src="@/assets/css/fund.css" scoped></style>
  <style src="@/assets/css/extend.css" scoped></style>
  <style lang="less" scoped>
@tbheight: 450px;
.tb-group {
  max-height: @tbheight;
}
.tb-list {
  min-height: @tbheight;
}
.loadingtdlist {
  height: @tbheight - 46;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>