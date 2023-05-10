import store from '@/store'
import wc_bitkeep from './wc_bitkeep'
import wc_metamask from './wc_metamask'
import wc_tp from './wc_tp'
import wc_walletcon from './wc_walletcon'
import vui from '@/uicommon'
var ethers = require('ethers')

var curWalletCon = null
var loginFinishCall = null

function conwallt(_loginFinishCall) {
    loginFinishCall = _loginFinishCall || null
    if (store.state.user.isLogon) {
        walletcon(store.state.user.wctype)
    } else {
        if (!vui.isMobile() || (vui.isMobile() && window.ethereum && window.ethereum.isMetaMask)) {
            walletcon('metamask', _loginFinishCall)
        } else if (vui.isMobile()) {
            walletcon('walletconnect', _loginFinishCall)
        }
    }
}

function walletcon(wctype, _loginFinishCall) {
    switch (wctype) {
        case 'metamask':
            curWalletCon = wc_metamask
            break;
        case "walletconnect":
            curWalletCon = wc_walletcon
            break;
        case "tp":
            curWalletCon = wc_tp
            break;
        case "bitkeep":
            curWalletCon = wc_bitkeep
            break;
    }
    if (_loginFinishCall) {
        loginFinishCall = _loginFinishCall
    }
    curWalletCon.conwallt().then(() => {
        store.commit('user/USER_SETWCTYPE', wctype)
        if (loginFinishCall) {
            loginFinishCall()
        }
    })
}

function getTransByHash(hash) {
    var pvd = curWalletCon.getProvider()
    return pvd.send('eth_getTransactionReceipt', [hash]);
}

function getProvider() {
    return curWalletCon.getProvider()
}

function killSession(callfun) {
    if (curWalletCon && curWalletCon.killSession) {
        curWalletCon.killSession(callfun)
    }
}

function getBalanceAmount() {
    var pv = getProvider()
    var addr = store.state.user.userInfo.addr
    return new Promise((r) => {
        pv.send('eth_getBalance', [addr, 'latest'])
            .then((amount) => {
                var balance = parseFloat(ethers.utils.formatUnits(amount, 0))
                r(balance)
            })
    })

}

function getTransResult(hash) {
    return new Promise((r, e) => {
        var time = 100
        var act = () => {
            if (time > 0) {
                getTransByHash(hash)
                    .then(tr => {
                        console.log('检查交易结果', tr)
                        if (tr) {
                            if (tr.status == '0x1') {
                                r(hash)
                            } else {
                                e()
                            }
                        } else {
                            setTimeout(() => {
                                act()
                            }, 1 * 1000);
                        }
                    })
                time--
            } else {
                e()
            }
        }
        act()
    })
}

var wc = { conwallt, getTransByHash, walletcon, getProvider, killSession, getTransResult, getBalanceAmount }
export default wc