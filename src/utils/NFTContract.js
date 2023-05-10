import nftABI from '@/abi/NFT'
import wc from '@/utils/conwallet'
import store from '@/store'
import chainmgr from '@/utils/chainmgr'
import em from '@/utils/em'
import vui from '@/uicommon'
var ethers = require('ethers')
var gasLimit = ethers.utils.parseUnits((10000000000).toString(), 0)

function getContract(caddr) {
    var nftCAddr = caddr
    var provider = wc.getProvider()
    var signer = provider.getSigner()
    var c = new ethers.Contract(nftCAddr, nftABI, signer)
    return c
}

function getTransResult(presult) {
    return new Promise((r, e) => {
        presult.then(res => {
            var time = 100
            var _res = res
            var _r = r
            var act = () => {
                if (time > 0) {
                    wc.getTransByHash(_res.hash)
                        .then(tr => {
                            console.log('检查交易结果', _res.hash, tr)
                            if (tr) {
                                if (tr.status == '0x1') {
                                    _r(_res)
                                } else {
                                    e()
                                }
                            } else {
                                setTimeout(() => {
                                    act()
                                }, 1 * 1000);
                            }
                        }).catch(_err => {
                            setTimeout(() => {
                                act()
                            }, 5 * 1000);
                        })
                    time--
                } else {
                    e()
                }
            }
            act()
        }).catch((err) => {
            e(err)
        })
    })
}

function getPledgeAmount(caddr) {
    var c = getContract(caddr)
    return c.getPledgeAmount()
}

export function getRemainCount(caddr) {
    var c = getContract(caddr)
    return c.getRemainCount()
}

export function Mint(caddr, _unitPrice, _count, title) {
    return new Promise((r, e) => {
        var count = ethers.utils.hexValue(_count)
        var val = ethers.utils.parseUnits((_unitPrice * _count).toString(), "ether")
        //测试单价为0.001                    
        var c = getContract(caddr)
        c.mint(count, { value: val, gasLimit: gasLimit })
        .then((res) => {
            chainmgr.addTxhash(caddr, res.hash, em.HashType.BuyNFT, { memo: '单价:' + vui.toFil(_unitPrice) + '数量:' + _count, title: title })
            r(res.hash)
        }).catch(err => {
            console.log(err)
            e(err)
        })

        // var provider = wc.getProvider()
        // provider.getGasPrice().then(gasPrice => {
        //     var gp = ethers.utils.parseUnits((10000000).toString(), 0)
        //     c.mint(count, { value: val, gasPrice: gasPrice, gasLimit: gasLimit })
        //         .then((res) => {
        //             chainmgr.addTxhash(caddr, res.hash, em.HashType.BuyNFT, { memo: '单价:' + vui.toFil(_unitPrice) + '数量:' + _count, title: title })
        //             r(res.hash)
        //         }).catch(err => {
        //             console.log(err)
        //             e(err)
        //         })
        // })
    })
    // return getTransResult(getContract().transferMany(toAddr, tokenIDs))
}

export function queryIncome(caddr, numIds) {
    var c = getContract(caddr)
    return c.queryIncome(numIds)
}

export function queryHasWithdraw(caddr) {
    var c = getContract(caddr)
    return c.queryHasWithdraw()
}


export function withdraw(caddr, title, tokenNumIDs) {
    var c = getContract(caddr)
    return new Promise((r, e) => {
        var uAddr = store.state.user.userInfo.addr
        queryIncome(caddr, tokenNumIDs).then(income => {
            if (income.toBigInt() > 0) {
                var strIncome = vui.formatFil(income.toBigInt())
                c.withdraw(uAddr, tokenNumIDs, { gasLimit: gasLimit }).then((res) => {
                    chainmgr.addTxhash(caddr, res.hash, em.HashType.GetIncome, { memo: '领取收益:' + strIncome, title: title })
                    r(res)
                }).catch(e)
            } else {
                r()
            }

        }).catch(e)
    })
}

export function getViewData(caddr, minNum, count) {
    var c = getContract(caddr)
    return c.getViewData(minNum, count)
}
export function getMyViewData(caddr, numIds) {
    var c = getContract(caddr)
    return c.getViewDataEx(numIds)
}
export function getLastAllotConfirmTime(caddr) {
    var c = getContract(caddr)
    return c.getLastAllotConfirmTime()
}

