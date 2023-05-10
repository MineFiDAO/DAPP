var ethers = require('ethers')
import Vue from 'vue'
import store from '@/store'
import vui from '@/uicommon'
import req from "@/utils/request"
import setting from '@/settings'

function getLoginToken(waddr) {
    return new Promise((r) => {
        vui.showLoading()
        req({
            url: '/user/Wallet/captcha',
            method: 'get',
            params: {
                walletAddr: waddr
            },
        }).then((res) => {
            console.log(res)
            vui.hideLoading()
            if (r) {
                r(res.data.nonce)
            }
        })
    })
}

function reqlogin(waddr, sign, nonce) {
    return new Promise((r) => {
        vui.showLoading()
        req({
            url: '/user/Wallet/login',
            method: 'post',
            data: {
                walletAddr: waddr,
                wid: vui.tgUID()
            }
        })
            .then((res) => {
                console.log(res)
                if (res.code == 1) {
                    vui.hideLoading()
                    // var d = { cer: res.data, addr: waddr, wid: res.wid }
                    var d = { addr: waddr, wid: res.wid }
                    store.commit('user/USER_SIGNIN', d)
                    Vue.prototype.bus.$emit('updateuserinfo')
                    if (r) {
                        r()
                    }
                }
            })
    })
}

function getSignData(token) {
    var plain = token;
    var msg = ethers.utils.hexValue(ethers.utils.toUtf8Bytes(plain))
    var hash = ethers.utils.id("\x19Ethereum Signed Message:\n" + plain.length + plain);
    return { msg, hash }
}

function getChain() {
    var bscChain = {
        chainName: 'Filecoin - Hyperspace testnet',
        chainId: ethers.utils.hexValue(3141),
        nativeCurrency: {
            name: 'TFIL',
            symbol: 'TFIL',
            decimals: 18,
        },
        rpcUrls: [
            'https://rpc.ankr.com/filecoin_testnet',
        ] /* ... */,
        blockExplorerUrls: ['https://hyperspace.filfox.info/en']
    }

    var rinkChain = {
        chainName: 'Filecoin - Hyperspace testnet',
        chainId: ethers.utils.hexValue(3141),
        nativeCurrency: {
            name: 'TFIL',
            symbol: 'TFIL',
            decimals: 18,
        },
        rpcUrls: [
            'https://rpc.ankr.com/filecoin_testnet',
        ] /* ... */,
        blockExplorerUrls: ['https://hyperspace.filfox.info/en']
    }

    // var testBSCChain = {
    //     chainId: ethers.utils.hexValue(97),
    //     chainName: 'BSCTest',
    //     rpcUrls: [
    //         'https://data-seed-prebsc-1-s1.binance.org:8545',
    //     ] /* ... */ ,
    //     blockExplorerUrls: ['https://explorer.binance.org/smart-testnet']
    // }

    var curChain = rinkChain
    if (setting.isOnline) {
        curChain = bscChain
    }
    return curChain
}

export {
    getLoginToken,
    reqlogin,
    getSignData,
    getChain
}