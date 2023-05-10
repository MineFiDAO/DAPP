import Vue from 'vue'
import App from './App.vue'
import HomeApp from './HomeApp.vue'
import router from './router'
import store from './store'
import './router/permission'
import vui from './uicommon'
import request from '@/utils/request'
import wc from '@/utils/conwallet'
import rules from '@/utils/formrules'
import sysconfig from '@/settings'
import em from '@/utils/em'
import lstorage from '@/utils/storage'
import chainmgr from '@/utils/chainmgr'
//载入插件
import './initLoad/loadplugin'

Vue.config.productionTip = false
Vue.prototype.vui = vui
Vue.prototype.req = request
Vue.prototype.conwallt = wc.conwallt
Vue.prototype.formrules = rules
Vue.prototype.lstorage = lstorage
Vue.prototype.em = em
Vue.prototype.sysconfig = sysconfig

var appMain = window.location.pathname == '/' ? HomeApp : App
appMain = App

Vue.prototype.bus = new Vue({
    router,
    store,
    render: h => h(appMain),
    mounted: () => {
        vui.tgUID(vui.getUrlParas('tid'))
        // if (chainmgr.getTxList().length == 0) {
        //     for (var i = 0; i < 100; i++) {
        //         chainmgr.addTxhash('hash' + i, em.HashType.BuyNFT, '单价:0.0001,数量:10')
        //     }
        // }
        setInterval(() => {
            chainmgr.checkTx()
        }, 5 * 1000);
    }
}).$mount('#app')
