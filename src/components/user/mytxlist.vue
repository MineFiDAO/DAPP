<template>
  <div class="my-table-content" v-show="showui">
    <MyTb
      :tbconfig="tbconfig"
      :loadData="getData"
      :isPage="true"
      ref="mytblist"
      :height="tbHeight"
      :pageSize="100"
    >
      <template slot="head">
        <th class="tb-value">操作类型</th>
        <th class="tb-value">说明</th>
        <th class="tb-value">状态</th>
        <th class="tb-value">节点名称</th>
        <th class="tb-value">时间</th>
      </template>
      <template slot="body" slot-scope="scope">
        <td class="tb-value">{{ em.HashType_em[scope.row.type] }}</td>
        <td class="tb-value">
          <a target="_blank" :href="vui.getCTxUrl(scope.row.hash)">{{ scope.row.data.memo }}</a>
        </td>
        <td class="tb-value">{{ em.HashStatus_em[scope.row.status] }}</td>
        <td class="tb-value">{{ scope.row.data.title }}</td>
        <td class="tb-value">{{vui.formatDateTime(scope.row.time, "YYYY-MM-DD HH:mm")}}</td>
      </template>
    </MyTb>
  </div>
</template>
<script>

import chainmgr from '@/utils/chainmgr'
export default ({
  mounted() {
    this.bus.$on("HashTxListChange", () => {
      if (this.showui) {
        this.show()
      }
    });
  },
  components: {

  },
  created() {

  },
  beforeDestroy() {
    this.bus.$off("HashTxListChange")
  },
  computed: {
  },
  data() {
    return {
      showui: false,
      txlist: [],
      tbHeight: this.$parent.tbHeight,
      tbconfig: [80, 180, 80, 100, 150]
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
      this.txlist = chainmgr.getTxList().sort((a, b) => b.time - a.time)
      this.$refs.mytblist.show()
    },
    getData(index, size) {
      return new Promise((r, e) => {
        var d = {
          total: this.txlist.length,
          list: []
        }

        d.list = this.vui.getAryPage(this.txlist, index, size)
        // var startIndex = (index - 1) * size
        // for (var i = startIndex; i < startIndex + size - 1 && i < d.total; i++) {
        //   d.list.push(this.txlist[i])
        // }
        setTimeout(() => {
          r({ data: d })
        }, 500)
      })
    },
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
  padding: 10px 0;
}
</style>