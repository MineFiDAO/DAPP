var ethers = require('ethers')
import { Dialog } from 'vant'
import store from '@/store'

import vui from '@/uicommon'
import { getLoginToken, reqlogin, getSignData, getChain } from "@/utils/loginapi"


var curChain = getChain()

function conwallt() {
    return new Promise((resolve) => {
        if (!window.ethereum || !window.ethereum.isMetaMask) {
            alert("请安装MetaMask钱包后再登录")
            return
        } else {
            if (store.state.user.isLogon) {
                //在登录的情况下，检查当前账号和钱包连接账号是否一致，同时主网的网络是否正确
                getWalletInfo().then((waddr) => {
                    var loginAddr = store.state.user.userInfo.addr
                    window.ethereum.request({ method: 'eth_chainId' }).then((chainId) => {
                        if (waddr.toLowerCase() != loginAddr.toLowerCase() || chainId != curChain.chainId) {
                            store.dispatch('user/userLogout')
                            Dialog.alert({
                                message: '钱包信息不一致钱包信息变化，请重新连接',
                                className: 'mydialog'
                            }).then(() => {
                                setTimeout(() => {
                                    window.location.reload()
                                }, 1 * 1000);
                            })
                        } else {
                            resolve()
                        }
                    })
                })
            } else {
                swithnetwork().then(() => {
                    getWalletInfo().then((waddr) => {
                        reqlogin(waddr).then(() => {
                            resolve()
                        })                        
                    })
                })
            }
        }
    });
}

function swithnetwork() {
    var p = new Promise((reslove, error) => {
        if (window.ethereum.networkVersion != parseInt(curChain.chainId)) {
            window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: curChain.chainId }],
            }).then(() => {
                reslove()
            }).catch((res) => {
                console.log(res)
                if (res && res.code == 4902) {
                    window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [curChain],
                    }).then(() => {
                        reslove()
                    })
                } else {
                    error()
                }
            })
        } else {
            reslove()
        }
    })
    return p
}

function getWalletInfo() {
    var pvd = getProvider()
    return new Promise((r, e) => {
        pvd.send('eth_requestAccounts', []).then(accounts => {
            if (accounts && accounts.length > 0) {
                r(accounts[0])
            }
        }).catch(e)
    })
}

function sign(msg, from) {
    return window.ethereum.request({
        method: 'personal_sign',
        params: [msg, from]
    })
}

function getProvider() {
    return new ethers.providers.Web3Provider(window.ethereum)
}


export default { conwallt, getProvider }