var ethers = require('ethers')
import wc from '@/utils/conwallet'
import sg from '@/utils/storage'
import em from '@/utils/em'
import store from '@/store'
import Vue from 'vue'
import req from '@/utils/request'

var key = 'TxList'

function subTxhash(caddr, hash, type, data) {
    req({
        url: '/user/wallet/SumbitTransToCheck',
        method: 'get',
        params: {
            cAddress: caddr,
            txID: hash,
            cType: type,
            memo: JSON.stringify(data)
        }
    }).then(res => {
        console.log('提交交易检查：', res)
    })
}

function addTxhash(caddr, hash, type, data) {
    //如果是购买NFT需要提交服务端检查
    if ([em.HashType.RansomPledge, em.HashType.BuyNFT, em.HashType.AllotIncome, em.HashType.AuditPledgeData].indexOf(type) != -1) {
        subTxhash(caddr, hash, type, data)
    }

    var list = getTxList()
    list.push({
        caddr: caddr,
        hash: hash,
        type: type,
        data: data,
        status: em.HashStatus.Pending,
        checktimes: 0,
        time: new Date().getTime(),
        lastCheckTime: new Date().getTime()
    })
    while (list.length > 100) {
        list.shift()
    }
    sg.setItem(getKey(), list)
}

function updateTxhashStatus(hash, isSuccess) {
    var list = getTxList()
    var m = null
    for (var i = 0; i < list.length; i++) {
        var h = list[i]
        if (h.hash == hash) {
            h.status = isSuccess ? em.HashStatus.Success : em.HashStatus.Fail
            m = h
            break
        }
    }
    sg.setItem(getKey(), list)
    Vue.prototype.bus.$emit('HashTxListChange', m)
}

function saveTx(d) {
    var list = getTxList()
    for (var i = 0; i < list.length; i++) {
        var h = list[i]
        if (h.hash == d.hash) {
            list[i] = d
            break
        }
    }
    sg.setItem(getKey(), list)
}

function checkTx() {
    if (store.state.user.isLogon) {
        var list = getTxList()
        //处理最后检查时间超过10秒且状态在处理中的交易，根据最后处理时间升序排列
        var checklist = list.filter(h => h.status == em.HashStatus.Pending && h.lastCheckTime > 10 * 1000)
        if (checklist.length > 0) {
            var h = checklist.sort((a, b) => a.lastCheckTime - b.lastCheckTime)[0]
            var hash = h.hash
            h.isCheck = true
            h.lastCheckTime = new Date().getTime()
            h.checktimes += 1
            var checktimes = h.checktimes
            wc.conwallt(() => {
                wc.getTransByHash(hash).then((tr) => {

                    console.log('检查交易结果', hash, tr)
                    if (tr) {
                        if (tr.status == '0x1') {
                            updateTxhashStatus(hash, true)
                        } else {
                            updateTxhashStatus(hash, false)
                        }
                    } else {
                        if (checktimes > 1000) {
                            updateTxhashStatus(hash, false)
                        }
                    }
                })
            })
            saveTx(h)
        }
    }
}
function getKey() {
    return key + "_" + store.state.user.userInfo.addr
}
function getTxList() {
    var list = sg.getItem(getKey()) || []
    return list
}

function isExists(fun) {
    var list = getTxList()
    for (var i = 0; i < list.length; i++) {
        if (fun(list[i])) {
            return true
        }
    }
    return false
}

export default {
    checkTx,
    addTxhash,
    getTxList,
    isExists
}