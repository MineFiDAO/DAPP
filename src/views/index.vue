<template>
  <div class="main">
    <div class="container">
      <div style="background-color: #fff; padding-bottom: 80px">
        <img class="pic logopic" src="@/assets/images/logo.png" />
        <img
          v-if="!$store.state.user.isLogon"
          @click="conwallt()"
          class="pic metamaskico"
          src="@/assets/images/wallet1.png"
        />
        <span
          @click="$router.push('/fund')"
          class="addr"
          v-if="$store.state.user.isLogon"
        >Address:{{ formatAddr($store.state.user.userInfo.addr) }}</span>
      </div>
      <div style="text-align:center; font-size: 18px;margin:10px 0px;">
        <a
          class="link"
          href="https://bbs.titannet.io/forum.php?mod=viewthread&tid=98"
          target="_blank"
        >MineFi平台使用教程，可以领币参与测试网测试</a>
      </div>
      <div class="blockitem" ref="video_div" style="background-color: #000000">
        <iframe
          ref="video_iframe"
          style="width: 100%"
          src="https://www.youtube.com/embed/YD9Zr2Mpc0U"
          title="Titan MineFi Platform"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>

      <div class="blockitem" style="line-height: 22px;padding: 10px;">
        <div class="index_title">介绍</div>
        <div
          style="padding-bottom: 3px;"
        >MineFi是一个使用FVM智能合约构建的去中心化服务平台，专注于推动更多的人参与到为Filecoin提供存储服务中，并提供更加便捷、高效、安全和高收益的Filecoin代币奖励体验。</div>

        <div class="index_title" style="margin-top: 20px;">特点/优势</div>
        <div style="padding-bottom: 3px;">
          与传统的矿业投资方式相比，MineFi通过智能合约实现了真正透明可信的节点抵押，本质性的保障了Filecoin投资安全问题，抵押节点的价值高于算力产品的价值，透明可查，没有超卖风险。智能合约掌控节点收益的分配权，并可以提前终止存储节点扇区，取回并归还投资者的质押币，进一步保障资金安全。同时算力产品由存储服务商直销，没有中间商，将为投资者带来更多的利润。此外，MineFi实现了算力Token化，持有算力NFT的用户可以随时在任何FVM生态下的NFT交易所变现，使得资金具有强大的流动性。
          <br />
        </div>

        <div class="index_title" style="margin-top: 20px;">愿景/目标</div>
        <div>MineFi致力于共建Filecoin生态，推动整个行业尽早采用真实抵押的合约安全方案。作为去中心化服务平台，MineFi将通过开源代码和不断推进，帮助Filecoin存储服务商直销的产品提高安全和可信度。这样，更多的投资人可以放心参与Filecoin生态的建设，并质押FIL来支持生态发展。随着更多的投资人参与，FIL生态将蓬勃发展，吸引更多来自web3.0世界的质押，推动整个行业向前发展。</div>
      </div>
      <div class style="background-color: #fff;text-align: center; ;">
        <img class="pic" style="width:30%;" src="@/assets/images/fil-comp.png" />
      </div>

      <div class="blockitem" style="line-height: 22px; padding: 10px">
        <div class="index_title">FAQ</div>
        <van-collapse v-model="activeNames">
          <van-collapse-item
            v-for="(m,index) in qlist"
            :title="m.q"
            :name="index"
            :key="index"
          >{{ m.a }}</van-collapse-item>
        </van-collapse>
      </div>

      <div class="blockitem" style="background-color: black">
        <a href="https://bbs.titannet.io" target="_blank">
          <img class="pic" src="@/assets/images/index_qr.jpg" />
        </a>
      </div>

      <div style="margin: 30px; font-size: 25px">
        <a
          href="http://bbs.titannet.io/forum.php?mod=viewthread&tid=42"
          target="_blank"
        >参与提问并查询最新的FAQ</a>
      </div>
      <br />
      <br />
      <br />
      <br />
    </div>
  </div>
</template>

<script >
import Vue from 'vue';
import { Collapse, CollapseItem } from 'vant';


