<template>
  <div class="my-table-content" v-show="showui">
    <MyTb
      :tbconfig="[150, 60, 80, 150]"
      :loadData="getData"
      :isPage="true"
      ref="mytblist"
      :height="tbheight"
    >
      <template slot="head">
        <th class="tb-value">时间</th>
        <th class="tb-value">类型</th>
        <th class="tb-value">金额</th>
        <th class="tb-value">备注</th>
      </template>
      <template slot="body" slot-scope="scope">
        <td class="tb-value">{{vui.formatDateTime(scope.row.CreateTime, "YYYY-MM-DD HH:mm")}}</td>
        <td class="tb-value">{{ em.FissMoneyType_em[scope.row.TypeID.toString()] }}</td>
        <td class="tb-value">{{ vui.toFil(scope.row.Amount) }}</td>
        <td class="tb-value">{{ scope.row.Memo }}</td>
      </template>
    </MyTb>
  </div>
</template>
  <script>

export default ({
  mounted() {
  },
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
          url: '/user/fiss/GetFissMoneyLog',
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
    }
  }
})
  </script>
  <style src="@/assets/css/reset.css" scoped></style>
  <style src="@/assets/css/fund.css" scoped></style>
  <style src="@/assets/css/extend.css" scoped></style>
  <style lang="less" scoped>
</style>