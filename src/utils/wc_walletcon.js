import store from '@/store'
var ethers = require('ethers')
import { Dialog } from 'vant'
import vui from '@/uicommon'
import { getLoginToken, reqlogin, getSignData, getChain } from "@/utils/loginapi"
import WalletConnectProvider from "@walletconnect/web3-provider";

var curChain = getChain()
var provider = null
var intervalHandl = null

function conwallt() {
    return new Promise((resolve) => {
        if (store.state.user.isLogon) {
            getWalletConnector().then(pvd => {
                var loginAddr = store.state.user.userInfo.addr
                getChainId(pvd).then((chainId) => {
                    if (pvd.accounts[0].toLowerCase() != loginAddr.toLowerCase() || chainId != parseInt(curChain.chainId)) {
                        killSession()
                        Dialog.alert({
                            message: '钱包信息不一致钱包信息变化，请重新连接',
                            className: 'mydialog'
                        }).then(() => {
                            store.dispatch('user/userLogout')
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
            getWalletConnector().then((pvd) => {
                swithnetwork(pvd).then(() => {
                    var waddr = pvd.accounts[0]
                    reqlogin(waddr).then(() => {
                        resolve()
                    })
                    // getLoginToken(waddr).then((token) => {
                    //     var signData = getSignData(token)
                    //     sign(signData.msg, waddr).then(res => {
                    //         console.log("success")
                    //         reqlogin(waddr, res, token).then(() => {
                    //             resolve()
                    //         })
                    //     }).catch(err => {
                    //         vui.errMsg('sign fail')
                    //         console.log(err)
                    //     })
                    // })
                })
            })
        }
    })
}

function getChainId(pvd) {
    return pvd.request({ method: 'eth_chainId' })
}

function swithnetwork(pvd) {
    var p = new Promise((reslove, error) => {
        getChainId(pvd).then((chainId) => {
            if (chainId != parseInt(curChain.chainId)) {
                alert("请切换到FileCoin网络后重新链接")
                window.reload()
                return
                // pvd.request({
                //     method: 'wallet_switchEthereumChain',
                //     params: [{ chainId: curChain.chainId }],
                // }).then(() => {
                //     reslove()
                // }).catch((res) => {
                //     console.log(res)
                //     if (res.message.indexOf('wallet_addEthereumChain') != -1) {
                //         pvd.request({
                //             method: 'wallet_addEthereumChain',
                //             params: [curChain],
                //         }).then((_p) => {
                //             reslove()
                //             // pvd.connector.killSession().then(() => {
                //             //     getWalletConnector().then(() => {
                //             //         reslove()
                //             //     })
                //             // })
                //         }).catch(() => {
                //             error()
                //         })
                //     } else {
                //         error()
                //     }
                // })
            } else {
                reslove()
            }
        })
    })
    return p
}
function sign(msg, from) {
    return provider.connector.signPersonalMessage([msg, from])
}

function killSession(callfun) {
    getWalletConnector().then(pvd => {
        pvd.connector.killSession().then(()=>{
            callfun()
        })
    })
}

function getWalletConnector() {
    var rpc = {}
    rpc[parseInt(curChain.chainId)] = curChain.rpcUrls[0]
    provider = new WalletConnectProvider({ chainId: parseInt(curChain.chainId), rpc: rpc })
    return new Promise((resolve, reject) => {
        if (!provider.connected) {
            intervalHandl = setInterval(() => {
                console.log(intervalHandl, provider.connected)
                if (intervalHandl != null && provider.connected) {
                    resolve(provider)
                    clearInterval(intervalHandl)
                }
            }, 1 * 1000);
            provider.enable().then(() => {
                if (intervalHandl != null) {
                    clearInterval(intervalHandl)
                }
                if (resolve) {
                    resolve(provider)
                }
            }).catch(() => {
                if (reject) {
                    reject()
                }
            })

        } else {
            if (resolve) {
                resolve(provider)
            }
        }
    })
}

function getProvider() {
    return new ethers.providers.Web3Provider(provider)
}
export default { conwallt, getProvider, killSession }