export function auditIncomeData(caddr, title) {
    var req = new Promise((r, e) => {
        var c = getContract(caddr)
        c.auditIncomeData({ gasLimit: gasLimit })
            .then(res => {
                chainmgr.addTxhash(caddr, res.hash, em.HashType.AllotIncome, { memo: '发放收益', title: title })
                r(res)
            }).catch(e)
    })
    return getTransResult(req)
}

export function clearViewData(caddr, title) {
    var req = new Promise((r, e) => {
        var c = getContract(caddr)
        c.clearViewData({ gasLimit: gasLimit }).then(res => {
            chainmgr.addTxhash(caddr, res.hash, em.HashType.ClearIncome, { memo: '清除数据', title: title })
            r(res)
        }).catch(e)
    })
    return getTransResult(req)
}
export function getRansomRate(caddr) {
    var c = getContract(caddr)
    return c.getRansomRate()
}

export function ransomPledge(caddr, title, numids) {
    var req = new Promise((r, e) => {
        var c = getContract(caddr)
        var amount = 0
        c.queryRansomPledge(numids).then(_amount => {
            amount = _amount.toBigInt()
            var tips = vui.strFormat('赎回数量:{0}Fil', vui.formatFil(amount))
            var uAddr = store.state.user.userInfo.addr
            c.ransomPledge(uAddr, numids, { gasLimit: gasLimit }).then(res => {
                chainmgr.addTxhash(caddr, res.hash, em.HashType.RansomPledge, { memo: tips, title: title, numids: numids })
                r(res)
            }).catch(e)
        }).catch(e)
    })
    return req
}

export function getMinerId(caddr) {
    var c = getContract(caddr)
    return c.getMinerId()
}

export function getExceptionTerminateTime(caddr) {
    var c = getContract(caddr)
    return c.getExceptionTerminateTime()
}

export function getLastTotalIncome(caddr) {
    var c = getContract(caddr)
    return c.getLastTotalIncome()
}
export function getLastMaxNum(caddr) {
    var c = getContract(caddr)
    return c.getLastMaxNum()
}

export function queryRansomPledge(caddr, numIds) {
    var c = getContract(caddr)
    return c.queryRansomPledge(numIds)
}

export function getPledgeDatas(caddr, numbIDs) {
    var c = getContract(caddr)
    return c.getPledgeDatas(numbIDs)
}
export function getLastPledgeAuditTime(caddr) {
    var c = getContract(caddr)
    return c.getLastPledgeAuditTime()
}


export function clearLastTotalIncome(caddr, title, callfun) {
    var req = new Promise((r, e) => {
        var c = getContract(caddr)
        c.getLastTotalIncome().then(amount => {
            var total = amount.toBigInt()
            if (total > 0) {
                c.clearLastTotalIncome().then((res) => {
                    chainmgr.addTxhash(caddr, res.hash, em.HashType.ClearLastTotalIncome, { memo: '清零上传总金额', title: title })
                    r(res)
                }).catch(e)
            } else {
                vui.alert(title + "<br>上传总金额已经是零不需要清除")
            }
        }).catch(e)
    })
    getTransResult(req).then(() => {
        vui.alert(title + "<br>清零上传总金额成功")
        callfun()
    }).catch(() => {
        vui.alert(title + "<br>清零上传总金额失败")
    })
}

export function auditPledgeData(caddr, title) {
    var req = new Promise((r, e) => {
        var c = getContract(caddr)
        c.auditPledgeData().then((res) => {
            chainmgr.addTxhash(caddr, res.hash, em.HashType.AuditPledgeData, { memo: '审核上传退还质押币信息', title: title })
        })
    })
    return getTransResult(req)
}


export default {
    Mint, queryIncome, queryHasWithdraw, withdraw,
    getRemainCount, getViewData, getMyViewData, getLastAllotConfirmTime,
    auditIncomeData, clearViewData, ransomPledge, clearLastTotalIncome, auditPledgeData,
    getExceptionTerminateTime, getMinerId, getLastTotalIncome, getLastMaxNum, getRansomRate, getPledgeDatas, getLastPledgeAuditTime, queryRansomPledge
}