export default {
  components: {

  },
  mounted() {
    this.$nextTick(() => {
      var h = this.$refs.video_div.offsetWidth * 0.5626
      this.$refs.video_iframe.style.height = h + 'px'
    })
  },
  created() {

  },
  computed: {

  },
  data() {

    var qlist = [
      { q: "Q: MineFi是什么", a: "A: MineFi是一个基于FVM智能合约，让普通人能为Filecoin提供存储服务，并获得Filecoin代币奖励的去中心化服务平台。产品由存储服务商直销，没有中间商，旨在为用户提供便捷、高效、安全和更高收益的投资体验。" },
      { q: "Q: 我需要什么样的技术知识才能参与MineFi？", a: "A: 您不需要过多的技术知识，只需要理解存储质押的基本概念，并购买相应的算力凭证即可。MineFi的智能合约将自动管理您的节点运营和收益分配。" },
      { q: "Q: 如何保障我的资金安全？", a: "A: MineFi的智能合约直接与Filecoin存储节点绑定，可以接管节点的收益分配权和最高控制权，确保可以保障投资者的收益和质押币安全。所有收益都会进入智能合约管控的地址，公开透明链上可查，并且在极端情况下还能触发紧急预案提前终止存储节点扇区，取回并归还您的质押币，从而保证资金的安全性。" },
      { q: "Q: 如果服务器遇到极端情况，拿回质押币的流程？", a: "A：当单个节点发生故障且3日未修复（如算力归零）时，将出现投票按钮，由社群用户投票自治决定是否立刻终止扇区，并由智能合约授予社群指定操作员worker权限（可手动终止所有扇区），终止扇区后用户可凭MineFi NFT依据平台规则取回质押币 ；若在节点故障3日后的投票中用户未决定终止扇区，则智能合约将于第7日自动终止，用户可凭MineFi NFT依据平台规则取回质押币。社群也可以投票延长自动终止日期。" },
      { q: "Q: 如何体现MineFi的强流动性？", a: "A：MineFi通过智能合约实现了算力Token化,当您在MineFi购买算力时,合约会实时生成对应的NFT,凭此NFT即可领取算力收益和质押币。谁持有这个NFT,其所附带的收益权就归谁。因此用户可以通过交易算力NFT,将收益权提前售卖变现,使得投入的资金具有强大的流动性。" },
      { q: "Q: MineFi如何保障我的随时变现需求？", a: "A: MineFi实现了算力Token化，当您购买算力时，合约会实时生成对应的NFT，凭此NFT即可领取算力收益和质押币。持有NFT的用户可以通过交易算力NFT，将收益权提前售卖变现，使得资金具有强大的流动性。" },
      { q: "Q: MineFi的年化收益率是多少？", a: "A: MineFi的年化收益率至少20%起，由存储服务商设定，相比于Lido上的Ethereum（4.4% APY）、Polygon（6.3% APY）和Solana（5.9% APY）更高。" },
      { q: "Q: 我需要付出什么成本来参与MineFi？", a: "A: 您需要购买相应的算力凭证，没有其他额外的费用或成本。" },
      { q: "Q: 如何购买MineFi的算力凭证NFT？", a: "A: 您可以在MineFi官网上登录小狐狸钱包，在产品销售页选择产品，并支付Filecoin来购买算力凭证NFT。" },
      { q: "Q: MineFi与传统存储质押投资方案有何区别？", a: "A: MineFi使用智能合约实现了去中心化，为投资者提供更安全、便捷、灵活和高收益的投资体验，相比于传统的矿业投资方式，MineFi将为投资者带来更多的机会和价值。具体一些来说，除了相信售卖产品的存储服务商品牌保障以外，MineFi还通过智能合约的方式，实现了真正透明可信的节点抵押，本质性的保障了Filecoin投资安全问题。风险的降低，将吸引更多的投资者，质押通缩更多的Filecoin，提升价值共识。" }
    ]

    return {
      activeNames: [''],
      qlist: qlist
    }
  },
  methods: {
    formatAddr(addr) {
      return addr.substr(0, 5) + "***" + addr.substr(addr.length - 4, 4)
    },
    showFAQ(idx) {
      Vue.set(this.showdata, idx, !this.showdata[idx]);
    }
  }
}
</script>
<style src="@/assets/css/reset.css"></style>
<style src="@/assets/css/index.css" scoped></style>
<style scoped>
.blockitem {
  padding: 10px 10px;
  margin-bottom: 20px;
  border: 1px solid #f1f1f1;
  border-radius: 8px;
}
.blockitem .pic {
  width: 100%;
  font-size: 0;
}
.logopic {
  width: 20%;
  margin-left: auto;
  margin-right: auto;
  display: inline;
  float: left;
}
.metamaskico {
  width: 25px;
  margin-left: auto;
  display: inline;
  margin-right: 0px;
  float: right;
}
.addr {
  display: inline;
  margin-right: 0px;
  float: right;
  margin-left: auto;
  line-height: 30px;
  color: #0095ff;
  text-decoration-line: underline;
  cursor: pointer;
}
.link {
  color: #2973ff;
  text-decoration: underline;
}
</style>
